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
  isBarrierBot,
  isDigitBot,
  isHeldBot,
  marketSet,
  stakeStyle,
  type MarketSet,
  type BotPlan,
  type BotFamily,
  type FixedPlanBot,
} from "./autohubCatalogue";
import { RISK_NOTE, type Guide, type GuideBlock } from "./guides";

const DATE = "2026-10-12";
/** When the guides of the barrier and held bots were first published. */
const DATE_LATER = "2026-10-15";
const TAG = "Auto Hub bot";
const IMAGE = "/assets/login-slide-3.jpg";
const OVERVIEW = "auto-hub-ready-made-bots";

const FAMILY: Record<BotFamily, { name: string; guide: string }> = {
  rise_fall: { name: "Rise / Fall", guide: "rise-fall-explained" },
  matches_differs: { name: "Matches / Differs", guide: "matches-differs-explained" },
  even_odd: { name: "Even / Odd", guide: "even-odd-explained" },
  over_under: { name: "Over / Under", guide: "over-under-explained" },
  higher_lower: { name: "Higher / Lower", guide: "higher-lower-explained" },
  touch_no_touch: { name: "Touch / No Touch", guide: "touch-no-touch-explained" },
  accumulators: { name: "Accumulators", guide: "accumulators-explained" },
  multipliers: { name: "Multipliers", guide: "multipliers-explained" },
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

/** "five-tick Higher / Lower", "1% Accumulator", "x40 Multiplier". */
function contractName(bot: FixedPlanBot): string {
  if (bot.family === "accumulators") return `${bot.growthRate}% Accumulator`;
  if (bot.family === "multipliers") return `x${bot.leverage} Multiplier`;
  return `${tickWord(bot)} ${bot.bet}`;
}

/** Where a scaled barrier sits, after "a barrier". */
function barrierText(bot: FixedPlanBot): string {
  if (bot.barrierScale === 0.5) return "at half of Deriv's default barrier distance for the market";
  if (bot.barrierScale === 1.5) return "at one and a half times Deriv's default barrier distance for the market";
  return "at Deriv's default barrier distance for the market";
}

const MARKET_STEP: Record<MarketSet, (name: string) => string> = {
  digit: (name) =>
    `${name} trades one market. The form suggests Volatility 100 (1s), Volatility 100, Volatility 75 (1s), Volatility 75, Volatility 50 (1s) and Volatility 50. Jump 100 is not offered for this bot.`,
  volatility: (name) =>
    `${name} trades one market, and only a Volatility index: Volatility 10, 25, 50, 75 and 100, and the one-second indices from Volatility 10 (1s) to Volatility 100 (1s). No other market is offered for this bot.`,
  two_second: (name) =>
    `${name} trades one market, and only one of Volatility 10, 25, 50, 75 and 100. The form suggests Volatility 100, 75 and 50. The one-second indices price the same barrier differently, so they are not offered for this bot.`,
  volatility_100: (name) => `${name} trades Volatility 100 only. No other market is offered for this bot.`,
};

const MARKET_CELL: Record<MarketSet, string> = {
  digit: "One, chosen when you start it",
  volatility: "One Volatility index, chosen when you start it",
  two_second: "One of Volatility 10, 25, 50, 75 and 100",
  volatility_100: "Volatility 100 only",
};

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
  const result = "Deriv sets the payout, and each trade's result is listed on the run page.";
  if (bot.family === "accumulators") {
    return `${bot.name} trades one contract only: an Accumulator from Deriv's Accumulators family, at a growth rate of ${bot.growthRate}%. While each tick stays within a range Deriv sets around the tick before it, the position's value grows by ${bot.growthRate}% a tick. If one tick lands outside the range, the position is knocked out and the whole stake is lost. ${bot.name} closes the position at a take profit of ${bot.closeAt} of the stake, and that take profit is also the session's profit target. An Accumulator has no fixed length: it stays open until it is closed or knocked out. ${result}`;
  }
  if (bot.family === "multipliers") {
    return `${bot.name} trades one contract only: a Multiplier from Deriv's Multipliers family, at x${bot.leverage}. The position is opened Up or Down, and its profit or loss is the price's move in percent, times ${bot.leverage}, applied to the stake, less a commission Deriv takes at entry. It cannot lose more than its stake: when the loss reaches the stake, Deriv stops the position out. ${bot.name} closes it at a take profit of ${bot.closeAt} of the stake, which is also the session's profit target. A Multiplier has no fixed length: it stays open until it is closed or stopped out. ${result}`;
  }
  if (bot.family === "higher_lower") {
    return `${bot.name} trades one contract only: Higher / Lower, from Deriv's Higher / Lower family, with a length of five ticks and a barrier ${barrierText(bot)}. A Higher wins when the price at the end of the contract is above a barrier set above the entry price, and a Lower when it is below one set below it. Ending beyond the entry price is not enough: the price has to pass the barrier. Because of that a trade wins less often than it loses, and a win pays more than the stake. A losing trade costs the whole stake. ${result}`;
  }
  if (bot.family === "touch_no_touch") {
    const how =
      bot.bet === "Touch"
        ? "A Touch wins if the price reaches the barrier at any of the five ticks, and closes as soon as it does. The nearer the barrier, the more often a Touch wins and the less a win pays."
        : "A No Touch wins if the price stays below the barrier for all five ticks, and loses as soon as the barrier is touched. The farther the barrier, the more often a No Touch wins and the less a win pays.";
    return `${bot.name} trades one contract only: ${bot.bet}, from Deriv's Touch / No Touch family, with a length of five ticks and a barrier above the entry price, ${barrierText(bot)}. ${how} A losing trade costs the whole stake. ${result}`;
  }
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
        text: isHeldBot(bot)
          ? `A position is opened only while its stake fits in what is left of the stop loss. On ${bot.name} the stop loss is two stakes, so a session opens at most two positions that lose: after the second, nothing is left to stake and the session ends.`
          : "A trade is placed only while its stake fits in what is left of the stop loss. When it no longer fits, the session ends instead of placing it.",
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
  if (isHeldBot(bot)) {
    return [
      { type: "h2", text: `The plans of ${bot.name}` },
      {
        type: "p",
        text: `${bot.name} is not given a stake, a stop loss and a profit target one by one. You choose a plan, and the plan sets all of them together. Plans are named by their stop loss, which is two stakes. The profit target is the take profit of a single position, ${bot.closeAt} of the stake, so the first position that reaches it ends the session. The amounts are in the currency of the Deriv account the bot trades.`,
      },
      {
        type: "table",
        head: ["Plan", "Stake per position", "Take profit, which ends the session"],
        rows: bot.plans.map((p) => [`Stop loss ${p.stopLoss}`, p.stake, money(p.takeProfit)]),
      },
    ];
  }
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

/** The third row of the at-a-glance table: what sets the odds of this contract. */
function glanceRow(bot: FixedPlanBot): string[] {
  if (isDigitBot(bot)) return ["Winning digits", `${bot.winning} of 10`];
  if (isBarrierBot(bot)) return ["Barrier", barrierText(bot).replace(/^at /, "At ")];
  if (bot.family === "accumulators") return ["If a tick leaves the range", "The position is knocked out and the stake is lost"];
  if (bot.family === "multipliers") return ["Most a position can lose", "Its stake"];
  return ["A price that ends level", "Loses, whichever side was taken"];
}

function tradesAnswer(bot: FixedPlanBot): string {
  if (isDigitBot(bot))
    return `${bot.name} buys Deriv's ${bot.bet} contract with a length of one tick. A trade wins when ${bot.wins}, which is ${bot.winning} of the ten possible last digits.`;
  if (isBarrierBot(bot))
    return `${bot.name} buys Deriv's ${bot.bet} contract with a length of five ticks and a barrier ${barrierText(bot)}. A trade wins when ${bot.wins}.`;
  if (bot.family === "accumulators")
    return `${bot.name} opens Deriv's Accumulator at a growth rate of ${bot.growthRate}% and closes it at a take profit of ${bot.closeAt} of the stake. One tick outside Deriv's range knocks the position out and loses the stake.`;
  if (bot.family === "multipliers")
    return `${bot.name} opens Deriv's Multiplier at x${bot.leverage}, Up or Down, and closes it at a take profit of ${bot.closeAt} of the stake. A position cannot lose more than its stake.`;
  return `${bot.name} buys Deriv's ${bot.bet} contract with a length of ${tickLength(bot)}. A trade wins when ${bot.wins}. A price that ends exactly where it started loses.`;
}

function fixedPlanGuide(bot: FixedPlanBot): Guide {
  const ladder = stakeStyle(bot) === "Martingale";
  const stops = bot.plans.map((p) => p.stopLoss);
  const planCount = bot.plans.length === 2 ? "two" : "three";
  const held = isHeldBot(bot);
  const added = isBarrierBot(bot) || held;
  // The Rise / Fall plans were redesigned in the engine after these guides were first written.
  const updated = added || bot.family === "rise_fall" ? DATE_LATER : DATE;
  const unit = held ? "position" : "trade";
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
    published: added ? DATE_LATER : DATE,
    updated,
    image: IMAGE,
    answer: `${bot.name} is a ready-made bot in FXNOD's Auto Hub that ${held ? "opens" : "buys"} Deriv's ${contractName(bot)} contract, which wins when ${bot.wins}. ${bot.rule} ${stakeSentence} You start it on one market with one of ${planCount} fixed plans, with a stop loss of ${orList(stops)}, and the session ends at the plan's profit target or its stop loss.`,
    body: [
      { type: "h2", text: `${bot.name} at a glance` },
      {
        type: "table",
        head: ["", bot.name],
        rows: [
          [
            "Contract",
            held
              ? `${contractName(bot)}, held until closed (Deriv ${FAMILY[bot.family].name})`
              : `${bot.bet}, ${tickLength(bot)} (Deriv ${FAMILY[bot.family].name})`,
          ],
          [`A ${unit} wins when`, bot.wins],
          glanceRow(bot),
          ["Entry", bot.pace],
          ["Stake", ladder ? `Martingale: ${multiplierText(bot.plans)} after a loss` : `Flat: the same on every ${unit}`],
          ["Plans", `Stop loss ${orList(stops)}`],
          ["Markets", MARKET_CELL[marketSet(bot)]],
          [`Open ${unit}s`, "One at a time"],
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
            text: MARKET_STEP[marketSet(bot)](bot.name),
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
        a: tradesAnswer(bot),
      },
      {
        q: `When does ${bot.name} ${held ? "open a position" : "place a trade"}?`,
        a: bot.rule,
      },
      {
        q: `Does ${bot.name} use Martingale?`,
        a: ladder
          ? `Yes. After a losing trade the stake is ${multiplierText(bot.plans)}, and after a win it returns to the starting stake. A step that would not fit in what is left of the stop loss is not placed, and the session ends.`
          : `No. ${bot.name} places every ${unit} at the same stake.`,
      },
      {
        q: `Can I change the stake or stop loss of ${bot.name}?`,
        a: `Not one by one. You choose one of its ${planCount} plans, with a stop loss of ${orList(stops)}, and the plan sets the stake and the profit target with it. To set every amount yourself, build a bot in Bot Forge.`,
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

export const AUTOHUB_BOT_GUIDES: Guide[] = FIXED_PLAN_BOTS.map(fixedPlanGuide);
