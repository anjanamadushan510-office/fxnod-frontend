"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { api } from "@/services/api";
import Image from "next/image";
import { Copy, Check } from "lucide-react";

interface DepositModalProps {
  onClose: () => void;
}

export function DepositModal({ onClose }: DepositModalProps) {
  const [activeTab, setActiveTab] = useState<"manual" | "auto">("manual");
  const [amount, setAmount] = useState("100");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);

  const TRC20_ADDRESS = "TKvQGzF3YXWcnRZRMSiNZdzBts8xyvznUf";

  const handleAutoDeposit = async () => {
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
      if (err.response?.status === 401) {
        setError("Please login to your account to deposit funds.");
      } else {
        setError(err.response?.data?.detail || err.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualDeposit = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      
      if (!txHash || txHash.length < 10) {
        setError("Please enter a valid Transaction Hash (TxHash)");
        setLoading(false);
        return;
      }

      await api.post("/api/v1/wallet/deposit/manual", {
        amount: Number(amount),
        tx_hash: txHash,
      });
      
      setSuccess("Your deposit request has been submitted and is pending admin approval.");
      setTxHash("");
      
      // Close after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
      
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Please login to your account to deposit funds.");
      } else if (err.response?.status === 409) {
        setError("This Transaction Hash has already been submitted.");
      } else {
        setError(err.response?.data?.detail || err.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-xl my-auto">
        <h2 className="mb-2 text-xl font-bold text-ink">Deposit Funds</h2>
        <p className="mb-6 text-sm text-ink-2">Top up your wallet balance.</p>
        
        {/* Tabs */}
        <div className="flex mb-6 rounded-lg bg-body p-1">
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition-all ${
              activeTab === "manual" ? "bg-surface text-gold shadow-sm" : "text-ink-2 hover:text-ink"
            }`}
          >
            Manual Deposit
          </button>
          <button
            onClick={() => setActiveTab("auto")}
            className={`flex-1 rounded-md py-2 text-sm font-semibold transition-all ${
              activeTab === "auto" ? "bg-surface text-gold shadow-sm" : "text-ink-2 hover:text-ink"
            }`}
          >
            Binance Pay (Auto)
          </button>
        </div>

        {activeTab === "auto" && (
          <div className="animate-fade-in">
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
              <Button variant="gold" className="flex-1" onClick={handleAutoDeposit} disabled={loading || !amount || Number(amount) <= 0}>
                {loading ? "Processing..." : "Pay with Binance"}
              </Button>
            </div>
            <p className="mt-4 text-xs text-center text-ink-3">Automated Binance Pay deposits will be available soon.</p>
          </div>
        )}

        {activeTab === "manual" && (
          <div className="animate-fade-in">
            
            <div className="mb-4 text-center">
              <p className="text-sm text-ink-2 mb-2">Send exactly the amount below to this TRC-20 address:</p>
              <div 
                className="bg-body rounded-lg p-3 border border-line mb-4 flex items-center justify-between gap-3 cursor-pointer hover:border-gold transition-colors group"
                onClick={() => {
                  navigator.clipboard.writeText(TRC20_ADDRESS);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                <span className="font-mono text-gold text-sm font-bold break-all">{TRC20_ADDRESS}</span>
                <div className="p-2 bg-surface rounded-md text-ink-3 group-hover:text-gold transition-colors flex-shrink-0">
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </div>
              </div>
              
              <div className="flex justify-center mb-4">
                <div className="p-2 bg-white rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${TRC20_ADDRESS}`} 
                    alt="Deposit QR Code" 
                    width={150} 
                    height={150} 
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-semibold text-ink-2">Amount Sent (USDT)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-line bg-body px-4 py-3 text-lg font-bold text-ink focus:border-gold focus:outline-none"
                min="10"
              />
            </div>

            <div className="mb-6">
              <label className="mb-1 block text-sm font-semibold text-ink-2">Transaction Hash (TxHash)</label>
              <input
                type="text"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="Paste TxHash here..."
                className="w-full rounded-xl border border-line bg-body px-4 py-3 text-sm font-mono text-ink focus:border-gold focus:outline-none"
              />
            </div>
            
            {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
            {success && <p className="mb-4 text-sm text-green-500 bg-green-500/10 p-3 rounded-lg border border-green-500/20">{success}</p>}
            
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button 
                variant="gold" 
                className="flex-1" 
                onClick={handleManualDeposit} 
                disabled={loading || !txHash || txHash.length < 10 || !amount || Number(amount) <= 0 || !!success}
              >
                {loading ? "Submitting..." : "Submit Proof"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
