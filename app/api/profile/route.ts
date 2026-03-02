import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getProfile, saveProfile, type UserProfile } from "@/lib/profiles";

async function getAuthenticatedUserId(): Promise<number | null> {
  const cookieStore = await cookies();
  const userIdStr = cookieStore.get("user")?.value ?? null;
  const userId = userIdStr ? parseInt(userIdStr, 10) : NaN;
  return isNaN(userId) ? null : userId;
}

const PROFILE_DEFAULTS: UserProfile = {
  username: "",
  password: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  paymentMethod: "",
  birthday: "",
  dreamsAndDesires: "",
  fears: "",
  occupation: "",
  lifeMotto: "",
  bloodType: "",
  sexualOrientation: "",
  preferredPronouns: "",
  maritalStatus: "",
  nationality: "",
  starSign: "",
  allergies: "",
};

export async function GET() {
  const userId = await getAuthenticatedUserId();
  const profile = userId !== null ? await getProfile(userId) : null;

  return userId === null
    ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    : !profile
      ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      : NextResponse.json(
          (() => {
            const { password: _, ...safe } = profile;
            return { ...PROFILE_DEFAULTS, ...safe };
          })()
        );
}

export async function PUT(request: Request) {
  const userId = await getAuthenticatedUserId();
  const profile = userId !== null ? await getProfile(userId) : null;

  return userId === null
    ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    : !profile
      ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      : (async () => {
          const body = await request.json().catch(() => ({}));
          const updated: UserProfile = {
            ...profile,
            name: String(body.name ?? profile.name ?? ""),
            email: String(body.email ?? profile.email ?? ""),
            phone: String(body.phone ?? profile.phone ?? ""),
            address: String(body.address ?? profile.address ?? ""),
            paymentMethod: String(body.paymentMethod ?? profile.paymentMethod ?? ""),
            birthday: String(body.birthday ?? profile.birthday ?? ""),
            dreamsAndDesires: String(body.dreamsAndDesires ?? profile.dreamsAndDesires ?? ""),
            fears: String(body.fears ?? profile.fears ?? ""),
            occupation: String(body.occupation ?? profile.occupation ?? ""),
            lifeMotto: String(body.lifeMotto ?? profile.lifeMotto ?? ""),
            bloodType: String(body.bloodType ?? profile.bloodType ?? ""),
            sexualOrientation: String(body.sexualOrientation ?? profile.sexualOrientation ?? ""),
            preferredPronouns: String(body.preferredPronouns ?? profile.preferredPronouns ?? ""),
            maritalStatus: String(body.maritalStatus ?? profile.maritalStatus ?? ""),
            nationality: String(body.nationality ?? profile.nationality ?? ""),
            starSign: String(body.starSign ?? profile.starSign ?? ""),
            allergies: String(body.allergies ?? profile.allergies ?? ""),
          };
          await saveProfile(userId, updated);
          return NextResponse.json({ success: true });
        })();
}
