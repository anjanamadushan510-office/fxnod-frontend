import type { MetadataRoute } from "next";
import { ALL_GUIDES } from "@/content/library";
import { LOCAL_GUIDES, languagePaths, localGuidePath } from "@/content/localGuides";
import { GUIDE_LABELS, LOCAL_LOCALES } from "@/lib/locales";
import { getPublishedPosts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/site";

// Blog posts are published from the admin console, so the list is rebuilt
// hourly rather than only at deploy time.
export const revalidate = 3600;

/**
 * Every page that is meant to be found. It must agree with `isIndexablePath`
 * in lib/site.ts: a URL listed here and then answered with `noindex` is a
 * contradiction search engines report as an error.
 *
 * `lastModified` is given only where it is known. A build timestamp on every
 * entry teaches a crawler to ignore the field.
 */
/** The hreflang entries of one guide, as absolute URLs, where it has other languages. */
function alternates(englishSlug: string | undefined) {
  const paths = languagePaths(englishSlug);
  if (!paths) return {};
  const languages = Object.fromEntries(
    Object.entries(paths)
      .filter(([lang]) => lang !== "x-default")
      .map(([lang, path]) => [lang, absoluteUrl(path)]),
  );
  return { alternates: { languages } };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = (await getPublishedPosts()) ?? [];

  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/guides"), changeFrequency: "weekly", priority: 0.9 },
    ...ALL_GUIDES.map((guide) => ({
      url: absoluteUrl(`/guides/${guide.slug}`),
      lastModified: guide.updated,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      ...alternates(guide.slug),
    })),
    ...LOCAL_LOCALES.flatMap((locale) => [
      { url: absoluteUrl(GUIDE_LABELS[locale].guidesPath), changeFrequency: "weekly" as const, priority: 0.8 },
      ...LOCAL_GUIDES[locale].guides.map((guide) => ({
        url: absoluteUrl(localGuidePath(locale, guide.slug)),
        lastModified: guide.updated,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        ...alternates(guide.en),
      })),
    ]),
    { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.6 },
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: absoluteUrl("/partner"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/risk-disclosure"), changeFrequency: "yearly", priority: 0.3 },
  ];
}
