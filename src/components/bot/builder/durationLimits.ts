import type { ContractForEntry } from "@/services/deriv/contractsFor";

/**
 * Durations a Rise/Fall bot may use, read from Deriv's contracts_for.
 *
 * A length is allowed only when every selected market sells it for both Rise
 * and Fall. The builder never fills a gap with a guessed list.
 */

export interface IntRange {
  min: number;
  max: number;
}

export interface DurationBand {
  unit: "t" | "s" | "m" | "h" | "d";
  name: string;
  description: string;
  ranges: IntRange[];
}

const TIME_UNITS: Array<{
  unit: DurationBand["unit"];
  name: string;
  description: string;
  seconds: number;
}> = [
  { unit: "s", name: "Seconds", description: "Wall-clock seconds.", seconds: 1 },
  { unit: "m", name: "Minutes", description: "Wall-clock minutes.", seconds: 60 },
  { unit: "h", name: "Hours", description: "Wall-clock hours.", seconds: 3600 },
  { unit: "d", name: "Days", description: "Wall-clock days.", seconds: 86400 },
];

const UNIT_SECONDS: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };

interface Coverage {
  ticks: IntRange[];
  seconds: IntRange[];
}

function parseBound(raw: string | undefined): { ticks?: number; seconds?: number } | undefined {
  const match = /^(\d+)([tsmhd])$/.exec(raw ?? "");
  if (!match) return undefined;
  const n = Number(match[1]);
  if (!Number.isSafeInteger(n) || n < 0) return undefined;
  return match[2] === "t" ? { ticks: n } : { seconds: n * UNIT_SECONDS[match[2]] };
}

export function mergeRanges(ranges: IntRange[]): IntRange[] {
  const sorted = [...ranges].sort((a, b) => a.min - b.min || a.max - b.max);
  const out: IntRange[] = [];
  for (const range of sorted) {
    if (!Number.isFinite(range.min) || !Number.isFinite(range.max) || range.min > range.max) continue;
    const last = out[out.length - 1];
    if (!last || range.min > last.max + 1) out.push({ min: range.min, max: range.max });
    else last.max = Math.max(last.max, range.max);
  }
  return out;
}

export function intersectRanges(left: IntRange[], right: IntRange[]): IntRange[] {
  const out: IntRange[] = [];
  for (const a of left) {
    for (const b of right) {
      const min = Math.max(a.min, b.min);
      const max = Math.min(a.max, b.max);
      if (min <= max) out.push({ min, max });
    }
  }
  return mergeRanges(out);
}

function coverageForType(entries: readonly ContractForEntry[]): Coverage | null {
  if (entries.length === 0) return null;
  const ticks: IntRange[] = [];
  const seconds: IntRange[] = [];
  for (const entry of entries) {
    const min = parseBound(entry.min_contract_duration);
    const max = parseBound(entry.max_contract_duration);
    if (min?.ticks !== undefined && max?.ticks !== undefined && min.ticks <= max.ticks) {
      ticks.push({ min: min.ticks, max: max.ticks });
    } else if (min?.seconds !== undefined && max?.seconds !== undefined && min.seconds <= max.seconds) {
      seconds.push({ min: min.seconds, max: max.seconds });
    }
  }
  return { ticks: mergeRanges(ticks), seconds: mergeRanges(seconds) };
}

/** Lengths one market sells for every requested contract type. Null when a type is missing. */
export function coverageForMarket(
  contractTypes: readonly string[],
  available: readonly ContractForEntry[],
): Coverage | null {
  let ticks: IntRange[] | null = null;
  let seconds: IntRange[] | null = null;
  for (const type of contractTypes) {
    const coverage = coverageForType(available.filter((entry) => entry.contract_type === type));
    if (!coverage) return null;
    ticks = ticks === null ? coverage.ticks : intersectRanges(ticks, coverage.ticks);
    seconds = seconds === null ? coverage.seconds : intersectRanges(seconds, coverage.seconds);
  }
  if (!ticks || !seconds) return null;
  return { ticks, seconds };
}

function projectSeconds(ranges: IntRange[], unitSeconds: number): IntRange[] {
  const projected: IntRange[] = [];
  for (const range of ranges) {
    const min = Math.ceil(range.min / unitSeconds);
    const max = Math.floor(range.max / unitSeconds);
    if (min >= 1 && min <= max) projected.push({ min, max });
  }
  return mergeRanges(projected);
}

/**
 * Units and whole-number ranges shared by every market.
 * An empty list means the markets do not share a duration, or a market
 * published no contract for one of the types.
 */
export function durationBandsFor(
  contractTypes: readonly string[],
  markets: readonly (readonly ContractForEntry[])[],
): DurationBand[] {
  if (markets.length === 0) return [];
  let shared: Coverage | null = null;
  for (const available of markets) {
    const coverage = coverageForMarket(contractTypes, available);
    if (!coverage) return [];
    shared = shared === null
      ? coverage
      : {
          ticks: intersectRanges(shared.ticks, coverage.ticks),
          seconds: intersectRanges(shared.seconds, coverage.seconds),
        };
  }
  if (!shared) return [];

  const bands: DurationBand[] = [];
  const ticks = shared.ticks.filter((range) => range.max >= 1).map((range) => ({
    min: Math.max(1, range.min),
    max: range.max,
  }));
  if (ticks.length > 0) {
    bands.push({
      unit: "t",
      name: "Ticks",
      description: "Each new price print.",
      ranges: mergeRanges(ticks),
    });
  }
  for (const unit of TIME_UNITS) {
    const ranges = projectSeconds(shared.seconds, unit.seconds);
    if (ranges.length > 0) {
      bands.push({ unit: unit.unit, name: unit.name, description: unit.description, ranges });
    }
  }
  return bands;
}

export function durationFits(band: DurationBand | undefined, raw: string): boolean {
  if (!band || !/^\d+$/.test(raw)) return false;
  const value = Number(raw);
  return band.ranges.some((range) => value >= range.min && value <= range.max);
}

export function formatRanges(ranges: readonly IntRange[]): string {
  return ranges
    .map((range) => (range.min === range.max ? String(range.min) : `${range.min} to ${range.max}`))
    .join(", or ");
}
