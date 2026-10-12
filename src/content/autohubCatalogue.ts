/**
 * The Auto Hub bots, as the public guides describe them.
 *
 * This mirrors the engine's catalogue (internal/autohub/bots.go and
 * bots_digits.go in trading-engine-deriv), which is the copy that counts: the
 * engine decides every entry and sizes every stake. A bot's contract, entry
 * rule or plans change here in the same commit as they change there, because
 * a guide that describes a bot wrongly is a false public statement about a
 * trading product.
 *
 * It imports nothing from the guides, so both the Auto Hub overview guide and
 * the per-bot guides can read it.
 */

export type DigitFamily = "matches_differs" | "even_odd" | "over_under";

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
  family: DigitFamily;
  /** The contract as it is named on the order: "Over 4", "Differs". */
  bet: string;
  /** Completes "A trade wins when ...". */
  wins: string;
  /** How many of the ten last digits win. */
  winning: number;
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
const HALF_LADDER = [plan("20", "0.35", "2", "2.41"), plan("100", "1", "5", "2.13"), plan("500", "5", "25", "2.13")];
const FOUR_LADDER = [plan("20", "0.35", "1", "1.76"), plan("100", "2", "5", "1.76"), plan("500", "2", "50", "1.99")];
const SIX_LADDER = [plan("20", "0.35", "1", "3.04"), plan("100", "1", "5", "2.7"), plan("500", "2", "50", "2.7")];
const FLAT_SMALL = [plan("20", "2", "1", "0"), plan("100", "10", "5", "0"), plan("500", "25", "10", "0")];
const FLAT_WIDE = [plan("20", "5", "1", "0"), plan("100", "25", "5", "0"), plan("500", "25", "10", "0")];
const FLAT_EVEN = [plan("20", "1", "1", "0"), plan("100", "5", "5", "0"), plan("500", "25", "25", "0")];

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
    plans: [plan("20", "1", "1", "14.74"), plan("100", "5", "5", "14.74"), plan("500", "25", "25", "14.74")],
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
    plans: [plan("100", "0.35", "5", "1.16"), plan("500", "2", "25", "1.16")],
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
    plans: [plan("20", "5", "1", "0"), plan("100", "25", "5", "0")],
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
      "It reads no pattern in the digits. Every plan starts from 0.35, the smallest stake Deriv takes on a digit contract.",
    ],
    example:
      "The bot buys Over 6 and the next tick ends in 6: a loss, because 6 is not over 6. Three ticks pass. On the fourth it buys Over 6 again.",
    plans: [plan("20", "0.35", "1", "1.5"), plan("100", "0.35", "5", "1.5"), plan("500", "0.35", "25", "1.5")],
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
    plans: [plan("20", "0.35", "1", "1.31"), plan("100", "0.35", "5", "1.31"), plan("500", "2", "25", "1.31")],
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
    plans: [plan("20", "1", "2", "3.67"), plan("100", "1", "10", "4.14"), plan("500", "5", "50", "4.14")],
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
    plans: [plan("20", "0.35", "1", "6.46"), plan("100", "2", "10", "6.46"), plan("500", "10", "50", "6.46")],
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
    plans: [plan("20", "2", "1", "0"), plan("100", "10", "5", "0"), plan("500", "25", "25", "0")],
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
    plans: FLAT_EVEN,
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
    plans: FLAT_EVEN,
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
    plans: [plan("100", "2", "2", "0"), plan("500", "10", "10", "0")],
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
];

/** The three bots Auto Hub opened with: the user sets their amounts. */
export const OWN_AMOUNT_BOTS = [
  {
    id: "hot_fade",
    name: "Hot Fade",
    bet: "Differs",
    pace: "After one digit clusters and prints three times running",
    markets: "1 to 10",
  },
  {
    id: "shadow_fade",
    name: "Shadow Fade",
    bet: "Differs",
    pace: "Hot Fade's entries, scored first and traded only when your rule is met",
    markets: "1 to 10",
  },
  {
    id: "matches_differs",
    name: "Matches / Differs",
    bet: "Matches or Differs",
    pace: "Every tick, on the digit you pick",
    markets: "1",
  },
] as const;

export const AUTOHUB_BOT_COUNT = FIXED_PLAN_BOTS.length + OWN_AMOUNT_BOTS.length;

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
