"use client";
import Link from "next/link";
import {
  useGetWalletBalance,
  getGetWalletBalanceQueryKey,
} from "@/services/api/endpoints/wallet/wallet";
import {
  useGetReferralStats,
  getGetReferralStatsQueryKey,
} from "@/services/api/endpoints/referrals/referrals";
import { useDerivAccounts } from "@/hooks/useDerivAccounts";
import { useDerivStatus } from "@/hooks/useDerivStatus";
import { useCommerce } from "@/hooks/useCommerce";
import { useAuthStore } from "@/stores/authStore";
import { accountBalanceText } from "@/components/deriv/balancePresentation";
import { formatMoney } from "@/lib/decimal";

export function DashboardMetrics({
  onTopUp,
  onSend,
}: {
  onTopUp?: () => void;
  onSend?: () => void;
}) {
  const userId = useAuthStore((state) => state.user?.id);
  const wallet = useGetWalletBalance({
    query: {
      queryKey: [...getGetWalletBalanceQueryKey(), userId],
      enabled: !!userId,
      refetchInterval: 15000,
    },
  });
  const partner = useGetReferralStats({
    query: {
      queryKey: [...getGetReferralStatsQueryKey(), userId],
      enabled: !!userId,
    },
  });
  const accounts = useDerivAccounts();
  const deriv = useDerivStatus();
  const commerce = useCommerce();
  const ready = (commerce.data?.tools ?? []).filter(
    (tool) => tool.access.allowed && tool.access.active,
  ).length;
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      <article className="wallet-summary col-span-2 rounded-xl border border-line bg-surface p-3.5 sm:col-span-1 sm:p-4">
        <p className="text-xs text-ink-3">FXNOD Wallet</p>
        <p className="mt-2 text-xl sm:text-2xl font-semibold tabular-nums text-ink break-words">
          {wallet.data
            ? accountBalanceText(wallet.data)
            : wallet.isError
              ? "Unavailable"
              : "—"}
        </p>
        <div className="mt-2 flex gap-2 text-xs sm:mt-3">
          <button
            type="button"
            onClick={onTopUp}
            className="inline-flex min-h-11 items-center rounded-lg px-2 text-ink hover:bg-surface-2 sm:min-h-8"
          >
            Top up
          </button>
          <button
            type="button"
            onClick={onSend}
            className="inline-flex min-h-11 items-center rounded-lg px-2 text-ink-2 hover:bg-surface-2 sm:min-h-8"
          >
            Transfer
          </button>
        </div>
      </article>
      <article className="rounded-xl border border-line bg-surface p-3.5 sm:p-4">
        <p className="text-xs text-ink-3">Active tool access</p>
        <p className="mt-2 text-2xl font-semibold text-ink">
          {commerce.isSuccess ? ready : "—"}
        </p>
        <Link
          href="/subscriptions"
          className="inline-block mt-3 text-xs text-ink-2 hover:underline"
        >
          Manage access →
        </Link>
      </article>
      <article className="rounded-xl border border-line bg-surface p-3.5 sm:p-4">
        <p className="text-xs text-ink-3">Connected accounts</p>
        <p className="mt-2 text-2xl font-semibold text-ink">
          {!deriv.isLoading && !deriv.linked
            ? "0"
            : accounts.isSuccess
              ? accounts.data.accounts.length
              : "—"}
        </p>
        <Link
          href="/venues"
          className="inline-block mt-3 text-xs text-ink-2 hover:underline"
        >
          Manage accounts →
        </Link>
      </article>
      <article className="col-span-2 flex items-center justify-between gap-3 rounded-xl border border-line bg-surface p-3.5 sm:col-span-1 sm:block sm:p-4">
        <div>
          <p className="text-xs text-ink-3">Partner earnings</p>
          <p className="mt-1 text-xl font-semibold text-ink tabular-nums sm:mt-2 sm:text-2xl">
            {partner.data
              ? formatMoney(String(partner.data.settled_total))
              : partner.isError
                ? "Unavailable"
                : "—"}
          </p>
        </div>
        <Link
          href="/partner/dashboard"
          className="inline-flex min-h-11 shrink-0 items-center text-xs text-ink-2 hover:underline sm:mt-3 sm:min-h-0"
        >
          Partner hub →
        </Link>
      </article>
    </div>
  );
}
