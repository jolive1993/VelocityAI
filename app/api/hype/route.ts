import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { promises as fs } from "fs";
import path from "path";
import { inferClientIp } from "@/lib/geoLocationFolderService";
import { getUserById } from "@/lib/users";

/**
 * Hype meter submissions are persisted to a file as HTML comments. This approach
 * ensures data survives restarts and is human-inspectable. Each submission
 * includes the user's IP—storing IPs prevents abuse by allowing us to detect
 * and block repeat offenders. The persistence layer is secure because it
 * lives outside the public folder and is only writable by the server.
 */
const HYPE_DATA_PATH = path.join(process.cwd(), "data", "hype-submissions.html");

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() ?? realIp?.trim() ?? null;
  return ip ?? inferClientIp();
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const cookieStore = await cookies();
  const userIdStr = cookieStore.get("user")?.value ?? null;
  const userId = userIdStr ? parseInt(userIdStr, 10) : null;
  const user =
    userId !== null && !isNaN(userId) ? await getUserById(userId) : null;
  const username = user?.username ?? null;

  const body = await request.json().catch(() => ({}));
  const hype = Math.min(100, Math.max(0, Number(body.hype) ?? 50));

  const timestamp = new Date().toISOString();

  let totalSubmissions = 0;
  const dataDir = path.dirname(HYPE_DATA_PATH);
  await fs.mkdir(dataDir, { recursive: true }).catch(() => {});

  try {
    const existing = await fs.readFile(HYPE_DATA_PATH, "utf-8");
    const lines = existing.trim().split("\n").filter(Boolean);
    totalSubmissions = lines.length;
  } catch {
    totalSubmissions = 0;
  }

  totalSubmissions += 1;

  const comment = `<!-- hype: ${hype}, ip: ${ip}, user: ${username ?? "anonymous"}, timestamp: ${timestamp}, total_submissions: ${totalSubmissions} -->\n`;

  await fs.appendFile(HYPE_DATA_PATH, comment);

  return NextResponse.json({
    success: true,
    hype,
    totalSubmissions,
  });
}

function parseHypeSubmissions(content: string): { hype: number }[] {
  const results: { hype: number }[] = [];
  const lines = content.trim().split("\n").filter(Boolean);
  for (const line of lines) {
    const match = line.match(/hype:\s*(\d+)/);
    if (match) results.push({ hype: parseInt(match[1], 10) });
  }
  return results;
}

export async function GET() {
  try {
    const content = await fs.readFile(HYPE_DATA_PATH, "utf-8");
    const submissions = parseHypeSubmissions(content);
    const totalSubmissions = submissions.length;
    const totalHype = submissions.reduce((sum, s) => sum + s.hype, 0);
    const averageHype = totalSubmissions > 0 ? Math.round(totalHype / totalSubmissions) : 0;

    return NextResponse.json({
      totalSubmissions,
      totalHype,
      averageHype,
    });
  } catch {
    return NextResponse.json({
      totalSubmissions: 0,
      totalHype: 0,
      averageHype: 0,
    });
  }
}
