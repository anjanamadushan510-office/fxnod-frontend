// lightweight-charts v5 custom series primitives for chart drawings.
//
// Horizontal lines use the built-in series.createPriceLine() (no primitive
// needed). Trend + vertical lines have no built-in equivalent, so we implement
// them as ISeriesPrimitive: a pane view recomputes pixel coordinates from
// (time, price) each frame, and a renderer paints onto the canvas in the
// bitmap coordinate space (handling devicePixelRatio).

import type {
  IPrimitivePaneRenderer,
  IPrimitivePaneView,
  ISeriesPrimitive,
  ISeriesPrimitiveAxisView,
  SeriesAttachedParameter,
  Time,
} from "lightweight-charts";
import type { CanvasRenderingTarget2D } from "fancy-canvas";

export interface LinePoint {
  time: Time;
  price: number;
}

type AttachedChart = SeriesAttachedParameter<Time>["chart"];
type AttachedSeries = SeriesAttachedParameter<Time>["series"];

export function formatTimeDerivStyle(time: Time): string {
  if (typeof time === "number") {
    const d = new Date(time * 1000);
    const day = d.getUTCDate().toString().padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
    const year = d.getUTCFullYear().toString().slice(-2);
    const hours = d.getUTCHours().toString().padStart(2, "0");
    const minutes = d.getUTCMinutes().toString().padStart(2, "0");
    return `${day} ${month} '${year} ${hours}:${minutes}`;
  } else if (typeof time === "object" && time !== null && "year" in time) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = String(time.day).padStart(2, "0");
    const month = monthNames[time.month - 1] || "Jan";
    const year = String(time.year).slice(-2);
    return `${day} ${month} '${year}`;
  }
  return String(time);
}

// ─── Trend line (two points) ─────────────────────────────────────────────────

class TrendRenderer implements IPrimitivePaneRenderer {
  constructor(
    private readonly _x1: number | null,
    private readonly _y1: number | null,
    private readonly _x2: number | null,
    private readonly _y2: number | null,
    private readonly _color: string,
    private readonly _width: number,
    private readonly _dashed: boolean,
  ) {}

  draw(target: CanvasRenderingTarget2D): void {
    if (
      this._x1 === null ||
      this._y1 === null ||
      this._x2 === null ||
      this._y2 === null
    ) {
      return;
    }
    target.useBitmapCoordinateSpace((scope) => {
      const ctx = scope.context;
      const hr = scope.horizontalPixelRatio;
      const vr = scope.verticalPixelRatio;
      ctx.lineWidth = this._width * vr;
      ctx.strokeStyle = this._color;
      if (this._dashed) ctx.setLineDash([5 * vr, 5 * vr]);
      else ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(this._x1! * hr, this._y1! * vr);
      ctx.lineTo(this._x2! * hr, this._y2! * vr);
      ctx.stroke();
    });
  }
}

class TrendPaneView implements IPrimitivePaneView {
  private _x1: number | null = null;
  private _y1: number | null = null;
  private _x2: number | null = null;
  private _y2: number | null = null;

  constructor(private readonly _source: TrendPrimitive) {}

  update(): void {
    const chart = this._source.chart;
    const series = this._source.series;
    if (!chart || !series) return;
    const ts = chart.timeScale();
    this._x1 = ts.timeToCoordinate(this._source.a.time);
    this._y1 = series.priceToCoordinate(this._source.a.price);
    this._x2 = ts.timeToCoordinate(this._source.b.time);
    this._y2 = series.priceToCoordinate(this._source.b.price);
  }

  renderer(): IPrimitivePaneRenderer {
    return new TrendRenderer(
      this._x1,
      this._y1,
      this._x2,
      this._y2,
      this._source.color,
      this._source.width,
      this._source.dashed,
    );
  }
}

export class TrendPrimitive implements ISeriesPrimitive<Time> {
  chart: AttachedChart | null = null;
  series: AttachedSeries | null = null;
  private readonly _paneView: TrendPaneView;

  constructor(
    public a: LinePoint,
    public b: LinePoint,
    public color = "#2962FF",
    public width = 2,
    public readonly dashed = false,
  ) {
    this._paneView = new TrendPaneView(this);
  }

  updatePoints(a: LinePoint, b: LinePoint) {
    this.a = a;
    this.b = b;
    this.chart?.timeScale().applyOptions({}); // force redraw? Actually series.applyOptions is better, or just rely on crosshair move triggering render
  }

  attached(param: SeriesAttachedParameter<Time>): void {
    this.chart = param.chart;
    this.series = param.series;
  }

  detached(): void {
    this.chart = null;
    this.series = null;
  }

  updateAllViews(): void {
    this._paneView.update();
  }

  paneViews(): readonly IPrimitivePaneView[] {
    return [this._paneView];
  }
}

// ─── Vertical line (one time, full pane height) ──────────────────────────────

class VerticalRenderer implements IPrimitivePaneRenderer {
  constructor(
    private readonly _x: number | null,
    private readonly _color: string,
    private readonly _width: number,
    private readonly _dashed: boolean,
  ) {}

  draw(target: CanvasRenderingTarget2D): void {
    if (this._x === null) return;
    target.useBitmapCoordinateSpace((scope) => {
      const ctx = scope.context;
      const x = Math.round(this._x! * scope.horizontalPixelRatio);
      ctx.lineWidth = this._width * scope.verticalPixelRatio;
      ctx.strokeStyle = this._color;
      if (this._dashed) ctx.setLineDash([5 * scope.verticalPixelRatio, 5 * scope.verticalPixelRatio]);
      else ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, scope.bitmapSize.height);
      ctx.stroke();
    });
  }
}

function getExtrapolatedX(chart: AttachedChart, series: AttachedSeries, targetTime: Time): number | null {
    let x = chart?.timeScale().timeToCoordinate(targetTime) ?? null;
    if (x === null && chart && series) {
        const data = series.data();
        if (data && data.length >= 2) {
            const lastPoint = data[data.length - 1];
            const prevPoint = data[data.length - 2];
            const lastTime = lastPoint.time as number;
            const prevTime = prevPoint.time as number;
            const tTime = targetTime as number;
            
            if (tTime > lastTime) {
                const secondsPerBar = lastTime - prevTime;
                if (secondsPerBar > 0) {
                    const barsDiff = (tTime - lastTime) / secondsPerBar;
                    const lastX = chart.timeScale().timeToCoordinate(lastPoint.time);
                    if (lastX !== null) {
                        const lastLogical = chart.timeScale().coordinateToLogical(lastX);
                        if (lastLogical !== null) {
                            const targetLogical = lastLogical + barsDiff;
                            const extrapolatedX = chart.timeScale().logicalToCoordinate(targetLogical as any);
                            if (extrapolatedX !== null) {
                                x = extrapolatedX;
                            }
                        }
                    }
                }
            }
        }
    }
    return x;
}

class VerticalPaneView implements IPrimitivePaneView {
  private _x: number | null = null;

  constructor(private readonly _source: VerticalPrimitive) {}

  update(): void {
    this._x = getExtrapolatedX(this._source.chart, this._source.series, this._source.time);
  }

  renderer(): IPrimitivePaneRenderer {
    return new VerticalRenderer(this._x, this._source.color, this._source.width, this._source.dashed);
  }
}

class VerticalTimeAxisView implements ISeriesPrimitiveAxisView {
  private _x: number | null = null;
  private _text: string = "";

  constructor(private readonly _source: VerticalPrimitive) {}

  update(): void {
    this._x = getExtrapolatedX(this._source.chart, this._source.series, this._source.time);
    this._text = formatTimeDerivStyle(this._source.time);
  }

  coordinate(): number { return this._x ?? 0; }
  text(): string { return this._text; }
  backColor(): string { return this._source.color; }
  textColor(): string { return "#FFFFFF"; }
}

export class VerticalPrimitive implements ISeriesPrimitive<Time> {
  chart: AttachedChart | null = null;
  series: AttachedSeries | null = null;
  private readonly _paneView: VerticalPaneView;
  private readonly _timeAxisView: VerticalTimeAxisView;

  constructor(
    public time: Time,
    public color = "#2962FF",
    public width = 1,
    public readonly dashed = false,
    public axisLabelVisible = false,
  ) {
    this._paneView = new VerticalPaneView(this);
    this._timeAxisView = new VerticalTimeAxisView(this);
  }

  updateTime(time: Time) {
    this.time = time;
  }

  attached(param: SeriesAttachedParameter<Time>): void {
    this.chart = param.chart;
    this.series = param.series;
  }

  detached(): void {
    this.chart = null;
    this.series = null;
  }

  updateAllViews(): void {
    this._paneView.update();
    this._timeAxisView.update();
  }

  paneViews(): readonly IPrimitivePaneView[] {
    return [this._paneView];
  }
  
  timeAxisViews(): readonly ISeriesPrimitiveAxisView[] {
    return this.axisLabelVisible ? [this._timeAxisView] : [];
  }
}
