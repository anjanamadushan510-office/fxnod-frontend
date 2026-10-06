"use client";

import type { Route } from "next";
import Link from "next/link";
import { fmtUSD } from "@/lib/format";
import { useGetWalletTransactions } from "@/services/api/endpoints/wallet/wallet";
import { RunningNow } from "./RunningNow";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
}

export function DashboardActivity() {
  const { data: transactionsData, isLoading, isError } = useGetWalletTransactions();
  const transactions = (transactionsData?.items || []).slice(0, 4);
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <RunningNow />

      {/* Recent Wallet */}
      <article className="bg-surface border border-line rounded-2xl p-5 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-sm font-semibold text-ink">Recent wallet</h2>
          <Link href={"/wallet" as Route} className="text-xs text-ink-2 hover:text-ink transition-colors">
            Open &rarr;
          </Link>
        </div>
        
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pt-2">
          {isLoading ? (
            <p className="text-sm text-ink-3">Loading activity...</p>
          ) : isError ? (
            <p className="text-sm text-red-400">Failed to load activity.</p>
          ) : transactions.length === 0 ? (
            <p className="text-sm text-ink-3">No recent activity.</p>
          ) : (
            transactions.map((tx) => {
              const amount = Math.abs(Number(tx.amount));
              const isPositive = tx.direction === "credit";
              
              return (
                <div key={tx.id} className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink mb-0.5 capitalize truncate">
                      {tx.transaction_type ? tx.transaction_type.replace(/_/g, ' ') : tx.description || "Transaction"}
                    </p>
                    <p className="text-xs text-ink-3 truncate">{formatDate(tx.created_at)}</p>
                  </div>
                  <span className={`text-sm font-medium tabular-nums shrink-0 ${isPositive ? 'text-green-400' : 'text-ink-2'}`}>
                    {isPositive ? '+' : '-'}{fmtUSD(amount)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </article>
    </div>
  );
}
