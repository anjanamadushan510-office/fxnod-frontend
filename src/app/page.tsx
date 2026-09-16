"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Route } from "next";

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsVisible(false); // scrolling down
      } else {
        setIsVisible(true);  // scrolling up
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const posts = [
    {
      slug: "fxnod-bot-strategies",
      tag: "PRODUCT",
      date: "11 SEP 2026",
      title: "How FXNOD Bot runs strategies on Deriv",
      excerpt: "Create as many Deriv strategies as you need — markets, rules, stake — then run them from one terminal.",
    },
    {
      slug: "send-wallet-funds",
      tag: "WALLET",
      date: "11 SEP 2026",
      title: "Send FXNOD Wallet funds onto Deriv",
      excerpt: "Top up once, then transfer a balance from FXNOD onto your connected Deriv account. Binance and Bybit come next.",
    },
    {
      slug: "free-api-vs-monthly",
      tag: "ACCESS",
      date: "10 SEP 2026",
      title: "Free API markup vs monthly wallet plans",
      excerpt: "Use tools at no monthly fee and FXNOD earns on volume — or subscribe from your wallet and trade on your own keys.",
    }
  ];

  return (
    <div className="bg-bg text-ink font-sans antialiased min-h-screen">
      <a className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-ink focus:z-50" href="#main">Skip to content</a>

      <div className={`landing-header fixed top-0 left-0 right-0 w-full z-50 bg-bg/50 backdrop-blur-md transition-transform duration-300 ease-in-out ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <header className="site-header w-full flex items-center justify-between gap-3 py-3 sm:py-0 sm:h-16 sm:px-8 lg:px-12">
          <Link href="/" aria-label="FXNOD home" className="shrink-0">
            <img src="/assets/fxnod-logo.png" alt="FXNOD" className="h-6 sm:h-7 w-auto" width="140" height="28" />
          </Link>
          <nav aria-label="Primary" className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <a href="#product" className="hover:text-white transition">Product</a>
            <a href="#venues" className="hover:text-white transition">Venues</a>
            <a href="#access" className="hover:text-white transition">Access</a>
            <Link href={"/blog" as Route} className="hover:text-white transition">Guides</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link href={"/auth/login" as Route} className="hidden md:inline-flex h-9 px-3 sm:px-4 items-center rounded-full text-sm text-zinc-300 hover:text-white transition">Log in</Link>
            <Link href={"/auth/register" as Route} className="bg-accent text-[#080C16] hidden md:inline-flex h-9 px-4 items-center rounded-full text-sm font-semibold hover:opacity-90 transition">Get started</Link>
            <button 
              type="button" 
              className="md:hidden p-2 text-zinc-400 hover:text-white"
              aria-label="Open menu" 
              aria-expanded={isMobileMenuOpen} 
              aria-controls="site-nav"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 7h16M4 12h16M4 17h16"} />
              </svg>
            </button>
          </div>
        </header>
        {isMobileMenuOpen && (
          <nav id="site-nav" className="md:hidden border-b border-line bg-panel p-4 flex flex-col gap-4 text-sm" aria-label="Mobile">
            <a href="#product" onClick={() => setIsMobileMenuOpen(false)}>Product</a>
            <a href="#venues" onClick={() => setIsMobileMenuOpen(false)}>Venues</a>
            <a href="#access" onClick={() => setIsMobileMenuOpen(false)}>Access</a>
            <Link href={"/blog" as Route} onClick={() => setIsMobileMenuOpen(false)}>Guides</Link>
            <hr className="border-line" />
            <Link href={"/auth/login" as Route} onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
            <Link href={"/auth/register" as Route} className="text-accent font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Get started</Link>
          </nav>
        )}
      </div>

      <main id="main">
        <section className="px-5 sm:px-8 lg:px-12 pt-36 sm:pt-48 pb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-[2.15rem] sm:text-5xl lg:text-7xl font-semibold tracking-tight leading-[1.08] mb-6">Trade, fund, and run.<br className="hidden sm:block" /> All in one hub.</h1>
            <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8">Access the trading terminal built for Deriv, Bybit and Binance — with FXNOD Bot, a wallet, and venue tools in one place.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
              <Link href={"/auth/register" as Route} className="bg-accent text-[#080C16] hover:opacity-90 transition h-12 px-8 inline-flex items-center justify-center rounded-full text-sm font-semibold w-full sm:w-auto">Get started</Link>
              <Link href={"/auth/login" as Route} className="h-12 px-8 inline-flex items-center justify-center rounded-full border border-line text-sm text-zinc-300 hover:text-white hover:border-zinc-500 transition w-full sm:w-auto">Log in</Link>
            </div>
          </div>
        </section>

        <section className="px-5 sm:px-8 lg:px-12 pb-16">
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-3xl min-h-[280px] sm:min-h-[420px] lg:min-h-[520px] border border-line">
            <img src="/assets/login-slide-1.jpg" alt="FXNOD brand photography — dark chrome rods in a black void" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-bg/40"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-36 w-36 sm:h-48 sm:w-48 rounded-full bg-bg/40 backdrop-blur-md border border-gold/20 flex items-center justify-center shadow-2xl">
                <img src="/assets/fxnod-mark.png" alt="FXNOD mark" className="h-20 w-20 sm:h-28 sm:w-28 object-contain invert dark:invert-0" />
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 sm:px-8 lg:px-12 pb-20" aria-label="Highlights">
          <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 border-y border-line py-8">
            <div>
              <p className="text-xs text-zinc-500 mb-1">Venues</p>
              <p className="font-display text-2xl sm:text-3xl font-semibold">3</p>
              <p className="text-xs text-zinc-500 mt-1">Deriv &middot; Bybit &middot; Binance</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Deriv</p>
              <p className="font-display text-2xl sm:text-3xl font-semibold">Live</p>
              <p className="text-xs text-zinc-500 mt-1">Bots and wallet transfer</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Access</p>
              <p className="font-display text-2xl sm:text-3xl font-semibold">Free</p>
              <p className="text-xs text-zinc-500 mt-1">Or monthly from wallet</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Wallet</p>
              <p className="font-display text-2xl sm:text-3xl font-semibold text-gold">On-venue</p>
              <p className="text-xs text-zinc-500 mt-1">Send funds to Deriv</p>
            </div>
          </div>
        </section>

        <section id="product" className="px-5 sm:px-8 lg:px-12 pb-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-3 max-w-2xl">Build from a single terminal, designed for the trader who runs their own book.</h2>
            <p className="text-zinc-400 max-w-xl mb-10 leading-relaxed">Bot, wallet, and venue tools — without hopping between platforms.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href={"/auth/register" as Route} className="group bg-panel border border-line rounded-3xl overflow-hidden hover:border-zinc-600 transition block">
                <div className="relative h-48 overflow-hidden">
                  <img src="/assets/login-slide-2.jpg" alt="" className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold mb-2">FXNOD Bot</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">Create as many Deriv strategies as you need. Markets, rules, stake — then run.</p>
                </div>
              </Link>
              <Link href={"/auth/register" as Route} className="group bg-panel border border-line rounded-3xl overflow-hidden hover:border-zinc-600 transition block">
                <div className="relative h-48 overflow-hidden">
                  <img src="/assets/login-slide-1.jpg" alt="" className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold mb-2">Wallet</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">Top up, pay for monthly tools, or send a balance onto your Deriv account.</p>
                </div>
              </Link>
              <Link href={"/auth/register" as Route} className="group bg-panel border border-line rounded-3xl overflow-hidden hover:border-zinc-600 transition block">
                <div className="relative h-48 overflow-hidden">
                  <img src="/assets/login-slide-3.jpg" alt="" className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold mb-2">Venue tools</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">Free with API markup, or monthly with your own keys — no markup.</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section id="venues" className="px-5 sm:px-8 lg:px-12 pb-24">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-gold mb-3">Venues</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">Connect the platforms the tools run on.</h2>
              <p className="text-zinc-400 leading-relaxed mb-8">Start on Deriv — live for bots and wallet transfer. Bybit and Binance sit in the same hub.</p>
              <ul className="space-y-5">
                <li>
                  <p className="font-medium">Deriv <span className="text-accent text-xs font-normal ml-2">Live</span></p>
                  <p className="text-sm text-zinc-400 mt-1">Synthetics, options, FXNOD Bot, and deposits from the FXNOD Wallet.</p>
                </li>
                <li>
                  <p className="font-medium">Bybit</p>
                  <p className="text-sm text-zinc-400 mt-1">Perpetual flow tools. Free access uses FXNOD API markup.</p>
                </li>
                <li>
                  <p className="font-medium">Binance</p>
                  <p className="text-sm text-zinc-400 mt-1">Spot and futures grid. Direct keys on monthly plans.</p>
                </li>
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-line min-h-[320px] lg:min-h-[440px]">
              <img src="/assets/login-slide-3.jpg" alt="Night financial district — FXNOD venues" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-bg/40"></div>
            </div>
          </div>
        </section>

        <section id="access" className="px-5 sm:px-8 lg:px-12 pb-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-3">Two ways in. Same terminal.</h2>
            <p className="text-zinc-400 max-w-xl mb-10 leading-relaxed">Use tools free and we earn on volume — or subscribe from the wallet and trade on your keys.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <article className="bg-panel border border-line rounded-3xl p-5 sm:p-8">
                <p className="text-[11px] uppercase tracking-[0.14em] text-gold mb-3">Free</p>
                <h3 className="font-display text-2xl font-semibold mb-3">API markup</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">No monthly fee. You trade on Deriv, Bybit or Binance through FXNOD. We earn on volume.</p>
              </article>
              <article className="rounded-3xl p-5 sm:p-8 border border-gold/25" style={{ background: "linear-gradient(160deg, #1A3358 0%, #101827 58%)" }}>
                <p className="text-[11px] uppercase tracking-[0.14em] text-accent mb-3">Monthly</p>
                <h3 className="font-display text-2xl font-semibold mb-3">Wallet subscription</h3>
                <p className="text-sm text-zinc-300 leading-relaxed">Top up the FXNOD Wallet, subscribe, and use your own venue keys. No API markup.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="guides" className="px-5 sm:px-8 lg:px-12 pb-24" aria-labelledby="guides-heading">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-gold mb-3">Guides</p>
                <h2 id="guides-heading" className="font-display text-3xl sm:text-4xl font-semibold">How the tools work.</h2>
              </div>
              <Link href={"/blog" as Route} className="text-sm text-accent hover:underline shrink-0">All guides</Link>
            </div>
            <div id="home-posts" className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {posts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}` as Route} className="bg-panel border border-line rounded-2xl p-6 hover:border-zinc-600 transition flex flex-col min-h-[220px]">
                  <p className="text-[11px] uppercase tracking-wider text-gold mb-3">{p.tag} &middot; {p.date}</p>
                  <h3 className="font-display text-lg font-semibold mb-2">{p.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{p.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 sm:px-8 lg:px-12 pb-24" aria-labelledby="faq-heading">
          <div className="max-w-3xl mx-auto">
            <h2 id="faq-heading" className="font-display text-3xl sm:text-4xl font-semibold mb-8">Frequently asked questions.</h2>
            <div className="border-t border-b border-line">
              <details className="faq-item py-5 group">
                <summary className="cursor-pointer text-[15px] font-medium text-zinc-200 list-none flex justify-between gap-4">
                  How do I create an FXNOD account?
                  <span className="text-zinc-500 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-sm text-zinc-400 leading-relaxed mt-3">Sign up with an email, then open the terminal. You can also continue with the demo account to explore FXNOD Bot, the wallet, and Deriv transfer.</p>
              </details>
              <details className="faq-item py-5 group border-t border-line">
                <summary className="cursor-pointer text-[15px] font-medium text-zinc-200 list-none flex justify-between gap-4">
                  What is FXNOD Bot?
                  <span className="text-zinc-500 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-sm text-zinc-400 leading-relaxed mt-3">FXNOD Bot is a Deriv strategy builder. Create as many strategies as you need, pick a market, set rules and stake, then run them on the Deriv API.</p>
              </details>
              <details className="faq-item py-5 group border-t border-line">
                <summary className="cursor-pointer text-[15px] font-medium text-zinc-200 list-none flex justify-between gap-4">
                  How does free access differ from monthly?
                  <span className="text-zinc-500 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-sm text-zinc-400 leading-relaxed mt-3">Free tools use FXNOD’s markup API — no monthly fee. Monthly tools are billed from your FXNOD Wallet and use your own venue keys, with no markup.</p>
              </details>
              <details className="faq-item py-5 group border-t border-line">
                <summary className="cursor-pointer text-[15px] font-medium text-zinc-200 list-none flex justify-between gap-4">
                  Can I send wallet funds to Deriv?
                  <span className="text-zinc-500 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-sm text-zinc-400 leading-relaxed mt-3">Yes. Transfer is live for Deriv first. Pick an amount from the FXNOD Wallet and we credit your connected Deriv account. Binance and Bybit deposits come next.</p>
              </details>
            </div>
          </div>
        </section>

        <section className="px-5 sm:px-8 lg:px-12 pb-24">
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-3xl px-6 sm:px-16 py-16 sm:py-24 text-center border border-line">
            <img src="/assets/og-image.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-bg/80"></div>
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-5xl font-semibold mb-4">Open the terminal.</h2>
              <p className="text-zinc-300 max-w-md mx-auto mb-8 leading-relaxed">Run FXNOD Bot, move funds to Deriv, and manage tools from one hub.</p>
              <Link href={"/auth/register" as Route} className="bg-accent text-[#080C16] hover:opacity-90 transition inline-flex items-center justify-center h-12 px-8 rounded-full text-sm font-semibold">Get started</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line px-5 sm:px-8 lg:px-12 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <img src="/assets/fxnod-logo.png" alt="FXNOD" className="h-6 w-auto mb-4" />
            <p className="text-xs text-zinc-500 leading-relaxed">Trading hub for Deriv, Bybit and Binance.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500 mb-3">Product</p>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><a href="#product" className="hover:text-white transition">FXNOD Bot</a></li>
              <li><a href="#access" className="hover:text-white transition">Wallet</a></li>
              <li><a href="#venues" className="hover:text-white transition">Venues</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500 mb-3">Company</p>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href={"/blog" as Route} className="hover:text-white transition">Guides</Link></li>
              <li><Link href={"/auth/login" as Route} className="hover:text-white transition">Log in</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500 mb-3">Account</p>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href={"/auth/register" as Route} className="hover:text-white transition">Sign up</Link></li>
              <li><Link href={"/auth/login" as Route} className="hover:text-white transition">Log in</Link></li>
            </ul>
          </div>
        </div>
        <p className="max-w-6xl mx-auto text-[11px] text-zinc-600">© 2026 FXNOD. Trading involves risk. This site is a product demo.</p>
      </footer>
    </div>
  );
}
