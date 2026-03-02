"use client";

import Link from "next/link";

export default function VervoAd() {
  return (
    <section className="relative mb-24 overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/15 via-transparent to-teal-500/15 p-12 sm:p-16">
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
          New: AI Assistant
        </div>
        <h2
          className="mb-3 text-3xl font-bold text-white sm:text-4xl"
          style={{ fontFamily: "var(--font-syne), sans-serif" }}
        >
          Meet <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Vervo</span>
        </h2>
        <p className="mb-8 max-w-xl text-zinc-400">
          Velocity&apos;s AI assistant. Ask anything about our platform, performance, or the future of the web. Powered by advanced reasoning and stochastic latent projection.
        </p>
        <Link
          href="/vervo"
          className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-8 py-4 font-semibold text-black transition-all hover:bg-cyan-400"
        >
          Chat with Vervo
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
