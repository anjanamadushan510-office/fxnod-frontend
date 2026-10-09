/**
 * Every public guide, grouped the way the guides page shows them.
 *
 * `GUIDES` in guides.ts stays the tool guides alone: the landing page lists
 * those four. Anything that must know about every guide (the guides page, a
 * guide's own page, the sitemap) reads from here.
 */
import { GUIDES, type Guide } from "./guides";
import { AUTOMATION_GUIDES } from "./learnAutomation";
import { BASICS_GUIDES } from "./learnBasics";
import { BOT_GUIDES } from "./learnBots";
import { BOT_MORE_GUIDES } from "./learnBotsMore";
import { CHART_GUIDES } from "./learnCharts";
import { CONCEPT_GUIDES } from "./learnConcepts";
import { CONTRACT_GUIDES } from "./learnContracts";
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
  guides: Guide[];
}

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "tools",
    title: "FXNOD tools",
    intro: "One guide per tool, written by the team that builds them.",
    guides: GUIDES,
  },
  {
    id: "automated-trading",
    title: "Automated trading",
    intro: "What a trading bot is, how to choose and test one, and how to limit what it can lose.",
    guides: [...BOT_GUIDES, ...BOT_MORE_GUIDES, ...AUTOMATION_GUIDES],
  },
  {
    id: "trading-basics",
    title: "Trading basics",
    intro: "Charts, risk and discipline: what to understand before any tool is useful.",
    guides: BASICS_GUIDES,
  },
  {
    id: "how-markets-work",
    title: "How markets work",
    intro: "Why prices move, what news and volatility do, and how the common indicators and orders work.",
    guides: MARKET_GUIDES,
  },
  {
    id: "charts-and-indicators",
    title: "Charts and indicators",
    intro: "What each tool measures, how it is calculated, and where it stops being useful.",
    guides: CHART_GUIDES,
  },
  {
    id: "trading-concepts",
    title: "Trading concepts",
    intro: "Leverage, margin, pips, stops and the markets people ask about, each with a worked example.",
    guides: CONCEPT_GUIDES,
  },
  {
    id: "trading-practice",
    title: "Trading practice",
    intro: "Sizing a trade, surviving a drawdown, testing an idea, and choosing who to trust.",
    guides: PRACTICE_GUIDES,
  },
  {
    id: "trading-reality",
    title: "Trading reality",
    intro: "What it costs, how long it takes, why most lose, and the services sold around it.",
    guides: MINDSET_GUIDES,
  },
  {
    id: "deriv-questions",
    title: "Deriv questions",
    intro: "What people ask about Deriv itself, answered from Deriv's own pages. FXNOD is independent of Deriv.",
    guides: [...DERIV_GUIDES, ...DERIV_MORE_GUIDES],
  },
  {
    id: "deriv-trade-types",
    title: "Deriv trade types",
    intro: "One guide per contract: what wins, what it pays, and the win rate it needs to break even.",
    guides: CONTRACT_GUIDES,
  },
  {
    id: "synthetic-indices",
    title: "Synthetic indices",
    intro: "What each family of synthetic index is built to do, and what that means for a trade.",
    guides: SYNTHETIC_GUIDES,
  },
  {
    id: "stake-strategies",
    title: "Stake strategies",
    intro: "Martingale and its relatives, worked through step by step, and what no staking system can change.",
    guides: STAKING_GUIDES,
  },
];

export const ALL_GUIDES: Guide[] = GUIDE_SECTIONS.flatMap((section) => section.guides);

export function guideBySlug(slug: string): Guide | undefined {
  return ALL_GUIDES.find((g) => g.slug === slug);
}
