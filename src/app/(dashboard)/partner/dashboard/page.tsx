"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { toast } from "sonner";
import { StatCard } from "@/components/partner/StatCard";
import { isZero, levelName, memberName, money, pendingExplanation, productName, shortDate } from "@/lib/partner";
import {
  useGetOrCreateReferralCode,
  useGetPartnerEarnings,
  useListPartners,
} from "@/services/api/endpoints/referrals/referrals";

const TOP_MEMBERS = 5;

export default function PartnerOverviewPage() {
  const codeMutation = useGetOrCreateReferralCode();
  const earningsQuery = useGetPartnerEarnings();
  const partnersQuery = useListPartners();

  const { mutate: ensureCode } = codeMutation;
  useEffect(() => {
    ensureCode();
  }, [ensureCode]);

  const earnings = earningsQuery.data;
  const currency = earnings?.currency ?? "USD";
  const team = partnersQuery.data;

  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");
  const [canShare, setCanShare] = useState(false);
  useEffect(() => {
    setOrigin(window.location.origin);
    setCanShare(typeof navigator.share === "function");
  }, []);
  const link = codeMutation.data?.code ? `${origin}/auth/register?ref=${codeMutation.data.code}` : "";

  async function copy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Invite link copied");
    } catch {
      toast.error("Could not copy. Select the link and copy it manually.");
    }
  }

  async function share() {
    if (!link) return;
    try {
      await navigator.share({ title: "FXNOD", text: "Trade on Deriv with FXNOD tools.", url: link });
    } catch {
      // Closing the share sheet rejects the promise; there is nothing to report.
    }
  }

  return (
    <section data-view="partners" className="space-y-6 p-4 lg:p-8">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="Pending"
          value={money(earnings?.total.accrued, currency)}
          note="Earned and not yet paid"
        />
        <StatCard label="Paid" value={money(earnings?.total.settled, currency)} note="To your FXNOD wallet" />
        <StatCard label="Team" value={team ? String(team.total) : "—"} note="People under your link" />
        <StatCard
          label="Earning"
          value={team ? String(team.earning_count) : "—"}
          note="Team members who earned you something"
        />
      </div>

      {earnings && !isZero(earnings.total.pending_review) && (
        <p className="rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink-2">
          {money(earnings.total.pending_review, currency)} of your pending amount is being reviewed before it
          is paid. The amount has not changed.
        </p>
      )}

      <article className="rounded-2xl border border-line bg-surface p-5">
        <p className="mb-3 text-xs uppercase tracking-[0.14em] text-ink-3">Your invite link</p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <input
            readOnly
            aria-label="Your invite link"
            value={link || "Preparing your link…"}
            onFocus={(event) => event.currentTarget.select()}
            className="h-10 w-full min-w-0 flex-1 rounded-lg border border-line bg-bg px-3 text-sm text-ink-2 outline-none"
          />
          <div className="flex w-full gap-3 sm:w-auto">
            <button
              type="button"
              onClick={copy}
              disabled={!link}
              className="h-10 flex-1 rounded-lg bg-ink px-6 text-sm font-medium text-surface transition-opacity hover:opacity-90 disabled:opacity-50 sm:flex-none"
            >
              {copied ? "Copied" : "Copy"}
            </button>
            {canShare && (
              <button
                type="button"
                onClick={share}
                disabled={!link}
                className="h-10 flex-1 rounded-lg border border-line px-6 text-sm font-medium text-ink transition-colors hover:bg-surface-2 disabled:opacity-50 sm:flex-none"
              >
                Share
              </button>
            )}
          </div>
        </div>
        <p className="mt-3 text-xs text-ink-3">
          Anyone who registers through this link joins your team. People they invite join it too, one level
          further down.
        </p>
      </article>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="min-w-0 overflow-hidden rounded-2xl border border-line bg-surface">
          <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
            <h2 className="font-display text-sm font-semibold text-ink">Where it comes from</h2>
            <Link href={"/partner/dashboard/earnings" as Route} className="text-xs text-ink-2 hover:text-ink">
              All earnings
            </Link>
          </header>
          {earningsQuery.isLoading ? (
            <p className="px-5 py-6 text-center text-sm text-ink-3">Loading…</p>
          ) : earningsQuery.isError ? (
            <p className="px-5 py-6 text-center text-sm text-red-400">Your earnings could not be loaded.</p>
          ) : !earnings?.by_source.length ? (
            <p className="px-5 py-6 text-center text-sm text-ink-3">
              Nothing earned yet. It appears here once someone on your team trades.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {earnings.by_source.map((source) => (
                <li key={source.source_type} className="flex items-start justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink">{productName(source.source_type)}</p>
                    <p className="mt-0.5 text-xs text-ink-3">{pendingExplanation(source.source_type)}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm tabular-nums text-ink">{money(source.amounts.accrued, currency)}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wider text-ink-3">
                      Pending · {money(source.amounts.settled, currency)} paid
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="min-w-0 overflow-hidden rounded-2xl border border-line bg-surface">
          <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
            <h2 className="font-display text-sm font-semibold text-ink">Top of your team</h2>
            <Link href={"/partner/dashboard/network" as Route} className="text-xs text-ink-2 hover:text-ink">
              Whole network
            </Link>
          </header>
          {partnersQuery.isLoading ? (
            <p className="px-5 py-6 text-center text-sm text-ink-3">Loading…</p>
          ) : partnersQuery.isError ? (
            <p className="px-5 py-6 text-center text-sm text-red-400">Your team could not be loaded.</p>
          ) : !team?.items.length ? (
            <p className="px-5 py-6 text-center text-sm text-ink-3">
              Nobody has joined through your link yet.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {/* The server sorts by what each person has earned, so the first rows are the top ones. */}
              {team.items.slice(0, TOP_MEMBERS).map((member) => (
                <li key={member.user_id} className="flex items-start justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink">{memberName(member.display_name, member.email)}</p>
                    <p className="mt-0.5 text-xs text-ink-3">
                      {levelName(member.level)} · joined {shortDate(member.joined_at)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm tabular-nums text-ink">{money(member.earned.accrued, currency)}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wider text-ink-3">
                      Pending · {money(member.earned.settled, currency)} paid
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-line bg-surface p-5">
          <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-ink-3">01</p>
          <h3 className="mb-2 font-medium text-ink">Share your link</h3>
          <p className="text-sm leading-relaxed text-ink-2">
            New traders register on FXNOD through it and connect their Deriv account.
          </p>
        </article>
        <article className="rounded-2xl border border-line bg-surface p-5">
          <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-ink-3">02</p>
          <h3 className="mb-2 font-medium text-ink">They run a bot</h3>
          <p className="text-sm leading-relaxed text-ink-2">
            You earn a share of what FXNOD earns on their dBot and Auto Hub trades on a real account. Demo
            trades and dTrader earn nothing.
          </p>
        </article>
        <article className="rounded-2xl border border-line bg-surface p-5">
          <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-ink-3">03</p>
          <h3 className="mb-2 font-medium text-ink">Paid to your wallet</h3>
          <p className="text-sm leading-relaxed text-ink-2">
            Each month is paid after the broker settles it, in proportion to what the broker pays.
          </p>
        </article>
      </div>
    </section>
  );
}
