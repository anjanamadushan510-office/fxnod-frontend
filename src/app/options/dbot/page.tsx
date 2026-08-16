import type { Route } from "next";
import Link from "next/link";
import { TopNav } from "@/components/layout/TopNav";
import { cn } from "@/lib/cn";

/**
 * /options/dbot — automated trading.
 *
 * Placeholder. The route exists so the platform picker works end to end, but
 * the dashboard is not wired up yet: it depends on the backend `auto_*`
 * endpoints (start / stop / pause / resume / list strategies) and the bot
 * worker, which are still being built in `trading-engine-deriv`.
 *
 * Deliberately NOT a mock dashboard with invented numbers. A screen showing a
 * running bot and a P&L figure that nothing produced is indistinguishable from
 * a real one at a glance, and on a trading platform that is the kind of thing
 * someone acts on. Replace this wholesale once the API is live.
 */

const UPCOMING = [
  "Pick a bot — Accumulator and Multiplier first, more to follow",
  "Set your stake, take-profit and session limits before it starts",
  "Live P&L, win rate and full trade history for the session",
  "Charts with Bollinger Bands, RSI and moving averages",
  "Stop the bot at any time — it also stops itself when a limit is hit",
];

export default function DBotPage() {
  return (
    <>
      <TopNav />

      <div className="mx-auto flex max-w-[720px] flex-col gap-7 px-8 pb-20 pt-12 max-lg:px-4 max-lg:pt-8">
        <nav className="text-[13px] text-ink-3">
          <Link
            href={"/options" as Route}
            className="font-semibold text-gold-3 transition-colors hover:text-gold"
          >
            ← Options
          </Link>
        </nav>

        <header className="flex flex-col gap-2.5">
          <div className="flex items-center gap-3">
            <h1 className="m-0 text-[26px] font-bold tracking-[-0.02em] text-ink max-lg:text-[22px]">
              dBot
            </h1>
            <span className="rounded-full bg-gold-soft px-2.5 py-1 text-[11px] font-semibold text-gold-3">
              In development
            </span>
          </div>
          <p className="m-0 text-[14px] leading-relaxed text-ink-3">
            Automated options trading. The interface is being built now and is
            not available yet — nothing here trades, and no bot is running on
            your account.
          </p>
        </header>

        <section
          className={cn(
            "flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 shadow-card",
          )}
        >
          <h2 className="m-0 text-[15px] font-bold tracking-[-0.01em] text-ink">
            What dBot will do
          </h2>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {UPCOMING.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink-2"
              >
                <span
                  aria-hidden="true"
                  className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <p className="m-0 text-[13px] leading-relaxed text-ink-3">
          Manual trading is available now in{" "}
          <Link
            href={"/options/dtrader" as Route}
            className="font-semibold text-gold-3 transition-colors hover:text-gold"
          >
            dTrader
          </Link>
          .
        </p>
      </div>
    </>
  );
}
