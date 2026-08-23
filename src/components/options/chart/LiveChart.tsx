"use client";


import { Settings, Trash2, ChevronDown, Maximize, EyeOff } from "lucide-react";
import { INDICATOR_LIST } from "./IndicatorsModal";
import { IndicatorSettingsModal } from "./IndicatorSettingsModal";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AreaSeries,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
  ColorType,
  CrosshairMode,
  LineStyle,
  LineType,
  createChart,
  createSeriesMarkers,
  type AreaData,
  type CandlestickData,
  type IChartApi,
  type IPriceLine,
  type ISeriesApi,
  type ISeriesMarkersPluginApi,
  type MouseEventParams,
  type SeriesMarker,
  type Time,
  type UTCTimestamp,
} from "lightweight-charts";
import {
  useDerivChartFeed,
  type FeedCandle,
  type FeedStatus,
  type FeedTick,
} from "@/hooks/useDerivChartFeed";
import { feedPlan, toDerivSymbol } from "@/services/deriv/derivSymbols";
import {
  useChartDrawings,
  type Drawing,
  type DrawingTool,
} from "@/stores/useChartDrawings";
import { CHART_COLORS } from "./chartColors";
import { TrendPrimitive, VerticalPrimitive } from "./chartPrimitives";
import type { ChartTypeId, IntervalId } from "./chartSettings";
import { useChartIndicators, type IndicatorConfig } from "@/stores/useChartIndicators";
import { 
  calculateSMA, calculateEMA, calculateMA, calculateRSI, calculateMACD,
  calculateAwesomeOscillator, calculateROC, calculateStochastic, calculateWilliamsR,
  calculateCCI, calculateAroon, calculateADX, calculateIchimoku, calculateParabolicSAR, calculateZigZag, calculateBollingerBands, calculateDonchianChannel, calculateWMA, calculateMAEnvelope, calculateRainbowMA, calculateAlligator, calculateFractalChaosBands
  } from "@/lib/indicators";

/** Accent color for user-drawn lines (drawn on canvas — needs literal hex). */
const DRAWING_COLOR = "#2962FF";

/** Live chart objects backing one Drawing, removed when the drawing is deleted. */
type DrawingObj =
  | { kind: "priceline"; line: IPriceLine }
  | { kind: "primitive"; primitive: TrendPrimitive | VerticalPrimitive };

interface LiveChartProps {
  /** Catalog id (e.g. "vol_100_1s") — mapped to a Deriv symbol internally. */
  symbol: string;
  chartType: ChartTypeId;
  interval: IntervalId;
  /** Lifts the latest streamed price so MarketPill can show it live. */
  onPrice?: (price: number) => void;
}

/** A horizontal barrier line (e.g. Rise/Fall entry, Touch/No-Touch barrier). */
export interface PriceLineSpec {
  price: number;
  color?: string;
  title?: string;
  /** 1–4. */
  lineWidth?: number;
  lineStyle?: LineStyle;
}

/**
 * Imperative handle for the future Options overlay layer. Lets ticket panels
 * draw/clear barrier lines and entry/exit markers without owning the chart.
 */
export interface LiveChartHandle {
  /** Replace all barrier lines. Survives chart-type (series) switches. */
  setPriceLines: (lines: PriceLineSpec[]) => void;
  clearPriceLines: () => void;
  /** Replace time-scale markers (entry/exit/settlement). */
  setMarkers: (markers: SeriesMarker<Time>[]) => void;
  getChart: () => IChartApi | null;
  getSeries: () =>
    | ISeriesApi<"Area">
    | ISeriesApi<"Candlestick">
    | null;
}

/**
 * Real-time chart backed by lightweight-charts + the Deriv WebSocket feed.
 *
 * The canvas chart, its series, and the data buffers all live in refs so the
 * tick stream bypasses React's render path entirely — only the connection
 * status (a rare event) is React state. The series type follows `chartType`
 * (area vs candlestick); the wire format follows `interval` (raw ticks vs
 * candles). Overlays (price lines + markers) are stored as specs and
 * re-applied whenever the series is recreated, so a chart-type switch never
 * drops the Options barriers an upstream ticket has drawn.
 */
export const LiveChart = forwardRef<LiveChartHandle, LiveChartProps>(
  function LiveChart({ symbol, chartType, interval, onPrice }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<
      ISeriesApi<"Area"> | ISeriesApi<"Candlestick"> | null
    >(null);

    // Data buffers — replaced on seed, mutated tail-only on update.
    const ticksRef = useRef<FeedTick[]>([]);
    const candlesRef = useRef<FeedCandle[]>([]);

    // Overlay state (specs persist across series recreation).
    const priceLineSpecsRef = useRef<PriceLineSpec[]>([]);
    const priceLineObjsRef = useRef<IPriceLine[]>([]);
    const markersRef = useRef<SeriesMarker<Time>[]>([]);
    const markersApiRef = useRef<ISeriesMarkersPluginApi<Time> | null>(null);

    // Indicators state
    const indicatorSeriesRef = useRef<Map<string, ISeriesApi<any>>>(new Map());
    const indicatorPluginsRef = useRef<Map<string, ISeriesMarkersPluginApi<Time>>>(new Map());
      const indicatorPriceLinesRef = useRef<Map<string, { overBought?: IPriceLine, overSold?: IPriceLine }>>(new Map());
    
    const allIndicators = useChartIndicators((s) => s.indicators);
    const removeIndicator = useChartIndicators((s) => s.removeIndicator);
    const [settingsIndicatorId, setSettingsIndicatorId] = useState<string | null>(null);
    const [minimizedIndicators, setMinimizedIndicators] = useState<Set<string>>(new Set());

    const activeIndicators = useMemo(() => allIndicators.filter((i) => i.symbol === symbol), [allIndicators, symbol]);
    const activeIndicatorsRef = useRef<IndicatorConfig[]>(activeIndicators);
    activeIndicatorsRef.current = activeIndicators;

    // Drawing tools: armed tool + this symbol's drawings (from the store), plus
    // the live chart objects backing them and the pending first trend-line click.
    const activeTool = useChartDrawings((s) => s.activeTool);
    const allDrawings = useChartDrawings((s) => s.drawings);
    const drawings = useMemo(
      () => allDrawings.filter((d) => d.symbol === symbol),
      [allDrawings, symbol],
    );
    const drawingsRef = useRef<Drawing[]>(drawings);
    drawingsRef.current = drawings;
    const activeToolRef = useRef<DrawingTool | null>(activeTool);
    activeToolRef.current = activeTool;
    const drawingObjsRef = useRef<Map<string, DrawingObj>>(new Map());
    const pendingTrendRef = useRef<{ time: Time; price: number } | null>(null);

    const [status, setStatus] = useState<FeedStatus>("idle");
    const [paneHeight, setPaneHeight] = useState(0.22);
    const [isResizing, setIsResizing] = useState(false);

    const activeScales = new Set<string>();
      activeIndicators.forEach((ind) => {
        if (ind.type === "RSI") activeScales.add("rsi-scale");
        else if (ind.type === "MACD") activeScales.add("macd-scale");
        else if (ind.type === "awesome_oscillator") activeScales.add("ao-scale");
        else if (ind.type === "stochastic") activeScales.add("stoch-scale");
        else if (ind.type === "aroon") activeScales.add("aroon-scale");
        else if (ind.type === "adx") activeScales.add("adx-scale");
        else if (ind.type === "roc" || ind.type === "wpr" || ind.type === "cci") activeScales.add(`${ind.type}-scale`);
      });
      const numOscillators = activeScales.size;

      const derivSymbol = toDerivSymbol(symbol);
    const plan = feedPlan(chartType, interval);
    const seriesKind = plan.seriesKind;

    // ── Chart instance: created once, resized via ResizeObserver ────────────
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      // Literal hex only — lightweight-charts cannot parse oklch() (the form
      // our --opt-* Tailwind tokens resolve to). See chartColors.ts.
      const line = CHART_COLORS.line;
      const inkFaint = CHART_COLORS.inkFaint;

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
        crosshair: { mode: CrosshairMode.Normal },
        rightPriceScale: { borderColor: line },
        timeScale: {
          borderColor: line,
          timeVisible: true,
          secondsVisible: false,
        },
      });
      chartRef.current = chart;

      // Keep the canvas matched to its flex container (mandated ResizeObserver).
      // Fires every frame while the drawer-compress grid transition runs, so
      // chart.resize() keeps the canvas in lock-step with the shrinking column.
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
        markersApiRef.current = null;
        priceLineObjsRef.current = [];
        drawingObjsRef.current.clear();
      };
    }, []);

    // ── Series: (re)created when the kind changes; rehydrated + re-overlaid ──
    useEffect(() => {
      const chart = chartRef.current;
      const el = containerRef.current;
      if (!chart || !el) return;

      // Literal hex only — see chartColors.ts (oklch crashes the chart parser).
      const ink = CHART_COLORS.ink;
      const rise = CHART_COLORS.rise;
      const fall = CHART_COLORS.fall;

      if (seriesRef.current) {
        chart.removeSeries(seriesRef.current);
        seriesRef.current = null;
        priceLineObjsRef.current = []; // died with the old series
        markersApiRef.current = null;
        drawingObjsRef.current.clear(); // price lines + primitives died too
      }

      if (seriesKind === "candlestick") {
        seriesRef.current = chart.addSeries(CandlestickSeries, {
          upColor: rise,
          downColor: fall,
          borderUpColor: rise,
          borderDownColor: fall,
          wickUpColor: rise,
          wickDownColor: fall,
        });
      } else {
        seriesRef.current = chart.addSeries(AreaSeries, {
          lineColor: ink,
          topColor: hexToRgba(ink, 0.18),
          bottomColor: hexToRgba(ink, 0),
          lineWidth: 2,
        });
      }

      hydrateSeries(
        seriesRef.current,
        seriesKind,
        ticksRef.current,
        candlesRef.current,
      );
      // Re-attach overlays to the fresh series.
      applyPriceLines(seriesRef.current, priceLineSpecsRef.current, priceLineObjsRef);
      markersApiRef.current = createSeriesMarkers(
        seriesRef.current,
        markersRef.current,
      );
      // Re-attach user drawings to the fresh series.
      applyDrawings(seriesRef.current, drawingsRef.current, drawingObjsRef);
      syncIndicators(chart, indicatorSeriesRef, indicatorPluginsRef, indicatorPriceLinesRef, activeIndicatorsRef.current, seriesKind, ticksRef.current, candlesRef.current, paneHeight, minimizedIndicators);
      chart.timeScale().fitContent();
    }, [seriesKind]);

    // ── Drawing tools: cursor, click capture, and render sync ───────────────
    // Crosshair cursor while a tool is armed; clear a half-finished trend line
    // when the tool is disarmed.
    useEffect(() => {
      const el = containerRef.current;
      if (el) el.style.cursor = activeTool ? "crosshair" : "";
      if (!activeTool) pendingTrendRef.current = null;
    }, [activeTool]);

    // Subscribe to chart clicks once; the handler reads the armed tool from a
    // ref so it never goes stale. Horizontal → one click; vertical → one click;
    // trend → two clicks. Placing a drawing disarms the tool (one-shot).
    useEffect(() => {
      const chart = chartRef.current;
      if (!chart) return;
      const handler = (param: MouseEventParams) => {
        const tool = activeToolRef.current;
        const series = seriesRef.current;
        const point = param.point;
        if (!tool || !series || !point) return;

        const price = series.coordinateToPrice(point.y);
        const time = (param.time ??
          chart.timeScale().coordinateToTime(point.x)) as Time | null;
        const store = useChartDrawings.getState();

        if (tool === "horizontal") {
          if (price === null) return;
          store.addDrawing({ symbol, tool, color: DRAWING_COLOR, price: Number(price) });
          store.setActiveTool(null);
        } else if (tool === "vertical") {
          if (time === null) return;
          store.addDrawing({ symbol, tool, color: DRAWING_COLOR, time: Number(time) });
          store.setActiveTool(null);
        } else {
          // trend — first click anchors, second click completes.
          if (time === null || price === null) return;
          const pt = { time, price: Number(price) };
          if (!pendingTrendRef.current) {
            pendingTrendRef.current = pt;
            return;
          }
          const a = pendingTrendRef.current;
          store.addDrawing({
            symbol,
            tool,
            color: DRAWING_COLOR,
            points: [
              { time: Number(a.time), price: a.price },
              { time: Number(pt.time), price: pt.price },
            ],
          });
          pendingTrendRef.current = null;
          store.setActiveTool(null);
        }
      };
      chart.subscribeClick(handler);
      return () => chart.unsubscribeClick(handler);
    }, [symbol]);

    // Re-render drawings whenever the store set for this symbol changes.
    useEffect(() => {
      if (seriesRef.current) {
        applyDrawings(seriesRef.current, drawings, drawingObjsRef);
      }
    }, [drawings]);

    // Re-sync indicators when the active list changes.
    useEffect(() => {
      if (chartRef.current) {
        syncIndicators(chartRef.current, indicatorSeriesRef, indicatorPluginsRef, indicatorPriceLinesRef, activeIndicators, seriesKind, ticksRef.current, candlesRef.current, paneHeight, minimizedIndicators);
      }
    }, [activeIndicators, seriesKind]);

    // ── Live feed — pushes straight into the series via refs ────────────────
    useDerivChartFeed({
      derivSymbol,
      style: plan.style,
      granularity: plan.granularity,
      enabled: Boolean(derivSymbol),
      onStatus: setStatus,
      onSeedTicks: (ticks) => {
        ticksRef.current = ticks;
        if (seriesKind === "area") {
          (seriesRef.current as ISeriesApi<"Area"> | null)?.setData(
            toAreaData(ticks),
          );
          chartRef.current?.timeScale().fitContent();
        }
        if (chartRef.current) syncIndicators(chartRef.current, indicatorSeriesRef, indicatorPluginsRef, indicatorPriceLinesRef, activeIndicatorsRef.current, seriesKind, ticksRef.current, candlesRef.current, paneHeight, minimizedIndicators);
        const last = ticks[ticks.length - 1];
        if (last) onPrice?.(last.value);
      },
      onTick: (tick) => {
        pushTick(ticksRef.current, tick);
        if (seriesKind === "area") {
          try {
            (seriesRef.current as ISeriesApi<"Area"> | null)?.update({
              time: tick.time as UTCTimestamp,
              value: tick.value,
            });
          } catch {
            /* out-of-order tick — ignore */
          }
        }
        if (chartRef.current) syncIndicators(chartRef.current, indicatorSeriesRef, indicatorPluginsRef, indicatorPriceLinesRef, activeIndicatorsRef.current, seriesKind, ticksRef.current, candlesRef.current, paneHeight, minimizedIndicators);
        onPrice?.(tick.value);
      },
      onSeedCandles: (candles) => {
        candlesRef.current = candles;
        ticksRef.current = candles.map((c) => ({
          time: c.time,
          value: c.close,
        }));
        hydrateSeries(seriesRef.current, seriesKind, ticksRef.current, candles);
        chartRef.current?.timeScale().fitContent();
        if (chartRef.current) syncIndicators(chartRef.current, indicatorSeriesRef, indicatorPluginsRef, indicatorPriceLinesRef, activeIndicatorsRef.current, seriesKind, ticksRef.current, candlesRef.current, paneHeight, minimizedIndicators);
        const last = candles[candles.length - 1];
        if (last) onPrice?.(last.close);
      },
      onCandle: (candle) => {
        upsertCandle(candlesRef.current, candle);
        try {
          if (seriesKind === "candlestick") {
            (seriesRef.current as ISeriesApi<"Candlestick"> | null)?.update(
              toCandleDatum(candle),
            );
          } else {
            (seriesRef.current as ISeriesApi<"Area"> | null)?.update({
              time: candle.time as UTCTimestamp,
              value: candle.close,
            });
          }
        } catch {
          /* out-of-order candle — ignore */
        }
        if (chartRef.current) syncIndicators(chartRef.current, indicatorSeriesRef, indicatorPluginsRef, indicatorPriceLinesRef, activeIndicatorsRef.current, seriesKind, ticksRef.current, candlesRef.current, paneHeight, minimizedIndicators);
        onPrice?.(candle.close);
      },
    });

    // ── Imperative overlay API for the future Options layer ─────────────────
    useImperativeHandle(
      ref,
      (): LiveChartHandle => ({
        setPriceLines: (lines) => {
          priceLineSpecsRef.current = lines;
          if (seriesRef.current) {
            applyPriceLines(seriesRef.current, lines, priceLineObjsRef);
          }
        },
        clearPriceLines: () => {
          priceLineSpecsRef.current = [];
          if (seriesRef.current) {
            applyPriceLines(seriesRef.current, [], priceLineObjsRef);
          }
        },
        setMarkers: (markers) => {
          markersRef.current = markers;
          markersApiRef.current?.setMarkers(markers);
        },
        getChart: () => chartRef.current,
        getSeries: () => seriesRef.current,
      }),
      [],
    );

    return (
      <div className="relative h-full w-full min-h-0">
        
        {/* Indicator Legends */}
        <div className="absolute top-2 left-14 z-10 flex flex-col gap-1 pointer-events-none">
          {activeIndicators.filter(ind => ["ma", "ma_envelope", "rainbow_ma", "bollinger", "donchian", "alligator", "fractal", "ichimoku", "parabolic_sar", "zigzag"].includes(ind.type)).map(ind => {
            const meta = INDICATOR_LIST.find(i => i.id === ind.type);
            const name = meta ? meta.name : ind.type;
            return (
              <div key={ind.id} className="flex items-center gap-2 pointer-events-auto group">
                <span className="text-[11px] font-medium text-opt-ink-2 bg-opt-bg-main/50 px-1 rounded">{name}</span>
                <button onClick={() => setSettingsIndicatorId(ind.id)} className="opacity-100 p-1 hover:bg-opt-bg-hover rounded text-opt-ink-3 hover:text-opt-ink-1 transition-all"><Settings className="w-3 h-3" /></button>
                <button onClick={() => removeIndicator(ind.id)} className="opacity-100 p-1 hover:bg-opt-bg-hover rounded text-opt-ink-3 hover:text-red-400 transition-all"><Trash2 className="w-3 h-3" /></button>
              </div>
            );
          })}
        </div>

        {activeIndicators.filter(ind => !["ma", "ma_envelope", "rainbow_ma", "bollinger", "donchian", "alligator", "fractal", "ichimoku", "parabolic_sar", "zigzag"].includes(ind.type)).map((ind, index, arr) => {
          const meta = INDICATOR_LIST.find(i => i.id === ind.type);
          const name = meta ? meta.name.toUpperCase() : ind.type.toUpperCase();
          const totalOscillatorHeight = Math.min(0.8, paneHeight * arr.length);
          const actualPaneHeight = totalOscillatorHeight / arr.length;
          const baseTop = 1 - totalOscillatorHeight + (index * actualPaneHeight);
          
          return (
            <div key={ind.id} className="absolute left-14 z-10 flex items-center gap-2 pointer-events-auto group" style={{ top: `calc((100% - 26px) * ${baseTop} + 6px)` }}>
               <span className="text-[10px] font-bold text-opt-ink-2 px-1 rounded">{name}</span>
               <button onClick={() => setSettingsIndicatorId(ind.id)} className="opacity-100 p-1 hover:bg-opt-bg-hover rounded text-opt-ink-3 hover:text-opt-ink-1 transition-all"><Settings className="w-3 h-3" /></button>
               <button onClick={() => removeIndicator(ind.id)} className="opacity-100 p-1 hover:bg-opt-bg-hover rounded text-opt-ink-3 hover:text-red-400 transition-all"><Trash2 className="w-3 h-3" /></button>
            </div>
          );
        })}

        {settingsIndicatorId && (
          <IndicatorSettingsModal 
             indicatorId={settingsIndicatorId} 
              
             onClose={() => setSettingsIndicatorId(null)} 
          />
        )}

        <div ref={containerRef} className="absolute inset-0" />
        {numOscillators > 0 && (
          <div 
            style={{ 
              position: 'absolute', 
              top: `calc((100% - 26px) * ${1 - (paneHeight * numOscillators) - 0.01})`,
              left: 0, 
              right: 0, 
              height: '14px', 
              marginTop: '-7px', 
              cursor: 'ns-resize',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onPointerDown={(e) => {
               e.preventDefault();
               setIsResizing(true);
               const startY = e.clientY;
               const startHeight = paneHeight;
               const container = containerRef.current;
               if (!container) return;
               const containerHeight = container.clientHeight;
               
               const handleMove = (moveEvent: PointerEvent) => {
                  const deltaY = moveEvent.clientY - startY;
                  const deltaPercent = deltaY / containerHeight;
                  let newPaneHeight = startHeight - (deltaPercent / numOscillators);
                  
                  if (newPaneHeight < 0.1) newPaneHeight = 0.1;
                  if (newPaneHeight * numOscillators > 0.8) newPaneHeight = 0.8 / numOscillators;
                  
                  setPaneHeight(newPaneHeight);
               };
               
               const handleUp = () => {
                  setIsResizing(false);
                  window.removeEventListener('pointermove', handleMove);
                  window.removeEventListener('pointerup', handleUp);
               };
               
               window.addEventListener('pointermove', handleMove);
               window.addEventListener('pointerup', handleUp);
            }}
          >
            {/* The horizontal separator line */}
            <div className={`absolute left-0 right-0 h-[1px] pointer-events-none transition-colors ${isResizing ? 'bg-blue-500' : 'bg-opt-ink-3 opacity-40'}`} style={{ top: '50%' }}></div>
            
            {/* The drag pill */}
            <div className={`w-[36px] h-[14px] rounded-full flex flex-col items-center justify-center border shadow-sm relative z-10 gap-[2px] transition-colors ${isResizing ? 'border-blue-500 bg-opt-bg-elev' : 'border-opt-line-strong bg-opt-bg-elev hover:bg-opt-bg-sunk'}`}>
              <div className={`w-[12px] h-[1.5px] rounded-full transition-colors ${isResizing ? 'bg-blue-500' : 'bg-opt-ink-3 opacity-60'}`}></div>
              <div className={`w-[12px] h-[1.5px] rounded-full transition-colors ${isResizing ? 'bg-blue-500' : 'bg-opt-ink-3 opacity-60'}`}></div>
            </div>
          </div>
        )}
        <FeedStatusBadge status={status} unsupported={!derivSymbol} />
      </div>
    );
  },
);

// ─── status overlay ──────────────────────────────────────────────────────────

function FeedStatusBadge({
  status,
  unsupported,
}: {
  status: FeedStatus;
  unsupported: boolean;
}) {
  if (unsupported) {
    return (
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-opt-bg-sunk px-3 py-1.5 text-[12px] text-opt-ink-3">
        This market isn’t available on the live feed yet.
      </div>
    );
  }
  if (status === "open" || status === "idle") return null;
  const label =
    status === "connecting"
      ? "Connecting to live feed…"
      : status === "closed"
        ? "Reconnecting…"
        : "Live feed error";
  return (
    <div className="pointer-events-none absolute right-3 top-2 rounded-full bg-opt-bg-sunk px-2.5 py-1 text-[11px] font-medium text-opt-ink-3">
      {label}
    </div>
  );
}

// ─── overlay helpers ─────────────────────────────────────────────────────────

/** Remove any existing price lines on `series`, then draw `specs` afresh. */
function applyPriceLines(
  series: ISeriesApi<"Area"> | ISeriesApi<"Candlestick">,
  specs: PriceLineSpec[],
  objsRef: React.MutableRefObject<IPriceLine[]>,
) {
  for (const line of objsRef.current) {
    try {
      series.removePriceLine(line);
    } catch {
      /* series may have been recreated — safe to ignore */
    }
  }
  objsRef.current = specs.map((spec) =>
    series.createPriceLine({
      price: spec.price,
      color: spec.color ?? "#7b8298",
      lineWidth: (spec.lineWidth ?? 1) as 1 | 2 | 3 | 4,
      lineStyle: spec.lineStyle ?? LineStyle.Dashed,
      axisLabelVisible: true,
      title: spec.title ?? "",
    }),
  );
}

/** Tear down every tracked drawing on `series`, then (re)create from `drawings`.
 *  Horizontal → built-in price line; trend/vertical → v5 series primitives. */
function applyDrawings(
  series: ISeriesApi<"Area"> | ISeriesApi<"Candlestick">,
  drawings: Drawing[],
  objsRef: React.MutableRefObject<Map<string, DrawingObj>>,
) {
  for (const obj of objsRef.current.values()) {
    try {
      if (obj.kind === "priceline") series.removePriceLine(obj.line);
      else series.detachPrimitive(obj.primitive);
    } catch {
      /* series may have been recreated — safe to ignore */
    }
  }
  objsRef.current.clear();

  for (const d of drawings) {
    if (d.tool === "horizontal" && d.price != null) {
      const line = series.createPriceLine({
        price: d.price,
        color: d.color,
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
        axisLabelVisible: true,
        title: "",
      });
      objsRef.current.set(d.id, { kind: "priceline", line });
    } else if (d.tool === "vertical" && d.time != null) {
      const primitive = new VerticalPrimitive(d.time as Time, d.color);
      series.attachPrimitive(primitive);
      objsRef.current.set(d.id, { kind: "primitive", primitive });
    } else if (d.tool === "trend" && d.points) {
      const [p1, p2] = d.points;
      const primitive = new TrendPrimitive(
        { time: p1.time as Time, price: p1.price },
        { time: p2.time as Time, price: p2.price },
        d.color,
      );
      series.attachPrimitive(primitive);
      objsRef.current.set(d.id, { kind: "primitive", primitive });
    }
  }
}

// ─── data helpers ────────────────────────────────────────────────────────────

const MAX_POINTS = 1500;

/** Drop non-ascending points; collapse equal timestamps to the latest. */
function ascending<T extends { time: number }>(arr: T[]): T[] {
  const out: T[] = [];
  for (const it of arr) {
    const last = out[out.length - 1];
    if (last && it.time < last.time) continue;
    if (last && it.time === last.time) {
      out[out.length - 1] = it;
      continue;
    }
    out.push(it);
  }
  return out;
}

function toAreaData(ticks: FeedTick[]): AreaData[] {
  return ascending(ticks).map((t) => ({
    time: t.time as UTCTimestamp,
    value: t.value,
  }));
}

function toCandleData(candles: FeedCandle[]): CandlestickData[] {
  return ascending(candles).map(toCandleDatum);
}

function toCandleDatum(c: FeedCandle): CandlestickData {
  return {
    time: c.time as UTCTimestamp,
    open: c.open,
    high: c.high,
    low: c.low,
    close: c.close,
  };
}

function hydrateSeries(
  series: ISeriesApi<"Area"> | ISeriesApi<"Candlestick"> | null,
  kind: "area" | "candlestick",
  ticks: FeedTick[],
  candles: FeedCandle[],
) {
  if (!series) return;
  if (kind === "candlestick") {
    (series as ISeriesApi<"Candlestick">).setData(toCandleData(candles));
  } else {
    (series as ISeriesApi<"Area">).setData(toAreaData(ticks));
  }
}

/** Append a tick, replacing the tail if the second repeats; cap the buffer. */
function pushTick(buf: FeedTick[], tick: FeedTick) {
  const last = buf[buf.length - 1];
  if (last && tick.time === last.time) buf[buf.length - 1] = tick;
  else if (!last || tick.time > last.time) buf.push(tick);
  if (buf.length > MAX_POINTS) buf.splice(0, buf.length - MAX_POINTS);
}

/** Update the forming candle in place, or append a new bucket. */
function upsertCandle(buf: FeedCandle[], candle: FeedCandle) {
  const last = buf[buf.length - 1];
  if (last && candle.time === last.time) buf[buf.length - 1] = candle;
  else if (!last || candle.time > last.time) buf.push(candle);
  if (buf.length > MAX_POINTS) buf.splice(0, buf.length - MAX_POINTS);
}

/** "#rrggbb" → "rgba(r,g,b,a)". Falls back to the input for non-hex. */
function hexToRgba(hex: string, alpha: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1]!, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ─── indicators ──────────────────────────────────────────────────────────────

/**
 * Creates, removes, and updates indicator series on the chart.
 * OHLC data implies candles, otherwise ticks.
 */
function syncIndicators(
  chart: IChartApi,
  seriesRef: React.MutableRefObject<Map<string, ISeriesApi<any>>>,
  pluginsRef: React.MutableRefObject<Map<string, ISeriesMarkersPluginApi<Time>>>,
  priceLinesRef: React.MutableRefObject<Map<string, { overBought?: IPriceLine, overSold?: IPriceLine }>>,
  activeIndicators: IndicatorConfig[],
  seriesKind: "area" | "candlestick",
  ticks: FeedTick[],
  candles: FeedCandle[],
  paneHeight: number,
  minimizedIndicators: Set<string> = new Set()
) {
  // Remove series that are no longer active
  const activeIds = new Set(activeIndicators.map(i => i.id));
  for (const [id, series] of seriesRef.current.entries()) {
    // Extract the base ID by taking the first 3 segments (type-timestamp-random)
    const baseId = id.split('-').slice(0, 3).join('-');
    if (!activeIds.has(baseId)) {
      try { chart.removeSeries(series); } catch {}
      seriesRef.current.delete(id);
      
      const plugin = pluginsRef.current.get(id);
      if (plugin) {
        plugin.detach();
        pluginsRef.current.delete(id);
      }
    }
  }

  // Extract ordered values
  const timeArray: UTCTimestamp[] = [];
  const valueArray: number[] = [];
  const highArray: number[] = [];
  const lowArray: number[] = [];
  const openArray: number[] = [];
  const hl2Array: number[] = [];
  const hlc3Array: number[] = [];

  if (candles && candles.length > 0) {
    const ascendingCandles = ascending(candles);
    for (const c of ascendingCandles) {
        timeArray.push(c.time as UTCTimestamp);
        valueArray.push(c.close);
        highArray.push(c.high);
        lowArray.push(c.low);
        openArray.push(c.open);
        hl2Array.push((c.high + c.low) / 2);
        hlc3Array.push((c.high + c.low + c.close) / 3);
    }
  } else {
    const ascendingTicks = ascending(ticks);
    for (const t of ascendingTicks) {
      timeArray.push(t.time as UTCTimestamp);
      valueArray.push(t.value);
      highArray.push(t.value);
      lowArray.push(t.value);
      openArray.push(t.value);
      hl2Array.push(t.value);
      hlc3Array.push(t.value);
    }
  }

  // Update or create active indicators
  for (const ind of activeIndicators) {
    try {
    if (ind.type === "ma" || ind.type === "RSI") {
      let series = seriesRef.current.get(ind.id) as ISeriesApi<"Line">;
      if (!series) {
        // RSI goes on a separate sub-pane scale, SMA/EMA go on right axis
        const isRsi = ind.type === "RSI";
        series = chart.addSeries(LineSeries, {
          color: isRsi ? "#9c27b0" : (ind.params.maType === "SMA" ? "#ff9800" : (ind.params.maType === "EMA" ? "#2196f3" : "#00A79E")),
          lineWidth: 2,
          priceScaleId: isRsi ? `${ind.id}-scale` : "right",
          ...(isRsi ? { autoscaleInfoProvider: () => ({ priceRange: { minValue: 0, maxValue: 100 } }) } : {})
        });
        if (isRsi) {
          chart.priceScale(`${ind.id}-scale`).applyOptions({
            scaleMargins: { top: 0.8, bottom: 0 },
          });
        }
        seriesRef.current.set(ind.id, series);
      }

      let results: number[] = [];
      const p = ind.params.period || 14;
      if (ind.type === "RSI") {
        let targetArray = valueArray;
        switch (ind.params.field) {
          case "Open": targetArray = openArray; break;
          case "High": targetArray = highArray; break;
          case "Low": targetArray = lowArray; break;
          case "Close": targetArray = valueArray; break;
          case "Hl/2": targetArray = hl2Array; break;
          case "Hlc/3": targetArray = hlc3Array; break;
        }
        results = calculateRSI(targetArray, p);
        
        series.applyOptions({ color: ind.params.rsiColor || "#9c27b0" });
        
        if (ind.params.showZones !== false) {
            const obVal = ind.params.overBoughtValue ?? 80;
            const osVal = ind.params.overSoldValue ?? 20;
            const obCol = ind.params.overBoughtColor || "#ffffff";
            const osCol = ind.params.overSoldColor || "#ffffff";
            
            let obLine = seriesRef.current.get(`${ind.id}-ob`) as ISeriesApi<"Line">;
            let osLine = seriesRef.current.get(`${ind.id}-os`) as ISeriesApi<"Line">;
            if (!obLine || !osLine) {
                obLine = chart.addSeries(LineSeries, { color: obCol, lineWidth: 1, lineStyle: LineStyle.Solid, priceScaleId: `${ind.id}-scale`, lastValueVisible: false, priceLineVisible: false, crosshairMarkerVisible: false });
                osLine = chart.addSeries(LineSeries, { color: osCol, lineWidth: 1, lineStyle: LineStyle.Solid, priceScaleId: `${ind.id}-scale`, lastValueVisible: false, priceLineVisible: false, crosshairMarkerVisible: false });
                seriesRef.current.set(`${ind.id}-ob`, obLine);
                seriesRef.current.set(`${ind.id}-os`, osLine);
            } else {
                obLine.applyOptions({ color: obCol });
                osLine.applyOptions({ color: osCol });
            }
            
            const obData = timeArray.map((t) => ({ time: t, value: obVal }));
            const osData = timeArray.map((t) => ({ time: t, value: osVal }));
            obLine.setData(obData as any);
            osLine.setData(osData as any);
        } else {
            let obLine = seriesRef.current.get(`${ind.id}-ob`) as ISeriesApi<"Line"> | undefined;
            let osLine = seriesRef.current.get(`${ind.id}-os`) as ISeriesApi<"Line"> | undefined;
            if (obLine) { chart.removeSeries(obLine); seriesRef.current.delete(`${ind.id}-ob`); }
            if (osLine) { chart.removeSeries(osLine); seriesRef.current.delete(`${ind.id}-os`); }
        }
      } else if (ind.type === "ma") {
        const p = ind.params.period || 50;
        const maType = ind.params.movingAverageType || ind.params.maType || "Simple";
        const offset = ind.params.offset || 0;
        
        let targetArray = valueArray;
        switch (ind.params.field) {
          case "Open": targetArray = openArray; break;
          case "High": targetArray = highArray; break;
          case "Low": targetArray = lowArray; break;
          case "Close": targetArray = valueArray; break;
          case "Hl/2": targetArray = hl2Array; break;
          case "Hlc/3": targetArray = hlc3Array; break;
        }

        results = calculateMA(targetArray, p, maType as string, offset as number);
        
        if (ind.params.maColor) {
          series.applyOptions({ color: ind.params.maColor });
        }
        series.applyOptions({ priceFormat: { type: 'price', precision: 2, minMove: 0.01 } });
      }

      const data = results.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
      if (data.length > 0) {
        series.setData(data as any);
      }
    } else if (ind.type === "ma_envelope") {
      let upper = seriesRef.current.get(`${ind.id}-upper`) as ISeriesApi<"Line">;
      let middle = seriesRef.current.get(`${ind.id}-middle`) as ISeriesApi<"Line">;
      let lower = seriesRef.current.get(`${ind.id}-lower`) as ISeriesApi<"Line">;
      
      if (!upper || !middle || !lower) {
        upper = chart.addSeries(LineSeries, { color: '#2196f3', lineWidth: 1, priceScaleId: 'right' });
        middle = chart.addSeries(LineSeries, { color: '#ff9800', lineWidth: 1, priceScaleId: 'right' });
        lower = chart.addSeries(LineSeries, { color: '#2196f3', lineWidth: 1, priceScaleId: 'right' });
        seriesRef.current.set(`${ind.id}-upper`, upper);
        seriesRef.current.set(`${ind.id}-middle`, middle);
        seriesRef.current.set(`${ind.id}-lower`, lower);
      }
      
      const p = ind.params.period || 50;
      const shift = ind.params.shift || 5;
      const shiftType = ind.params.shiftType || "percent";
      const maType = ind.params.movingAverageType || ind.params.maType || "SMA";
      
      const results = calculateMAEnvelope(valueArray, p, maType, shift, shiftType);
      
      const upperData = results.upper.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
      const middleData = results.middle.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
      const lowerData = results.lower.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
      
      if (upperData.length > 0) upper.setData(upperData as any);
      if (middleData.length > 0) middle.setData(middleData as any);
      if (lowerData.length > 0) lower.setData(lowerData as any);
    } else if (ind.type === "rainbow_ma") {
      const numLines = 10;
      let linesArr: ISeriesApi<"Line">[] = [];
      
      const colors = [
        '#ff3b3b', '#ff9800', '#ffeb3b', '#8bc34a', '#4caf50', 
        '#00bcd4', '#2196f3', '#3f51b5', '#9c27b0', '#e91e63'
      ];
      
      for (let k = 0; k < numLines; k++) {
        let line = seriesRef.current.get(`${ind.id}-rainbow-${k}`) as ISeriesApi<"Line">;
        if (!line) {
          line = chart.addSeries(LineSeries, { color: colors[k], lineWidth: 1, priceScaleId: 'right' });
          seriesRef.current.set(`${ind.id}-rainbow-${k}`, line);
        }
        linesArr.push(line);
      }
      
      const p = ind.params.period || 2;
      const maType = ind.params.movingAverageType || ind.params.maType || "SMA";
      const results = calculateRainbowMA(valueArray, p, maType);
      
      for (let k = 0; k < numLines; k++) {
        const data = results[k].map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
        if (data.length > 0) linesArr[k].setData(data as any);
      }
    } else if (ind.type === "MACD") {
      let hist = seriesRef.current.get(`${ind.id}-hist`) as ISeriesApi<"Histogram">;
      let macdLine = seriesRef.current.get(`${ind.id}-macd`) as ISeriesApi<"Line">;
      let signalLine = seriesRef.current.get(`${ind.id}-signal`) as ISeriesApi<"Line">;
      
      if (!hist || !macdLine || !signalLine) {
        hist = chart.addSeries(HistogramSeries, {
          priceScaleId: `${ind.id}-scale`,
          priceFormat: { type: 'price', precision: 4, minMove: 0.0001 }
        });
        macdLine = chart.addSeries(LineSeries, {
          lineWidth: 2,
          priceScaleId: `${ind.id}-scale`,
          priceFormat: { type: 'price', precision: 4, minMove: 0.0001 }
        });
        signalLine = chart.addSeries(LineSeries, {
          lineWidth: 2,
          priceScaleId: `${ind.id}-scale`,
          priceFormat: { type: 'price', precision: 4, minMove: 0.0001 }
        });
        chart.priceScale(`${ind.id}-scale`).applyOptions({
          scaleMargins: { top: 0.75, bottom: 0 },
        });
        seriesRef.current.set(`${ind.id}-hist`, hist);
        seriesRef.current.set(`${ind.id}-macd`, macdLine);
        seriesRef.current.set(`${ind.id}-signal`, signalLine);
      }

      const pFast = ind.params.fastPeriod || 12;
      const pSlow = ind.params.slowPeriod || 26;
      const pSignal = ind.params.signalPeriod || 9;
      const results = calculateMACD(valueArray, pFast, pSlow, pSignal);

      const histData = results.histogram.map((val, i) => ({ time: timeArray[i], value: val, color: val >= 0 ? "#26a69a" : "#ef5350" })).filter(d => !isNaN(d.value));
      const macdData = results.macd.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
      const signalData = results.signal.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));

      if (histData.length > 0) hist.setData(histData as any);
      if (macdData.length > 0) macdLine.setData(macdData as any);
      if (signalData.length > 0) signalLine.setData(signalData as any);
    } else if (ind.type === "awesome_oscillator") {
      let hist = seriesRef.current.get(ind.id) as ISeriesApi<"Histogram">;
      if (!hist) {
        hist = chart.addSeries(HistogramSeries, {
          color: "#26a69a",
          priceScaleId: `${ind.id}-scale`,
          priceFormat: { type: 'price', precision: 4, minMove: 0.0001 }
        });
        chart.priceScale(`${ind.id}-scale`).applyOptions({ scaleMargins: { top: 0.75, bottom: 0 } });
        seriesRef.current.set(ind.id, hist);
      }
      const incColor = ind.params.increasingBarColor || "#26a69a";
      const decColor = ind.params.decreasingBarColor || "#ef5350";
      
      const results = calculateAwesomeOscillator(highArray, lowArray);
      const data = results.map((val, i) => ({ 
        time: timeArray[i], 
        value: val, 
        color: val > (results[i - 1] || 0) ? incColor : decColor 
      })).filter(d => !isNaN(d.value));
      if (data.length > 0) hist.setData(data as any);
    } else if (ind.type === "roc" || ind.type === "wpr") {
      let series = seriesRef.current.get(ind.id) as ISeriesApi<"Line">;
      if (!series) {
        series = chart.addSeries(LineSeries, {
          color: ind.type === "roc" ? "#000000" : (ind.params.wprColor || "#000000"),
          lineWidth: 2,
          priceScaleId: `${ind.id}-scale`,
          priceFormat: { type: 'price', precision: ind.type === "wpr" ? 2 : 4, minMove: ind.type === "wpr" ? 0.01 : 0.0001 }
        });
        chart.priceScale(`${ind.id}-scale`).applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
        
        if (ind.type === "roc") {
          series.createPriceLine({ price: 0, color: "#9e9e9e", lineWidth: 1, lineStyle: LineStyle.Solid, axisLabelVisible: false, title: "0" });
        }
        
        seriesRef.current.set(ind.id, series);
      } else {
        if (ind.type === "wpr") {
          series.applyOptions({ color: ind.params.wprColor || "#000000" });
        }
      }

      if (ind.type === "wpr") {
        if (ind.params.showZones !== false) {
          const obVal = ind.params.overBoughtValue ?? -20;
          const osVal = ind.params.overSoldValue ?? -80;
          const obCol = ind.params.overBoughtColor || "#000000";
          const osCol = ind.params.overSoldColor || "#000000";
          
          let obLine = seriesRef.current.get(`${ind.id}-ob`) as ISeriesApi<"Line">;
          let osLine = seriesRef.current.get(`${ind.id}-os`) as ISeriesApi<"Line">;
          if (!obLine || !osLine) {
              obLine = chart.addSeries(LineSeries, { color: obCol, lineWidth: 1, lineStyle: LineStyle.Solid, priceScaleId: `${ind.id}-scale`, lastValueVisible: false, priceLineVisible: false, crosshairMarkerVisible: false });
              osLine = chart.addSeries(LineSeries, { color: osCol, lineWidth: 1, lineStyle: LineStyle.Solid, priceScaleId: `${ind.id}-scale`, lastValueVisible: false, priceLineVisible: false, crosshairMarkerVisible: false });
              seriesRef.current.set(`${ind.id}-ob`, obLine);
              seriesRef.current.set(`${ind.id}-os`, osLine);
          } else {
              obLine.applyOptions({ color: obCol });
              osLine.applyOptions({ color: osCol });
          }
          
          const obData = timeArray.map((t) => ({ time: t, value: obVal }));
          const osData = timeArray.map((t) => ({ time: t, value: osVal }));
          obLine.setData(obData as any);
          osLine.setData(osData as any);
        } else {
          let obLine = seriesRef.current.get(`${ind.id}-ob`) as ISeriesApi<"Line"> | undefined;
          let osLine = seriesRef.current.get(`${ind.id}-os`) as ISeriesApi<"Line"> | undefined;
          if (obLine) { chart.removeSeries(obLine); seriesRef.current.delete(`${ind.id}-ob`); }
          if (osLine) { chart.removeSeries(osLine); seriesRef.current.delete(`${ind.id}-os`); }
        }
      }
      
      let results: number[] = [];
      const p = ind.params.period || 14;
      
      if (ind.type === "roc") {
        series.applyOptions({ color: ind.params.rocColor || "#000000" });
        let targetArray = valueArray;
        switch (ind.params.field) {
          case "Open": targetArray = openArray; break;
          case "High": targetArray = highArray; break;
          case "Low": targetArray = lowArray; break;
          case "Close": targetArray = valueArray; break;
          case "Hl/2": targetArray = hl2Array; break;
          case "Hlc/3": targetArray = hlc3Array; break;
        }
        results = calculateROC(targetArray, p);
      }
      if (ind.type === "wpr") results = calculateWilliamsR(highArray, lowArray, valueArray, p);

      const data = results.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
      if (data.length > 0) series.setData(data as any);
    } else if (ind.type === "cci") {
      let series = seriesRef.current.get(ind.id) as ISeriesApi<"Line">;
      if (!series) {
        series = chart.addSeries(LineSeries, {
          color: ind.params.cciColor || "#000000",
          lineWidth: 2,
          priceScaleId: `${ind.id}-scale`,
          priceFormat: { type: 'price', precision: 2, minMove: 0.01 }
        });
        chart.priceScale(`${ind.id}-scale`).applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
        seriesRef.current.set(ind.id, series);
      } else {
        series.applyOptions({ color: ind.params.cciColor || "#000000" });
      }

      if (ind.params.showZones !== false) {
        const obVal = ind.params.overBoughtValue ?? 100;
        const osVal = ind.params.overSoldValue ?? -100;
        const obCol = ind.params.overBoughtColor || "#000000";
        const osCol = ind.params.overSoldColor || "#000000";
        
        let obLine = seriesRef.current.get(`${ind.id}-ob`) as ISeriesApi<"Line">;
        let osLine = seriesRef.current.get(`${ind.id}-os`) as ISeriesApi<"Line">;
        if (!obLine || !osLine) {
            obLine = chart.addSeries(LineSeries, { color: obCol, lineWidth: 1, lineStyle: LineStyle.Solid, priceScaleId: `${ind.id}-scale`, lastValueVisible: false, priceLineVisible: false, crosshairMarkerVisible: false });
            osLine = chart.addSeries(LineSeries, { color: osCol, lineWidth: 1, lineStyle: LineStyle.Solid, priceScaleId: `${ind.id}-scale`, lastValueVisible: false, priceLineVisible: false, crosshairMarkerVisible: false });
            seriesRef.current.set(`${ind.id}-ob`, obLine);
            seriesRef.current.set(`${ind.id}-os`, osLine);
        } else {
            obLine.applyOptions({ color: obCol });
            osLine.applyOptions({ color: osCol });
        }
        
        const obData = timeArray.map((t) => ({ time: t, value: obVal }));
        const osData = timeArray.map((t) => ({ time: t, value: osVal }));
        obLine.setData(obData as any);
        osLine.setData(osData as any);
      } else {
        let obLine = seriesRef.current.get(`${ind.id}-ob`) as ISeriesApi<"Line"> | undefined;
        let osLine = seriesRef.current.get(`${ind.id}-os`) as ISeriesApi<"Line"> | undefined;
        if (obLine) { chart.removeSeries(obLine); seriesRef.current.delete(`${ind.id}-ob`); }
        if (osLine) { chart.removeSeries(osLine); seriesRef.current.delete(`${ind.id}-os`); }
      }

      const p = ind.params.period || 20;
      const results = calculateCCI(highArray, lowArray, valueArray, p);
      const data = results.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
      if (data.length > 0) series.setData(data as any);
      } else if (ind.type === "stochastic") {
        let kLine = seriesRef.current.get(`${ind.id}-k`) as ISeriesApi<"Line">;
        let dLine = seriesRef.current.get(`${ind.id}-d`) as ISeriesApi<"Line">;
        if (!kLine || !dLine) {
          kLine = chart.addSeries(LineSeries, { color: ind.params.fastColor || "#000000", lineWidth: 2, priceScaleId: `${ind.id}-scale`, priceFormat: { type: 'price', precision: 2, minMove: 0.01 }, autoscaleInfoProvider: () => ({ priceRange: { minValue: 0, maxValue: 100 } }) });
          dLine = chart.addSeries(LineSeries, { color: ind.params.slowColor || "#ff0000", lineWidth: 2, priceScaleId: `${ind.id}-scale`, priceFormat: { type: 'price', precision: 2, minMove: 0.01 }, autoscaleInfoProvider: () => ({ priceRange: { minValue: 0, maxValue: 100 } }) });
          chart.priceScale(`${ind.id}-scale`).applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
          seriesRef.current.set(`${ind.id}-k`, kLine);
          seriesRef.current.set(`${ind.id}-d`, dLine);
        } else {
          kLine.applyOptions({ color: ind.params.fastColor || "#000000" });
          dLine.applyOptions({ color: ind.params.slowColor || "#ff0000" });
        }
        
        if (ind.params.showZones !== false) {
          const obVal = ind.params.overBoughtValue ?? 80;
          const osVal = ind.params.overSoldValue ?? 20;
          const obCol = ind.params.overBoughtColor || "#000000";
          const osCol = ind.params.overSoldColor || "#000000";
          
          let obLine = seriesRef.current.get(`${ind.id}-ob`) as ISeriesApi<"Line">;
          let osLine = seriesRef.current.get(`${ind.id}-os`) as ISeriesApi<"Line">;
          if (!obLine || !osLine) {
              obLine = chart.addSeries(LineSeries, { color: obCol, lineWidth: 1, lineStyle: LineStyle.Solid, priceScaleId: `${ind.id}-scale`, lastValueVisible: false, priceLineVisible: false, crosshairMarkerVisible: false });
              osLine = chart.addSeries(LineSeries, { color: osCol, lineWidth: 1, lineStyle: LineStyle.Solid, priceScaleId: `${ind.id}-scale`, lastValueVisible: false, priceLineVisible: false, crosshairMarkerVisible: false });
              seriesRef.current.set(`${ind.id}-ob`, obLine);
              seriesRef.current.set(`${ind.id}-os`, osLine);
          } else {
              obLine.applyOptions({ color: obCol });
              osLine.applyOptions({ color: osCol });
          }
          
          const obData = timeArray.map((t) => ({ time: t, value: obVal }));
          const osData = timeArray.map((t) => ({ time: t, value: osVal }));
          obLine.setData(obData as any);
          osLine.setData(osData as any);
        } else {
          let obLine = seriesRef.current.get(`${ind.id}-ob`) as ISeriesApi<"Line"> | undefined;
          let osLine = seriesRef.current.get(`${ind.id}-os`) as ISeriesApi<"Line"> | undefined;
          if (obLine) { chart.removeSeries(obLine); seriesRef.current.delete(`${ind.id}-ob`); }
          if (osLine) { chart.removeSeries(osLine); seriesRef.current.delete(`${ind.id}-os`); }
        }

        const pK = ind.params.period || 14;
        const pD = 3;
        // Deriv uses Slow Stochastic (Y,Y) = 3-period smoothing on K, 3-period on D
        const smoothing = 3;
        
        let targetArray = valueArray;
        switch (ind.params.field) {
          case "Open": targetArray = openArray; break;
          case "High": targetArray = highArray; break;
          case "Low": targetArray = lowArray; break;
          case "Close": targetArray = valueArray; break;
          case "Hl/2": targetArray = hl2Array; break;
          case "Hlc/3": targetArray = hlc3Array; break;
        }

        // Deriv uses standard H/L method ("C" = Close price source, but H/L for range)
        const stochHigh = highArray;
        const stochLow = lowArray;
        const results = calculateStochastic(stochHigh, stochLow, targetArray, pK, pD, smoothing);
        const kData = results.k.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
        const dData = results.d.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
        if (kData.length > 0) kLine.setData(kData as any);
        if (dData.length > 0) dLine.setData(dData as any);
    } else if (ind.type === "aroon") {
      let upLine = seriesRef.current.get(`${ind.id}-aroonUp`) as ISeriesApi<"Line">;
      let downLine = seriesRef.current.get(`${ind.id}-aroonDown`) as ISeriesApi<"Line">;
      if (!upLine || !downLine) {
        upLine = chart.addSeries(LineSeries, { color: ind.params.aroonUpColor || "#00ff00", lineWidth: 2, priceScaleId: `${ind.id}-scale`, priceFormat: { type: 'price', precision: 2, minMove: 0.01 } });
        downLine = chart.addSeries(LineSeries, { color: ind.params.aroonDownColor || "#ff0000", lineWidth: 2, priceScaleId: `${ind.id}-scale`, priceFormat: { type: 'price', precision: 2, minMove: 0.01 } });
        chart.priceScale(`${ind.id}-scale`).applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
        seriesRef.current.set(`${ind.id}-aroonUp`, upLine);
        seriesRef.current.set(`${ind.id}-aroonDown`, downLine);
      } else {
        upLine.applyOptions({ color: ind.params.aroonUpColor || "#00ff00" });
        downLine.applyOptions({ color: ind.params.aroonDownColor || "#ff0000" });
      }
      const period = ind.params.period || 14;
      const results = calculateAroon(highArray, lowArray, period);
      const upData = results.up.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
      const downData = results.down.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
      if (upData.length > 0) upLine.setData(upData as any);
      if (downData.length > 0) downLine.setData(downData as any);
    } else if (ind.type === "adx") {
      let adxLine = seriesRef.current.get(`${ind.id}-adx`) as ISeriesApi<"Line">;
      let plusDI = seriesRef.current.get(`${ind.id}-plusDI`) as ISeriesApi<"Line">;
      let minusDI = seriesRef.current.get(`${ind.id}-minusDI`) as ISeriesApi<"Line">;
      let hist = seriesRef.current.get(`${ind.id}-hist`) as ISeriesApi<"Histogram">;
      
      if (!adxLine || !plusDI || !minusDI || !hist) {
        if (adxLine) chart.removeSeries(adxLine);
        if (plusDI) chart.removeSeries(plusDI);
        if (minusDI) chart.removeSeries(minusDI);
        if (hist) chart.removeSeries(hist);
        
        hist = chart.addSeries(HistogramSeries, { priceScaleId: `${ind.id}-scale`, priceFormat: { type: 'price', precision: 2, minMove: 0.01 } });
        adxLine = chart.addSeries(LineSeries, { color: ind.params.adxColor || "#000000", lineWidth: 2, priceScaleId: `${ind.id}-scale`, priceFormat: { type: 'price', precision: 2, minMove: 0.01 } });
        plusDI = chart.addSeries(LineSeries, { color: ind.params.plusDiColor || "#00ff00", lineWidth: 2, priceScaleId: `${ind.id}-scale`, priceFormat: { type: 'price', precision: 2, minMove: 0.01 } });
        minusDI = chart.addSeries(LineSeries, { color: ind.params.minusDiColor || "#ff0000", lineWidth: 2, priceScaleId: `${ind.id}-scale`, priceFormat: { type: 'price', precision: 2, minMove: 0.01 } });
        chart.priceScale(`${ind.id}-scale`).applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
        
        seriesRef.current.set(`${ind.id}-hist`, hist);
        seriesRef.current.set(`${ind.id}-adx`, adxLine);
        seriesRef.current.set(`${ind.id}-plusDI`, plusDI);
        seriesRef.current.set(`${ind.id}-minusDI`, minusDI);
      } else {
        adxLine.applyOptions({ color: ind.params.adxColor || "#000000" });
        plusDI.applyOptions({ color: ind.params.plusDiColor || "#00ff00" });
        minusDI.applyOptions({ color: ind.params.minusDiColor || "#ff0000" });
      }

      adxLine.applyOptions({ visible: ind.params.showSeries !== false });
      plusDI.applyOptions({ visible: ind.params.showSeries !== false });
      minusDI.applyOptions({ visible: ind.params.showSeries !== false });
      hist.applyOptions({ visible: ind.params.showHistogram === true });

      const period = ind.params.period || 14;
      const smoothingPeriod = ind.params.smoothingPeriod || period;
      const results = calculateADX(highArray, lowArray, valueArray, period, smoothingPeriod);
      
      const adxData = results.adx.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
      const plusDIData = results.plusDI.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
      const minusDIData = results.minusDI.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
      
      const histData = results.plusDI.map((val, i) => {
        const diff = val - results.minusDI[i];
        const color = diff >= 0 ? (ind.params.positiveBarColor || "#00ff00") : (ind.params.negativeBarColor || "#ff0000");
        return { time: timeArray[i], value: diff, color: color };
      }).filter(d => !isNaN(d.value));

      if (adxData.length > 0) adxLine.setData(adxData as any);
      if (plusDIData.length > 0) plusDI.setData(plusDIData as any);
      if (minusDIData.length > 0) minusDI.setData(minusDIData as any);
      if (histData.length > 0) hist.setData(histData as any);
    } else if (ind.type === "ichimoku") {
      let tenkan = seriesRef.current.get(`${ind.id}-tenkan`) as ISeriesApi<"Line">;
      let kijun = seriesRef.current.get(`${ind.id}-kijun`) as ISeriesApi<"Line">;
      let senkouA = seriesRef.current.get(`${ind.id}-senkouA`) as ISeriesApi<"Line">;
      let senkouB = seriesRef.current.get(`${ind.id}-senkouB`) as ISeriesApi<"Line">;
      let chikou = seriesRef.current.get(`${ind.id}-chikou`) as ISeriesApi<"Line">;
      if (!tenkan || !kijun || !senkouA || !senkouB || !chikou) {
        tenkan = chart.addSeries(LineSeries, { color: ind.params.conversionLineColor || "#2962FF", lineWidth: 1, priceScaleId: "right", priceFormat: { type: 'price', precision: 2, minMove: 0.01 } });
        kijun = chart.addSeries(LineSeries, { color: ind.params.baseLineColor || "#ef5350", lineWidth: 1, priceScaleId: "right", priceFormat: { type: 'price', precision: 2, minMove: 0.01 } });
        senkouA = chart.addSeries(LineSeries, { color: ind.params.leadingSpanAColor || "#4caf50", lineWidth: 1, priceScaleId: "right", priceFormat: { type: 'price', precision: 2, minMove: 0.01 } });
        senkouB = chart.addSeries(LineSeries, { color: ind.params.leadingSpanBColor || "#ef5350", lineWidth: 1, priceScaleId: "right", lineStyle: LineStyle.Dashed, priceFormat: { type: 'price', precision: 2, minMove: 0.01 } });
        chikou = chart.addSeries(LineSeries, { color: ind.params.laggingSpanColor || "#00e676", lineWidth: 1, priceScaleId: "right", priceFormat: { type: 'price', precision: 2, minMove: 0.01 } });
        seriesRef.current.set(`${ind.id}-tenkan`, tenkan);
        seriesRef.current.set(`${ind.id}-kijun`, kijun);
        seriesRef.current.set(`${ind.id}-senkouA`, senkouA);
        seriesRef.current.set(`${ind.id}-senkouB`, senkouB);
        seriesRef.current.set(`${ind.id}-chikou`, chikou);
      } else {
        tenkan.applyOptions({ color: ind.params.conversionLineColor || "#2962FF" });
        kijun.applyOptions({ color: ind.params.baseLineColor || "#ef5350" });
        senkouA.applyOptions({ color: ind.params.leadingSpanAColor || "#4caf50" });
        senkouB.applyOptions({ color: ind.params.leadingSpanBColor || "#ef5350" });
        chikou.applyOptions({ color: ind.params.laggingSpanColor || "#00e676" });
      }
      const tP = ind.params.conversionLinePeriod || 9;
      const kP = ind.params.baseLinePeriod || 26;
      const sBP = ind.params.leadingSpanBPeriod || 52;
      const shift = kP; // standard is 26 for senkou span forward shift
      const chikouShift = ind.params.laggingSpanPeriod ? Math.abs(ind.params.laggingSpanPeriod as number) : 26;
      
      const results = calculateIchimoku(highArray, lowArray, valueArray, tP, kP, sBP);
      const tenkanData = results.tenkan.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
      const kijunData = results.kijun.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
      
      const timeStep = timeArray.length > 1 ? timeArray[timeArray.length - 1] - timeArray[timeArray.length - 2] : 0;
      
      // Shift Senkou Span forward by shift
      const senkouAData = results.senkouA.map((val, i) => {
        const targetIdx = i + shift;
        if (targetIdx < timeArray.length) {
          return { time: timeArray[targetIdx], value: val };
        } else if (timeStep > 0) {
          const futureTime = timeArray[timeArray.length - 1] + (targetIdx - timeArray.length + 1) * timeStep;
          return { time: futureTime as UTCTimestamp, value: val };
        }
        return null;
      }).filter((d): d is {time: UTCTimestamp, value: number} => d !== null && !isNaN(d.value));
      
      const senkouBData = results.senkouB.map((val, i) => {
        const targetIdx = i + shift;
        if (targetIdx < timeArray.length) {
          return { time: timeArray[targetIdx], value: val };
        } else if (timeStep > 0) {
          const futureTime = timeArray[timeArray.length - 1] + (targetIdx - timeArray.length + 1) * timeStep;
          return { time: futureTime as UTCTimestamp, value: val };
        }
        return null;
      }).filter((d): d is {time: UTCTimestamp, value: number} => d !== null && !isNaN(d.value));
      
      // Shift Chikou backwards
      const chikouData = results.chikou.map((val, i) => {
        const targetIdx = i - chikouShift;
        if (targetIdx >= 0) {
          return { time: timeArray[targetIdx], value: val };
        }
        return null;
      }).filter((d): d is {time: UTCTimestamp, value: number} => d !== null && !isNaN(d.value));
      
      if (tenkanData.length > 0) tenkan.setData(tenkanData as any);
      if (kijunData.length > 0) kijun.setData(kijunData as any);
      if (senkouAData.length > 0) senkouA.setData(senkouAData as any);
      if (senkouBData.length > 0) senkouB.setData(senkouBData as any);
      if (chikouData.length > 0) chikou.setData(chikouData as any);
    } else if (ind.type === "parabolic_sar") {
      let sar = seriesRef.current.get(`${ind.id}-sar`) as ISeriesApi<"Line">;
      let sarPlugin = pluginsRef.current.get(`${ind.id}-sar`);
      
      if (!sar) {
        // Transparent LineSeries to hold the markers
        sar = chart.addSeries(LineSeries, { 
          color: "rgba(0,0,0,0)", 
          lineWidth: 1, 
          priceScaleId: "right",
          lastValueVisible: false,
          crosshairMarkerVisible: false 
        });
        sarPlugin = createSeriesMarkers(sar, []);
        seriesRef.current.set(`${ind.id}-sar`, sar);
        pluginsRef.current.set(`${ind.id}-sar`, sarPlugin);
      }
      const step = ind.params.minimumAF || 0.02;
      const maxStep = ind.params.maximumAF || 0.2;
      const results = calculateParabolicSAR(highArray, lowArray, step, maxStep);
      
      // We need to pass dummy data to the invisible line series so it has a valid timescale
      const dummyData = results.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
      if (dummyData.length > 0) sar.setData(dummyData as any);
      
      // Draw actual markers
      if (sarPlugin) {
        const markers = results.map((val, i) => {
          if (isNaN(val)) return null;
          return {
            time: timeArray[i] as Time,
            position: 'inBar' as const,
            shape: 'circle' as const,
            color: ind.params.sarColor || '#000000',
            size: 0.5,
          };
        }).filter((m): m is any => m !== null);
        
        sarPlugin.setMarkers(markers);
      }
    } else if (ind.type === "zigzag") {
      let zigzag = seriesRef.current.get(`${ind.id}-zigzag`) as ISeriesApi<"Line">;
      if (!zigzag) {
        zigzag = chart.addSeries(LineSeries, { color: ind.params.zigZagColor || "#000000", lineWidth: 2, priceScaleId: "right", priceFormat: { type: 'price', precision: 2, minMove: 0.01 } });
        seriesRef.current.set(`${ind.id}-zigzag`, zigzag);
      } else {
        zigzag.applyOptions({ color: ind.params.zigZagColor || "#000000" });
      }
      const distance = ind.params.distance || 10;
      const results = calculateZigZag(highArray, lowArray, valueArray, distance);
      const zigzagData = results.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
      if (zigzagData.length > 0) zigzag.setData(zigzagData as any);
      } else if (ind.type === 'bollinger') {
        let upper = seriesRef.current.get(`${ind.id}-upper`) as ISeriesApi<'Line'>;
        let middle = seriesRef.current.get(`${ind.id}-middle`) as ISeriesApi<'Line'>;
        let lower = seriesRef.current.get(`${ind.id}-lower`) as ISeriesApi<'Line'>;
        if (!upper || !middle || !lower) {
          upper = chart.addSeries(LineSeries, { color: ind.params.upperColor || '#000000', lineWidth: 1, priceScaleId: 'right', priceFormat: { type: 'price', precision: 2, minMove: 0.01 } });
          middle = chart.addSeries(LineSeries, { color: ind.params.middleColor || '#000000', lineWidth: 1, priceScaleId: 'right', priceFormat: { type: 'price', precision: 2, minMove: 0.01 } });
          lower = chart.addSeries(LineSeries, { color: ind.params.lowerColor || '#000000', lineWidth: 1, priceScaleId: 'right', priceFormat: { type: 'price', precision: 2, minMove: 0.01 } });
          seriesRef.current.set(`${ind.id}-upper`, upper);
          seriesRef.current.set(`${ind.id}-middle`, middle);
          seriesRef.current.set(`${ind.id}-lower`, lower);
        } else {
          upper.applyOptions({ color: ind.params.upperColor || '#000000' });
          middle.applyOptions({ color: ind.params.middleColor || '#000000' });
          lower.applyOptions({ color: ind.params.lowerColor || '#000000' });
        }
        const p = ind.params.period || 20;
        const dev = ind.params.standardDeviations || 2;
        const maType = ind.params.movingAverageType || "Simple";
        
        let targetArray = valueArray;
        switch (ind.params.field) {
          case "Open": targetArray = openArray; break;
          case "High": targetArray = highArray; break;
          case "Low": targetArray = lowArray; break;
          case "Close": targetArray = valueArray; break;
          case "Hl/2": targetArray = hl2Array; break;
          case "Hlc/3": targetArray = hlc3Array; break;
        }

        const results = calculateBollingerBands(targetArray, p, dev, maType as string);
        const upperData = results.upper.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
        const middleData = results.middle.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
        const lowerData = results.lower.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
        if (upperData.length > 0) upper.setData(upperData as any);
        if (middleData.length > 0) middle.setData(middleData as any);
        if (lowerData.length > 0) lower.setData(lowerData as any);
      } else if (ind.type === 'donchian') {
        let upper = seriesRef.current.get(`${ind.id}-upper`) as ISeriesApi<'Line'>;
        let middle = seriesRef.current.get(`${ind.id}-middle`) as ISeriesApi<'Line'>;
        let lower = seriesRef.current.get(`${ind.id}-lower`) as ISeriesApi<'Line'>;
        if (!upper || !middle || !lower) {
          upper = chart.addSeries(LineSeries, { color: ind.params.upperColor || '#000000', lineWidth: 1, priceScaleId: 'right', priceFormat: { type: 'price', precision: 2, minMove: 0.01 } });
          middle = chart.addSeries(LineSeries, { color: ind.params.middleColor || '#000000', lineWidth: 1, lineStyle: 2, priceScaleId: 'right', priceFormat: { type: 'price', precision: 2, minMove: 0.01 } });
          lower = chart.addSeries(LineSeries, { color: ind.params.lowerColor || '#000000', lineWidth: 1, priceScaleId: 'right', priceFormat: { type: 'price', precision: 2, minMove: 0.01 } });
          seriesRef.current.set(`${ind.id}-upper`, upper);
          seriesRef.current.set(`${ind.id}-middle`, middle);
          seriesRef.current.set(`${ind.id}-lower`, lower);
        } else {
          upper.applyOptions({ color: ind.params.upperColor || '#000000' });
          middle.applyOptions({ color: ind.params.middleColor || '#000000' });
          lower.applyOptions({ color: ind.params.lowerColor || '#000000' });
        }
        const highP = ind.params.highPeriod || 20;
        const lowP = ind.params.lowPeriod || 20;
        const results = calculateDonchianChannel(highArray, lowArray, highP, lowP);
        const upperData = results.upper.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
        const middleData = results.middle.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
        const lowerData = results.lower.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
        if (upperData.length > 0) upper.setData(upperData as any);
        if (middleData.length > 0) middle.setData(middleData as any);
        if (lowerData.length > 0) lower.setData(lowerData as any);
      } else if (ind.type === 'alligator') {
        let jaw = seriesRef.current.get(`${ind.id}-jaw`) as ISeriesApi<'Line'>;
        let teeth = seriesRef.current.get(`${ind.id}-teeth`) as ISeriesApi<'Line'>;
        let lips = seriesRef.current.get(`${ind.id}-lips`) as ISeriesApi<'Line'>;
        if (!jaw || !teeth || !lips) {
          jaw = chart.addSeries(LineSeries, { color: '#2962FF', lineWidth: 1, priceScaleId: 'right' }); // Blue
          teeth = chart.addSeries(LineSeries, { color: '#FF0000', lineWidth: 1, priceScaleId: 'right' }); // Red
          lips = chart.addSeries(LineSeries, { color: '#00FF00', lineWidth: 1, priceScaleId: 'right' }); // Green
          seriesRef.current.set(`${ind.id}-jaw`, jaw);
          seriesRef.current.set(`${ind.id}-teeth`, teeth);
          seriesRef.current.set(`${ind.id}-lips`, lips);
        }
        const jawP = ind.params.jawPeriod || 13;
        const jawS = ind.params.jawShift || 8;
        const teethP = ind.params.teethPeriod || 8;
        const teethS = ind.params.teethShift || 5;
        const lipsP = ind.params.lipsPeriod || 5;
        const lipsS = ind.params.lipsShift || 3;
        
        const results = calculateAlligator(highArray, lowArray, jawP, jawS, teethP, teethS, lipsP, lipsS);
        
        const timeStep = timeArray.length > 1 ? timeArray[timeArray.length - 1] - timeArray[timeArray.length - 2] : 0;
        
        const jawData = results.jaw.map((val, i) => {
          const targetIdx = i + jawS;
          if (targetIdx < timeArray.length) {
            return { time: timeArray[targetIdx], value: val };
          } else if (timeStep > 0) {
            const futureTime = timeArray[timeArray.length - 1] + (targetIdx - timeArray.length + 1) * timeStep;
            return { time: futureTime as UTCTimestamp, value: val };
          }
          return null;
        }).filter((d): d is {time: UTCTimestamp, value: number} => d !== null && !isNaN(d.value));
        
        const teethData = results.teeth.map((val, i) => {
          const targetIdx = i + teethS;
          if (targetIdx < timeArray.length) {
            return { time: timeArray[targetIdx], value: val };
          } else if (timeStep > 0) {
            const futureTime = timeArray[timeArray.length - 1] + (targetIdx - timeArray.length + 1) * timeStep;
            return { time: futureTime as UTCTimestamp, value: val };
          }
          return null;
        }).filter((d): d is {time: UTCTimestamp, value: number} => d !== null && !isNaN(d.value));
        
        const lipsData = results.lips.map((val, i) => {
          const targetIdx = i + lipsS;
          if (targetIdx < timeArray.length) {
            return { time: timeArray[targetIdx], value: val };
          } else if (timeStep > 0) {
            const futureTime = timeArray[timeArray.length - 1] + (targetIdx - timeArray.length + 1) * timeStep;
            return { time: futureTime as UTCTimestamp, value: val };
          }
          return null;
        }).filter((d): d is {time: UTCTimestamp, value: number} => d !== null && !isNaN(d.value));
        
        if (jawData.length > 0) jaw.setData(jawData as any);
        if (teethData.length > 0) teeth.setData(teethData as any);
        if (lipsData.length > 0) lips.setData(lipsData as any);
      } else if (ind.type === 'fractal') {
        const upperColor = ind.params.upperBandColor || '#999999';
        const lowerColor = ind.params.lowerBandColor || '#999999';
        
        let upper = seriesRef.current.get(`${ind.id}-upper`) as ISeriesApi<'Line'>;
        let lower = seriesRef.current.get(`${ind.id}-lower`) as ISeriesApi<'Line'>;
        if (!upper || !lower) {
          upper = chart.addSeries(LineSeries, { 
            color: upperColor, 
            lineWidth: 1, 
            lineType: LineType.WithSteps,  
            priceScaleId: 'right',
            lastValueVisible: false,
            priceLineVisible: false 
          });
          lower = chart.addSeries(LineSeries, { 
            color: lowerColor, 
            lineWidth: 1, 
            lineType: LineType.WithSteps, 
            priceScaleId: 'right',
            lastValueVisible: false,
            priceLineVisible: false 
          });
          seriesRef.current.set(`${ind.id}-upper`, upper);
          seriesRef.current.set(`${ind.id}-lower`, lower);
        } else {
          upper.applyOptions({ color: upperColor });
          lower.applyOptions({ color: lowerColor });
        }
        const results = calculateFractalChaosBands(highArray, lowArray, 5);
        
        const upperData = results.upper.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
        const lowerData = results.lower.map((val, i) => ({ time: timeArray[i], value: val })).filter(d => !isNaN(d.value));
        
        if (upperData.length > 0) upper.setData(upperData as any);
        if (lowerData.length > 0) lower.setData(lowerData as any);

    }
    } catch (e) { console.error('Error syncing indicator', ind.type, e); }
  }
  
  // Layout active oscillators dynamically to create a multi-pane effect without overlapping the main chart
  const isOverlay = (type: string) => ["ma", "ma_envelope", "rainbow_ma", "bollinger", "donchian", "alligator", "fractal", "ichimoku", "parabolic_sar", "zigzag"].includes(type);
  const oscillators = activeIndicators.filter(ind => !isOverlay(ind.type));
  const numOscillators = oscillators.length;

  let totalOscillatorHeight = 0;
  oscillators.forEach(ind => {
      totalOscillatorHeight += minimizedIndicators.has(ind.id) ? 0.03 : paneHeight;
  });
  totalOscillatorHeight = Math.min(0.8, totalOscillatorHeight);

  const mainBottom = numOscillators > 0 ? (totalOscillatorHeight + 0.05) : 0.1;
  chart.priceScale("right").applyOptions({
    scaleMargins: { top: 0.1, bottom: mainBottom },
  });

  let currentTopOffset = 1 - totalOscillatorHeight;

  oscillators.forEach((ind) => {
    const scaleId = `${ind.id}-scale`;
    const actualPaneHeight = minimizedIndicators.has(ind.id) ? 0.03 : paneHeight;
    const baseTop = currentTopOffset;
    currentTopOffset += actualPaneHeight;

    let top = Math.max(0, Math.min(0.95, baseTop + 0.05));
    let bottom = Math.max(0, Math.min(0.95, 1 - (baseTop + actualPaneHeight) + 0.05));
      
    if (top + bottom >= 1) {
      if (bottom > top) bottom = 0.95 - top;
      else top = 0.95 - bottom;
    }
      
    try {
      chart.priceScale(scaleId).applyOptions({
        scaleMargins: { top, bottom },
      });
    } catch (e) {
      console.error('Error applying scale options for', scaleId, e);
    }
  });

  // Handle visibility for all overlay indicators
  activeIndicators.forEach(ind => {
      const isMin = minimizedIndicators.has(ind.id);
      if (isOverlay(ind.type)) {
          for (const [key, series] of seriesRef.current.entries()) {
              if (key.startsWith(ind.id)) {
                  series.applyOptions({ visible: !isMin });
              }
          }
      }
  });
}

