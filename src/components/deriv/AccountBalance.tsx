import type { DerivLinkedAccount } from "@/services/api/model";
import { accountBalanceText, balanceReportedAt } from "./balancePresentation";
export function AccountBalance({
  account,
  compact = false,
}: {
  account: Pick<
    DerivLinkedAccount,
    "balance" | "currency" | "balance_updated_at"
  >;
  compact?: boolean;
}) {
  return (
    <span className="block text-right min-w-0">
      <span
        className={
          compact
            ? "block text-xs font-semibold text-ink tabular-nums break-words"
            : "block text-sm font-semibold text-ink tabular-nums break-words"
        }
      >
        {accountBalanceText(account)}
      </span>
      <span className="block mt-0.5 text-[10px] text-ink-3">
        {account.balance === undefined
          ? "Awaiting a Deriv balance"
          : balanceReportedAt(account.balance_updated_at)}
      </span>
    </span>
  );
}
