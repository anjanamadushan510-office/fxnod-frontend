import { GUIDE_SECTIONS } from "@/content/library";
import { LOCAL_GUIDES, localGuidePath } from "@/content/localGuides";
import { GUIDE_LABELS, LOCAL_LOCALES } from "@/lib/locales";
import { absoluteUrl } from "@/lib/site";

/**
 * /llms.txt — the site described for AI assistants, in Markdown.
 *
 * The guide list is built from the guides themselves. It was a hand-written
 * file, which was accurate for four guides and would have gone stale with
 * every one added after them.
 */
export const dynamic = "force-static";

const INTRO = `# FXNOD

> FXNOD is a web trading terminal for Deriv accounts. A user connects their own Deriv account and uses it from three tools: dTrader (manual trading), dBot (a bot builder that needs no code) and Auto Hub (ready-made bots). The tools are free to use. FXNOD is an independent product and is not affiliated with Deriv, Bybit or Binance.

Facts that are easy to get wrong:

- Deriv is the only venue that is live. Tools for Bybit and Binance are planned and are not available yet.
- Wallet top-ups, transfers to Deriv and monthly plans are planned and are not available yet.
- FXNOD's dTrader and dBot are FXNOD's own tools. They are not Deriv's products of similar names.
- FXNOD does not hold a user's trading balance. It stays in the user's Deriv account.
- No tool guarantees a profit. Every guide carries a risk warning.`;

const ABOUT = `## About

- [About FXNOD](${absoluteUrl("/about")}): what is live and what is coming soon.
- [Risk warning](${absoluteUrl("/risk-disclosure")}): what the tools do and do not protect a trader from.
- [Partner programme](${absoluteUrl("/partner")}): how inviting others is paid.
- [Blog](${absoluteUrl("/blog")}): product news and updates.`;

export function GET(): Response {
  const sections = GUIDE_SECTIONS.map((section) => {
    const lines = section.guides.map(
      (guide) => `- [${guide.title}](${absoluteUrl(`/guides/${guide.slug}`)}): ${guide.description}`,
    );
    return `## Guides: ${section.title}\n\n${lines.join("\n")}`;
  });

  const local = LOCAL_LOCALES.map((locale) => {
    const lines = LOCAL_GUIDES[locale].guides.map(
      (guide) => `- [${guide.title}](${absoluteUrl(localGuidePath(locale, guide.slug))}): ${guide.description}`,
    );
    return `## ${GUIDE_LABELS[locale].index.llmsHeading}\n\n${lines.join("\n")}`;
  });

  return new Response(`${[INTRO, ...sections, ...local, ABOUT].join("\n\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
