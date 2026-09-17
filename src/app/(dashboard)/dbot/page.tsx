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

  const botTemplates = [
    { title: "Even / Odd — first bot", badge: "Best start", desc: "Trades even vs odd on a calm index. Same stake. Stops at your profit or loss cap." },
    { title: "Over / Under — switch", badge: "Popular", desc: "Starts Under 7. After a loss, switches to Over 2. Same stake. Digit traders use this a lot." },
    { title: "Even / Odd — fade a streak", badge: "Simple", desc: "Waits for 3 even or 3 odd ticks, then bets the other side. Same stake." },
    { title: "Differs — last digit", badge: "High win rate", desc: "Wins if the last digit is not 5. Wins often, pays a little. Same stake." },
    { title: "Rise / Fall — follow ticks", badge: "Direction", desc: "Buys Rise if the last tick went up, Fall if it went down. 5-tick contracts." },
    { title: "Rise / Fall — Martingale", badge: "Careful", desc: "Always Rise, doubles after a loss. One win recovers the streak — a long losing run can wipe the session." },
    { title: "Touch — nearby target", badge: "Barrier", desc: "Wins if price touches a target 0.5% away within 8 ticks." },
    { title: "Accumulator — grow in a band", badge: "Grow", desc: "Payout grows ~2% each tick while price stays in a 1% band. Stops if it hits the edge." }
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
      <div className="mt-12">
          <h2 className="font-display text-xl font-semibold mb-1">Bot Templates</h2>
          <p className="text-sm text-zinc-500 mb-6">Each one is already filled in. You can change anything before you run.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {botTemplates.map((tpl, i) => (
                  <article key={i} className="bg-panel border border-line rounded-2xl p-5 surface-hover cursor-pointer transition flex flex-col">
                      <div className="flex justify-between items-start mb-3 gap-2">
                          <h3 className="font-display text-base font-semibold leading-snug">{tpl.title}</h3>
                          <span className="text-[11px] text-zinc-500 shrink-0 mt-0.5">{tpl.badge}</span>
                      </div>
                      <p className="text-sm text-zinc-400 leading-relaxed mt-auto">{tpl.desc}</p>
                  </article>
              ))}
          </div>
      </div>
    </section>
  );
}
