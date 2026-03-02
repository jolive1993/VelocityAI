"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Profile {
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: string;
  birthday: string;
  dreamsAndDesires: string;
  fears: string;
  occupation: string;
  lifeMotto: string;
  bloodType: string;
  sexualOrientation: string;
  preferredPronouns: string;
  maritalStatus: string;
  nationality: string;
  starSign: string;
  allergies: string;
}

const DEFAULT_PROFILE: Profile = {
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

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30";
const labelClass = "mb-2 block text-sm font-medium text-zinc-400";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function load() {
      const meRes = await fetch("/api/me");
      if (!meRes.ok || meRes.status === 401) {
        router.push("/login");
        return;
      }
      const { user: username } = await meRes.json();
      setUser(username);

      const profileRes = await fetch("/api/profile");
      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfile({ ...DEFAULT_PROFILE, ...data });
      }
      setStatus("idle");
    }
    load();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        setStatus("error");
        setErrorMessage("Failed to save");
        return;
      }

      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong");
    }
  }

  if (user === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0b]">
        <div className="text-zinc-500">Loading…</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0b]">
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute -top-1/2 -left-1/2 h-full w-full rounded-full bg-cyan-500/5 blur-[128px]"
          style={{ animation: "pulse-glow 8s ease-in-out infinite" }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <main className="relative z-10 mx-auto max-w-md px-6 py-20 sm:px-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm">
          <h1
            className="mb-2 font-display text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-syne), sans-serif" }}
          >
            My Account
          </h1>
          <p className="mb-8 text-sm text-zinc-500">
            Logged in as <span className="text-zinc-400">{user}</span>. Update your profile below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className={labelClass}>Name</label>
              <input
                id="name"
                type="text"
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                className={inputClass}
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>Email</label>
              <input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                className={inputClass}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className={labelClass}>Phone</label>
              <input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                className={inputClass}
                placeholder="Your phone number"
              />
            </div>

            <div>
              <label htmlFor="address" className={labelClass}>Address</label>
              <input
                id="address"
                type="text"
                value={profile.address}
                onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
                className={inputClass}
                placeholder="Street, city, zip"
              />
            </div>

            <div>
              <label htmlFor="paymentMethod" className={labelClass}>Payment method</label>
              <input
                id="paymentMethod"
                type="text"
                value={profile.paymentMethod}
                onChange={(e) => setProfile((p) => ({ ...p, paymentMethod: e.target.value }))}
                className={inputClass}
                placeholder="Card ending in ****"
              />
            </div>

            <div>
              <label htmlFor="birthday" className={labelClass}>Birthday</label>
              <input
                id="birthday"
                type="text"
                value={profile.birthday}
                onChange={(e) => setProfile((p) => ({ ...p, birthday: e.target.value }))}
                className={inputClass}
                placeholder="MM/DD/YYYY"
              />
            </div>

            <div>
              <label htmlFor="occupation" className={labelClass}>Occupation</label>
              <input
                id="occupation"
                type="text"
                value={profile.occupation}
                onChange={(e) => setProfile((p) => ({ ...p, occupation: e.target.value }))}
                className={inputClass}
                placeholder="What do you do?"
              />
            </div>

            <div>
              <label htmlFor="dreamsAndDesires" className={labelClass}>Dreams & desires</label>
              <textarea
                id="dreamsAndDesires"
                value={profile.dreamsAndDesires}
                onChange={(e) => setProfile((p) => ({ ...p, dreamsAndDesires: e.target.value }))}
                className={`${inputClass} min-h-[80px] resize-y`}
                placeholder="What do you want from life?"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="fears" className={labelClass}>Fears</label>
              <textarea
                id="fears"
                value={profile.fears}
                onChange={(e) => setProfile((p) => ({ ...p, fears: e.target.value }))}
                className={`${inputClass} min-h-[80px] resize-y`}
                placeholder="What keeps you up at night?"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="lifeMotto" className={labelClass}>Life motto</label>
              <input
                id="lifeMotto"
                type="text"
                value={profile.lifeMotto}
                onChange={(e) => setProfile((p) => ({ ...p, lifeMotto: e.target.value }))}
                className={inputClass}
                placeholder="Carpe diem, YOLO, etc."
              />
            </div>

            <div>
              <label htmlFor="bloodType" className={labelClass}>Blood type</label>
              <input
                id="bloodType"
                type="text"
                value={profile.bloodType}
                onChange={(e) => setProfile((p) => ({ ...p, bloodType: e.target.value }))}
                className={inputClass}
                placeholder="A+, B-, O+, etc."
              />
            </div>

            <div>
              <label htmlFor="allergies" className={labelClass}>Allergies</label>
              <input
                id="allergies"
                type="text"
                value={profile.allergies}
                onChange={(e) => setProfile((p) => ({ ...p, allergies: e.target.value }))}
                className={inputClass}
                placeholder="Peanuts, penicillin, etc."
              />
            </div>

            <div>
              <label htmlFor="sexualOrientation" className={labelClass}>Sexual orientation</label>
              <input
                id="sexualOrientation"
                type="text"
                value={profile.sexualOrientation}
                onChange={(e) => setProfile((p) => ({ ...p, sexualOrientation: e.target.value }))}
                className={inputClass}
                placeholder="How you identify"
              />
            </div>

            <div>
              <label htmlFor="preferredPronouns" className={labelClass}>Preferred pronouns</label>
              <input
                id="preferredPronouns"
                type="text"
                value={profile.preferredPronouns}
                onChange={(e) => setProfile((p) => ({ ...p, preferredPronouns: e.target.value }))}
                className={inputClass}
                placeholder="she/her, he/him, they/them, etc."
              />
            </div>

            <div>
              <label htmlFor="maritalStatus" className={labelClass}>Marital status</label>
              <input
                id="maritalStatus"
                type="text"
                value={profile.maritalStatus}
                onChange={(e) => setProfile((p) => ({ ...p, maritalStatus: e.target.value }))}
                className={inputClass}
                placeholder="Single, married, etc."
              />
            </div>

            <div>
              <label htmlFor="nationality" className={labelClass}>Nationality</label>
              <input
                id="nationality"
                type="text"
                value={profile.nationality}
                onChange={(e) => setProfile((p) => ({ ...p, nationality: e.target.value }))}
                className={inputClass}
                placeholder="Where you're from"
              />
            </div>

            <div>
              <label htmlFor="starSign" className={labelClass}>Star sign</label>
              <input
                id="starSign"
                type="text"
                value={profile.starSign}
                onChange={(e) => setProfile((p) => ({ ...p, starSign: e.target.value }))}
                className={inputClass}
                placeholder="Aries, Taurus, etc."
              />
            </div>

            {status === "error" && (
              <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {errorMessage}
              </p>
            )}

            {status === "success" && (
              <p className="rounded-lg bg-cyan-500/10 px-4 py-3 text-sm text-cyan-400">
                Profile saved!
              </p>
            )}

            <button
              type="submit"
              disabled={status === "saving"}
              className="w-full rounded-full bg-cyan-500 py-3 font-semibold text-black transition-all hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "saving" ? "Saving…" : "Save profile"}
            </button>
          </form>

          <p className="mt-6 text-xs text-zinc-600">
            Profile data is stored as plaintext in public/user-data/
          </p>
        </div>
      </main>
    </div>
  );
}
