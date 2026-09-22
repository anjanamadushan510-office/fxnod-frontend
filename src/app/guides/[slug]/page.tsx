import { notFound } from "next/navigation";
import Link from "next/link";
import { Route } from "next";

// Shared mock data for static guides
const guides = [
  { 
    slug: 'fxnod-bot-strategies', 
    tag: 'PRODUCT', 
    date: '11 SEP 2026', 
    read: '6 MIN READ', 
    title: 'How FXNOD Bot runs strategies on Deriv', 
    excerpt: 'Create as many Deriv strategies as you need — markets, rules, stake — then run them from one terminal.',
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

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = guides.find(g => g.slug === params.slug);

  if (!guide) {
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
            <Link href={"/#product" as Route} className="hover:text-white transition">Product</Link>
            <Link href={"/guides" as Route} className="text-white">Guides</Link>
            <Link href={"/blog" as Route} className="hover:text-white transition">Blog</Link>
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            <Link href={"/auth/login" as Route} className="hidden md:inline-flex h-9 px-4 items-center rounded-full text-sm text-zinc-300 hover:text-white transition">Log in</Link>
            <Link href={"/auth/register" as Route} className="bg-accent text-[#080C16] hidden md:inline-flex h-9 px-4 items-center rounded-full text-sm font-semibold hover:opacity-90 transition">Get started</Link>
          </div>
        </header>
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto px-5 sm:px-8 py-10 sm:py-20">
        <Link href={"/guides" as Route} className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition mb-8">
          ← Back to Guides
        </Link>
        
        <article className="bg-panel border border-line rounded-3xl overflow-hidden shadow-xl p-8 sm:p-12 lg:p-16">
          <div className="mb-12 border-b border-line pb-8">
            <p className="text-[11px] uppercase tracking-wider text-gold mb-4">
              {guide.tag} &middot; {guide.date} &middot; {guide.read}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-6">
              {guide.title}
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl">
              {guide.excerpt}
            </p>
          </div>
          
          <div 
            className="prose prose-invert lg:prose-lg max-w-none prose-a:text-accent hover:prose-a:text-accent/80 prose-headings:font-display prose-headings:font-semibold prose-img:rounded-xl prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: guide.content }}
          />
        </article>
      </main>

      <footer className="border-t border-line px-5 sm:px-8 lg:px-12 py-8 text-[11px] text-zinc-600">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span>© 2026 FXNOD</span>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-zinc-400 transition">Home</Link>
            <Link href={"/guides" as Route} className="hover:text-zinc-400 transition">Guides</Link>
            <Link href={"/blog" as Route} className="hover:text-zinc-400 transition">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
