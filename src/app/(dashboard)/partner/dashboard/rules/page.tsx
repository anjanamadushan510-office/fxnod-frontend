"use client";

import { levelMeaning, levelName, percent, productName } from "@/lib/partner";
import { useGetCommissionRates } from "@/services/api/endpoints/referrals/referrals";
import type { CommissionRate } from "@/services/api/model";

const RULES: { title: string; body: string }[] = [
  {
    title: "What earns",
    body: "Trades that dBot and Auto Hub place on a real Deriv account. Demo accounts and manual trades in dTrader earn nothing.",
  },
  {
    title: "What a rate is a share of",
    body: "FXNOD earns a small amount on each of those trades. Your rate is a percentage of that amount, not of the trader's stake or profit. It is the same whether the trade wins or loses.",
  },
  {
    title: "When it is recorded",
    body: "The moment the trade is placed. It appears under Earnings as pending, with the month it belongs to.",
  },
  {
    title: "When it is paid",
    body: "Month by month. After the broker pays FXNOD for a calendar month (counted in UTC), the pending commission of that month is paid into your FXNOD wallet.",
  },
  {
    title: "If the broker pays less",
    body: "When the broker's payment for a month is smaller than the amount recorded for it, every commission of that month is paid in the same proportion. The history shows what was paid beside what was recorded. The difference is not carried to a later month.",
  },
  {
    title: "Currency",
    body: "Commission is counted and paid in US dollars, into a wallet held in USDT. Trades on an account in another currency are not counted in these totals.",
  },
  {
    title: "Review",
    body: "A commission can be held for a person to look at before it is paid. It stays pending and its amount does not change while that happens.",
  },
];

export default function PartnerRulesPage() {
  const ratesQuery = useGetCommissionRates();
  const rates = ratesQuery.data?.rates ?? [];

  // Grouped for display only. The server already sends them in product, then
  // level, order.
  const products = Array.from(new Set(rates.map((rate) => rate.source_type)));

  return (
    <section data-view="partner-rules" className="space-y-6 p-4 lg:p-8">
      <article className="min-w-0 overflow-hidden rounded-2xl border border-line bg-surface">
        <header className="border-b border-line px-5 py-4">
          <h2 className="font-display text-sm font-semibold text-ink">Your rates</h2>
          <p className="mt-1 text-xs text-ink-3">
            The share of FXNOD&apos;s earnings you receive, by where the trader sits in your team.
          </p>
        </header>
        {ratesQuery.isLoading ? (
          <p className="px-5 py-6 text-center text-sm text-ink-3">Loading…</p>
        ) : ratesQuery.isError ? (
          <p className="px-5 py-6 text-center text-sm text-red-400">The rates could not be loaded.</p>
        ) : !rates.length ? (
          <p className="px-5 py-6 text-center text-sm text-ink-3">No rate is in force at the moment.</p>
        ) : (
          products.map((product) => (
            <ProductRates
              key={product}
              product={product}
              rates={rates.filter((rate) => rate.source_type === product)}
              showName={products.length > 1}
            />
          ))
        )}
      </article>

      <article className="rounded-2xl border border-line bg-surface">
        <header className="border-b border-line px-5 py-4">
          <h2 className="font-display text-sm font-semibold text-ink">How it works</h2>
        </header>
        <dl className="divide-y divide-line">
          {RULES.map((rule) => (
            <div key={rule.title} className="px-5 py-4 sm:grid sm:grid-cols-[200px_1fr] sm:gap-6">
              <dt className="text-sm font-medium text-ink">{rule.title}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink-2 sm:mt-0">{rule.body}</dd>
            </div>
          ))}
        </dl>
      </article>
    </section>
  );
}

function ProductRates({
  product,
  rates,
  showName,
}: {
  product: string;
  rates: CommissionRate[];
  showName: boolean;
}) {
  return (
    <div className="border-b border-line last:border-b-0">
      {showName && (
        <p className="px-5 pt-4 text-[11px] uppercase tracking-[0.14em] text-ink-3">{productName(product)}</p>
      )}
      <ul className="grid grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {rates.map((rate) => (
          <li key={rate.level} className="px-5 py-5">
            <p className="font-display text-3xl font-semibold tabular-nums text-ink">{percent(rate.percentage)}</p>
            <p className="mt-2 text-sm text-ink">{levelName(rate.level)}</p>
            <p className="mt-0.5 text-xs text-ink-3">{levelMeaning(rate.level)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
