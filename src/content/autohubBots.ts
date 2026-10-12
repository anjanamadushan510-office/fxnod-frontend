/**
 * One guide per Auto Hub bot: what it trades, when it enters, how its stake
 * moves and how to start it.
 *
 * The fixed-plan bots are written from `FIXED_PLAN_BOTS`, so a bot's page,
 * the overview guide and the tables on both read the same facts. The stakes
 * of a losing run are worked out here with the rule the engine applies
 * (risk.NextStake and risk.FitsStop in trading-engine-deriv): the starting
 * stake compounded in full, rounded once to two places, and placed only while
 * it fits in what is left of the stop loss.
 *
 * These pages say what a bot does. None of them says, or may say, that a bot
 * makes money.
 */
import { compareDecimals, compoundDecimal, sumDecimals } from "@/lib/decimal";
import {
  FIXED_PLAN_BOTS,
  botGuideSlug,
  contractTicks,
  escalates,
  stakeStyle,
  type BotPlan,
  type BotFamily,
  type FixedPlanBot,
} from "./autohubCatalogue";
import { RISK_NOTE, type Guide, type GuideBlock } from "./guides";

const DATE = "2026-10-12";
const TAG = "Auto Hub bot";
const IMAGE = "/assets/login-slide-3.jpg";
const OVERVIEW = "auto-hub-ready-made-bots";

const FAMILY: Record<BotFamily, { name: string; guide: string }> = {
  rise_fall: { name: "Rise / Fall", guide: "rise-fall-explained" },
  matches_differs: { name: "Matches / Differs", guide: "matches-differs-explained" },
  even_odd: { name: "Even / Odd", guide: "even-odd-explained" },
  over_under: { name: "Over / Under", guide: "over-under-explained" },
};

const COUNT = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

/** "one tick", "five ticks". */
function tickLength(bot: FixedPlanBot): string {
  const n = contractTicks(bot);
  return n === 1 ? "one tick" : `${COUNT[n]} ticks`;
}

/** "one-tick", "five-tick". */
function tickWord(bot: FixedPlanBot): string {
  return `${COUNT[contractTicks(bot)]}-tick`;
}

function isDigitBot(bot: FixedPlanBot): boolean {
  return bot.family !== "rise_fall";
}

const VOLATILITY_MARKETS =
  "Volatility 10, 25, 50, 75 and 100, and the one-second indices from Volatility 10 (1s) to Volatility 100 (1s)";

const SUGGESTED_MARKETS =
  "Volatility 100 (1s), Volatility 100, Volatility 75 (1s), Volatility 75, Volatility 50 (1s) and Volatility 50";

/** "1" -> "1.00", "0.35" -> "0.35". */
export function money(value: string): string {
  const [whole, fraction = ""] = value.split(".");
  return `${whole}.${(fraction + "00").slice(0, 2)}`;
}

/** "20", "20 or 100", "20, 100 or 500". */
function orList(items: string[]): string {
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} or ${items[items.length - 1]}`;
}

function andList(items: string[]): string {
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

interface LosingRun {
  /** Every stake placed, the starting stake first. */
  stakes: string[];
  lost: string;
  /** The stake that does not fit and is not placed. */
  refused: string;
}

/** What a plan stakes if every trade loses, from a session that is level. */
export function losingRun(p: BotPlan): LosingRun {
  const stakes = [p.stake];
  for (let step = 1; ; step++) {
    const lost = sumDecimals(stakes);
    const room = sumDecimals([p.stopLoss, `-${lost}`]);
    const next = compoundDecimal(p.stake, p.multiplier, step, 2);
    if (next === null) throw new Error(`plan ${p.stopLoss}: not a decimal`);
    if (compareDecimals(next, room) === 1) return { stakes, lost, refused: next };
    stakes.push(next);
  }
}

/** "multiplied by 2.41 on the 20 plan and by 2.13 on the 100 and 500 plans". */
function multiplierText(plans: BotPlan[]): string {
  const groups = new Map<string, string[]>();
  for (const p of plans) groups.set(p.multiplier, [...(groups.get(p.multiplier) ?? []), p.stopLoss]);
  if (groups.size === 1) return `multiplied by ${plans[0].multiplier}`;
  const parts = Array.from(groups, ([multiplier, ids]) => `by ${multiplier} on the ${andList(ids)} plan${ids.length > 1 ? "s" : ""}`);
  return `multiplied ${andList(parts)}`;
}

function payoutText(bot: FixedPlanBot): string {
  const winning = bot.winning ?? 0;
  if (winning >= 9) return "Nine digits out of ten win, so a win pays a small fraction of the stake.";
  if (winning >= 6) return `${winning} digits out of ten win, so a win pays less than the stake.`;
  if (winning === 5) return "Five digits out of ten win, and a win pays a little less than the stake.";
  if (winning >= 3) return `${winning} digits out of ten win, so a win pays more than the stake.`;
  if (winning === 2) return "Two digits out of ten win, so a win pays several times the stake.";
  return "One digit out of ten wins, so a win pays several times the stake.";
}

function contractText(bot: FixedPlanBot): string {
  if (!isDigitBot(bot)) {
    const sides = bot.bet === "Rise" ? "Rise" : "Rise or Fall";
    return `${bot.name} trades one contract only: ${sides}, from Deriv's Rise / Fall family, with a length of ${tickLength(bot)}. A Rise wins when the price at the end of the contract is above the price it started at, and a Fall wins when it is below. A price that ends exactly where it started loses either way. A win pays a little less than the stake, and a losing trade costs the whole stake. Deriv sets the payout, and each trade's result is listed on the run page.`;
  }
  const lead = `${bot.name} trades one contract only: ${bot.bet}, from Deriv's ${FAMILY[bot.family].name} family, with a length of one tick.`;
  const digit =
    "The contract is decided by the last digit of a tick's price, which is its final decimal digit: a tick at 1234.56 ends in 6.";
  return `${lead} ${digit} A trade wins when ${bot.wins}. ${payoutText(bot)} A losing trade costs the whole stake. Deriv sets the payout, and each trade's result is listed on the run page.`;
}

function stakeBlocks(bot: FixedPlanBot): GuideBlock[] {
  if (stakeStyle(bot) === "Flat") {
    return [
      { type: "h2", text: `How ${bot.name} sizes its stake` },
      {
        type: "p",
        text: `${bot.name} uses a flat stake. Every trade of a session is placed at the plan's starting stake, after a win and after a loss alike. It does not use Martingale.`,
      },
      {
        type: "p",
        text: "A trade is placed only while its stake fits in what is left of the stop loss. When it no longer fits, the session ends instead of placing it.",
      },
    ];
  }
  const first = bot.plans[0];
  const run = losingRun(first);
  const count = run.stakes.length;
  return [
    { type: "h2", text: `How ${bot.name} sizes its stake` },
    {
      type: "p",
      text: `${bot.name} uses a Martingale stake. After a losing trade the stake is ${multiplierText(bot.plans)}; after a winning trade it returns to the starting stake. Losses in a row compound: the stake after two straight losses is the starting stake multiplied twice, rounded to two decimal places.`,
    },
    {
      type: "p",
      text: "The stop loss bounds the ladder. A stake is placed only if it is no larger than what is left of the stop loss; a step that does not fit is not placed, and the session ends there. The table shows the stakes of an unbroken run of losses from a session that is level. A session that is already in profit has more room, and one that is behind has less.",
    },
    {
      type: "table",
      head: ["Plan", "Losses in a row that fit", "Stakes if every trade loses", "Lost by then", "Next step, not placed"],
      rows: bot.plans.map((p) => {
        const r = losingRun(p);
        const stakes = r.stakes.map(money);
        // A long ladder is shown by its ends; the count beside it says how long.
        const shown = stakes.length > 8 ? [...stakes.slice(0, 4), "…", ...stakes.slice(-2)] : stakes;
        return [`Stop loss ${p.stopLoss}`, String(stakes.length), shown.join(", "), money(r.lost), money(r.refused)];
      }),
    },
    {
      type: "p",
      text: `Read the first row like this: on the stop loss ${first.stopLoss} plan, ${count} losing ${count === 1 ? "trade" : "trades in a row"} cost ${money(run.lost)} in total. The next stake would be ${money(run.refused)}, which is more than the ${money(sumDecimals([first.stopLoss, `-${run.lost}`]))} left of the stop loss, so the bot does not place it and the session ends.`,
    },
  ];
}

function planBlocks(bot: FixedPlanBot): GuideBlock[] {
  const ladder = stakeStyle(bot) === "Martingale";
  return [
    { type: "h2", text: `The plans of ${bot.name}` },
    {
      type: "p",
      text: `${bot.name} is not given a stake, a stop loss and a profit target one by one. You choose a plan, and the plan sets all of them together. Plans are named by their stop loss. The amounts are in the currency of the Deriv account the bot trades.`,
    },
    {
      type: "table",
      head: ladder
        ? ["Plan", "Starting stake", "Profit target", "Multiplier after a loss"]
        : ["Plan", "Stake per trade", "Profit target"],
      rows: bot.plans.map((p) =>
        ladder
          ? [`Stop loss ${p.stopLoss}`, p.stake, p.takeProfit, p.multiplier]
          : [`Stop loss ${p.stopLoss}`, p.stake, p.takeProfit],
      ),
    },
  ];
}

function fixedPlanGuide(bot: FixedPlanBot): Guide {
  const ladder = stakeStyle(bot) === "Martingale";
  const stops = bot.plans.map((p) => p.stopLoss);
  const planCount = bot.plans.length === 2 ? "two" : "three";
  const stakeSentence = ladder
    ? `After a losing trade its stake is ${multiplierText(bot.plans)}, and after a win it returns to the starting stake.`
    : "Its stake is the same on every trade.";
  const index = FIXED_PLAN_BOTS.indexOf(bot);
  const family = FIXED_PLAN_BOTS.filter((b) => b.family === bot.family && b !== bot);
  const sibling = family.find((b) => FIXED_PLAN_BOTS.indexOf(b) > index) ?? family[0];

  return {
    slug: botGuideSlug(bot.id),
    title: `${bot.name}: how FXNOD's Deriv ${bot.bet} bot works`,
    description: `${bot.name} is a ready-made Deriv ${bot.bet} bot in FXNOD's Auto Hub. Its contract, its entry rule, how its stake moves and the plans it starts with.`,
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: IMAGE,
    answer: `${bot.name} is a ready-made bot in FXNOD's Auto Hub that buys Deriv's ${tickWord(bot)} ${bot.bet} contract, which wins when ${bot.wins}. ${bot.rule} ${stakeSentence} You start it on one market with one of ${planCount} fixed plans, with a stop loss of ${orList(stops)}, and the session ends at the plan's profit target or its stop loss.`,
    body: [
      { type: "h2", text: `${bot.name} at a glance` },
      {
        type: "table",
        head: ["", bot.name],
        rows: [
          ["Contract", `${bot.bet}, ${tickLength(bot)} (Deriv ${FAMILY[bot.family].name})`],
          ["A trade wins when", bot.wins],
          isDigitBot(bot)
            ? ["Winning digits", `${bot.winning} of 10`]
            : ["A price that ends level", "Loses, whichever side was taken"],
          ["Entry", bot.pace],
          ["Stake", ladder ? `Martingale: ${multiplierText(bot.plans)} after a loss` : "Flat: the same on every trade"],
          ["Plans", `Stop loss ${orList(stops)}`],
          ["Markets", "One, chosen when you start it"],
          ["Open trades", "One at a time"],
        ],
      },
      { type: "h2", text: `What ${bot.name} trades` },
      { type: "p", text: contractText(bot) },
      { type: "h2", text: `When ${bot.name} enters a trade` },
      ...bot.detail.map((text): GuideBlock => ({ type: "p", text })),
      { type: "note", title: "Example", text: bot.example },
      {
        type: "p",
        text: `${bot.name} holds one trade at a time: it looks for the next entry only after the last contract has closed. The entry rule sets when the bot trades and how often. It does not make any single trade more likely to win.`,
      },
      ...stakeBlocks(bot),
      ...planBlocks(bot),
      { type: "h2", text: "When a session ends" },
      {
        type: "list",
        items: [
          "The profit target is reached. The bot stops with the session's profit at or above the plan's target.",
          "The stop loss is reached. No stake is placed that could take the session's loss past the plan's stop loss.",
          "You stop it. The Stop button on the run page ends the session at any time.",
        ],
      },
      {
        type: "p",
        text: `${bot.name} runs on FXNOD's servers, not in your browser. Closing the page or switching off your device does not stop it, and does not switch off its limits. Starting it again after a session has ended begins a new session with the full plan.`,
      },
      { type: "h2", text: `How to start ${bot.name}` },
      {
        type: "steps",
        items: [
          {
            title: `Open Auto Hub and choose ${bot.name}`,
            text: "The bot's page opens with a How it works panel that lists its rules in order.",
          },
          {
            title: "Choose the market",
            text: isDigitBot(bot)
              ? `${bot.name} trades one market. The form suggests ${SUGGESTED_MARKETS}. Jump 100 is not offered for this bot.`
              : `${bot.name} trades one market, and only a Volatility index: ${VOLATILITY_MARKETS}. No other market is offered for this bot.`,
          },
          {
            title: "Choose a plan",
            text: "Each plan card shows its stop loss, its take profit and its starting stake. Nothing on the card can be edited.",
          },
          {
            title: "Check the account, then start",
            text: "The panel shows which Deriv account the bot will trade. On a demo account the button reads Start on demo. On a real account you tick a box to confirm that the bot trades real money, and the button reads Start with real money. The first time, Deriv asks you to approve FXNOD's automated-trading connection on its own page.",
          },
        ],
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: `What does the ${bot.name} bot trade?`,
        a: isDigitBot(bot)
          ? `${bot.name} buys Deriv's ${bot.bet} contract with a length of one tick. A trade wins when ${bot.wins}, which is ${bot.winning} of the ten possible last digits.`
          : `${bot.name} buys Deriv's ${bot.bet} contract with a length of ${tickLength(bot)}. A trade wins when ${bot.wins}. A price that ends exactly where it started loses.`,
      },
      {
        q: `When does ${bot.name} place a trade?`,
        a: bot.rule,
      },
      {
        q: `Does ${bot.name} use Martingale?`,
        a: ladder
          ? `Yes. After a losing trade the stake is ${multiplierText(bot.plans)}, and after a win it returns to the starting stake. A step that would not fit in what is left of the stop loss is not placed, and the session ends.`
          : `No. ${bot.name} places every trade at the same stake.`,
      },
      {
        q: `Can I change the stake or stop loss of ${bot.name}?`,
        a: `Not one by one. You choose one of its ${planCount} plans, with a stop loss of ${orList(stops)}, and the plan sets the stake and the profit target with it. To set every amount yourself, build a bot in dBot.`,
      },
      {
        q: `Does ${bot.name} keep running when I close the page?`,
        a: `Yes. ${bot.name} runs on FXNOD's servers until it reaches its profit target or its stop loss, or until you stop it.`,
      },
    ],
    related: [
      FAMILY[bot.family].guide,
      OVERVIEW,
      ...(sibling ? [botGuideSlug(sibling.id)] : []),
      ladder ? "martingale-strategy-explained" : "flat-stake-explained",
    ],
  };
}

const OWN_AMOUNT_STEPS = (name: string, markets: string): GuideBlock => ({
  type: "steps",
  items: [
    {
      title: `Open Auto Hub and choose ${name}`,
      text: "The bot's page opens with a How it works panel that lists its rules in order.",
    },
    { title: "Choose the markets", text: markets },
    {
      title: "Set the stake and the limits",
      text: "Stake per trade starts at 1 and cannot go below 0.35, the smallest stake Deriv takes on these contracts. A stop loss is required: the bot cannot be started without one. Take profit can be left empty.",
    },
    {
      title: "Check the account, then start",
      text: "The panel shows which Deriv account the bot will trade. On a demo account the button reads Start on demo. On a real account you tick a box to confirm that the bot trades real money, and the button reads Start with real money.",
    },
  ],
});

const FADE_MARKETS =
  "Choose from 1 to 10 markets. The form suggests Volatility 100 (1s), Volatility 75 (1s), Volatility 100 and Volatility 75. Jump 100 is not offered for this bot.";

const OWN_AMOUNT_GUIDES: Guide[] = [
  {
    slug: botGuideSlug("hot_fade"),
    title: "Hot Fade: how FXNOD's Deriv digit-cluster Differs bot works",
    description:
      "Hot Fade is a ready-made Deriv Differs bot in FXNOD's Auto Hub. It bets against a last digit that has clustered and printed three times running.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: IMAGE,
    answer:
      "Hot Fade is a ready-made bot in FXNOD's Auto Hub that buys Deriv's one-tick Differs contract. It watches the last digit on up to ten markets and waits until one digit stands clearly above the rest over the last 30 ticks and has just printed three times running. Then it bets that the next tick on that market ends in a different digit. The stake is the same on every trade, and you set the stake, the stop loss and the take profit yourself.",
    body: [
      { type: "h2", text: "Hot Fade at a glance" },
      {
        type: "table",
        head: ["", "Hot Fade"],
        rows: [
          ["Contract", "Differs, one tick (Deriv Matches / Differs)"],
          ["A trade wins when", "the next tick ends in any digit except the one the bot bet against"],
          ["Winning digits", "9 of 10"],
          ["Entry", "One digit clustered over the last 30 ticks and printed three times running"],
          ["Stake", "Flat: the same on every trade"],
          ["Amounts", "Your own stake, stop loss and optional take profit"],
          ["Markets", "1 to 10, watched together"],
          ["Open trades", "One at a time, across all markets"],
        ],
      },
      { type: "h2", text: "What Hot Fade trades" },
      {
        type: "p",
        text: "Hot Fade trades one contract only: Differs, with a length of one tick. The contract is decided by the last digit of a tick's price, which is its final decimal digit: a tick at 1234.56 ends in 6. A Differs trade names one digit and wins when the next tick ends in any of the other nine. Nine digits out of ten win, so a win pays a small fraction of the stake, and a losing trade costs the whole stake.",
      },
      { type: "h2", text: "When Hot Fade enters a trade" },
      {
        type: "p",
        text: "Hot Fade reads the last digit of every tick on each market you chose. Two things have to be true on one market at the same moment. First, one digit has appeared clearly more often than the others over the last 30 ticks. Second, that same digit has just ended three ticks in a row. When both hold, the bot buys a one-tick Differs on that digit, on that market.",
      },
      {
        type: "note",
        title: "Example",
        text: "On Volatility 100 (1s) the digit 7 has ended far more of the last 30 ticks than any other digit, and the three newest ticks end in 7, 7, 7. The bot buys Differs 7 there. The trade wins unless the next tick ends in 7 again.",
      },
      {
        type: "p",
        text: "Watching more markets gives the bot more chances to see its signal, but it still holds only one trade at a time across all of them. After a result it pauses before the next entry, and for longer after a loss. It does not fade the same digit twice running on the same market. With few markets it can sit for several minutes without trading, which is normal: it is waiting for its signal.",
      },
      {
        type: "p",
        text: "The entry rule sets when the bot trades. It does not make any single trade more likely to win: a digit that has clustered is not due to stop.",
      },
      { type: "h2", text: "Stake and limits" },
      {
        type: "p",
        text: "Hot Fade uses a flat stake: every trade is placed at the stake you set, after a win and after a loss alike. The session ends when its losses reach your stop loss, when its profit reaches your take profit if you set one, or when you press Stop. Running it again after a take profit starts a new session, which can lose.",
      },
      { type: "h2", text: "How to start Hot Fade" },
      OWN_AMOUNT_STEPS("Hot Fade", FADE_MARKETS),
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What does the Hot Fade bot trade?",
        a: "Hot Fade buys Deriv's Differs contract with a length of one tick. A trade wins when the next tick ends in any digit except the one the bot bet against, which is nine of the ten possible last digits.",
      },
      {
        q: "When does Hot Fade place a trade?",
        a: "When one last digit stands clearly above the rest over the last 30 ticks of a market and has just printed three times running. It then bets the next tick ends in a different digit.",
      },
      {
        q: "Does Hot Fade use Martingale?",
        a: "No. Hot Fade places every trade at the stake you set.",
      },
      {
        q: "How many markets can Hot Fade watch?",
        a: "From 1 to 10. It reads all of them and keeps one trade open at a time.",
      },
      {
        q: "What is the difference between Hot Fade and Shadow Fade?",
        a: "They take the same entries. Hot Fade buys every one. Shadow Fade scores them without buying at first, and buys only while its recent results meet the rule you set.",
      },
    ],
    related: [botGuideSlug("shadow_fade"), OVERVIEW, "matches-differs-explained", "flat-stake-explained"],
  },
  {
    slug: botGuideSlug("shadow_fade"),
    title: "Shadow Fade: how FXNOD's shadow-trading Deriv Differs bot works",
    description:
      "Shadow Fade takes Hot Fade's entries but scores them before it buys. What a shadow trade is, what Go live below does, and how to start the bot.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: IMAGE,
    answer:
      "Shadow Fade is a ready-made bot in FXNOD's Auto Hub that takes the same entries as Hot Fade, a one-tick Deriv Differs against a digit that has clustered and printed three times running, but does not buy them at first. It starts with shadow trades, which are scored from the next tick and never placed on Deriv. Real trades begin after 20 results, and only while those 20 win less often than the Go live below percentage you set, which is 85 by default.",
    body: [
      { type: "h2", text: "Shadow Fade at a glance" },
      {
        type: "table",
        head: ["", "Shadow Fade"],
        rows: [
          ["Contract", "Differs, one tick (Deriv Matches / Differs)"],
          ["Entry", "Hot Fade's: one digit clustered over the last 30 ticks and printed three times running"],
          ["Shadow trade", "An entry that is scored from the next tick and not bought"],
          ["Real trades run", "While the last 20 results win less often than Go live below"],
          ["Setting", "Go live below: 1 to 99 percent, 85 by default"],
          ["Stake", "Flat: the same on every real trade"],
          ["Amounts", "Your own stake, stop loss and optional take profit"],
          ["Markets", "1 to 10, watched together"],
        ],
      },
      { type: "h2", text: "What a shadow trade is" },
      {
        type: "p",
        text: "A shadow trade is an entry the bot records without buying it. Nothing is sent to Deriv and no money moves. The next tick on that market decides whether the entry would have won or lost, exactly as it would decide a real one-tick Differs. On the run page a shadow entry is marked as one and shows no stake and no profit figure. Shadow results are never in your trade history, your statement or your profit and loss.",
      },
      { type: "h2", text: "When Shadow Fade trades for real" },
      {
        type: "steps",
        items: [
          {
            title: "It starts in shadow mode",
            text: "Every entry is a shadow trade until the bot has 20 results to read.",
          },
          {
            title: "It reads the last 20 results",
            text: "The win rate is taken over the 20 most recent results, shadow and real together.",
          },
          {
            title: "It goes live below your percentage",
            text: "While those 20 win less often than Go live below, entries are bought on Deriv as real trades.",
          },
          {
            title: "It goes back to shadow above it",
            text: "When the last 20 win more often than that again, real trades stop and entries are scored only. At exactly your percentage the bot stays in whichever mode it is in.",
          },
        ],
      },
      {
        type: "note",
        title: "Example",
        text: "Go live below is 85. Of the last 20 results, 16 won, which is 80 percent. That is below 85, so the next entry is a real trade. If 18 of the last 20 had won, 90 percent, the next entry would be a shadow trade.",
      },
      {
        type: "p",
        text: "The gauge on the run page shows the mode and the win rate the engine worked out. The rule decides when the bot buys. It does not make any single trade more likely to win.",
      },
      { type: "h2", text: "Stake and limits" },
      {
        type: "p",
        text: "Real trades are placed at the flat stake you set. Your stop loss and take profit follow real profit and loss only: a shadow result cannot move them, although it still counts towards the 20-result win rate. The session ends at your stop loss, at your take profit if you set one, or when you press Stop.",
      },
      { type: "h2", text: "How to start Shadow Fade" },
      OWN_AMOUNT_STEPS("Shadow Fade", `${FADE_MARKETS} Then set Go live below under Settings, or leave it at 85.`),
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is a shadow trade?",
        a: "A shadow trade is an entry the bot scores without buying it. Nothing is placed on Deriv and no money moves. The next tick decides whether it would have won or lost, and the result only feeds the bot's recent win rate.",
      },
      {
        q: "What does Go live below mean in Shadow Fade?",
        a: "It is the win rate, over the last 20 results, below which Shadow Fade buys its entries as real trades. It can be set from 1 to 99 percent and is 85 by default.",
      },
      {
        q: "Do shadow trades count towards my stop loss?",
        a: "No. The stop loss and take profit follow real profit and loss only. Shadow results count towards the 20-result win rate and nothing else.",
      },
      {
        q: "Does Shadow Fade use Martingale?",
        a: "No. Shadow Fade places every real trade at the stake you set.",
      },
      {
        q: "Why has Shadow Fade placed no real trades?",
        a: "It needs 20 results before it can go live, and it goes live only while those results win less often than your Go live below percentage. Until then every entry is a shadow trade.",
      },
    ],
    related: [botGuideSlug("hot_fade"), OVERVIEW, "matches-differs-explained", "how-to-test-a-trading-bot"],
  },
  {
    slug: botGuideSlug("matches_differs"),
    title: "Matches / Differs bot: how FXNOD's Deriv digit bot works",
    description:
      "The Matches / Differs bot in FXNOD's Auto Hub trades one digit on one market, trade after trade. Its settings, auto digit, and how to start it.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: IMAGE,
    answer:
      "The Matches / Differs bot is a ready-made bot in FXNOD's Auto Hub that buys Deriv's one-tick Matches or Differs contract on one market, again and again. You choose Matches or Differs and a digit from 0 to 9, or switch on auto digit and let the bot choose the digit from recent ticks. It places the next trade as soon as the last one has closed, at the same stake every time, until your stop loss or take profit is reached or you stop it.",
    body: [
      { type: "h2", text: "Matches / Differs at a glance" },
      {
        type: "table",
        head: ["", "Matches / Differs"],
        rows: [
          ["Contract", "Matches or Differs, one tick"],
          ["Matches wins when", "the next tick ends in your digit (1 of 10 digits)"],
          ["Differs wins when", "the next tick ends in any other digit (9 of 10 digits)"],
          ["Entry", "Continuous: the next trade follows the last"],
          ["Settings", "Prediction, Digit, Auto digit"],
          ["Stake", "Flat: the same on every trade"],
          ["Amounts", "Your own stake, stop loss and optional take profit"],
          ["Markets", "One"],
        ],
      },
      { type: "h2", text: "What the bot trades" },
      {
        type: "p",
        text: "Both contracts are decided by the last digit of a tick's price, which is its final decimal digit: a tick at 1234.56 ends in 6. Matches names one digit and wins only if the next tick ends in it, so it wins on one digit out of ten and pays several times the stake. Differs names one digit and wins if the next tick ends in anything else, so it wins on nine digits out of ten and pays a small fraction of the stake. A losing trade of either kind costs the whole stake.",
      },
      { type: "h2", text: "The three settings" },
      {
        type: "table",
        head: ["Setting", "Choices", "Default"],
        rows: [
          ["Prediction", "Differs or Matches", "Differs"],
          ["Digit", "0 to 9", "5"],
          ["Auto digit", "On or off", "Off"],
        ],
      },
      {
        type: "p",
        text: "With auto digit off, the bot trades the digit you set on every trade. With auto digit on, it reads the recent ticks of the market before each trade and chooses the digit itself: the most frequent digit for Matches, the least frequent for Differs.",
      },
      {
        type: "note",
        title: "Example",
        text: "Prediction is Differs, Digit is 5 and auto digit is off. The bot buys Differs 5. The next tick ends in 2, so the trade wins, and the bot buys Differs 5 again. A tick that ends in 5 loses the trade.",
      },
      {
        type: "p",
        text: "The bot does not wait for a signal. It holds one trade at a time and buys the next as soon as the last has closed. The digit setting chooses what the bot bets on. It does not make any single trade more likely to win.",
      },
      { type: "h2", text: "Stake and limits" },
      {
        type: "p",
        text: "The stake is flat: every trade is placed at the stake you set. The session ends when its losses reach your stop loss, when its profit reaches your take profit if you set one, or when you press Stop.",
      },
      { type: "h2", text: "How to start Matches / Differs" },
      OWN_AMOUNT_STEPS(
        "Matches / Differs",
        "Choose one market. The form suggests Volatility 100. Jump 100 is not offered for this bot. Then set Prediction, Digit and Auto digit under Settings.",
      ),
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What does the Matches / Differs bot trade?",
        a: "Deriv's Matches or Differs contract with a length of one tick, on one market. Matches wins when the next tick ends in the chosen digit; Differs wins when it ends in any other digit.",
      },
      {
        q: "What does auto digit do?",
        a: "With auto digit on, the bot chooses the digit from the market's recent ticks before each trade: the most frequent digit for Matches, the least frequent for Differs.",
      },
      {
        q: "Does the Matches / Differs bot use Martingale?",
        a: "No. It places every trade at the stake you set.",
      },
      {
        q: "How often does the Matches / Differs bot trade?",
        a: "Continuously. It places the next one-tick trade as soon as the last one has closed.",
      },
    ],
    related: ["matches-differs-explained", OVERVIEW, botGuideSlug("nine_lives"), "flat-stake-explained"],
  },
];

export const AUTOHUB_BOT_GUIDES: Guide[] = [...OWN_AMOUNT_GUIDES, ...FIXED_PLAN_BOTS.map(fixedPlanGuide)];
