import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getProfile } from "@/lib/profiles";

export async function GET() {
  const cookieStore = await cookies();
  const userIdStr = cookieStore.get("user")?.value ?? null;
  const userId = userIdStr ? parseInt(userIdStr, 10) : NaN;
  const validId = !isNaN(userId);

  return !validId
    ? NextResponse.json({ user: null }, { status: 401 })
    : (async () => {
        const profile = await getProfile(userId);
        return profile
          ? NextResponse.json({ user: profile.username })
          : NextResponse.json({ user: null }, { status: 401 });
      })();
}
