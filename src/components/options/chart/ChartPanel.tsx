"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChartSettings } from "@/hooks/useChartSettings";
import { useChartOverlays } from "@/hooks/useChartOverlays";
import { useTradeOverlays } from "@/stores/useTradeOverlays";
import { useAccumulatorPreview } from "@/stores/useAccumulatorPreview";
import { useBarrierPreview } from "@/stores/useBarrierPreview";
import { useLiveMarket } from "@/stores/useLiveMarket";
import { LineStyle } from "lightweight-charts";

function formatBarrierTitle(offset: number): string {
  return `= ${offset > 0 ? "+" : ""}${offset.toFixed(3)}`;
}
import type { PriceLineSpec } from "./LiveChart";
import { CHART_COLORS } from "./chartColors";
import { MarketPicker } from "../market/MarketPicker";
import { ChartToolbar, ChartNavControls } from "./ChartToolbar";
import { DrawingToolbar } from "./DrawingToolbar";
import { LiveChart, type LiveChartHandle } from "./LiveChart";
import { MarketPill } from "./MarketPill";
import { StatsStrip } from "./StatsStrip";

interface ChartPanelProps {
  /** Catalog id of the active market (e.g. "vol_100_1s"). */
  marketId: string;
  /** Display name e.g. "Volatility 100 (1s) Index". */
  marketName: string;
  /** Fallback price shown until the first live tick arrives. */
  seedPrice: number;
  /** Render the Accumulators stats strip between chart and footer. */
  showStatsStrip?: boolean;
  /** Market IDs allowed for the current trade type. */
  allowedMarketIds: string[];
  /** User picked a different market in the picker. */
  onSelectMarket: (id: string) => void;
}

/**
 * Chart column owner. Composes the market pill + picker, the tool strip, and
 * the live lightweight-charts canvas (LiveChart, which owns the Deriv
 * WebSocket subscription keyed by the URL's symbol/interval/chart_type).
 *
 * The only data this component lifts off the stream is the latest price, used
 * to keep the MarketPill (price + session change) in sync. Tick-by-tick chart
 * painting happens inside LiveChart via refs, off React's render path.
 */
export function ChartPanel({
  marketId,
  marketName,
  seedPrice,
  showStatsStrip = false,
  allowedMarketIds,
  onSelectMarket,
}: ChartPanelProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  // Chart type + interval are URL-driven (`?chart_type=…&interval=…`).
  const { chartType, interval, tradeType, setChartType, setInterval } =
    useChartSettings();
  // Digit trade types restrict the chart interval to ticks (§4.2.2).
  const tickOnly =
    tradeType === "even_odd" ||
    tradeType === "matches_differs" ||
    tradeType === "over_under" ||
    tradeType === "accumulators";

  // Latest streamed price + the session anchor for the change indicator.
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const anchorRef = useRef<number | null>(null);

  // ── Options overlays (barrier lines + entry/exit markers) ────────────────
  // Populated by a real buy (usePanelBuy → useTradeOverlays.addOverlay).
  const chartRef = useRef<LiveChartHandle | null>(null);
  const allOverlays = useTradeOverlays((s) => s.overlays);
  const overlays = useMemo(
    () => allOverlays.filter((o) => o.symbol === marketId),
    [allOverlays, marketId],
  );

  const accuGrowthRate = useAccumulatorPreview((s) => s.growthRate);
  const accuBarrierPct = useAccumulatorPreview((s) => s.barrierPct);
  const accuStats = useAccumulatorPreview((s) => s.stats);
  const standardBarrier = useBarrierPreview((s) => s.barrier);

  const extraLines = useMemo((): PriceLineSpec[] => {
    if (!livePrice) return [];

    if (tradeType === "accumulators") {
      if (!accuGrowthRate) return [];
      const pct = accuBarrierPct ?? (accuGrowthRate * 0.012666 / 100);
      const barrierOffset = livePrice * pct;
      return [
        {
          price: livePrice + barrierOffset,
          color: CHART_COLORS.rise,
          lineStyle: LineStyle.Solid,
          lineWidth: 1,
          title: `+${(barrierOffset).toFixed(3)}`,
        },
        {
          price: livePrice - barrierOffset,
          color: CHART_COLORS.rise,
          lineStyle: LineStyle.Solid,
          lineWidth: 1,
          title: `-${(barrierOffset).toFixed(3)}`,
        },
      ];
    }

    if (standardBarrier !== null) {
      return [
        {
          price: livePrice + standardBarrier,
          color: "#2962FF", // Match drawing color / deriv blue
          lineStyle: LineStyle.Dashed,
          lineWidth: 2,
          title: formatBarrierTitle(standardBarrier),
        }
      ];
    }

    return [];
  }, [accuGrowthRate, livePrice, tradeType, accuBarrierPct, standardBarrier]);

  useChartOverlays(chartRef, overlays, extraLines);

  // Reset the price readout when the market changes — the next stream seeds it.
  useEffect(() => {
    setLivePrice(null);
    anchorRef.current = null;
    // Publish the on-screen market id/name so the buy handler can anchor the
    // barrier/position overlay to it.
    useLiveMarket.getState().set({ symbol: marketId, marketName });
  }, [marketId, marketName]);

  const handlePrice = useCallback((price: number) => {
    if (anchorRef.current === null) anchorRef.current = price;
    setLivePrice(price);
    // Publish the latest price (read imperatively by the buy handler).
    useLiveMarket.getState().set({ price });
  }, []);

  const price = livePrice ?? seedPrice;
  const anchor = anchorRef.current ?? seedPrice;
  const change = livePrice !== null ? +(price - anchor).toFixed(2) : 0;
  const changePct = anchor !== 0 ? (change / anchor) * 100 : 0;

  return (
    <div className="relative w-full h-full overflow-hidden">

      {/* ── Chart canvas: full width + full height ── */}
      <div className="w-full h-full relative overflow-hidden">
        <LiveChart
          ref={chartRef}
          symbol={marketId}
          chartType={chartType}
          interval={interval}
          onPrice={handlePrice}
        />

        {/* Zoom controls — bottom-center */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">
          <div className="pointer-events-auto">
            <ChartNavControls chartRef={chartRef} />
          </div>
          {showStatsStrip && (
            <div className="pointer-events-auto">
              <StatsStrip runs={accuStats || undefined} />
            </div>
          )}
        </div>

        {/* Chart toolbar + drawing toolbar — floating bottom-left over canvas */}
        <div className="pointer-events-none absolute bottom-16 left-4 z-40 flex flex-col items-center gap-1">
          <div className="pointer-events-auto">
            <ChartToolbar
              symbol={marketId}
              chartType={chartType}
              interval={interval}
              tickOnly={tickOnly}
              onChartTypeChange={setChartType}
              onIntervalChange={setInterval}
              chartRef={chartRef}
            />
          </div>
          <div className="pointer-events-auto">
            <DrawingToolbar />
          </div>
        </div>
      </div>

      {/* ── Floating Market Selector — absolute top-left over the chart ── */}
      <div className="absolute top-3 left-4 z-30">
        <MarketPill
          name={marketName}
          price={price}
          change={change}
          changePct={changePct}
          onOpen={() => setPickerOpen((v) => !v)}
        />
        {pickerOpen && (
          <MarketPicker
            activeMarketId={marketId}
            allowedMarketIds={allowedMarketIds}
            onSelectMarket={(id) => {
              onSelectMarket(id);
              setPickerOpen(false);
            }}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </div>

    </div>
  );
}
