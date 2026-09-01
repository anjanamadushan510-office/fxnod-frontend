"use client";

import { Cpu, ArrowRight } from "lucide-react";

export default function SubscriptionsPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-[#0a0f1c] tracking-tight">Your Subscriptions</h1>
        <p className="mt-2 text-[#0a0f1c]/60 font-medium">Manage your platform add-ons and automated trading bots.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* dBot Subscriptions Card */}
        <div className="group relative flex flex-col overflow-hidden rounded-3xl bg-white p-8 shadow-md border border-[#c9a24e]/20 transition-all hover:shadow-xl hover:shadow-[#c9a24e]/10 hover:-translate-y-1 duration-300">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#c9a24e]/10 blur-3xl transition-all group-hover:scale-150 group-hover:bg-[#c9a24e]/20 z-0"></div>
          
          <div className="relative z-10 mb-8 flex items-start justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,var(--navy)_0%,var(--navy-2)_100%)] shadow-lg shadow-[#0a0f1c]/20 group-hover:scale-110 transition-transform duration-300">
              <Cpu className="h-7 w-7 text-[#c9a24e]" />
            </div>
            {/* Optional badge */}
            <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 border border-green-200 shadow-sm">
              Available
            </span>
          </div>
          
          <div className="relative z-10 flex-1">
            <h2 className="text-2xl font-bold text-[#0a0f1c]">dBot Subscriptions</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#0a0f1c]/70 font-medium">
              Automate your trading with our powerful dBot platform. Access pre-built strategies or create your own custom automated rules.
            </p>
          </div>
          
          <div className="relative z-10 mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#c9a24e] to-[#d6b56b] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#c9a24e]/30 transition-all hover:shadow-[#c9a24e]/50 hover:brightness-110 active:scale-95">
              Access dBot
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
