"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";

export default function AdminPage() {
  const router = useRouter();
  const [auth, setAuth] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<{
    filename: string;
    content: unknown;
    raw: string;
  } | null>(null);
  const [analytics, setAnalytics] = useState<{
    raw: string;
    parsed: {
      events: unknown[];
      identities: unknown[];
      summary: Record<string, number>;
      timeBuckets?: { hour: string; count: number }[];
      eventTypeData?: { name: string; value: number; fill: string }[];
    };
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/auth")
      .then((res) => {
        if (res.ok) return setAuth("authenticated");
        setAuth("unauthenticated");
      })
      .catch(() => setAuth("unauthenticated"));
  }, []);

  useEffect(() => {
    if (auth !== "authenticated") return;
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setFiles(data.files ?? []))
      .catch(() => setFiles([]));
  }, [auth]);

  useEffect(() => {
    if (auth !== "authenticated" || !selectedFile) return;
    fetch(`/api/admin/users?file=${encodeURIComponent(selectedFile)}`)
      .then((res) => res.json())
      .then(setFileContent)
      .catch(() => setFileContent(null));
  }, [auth, selectedFile]);

  useEffect(() => {
    if (auth !== "authenticated") return;
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then(setAnalytics)
      .catch(() => setAnalytics(null));
  }, [auth]);

  function refreshAnalytics() {
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then(setAnalytics)
      .catch(() => setAnalytics(null));
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setAuth("authenticated");
      router.refresh();
    } else {
      setLoginError(data.error ?? "Login failed");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuth("unauthenticated");
    setSelectedFile(null);
    setFileContent(null);
    router.refresh();
  }

  if (auth === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0b]">
        <div className="text-zinc-500">Loading…</div>
      </div>
    );
  }

  if (auth === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#0a0a0b]">
        <header className="border-b border-white/10 bg-[#0a0a0b]/80 px-6 py-4">
          <Link href="/" className="text-lg font-semibold text-white">
            velocity
          </Link>
        </header>
        <main className="mx-auto max-w-md px-6 py-20">
          <h1 className="mb-8 text-2xl font-bold text-white">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm text-zinc-400">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white"
                required
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-400">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full rounded-full bg-cyan-500 py-3 font-semibold text-black hover:bg-cyan-400"
            >
              Log in
            </button>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <header className="border-b border-white/10 bg-[#0a0a0b]/80 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-white">
            velocity
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-zinc-500 hover:text-zinc-300"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="mb-8 text-2xl font-bold text-white">Admin Dashboard</h1>

        {analytics && (
          <AnalyticsDashboard analytics={analytics} onRefresh={refreshAnalytics} />
        )}

        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-zinc-300">
            User Listing
          </h2>
          <p className="mb-4 text-sm text-zinc-500">
            Files in public/user-data/
          </p>

          {files.length === 0 ? (
            <p className="rounded-lg border border-white/10 bg-white/5 p-6 text-sm text-zinc-500">
              No user files found.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {files.map((file) => (
                <button
                  key={file}
                  onClick={() => setSelectedFile(file)}
                  className={`rounded-lg border p-4 text-left text-sm transition-colors ${
                    selectedFile === file
                      ? "border-cyan-500/50 bg-cyan-500/10 text-white"
                      : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20"
                  }`}
                >
                  {file}
                </button>
              ))}
            </div>
          )}
        </section>

        {selectedFile && fileContent && (
          <section>
            <h2 className="mb-4 text-lg font-semibold text-zinc-300">
              Viewing: {fileContent.filename}
            </h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-white/10 bg-white/5 p-6">
                <h3 className="mb-2 text-sm font-medium text-zinc-400">
                  Parsed content
                </h3>
                <pre className="overflow-x-auto text-sm text-zinc-300">
                  {JSON.stringify(fileContent.content, null, 2)}
                </pre>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-6">
                <h3 className="mb-2 text-sm font-medium text-zinc-400">
                  Raw content
                </h3>
                <pre className="overflow-x-auto whitespace-pre-wrap break-words text-sm text-zinc-300">
                  {fileContent.raw}
                </pre>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
