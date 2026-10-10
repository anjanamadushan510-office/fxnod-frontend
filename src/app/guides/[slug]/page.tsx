import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticle } from "@/components/guides/GuideArticle";
import type { Guide } from "@/content/guides";
import { spanishSlugFor } from "@/content/es/guias";
import { ctaFor, guideBySlug } from "@/content/library";
import { GUIDE_LABELS } from "@/lib/locales";
import { SITE_NAME, pageMetadata } from "@/lib/site";

interface Props {
  params: { slug: string };
}

const LABELS = GUIDE_LABELS.en;

export function generateMetadata({ params }: Props): Metadata {
  const guide = guideBySlug(params.slug);
  if (!guide) return {};
  const path = `/guides/${guide.slug}`;
  const spanish = spanishSlugFor(guide.slug);
  const metadata = pageMetadata({
    title: guide.title,
    description: guide.description,
    path,
    article: { publishedTime: guide.published, modifiedTime: guide.updated },
    languages: spanish ? { en: path, es: `/es/guias/${spanish}`, "x-default": path } : undefined,
  });
  // A tool guide's title names FXNOD already; the template would repeat it.
  return guide.title.includes(SITE_NAME) ? { ...metadata, title: { absolute: guide.title } } : metadata;
}

export default function GuideDetailPage({ params }: Props) {
  const guide = guideBySlug(params.slug);
  if (!guide) notFound();

  const related = guide.related
    .map(guideBySlug)
    .filter((g): g is Guide => g !== undefined)
    .map((g) => ({ href: `/guides/${g.slug}`, tag: g.tag, title: g.title }));
  const spanish = spanishSlugFor(guide.slug);

  return (
    <GuideArticle
      guide={guide}
      path={`/guides/${guide.slug}`}
      labels={LABELS}
      cta={ctaFor(guide)}
      related={related}
      alternate={spanish ? { href: `/es/guias/${spanish}`, label: "Español", hrefLang: "es" } : undefined}
    />
  );
}
