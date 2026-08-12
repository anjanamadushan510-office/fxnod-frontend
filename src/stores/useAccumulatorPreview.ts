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
  setStats: (newStats) => set((state) => {
    if (!newStats || newStats.length === 0) return { stats: state.stats };
    
    // If the API sends multiple stats (history included), Deriv API usually sends newest first (index 0 is active).
    // So we reverse it to match Deriv UI where the active stat is on the far right (last element).
    if (newStats.length > 1) {
      return { stats: [...newStats].reverse() };
    }
    
    // If the API only sends 1 stat (current run), accumulate it locally
    const activeStat = newStats[0];
    const prevStats = state.stats || [];
    
    if (prevStats.length === 0) {
      return { stats: [activeStat] };
    }
    
    const prevActive = prevStats[prevStats.length - 1];
    
    // If the active stat drops, it means a new run started
    if (activeStat < prevActive) {
      // Append the new active stat to the end
      const newHistory = [...prevStats, activeStat];
      // Keep only the last 100 stats
      if (newHistory.length > 100) {
        return { stats: newHistory.slice(newHistory.length - 100) };
      }
      return { stats: newHistory };
    } else {
      // Same run, just update the active stat (which is at the end of the array)
      const updatedStats = [...prevStats];
      updatedStats[updatedStats.length - 1] = activeStat;
      return { stats: updatedStats };
    }
  }),
}));
