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
          <h1 className="font-display text-2xl font-bold text-white">Venues</h1>
          <p className="text-sm text-zinc-500 mt-1">Live APIs</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-12">
        <article className="bg-[#101827] border border-[#24344F] rounded-2xl p-6 lg:p-8 hover:bg-white/[0.02] transition-colors relative overflow-hidden group">
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
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500 font-bold text-2xl">
              D
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-white">Deriv</h3>
              <p className="text-sm text-zinc-400">Synthetics &middot; Options &middot; Bots</p>
            </div>
          </div>

          <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
            Trade unique synthetic indices, digital options, and automated bots via the Deriv API.
          </p>

          <Link
            href={"/settings" as Route}
            className="flex w-full justify-center rounded-xl bg-white/5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
          >
            Manage Connection
          </Link>
        </article>
      </div>
    </section>
  );
}
