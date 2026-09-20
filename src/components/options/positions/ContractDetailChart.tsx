"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import {
  ColorType,
  AreaSeries,
  LineStyle,
  createChart,
  createSeriesMarkers,
  type SeriesMarker,
  type Time,
  type UTCTimestamp,
} from "lightweight-charts";
import { CHART_COLORS } from "../chart/chartColors";
import type { ContractDetail } from "./contractDetail";
import { AccumulatorBarriersPlugin } from "../chart/plugins/AccumulatorBarriersPlugin";
import { ExitSpotPlugin } from "../chart/plugins/ExitSpotPlugin";
import { TickSpotsPlugin, type TickSpot } from "../chart/plugins/TickSpotsPlugin";

// ── Light / Dark theme palettes for the contract detail chart ────────────────
const DARK_THEME = {
  bg: "transparent",
  text: CHART_COLORS.inkFaint,       // #9CA3AF
  grid: CHART_COLORS.line,           // #24344F
  border: CHART_COLORS.line,
  ink: CHART_COLORS.ink,             // #6EE7D8 cyan
  areaTop: "rgba(128,128,128,0.15)",
  areaBottom: "rgba(128,128,128,0)",
} as const;

const LIGHT_THEME = {
  bg: "transparent",
  text: "#374151",                   // gray-700
  grid: "#E5E7EB",                   // gray-200
  border: "#E5E7EB",
  ink: "#111827",                    // gray-900
  areaTop: "rgba(17,24,39,0.08)",
  areaBottom: "rgba(17,24,39,0)",
} as const;

/**
 * Right-panel chart of the Contract Details modal (Deriv §10): a second
 * lightweight-charts instance plotting just this contract's isolated tick
 * path. Each tick is a numbered node; the exit node is green (win) / red
 * (loss); the entry barrier is a dashed horizontal line.
 *
 * Colours are literal hex (CHART_COLORS) — lightweight-charts cannot parse the
 * oklch() values our --opt-* Tailwind tokens resolve to.
 *
 * Theme sync: a separate useEffect watches resolvedTheme and calls
 * chart.applyOptions() so the chart repaints instantly without remounting.
 */
export function ContractDetailChart({ detail }: { detail: ContractDetail }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  const seriesRef = useRef<any>(null);
  const { resolvedTheme } = useTheme();

  // ── Build the chart once per `detail` prop ──────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const isDark = resolvedTheme !== "light";
    const palette = isDark ? DARK_THEME : LIGHT_THEME;
    const rise = CHART_COLORS.rise;
    const fall = CHART_COLORS.fall;
    const exitColor = detail.outcome === "won" ? rise : fall;

    const chart = createChart(el, {
      width: el.clientWidth,
      height: el.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: palette.bg },
        textColor: palette.text,
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: palette.grid, style: 1 },
        horzLines: { color: palette.grid, style: 1 },
      },
      rightPriceScale: { borderColor: palette.border },
      timeScale: { borderColor: palette.border, timeVisible: true, secondsVisible: true },
    });

    chartRef.current = chart;

    const series = chart.addSeries(AreaSeries, {
      lineColor: palette.ink,
      lineWidth: 2,
      topColor: palette.areaTop,
      bottomColor: palette.areaBottom,
    });
    seriesRef.current = series;

    const chartData: any[] = detail.ticks.map((t) => ({ time: t.time as UTCTimestamp, value: t.value }));

    if (detail.expiryTime && detail.expiryTime > detail.exitTime) {
      const lastTime = detail.ticks.length > 0 ? detail.ticks[detail.ticks.length - 1].time : detail.exitTime;
      for (let t = lastTime + 1; t <= detail.expiryTime; t++) {
        chartData.push({ time: t as UTCTimestamp });
      }
    }

    // Add forward whitespace for open tick contracts to prevent x-axis squishing
    const hasExit = detail.ticks.some((t) => t.kind === "exit");
    if (!hasExit && detail.ticks.length > 0) {
      const match = detail.duration.match(/(\d+)\/(\d+)\s+ticks?/i);
      let missingTicks = 0;
      if (match) {
        missingTicks = parseInt(match[2], 10) - parseInt(match[1], 10);
      } else if (detail.duration.includes("tick")) {
        const totalMatch = detail.duration.match(/(\d+)\s+ticks?/i);
        if (totalMatch) {
          missingTicks = Math.max(0, parseInt(totalMatch[1], 10) - detail.ticks.length + 1);
        }
      }
      // Guarantee at least 1 tick of forward space if it's open
      missingTicks = Math.max(1, missingTicks);

      const lastTime = detail.ticks[detail.ticks.length - 1].time;
      for (let i = 1; i <= missingTicks; i++) {
        chartData.push({ time: (lastTime + i) as UTCTimestamp });
      }
    }

    series.setData(chartData);

    // Entry barrier line (dashed) for contracts that have a distinct fixed barrier
    const isDigitContract =
      detail.type === "even_odd" ||
      detail.type === "DIGITEVEN" ||
      detail.type === "DIGITODD" ||
      detail.type === "matches_differs" ||
      detail.type === "over_under";
    if (detail.type !== "accumulators" && detail.type !== "multipliers" && !isDigitContract) {
      series.createPriceLine({
        price: detail.barrier,
        color: fall,
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: "Barrier",
      });
    }

    // Add Accumulator specific barriers
    if (detail.type === "accumulators" || detail.type === "ACCU") {
      if (detail.ticks.length >= 2) {
        const exitTick = detail.ticks[detail.ticks.length - 1];
        const prevTick = detail.ticks[detail.ticks.length - 2];
        const isWon = detail.outcome === "won";

        let highBarrier = detail.highBarrier;
        let lowBarrier = detail.lowBarrier;

        if (!highBarrier || !lowBarrier) {
          if (!isWon) {
            const diff = Math.abs(exitTick.value - prevTick.value) * 0.95;
            highBarrier = prevTick.value + diff;
            lowBarrier = prevTick.value - diff;
          } else {
            const diff = prevTick.value * 0.00035;
            highBarrier = prevTick.value + diff;
            lowBarrier = prevTick.value - diff;
          }
        }

        const barriersPlugin = new AccumulatorBarriersPlugin(
          prevTick.time as UTCTimestamp,
          highBarrier,
          lowBarrier,
          isWon
        );
        series.attachPrimitive(barriersPlugin);
      }
    }

    const isMultiplier =
      detail.tradeTypeLabel.toLowerCase().includes("multiplier") ||
      detail.type === "multipliers" ||
      detail.type === "MULTUP" ||
      detail.type === "MULTDOWN";
    const isTickContract = detail.duration.includes("tick") && !isMultiplier;

    const tickSpots: TickSpot[] = [];
    let tickNumber = 0;
    detail.ticks.forEach((t, i) => {
      const date = new Date(t.time * 1000);
      const hh = String(date.getUTCHours()).padStart(2, "0");
      const mm = String(date.getUTCMinutes()).padStart(2, "0");
      const ss = String(date.getUTCSeconds()).padStart(2, "0");
      const timeLabel = `${hh}:${mm}:${ss}`;

      if (t.kind === "pre-start") return;

      const isEntry = t.kind === "entry";
      const isExit = t.kind === "exit";

      if (isEntry || isExit || isTickContract) {
        if (isExit) {
          const exitPlugin = new ExitSpotPlugin(
            t.time as UTCTimestamp,
            t.value,
            timeLabel,
            t.value.toFixed(Math.abs(t.value) < 10 ? 4 : 2),
            detail.outcome === "won",
            isTickContract,
            isTickContract ? tickNumber + 1 : undefined
          );
          series.attachPrimitive(exitPlugin);
        } else if (isEntry) {
          tickSpots.push({
            time: t.time as UTCTimestamp,
            price: t.value,
            label: "0",
            isEntry: true,
          });
        } else {
          tickNumber++;
          tickSpots.push({
            time: t.time as UTCTimestamp,
            price: t.value,
            label: String(tickNumber),
            isEntry: false,
          });
        }
      }
    });

    if (tickSpots.length > 0) {
      series.attachPrimitive(new TickSpotsPlugin(tickSpots));
    }

    chart.timeScale().fitContent();

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0]!.contentRect;
      if (width > 0 && height > 0) chart.resize(width, height);
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [detail]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Instant theme repaint — no remount needed ────────────────────────────
  useEffect(() => {
    const chart = chartRef.current;
    const series = seriesRef.current;
    if (!chart) return;

    const isDark = resolvedTheme !== "light";
    const palette = isDark ? DARK_THEME : LIGHT_THEME;

    chart.applyOptions({
      layout: {
        background: { type: ColorType.Solid, color: palette.bg },
        textColor: palette.text,
      },
      grid: {
        vertLines: { color: palette.grid },
        horzLines: { color: palette.grid },
      },
      rightPriceScale: { borderColor: palette.border },
      timeScale: { borderColor: palette.border },
    });

    if (series) {
      series.applyOptions({
        lineColor: palette.ink,
        topColor: palette.areaTop,
        bottomColor: palette.areaBottom,
      });
    }
  }, [resolvedTheme]);

  return <div ref={containerRef} className="h-full w-full" />;
}
