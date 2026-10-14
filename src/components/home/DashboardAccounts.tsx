"use client";
import Link from "next/link";
import { useDerivAccounts } from "@/hooks/useDerivAccounts";
import { useDerivStatus } from "@/hooks/useDerivStatus";
import { AccountBalance } from "@/components/deriv/AccountBalance";
import { AccountBadge } from "@/components/autohub/pieces";
export function DashboardAccounts() {
  const deriv = useDerivStatus();
  const query = useDerivAccounts();
  const accounts = [...(query.data?.accounts ?? [])].sort(
    (a, b) => Number(b.is_selected) - Number(a.is_selected),
  );
  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">
            Deriv account balances
          </h2>
          <p className="mt-1 text-xs text-ink-3">
            Trading funds held at Deriv, separate from your FXNOD Wallet.
          </p>
        </div>
        <div className="flex gap-4 text-xs">
          <button
            type="button"
            disabled={!deriv.linked || query.isFetching}
            onClick={() => query.refetch()}
            className="text-ink-2 hover:underline disabled:opacity-40"
          >
            {query.isFetching ? "Refreshing…" : "Refresh balances"}
          </button>
          <Link href="/venues" className="text-ink-2 hover:underline">
            All accounts →
          </Link>
        </div>
      </div>
      {query.isError && (
        <p role="alert" className="mt-4 text-xs text-amber-500">
          Could not refresh balances. Any available figures below are the last
          reported snapshots.
        </p>
      )}
      {deriv.isLoading || (deriv.linked && query.isPending) ? (
        <p className="mt-5 text-sm text-ink-3">Loading account balances…</p>
      ) : accounts.length === 0 ? (
        <div className="mt-5 rounded-xl bg-surface-2 p-4 text-sm text-ink-2">
          Connect your Deriv account to see real and demo balances.{" "}
          <Link href="/venues" className="underline underline-offset-2">
            Manage connections
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-5">
          {accounts.slice(0, 4).map((account) => (
            <article
              key={account.deriv_account_id}
              className="rounded-xl border border-line bg-surface-2 p-4"
            >
              <div className="flex justify-between gap-2">
                <span className="font-mono text-xs text-ink">
                  {account.deriv_account_id}
                </span>
                <AccountBadge isVirtual={account.is_virtual} />
              </div>
              <div className="mt-4">
                <AccountBalance account={account} />
              </div>
              <p className="mt-3 text-[10px] text-ink-3">
                {account.needs_reconnect
                  ? "Reconnect required"
                  : account.is_selected
                    ? "Selected for new trades"
                    : "Available account"}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
