import { NextResponse } from "next/server";
import { createUser } from "@/lib/profiles";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const username = body.username;
  const password = body.password;

  const validUsername =
    username && typeof username === "string" && username.trim().length >= 2;
  const validPassword = password && typeof password === "string";

  return !validUsername
    ? NextResponse.json({ error: "Username is required" }, { status: 400 })
    : !validPassword
      ? NextResponse.json({ error: "Password is required" }, { status: 400 })
      : (async () => {
          const result = await createUser(username.trim(), password);
          return result.success
            ? NextResponse.json({ success: true })
            : NextResponse.json(
                { error: result.error ?? "Registration failed" },
                { status: 409 }
              );
        })();
}
