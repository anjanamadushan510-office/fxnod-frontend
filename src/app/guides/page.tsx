"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";

  const posts = [
    { slug: 'fxnod-bot-strategies', tag: 'PRODUCT', date: '11 SEP 2026', read: '6 MIN READ', title: 'How FXNOD Bot runs strategies on Deriv', excerpt: 'Create as many Deriv strategies as you need — markets, rules, stake — then run them from one terminal.' },
    { slug: 'send-wallet-funds', tag: 'WALLET', date: '11 SEP 2026', read: '5 MIN READ', title: 'Send FXNOD Wallet funds onto Deriv', excerpt: 'Top up once, then transfer a balance from FXNOD onto your connected Deriv account. Binance and Bybit come next.' },
    { slug: 'free-vs-monthly', tag: 'ACCESS', date: '10 SEP 2026', read: '5 MIN READ', title: 'Free API markup vs monthly wallet plans', excerpt: 'Use tools at no monthly fee and FXNOD earns on volume — or subscribe from your wallet and trade on your own keys.' }
  ];

export default function GuidesPage() {
  return (
    <div data-theme="dark" className="bg-bg text-ink font-sans antialiased min-h-screen flex flex-col">
      <PublicHeader />

      <main className="px-5 sm:px-8 lg:px-12 py-10 sm:py-20 flex-1">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold mb-3">Guides</p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold mb-4">How FXNOD tools work.</h1>
          <p className="text-zinc-400 max-w-xl mb-12 leading-relaxed">Official guides from FXNOD — dTrader, dBot, Wallet, and Deriv. Written here so you can find the hub, learn a tool, and open an account.</p>
          <p className="text-sm text-zinc-500 mb-8">Latest guides</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((p) => (
              <Link key={p.slug} href={`/guides/${p.slug}` as Route} className="bg-panel border border-line rounded-2xl p-6 sm:p-8 hover:border-zinc-600 transition block">
                <p className="text-[11px] uppercase tracking-wider text-gold mb-3">{p.tag} &middot; {p.date} &middot; {p.read}</p>
                <h2 className="font-display text-xl font-semibold mb-2">{p.title}</h2>
                <p className="text-sm text-zinc-400 leading-relaxed">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="px-5 sm:px-8 lg:px-12 py-8 border-t border-line mt-20 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500">
        <p>&copy; {new Date().getFullYear()} FXNOD. All rights reserved.</p>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <Link href={"/#product" as Route} className="hover:text-white transition">Product</Link>
          <Link href={"/guides" as Route} className="hover:text-white transition">Guides</Link>
          <Link href={"/blog" as Route} className="hover:text-white transition">Blog</Link>
        </div>
      </footer>
    </div>
  );
}
