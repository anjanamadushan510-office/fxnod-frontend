"use client";

import Link from "next/link";
import { type Route } from "next";
import { Play, Settings2, Download, Trash2, Cpu, Activity, DollarSign } from "lucide-react";

export default function DBotDashboardPage() {
  const savedBots = [
    { name: "Even / Odd — live", trades: "267 trades", market: "Volatility 10 · Even / Odd", rules: "Flip after a loss · Same stake · stake $1.00", pnl: "-$29.10", isLoss: true },
    { name: "Over / Under — live", trades: "379 trades", market: "Volatility 25 · Over / Under", rules: "Flip after a loss · Same stake · stake $1.00", pnl: "-$44.44", isLoss: true },
    { name: "Test bot 1", trades: "0 trades", market: "Volatility 10 · Even / Odd", rules: "Flip after a loss · Same stake · stake $1.00", pnl: "$0.00", isLoss: false },
    { name: "Test Bot 2", trades: "0 trades", market: "Volatility 25 · Over / Under", rules: "Flip after a loss · Same stake · stake $1.00", pnl: "$0.00", isLoss: false },
    { name: "Test bot 3", trades: "0 trades", market: "Volatility 10 · Rise / Fall", rules: "Copy the last tick · Same stake · stake $1.00", pnl: "$0.00", isLoss: false },
  ];

  return (
    <section className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-ink">dBot</h1>
        <p className="text-sm text-ink-2 mt-1">Build a bot in plain language</p>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bots */}
        <article className="bg-surface border border-line rounded-2xl p-5 flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg border border-line bg-surface-2 flex items-center justify-center shrink-0">
              <Cpu className="h-5 w-5 text-ink" />
            </div>
            <div>
              <h3 className="font-medium text-ink">Bots</h3>
              <p className="text-xs text-ink-3">Saved on this device</p>
            </div>
          </div>
          <div className="mt-auto">
            <span className="text-2xl font-semibold text-ink">5</span>
          </div>
        </article>

        {/* Running */}
        <article className="bg-surface border border-line rounded-2xl p-5 flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg border border-line bg-surface-2 flex items-center justify-center shrink-0">
              <Activity className="h-5 w-5 text-ink" />
            </div>
            <div>
              <h3 className="font-medium text-ink">Running</h3>
              <p className="text-xs text-ink-3">Practice or Deriv</p>
            </div>
          </div>
          <div className="mt-auto">
            <span className="text-2xl font-semibold text-ink">0</span>
          </div>
        </article>

        {/* Session P/L */}
        <article className="bg-surface border border-line rounded-2xl p-5 flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg border border-line bg-surface-2 flex items-center justify-center shrink-0">
              <DollarSign className="h-5 w-5 text-ink" />
            </div>
            <div>
              <h3 className="font-medium text-ink">Session P/L</h3>
              <p className="text-xs text-ink-3">Across saved bots</p>
            </div>
          </div>
          <div className="mt-auto">
            <span className="text-2xl font-semibold text-red-400">-$73.54</span>
          </div>
        </article>
      </div>

      {/* Intro Panel */}
      <article className="bg-panel border border-line rounded-2xl p-10 sm:p-14 text-center">
          <img 
              src="/assets/fxnod-mark.png" 
              alt="" 
              className="mx-auto h-10 w-10 object-contain opacity-40 mb-5" 
          />
          <h3 className="font-display text-lg font-semibold mb-2">
              No Blockly. No theory.
          </h3>
          <p className="text-sm text-zinc-500 max-w-md mx-auto leading-relaxed mb-6">
              You do not need Blockly or trading theory. Pick a ready bot, read the one-line summary, then practice. Or build your own in plain language. Import a file from this computer or phone if you already have one.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button className="h-10 px-5 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 w-full sm:w-auto">
                  Create a bot
              </button>
              <button className="h-10 px-5 rounded-lg border border-line text-sm text-zinc-300 hover:text-white w-full sm:w-auto">
                  Import
              </button>
          </div>
      </article>

      {/* Running Now Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-ink">Running now</h2>
          <p className="text-sm text-ink-3">Live this session &middot; practice or Deriv.</p>
        </div>
        <div className="bg-surface border border-line rounded-2xl p-8 flex items-center justify-center text-center">
          <p className="text-sm text-ink-2">No bots running. Open a saved bot and press Practice or Run on Deriv.</p>
        </div>
      </div>

      {/* Saved Bots Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-ink">Saved bots</h2>
          <p className="text-sm text-ink-3">Created or imported on this device.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedBots.map((bot, i) => (
            <article key={i} className="bg-panel border border-line rounded-2xl p-5 surface-hover flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-display text-lg font-semibold">{bot.name}</h3>
                        <span className="text-xs text-zinc-500">{bot.trades}</span>
                    </div>
                    <p className="text-xs text-zinc-500 mb-4">{bot.market}</p>
                    <p className="text-sm text-zinc-300 mb-6">{bot.rules}</p>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs text-zinc-500">Session P/L</span>
                        <span className={`font-semibold ${bot.isLoss ? 'text-red-400' : 'text-white'}`}>{bot.pnl}</span>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex-1 h-10 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition">Open</button>
                        <button className="h-10 px-4 rounded-lg border border-line text-sm text-zinc-300 hover:text-white transition">Edit</button>
                        <button className="h-10 px-4 rounded-lg border border-line text-sm text-zinc-300 hover:text-white transition">Export</button>
                        <button className="h-10 px-4 rounded-lg border border-line text-sm text-zinc-300 hover:text-white transition">Remove</button>
                    </div>
                </div>
            </article>
          ))}
        </div>
      </div>

      {/* Bot Templates Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-ink">Bot Templates</h2>
          <p className="text-sm text-ink-3">Pre-built strategies to get started quickly.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["Martingale", "D'Alembert", "Oscar's Grind"].map((template) => (
            <div key={template} className="bg-surface border border-line rounded-2xl p-5 hover:bg-surface-2 transition-colors cursor-pointer group">
              <h3 className="font-medium text-ink mb-2">{template}</h3>
              <p className="text-xs text-ink-3 mb-4">A standard {template.toLowerCase()} progression strategy for Volatility indices.</p>
              <span className="text-xs font-medium text-white/50 group-hover:text-white transition-colors flex items-center gap-1">
                Use Template &rarr;
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
