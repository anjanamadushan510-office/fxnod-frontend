"use client";

import { useMemo, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { ExpandIcon } from "@/components/ui/Icons";
import { BotChart } from "@/components/bot/BotChart";
import { BotTopBar } from "@/components/bot/BotTopBar";
import { BOTS } from "@/components/bot/catalog";
import { HistoryTable } from "@/components/bot/HistoryTable";
import {
  SAMPLE_SESSION,
  SAMPLE_TRADES,
  sampleCandles,
} from "@/components/bot/sampleSession";
import { CounterStrip, SessionStats } from "@/components/bot/SessionStats";
import { SelectBot } from "@/components/bot/SelectBot";
import { TradeConfiguration } from "@/components/bot/TradeConfiguration";
import type { BotConfig } from "@/components/bot/types";

/**
 * /options/dbot — automated trading.
 *
 * PREVIEW. The layout, controls and chart are real components, but the session
 * figures come from `sampleSession.ts`, not from an account: the backend
 * `auto_*` endpoints and the bot worker are still being built. The banner says
 * so on screen — a trading dashboard showing a "Running" bot and a P&L that
 * nothing produced is indistinguishable from a real one at a glance.
 *
 * To wire it up: replace the three sample imports with the generated `auto_*`
 * hooks, drive `status` from the run row, and delete sampleSession.ts. The
 * component props are already shaped like the backend's bot_runs aggregates, so
 * nothing below should need restructuring.
 */

const DEFAULT_CONFIG: BotConfig = {
  marketId: "vol_75_1s",
  direction: "up",
  multiplier: 2,
  currency: "USD",
  stake: 10,
  takeProfit: 50,
  martingaleEnabled: false,
  sessionStopLossEnabled: false,
  sessionStopLoss: 100,
  sessionTargetProfitEnabled: true,
  sessionTargetProfit: 100,
};

type ActivityTab = "history" | "chart" | "positions";

export default function DBotPage() {
  const [selectedBot, setSelectedBot] = useState(BOTS[0].id);
  const [config, setConfig] = useState<BotConfig>(DEFAULT_CONFIG);
  const [tab, setTab] = useState<ActivityTab>("history");

  const candles = useMemo(() => sampleCandles(90), []);
  const session = SAMPLE_SESSION;
  const running = session.status === "running";

  return (
    <div
      data-app="options"
      data-opt-theme="light"
      className="flex min-h-screen flex-col bg-opt-bg font-sans text-opt-ink"
    >
      <BotTopBar loginId="CR12345678" balance={10245.68} currency="USD" />

      <PreviewBanner />

      <div className="grid flex-1 grid-cols-[300px_1fr] gap-4 p-4 max-xl:grid-cols-1">
        {/* ── Left rail: bot picker + configuration ─────────────────── */}
        <aside className="flex flex-col gap-5 rounded-[var(--opt-radius)] border border-opt-line bg-opt-bg-elev p-4">
          <SelectBot
            bots={BOTS}
            selectedId={selectedBot}
            onSelect={setSelectedBot}
            disabled={running}
          />
          <div className="h-px w-full bg-opt-line" />
          <TradeConfiguration
            config={config}
            onChange={(patch) => setConfig((prev) => ({ ...prev, ...patch }))}
            disabled={running}
          />
        </aside>

        {/* ── Main: stats, counters, activity ───────────────────────── */}
        <main className="flex min-w-0 flex-col gap-4">
          <SessionStats session={session} />
          <CounterStrip session={session} />

          <section className="flex min-h-[420px] flex-1 flex-col overflow-hidden rounded-[var(--opt-radius)] border border-opt-line bg-opt-bg-elev">
            <div className="flex shrink-0 items-center gap-1 border-b border-opt-line px-2">
              {(["history", "chart", "positions"] as const).map((key) => (
                <Tab
                  key={key}
                  active={tab === key}
                  onClick={() => setTab(key)}
                  label={key === "history" ? "History" : key === "chart" ? "Chart" : "Positions"}
                />
              ))}
              <ChartToolbar />
            </div>

            {/* The Chart tab gives the chart the full panel; the other two split
                it with the trade list, as in the design. */}
            <div
              className={cn(
                "grid min-h-0 flex-1 max-lg:grid-cols-1",
                tab === "chart" ? "grid-cols-1" : "grid-cols-2",
              )}
            >
              {tab !== "chart" && (
                <div className="flex min-h-0 flex-col border-r border-opt-line max-lg:border-b max-lg:border-r-0">
                  {tab === "history" ? (
                    <HistoryTable trades={SAMPLE_TRADES} />
                  ) : (
                    <HistoryTable
                      trades={SAMPLE_TRADES.filter((t) => t.result === "open")}
                    />
                  )}
                </div>
              )}

              <BotChart candles={candles} />
            </div>
          </section>

          <div className="flex shrink-0 items-center justify-end gap-3">
            <button
              type="button"
              disabled
              title="Available once the bot API is connected"
              className={cn(
                "inline-flex items-center gap-2 rounded-[var(--opt-radius-sm)] px-6 py-2.5",
                "bg-opt-fall text-[13px] font-bold text-white",
                "disabled:cursor-not-allowed disabled:opacity-45",
              )}
            >
              <span aria-hidden="true">■</span>
              Stop Bot
            </button>
            <button
              type="button"
              disabled
              title="Available once the bot API is connected"
              className={cn(
                "inline-flex items-center gap-2 rounded-[var(--opt-radius-sm)] border border-opt-line",
                "bg-opt-bg-elev px-6 py-2.5 text-[13px] font-semibold text-opt-ink-2",
                "disabled:cursor-not-allowed disabled:opacity-45",
              )}
            >
              <span aria-hidden="true">⚙</span>
              Setup
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

function PreviewBanner() {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-x-2 gap-y-1 border-b border-opt-line bg-opt-bg-sunk px-5 py-2 text-[11px] text-opt-ink-2">
      <span className="rounded-full bg-gold-soft px-2 py-0.5 font-semibold text-gold-3">
        Preview
      </span>
      <span>
        Layout preview with sample figures. No bot is running and nothing here is
        connected to your account.
      </span>
      <Link
        href={"/options/dtrader" as Route}
        className="font-semibold text-gold-3 underline-offset-2 hover:underline"
      >
        Go to dTrader
      </Link>
    </div>
  );
}

function Tab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "relative px-4 py-3 text-[13px] font-semibold transition-colors",
        active ? "text-opt-rise" : "text-opt-ink-3 hover:text-opt-ink-2",
      )}
    >
      {label}
      {active && (
        <span
          aria-hidden="true"
          className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-opt-rise"
        />
      )}
    </button>
  );
}

/**
 * Chart controls from the design. Inert for now — interval, chart type and the
 * indicator picker all need the live candle feed behind them, so they are
 * disabled rather than wired to nothing.
 */
function ChartToolbar() {
  return (
    <div className="ml-auto flex items-center gap-1.5 pr-2">
      {["1m", "Candles", "Indicators"].map((label) => (
        <button
          key={label}
          type="button"
          disabled
          title="Available once the live candle feed is connected"
          className={cn(
            "rounded-[var(--opt-radius-sm)] border border-opt-line px-2.5 py-1",
            "text-[11px] font-medium text-opt-ink-2 disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {label}
        </button>
      ))}
      <button
        type="button"
        disabled
        aria-label="Expand chart"
        title="Available once the live candle feed is connected"
        className={cn(
          "grid h-[26px] w-[26px] place-items-center rounded-[var(--opt-radius-sm)]",
          "border border-opt-line text-opt-ink-2 disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <ExpandIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
