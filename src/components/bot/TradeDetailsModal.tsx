"use client";

import { useEffect, useRef } from "react";
import { createChart, ISeriesApi, Time, LineSeries, SeriesMarker, createSeriesMarkers } from "lightweight-charts";
import { useDerivChartFeed, type FeedTick } from "@/hooks/useDerivChartFeed";
import { useOpenContract } from "@/hooks/useOpenContract";
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
        className="w-full max-w-6xl rounded-[var(--opt-radius)] border border-opt-line bg-opt-bg-elev p-6 shadow-2xl flex flex-col md:flex-row gap-6"
      >
        {/* Left column: Chart */}
        <div className="flex-1 flex flex-col min-h-[500px] border border-opt-line rounded-[var(--opt-radius)] overflow-hidden bg-opt-bg">
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

function LiveTradeChart({ trade }: { trade: BotTrade }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart>>();
  const seriesRef = useRef<ISeriesApi<"Line">>();
  const markersPluginRef = useRef<ReturnType<typeof createSeriesMarkers<Time>>>();
  const entryLineRef = useRef<ISeriesApi<"Line">>();

  const openContract = useOpenContract(trade.result === "open" ? trade.derivContractId : undefined);
  const entryPrice = trade.entryPrice ?? openContract?.entrySpot;

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

  // 2. Add or update PriceLine when entryPrice changes
  const priceLineRef = useRef<any>(null);
  useEffect(() => {
    if (!seriesRef.current || entryPrice === undefined) return;
    
    if (priceLineRef.current) {
      seriesRef.current.removePriceLine(priceLineRef.current);
    }
    
    priceLineRef.current = seriesRef.current.createPriceLine({
      price: entryPrice,
      color: "#10B981",
      lineWidth: 2,
      lineStyle: 2, // Dashed
      axisLabelVisible: true,
      title: "Entry",
    });
    
    return () => {
      if (seriesRef.current && priceLineRef.current) {
        seriesRef.current.removePriceLine(priceLineRef.current);
        priceLineRef.current = null;
      }
    };
  }, [entryPrice]);

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
        position: "aboveBar",
        color: "#9CA3AF",
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
        
        if (entryPrice !== undefined && priceLineRef.current) {
          seriesRef.current.removePriceLine(priceLineRef.current);
          priceLineRef.current = seriesRef.current.createPriceLine({
            price: entryPrice,
            color: "#10B981",
            lineWidth: 2,
            lineStyle: 2,
            axisLabelVisible: true,
            title: "Entry",
          });
        }
      }
    },
    onTick: (tick: FeedTick) => {
      if (seriesRef.current) {
        const tickCount = openContract?.ticksTotal || (trade as any).tick_count || (trade as any).tickCount || 5;
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
    if (!isLive && seriesRef.current && trade.tickStream && trade.tickStream.length > 0) {
      // The tickStream array contains objects like { epoch: number, tick: number }
      // Sort to ensure chronological order as required by lightweight-charts
      const sortedTicks = [...trade.tickStream]
        .filter(t => typeof t.epoch === "number" && typeof t.tick === "number")
        .sort((a, b) => a.epoch - b.epoch);
        
      if (sortedTicks.length > 0) {
        seriesRef.current.setData(
          sortedTicks.map(t => ({ time: t.epoch as Time, value: t.tick }))
        );
        
        // Add Tick Markers and Time Boundaries
        const markers: SeriesMarker<Time>[] = [];
        
        sortedTicks.forEach((t, i) => {
          const isLast = i === sortedTicks.length - 1;
          const isFirst = i === 0;
          
          let color = "#9CA3AF"; // Gray default
          
          // Outcome Highlight for the final tick, regardless of array length
          if (isLast) {
            color = trade.result === "won" ? "#10B981" : trade.result === "lost" ? "#EF4444" : "#1F2937";
          }
          
          markers.push({
            time: t.epoch as Time,
            position: "aboveBar",
            color: color,
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
        
        // If the chart renders historical data, we should fit the content
        if (chartRef.current) {
          chartRef.current.timeScale().fitContent();
        }
      }
    }
  }, [isLive, trade.tickStream]);

  return <div ref={chartContainerRef} className="absolute inset-0 [&_.tv-lightweight-charts-logo]:hidden [&_#tv-attr-logo]:hidden" />;
}
