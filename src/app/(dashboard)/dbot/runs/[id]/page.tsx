"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TradeDetailsModal } from "@/components/bot/TradeDetailsModal";
import { toTradeRows } from "@/components/bot/tradeRows";
import type { BotTrade } from "@/components/bot/types";
import { useMarketStore } from "@/components/options/market/marketStore";
import { cn } from "@/lib/cn";
import { decimalSign, formatMoney } from "@/lib/decimal";
import { parseApiError } from "@/lib/apiError";
import {
  getGetBotRunQueryKey,
  getListBotRunsQueryKey,
  useGetBotRun,
  useListBotRunTrades,
  useListBotStrategies,
  usePauseBotRun,
  useResumeBotRun,
  useStopBotRun,
} from "@/services/api/endpoints/bots/bots";
import type { BotRun } from "@/services/api/model";

const ACTIVE_STATUSES = new Set(["pending", "running", "paused", "stopping"]);

const STOP_REASONS: Record<string, string> = {
  session_stop_loss: "Reached its loss cap",
  session_target_profit: "Reached its profit target",
  max_trades: "Reached its trade limit",
  max_duration: "Reached its time limit",
  user_requested: "You stopped it",
  account_session_loss: "Your bots together reached the account loss ceiling",
  martingale_steps_exhausted: "The martingale ladder ran out",
  entitlement_lapsed: "The subscription lapsed",
  deriv_reconnect_required: "Deriv needs you to allow this bot again",
  admin_halt: "Stopped by FXNod",
  error: "Stopped after an error",
};

/**
 * /dbot/runs/[id] — one bot run.
 *
 * A run is server state: it keeps trading with this page closed, and its
 * session limits keep applying either way. Nothing here decides anything about
 * money — Stop, Pause and Resume ask the engine, which is also the only thing
 * that can end a run on a limit.
 */
export default function BotRunPage() {
  const params = useParams<{ id: string }>();
  const runId = params.id;
  const queryClient = useQueryClient();

  const runQuery = useGetBotRun(runId, {
    query: {
      // Only an active run changes; a finished one is a record.
      refetchInterval: (query) =>
        ACTIVE_STATUSES.has(query.state.data?.status ?? "") ? 3000 : false,
      retry: false,
    },
  });
  const run = runQuery.data;
  const active = run ? ACTIVE_STATUSES.has(run.status) : false;

  const tradesQuery = useListBotRunTrades(runId, { limit: 100 }, {
    query: { refetchInterval: active ? 3000 : false },
  });
  const strategiesQuery = useListBotStrategies();
  const stop = useStopBotRun();
  const pause = usePauseBotRun();
  const resume = useResumeBotRun();

  const [selectedTrade, setSelectedTrade] = useState<BotTrade | null>(null);

  const allMarkets = useMarketStore((s) => s.allMarkets);
  const marketNames = useMemo(() => {
    const byId = new Map(allMarkets.map((m) => [m.id, m.name]));
    return (run?.symbols ?? []).map((id) => byId.get(id) ?? id);
  }, [allMarkets, run?.symbols]);

  const trades = useMemo(() => toTradeRows(tradesQuery.data?.trades ?? []), [tradesQuery.data]);
  const summary = tradesQuery.data?.summary;

  const strategyName =
    (strategiesQuery.data?.strategies ?? []).find((s) => s.strategy_id === run?.strategy_id)
      ?.display_name ??
    run?.strategy_id ??
    "";

  async function act(
    what: "stop" | "pause" | "resume",
    run: BotRun,
  ) {
    const mutation = what === "stop" ? stop : what === "pause" ? pause : resume;
    try {
      await mutation.mutateAsync({ id: run.run_id });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getGetBotRunQueryKey(run.run_id) }),
        queryClient.invalidateQueries({ queryKey: getListBotRunsQueryKey() }),
      ]);
    } catch (err) {
      toast.error(parseApiError(err, `Could not ${what} the bot.`).message);
    }
  }

  if (runQuery.isPending) {
    return (
      <Shell>
        <p className="text-sm text-ink-3">Loading run…</p>
      </Shell>
    );
  }

  if (runQuery.isError || !run) {
    return (
      <Shell>
        <div className="bg-panel border border-line rounded-2xl p-8 max-w-lg">
          <h2 className="font-display text-lg font-semibold mb-2">This run could not be opened</h2>
          <p className="text-sm text-ink-2">
            It may belong to another account, or the trading engine may be unavailable.
          </p>
        </div>
      </Shell>
    );
  }

  // The summary is derived from the same rows the table shows, so the headline
  // and the list cannot disagree. The run row is the fallback.
  const pnl = summary?.realized_pnl ?? run.realized_pnl;
  const staked = summary?.total_staked ?? run.total_staked;
  const limits = (run.risk_limits ?? {}) as Record<string, unknown>;
  const stopLossLimit = limitAmount(limits.session_stop_loss);
  const targetLimit = limitAmount(limits.session_target_profit);
  const pnlNumber = Number.parseFloat(pnl) || 0;
  const busy = stop.isPending || pause.isPending || resume.isPending;

  return (
    <Shell>
      <header className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-semibold text-ink">{strategyName}</h1>
            <StatusBadge status={run.status} />
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                run.is_virtual ? "bg-zinc-700 text-zinc-200" : "bg-amber-400 text-black",
              )}
            >
              {run.is_virtual ? "Demo" : "Real"}
            </span>
          </div>
          <p className="text-sm text-ink-3 mt-1">
            {marketNames.join(", ")} · started{" "}
            {new Date(run.started_at ?? run.created_at).toLocaleString()}
            {run.stop_reason ? ` · ${STOP_REASONS[run.stop_reason] ?? run.stop_reason}` : ""}
          </p>
        </div>

        {active && (
          <div className="flex gap-2">
            {run.status === "paused" ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => act("resume", run)}
                className="h-10 px-4 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition disabled:opacity-45"
              >
                Resume
              </button>
            ) : (
              <button
                type="button"
                disabled={busy || run.status !== "running"}
                onClick={() => act("pause", run)}
                className="h-10 px-4 rounded-lg border border-line text-sm text-ink-2 hover:text-ink transition disabled:opacity-45"
              >
                Pause
              </button>
            )}
            <button
              type="button"
              disabled={busy || run.status === "stopping"}
              onClick={() => act("stop", run)}
              className="h-10 px-4 rounded-lg border border-red-500/50 text-sm text-red-300 hover:bg-red-500/10 transition disabled:opacity-45"
            >
              {run.status === "stopping" ? "Stopping…" : "Stop"}
            </button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat label="Realised P/L" value={formatMoney(pnl)} tone={decimalSign(pnl)} />
        <Stat label="Staked" value={formatMoney(staked)} />
        <Stat
          label="Trades"
          value={`${summary?.won ?? run.trades_won}W / ${summary?.lost ?? run.trades_lost}L`}
          hint={`${summary?.open ?? run.trades_open} open`}
        />
        <Stat label="Total" value={String(summary?.total ?? run.trades_total)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {stopLossLimit !== null && (
          <Meter
            label="Loss allowance used"
            used={Math.max(0, -pnlNumber)}
            limit={stopLossLimit}
            tone="loss"
          />
        )}
        {targetLimit !== null && (
          <Meter
            label="Progress to profit target"
            used={Math.max(0, pnlNumber)}
            limit={targetLimit}
            tone="profit"
          />
        )}
      </div>

      <div className="bg-surface border border-line rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 className="text-sm font-medium text-ink">Trades</h2>
          <span className="text-xs text-ink-3">
            {active ? "Updating every few seconds" : "Final"}
          </span>
        </div>

        {tradesQuery.isPending ? (
          <p className="px-5 py-8 text-center text-sm text-ink-3">Loading trades…</p>
        ) : tradesQuery.isError ? (
          <p className="px-5 py-8 text-center text-sm text-ink-3">Could not load the trades.</p>
        ) : trades.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-ink-3">
            {active ? "No trades yet — the bot is waiting for its rule to match." : "This run placed no trades."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-ink-3">
                  <Th>Time</Th>
                  <Th>Market</Th>
                  <Th>Side</Th>
                  <Th align="right">Stake</Th>
                  <Th>Result</Th>
                  <Th align="right">P&amp;L</Th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr
                    key={trade.id}
                    onClick={() => setSelectedTrade(trade)}
                    className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-surface-2 transition-colors"
                  >
                    <Td className="tabular-nums text-ink-2">{trade.time}</Td>
                    <Td className="text-ink-2">
                      {allMarkets.find((m) => m.id === trade.symbol)?.name ?? trade.symbol}
                    </Td>
                    <Td className="text-ink-2 capitalize">{trade.direction === "down" ? "Down" : "Up"}</Td>
                    <Td align="right" className="tabular-nums text-ink-2">
                      {trade.stake.toFixed(2)}
                    </Td>
                    <Td>
                      <span
                        className={cn(
                          "text-xs font-semibold uppercase tracking-wider",
                          trade.result === "won"
                            ? "text-emerald-400"
                            : trade.result === "lost"
                              ? "text-red-400"
                              : "text-ink-3",
                        )}
                      >
                        {trade.result}
                      </span>
                    </Td>
                    <Td align="right" className="tabular-nums">
                      <span
                        className={cn(
                          trade.pnl === null
                            ? "text-ink-3"
                            : trade.pnl < 0
                              ? "text-red-400"
                              : "text-emerald-400",
                        )}
                      >
                        {trade.pnl === null ? "—" : trade.pnl.toFixed(2)}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-6 max-w-2xl text-xs leading-relaxed text-ink-3">
        This bot runs on the server. Closing this page does not stop it, and equally cannot
        disable its session limits.
      </p>

      {/* The trade detail modal is styled for the options scope; give it that
          scope here rather than restyling a shared component. */}
      <div data-app="options" data-opt-theme="dark" className="contents">
        <TradeDetailsModal
          trade={selectedTrade}
          open={selectedTrade !== null}
          onClose={() => setSelectedTrade(null)}
        />
      </div>
    </Shell>
  );
}

// ─── pieces ─────────────────────────────────────────────────────────────────

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="p-4 lg:p-8">
      <Link href={"/dbot" as Route} className="text-xs text-ink-3 hover:text-ink mb-4 block w-fit">
        &larr; Bots
      </Link>
      {children}
    </section>
  );
}

/** A limit from the run's snapshot, or null when it was not set. */
function limitAmount(raw: unknown): number | null {
  if (typeof raw !== "string") return null;
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function Stat({
  label,
  value,
  hint,
  tone = 0,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: -1 | 0 | 1;
}) {
  return (
    <article className="bg-surface border border-line rounded-2xl p-4">
      <p className="text-xs text-ink-3">{label}</p>
      <p
        className={cn(
          "text-xl font-semibold mt-1",
          tone < 0 ? "text-red-400" : tone > 0 ? "text-emerald-400" : "text-ink",
        )}
      >
        {value}
      </p>
      {hint && <p className="text-xs text-ink-3 mt-0.5">{hint}</p>}
    </article>
  );
}

function Meter({
  label,
  used,
  limit,
  tone,
}: {
  label: string;
  used: number;
  limit: number;
  tone: "loss" | "profit";
}) {
  const pct = Math.min(100, (used / limit) * 100);
  return (
    <div className="bg-surface border border-line rounded-2xl p-4">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-xs text-ink-3">{label}</span>
        <span className="text-xs tabular-nums text-ink-2">
          {used.toFixed(2)} / {limit.toFixed(2)}
        </span>
      </div>
      <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
        <div
          style={{ width: `${pct}%` }}
          className={cn("h-full rounded-full", tone === "loss" ? "bg-red-500" : "bg-emerald-500")}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        status === "running"
          ? "bg-emerald-500/15 text-emerald-400"
          : status === "failed"
            ? "bg-red-500/15 text-red-400"
            : "bg-surface-2 text-ink-2",
      )}
    >
      {status}
    </span>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th className={cn("px-5 py-2 font-medium", align === "right" && "text-right")}>{children}</th>
  );
}

function Td({
  children,
  align = "left",
  className,
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <td className={cn("px-5 py-2.5", align === "right" && "text-right", className)}>{children}</td>
  );
}
