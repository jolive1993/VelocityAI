"use client";

import Link from "next/link";
import {
  AmbientBackground,
  Footer,
} from "@/components/home";
import {
  AdminExample,
  AIContentExample,
  EcommerceExample,
  MarketplaceExample,
  SocialExample,
  StockTradingExample,
} from "@/components/deep-dive/UseCaseExamples";
import HypeMeter from "@/components/deep-dive/HypeMeter";

const PLATFORM_FEATURES = [
  {
    title: "E-commerce",
    desc: "Full storefronts, cart flows, and checkout. Sell anything, anywhere.",
    icon: "🛒",
    Example: EcommerceExample,
  },
  {
    title: "P2P Marketplace",
    desc: "Connect buyers and sellers directly. List, browse, transact—no middleman.",
    icon: "🤝",
    Example: MarketplaceExample,
  },
  {
    title: "Social Media",
    desc: "Feeds, profiles, follows, DMs. Build the next big social platform.",
    icon: "📱",
    Example: SocialExample,
  },
  {
    title: "AI Content Generation",
    desc: "Blog posts, product copy, images—all generated in seconds, not hours.",
    icon: "✨",
    Example: AIContentExample,
  },
  {
    title: "Admin Account Management",
    desc: "User listings, profile views, role controls. Full admin dashboards.",
    icon: "⚙️",
    Example: AdminExample,
  },
  {
    title: "Real-time Stock Trading",
    desc: "Live tickers, order books, instant execution. Wall Street in your browser.",
    icon: "📈",
    Example: StockTradingExample,
  },
];

const TESTIMONIALS = [
  {
    quote: "We went from zero to $2M ARR in six months. Velocity isn't a tool—it's a multiplier.",
    author: "Sarah Chen",
    role: "CEO, CommerceFlow",
    stat: "340%",
    statLabel: "conversion lift",
    accent: "cyan",
    size: "large",
  },
  {
    quote: "We shipped our entire marketplace in two weeks. Our investors thought we were exaggerating. We weren't.",
    author: "Marcus Webb",
    role: "CTO, PeerTrade",
    stat: "80%",
    statLabel: "faster to market",
    accent: "teal",
    size: "large",
  },
  {
    quote: "One platform for e-commerce, social, trading, AI—everything. We cut infra costs by 60% and our users noticed the difference immediately.",
    author: "Elena Rodriguez",
    role: "Founder, AllInOne",
    stat: "60%",
    statLabel: "cost reduction",
    accent: "emerald",
    size: "large",
  },
  {
    quote: "Our bounce rate dropped 52% the day we launched. The speed makes people stay.",
    author: "James Okonkwo",
    role: "Head of Product, SwiftCart",
    accent: "cyan",
    size: "medium",
  },
  {
    quote: "We're shipping 12x more features per sprint. Our competitors are still writing boilerplate.",
    author: "Priya Sharma",
    role: "VP Engineering, BuildFast",
    accent: "teal",
    size: "medium",
  },
  {
    quote: "Real-time, sub-50ms, zero downtime. Wall Street quality at startup speed.",
    author: "David Kim",
    role: "Founder, TradePulse",
    accent: "emerald",
    size: "medium",
  },
];

export default function DeepDivePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0b]">
      <AmbientBackground />

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-32 pt-20 sm:px-8 lg:px-12">
        {/* Hero */}
        <section className="mb-24">
          <Link
            href="/"
            className="mb-8 inline-block text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            ← Back to home
          </Link>
          <h1
            className="mb-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-syne), sans-serif" }}
          >
            The deep dive:{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Why Velocity changes everything
            </span>
          </h1>
          <p className="max-w-2xl text-lg text-zinc-400">
            Speed. Modernity. AI-powered development. One platform that handles
            e-commerce, marketplaces, social, AI content, admin tools, and
            real-time trading. Here&apos;s the full picture.
          </p>
        </section>

        {/* Speed & Modernity Stats */}
        <section className="mb-24">
          <h2
            className="mb-4 font-display text-2xl font-bold text-white sm:text-3xl"
            style={{ fontFamily: "var(--font-syne), sans-serif" }}
          >
            Built for speed. Engineered for now.
          </h2>
          <p className="mb-12 max-w-xl text-zinc-500">
            Every metric tells the same story: this is the fastest, most modern
            stack you can run.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "47ms", label: "Time to First Byte", desc: "Sub-50ms TTFB globally" },
              { value: "100", label: "Lighthouse Score", desc: "Perfect across all audits" },
              { value: "0.8s", label: "Full Load", desc: "Interactive in under a second" },
              { value: "99.99%", label: "Uptime", desc: "Enterprise-grade reliability" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm"
              >
                <div
                  className="mb-2 font-display text-2xl font-bold text-cyan-400"
                  style={{ fontFamily: "var(--font-syne), sans-serif" }}
                >
                  {stat.value}
                </div>
                <div className="mb-1 text-sm font-medium text-zinc-400">
                  {stat.label}
                </div>
                <p className="text-sm text-zinc-500">{stat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI-Driven Development */}
        <section className="mb-24">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-transparent to-teal-500/10 p-12 sm:p-16">
            <h2
              className="mb-4 font-display text-2xl font-bold text-white sm:text-3xl"
              style={{ fontFamily: "var(--font-syne), sans-serif" }}
            >
              AI-driven development. Ship 10x faster.
            </h2>
            <p className="mb-10 max-w-2xl text-zinc-400">
              Velocity was built with AI-assisted development from day one. That
              means faster iteration, fewer bugs, and a codebase that stays
              modern without the usual tech debt. Development speed isn&apos;t a
              nice-to-have—it&apos;s the whole point.
            </p>
            <div className="flex flex-wrap gap-8">
              {[
                { value: "80%", label: "Faster time to market" },
                { value: "12x", label: "More features per sprint" },
                { value: "3 days", label: "Avg. build-to-deploy" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    className="font-display text-3xl font-bold text-cyan-400"
                    style={{ fontFamily: "var(--font-syne), sans-serif" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sales Impact */}
        <section className="mb-24">
          <h2
            className="mb-4 font-display text-2xl font-bold text-white sm:text-3xl"
            style={{ fontFamily: "var(--font-syne), sans-serif" }}
          >
            Built to drive sales
          </h2>
          <p className="mb-12 max-w-xl text-zinc-500">
            Speed converts. Modern design converts. Velocity does both.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { value: "+340%", label: "Conversion rate lift", desc: "Avg. across migrated sites" },
              { value: "-52%", label: "Bounce rate reduction", desc: "Users stay, users buy" },
              { value: "+2.3x", label: "Avg. order value", desc: "Faster UX = bigger carts" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm"
              >
                <div
                  className="mb-2 font-display text-2xl font-bold text-green-400"
                  style={{ fontFamily: "var(--font-syne), sans-serif" }}
                >
                  {stat.value}
                </div>
                <div className="mb-1 text-sm font-medium text-zinc-400">
                  {stat.label}
                </div>
                <p className="text-sm text-zinc-500">{stat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Platform Features */}
        <section className="mb-24">
          <h2
            className="mb-4 font-display text-2xl font-bold text-white sm:text-3xl"
            style={{ fontFamily: "var(--font-syne), sans-serif" }}
          >
            One platform. Every use case.
          </h2>
          <p className="mb-12 max-w-xl text-zinc-500">
            E-commerce, marketplaces, social, AI, admin, trading—Velocity handles
            it all. No compromises, no add-ons.
          </p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {PLATFORM_FEATURES.map((feature) => {
              const Example = feature.Example;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-6 transition-colors hover:border-cyan-500/20"
                >
                  <div className="mb-3 text-2xl">{feature.icon}</div>
                  <h3 className="mb-2 font-display text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mb-4 text-sm text-zinc-500">{feature.desc}</p>
                  <div className="rounded-lg border border-white/5 bg-black/20 p-3">
                    <div className="mb-2 text-[10px] uppercase tracking-wider text-zinc-500">
                      Example
                    </div>
                    <Example />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-24">
          <h2
            className="mb-4 font-display text-2xl font-bold text-white sm:text-3xl"
            style={{ fontFamily: "var(--font-syne), sans-serif" }}
          >
            What teams are saying
          </h2>
          <p className="mb-16 max-w-xl text-zinc-500">
            Real results from real teams. Each story is different—each outcome
            speaks for itself.
          </p>
          <div className="space-y-8">
            {TESTIMONIALS.map((t, i) => {
              const accentColors = {
                cyan: "border-l-cyan-500 bg-cyan-500/5",
                teal: "border-l-teal-500 bg-teal-500/5",
                emerald: "border-l-emerald-500 bg-emerald-500/5",
              };
              const accentAvatar = {
                cyan: "bg-cyan-500/20 text-cyan-400",
                teal: "bg-teal-500/20 text-teal-400",
                emerald: "bg-emerald-500/20 text-emerald-400",
              };
              const accentStat = {
                cyan: "text-cyan-400",
                teal: "text-teal-400",
                emerald: "text-emerald-400",
              };
              const accent = t.accent ?? "cyan";
              const isLarge = t.size === "large";
              const isOffset = i % 2 === 1;
              return (
                <blockquote
                  key={t.author}
                  className={`rounded-2xl border-l-4 p-8 transition-all hover:shadow-xl ${
                    accentColors[accent as keyof typeof accentColors]
                  } ${isOffset ? "ml-0 sm:ml-8 lg:ml-16" : ""} ${
                    isLarge ? "py-10 sm:py-12" : ""
                  }`}
                >
                  <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      {t.stat && (
                        <div className="mb-4">
                          <span
                            className={`font-display text-4xl font-bold ${
                              accentStat[accent as keyof typeof accentStat]
                            }`}
                            style={{ fontFamily: "var(--font-syne), sans-serif" }}
                          >
                            {t.stat}
                          </span>
                          <span className="ml-2 text-sm text-zinc-500">
                            {t.statLabel}
                          </span>
                        </div>
                      )}
                      <p
                        className={`font-display leading-relaxed text-white ${
                          isLarge
                            ? "text-xl sm:text-2xl"
                            : "text-lg"
                        }`}
                        style={{ fontFamily: "var(--font-syne), sans-serif" }}
                      >
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>
                    <footer className="flex shrink-0 items-center gap-4">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-full font-display text-xl font-bold ${
                          accentAvatar[accent as keyof typeof accentAvatar]
                        }`}
                        style={{ fontFamily: "var(--font-syne), sans-serif" }}
                      >
                        {t.author.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-white">
                          {t.author}
                        </div>
                        <div className="text-sm text-zinc-500">{t.role}</div>
                      </div>
                    </footer>
                  </div>
                </blockquote>
              );
            })}
          </div>
        </section>

        <HypeMeter />

        <Footer />
      </main>
    </div>
  );
}
