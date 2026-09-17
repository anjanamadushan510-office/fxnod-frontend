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
    method: "Rise / Fall",
    market: "Volatility 10 Index",
    setupOption: "rise",
    duration: 5,
    logic: "always",
    stake: "1.00",
    takeProfit: "5.00",
    stopLoss: "10.00",
    moneyStrategy: "same",
    name: "Even / Odd — first bot"
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
    <div className="w-full min-h-screen bg-[#080C16] text-white flex flex-col p-4 lg:p-8">
      {/* Header */}
      <div className="w-full mb-6">
        <Link href={"/dbot" as Route} className="text-xs text-zinc-400 hover:text-white mb-4 block w-fit">
          &larr; Bots
        </Link>
        
        {/* Stepper */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {steps.map(step => {
            const isActive = currentStep === step.id;
            return (
              <button 
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`h-8 px-4 rounded-full border text-sm flex items-center gap-2 whitespace-nowrap transition bg-transparent ${
                  isActive 
                    ? "border-white text-white" 
                    : "border-line text-zinc-500 hover:text-white hover:border-zinc-500"
                }`}
              >
                <span className={
                  isActive 
                    ? "bg-white text-black h-5 w-5 rounded-full flex items-center justify-center text-xs font-semibold"
                    : "border border-line text-zinc-500 h-5 w-5 rounded-full flex items-center justify-center text-xs transition group-hover:border-zinc-500 group-hover:text-zinc-400"
                }>
                  {step.id}
                </span>
                {step.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full">
        {renderStep()}
      </div>

      {/* Bottom Navigation */}
      <div className="w-full mt-auto pt-6 border-t border-line flex items-center gap-3">
        <button 
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="h-10 px-6 rounded-lg bg-panel border border-line text-sm font-medium text-zinc-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Back
        </button>
        
        {currentStep === 6 ? (
          <Link href={"/dbot" as Route}>
            <button className="h-10 px-6 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition">
              Save bot
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
  );
}

// ----------------------------------------------------------------------
// STEP COMPONENTS
// ----------------------------------------------------------------------

function Step1Method({ config, update }: { config: BotConfig, update: Function }) {
  const methodCategories = [
    {
      name: "PRICE DIRECTION",
      methods: [
        { id: "Rise / Fall", name: "Rise / Fall", desc: "Will the price finish higher or lower than it started?" },
        { id: "Higher / Lower", name: "Higher / Lower", desc: "Will the price finish above or below a target you pick?" }
      ]
    },
    {
      name: "BARRIERS",
      methods: [
        { id: "Touch / No Touch", name: "Touch / No Touch", desc: "Will price touch a target at any moment before time is up?" },
        { id: "Ends In / Ends Out", name: "Ends In / Ends Out", desc: "Will the price finish inside or outside two targets?" }
      ]
    },
    {
      name: "LAST DIGIT",
      methods: [
        { id: "Even / Odd", name: "Even / Odd", desc: "Will the last digit of the price be even (0,2,4,6,8) or odd (1,3,5,7,9)?" },
        { id: "Over / Under", name: "Over / Under", desc: "Will the last digit be higher or lower than a number you pick?" },
        { id: "Matches", name: "Matches", desc: "Will the last digit be exactly the number you pick? Harder — larger payout." },
        { id: "Differs", name: "Differs", desc: "Will the last digit be anything except the number you pick? Easier — smaller payout." }
      ]
    },
    {
      name: "GROW / LEVERAGE",
      methods: [
        { id: "Accumulators", name: "Accumulators", desc: "Payout grows every tick the price stays inside a band. Stops if it hits the edge." },
        { id: "Multipliers", name: "Multipliers", desc: "Ride the price with a multiplier. You cannot lose more than your stake." }
      ]
    },
    {
      name: "MORE OPTIONS",
      methods: [
        { id: "Asians", name: "Asians", desc: "Win if the average price over the contract is higher (Up) or lower (Down) than the start." },
        { id: "Reset Call / Put", name: "Reset Call / Put", desc: "Like Rise/Fall, but if price hits a reset level the starting price is replaced." },
        { id: "Only Ups / Only Downs", name: "Only Ups / Only Downs", desc: "Win if every tick in the contract moves only up, or only down." },
        { id: "High Tick / Low Tick", name: "High Tick / Low Tick", desc: "Pick which tick in the series will be the highest or the lowest." },
        { id: "Turbos", name: "Turbos", desc: "Stay on your side of a barrier. Knocked out if price crosses it." },
        { id: "Vanillas", name: "Vanillas", desc: "Call or Put. Payout follows how far price finishes past the start." }
      ]
    }
  ];

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="font-display text-xl font-semibold mb-1">Trading method</h2>
      <p className="text-sm text-zinc-500 mb-8">Pick how this bot should trade. Markets come next.</p>
      
      {methodCategories.map((category, idx) => (
        <div key={idx} className="mb-8 last:mb-0">
          <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600 font-medium mb-3">{category.name}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {category.methods.map((method) => {
              const isActive = config.method === method.id;
              return (
                <article 
                  key={method.id}
                  onClick={() => update("method", method.id)}
                  className={`cursor-pointer rounded-xl p-5 border transition ${
                    isActive 
                      ? 'bg-white border-white text-black shadow-lg' 
                      : 'bg-panel border-line text-white hover:border-zinc-500'
                  }`}
                >
                  <h3 className="font-display font-semibold mb-1.5">{method.name}</h3>
                  <p className={`text-sm leading-relaxed ${isActive ? 'text-black/70' : 'text-zinc-400'}`}>
                    {method.desc}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      ))}
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
                config.market === m ? "bg-panel border-white" : "bg-panel border-line hover:border-zinc-700 text-zinc-300"
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
                config.market === m ? "bg-panel border-white" : "bg-panel border-line hover:border-zinc-700 text-zinc-300"
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
      case "Even / Odd": return [{ id: "even", label: "Even" }, { id: "odd", label: "Odd" }, { id: "both", label: "Both (Depending on logic)" }];
      case "Rise / Fall": return [{ id: "rise", label: "Rise" }, { id: "fall", label: "Fall" }, { id: "both", label: "Both (Depending on logic)" }];
      case "Higher / Lower": return [{ id: "higher", label: "Higher" }, { id: "lower", label: "Lower" }, { id: "both", label: "Both (Depending on logic)" }];
      case "Touch / No Touch": return [{ id: "touch", label: "Touch" }, { id: "no_touch", label: "No Touch" }];
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
                config.setupOption === opt.id ? "bg-panel border-white text-white" : "bg-panel border-line hover:border-zinc-700 text-zinc-300"
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
                config.duration === ticks ? "bg-panel border-white text-white" : "bg-panel border-line hover:border-zinc-700 text-zinc-300"
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
                : "bg-panel border-line hover:border-zinc-700"
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
              className="w-full h-12 bg-panel border border-line rounded-xl px-4 text-white focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Stop when profit hits ($)</label>
            <input 
              type="number" 
              value={config.takeProfit} 
              onChange={e => update("takeProfit", e.target.value)} 
              className="w-full h-12 bg-panel border border-line rounded-xl px-4 text-white focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Stop when loss hits ($)</label>
            <input 
              type="number" 
              value={config.stopLoss} 
              onChange={e => update("stopLoss", e.target.value)} 
              className="w-full h-12 bg-panel border border-line rounded-xl px-4 text-white focus:outline-none focus:border-zinc-500 transition-colors"
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
                  : "bg-panel border-line hover:border-zinc-700"
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Left Column */}
      <div className="lg:col-span-8 2xl:col-span-9 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-500">Bot name</label>
          <input 
            type="text" 
            value={config.name} 
            onChange={e => update("name", e.target.value)} 
            className="w-full h-11 px-4 rounded-lg bg-panel border border-line text-sm text-white focus:border-zinc-500 outline-none transition-colors" 
          />
        </div>

        <div className="bg-panel border border-line rounded-xl p-5">
          <h3 className="text-xs text-zinc-500 mb-2 uppercase tracking-wider font-medium">What this bot will do</h3>
          <p className="text-sm text-zinc-300 leading-relaxed">
            This bot trades <strong className="text-white font-medium">{config.market}</strong> using the <strong className="text-white font-medium capitalize">{config.method.replace('_', ' ')}</strong> method. 
            It is set to execute <strong className="text-white font-medium">{config.setupOption}</strong> contracts for a duration of <strong className="text-white font-medium">{config.duration} ticks</strong>. 
            The entry logic uses "<strong className="text-white font-medium capitalize">{config.logic.replace('_', ' ')}</strong>".
            Starting stake is <strong className="text-white font-medium">${config.stake}</strong>, applying a <strong className="text-white font-medium capitalize">{config.moneyStrategy.replace('_', ' ')}</strong> strategy after each trade, 
            running until it hits a profit of <strong className="text-white font-medium">${config.takeProfit}</strong> or a loss of <strong className="text-white font-medium">${config.stopLoss}</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-panel border border-line rounded-xl p-4">
            <span className="text-xs text-zinc-500 block mb-1 uppercase tracking-wider font-medium">Markets</span>
            <span className="text-sm font-medium text-white">{config.market}</span>
          </div>
          <div className="bg-panel border border-line rounded-xl p-4">
            <span className="text-xs text-zinc-500 block mb-1 uppercase tracking-wider font-medium">Trade type</span>
            <span className="text-sm font-medium text-white capitalize">{config.method.replace('_', ' ')} / {config.setupOption}</span>
          </div>
          <div className="bg-panel border border-line rounded-xl p-4">
            <span className="text-xs text-zinc-500 block mb-1 uppercase tracking-wider font-medium">Duration</span>
            <span className="text-sm font-medium text-white">{config.duration} ticks</span>
          </div>
          <div className="bg-panel border border-line rounded-xl p-4">
            <span className="text-xs text-zinc-500 block mb-1 uppercase tracking-wider font-medium">When to buy</span>
            <span className="text-sm font-medium text-white capitalize">{config.logic.replace('_', ' ')}</span>
          </div>
          <div className="bg-panel border border-line rounded-xl p-4 sm:col-span-2">
            <span className="text-xs text-zinc-500 block mb-1 uppercase tracking-wider font-medium">Money</span>
            <span className="text-sm font-medium text-white capitalize">{config.moneyStrategy.replace('_', ' ')} strategy starting at ${config.stake}</span>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-4 2xl:col-span-3 sticky top-4">
        <div className="bg-panel border border-line rounded-2xl p-6 h-fit sticky top-24">
          <h3 className="text-sm font-semibold text-white mb-2 tracking-wide">NEXT</h3>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">Save, then practice on a demo feed or run it live when you are ready.</p>
          
          <Link href={"/options/dbot" as Route}>
            <button className="w-full h-11 rounded-lg bg-white text-black text-sm font-medium mb-3 hover:bg-zinc-200 transition">
              Save and open
            </button>
          </Link>
          <Link href={"/dbot" as Route}>
            <button className="w-full h-11 rounded-lg border border-line text-sm text-zinc-300 hover:text-white transition">
              Save and go to list
            </button>
          </Link>
        </div>
      </div>

    </div>
  );
}
