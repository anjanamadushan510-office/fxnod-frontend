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

> FXNOD is a web trading terminal for Deriv accounts. A user connects their own Deriv account and uses it from three tools: Trade Pilot (manual trading), Bot Forge (a bot builder that needs no code) and Auto Hub (ready-made bots). Every new account gets a 7-day Pro trial of all three tools at no cost; after that each tool requires a package, bought in Discover and paid from the FXNOD Wallet in USDT. FXNOD is an independent product and is not affiliated with Deriv, Bybit or Binance.

Facts that are easy to get wrong:

- Deriv is the only venue that is live. Tools for Bybit and Binance are planned and are not available yet.
- How to start: sign up with email, enter the emailed code, connect a Deriv account under Connected Accounts (sign-in happens on Deriv's own page), select the Deriv demo account, then open a tool. Signing up with Google or Apple is not available yet.
- How to pay: open Wallet, press Top up, choose TRC-20 (Tron) or BEP-20 (BNB Smart Chain), and send USDT on that network only to the address shown (minimum 1 USDT; ERC-20 and other coins are not credited). The wallet is credited automatically after 19 confirmations on Tron or 15 on BNB Smart Chain. Then buy a package in Discover; it is paid from the wallet balance and never renews automatically.
- Packages are Basic or Pro per tool, a Complete toolkit (Pro on all three) and Auto Hub team packages, each for one month, six months or lifetime. On Bot Forge and Auto Hub, Basic runs bots on demo accounts only; Pro also runs them on real accounts. Discover shows current prices.
- The FXNOD Wallet only pays for packages. Moving its funds to a Deriv account is planned and not available yet.
- Trade Pilot and Bot Forge are FXNOD's own tools. They are not Deriv's products of similar names.
- FXNOD does not hold a user's trading balance. It stays in the user's Deriv account.
- No tool guarantees a profit. Every guide carries a risk warning.`;

const ABOUT = `## About

- [How to start trading on FXNOD](${absoluteUrl("/guides/how-to-start-trading-on-fxnod")}): sign-up, the 7-day trial, connecting Deriv.
- [How to pay for FXNOD](${absoluteUrl("/guides/how-to-pay-for-fxnod")}): USDT top-ups, packages and prices.
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
