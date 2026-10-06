import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { GUIDES, formatGuideDate, readMinutes } from "@/content/guides";
import { absoluteUrl, pageMetadata } from "@/lib/site";

const DESCRIPTION =
  "Step-by-step guides to FXNOD's Deriv tools: connect your account, trade by hand in dTrader, build a bot in dBot, and start a ready-made bot in Auto Hub.";

export const metadata: Metadata = pageMetadata({
  title: "Guides: how the Deriv tools work",
  description: DESCRIPTION,
  path: "/guides",
});

export default function GuidesPage() {
  return (
    <div data-theme="dark" className="bg-bg text-ink font-sans antialiased min-h-screen flex flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "FXNOD guides",
          description: DESCRIPTION,
          url: absoluteUrl("/guides"),
          hasPart: GUIDES.map((guide) => ({
            "@type": "Article",
            headline: guide.title,
            url: absoluteUrl(`/guides/${guide.slug}`),
          })),
        }}
      />
      <PublicHeader />

      <main className="px-5 sm:px-8 lg:px-12 py-10 sm:py-20 flex-1">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold mb-3">Guides</p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold mb-4">How FXNOD tools work.</h1>
          <p className="text-zinc-400 max-w-xl mb-12 leading-relaxed">
            One guide per tool, written by the team that builds them: how to connect a Deriv account, trade by hand in
            dTrader, build a bot in dBot, and start a ready-made bot in Auto Hub.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}` as Route}
                className="bg-panel border border-line rounded-2xl p-6 sm:p-8 hover:border-zinc-600 transition block"
              >
                <p className="text-[11px] uppercase tracking-wider text-gold mb-3">
                  {guide.tag} &middot; {formatGuideDate(guide.updated)} &middot; {readMinutes(guide)} min read
                </p>
                <h2 className="font-display text-xl font-semibold mb-2">{guide.title}</h2>
                <p className="text-sm text-zinc-400 leading-relaxed">{guide.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
