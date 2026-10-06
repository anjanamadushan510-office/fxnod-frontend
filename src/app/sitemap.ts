import type { MetadataRoute } from "next";
import { GUIDES } from "@/content/guides";
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
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = (await getPublishedPosts()) ?? [];

  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/guides"), changeFrequency: "weekly", priority: 0.9 },
    ...GUIDES.map((guide) => ({
      url: absoluteUrl(`/guides/${guide.slug}`),
      lastModified: guide.updated,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
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
