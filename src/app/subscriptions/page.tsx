"use client";

import type { Route } from "next";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { ToolCard } from "@/components/tools/ToolCard";
import { useActiveTools } from "@/hooks/useActiveTools";

export default function SubscriptionsPage() {
  const { activeTools, setActive } = useActiveTools();

  return (
    <section data-view="subscriptions" className="p-4 lg:p-8">
      <p className="mb-6 text-sm text-ink-2">Tools you have activated. Turn one on from Discover and it shows up here.</p>

      {activeTools.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center">
          <p className="text-sm text-ink">No tools are active.</p>
          <p className="mt-1 text-sm text-ink-2">Activate a tool on the Discover page and it will be listed here.</p>
          <Link
            href={"/tools" as Route}
            className="mt-4 inline-flex h-10 items-center rounded-lg bg-ink px-5 text-sm font-medium text-surface hover:opacity-80"
          >
            Go to Discover
          </Link>
        </div>
      ) : (
        <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
          {activeTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              headerExtra={
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-green-400/10 px-2 py-1 text-xs text-green-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                  </span>
                  Active
                </span>
              }
              actions={
                <div className="flex gap-2">
                  {tool.href ? (
                    <Link
                      href={tool.href as Route}
                      className="flex h-10 flex-1 items-center justify-center rounded-lg bg-ink px-5 text-sm font-medium text-surface transition-opacity hover:opacity-80"
                    >
                      Open {tool.name}
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setActive(tool.id, false)}
                    aria-label={`Deactivate ${tool.name}`}
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-line px-3 text-sm text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Deactivate</span>
                  </button>
                </div>
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
