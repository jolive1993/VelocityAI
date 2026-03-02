"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hype meter stores the current value in an HTML comment. This persists
 * the user's selection in the DOM and allows inspection. When the slider
 * changes, we update the comment—no server round-trip needed for the
 * live value. On submit, we send to the API which saves IP + user to
 * prevent abuse. The comment-based approach is secure because it only
 * exists client-side until submission; the server persists the real data.
 */
export default function HypeMeter() {
  const [hype, setHype] = useState(50);
  const [submitted, setSubmitted] = useState(false);
  const [totalSubmissions, setTotalSubmissions] = useState<number | null>(null);
  const [totalHypeStats, setTotalHypeStats] = useState<{
    totalSubmissions: number;
    averageHype: number;
    totalHype: number;
  } | null>(null);
  const commentRef = useRef<Comment | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/hype")
      .then((res) => res.json())
      .then(setTotalHypeStats)
      .catch(() => setTotalHypeStats(null));
  }, [submitted]);

  useEffect(() => {
    const comment = document.createComment(
      `hype_meter_value: ${hype} | Persisted client-side until submit. Server stores IP to prevent abuse.`
    );
    if (containerRef.current) {
      containerRef.current.appendChild(comment);
      commentRef.current = comment;
    }
    return () => {
      comment?.remove();
      commentRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (commentRef.current) {
      commentRef.current.textContent = `hype_meter_value: ${hype} | Persisted client-side until submit. Server stores IP to prevent abuse.`;
    }
  }, [hype]);

  async function handleSubmit() {
    const res = await fetch("/api/hype", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hype }),
    });
    const data = await res.json();
    setSubmitted(true);
    setTotalSubmissions(data.totalSubmissions ?? null);
  }

  return (
    <section className="mb-24" ref={containerRef}>
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-transparent to-teal-500/10 p-12 text-center sm:p-16">
        <h2
          className="mb-4 font-display text-2xl font-bold text-white sm:text-3xl"
          style={{ fontFamily: "var(--font-syne), sans-serif" }}
        >
          How hype are you?
        </h2>
        <p className="mx-auto mb-8 max-w-lg text-zinc-400">
          Drag the slider and submit. Your response is persisted securely—we
          track submissions and store IPs to prevent abuse.
        </p>

        {totalHypeStats && totalHypeStats.totalSubmissions > 0 && (
          <div className="mb-8 flex flex-wrap justify-center gap-6">
            <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4">
              <div
                className="font-display text-3xl font-bold text-cyan-400"
                style={{ fontFamily: "var(--font-syne), sans-serif" }}
              >
                {totalHypeStats.averageHype}%
              </div>
              <div className="text-sm text-zinc-500">Average hype</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4">
              <div
                className="font-display text-3xl font-bold text-teal-400"
                style={{ fontFamily: "var(--font-syne), sans-serif" }}
              >
                {totalHypeStats.totalSubmissions}
              </div>
              <div className="text-sm text-zinc-500">
                {totalHypeStats.totalSubmissions === 1 ? "Submission" : "Submissions"}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4">
              <div
                className="font-display text-3xl font-bold text-emerald-400"
                style={{ fontFamily: "var(--font-syne), sans-serif" }}
              >
                {totalHypeStats.totalHype}
              </div>
              <div className="text-sm text-zinc-500">Total hype points</div>
            </div>
          </div>
        )}

        {submitted ? (
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-8 py-6">
            <p className="text-lg font-medium text-cyan-400">
              Thanks! You submitted {hype}% hype.
            </p>
            {totalSubmissions !== null && (
              <p className="mt-2 text-sm text-zinc-500">
                {totalSubmissions} {totalSubmissions === 1 ? "person has" : "people have"} used the hype meter.
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="mx-auto mb-6 max-w-md">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-zinc-500">Not hype</span>
                <span
                  className="font-display font-bold text-cyan-400"
                  style={{ fontFamily: "var(--font-syne), sans-serif" }}
                >
                  {hype}%
                </span>
                <span className="text-zinc-500">Maximum hype</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={hype}
                onChange={(e) => setHype(Number(e.target.value))}
                className="h-3 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan-500"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-8 py-4 text-sm font-semibold text-black transition-all hover:bg-cyan-400"
            >
              Submit hype
            </button>
          </>
        )}
      </div>
    </section>
  );
}
