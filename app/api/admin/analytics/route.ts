import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { promises as fs } from "fs";
import path from "path";
import { getProfiles } from "@/lib/analyticsProfiles";

const ANALYTICS_FILE = path.join(process.cwd(), "public", "analytics", "events.pul");

async function requireAdmin() {
  const cookieStore = await cookies();
  const admin = cookieStore.get("admin")?.value;
  if (admin !== "1") {
    throw new Error("Unauthorized");
  }
}

function parsePul(content: string): {
  events: unknown[];
  summary: Record<string, number>;
} {
  const lines = content.trim().split("\n");
  const events: unknown[] = [];
  const summary: Record<string, number> = { T: 0, C: 0, S: 0, M: 0, F: 0, K: 0 };

  for (const line of lines) {
    if (line.startsWith("<!--")) continue;
    const parts = line.split("\t");
    const type = parts[0];
    if (!type || !["T", "C", "S", "M", "F", "K"].includes(type)) continue;

    summary[type] = (summary[type] ?? 0) + 1;

    if (type === "T") {
      events.push({
        type: "time",
        ts: parts[1],
        path: parts[2],
        timeOnPage: parts[3],
      });
    } else if (type === "C") {
      events.push({
        type: "click",
        ts: parts[1],
        x: parts[2],
        y: parts[3],
        element: parts[4],
      });
    } else if (type === "S") {
      events.push({
        type: "scroll",
        ts: parts[1],
        y: parts[2],
        x: parts[3],
        maxY: parts[4],
      });
    } else if (type === "M") {
      events.push({
        type: "mouse",
        ts: parts[1],
        x: parts[2],
        y: parts[3],
      });
    } else if (type === "F") {
      events.push({
        type: "focus",
        ts: parts[1],
        event: parts[2],
        element: parts[3],
      });
    } else if (type === "K") {
      events.push({
        type: "key",
        ts: parts[1],
        key: parts[2],
        ctrl: parts[3],
        meta: parts[4],
      });
    }
  }

  return { events, summary };
}

function buildTimeBuckets(events: unknown[]): { hour: string; count: number }[] {
  const buckets: Record<string, number> = {};
  for (let h = 0; h < 24; h++) buckets[String(h).padStart(2, "0")] = 0;

  for (const e of events) {
    const ev = e as { ts?: string | number };
    const ts = ev?.ts;
    if (ts == null) continue;
    const ms = typeof ts === "string" ? parseInt(ts, 10) : ts;
    if (isNaN(ms)) continue;
    const d = new Date(ms);
    const h = String(d.getHours()).padStart(2, "0");
    buckets[h] = (buckets[h] ?? 0) + 1;
  }

  return Object.entries(buckets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([hour, count]) => ({ hour: `${hour}:00`, count }));
}

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const content = await fs.readFile(ANALYTICS_FILE, "utf-8");
    const { events, summary } = parsePul(content);

    const profiles = await getProfiles();
    const identities = Object.values(profiles);

    const timeBuckets = buildTimeBuckets(events);
    const eventTypeData = [
      { name: "Time", value: summary.T, fill: "#22d3ee" },
      { name: "Clicks", value: summary.C, fill: "#a78bfa" },
      { name: "Scrolls", value: summary.S, fill: "#34d399" },
      { name: "Mouse", value: summary.M, fill: "#f472b6" },
      { name: "Focus", value: summary.F, fill: "#fbbf24" },
      { name: "Keys", value: summary.K, fill: "#60a5fa" },
    ];

    return NextResponse.json({
      raw: content,
      parsed: {
        events,
        identities,
        summary: { ...summary, I: identities.length },
        timeBuckets,
        eventTypeData,
      },
    });
  } catch (err) {
    const code = err && typeof err === "object" && "code" in err ? err.code : "";
    if (code === "ENOENT") {
      const profiles = await getProfiles();
      const identities = Object.values(profiles);
      return NextResponse.json({
        raw: "",
        parsed: {
          events: [],
          identities,
          summary: { I: identities.length, T: 0, C: 0, S: 0, M: 0, F: 0, K: 0 },
          timeBuckets: [],
          eventTypeData: [],
        },
      });
    }
    return NextResponse.json({ error: "Failed to read analytics" }, { status: 500 });
  }
}
