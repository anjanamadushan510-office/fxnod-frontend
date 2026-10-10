import type { Metadata } from "next";

/**
 * The public identity of the site: the canonical origin, the name, and which
 * paths a search engine may index.
 *
 * The origin is a constant, not an env var, on purpose. Every deployment —
 * production, the staging and testing previews, the project's own
 * `*.vercel.app` alias — serves the same pages, and all of them must name the
 * one address those pages are meant to be found at.
 */
export const SITE_URL = "https://fxnod.com";
export const SITE_NAME = "FXNOD";

/** Hosts ending in this are deployment aliases and previews, never the site itself. */
export const DEPLOYMENT_HOST_SUFFIX = ".vercel.app";

export const SITE_DESCRIPTION =
  "FXNOD is a trading terminal for Deriv accounts. Trade by hand in dTrader, build a bot without code in dBot, or start a ready-made bot in Auto Hub. Free to use.";

/** 1280x720, served from /public and excluded from the middleware matcher. */
export const OG_IMAGE = {
  url: "/assets/og-image.jpg",
  width: 1280,
  height: 720,
  alt: "FXNOD",
};

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

/**
 * Indexing is opt-in. Everything behind the login renders an empty shell to a
 * signed-out crawler, so a route is kept out of search results unless it is
 * listed here. A new public page has to be added on purpose; a new app page
 * is safe by default.
 */
const INDEXABLE_PATHS = new Set(["/", "/guides", "/es/guias", "/fr/guides", "/blog", "/partner", "/about", "/risk-disclosure"]);
const INDEXABLE_PREFIXES = ["/guides/", "/es/guias/", "/fr/guides/", "/blog/"];

export function isIndexablePath(pathname: string): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (INDEXABLE_PATHS.has(path)) return true;
  return INDEXABLE_PREFIXES.some((prefix) => path.startsWith(prefix));
}

interface PageMetadataInput {
  /** Without the site name; the root layout's template appends it. */
  title: string;
  description: string;
  /** The page's own path, e.g. "/guides". Becomes the canonical URL. */
  path: string;
  /** Set for articles; switches the Open Graph type and adds the dates. */
  article?: { publishedTime: string; modifiedTime: string };
  /** Overrides the default share image. */
  image?: string;
  /** Open Graph locale of the page. English unless given. */
  ogLocale?: string;
  /**
   * The same page in each language it exists in, as hreflang -> path, the
   * page's own language included. Left out when there is only one.
   */
  languages?: Record<string, string>;
}

/**
 * Metadata for a public page. Open Graph fields are not merged with the root
 * layout's — a page that sets any of them replaces the whole object — so the
 * site name and image are repeated here rather than inherited.
 */
export function pageMetadata({
  title,
  description,
  path,
  article,
  image,
  ogLocale = "en_US",
  languages,
}: PageMetadataInput): Metadata {
  const images = image ? [{ url: image, alt: title }] : [OG_IMAGE];
  return {
    title,
    description,
    alternates: languages ? { canonical: path, languages } : { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: ogLocale,
      images,
      ...(article
        ? { type: "article", publishedTime: article.publishedTime, modifiedTime: article.modifiedTime }
        : { type: "website" }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((i) => i.url),
    },
  };
}
