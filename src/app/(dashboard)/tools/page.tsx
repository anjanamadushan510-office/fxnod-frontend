"use client";

import { useState } from "react";
import Link from "next/link";
import { type Route } from "next";
import { cn } from "@/lib/cn";

export default function ToolsPage() {
  const [filter, setFilter] = useState<"all" | "free" | "paid">("all");

  const freeTools = [
    {
      id: "dtrader",
      name: "dTrader",
      subtitle: "Deriv · Trade",
      description: "Trade synthetics and options on Deriv. Rise / Fall tickets from the FXNOD desk. Free — FXNOD earns a markup on the API.",
      icon: "/assets/fxnod-mark.png",
      href: "/options/dtrader",
    },
    {
      id: "dbot",
      name: "dBot",
      subtitle: "Deriv · Bot",
      description: "Build a Deriv options bot in plain language. Ready-made starts if you are new — no Blockly. Free — FXNOD earns a markup on the API.",
      icon: "/assets/fxnod-mark.png",
      href: "/dbot",
    },
  ];

  const paidTools = [
    {
      id: "bybit-flow",
      name: "Bybit flow",
      subtitle: "Bybit · Trade",
      description: "Perpetual flow tools on Bybit. Monthly from the wallet, on your own API keys.",
      icon: "/assets/fxnod-mark.png",
      price: "$19.00 / mo",
      buttonText: "Subscribe - $19.00",
    },
    {
      id: "binance-grid",
      name: "Binance grid",
      subtitle: "Binance · Bot",
      description: "Spot and futures grid on Binance. Monthly from the wallet, on your own API keys.",
      icon: "/assets/fxnod-mark.png",
      price: "$29.00 / mo",
      buttonText: "Subscribe - $29.00",
    },
  ];

  return (
    <section className="p-4 lg:p-8 space-y-8">
      <div className="flex justify-end">
        <div className="inline-flex bg-surface-2 p-1 rounded-lg border border-line">
          <button 
            onClick={() => setFilter("all")}
            className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-colors", filter === "all" ? "bg-black text-white shadow-sm dark:bg-white dark:text-black" : "text-ink-2 hover:text-ink")}
          >
            All
          </button>
          <button 
            onClick={() => setFilter("free")}
            className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-colors", filter === "free" ? "bg-black text-white shadow-sm dark:bg-white dark:text-black" : "text-ink-2 hover:text-ink")}
          >
            Free
          </button>
          <button 
            onClick={() => setFilter("paid")}
            className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-colors", filter === "paid" ? "bg-black text-white shadow-sm dark:bg-white dark:text-black" : "text-ink-2 hover:text-ink")}
          >
            Paid
          </button>
        </div>
      </div>

      {(filter === "all" || filter === "free") && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-ink tracking-wider uppercase mb-1">FREE</h2>
            <p className="text-sm text-ink-2">From FXNOD. No monthly fee — we earn a markup on the API.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
            {freeTools.map((tool) => (
              <article 
                key={tool.id} 
                className="bg-surface border border-line rounded-2xl p-5 flex flex-col min-w-0 transition-colors hover:bg-surface-2"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex shrink-0">
                      <img src={tool.icon} alt={tool.name} className="h-8 w-8 object-contain invert dark:invert-0" />
                    </div>
                    <div>
                      <h3 className="font-medium text-ink">{tool.name}</h3>
                      <p className="text-xs text-ink-3">{tool.subtitle}</p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs text-green-400">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Active
                  </div>
                </div>
                
                <p className="text-sm text-ink-2 leading-relaxed mb-4 w-full flex-1">
                  {tool.description}
                </p>
                
                <div className="mt-auto flex gap-2">
                  <Link 
                    href={tool.href as Route} 
                    className="flex-1 flex justify-center items-center h-9 rounded-lg bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-sm font-medium transition-colors"
                  >
                    Open
                  </Link>
                  <button 
                    type="button"
                    className="h-9 px-3 rounded-lg border border-line text-sm text-ink-2 hover:text-ink hover:bg-surface-2 transition-colors"
                  >
                    Deactivate
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {(filter === "all" || filter === "paid") && (
        <div className={cn("space-y-4", filter === "all" && "pt-6 border-t border-line mt-8")}>
          <div>
            <h2 className="text-sm font-bold text-ink tracking-wider uppercase mb-1">SUBSCRIPTIONS</h2>
            <p className="text-sm text-ink-2">Pay from the FXNOD Wallet. Your own venue keys, no API markup.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
            {paidTools.map((tool) => (
              <article 
                key={tool.id} 
                className="bg-surface border border-line rounded-2xl p-5 flex flex-col min-w-0 transition-colors hover:bg-surface-2"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex shrink-0">
                      <img src={tool.icon} alt={tool.name} className="h-8 w-8 object-contain invert dark:invert-0" />
                    </div>
                    <div>
                      <h3 className="font-medium text-ink">{tool.name}</h3>
                      <p className="text-xs text-ink-3">{tool.subtitle}</p>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-ink">
                    {tool.price}
                  </div>
                </div>
                
                <p className="text-sm text-ink-2 leading-relaxed mb-4 w-full flex-1">
                  {tool.description}
                </p>
                
                <div className="mt-auto flex gap-2">
                  <button 
                    className="flex-1 flex justify-center items-center h-9 rounded-lg bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-sm font-medium transition-colors"
                  >
                    {tool.buttonText}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
