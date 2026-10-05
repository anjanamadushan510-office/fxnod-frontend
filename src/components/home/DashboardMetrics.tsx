"use client";

import { useGetWalletBalance } from "@/services/api/endpoints/wallet/wallet";
import { useGetReferralStats } from "@/services/api/endpoints/referrals/referrals";
import { useDerivListAccounts } from "@/services/api/endpoints/trading/trading";
import { fmtUSD } from "@/lib/format";
import { useActiveTools } from "@/hooks/useActiveTools";

interface DashboardMetricsProps {
  onTopUp?: () => void;
  onSend?: () => void;
}

export function DashboardMetrics({ onTopUp, onSend }: DashboardMetricsProps) {
  const { data: walletData } = useGetWalletBalance();
  const balance = Number(walletData?.balance || 0);

  const { data: derivAccountsData } = useDerivListAccounts();
  const venueCount = (derivAccountsData?.accounts?.length ?? 0) > 0 ? 1 : 0;

  // Partner data via existing endpoint
  const { data: referralStats } = useGetReferralStats();
  const partnerEarnings = Number(referralStats?.settled_total || 0);
  const partnerTeamSize = referralStats?.total_team_size || 0;
  const { activeTools } = useActiveTools();

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      <article className="bg-surface border border-line rounded-2xl p-4 sm:p-6 lg:p-7">
        <p className="text-[11px] uppercase tracking-[0.14em] text-ink-3 sm:text-xs">Wallet</p>
        <p className="mt-3 font-display text-2xl font-semibold tabular-nums text-ink sm:text-3xl">{fmtUSD(balance)}</p>
        <p className="mt-1 text-xs text-ink-3">On Deriv <span className="tabular-nums text-ink-2">$0.00</span></p>
        <div className="mt-3 flex items-center gap-3">
          <button type="button" onClick={onSend} className="text-[11px] text-ink-2 hover:text-ink transition-colors">Send</button>
          <button type="button" onClick={onTopUp} className="text-[11px] text-ink-2 hover:text-ink transition-colors">Top up</button>
        </div>
      </article>

      <article className="min-w-0 bg-surface border border-line rounded-2xl p-4 sm:p-6 lg:p-7 hover:bg-surface-2 cursor-pointer transition-colors">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-1">
          <p className="text-[11px] uppercase tracking-[0.14em] text-ink-3 sm:text-xs">Active tools</p>
          <span className="text-[11px] text-ink-2">On Deriv</span>
        </div>
        <p className="font-display text-2xl font-semibold tabular-nums text-ink sm:text-3xl">{activeTools.length}</p>
        <p className="mt-1 break-words text-xs text-ink-3">
          {activeTools.length > 0 ? activeTools.map((tool) => tool.name).join(" · ") : "None activated"}
        </p>
      </article>

      <article className="min-w-0 bg-surface border border-line rounded-2xl p-4 sm:p-6 lg:p-7 hover:bg-surface-2 cursor-pointer transition-colors">
        <div className="flex items-start justify-between gap-2 mb-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-ink-3 sm:text-xs">Connected Accounts</p>
          <span className="text-[11px] text-green-400">Live APIs</span>
        </div>
        <p className="font-display text-2xl font-semibold tabular-nums text-ink sm:text-3xl">{venueCount}</p>
        <p className="mt-1 text-xs text-ink-3">Deriv &middot; Bybit &middot; Binance</p>
      </article>

      <article className="min-w-0 bg-surface border border-line rounded-2xl p-4 sm:p-6 lg:p-7 hover:bg-surface-2 cursor-pointer transition-colors">
        <div className="flex items-start justify-between gap-2 mb-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-ink-3 sm:text-xs">Partner</p>
          <span className="text-[11px] text-ink-2">This month</span>
        </div>
        <p className="break-words font-display text-2xl font-semibold tabular-nums text-ink sm:text-3xl">{fmtUSD(partnerEarnings)}</p>
        <p className="mt-1 text-xs text-ink-3">{partnerTeamSize} referred traders</p>
      </article>
    </div>
  );
}
