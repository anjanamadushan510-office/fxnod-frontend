import type { Candle } from "./BotChart";

/**
 * Placeholder candles for the dBot chart.
 *
 * TEMPORARY. Run state now comes from the API; only the chart still lacks a
 * feed, because bot-run candles are not carried over /ws yet. Delete this file
 * once they are — see the FOLLOW-UP note in BotChart.tsx.
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
