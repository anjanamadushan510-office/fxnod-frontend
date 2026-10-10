"use client";

import { useEffect, useRef } from "react";
import { createChart, ISeriesApi, Time, LineSeries, SeriesMarker, createSeriesMarkers } from "lightweight-charts";
import { useTheme } from "next-themes";
import { useDerivChartFeed, type FeedTick } from "@/hooks/useDerivChartFeed";
import { useOpenContract } from "@/hooks/useOpenContract";
import type { BotTickSample, BotTrade, PlottableTick } from "./types";
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
  const precision = spotPrecision(trade.tickStream);

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
        className="max-h-[calc(100dvh-2rem)] w-full max-w-6xl overflow-y-auto rounded-[var(--opt-radius)] border border-opt-line bg-opt-bg-elev p-4 shadow-2xl flex flex-col gap-4 md:flex-row md:gap-6 md:p-6"
      >
        {/* Left column: Chart */}
        <div className="flex-none md:flex-1 flex flex-col min-h-[300px] md:min-h-[500px] border border-opt-line rounded-[var(--opt-radius)] overflow-hidden bg-opt-bg">
          <div className="p-3 border-b border-opt-line bg-opt-bg-sunk font-medium text-sm text-opt-ink flex justify-between items-center">
            <span>{market?.name ?? trade.symbol} Live Chart</span>
            <span className="text-[12px] text-opt-ink-3 uppercase px-2 py-0.5 rounded-full bg-opt-bg">
              {trade.result === "open" ? "Live" : "Settled"}
            </span>
          </div>
          <div className="flex-1 relative">
            <LiveTradeChart trade={trade} />
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
            {/* The two prices Deriv's own contract page shows, so the trade
                can be checked against it figure for figure. */}
            <DetailBlock label="Entry spot">
              <span className="tabular-nums">{formatSpot(trade.entryPrice, precision)}</span>
            </DetailBlock>
            <DetailBlock label="Exit spot">
              <span className="tabular-nums">{formatSpot(trade.exitPrice, precision)}</span>
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

            <TradeReason trade={trade} />
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

// Deriv's tick contracts run for at most ten ticks.
const MAX_NUMBERED_TICKS = 10;

/** The samples of a stored tick stream that can be drawn, oldest first. */
function plottable(stream: BotTickSample[] | undefined): PlottableTick[] {
  return (stream ?? [])
    .filter((t): t is PlottableTick => typeof t.epoch === "number" && typeof t.tick === "number")
    .sort((a, b) => a.epoch - b.epoch);
}

/**
 * How many decimal places this market quotes, read from its own ticks: a
 * price shown here has to match the one Deriv shows to the last digit, and
 * "4902.9" beside Deriv's "4,902.90" does not look like a match.
 */
function spotPrecision(stream: BotTickSample[] | undefined): number {
  let places = 2;
  for (const { tick } of stream ?? []) {
    if (typeof tick !== "number") continue;
    const text = String(tick);
    const dot = text.indexOf(".");
    if (dot >= 0 && !text.includes("e")) places = Math.max(places, text.length - dot - 1);
  }
  return Math.min(places, 8);
}

/**
 * Which sample is the entry spot. The engine starts the stream at the entry
 * tick, so it is the first; a stream filled in from tick history can begin
 * one tick earlier, and then it is the first sample at the entry price.
 */
function entrySampleIndex(samples: PlottableTick[], entryPrice: number | undefined): number {
  if (entryPrice === undefined) return 0;
  const at = samples.findIndex((t) => Math.abs(t.tick - entryPrice) < 1e-9);
  // Never the last sample: that one is the exit.
  return at >= 0 && at < samples.length - 1 ? at : 0;
}

function formatSpot(value: number | undefined, precision: number): string {
  return value === undefined ? "--" : value.toFixed(precision);
}

/** Contract types whose signal is a quote's last digit. */
const DIGIT_CONTRACT = /even|odd|over|under|digit|match|differ/i;

/**
 * Why the bot bought: the ticks its rule read, and how long the order took.
 *
 * A contract starts on the tick after the broker accepts the order, a moment
 * after the bot decided. So the ticks just before the entry spot are not the
 * ones the rule read, and a trade checked against those looks as if the rule
 * had not waited. These are the ones it read.
 */
function TradeReason({ trade }: { trade: BotTrade }) {
  const ticks = trade.signalTicks;
  if (!ticks?.length) return null;

  const digits = DIGIT_CONTRACT.test(trade.contractType);
  const decided = trade.decidedAt ? new Date(trade.decidedAt) : null;
  const took = decided ? (new Date(trade.createdAt).getTime() - decided.getTime()) / 1000 : null;

  return (
    <div className="col-span-2 mt-2 flex flex-col gap-2 border-t border-opt-line pt-4 text-[13px]">
      <span className="font-medium text-opt-ink-3">Ticks the bot read</span>
      <ol className="m-0 flex list-none flex-wrap gap-x-3 gap-y-1 p-0 tabular-nums text-opt-ink-2">
        {ticks.map((quote, index) => (
          <li key={`${index}-${quote}`}>
            {digits ? (
              <>
                {quote.slice(0, -1)}
                <strong className="font-bold text-opt-ink">{quote.slice(-1)}</strong>
              </>
            ) : (
              quote
            )}
          </li>
        ))}
      </ol>
      {decided && (
        <span className="text-opt-ink-3">
          Decided at{" "}
          {new Intl.DateTimeFormat(undefined, { timeStyle: "medium" }).format(decided)}
          {took !== null && took >= 0 && `, order accepted ${took.toFixed(1)}s later`}
        </span>
      )}
      <span className="text-[12px] leading-relaxed text-opt-ink-3">
        The contract starts on the next tick after the order is accepted, so these are not
        always the ticks just before the entry spot.
      </span>
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

function LiveTradeChart({ trade }: { trade: BotTrade }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart>>();
  const seriesRef = useRef<ISeriesApi<"Line">>();
  const markersPluginRef = useRef<ReturnType<typeof createSeriesMarkers<Time>>>();
  const entryLineRef = useRef<ISeriesApi<"Line">>();

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const isDarkRef = useRef(isDark);
  useEffect(() => {
    isDarkRef.current = isDark;
    
    // Update existing chart if theme changes
    if (chartRef.current) {
      chartRef.current.applyOptions({
        layout: { textColor: isDark ? "#A3A3A3" : "#6B7280" },
        grid: {
          vertLines: { color: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)" },
          horzLines: { color: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)" },
        }
      });
    }
    if (seriesRef.current) {
      seriesRef.current.applyOptions({
        color: isDark ? "#D1D5DB" : "#1F2937",
      });
    }
  }, [isDark]);

  const openContract = useOpenContract(trade.result === "open" ? trade.derivContractId : undefined);
  const entryPrice = trade.entryPrice ?? openContract?.entrySpot;

  // 1. Initialize Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "transparent" },
        textColor: isDarkRef.current ? "#A3A3A3" : "#6B7280",
      },
      grid: {
        vertLines: { color: isDarkRef.current ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)" },
        horzLines: { color: isDarkRef.current ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
      autoSize: true,
    });

    const series = chart.addSeries(LineSeries, {
      color: isDarkRef.current ? "#D1D5DB" : "#1F2937",
      lineWidth: 2,
      crosshairMarkerRadius: 4,
      lastValueVisible: false,
      priceLineVisible: false,
    });

    chartRef.current = chart;
    seriesRef.current = series;

    return () => {
      chart.remove();
      chartRef.current = undefined;
      seriesRef.current = undefined;
    };
  }, []);


  // 3. Stream Data (Only for open trades)
  const isLive = trade.result === "open";
  
  const liveTicksRef = useRef<FeedTick[]>([]);

  const updateLiveMarkers = () => {
    if (!seriesRef.current || liveTicksRef.current.length === 0) return;
    const markers: SeriesMarker<Time>[] = [];
    liveTicksRef.current.forEach((t, i) => {
      const isFirst = i === 0;
      
      // Cap the marker numbering to the contract's tick duration
      if (openContract?.ticksTotal && i > openContract.ticksTotal) {
        return;
      }
      
      markers.push({
        time: t.time as Time,
        position: "inBar",
        color: isDarkRef.current ? "#9CA3AF" : "#6B7280",
        shape: "circle",
        text: isFirst ? "" : `${i}`,
        size: 1,
      });
    });
    
    if (!markersPluginRef.current) {
      markersPluginRef.current = createSeriesMarkers(seriesRef.current, markers);
    } else {
      markersPluginRef.current.setMarkers(markers);
    }
  };

  useDerivChartFeed({
    derivSymbol: trade.symbol,
    style: "ticks",
    enabled: isLive,
    onSeedTicks: (ticks: FeedTick[]) => {
      if (seriesRef.current && ticks.length > 0) {
        // Data Trimming & Focus
        const startBoundary = new Date(trade.createdAt).getTime() / 1000;
        const lookbackLimit = startBoundary - 10; // Keep 10 seconds of context before entry
        
        const trimmedTicks = ticks.filter(t => (t.time as number) >= lookbackLimit);
        
        // Strictly track contract ticks for numbering
        liveTicksRef.current = trimmedTicks.filter(t => (t.time as number) >= startBoundary);

        seriesRef.current.setData(
          trimmedTicks.map((t) => ({ time: t.time as Time, value: t.value }))
        );
        
        // Auto-Zoom timeframe
        if (chartRef.current) {
          chartRef.current.timeScale().fitContent();
        }
        
        updateLiveMarkers();
      }
    },
    onTick: (tick: FeedTick) => {
      if (seriesRef.current) {
        // The contract reports how many ticks it runs for; five is Deriv's own
        // default for tick contracts, used only before it has answered.
        const tickCount = openContract?.ticksTotal || 5;
        const maxPoints = tickCount + 1;
        if (liveTicksRef.current.length >= maxPoints) {
          return;
        }

        seriesRef.current.update({ time: tick.time as Time, value: tick.value });
        
        const startBoundary = new Date(trade.createdAt).getTime() / 1000;
        if ((tick.time as number) >= startBoundary) {
          liveTicksRef.current.push(tick);
          updateLiveMarkers();
        }
      }
    },
  });

  // 4. Historical Data (For settled trades)
  useEffect(() => {
    const series = seriesRef.current;
    if (isLive || !series) return;
    const samples = plottable(trade.tickStream);
    if (samples.length === 0) return;

    // The stream is drawn whole. The engine cuts it by time, from the entry
    // tick to the exit tick, and a contract of N ticks is therefore N + 1
    // samples. Taking "the first five" drew the entry and four ticks, numbered
    // the entry as tick 1, and left the exit tick off the chart.
    const precision = spotPrecision(trade.tickStream);
    series.applyOptions({
      priceFormat: { type: "price", precision, minMove: 1 / 10 ** precision },
    });
    series.setData(samples.map((t) => ({ time: t.epoch as Time, value: t.tick })));

    // The entry spot is where the contract starts, not one of its ticks, so
    // the count begins after it, as it does on Deriv.
    const entryIndex = entrySampleIndex(samples, trade.entryPrice);
    const last = samples.length - 1;
    // Ticks are numbered on a contract that is measured in them. One that
    // runs for minutes has a sample every second or two, and is drawn as a
    // line with only its entry and exit marked.
    const numbered = last - entryIndex <= MAX_NUMBERED_TICKS;
    const markers: SeriesMarker<Time>[] = samples.flatMap((t, i) => {
      if (!numbered && i !== entryIndex && i !== last) return [];
      return [{
        time: t.epoch as Time,
        position: "inBar" as const,
        // The exit tick is the one the outcome was decided on.
        color: i === last ? (isDark ? "#FFFFFF" : "#000000") : isDark ? "#9CA3AF" : "#6B7280",
        shape: "circle" as const,
        text: numbered && i > entryIndex ? `${i - entryIndex}` : "",
        size: 1,
      }];
    });
    if (!markersPluginRef.current) {
      markersPluginRef.current = createSeriesMarkers(series, markers);
    } else {
      markersPluginRef.current.setMarkers(markers);
    }

    // The labelled exit is the exit spot the engine recorded from Deriv. The
    // last sample is the fallback for a trade stored without one.
    const exitLine = series.createPriceLine({
      price: trade.exitPrice ?? samples[samples.length - 1].tick,
      color: trade.result === "won" ? "#10B981" : trade.result === "lost" ? "#EF4444" : "#1F2937",
      lineWidth: 1,
      lineStyle: 4, // Dotted, so it's barely visible
      axisLabelVisible: true,
      title: "",
    });

    chartRef.current?.timeScale().fitContent();

    // Without this a theme change left one more line behind each time.
    return () => {
      seriesRef.current?.removePriceLine(exitLine);
    };
  }, [isLive, trade.tickStream, trade.entryPrice, trade.exitPrice, trade.result, isDark]);

  return <div ref={chartContainerRef} className="absolute inset-0 [&_.tv-lightweight-charts-logo]:hidden [&_#tv-attr-logo]:hidden" />;
}
