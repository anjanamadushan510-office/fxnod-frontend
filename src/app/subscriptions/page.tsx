"use client";

import type { Route } from "next";
import Link from "next/link";
import { Cpu } from "lucide-react";

export default function SubscriptionsPage() {
  return (
    <section data-view="subscriptions" className="p-4 lg:p-8 space-y-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Your Subscriptions</h1>
        <p className="mt-2 text-sm text-ink-2">Manage your platform add-ons and automated trading bots.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
        {/* dBot Subscriptions Card */}
        <article className="bg-surface border border-line hover:bg-surface-2 transition-colors rounded-2xl p-5 sm:p-6 flex flex-col min-w-0">
          <div className="mb-4 flex items-start justify-between">
            <div className="h-10 w-10 rounded-lg border border-line bg-surface-2 flex items-center justify-center shrink-0">
              <Cpu className="h-5 w-5 text-ink" />
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
              </span>
              Available
            </span>
          </div>
          
          <h2 className="text-lg font-medium text-ink mb-2">dBot Subscriptions</h2>
          <p className="text-sm text-ink-2 leading-relaxed mb-6">
            Automate your trading with our powerful dBot platform. Access pre-built strategies or create your own custom automated rules.
          </p>
          
          <div className="mt-auto flex">
            <Link
              href={"/options/dbot/subscription" as Route}
              className="w-full sm:w-auto h-10 px-5 flex justify-center items-center rounded-lg bg-ink text-surface text-sm font-medium hover:opacity-80 transition-opacity"
            >
              View dBot plans
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
