"use client";

import { useState } from "react";
import Link from "next/link";
import { type Route } from "next";

type BotConfig = {
  method: string;
  market: string;
  setup: { type: string };
  duration: number;
  logic: string;
  stake: string;
  takeProfit: string;
  stopLoss: string;
  maxTrades?: string;
  maxStake?: string;
  moneyStrategy: string;
  name: string;
};

export default function BotBuilderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [botConfig, setBotConfig] = useState<BotConfig>({
    method: "Rise / Fall",
    market: "Volatility 10",
    setup: { type: 'Even' },
    duration: 5,
    logic: "Always this side",
    stake: "1.00",
    takeProfit: "5.00",
    stopLoss: "10.00",
    maxTrades: "40",
    maxStake: "8",
    moneyStrategy: "Same stake",
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
      <div className="flex-1 w-full pb-20">
        {renderStep()}
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 z-20 mt-auto -mx-4 lg:-mx-8 px-4 lg:px-8 py-4 bg-[#080C16]/95 backdrop-blur border-t border-line flex items-center gap-3">
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
  const marketCategories = [
    {
      name: "BEST FOR FIRST BOTS",
      markets: [
        { id: "Volatility 10", name: "Volatility 10", desc: "Calm · 1 tick / 2s" },
        { id: "Volatility 25", name: "Volatility 25", desc: "Gentle · 1 tick / 2s" }
      ]
    },
    {
      name: "MORE MOVEMENT",
      markets: [
        { id: "Volatility 50", name: "Volatility 50", desc: "Medium · 1 tick / 2s" },
        { id: "Volatility 75", name: "Volatility 75", desc: "Active · 1 tick / 2s" },
        { id: "Volatility 100", name: "Volatility 100", desc: "Fast · 1 tick / 2s" }
      ]
    },
    {
      name: "1-SECOND",
      markets: [
        { id: "Volatility 10 (1s)", name: "Volatility 10 (1s)", desc: "Calm · 1 tick / 1s" },
        { id: "Volatility 25 (1s)", name: "Volatility 25 (1s)", desc: "Gentle · 1 tick / 1s" },
        { id: "Volatility 75 (1s)", name: "Volatility 75 (1s)", desc: "Active · 1 tick / 1s" },
        { id: "Volatility 100 (1s)", name: "Volatility 100 (1s)", desc: "Fast · 1 tick / 1s" }
      ]
    },
    {
      name: "SPIKES",
      markets: [
        { id: "Boom 500", name: "Boom 500", desc: "Sudden spikes up" },
        { id: "Crash 500", name: "Crash 500", desc: "Sudden spikes down" }
      ]
    },
    {
      name: "STEP",
      markets: [
        { id: "Step Index", name: "Step Index", desc: "Fixed 0.1 steps" }
      ]
    }
  ];

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="font-display text-xl font-semibold mb-1">Markets</h2>
      <p className="text-sm text-zinc-500 mb-8">1 selected · tap to add or remove</p>
      
      {marketCategories.map((category, idx) => (
        <div key={idx} className="mb-8 last:mb-0">
          <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600 font-medium mb-3">{category.name}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {category.markets.map((market) => {
              const isActive = config.market === market.id;
              return (
                <article 
                  key={market.id}
                  onClick={() => update("market", market.id)}
                  className={`cursor-pointer rounded-xl p-5 border transition ${
                    isActive 
                      ? 'bg-white border-white text-black shadow-lg' 
                      : 'bg-panel border-line text-white hover:border-zinc-500'
                  }`}
                >
                  <h3 className="font-display font-semibold mb-1">{market.name}</h3>
                  <p className={`text-xs ${isActive ? 'text-black/70' : 'text-zinc-500'}`}>
                    {market.desc}
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

function Step3Setup({ config, update }: { config: BotConfig, update: Function }) {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="font-display text-xl font-semibold mb-1">What should it buy?</h2>
      <p className="text-sm text-zinc-500 mb-8">Digit contracts last 1 tick — the next price's last digit decides the trade.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6">
        <article 
          onClick={() => update("setup", { ...config.setup, type: 'Even' })}
          className={`cursor-pointer rounded-xl p-5 border transition ${
            config.setup?.type === 'Even' 
              ? 'bg-white border-white text-black shadow-lg' 
              : 'bg-panel border-line text-white hover:border-zinc-500'
          }`}
        >
          <h3 className="font-display font-semibold mb-1">Even</h3>
          <p className={`text-sm ${config.setup?.type === 'Even' ? 'text-black/70' : 'text-zinc-500'}`}>
            0, 2, 4, 6 or 8
          </p>
        </article>

        <article 
          onClick={() => update("setup", { ...config.setup, type: 'Odd' })}
          className={`cursor-pointer rounded-xl p-5 border transition ${
            config.setup?.type === 'Odd' 
              ? 'bg-white border-white text-black shadow-lg' 
              : 'bg-panel border-line text-white hover:border-zinc-500'
          }`}
        >
          <h3 className="font-display font-semibold mb-1">Odd</h3>
          <p className={`text-sm ${config.setup?.type === 'Odd' ? 'text-black/70' : 'text-zinc-500'}`}>
            1, 3, 5, 7 or 9
          </p>
        </article>
      </div>

      <div className="bg-panel border border-line rounded-2xl p-5 sm:p-6 mb-10">
        <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600 font-medium mb-3">IN NUMBERS</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Close to a coin flip. A $1 win pays about $0.95 profit. Equals on Rise/Fall lose.
        </p>
      </div>
    </div>
  );
}

function Step4Logic({ config, update }: { config: BotConfig, update: Function }) {
  const logicOptions = [
    { id: "Always this side", name: "Always this side", desc: "Every contract uses the side you picked. The simplest rule." },
    { id: "Flip after a loss", name: "Flip after a loss", desc: "If a trade loses, the next one takes the other side. Popular with digit bots." },
    { id: "Copy the last tick", name: "Copy the last tick", desc: "If the last move was up / even, buy that same side again." },
    { id: "Fade the last tick", name: "Fade the last tick", desc: "If the last move was up / even, buy the other side." },
    { id: "Wait for a streak, then fade", name: "Wait for a streak, then fade", desc: "Wait until 3 ticks in a row match one side, then buy the other side." }
  ];

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="font-display text-xl font-semibold mb-1">When to buy</h2>
      <p className="text-sm text-zinc-500 mb-6">This is the only "logic" you need. The bot uses it before every contract.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6">
        {logicOptions.map((opt) => {
          const isActive = config.logic === opt.id;
          return (
            <article 
              key={opt.id}
              onClick={() => update("logic", opt.id)}
              className={`cursor-pointer rounded-xl p-5 border transition ${
                isActive 
                  ? 'bg-white border-white text-black shadow-lg' 
                  : 'bg-panel border-line text-white hover:border-zinc-500'
              }`}
            >
              <h3 className="font-display font-semibold mb-1">{opt.name}</h3>
              <p className={`text-sm leading-relaxed ${isActive ? 'text-black/70' : 'text-zinc-400'}`}>
                {opt.desc}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function Step5Money({ config, update }: { config: BotConfig, update: Function }) {
  const moneyStrategies = [
    { id: "Same stake", name: "Same stake", badge: "Recommended", desc: "Every trade uses the same amount. Safest way to start." },
    { id: "Gentle step", name: "Gentle step", badge: "Medium", desc: "Add one unit after a loss, remove one after a win." },
    { id: "Martingale", name: "Martingale", badge: "High risk", desc: "Multiply stake after a loss so one win recovers the streak. Can drain the account." },
    { id: "Reverse Martingale", name: "Reverse Martingale", badge: "High risk", desc: "Multiply stake after a win. Reset after a loss. Rides streaks, gives them back fast." }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Left Column: Inputs and Strategies */}
      <div className="lg:col-span-8 2xl:col-span-9 space-y-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs text-zinc-500 mb-1.5 block">Starting stake ($)</span>
            <input type="number" value={config.stake} onChange={e => update("stake", e.target.value)} className="w-full h-11 px-4 rounded-lg bg-panel border border-line text-sm text-white focus:border-zinc-500 outline-none transition-colors" />
          </label>
          <label className="block">
            <span className="text-xs text-zinc-500 mb-1.5 block">Stop when profit hits ($)</span>
            <input type="number" value={config.takeProfit} onChange={e => update("takeProfit", e.target.value)} className="w-full h-11 px-4 rounded-lg bg-panel border border-line text-sm text-white focus:border-zinc-500 outline-none transition-colors" />
          </label>
          <label className="block">
            <span className="text-xs text-zinc-500 mb-1.5 block">Stop when loss hits ($)</span>
            <input type="number" value={config.stopLoss} onChange={e => update("stopLoss", e.target.value)} className="w-full h-11 px-4 rounded-lg bg-panel border border-line text-sm text-white focus:border-zinc-500 outline-none transition-colors" />
          </label>
          <label className="block">
            <span className="text-xs text-zinc-500 mb-1.5 block">Max trades this run</span>
            <input type="number" value={config.maxTrades} onChange={e => update("maxTrades", e.target.value)} className="w-full h-11 px-4 rounded-lg bg-panel border border-line text-sm text-white focus:border-zinc-500 outline-none transition-colors" />
          </label>
          <label className="block">
            <span className="text-xs text-zinc-500 mb-1.5 block">Never stake more than ($)</span>
            <input type="number" value={config.maxStake} onChange={e => update("maxStake", e.target.value)} className="w-full h-11 px-4 rounded-lg bg-panel border border-line text-sm text-white focus:border-zinc-500 outline-none transition-colors" />
          </label>
        </div>

        <div>
          <p className="text-xs text-zinc-500 mb-4">After each trade</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {moneyStrategies.map((strategy) => {
              const currentStrategy = config.moneyStrategy || 'Same stake';
              const isActive = currentStrategy === strategy.id;
              return (
                <article 
                  key={strategy.id}
                  onClick={() => update("moneyStrategy", strategy.id)}
                  className={`cursor-pointer rounded-xl p-5 border transition flex flex-col ${
                    isActive 
                      ? 'bg-white border-white text-black shadow-lg' 
                      : 'bg-panel border-line text-white hover:border-zinc-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5 gap-2">
                    <h3 className="font-display font-semibold">{strategy.name}</h3>
                    <span className={`text-[10px] uppercase tracking-wider shrink-0 mt-0.5 ${isActive ? 'text-black/60' : 'text-zinc-600'}`}>
                      {strategy.badge}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed mt-auto ${isActive ? 'text-black/70' : 'text-zinc-400'}`}>
                    {strategy.desc}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Info Panel */}
      <div className="lg:col-span-4 2xl:col-span-3">
        <div className="bg-panel border border-line rounded-2xl p-5 sm:p-6 sticky top-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600 font-medium mb-3">WHY THESE CAPS</p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Take profit, stop loss and max stake are required. That is how a beginner can press Run without watching every tick.
          </p>
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
            It is set to execute <strong className="text-white font-medium">{config.setup?.type}</strong> contracts for a duration of <strong className="text-white font-medium">{config.duration} ticks</strong>. 
            The entry logic uses "<strong className="text-white font-medium">{config.logic}</strong>".
            Starting stake is <strong className="text-white font-medium">${config.stake}</strong>, applying a <strong className="text-white font-medium">{config.moneyStrategy}</strong> strategy after each trade, 
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
            <span className="text-sm font-medium text-white capitalize">{config.method.replace('_', ' ')} / {config.setup?.type}</span>
          </div>
          <div className="bg-panel border border-line rounded-xl p-4">
            <span className="text-xs text-zinc-500 block mb-1 uppercase tracking-wider font-medium">Duration</span>
            <span className="text-sm font-medium text-white">{config.duration} ticks</span>
          </div>
          <div className="bg-panel border border-line rounded-xl p-4">
            <span className="text-xs text-zinc-500 block mb-1 uppercase tracking-wider font-medium">When to buy</span>
            <span className="text-sm font-medium text-white">{config.logic}</span>
          </div>
          <div className="bg-panel border border-line rounded-xl p-4 sm:col-span-2">
            <span className="text-xs text-zinc-500 block mb-1 uppercase tracking-wider font-medium">Money</span>
            <span className="text-sm font-medium text-white">{config.moneyStrategy} strategy starting at ${config.stake}</span>
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
