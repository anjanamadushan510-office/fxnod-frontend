/**
 * The Auto Hub bots, as the public guides describe them.
 *
 * This mirrors the engine's catalogue (internal/autohub/bots_digits.go,
 * bots_rise_fall.go, bots_barrier.go and bots_held.go in trading-engine-deriv),
 * which is the copy that counts: the engine decides every entry and sizes
 * every stake. A bot's contract, entry rule or plans change here in the same
 * commit as they change there, because a guide that describes a bot wrongly
 * is a false public statement about a trading product.
 *
 * It imports nothing from the guides, so both the Auto Hub overview guide and
 * the per-bot guides can read it.
 */

export type DigitFamily = "matches_differs" | "even_odd" | "over_under";
/** Five-tick contracts with a barrier (bots_barrier.go). */
export type BarrierFamily = "higher_lower" | "touch_no_touch";
/** Contracts held open until a take profit or a loss closes them (bots_held.go). */
export type HeldFamily = "accumulators" | "multipliers";
/** The contract families a plan bot trades, in the order the guides list them. */
export type BotFamily = DigitFamily | "rise_fall" | BarrierFamily | HeldFamily;
export const BOT_FAMILIES: BotFamily[] = [
  "matches_differs",
  "even_odd",
  "over_under",
  "rise_fall",
  "higher_lower",
  "touch_no_touch",
  "accumulators",
  "multipliers",
];

/** One money plan of a bot. A multiplier of "0" is a flat stake. */
export interface BotPlan {
  stopLoss: string;
  stake: string;
  takeProfit: string;
  multiplier: string;
}

/** A bot that is started with one of its plans, on one market. */
export interface FixedPlanBot {
  id: string;
  name: string;
  tagline: string;
  family: BotFamily;
  /** The contract as it is named on the order: "Over 4", "Differs", "Rise / Fall". */
  bet: string;
  /** How many ticks each contract lasts. One when left out; none for a held contract. */
  ticks?: number;
  /** A barrier contract's barrier, as a multiple of Deriv's default distance. */
  barrierScale?: number;
  /** An Accumulator's growth rate, in percent. */
  growthRate?: number;
  /** A Multiplier's multiplier. */
  leverage?: number;
  /** A held contract's take profit as a share of its stake: "3%". */
  closeAt?: string;
  /** Completes "A trade wins when ...". */
  wins: string;
  /** How many of the ten last digits win. Digit contracts only. */
  winning?: number;
  /** The entry rule in a few words, for a table cell. */
  pace: string;
  /** The entry rule as one sentence that names the bot. */
  rule: string;
  /** The entry rule in full. */
  detail: string[];
  /** A short run of last digits and what the bot does with it. */
  example: string;
  plans: BotPlan[];
}

function plan(stopLoss: string, stake: string, takeProfit: string, multiplier: string): BotPlan {
  return { stopLoss, stake, takeProfit, multiplier };
}

// Plans that several bots share in the engine's catalogue.
const HALF_LADDER = [plan("20", "1", "1", "2.17"), plan("100", "1", "5", "2.17"), plan("500", "5", "25", "2.17")];
const FOUR_LADDER = [plan("20", "0.35", "1", "1.79"), plan("100", "2", "5", "1.79"), plan("500", "2", "25", "1.79")];
const SIX_LADDER = [plan("20", "0.35", "1", "3.11"), plan("100", "1", "5", "2.76"), plan("500", "5", "25", "2.76")];
const FLAT_SMALL = [plan("20", "2", "1", "0"), plan("100", "10", "5", "0"), plan("500", "25", "10", "0")];
const FLAT_WIDE = [plan("20", "5", "1", "0"), plan("100", "25", "5", "0"), plan("500", "25", "10", "0")];
const FLAT_STEADY = [plan("20", "1", "0.4", "0"), plan("100", "5", "2", "0"), plan("500", "25", "10", "0")];
const RISE_FALL_LADDER = [plan("20", "0.35", "1", "2.22"), plan("100", "1", "5", "2.22"), plan("500", "5", "25", "2.22")];
const PEAK_LADDER = [plan("20", "0.35", "1", "1.32"), plan("100", "0.35", "5", "1.32"), plan("500", "0.35", "25", "1.32")];
const NEAR_BARRIER_LADDER = [plan("20", "0.35", "1", "1.95"), plan("100", "5", "5", "1.95"), plan("500", "2", "25", "1.95")];
const DEFAULT_BARRIER_LADDER = [plan("20", "0.35", "1", "1.77"), plan("100", "2", "5", "1.77"), plan("500", "2", "25", "1.77")];
const FAR_BARRIER_LADDER = [plan("20", "0.35", "1", "1.63"), plan("100", "2", "5", "1.63"), plan("500", "10", "25", "1.63")];

const HIGHER_LOWER_WINS =
  "the price ends beyond the barrier on the side the bot took: above a barrier set above the entry price for a Higher, below one set below it for a Lower";
const TOUCH_WINS = "the price reaches the barrier at any of the five ticks";
const NO_TOUCH_WINS = "the price stays below the barrier for all five ticks";

/** In the order the Auto Hub page shows them. */
export const FIXED_PLAN_BOTS: FixedPlanBot[] = [
  {
    id: "nine_lives",
    name: "Nine Lives",
    tagline: "Bets a repeated digit will not print a third time.",
    family: "matches_differs",
    bet: "Differs",
    wins: "the next tick ends in any digit except the one the bot bet against",
    winning: 9,
    pace: "After the same digit twice running",
    rule: "Nine Lives waits until two ticks in a row end in the same digit, then bets that the next tick ends in a different one.",
    detail: [
      "Nine Lives reads the last digit of every tick on its market. While neighbouring ticks end in different digits it does nothing. When two ticks in a row end in the same digit, it buys a one-tick Differs on that digit. The trade wins if the next tick ends in any of the other nine digits, and loses if the digit prints a third time.",
      "Once the trade has closed the bot looks at the two newest ticks again. If they still end in the same digit it enters again at once; otherwise it waits for the next pair.",
    ],
    example:
      "The last digits arrive as 3, 8, 8. The bot buys Differs 8. If the next tick ends in 1 the trade wins; if it ends in 8 the trade loses.",
    plans: [plan("20", "1", "1", "16.43"), plan("100", "5", "5", "16.43"), plan("500", "25", "25", "16.43")],
  },
  {
    id: "needle",
    name: "Needle",
    tagline: "Bets on the digit that has been seen least.",
    family: "matches_differs",
    bet: "Matches",
    wins: "the next tick ends in the digit the bot picked",
    winning: 1,
    pace: "Every 3 ticks, on the rarest digit of the last 50",
    rule: "Needle counts the last digits of the most recent 50 ticks, picks the digit that appeared least, and bets that the next tick ends in it.",
    detail: [
      "Needle keeps a count of how many of the last 50 ticks ended in each digit from 0 to 9. At each entry it picks the digit with the lowest count and buys a one-tick Matches on it. When two digits are tied for the lowest count, it takes the lower digit, so the same ticks always give the same choice.",
      "It needs the last 50 ticks of its market to make the count. After each result it lets two ticks pass, so entries are three ticks apart. The count is taken again at every entry, which means the digit can change from one trade to the next.",
    ],
    example:
      "In the last 50 ticks the digit 6 ended two of them and every other digit ended three or more. The bot buys Matches 6. The trade wins only if the next tick ends in 6.",
    plans: [plan("100", "0.35", "5", "1.17"), plan("500", "2", "25", "1.17")],
  },
  {
    id: "steady_nine",
    name: "Steady Nine",
    tagline: "Bets every tick that the digit will change.",
    family: "matches_differs",
    bet: "Differs",
    wins: "the next tick ends in any digit except the one the bot bet against",
    winning: 9,
    pace: "Every tick, against the digit that just printed",
    rule: "Steady Nine trades on every tick: it takes the last digit of the newest tick and bets that the next tick ends in a different one.",
    detail: [
      "Steady Nine does not wait for a pattern. It reads the last digit of the newest tick and buys a one-tick Differs on that digit. The trade wins unless the same digit prints twice running.",
      "As soon as the contract has closed it does the same again with the tick that has just arrived, so the digit it bets against changes with every trade.",
    ],
    example:
      "A tick ends in 4, so the bot buys Differs 4. The next tick ends in 9 and the trade wins. The bot then buys Differs 9.",
    plans: [plan("20", "5", "0.4", "0"), plan("100", "25", "2", "0")],
  },
  {
    id: "even_keel",
    name: "Even Keel",
    tagline: "Even, tick after tick.",
    family: "even_odd",
    bet: "Even",
    wins: "the next tick ends in 0, 2, 4, 6 or 8",
    winning: 5,
    pace: "Every tick",
    rule: "Even Keel buys Even on every tick, with no entry condition.",
    detail: [
      "Even Keel has no signal to wait for. It buys a one-tick Even, and when that contract has closed it buys the next one on the following tick.",
      "What sets it apart from the other Even / Odd bots is the pace and the stake plan: it trades as often as the market ticks, and it multiplies its stake after a loss.",
    ],
    example:
      "The bot buys Even. The next tick ends in 6 and the trade wins. It buys Even again; the next tick ends in 3 and that trade loses.",
    plans: HALF_LADDER,
  },
  {
    id: "level_pair",
    name: "Level Pair",
    tagline: "Even at an unhurried pace.",
    family: "even_odd",
    bet: "Even",
    wins: "the next tick ends in 0, 2, 4, 6 or 8",
    winning: 5,
    pace: "Every 3 ticks",
    rule: "Level Pair buys Even once every three ticks.",
    detail: [
      "Level Pair buys a one-tick Even, waits for the result, then lets two ticks pass before it buys again. Entries are therefore three ticks apart.",
      "It has no condition on the digits it has seen. The spacing only slows the session down: on a market that ticks once a second, it places about twenty trades a minute at most.",
    ],
    example:
      "The bot buys Even and the next tick ends in 2: a win. Two more ticks arrive and are ignored. On the third it buys Even again.",
    plans: FLAT_SMALL,
  },
  {
    id: "odd_jobs",
    name: "Odd Jobs",
    tagline: "Odd, after two evens.",
    family: "even_odd",
    bet: "Odd",
    wins: "the next tick ends in 1, 3, 5, 7 or 9",
    winning: 5,
    pace: "After two even digits running",
    rule: "Odd Jobs waits until two ticks in a row end in an even digit, then buys Odd.",
    detail: [
      "Odd Jobs reads the last digit of every tick. It enters only when the two newest ticks both end in an even digit (0, 2, 4, 6 or 8), and then buys a one-tick Odd.",
      "The condition is checked again on every tick. After a trade closes, the bot enters again as soon as the two newest ticks are both even, which can be the very next tick or many ticks later.",
    ],
    example:
      "The last digits arrive as 5, 6, 2. The two newest are even, so the bot buys Odd. With 5, 6, 3 it would not have entered.",
    plans: HALF_LADDER,
  },
  {
    id: "odd_hours",
    name: "Odd Hours",
    tagline: "Odd, once every five ticks.",
    family: "even_odd",
    bet: "Odd",
    wins: "the next tick ends in 1, 3, 5, 7 or 9",
    winning: 5,
    pace: "Every 5 ticks",
    rule: "Odd Hours buys Odd once every five ticks.",
    detail: [
      "Odd Hours buys a one-tick Odd, waits for the result, then lets four ticks pass before it buys again. Entries are five ticks apart.",
      "It is the slowest of the Even / Odd bots. It reads no pattern in the digits; the spacing is the whole of its entry rule.",
    ],
    example:
      "The bot buys Odd and the next tick ends in 7: a win. Four more ticks pass. On the fifth it buys Odd again.",
    plans: FLAT_SMALL,
  },
  {
    id: "high_five",
    name: "High Five",
    tagline: "Over 4: the upper five digits.",
    family: "over_under",
    bet: "Over 4",
    wins: "the next tick ends in 5, 6, 7, 8 or 9",
    winning: 5,
    pace: "Every tick",
    rule: "High Five buys Over 4 on every tick, with no entry condition.",
    detail: [
      "High Five buys a one-tick Over 4, and when that contract has closed it buys the next one on the following tick. Half of the ten digits win and half lose.",
      "It is the mirror image of Low Five, which buys Under 5 on the same rhythm with the same plans.",
    ],
    example:
      "The bot buys Over 4. The next tick ends in 7 and the trade wins. It buys Over 4 again; the next tick ends in 4, which is not over 4, and that trade loses.",
    plans: HALF_LADDER,
  },
  {
    id: "top_four",
    name: "Top Four",
    tagline: "Over 5, after two low digits.",
    family: "over_under",
    bet: "Over 5",
    wins: "the next tick ends in 6, 7, 8 or 9",
    winning: 4,
    pace: "After two digits of 5 or less running",
    rule: "Top Four waits until two ticks in a row end in 5 or less, then buys Over 5.",
    detail: [
      "Top Four reads the last digit of every tick. It enters only when the two newest ticks both end in a digit from 0 to 5, and then buys a one-tick Over 5, which wins on 6, 7, 8 or 9.",
      "The condition is checked again on every tick. A trade that loses has itself ended in 5 or less, so after a loss the bot often meets its condition again on the next tick.",
    ],
    example:
      "The last digits arrive as 8, 3, 5. The two newest are 5 or less, so the bot buys Over 5. With 3, 8 it would have kept waiting.",
    plans: FOUR_LADDER,
  },
  {
    id: "upper_six",
    name: "Upper Six",
    tagline: "Over 3: six digits out of ten.",
    family: "over_under",
    bet: "Over 3",
    wins: "the next tick ends in 4, 5, 6, 7, 8 or 9",
    winning: 6,
    pace: "Every tick, with 5 ticks out after a loss",
    rule: "Upper Six buys Over 3 on every tick and sits out five ticks after a losing trade.",
    detail: [
      "Upper Six buys a one-tick Over 3. After a winning trade it buys the next one on the following tick.",
      "After a losing trade it lets five ticks pass before it enters again. The pause changes how fast the session moves after a loss; the next stake is set by the plan, not by the pause.",
    ],
    example:
      "The bot buys Over 3 and the next tick ends in 2: a loss. Five ticks pass with no trade. Then it buys Over 3 again, at the multiplied stake.",
    plans: SIX_LADDER,
  },
  {
    id: "triple_top",
    name: "Triple Top",
    tagline: "Over 6: the top three digits.",
    family: "over_under",
    bet: "Over 6",
    wins: "the next tick ends in 7, 8 or 9",
    winning: 3,
    pace: "Every 4 ticks",
    rule: "Triple Top buys Over 6 once every four ticks.",
    detail: [
      "Triple Top buys a one-tick Over 6, which wins on three digits out of ten. It waits for the result, lets three ticks pass, and buys again, so entries are four ticks apart.",
      "It reads no pattern in the digits.",
    ],
    example:
      "The bot buys Over 6 and the next tick ends in 6: a loss, because 6 is not over 6. Three ticks pass. On the fourth it buys Over 6 again.",
    plans: [plan("20", "0.35", "1", "1.52"), plan("100", "0.35", "5", "1.52"), plan("500", "1", "25", "1.52")],
  },
  {
    id: "twin_peaks",
    name: "Twin Peaks",
    tagline: "Over 7: an 8 or a 9.",
    family: "over_under",
    bet: "Over 7",
    wins: "the next tick ends in 8 or 9",
    winning: 2,
    pace: "After 5 ticks with no 8 or 9",
    rule: "Twin Peaks waits for five ticks in a row with no 8 or 9, then buys Over 7.",
    detail: [
      "Twin Peaks reads the last digit of every tick. It enters only when the five newest ticks all end in a digit from 0 to 7, and then buys a one-tick Over 7, which wins on 8 or 9.",
      "A losing trade ends in 7 or less, so it extends the run the bot is waiting for, and the next entry can follow on the next tick. A winning trade ends in 8 or 9 and resets the wait: at least five more ticks pass before the next entry.",
    ],
    example:
      "The last digits arrive as 9, 2, 5, 0, 7, 3. The five newest have no 8 or 9, so the bot buys Over 7.",
    plans: PEAK_LADDER,
  },
  {
    id: "seven_wide",
    name: "Seven Wide",
    tagline: "Over 2: seven digits out of ten.",
    family: "over_under",
    bet: "Over 2",
    wins: "the next tick ends in 3, 4, 5, 6, 7, 8 or 9",
    winning: 7,
    pace: "Every tick",
    rule: "Seven Wide buys Over 2 on every tick, with no entry condition.",
    detail: [
      "Seven Wide buys a one-tick Over 2, and when that contract has closed it buys the next one on the following tick. Seven digits win; 0, 1 and 2 lose.",
      "Broad Seven buys the same contract at a flat stake and half the pace. Seven Wide is the version that multiplies its stake after a loss.",
    ],
    example:
      "The bot buys Over 2. The next tick ends in 3 and the trade wins. It buys Over 2 again; the next tick ends in 1 and that trade loses.",
    plans: [plan("20", "1", "1", "3.78"), plan("100", "5", "10", "3.78"), plan("500", "25", "50", "3.78")],
  },
  {
    id: "eight_wide",
    name: "Eight Wide",
    tagline: "Over 1, after a 0 or a 1.",
    family: "over_under",
    bet: "Over 1",
    wins: "the next tick ends in 2, 3, 4, 5, 6, 7, 8 or 9",
    winning: 8,
    pace: "After a tick that ends in 0 or 1",
    rule: "Eight Wide waits for a tick that ends in 0 or 1, then buys Over 1.",
    detail: [
      "Eight Wide reads the last digit of every tick and stays out while it is 2 or more. When a tick ends in 0 or 1, it buys a one-tick Over 1, which wins on the eight digits from 2 to 9.",
      "A losing trade has itself ended in 0 or 1, so the condition is met again straight away and the bot enters on the next tick. After a win it waits for the next 0 or 1.",
    ],
    example:
      "The last digits arrive as 4, 7, 1. The newest is a 1, so the bot buys Over 1. If the next tick ends in 0 the trade loses and the bot enters again.",
    plans: [plan("20", "0.35", "1", "6.77"), plan("100", "2", "5", "6"), plan("500", "10", "25", "6")],
  },
  {
    id: "broad_seven",
    name: "Broad Seven",
    tagline: "Over 2 at a steady stake.",
    family: "over_under",
    bet: "Over 2",
    wins: "the next tick ends in 3, 4, 5, 6, 7, 8 or 9",
    winning: 7,
    pace: "Every 2 ticks",
    rule: "Broad Seven buys Over 2 once every two ticks.",
    detail: [
      "Broad Seven buys a one-tick Over 2, waits for the result, lets one tick pass, and buys again. Entries are two ticks apart.",
      "It reads no pattern in the digits, and its stake never changes. Seven Wide trades the same contract with a stake that is multiplied after a loss.",
    ],
    example:
      "The bot buys Over 2 and the next tick ends in 8: a win. One tick is skipped. On the tick after it buys Over 2 again at the same stake.",
    plans: FLAT_WIDE,
  },
  {
    id: "broad_eight",
    name: "Broad Eight",
    tagline: "Over 1 at a steady stake.",
    family: "over_under",
    bet: "Over 1",
    wins: "the next tick ends in 2, 3, 4, 5, 6, 7, 8 or 9",
    winning: 8,
    pace: "Every tick",
    rule: "Broad Eight buys Over 1 on every tick.",
    detail: [
      "Broad Eight buys a one-tick Over 1, and when that contract has closed it buys the next one on the following tick. Eight digits win; only 0 and 1 lose.",
      "It has no entry condition and no change of stake. Eight Wide trades the same contract, but waits for a 0 or a 1 first and multiplies its stake after a loss.",
    ],
    example:
      "The bot buys Over 1. The next tick ends in 5 and the trade wins. It buys Over 1 again at the same stake; the next tick ends in 0 and that trade loses.",
    plans: FLAT_WIDE,
  },
  {
    id: "half_court",
    name: "Half Court",
    tagline: "Over 4 at a steady stake.",
    family: "over_under",
    bet: "Over 4",
    wins: "the next tick ends in 5, 6, 7, 8 or 9",
    winning: 5,
    pace: "Every 3 ticks",
    rule: "Half Court buys Over 4 once every three ticks.",
    detail: [
      "Half Court buys a one-tick Over 4, waits for the result, then lets two ticks pass before it buys again. Entries are three ticks apart.",
      "It is the flat-stake counterpart of High Five, which buys the same contract on every tick and multiplies its stake after a loss.",
    ],
    example:
      "The bot buys Over 4 and the next tick ends in 5: a win. Two ticks are skipped. On the third it buys Over 4 again at the same stake.",
    plans: FLAT_SMALL,
  },
  {
    id: "six_pack",
    name: "Six Pack",
    tagline: "Over 3 at a steady stake.",
    family: "over_under",
    bet: "Over 3",
    wins: "the next tick ends in 4, 5, 6, 7, 8 or 9",
    winning: 6,
    pace: "Every tick, with 10 ticks out after two losses running",
    rule: "Six Pack buys Over 3 on every tick and sits out ten ticks after two losing trades in a row.",
    detail: [
      "Six Pack buys a one-tick Over 3, and normally buys the next one on the tick after the last has closed.",
      "It keeps track of its own results. When its two most recent trades have both lost, it lets ten ticks pass before it enters again. One loss on its own does not trigger the pause, and the stake is the same before and after it.",
    ],
    example:
      "The bot buys Over 3 and the next tick ends in 1: a loss. It buys again and the next tick ends in 3: a second loss. Ten ticks pass with no trade, then it buys Over 3 again.",
    plans: FLAT_SMALL,
  },
  {
    id: "top_shelf",
    name: "Top Shelf",
    tagline: "Over 6, after three lower digits.",
    family: "over_under",
    bet: "Over 6",
    wins: "the next tick ends in 7, 8 or 9",
    winning: 3,
    pace: "After three digits of 6 or less running",
    rule: "Top Shelf waits until three ticks in a row end in 6 or less, then buys Over 6.",
    detail: [
      "Top Shelf reads the last digit of every tick. It enters only when the three newest ticks all end in a digit from 0 to 6, and then buys a one-tick Over 6, which wins on 7, 8 or 9.",
      "A losing trade ends in 6 or less and so keeps the run going: the bot can enter again on the next tick. A winning trade ends in 7, 8 or 9 and breaks the run, so at least three more ticks pass before the next entry.",
    ],
    example:
      "The last digits arrive as 9, 4, 0, 6. The three newest are 6 or less, so the bot buys Over 6.",
    plans: [plan("100", "2", "2", "0"), plan("500", "10", "10", "0")],
  },
  {
    id: "upper_deck",
    name: "Upper Deck",
    tagline: "Over 5, once every five ticks.",
    family: "over_under",
    bet: "Over 5",
    wins: "the next tick ends in 6, 7, 8 or 9",
    winning: 4,
    pace: "Every 5 ticks",
    rule: "Upper Deck buys Over 5 once every five ticks.",
    detail: [
      "Upper Deck buys a one-tick Over 5, waits for the result, then lets four ticks pass before it buys again. Entries are five ticks apart.",
      "It reads no pattern in the digits. Top Four trades the same contract, but waits for two low digits first and multiplies its stake after a loss.",
    ],
    example:
      "The bot buys Over 5 and the next tick ends in 5: a loss, because 5 is not over 5. Four ticks pass. On the fifth it buys Over 5 again at the same stake.",
    plans: FLAT_STEADY,
  },
  {
    id: "summit_pair",
    name: "Summit Pair",
    tagline: "Over 7, after a long wait.",
    family: "over_under",
    bet: "Over 7",
    wins: "the next tick ends in 8 or 9",
    winning: 2,
    pace: "After 8 ticks with no 8 or 9",
    rule: "Summit Pair waits for eight ticks in a row with no 8 or 9, then buys Over 7.",
    detail: [
      "Summit Pair reads the last digit of every tick. It enters only when the eight newest ticks all end in a digit from 0 to 7, and then buys a one-tick Over 7, which wins on 8 or 9.",
      "A losing trade extends the run, so the bot can enter again on the next tick. A winning trade ends in 8 or 9 and resets the wait: at least eight more ticks pass before the next entry. It can sit for a long time without trading.",
    ],
    example:
      "The last digits arrive as 8, 1, 4, 4, 7, 0, 2, 6, 5. The eight newest have no 8 or 9, so the bot buys Over 7.",
    plans: PEAK_LADDER,
  },
  {
    id: "low_five",
    name: "Low Five",
    tagline: "Under 5: the lower five digits.",
    family: "over_under",
    bet: "Under 5",
    wins: "the next tick ends in 0, 1, 2, 3 or 4",
    winning: 5,
    pace: "Every tick",
    rule: "Low Five buys Under 5 on every tick, with no entry condition.",
    detail: [
      "Low Five buys a one-tick Under 5, and when that contract has closed it buys the next one on the following tick. Half of the ten digits win and half lose.",
      "It is the mirror image of High Five, which buys Over 4 on the same rhythm with the same plans.",
    ],
    example:
      "The bot buys Under 5. The next tick ends in 2 and the trade wins. It buys Under 5 again; the next tick ends in 5, which is not under 5, and that trade loses.",
    plans: HALF_LADDER,
  },
  {
    id: "ground_four",
    name: "Ground Four",
    tagline: "Under 4, after two high digits.",
    family: "over_under",
    bet: "Under 4",
    wins: "the next tick ends in 0, 1, 2 or 3",
    winning: 4,
    pace: "After two digits of 4 or more running",
    rule: "Ground Four waits until two ticks in a row end in 4 or more, then buys Under 4.",
    detail: [
      "Ground Four reads the last digit of every tick. It enters only when the two newest ticks both end in a digit from 4 to 9, and then buys a one-tick Under 4, which wins on 0, 1, 2 or 3.",
      "The condition is checked again on every tick. A trade that loses has itself ended in 4 or more, so after a loss the bot often meets its condition again on the next tick. It is the mirror image of Top Four.",
    ],
    example:
      "The last digits arrive as 1, 6, 4. The two newest are 4 or more, so the bot buys Under 4. With 6, 1 it would have kept waiting.",
    plans: FOUR_LADDER,
  },
  {
    id: "lower_six",
    name: "Lower Six",
    tagline: "Under 6: six digits out of ten.",
    family: "over_under",
    bet: "Under 6",
    wins: "the next tick ends in 0, 1, 2, 3, 4 or 5",
    winning: 6,
    pace: "Every tick, with 5 ticks out after a loss",
    rule: "Lower Six buys Under 6 on every tick and sits out five ticks after a losing trade.",
    detail: [
      "Lower Six buys a one-tick Under 6. After a winning trade it buys the next one on the following tick.",
      "After a losing trade it lets five ticks pass before it enters again. The pause changes how fast the session moves after a loss; the next stake is set by the plan, not by the pause. It is the mirror image of Upper Six.",
    ],
    example:
      "The bot buys Under 6 and the next tick ends in 8: a loss. Five ticks pass with no trade. Then it buys Under 6 again, at the multiplied stake.",
    plans: SIX_LADDER,
  },
  {
    id: "downhill",
    name: "Downhill",
    tagline: "Bets against three ticks in a row.",
    family: "rise_fall",
    bet: "Rise / Fall",
    ticks: 5,
    wins: "the price ends above where it started for a Rise, or below it for a Fall",
    pace: "After three ticks running one way, on the other side",
    rule: "Downhill waits until three ticks in a row have moved in the same direction, then takes the opposite side for five ticks.",
    detail: [
      "Downhill compares each tick with the one before it. It enters only when the three newest ticks have all moved the same way: each higher than the last, or each lower. A tick that did not move breaks the run.",
      "After three ticks up it buys a five-tick Fall; after three ticks down it buys a five-tick Rise. When that contract has closed it reads the newest ticks again and waits for the next run of three.",
    ],
    example:
      "The price ticks 100.10, 100.14, 100.19, 100.25: three moves up in a row. The bot buys a Fall lasting five ticks, which wins if the price is below where the contract started when the fifth tick arrives.",
    plans: RISE_FALL_LADDER,
  },
  {
    id: "long_climb",
    name: "Long Climb",
    tagline: "Follows three ticks in a row, for ten.",
    family: "rise_fall",
    bet: "Rise / Fall",
    ticks: 10,
    wins: "the price ends above where it started for a Rise, or below it for a Fall",
    pace: "After three ticks running one way, on the same side",
    rule: "Long Climb waits until three ticks in a row have moved in the same direction, then takes that side for ten ticks.",
    detail: [
      "Long Climb compares each tick with the one before it. It enters only when the three newest ticks have all moved the same way. A tick that did not move breaks the run.",
      "After three ticks up it buys a ten-tick Rise; after three ticks down it buys a ten-tick Fall. Ten ticks is the longest contract of the Rise / Fall bots, and only one contract is open at a time.",
    ],
    example:
      "The price ticks 100.25, 100.19, 100.14, 100.10: three moves down in a row. The bot buys a Fall lasting ten ticks, which wins if the price is below where the contract started when the tenth tick arrives.",
    plans: RISE_FALL_LADDER,
  },
  {
    id: "short_climb",
    name: "Short Climb",
    tagline: "Follows two ticks in a row, for five.",
    family: "rise_fall",
    bet: "Rise / Fall",
    ticks: 5,
    wins: "the price ends above where it started for a Rise, or below it for a Fall",
    pace: "After two ticks running one way, on the same side",
    rule: "Short Climb waits until two ticks in a row have moved in the same direction, then takes that side for five ticks.",
    detail: [
      "Short Climb compares each tick with the one before it. It enters when the two newest ticks have both moved the same way. A tick that did not move breaks the run.",
      "After two ticks up it buys a five-tick Rise; after two ticks down it buys a five-tick Fall. It asks for a shorter run than Long Climb and holds each contract for half as long.",
    ],
    example:
      "The price ticks 100.10, 100.14, 100.19: two moves up in a row. The bot buys a Rise lasting five ticks, which wins if the price is above where the contract started when the fifth tick arrives.",
    plans: RISE_FALL_LADDER,
  },
  {
    id: "quick_dip",
    name: "Quick Dip",
    tagline: "One tick, against the last one.",
    family: "rise_fall",
    bet: "Rise / Fall",
    ticks: 1,
    wins: "the price ends above where it started for a Rise, or below it for a Fall",
    pace: "As soon as the last contract closes, against the last tick",
    rule: "Quick Dip takes the side opposite to the move of the newest tick, for one tick, as soon as its last contract has closed.",
    detail: [
      "Quick Dip looks only at the newest tick. If that tick moved up it buys a one-tick Fall; if it moved down it buys a one-tick Rise. If the tick did not move, it waits for one that does.",
      "It has no other condition and no pause. As soon as a contract has closed it reads the newest tick and enters again, which makes it the fastest of the Rise / Fall bots.",
    ],
    example:
      "The newest tick moved from 100.14 to 100.19, so the bot buys a one-tick Fall. The trade wins if the next tick is below the price the contract started at.",
    plans: RISE_FALL_LADDER,
  },
  {
    id: "slow_slope",
    name: "Slow Slope",
    tagline: "Rise, then Fall, by turns.",
    family: "rise_fall",
    bet: "Rise / Fall",
    ticks: 5,
    wins: "the price ends above where it started for a Rise, or below it for a Fall",
    pace: "Rise and Fall by turns, with 5 ticks out after each",
    rule: "Slow Slope buys a five-tick Rise and a five-tick Fall by turns, and sits out five ticks after each contract closes.",
    detail: [
      "Slow Slope does not read the ticks to choose its side. Its first trade of a session is a Rise, its second a Fall, its third a Rise, and so on, whatever the price has done.",
      "Each contract lasts five ticks. After it closes the bot lets five ticks pass before it buys the next one.",
    ],
    example:
      "The bot buys a Rise lasting five ticks. It closes, five more ticks pass with no trade, and the bot buys a Fall lasting five ticks.",
    plans: RISE_FALL_LADDER,
  },
  {
    id: "patient_rise",
    name: "Patient Rise",
    tagline: "Rise, for ten ticks at a time.",
    family: "rise_fall",
    bet: "Rise",
    ticks: 10,
    wins: "the price ends above where it started",
    pace: "As soon as the last contract closes",
    rule: "Patient Rise buys a ten-tick Rise as soon as its last contract has closed, and never a Fall.",
    detail: [
      "Patient Rise takes one side only. It buys a Rise lasting ten ticks, waits for it to close, and buys the next one. It has no entry condition and no pause.",
      "Each contract lasts ten ticks and only one is open at a time, so it trades slowly however fast the market ticks.",
    ],
    example:
      "The bot buys a Rise at 100.10. Ten ticks later the price is 100.31, above where the contract started, so the trade wins. The bot buys the next ten-tick Rise.",
    plans: RISE_FALL_LADDER,
  },
  {
    id: "step_up",
    name: "Step Up",
    tagline: "Follows three ticks past a near barrier.",
    family: "higher_lower",
    bet: "Higher / Lower",
    ticks: 5,
    barrierScale: 0.5,
    wins: HIGHER_LOWER_WINS,
    pace: "After three ticks running one way, on the same side",
    rule: "Step Up waits until three ticks in a row have moved in the same direction, then bets for five ticks that the price ends beyond a near barrier on that side.",
    detail: [
      "Step Up compares each tick with the one before it. It enters only when the three newest ticks have all moved the same way. A tick that did not move breaks the run.",
      "After three ticks up it buys a five-tick Higher with its barrier above the entry price; after three ticks down, a five-tick Lower with its barrier below. The barrier is near: half of Deriv's default barrier distance for the market.",
    ],
    example:
      "The price ticks 650.12, 650.18, 650.25, 650.31: three moves up in a row. The bot buys a Higher lasting five ticks with a near barrier above the entry price. It wins only if the fifth tick ends above that barrier, not just above the entry price.",
    plans: NEAR_BARRIER_LADDER,
  },
  {
    id: "breakout",
    name: "Breakout",
    tagline: "Follows four ticks past the barrier.",
    family: "higher_lower",
    bet: "Higher / Lower",
    ticks: 5,
    barrierScale: 1,
    wins: HIGHER_LOWER_WINS,
    pace: "After four ticks running one way, on the same side",
    rule: "Breakout waits until four ticks in a row have moved in the same direction, then bets for five ticks that the price ends beyond the barrier on that side.",
    detail: [
      "Breakout compares each tick with the one before it. It enters only when the four newest ticks have all moved the same way, so it waits longer between trades than Step Up. A tick that did not move breaks the run.",
      "After four ticks up it buys a five-tick Higher; after four ticks down, a five-tick Lower. The barrier is at Deriv's default barrier distance for the market.",
    ],
    example:
      "The price ticks 650.40, 650.33, 650.27, 650.20, 650.11: four moves down in a row. The bot buys a Lower lasting five ticks with its barrier below the entry price. It wins if the fifth tick ends below the barrier.",
    plans: DEFAULT_BARRIER_LADDER,
  },
  {
    id: "long_reach",
    name: "Long Reach",
    tagline: "Follows two ticks past a far barrier.",
    family: "higher_lower",
    bet: "Higher / Lower",
    ticks: 5,
    barrierScale: 1.5,
    wins: HIGHER_LOWER_WINS,
    pace: "After two ticks running one way, on the same side",
    rule: "Long Reach waits until two ticks in a row have moved in the same direction, then bets for five ticks that the price ends beyond a far barrier on that side.",
    detail: [
      "Long Reach compares each tick with the one before it and enters when the two newest ticks have both moved the same way. A tick that did not move breaks the run.",
      "After two ticks up it buys a five-tick Higher; after two ticks down, a five-tick Lower. The barrier is far: one and a half times Deriv's default barrier distance. A far barrier is reached less often than a near one, and a win pays more.",
    ],
    example:
      "The price ticks 650.10, 650.16, 650.21: two moves up in a row. The bot buys a Higher lasting five ticks with a far barrier above the entry price. It wins only if the fifth tick ends above that barrier.",
    plans: FAR_BARRIER_LADDER,
  },
  {
    id: "canopy",
    name: "Canopy",
    tagline: "Bets on a reversal past a far barrier.",
    family: "higher_lower",
    bet: "Higher / Lower",
    ticks: 5,
    barrierScale: 1.5,
    wins: HIGHER_LOWER_WINS,
    pace: "After three ticks running one way, on the other side",
    rule: "Canopy waits until three ticks in a row have moved in the same direction, then bets for five ticks that the price ends beyond a far barrier on the other side.",
    detail: [
      "Canopy compares each tick with the one before it. It enters only when the three newest ticks have all moved the same way. A tick that did not move breaks the run.",
      "After three ticks up it buys a five-tick Lower with its barrier below the entry price; after three ticks down, a five-tick Higher with its barrier above. The barrier is far: one and a half times Deriv's default barrier distance.",
    ],
    example:
      "The price ticks 650.12, 650.18, 650.25, 650.31: three moves up in a row. The bot buys a Lower lasting five ticks with a far barrier below the entry price. It wins if the fifth tick ends below that barrier.",
    plans: FAR_BARRIER_LADDER,
  },
  {
    id: "ceiling",
    name: "Ceiling",
    tagline: "Higher, then Lower, past a far barrier.",
    family: "higher_lower",
    bet: "Higher / Lower",
    ticks: 5,
    barrierScale: 1.5,
    wins: HIGHER_LOWER_WINS,
    pace: "Higher and Lower by turns",
    rule: "Ceiling buys a five-tick Higher and a five-tick Lower by turns, each with a far barrier, as soon as its last contract has closed.",
    detail: [
      "Ceiling does not read the ticks to choose its side. Its first trade of a session is a Higher, its second a Lower, its third a Higher, and so on, whatever the price has done.",
      "The barrier is far: one and a half times Deriv's default barrier distance, above the entry price for a Higher and below it for a Lower. There is no pause between contracts.",
    ],
    example:
      "The bot buys a Higher lasting five ticks with a far barrier above the entry price. When it closes, the bot buys a Lower lasting five ticks with a far barrier below the new entry price.",
    plans: FAR_BARRIER_LADDER,
  },
  {
    id: "low_ceiling",
    name: "Low Ceiling",
    tagline: "Against two ticks, past a near barrier.",
    family: "higher_lower",
    bet: "Higher / Lower",
    ticks: 5,
    barrierScale: 0.5,
    wins: HIGHER_LOWER_WINS,
    pace: "After two ticks running one way, on the other side",
    rule: "Low Ceiling waits until two ticks in a row have moved in the same direction, then bets for five ticks that the price ends beyond a near barrier on the other side.",
    detail: [
      "Low Ceiling compares each tick with the one before it and enters when the two newest ticks have both moved the same way. A tick that did not move breaks the run.",
      "After two ticks up it buys a five-tick Lower; after two ticks down, a five-tick Higher. The barrier is near: half of Deriv's default barrier distance for the market.",
    ],
    example:
      "The price ticks 650.31, 650.25, 650.18: two moves down in a row. The bot buys a Higher lasting five ticks with a near barrier above the entry price. It wins if the fifth tick ends above that barrier.",
    plans: NEAR_BARRIER_LADDER,
  },
  {
    id: "flat_roof",
    name: "Flat Roof",
    tagline: "Higher, then Lower, with a pause between.",
    family: "higher_lower",
    bet: "Higher / Lower",
    ticks: 5,
    barrierScale: 1,
    wins: HIGHER_LOWER_WINS,
    pace: "Higher and Lower by turns, with 5 ticks out after each",
    rule: "Flat Roof buys a five-tick Higher and a five-tick Lower by turns, and sits out five ticks after each contract closes.",
    detail: [
      "Flat Roof does not read the ticks to choose its side. Its first trade of a session is a Higher, its second a Lower, and so on, whatever the price has done.",
      "The barrier is at Deriv's default barrier distance for the market. After each contract closes the bot lets five ticks pass before it buys the next one.",
    ],
    example:
      "The bot buys a Higher lasting five ticks. It closes, five more ticks pass with no trade, and the bot buys a Lower lasting five ticks.",
    plans: DEFAULT_BARRIER_LADDER,
  },
  {
    id: "fingertip",
    name: "Fingertip",
    tagline: "Touch, at the barrier.",
    family: "touch_no_touch",
    bet: "Touch",
    ticks: 5,
    barrierScale: 1,
    wins: TOUCH_WINS,
    pace: "As soon as the last contract closes",
    rule: "Fingertip buys a five-tick Touch with its barrier above the entry price as soon as its last contract has closed.",
    detail: [
      "Fingertip has no entry condition and takes one side only. It buys a five-tick Touch, waits for it to close, and buys the next one.",
      "The barrier is above the entry price, at Deriv's default barrier distance for a Touch on that market. The contract closes as soon as the barrier is touched, so a winning trade can end before its fifth tick.",
    ],
    example:
      "The bot buys a Touch at 650.20 with its barrier above that price. On the third tick the price reaches the barrier: the trade wins and closes, and the bot buys the next Touch.",
    plans: [plan("20", "0.35", "1", "1.87"), plan("100", "2", "5", "1.87"), plan("500", "10", "25", "1.87")],
  },
  {
    id: "far_touch",
    name: "Far Touch",
    tagline: "Touch, at a far barrier.",
    family: "touch_no_touch",
    bet: "Touch",
    ticks: 5,
    barrierScale: 1.5,
    wins: TOUCH_WINS,
    pace: "Every contract, with 3 ticks out after each",
    rule: "Far Touch buys a five-tick Touch with a far barrier above the entry price, and sits out three ticks after each contract closes.",
    detail: [
      "Far Touch takes one side only. It buys a five-tick Touch whose barrier is far: one and a half times Deriv's default barrier distance for a Touch on that market.",
      "A far barrier is touched less often than a near one, and a win pays more. After each contract closes the bot lets three ticks pass before it buys the next one.",
    ],
    example:
      "The bot buys a Touch with a far barrier. The price rises but stays below the barrier for all five ticks: the trade loses. Three ticks pass, and the bot buys the next Touch.",
    plans: [plan("20", "0.35", "0.4", "1.48"), plan("100", "0.35", "5", "1.48"), plan("500", "2", "25", "1.48")],
  },
  {
    id: "brush",
    name: "Brush",
    tagline: "Touch, at a near barrier.",
    family: "touch_no_touch",
    bet: "Touch",
    ticks: 5,
    barrierScale: 0.5,
    wins: TOUCH_WINS,
    pace: "As soon as the last contract closes",
    rule: "Brush buys a five-tick Touch with a near barrier above the entry price as soon as its last contract has closed.",
    detail: [
      "Brush takes one side only and has no entry condition. Its barrier is near: half of Deriv's default barrier distance for a Touch on that market.",
      "A near barrier is touched more often than a far one, and a win pays less than the stake. The contract closes as soon as the barrier is touched.",
    ],
    example:
      "The bot buys a Touch with a near barrier above the entry price. The next tick reaches it: the trade wins at once, and the bot buys the next Touch.",
    plans: [plan("20", "0.35", "1", "3.19"), plan("100", "1", "5", "2.83"), plan("500", "5", "25", "2.83")],
  },
  {
    id: "hands_off",
    name: "Hands Off",
    tagline: "No Touch, at a far barrier.",
    family: "touch_no_touch",
    bet: "No Touch",
    ticks: 5,
    barrierScale: 1.5,
    wins: NO_TOUCH_WINS,
    pace: "As soon as the last contract closes",
    rule: "Hands Off buys a five-tick No Touch with a far barrier above the entry price as soon as its last contract has closed.",
    detail: [
      "Hands Off takes one side only and has no entry condition. It bets that the price will not reach a far barrier, one and a half times Deriv's default barrier distance above the entry price, at any of the next five ticks.",
      "A far barrier is rarely reached in five ticks, so a No Touch on it wins often and a win pays a small fraction of the stake. The contract loses as soon as the barrier is touched.",
    ],
    example:
      "The bot buys a No Touch with a far barrier. The price moves up and down but never reaches the barrier in five ticks: the trade wins, and the bot buys the next one.",
    plans: [plan("20", "2", "0.4", "5.59"), plan("100", "2", "5", "6.3"), plan("500", "10", "25", "6.3")],
  },
  {
    id: "clear_air",
    name: "Clear Air",
    tagline: "No Touch, at the barrier.",
    family: "touch_no_touch",
    bet: "No Touch",
    ticks: 5,
    barrierScale: 1,
    wins: NO_TOUCH_WINS,
    pace: "Every contract, with 5 ticks out after each",
    rule: "Clear Air buys a five-tick No Touch with its barrier above the entry price, and sits out five ticks after each contract closes.",
    detail: [
      "Clear Air takes one side only. It bets that the price will not reach a barrier at Deriv's default barrier distance above the entry price at any of the next five ticks.",
      "The barrier is nearer than Hands Off's, so it is reached more often and a win pays more. After each contract closes the bot lets five ticks pass before it buys the next one.",
    ],
    example:
      "The bot buys a No Touch. On the fourth tick the price reaches the barrier: the trade loses and closes. Five ticks pass, and the bot buys the next No Touch.",
    plans: [plan("20", "1", "1", "3.52"), plan("100", "2", "5", "3.12"), plan("500", "10", "25", "3.12")],
  },
  {
    id: "snowball",
    name: "Snowball",
    tagline: "1% a tick, closed at 3%.",
    family: "accumulators",
    bet: "Accumulator",
    growthRate: 1,
    closeAt: "3%",
    wins: "the position grows to its take profit of 3% of the stake before any tick leaves the range",
    pace: "As soon as the last position closes",
    rule: "Snowball opens an Accumulator at a growth rate of 1% as soon as its last position has closed, and closes it at a profit of 3% of the stake.",
    detail: [
      "Snowball has no entry condition. It opens an Accumulator at 1% and holds it while the ticks stay inside the range Deriv sets around the previous tick.",
      "The position has a take profit of 3% of the stake. When it reaches that, it is closed and the session ends at its target. If a tick leaves the range first, the position is knocked out and the stake is lost; the bot then opens the next one.",
    ],
    example:
      "On the 20 plan the bot opens an Accumulator with a stake of 10. The ticks stay inside the range until the position is worth 0.30 more than its stake: it is closed at that profit and the session ends.",
    plans: [plan("20", "10", "0.3", "0"), plan("100", "50", "1.5", "0")],
  },
  {
    id: "quick_stack",
    name: "Quick Stack",
    tagline: "2% a tick, closed at 4%.",
    family: "accumulators",
    bet: "Accumulator",
    growthRate: 2,
    closeAt: "4%",
    wins: "the position grows to its take profit of 4% of the stake before any tick leaves the range",
    pace: "As soon as the last position closes",
    rule: "Quick Stack opens an Accumulator at a growth rate of 2% as soon as its last position has closed, and closes it at a profit of 4% of the stake.",
    detail: [
      "Quick Stack has no entry condition. It opens an Accumulator at 2%, which grows faster than one at 1%; Deriv sets a narrower range for a higher rate, so a tick leaves it more easily.",
      "The position has a take profit of 4% of the stake. When it reaches that, it is closed and the session ends at its target. A tick outside the range first knocks it out and loses the stake.",
    ],
    example:
      "On the 20 plan the bot opens an Accumulator with a stake of 10. A tick lands outside the range before the position is worth 0.40 more than its stake: it is knocked out and 10 is lost. The bot opens one more position with the 10 left of the stop loss.",
    plans: [plan("20", "10", "0.4", "0"), plan("100", "50", "2", "0")],
  },
  {
    id: "fast_stack",
    name: "Fast Stack",
    tagline: "3% a tick, closed at 3%.",
    family: "accumulators",
    bet: "Accumulator",
    growthRate: 3,
    closeAt: "3%",
    wins: "the position grows to its take profit of 3% of the stake before any tick leaves the range",
    pace: "With 10 ticks out after each position",
    rule: "Fast Stack sits out ten ticks after a position closes, then opens an Accumulator at a growth rate of 3% and closes it at a profit of 3% of the stake.",
    detail: [
      "Fast Stack opens an Accumulator at 3%. Its take profit of 3% of the stake is reached after fewer ticks of growth than Snowball's, inside a narrower range.",
      "After a position closes, the bot lets ten ticks pass before it opens the next one. When a position reaches its take profit, the session ends at its target.",
    ],
    example:
      "On the 100 plan the bot opens an Accumulator with a stake of 50. It grows until it is worth 1.50 more than the stake, and is closed at that profit: the session ends.",
    plans: [plan("20", "10", "0.3", "0"), plan("100", "50", "1.5", "0")],
  },
  {
    id: "avalanche",
    name: "Avalanche",
    tagline: "5% a tick, closed at 3.5%.",
    family: "accumulators",
    bet: "Accumulator",
    growthRate: 5,
    closeAt: "3.5%",
    wins: "the position grows to its take profit of 3.5% of the stake before any tick leaves the range",
    pace: "As soon as the last position closes",
    rule: "Avalanche opens an Accumulator at a growth rate of 5% as soon as its last position has closed, and closes it at a profit of 3.5% of the stake.",
    detail: [
      "Avalanche uses the highest growth rate of the Accumulator bots, 5%, so its take profit of 3.5% of the stake is reached after very few ticks. Deriv sets the narrowest range for this rate, so a tick leaves it most easily.",
      "When a position reaches its take profit, it is closed and the session ends at its target. A tick outside the range first knocks it out and loses the stake.",
    ],
    example:
      "On the 20 plan the bot opens an Accumulator with a stake of 10. After a couple of ticks of growth it is worth 0.35 more than its stake: it is closed at that profit and the session ends.",
    plans: [plan("20", "10", "0.35", "0"), plan("100", "50", "1.75", "0")],
  },
  {
    id: "slow_lever",
    name: "Slow Lever",
    tagline: "x40 with the last three ticks, closed at 10%.",
    family: "multipliers",
    bet: "Multiplier",
    leverage: 40,
    closeAt: "10%",
    wins: "the position reaches its take profit of a tenth of the stake before it is stopped out",
    pace: "After three ticks running one way, on the same side",
    rule: "Slow Lever waits until three ticks in a row have moved in the same direction, then opens a x40 Multiplier that way and closes it at a profit of a tenth of the stake.",
    detail: [
      "Slow Lever compares each tick with the one before it. When the three newest ticks have all moved the same way it opens a Multiplier at x40 in that direction: Up after three ticks up, Down after three ticks down. A tick that did not move breaks the run.",
      "The position has a take profit of a tenth of the stake. When it reaches that, it is closed and the session ends at its target. If the price moves the other way far enough to take the whole stake, Deriv stops the position out.",
    ],
    example:
      "On the 20 plan, after three ticks up, the bot opens a Multiplier Up at x40 with a stake of 10. The price keeps rising until the position is 1.00 in profit: it is closed and the session ends.",
    plans: [plan("20", "10", "1", "0"), plan("100", "50", "5", "0")],
  },
  {
    id: "long_lever",
    name: "Long Lever",
    tagline: "x40 against the last three ticks, closed at 12%.",
    family: "multipliers",
    bet: "Multiplier",
    leverage: 40,
    closeAt: "12%",
    wins: "the position reaches its take profit of 12% of the stake before it is stopped out",
    pace: "After three ticks running one way, on the other side",
    rule: "Long Lever waits until three ticks in a row have moved in the same direction, then opens a x40 Multiplier the other way and closes it at a profit of 12% of the stake.",
    detail: [
      "Long Lever compares each tick with the one before it. When the three newest ticks have all moved the same way it opens a Multiplier at x40 against that move: Down after three ticks up, Up after three ticks down.",
      "The position has a take profit of 12% of the stake. When it reaches that, it is closed and the session ends at its target. A position cannot lose more than its stake; Deriv stops it out first.",
    ],
    example:
      "On the 100 plan, after three ticks down, the bot opens a Multiplier Up at x40 with a stake of 50. The price turns up until the position is 6.00 in profit: it is closed and the session ends.",
    plans: [plan("20", "10", "1.2", "0"), plan("100", "50", "6", "0")],
  },
  {
    id: "even_lever",
    name: "Even Lever",
    tagline: "x100, up then down, closed at 10%.",
    family: "multipliers",
    bet: "Multiplier",
    leverage: 100,
    closeAt: "10%",
    wins: "the position reaches its take profit of a tenth of the stake before it is stopped out",
    pace: "Up and Down by turns",
    rule: "Even Lever opens a x100 Multiplier Up and a x100 Multiplier Down by turns, and closes each at a profit of a tenth of the stake.",
    detail: [
      "Even Lever does not read the ticks to choose its direction. Its first position of a session is Up, its second Down, and so on.",
      "At x100 a position moves a hundred times the price's move, so it reaches its take profit, or loses its stake, faster than one at x40. The commission Deriv takes at entry also grows with the multiplier.",
    ],
    example:
      "On the 20 plan the bot opens a Multiplier Up at x100 with a stake of 10. The price falls and the position is stopped out: 10 is lost. The bot opens a Multiplier Down with the 10 left of the stop loss.",
    plans: [plan("20", "10", "1", "0"), plan("100", "50", "5", "0")],
  },
  {
    id: "full_swing",
    name: "Full Swing",
    tagline: "x100 with the last two ticks, closed at 8%.",
    family: "multipliers",
    bet: "Multiplier",
    leverage: 100,
    closeAt: "8%",
    wins: "the position reaches its take profit of 8% of the stake before it is stopped out",
    pace: "After two ticks running one way, on the same side",
    rule: "Full Swing waits until two ticks in a row have moved in the same direction, then opens a x100 Multiplier that way and closes it at a profit of 8% of the stake.",
    detail: [
      "Full Swing compares each tick with the one before it. When the two newest ticks have both moved the same way it opens a Multiplier at x100 in that direction. A tick that did not move breaks the run.",
      "The position has a take profit of 8% of the stake. When it reaches that, it is closed and the session ends at its target. A position cannot lose more than its stake.",
    ],
    example:
      "On the 100 plan, after two ticks up, the bot opens a Multiplier Up at x100 with a stake of 50. The position reaches 4.00 in profit: it is closed and the session ends.",
    plans: [plan("20", "10", "0.8", "0"), plan("100", "50", "4", "0")],
  },
];

export const AUTOHUB_BOT_COUNT = FIXED_PLAN_BOTS.length;

/** "nine_lives" -> "nine-lives-bot". */
export function botGuideSlug(id: string): string {
  return `${id.replace(/_/g, "-")}-bot`;
}

export function escalates(p: BotPlan): boolean {
  return p.multiplier !== "0";
}

/** "Flat" or "Martingale" for a bot, read from its plans. */
export function stakeStyle(bot: FixedPlanBot): "Flat" | "Martingale" {
  return bot.plans.some(escalates) ? "Martingale" : "Flat";
}

/** How many ticks a bot's contract lasts. */
export function contractTicks(bot: FixedPlanBot): number {
  return bot.ticks ?? 1;
}

export function isDigitBot(bot: FixedPlanBot): boolean {
  return bot.family === "matches_differs" || bot.family === "even_odd" || bot.family === "over_under";
}

export function isBarrierBot(bot: FixedPlanBot): boolean {
  return bot.family === "higher_lower" || bot.family === "touch_no_touch";
}

/** Accumulators and Multipliers: no length, held until closed. */
export function isHeldBot(bot: FixedPlanBot): boolean {
  return bot.family === "accumulators" || bot.family === "multipliers";
}

/** The markets a bot may be started on, as the engine's AllowedSymbols says. */
export type MarketSet = "digit" | "volatility" | "two_second" | "volatility_100";

export function marketSet(bot: FixedPlanBot): MarketSet {
  if (isDigitBot(bot)) return "digit";
  if (isBarrierBot(bot)) return "two_second";
  if (isHeldBot(bot)) return "volatility_100";
  return "volatility";
}
