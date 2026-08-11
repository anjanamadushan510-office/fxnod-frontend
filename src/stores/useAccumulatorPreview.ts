import { create } from "zustand";

interface AccumulatorPreviewState {
  growthRate: number | null;
  setGrowthRate: (rate: number | null) => void;
}

export const useAccumulatorPreview = create<AccumulatorPreviewState>((set) => ({
  growthRate: null,
  setGrowthRate: (rate) => set({ growthRate: rate }),
}));
