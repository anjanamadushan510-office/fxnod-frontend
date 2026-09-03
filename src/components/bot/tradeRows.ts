import type { BotRunTrade } from "@/services/api/model";
import type { BotTrade } from "./types";

/**
 * Turns API trades into the history table's rows. Times render in the viewer's
 * locale — someone reconciling their own trades reads their own clock.
 *
 * Shared by the workspace and the history page so a settled trade cannot be
 * shown two different ways depending on which screen it is read from.
 */
export function toTradeRows(trades: BotRunTrade[]): BotTrade[] {
  return trades.map((t) => ({
    id: t.trade_id,
    time: new Date(t.created_at).toLocaleTimeString(),
    direction: t.side === "fall" ? "down" : "up",
    stake: Number.parseFloat(t.stake_amount) || 0,
    result: t.outcome === "won" ? "won" : t.outcome === "lost" ? "lost" : "open",
    // null, not 0, while unsettled — the table renders "--" rather than a
    // break-even figure the contract has not produced.
    pnl: t.profit_loss === undefined ? null : Number.parseFloat(t.profit_loss),
  }));
}
