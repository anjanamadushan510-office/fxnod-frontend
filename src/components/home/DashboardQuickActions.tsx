"use client";

import { useRouter } from "next/navigation";

export function DashboardQuickActions() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <article 
        onClick={() => router.push("/options/dtrader")}
        className="bg-panel border border-line rounded-2xl p-5 surface-hover cursor-pointer transition-colors"
      >
        <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500 mb-3">dTrader</p>
        <h2 className="font-display text-lg font-semibold mb-2">Trade now</h2>
        <p className="text-sm text-zinc-400 leading-relaxed mb-4">
          Rise / Fall tickets on Deriv synthetics. Free — FXNOD earns a markup on the API.
        </p>
        <span className="text-xs text-zinc-300">Open dTrader &rarr;</span>
      </article>
      
      <article 
        onClick={() => router.push("/options/dbot")}
        className="bg-panel border border-line rounded-2xl p-5 surface-hover cursor-pointer transition-colors"
      >
        <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500 mb-3">dBot</p>
        <h2 className="font-display text-lg font-semibold mb-2">Run a bot</h2>
        <p className="text-sm text-zinc-400 leading-relaxed mb-4">
          Build in plain language, or pick a ready bot. Practice first, then run on Deriv.
        </p>
        <span className="text-xs text-zinc-300">Open dBot &rarr;</span>
      </article>
    </div>
  );
}
