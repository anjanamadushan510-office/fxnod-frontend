/**
 * The shape the dBot UI reads a trade in.
 *
 * `BotRunTrade` from the generated client is the wire type; this is the same
 * trade after `toTradeRows` has parsed its amounts and formatted its time, so
 * the table and the trade detail view cannot disagree about either.
 */

/**
 * One sample of the tick stream Deriv returns with a settled contract. Both
 * fields are optional because the API declares the items open-ended, and the
 * chart drops any sample that is missing either.
 */
export interface BotTickSample {
  epoch?: number;
  tick?: number;
  [key: string]: unknown;
}

/** A sample complete enough to plot. */
export type PlottableTick = BotTickSample & { epoch: number; tick: number };

export type TradeDirection = "up" | "down";

export type TradeResult = "won" | "lost" | "open";

/** One row of a run's trade list. */
export interface BotTrade {
  id: string;
  /** HH:MM:SS in the user's locale. */
  time: string;
  direction: TradeDirection;
  stake: number;
  result: TradeResult;
  pnl: number | null;
  symbol: string;
  contractType: string;
  currency: string;
  createdAt: string;
  derivContractId: string;
  entryPrice?: number;
  /** The exit spot Deriv settled the contract on. Absent while it is open. */
  exitPrice?: number;
  tickStream?: BotTickSample[];
  /** When the bot chose to buy, before the order was sent. */
  decidedAt?: string;
  /**
   * The quotes a tick rule read to make that choice, oldest first, exactly as
   * the server sent them. Kept as text: a quote's last digit is the signal for
   * a digit bot, and a number would drop a trailing zero.
   */
  signalTicks?: string[];
  /** The time of the newest of those quotes. */
  signalTickAt?: string;
}
