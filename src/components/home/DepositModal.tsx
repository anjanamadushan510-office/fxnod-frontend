"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { api } from "@/services/api";

interface DepositModalProps {
  onClose: () => void;
}

export function DepositModal({ onClose }: DepositModalProps) {
  const [amount, setAmount] = useState("100");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDeposit = async () => {
    try {
      setLoading(true);
      setError("");
      
      const res = await api.post("/api/v1/wallet/deposit/binancepay", {
        amount: Number(amount),
        currency: "USDT",
      });
      
      if (res.data?.checkout_url) {
        window.open(res.data.checkout_url, "_blank");
        onClose();
      } else {
        setError("Failed to generate payment link.");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-xl">
        <h2 className="mb-2 text-xl font-bold text-ink">Deposit Funds</h2>
        <p className="mb-6 text-sm text-ink-2">Pay securely with Binance Pay (USDT).</p>
        
        <div className="mb-4">
          <label className="mb-1 block text-sm font-semibold text-ink-2">Amount (USDT)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-xl border border-line bg-body px-4 py-3 text-lg font-bold text-ink focus:border-gold focus:outline-none"
            min="10"
            step="10"
          />
        </div>
        
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="gold" className="flex-1" onClick={handleDeposit} disabled={loading || !amount || Number(amount) <= 0}>
            {loading ? "Processing..." : "Pay with Binance"}
          </Button>
        </div>
      </div>
    </div>
  );
}
