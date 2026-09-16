"use client";

import React from "react";
import Link from "next/link";
import { useDerivStatus } from "@/hooks/useDerivStatus";
import { Route } from "next";

export default function VenuesPage() {
  const derivStatus = useDerivStatus();

  return (
    <section className="p-4 lg:p-8">
      <p className="mb-6 text-sm text-ink-2">Send wallet funds to Deriv. Binance and Bybit deposits come next.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0">
        <article className="bg-surface border border-line rounded-2xl p-6 lg:p-7 hover:bg-surface-2 transition-colors relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6">
            {derivStatus.linked ? (
              <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-[10px] font-medium text-green-400 ring-1 ring-inset ring-green-500/20">
                Connected
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-medium text-red-400 ring-1 ring-inset ring-red-500/20">
                Not Connected
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4 mb-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-2 text-ink font-semibold text-lg">
              D
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">Deriv</h3>
              <p className="text-xs text-ink-2 mt-1">Synthetics &middot; Options &middot; Bots</p>
            </div>
          </div>

          <p className="text-sm text-ink-2 mb-6 leading-relaxed line-clamp-2">
            Trade unique synthetic indices, digital options, and automated bots via the Deriv API.
          </p>

          <div className="flex items-center gap-3">
            <Link
              href={"/transfer" as Route}
              className="flex-1 flex justify-center items-center h-10 rounded-xl bg-ink text-surface text-sm font-semibold hover:opacity-80 transition-opacity"
            >
              Deposit
            </Link>
            <Link
              href={"/tools" as Route}
              className="flex-1 flex justify-center items-center h-10 rounded-xl border border-line bg-transparent text-ink text-sm font-medium hover:bg-surface-2 transition-colors"
            >
              Tools
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
