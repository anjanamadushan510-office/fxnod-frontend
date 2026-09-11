"use client";

import { useEffect, useRef } from "react";
import { createChart, ISeriesApi, Time, LineSeries } from "lightweight-charts";
import { useDerivChartFeed, type FeedTick } from "@/hooks/useDerivChartFeed";
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
        className="w-full max-w-4xl rounded-[var(--opt-radius)] border border-opt-line bg-opt-bg-elev p-6 shadow-2xl flex flex-col md:flex-row gap-6"
      >
        {/* Left column: Chart */}
        <div className="flex-1 flex flex-col min-h-[300px] border border-opt-line rounded-[var(--opt-radius)] overflow-hidden bg-opt-bg">
          <div className="p-3 border-b border-opt-line bg-opt-bg-sunk font-medium text-sm text-opt-ink flex justify-between items-center">
            <span>{market?.name ?? trade.symbol} Live Chart</span>
            <span className="text-[12px] text-opt-ink-3 uppercase px-2 py-0.5 rounded-full bg-opt-bg">
              {trade.result === "open" ? "Live" : "Settled"}
            </span>
          </div>
          <div className="flex-1 relative">
            <LiveTradeChart symbol={trade.symbol} />
          </div>
        </div>

        {/* Right column: Details */}
        <div className="w-full md:w-[300px] flex flex-col">
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

          <div className="grid grid-cols-2 gap-y-5 gap-x-4 flex-1 content-start">
            <DetailBlock label="Contract ID">
              {trade.derivContractId}
            </DetailBlock>
            <DetailBlock label="Stake">
              <span className="tabular-nums">
                {trade.stake.toFixed(2)} {trade.currency}
              </span>
            </DetailBlock>

            <DetailBlock label="Direction">
              <span className="capitalize">{trade.direction}</span>
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
            <DetailBlock label="Status">
              <span className="capitalize">{trade.result === "open" ? "Running" : "Settled"}</span>
            </DetailBlock>

            <div className="col-span-2 mt-2">
              <DetailBlock label="Start Time">
                {new Intl.DateTimeFormat(undefined, {
                  dateStyle: "medium",
                  timeStyle: "medium",
                }).format(new Date(trade.createdAt))}
              </DetailBlock>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[var(--opt-radius-sm)] bg-opt-bg-sunk px-5 py-2.5 text-[13px] font-semibold text-opt-ink transition-colors hover:bg-opt-bg-sunk/80 w-full md:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 text-[13px]">
      <span className="font-medium text-opt-ink-3">{label}</span>
      <span className="text-opt-ink-2 truncate">{children}</span>
    </div>
  );
}

function LiveTradeChart({ symbol }: { symbol: string }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart>>();
  const seriesRef = useRef<ISeriesApi<"Line">>();

  // 1. Initialize Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "transparent" },
        textColor: "#A3A3A3",
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.05)" },
        horzLines: { color: "rgba(255, 255, 255, 0.05)" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
      autoSize: true,
    });

    const series = chart.addSeries(LineSeries, {
      color: "#4F46E5",
      lineWidth: 2,
      crosshairMarkerRadius: 4,
    });

    chartRef.current = chart;
    seriesRef.current = series;

    return () => {
      chart.remove();
      chartRef.current = undefined;
      seriesRef.current = undefined;
    };
  }, []);

  // 2. Stream Data
  useDerivChartFeed({
    derivSymbol: symbol,
    style: "ticks",
    enabled: true,
    onSeedTicks: (ticks: FeedTick[]) => {
      if (seriesRef.current && ticks.length > 0) {
        seriesRef.current.setData(
          ticks.map((t) => ({ time: t.time as Time, value: t.value }))
        );
      }
    },
    onTick: (tick: FeedTick) => {
      if (seriesRef.current) {
        seriesRef.current.update({ time: tick.time as Time, value: tick.value });
      }
    },
  });

  return <div ref={chartContainerRef} className="absolute inset-0" />;
}
