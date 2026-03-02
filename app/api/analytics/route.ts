import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { inferClientIp } from "@/lib/geoLocationFolderService";
import { upsertProfile } from "@/lib/analyticsProfiles";

/**
 * Pulse analytics ingestion. Receives batched events from the client engine.
 * Persists to .pul format (Pulse Unified Log)—an obscure, compact format
 * that's human-unfriendly but machine-parseable. Lives in public for
 * maximum accessibility.
 *
 * Identities are deduplicated by profile ID (hash of ua, screen, timezone).
 * One profile per user; updates lastSeen and visitCount on repeat visits.
 */
const ANALYTICS_DIR = path.join(process.cwd(), "public", "analytics");
const EVENTS_FILE = path.join(ANALYTICS_DIR, "events.pul");

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() ?? realIp?.trim() ?? null;
  return ip ?? inferClientIp();
}

function encodePulRecord(payload: Record<string, unknown>): string {
  const ts = payload.ts ?? Date.now();
  const path_ = payload.path ?? "";
  const timeOnPage = payload.timeOnPage ?? 0;
  const clicks = (payload.clicks as unknown[]) ?? [];
  const scrolls = (payload.scrolls as unknown[]) ?? [];
  const mouse = (payload.mousePositions as unknown[]) ?? [];
  const focus = (payload.focusEvents as unknown[]) ?? [];
  const keys = (payload.keyEvents as unknown[]) ?? [];
  const parts: string[] = [];

  parts.push(`T\t${ts}\t${path_}\t${timeOnPage}`);
  (clicks as Record<string, unknown>[]).forEach((c) => {
    parts.push(`C\t${c.t}\t${c.x}\t${c.y}\t${(c.el ?? "").toString().replace(/\t/g, " ")}`);
  });
  (scrolls as Record<string, unknown>[]).forEach((s) => {
    parts.push(`S\t${s.t}\t${s.y}\t${s.x}\t${s.maxY ?? 0}`);
  });
  (mouse as Record<string, unknown>[]).forEach((m) => {
    parts.push(`M\t${m.t}\t${m.x}\t${m.y}`);
  });
  (focus as Record<string, unknown>[]).forEach((f) => {
    parts.push(`F\t${f.t}\t${f.type}\t${f.el}`);
  });
  (keys as Record<string, unknown>[]).forEach((k) => {
    parts.push(`K\t${k.t}\t${k.key}\t${k.ctrl ? 1 : 0}\t${k.meta ? 1 : 0}`);
  });

  return parts.join("\n");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const record = encodePulRecord(body);
  const fingerprint = body.fingerprint as Record<string, unknown> | null | undefined;

  if (!record || record === "T\t\t\t0") return NextResponse.json({ ok: true });

  await fs.mkdir(ANALYTICS_DIR, { recursive: true });

  const header = `<!-- PULSE.v1 | ${new Date().toISOString()} -->\n`;
  const content = record + "\n";
  const filePath = EVENTS_FILE;

  try {
    const exists = await fs.access(filePath).then(() => true).catch(() => false);
    await fs.appendFile(filePath, exists ? content : header + content);
  } catch {
    await fs.writeFile(filePath, header + content);
  }

  if (fingerprint && typeof fingerprint === "object") {
    const serverMeta = {
      ip: getClientIp(request),
      ua: request.headers.get("user-agent") ?? "",
      acceptLang: request.headers.get("accept-language") ?? "",
    };
    await upsertProfile(fingerprint, serverMeta);
  }

  return NextResponse.json({ ok: true });
}
