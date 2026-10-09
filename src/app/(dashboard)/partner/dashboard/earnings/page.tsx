"use client";

import { useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { StatCard } from "@/components/partner/StatCard";
import { cn } from "@/lib/cn";
import { isZero, levelMeaning, levelName, memberName, money, monthName, productName, shortDate } from "@/lib/partner";
import { useGetCommissionHistory } from "@/services/api/endpoints/commissions/commissions";
import { useGetPartnerEarnings } from "@/services/api/endpoints/referrals/referrals";
import { CommissionStatus } from "@/services/api/model";
import type { CommissionLedgerEntry, GetCommissionHistoryParams } from "@/services/api/model";

const PAGE_SIZE = 25;

const STATUS_LABEL: Record<CommissionStatus, string> = {
  accrued: "Pending",
  settled: "Paid",
  cancelled: "Cancelled",
};

const SELECT_CLASS =
  "h-10 min-w-0 rounded-lg border border-line bg-bg px-3 text-sm text-ink outline-none focus:border-ink-3";

interface Filters {
  status: CommissionStatus | "";
  sourceType: string;
  level: string;
  period: string;
}

const NO_FILTERS: Filters = { status: "", sourceType: "", level: "", period: "" };

export default function PartnerEarningsPage() {
  const earningsQuery = useGetPartnerEarnings();
  const earnings = earningsQuery.data;
  const currency = earnings?.currency ?? "USD";

  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [offset, setOffset] = useState(0);

  // Every filter is the server's. A page of the ledger sifted in the browser
  // would show "no rows" for a month whose rows are simply on another page.
  const params: GetCommissionHistoryParams = {
    limit: PAGE_SIZE,
    offset,
    ...(filters.status && { status: filters.status }),
    ...(filters.sourceType && { source_type: filters.sourceType }),
    ...(filters.level && { level: Number(filters.level) }),
    ...(filters.period && { period: filters.period }),
  };
  const historyQuery = useGetCommissionHistory(params, { query: { placeholderData: keepPreviousData } });
  const history = historyQuery.data;
  const total = history?.total ?? 0;
  const filtered = Object.values(filters).some(Boolean);

  function change(patch: Partial<Filters>) {
    setFilters((current) => ({ ...current, ...patch }));
    setOffset(0);
  }

  const levels = earnings?.by_level.map((row) => row.level) ?? [];
  const sources = earnings?.by_source.map((row) => row.source_type) ?? [];

  return (
    <section data-view="partner-earnings" className="space-y-6 p-4 lg:p-8">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Pending" value={money(earnings?.total.accrued, currency)} note="Earned and not yet paid" />
        <StatCard label="Paid" value={money(earnings?.total.settled, currency)} note="To your FXNOD wallet" />
        <StatCard
          label="In review"
          value={money(earnings?.total.pending_review, currency)}
          note="Part of pending, checked before it is paid"
        />
        <StatCard
          label="Entries"
          value={earnings ? String(earnings.total.count) : "—"}
          note="Commissions behind these figures"
        />
      </div>

      <article className="min-w-0 overflow-hidden rounded-2xl border border-line bg-surface">
        <header className="border-b border-line px-5 py-4">
          <h2 className="font-display text-sm font-semibold text-ink">By product and level</h2>
          <p className="mt-1 text-xs text-ink-3">Pending first, then what has been paid.</p>
        </header>
        {earningsQuery.isLoading ? (
          <p className="px-5 py-6 text-center text-sm text-ink-3">Loading…</p>
        ) : earningsQuery.isError ? (
          <p className="px-5 py-6 text-center text-sm text-red-400">Your earnings could not be loaded.</p>
        ) : !earnings?.matrix.length ? (
          <p className="px-5 py-6 text-center text-sm text-ink-3">Nothing earned yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[11px] uppercase tracking-[0.14em] text-ink-3">
                  <th scope="col" className="px-5 py-3 font-normal">Product</th>
                  {earnings.by_level.map((row) => (
                    <th key={row.level} scope="col" className="px-5 py-3 text-right font-normal" title={levelMeaning(row.level)}>
                      {levelName(row.level)}
                    </th>
                  ))}
                  <th scope="col" className="px-5 py-3 text-right font-normal">All levels</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {earnings.by_source.map((source) => (
                  <tr key={source.source_type}>
                    <th scope="row" className="px-5 py-3.5 text-left font-normal text-ink">
                      {productName(source.source_type)}
                    </th>
                    {earnings.by_level.map((row) => {
                      const cell = earnings.matrix.find(
                        (item) => item.source_type === source.source_type && item.level === row.level,
                      );
                      return (
                        <td key={row.level} className="px-5 py-3.5 text-right">
                          <Amounts pending={cell?.amounts.accrued} paid={cell?.amounts.settled} currency={currency} />
                        </td>
                      );
                    })}
                    <td className="px-5 py-3.5 text-right">
                      <Amounts pending={source.amounts.accrued} paid={source.amounts.settled} currency={currency} />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-line">
                  <th scope="row" className="px-5 py-3.5 text-left font-medium text-ink">All products</th>
                  {earnings.by_level.map((row) => (
                    <td key={row.level} className="px-5 py-3.5 text-right">
                      <Amounts pending={row.amounts.accrued} paid={row.amounts.settled} currency={currency} />
                    </td>
                  ))}
                  <td className="px-5 py-3.5 text-right">
                    <Amounts pending={earnings.total.accrued} paid={earnings.total.settled} currency={currency} />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </article>

      <article className="min-w-0 overflow-hidden rounded-2xl border border-line bg-surface">
        <header className="space-y-3 border-b border-line px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-sm font-semibold text-ink">Commission history</h2>
            {filtered && (
              <button type="button" onClick={() => change(NO_FILTERS)} className="text-xs text-ink-2 hover:text-ink">
                Clear filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <select
              aria-label="Status"
              value={filters.status}
              onChange={(event) => change({ status: event.target.value as Filters["status"] })}
              className={SELECT_CLASS}
            >
              <option value="">Any status</option>
              {Object.values(CommissionStatus).map((status) => (
                <option key={status} value={status}>{STATUS_LABEL[status]}</option>
              ))}
            </select>
            <select
              aria-label="Product"
              value={filters.sourceType}
              onChange={(event) => change({ sourceType: event.target.value })}
              className={SELECT_CLASS}
            >
              <option value="">Any product</option>
              {sources.map((source) => (
                <option key={source} value={source}>{productName(source)}</option>
              ))}
            </select>
            <select
              aria-label="Level"
              value={filters.level}
              onChange={(event) => change({ level: event.target.value })}
              className={SELECT_CLASS}
            >
              <option value="">Any level</option>
              {levels.map((level) => (
                <option key={level} value={level}>{levelName(level)}</option>
              ))}
            </select>
            <input
              type="month"
              aria-label="Month"
              value={filters.period}
              onChange={(event) => change({ period: event.target.value })}
              className={SELECT_CLASS}
            />
          </div>
        </header>

        {historyQuery.isLoading ? (
          <p className="px-5 py-6 text-center text-sm text-ink-3">Loading…</p>
        ) : historyQuery.isError ? (
          <p className="px-5 py-6 text-center text-sm text-red-400">The history could not be loaded.</p>
        ) : !history?.items.length ? (
          <p className="px-5 py-6 text-center text-sm text-ink-3">
            {filtered ? "No commission matches these filters." : "No commission yet."}
          </p>
        ) : (
          <ul className={cn("divide-y divide-line", historyQuery.isPlaceholderData && "opacity-60")}>
            {history.items.map((entry) => (
              <HistoryRow key={entry.id} entry={entry} />
            ))}
          </ul>
        )}

        {total > PAGE_SIZE && (
          <footer className="flex items-center justify-between gap-3 border-t border-line px-5 py-3">
            <p className="text-xs tabular-nums text-ink-3">
              {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
                disabled={offset === 0}
                className="h-10 rounded-lg border border-line px-4 text-sm text-ink hover:bg-surface-2 disabled:opacity-40"
              >
                Newer
              </button>
              <button
                type="button"
                onClick={() => setOffset(offset + PAGE_SIZE)}
                disabled={offset + PAGE_SIZE >= total}
                className="h-10 rounded-lg border border-line px-4 text-sm text-ink hover:bg-surface-2 disabled:opacity-40"
              >
                Older
              </button>
            </div>
          </footer>
        )}
      </article>
    </section>
  );
}

function Amounts({ pending, paid, currency }: { pending?: string; paid?: string; currency: string }) {
  const empty = isZero(pending) && isZero(paid);
  return (
    <div className={cn("tabular-nums", empty && "opacity-40")}>
      <p className="text-ink">{money(pending ?? "0", currency)}</p>
      <p className="mt-0.5 text-xs text-ink-3">{money(paid ?? "0", currency)} paid</p>
    </div>
  );
}

function HistoryRow({ entry }: { entry: CommissionLedgerEntry }) {
  // A settled row paid `settled_amount` when the broker's payout for the month
  // fell short of the markup recorded, and the full commission otherwise.
  const paidShort = entry.status === "settled" && entry.settled_amount != null;
  const amount = paidShort ? (entry.settled_amount as string) : entry.commission_amount;
  const status = entry.status === "accrued" && entry.review_required ? "In review" : STATUS_LABEL[entry.status];

  return (
    <li className="flex items-start justify-between gap-3 px-5 py-3.5">
      <div className="min-w-0">
        <p className="truncate text-sm text-ink">{memberName(entry.source_display_name, entry.source_email)}</p>
        <p className="mt-0.5 text-xs text-ink-3">
          {productName(entry.source_type)} · {levelName(entry.level)} · {shortDate(entry.accrued_at)}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className={cn("text-sm tabular-nums text-ink", entry.status === "cancelled" && "line-through opacity-60")}>
          {money(amount, entry.currency)}
        </p>
        <p className="mt-0.5 text-[10px] uppercase tracking-wider text-ink-3">
          {status}
          {paidShort && ` · of ${money(entry.commission_amount, entry.currency)}`}
          {entry.status === "accrued" && ` · ${monthName(entry.deriv_settlement_period)}`}
        </p>
      </div>
    </li>
  );
}
