"use client";

import Link from "next/link";
import { type Route } from "next";
import { Play, Settings2, Download, Trash2, Cpu, Activity, DollarSign } from "lucide-react";

export default function DBotDashboardPage() {
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
          {/* Bot Card */}
          <article className="bg-surface border border-line rounded-2xl p-5 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium text-ink flex items-center gap-2">
                  Even / Odd &mdash; live
                  <span className="inline-flex items-center gap-1.5 text-[10px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                    Live
                  </span>
                </h3>
                <p className="text-xs text-ink-3 mt-1">Volatility 10 &middot; Even / Odd</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-ink-3 block">Session P/L</span>
                <span className="text-sm font-medium text-red-400">-$29.10</span>
              </div>
            </div>
            
            <div className="bg-surface-2 rounded-lg p-3 mb-6">
              <p className="text-xs text-ink-2 mb-2">267 trades</p>
              <p className="text-xs text-ink-3 truncate">Rules: Flip after a loss &middot; Same stake &middot; stake $1.00</p>
            </div>
            
            <div className="mt-auto flex gap-2">
              <Link 
                href={"/options/dbot" as Route}
                className="flex-1 flex justify-center items-center h-10 rounded-lg bg-white text-black text-sm font-medium hover:opacity-90 transition-opacity gap-2"
              >
                <Play className="w-4 h-4" /> Open
              </Link>
              <button className="h-10 px-3 flex items-center justify-center rounded-lg border border-line text-zinc-300 hover:text-white hover:bg-surface-2 transition-colors">
                <Settings2 className="w-4 h-4" />
              </button>
              <button className="h-10 px-3 flex items-center justify-center rounded-lg border border-line text-zinc-300 hover:text-white hover:bg-surface-2 transition-colors">
                <Download className="w-4 h-4" />
              </button>
              <button className="h-10 px-3 flex items-center justify-center rounded-lg border border-line text-zinc-300 hover:text-red-400 hover:bg-surface-2 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </article>
          
          {/* Another Bot Card Example */}
          <article className="bg-surface border border-line rounded-2xl p-5 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium text-ink flex items-center gap-2">
                  Martingale strategy
                </h3>
                <p className="text-xs text-ink-3 mt-1">Volatility 100 &middot; Rise / Fall</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-ink-3 block">Session P/L</span>
                <span className="text-sm font-medium text-ink">--</span>
              </div>
            </div>
            
            <div className="bg-surface-2 rounded-lg p-3 mb-6">
              <p className="text-xs text-ink-2 mb-2">0 trades</p>
              <p className="text-xs text-ink-3 truncate">Rules: Double stake after loss &middot; stake $0.50</p>
            </div>
            
            <div className="mt-auto flex gap-2">
              <Link 
                href={"/options/dbot" as Route}
                className="flex-1 flex justify-center items-center h-10 rounded-lg bg-white text-black text-sm font-medium hover:opacity-90 transition-opacity gap-2"
              >
                <Play className="w-4 h-4" /> Open
              </Link>
              <button className="h-10 px-3 flex items-center justify-center rounded-lg border border-line text-zinc-300 hover:text-white hover:bg-surface-2 transition-colors">
                <Settings2 className="w-4 h-4" />
              </button>
              <button className="h-10 px-3 flex items-center justify-center rounded-lg border border-line text-zinc-300 hover:text-white hover:bg-surface-2 transition-colors">
                <Download className="w-4 h-4" />
              </button>
              <button className="h-10 px-3 flex items-center justify-center rounded-lg border border-line text-zinc-300 hover:text-red-400 hover:bg-surface-2 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </article>
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
