"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import type { Route } from "next";

export default function BlogPostPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const params = useParams();
  const slug = params?.slug as string;

  // Content data based on the provided HTML files
  const postsData: Record<string, { tag: string, date: string, read: string, title: string, image: string, content: React.ReactNode }> = {
    "free-vs-monthly": {
      tag: "Access",
      date: "10 Sep 2026",
      read: "5 min read",
      title: "Free API markup vs monthly wallet plans",
      image: "/assets/login-slide-3.jpg",
      content: (
        <div className="prose prose-invert max-w-none text-zinc-300">
          <p>Every FXNOD tool is either free or monthly. The terminal is the same. The difference is who owns the venue API and how FXNOD is paid.</p>
          <h2 className="text-white mt-8 mb-4 text-xl font-semibold">Free — markup on the API</h2>
          <p>You pay no monthly fee. Orders route through FXNOD’s connection to Deriv, Bybit or Binance. FXNOD earns a markup on volume. FXNOD Bot is in this group: you can build Deriv strategies without a subscription.</p>
          <h2 className="text-white mt-8 mb-4 text-xl font-semibold">Monthly — pay from the wallet, use your keys</h2>
          <p>You top up the FXNOD Wallet, subscribe, and connect your own API keys. There is no markup on that flow. The charge renews monthly from the same wallet you also use to send funds to Deriv.</p>
          <h2 className="text-white mt-8 mb-4 text-xl font-semibold">Which to pick</h2>
          <p>Start free if you want to run volume without a plan. Move to monthly when you want direct keys and a cleaner execution cost. Both sit under Tools; active ones collect in Subscriptions.</p>
          <p className="mt-6">Read next: <Link href={"/blog/fxnod-bot-strategies" as Route} className="text-accent hover:underline">How FXNOD Bot runs strategies on Deriv</Link>.</p>
        </div>
      )
    },
    "fxnod-bot-strategies": {
      tag: "Product",
      date: "11 Sep 2026",
      read: "6 min read",
      title: "How FXNOD Bot runs strategies on Deriv",
      image: "/assets/login-slide-2.jpg",
      content: (
        <div className="prose prose-invert max-w-none text-zinc-300">
          <p>FXNOD Bot is the strategy desk inside the FXNOD terminal. It is built for Deriv first: you design rules, pick a market, set a stake, and run the strategy through the Deriv API.</p>
          <h2 className="text-white mt-8 mb-4 text-xl font-semibold">What you can do</h2>
          <p>Create as many strategies as you need. Each one is yours — not a single locked session bot. That is the difference between FXNOD Bot and a one-shot “start/stop” tool.</p>
          <ul className="list-disc pl-5 my-4 space-y-2">
            <li>Choose a Deriv market (synthetics and options sit in the same venue).</li>
            <li>Set rules and stake.</li>
            <li>Run it on Deriv while FXNOD stays the control layer.</li>
          </ul>
          <h2 className="text-white mt-8 mb-4 text-xl font-semibold">How access works</h2>
          <p>FXNOD Bot is free to use. FXNOD earns a markup on the Deriv API. If you later subscribe to a monthly Deriv tool, you can switch to your own keys and drop the markup.</p>
          <h2 className="text-white mt-8 mb-4 text-xl font-semibold">Where it lives</h2>
          <p>Open the terminal, go to Tools, activate FXNOD Bot, then open it from Subscriptions. The workspace is empty until you add a strategy — that editor is the next layer of the product.</p>
          <p className="mt-6">For wallet funding onto Deriv, see <Link href={"/blog/send-wallet-funds" as Route} className="text-accent hover:underline">Send FXNOD Wallet funds onto Deriv</Link>.</p>
        </div>
      )
    },
    "send-wallet-funds": {
      tag: "Wallet",
      date: "11 Sep 2026",
      read: "5 min read",
      title: "Send FXNOD Wallet funds onto Deriv",
      image: "/assets/login-slide-1.jpg",
      content: (
        <div className="prose prose-invert max-w-none text-zinc-300">
          <p>The FXNOD Wallet is not only for paying monthly tools. Transfer lets you move a balance from FXNOD onto a trading venue. Deriv is the first live destination.</p>
          <h2 className="text-white mt-8 mb-4 text-xl font-semibold">The flow</h2>
          <ul className="list-disc pl-5 my-4 space-y-2">
            <li>Top up the FXNOD Wallet through the payment gateway.</li>
            <li>Open Transfer, keep Deriv selected.</li>
            <li>Choose $25, $50, $100, Max, or a custom amount.</li>
            <li>Confirm. The wallet debit is recorded and the Deriv balance on this account goes up.</li>
          </ul>
          <h2 className="text-white mt-8 mb-4 text-xl font-semibold">If the wallet is short</h2>
          <p>The send button becomes a top-up prompt. Fund the wallet first, then send. Activity shows as “Transfer · Deriv” next to ordinary top-ups and subscriptions.</p>
          <h2 className="text-white mt-8 mb-4 text-xl font-semibold">What is live vs next</h2>
          <p>Deriv is live. Binance and Bybit show as soon on the Transfer page. The same wallet will route to those venues when those rails are on.</p>
          <p>This demo stores the debit and the Deriv credit on your device. A production payout would hit the connected Deriv account through FXNOD’s venue integration.</p>
        </div>
      )
    }
  };

  const post = postsData[slug];

  if (!post) {
    notFound();
  }

  return (
    <div data-theme="dark" className="bg-bg text-ink font-sans antialiased min-h-screen flex flex-col">
      <div className="sticky top-0 z-30 bg-bg/85 backdrop-blur-md">
        <header className="site-header min-h-16 border-b border-line flex items-center justify-between gap-3 py-3 sm:py-0 sm:h-16 sm:px-8 lg:px-12">
          <Link href="/" aria-label="FXNOD home" className="shrink-0">
            <img src="/assets/fxnod-logo.png" alt="FXNOD" className="h-6 sm:h-7 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <Link href={"/blog" as Route} className="text-white">Guides</Link>
          </nav>
          <div className="flex items-center gap-2 shrink-0">
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
            <Link href={"/blog" as Route} onClick={() => setIsMobileMenuOpen(false)}>Guides</Link>
            <hr className="border-line" />
            <Link href={"/auth/register" as Route} className="text-accent font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Get started</Link>
          </nav>
        )}
      </div>

      <main className="px-5 sm:px-8 lg:px-12 py-10 sm:py-14 flex-1">
        <article className="max-w-2xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold mb-4">{post.tag} &middot; {post.date} &middot; {post.read}</p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight mb-8">{post.title}</h1>
          <div className="relative rounded-2xl overflow-hidden border border-line mb-10 h-56 sm:h-72">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
          {post.content}
          <p className="mt-12">
            <Link href={"/blog" as Route} className="text-sm text-accent hover:underline">← All guides</Link>
          </p>
        </article>
      </main>

      <footer className="border-t border-line px-5 py-8 text-[11px] text-zinc-600 text-center">
        © 2026 FXNOD
      </footer>
    </div>
  );
}
