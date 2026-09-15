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
      <article className="bg-surface border border-line rounded-2xl p-6 lg:p-7">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs uppercase tracking-[0.14em] text-ink-3">Wallet</p>
          <div className="flex items-center gap-3">
            <button type="button" onClick={onSend} className="text-[11px] text-ink-2 hover:text-ink transition-colors">Send</button>
            <button type="button" onClick={onTopUp} className="text-[11px] text-ink-2 hover:text-ink transition-colors">Top up</button>
          </div>
        </div>
        <p className="font-display text-3xl font-semibold tabular-nums text-ink">{fmtUSD(balance)}</p>
        <p className="mt-1 text-xs text-ink-3">On Deriv <span className="tabular-nums text-ink-2">$0.00</span></p>
      </article>

      <article className="bg-surface border border-line rounded-2xl p-6 lg:p-7 hover:bg-surface-2 cursor-pointer transition-colors">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs uppercase tracking-[0.14em] text-ink-3">Active tools</p>
          <span className="text-[11px] text-ink-2">On Deriv</span>
        </div>
        <p className="font-display text-3xl font-semibold tabular-nums text-ink">2</p>
        <p className="mt-1 text-xs text-ink-3">dTrader &middot; dBot</p>
      </article>

      <article className="bg-surface border border-line rounded-2xl p-6 lg:p-7 hover:bg-surface-2 cursor-pointer transition-colors">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs uppercase tracking-[0.14em] text-ink-3">Venues</p>
          <span className="text-[11px] text-green-400">Live APIs</span>
        </div>
        <p className="font-display text-3xl font-semibold tabular-nums text-ink">3</p>
        <p className="mt-1 text-xs text-ink-3">Deriv &middot; Bybit &middot; Binance</p>
      </article>

      <article className="bg-surface border border-line rounded-2xl p-6 lg:p-7 hover:bg-surface-2 cursor-pointer transition-colors">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs uppercase tracking-[0.14em] text-ink-3">Partner</p>
          <span className="text-[11px] text-ink-2">This month</span>
        </div>
        <p className="font-display text-3xl font-semibold tabular-nums text-ink">{fmtUSD(86.40)}</p>
        <p className="mt-1 text-xs text-ink-3">12 referred traders</p>
      </article>
    </div>
  );
}
