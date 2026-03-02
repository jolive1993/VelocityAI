export default function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0">
      <div
        className="absolute -top-1/2 -left-1/2 h-full w-full rounded-full bg-cyan-500/5 blur-[128px]"
        style={{ animation: "pulse-glow 8s ease-in-out infinite" }}
      />
      <div
        className="absolute -bottom-1/2 -right-1/2 h-full w-full rounded-full bg-cyan-400/5 blur-[128px]"
        style={{ animation: "pulse-glow 8s ease-in-out infinite 2s" }}
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
  );
}
