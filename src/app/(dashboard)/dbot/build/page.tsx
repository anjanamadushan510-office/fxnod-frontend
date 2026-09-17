"use client";

import { useState } from "react";
import Link from "next/link";
import { type Route } from "next";

type BotConfig = {
  method: string;
  market: string;
  setupOption: string;
  duration: number;
  logic: string;
  stake: string;
  takeProfit: string;
  stopLoss: string;
  moneyStrategy: string;
  name: string;
};

export default function BotBuilderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [botConfig, setBotConfig] = useState<BotConfig>({
    method: "rise_fall",
    market: "Volatility 10 Index",
    setupOption: "rise",
    duration: 5,
    logic: "always",
    stake: "1.00",
    takeProfit: "5.00",
    stopLoss: "10.00",
    moneyStrategy: "same",
    name: "My new bot"
  });

  const steps = [
    { id: 1, label: "Method" },
    { id: 2, label: "Markets" },
    { id: 3, label: "Setup" },
    { id: 4, label: "When to buy" },
    { id: 5, label: "Money" },
    { id: 6, label: "Review" },
  ];

  const updateConfig = (key: keyof BotConfig, value: string | number) => {
    setBotConfig(prev => ({ ...prev, [key]: value }));
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Step 1 - trading method";
      case 2: return "Step 2 - choose market";
      case 3: return "Step 3 - setup trade";
      case 4: return "Step 4 - when to buy";
      case 5: return "Step 5 - money management";
      case 6: return "Step 6 - review and save";
      default: return "";
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Method config={botConfig} update={updateConfig} />;
      case 2: return <Step2Markets config={botConfig} update={updateConfig} />;
      case 3: return <Step3Setup config={botConfig} update={updateConfig} />;
      case 4: return <Step4Logic config={botConfig} update={updateConfig} />;
      case 5: return <Step5Money config={botConfig} update={updateConfig} />;
      case 6: return <Step6Review config={botConfig} update={updateConfig} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] pb-24 bg-ink">
      {/* Header */}
      <div className="p-4 lg:p-8 border-b border-line bg-ink sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4 mb-6">
          <Link href={"/dbot" as Route} className="text-sm font-medium text-zinc-400 hover:text-white transition">
            &larr; Back to Bots
          </Link>
        </div>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold text-white mb-2">Create a bot</h1>
          <p className="text-sm text-zinc-400 capitalize">{getStepTitle()}</p>
        </div>
        
        {/* Stepper */}
        <div className="max-w-4xl mx-auto mt-8 flex flex-wrap gap-2">
          {steps.map(step => (
            <button 
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`h-9 px-4 rounded-full text-sm font-medium border transition-colors flex items-center gap-2 ${
                currentStep === step.id 
                  ? "border-white text-white bg-white/5" 
                  : "border-line text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
              }`}
            >
              <span>{step.id}</span>
              {step.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-8 max-w-4xl mx-auto w-full">
        {renderStep()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 lg:left-[240px] right-0 border-t border-line bg-ink p-4 flex justify-between items-center z-20">
        <div className="max-w-4xl mx-auto w-full flex justify-between">
          <button 
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="h-10 px-6 rounded-lg text-sm font-medium text-zinc-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Back
          </button>
          
          {currentStep === 6 ? (
            <Link href={"/dbot" as Route}>
              <button className="h-10 px-6 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition">
                Save and open
              </button>
            </Link>
          ) : (
            <button 
              onClick={() => setCurrentStep(prev => Math.min(6, prev + 1))}
              className="h-10 px-6 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// STEP COMPONENTS
// ----------------------------------------------------------------------

function Step1Method({ config, update }: { config: BotConfig, update: Function }) {
  const methods = [
    { id: "rise_fall", label: "Rise / Fall", desc: "Predict if the market will end higher or lower than its current level." },
    { id: "higher_lower", label: "Higher / Lower", desc: "Predict if the market will end higher or lower than a price target." },
    { id: "touch_no_touch", label: "Touch / No Touch", desc: "Predict if the market will touch a target price before it ends." },
    { id: "even_odd", label: "Even / Odd", desc: "Predict if the last digit of the final price will be an even or odd number." },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-xl font-medium text-white mb-6">What trading method do you want to use?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {methods.map(m => (
          <article 
            key={m.id}
            onClick={() => update("method", m.id)}
            className={`cursor-pointer p-6 rounded-2xl border transition-all ${
              config.method === m.id 
                ? "bg-panel border-white shadow-lg" 
                : "bg-surface border-line hover:border-zinc-700"
            }`}
          >
            <h3 className="font-medium text-white mb-2">{m.label}</h3>
            <p className="text-sm text-zinc-400">{m.desc}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function Step2Markets({ config, update }: { config: BotConfig, update: Function }) {
  const beginner = ["Volatility 10 Index", "Volatility 25 Index"];
  const advanced = ["Volatility 50 Index", "Volatility 75 Index", "Volatility 100 Index"];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-xl font-medium text-white mb-6">Choose a market to trade on</h2>
      
      <div>
        <h3 className="text-sm font-medium text-zinc-500 mb-4 uppercase tracking-wider">Best for first bots</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {beginner.map(m => (
            <button
              key={m}
              onClick={() => update("market", m)}
              className={`p-4 rounded-xl border text-left transition-all ${
                config.market === m ? "bg-panel border-white" : "bg-surface border-line hover:border-zinc-700 text-zinc-300"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-zinc-500 mb-4 uppercase tracking-wider">More movement</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {advanced.map(m => (
            <button
              key={m}
              onClick={() => update("market", m)}
              className={`p-4 rounded-xl border text-left transition-all ${
                config.market === m ? "bg-panel border-white" : "bg-surface border-line hover:border-zinc-700 text-zinc-300"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step3Setup({ config, update }: { config: BotConfig, update: Function }) {
  const getSetupOptions = () => {
    switch (config.method) {
      case "even_odd": return [{ id: "even", label: "Even" }, { id: "odd", label: "Odd" }, { id: "both", label: "Both (Depending on logic)" }];
      case "rise_fall": return [{ id: "rise", label: "Rise" }, { id: "fall", label: "Fall" }, { id: "both", label: "Both (Depending on logic)" }];
      case "higher_lower": return [{ id: "higher", label: "Higher" }, { id: "lower", label: "Lower" }, { id: "both", label: "Both (Depending on logic)" }];
      case "touch_no_touch": return [{ id: "touch", label: "Touch" }, { id: "no_touch", label: "No Touch" }];
      default: return [{ id: "rise", label: "Rise" }, { id: "fall", label: "Fall" }];
    }
  };

  const durations = [1, 2, 3, 5, 8, 10];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div>
        <h2 className="text-xl font-medium text-white mb-6">What should it buy?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {getSetupOptions().map(opt => (
            <button
              key={opt.id}
              onClick={() => update("setupOption", opt.id)}
              className={`p-4 rounded-xl border text-center transition-all ${
                config.setupOption === opt.id ? "bg-panel border-white text-white" : "bg-surface border-line hover:border-zinc-700 text-zinc-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-medium text-white mb-6">Trade duration (ticks)</h2>
        <div className="flex flex-wrap gap-3">
          {durations.map(ticks => (
            <button
              key={ticks}
              onClick={() => update("duration", ticks)}
              className={`h-12 w-16 rounded-xl border font-medium transition-all ${
                config.duration === ticks ? "bg-panel border-white text-white" : "bg-surface border-line hover:border-zinc-700 text-zinc-300"
              }`}
            >
              {ticks}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step4Logic({ config, update }: { config: BotConfig, update: Function }) {
  const logicOptions = [
    { id: "always", label: "Always this side", desc: `Always buys the selected side in Step 3.` },
    { id: "copy_tick", label: "Copy the last tick", desc: "Buys Rise if the last tick was up, Fall if it was down." },
    { id: "wait_fade", label: "Wait for a streak, then fade", desc: "Waits for 3 consecutive ticks in one direction, then buys the opposite." },
    { id: "flip_loss", label: "Flip after a loss", desc: "Buys the opposite side on the next trade if the previous one was a loss." },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-xl font-medium text-white mb-6">When to buy</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {logicOptions.map(logic => (
          <article 
            key={logic.id}
            onClick={() => update("logic", logic.id)}
            className={`cursor-pointer p-6 rounded-2xl border transition-all ${
              config.logic === logic.id 
                ? "bg-panel border-white shadow-lg" 
                : "bg-surface border-line hover:border-zinc-700"
            }`}
          >
            <h3 className="font-medium text-white mb-2">{logic.label}</h3>
            <p className="text-sm text-zinc-400">{logic.desc}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function Step5Money({ config, update }: { config: BotConfig, update: Function }) {
  const strategies = [
    { id: "same", label: "Same stake", desc: "Keeps the stake the same after every trade." },
    { id: "gentle", label: "Gentle step", desc: "Increases the stake slightly after a loss to recover slowly." },
    { id: "martingale", label: "Martingale", desc: "Doubles the stake after a loss. High risk." },
    { id: "rev_martingale", label: "Reverse Martingale", desc: "Doubles the stake after a win. Good for streaks." },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div>
        <h2 className="text-xl font-medium text-white mb-6">Limits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Starting stake ($)</label>
            <input 
              type="number" 
              value={config.stake} 
              onChange={e => update("stake", e.target.value)} 
              className="w-full h-12 bg-surface border border-line rounded-xl px-4 text-white focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Stop when profit hits ($)</label>
            <input 
              type="number" 
              value={config.takeProfit} 
              onChange={e => update("takeProfit", e.target.value)} 
              className="w-full h-12 bg-surface border border-line rounded-xl px-4 text-white focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Stop when loss hits ($)</label>
            <input 
              type="number" 
              value={config.stopLoss} 
              onChange={e => update("stopLoss", e.target.value)} 
              className="w-full h-12 bg-surface border border-line rounded-xl px-4 text-white focus:outline-none focus:border-white transition-colors"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-medium text-white mb-6">After each trade</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {strategies.map(s => (
            <article 
              key={s.id}
              onClick={() => update("moneyStrategy", s.id)}
              className={`cursor-pointer p-6 rounded-2xl border transition-all ${
                config.moneyStrategy === s.id 
                  ? "bg-panel border-white shadow-lg" 
                  : "bg-surface border-line hover:border-zinc-700"
              }`}
            >
              <h3 className="font-medium text-white mb-2">{s.label}</h3>
              <p className="text-sm text-zinc-400">{s.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step6Review({ config, update }: { config: BotConfig, update: Function }) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div>
        <h2 className="text-xl font-medium text-white mb-6">Name your bot</h2>
        <input 
          type="text" 
          value={config.name} 
          onChange={e => update("name", e.target.value)} 
          className="w-full max-w-md h-12 bg-surface border border-line rounded-xl px-4 text-white focus:outline-none focus:border-white transition-colors"
        />
      </div>

      <div>
        <h2 className="text-xl font-medium text-white mb-6">Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-surface border border-line rounded-xl p-5">
            <span className="text-xs text-zinc-500 block mb-1">Market</span>
            <span className="text-sm font-medium text-white">{config.market}</span>
          </div>
          <div className="bg-surface border border-line rounded-xl p-5">
            <span className="text-xs text-zinc-500 block mb-1">Method</span>
            <span className="text-sm font-medium text-white capitalize">{config.method.replace('_', ' ')}</span>
          </div>
          <div className="bg-surface border border-line rounded-xl p-5">
            <span className="text-xs text-zinc-500 block mb-1">Duration</span>
            <span className="text-sm font-medium text-white">{config.duration} ticks</span>
          </div>
          <div className="bg-surface border border-line rounded-xl p-5">
            <span className="text-xs text-zinc-500 block mb-1">Logic</span>
            <span className="text-sm font-medium text-white capitalize">{config.logic.replace('_', ' ')}</span>
          </div>
          <div className="bg-surface border border-line rounded-xl p-5">
            <span className="text-xs text-zinc-500 block mb-1">Money Strategy</span>
            <span className="text-sm font-medium text-white capitalize">{config.moneyStrategy.replace('_', ' ')}</span>
          </div>
          <div className="bg-surface border border-line rounded-xl p-5">
            <span className="text-xs text-zinc-500 block mb-1">Stake / Limits</span>
            <span className="text-sm font-medium text-white">${config.stake} (TP: ${config.takeProfit}, SL: ${config.stopLoss})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
