"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { startAnalytics, trackGuideView, trackPageView } from "@/lib/analytics";
import { localeOfPath } from "@/lib/locales";

/** Where each language's guides live. A guide is one segment below its prefix. */
const GUIDE_PREFIXES = ["/guides/", "/es/guias/", "/fr/guides/", "/si/guides/"];

function guideSlug(pathname: string): string | null {
  const prefix = GUIDE_PREFIXES.find((p) => pathname.startsWith(p));
  if (!prefix) return null;
  const slug = pathname.slice(prefix.length).replace(/\/+$/, "");
  return slug !== "" && !slug.includes("/") ? slug : null;
}

/**
 * Loads Google Analytics on the public site and reports each page a visitor
 * opens. Renders nothing.
 *
 * The page view is sent from here, on every change of path, and not by the
 * tag: this is a single-page app, and the tag's own view would carry the
 * address with its whole query string (see lib/analytics.ts).
 *
 * usePathname and not useSearchParams: a change of query alone is not a new
 * page, and useSearchParams this high up would need a Suspense boundary
 * around the whole app.
 */
export function Analytics() {
  const pathname = usePathname();
  const previous = useRef<string | null>(null);

  useEffect(() => {
    startAnalytics();
  }, []);

  useEffect(() => {
    // The first view came from wherever the browser says; later ones from the
    // page before, which the browser does not record inside one document.
    trackPageView(previous.current ?? document.referrer);
    previous.current = window.location.href;

    const slug = guideSlug(pathname);
    if (slug) trackGuideView(slug, localeOfPath(pathname));
  }, [pathname]);

  return null;
}
