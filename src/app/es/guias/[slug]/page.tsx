import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { CTA_ES, spanishGuideBySlug, type LocalGuide } from "@/content/es/guias";
import { GUIDE_LABELS } from "@/lib/locales";
import { SITE_NAME, pageMetadata } from "@/lib/site";

interface Props {
  params: { slug: string };
}

const LABELS = GUIDE_LABELS.es;

export function generateMetadata({ params }: Props): Metadata {
  const guide = spanishGuideBySlug(params.slug);
  if (!guide) return {};
  const path = `/es/guias/${guide.slug}`;
  const english = guide.en ? `/guides/${guide.en}` : undefined;
  const metadata = pageMetadata({
    title: guide.title,
    description: guide.description,
    path,
    article: { publishedTime: guide.published, modifiedTime: guide.updated },
    ogLocale: LABELS.ogLocale,
    languages: english ? { en: english, es: path, "x-default": english } : undefined,
  });
  return guide.title.includes(SITE_NAME) ? { ...metadata, title: { absolute: guide.title } } : metadata;
}

/** /es/guias/[slug] — one guide in Spanish. */
export default function GuiaPage({ params }: Props) {
  const guide = spanishGuideBySlug(params.slug);
  if (!guide) notFound();

  const related = guide.related
    .map(spanishGuideBySlug)
    .filter((g): g is LocalGuide => g !== undefined)
    .map((g) => ({ href: `/es/guias/${g.slug}`, tag: g.tag, title: g.title }));

  return (
    <GuideArticle
      guide={guide}
      path={`/es/guias/${guide.slug}`}
      labels={LABELS}
      cta={guide.cta ?? CTA_ES}
      related={related}
      alternate={guide.en ? { href: `/guides/${guide.en}`, label: "English", hrefLang: "en" } : undefined}
    />
  );
}
