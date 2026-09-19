"use client";

import { create } from "zustand";

export type DrawingTool = "horizontal" | "trend" | "vertical";

/** A point in chart space: epoch-seconds time + price. */
export interface DrawingPoint {
  time: number;
  price: number;
}

export interface Drawing {
  id: string;
  /** Catalog id of the market the drawing belongs to (one chart per symbol). */
  symbol: string;
  tool: DrawingTool;
  color: string;
  /** Line thickness in pixels (1-4). Defaults to 2. */
  thickness?: number;
  /** Horizontal line. */
  price?: number;
  /** Vertical line — epoch seconds. */
  time?: number;
  /** Trend line — exactly two points. */
  points?: [DrawingPoint, DrawingPoint];
}

interface ChartDrawingsState {
  /** Tool armed for the next click(s); null = not drawing. */
  activeTool: DrawingTool | null;
  activeDrawingId: string | null;
  drawings: Drawing[];
  setActiveTool: (tool: DrawingTool | null) => void;
  setActiveDrawingId: (id: string | null) => void;
  updateDrawing: (id: string, updates: Partial<Drawing>) => void;
  /** Add a placed drawing; returns its generated id. */
  addDrawing: (drawing: Omit<Drawing, "id">) => string;
  removeDrawing: (id: string) => void;
  clearSymbol: (symbol: string) => void;
}

/**
 * Chart drawing tools state — the armed tool + all placed drawings, shared by
 * LiveChart (renders them on the canvas, captures clicks) and DrawingToolsPanel
 * (arms a tool, lists/deletes drawings in the "Active" tab). Keyed by symbol so
 * each market keeps its own drawings.
 */
export const useChartDrawings = create<ChartDrawingsState>((set) => ({
  activeTool: null,
  activeDrawingId: null,
  drawings: [],
  setActiveTool: (tool) => set({ activeTool: tool }),
  setActiveDrawingId: (id) => set({ activeDrawingId: id }),
  updateDrawing: (id, updates) =>
    set((s) => ({
      drawings: s.drawings.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    })),
  addDrawing: (drawing) => {
    const id = crypto.randomUUID();
    set((s) => ({ drawings: [...s.drawings, { ...drawing, id }] }));
    return id;
  },
  removeDrawing: (id) =>
    set((s) => ({ drawings: s.drawings.filter((d) => d.id !== id) })),
  clearSymbol: (symbol) =>
    set((s) => ({ drawings: s.drawings.filter((d) => d.symbol !== symbol) })),
}));
