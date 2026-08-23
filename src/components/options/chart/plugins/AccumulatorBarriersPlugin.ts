import {
    ISeriesPrimitive,
    IPrimitivePaneView,
    IPrimitivePaneRenderer,
    SeriesAttachedParameter,
    UTCTimestamp
} from "lightweight-charts";

export class AccumulatorBarriersPlugin implements ISeriesPrimitive {
    private _series: SeriesAttachedParameter | null = null;
    private _requestUpdate: () => void = () => {};

    private _prevTime: UTCTimestamp | null = null;
    private _highBarrier: number | null = null;
    private _lowBarrier: number | null = null;
    private _color: string;
    private _lineColor: string;

    constructor(
        prevTime: UTCTimestamp,
        highBarrier: number,
        lowBarrier: number,
        isWon: boolean
    ) {
        this._prevTime = prevTime;
        this._highBarrier = highBarrier;
        this._lowBarrier = lowBarrier;
        if (isWon) {
            this._color = "rgba(0, 167, 158, 0.15)";
            this._lineColor = "rgba(0, 167, 158, 0.8)";
        } else {
            this._color = "rgba(233, 30, 99, 0.15)";
            this._lineColor = "rgba(233, 30, 99, 0.8)";
        }
    }

    attached(param: SeriesAttachedParameter) {
        this._series = param;
        this._requestUpdate = param.requestUpdate;
        this._requestUpdate();
    }

    detached() {
        this._series = null;
    }

    paneViews(): readonly IPrimitivePaneView[] {
        if (!this._series) return [];
        return [new AccumulatorBarriersPaneView(
            this._series,
            this._prevTime,
            this._highBarrier,
            this._lowBarrier,
            this._color,
            this._lineColor
        )];
    }
    
    update() {
        this._requestUpdate();
    }
}

class AccumulatorBarriersPaneView implements IPrimitivePaneView {
    private _series: SeriesAttachedParameter;
    private _prevTime: UTCTimestamp | null;
    private _highBarrier: number | null;
    private _lowBarrier: number | null;
    private _color: string;
    private _lineColor: string;

    constructor(
        series: SeriesAttachedParameter,
        prevTime: UTCTimestamp | null,
        highBarrier: number | null,
        lowBarrier: number | null,
        color: string,
        lineColor: string
    ) {
        this._series = series;
        this._prevTime = prevTime;
        this._highBarrier = highBarrier;
        this._lowBarrier = lowBarrier;
        this._color = color;
        this._lineColor = lineColor;
    }

    zOrder() {
        return "bottom" as const;
    }

    renderer(): IPrimitivePaneRenderer | null {
        if (!this._prevTime || !this._highBarrier || !this._lowBarrier) return null;

        const timeScale = this._series.chart.timeScale();
        const startX = timeScale.timeToCoordinate(this._prevTime);
        if (startX === null) return null;

        const yHigh = this._series.series.priceToCoordinate(this._highBarrier);
        const yLow = this._series.series.priceToCoordinate(this._lowBarrier);
        if (yHigh === null || yLow === null) return null;

        return new AccumulatorBarriersRenderer(startX, yHigh, yLow, this._color, this._lineColor);
    }
}

class AccumulatorBarriersRenderer implements IPrimitivePaneRenderer {
    private _startX: number;
    private _yHigh: number;
    private _yLow: number;
    private _color: string;
    private _lineColor: string;

    constructor(startX: number, yHigh: number, yLow: number, color: string, lineColor: string) {
        this._startX = startX;
        this._yHigh = yHigh;
        this._yLow = yLow;
        this._color = color;
        this._lineColor = lineColor;
    }

    draw(target: any) {
        target.useBitmapCoordinateSpace((scope: any) => {
            const ctx = scope.context;
            const width = scope.bitmapSize.width;
            
            // Adjust coordinates for device pixel ratio
            const x = Math.round(this._startX * scope.horizontalPixelRatio);
            const y1 = Math.round(this._yHigh * scope.verticalPixelRatio);
            const y2 = Math.round(this._yLow * scope.verticalPixelRatio);
            const w = width - x;
            
            const topY = Math.min(y1, y2);
            const bottomY = Math.max(y1, y2);
            const h = bottomY - topY;

            // Draw shaded region
            ctx.fillStyle = this._color;
            ctx.fillRect(x, topY, w, h);

            // Draw dashed lines
            ctx.beginPath();
            ctx.strokeStyle = this._lineColor;
            ctx.lineWidth = 1 * scope.verticalPixelRatio;
            ctx.setLineDash([4 * scope.horizontalPixelRatio, 4 * scope.horizontalPixelRatio]);
            
            ctx.moveTo(x, y1);
            ctx.lineTo(width, y1);
            
            ctx.moveTo(x, y2);
            ctx.lineTo(width, y2);
            
            ctx.stroke();
            ctx.setLineDash([]);
        });
    }
}
