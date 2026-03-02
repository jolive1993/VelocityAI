/**
 * Pulse Analytics Inference Engine
 * Derives assumed profiles from fingerprints and event data.
 * Drives value, sales, and quarterly earnings through actionable insights.
 */

export interface InferredProfile {
  id: string;
  confidence: number;
  deviceType: string;
  region: string;
  engagementLevel: string;
  intent: string;
  assumedPersona: string;
  valueScore: number;
  insights: string[];
  raw: Record<string, unknown>;
}

function inferDevice(ua: string, screenW?: number): { type: string; confidence: number } {
  const w = screenW ?? 1920;
  if (/mobile|android|iphone|ipod|blackberry|opera mini/i.test(ua)) {
    return { type: "Mobile", confidence: 0.92 };
  }
  if (/ipad|tablet|playbook|silk/i.test(ua) || (w >= 768 && w < 1280)) {
    return { type: "Tablet", confidence: 0.85 };
  }
  return { type: "Desktop", confidence: 0.88 };
}

function inferRegion(timezone: string, tzOffset?: number): { region: string; confidence: number } {
  const tz = (timezone || "").toLowerCase();
  const offset = tzOffset ?? 0;
  if (tz.includes("america") || tz.includes("new_york") || tz.includes("los_angeles")) {
    return { region: "Americas", confidence: 0.9 };
  }
  if (tz.includes("europe") || tz.includes("london") || tz.includes("paris")) {
    return { region: "Europe", confidence: 0.9 };
  }
  if (tz.includes("asia") || tz.includes("tokyo") || tz.includes("singapore")) {
    return { region: "Asia-Pacific", confidence: 0.88 };
  }
  if (offset >= -12 && offset <= -5) return { region: "Americas", confidence: 0.7 };
  if (offset >= -1 && offset <= 2) return { region: "Europe", confidence: 0.7 };
  if (offset >= 7 && offset <= 9) return { region: "Asia-Pacific", confidence: 0.7 };
  return { region: "Unknown", confidence: 0.3 };
}

function inferEngagement(identities: unknown[], events: unknown[]): { level: string; score: number } {
  const ids = identities as Record<string, unknown>[];
  const evs = events as Record<string, unknown>[];
  const clicks = evs.filter((e) => e.type === "click").length;
  const scrolls = evs.filter((e) => e.type === "scroll").length;
  const timeEvents = evs.filter((e) => e.type === "time");
  const maxTime = Math.max(...timeEvents.map((e) => Number(e.timeOnPage) || 0), 0);
  const hasIdentity = ids.some(
    (i) => i.pulseIdentityPlus || (Array.isArray(i.pulseIdentityFormats) && i.pulseIdentityFormats.length > 0)
  );

  let score = 0;
  if (clicks > 10) score += 25;
  else if (clicks > 3) score += 15;
  if (scrolls > 5) score += 20;
  else if (scrolls > 1) score += 10;
  if (maxTime > 60000) score += 30;
  else if (maxTime > 15000) score += 20;
  if (hasIdentity) score += 25;

  if (score >= 70) return { level: "High Intent", score };
  if (score >= 40) return { level: "Engaged", score };
  if (score >= 20) return { level: "Browsing", score };
  return { level: "Casual", score };
}

function inferIntent(engagement: string, hasIdentity: boolean): string {
  if (engagement === "High Intent" && hasIdentity) return "Ready to convert";
  if (engagement === "High Intent") return "Researching / comparing";
  if (engagement === "Engaged") return "Exploring options";
  if (engagement === "Browsing") return "Discovery";
  return "Window shopping";
}

function inferPersona(device: string, region: string, engagement: string): string {
  if (device === "Mobile" && engagement === "High Intent") return "Mobile-first buyer";
  if (device === "Desktop" && engagement === "High Intent") return "Power user / decision maker";
  if (region === "Americas" && engagement !== "Casual") return "North American prospect";
  if (region === "Europe") return "EU market visitor";
  if (engagement === "Casual") return "Awareness-stage visitor";
  return "Qualified lead";
}

export function runInferenceEngine(
  identities: unknown[],
  events: unknown[]
): InferredProfile[] {
  const profiles: InferredProfile[] = [];
  const ids = identities as Record<string, unknown>[];

  if (ids.length === 0) {
    const eng = inferEngagement([], events);
    profiles.push({
      id: "aggregate",
      confidence: 0.5,
      deviceType: "Unknown",
      region: "Unknown",
      engagementLevel: eng.level,
      intent: inferIntent(eng.level, false),
      assumedPersona: "Anonymous visitor",
      valueScore: eng.score,
      insights: ["No fingerprint data yet. Enable Pulse Identity for richer profiles."],
      raw: {},
    });
    return profiles;
  }

  ids.forEach((id, i) => {
    const ua = (id.ua as string) || (id._server as Record<string, string>)?.ua || "";
    const tz = (id.timezone as string) || "";
    const tzOffset = id.timezoneOffset as number | undefined;
    const screenW = id.screenW as number | undefined;

    const device = inferDevice(ua, screenW);
    const region = inferRegion(tz, tzOffset);
    const eng = inferEngagement(ids, events);
    const hasIdentity = !!(id.pulseIdentityPlus || (id.pulseIdentityFormats as unknown[])?.length);

    const persona = inferPersona(device.type, region.region, eng.level);
    const intent = inferIntent(eng.level, hasIdentity);

    const insights: string[] = [];
    if (id.pulseIdentityPlus) insights.push("JWT identity detected — known user");
    const formats = id.pulseIdentityFormats;
    if (Array.isArray(formats) && formats.length > 0)
      insights.push(`${formats.length} auth provider fingerprints`);
    if (device.type === "Mobile") insights.push("Mobile traffic — optimize for conversion");
    if (region.region !== "Unknown") insights.push(`Likely ${region.region} — consider localization`);
    if (eng.level === "High Intent") insights.push("High engagement — prioritize for sales outreach");

    const confidence =
      (device.confidence * 0.3 + region.confidence * 0.3 + 0.4) * (hasIdentity ? 1.1 : 1);

    profiles.push({
      id: `fp-${i}`,
      confidence: Math.min(0.98, confidence),
      deviceType: device.type,
      region: region.region,
      engagementLevel: eng.level,
      intent,
      assumedPersona: persona,
      valueScore: eng.score,
      insights,
      raw: id,
    });
  });

  return profiles;
}
