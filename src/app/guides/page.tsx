import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatGuideDate, readMinutes } from "@/content/guides";
import { ALL_GUIDES, GUIDE_SECTIONS } from "@/content/library";
import { GUIDE_LABELS, LOCAL_LOCALES } from "@/lib/locales";
import { absoluteUrl, pageMetadata } from "@/lib/site";

const DESCRIPTION =
  "Guides to trading and trading bots: how FXNOD's Deriv tools work, how to choose, test and limit a bot, and the basics of charts, risk and discipline.";

export const metadata: Metadata = pageMetadata({
  title: "Guides: trading bots, risk and the Deriv tools",
  description: DESCRIPTION,
  path: "/guides",
  languages: {
    en: "/guides",
    ...Object.fromEntries(LOCAL_LOCALES.map((locale) => [locale, GUIDE_LABELS[locale].guidesPath])),
    "x-default": "/guides",
  },
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
          hasPart: ALL_GUIDES.map((guide) => ({
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
          <h1 className="font-display text-3xl sm:text-5xl font-semibold mb-4">Trading, bots and the tools.</h1>
          <p className="text-zinc-400 max-w-xl leading-relaxed">
            Plain answers to the questions traders ask: how each FXNOD tool works, how to choose, test and limit a
            trading bot, and what to understand about charts and risk first.
          </p>
          <p className="text-sm text-zinc-500 mt-4 flex flex-wrap gap-x-4 gap-y-1">
            {LOCAL_LOCALES.map((locale) => (
              <Link
                key={locale}
                href={GUIDE_LABELS[locale].guidesPath as Route}
                hrefLang={locale}
                lang={locale}
                className="text-accent hover:text-white transition"
              >
                {GUIDE_LABELS[locale].index.llmsHeading}
              </Link>
            ))}
          </p>

          {GUIDE_SECTIONS.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`} className="mt-14">
              <h2 id={`${section.id}-heading`} className="font-display text-2xl font-semibold mb-2">
                {section.title}
              </h2>
              <p className="text-sm text-zinc-400 mb-6">{section.intro}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.guides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}` as Route}
                    className="bg-panel border border-line rounded-2xl p-6 sm:p-8 hover:border-zinc-600 transition block"
                  >
                    <p className="text-[11px] uppercase tracking-wider text-gold mb-3">
                      {guide.tag} &middot; {formatGuideDate(guide.updated)} &middot; {readMinutes(guide)} min read
                    </p>
                    <h3 className="font-display text-xl font-semibold mb-2">{guide.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{guide.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
