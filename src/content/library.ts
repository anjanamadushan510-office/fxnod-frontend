/**
 * Every public guide, grouped the way the guides page shows them.
 *
 * `GUIDES` in guides.ts stays the tool guides alone: the landing page lists
 * those four. Anything that must know about every guide (the guides page, a
 * guide's own page, the sitemap) reads from here.
 */
import { GUIDES, type Guide } from "./guides";
import { BASICS_GUIDES } from "./learnBasics";
import { BOT_GUIDES } from "./learnBots";
import { DERIV_GUIDES } from "./learnDeriv";
import { MARKET_GUIDES } from "./learnMarkets";
import { PRACTICE_GUIDES } from "./learnPractice";

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
    guides: BOT_GUIDES,
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
    id: "trading-practice",
    title: "Trading practice",
    intro: "Sizing a trade, surviving a drawdown, testing an idea, and choosing who to trust.",
    guides: PRACTICE_GUIDES,
  },
  {
    id: "deriv-questions",
    title: "Deriv questions",
    intro: "What people ask about Deriv itself, answered from Deriv's own pages. FXNOD is independent of Deriv.",
    guides: DERIV_GUIDES,
  },
];

export const ALL_GUIDES: Guide[] = GUIDE_SECTIONS.flatMap((section) => section.guides);

export function guideBySlug(slug: string): Guide | undefined {
  return ALL_GUIDES.find((g) => g.slug === slug);
}
