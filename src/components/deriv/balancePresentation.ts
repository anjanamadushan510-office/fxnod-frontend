import type { DerivLinkedAccount } from "@/services/api/model";

/** Preserve small crypto balances and decimal precision; an unknown balance is never zero. */
export function accountBalanceText(
  account: Pick<DerivLinkedAccount, "balance" | "currency">,
) {
  const raw = account.balance;
  if (typeof raw !== "string" || !/^-?\d+(\.\d+)?$/.test(raw))
    return "Balance unavailable";
  const negative = raw.startsWith("-");
  const [whole, fraction = ""] = (negative ? raw.slice(1) : raw).split(".");
  const digits = fraction.replace(/0+$/, "").padEnd(2, "0");
  return `${negative ? "-" : ""}${BigInt(whole).toLocaleString("en-US")}.${digits} ${account.currency}`;
}
export function balanceReportedAt(updatedAt?: string) {
  if (!updatedAt || !Number.isFinite(Date.parse(updatedAt)))
    return "Update time unavailable";
  return `Updated ${new Date(updatedAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
}
