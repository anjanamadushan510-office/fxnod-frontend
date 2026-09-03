"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/cn";
import { BotChart } from "@/components/bot/BotChart";
import { BotPicker } from "@/components/bot/BotPicker";
import { BotTabs, type DraftTab } from "@/components/bot/BotTabs";
import { BotTopBar } from "@/components/bot/BotTopBar";
import { HistoryTable } from "@/components/bot/HistoryTable";
import { SessionStats } from "@/components/bot/SessionStats";
import { SplitHandle } from "@/components/bot/SplitHandle";
import { TradeConfiguration } from "@/components/bot/TradeConfiguration";
import { useResizable } from "@/components/bot/useResizable";
import { BOT_MARKET_IDS } from "@/components/bot/botMeta";
import {
  buildStartRequest,
  defaultFormState,
  type BotFormState,
} from "@/components/bot/formState";
import { useBotCandles } from "@/components/bot/useBotCandles";
import type { BotSession, BotTrade } from "@/components/bot/types";
import { useDerivStatus } from "@/hooks/useDerivStatus";
import { usePositionsWebSocket } from "@/hooks/usePositionsWebSocket";
import { toDerivSymbol } from "@/services/deriv/derivSymbols";
import { useAccountBalance } from "@/stores/useAccountBalance";
import { useAuthStore } from "@/stores/authStore";
import {
  getListBotRunsQueryKey,
  useGetBotLimits,
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
  ListBotRuns200,
} from "@/services/api/model";

/**
 * /options/dbot — automated trading.
 *
 * A tab per bot. An empty tab shows the bot picker; choosing a bot turns that
 * tab into its workspace — a configuration rail plus a work area split between
 * the trade list and the chart, both splits draggable and remembered.
 *
 * Choosing is a step rather than a permanent control in the rail, because it is
 * a decision made once: a run's strategy is snapshotted server-side at start and
 * cannot be swapped underneath it. A picker that sits there for the whole
 * session implies otherwise.
 *
 * Two more things the structure is deliberate about:
 *
 *   A tab for a RUNNING bot is a view of server state, not browser state. It
 *   survives a refresh, appears on another device, and cannot be closed — only
 *   stopped. Draft tabs (configurations not yet started) are local and closeable,
 *   because nothing is at stake in them.
 *
 *   Nothing here decides anything about money. Start POSTs a configuration and
 *   the bot-worker does the trading, which is why closing this tab does not stop
 *   a bot and equally why it cannot disable one's stop loss.
 */
/**
 * Shared by the runs query and by the cache write that seeds a just-started run
 * into it. They must agree exactly: orval builds the query key from these
 * params, so a second object literal here would write to a key nothing reads.
 */
const RUNS_PARAMS = { limit: 20 } as const;

export default function DBotPage() {
  const deriv = useDerivStatus();
  const authed = useAuthStore((s) => s.status === "authenticated");
  usePositionsWebSocket(authed);
  const accountBalance = useAccountBalance((s) => s.balance);
  const accountCurrency = useAccountBalance((s) => s.currency);

  const queryClient = useQueryClient();
  const strategiesQuery = useListBotStrategies();
  const limitsQuery = useGetBotLimits();
  const runsQuery = useListBotRuns(RUNS_PARAMS, {
    query: { refetchInterval: 3000 },
  });

  const strategies: BotStrategy[] = useMemo(
    () => strategiesQuery.data?.strategies ?? [],
    [strategiesQuery.data],
  );

  const activeRuns: BotRun[] = useMemo(
    () => (runsQuery.data?.runs ?? []).filter(isActive),
    [runsQuery.data],
  );

  /** True until the runs query has produced either data or an error. */
  const runsPending = runsQuery.isPending;

  const maxConcurrent = limitsQuery.data?.max_concurrent_runs ?? 1;
  const accountLossLimit = limitsQuery.data?.max_account_session_loss
    ? Number.parseFloat(limitsQuery.data.max_account_session_loss)
    : undefined;

  // ── Tabs ──────────────────────────────────────────────────────────────────
  // Drafts are keyed by a local id; their form state lives alongside them.
  const [drafts, setDrafts] = useState<DraftTab[]>([]);
  const [draftForms, setDraftForms] = useState<Record<string, BotFormState>>({});
  const [draftStrategies, setDraftStrategies] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string>("");

  const newDraft = useCallback(() => {
    const id = `draft-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    // No strategy yet — the tab opens on the picker, like a new browser tab
    // opening on its new-tab page.
    setDrafts((prev) => [...prev, { id, label: "New bot", sub: "choose a bot" }]);
    setDraftForms((prev) => ({ ...prev, [id]: defaultFormState() }));
    setActiveId(id);
    return id;
  }, []);

  // Open a draft when there is nothing to look at, so the page is never empty.
  //
  // The guard is load-bearing. "Nothing to look at" is only true once the server
  // has actually answered — while the runs query is still pending, an empty list
  // means "not known yet", and acting on it opened a picker tab above bots that
  // were already running. An error resolves the query too, deliberately: if the
  // engine is unreachable the user should still get a tab to configure in.
  useEffect(() => {
    if (runsPending) return;

    if (activeRuns.length === 0 && drafts.length === 0) {
      newDraft();
      return;
    }
    // Selection follows the server: a run that ended (or a draft that became a
    // run) must not leave the page pointing at a tab that no longer exists.
    const exists =
      activeRuns.some((r) => r.run_id === activeId) ||
      drafts.some((d) => d.id === activeId);
    if (!exists) {
      setActiveId(activeRuns[0]?.run_id ?? drafts[0]?.id ?? "");
    }
  }, [runsPending, activeRuns, drafts, activeId, newDraft]);

  const closeDraft = useCallback(
    (id: string) => {
      setDrafts((prev) => prev.filter((d) => d.id !== id));
      setDraftForms((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setDraftStrategies((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    },
    [],
  );

  /**
   * Put a just-started run into the runs cache without waiting for the poll.
   *
   * Only ever ADDS the row the server itself returned — it does not invent one
   * and does not edit an existing row — so the next refetch replaces it with the
   * same run rather than correcting an optimistic guess.
   */
  const adoptRun = useCallback(
    (run: BotRun) => {
      queryClient.setQueryData<ListBotRuns200>(
        getListBotRunsQueryKey(RUNS_PARAMS),
        (prev) => {
          const runs = prev?.runs ?? [];
          if (runs.some((r) => r.run_id === run.run_id)) return prev;
          return { ...prev, runs: [run, ...runs] };
        },
      );
    },
    [queryClient],
  );

  const activeRun = activeRuns.find((r) => r.run_id === activeId);
  const isDraft = !activeRun && Boolean(draftForms[activeId]);

  // ── The selected tab's configuration ──────────────────────────────────────
  const form = draftForms[activeId] ?? defaultFormState();
  const patchForm = useCallback(
    (patch: Partial<BotFormState>) => {
      setDraftForms((prev) => ({
        ...prev,
        [activeId]: { ...(prev[activeId] ?? defaultFormState()), ...patch },
      }));
    },
    [activeId],
  );

  // A live run's strategy is fixed — it was snapshotted server-side at start.
  // A draft has one only once the user has picked; there is deliberately no
  // fallback to the first strategy, because defaulting to a bot nobody chose is
  // how someone starts the wrong one.
  const selectedStrategyId = activeRun
    ? activeRun.strategy_id
    : (draftStrategies[activeId] ?? "");
  const selected = strategies.find((s) => s.strategy_id === selectedStrategyId);

  /** True while this tab is still the picker rather than a bot. */
  const picking = !activeRun && !selected;

  const selectStrategy = useCallback(
    (id: string) => setDraftStrategies((prev) => ({ ...prev, [activeId]: id })),
    [activeId],
  );

  /** Send a not-yet-started tab back to the picker. */
  const unselectStrategy = useCallback(() => {
    setDraftStrategies((prev) => {
      const next = { ...prev };
      delete next[activeId];
      return next;
    });
  }, [activeId]);

  // Tab labels follow the choice: an empty tab reads "New bot / choose a bot",
  // and becomes the bot's name the moment one is picked.
  const draftTabs: DraftTab[] = useMemo(
    () =>
      drafts.map((d) => {
        const strategyId = draftStrategies[d.id];
        const name = strategies.find(
          (s) => s.strategy_id === strategyId,
        )?.display_name;
        return {
          id: d.id,
          label: name ?? "New bot",
          sub: name ? "not started" : "choose a bot",
        };
      }),
    [drafts, draftStrategies, strategies],
  );

  const runningCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const run of activeRuns) {
      counts[run.strategy_id] = (counts[run.strategy_id] ?? 0) + 1;
    }
    return counts;
  }, [activeRuns]);

  // ── Trades for the selected run ───────────────────────────────────────────
  const tradesQuery = useListBotRunTrades(
    activeRun?.run_id ?? "",
    { limit: 50 },
    {
      query: {
        enabled: Boolean(activeRun?.run_id),
        refetchInterval: activeRun ? 3000 : false,
      },
    },
  );
  const trades = tradesQuery.data?.trades ?? [];

  // ── Chart ─────────────────────────────────────────────────────────────────
  const chartMarketId = activeRun
    ? derivToMarketId(activeRun.symbol)
    : form.marketId;
  // Not while the picker is up: a market subscription opened for a chart nobody
  // is looking at still costs a Deriv subscription slot.
  const { candles, ready: chartReady } = useBotCandles(chartMarketId, !picking);

  // ── Layout ────────────────────────────────────────────────────────────────
  const railSplit = useResizable({
    initial: 22,
    min: 15,
    max: 42,
    storageKey: "fxnod.dbot.rail",
    label: "Resize the configuration panel",
  });
  const workSplit = useResizable({
    initial: 42,
    min: 20,
    max: 75,
    storageKey: "fxnod.dbot.work",
    label: "Resize the trade list",
  });

  // ── Actions ───────────────────────────────────────────────────────────────
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const startMutation = useStartBotRun();
  const stopMutation = useStopBotRun();
  const busy = startMutation.isPending || stopMutation.isPending;

  async function handleStart() {
    if (!selected) return;
    setErrors([]);
    setNotice(null);

    const { request, errors: problems } = buildStartRequest(
      selected.strategy_id,
      selected.supported_contract_types[0],
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
        setNotice(
          "The platform capped: " +
            adjustments
              .map((a: BotLimitAdjustment) => `${a.field} ${a.requested} → ${a.applied}`)
              .join(", "),
        );
      }
      // The draft became a run: drop the draft and follow the new run.
      //
      // The started run goes into the runs cache FIRST, and that ordering is the
      // whole point. Closing the draft and waiting for the next poll left one
      // render with no drafts and no runs, which the "page is never empty"
      // effect read as an idle page — so starting a bot spawned a blank picker
      // tab and moved the user to it, and the bot they had just started looked
      // like it had gone nowhere. Seeding the cache means the run's tab exists
      // in the same render the draft's tab disappears.
      //
      // StartBotRunResponse types `run` as optional, so both are read
      // defensively — a 201 without one would otherwise leave the page pointing
      // at a draft that no longer exists.
      const newRun = res.run;
      if (newRun) adoptRun(newRun);
      closeDraft(activeId);
      if (newRun) setActiveId(newRun.run_id);
      await runsQuery.refetch();
    } catch (err) {
      setErrors([apiMessage(err)]);
    }
  }

  async function handleStop() {
    if (!activeRun) return;
    setErrors([]);
    try {
      await stopMutation.mutateAsync({ id: activeRun.run_id });
      await runsQuery.refetch();
    } catch (err) {
      setErrors([apiMessage(err)]);
    }
  }

  const session = toSession(activeRun, accountCurrency, tradesQuery.data?.summary);
  const accountPnl = useMemo(
    () =>
      activeRuns.reduce(
        (sum, r) => sum + (Number.parseFloat(r.realized_pnl) || 0),
        0,
      ),
    [activeRuns],
  );

  return (
    <div
      data-app="options"
      data-opt-theme="light"
      className="flex h-screen flex-col overflow-hidden bg-opt-bg font-sans text-opt-ink"
    >
      <BotTopBar
        loginId={deriv.accountId ?? (deriv.isLoading ? "…" : "Not connected")}
        balance={accountBalance}
        currency={accountCurrency}
        isVirtual={deriv.isVirtual}
      />

      <BotTabs
        runs={activeRuns}
        drafts={draftTabs}
        activeId={activeId}
        onSelect={setActiveId}
        onCloseDraft={closeDraft}
        onNewDraft={newDraft}
        maxConcurrent={maxConcurrent}
        strategyNames={Object.fromEntries(
          strategies.map((s) => [s.strategy_id, s.display_name]),
        )}
      />

      {strategiesQuery.isError && (
        <Banner tone="error">
          Could not load the bot list. The trading engine may be unavailable.
        </Banner>
      )}
      {!deriv.isLoading && !deriv.linked && (
        <Banner tone="error">
          No Deriv account is linked. Connect one in dTrader first — dBot trades
          the same account.
        </Banner>
      )}
      {notice && <Banner tone="info">{notice}</Banner>}
      {errors.length > 0 && <Banner tone="error">{errors.join(" · ")}</Banner>}

      {/* An empty tab is the picker; a chosen bot is the workspace. Nothing of
          the workspace renders while picking — a rail and an empty chart around
          a "choose a bot" screen would just be furniture. */}
      {picking ? (
        <BotPicker
          strategies={strategies}
          onSelect={selectStrategy}
          runningCounts={runningCounts}
          loading={strategiesQuery.isLoading}
        />
      ) : (
      <div ref={railSplit.containerRef} className="flex min-h-0 flex-1">
        <aside
          style={{ width: `${railSplit.size}%` }}
          className="flex min-w-0 flex-col gap-4 overflow-y-auto border-r border-opt-line bg-opt-bg-elev p-3"
        >
          {/* Only a draft can go back. A live run's strategy was snapshotted
              server-side at start; offering to change it would be a lie. */}
          {!activeRun && (
            <button
              type="button"
              onClick={unselectStrategy}
              className="-mb-1 flex w-fit items-center gap-1.5 text-[11px] font-semibold text-opt-ink-3 transition-colors hover:text-opt-ink"
            >
              <span aria-hidden="true">←</span>
              Choose a different bot
            </button>
          )}

          {selected && (
            <TradeConfiguration
              strategyId={selected.strategy_id}
              state={form}
              onChange={patchForm}
              disabled={Boolean(activeRun)}
              maxStakePerTrade={limitsQuery.data?.max_stake_per_trade}
              maxSessionLoss={limitsQuery.data?.max_session_loss}
            />
          )}
        </aside>

        <SplitHandle split={railSplit} />

        <main className="flex min-w-0 flex-1 flex-col gap-2 overflow-hidden p-3">
          <SessionStats
            session={session}
            accountPnl={accountPnl}
            accountLossLimit={accountLossLimit}
            activeRuns={activeRuns.length}
          />

          {/* Trade list | chart, also draggable. */}
          <div
            ref={workSplit.containerRef}
            className="flex min-h-0 flex-1 overflow-hidden rounded-[var(--opt-radius)] border border-opt-line bg-opt-bg-elev"
          >
            <div
              style={{ width: `${workSplit.size}%` }}
              className="flex min-w-0 flex-col overflow-hidden"
            >
              <SectionHeader
                title={activeRun ? "Trades" : "Trades"}
                hint={activeRun ? undefined : "Start the bot to see its trades"}
              />
              <HistoryTable trades={toTradeRows(trades)} />
            </div>

            <SplitHandle split={workSplit} />

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
              <SectionHeader title="Chart" hint={chartMarketId} />
              {chartReady ? <BotChart candles={candles} /> : <ChartWarmingUp />}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
            <p className="m-0 max-w-[52ch] text-[10px] leading-relaxed text-opt-ink-3">
              {activeRun
                ? "Running on the server. You can close this tab — the bot keeps going, and its session limits keep applying."
                : "The bot stops itself when a session limit is reached, whether or not this tab is open."}
            </p>

            {activeRun ? (
              <button
                type="button"
                disabled={busy}
                onClick={handleStop}
                className={cn(
                  "inline-flex items-center gap-2 rounded-[var(--opt-radius-sm)] px-5 py-2",
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
                disabled={busy || !selected || !deriv.linked || !isDraft}
                onClick={handleStart}
                className={cn(
                  "inline-flex items-center gap-2 rounded-[var(--opt-radius-sm)] px-5 py-2",
                  "bg-opt-rise text-[13px] font-bold text-white",
                  "transition-opacity hover:opacity-90 disabled:opacity-45",
                )}
              >
                <span aria-hidden="true">▶</span>
                {startMutation.isPending ? "Starting…" : "Start Bot"}
              </button>
            )}
          </div>
        </main>
      </div>
      )}
    </div>
  );
}

// ─── helpers ─────────────────────────────────────────────────────────────────

const ACTIVE_STATUSES = new Set(["pending", "running", "paused", "stopping"]);

function isActive(run: BotRun): boolean {
  return ACTIVE_STATUSES.has(run.status);
}

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-opt-line px-3 py-1.5">
      <span className="text-[11px] font-bold uppercase tracking-wide text-opt-ink-2">
        {title}
      </span>
      {hint && <span className="truncate text-[10px] text-opt-ink-3">{hint}</span>}
    </div>
  );
}

/**
 * Turns API trades into the history table's rows. Times render in the viewer's
 * locale — someone reconciling their own trades reads their own clock.
 */
function toTradeRows(trades: BotRunTrade[]): BotTrade[] {
  return trades.map((t) => ({
    id: t.trade_id,
    time: new Date(t.created_at).toLocaleTimeString(),
    direction: t.side === "fall" ? "down" : "up",
    stake: Number.parseFloat(t.stake_amount) || 0,
    result: t.outcome === "won" ? "won" : t.outcome === "lost" ? "lost" : "open",
    // null, not 0, while unsettled — the table renders "--" rather than a
    // break-even figure the contract has not produced.
    pnl: t.profit_loss === undefined ? null : Number.parseFloat(t.profit_loss),
  }));
}

function toSession(
  run: BotRun | undefined,
  currency: string,
  summary?: {
    total: number;
    won: number;
    lost: number;
    realized_pnl: string;
    total_staked: string;
  },
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

  // The trade summary wins when loaded: it is derived from the same rows the
  // table shows, so the headline and the list cannot disagree.
  const pnl = Number.parseFloat(summary?.realized_pnl ?? run.realized_pnl) || 0;
  const staked = Number.parseFloat(summary?.total_staked ?? run.total_staked) || 0;
  const limits = (run.risk_limits ?? {}) as Record<string, string>;

  return {
    status: mapStatus(run.status),
    realizedPnl: pnl,
    // Against capital actually committed; no denominator yet means 0%, which is
    // the honest answer rather than a division by zero.
    realizedPnlPct: staked > 0 ? (pnl / staked) * 100 : 0,
    tradesTotal: summary?.total ?? run.trades_total,
    tradesWon: summary?.won ?? run.trades_won,
    tradesLost: summary?.lost ?? run.trades_lost,
    targetProfitProgress: Math.max(0, pnl),
    targetProfitLimit: Number.parseFloat(limits.session_target_profit ?? "0") || 0,
    // A loss is negative P&L; the meter shows how much allowance is used.
    stopLossProgress: Math.max(0, -pnl),
    stopLossLimit: Number.parseFloat(limits.session_stop_loss ?? "0") || 0,
    currency: run.currency,
  };
}

function mapStatus(status: string): BotSession["status"] {
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
 * Maps a Deriv symbol back to a catalog id so the chart can follow a run whose
 * symbol was recorded in Deriv's vocabulary.
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
      <p className="m-0 max-w-[30ch] text-center text-[11px] leading-relaxed text-opt-ink-3">
        Loading price history… the chart needs about 20 minutes of candles before
        the indicators can be drawn.
      </p>
    </div>
  );
}

/**
 * Pulls the server's message out of an Axios error. The API returns `{ detail }`
 * and keeps internal causes in its own logs, so whatever arrives is safe to show.
 */
function apiMessage(err: unknown): string {
  const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data
    ?.detail;
  return detail ?? "Something went wrong. Please try again.";
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
        "flex shrink-0 flex-wrap items-center gap-2 border-b border-opt-line px-4 py-1.5 text-[11px]",
        tone === "error"
          ? "bg-opt-fall-soft text-opt-fall"
          : "bg-gold-soft text-gold-3",
      )}
    >
      {children}
      <Link
        href={"/options/dtrader" as Route}
        className="ml-auto shrink-0 font-semibold underline-offset-2 hover:underline"
      >
        Go to dTrader
      </Link>
    </div>
  );
}
