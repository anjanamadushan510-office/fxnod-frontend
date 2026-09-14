"use client";

import type { Route } from "next";
import Link from "next/link";
import { fmtUSD } from "@/lib/format";

export function DashboardActivity() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      {/* Subscriptions / Active Positions */}
      <article className="xl:col-span-2 bg-[#101827] border border-[#24344F] rounded-2xl overflow-hidden min-w-0 flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#24344F] gap-3">
          <h2 className="font-display text-sm font-semibold text-white">Active on your account</h2>
          <Link href="/subscriptions" className="text-xs text-zinc-400 hover:text-white transition-colors">
            Subscriptions &rarr;
          </Link>
        </div>
        
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface/50 text-[11px] uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-5 py-3 font-medium">Service</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Cost / PnL</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#24344F] text-zinc-300">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4 font-medium text-white">dTrader Ticket #891</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs text-zinc-400">Running</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-green-400 tabular-nums">{fmtUSD(12.50)}</td>
                <td className="px-5 py-4 text-right">
                  <Link href="/options/dtrader" className="text-xs text-gold hover:underline">Open</Link>
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4 font-medium text-white">dBot Master Algo</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs text-zinc-400">Running</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-zinc-400 tabular-nums">Free</td>
                <td className="px-5 py-4 text-right">
                  <Link href="/options/dbot" className="text-xs text-gold hover:underline">Manage</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      {/* Recent Wallet */}
      <article className="bg-[#101827] border border-[#24344F] rounded-2xl p-5 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-sm font-semibold text-white">Recent wallet</h2>
          <Link href={"/wallet" as Route} className="text-xs text-zinc-400 hover:text-white transition-colors">
            Open &rarr;
          </Link>
        </div>
        
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-200">Top up</p>
              <p className="text-xs text-zinc-500">Sep 12, 2026</p>
            </div>
            <span className="text-sm font-medium text-green-400 tabular-nums">+{fmtUSD(500.00)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-200">Partner Payout</p>
              <p className="text-xs text-zinc-500">Sep 01, 2026</p>
            </div>
            <span className="text-sm font-medium text-green-400 tabular-nums">+{fmtUSD(86.40)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-200">Withdrawal</p>
              <p className="text-xs text-zinc-500">Aug 28, 2026</p>
            </div>
            <span className="text-sm font-medium text-zinc-300 tabular-nums">-{fmtUSD(150.00)}</span>
          </div>
        </div>
      </article>
    </div>
  );
}
