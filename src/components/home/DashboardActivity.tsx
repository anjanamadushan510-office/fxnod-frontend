"use client";

import type { Route } from "next";
import Link from "next/link";
import { fmtUSD } from "@/lib/format";
import { useGetWalletTransactions } from "@/services/api/endpoints/wallet/wallet";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
}

export function DashboardActivity() {
  const { data: transactionsData, isLoading, isError } = useGetWalletTransactions();
  const transactions = (transactionsData?.items || []).slice(0, 4);
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      {/* Subscriptions / Active Positions */}
      <article className="xl:col-span-2 bg-surface border border-line rounded-2xl overflow-hidden min-w-0 flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-line gap-3">
          <h2 className="font-display text-sm font-semibold text-ink">Active on your account</h2>
          <Link href="/subscriptions" className="text-xs text-ink-2 hover:text-ink transition-colors">
            Subscriptions &rarr;
          </Link>
        </div>
        
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface/50 text-[11px] uppercase tracking-wider text-ink-3">
              <tr>
                <th className="px-5 py-3 font-medium">Service</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Cost / PnL</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-ink-2">
              <tr className="hover:bg-surface-2 transition-colors">
                <td className="px-5 py-5 font-medium text-ink">dTrader Ticket #891</td>
                <td className="px-5 py-5">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs text-ink-2">Running</span>
                  </div>
                </td>
                <td className="px-5 py-5 text-green-400 tabular-nums">{fmtUSD(12.50)}</td>
                <td className="px-5 py-5 text-right">
                  <Link href="/options/dtrader" className="text-xs text-gold hover:underline">Open</Link>
                </td>
              </tr>
              <tr className="hover:bg-surface-2 transition-colors">
                <td className="px-5 py-5 font-medium text-ink">dBot Master Algo</td>
                <td className="px-5 py-5">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs text-ink-2">Running</span>
                  </div>
                </td>
                <td className="px-5 py-5 text-ink-2 tabular-nums">Free</td>
                <td className="px-5 py-5 text-right">
                  <Link href="/dbot" className="text-xs text-gold hover:underline">Manage</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

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
