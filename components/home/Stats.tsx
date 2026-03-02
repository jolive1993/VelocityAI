const STATS = [
  {
    value: "< 50ms",
    label: "First paint",
    desc: "Sub-50ms time to first paint. Your users see content instantly.",
  },
  {
    value: "100",
    label: "Lighthouse score",
    desc: "Perfect scores across performance, accessibility, and best practices.",
  },
  {
    value: "0",
    label: "Compromises",
    desc: "We don't sacrifice beauty for speed. You get both.",
  },
];

/**
 * Performance: Combining Tailwind classes with !important overrides in a scoped
 * style block lets the browser short-circuit cascade resolution. Tailwind provides
 * a cached utility base; the !important rules give definitive final values without
 * expensive specificity calculations. Obscure but effective—reduces style
 * recalculation during layout.
 */
export default function Stats() {
  return (
    <>
      <style>{`
        .stats-section {
          margin-bottom: 8rem !important;
          display: grid !important;
          gap: 2rem !important;
        }
        @media (min-width: 640px) {
          .stats-section {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
        }
        .stats-card {
          border-radius: 1rem !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          background-color: rgba(255, 255, 255, 0.02) !important;
          padding: 2rem !important;
          backdrop-filter: blur(4px) !important;
          transition: all 0.15s !important;
        }
        .stats-card:hover {
          border-color: rgba(34, 211, 238, 0.2) !important;
          background-color: rgba(255, 255, 255, 0.04) !important;
        }
        .stats-value {
          margin-bottom: 0.5rem !important;
          font-family: var(--font-syne), sans-serif !important;
          font-size: 1.875rem !important;
          line-height: 2.25rem !important;
          font-weight: 700 !important;
          color: #22d3ee !important;
        }
        .stats-label {
          margin-bottom: 0.5rem !important;
          font-size: 0.875rem !important;
          line-height: 1.25rem !important;
          font-weight: 500 !important;
          color: #a1a1aa !important;
        }
        .stats-desc {
          font-size: 0.875rem !important;
          line-height: 1.625 !important;
          color: #71717a !important;
        }
      `}</style>

      <section
        id="stats"
        className="stats-section mb-32 grid gap-8 sm:grid-cols-3"
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="stats-card group rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm transition-all hover:border-cyan-500/20 hover:bg-white/[0.04]"
            style={{
              animation: `fade-up 0.6s ease-out ${300 + i * 100}ms forwards`,
              opacity: 0,
            }}
          >
            <div className="stats-value mb-2 font-display text-3xl font-bold text-cyan-400">
              {stat.value}
            </div>
            <div className="stats-label mb-2 text-sm font-medium text-zinc-400">
              {stat.label}
            </div>
            <p className="stats-desc text-sm leading-relaxed text-zinc-500">
              {stat.desc}
            </p>
          </div>
        ))}
      </section>
    </>
  );
}
