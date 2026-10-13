import type { DerivLinkedAccount } from "@/services/api/model";

/** Preserve small crypto balances and decimal precision; an unknown balance is never zero. */
export function accountBalanceText(
  account: Pick<DerivLinkedAccount, "balance" | "currency">,
) {
  const raw = account.balance;
  const match =
    typeof raw === "string"
      ? /^(-?)(\d+)(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/.exec(raw)
      : null;
  if (!match) return "Balance unavailable";
  const [, sign, whole, fraction = "", exponentText = "0"] = match;
  const exponent = Number(exponentText);
  if (!Number.isInteger(exponent) || Math.abs(exponent) > 40)
    return "Balance unavailable";
  const allDigits = whole + fraction;
  const point = whole.length + exponent;
  const integerDigits =
    point <= 0 ? "0" : allDigits.slice(0, point).padEnd(point, "0");
  const fractionalDigits =
    point <= 0 ? "0".repeat(-point) + allDigits : allDigits.slice(point);
  const digits = fractionalDigits.replace(/0+$/, "").padEnd(2, "0");
  const negative = sign === "-" && /[1-9]/.test(allDigits);
  return `${negative ? "-" : ""}${BigInt(integerDigits).toLocaleString("en-US")}.${digits} ${account.currency}`;
}
export function balanceReportedAt(updatedAt?: string) {
  if (!updatedAt || !Number.isFinite(Date.parse(updatedAt)))
    return "Update time unavailable";
  return `Updated ${new Date(updatedAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
}
