import {
    ISeriesPrimitive,
    IPrimitivePaneView,
    IPrimitivePaneRenderer,
    SeriesAttachedParameter,
    Time,
    IChartApi,
    ISeriesApi,
    SeriesType
} from 'lightweight-charts';

export interface FillBetweenData {
    time: Time;
    value1: number;
    value2: number;
}

class FillBetweenRenderer implements IPrimitivePaneRenderer {
    private _chart: IChartApi | null = null;
    private _series: ISeriesApi<SeriesType> | null = null;
    private _data: FillBetweenData[] = [];
    private _color: string;

    constructor(color: string) {
        this._color = color;
    }

    public update(chart: IChartApi, series: ISeriesApi<SeriesType>, data: FillBetweenData[]) {
        this._chart = chart;
        this._series = series;
        this._data = data;
    }

    public draw(target: any) {
        if (!this._chart || !this._series || this._data.length === 0) return;
        const timeScale = this._chart.timeScale();
        
        target.beginPath();
        
        // Forward path (value1)
        let hasStarted = false;
        for (let i = 0; i < this._data.length; i++) {
            const d = this._data[i];
            const x = timeScale.timeToCoordinate(d.time);
            const y1 = this._series.priceToCoordinate(d.value1);
            if (x !== null && y1 !== null) {
                if (!hasStarted) {
                    target.moveTo(x, y1);
                    hasStarted = true;
                } else {
                    target.lineTo(x, y1);
                }
            }
        }
        
        if (!hasStarted) return;
        
        // Backward path (value2)
        for (let i = this._data.length - 1; i >= 0; i--) {
            const d = this._data[i];
            const x = timeScale.timeToCoordinate(d.time);
            const y2 = this._series.priceToCoordinate(d.value2);
            if (x !== null && y2 !== null) {
                target.lineTo(x, y2);
            }
        }
        
        target.closePath();
        target.fillStyle = this._color;
        target.fill();
    }
}

class FillBetweenPaneView implements IPrimitivePaneView {
    private _renderer: FillBetweenRenderer;

    constructor(color: string) {
        this._renderer = new FillBetweenRenderer(color);
    }

    public update(chart: IChartApi, series: ISeriesApi<SeriesType>, data: FillBetweenData[]) {
        this._renderer.update(chart, series, data);
    }

    public renderer(): IPrimitivePaneRenderer {
        return this._renderer;
    }
    
    // lightweight-charts v5 uses zOrder function on PrimitivePaneView
    public zOrder(): import('lightweight-charts').PrimitivePaneViewZOrder {
        return 'bottom';
    }
}

export class FillBetweenPlugin implements ISeriesPrimitive {
    private _paneView: FillBetweenPaneView;
    private _chart: IChartApi | null = null;
    private _series: ISeriesApi<SeriesType> | null = null;
    private _data: FillBetweenData[] = [];
    private _requestUpdate: () => void = () => {};

    constructor(color: string = 'rgba(128, 128, 128, 0.3)') {
        this._paneView = new FillBetweenPaneView(color);
    }

    public attached({ chart, series, requestUpdate }: SeriesAttachedParameter) {
        this._chart = chart;
        this._series = series;
        this._requestUpdate = requestUpdate;
        this.updateAllViews();
    }

    public detached() {
        this._chart = null;
        this._series = null;
    }

    public updateAllViews() {
        if (!this._chart || !this._series) return;
        this._paneView.update(this._chart, this._series, this._data);
    }

    public paneViews() {
        return [this._paneView];
    }
    
    public setData(data: FillBetweenData[]) {
        this._data = data;
        this.updateAllViews();
        this._requestUpdate();
    }
}
