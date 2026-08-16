import type { Candle } from "./BotChart";
import type { BotSession, BotTrade } from "./types";

/**
 * Preview data for the dBot screen.
 *
 * TEMPORARY — delete this file when `auto_*` is wired. It exists so the UI can
 * be reviewed and iterated on before the backend endpoints and the bot worker
 * exist, and the page labels itself as preview while it is in use so nobody
 * mistakes these figures for their own account.
 *
 * Deterministic by construction (a seeded LCG, no Date.now, no Math.random):
 * React would otherwise render different values on the server and the client
 * and fail hydration, and a chart that reshuffled on every render would be
 * impossible to design against.
 */

/** Mulberry32 — small, fast, and identical on server and client. */
function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fixed epoch so the time axis is stable across renders and environments. */
const BASE_TIME = Date.UTC(2026, 7, 16, 9, 30, 0);

export function sampleCandles(count = 90): Candle[] {
  const rand = seeded(20260816);
  const out: Candle[] = [];
  let price = 1265;

  for (let i = 0; i < count; i++) {
    // Gentle mean reversion around the seed plus noise — enough shape for the
    // Bollinger bands and RSI to read as a real market rather than a sine wave.
    const drift = (1265 - price) * 0.03;
    const open = price;
    const close = open + drift + (rand() - 0.5) * 7;
    const high = Math.max(open, close) + rand() * 2.4;
    const low = Math.min(open, close) - rand() * 2.4;

    out.push({ time: BASE_TIME + i * 60_000, open, high, low, close });
    price = close;
  }
  return out;
}

export const SAMPLE_SESSION: BotSession = {
  status: "running",
  realizedPnl: 247.36,
  realizedPnlPct: 24.74,
  tradesTotal: 24,
  tradesWon: 16,
  tradesLost: 8,
  targetProfitProgress: 72,
  targetProfitLimit: 100,
  stopLossProgress: 28,
  stopLossLimit: 100,
  currency: "USD",
};

export const SAMPLE_TRADES: BotTrade[] = [
  { id: "t1", time: "10:24:31", direction: "up", stake: 10, result: "won", pnl: 5.12 },
  { id: "t2", time: "10:23:47", direction: "up", stake: 10, result: "won", pnl: 5.08 },
  { id: "t3", time: "10:23:03", direction: "down", stake: 10, result: "lost", pnl: -10 },
  { id: "t4", time: "10:22:19", direction: "up", stake: 10, result: "won", pnl: 5.1 },
  { id: "t5", time: "10:21:35", direction: "up", stake: 10, result: "won", pnl: 5.11 },
  { id: "t6", time: "10:20:51", direction: "down", stake: 10, result: "lost", pnl: -10 },
  { id: "t7", time: "10:20:07", direction: "up", stake: 10, result: "won", pnl: 5.09 },
  { id: "t8", time: "10:19:23", direction: "up", stake: 10, result: "open", pnl: null },
  { id: "t9", time: "10:18:39", direction: "down", stake: 10, result: "lost", pnl: -10 },
];
