import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { readMinutes, type LocalGuide } from "@/content/guides";
import { LOCAL_GUIDES, languagePaths, localGuideBySlug, localGuidePath, otherLanguages } from "@/content/localGuides";
import { GUIDE_LABELS, LOCAL_LOCALES, formatGuideDateIn, type LocalLocale } from "@/lib/locales";
import { SITE_NAME, absoluteUrl, pageMetadata } from "@/lib/site";

/**
 * The two pages every non-English language has: its list of guides and one
 * guide. The route files under /es and /fr only name their language.
 */

function indexLanguages(): Record<string, string> {
  const paths: Record<string, string> = { en: GUIDE_LABELS.en.guidesPath };
  for (const locale of LOCAL_LOCALES) paths[locale] = GUIDE_LABELS[locale].guidesPath;
  return { ...paths, "x-default": GUIDE_LABELS.en.guidesPath };
}

export function localIndexMetadata(locale: LocalLocale): Metadata {
  const labels = GUIDE_LABELS[locale];
  return pageMetadata({
    title: labels.index.title,
    description: labels.index.description,
    path: labels.guidesPath,
    ogLocale: labels.ogLocale,
    languages: indexLanguages(),
  });
}

export function LocalGuideIndex({ locale }: { locale: LocalLocale }) {
  const labels = GUIDE_LABELS[locale];
  const { guides } = LOCAL_GUIDES[locale];
  const others = (["en", ...LOCAL_LOCALES] as const).filter((l) => l !== locale);

  return (
    <div data-theme="dark" className="bg-bg text-ink font-sans antialiased min-h-screen flex flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: labels.index.collectionName,
          description: labels.index.description,
          url: absoluteUrl(labels.guidesPath),
          inLanguage: locale,
          hasPart: guides.map((guide) => ({
            "@type": "Article",
            headline: guide.title,
            url: absoluteUrl(localGuidePath(locale, guide.slug)),
          })),
        }}
      />
      <PublicHeader />

      <main className="px-5 sm:px-8 lg:px-12 py-10 sm:py-20 flex-1">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold mb-3">{labels.guides}</p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold mb-4">{labels.index.heading}</h1>
          <p className="text-zinc-400 max-w-xl leading-relaxed">{labels.index.intro}</p>
          <p className="text-sm text-zinc-500 mt-4 flex flex-wrap gap-x-4 gap-y-1">
            {others.map((other) => (
              <Link
                key={other}
                href={GUIDE_LABELS[other].guidesPath as Route}
                hrefLang={other}
                lang={other}
                className="text-accent hover:text-white transition"
              >
                {GUIDE_LABELS[other].name}
              </Link>
            ))}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={localGuidePath(locale, guide.slug) as Route}
                className="bg-panel border border-line rounded-2xl p-6 sm:p-8 hover:border-zinc-600 transition block"
              >
                <p className="text-[11px] uppercase tracking-wider text-gold mb-3">
                  {guide.tag} &middot; {formatGuideDateIn(guide.updated, labels)} &middot; {readMinutes(guide)}{" "}
                  {labels.minRead}
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

export function localGuideMetadata(locale: LocalLocale, slug: string): Metadata {
  const guide = localGuideBySlug(locale, slug);
  if (!guide) return {};
  const metadata = pageMetadata({
    title: guide.title,
    description: guide.description,
    path: localGuidePath(locale, guide.slug),
    article: { publishedTime: guide.published, modifiedTime: guide.updated },
    ogLocale: GUIDE_LABELS[locale].ogLocale,
    languages: languagePaths(guide.en),
  });
  return guide.title.includes(SITE_NAME) ? { ...metadata, title: { absolute: guide.title } } : metadata;
}

export function LocalGuidePage({ locale, slug }: { locale: LocalLocale; slug: string }) {
  const guide = localGuideBySlug(locale, slug);
  if (!guide) notFound();

  const related = guide.related
    .map((s) => localGuideBySlug(locale, s))
    .filter((g): g is LocalGuide => g !== undefined)
    .map((g) => ({ href: localGuidePath(locale, g.slug), tag: g.tag, title: g.title }));

  return (
    <GuideArticle
      guide={guide}
      path={localGuidePath(locale, guide.slug)}
      labels={GUIDE_LABELS[locale]}
      cta={guide.cta ?? LOCAL_GUIDES[locale].cta}
      related={related}
      alternates={otherLanguages(guide.en, locale)}
    />
  );
}
