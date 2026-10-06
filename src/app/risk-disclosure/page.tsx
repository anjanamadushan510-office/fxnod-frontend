import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Risk warning",
  description:
    "Trading options and multipliers, by hand or with a bot, can lose your entire stake. What FXNOD's tools do and do not protect you from.",
  path: "/risk-disclosure",
});

/**
 * A plain-language summary of the risks, not the legal terms. It exists so
 * that every public page has somewhere honest to point, and it deliberately
 * promises nothing: no expected return, no win rate, no claim that a limit
 * always holds.
 */

const POINTS: { title: string; text: string }[] = [
  {
    title: "You can lose your entire stake",
    text: "Most of the contracts traded through FXNOD pay out only if your prediction is right. When it is wrong, the stake for that trade is gone. Multipliers and Accumulators can also end at a total loss of the stake.",
  },
  {
    title: "A bot does not reduce the risk",
    text: "A bot follows its rules exactly and without pause. If the rules lose, it loses automatically, and it can place many trades in the time you would place one. dBot and Auto Hub are tools for executing a rule. They are not a source of profit.",
  },
  {
    title: "Martingale can empty an account quickly",
    text: "Raising the stake after each loss makes small wins frequent and large losses inevitable over a long enough run. FXNOD limits how far a stake can grow, but a limit only caps the loss. It does not prevent it.",
  },
  {
    title: "Past results do not predict future results",
    text: "A bot that won on a demo account, in a previous session or in its shadow trades can lose from the next trade onward. Deriv's synthetic indices are generated randomly, so no pattern in earlier ticks is owed a continuation.",
  },
  {
    title: "Limits are a safeguard, not a guarantee",
    text: "A stop loss ends a run once the loss reaches your number. A trade that is already open at that moment still settles, so the final loss can be somewhat larger than the limit.",
  },
  {
    title: "Automation can stop",
    text: "A bot depends on FXNOD, on Deriv and on the permission Deriv gives FXNOD, which expires and has to be renewed. A run can end because of any of them. Do not leave a strategy running that only works if it is never interrupted.",
  },
  {
    title: "FXNOD does not give financial advice",
    text: "Nothing on this site, in the guides or in the tools is a recommendation to trade. Templates and ready-made bots are examples of rules, not suggestions that the rules are profitable.",
  },
  {
    title: "Check that you are allowed to trade",
    text: "These products are not available or lawful everywhere, and Deriv decides who may hold an account with it. You are responsible for following the rules of the country you live in.",
  },
];

export default function RiskDisclosurePage() {
  return (
    <div data-theme="dark" className="bg-bg text-ink font-sans antialiased min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1 py-12 sm:py-20 px-5 sm:px-8 lg:px-12">
        <article className="max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold mb-3">Risk</p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold mb-8">Risk warning</h1>

          <p className="text-lg sm:text-xl leading-relaxed text-zinc-100 border-l-2 border-gold pl-5 mb-10">
            Trading options and multipliers is high risk, whether you place the trades yourself or a bot places them
            for you. You can lose all the money you stake. Only trade with money you can afford to lose, and try
            everything on a demo account first.
          </p>

          <div className="space-y-8 text-zinc-300 leading-relaxed text-[17px]">
            {POINTS.map((point) => (
              <section key={point.title}>
                <h2 className="font-display text-xl font-semibold text-white mb-2">{point.title}</h2>
                <p>{point.text}</p>
              </section>
            ))}
          </div>

          <p className="mt-12 text-sm text-zinc-500 leading-relaxed">
            This page is a plain-language summary. It is not legal or financial advice. Learn how each tool works in
            the{" "}
            <Link href={"/guides" as Route} className="text-accent hover:underline">
              guides
            </Link>{" "}
            before you use it with real money.
          </p>
        </article>
      </main>

      <PublicFooter />
    </div>
  );
}
