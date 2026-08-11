/**
 * Contract-details model + mock data (Deriv §10).
 *
 * `ContractDetail` is the rich shape the details modal renders: metadata for
 * the left panel + the isolated tick path for the right-panel chart. The mock
 * closed contracts are deterministic (no Math.random / Date.now) so the
 * server and client markup match — important since the drawer is in the DOM
 * (clipped) even when closed.
 */
import type { Position } from "@/hooks/useMockPositions";

export interface ContractTick {
  /** Epoch seconds (UTCTimestamp). */
  time: number;
  value: number;
  kind: "entry" | "exit" | "normal";
}

export interface ContractDetail {
  id: string;
  marketId: string;
  marketName: string;
  /** "Rise" / "Fall" / "Up" … */
  tradeTypeLabel: string;
  side: "rise" | "fall";
  outcome: "won" | "lost";
  stake: number;
  payout: number;
  contractValue: number;
  pnl: number;
  buyPrice: number;
  sellPrice: number;
  referenceBuy: number;
  referenceSell: number;
  /** Deriv contract ID — used for the dtrader.deriv.com/contract/{id} URL link. */
  derivContractId: string;
  duration: string;
  barrier: number;
  startTime: number;
  entrySpot: number;
  entryTime: number;
  exitSpot: number;
  exitTime: number;
  ticks: ContractTick[];
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "28 Jun 2026" (UTC, deterministic). */
export function formatContractDate(epochSec: number): string {
  const d = new Date(epochSec * 1000);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** "2026-06-28 20:13:42 GMT" (UTC, deterministic). */
export function formatContractTime(epochSec: number): string {
  const d = new Date(epochSec * 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} ` +
    `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} GMT`
  );
}

/** Deterministic tick path from entry → exit with a fixed wiggle. */
function genTicks(
  entry: number,
  exit: number,
  startSec: number,
  n = 5,
): ContractTick[] {
  const amp = Math.max(0.2, Math.abs(exit - entry) * 0.6);
  const out: ContractTick[] = [];
  for (let i = 0; i < n; i++) {
    const frac = n > 1 ? i / (n - 1) : 0;
    const wiggle = i === 0 || i === n - 1 ? 0 : Math.sin(i * 1.7) * amp;
    out.push({
      time: startSec + i,
      value: +(entry + (exit - entry) * frac + wiggle).toFixed(
        Math.abs(entry) < 10 ? 4 : 2,
      ),
      kind: i === 0 ? "entry" : i === n - 1 ? "exit" : "normal",
    });
  }
  return out;
}

const D = (y: number, mo: number, d: number, h: number, mi: number, s: number) =>
  Math.floor(Date.UTC(y, mo - 1, d, h, mi, s) / 1000);

function mk(p: {
  id: string;
  marketId: string;
  marketName: string;
  side: "rise" | "fall";
  entry: number;
  exit: number;
  start: number;
  stake: number;
  payout: number;
  outcome: "won" | "lost";
}): ContractDetail {
  const won = p.outcome === "won";
  const pnl = won ? +(p.payout - p.stake).toFixed(2) : -p.stake;
  const contractValue = won ? p.payout : 0;
  const refBase = 4290000000 + p.id.charCodeAt(1) * 13;
  return {
    id: p.id,
    marketId: p.marketId,
    marketName: p.marketName,
    tradeTypeLabel: p.side === "rise" ? "Rise" : "Fall",
    side: p.side,
    outcome: p.outcome,
    stake: p.stake,
    payout: p.payout,
    contractValue,
    pnl,
    buyPrice: p.stake,
    sellPrice: contractValue,
    referenceBuy: refBase,
    referenceSell: refBase + 1,
    derivContractId: String(refBase),
    duration: "5 ticks",
    barrier: p.entry,
    startTime: p.start,
    entrySpot: p.entry,
    entryTime: p.start + 1,
    exitSpot: p.exit,
    exitTime: p.start + 5,
    ticks: genTicks(p.entry, p.exit, p.start, 5),
  };
}

import type { TradeHistoryEntry } from "@/services/api/model";

export function historyToDetail(h: TradeHistoryEntry): ContractDetail {
  const stake = Number(h.stake_amount) || 0;
  // potential_payout = the quoted payout from the proposal (always > 0).
  // final_payout_amount = actual received payout (0 if lost).
  const potentialPayout = Number(h.payout_amount) || 0;  // always show quoted payout
  const finalPayout = Number((h as any).final_payout_amount) || 0;
  const outcomeStr = (h as any).outcome;
  const won = outcomeStr ? outcomeStr === "won" : (finalPayout > 0);
  const payout = potentialPayout; // Potential payout = quoted, matches Deriv display
  const pnl = won ? +(finalPayout - stake).toFixed(2) : -stake;
  // contractValue = what was actually received
  const contractValue = won ? finalPayout : 0;

  // TradeHistoryEntry created_at is an ISO string, parse it to epoch seconds
  const exitTime = Math.floor(new Date(h.created_at).getTime() / 1000);
  const startTime = exitTime - 5; // placeholder for 5-tick trades

  let entrySpot = Number((h as any).entry_spot) || 0;
  let exitSpot = Number((h as any).exit_spot) || 0;

  let ticks: ContractTick[] = [];
  const ts = (h as any).tick_stream;
  if (ts && Array.isArray(ts) && ts.length > 0) {
    ticks = ts.map((t: any, i: number) => {
      const time = t.epoch || (startTime + i);
      const value = Number(t.tick_display_value) || Number(t.tick) || 0;
      let kind: "entry" | "exit" | "normal" = "normal";
      if (i === 0) kind = "entry";
      if (i === ts.length - 1) kind = "exit";
      return { time, value, kind };
    });
    if (entrySpot === 0) entrySpot = ticks[0].value;
    if (exitSpot === 0) exitSpot = ticks[ticks.length - 1].value;
  } else if (entrySpot && exitSpot) {
    ticks = genTicks(entrySpot, exitSpot, startTime, 5);
  }

		const seconds = Math.max(1, exitTime - startTime);
		// ts[0] is the entry/start tick; Deriv counts only the ticks *after* entry.
		// So a "5 ticks" contract produces ts.length === 6. Subtract 1 to match Deriv's display.
		const tickCount = (ts && Array.isArray(ts) && ts.length > 1) ? ts.length - 1 : 0;

		// Prefer the authoritative values persisted from the proposal:
		//   duration_unit "t" → ticks, any other unit → seconds/mins etc.
		const backendDurSecs: number = Number((h as any).duration_seconds) || 0;
		const backendDurUnit: string  = String((h as any).duration_unit  || "");
		let durationLabel: string;
		if (backendDurUnit === "t" && tickCount > 0) {
			// Tick-based trade: use tick count (already correct from tick_stream)
			durationLabel = `${tickCount} ticks`;
		} else if (backendDurSecs > 0) {
			// Time-based trade (secs, mins, hours): show the stored value directly.
			durationLabel = backendDurUnit === "m"
				? `${backendDurSecs} mins`
				: backendDurUnit === "h"
					? `${backendDurSecs} hours`
					: `${backendDurSecs} secs`;
		} else if (tickCount > 0) {
			// Fallback: infer from tick_stream if duration_unit not yet stored
			durationLabel = `${tickCount} ticks`;
		} else {
			// Last resort: epoch diff
			durationLabel = `${seconds} secs`;
		}

    return {
      id: h.id,
      marketId: h.symbol,
      marketName: h.symbol,
      tradeTypeLabel: h.frontend_contract_type || (h.side === "rise" ? "Rise" : "Fall"),
      side: h.side === "fall" ? "fall" : "rise",
      outcome: won ? "won" : "lost",
      stake,
      payout,
      contractValue,
      pnl,
      buyPrice: stake,
      sellPrice: contractValue,
      referenceBuy: Number((h as any).buy_transaction_id) || Number((h as any).deriv_contract_id) || 0,
      referenceSell: Number((h as any).sell_transaction_id) || 0,
      // deriv_contract_id is used for the Deriv URL link (not the same as transaction IDs)
      derivContractId: String((h as any).deriv_contract_id || ""),
      duration: durationLabel,
      barrier: entrySpot,
      startTime,
      entrySpot,
      entryTime: startTime + 1,
      exitSpot,
      exitTime,
      ticks,
  };
}

/** Best-effort ContractDetail for an in-progress (sim) open position. */
export function simPositionToDetail(p: Position): ContractDetail {
  const entry = p.entrySpot ?? 0;
  const exit = +(entry + p.pnl * 0.1).toFixed(entry < 10 ? 4 : 2);
  const start = Math.floor(Date.now() / 1000) - 5;
  const won = p.pnl >= 0;
  const side = p.side === "fall" ? "fall" : "rise";
  return {
    id: p.id,
    marketId: p.marketId,
    marketName: p.marketName,
    tradeTypeLabel: side === "rise" ? "Rise" : "Fall",
    side,
    outcome: won ? "won" : "lost",
    stake: p.stake,
    payout: +(p.stake * 1.92).toFixed(2),
    contractValue: p.contractValue,
    pnl: p.pnl,
    buyPrice: p.stake,
    sellPrice: p.contractValue,
    referenceBuy: 4290000123,
    referenceSell: 0,
    derivContractId: "4290000123",
    duration: p.status ?? "5 ticks",
    barrier: entry,
    startTime: start,
    entrySpot: entry,
    entryTime: start + 1,
    exitSpot: exit,
    exitTime: start + 5,
    ticks: genTicks(entry, exit || entry, start, 5),
  };
}
