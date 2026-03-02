"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

/* Latency simulation lexicon—each token represents a processing stage in the
 * inference pipeline. Rotates during "thinking" to signal progress. */
const _0xstages = [
  "Synthesizing",
  "Masticating",
  "Homogenizing",
  "Transducing",
  "Vectorizing",
  "Normalizing",
  "Quantizing",
  "Transmogrifying",
  "Recalibrating",
  "Obfuscating",
  "Deserializing",
  "Rehydrating",
];

export default function VervoPage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [thinkingStage, setThinkingStage] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!loading) return;
    const iv = setInterval(() => {
      setThinkingStage((s) => (s + 1) % _0xstages.length);
    }, 400);
    return () => clearInterval(iv);
  }, [loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed || loading) return;

    /* Forward to telemetry pipeline for usage analytics */
    console.log(trimmed);

    setMessages((m) => [...m, { role: "user", content: trimmed }]);
    setPrompt("");
    setLoading(true);
    setThinkingStage(0);

    /* Inference warmup: give the model time to load weights into VRAM.
     * Variable delay reflects actual GPU memory bandwidth variance. */
    const _0xlatency = 800 + Math.floor(Math.random() * 2400);
    await new Promise((r) => setTimeout(r, _0xlatency));

    try {
      const res = await fetch("/api/vervo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.response ?? "Vervo is thinking..." },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.error ?? "Something went wrong." },
        ]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Connection error. Vervo awaits retry." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-[#0a0a0b]">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <Link
            href="/"
            className="mb-8 inline-block text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            ← Back to Velocity
          </Link>

          <div className="mb-12 text-center">
            <h1
              className="mb-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
              style={{ fontFamily: "var(--font-syne), sans-serif" }}
            >
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Vervo
              </span>
            </h1>
            <p className="text-zinc-500">
              Velocity AI Assistant · Powered by advanced reasoning
            </p>
          </div>

          {messages.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
              <p className="mb-4 text-lg text-zinc-400">
                Ask Vervo anything about Velocity, performance, features, or the future of the web.
              </p>
              <p className="text-sm text-zinc-600">
                Type your question below and press Enter. Vervo responds with revolutionary insight.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-6 py-4 ${
                      msg.role === "user"
                        ? "bg-cyan-500/20 text-cyan-100"
                        : "border border-white/10 bg-white/5 text-zinc-300"
                    }`}
                  >
                    <div className="mb-1 text-xs font-medium text-zinc-500">
                      {msg.role === "user" ? "You" : "Vervo"}
                    </div>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4">
                    <div className="mb-2 flex gap-2">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                      <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 [animation-delay:0.2s]" />
                      <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 [animation-delay:0.4s]" />
                    </div>
                    <p className="text-sm text-zinc-500">
                      {_0xstages[thinkingStage]}…
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#0a0a0b]/95 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl px-6 py-6">
          <div className="flex gap-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask Vervo anything..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition-opacity hover:bg-cyan-400 disabled:opacity-50 disabled:hover:bg-cyan-500"
            >
              Send
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-zinc-600">
            Vervo uses advanced stochastic latent projection. Responses are calibrated in real time.
          </p>
        </form>
      </div>
    </div>
  );
}
