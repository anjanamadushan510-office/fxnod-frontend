/**
 * The guides written in languages other than English, and how a guide in one
 * language finds the same guide in another.
 *
 * A local guide names the English guide it corresponds to (`en`). That one
 * field is the whole mapping: every hreflang link, in the page head and in
 * the sitemap, is derived from it here, so the two can never disagree.
 */
import type { GuideCta, LocalGuide } from "./guides";
import { CTA_ES, ES_GUIDES } from "./es/guias";
import { CTA_FR, FR_GUIDES } from "./fr/guides";
import { GUIDE_LABELS, LOCAL_LOCALES, type LocalLocale } from "@/lib/locales";

export const LOCAL_GUIDES: Record<LocalLocale, { guides: LocalGuide[]; cta: GuideCta }> = {
  es: { guides: ES_GUIDES, cta: CTA_ES },
  fr: { guides: FR_GUIDES, cta: CTA_FR },
};

export function localGuideBySlug(locale: LocalLocale, slug: string): LocalGuide | undefined {
  return LOCAL_GUIDES[locale].guides.find((g) => g.slug === slug);
}

export function localGuidePath(locale: LocalLocale, slug: string): string {
  return `${GUIDE_LABELS[locale].guidesPath}/${slug}`;
}

/**
 * Every address of one guide, as hreflang -> path, the English one included.
 * Undefined when the guide exists in English only, or in one local language
 * with no English equivalent: a page with nothing to point at declares nothing.
 */
export function languagePaths(englishSlug: string | undefined): Record<string, string> | undefined {
  if (!englishSlug) return undefined;
  const english = `/guides/${englishSlug}`;
  const paths: Record<string, string> = { en: english };
  for (const locale of LOCAL_LOCALES) {
    const local = LOCAL_GUIDES[locale].guides.find((g) => g.en === englishSlug);
    if (local) paths[locale] = localGuidePath(locale, local.slug);
  }
  if (Object.keys(paths).length === 1) return undefined;
  return { ...paths, "x-default": english };
}

/** The links to a guide's other languages, for the page itself. */
export function otherLanguages(
  englishSlug: string | undefined,
  current: string,
): { href: string; label: string; hrefLang: string }[] {
  const paths = languagePaths(englishSlug);
  if (!paths) return [];
  return Object.entries(paths)
    .filter(([lang]) => lang !== "x-default" && lang !== current)
    .map(([lang, href]) => ({ href, hrefLang: lang, label: GUIDE_LABELS[lang as keyof typeof GUIDE_LABELS].name }));
}
