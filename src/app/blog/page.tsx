"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";

export default function BlogPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const posts = [
    { slug: 'fxnod-bot-strategies', tag: 'PRODUCT', date: '11 SEP 2026', read: '6 MIN READ', title: 'How FXNOD Bot runs strategies on Deriv', excerpt: 'Create as many Deriv strategies as you need — markets, rules, stake — then run them from one terminal.' },
    { slug: 'send-wallet-funds', tag: 'WALLET', date: '11 SEP 2026', read: '5 MIN READ', title: 'Send FXNOD Wallet funds onto Deriv', excerpt: 'Top up once, then transfer a balance from FXNOD onto your connected Deriv account. Binance and Bybit come next.' },
    { slug: 'free-vs-monthly', tag: 'ACCESS', date: '10 SEP 2026', read: '5 MIN READ', title: 'Free API markup vs monthly wallet plans', excerpt: 'Use tools at no monthly fee and FXNOD earns on volume — or subscribe from your wallet and trade on your own keys.' }
  ];

  return (
    <div data-theme="dark" className="bg-bg text-ink font-sans antialiased min-h-screen flex flex-col">
      <div className="sticky top-0 z-30 bg-bg/85 backdrop-blur-md">
        <header className="site-header min-h-16 border-b border-line flex items-center justify-between gap-3 py-3 sm:py-0 sm:h-16 sm:px-8 lg:px-12">
          <Link href="/" aria-label="FXNOD home" className="shrink-0">
            <img src="/assets/fxnod-logo.png" alt="FXNOD" className="h-6 sm:h-7 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <Link href={"/#product" as Route} className="hover:text-white transition">Product</Link>
            <Link href={"/blog" as Route} className="text-white">Guides</Link>
            <Link href={"/blog" as Route} className="hover:text-white transition">Blog</Link>
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            <Link href={"/auth/login" as Route} className="hidden md:inline-flex h-9 px-4 items-center rounded-full text-sm text-zinc-300 hover:text-white transition">Log in</Link>
            <Link href={"/auth/register" as Route} className="bg-accent text-[#080C16] hidden md:inline-flex h-9 px-4 items-center rounded-full text-sm font-semibold hover:opacity-90 transition">Get started</Link>
            <button 
              type="button" 
              className="md:hidden p-2 text-zinc-400 hover:text-white"
              aria-label="Open menu" 
              aria-expanded={isMobileMenuOpen} 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 7h16M4 12h16M4 17h16"} />
              </svg>
            </button>
          </div>
        </header>
        {isMobileMenuOpen && (
          <nav className="md:hidden border-b border-line bg-panel p-4 flex flex-col gap-4 text-sm" aria-label="Mobile">
            <Link href={"/#product" as Route} onClick={() => setIsMobileMenuOpen(false)}>Product</Link>
            <Link href={"/blog" as Route} onClick={() => setIsMobileMenuOpen(false)}>Guides</Link>
            <Link href={"/blog" as Route} onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
            <hr className="border-line" />
            <Link href={"/auth/login" as Route} onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
            <Link href={"/auth/register" as Route} className="text-accent font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Get started</Link>
          </nav>
        )}
      </div>

      <main className="px-5 sm:px-8 lg:px-12 py-10 sm:py-20 flex-1">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold mb-3">Guides</p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold mb-4">How FXNOD tools work.</h1>
          <p className="text-zinc-400 max-w-xl mb-12 leading-relaxed">Official guides from FXNOD — dTrader, dBot, Wallet, and Deriv. Written here so you can find the hub, learn a tool, and open an account.</p>
          <p className="text-sm text-zinc-500 mb-8">Latest guides</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}` as Route} className="bg-panel border border-line rounded-2xl p-6 sm:p-8 hover:border-zinc-600 transition block">
                <p className="text-[11px] uppercase tracking-wider text-gold mb-3">{p.tag} &middot; {p.date} &middot; {p.read}</p>
                <h2 className="font-display text-xl font-semibold mb-2">{p.title}</h2>
                <p className="text-sm text-zinc-400 leading-relaxed">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-line px-5 sm:px-8 lg:px-12 py-8 text-[11px] text-zinc-600">
        <div className="max-w-6xl mx-auto flex justify-between">
          <span>© 2026 FXNOD</span>
          <Link href="/" className="hover:text-zinc-400 transition">Home</Link>
        </div>
      </footer>
    </div>
  );
}
