/**
 * LOGIC-002: Market-specific contract parameters via Deriv API.
 *
 * Fetches `contracts_for` for a given Deriv symbol via a one-shot WebSocket
 * and returns structured parameters (multipliers, growth rates, default stake,
 * cancellation options, etc.).
 *
 * Results are cached for 5 minutes per symbol — switching markets is fast
 * and does not open a new WS connection if data is still fresh.
 */

import { derivWsUrl } from "./derivSymbols";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContractForEntry {
  contract_type: string;
  contract_category: string;
  /** Live multiplier values for this symbol e.g. [40, 100, 200, 300, 400] */
  multiplier_range?: number[];
  /** Growth rate range for ACCU e.g. [0.01, 0.02, 0.03, 0.04, 0.05] */
  growth_rate_range?: number[];
  /** Default stake in account currency */
  default_stake?: number;
  /** Available cancellation durations e.g. ["5m", "10m", "30m"] */
  cancellation_range?: string[];
  /** Min contract duration string e.g. "1t" */
  min_contract_duration?: string;
  /** Max contract duration string e.g. "365d" */
  max_contract_duration?: string;
  expiry_type?: string;
  sentiment?: string;
  underlying_symbol?: string;
  barrier_choices?: string[];
}

export interface MarketContractParams {
  /** Raw entries indexed by contract_type */
  byType: Record<string, ContractForEntry>;
  /** Multiplier options for MULTUP/MULTDOWN */
  multiplierRange: number[];
  /** Growth rate options (as integers 1–5) for ACCU */
  growthRateRange: number[];
  /** Default stake to pre-fill */
  defaultStake?: number;
  /** Cancellation options for multiplier contracts */
  cancellationRange: string[];
  /** Whether the symbol supports tick durations */
  supportsTicks: boolean;
  /** The raw list of available contracts for advanced filtering (e.g. by duration/expiry) */
  available: ContractForEntry[];
}

// ─── Cache ────────────────────────────────────────────────────────────────────

interface CacheEntry {
  timestamp: number;
  params: MarketContractParams;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8_000;

// In-flight deduplication: multiple components asking for the same symbol
// share one WS connection.
const inFlight = new Map<string, Promise<MarketContractParams>>();

// ─── Fetch ────────────────────────────────────────────────────────────────────

function fetchContractsFor(derivSymbol: string): Promise<MarketContractParams> {
  return new Promise((resolve, reject) => {
    let settled = false;

    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        ws.close();
        reject(new Error(`contracts_for: timeout for ${derivSymbol}`));
      }
    }, FETCH_TIMEOUT_MS);

    const ws = new WebSocket(derivWsUrl());

    ws.onopen = () => {
      ws.send(JSON.stringify({ contracts_for: derivSymbol, req_id: 1 }));
    };

    ws.onmessage = (event: MessageEvent) => {
      if (settled) return;
      try {
        const msg = JSON.parse(event.data as string);
        if (msg.error) {
          settled = true;
          clearTimeout(timeout);
          ws.close();
          reject(new Error(`contracts_for error: ${msg.error.message}`));
          return;
        }
        if (msg.contracts_for) {
          settled = true;
          clearTimeout(timeout);
          ws.close();
          resolve(parseContractsFor(msg.contracts_for.available ?? []));
        }
      } catch {
        /* malformed frame — wait */
      }
    };

    ws.onerror = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        reject(new Error("contracts_for: WS error"));
      }
    };

    ws.onclose = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        reject(new Error("contracts_for: WS closed unexpectedly"));
      }
    };
  });
}

function parseContractsFor(available: ContractForEntry[]): MarketContractParams {
  const byType: Record<string, ContractForEntry> = {};
  for (const entry of available) {
    byType[entry.contract_type] = entry;
  }

  // Multipliers: prefer MULTUP, fall back to MULTDOWN
  const multEntry = byType["MULTUP"] ?? byType["MULTDOWN"];
  const multiplierRange = multEntry?.multiplier_range ?? [];

  // Growth rates: convert from decimals (0.01→1, 0.05→5)
  const accuEntry = byType["ACCU"];
  const growthRateRange = accuEntry?.growth_rate_range
    ? accuEntry.growth_rate_range.map((r) => Math.round(r * 100))
    : [];

  // Default stake: use first available entry
  const firstEntry = available[0];
  const defaultStake = multEntry?.default_stake ?? accuEntry?.default_stake ?? firstEntry?.default_stake;

  // Cancellation range from multipliers
  const cancellationRange = multEntry?.cancellation_range ?? [];

  // Tick support: CALL with min_contract_duration "1t"
  const callEntry = byType["CALL"] ?? byType["PUT"];
  const supportsTicks =
    callEntry?.min_contract_duration === "1t" ||
    callEntry?.min_contract_duration?.endsWith("t") === true;

  return {
    byType,
    multiplierRange,
    growthRateRange,
    defaultStake,
    cancellationRange,
    supportsTicks,
    available,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const EMPTY_PARAMS: MarketContractParams = {
  byType: {},
  multiplierRange: [],
  growthRateRange: [],
  defaultStake: undefined,
  cancellationRange: [],
  supportsTicks: true,
  available: [],
};

/**
 * Returns live contract parameters for a Deriv symbol.
 * Uses a 5-minute cache and deduplicates concurrent requests.
 */
export async function getContractsFor(
  derivSymbol: string
): Promise<MarketContractParams> {
  if (!derivSymbol) return EMPTY_PARAMS;

  // Fresh cache hit
  const cached = cache.get(derivSymbol);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.params;
  }

  // In-flight deduplication
  if (inFlight.has(derivSymbol)) {
    return inFlight.get(derivSymbol)!;
  }

  const promise = fetchContractsFor(derivSymbol)
    .then((params) => {
      cache.set(derivSymbol, { timestamp: Date.now(), params });
      return params;
    })
    .catch((err) => {
      console.warn("[contractsFor] fetch failed, returning empty params:", err);
      return EMPTY_PARAMS;
    })
    .finally(() => {
      inFlight.delete(derivSymbol);
    });

  inFlight.set(derivSymbol, promise);
  return promise;
}
