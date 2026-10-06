import type { BotStartConflict } from "@/services/api/model";
import { BotStartConflictCode } from "@/services/api/model";

/** Statuses of a run the engine is still working on. */
export const ACTIVE_STATUSES = new Set(["pending", "running", "paused", "stopping"]);

export function isActiveRun(status: string | undefined): boolean {
  return ACTIVE_STATUSES.has(status ?? "");
}

/**
 * How often an Auto Hub page re-reads a live run.
 *
 * A one-tick trade closes in a second or two, so this is as slow as the page
 * can go and still look current. Finished runs are records and are not
 * polled, and React Query stops the timer while the tab is in the background.
 */
export const RUN_POLL_MS = 2000;

/** Why the engine ended a run, in the user's words. */
export const STOP_REASONS: Record<string, string> = {
  session_stop_loss: "Reached its stop loss",
  session_target_profit: "Reached its take profit",
  max_trades: "Reached its trade limit",
  max_duration: "Reached its time limit",
  user_requested: "You stopped it",
  account_session_loss: "Your bots together reached the account loss ceiling",
  deriv_reconnect_required: "Deriv needs you to allow this bot again",
  admin_halt: "Stopped by FXNod",
  error: "Stopped after an error",
};

export function stopReasonLabel(reason: string | undefined): string | null {
  if (!reason) return null;
  return STOP_REASONS[reason] ?? reason;
}

/**
 * The Deriv app a refused start is waiting on, or null when the refusal was
 * something else.
 *
 * Each bot trades through its own FXNod app on Deriv, and the first start on
 * an account needs the user to allow that app once. The server says which.
 */
export function consentRequired(err: unknown): string | null {
  const response = (err as { response?: { status?: number; data?: BotStartConflict } })?.response;
  if (
    response?.status !== 409 ||
    response.data?.code !== BotStartConflictCode.deriv_app_consent_required
  ) {
    return null;
  }
  return response.data.app_key ?? null;
}

const DECIMAL = /^\d+(\.\d{1,2})?$/;

/**
 * Whether a money field holds an amount the form can send: digits, at most two
 * decimals, above zero. Amounts travel to the API as the string the user
 * typed, so this checks the string rather than a parsed number.
 */
export function isAmount(raw: string): boolean {
  const value = raw.trim();
  return DECIMAL.test(value) && /[1-9]/.test(value);
}

/**
 * Compares two plain decimal strings (no sign, no exponent) without a float.
 * Returns a negative number, zero or a positive number, like a sort callback.
 */
export function compareAmounts(a: string, b: string): number {
  const [aWhole, aFraction = ""] = a.trim().split(".");
  const [bWhole, bFraction = ""] = b.trim().split(".");
  const whole = BigInt(aWhole || "0") - BigInt(bWhole || "0");
  if (whole !== BigInt(0)) return whole < BigInt(0) ? -1 : 1;
  const width = Math.max(aFraction.length, bFraction.length);
  const fraction =
    BigInt(aFraction.padEnd(width, "0") || "0") - BigInt(bFraction.padEnd(width, "0") || "0");
  return fraction === BigInt(0) ? 0 : fraction < BigInt(0) ? -1 : 1;
}
