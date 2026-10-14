import Link from "next/link";
import type { Route } from "next";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  PauseCircle,
} from "lucide-react";
import type { AutoHubRun } from "@/services/api/model";
import { canRepeatRun, repeatRunHref } from "./journey";
import { isActiveRun, stopReasonLabel } from "./runState";

export function RunFeedback({ run }: { run: AutoHubRun }) {
  const active = isActiveRun(run.status);
  const settling =
    run.trades_open > 0 && (!active || run.status === "stopping");
  const title = settling
    ? "Waiting for open trades to finish"
    : run.status === "stopping"
      ? "Stopping your bot"
      : run.status === "pending"
        ? "Preparing your run"
        : run.status === "paused"
          ? "Your bot is paused"
          : active
            ? "Your bot is running"
            : run.status === "failed"
              ? "This run ended with an issue"
              : "Run complete";
  const Indicator =
    run.status === "paused"
      ? PauseCircle
      : run.status === "failed"
        ? AlertCircle
        : active
          ? Activity
          : CheckCircle2;
  const detail = settling
    ? `New entries have stopped. ${run.trades_open} open trade${run.trades_open === 1 ? "" : "s"} still ${run.trades_open === 1 ? "needs" : "need"} to settle before the final result is available.`
    : run.status === "stopping"
      ? "Your stop request is being processed. You can leave this page; the server will finish stopping the run."
      : run.status === "pending"
        ? "The server is preparing the strategy and market data. Entries will appear below when the bot acts."
        : run.status === "paused"
          ? "No new entries are being placed. Check the run’s status and any account restrictions before trying again."
          : active
            ? "Updates arrive automatically. Closing this page keeps the bot running; use Stop run when you want it to stop taking new entries."
            : (stopReasonLabel(run.stop_reason) ??
              "The strategy has finished. Review the result and settings before deciding whether to run again.");
  return (
    <section
      aria-live="polite"
      className="mb-6 rounded-2xl border border-line bg-surface p-5 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-start gap-3 min-w-0">
          {settling || run.status === "stopping" || run.status === "pending" ? (
            <Loader2
              className="mt-0.5 shrink-0 text-ink-3 animate-spin"
              size={22}
            />
          ) : (
            <Indicator className="mt-0.5 shrink-0 text-ink-3" size={22} />
          )}

          <div>
            <h2 className="text-lg font-semibold text-ink">{title}</h2>
            <p className="mt-1 text-sm text-ink-2 leading-relaxed max-w-2xl">
              {detail}
            </p>
            <p className="mt-2 text-xs text-ink-3">
              {run.is_virtual ? "Demo" : "Real"} · {run.deriv_account_id} ·{" "}
              {run.currency}
              {run.ended_at
                ? ` · Ended ${new Date(run.ended_at).toLocaleString()}`
                : ""}
            </p>
            {run.stop_reason === "deriv_reconnect_required" && (
              <p className="mt-2 text-sm text-amber-500">
                Allow this bot again on Deriv when prompted during setup.
              </p>
            )}
          </div>
        </div>
        {canRepeatRun(run) && (
          <Link
            href={repeatRunHref(run) as Route}
            className="h-11 shrink-0 rounded-xl bg-action text-action-ink px-5 text-sm font-semibold flex items-center justify-center gap-2"
          >
            Review & run again <ArrowRight size={16} />
          </Link>
        )}
      </div>
      {canRepeatRun(run) && (
        <p className="mt-4 pt-4 border-t border-line text-xs text-ink-3">
          Reuse your markets and strategy settings. Review the current account
          and limits before starting a new run. Previous results stay in this
          run’s history.
        </p>
      )}
    </section>
  );
}
