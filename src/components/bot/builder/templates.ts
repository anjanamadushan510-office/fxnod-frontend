import type { BotStrategy } from "@/services/api/model";
import {
  findMethod,
  findMoneyOption,
  isMethodAvailable,
  supportedEntryRules,
} from "./catalog";
import { newDraft, type BotDraft } from "./draft";
import { newCondition, supportsConditions } from "./conditions";

/**
 * Ready-made bots. Each is a complete draft, not a label: opening one fills
 * every step, and the user can change anything before running it.
 *
 * A template whose method, rule or staking mode the engine cannot run yet is
 * still listed — it tells people what is coming — but it cannot be opened.
 */
export interface BotTemplate {
  id: string;
  title: string;
  badge: string;
  description: string;
  build: () => BotDraft;
}

const R_10 = "R_10";
const R_25 = "R_25";

export const BOT_TEMPLATES: BotTemplate[] = [
  {
    id: "custom-even-streak",
    title: "Odd after an even streak",
    badge: "Custom conditions",
    description: "Wait for 4 even digits, then buy Odd. Wait 5 seconds after settlement. Edit every rule.",
    build: () => {
      const d = newDraft("even_odd");
      return { ...d, name: "Odd after an even streak", entryConditions: { match: "all", rules: [{ ...newCondition(), operator: "even", count: 4 }], cooldown_seconds: 5 }, form: { ...d.form, symbols: [R_10], direction: "down", maxTrades: "20" } };
    },
  },
  {
    id: "custom-digit-frequency",
    title: "Differs with a frequency filter",
    badge: "Custom conditions",
    description: "Buy Differs 5 only when digit 5 is below 8% of the last 100 ticks. Customise the sample and threshold.",
    build: () => {
      const d = newDraft("differs");
      return { ...d, name: "Differs with a frequency filter", entryConditions: { match: "all", rules: [{ ...newCondition("digit_frequency"), operator: "lt", value: 5, window: 100, percent: 8 }], cooldown_seconds: 3 }, form: { ...d.form, symbols: [R_10], digit: 5, maxTrades: "20" } };
    },
  },
  {
    id: "custom-price-reversal",
    title: "Rise after three falling moves",
    badge: "Custom conditions",
    description: "Wait for 3 falling price moves AND a final digit above 2, then buy Rise. Both conditions must match.",
    build: () => {
      const d = newDraft("rise_fall");
      return { ...d, name: "Rise after three falling moves", entryConditions: { match: "all", rules: [{ ...newCondition("price_streak"), operator: "down", count: 3 }, { ...newCondition("last_digit"), operator: "gt", value: 2 }], cooldown_seconds: 5 }, form: { ...d.form, symbols: [R_10], direction: "up", maxTrades: "20" } };
    },
  },
  {
    id: "even-odd-first",
    title: "Even / Odd — first bot",
    badge: "Best start",
    description: "Trades Even on a calm index. Same stake. Stops at your profit or loss cap.",
    build: () => {
      const d = newDraft("even_odd");
      return { ...d, name: "Even / Odd — first bot", form: { ...d.form, symbols: [R_10], direction: "up" } };
    },
  },
  {
    id: "differs-last-digit",
    title: "Differs — last digit",
    badge: "Wins often",
    description: "Wins if the last digit is not 5. Wins often, pays a little. Same stake.",
    build: () => {
      const d = newDraft("differs");
      return { ...d, name: "Differs — last digit", form: { ...d.form, symbols: [R_10], digit: 5 } };
    },
  },
  {
    id: "over-under-flip",
    title: "Over / Under — switch",
    badge: "Popular",
    description: "Starts Under 7. After a loss, takes the other side. Same stake.",
    build: () => {
      const d = newDraft("over_under");
      return {
        ...d,
        name: "Over / Under — switch",
        entryRule: "flip_after_loss",
        form: { ...d.form, symbols: [R_25], direction: "down", barrierDigit: 7 },
      };
    },
  },
  {
    id: "even-odd-fade-streak",
    title: "Even / Odd — fade a streak",
    badge: "Simple",
    description: "Waits for 3 even or 3 odd ticks, then bets the other side. Same stake.",
    build: () => {
      const d = newDraft("even_odd");
      return {
        ...d,
        name: "Even / Odd — fade a streak",
        entryRule: "streak_fade",
        form: { ...d.form, symbols: [R_10] },
      };
    },
  },
  {
    id: "rise-fall-follow",
    title: "Rise / Fall — follow ticks",
    badge: "Direction",
    description: "Buys Rise if the last tick went up, Fall if it went down. 5-tick contracts.",
    build: () => {
      const d = newDraft("rise_fall");
      return {
        ...d,
        name: "Rise / Fall — follow ticks",
        entryRule: "copy_last_tick",
        form: { ...d.form, symbols: [R_10] },
      };
    },
  },
  {
    id: "rise-fall-martingale",
    title: "Rise / Fall — Martingale",
    badge: "Careful",
    description: "Always Rise, doubles after a loss, at most 3 times. A long losing run ends the session.",
    build: () => {
      const d = newDraft("rise_fall");
      return {
        ...d,
        name: "Rise / Fall — Martingale",
        money: "martingale",
        form: {
          ...d.form,
          symbols: [R_10],
          direction: "up",
          martingaleMultiplier: "2",
          martingaleMaxSteps: "3",
        },
      };
    },
  },
  {
    id: "accumulator-band",
    title: "Accumulator — grow in a band",
    badge: "Grow",
    description: "Payout grows 1% each tick while price stays in its band. Takes profit at $0.20.",
    build: () => {
      const d = newDraft("accumulators");
      return {
        ...d,
        name: "Accumulator — grow in a band",
        form: { ...d.form, symbols: [R_10], growthRate: 1, takeProfit: "0.20" },
      };
    },
  },
];

/** Whether everything a template relies on is something the engine runs today. */
export function isTemplateAvailable(
  template: BotTemplate,
  strategies: readonly BotStrategy[],
): boolean {
  const draft = template.build();
  const method = findMethod(draft.method);
  if (!method || !isMethodAvailable(method, strategies)) return false;
  const strategy = strategies.find((s) => s.strategy_id === method.strategyId);
  return (
    (!draft.entryConditions || supportsConditions(strategy)) &&
    supportedEntryRules(strategy).has(draft.entryRule) &&
    Boolean(findMoneyOption(draft.money)?.available)
  );
}

export function findTemplate(id: string): BotTemplate | undefined {
  return BOT_TEMPLATES.find((t) => t.id === id);
}
