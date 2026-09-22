import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Route } from 'next';

const guidesData: Record<string, {
  tag: string;
  date: string;
  readTime: string;
  title: string;
  image: string; // Added image field
  intro: string;
  sections: { heading?: string; text: string; link?: { label: string; href: string } }[];
}> = {
  'fxnod-bot-strategies': {
    tag: 'PRODUCT',
    date: '11 SEP 2026',
    readTime: '6 MIN READ',
    title: 'How FXNOD Bot runs strategies on Deriv',
    image: '/assets/login-slide-1.jpg',
    intro: 'FXNOD Bot is the strategy desk inside the FXNOD terminal. It is built for Deriv first: you design rules, pick a market, set a stake, and run the strategy through the Deriv API.',
    sections: [
      {
        heading: 'What you can do',
        text: 'Create as many strategies as you need. Each one is yours — not a single locked session bot. That is the difference between FXNOD Bot and a one-shot "start/stop" tool.\nChoose a Deriv market (synthetics and options sit in the same venue).\nSet rules and stake.\nRun it on Deriv while FXNOD stays the control layer.'
      },
      {
        heading: 'How access works',
        text: 'FXNOD Bot is free to use. FXNOD earns a markup on the Deriv API. If you later subscribe to a monthly Deriv tool, you can switch to your own keys and drop the markup.'
      },
      {
        heading: 'Where it lives',
        text: 'Open the terminal, go to Tools, activate FXNOD Bot, then open it from Subscriptions. The workspace is empty until you add a strategy — that editor is the next layer of the product.',
        link: { label: 'Send FXNOD Wallet funds onto Deriv', href: '/guides/send-wallet-funds' }
      }
    ]
  },
  'send-wallet-funds': {
    tag: 'WALLET',
    date: '11 SEP 2026',
    readTime: '5 MIN READ',
    title: 'Send FXNOD Wallet funds onto Deriv',
    image: '/assets/login-slide-2.jpg',
    intro: 'The FXNOD Wallet is not only for paying monthly tools. Transfer lets you move a balance from FXNOD onto a trading venue. Deriv is the first live destination.',
    sections: [
      {
        heading: 'The flow',
        text: 'Top up the FXNOD Wallet through the payment gateway.\nOpen Transfer, keep Deriv selected.\nChoose $25, $50, $100, Max, or a custom amount.\nConfirm. The wallet debit is recorded and the Deriv balance on this account goes up.'
      },
      {
        heading: 'If the wallet is short',
        text: 'The send button becomes a top-up prompt. Fund the wallet first, then send. Activity shows as "Transfer · Deriv" next to ordinary top-ups and subscriptions.'
      },
      {
        heading: 'What is live vs next',
        text: 'Deriv is live. Binance and Bybit show as soon on the Transfer page. The same wallet will route to those venues when those rails are on.\nThis demo stores the debit and the Deriv credit on your device. A production payout would hit the connected Deriv account through FXNOD\'s venue integration.'
      }
    ]
  },
  'free-vs-monthly': {
    tag: 'ACCESS',
    date: '10 SEP 2026',
    readTime: '5 MIN READ',
    title: 'Free API markup vs monthly wallet plans',
    image: '/assets/login-slide-3.jpg',
    intro: 'Every FXNOD tool is either free or monthly. The terminal is the same. The difference is who owns the venue API and how FXNOD is paid.',
    sections: [
      { heading: 'Free — markup on the API', text: 'You pay no monthly fee. Orders route through FXNOD\'s connection to Deriv, Bybit or Binance. FXNOD earns a markup on volume. FXNOD Bot is in this group: you can build Deriv strategies without a subscription.' },
      { heading: 'Monthly — pay from the wallet, use your keys', text: 'You top up the FXNOD Wallet, subscribe, and connect your own API keys. There is no markup on that flow. The charge renews monthly from the same wallet you also use to send funds to Deriv.' },
      {
        heading: 'Which to pick',
        text: 'Start free if you want to run volume without a plan. Move to monthly when you want direct keys and a cleaner execution cost. Both sit under Tools; active ones collect in Subscriptions.',
        link: { label: 'Read next: How FXNOD Bot runs strategies on Deriv.', href: '/guides/fxnod-bot-strategies' }
      }
    ]
  }
};

export default function GuideDetailPage({ params }: { params: { slug: string } }) {
  const guide = guidesData[params.slug];
  if (!guide) notFound();

  return (
    <div className="min-h-screen bg-[#080C16] text-white flex flex-col">
      {/* Navbar Section */}
      <header className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[#24344F] lg:border-none">
        <Link href="/" className="flex items-center gap-2">
          {/* Ensure this logo path is correct for your public folder */}
          <img src="/assets/fxnod-logo.png" alt="FXNOD" className="h-6 w-auto" />
        </Link>
        <nav className="hidden lg:block absolute left-1/2 -translate-x-1/2">
          <Link href={"/guides" as Route} className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
            Guides
          </Link>
        </nav>
        <div className="flex items-center">
          <Link href={"/login?mode=create" as Route} className="px-5 py-2 bg-[#4CE0D3] text-[#080C16] text-sm font-semibold rounded-full hover:bg-opacity-90 transition">
            Get started
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Meta info */}
          <div className="flex items-center gap-3 text-xs tracking-wider text-zinc-400 mb-5 font-mono uppercase">
            <span className="text-[#C9A08C] font-semibold">{guide.tag}</span>
            <span>·</span>
            <span>{guide.date}</span>
            <span>·</span>
            <span>{guide.readTime}</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-[40px] leading-tight font-bold tracking-tight mb-10">
            {guide.title}
          </h1>

          {/* Banner Image */}
          {guide.image && (
            <div className="rounded-2xl overflow-hidden border border-[#24344F] bg-[#101827] mb-10">
              <img src={guide.image} alt={guide.title} className="w-full h-auto object-cover" />
            </div>
          )}

          {/* Intro & Sections */}
          <div className="space-y-8 text-zinc-300 leading-relaxed text-[17px]">
            <p className="text-zinc-200">{guide.intro}</p>

            {guide.sections.map((sec, idx) => (
              <div key={idx} className="space-y-3">
                {sec.heading && (
                  <h2 className="font-display text-xl font-semibold text-white mt-8 mb-4">
                    {sec.heading}
                  </h2>
                )}
                <div className="whitespace-pre-line text-zinc-300">
                  {sec.text}
                </div>
                {sec.link && (
                  <p className="pt-2">
                    <Link href={sec.link.href as Route} className="text-[#4CE0D3] hover:underline font-medium">
                      {sec.link.label}
                    </Link>
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Back Link */}
          <div className="mt-20 pt-8 border-t border-[#24344F]">
            <Link href={"/guides" as Route} className="text-sm text-[#4CE0D3] hover:text-white inline-flex items-center gap-2 transition-colors">
              ← All guides
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}