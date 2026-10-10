import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { readMinutes } from "@/content/guides";
import { ES_GUIDES } from "@/content/es/guias";
import { GUIDE_LABELS, formatGuideDateIn } from "@/lib/locales";
import { absoluteUrl, pageMetadata } from "@/lib/site";

const LABELS = GUIDE_LABELS.es;

const DESCRIPTION =
  "Guías en español sobre Deriv y los bots de trading: qué es Deriv, cómo operar, depositar y retirar, índices sintéticos, y cómo elegir y probar un bot.";

export const metadata: Metadata = pageMetadata({
  title: "Guías en español: Deriv, índices sintéticos y bots de trading",
  description: DESCRIPTION,
  path: LABELS.guidesPath,
  ogLocale: LABELS.ogLocale,
  languages: { en: "/guides", es: LABELS.guidesPath, "x-default": "/guides" },
});

/** /es/guias — the guides written in Spanish. */
export default function GuiasPage() {
  return (
    <div data-theme="dark" className="bg-bg text-ink font-sans antialiased min-h-screen flex flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Guías de FXNOD en español",
          description: DESCRIPTION,
          url: absoluteUrl(LABELS.guidesPath),
          inLanguage: "es",
          hasPart: ES_GUIDES.map((guide) => ({
            "@type": "Article",
            headline: guide.title,
            url: absoluteUrl(`${LABELS.guidesPath}/${guide.slug}`),
          })),
        }}
      />
      <PublicHeader />

      <main className="px-5 sm:px-8 lg:px-12 py-10 sm:py-20 flex-1">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold mb-3">{LABELS.guides}</p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold mb-4">Deriv y bots de trading, en claro.</h1>
          <p className="text-zinc-400 max-w-xl leading-relaxed">
            Respuestas directas a lo que se pregunta en español: qué es Deriv, cómo operar, depositar y retirar, qué son
            los índices sintéticos y cómo elegir y probar un bot de trading.
          </p>
          <p className="text-sm text-zinc-500 mt-4">
            <Link href={"/guides" as Route} hrefLang="en" lang="en" className="text-accent hover:text-white transition">
              More guides in English
            </Link>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
            {ES_GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`${LABELS.guidesPath}/${guide.slug}` as Route}
                className="bg-panel border border-line rounded-2xl p-6 sm:p-8 hover:border-zinc-600 transition block"
              >
                <p className="text-[11px] uppercase tracking-wider text-gold mb-3">
                  {guide.tag} &middot; {formatGuideDateIn(guide.updated, LABELS)} &middot; {readMinutes(guide)}{" "}
                  {LABELS.minRead}
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
