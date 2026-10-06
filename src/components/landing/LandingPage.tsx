"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useAuthStore } from "@/stores/authStore";
import { HOME_FAQ } from "@/content/homeFaq";

/** What the landing page shows of a guide. Passed in by the server page so the full guide text stays out of the client bundle. */
export interface LandingGuide {
  slug: string;
  tag: string;
  date: string;
  title: string;
  description: string;
}

export function LandingPage({ guides }: { guides: LandingGuide[] }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const status = useAuthStore((s) => s.status);

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

  return (
    <div data-theme="dark" className="bg-bg text-ink font-sans antialiased min-h-screen">
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
            <Link href={"/guides" as Route} className="hover:text-white transition">Guides</Link>
            <Link href={"/blog" as Route} className="hover:text-white transition">Blog</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {status === "authenticated" ? (
              <Link href={"/home" as Route} className="bg-accent text-[#080C16] hidden md:inline-flex h-9 px-4 items-center rounded-full text-sm font-semibold hover:opacity-90 transition">Go to Dashboard</Link>
            ) : (
              <>
                <Link href={"/auth/login" as Route} className="hidden md:inline-flex h-9 px-3 sm:px-4 items-center rounded-full text-sm text-zinc-300 hover:text-white transition">Log in</Link>
                <Link href={"/auth/register" as Route} className="bg-accent text-[#080C16] hidden md:inline-flex h-9 px-4 items-center rounded-full text-sm font-semibold hover:opacity-90 transition">Get started</Link>
              </>
            )}
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
            <Link href={"/guides" as Route} onClick={() => setIsMobileMenuOpen(false)}>Guides</Link>
            <Link href={"/blog" as Route} onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
            <hr className="border-line" />
            {status === "authenticated" ? (
              <Link href={"/home" as Route} className="text-accent font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Go to Dashboard</Link>
            ) : (
              <>
                <Link href={"/auth/login" as Route} onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
                <Link href={"/auth/register" as Route} className="text-accent font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Get started</Link>
              </>
            )}
          </nav>
        )}
      </div>

      <main id="main">
        <section className="px-5 sm:px-8 lg:px-12 pt-36 sm:pt-48 pb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-[2.15rem] sm:text-5xl lg:text-7xl font-semibold tracking-tight leading-[1.08] mb-6">Trade Deriv by hand,<br className="hidden sm:block" /> or run a bot.</h1>
            <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8">FXNOD is a trading terminal for your Deriv account. Place trades yourself in dTrader, build a bot without code in dBot, or start a ready-made bot in Auto Hub. Bybit and Binance are coming soon.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
              {status === "authenticated" ? (
                <Link href={"/home" as Route} className="bg-accent text-[#080C16] hover:opacity-90 transition h-12 px-8 inline-flex items-center justify-center rounded-full text-sm font-semibold w-full sm:w-auto">Go to Dashboard</Link>
              ) : (
                <>
                  <Link href={"/auth/register" as Route} className="bg-accent text-[#080C16] hover:opacity-90 transition h-12 px-8 inline-flex items-center justify-center rounded-full text-sm font-semibold w-full sm:w-auto">Get started</Link>
                  <Link href={"/auth/login" as Route} className="h-12 px-8 inline-flex items-center justify-center rounded-full border border-line text-sm text-zinc-300 hover:text-white hover:border-zinc-500 transition w-full sm:w-auto">Log in</Link>
                </>
              )}
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
              <p className="text-xs text-zinc-500 mb-1">Tools</p>
              <p className="font-display text-2xl sm:text-3xl font-semibold">3</p>
              <p className="text-xs text-zinc-500 mt-1">dTrader &middot; dBot &middot; Auto Hub</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Deriv</p>
              <p className="font-display text-2xl sm:text-3xl font-semibold">Live</p>
              <p className="text-xs text-zinc-500 mt-1">Bybit and Binance coming soon</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Access</p>
              <p className="font-display text-2xl sm:text-3xl font-semibold">Free</p>
              <p className="text-xs text-zinc-500 mt-1">No subscription</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Wallet</p>
              <p className="font-display text-2xl sm:text-3xl font-semibold text-gold">Soon</p>
              <p className="text-xs text-zinc-500 mt-1">Top-ups and transfers to Deriv</p>
            </div>
          </div>
        </section>

        <section id="product" className="px-5 sm:px-8 lg:px-12 pb-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-3 max-w-2xl">Three tools on one Deriv connection.</h2>
            <p className="text-zinc-400 max-w-xl mb-10 leading-relaxed">Trade by hand, build your own bot, or start one FXNOD built. Each runs on the Deriv account you connect, demo or real.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href={"/guides/dtrader-manual-trading" as Route} className="group bg-panel border border-line rounded-3xl overflow-hidden hover:border-zinc-600 transition block">
                <div className="relative h-48 overflow-hidden">
                  <img src="/assets/login-slide-1.jpg" alt="" className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold mb-2">dTrader</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">Manual trading with a live chart and ten trade types, from Rise/Fall to Multipliers.</p>
                </div>
              </Link>
              <Link href={"/guides/build-a-deriv-bot-with-dbot" as Route} className="group bg-panel border border-line rounded-3xl overflow-hidden hover:border-zinc-600 transition block">
                <div className="relative h-48 overflow-hidden">
                  <img src="/assets/login-slide-2.jpg" alt="" className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold mb-2">dBot</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">Build a bot in plain language: what to buy, when to enter, when to stop. No blocks, no code.</p>
                </div>
              </Link>
              <Link href={"/guides/auto-hub-ready-made-bots" as Route} className="group bg-panel border border-line rounded-3xl overflow-hidden hover:border-zinc-600 transition block">
                <div className="relative h-48 overflow-hidden">
                  <img src="/assets/login-slide-3.jpg" alt="" className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold mb-2">Auto Hub</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">Ready-made bots. Pick one, set a stake and a stop loss, and start it.</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section id="venues" className="px-5 sm:px-8 lg:px-12 pb-24">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-gold mb-3">Venues</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">Connect the platform the tools run on.</h2>
              <p className="text-zinc-400 leading-relaxed mb-8">Deriv is live today. Bybit and Binance are being built and are not available yet.</p>
              <ul className="space-y-5">
                <li>
                  <p className="font-medium">Deriv <span className="text-accent text-xs font-normal ml-2">Live</span></p>
                  <p className="text-sm text-zinc-400 mt-1">Synthetic indices and options, traded by hand in dTrader or by a bot in dBot and Auto Hub.</p>
                </li>
                <li>
                  <p className="font-medium">Bybit <span className="text-zinc-500 text-xs font-normal ml-2">Coming soon</span></p>
                  <p className="text-sm text-zinc-400 mt-1">Perpetual flow tools. Not available yet.</p>
                </li>
                <li>
                  <p className="font-medium">Binance <span className="text-zinc-500 text-xs font-normal ml-2">Coming soon</span></p>
                  <p className="text-sm text-zinc-400 mt-1">Spot and futures grid. Not available yet.</p>
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
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-3">Free today. Monthly plans later.</h2>
            <p className="text-zinc-400 max-w-xl mb-10 leading-relaxed">Every tool that is live is free to use. Paid plans on your own exchange keys are planned and are not open yet.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <article className="bg-panel border border-line rounded-3xl p-5 sm:p-8">
                <p className="text-[11px] uppercase tracking-[0.14em] text-gold mb-3">Free</p>
                <h3 className="font-display text-2xl font-semibold mb-3">No subscription</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">dTrader, dBot and Auto Hub cost nothing to use. FXNOD is paid through a markup included in the price of the contracts its bots buy on real accounts. Demo trades carry no markup.</p>
              </article>
              <article className="rounded-3xl p-5 sm:p-8 border border-gold/25" style={{ background: "linear-gradient(160deg, #1A3358 0%, #101827 58%)" }}>
                <p className="text-[11px] uppercase tracking-[0.14em] text-accent mb-3">Monthly &middot; Coming soon</p>
                <h3 className="font-display text-2xl font-semibold mb-3">Wallet subscription</h3>
                <p className="text-sm text-zinc-300 leading-relaxed">Planned: top up the FXNOD Wallet, subscribe, and use your own venue keys with no markup. Not available yet.</p>
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
              <Link href={"/guides" as Route} className="text-sm text-accent hover:underline shrink-0">All guides</Link>
            </div>
            <div id="home-posts" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guides.map((g) => (
                <Link key={g.slug} href={`/guides/${g.slug}` as Route} className="bg-panel border border-line rounded-2xl p-6 hover:border-zinc-600 transition flex flex-col">
                  <p className="text-[11px] uppercase tracking-wider text-gold mb-3">{g.tag} &middot; {g.date}</p>
                  <h3 className="font-display text-lg font-semibold mb-2">{g.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{g.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 sm:px-8 lg:px-12 pb-24" aria-labelledby="faq-heading">
          <div className="max-w-3xl mx-auto">
            <h2 id="faq-heading" className="font-display text-3xl sm:text-4xl font-semibold mb-8">Frequently asked questions.</h2>
            <div className="border-t border-b border-line">
              {HOME_FAQ.map((item, i) => (
                <details key={item.q} className={`faq-item py-5 group${i > 0 ? " border-t border-line" : ""}`}>
                  <summary className="cursor-pointer text-[15px] font-medium text-zinc-200 list-none flex justify-between gap-4">
                    {item.q}
                    <span className="text-zinc-500 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="text-sm text-zinc-400 leading-relaxed mt-3">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 sm:px-8 lg:px-12 pb-24">
          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-3xl px-6 sm:px-16 py-16 sm:py-24 text-center border border-line">
            <img src="/assets/og-image.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-bg/80"></div>
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-5xl font-semibold mb-4">Open the terminal.</h2>
              <p className="text-zinc-300 max-w-md mx-auto mb-8 leading-relaxed">Connect your Deriv demo account and try dTrader, dBot and Auto Hub with virtual funds.</p>
              {status === "authenticated" ? (
                <Link href={"/home" as Route} className="bg-accent text-[#080C16] hover:opacity-90 transition inline-flex items-center justify-center h-12 px-8 rounded-full text-sm font-semibold">Go to Dashboard</Link>
              ) : (
                <Link href={"/auth/register" as Route} className="bg-accent text-[#080C16] hover:opacity-90 transition inline-flex items-center justify-center h-12 px-8 rounded-full text-sm font-semibold">Get started</Link>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line px-5 sm:px-8 lg:px-12 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <img src="/assets/fxnod-logo.png" alt="FXNOD" className="h-6 w-auto mb-4" />
            <p className="text-xs text-zinc-500 leading-relaxed">Trading terminal for Deriv accounts. Bybit and Binance coming soon.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500 mb-3">Product</p>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href={"/guides/dtrader-manual-trading" as Route} className="hover:text-white transition">dTrader</Link></li>
              <li><Link href={"/guides/build-a-deriv-bot-with-dbot" as Route} className="hover:text-white transition">dBot</Link></li>
              <li><Link href={"/guides/auto-hub-ready-made-bots" as Route} className="hover:text-white transition">Auto Hub</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500 mb-3">Company</p>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href={"/about" as Route} className="hover:text-white transition">About</Link></li>
              <li><Link href={"/guides" as Route} className="hover:text-white transition">Guides</Link></li>
              <li><Link href={"/blog" as Route} className="hover:text-white transition">Blog</Link></li>
              <li><Link href={"/partner" as Route} className="hover:text-white transition">Partner programme</Link></li>
              <li><Link href={"/risk-disclosure" as Route} className="hover:text-white transition">Risk warning</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500 mb-3">Account</p>
            <ul className="space-y-2 text-sm text-zinc-400">
              {status === "authenticated" ? (
                <li><Link href={"/home" as Route} className="hover:text-white transition">Dashboard</Link></li>
              ) : (
                <>
                  <li><Link href={"/auth/register" as Route} className="hover:text-white transition">Sign up</Link></li>
                  <li><Link href={"/auth/login" as Route} className="hover:text-white transition">Log in</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>
        <p className="max-w-6xl mx-auto text-[11px] text-zinc-600 leading-relaxed">© 2026 FXNOD. Trading involves risk and you can lose your entire stake. FXNOD is an independent product and is not affiliated with Deriv, Bybit or Binance.</p>
      </footer>
    </div>
  );
}
