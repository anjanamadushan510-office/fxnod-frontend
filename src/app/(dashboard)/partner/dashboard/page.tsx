"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { money, productName } from "@/lib/partner";
import { useGetCommissionHistory } from "@/services/api/endpoints/commissions/commissions";
import {
  useGetOrCreateReferralCode,
  useGetPartnerEarnings,
  useListPartners,
} from "@/services/api/endpoints/referrals/referrals";

const HISTORY_PAGE_SIZE = 25;

export default function PartnerDashboardPage() {
  const codeMutation = useGetOrCreateReferralCode();
  const earningsQuery = useGetPartnerEarnings();
  const partnersQuery = useListPartners();
  
  const historyQuery = useGetCommissionHistory({
    limit: HISTORY_PAGE_SIZE,
  });

  const { mutate: ensureCode } = codeMutation;
  useEffect(() => {
    ensureCode();
  }, [ensureCode]);

  const earnings = earningsQuery.data;
  const thisMonthPending = earnings?.total?.accrued;
  const lifetimePaid = earnings?.total?.settled;
  const referredCount = partnersQuery.data?.total ?? 0;
  const currency = earnings?.currency ?? "USD";

  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  const link = codeMutation.data?.code ? `${origin}/auth/register?ref=${codeMutation.data.code}` : "";

  async function copy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Invite link copied");
    } catch {
      toast.error("Could not copy — select the link and copy it manually");
    }
  }

  return (
    <section data-view="partners" className="p-4 lg:p-8 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <article className="bg-surface border border-line rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-ink-3 mb-3">This month</p>
          <p className="font-display text-3xl font-semibold tabular-nums text-ink">
            {money(thisMonthPending, currency)}
          </p>
          <p className="mt-1 text-xs text-ink-3">Pending to wallet</p>
        </article>
        <article className="bg-surface border border-line rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-ink-3 mb-3">Lifetime</p>
          <p className="font-display text-3xl font-semibold tabular-nums text-ink">
            {money(lifetimePaid, currency)}
          </p>
          <p className="mt-1 text-xs text-ink-3">Paid to wallet</p>
        </article>
        <article className="bg-surface border border-line rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-ink-3 mb-3">Referred</p>
          <p className="font-display text-3xl font-semibold tabular-nums text-ink">
            {referredCount}
          </p>
          <p className="mt-1 text-xs text-ink-3">Active traders</p>
        </article>
      </div>
      
      <article className="bg-surface border border-line rounded-2xl p-5">
        <p className="text-xs uppercase tracking-[0.14em] text-ink-3 mb-3">Your link</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input 
            readOnly 
            value={link || "Preparing your link…"} 
            className="flex-1 min-w-0 w-full h-10 px-3 rounded-lg bg-bg border border-line text-sm text-ink-2 outline-none" 
          />
          <button 
            type="button"
            onClick={copy}
            disabled={!link}
            className="h-10 px-4 rounded-lg bg-white text-surface text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50 transition-colors"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </article>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <article className="bg-surface border border-line rounded-2xl p-5">
          <p className="text-[11px] uppercase tracking-[0.14em] text-ink-3 mb-2">01</p>
          <h3 className="font-medium mb-2 text-ink">Share the hub</h3>
          <p className="text-sm text-ink-2 leading-relaxed">Send your link. New traders land in the FXNOD terminal and connect Deriv, Bybit or Binance.</p>
        </article>
        <article className="bg-surface border border-line rounded-2xl p-5">
          <p className="text-[11px] uppercase tracking-[0.14em] text-ink-3 mb-2">02</p>
          <h3 className="font-medium mb-2 text-ink">They pick a tool</h3>
          <p className="text-sm text-ink-2 leading-relaxed">They open dTrader or dBot. You earn 25% of FXNOD API markup on their volume.</p>
        </article>
        <article className="bg-surface border border-line rounded-2xl p-5">
          <p className="text-[11px] uppercase tracking-[0.14em] text-ink-3 mb-2">03</p>
          <h3 className="font-medium mb-2 text-ink">Paid to wallet</h3>
          <p className="text-sm text-ink-2 leading-relaxed">Commissions settle into your FXNOD Wallet. Use them on tools or keep them as earnings.</p>
        </article>
      </div>

      <article className="bg-surface border border-line rounded-2xl overflow-hidden min-w-0">
        <div className="px-5 py-4 border-b border-line">
          <h3 className="font-display text-sm font-semibold text-ink">Recent referrals</h3>
        </div>
        <div className="divide-y divide-[#24344F]">
          {historyQuery.isLoading ? (
            <div className="px-5 py-6 text-sm text-ink-3 text-center">Loading referrals...</div>
          ) : historyQuery.isError ? (
            <div className="px-5 py-6 text-sm text-red-400 text-center">Failed to load referrals.</div>
          ) : historyQuery.data?.items?.length === 0 ? (
            <div className="px-5 py-6 text-sm text-ink-3 text-center">No recent referrals yet.</div>
          ) : (
            historyQuery.data?.items?.map((row) => (
              <div key={row.id} className="flex items-start justify-between gap-3 px-5 py-3.5 min-w-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate text-ink">{row.source_display_name || row.source_email || "A team member"}</p>
                  <p className="text-xs text-ink-3 mt-0.5">{productName(row.source_type)}</p>
                </div>
                <p className="tabular-nums text-sm shrink-0 text-ink">
                  {money(row.commission_amount, row.currency)}
                </p>
              </div>
            ))
          )}
        </div>
      </article>
    </section>
  );
}
