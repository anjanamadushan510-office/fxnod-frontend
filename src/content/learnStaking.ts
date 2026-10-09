/**
 * Stake-sizing systems and the ideas behind them: what each one does to the
 * stake, a worked sequence, and what it cannot do. Same shape and same rules
 * as the tool guides in `guides.ts`.
 *
 * The recurring point is arithmetic, not opinion: a staking system rearranges
 * when losses arrive and how large they are. It does not change the expected
 * result of the trades it is applied to. Every sequence here can be checked
 * by hand.
 */
import { RISK_NOTE, type Guide } from "./guides";

const TAG = "Stake strategies";
const DATE = "2026-10-09";

export const STAKING_GUIDES: Guide[] = [
  {
    slug: "martingale-strategy-explained",
    title: "Martingale strategy in trading: how it works and why it fails",
    description:
      "Martingale doubles the stake after every loss so one win recovers them all. The full ladder, the chance of ruin, and what limits make it survivable.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "The Martingale strategy multiplies the stake after every loss, usually by two, so that the next win recovers all previous losses plus one unit of profit. It wins small amounts very often and loses a very large amount occasionally. It does not change the average result of the trades. It only hides the losses until a long streak arrives.",
    body: [
      { type: "h2", text: "The ladder" },
      {
        type: "table",
        head: ["Loss number", "Stake", "Total lost so far", "Profit if this trade wins at even money"],
        rows: [
          ["1", "1", "1", "1"],
          ["2", "2", "3", "1"],
          ["3", "4", "7", "1"],
          ["4", "8", "15", "1"],
          ["5", "16", "31", "1"],
          ["6", "32", "63", "1"],
          ["7", "64", "127", "1"],
          ["8", "128", "255", "1"],
          ["10", "512", "1,023", "1"],
        ],
      },
      {
        type: "p",
        text: "Every row risks more to win the same single unit. By the seventh step you stake 64 to win 1.",
      },
      { type: "h2", text: "It is worse when the payout is under double" },
      {
        type: "p",
        text: "The table assumes a win pays the full stake. Options pay less. If a win pays 95% of the stake, doubling recovers less at each step and then not at all: after three losses of 1, 2 and 4, a win on 8 pays 7.60 against 7 lost, a profit of 0.60 where even money gave 1. After five losses, a win on 32 pays 30.40 against 31 lost. To recover fully the multiplier must be larger than two, about 2.05 at that payout, which makes the ladder steeper still.",
      },
      { type: "h2", text: "How often the ladder breaks" },
      {
        type: "table",
        head: ["Steps allowed", "Chance a given sequence loses them all (50% trades)", "Loss when it does"],
        rows: [
          ["3", "12.5%, 1 in 8", "7"],
          ["5", "3.1%, 1 in 32", "31"],
          ["7", "0.78%, 1 in 128", "127"],
          ["10", "0.098%, 1 in 1,024", "1,023"],
        ],
      },
      {
        type: "p",
        text: "Look at any row: you win 1 about that many times and then lose roughly the same total in one go. With seven steps, 127 sequences win 1 each on average for every one that loses 127. On an even-money bet that is exactly zero, and on a contract that pays less than even money it is a loss.",
      },
      { type: "h2", text: "Why it looks so good at first" },
      {
        type: "p",
        text: "For hours or days the balance climbs in a straight line with almost no drawdown. A short test will show a 100% record. Nothing in that record measures the risk, because the risk is the event that has not happened yet.",
      },
      { type: "h2", text: "If you use it anyway" },
      {
        type: "list",
        items: [
          "Limit the steps, and treat the full ladder as a loss you will take.",
          "Cap the largest single stake.",
          "Start from a stake so small that the last step is affordable.",
          "Set a session stop loss equal to the ladder's total, not smaller, or the ladder cannot complete.",
          "Never restart at a higher base after the ladder breaks.",
        ],
      },
      { type: "h2", text: "In FXNOD dBot" },
      {
        type: "p",
        text: "dBot labels Martingale as high risk and shows the stakes of a losing streak before you start. You choose the multiplier and how many steps it may take. An escalated stake is never allowed above your Never stake more than amount or above the session's stop loss. When the last step loses, or the next stake would exceed what one trade may be, the session ends with the loss. Auto Hub bots do not use Martingale.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Does Martingale work in trading?",
        a: "It works until a losing streak longer than your ladder arrives, and then it loses everything it made and more. It cannot turn a losing bet into a winning one.",
      },
      {
        q: "How many losses in a row should I plan for?",
        a: "More than feels likely. On 50% trades, seven in a row happens about once in 128 sequences, which a fast bot reaches within hours.",
      },
      {
        q: "What is the best Martingale multiplier?",
        a: "None is safe. A higher multiplier recovers faster and reaches the limit sooner. A lower one, under two, does not fully recover the losses.",
      },
      {
        q: "Is Martingale banned on Deriv?",
        a: "Deriv's own bot builder lists Martingale among its preset strategies. Being allowed is not the same as being advisable.",
      },
    ],
    related: ["reverse-martingale-explained", "flat-stake-explained"],
  },

  {
    slug: "reverse-martingale-explained",
    title: "Reverse Martingale (Paroli): raising the stake after wins",
    description:
      "Reverse Martingale increases the stake after a win and resets after a loss. How a three-step cycle works, what it risks, and what it cannot change.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Reverse Martingale, also called anti-Martingale or Paroli, increases the stake after a win and returns to the base stake after a loss. It risks only the base stake plus winnings, so losing streaks are cheap. In exchange it wins rarely: a cycle pays only when several wins come in a row. The average result is unchanged.",
    body: [
      { type: "h2", text: "A three-step cycle" },
      {
        type: "table",
        head: ["Result so far", "Next stake", "Net position"],
        rows: [
          ["Start", "1", "0"],
          ["Win", "2", "+1"],
          ["Win, win", "4", "+3"],
          ["Win, win, win", "Stop and reset to 1", "+7"],
          ["Any loss before the third win", "Reset to 1", "-1"],
        ],
      },
      {
        type: "p",
        text: "At even money, three wins in a row turn a stake of 1 into a profit of 7. Any loss along the way costs only the original 1, because the larger stakes were made of winnings.",
      },
      { type: "h2", text: "The arithmetic" },
      {
        type: "p",
        text: "On 50% trades, three wins in a row happen one time in eight. Seven cycles lose 1 each and one cycle wins 7: zero on average, before the contract's cost. It is the mirror image of Martingale: many small losses and an occasional large win, where Martingale gives many small wins and an occasional large loss.",
      },
      { type: "h2", text: "Compared with Martingale" },
      {
        type: "table",
        head: ["", "Martingale", "Reverse Martingale"],
        rows: [
          ["Stake rises after", "A loss", "A win"],
          ["Most a cycle can lose", "The whole ladder", "The base stake"],
          ["Typical session", "Smooth gains, then a crash", "Slow bleed, then a jump"],
          ["Psychological cost", "Very high at the end", "Constant small frustration"],
          ["Expected result", "Unchanged", "Unchanged"],
        ],
      },
      { type: "h2", text: "Choosing the cycle length" },
      {
        type: "list",
        items: [
          "Two wins: pays 3 one time in four.",
          "Three wins: pays 7 one time in eight.",
          "Four wins: pays 15 one time in sixteen.",
          "Longer cycles pay more and complete more rarely. Decide the length before you start and always reset when it is reached.",
        ],
      },
      { type: "h2", text: "Why some traders prefer it" },
      {
        type: "p",
        text: "The worst case is known and small. A bad session is a string of base-stake losses, which a stop loss handles cleanly. That makes it far easier to live with than a recovery system, even though neither improves the odds.",
      },
      { type: "h2", text: "In FXNOD dBot" },
      {
        type: "p",
        text: "Reverse Martingale is one of the stake settings in dBot. An escalated stake holds at your ceiling instead of ending the run, and the session stop loss and profit target apply as usual.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is reverse Martingale safer than Martingale?",
        a: "Its worst case is far smaller, because it only risks the base stake and winnings. It is not more profitable on average.",
      },
      {
        q: "What is the Paroli system?",
        a: "A reverse Martingale with a fixed cycle, usually three wins, after which the stake resets to the base.",
      },
      {
        q: "Does it work on trending markets?",
        a: "It benefits from streaks of wins. Whether a market will produce them is the part no staking system can provide.",
      },
    ],
    related: ["martingale-strategy-explained", "dalembert-strategy-explained"],
  },

  {
    slug: "dalembert-strategy-explained",
    title: "D'Alembert strategy: a gentler progression after losses",
    description:
      "D'Alembert adds one unit to the stake after a loss and removes one after a win. A worked sequence, how it compares with Martingale, and its limit.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "The D'Alembert strategy raises the stake by one unit after a loss and lowers it by one unit after a win. The stake grows in a straight line, not by doubling, so a losing streak is far cheaper than under Martingale. It still increases the stake while losing, and it still cannot change the average result of the trades.",
    body: [
      { type: "h2", text: "A worked sequence" },
      {
        type: "table",
        head: ["Trade", "Stake", "Result", "Running total"],
        rows: [
          ["1", "1", "Loss", "-1"],
          ["2", "2", "Loss", "-3"],
          ["3", "3", "Win", "0"],
          ["4", "2", "Loss", "-2"],
          ["5", "3", "Win", "+1"],
          ["6", "2", "Win", "+3"],
        ],
      },
      {
        type: "p",
        text: "Three wins and three losses at even money end three units ahead. That is the appeal: when wins and losses balance, the system finishes in profit, because the wins came at higher stakes than the losses.",
      },
      { type: "h2", text: "The flaw" },
      {
        type: "p",
        text: "Wins and losses do not have to balance within your session. During a run of losses the stake keeps rising: ten losses in a row from a base of 1 cost 55 units, with the next stake at 11. That is much less than Martingale's 1,023, and much more than the 10 a flat stake would have lost. And when the payout is less than even money, a balanced set of wins and losses no longer comes out ahead by as much, or at all.",
      },
      { type: "h2", text: "Three systems, ten losses in a row" },
      {
        type: "table",
        head: ["System", "Tenth stake", "Total lost"],
        rows: [
          ["Flat stake", "1", "10"],
          ["D'Alembert", "10", "55"],
          ["Martingale", "512", "1,023"],
        ],
      },
      { type: "h2", text: "Where it fits" },
      {
        type: "list",
        items: [
          "It is a middle path for someone who insists on a progression.",
          "It needs a ceiling on the stake and a session stop loss like any other.",
          "It suits even-chance contracts. On contracts with very high or very low win rates the logic of balancing wins and losses does not apply.",
        ],
      },
      { type: "h2", text: "In practice" },
      {
        type: "p",
        text: "Deriv's own bot builder lists D'Alembert among its preset strategies. In FXNOD's dBot the nearest setting is gentle step, which raises the stake modestly after a loss and holds at your ceiling. Whichever tool you use, work out the total of a ten-loss streak before you start.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is D'Alembert better than Martingale?",
        a: "It is much less destructive in a losing streak. Neither improves the expected result.",
      },
      {
        q: "How much do I need to use D'Alembert?",
        a: "Enough to cover a long streak. Ten losses in a row from a base of 1 cost 55 units, and twenty cost 210.",
      },
      {
        q: "Does D'Alembert guarantee a profit when wins equal losses?",
        a: "Only at even money. With a payout under double the stake, equal wins and losses can still leave a loss.",
      },
    ],
    related: ["oscars-grind-explained", "martingale-strategy-explained"],
  },

  {
    slug: "oscars-grind-explained",
    title: "Oscar's Grind: the one-unit-per-cycle staking system",
    description:
      "Oscar's Grind raises the stake by one unit after a win and holds it after a loss, aiming for one unit of profit per cycle. Rules and a worked example.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Oscar's Grind aims to win exactly one unit per cycle. The stake stays the same after a loss and rises by one unit after a win, but never beyond what is needed to finish the cycle one unit ahead. It grows slowly and has milder losing streaks than Martingale, but a long cycle can still build large stakes.",
    body: [
      { type: "h2", text: "The rules" },
      {
        type: "list",
        items: [
          "Start each cycle with a stake of one unit.",
          "After a loss, keep the stake the same.",
          "After a win, raise the stake by one unit.",
          "Never stake more than is needed to end the cycle one unit in profit.",
          "When the cycle is one unit ahead, it is over. Start again at one unit.",
        ],
      },
      { type: "h2", text: "A worked cycle" },
      {
        type: "table",
        head: ["Trade", "Stake", "Result", "Cycle total"],
        rows: [
          ["1", "1", "Loss", "-1"],
          ["2", "1", "Loss", "-2"],
          ["3", "1", "Loss", "-3"],
          ["4", "1", "Win", "-2"],
          ["5", "2", "Win", "0"],
          ["6", "1", "Win", "+1"],
        ],
      },
      {
        type: "p",
        text: "After trade 5 the cycle is level, so the next stake is cut to 1: that is all that is needed to finish one unit ahead. Three wins and three losses produced the target.",
      },
      { type: "h2", text: "What makes it different" },
      {
        type: "p",
        text: "The stake never rises during a losing run, only after wins. A streak of losses costs one unit each, the same as a flat stake. The risk is slower and less visible: a long choppy cycle, with wins and losses alternating while the cycle is deeply negative, ratchets the stake up one unit at a time until a few losses at the higher level are expensive.",
      },
      { type: "h2", text: "Its limits" },
      {
        type: "list",
        items: [
          "A cycle can last a very long time and tie up a large loss before it resolves.",
          "The one-unit target is small against the stakes late in a cycle.",
          "With a payout under even money, the cycle needs more wins than losses to close.",
          "As with every progression, the expected result of the underlying trades is unchanged.",
        ],
      },
      { type: "h2", text: "Using it sensibly" },
      {
        type: "list",
        items: [
          "Set a maximum stake and abandon the cycle when it is reached.",
          "Set a session stop loss in money.",
          "Test it over several hundred trades on demo and look at the deepest cycle, not the average.",
        ],
      },
      { type: "h2", text: "In practice" },
      {
        type: "p",
        text: "Deriv's own bot builder lists Oscar's Grind among its preset strategies. FXNOD's dBot does not have a setting with that name; its stake settings are same stake, gentle step, Martingale and reverse Martingale.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is Oscar's Grind safe?",
        a: "It is milder than Martingale because the stake does not rise during losses. A long cycle can still produce large stakes and a large loss.",
      },
      {
        q: "How much profit does Oscar's Grind make?",
        a: "One unit per completed cycle by design. Uncompleted cycles are where the losses are.",
      },
      {
        q: "Can I use Oscar's Grind in FXNOD?",
        a: "dBot does not offer it by name. Its stake settings are same stake, gentle step, Martingale and reverse Martingale.",
      },
    ],
    related: ["dalembert-strategy-explained", "flat-stake-explained"],
  },

  {
    slug: "flat-stake-explained",
    title: "Flat stake: why the same stake every trade is the baseline",
    description:
      "A flat stake risks the same amount on every trade. Why it is the honest test of a strategy, how to size it, and what it shows that progressions hide.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "A flat stake means risking the same amount on every trade, whatever happened on the last one. It is the baseline every other staking system should be compared with, because it shows a strategy's real result without distortion. The worst case is easy to calculate: the stake multiplied by the number of losses. Start here.",
    body: [
      { type: "h2", text: "Why it is the honest test" },
      {
        type: "p",
        text: "With a flat stake, the profit or loss after a few hundred trades is simply the strategy's edge multiplied by the number of trades. If that number is negative, the strategy loses, and no progression will fix it. A progression applied first hides the answer behind a smooth balance line.",
      },
      { type: "h2", text: "Sizing the stake" },
      {
        type: "table",
        head: ["Stake as a share of the session's stop loss", "Net losses the session can absorb"],
        rows: [
          ["1%", "100"],
          ["2%", "50"],
          ["5%", "20"],
          ["10%", "10"],
        ],
      },
      {
        type: "p",
        text: "One to two per cent gives a strategy enough trades to show what it is. Ten per cent ends the session on a streak that occurs by chance many times a day on a fast bot.",
      },
      { type: "h2", text: "What a flat stake shows you" },
      {
        type: "list",
        items: [
          "The true win rate, undisturbed by stake size.",
          "The real cost of the contract, as a slow drift in the balance.",
          "How long losing streaks actually are.",
          "Whether you can follow a plan when it is boring.",
        ],
      },
      { type: "h2", text: "Fixed amount or fixed percentage" },
      {
        type: "p",
        text: "A fixed amount stakes the same sum every trade. A fixed percentage stakes the same share of the current balance, so the stake shrinks after losses and grows after wins. Fixed percentage protects the account automatically in a drawdown and compounds gains. Both are flat in the sense that matters: the last result does not trigger a bigger bet to recover.",
      },
      { type: "h2", text: "The objection" },
      {
        type: "p",
        text: "People say a flat stake is too slow. It is slow because it shows the truth: a strategy with a small edge earns a small amount per trade, and one with no edge loses a small amount per trade. Systems that feel faster are borrowing from a future loss.",
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "Same stake is the recommended setting in dBot, and every Auto Hub bot uses the same stake on every trade. Combined with the required stop loss, the most a session can lose is known before it starts.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is flat staking profitable?",
        a: "Only if the strategy has an edge. That is the point: it tells you whether there is one.",
      },
      {
        q: "How much should a flat stake be?",
        a: "About 1% to 2% of the amount you are prepared to lose in the session.",
      },
      {
        q: "Why do bots default to Martingale if flat is better?",
        a: "Because Martingale produces impressive short-term results that are easy to sell. A flat stake produces honest ones.",
      },
    ],
    related: ["martingale-strategy-explained", "how-to-calculate-position-size"],
  },

  {
    slug: "kelly-criterion-explained",
    title: "Kelly criterion: how much of your account to stake",
    description:
      "The Kelly criterion gives the stake that maximises long-term growth for a bet with an edge. The formula, worked examples, and why no edge means zero.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "The Kelly criterion is a formula for the share of your account to stake on a bet that has a positive edge. It equals the win probability times the payout ratio, minus the loss probability, all divided by the payout ratio. If the result is zero or negative there is no edge, and the correct stake is nothing.",
    body: [
      { type: "h2", text: "The formula" },
      {
        type: "p",
        text: "Kelly fraction equals b times p, minus q, divided by b. Here p is the chance of winning, q is the chance of losing, which is 1 minus p, and b is the profit per unit staked on a win. The answer is the fraction of the account to stake.",
      },
      { type: "h2", text: "Worked examples" },
      {
        type: "table",
        head: ["Win chance", "Profit per 1 staked", "Kelly fraction", "Meaning"],
        rows: [
          ["50%", "0.95", "-2.6%", "No edge: do not bet"],
          ["52%", "0.95", "1.5%", "A small edge: stake 1.5% of the account"],
          ["55%", "0.95", "7.6%", "A clear edge"],
          ["55%, at even money", "1.00", "10%", "The same win chance with a full payout"],
          ["90%", "0.10", "-10%", "A high win rate with no edge"],
        ],
      },
      {
        type: "p",
        text: "Take the third row: 0.95 times 0.55 is 0.5225, minus 0.45 is 0.0725, divided by 0.95 is 0.076. The first and last rows are the important ones. An even-chance contract paying less than double, and a 90% contract paying a tenth of the stake, both give a negative answer.",
      },
      { type: "h2", text: "What Kelly really tells a trader" },
      {
        type: "list",
        items: [
          "How much to stake depends on the size of the edge, not on recent results.",
          "Without an edge, the best stake is zero. No staking system rescues a negative-expectation bet.",
          "Staking more than Kelly reduces long-term growth, and staking double Kelly or more leads towards ruin even with an edge.",
        ],
      },
      { type: "h2", text: "Why nobody should use full Kelly" },
      {
        type: "p",
        text: "The formula assumes you know the true win probability. You never do: you have an estimate from a sample, and estimates are usually optimistic. Overestimating the edge means overbetting, and full Kelly is already a rough ride, with deep drawdowns. Practitioners use half Kelly or a quarter, giving up a little growth for much smaller swings.",
      },
      { type: "h2", text: "Using it" },
      {
        type: "steps",
        items: [
          { title: "Measure the win rate over hundreds of trades", text: "With a flat stake, on demo or small real size." },
          { title: "Take the payout from your results", text: "Average win divided by average loss." },
          { title: "Calculate the fraction", text: "If it is negative, stop. The strategy has no edge." },
          { title: "Use a quarter to a half of it", text: "And cap it at a level you can live with, such as 2%." },
        ],
      },
      { type: "h2", text: "On random markets" },
      {
        type: "p",
        text: "On a synthetic index, where each outcome has a known chance and the payout is set below the fair value, the Kelly fraction is negative for every contract. That is the arithmetic behind the advice to keep stakes small and treat such trading as a cost, not an income.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is the Kelly criterion in simple terms?",
        a: "A formula that says how much of your money to risk on a bet with an advantage: more when the edge is larger, nothing when there is none.",
      },
      {
        q: "What is half Kelly?",
        a: "Staking half the amount the formula gives. It keeps most of the growth and greatly reduces drawdowns and the cost of misjudging the edge.",
      },
      {
        q: "What does a negative Kelly result mean?",
        a: "That the bet loses on average. The formula's recommendation is not to place it.",
      },
    ],
    related: ["flat-stake-explained", "risk-to-reward-ratio"],
  },

  {
    slug: "gamblers-fallacy-in-trading",
    title: "The gambler's fallacy in trading: why nothing is ever due",
    description:
      "The gambler's fallacy is believing a streak makes the opposite result more likely. Why it is wrong on random markets and how it shows up in bots.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "The gambler's fallacy is the belief that after a run of one outcome, the opposite outcome is due. On independent random events it is false: after five even digits, the chance the next is even is still 50%. Streaks are normal in random data. Strategies built on something being due have no edge, and with rising stakes they are dangerous.",
    body: [
      { type: "h2", text: "Why it feels true" },
      {
        type: "p",
        text: "Over a long run, even and odd do come out nearly equal. The mind turns that into a rule for the short run: a surplus of evens must be repaid by odds. It is not repaid. It is diluted. After five evens, the next thousand ticks will be about half and half, and the early surplus simply becomes too small a share to notice.",
      },
      { type: "h2", text: "Streaks are ordinary" },
      {
        type: "table",
        head: ["Streak of the same 50% outcome", "Chance from any starting point", "Expected in 1,000 trades"],
        rows: [
          ["5 in a row", "1 in 32", "About 31 times"],
          ["7 in a row", "1 in 128", "About 8 times"],
          ["10 in a row", "1 in 1,024", "About once"],
        ],
      },
      {
        type: "p",
        text: "The last column is for one side only and counts every starting point, so a long streak is counted more than once. The point stands either way: a fast bot sees streaks of ten on most days. Seeing one is not a signal.",
      },
      { type: "h2", text: "Where it hides in trading" },
      {
        type: "list",
        items: [
          "Even/Odd bots that wait for a streak and bet the other side.",
          "Digit bots that bet a digit is overdue because it has not appeared.",
          "Martingale: the belief that a win must come before the ladder ends.",
          "After five losing trades, raising the stake because a win is due.",
          "The opposite error, the hot hand: believing a winning streak will continue.",
        ],
      },
      { type: "h2", text: "When past results do matter" },
      {
        type: "p",
        text: "The fallacy applies to independent events. Real markets are not perfectly independent: trends and volatility clustering exist. A synthetic index generated by a random number generator is the textbook case where the fallacy applies in full. Know which kind of market you are on before deciding that history carries information.",
      },
      { type: "h2", text: "How to protect yourself" },
      {
        type: "steps",
        items: [
          { title: "Ask what the mechanism is", text: "Why would the last five results change the next one? If there is no answer, there is no signal." },
          { title: "Keep the stake flat", text: "A wrong belief about streaks costs little at a flat stake and a great deal at a rising one." },
          { title: "Test the rule against random entry", text: "If waiting for a streak wins no more often than entering at random, the rule adds nothing." },
        ],
      },
      { type: "h2", text: "A note on FXNOD's own fade bots" },
      {
        type: "p",
        text: "Auto Hub's Hot Fade and Shadow Fade enter after a digit clusters. FXNOD's guide to those bots says plainly that a clustered digit is not due to stop, that the rule decides only when the bot enters, and that it is not a promise about the next tick. They use a flat stake for that reason.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is the gambler's fallacy?",
        a: "The mistaken belief that a streak of one random outcome makes the opposite outcome more likely next.",
      },
      {
        q: "After ten losses, is a win more likely?",
        a: "Not on independent random events. The chance is the same as on any other trade.",
      },
      {
        q: "What is the hot hand fallacy?",
        a: "The opposite mistake: believing that a run of wins makes the next win more likely.",
      },
    ],
    related: ["does-digit-analysis-work", "martingale-strategy-explained"],
  },

  {
    slug: "does-digit-analysis-work",
    title: "Does digit analysis work on Deriv synthetic indices?",
    description:
      "Digit statistics show which last digits appeared most. Whether that predicts the next tick, how to test it yourself, and what the tools are good for.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Digit analysis counts how often each last digit has appeared over recent ticks. It describes the past accurately. On an index generated by a random number generator, as Deriv describes its synthetic indices, each digit is equally likely on every tick regardless of history, so the counts do not predict the next digit. You can test this yourself.",
    body: [
      { type: "h2", text: "What the tools show" },
      {
        type: "list",
        items: [
          "The percentage of recent ticks that ended in each digit.",
          "The most and least frequent digit in the window.",
          "The share of even against odd, or of digits over and under a level.",
          "Current streaks.",
        ],
      },
      { type: "h2", text: "Why the counts are never level" },
      {
        type: "p",
        text: "Over 100 ticks, a perfectly random source gives each digit 10 appearances on average, with a normal spread of about 3 either way. Seeing one digit at 15% and another at 6% is what randomness looks like at that sample size. Over 1,000 ticks the percentages crowd closer to 10%, and over 30 ticks they are all over the place. An uneven table is not evidence of a pattern.",
      },
      {
        type: "table",
        head: ["Window", "Expected count per digit", "Typical range"],
        rows: [
          ["30 ticks", "3", "0 to 6"],
          ["100 ticks", "10", "4 to 16"],
          ["1,000 ticks", "100", "81 to 119"],
        ],
      },
      { type: "h2", text: "The two opposite theories" },
      {
        type: "p",
        text: "Some traders bet the hot digit will keep appearing. Others bet the cold digit is due. Both read the same table and reach opposite conclusions, which is a sign that the table does not contain the answer. On independent ticks, both win at the rate chance gives.",
      },
      { type: "h2", text: "Test it yourself" },
      {
        type: "steps",
        items: [
          { title: "Write the rule exactly", text: "For example: when a digit is above 14% over the last 100 ticks, buy Differs on it." },
          { title: "Run it on demo with a flat stake", text: "At least 500 trades." },
          { title: "Compare with chance", text: "Differs wins about 90% by chance, Matches about 10%, Even or Odd 50%." },
          { title: "Allow for luck", text: "Over 500 Differs trades, anything from about 87% to 93% is within normal variation." },
        ],
      },
      { type: "h2", text: "What digit statistics are good for" },
      {
        type: "list",
        items: [
          "Giving a bot a rule for when to enter, so it trades less often.",
          "Choosing among contracts with known odds.",
          "Seeing for yourself how lumpy random data is.",
        ],
      },
      {
        type: "p",
        text: "Trading less often is a real benefit when each trade costs a little on average. That is a benefit of pacing, not of prediction.",
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "Auto Hub's Matches / Differs bot can pick its digit from recent ticks, and the fade bots enter when a digit clusters. FXNOD's guide to them says a clustered digit is not due to stop and the rule is not a promise about the next tick. FXNOD cannot verify Deriv's random generator independently.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Can you predict the last digit on Deriv?",
        a: "Not if the index is random as Deriv describes. Each digit has the same chance on every tick.",
      },
      {
        q: "Why does one digit appear more than the others?",
        a: "Because small samples of random data are uneven. Over more ticks the percentages move towards 10% each.",
      },
      {
        q: "Are digit analysis tools a scam?",
        a: "The statistics are real. Claims that they predict the next digit, or guarantee a profit, are not supported by how the index is generated.",
      },
    ],
    related: ["gamblers-fallacy-in-trading", "matches-differs-explained"],
  },

  {
    slug: "stop-loss-and-take-profit",
    title: "Stop loss and take profit: what they are and how to set them",
    description:
      "A stop loss closes a trade or session at a set loss; a take profit at a set gain. How each works for a position and for a bot, and how to choose them.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "A stop loss is an instruction to stop at a chosen loss, and a take profit is an instruction to stop at a chosen gain. On a single position they close the trade at a price or amount. On a bot they end the whole session. Both are decided before trading starts, when you are calm, and should not be moved once it has.",
    body: [
      { type: "h2", text: "Two kinds" },
      {
        type: "table",
        head: ["", "On a position", "On a bot session"],
        rows: [
          ["Stop loss", "Closes one trade when its loss reaches a level", "Ends the run when total loss reaches an amount"],
          ["Take profit", "Closes one trade when its profit reaches a level", "Ends the run when total profit reaches an amount"],
          ["Applies to", "CFDs and multipliers", "Any contract a bot buys"],
        ],
      },
      {
        type: "p",
        text: "A fixed-payout option has neither on the trade itself: it settles at expiry and the stake is the most it can lose. For options, the limits that matter are the session's.",
      },
      { type: "h2", text: "Setting a stop loss" },
      {
        type: "steps",
        items: [
          { title: "Start from money", text: "The amount you can lose today without it mattering tomorrow." },
          { title: "For a position, put it where the idea is wrong", text: "Beyond the level that, if broken, means your reason for the trade no longer holds." },
          { title: "Size the trade to fit", text: "Position size equals the money at risk divided by the stop distance." },
          { title: "For a bot, keep the stake small against it", text: "A stake of 1% to 2% of the session stop loss." },
        ],
      },
      { type: "h2", text: "Setting a take profit" },
      {
        type: "p",
        text: "On a position, a target of at least the stop distance gives a risk-to-reward of 1:1 or better. On a bot session, a target ends the run while it is ahead. Smaller targets are reached more often and larger ones less often; neither changes the expected result of the trades, but a target does stop a winning session being given back.",
      },
      { type: "h2", text: "What a stop loss does not do" },
      {
        type: "list",
        items: [
          "It does not guarantee the exact amount. A position's stop can slip in a fast market.",
          "A session stop checked before each trade can be passed by the final trade's stake.",
          "It does not protect you from starting another session straight afterwards.",
          "A stop loss that runs in your browser stops working when the browser does.",
        ],
      },
      { type: "h2", text: "Mistakes" },
      {
        type: "list",
        items: [
          "Moving the stop further away when the price approaches it.",
          "Setting it so close that normal movement triggers it.",
          "Using none, and planning to watch the trade.",
          "With a rising stake, a session stop smaller than the ladder it is meant to contain.",
        ],
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "In dTrader, Multipliers let you set a stop loss and a take profit, and Accumulators a take profit. In dBot and Auto Hub a session stop loss is required and a profit target is optional. Both are checked on FXNOD's servers before every trade, so they keep working with the page closed. Because the check comes before each order, the last trade can take the loss past the stop by up to its stake.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Should I always use a stop loss?",
        a: "Yes. Without one, the only limit on a loss is your balance and your attention.",
      },
      {
        q: "Why did I lose more than my stop loss?",
        a: "On a position, the price may have gapped past the level. On a bot, the limit is checked before each trade, so the last trade can exceed it by its stake.",
      },
      {
        q: "What is a good take profit?",
        a: "One that is at least as large as the amount you risk, and that you decide before trading and do not change.",
      },
    ],
    related: ["trading-bot-risk-management", "multipliers-explained"],
  },

  {
    slug: "what-is-a-tick-in-trading",
    title: "What is a tick in trading?",
    description:
      "A tick is one price update. How ticks differ from candles and pips, how tick contracts settle, and why tick speed matters when you automate.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "A tick is a single update of a market's price. Every time the price changes, or is published again, that is one tick. Candles are built from ticks: a one-minute candle summarises every tick in that minute. On Deriv's volatility indices a tick arrives every two seconds or every second, and some contracts last only a set number of ticks.",
    body: [
      { type: "h2", text: "Tick, pip, point and candle" },
      {
        type: "table",
        head: ["Term", "What it is"],
        rows: [
          ["Tick", "One price update"],
          ["Pip", "A standard unit of price change in forex, usually the fourth decimal place"],
          ["Point", "A unit of price change on an index or other instrument"],
          ["Candle", "A summary of all ticks in a period: open, high, low and close"],
        ],
      },
      {
        type: "p",
        text: "A tick is an event. A pip or a point is a distance. One tick can move the price by many pips or by none.",
      },
      { type: "h2", text: "Ticks on real and synthetic markets" },
      {
        type: "list",
        items: [
          "On a real market, ticks arrive irregularly: many per second in busy periods, few when it is quiet.",
          "On Deriv's volatility indices, Deriv says ticks arrive at a fixed speed, every two seconds on the standard versions and every second on the faster ones.",
          "A fixed tick speed makes tick contracts predictable in length: five ticks is about ten seconds, or about five.",
        ],
      },
      { type: "h2", text: "How a tick contract settles" },
      {
        type: "p",
        text: "Deriv defines the entry spot as the first tick after its servers process the contract. A contract of five ticks then settles on the fifth tick after that entry. The result depends on those specific ticks, not on the price you saw when you pressed Buy, which is why the entry on the chart can differ slightly from what you expected.",
      },
      { type: "h2", text: "Why tick speed matters for a bot" },
      {
        type: "table",
        head: ["Contract", "On a 2-second index", "On a 1-second index"],
        rows: [
          ["1 tick", "About 2 seconds", "About 1 second"],
          ["5 ticks", "About 10 seconds", "About 5 seconds"],
          ["Trades per hour, one after another, at 1 tick", "Up to about 1,800", "Up to about 3,600"],
        ],
      },
      {
        type: "p",
        text: "These are upper bounds from the tick speed alone; a real bot places fewer because of processing time and its own entry rule. The point is the scale. Each trade carries a small cost on average, and a bot can pay that cost thousands of times in a session. A bot on a faster index reaches its stop loss, or its target, in half the time.",
      },
      { type: "h2", text: "Tick charts" },
      {
        type: "p",
        text: "A tick chart draws every price update as a point. It is the most detailed view and the noisiest. It is useful for seeing exactly how a short contract settled, and of little use for judging direction.",
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "dTrader's chart updates with every tick and marks a trade's entry. On a bot's run page you can open a trade to see the ticks it was settled on, from the entry spot to the exit.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "How long is a tick?",
        a: "A tick has no fixed length on real markets. On Deriv's volatility indices one arrives every two seconds, or every second on the faster versions.",
      },
      {
        q: "What is the difference between a tick and a pip?",
        a: "A tick is one price update. A pip is a unit of price movement. A single tick may move the price several pips.",
      },
      {
        q: "What does a 5-tick contract mean?",
        a: "A contract that settles on the fifth tick after its entry spot.",
      },
    ],
    related: ["best-trading-timeframe-for-beginners", "rise-fall-explained"],
  },
];
