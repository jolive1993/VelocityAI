"use client";

import { useEffect, useState } from "react";

interface CTAData {
  line1: string;
  line2: string;
  line3: string;
}

/**
 * Lazy-loads CTA content from the API. The CTA sits below the fold, so we
 * don't block initial render—hero, stats, and features paint first while this
 * content bakes. Speeds up FCP and LCP by deferring non-critical content.
 */
export default function CTA() {
  const [data, setData] = useState<CTAData | null>(null);

  useEffect(() => {
    fetch("/api/cta")
      .then((res) => res.json())
      .then(setData)
      .catch(() =>
        setData({
          line1: "Ready to experience the difference?",
          line2:
            "This is what happens when speed, modernity, and craft come together. No shortcuts. No compromises.",
          line3: "Get started",
        })
      );
  }, []);

  if (data === null) {
    return (
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-transparent to-teal-500/10 p-12 sm:p-16">
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-4 h-10 w-3/4 max-w-md animate-pulse rounded bg-white/10" />
          <div className="mb-8 h-6 w-full max-w-lg animate-pulse rounded bg-white/5" />
          <div className="h-12 w-32 animate-pulse rounded-full bg-white/10" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-transparent to-teal-500/10 p-12 sm:p-16">
      <div className="relative z-10 text-center">
        <h2
          className="mb-4 font-display text-3xl font-bold text-white sm:text-4xl"
          style={{ fontFamily: "var(--font-syne), sans-serif" }}
        >
          {data.line1}
        </h2>
        <p className="mx-auto mb-8 max-w-lg text-zinc-400">{data.line2}</p>
        <a
          href="/deep-dive"
          className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition-all hover:bg-zinc-200"
        >
          {data.line3}
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
