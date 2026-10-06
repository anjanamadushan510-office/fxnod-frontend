import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl, pageMetadata } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "About FXNOD",
    description:
      "What FXNOD is, what is live today, what is coming soon, and how it relates to Deriv. FXNOD is an independent trading terminal for Deriv accounts.",
    path: "/about",
  }),
  // The title already carries the name; the template would repeat it.
  title: { absolute: "About FXNOD" },
};

/**
 * The page that says what FXNOD is, in sentences that can be quoted alone.
 *
 * It is the reference for every other description of the product. A search
 * engine or an assistant asked "what is FXNOD" should be able to answer from
 * the first paragraph, and nothing here may run ahead of what is live.
 */
export default function AboutPage() {
  return (
    <div data-theme="dark" className="bg-bg text-ink font-sans antialiased min-h-screen flex flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About FXNOD",
          url: absoluteUrl("/about"),
          mainEntity: {
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: SITE_NAME,
            url: SITE_URL,
            logo: absoluteUrl("/assets/fxnod-logo.png"),
            description: SITE_DESCRIPTION,
          },
        }}
      />
      <PublicHeader />

      <main className="flex-1 py-12 sm:py-20 px-5 sm:px-8 lg:px-12">
        <article className="max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold mb-3">About</p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold mb-8">About FXNOD</h1>

          <div className="space-y-5 text-zinc-300 leading-relaxed text-[17px]">
            <p className="text-lg sm:text-xl text-zinc-100">
              FXNOD is a web trading terminal for Deriv accounts. You connect your own Deriv account and use it from
              three tools: dTrader for placing trades by hand, dBot for building a bot without code, and Auto Hub for
              starting a ready-made bot.
            </p>

            <h2 className="font-display text-2xl font-semibold text-white pt-6">What is live today</h2>
            <ul className="list-disc pl-5 space-y-2 marker:text-zinc-600">
              <li>
                <Link href={"/guides/dtrader-manual-trading" as Route} className="text-accent hover:underline">
                  dTrader
                </Link>
                : manual trading with a live chart and ten trade types.
              </li>
              <li>
                <Link href={"/guides/build-a-deriv-bot-with-dbot" as Route} className="text-accent hover:underline">
                  dBot
                </Link>
                : a bot builder that asks plain questions instead of using blocks or code.
              </li>
              <li>
                <Link href={"/guides/auto-hub-ready-made-bots" as Route} className="text-accent hover:underline">
                  Auto Hub
                </Link>
                : bots built by FXNOD that you start with a stake and a stop loss.
              </li>
              <li>
                A{" "}
                <Link href={"/partner" as Route} className="text-accent hover:underline">
                  partner programme
                </Link>{" "}
                for people who invite others.
              </li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-white pt-6">What is coming soon</h2>
            <p>
              Tools for Bybit and Binance, monthly plans that run on your own exchange keys, and wallet top-ups with
              transfers to Deriv are planned. None of them is available yet, and the site marks each one as coming
              soon until it is.
            </p>

            <h2 className="font-display text-2xl font-semibold text-white pt-6">What it costs</h2>
            <p>
              The tools have no subscription and no sign-up fee. You can try all of them on a Deriv demo account
              with virtual funds before you trade real money.
            </p>

            <h2 className="font-display text-2xl font-semibold text-white pt-6">FXNOD and Deriv</h2>
            <p>
              FXNOD is an independent product. It is not owned by, operated by or affiliated with Deriv, Bybit or
              Binance. It connects to Deriv through Deriv&apos;s public API with the permission you give on
              Deriv&apos;s own login page, so FXNOD never sees your Deriv password. Your trading balance stays in your
              Deriv account, and every contract is bought from and settled by Deriv.
            </p>

            <h2 className="font-display text-2xl font-semibold text-white pt-6">Risk</h2>
            <p>
              Options and multipliers are high-risk products, and a bot does not make them safer. Read the{" "}
              <Link href={"/risk-disclosure" as Route} className="text-accent hover:underline">
                risk warning
              </Link>{" "}
              before you trade real money, and start on a demo account.
            </p>

            <h2 className="font-display text-2xl font-semibold text-white pt-6">Where to start</h2>
            <p>
              Read{" "}
              <Link href={"/guides/connect-deriv-account" as Route} className="text-accent hover:underline">
                how to connect your Deriv account
              </Link>
              , then browse the rest of the{" "}
              <Link href={"/guides" as Route} className="text-accent hover:underline">
                guides
              </Link>
              .
            </p>
          </div>
        </article>
      </main>

      <PublicFooter />
    </div>
  );
}
