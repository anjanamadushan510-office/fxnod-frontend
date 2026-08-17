"use client";

import { useEffect, useMemo, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { BotChart } from "@/components/bot/BotChart";
import { BotTopBar } from "@/components/bot/BotTopBar";
import { HistoryTable } from "@/components/bot/HistoryTable";
import { SelectBot } from "@/components/bot/SelectBot";
import { CounterStrip, SessionStats } from "@/components/bot/SessionStats";
import { TradeConfiguration } from "@/components/bot/TradeConfiguration";
import { BOT_MARKET_IDS } from "@/components/bot/botMeta";
import { toDerivSymbol } from "@/services/deriv/derivSymbols";
import {
  buildStartRequest,
  defaultFormState,
  type BotFormState,
} from "@/components/bot/formState";
import { useBotCandles } from "@/components/bot/useBotCandles";
import type { BotSession, BotTrade } from "@/components/bot/types";
import {
  useGetBotLimits,
  useGetBotRun,
  useListBotRunTrades,
  useListBotRuns,
  useListBotStrategies,
  useStartBotRun,
  useStopBotRun,
} from "@/services/api/endpoints/bots/bots";
import type {
  BotLimitAdjustment,
  BotRun,
  BotRunTrade,
  BotStrategy,
} from "@/services/api/model";

/**
 * /options/dbot — automated trading.
 *
 * Wired to the backend: the bot list, the platform caps and the run state all
 * come from the API. Nothing on this page decides anything about money —
 * starting a run POSTs a configuration, and the bot-worker process does the
 * trading. That separation is why closing this tab does not stop a bot, and
 * equally why it cannot disable one's stop loss.
 */
export default function DBotPage() {
  const strategiesQuery = useListBotStrategies();
  const limitsQuery = useGetBotLimits();
  const runsQuery = useListBotRuns({ limit: 20 });

  // Memoised because `?? []` produces a new array on every render, and this
  // value is a dependency of the effect below — without it that effect re-ran
  // on each render rather than when the catalogue actually arrived.
  const strategies: BotStrategy[] = useMemo(
    () => strategiesQuery.data?.strategies ?? [],
    [strategiesQuery.data],
  );
  const [selectedId, setSelectedId] = useState<string>("");
  const [form, setForm] = useState<BotFormState>(defaultFormState);
  const [tab, setTab] = useState<"history" | "chart" | "positions">("history");
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  // Select the first bot once the catalogue arrives, rather than hard-coding an
  // id the backend may not offer.
  useEffect(() => {
    if (!selectedId && strategies.length > 0) {
      setSelectedId(strategies[0].strategy_id);
    }
  }, [selectedId, strategies]);

  const selected = strategies.find((s) => s.strategy_id === selectedId);

  // The active run drives the whole screen: an active one locks the form and
  // turns Start into Stop.
  const activeRun = useMemo(
    () => (runsQuery.data?.runs ?? []).find(isActive),
    [runsQuery.data],
  );

  // Poll only while a run is live — there is nothing to refresh otherwise.
  const runQuery = useGetBotRun(activeRun?.run_id ?? "", {
    query: { enabled: Boolean(activeRun), refetchInterval: 3000 },
  });
  const run = runQuery.data ?? activeRun;

  // The run's trades. Polled alongside the run itself while it is live, and
  // fetched once for a finished one — a completed run's history never changes.
  const tradesQuery = useListBotRunTrades(
    run?.run_id ?? "",
    { limit: 50 },
    {
      query: {
        enabled: Boolean(run?.run_id),
        refetchInterval: run && isActive(run) ? 3000 : false,
      },
    },
  );
  const trades = tradesQuery.data?.trades ?? [];

  const startMutation = useStartBotRun();
  const stopMutation = useStopBotRun();

  const busy = startMutation.isPending || stopMutation.isPending;
  const running = Boolean(run && isActive(run));

  async function handleStart() {
    if (!selected) return;
    setErrors([]);
    setNotice(null);

    const contractType = selected.supported_contract_types[0];
    const { request, errors: problems } = buildStartRequest(
      selected.strategy_id,
      contractType,
      form,
    );
    if (!request) {
      setErrors(problems);
      return;
    }

    try {
      const res = await startMutation.mutateAsync({ data: request });
      const adjustments = res.limit_adjustments ?? [];
      if (adjustments.length > 0) {
        // A clamped limit is not an error, but the user must not be left
        // believing the number they typed was honoured.
        setNotice(
          "The platform capped: " +
            adjustments
              .map((a: BotLimitAdjustment) => `${a.field} ${a.requested} → ${a.applied}`)
              .join(", "),
        );
      }
      await runsQuery.refetch();
    } catch (err) {
      setErrors([apiMessage(err)]);
    }
  }

  async function handleStop() {
    if (!run) return;
    setErrors([]);
    try {
      await stopMutation.mutateAsync({ id: run.run_id });
      await runsQuery.refetch();
    } catch (err) {
      setErrors([apiMessage(err)]);
    }
  }

  const session = toSession(run, form.currency, tradesQuery.data?.summary);

  // Live candles for the chart. Follows the RUN's symbol while one is active so
  // the chart shows what the bot is actually trading, and the form's selection
  // otherwise so a user can look before starting.
  const chartMarketId = run && isActive(run) ? derivToMarketId(run.symbol) : form.marketId;
  const { candles, ready: chartReady } = useBotCandles(chartMarketId);

  return (
    <div
      data-app="options"
      data-opt-theme="light"
      className="flex min-h-screen flex-col bg-opt-bg font-sans text-opt-ink"
    >
      <BotTopBar
        loginId={run?.deriv_account_id ?? "—"}
        balance={0}
        currency={form.currency}
        isVirtual={run?.is_virtual ?? true}
      />

      {strategiesQuery.isError && (
        <Banner tone="error">
          Could not load the bot list. The trading engine may be unavailable.
        </Banner>
      )}
      {notice && <Banner tone="info">{notice}</Banner>}
      {errors.length > 0 && (
        <Banner tone="error">{errors.join(" · ")}</Banner>
      )}

      <div className="grid flex-1 grid-cols-[320px_1fr] gap-4 p-4 max-xl:grid-cols-1">
        <aside className="flex flex-col gap-5 self-start rounded-[var(--opt-radius)] border border-opt-line bg-opt-bg-elev p-4">
          <SelectBot
            bots={strategies.map((s) => ({
              id: s.strategy_id,
              name: s.display_name,
              tagline: s.description ?? "",
              contractType: s.supported_contract_types[0] ?? "",
            }))}
            selectedId={selectedId}
            onSelect={setSelectedId}
            disabled={running}
          />

          <div className="h-px w-full bg-opt-line" />

          {selected && (
            <TradeConfiguration
              strategyId={selected.strategy_id}
              state={form}
              onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
              disabled={running}
              maxStakePerTrade={limitsQuery.data?.max_stake_per_trade}
              maxSessionLoss={limitsQuery.data?.max_session_loss}
            />
          )}
        </aside>

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
            </div>

            <div
              className={cn(
                "grid min-h-0 flex-1 max-lg:grid-cols-1",
                tab === "chart" ? "grid-cols-1" : "grid-cols-2",
              )}
            >
              {tab !== "chart" && (
                <div className="flex min-h-0 flex-col border-r border-opt-line max-lg:border-b max-lg:border-r-0">
                  <HistoryTable
                    trades={toTradeRows(
                      tab === "positions" ? trades.filter(isOpenTrade) : trades,
                    )}
                  />
                </div>
              )}
              {chartReady ? (
                <BotChart candles={candles} />
              ) : (
                <ChartWarmingUp />
              )}
            </div>
          </section>

          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
            <p className="m-0 max-w-[46ch] text-[11px] leading-relaxed text-opt-ink-3">
              {running
                ? "Running on the server. You can close this tab — the bot keeps going, and its session limits keep applying."
                : "The bot stops itself when a session limit is reached, whether or not this tab is open."}
            </p>

            <div className="flex items-center gap-3">
              {running ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleStop}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-[var(--opt-radius-sm)] px-6 py-2.5",
                    "bg-opt-fall text-[13px] font-bold text-white",
                    "transition-opacity hover:opacity-90 disabled:opacity-45",
                  )}
                >
                  <span aria-hidden="true">■</span>
                  {stopMutation.isPending ? "Stopping…" : "Stop Bot"}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={busy || !selected}
                  onClick={handleStart}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-[var(--opt-radius-sm)] px-6 py-2.5",
                    "bg-opt-rise text-[13px] font-bold text-white",
                    "transition-opacity hover:opacity-90 disabled:opacity-45",
                  )}
                >
                  <span aria-hidden="true">▶</span>
                  {startMutation.isPending ? "Starting…" : "Start Bot"}
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── helpers ─────────────────────────────────────────────────────────────────

const ACTIVE_STATUSES = new Set(["pending", "running", "paused", "stopping"]);

function isActive(run: BotRun): boolean {
  return ACTIVE_STATUSES.has(run.status ?? "");
}

/**
 * Turns API trades into the history table's rows.
 *
 * Time is rendered in the viewer's locale rather than the server's: a user
 * reconciling their own trades reads their own clock.
 */
function toTradeRows(trades: BotRunTrade[]): BotTrade[] {
  return trades.map((t) => ({
    id: t.trade_id,
    time: new Date(t.created_at).toLocaleTimeString(),
    direction: t.side === "fall" ? "down" : "up",
    stake: Number.parseFloat(t.stake_amount) || 0,
    result: t.outcome === "won" ? "won" : t.outcome === "lost" ? "lost" : "open",
    // null, not 0, while unsettled — the table renders "--" rather than a
    // break-even figure the contract has not actually produced.
    pnl: t.profit_loss === undefined ? null : Number.parseFloat(t.profit_loss),
  }));
}

function isOpenTrade(t: BotRunTrade): boolean {
  return t.outcome === undefined;
}

/** Maps an API run onto the stats components' shape. */
function toSession(
  run: BotRun | undefined,
  currency: string,
  summary?: { total: number; won: number; lost: number; realized_pnl: string; total_staked: string },
): BotSession {
  if (!run) {
    return {
      status: "idle",
      realizedPnl: 0,
      realizedPnlPct: 0,
      tradesTotal: 0,
      tradesWon: 0,
      tradesLost: 0,
      targetProfitProgress: 0,
      targetProfitLimit: 0,
      stopLossProgress: 0,
      stopLossLimit: 0,
      currency,
    };
  }

  // Prefer the trade summary when it is loaded: it is derived from the same
  // rows the table below is showing, so the headline figure and the list can
  // never disagree. The run's own counters are the fallback.
  const pnl = Number.parseFloat(summary?.realized_pnl ?? run.realized_pnl ?? "0") || 0;
  const staked = Number.parseFloat(summary?.total_staked ?? run.total_staked ?? "0") || 0;
  const limits = (run.risk_limits ?? {}) as Record<string, string>;
  const stopLossLimit = Number.parseFloat(limits.session_stop_loss ?? "0") || 0;
  const targetLimit = Number.parseFloat(limits.session_target_profit ?? "0") || 0;

  return {
    status: mapStatus(run.status),
    realizedPnl: pnl,
    // Against capital actually committed. Zero staked means no denominator
    // yet — 0% is the honest answer, not a division by zero.
    realizedPnlPct: staked > 0 ? (pnl / staked) * 100 : 0,
    tradesTotal: summary?.total ?? run.trades_total ?? 0,
    tradesWon: summary?.won ?? run.trades_won ?? 0,
    tradesLost: summary?.lost ?? run.trades_lost ?? 0,
    targetProfitProgress: Math.max(0, pnl),
    targetProfitLimit: targetLimit,
    // A loss is a negative P&L; the meter measures how much of the allowance
    // has been used.
    stopLossProgress: Math.max(0, -pnl),
    stopLossLimit: stopLossLimit,
    currency: run.currency ?? currency,
  };
}

function mapStatus(status: string | undefined): BotSession["status"] {
  switch (status) {
    case "running":
    case "pending":
      return "running";
    case "paused":
      return "paused";
    case "stopping":
      return "stopping";
    default:
      return "idle";
  }
}

/**
 * Pulls the server's message out of an Axios error.
 *
 * The API returns `{ detail }` and deliberately keeps internal causes in its
 * own logs, so whatever arrives here is safe to show.
 */
function apiMessage(err: unknown): string {
  const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data
    ?.detail;
  return detail ?? "Something went wrong. Please try again.";
}

/**
 * Maps a Deriv symbol back to a catalog id, so the chart can follow a run whose
 * symbol was recorded in Deriv's vocabulary. Falls back to the form's selection
 * when the symbol is not one the picker offers.
 */
function derivToMarketId(derivSymbol: string): string {
  for (const id of BOT_MARKET_IDS) {
    if (toDerivSymbol(id) === derivSymbol) return id;
  }
  return BOT_MARKET_IDS[0];
}

function ChartWarmingUp() {
  return (
    <div className="grid flex-1 place-items-center px-5 py-12">
      <p className="m-0 max-w-[30ch] text-center text-[12px] leading-relaxed text-opt-ink-3">
        Loading price history… the chart needs about 20 minutes of candles before
        the indicators can be drawn.
      </p>
    </div>
  );
}

function Banner({
  tone,
  children,
}: {
  tone: "info" | "error";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 flex-wrap items-center gap-2 border-b px-5 py-2 text-[11px]",
        tone === "error"
          ? "border-opt-line bg-opt-fall-soft text-opt-fall"
          : "border-opt-line bg-gold-soft text-gold-3",
      )}
    >
      {children}
      <Link
        href={"/options/dtrader" as Route}
        className="ml-auto font-semibold underline-offset-2 hover:underline"
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
