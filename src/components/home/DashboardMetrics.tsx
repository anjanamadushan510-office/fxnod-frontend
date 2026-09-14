"use client";

import { useGetWalletBalance } from "@/services/api/endpoints/wallet/wallet";
import { fmtUSD } from "@/lib/format";
import { cn } from "@/lib/cn";

interface DashboardMetricsProps {
  onTopUp?: () => void;
  onSend?: () => void;
}

export function DashboardMetrics({ onTopUp, onSend }: DashboardMetricsProps) {
  const { data: walletData } = useGetWalletBalance();
  const balance = Number(walletData?.balance || 0);

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      <article className="bg-panel border border-line rounded-2xl p-5">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Wallet</p>
          <div className="flex items-center gap-3">
            <button type="button" onClick={onSend} className="text-[11px] text-zinc-400 hover:text-white transition-colors">Send</button>
            <button type="button" onClick={onTopUp} className="text-[11px] text-zinc-400 hover:text-white transition-colors">Top up</button>
          </div>
        </div>
        <p className="font-display text-3xl font-semibold tabular-nums">{fmtUSD(balance)}</p>
        <p className="mt-1 text-xs text-zinc-500">On Deriv <span className="tabular-nums text-zinc-400">$0.00</span></p>
      </article>

      <article className="bg-panel border border-line rounded-2xl p-5 surface-hover cursor-pointer transition-colors">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Active tools</p>
          <span className="text-[11px] text-zinc-400">On Deriv</span>
        </div>
        <p className="font-display text-3xl font-semibold tabular-nums">2</p>
        <p className="mt-1 text-xs text-zinc-500">dTrader &middot; dBot</p>
      </article>

      <article className="bg-panel border border-line rounded-2xl p-5 surface-hover cursor-pointer transition-colors">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Venues</p>
          <span className="text-[11px] text-green-400">Live APIs</span>
        </div>
        <p className="font-display text-3xl font-semibold tabular-nums">3</p>
        <p className="mt-1 text-xs text-zinc-500">Deriv &middot; Bybit &middot; Binance</p>
      </article>

      <article className="bg-panel border border-line rounded-2xl p-5 surface-hover cursor-pointer transition-colors">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Partner</p>
          <span className="text-[11px] text-zinc-400">This month</span>
        </div>
        <p className="font-display text-3xl font-semibold tabular-nums">{fmtUSD(86.40)}</p>
        <p className="mt-1 text-xs text-zinc-500">12 referred traders</p>
      </article>
    </div>
  );
}
