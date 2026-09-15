"use client";

import type { Route } from "next";
import Link from "next/link";
import { fmtUSD } from "@/lib/format";

export function DashboardActivity() {
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
            <tbody className="divide-y divide-[#24344F] text-ink-2">
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
                  <Link href="/options/dbot" className="text-xs text-gold hover:underline">Manage</Link>
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
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-200 mb-1">Top up</p>
              <p className="text-xs text-ink-3">Sep 12, 2026</p>
            </div>
            <span className="text-sm font-medium text-green-400 tabular-nums">+{fmtUSD(500.00)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-200 mb-1">Partner Payout</p>
              <p className="text-xs text-ink-3">Sep 01, 2026</p>
            </div>
            <span className="text-sm font-medium text-green-400 tabular-nums">+{fmtUSD(86.40)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-200 mb-1">Withdrawal</p>
              <p className="text-xs text-ink-3">Aug 28, 2026</p>
            </div>
            <span className="text-sm font-medium text-ink-2 tabular-nums">-{fmtUSD(150.00)}</span>
          </div>
        </div>
      </article>
    </div>
  );
}
