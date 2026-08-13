"use client";

import { useEffect, useRef } from "react";
import {
  ColorType,
  LineSeries,
  LineStyle,
  createChart,
  createSeriesMarkers,
  type SeriesMarker,
  type Time,
  type UTCTimestamp,
} from "lightweight-charts";
import { CHART_COLORS } from "../chart/chartColors";
import type { ContractDetail } from "./contractDetail";

/**
 * Right-panel chart of the Contract Details modal (Deriv §10): a second
 * lightweight-charts instance plotting just this contract's isolated tick
 * path. Each tick is a numbered node; the exit node is green (win) / red
 * (loss); the entry barrier is a dashed horizontal line.
 *
 * Colours are literal hex (CHART_COLORS) — lightweight-charts cannot parse the
 * oklch() values our --opt-* Tailwind tokens resolve to.
 */
export function ContractDetailChart({ detail }: { detail: ContractDetail }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ink = CHART_COLORS.ink;
    const line = CHART_COLORS.line;
    const inkFaint = CHART_COLORS.inkFaint;
    const rise = CHART_COLORS.rise;
    const fall = CHART_COLORS.fall;
    const exitColor = detail.outcome === "won" ? rise : fall;

    const chart = createChart(el, {
      width: el.clientWidth,
      height: el.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: inkFaint,
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: line, style: 1 },
        horzLines: { color: line, style: 1 },
      },
      rightPriceScale: { borderColor: line },
      timeScale: { borderColor: line, timeVisible: true, secondsVisible: true },
    });

    const series = chart.addSeries(LineSeries, { color: ink, lineWidth: 2 });
    series.setData(
      detail.ticks.map((t) => ({ time: t.time as UTCTimestamp, value: t.value })),
    );

    // Entry barrier line (dashed).
    series.createPriceLine({
      price: detail.barrier,
      color: fall,
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      axisLabelVisible: true,
      title: "Barrier",
    });

    // Circled unicode digits ①–⑩ so the number appears inside a circle like Deriv.
    const CIRCLED = ["", "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];
    const circled = (n: number) => CIRCLED[n] ?? String(n);

    const isTickContract = detail.duration.includes("tick");

    // Numbered tick nodes; exit node coloured by outcome, entry node teal.
    // i=0 is the entry/start tick (Deriv shows it as an open circle, unnumbered).
    // Subsequent ticks are numbered 1, 2, 3 ... matching Deriv's display (only for tick contracts).
    const markers: SeriesMarker<Time>[] = [];
    
    detail.ticks.forEach((t, i) => {
      // Format timestamp as HH:MM:SS for the label
      const date = new Date(t.time * 1000);
      const hh = String(date.getUTCHours()).padStart(2, "0");
      const mm = String(date.getUTCMinutes()).padStart(2, "0");
      const ss = String(date.getUTCSeconds()).padStart(2, "0");
      const timeLabel = `${hh}:${mm}:${ss}`;

      const isEntry = i === 0;
      const isExit = i === detail.ticks.length - 1;

      // Only show markers for entry, exit, or all ticks if it's a tick contract
      if (isEntry || isExit || isTickContract) {
        const isAccumulator = detail.tradeTypeLabel.includes("Accumulator");
        let label = "";

        if (isAccumulator) {
          // Deriv's accumulator chart only labels the exit tick, intermediate ticks are just plain dots
          if (isExit) {
            label = timeLabel;
          }
        } else {
          // Entry tick (i=0) and Exit tick on non-tick contracts: no number, just timestamp
          label = isEntry || (!isTickContract && isExit) ? timeLabel : `${circled(i)} ${timeLabel}`;
        }

        markers.push({
          time: t.time as UTCTimestamp,
          position: "aboveBar",
          color: t.kind === "exit" ? exitColor : inkFaint,
          shape: "circle",
          ...(label ? { text: label } : {}),
        });
      }
    });
    
    createSeriesMarkers(series, markers);

    chart.timeScale().fitContent();

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0]!.contentRect;
      if (width > 0 && height > 0) chart.resize(width, height);
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      chart.remove();
    };
  }, [detail]);

  return <div ref={containerRef} className="h-full w-full" />;
}
