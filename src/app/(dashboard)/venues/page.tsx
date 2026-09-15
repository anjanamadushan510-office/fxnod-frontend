"use client";

import React from "react";
import Link from "next/link";
import { useDerivStatus } from "@/hooks/useDerivStatus";
import { Route } from "next";

export default function VenuesPage() {
  const derivStatus = useDerivStatus();

  return (
    <section className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Venues</h1>
          <p className="text-sm text-ink-3 mt-1">Live APIs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500 font-bold text-2xl">
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
              className="flex-1 flex justify-center rounded-xl bg-white text-surface py-2.5 text-sm font-semibold hover:opacity-80 transition-opacity transition-colors"
            >
              Deposit
            </Link>
            <Link
              href={"/tools" as Route}
              className="flex-1 flex justify-center rounded-xl border border-line bg-transparent text-ink py-2.5 text-sm font-medium hover:bg-surface-2 transition-colors"
            >
              Tools
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
