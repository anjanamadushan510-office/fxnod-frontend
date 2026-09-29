"use client";

import type { Route } from "next";
import Link from "next/link";
import { useActiveTools } from "@/hooks/useActiveTools";

export default function SubscriptionsPage() {
  const { activeTools } = useActiveTools();

  return (
    <section data-view="subscriptions" className="p-4 lg:p-8">
      <p className="mb-6 text-sm text-ink-2">Tools you have activated. Turn one on from Tools and it shows up here.</p>

      {activeTools.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center">
          <p className="text-sm text-ink">No tools are active.</p>
          <p className="mt-1 text-sm text-ink-2">Activate a tool on the Tools page and it will be listed here.</p>
          <Link
            href={"/tools" as Route}
            className="mt-4 inline-flex h-10 items-center rounded-lg bg-ink px-5 text-sm font-medium text-surface hover:opacity-80"
          >
            Go to Tools
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
          {activeTools.map((tool) => (
            <article
              key={tool.id}
              className="bg-surface border border-line hover:bg-surface-2 transition-colors rounded-2xl p-5 sm:p-6 flex flex-col min-w-0"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={tool.icon} alt="" className="h-10 w-10 object-contain invert dark:invert-0" />
                  <div>
                    <h2 className="text-lg font-medium text-ink">{tool.name}</h2>
                    <p className="text-xs text-ink-3">{tool.subtitle}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-md">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                  </span>
                  Active
                </span>
              </div>

              <p className="text-sm text-ink-2 leading-relaxed mb-6">{tool.description}</p>

              {tool.href ? (
                <div className="mt-auto flex">
                  <Link
                    href={tool.href as Route}
                    className="w-full h-10 px-5 flex justify-center items-center rounded-lg bg-ink text-surface text-sm font-medium hover:opacity-80 transition-opacity"
                  >
                    Open {tool.name}
                  </Link>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
