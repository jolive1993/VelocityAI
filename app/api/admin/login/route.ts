import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// TODO: Change these credentials before production
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const cookieStore = await cookies();
      cookieStore.set("admin", "1", {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
        sameSite: "lax",
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
