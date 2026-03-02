import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { promises as fs } from "fs";
import path from "path";

const USER_DATA_DIR = path.join(process.cwd(), "public", "user-data");

async function requireAdmin() {
  const cookieStore = await cookies();
  const admin = cookieStore.get("admin")?.value;
  if (admin !== "1") {
    throw new Error("Unauthorized");
  }
}

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file");

  if (file) {
    // Get content of a specific file
    const safeName = file.replace(/[^a-zA-Z0-9_.-]/g, "_");
    if (!safeName) {
      return NextResponse.json({ error: "Invalid file" }, { status: 400 });
    }
    const filePath = path.join(USER_DATA_DIR, safeName);

    if (!filePath.startsWith(USER_DATA_DIR)) {
      return NextResponse.json({ error: "Invalid file" }, { status: 400 });
    }

    try {
      const content = await fs.readFile(filePath, "utf-8");
      const parsed = JSON.parse(content);
      return NextResponse.json({
        filename: safeName,
        content: parsed,
        raw: content,
      });
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
  }

  // List all files in user-data directory
  try {
    await fs.mkdir(USER_DATA_DIR, { recursive: true });
    const files = await fs.readdir(USER_DATA_DIR);
    const dataFiles = files.filter(
      (f) => f.endsWith(".json") || f.endsWith(".txt")
    );
    return NextResponse.json({ files: dataFiles });
  } catch {
    return NextResponse.json({ files: [] });
  }
}
