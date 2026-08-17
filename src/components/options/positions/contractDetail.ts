/**
 * Contract-details model + mock data (Deriv Â§10).
 *
 * `ContractDetail` is the rich shape the details modal renders: metadata for
 * the left panel + the isolated tick path for the right-panel chart. The mock
 * closed contracts are deterministic (no Math.random / Date.now) so the
 * server and client markup match â€” important since the drawer is in the DOM
 * (clipped) even when closed.
 */
import type { Position } from "@/hooks/useMockPositions";
import { fromDerivSymbol } from "@/services/deriv/derivSymbols";
import { MARKETS } from "@/components/options/market/catalog";

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
  type: string;
  /** "Rise" / "Fall" / "Up" â€¦ */
  tradeTypeLabel: string;
  side: "rise" | "fall";
  growthRate?: number;
  outcome: "won" | "lost";
  stake: number;
  payout: number;
  contractValue: number;
  pnl: number;
  buyPrice: number;
  sellPrice: number;
  derivContractId: number;
  buyTransactionId: number;
  sellTransactionId: number;
  duration: string;
  barrier: number;
  startTime: number;
  entrySpot: number;
  entryTime: number;
  exitSpot: number;
  exitTime: number;
  expiryTime?: number;
  payoutPerPoint?: number;
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

/** Deterministic tick path from entry -> exit with a realistic Brownian bridge. */
function genTicks(
  entry: number,
  exit: number,
  startSec: number,
  endSec: number,
  n = 15,
): ContractTick[] {
  const duration = Math.max(1, endSec - startSec);
  n = Math.max(2, Math.min(n, duration + 1));
  const out: ContractTick[] = [];

  let seed = startSec;
  const seededRandom = () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  let walk = [0];
  for (let i = 1; i < n; i++) {
    const step = seededRandom() - 0.5;
    walk.push(walk[i - 1] + step);
  }

  const walkEnd = walk[n - 1];
  let maxAbsWiggle = 0;
  for (let i = 0; i < n; i++) {
    const frac = n > 1 ? i / (n - 1) : 0;
    walk[i] = walk[i] - walkEnd * frac;
    if (Math.abs(walk[i]) > maxAbsWiggle) {
      maxAbsWiggle = Math.abs(walk[i]);
    }
  }

  const diff = Math.abs(exit - entry);
  const amp = diff > 0 ? diff * 0.8 : 0.5;
  const scale = maxAbsWiggle > 0 ? amp / maxAbsWiggle : 0;

  for (let i = 0; i < n; i++) {
    const frac = n > 1 ? i / (n - 1) : 0;
    const base = entry + (exit - entry) * frac;
    const wiggle = walk[i] * scale;

    out.push({
      time: startSec + Math.round(frac * duration),
      value: +(base + wiggle).toFixed(Math.abs(entry) < 10 ? 4 : 2),
      kind: i === 0 ? "entry" : i === n - 1 ? "exit" : "normal",
    });
  }

  for (let i = 1; i < out.length; i++) {
    if (out[i].time <= out[i - 1].time) {
      out[i].time = out[i - 1].time + 1;
    }
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
    type: "rise_fall",
    tradeTypeLabel: formatTradeTypeLabel("rise_fall", p.side),
    side: p.side,
    outcome: p.outcome,
    stake: p.stake,
    payout: p.payout,
    contractValue,
    pnl,
    buyPrice: p.stake,
    sellPrice: contractValue,
    derivContractId: refBase,
    buyTransactionId: refBase + 1000,
    sellTransactionId: refBase + 1001,
    duration: "5 ticks",
    barrier: p.entry,
    startTime: p.start,
    entrySpot: p.entry,
    entryTime: p.start + 1,
    exitSpot: p.exit,
    exitTime: p.start + 5,
    ticks: genTicks(p.entry, p.exit, p.start, p.start + 5, 5),
  };
}

export function formatTradeTypeLabel(type: string, side: string): string {
  const rawMap: Record<string, string> = {
    CALL: "Rise",
    PUT: "Fall",
    HIGHER: "Higher",
    LOWER: "Lower",
    ONETOUCH: "Touch",
    NOTOUCH: "No Touch",
    DIGITMATCH: "Matches",
    DIGITDIFF: "Differs",
    DIGITOVER: "Over",
    DIGITUNDER: "Under",
    DIGITEVEN: "Even",
    DIGITODD: "Odd",
    ACCU: "Accumulators",
    MULTUP: "Multiplier Up",
    MULTDOWN: "Multiplier Down",
    TURBOSLONG: "Turbos Up",
    TURBOSSHORT: "Turbos Down",
    VANILLALONGCALL: "Vanillas Call",
    VANILLALONGPUT: "Vanillas Put",
  };
  
  if (rawMap[type]) return rawMap[type];
  if (type === "rise_fall") return side === "rise" ? "Rise" : "Fall";
  if (type === "higher_lower") return side === "rise" || side === "higher" ? "Higher" : "Lower";
  if (type === "touch_no_touch") return side === "touch" ? "Touch" : "No Touch";
  if (type === "vanillas") return side === "fall" ? "Vanillas Put" : "Vanillas Call";
  if (type === "accumulators") return "Accumulators";
  if (type === "turbos") return (side === "fall" || side === "down") ? "Turbos Down" : "Turbos Up";
  if (type === "multipliers") return (side === "up" || side === "rise") ? "Multiplier Up" : (side === "down" || side === "fall") ? "Multiplier Down" : "Multipliers";
  
  if (side && side !== "null" && side !== "") {
    return side.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  if (type && type !== "null" && type !== "") {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  return "Unknown";
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
  const pnl = +(finalPayout - stake).toFixed(2);
  // contractValue = what was actually received
  const contractValue = finalPayout;

  const backendDurSecs: number = Number((h as any).duration_seconds) || 0;
  const backendDurUnit: string  = String((h as any).duration_unit  || "");

  // TradeHistoryEntry created_at is an ISO string, parse it to epoch seconds
  let startTime = Math.floor(new Date(h.created_at).getTime() / 1000);
  let exitTime = backendDurSecs > 0 ? startTime + backendDurSecs : startTime;

  let entrySpot = Number((h as any).entry_spot) || 0;
  let exitSpot = Number((h as any).exit_spot) || 0;

  let ticks: ContractTick[] = [];
  const ts = (h as any).tick_stream;
  if (ts && Array.isArray(ts) && ts.length > 0) {
    if (backendDurUnit === "t" && backendDurSecs > 0) {
      let exitIdx = ts.length - 1;
      if (exitSpot > 0) {
        for (let i = ts.length - 1; i >= 0; i--) {
          const val = Number(ts[i].tick_display_value) || Number(ts[i].tick) || 0;
          if (Math.abs(val - exitSpot) < 0.000001) {
            exitIdx = i;
            break;
          }
        }
      }
      
      const startIdx = Math.max(0, exitIdx - backendDurSecs + 1);
      const elapsed = ts.slice(startIdx, exitIdx + 1);
      
      ticks = elapsed.map((t: any, i: number) => ({
        time: t.epoch || (startTime + i + 1),
        value: Number(t.tick_display_value) || Number(t.tick) || 0,
        kind: i === elapsed.length - 1 ? "exit" : "normal"
      }));

      ticks.unshift({
        time: startTime,
        value: entrySpot || ticks[0]?.value || 0,
        kind: "entry"
      });
    } else {
      ticks = ts.map((t: any, i: number) => {
        const time = t.epoch || (startTime + i);
        const value = Number(t.tick_display_value) || Number(t.tick) || 0;
        let kind: "entry" | "exit" | "normal" = "normal";
        if (i === ts.length - 1) kind = "exit";
        return { time, value, kind };
      });
      
      if (ticks.length > 0) {
        if (ticks[0].time > startTime) {
          ticks.unshift({
            time: startTime,
            value: entrySpot || ticks[0].value,
            kind: "entry",
          });
        } else {
          ticks[0].kind = "entry";
        }
      }
    }

    if (entrySpot === 0 && ticks.length > 0) entrySpot = backendDurUnit === "t" && ticks.length > 2 ? ticks[2].value : ticks[0].value;
    if (exitSpot === 0 && ticks.length > 0) exitSpot = ticks[ticks.length - 1].value;
    startTime = ticks[0].time;
    exitTime = ticks[ticks.length - 1].time;
  } else if (entrySpot && exitSpot) {
    if (exitTime === startTime) exitTime = startTime + 5; // fallback
    const isTickFallback = backendDurUnit === "t";
    const numPoints = isTickFallback ? Math.max(5, backendDurSecs) : Math.max(10, backendDurSecs);
    ticks = genTicks(entrySpot, exitSpot, startTime, exitTime, numPoints);
  }

		const seconds = Math.max(1, exitTime - startTime);

		// Prefer the authoritative values persisted from the proposal:
		//   duration_unit "t" -> ticks, any other unit -> seconds/mins etc.
		let durationLabel: string;
		if (backendDurUnit === "t" && backendDurSecs > 0) {
			// Tick-based trade: use requested duration
			durationLabel = `${backendDurSecs} ticks`;
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

    const catalogId = fromDerivSymbol(h.symbol);
    const marketName = catalogId && MARKETS[catalogId] ? MARKETS[catalogId].name : h.symbol;

    return {
      id: h.id,
      marketId: h.symbol,
      marketName: marketName,
      type: h.frontend_contract_type,
      tradeTypeLabel: formatTradeTypeLabel(h.frontend_contract_type, h.side),
      side: h.side === "fall" ? "fall" : "rise",
      growthRate: Number((h as any).growth_rate) || undefined,
      outcome: won ? "won" : "lost",
      stake,
      payout,
      contractValue,
      pnl,
      buyPrice: stake,
      sellPrice: contractValue,
      derivContractId: Number((h as any).deriv_contract_id) || 0,
      buyTransactionId: Number((h as any).buy_transaction_id) || 0,
      sellTransactionId: Number((h as any).sell_transaction_id) || 0,
      duration: durationLabel,
      barrier: parseBarrier(h.barrier, entrySpot),
      startTime,
      entrySpot,
      entryTime: startTime + 1,
      exitSpot,
      exitTime,
      payoutPerPoint: (h.frontend_contract_type === "vanillas" || h.frontend_contract_type === "turbos" || h.frontend_contract_type === "TURBOSLONG" || h.frontend_contract_type === "TURBOSSHORT") ? potentialPayout : undefined,
      ticks,
  };
}

function parseBarrier(barrierVal: string | number | null | undefined, entrySpot: number): number {
  if (barrierVal == null) return entrySpot;
  const str = String(barrierVal);
  const num = Number(str);
  if (str.startsWith("+") || str.startsWith("-")) {
    return Number((entrySpot + num).toFixed(5));
  }
  return num;
}

/** Best-effort ContractDetail for an in-progress open position. */
export function simPositionToDetail(p: Position): ContractDetail {
  const entry = p.entrySpot ?? 0;
  const exit = p.currentSpot ?? +(entry + p.pnl * 0.1).toFixed(entry < 10 ? 4 : 2);
  const start = p.startTime || (Math.floor(Date.now() / 1000) - 5);
  let now = Math.floor(Date.now() / 1000);
  if (now < start + 1) now = start + 1;
  const won = p.pnl >= 0;
  const side = p.side === "fall" ? "fall" : "rise";

  const isTick = p.isTick || (p.status && p.status.includes("tick"));
  const numPoints = isTick ? Math.max(5, now - start) : Math.max(10, Math.min(100, now - start));

  let ticks: any[] = [];
  if (p.tickStream && p.tickStream.length > 0) {
    let ts = p.tickStream;
    // Truncate trailing ticks if the trade is finished
    if (isTick && (p.status === "won" || p.status === "lost" || p.outcome === "won" || p.outcome === "lost") && exit > 0) {
      let exitIdx = ts.length - 1;
      for (let i = ts.length - 1; i >= 0; i--) {
        const val = Number(ts[i].tick_display_value) || Number(ts[i].tick) || 0;
        if (Math.abs(val - exit) < 0.000001) {
          exitIdx = i;
          break;
        }
      }
      
      const requestedTicks = parseInt(p.status || "0", 10) || 5; // try to parse from "5 ticks"
      const startIdx = Math.max(0, exitIdx - requestedTicks + 1);
      ts = ts.slice(startIdx, exitIdx + 1);
    }
    
    ticks = ts.map((t: any, i: number) => ({
      time: t.epoch || (start + i),
      value: Number(t.tick_display_value) || Number(t.tick) || 0,
      kind: "normal",
    }));
    
    if (ticks[0].time > start) {
      ticks.unshift({
        time: start,
        value: entry || ticks[0].value,
        kind: "entry",
      });
    } else {
      ticks[0].kind = "entry";
    }
    
    if (p.status === "won" || p.status === "lost" || p.outcome === "won" || p.outcome === "lost") {
      ticks[ticks.length - 1].kind = "exit";
    }
  } else {
    ticks = genTicks(entry, exit || entry, start, now, numPoints);
  }

  return {
    id: p.id,
    marketId: p.marketId,
    marketName: p.marketName,
    type: p.contractType,
    tradeTypeLabel: formatTradeTypeLabel(p.contractType, side),
    side,
    growthRate: p.growthRate,
    outcome: won ? "won" : "lost",
    stake: p.stake,
    payout: +(p.stake * 1.92).toFixed(2),
    contractValue: p.contractValue,
    pnl: p.pnl,
    buyPrice: p.stake,
    sellPrice: p.contractValue,
    derivContractId: p.contractId ? Number(p.contractId) : 4290000123,
    buyTransactionId: (p as any).buy_transaction_id ? Number((p as any).buy_transaction_id) : 17000000001,
    sellTransactionId: (p as any).sell_transaction_id ? Number((p as any).sell_transaction_id) : 0,
    duration: p.status ?? "Open",
    barrier: parseBarrier(p.barrier, entry),
    startTime: start,
    entrySpot: entry,
    entryTime: start,
    exitSpot: exit,
    exitTime: now,
    expiryTime: p.expiryTime,
    payoutPerPoint: (p.contractType === "vanillas" || p.contractType === "turbos" || p.contractType === "VANILLALONGCALL" || p.contractType === "VANILLALONGPUT" || p.contractType === "TURBOSLONG" || p.contractType === "TURBOSSHORT") ? ((p as any).display_number_of_contracts ? Number((p as any).display_number_of_contracts) : p.stake) : undefined,
    ticks: ticks as any,
  };
}



