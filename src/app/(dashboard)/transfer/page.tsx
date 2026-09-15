"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGetWalletBalance, getGetWalletBalanceQueryKey } from "@/services/api/endpoints/wallet/wallet";
import { fmtUSD } from "@/lib/format";
import { customInstance } from "@/services/api/mutator/custom-instance";
import { useRouter } from "next/navigation";
import { useDerivListAccounts } from "@/services/api/endpoints/trading/trading";

interface TransferPayload {
  amount: number;
  currency: string;
  to_nickname: string;
}

export default function TransferPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState<number>(50);
  
  const { data: walletData } = useGetWalletBalance();
  const balance = Number(walletData?.balance || 0);

  const { data: accountsData } = useDerivListAccounts();
  const linkedAccounts = accountsData?.accounts || [];
  
  // Find the first CR account in the list of linked accounts
  const crAccount = linkedAccounts.find((acc) => acc.deriv_account_id.startsWith("CR"));
  const derivNickname = crAccount?.deriv_account_id || "";

  const transferMutation = useMutation({
    mutationFn: (payload: TransferPayload) => 
      customInstance({
        url: "/api/v1/deriv/transfer",
        method: "POST",
        data: payload
      }),
    onSuccess: () => {
      toast.success(`Successfully sent ${fmtUSD(amount)} to Deriv`);
      queryClient.invalidateQueries({ queryKey: getGetWalletBalanceQueryKey() });
      router.push("/wallet");
    },
    onError: (error: any) => {
      console.error("Transfer error status:", error.response?.status);
      console.error("Transfer error body:", error.response?.data);
      const msg = error.response?.data?.detail || error.response?.data?.error || "Transfer failed. Please try again.";
      toast.error(msg);
    }
  });

  const handleTransfer = () => {
    if (amount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    if (amount > balance) {
      toast.error("Insufficient funds in FXNOD wallet.");
      return;
    }
    if (!derivNickname || !derivNickname.startsWith("CR")) {
      toast.error("Transfers require a Real Wallet (CR account). Please connect your main CR account.");
      return;
    }

    transferMutation.mutate({
      amount: amount,
      currency: "USDT",
      to_nickname: derivNickname
    });
  };

  return (
    <section data-view="transfer" className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Transfer</h1>
          <p className="text-sm text-zinc-500 mt-1">Wallet · Deriv</p>
        </div>
      </div>
      
      {/* Top Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <article className="bg-bg border border-line rounded-2xl p-6 min-w-0" style={{ backgroundColor: "#101827", borderColor: "#24344F" }}>
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500 mb-3">FXNOD Wallet</p>
          <p className="font-display text-3xl font-semibold tabular-nums text-white">{fmtUSD(balance)}</p>
          <p className="mt-2 text-sm text-zinc-500">Available to send</p>
        </article>

        <article className="bg-bg border border-line rounded-2xl p-6 min-w-0" style={{ backgroundColor: "#101827", borderColor: "#24344F" }}>
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500 mb-3">On Deriv</p>
          <p className="font-display text-3xl font-semibold tabular-nums text-white">{fmtUSD(0)}</p>
          <p className="mt-2 text-sm text-zinc-500">Sent from this wallet</p>
        </article>

        <article className="bg-bg border border-line rounded-2xl p-6 min-w-0 flex flex-col justify-center" style={{ backgroundColor: "#101827", borderColor: "#24344F" }}>
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500 mb-3">Destination</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-bold text-lg">D</div>
            <div>
              <p className="font-medium text-white">Deriv</p>
              {derivNickname ? (
                <p className="text-xs text-green-400">Connected · {derivNickname}</p>
              ) : (
                <p className="text-xs text-red-400">No Real Wallet Found</p>
              )}
            </div>
          </div>
        </article>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <article className="bg-bg border border-line rounded-2xl p-6" style={{ backgroundColor: "#101827", borderColor: "#24344F" }}>
            <h3 className="font-display text-sm font-semibold text-white mb-4">Select Venue</h3>
            <div className="flex flex-wrap gap-3">
              <button className="flex-1 min-w-[120px] py-3 px-4 rounded-xl border border-[#3A5075] bg-[#1A263D] text-white font-medium text-sm transition-colors text-center">
                Deriv
              </button>
              <button disabled className="flex-1 min-w-[120px] py-3 px-4 rounded-xl border border-[#24344F] bg-transparent text-zinc-600 font-medium text-sm cursor-not-allowed text-center">
                Binance
              </button>
              <button disabled className="flex-1 min-w-[120px] py-3 px-4 rounded-xl border border-[#24344F] bg-transparent text-zinc-600 font-medium text-sm cursor-not-allowed text-center">
                Bybit
              </button>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-sm font-semibold text-white">Amount</h3>
                <span className="text-xs text-zinc-500">Min $10</span>
              </div>
              
              <div className="flex gap-3 mb-4">
                {[25, 50, 100].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset)}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      amount === preset 
                        ? "bg-white text-black border-white" 
                        : "bg-transparent text-zinc-400 border-[#24344F] hover:border-zinc-500"
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
                <button
                  onClick={() => setAmount(balance)}
                  className="flex-1 py-2 rounded-lg border border-[#24344F] bg-transparent text-zinc-400 text-sm font-medium hover:border-zinc-500 transition-colors"
                >
                  Max
                </button>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-12 pl-8 pr-4 rounded-xl bg-ink border border-line text-white font-medium focus:outline-none focus:border-zinc-500 transition-colors"
                  style={{ backgroundColor: "#0D1421", borderColor: "#24344F" }}
                />
              </div>
            </div>

            <button
              onClick={handleTransfer}
              disabled={transferMutation.isPending || amount <= 0}
              className="mt-8 w-full h-12 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {transferMutation.isPending ? "Processing..." : `Send ${fmtUSD(amount)} to Deriv`}
            </button>
          </article>
        </div>

        {/* Info Card */}
        <div className="space-y-6">
          <article className="bg-bg border border-line rounded-2xl p-6" style={{ backgroundColor: "#101827", borderColor: "#24344F" }}>
            <p className="text-xs uppercase tracking-[0.14em] text-zinc-500 mb-4">How it works</p>
            <ol className="text-sm text-zinc-400 space-y-4 list-decimal pl-4">
              <li>Enter the amount you wish to transfer.</li>
              <li>Funds are instantly deducted from your FXNOD Wallet.</li>
              <li>Your connected Deriv account is credited via the Payment Agent API.</li>
              <li>You can immediately begin trading with dTrader or dBot.</li>
            </ol>
            
            <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-400">
                <strong>Disclaimer:</strong> Transfers to Deriv are final and cannot be reversed. Ensure your Deriv account is fully verified.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
