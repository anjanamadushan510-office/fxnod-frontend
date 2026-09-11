"use client";

import type { BotTrade } from "./types";
import { cn } from "@/lib/cn";
import { findMarket } from "@/components/options/market/catalog";

export function TradeDetailsModal({
  trade,
  open,
  onClose,
}: {
  trade: BotTrade | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!open || !trade) return null;

  const positive = trade.pnl !== null && trade.pnl >= 0;
  const market = findMarket(trade.symbol);

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trade-details-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-[var(--opt-radius)] border border-opt-line bg-opt-bg-elev p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id="trade-details-title" className="m-0 text-[17px] font-bold text-opt-ink">
            Trade Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-opt-ink-3 transition-colors hover:bg-opt-bg-sunk hover:text-opt-ink"
            aria-label="Close"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-y-5 gap-x-4">
          <DetailBlock label="Market">
            {market?.name ?? trade.symbol}
          </DetailBlock>
          <DetailBlock label="Contract ID">
            {trade.derivContractId}
          </DetailBlock>

          <DetailBlock label="Stake">
            <span className="tabular-nums">
              {trade.stake.toFixed(2)} {trade.currency}
            </span>
          </DetailBlock>
          <DetailBlock label="Result">
            <span className="capitalize">{trade.result}</span>
          </DetailBlock>

          <DetailBlock label="Realized P&amp;L">
            <span
              className={cn(
                "font-semibold tabular-nums",
                trade.pnl === null
                  ? "text-opt-ink"
                  : positive
                    ? "text-opt-rise"
                    : "text-opt-fall"
              )}
            >
              {trade.pnl === null
                ? "--"
                : `${positive ? "+" : "-"}${Math.abs(trade.pnl).toFixed(2)} ${trade.currency}`}
            </span>
          </DetailBlock>
          <DetailBlock label="Direction">
            <span className="capitalize">{trade.direction}</span>
          </DetailBlock>

          <DetailBlock label="Start Time">
            {new Intl.DateTimeFormat(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(trade.createdAt))}
          </DetailBlock>
          <DetailBlock label="Status">
            <span className="capitalize">{trade.result === "open" ? "Running" : "Settled"}</span>
          </DetailBlock>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--opt-radius-sm)] bg-opt-bg-sunk px-5 py-2.5 text-[13px] font-semibold text-opt-ink transition-colors hover:bg-opt-bg-sunk/80"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 text-[13px]">
      <span className="font-medium text-opt-ink-3">{label}</span>
      <span className="text-opt-ink-2">{children}</span>
    </div>
  );
}
