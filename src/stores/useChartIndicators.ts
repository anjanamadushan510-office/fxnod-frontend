import { create } from "zustand";
import { persist } from "zustand/middleware";

export type IndicatorType = "SMA" | "EMA" | "MACD" | "RSI" | "awesome_oscillator" | "roc" | "stochastic" | "wpr" | "cci" | "aroon" | "adx" | "ichimoku" | "parabolic_sar" | "zigzag";

export interface IndicatorConfig {
  id: string; // Unique instance ID
  type: IndicatorType;
  symbol: string; // The market symbol this indicator is attached to
  params: Record<string, number>; // e.g. { period: 14 }
}

export const DEFAULT_INDICATOR_PARAMS: Record<IndicatorType, Record<string, number>> = {
  SMA: { period: 50 },
  EMA: { period: 50 },
  MACD: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
  RSI: { period: 14 },
  awesome_oscillator: {},
  roc: { period: 14 },
  stochastic: { periodK: 14, periodD: 3, smoothing: 3 },
  wpr: { period: 14 },
  cci: { period: 20 },
  aroon: { period: 14 },
  adx: { period: 14 },
  ichimoku: { tenkanPeriod: 9, kijunPeriod: 26, senkouBPeriod: 52 },
  parabolic_sar: { step: 0.02, maxStep: 0.2 },
  zigzag: { deviation: 5 },
};

interface ChartIndicatorsState {
  indicators: IndicatorConfig[];
  addIndicator: (symbol: string, type: IndicatorType, params?: Record<string, number>) => void;
  removeIndicator: (id: string) => void;
  updateIndicator: (id: string, params: Record<string, number>) => void;
  clearIndicators: (symbol: string) => void;
}

export const useChartIndicators = create<ChartIndicatorsState>()(
  persist(
    (set) => ({
      indicators: [],

      addIndicator: (symbol, type, params) =>
        set((state) => {
          const newIndicator: IndicatorConfig = {
            id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            type,
            symbol,
            params: params || { ...DEFAULT_INDICATOR_PARAMS[type] },
          };
          return { indicators: [...state.indicators, newIndicator] };
        }),

      removeIndicator: (id) =>
        set((state) => ({
          indicators: state.indicators.filter((ind) => ind.id !== id),
        })),

      updateIndicator: (id, params) =>
        set((state) => ({
          indicators: state.indicators.map((ind) =>
            ind.id === id ? { ...ind, params: { ...ind.params, ...params } } : ind
          ),
        })),

      clearIndicators: (symbol) =>
        set((state) => ({
          indicators: state.indicators.filter((ind) => ind.symbol !== symbol),
        })),
    }),
    {
      name: "chart-indicators-storage", // unique name in localStorage
    }
  )
);
