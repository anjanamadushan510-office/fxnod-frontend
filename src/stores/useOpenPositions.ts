"use client";

import { create } from "zustand";
import type { Position } from "@/hooks/useMockPositions";
import type { PositionFrame } from "@/services/positionsStream";
import { useTradeOverlays } from "@/stores/useTradeOverlays";

/**
 * Open-positions list shown in the Positions drawer.
 *
 * A successful trade (usePanelBuy → placeTrade.onSuccess) appends the real
 * position here from the backend response + current UI state, carrying the
 * Deriv `contractId`. Live P/L + status are then merged from the positions
 * WebSocket stream (usePositionsWebSocket) via applySnapshot / applyUpdate /
 * markClosed, matched on `contractId`.
 *
 * Settled rows remain available while the history database catches up.
 */
interface OpenPositionsState {
  positions: Position[];
  scope: string | null;
  setScope: (scope: string | null) => void;
  /** Append a new open position (id + starting P/L are filled in). */
  add: (p: Omit<Position, "id" | "pnl">) => void;
  /** Upsert one contract's live fields from a stream frame. */
  applyUpdate: (frame: PositionFrame) => void;
  /** Reconcile the full open set from a snapshot frame (upsert, non-destructive). */
  applySnapshot: (frames: PositionFrame[]) => void;
  /** Mark a contract settled (won/lost + final P/L). */
  markClosed: (frame: PositionFrame) => void;
  clear: () => void;
}

export const useOpenPositions = create<OpenPositionsState>((set, get) => ({
  positions: [],
  scope: null,
  setScope: (scope) => {
    if (get().scope === scope) return;
    useTradeOverlays.getState().clearAll();
    set({ scope, positions: [] });
  },
  add: (p) => set((state) => {
    const existing = state.positions.find((row) => row.contractId === p.contractId);
    // Broker updates (even settlement) may arrive before the HTTP buy reply.
    // The reply must enrich that row rather than reset its live state.
    if (existing) return { positions: state.positions.map((row) => row === existing
      ? { ...p, ...existing, marketId: p.marketId, marketName: p.marketName,
          contractType: p.contractType, side: p.side, payout: existing.payout ?? p.payout,
          startTime: existing.startTime ?? p.startTime, currency: existing.currency ?? p.currency } : row) };
    return { positions: [{ ...p, id: crypto.randomUUID(), pnl: 0 }, ...state.positions] };
  }),
  applyUpdate: (frame) => set((state) => ({ positions: upsert(state.positions, frame) })),
  applySnapshot: (frames) => set((state) => ({ positions: frames.reduce(upsert, state.positions) })),
  markClosed: (frame) => {
    useTradeOverlays.getState().removeOverlay(frame.contract_id);
    set((state) => {
      const positions = upsert(state.positions, frame);
      let retained = 0;
      return { positions: positions.filter((row) => !row.outcome || retained++ < 200) };
    });
  },
  clear: () => set({ positions: [] }),
}));

// ─── stream → Position mapping ───────────────────────────────────────────────

/** Upsert a frame into the list: patch the matching contract, else create it
 *  (only when the frame carries enough display context — i.e. a snapshot). */
function upsert(list: Position[], frame: PositionFrame): Position[] {
  const idx = list.findIndex((p) => p.contractId === frame.contract_id);
  if (idx === -1) {
    if (!frame.market_id && !frame.market_name && frame.stake == null) {
      return list; // bare incremental update for an unknown contract — skip
    }
    return [frameToPosition(frame), ...list];
  }
  const existing = list[idx]!;
  if (existing.outcome && frame.status === "open") return list;
  if (frame.status === "open" && frame.updated_at && existing.updatedAt && frame.updated_at < existing.updatedAt) return list;
  const next = list.slice();
  next[idx] = { ...next[idx]!, ...framePatch(frame, next[idx]) };
  return next;
}

/** Live fields to merge onto an existing position. */
function framePatch(frame: PositionFrame, existing?: Position): Partial<Position> {
  const patch: Partial<Position> = {
    pnl: toNum(frame.profit) ?? 0,
    updatedAt: frame.updated_at,
    outcome:
      frame.status === "won" || frame.status === "lost" ? frame.status : null,
  };
  
  const tickStream = frame.tick_stream ?? frame.tickStream;
  if (tickStream && existing) {
    const existingTicks = existing.tickStream || [];
    const newTicks = tickStream;
    const tickMap = new Map();
    existingTicks.forEach((t: any) => tickMap.set(t.epoch, t));
    newTicks.forEach((t: any) => tickMap.set(t.epoch, t));
    patch.tickStream = Array.from(tickMap.values()).sort((a: any, b: any) => a.epoch - b.epoch);
  } else if (tickStream) {
    patch.tickStream = tickStream;
  }
  if (frame.ticks_total != null) patch.ticksTotal = frame.ticks_total;
  if (frame.start_time != null) patch.startTime = frame.start_time;
  if (frame.expiry_time != null) patch.expiryTime = frame.expiry_time;
  if (frame.currency) patch.currency = frame.currency;
  if (frame.is_valid_to_sell != null) patch.canSell = frame.is_valid_to_sell;
  if (frame.payout != null) patch.payout = toNum(frame.payout);
  
  const value = toNum(frame.bid_price);
  if (value !== undefined) patch.contractValue = value;
  const entry = toNum(frame.entry_spot);
  const exit = toNum(frame.exit_spot);
  const current = toNum(frame.current_spot);
  if (current !== undefined) patch.currentSpot = current;
  if (entry !== undefined) patch.entrySpot = entry;
  if (exit !== undefined) patch.exitSpot = exit;
  if (frame.barrier !== undefined) patch.barrier = frame.barrier;
  if (frame.buy_transaction_id !== undefined) patch.buy_transaction_id = frame.buy_transaction_id;
  if (frame.sell_transaction_id !== undefined) patch.sell_transaction_id = frame.sell_transaction_id;
  if (frame.display_number_of_contracts !== undefined) patch.display_number_of_contracts = frame.display_number_of_contracts;
  const commission = toNum(frame.commission);
  if (commission !== undefined) patch.commission = commission;
  const label = statusLabel(frame);
  if (label) patch.status = label;
  return patch;
}

/** Build a full Position from a snapshot frame (post-reload rehydration). */
function frameToPosition(frame: PositionFrame): Position {
  const stake = toNum(frame.stake) ?? 0;
  return {
    id: crypto.randomUUID(),
    contractId: frame.contract_id,
    marketId: frame.market_id ?? "",
    marketName: frame.market_name ?? frame.market_id ?? "",
    contractType: frame.contract_type ?? "rise_fall",
    side: frame.side ?? "rise",
    growthRate: frame.growth_rate,
    status: statusLabel(frame),
    stake,
    contractValue: toNum(frame.bid_price) ?? stake,
    entrySpot: toNum(frame.entry_spot),
    currentSpot: toNum(frame.current_spot),
    exitSpot: toNum(frame.exit_spot),
    barrier: frame.barrier,
    pnl: toNum(frame.profit) ?? 0,
    outcome:
      frame.status === "won" || frame.status === "lost" ? frame.status : null,
    expiryTime: frame.expiry_time,
    startTime: frame.start_time,
    isTick: frame.ticks_total != null || frame.ticks_elapsed != null,
    ticksTotal: frame.ticks_total,
    buy_transaction_id: frame.buy_transaction_id,
    sell_transaction_id: frame.sell_transaction_id,
    display_number_of_contracts: frame.display_number_of_contracts,
    commission: toNum(frame.commission),
    tickStream: frame.tick_stream ?? frame.tickStream,
    updatedAt: frame.updated_at,
    currency: frame.currency,
    payout: toNum(frame.payout),
    canSell: frame.is_valid_to_sell,
  };
}

/** "Tick 3" / "3/5 ticks" display sub-label, when the backend sends tick counts. */
function statusLabel(frame: PositionFrame): string | undefined {
  if (frame.ticks_elapsed != null && frame.ticks_total != null) {
    const elapsed = Math.min(frame.ticks_elapsed, frame.ticks_total);
    return `${elapsed}/${frame.ticks_total} ticks`;
  }
  if (frame.ticks_elapsed != null) return `Tick ${frame.ticks_elapsed}`;
  return undefined;
}

/** Parse a decimal string to number at the display boundary; undefined if absent. */
function toNum(v: string | undefined): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}


