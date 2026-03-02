"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<string | null | "loading">("loading");

  useEffect(() => {
    fetch("/api/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, [pathname]);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0a0b]/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-white hover:text-zinc-300"
          style={{ fontFamily: "var(--font-syne), sans-serif" }}
        >
          velocity
        </Link>
        <div className="relative flex items-center gap-6 text-sm text-zinc-500">
          <a
            href="/#features"
            className="transition-colors hover:text-zinc-300"
          >
            Features
          </a>
          <a
            href="/#stats"
            className="transition-colors hover:text-zinc-300"
          >
            Performance
          </a>
          <Link
            href="/deep-dive"
            className="transition-colors hover:text-zinc-300"
          >
            Deep dive
          </Link>
          <Link
            href="/vervo"
            className="transition-colors hover:text-zinc-300"
          >
            Vervo AI
          </Link>
          <Link
            href="/register"
            className="transition-colors hover:text-zinc-300"
          >
            Register
          </Link>
          {user === "loading" ? null : user ? (
            <>
              <Link
                href="/account"
                className="transition-colors hover:text-zinc-300"
              >
                My Account
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="transition-colors hover:text-zinc-300"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="transition-colors hover:text-zinc-300"
            >
              Log in
            </Link>
          )}
          <Link
            href="/admin"
            className="admin-only absolute left-full ml-4 transition-colors hover:text-zinc-300"
          >
            Admin
          </Link>
        </div>
      </nav>
    </header>
  );
}
