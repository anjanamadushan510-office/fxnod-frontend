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
            className="bg-surface border border-line rounded-2xl p-5 flex flex-col min-w-0 transition-colors hover:bg-surface-2"
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 border border-line shrink-0">
                  <img src={tool.icon} alt={tool.name} className="h-5 w-5 object-contain invert dark:invert-0" />
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
            
            <p className="text-sm text-ink-2 leading-relaxed mb-4 w-full">
              {tool.description}
            </p>
            
            <div className="mt-auto flex gap-2">
              <Link 
                href={tool.href as Route} 
                className="flex-1 flex justify-center items-center h-9 rounded-lg bg-ink text-surface text-sm font-medium hover:opacity-80 transition-opacity"
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
    </section>
  );
}
