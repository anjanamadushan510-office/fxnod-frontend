"use client";

import Link from "next/link";
import { type Route } from "next";

export default function ToolsPage() {
  const tools = [
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
      href: "/options/dbot",
    },
  ];

  return (
    <section className="p-4 lg:p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
        {tools.map((tool) => (
          <article 
            key={tool.id} 
            className="bg-[#101827] border border-[#24344F] rounded-2xl p-5 flex flex-col min-w-0 transition-colors hover:bg-white/[0.02]"
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <img src={tool.icon} alt={tool.name} className="h-8 w-8 object-contain bg-[#080C16] rounded-full p-1 border border-[#24344F]" />
                <div>
                  <h3 className="font-medium text-white">{tool.name}</h3>
                  <p className="text-xs text-zinc-500">{tool.subtitle}</p>
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
            
            <p className="text-sm text-zinc-400 leading-relaxed mb-4 w-full">
              {tool.description}
            </p>
            
            <div className="mt-auto flex gap-2">
              <Link 
                href={tool.href as Route} 
                className="flex-1 flex justify-center items-center h-9 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors"
              >
                Open
              </Link>
              <button 
                type="button"
                className="h-9 px-3 rounded-lg border border-[#24344F] text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Deactivate
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
