/**
 * Every public guide, grouped the way the guides page shows them.
 *
 * `GUIDES` in guides.ts stays the tool guides alone: the landing page lists
 * those four. Anything that must know about every guide (the guides page, a
 * guide's own page, the sitemap) reads from here.
 */
import { GUIDES, type Guide, type GuideCta } from "./guides";
import { AUTOMATION_GUIDES } from "./learnAutomation";
import { BASICS_GUIDES } from "./learnBasics";
import { BOT_GUIDES } from "./learnBots";
import { BOT_MORE_GUIDES } from "./learnBotsMore";
import { CHART_GUIDES } from "./learnCharts";
import { CONCEPT_GUIDES } from "./learnConcepts";
import { CONTRACT_GUIDES } from "./learnContracts";
import { COUNTRY_GUIDES } from "./learnCountries";
import { DERIV_GUIDES } from "./learnDeriv";
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
    id: "automated-trading",
    title: "Automated trading",
    intro: "What a trading bot is, how to choose and test one, and how to limit what it can lose.",
    cta: {
      title: "Run a bot that keeps its limits",
      text: "FXNOD's bots run on its servers and will not start without a stop loss, so your limits hold when your device is off. Build one in dBot or start a ready-made one in Auto Hub, on your Deriv demo account first.",
    },
    guides: [...BOT_GUIDES, ...BOT_MORE_GUIDES, ...AUTOMATION_GUIDES],
  },
  {
    id: "trading-basics",
    title: "Trading basics",
    intro: "Charts, risk and discipline: what to understand before any tool is useful.",
    cta: {
      title: "Practise it with virtual funds",
      text: "FXNOD's dTrader gives you a live chart and Deriv's contracts on your demo account. There is nothing to install and no subscription.",
    },
    guides: BASICS_GUIDES,
  },
  {
    id: "how-markets-work",
    title: "How markets work",
    intro: "Why prices move, what news and volatility do, and how the common indicators and orders work.",
    cta: {
      title: "Watch it on a live chart",
      text: "Open dTrader with your Deriv demo account, pick a market, and see how the price behaves tick by tick, with virtual funds.",
    },
    guides: MARKET_GUIDES,
  },
  {
    id: "charts-and-indicators",
    title: "Charts and indicators",
    intro: "What each tool measures, how it is calculated, and where it stops being useful.",
    cta: {
      title: "Put it on a chart",
      text: "dTrader's chart has moving averages, RSI and Bollinger Bands, and a bot in dBot can use indicators to choose its side. Try both on your Deriv demo account.",
    },
    guides: CHART_GUIDES,
  },
  {
    id: "trading-concepts",
    title: "Trading concepts",
    intro: "Leverage, margin, pips, stops and the markets people ask about, each with a worked example.",
    cta: {
      title: "Try it without risking money",
      text: "Connect your Deriv demo account to FXNOD and place the trade you just read about with virtual funds. No subscription, no sign-up fee.",
    },
    guides: CONCEPT_GUIDES,
  },
  {
    id: "trading-practice",
    title: "Trading practice",
    intro: "Sizing a trade, surviving a drawdown, testing an idea, and choosing who to trust.",
    cta: {
      title: "Test your rules before you fund them",
      text: "Turn a rule into a bot in dBot by answering questions, run it on your Deriv demo account, and read the result trade by trade.",
    },
    guides: PRACTICE_GUIDES,
  },
  {
    id: "trading-reality",
    title: "Trading reality",
    intro: "What it costs, how long it takes, why most lose, and the services sold around it.",
    cta: {
      title: "Learn the mechanics at no cost",
      text: "FXNOD has no subscription and no sign-up fee. Connect your Deriv demo account and trade, or run a bot, with virtual funds before you risk anything.",
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
      text: "Every trade type in these guides is in FXNOD's dTrader, and a bot in dBot can buy it. Read the quoted payout and try it with Deriv's virtual funds.",
    },
    guides: CONTRACT_GUIDES,
  },
  {
    id: "synthetic-indices",
    title: "Synthetic indices",
    intro: "What each family of synthetic index is built to do, and what that means for a trade.",
    cta: {
      title: "Trade a synthetic index on demo",
      text: "Pick any index your Deriv account offers in dTrader, or let a bot trade it at a flat stake with a required stop loss. Virtual funds first.",
    },
    guides: SYNTHETIC_GUIDES,
  },
  {
    id: "stake-strategies",
    title: "Stake strategies",
    intro: "Martingale and its relatives, worked through step by step, and what no staking system can change.",
    cta: {
      title: "See the stakes before you start",
      text: "dBot shows the stakes of a losing streak before a bot runs, will not start without a stop loss, and caps the largest stake. Try any stake setting on your Deriv demo account.",
    },
    guides: STAKING_GUIDES,
  },
];

export const ALL_GUIDES: Guide[] = GUIDE_SECTIONS.flatMap((section) => section.guides);

export function guideBySlug(slug: string): Guide | undefined {
  return ALL_GUIDES.find((g) => g.slug === slug);
}

/** A guide's own call to action, or its section's. */
export function ctaFor(guide: Guide): GuideCta {
  if (guide.cta) return guide.cta;
  const section = GUIDE_SECTIONS.find((s) => s.guides.includes(guide));
  return (section ?? GUIDE_SECTIONS[0]).cta;
}
