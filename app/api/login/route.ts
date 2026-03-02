import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findUserByCredentials } from "@/lib/profiles";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const username = body.username;
  const password = body.password;

  const hasCredentials = username && password;

  return !hasCredentials
    ? NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      )
    : (async () => {
        const user = await findUserByCredentials(username, password);
        return user
          ? (async () => {
              const cookieStore = await cookies();
              cookieStore.set("user", String(user.id), {
                httpOnly: true,
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
                sameSite: "lax",
              });
              return NextResponse.json({ success: true });
            })()
          : NextResponse.json(
              { error: "Invalid username or password" },
              { status: 401 }
            );
      })();
}
