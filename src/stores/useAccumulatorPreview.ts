import { create } from "zustand";

interface AccumulatorPreviewState {
  growthRate: number | null;
  barrierPct: number | null;
  stats: number[] | null;
  setGrowthRate: (rate: number | null) => void;
  setBarrierPct: (pct: number | null) => void;
  setStats: (stats: number[] | null) => void;
}

export const useAccumulatorPreview = create<AccumulatorPreviewState>((set) => ({
  growthRate: null,
  barrierPct: null,
  stats: null,
  setGrowthRate: (rate) => set({ growthRate: rate }),
  setBarrierPct: (pct) => set({ barrierPct: pct }),
  setStats: (stats) => set({ stats }),
}));
