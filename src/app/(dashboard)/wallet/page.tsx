"use client";

import { useGetWalletBalance, useGetWalletTransactions } from "@/services/api/endpoints/wallet/wallet";
import { fmtUSD } from "@/lib/format";

export default function WalletPage() {
  const { data: walletData } = useGetWalletBalance();
  const balance = Number(walletData?.balance || 0);

  const { data: transactionsData, isLoading, isError } = useGetWalletTransactions();
  const transactions = transactionsData?.items || [];

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(d);
  }

  return (
    <section data-view="wallet" className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:ml-auto">
          <button className="h-9 px-4 rounded-lg border border-[#24344F] text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors w-full sm:w-auto">Send to Deriv</button>
          <button className="h-9 px-4 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors w-full sm:w-auto">Top up</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <article className="md:col-span-2 bg-[#101827] border border-[#24344F] rounded-2xl p-6 min-w-0">
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500 mb-3">Available</p>
          <p className="font-display text-4xl font-semibold tabular-nums text-white">{fmtUSD(balance)}</p>
          <p className="mt-2 text-sm text-zinc-500">Keep funds here for tools, or transfer them onto Deriv.</p>
        </article>
        
        <article className="bg-[#101827] border border-[#24344F] rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500 mb-3">How it works</p>
          <ol className="text-sm text-zinc-400 space-y-2 list-decimal pl-4">
            <li>Top up via the gateway</li>
            <li>Send a balance to Deriv</li>
            <li>Trade with dTrader or dBot</li>
          </ol>
        </article>
      </div>
      
      <article className="bg-[#101827] border border-[#24344F] rounded-2xl overflow-hidden min-w-0">
        <div className="px-5 py-4 border-b border-[#24344F]">
          <h3 className="font-display text-sm font-semibold text-white">Activity</h3>
        </div>
        <div className="divide-y divide-[#24344F]">
          {isLoading ? (
            <div className="px-5 py-6 text-sm text-zinc-500 text-center">Loading activity...</div>
          ) : isError ? (
            <div className="px-5 py-6 text-sm text-red-400 text-center">Failed to load activity.</div>
          ) : transactions.length === 0 ? (
            <div className="px-5 py-6 text-sm text-zinc-500 text-center">No recent activity.</div>
          ) : (
            transactions.map((tx) => {
              const amount = Math.abs(Number(tx.amount));
              const isPositive = tx.direction === "in";
              
              return (
                <div key={tx.id} className="flex items-start justify-between gap-3 px-5 py-3.5 min-w-0 hover:bg-white/[0.02] transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate text-white capitalize">{tx.description || tx.transaction_type?.replace(/_/g, ' ')}</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{formatDate(tx.created_at)}</p>
                  </div>
                  <p className={`tabular-nums text-sm shrink-0 ${isPositive ? 'text-green-400' : 'text-zinc-300'}`}>
                    {isPositive ? '+' : '-'}{fmtUSD(amount)}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </article>
    </section>
  );
}
