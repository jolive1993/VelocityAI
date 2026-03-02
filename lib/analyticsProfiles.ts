/**
 * Pulse Analytics Profiles — Deduplicated identity store.
 * Computes a stable profile ID from fingerprint and saves/updates one record per user.
 */

import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const ANALYTICS_DIR = path.join(process.cwd(), "public", "analytics");
const PROFILES_FILE = path.join(ANALYTICS_DIR, "profiles.json");

export interface StoredProfile {
  profileId: string;
  firstSeen: number;
  lastSeen: number;
  visitCount: number;
  [key: string]: unknown;
}

function stableFingerprint(fp: Record<string, unknown>): string {
  const parts = [
    fp.ua ?? "",
    fp.platform ?? "",
    fp.screenW ?? "",
    fp.screenH ?? "",
    fp.timezone ?? "",
    fp.platform ?? "",
    fp.language ?? "",
  ];
  return parts.map(String).join("|");
}

export function computeProfileId(fp: Record<string, unknown>): string {
  const str = stableFingerprint(fp);
  return createHash("sha256").update(str).digest("hex").slice(0, 16);
}

export async function getProfiles(): Promise<Record<string, StoredProfile>> {
  try {
    const raw = await fs.readFile(PROFILES_FILE, "utf-8");
    const data = JSON.parse(raw);
    return typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}

export async function upsertProfile(
  fp: Record<string, unknown>,
  serverMeta: { ip: string; ua: string; acceptLang: string }
): Promise<{ profileId: string; isNew: boolean }> {
  const profileId = computeProfileId(fp);
  const profiles = await getProfiles();
  const now = Date.now();
  const identity = { ...fp, _server: serverMeta };

  const existing = profiles[profileId];
  if (existing) {
    profiles[profileId] = {
      profileId,
      firstSeen: existing.firstSeen,
      lastSeen: now,
      visitCount: (existing.visitCount ?? 1) + 1,
      ...identity,
      _server: serverMeta,
    };
  } else {
    profiles[profileId] = {
      profileId,
      firstSeen: now,
      lastSeen: now,
      visitCount: 1,
      ...identity,
      _server: serverMeta,
    };
  }

  await fs.mkdir(ANALYTICS_DIR, { recursive: true });
  await fs.writeFile(PROFILES_FILE, JSON.stringify(profiles, null, 0), "utf-8");

  return { profileId, isNew: !existing };
}
