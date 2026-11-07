/**
 * Every public guide, grouped the way the guides page shows them.
 *
 * `GUIDES` in guides.ts stays the tool guides alone: the landing page lists
 * those four. Anything that must know about every guide (the guides page, a
 * guide's own page, the sitemap) reads from here.
 */
import { GUIDES, type Guide, type GuideCta, type GuideProvenance, type GuideSource } from "./guides";
import { AUTOHUB_BOT_GUIDES } from "./autohubBots";
import { AUTOMATION_GUIDES } from "./learnAutomation";
import { BASICS_GUIDES } from "./learnBasics";
import { BOT_GUIDES } from "./learnBots";
import { BOT_MORE_GUIDES } from "./learnBotsMore";
import { CHART_GUIDES } from "./learnCharts";
import { CONCEPT_GUIDES } from "./learnConcepts";
import { CONTRACT_GUIDES } from "./learnContracts";
import { CHECKED as COUNTRY_CHECKED, COUNTRY_GUIDES } from "./learnCountries";
import { CHECKED as DERIV_CHECKED, DERIV_GUIDES } from "./learnDeriv";
import { DERIV_MORE_GUIDES } from "./learnDerivMore";
import { MARKET_GUIDES } from "./learnMarkets";
import { MINDSET_GUIDES } from "./learnMindset";
import { PRACTICE_GUIDES } from "./learnPractice";
import { STAKING_GUIDES } from "./learnStaking";
import { SYNTHETIC_GUIDES } from "./learnSynthetics";

export interface GuideSection {
  id: string;
  title: string;
  intro: string;
  /** What a reader of this section can do next in FXNOD. */
  cta: GuideCta;
  guides: Guide[];
}

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "tools",
    title: "FXNOD tools",
    intro: "One guide per tool, written by the team that builds them.",
    cta: {
      title: "Try it on a demo account",
      text: "Create an FXNOD account, connect your Deriv demo account, and use every tool with virtual funds.",
    },
    guides: GUIDES,
  },
  {
    id: "auto-hub-bots",
    title: "Auto Hub bots",
    intro: "One guide per ready-made bot: the contract it trades, when it enters, how its stake moves and how to start it.",
    cta: {
      title: "Start one on your Deriv demo account",
      text: "Every Auto Hub bot runs on FXNOD's servers and cannot start without a stop loss. Connect your Deriv demo account, pick a bot, and watch a full session with virtual funds.",
    },
    guides: AUTOHUB_BOT_GUIDES,
  },
  {
    id: "automated-trading",
    title: "Automated trading",
    intro: "What a trading bot is, how to choose and test one, and how to limit what it can lose.",
    cta: {
      title: "Run a bot that keeps its limits",
      text: "FXNOD's bots run on its servers and will not start without a stop loss, so your limits hold when your device is off. Build one in Bot Forge or start a ready-made one in Auto Hub, on your Deriv demo account first.",
    },
    guides: [...BOT_GUIDES, ...BOT_MORE_GUIDES, ...AUTOMATION_GUIDES],
  },
  {
    id: "trading-basics",
    title: "Trading basics",
    intro: "Charts, risk and discipline: what to understand before any tool is useful.",
    cta: {
      title: "Practise it with virtual funds",
      text: "Trade Pilot gives you a live chart and Deriv's contracts on your demo account. There is nothing to install; check the required package in Discover.",
    },
    guides: BASICS_GUIDES,
  },
  {
    id: "how-markets-work",
    title: "How markets work",
    intro: "Why prices move, what news and volatility do, and how the common indicators and orders work.",
    cta: {
      title: "Watch it on a live chart",
      text: "Open Trade Pilot with your Deriv demo account, pick a market, and see how the price behaves tick by tick, with virtual funds.",
    },
    guides: MARKET_GUIDES,
  },
  {
    id: "charts-and-indicators",
    title: "Charts and indicators",
    intro: "What each tool measures, how it is calculated, and where it stops being useful.",
    cta: {
      title: "Put it on a chart",
      text: "Trade Pilot's chart has moving averages, RSI and Bollinger Bands, and a bot in Bot Forge can use indicators to choose its side. Try both on your Deriv demo account.",
    },
    guides: CHART_GUIDES,
  },
  {
    id: "trading-concepts",
    title: "Trading concepts",
    intro: "Leverage, margin, pips, stops and the markets people ask about, each with a worked example.",
    cta: {
      title: "Try it without risking money",
      text: "Connect your Deriv demo account to FXNOD and place the trade you just read about with virtual funds. Check the available tool packages in Discover.",
    },
    guides: CONCEPT_GUIDES,
  },
  {
    id: "trading-practice",
    title: "Trading practice",
    intro: "Sizing a trade, surviving a drawdown, testing an idea, and choosing who to trust.",
    cta: {
      title: "Test your rules before you fund them",
      text: "Turn a rule into a bot in Bot Forge by answering questions, run it on your Deriv demo account, and read the result trade by trade.",
    },
    guides: PRACTICE_GUIDES,
  },
  {
    id: "trading-reality",
    title: "Trading reality",
    intro: "What it costs, how long it takes, why most lose, and the services sold around it.",
    cta: {
      title: "Learn the mechanics at no cost",
      text: "FXNOD tools require a package, with any temporary $0 offer clearly marked in Discover. Use your Deriv demo account to practise with virtual funds before trading real money.",
    },
    guides: MINDSET_GUIDES,
  },
  {
    id: "deriv-questions",
    title: "Deriv questions",
    intro: "What people ask about Deriv itself, answered from Deriv's own pages. FXNOD is independent of Deriv.",
    cta: {
      title: "Use your Deriv account from FXNOD",
      text: "FXNOD is an independent terminal for your own Deriv account. You sign in on Deriv's page, your balance stays at Deriv, and you can trade by hand or run a bot. Start on the demo account.",
    },
    guides: [...DERIV_GUIDES, ...DERIV_MORE_GUIDES],
  },
  {
    id: "deriv-by-country",
    title: "Deriv by country",
    intro: "What traders in Deriv's largest markets ask: local payments, currency, and how to check who is licensed.",
    cta: {
      title: "Funded your account? Keep your limits when the phone is off",
      text: "FXNOD runs a bot on your own Deriv account from its servers, with a stop loss it will not start without. Sign in on Deriv's own page, and try it on the demo account first.",
    },
    guides: COUNTRY_GUIDES,
  },
  {
    id: "deriv-trade-types",
    title: "Deriv trade types",
    intro: "One guide per contract: what wins, what it pays, and the win rate it needs to break even.",
    cta: {
      title: "Try this contract on demo",
      text: "Every trade type in these guides is in Trade Pilot, and a bot in Bot Forge can buy it. Read the quoted payout and try it with Deriv's virtual funds.",
    },
    guides: CONTRACT_GUIDES,
  },
  {
    id: "synthetic-indices",
    title: "Synthetic indices",
    intro: "What each family of synthetic index is built to do, and what that means for a trade.",
    cta: {
      title: "Trade a synthetic index on demo",
      text: "Pick any index your Deriv account offers in Trade Pilot, or let a bot trade it at a flat stake with a required stop loss. Virtual funds first.",
    },
    guides: SYNTHETIC_GUIDES,
  },
  {
    id: "stake-strategies",
    title: "Stake strategies",
    intro: "Martingale and its relatives, worked through step by step, and what no staking system can change.",
    cta: {
      title: "See the stakes before you start",
      text: "Bot Forge shows the stakes of a losing streak before a bot runs, will not start without a stop loss, and caps the largest stake. Try any stake setting on your Deriv demo account.",
    },
    guides: STAKING_GUIDES,
  },
];

export const ALL_GUIDES: Guide[] = GUIDE_SECTIONS.flatMap((section) => section.guides);

export function guideBySlug(slug: string): Guide | undefined {
  return ALL_GUIDES.find((g) => g.slug === slug);
}

/**
 * Outside pages a guide can be checked against, each found from what the
 * guide's own text says it relies on ("Deriv's regulatory page", "the Capital
 * Markets Authority"). A guide that names none gets no source list rather than
 * a borrowed one: a link is only added where the text already rests on it.
 */
const SOURCE_RULES: { pattern: RegExp; source: GuideSource }[] = [
  { pattern: /regulatory page/i, source: { label: "Deriv: regulatory information", href: "https://deriv.com/regulatory" } },
  { pattern: /payment (methods )?page/i, source: { label: "Deriv: payment methods", href: "https://deriv.com/payment-methods" } },
  { pattern: /help centre/i, source: { label: "Deriv: help centre", href: "https://deriv.com/help-centre" } },
  { pattern: /contact( us)? page/i, source: { label: "Deriv: contact us", href: "https://deriv.com/contact-us" } },
  {
    pattern: /synthetic indices page/i,
    source: { label: "Deriv: synthetic indices", href: "https://deriv.com/markets/derived-indices/synthetic-indices" },
  },
  { pattern: /Deriv's terms/, source: { label: "Deriv: terms and conditions", href: "https://deriv.com/terms-and-conditions" } },
  { pattern: /Chief Executive Officer/, source: { label: "Deriv: who we are", href: "https://deriv.com/who-we-are" } },
  {
    pattern: /Capital Markets Authority/,
    source: { label: "Capital Markets Authority (Kenya)", href: "https://www.cma.or.ke/" },
  },
  {
    pattern: /Securities and Exchange Commission/,
    source: { label: "Securities and Exchange Commission (Nigeria)", href: "https://sec.gov.ng/" },
  },
  {
    pattern: /Financial Sector Conduct Authority/,
    source: { label: "Financial Sector Conduct Authority (South Africa)", href: "https://www.fsca.co.za/" },
  },
];

function guideText(guide: Guide): string {
  const blocks = guide.body.map((block) => {
    switch (block.type) {
      case "h2":
      case "p":
        return block.text;
      case "note":
        return `${block.title} ${block.text}`;
      case "list":
        return block.items.join(" ");
      case "steps":
        return block.items.map((step) => `${step.title} ${step.text}`).join(" ");
      case "table":
        return [block.head, ...block.rows].flat().join(" ");
      case "links":
        return block.items.map((item) => `${item.label} ${item.text}`).join(" ");
    }
  });
  return [guide.answer, ...blocks, ...guide.faq.flatMap((item) => [item.q, item.a])].join(" ");
}

/** Modules whose Deriv statements were read on Deriv's pages, and when. */
const DERIV_READ_ON = new Map<Guide, string>([
  ...[...DERIV_GUIDES, ...DERIV_MORE_GUIDES, ...BOT_MORE_GUIDES, ...CONTRACT_GUIDES, ...SYNTHETIC_GUIDES].map(
    (guide): [Guide, string] => [guide, DERIV_CHECKED],
  ),
  ...COUNTRY_GUIDES.map((guide): [Guide, string] => [guide, COUNTRY_CHECKED]),
]);

const INDEPENDENT =
  "FXNOD is independent of Deriv. Deriv can change its terms, and what applies to you depends on your country: confirm anything that matters on deriv.com before you act on it.";

/** How a guide was checked, and the outside pages it rests on. */
export function provenanceFor(guide: Guide): GuideProvenance {
  const text = guideText(guide);
  const sources = SOURCE_RULES.filter((rule) => rule.pattern.test(text)).map((rule) => rule.source);
  if (GUIDES.includes(guide)) {
    return {
      text: "Written by the team that builds FXNOD, from the product itself. When a tool changes in a way this page describes, the page changes in the same release.",
      sources,
    };
  }
  if (AUTOHUB_BOT_GUIDES.includes(guide)) {
    return {
      text: "The contract, entry rule, stake plan and stop-loss plans on this page come from FXNOD's Auto Hub bot catalogue, and the page changes when the bot does.",
      sources,
    };
  }
  const readOn = DERIV_READ_ON.get(guide);
  if (readOn) {
    const worked = CONTRACT_GUIDES.includes(guide)
      ? " Odds and break-even win rates are worked out on the page from the payout, so the arithmetic can be checked."
      : "";
    return {
      text: `Statements about Deriv on this page were read on Deriv's own website on ${readOn} and are written as what Deriv says.${worked} ${INDEPENDENT}`,
      sources,
    };
  }
  return {
    text:
      sources.length > 0
        ? `A general explanation written by the FXNOD team. Where it relies on a page outside FXNOD, that page is linked below. ${INDEPENDENT}`
        : "A general explanation written by the FXNOD team. It gives no advice and makes no promise of results.",
    sources,
  };
}

/** A guide's own call to action, or its section's. */
export function ctaFor(guide: Guide): GuideCta {
  if (guide.cta) return guide.cta;
  const section = GUIDE_SECTIONS.find((s) => s.guides.includes(guide));
  return (section ?? GUIDE_SECTIONS[0]).cta;
}
