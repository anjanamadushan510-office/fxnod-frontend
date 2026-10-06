import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Crawling is open; indexing is decided per response.
 *
 * Nothing is disallowed here on purpose. A crawler that is forbidden to fetch
 * a page never sees its `noindex`, and the address can then be listed from
 * links alone. The pages behind the login are kept out of results by the
 * X-Robots-Tag header in middleware.ts instead.
 *
 * The AI crawlers are named so that being readable by them is a recorded
 * decision, not an accident of the wildcard: the guides are written to be
 * quoted by assistants.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "PerplexityBot", "Google-Extended"],
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
