"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";

export const mockPosts = [
  { 
    slug: 'fxnod-bot-strategies', 
    tag: 'PRODUCT', 
    date: '11 SEP 2026', 
    read: '6 MIN READ', 
    title: 'How FXNOD Bot runs strategies on Deriv', 
    excerpt: 'Create as many Deriv strategies as you need — markets, rules, stake — then run them from one terminal.',
    coverImage: 'https://images.unsplash.com/photo-1642790106117-e829e149c951?q=80&w=2940&auto=format&fit=crop',
    content: `
<h2>Running a strategy on Deriv has never been easier.</h2>
<p>With FXNOD Bot, you get a clean interface and robust execution directly from your dashboard.</p>
<h3>Getting Started</h3>
<ul>
  <li>Connect your wallet securely.</li>
  <li>Select your target market and timeframe.</li>
  <li>Configure your precise entry and exit rules.</li>
</ul>
<p><strong>Key advantage:</strong> Everything runs smoothly in a single terminal. You don't need to switch between multiple tabs or applications.</p>
<blockquote>"The unified interface changed how I approach daily strategies. It's incredibly fast." - FXNOD User</blockquote>
<h3>Advanced Rules</h3>
<p>For those who want more control, the advanced rules engine lets you define precise entry and exit conditions using a simple visual builder. You can set stop losses, take profits, and trailing stops with ease.</p>
    `
  },
  { 
    slug: 'send-wallet-funds', 
    tag: 'WALLET', 
    date: '11 SEP 2026', 
    read: '5 MIN READ', 
    title: 'Send FXNOD Wallet funds onto Deriv', 
    excerpt: 'Top up once, then transfer a balance from FXNOD onto your connected Deriv account. Binance and Bybit come next.',
    coverImage: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=2869&auto=format&fit=crop',
    content: `
<h2>Managing balances across different platforms is a hassle.</h2>
<p>The FXNOD Wallet solves this by acting as a central hub for your trading capital.</p>
<h3>How to Transfer</h3>
<p>It takes just three steps to move funds securely:</p>
<ol>
  <li>Go to the <strong>Wallet</strong> tab in your dashboard.</li>
  <li>Click <strong>Transfer</strong> and enter the amount.</li>
  <li>Select <strong>Deriv</strong> as the destination account.</li>
</ol>
<p>Transfers are processed almost instantly via internal ledgers, allowing you to react quickly to shifting market conditions.</p>
    `
  },
  { 
    slug: 'free-vs-monthly', 
    tag: 'ACCESS', 
    date: '10 SEP 2026', 
    read: '5 MIN READ', 
    title: 'Free API markup vs monthly wallet plans', 
    excerpt: 'Use tools at no monthly fee and FXNOD earns on volume — or subscribe from your wallet and trade on your own keys.',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop',
    content: `
<h2>Choosing the right plan depends on your trading volume.</h2>
<h3>Free API Markup</h3>
<p>Perfect for beginners or casual users. You pay no upfront monthly fee. Instead, a small volume markup is applied to your API trades. This aligns our success with yours.</p>
<h3>Monthly Wallet Plan</h3>
<p>If you trade frequently, the flat monthly fee is much more cost-effective. You trade on your own API keys directly, with zero additional markup from FXNOD, meaning tighter spreads and lower execution costs.</p>
<h3>Making the Choice</h3>
<p>Calculate your average monthly volume. If the markup exceeds the $29 subscription cost, it's mathematically optimal to upgrade your account!</p>
    `
  }
];

export default function BlogPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockPosts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}` as Route} className="bg-panel border border-line rounded-2xl overflow-hidden hover:border-zinc-600 transition flex flex-col group block">
                <div className="h-48 w-full bg-line overflow-hidden">
                  <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 sm:p-8 flex-1 flex flex-col">
                  <p className="text-[11px] uppercase tracking-wider text-gold mb-3">{p.tag} &middot; {p.date} &middot; {p.read}</p>
                  <h2 className="font-display text-xl font-semibold mb-2 text-ink">{p.title}</h2>
                  <p className="text-sm text-zinc-400 leading-relaxed flex-1">{p.excerpt}</p>
                </div>
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
