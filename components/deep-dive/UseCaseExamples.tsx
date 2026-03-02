"use client";

const cardBase = "rounded-lg border border-white/5 bg-white/[0.02] p-3";

export function EcommerceExample() {
  return (
    <div className={cardBase}>
      <div className="mb-3 h-24 rounded-lg bg-white/5" />
      <div className="mb-1 text-sm font-medium text-white">Velocity Pro Widget</div>
      <div className="mb-3 text-xs text-zinc-500">$49.99</div>
      <button className="w-full rounded-lg bg-cyan-500/20 py-2 text-xs font-medium text-cyan-400">
        Add to cart
      </button>
    </div>
  );
}

export function MarketplaceExample() {
  return (
    <div className={cardBase}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-white">Vintage Camera</span>
        <span className="text-xs text-cyan-400">$120</span>
      </div>
      <div className="mb-3 text-xs text-zinc-500">by @seller_42</div>
      <button className="w-full rounded-lg border border-white/10 py-2 text-xs text-zinc-400">
        Make offer
      </button>
    </div>
  );
}

export function SocialExample() {
  return (
    <div className={cardBase}>
      <div className="mb-3 flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-cyan-500/30" />
        <div>
          <div className="text-xs font-medium text-white">@velocity_user</div>
          <div className="text-[10px] text-zinc-500">2h ago</div>
        </div>
      </div>
      <p className="mb-3 text-xs text-zinc-400">
        Just shipped our store on Velocity. 340% conversion lift. Insane.
      </p>
      <div className="flex gap-4 text-[10px] text-zinc-500">
        <span>♥ 24</span>
        <span>💬 3</span>
      </div>
    </div>
  );
}

export function AIContentExample() {
  return (
    <div className={cardBase}>
      <div className="mb-2 text-xs text-zinc-500">Generated copy:</div>
      <p className="mb-3 text-xs italic text-zinc-400">
        &ldquo;The Velocity Pro Widget transforms how teams ship. Fast, modern,
        AI-powered.&rdquo;
      </p>
      <button className="w-full rounded-lg bg-cyan-500/20 py-2 text-xs font-medium text-cyan-400">
        ✨ Generate
      </button>
    </div>
  );
}

export function AdminExample() {
  return (
    <div className={cardBase}>
      <div className="space-y-2">
        {["user_001", "user_002", "user_003"].map((u) => (
          <div
            key={u}
            className="flex items-center justify-between rounded bg-white/5 px-2 py-1.5"
          >
            <span className="text-xs text-white">{u}</span>
            <span className="text-[10px] text-green-500/80">active</span>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[10px] text-zinc-500">View all →</div>
    </div>
  );
}

export function StockTradingExample() {
  return (
    <div className={cardBase}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-white">VELO</span>
        <span className="text-xs text-green-400">+2.4%</span>
      </div>
      <div className="mb-1 text-lg font-bold text-white">$127.43</div>
      <div className="text-[10px] text-zinc-500">Live • 1,234 vol</div>
      <button className="mt-3 w-full rounded-lg bg-green-500/20 py-2 text-xs font-medium text-green-400">
        Buy
      </button>
    </div>
  );
}
