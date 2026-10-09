/**
 * One guide per Deriv trade type: what wins, what it pays, what it can lose,
 * and the arithmetic of breaking even.
 *
 * How each contract settles is Deriv's definition, read on Deriv's own pages
 * on the date in learnDeriv.ts (`CHECKED`). The probabilities and break-even
 * figures are ours and follow from those definitions; they assume each
 * outcome of a random digit or tick is equally likely, which is how Deriv
 * describes its synthetic indices. Payouts are never quoted: Deriv sets them
 * per contract and they change.
 */
import { RISK_NOTE, type Guide } from "./guides";
import { SOURCE_NOTE } from "./learnDeriv";

const TAG = "Deriv trade types";
const DATE = "2026-10-09";

export const CONTRACT_GUIDES: Guide[] = [
  {
    slug: "rise-fall-explained",
    title: "Rise/Fall on Deriv: how it works and what it pays",
    description:
      "Rise/Fall asks whether the price ends above or below where it started. How entry and exit spots are set, the payout, and the win rate you need.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Rise/Fall is the simplest Deriv option. You predict whether the market price will finish above or below the entry price when the contract ends. If you are right you receive the payout quoted before you bought; if you are wrong you lose the stake. With two roughly equal outcomes, you need to win a little more than half your trades to break even.",
    body: [
      { type: "h2", text: "How a Rise/Fall contract settles" },
      {
        type: "table",
        head: ["Term", "Meaning"],
        rows: [
          ["Entry spot", "The first tick after Deriv's servers process the contract"],
          ["Exit spot", "The latest tick at or before the end time"],
          ["Rise", "Wins if the exit spot is above the entry spot"],
          ["Fall", "Wins if the exit spot is below the entry spot"],
          ["Duration", "A number of ticks, or a length of time"],
        ],
      },
      {
        type: "p",
        text: "What happens between entry and exit does not matter. The price can move against you for the whole contract and still finish on your side, or the reverse. If the exit spot equals the entry spot, the result depends on the contract's own rule, shown on the order form.",
      },
      { type: "h2", text: "The arithmetic" },
      {
        type: "p",
        text: "On a random index, Rise and Fall are close to equally likely. The payout is less than double the stake, and that difference is the cost of the contract. If a stake of 10 returns 19.50 on a win, the profit is 9.50 and the break-even win rate is 10 divided by 19.50, or 51.3%. Whatever the quoted payout, divide the stake by the total return to get the win rate you must beat.",
      },
      {
        type: "table",
        head: ["Total return on a stake of 10", "Profit if you win", "Win rate to break even"],
        rows: [
          ["19.80", "9.80", "50.5%"],
          ["19.50", "9.50", "51.3%"],
          ["19.00", "9.00", "52.6%"],
          ["18.00", "8.00", "55.6%"],
        ],
      },
      { type: "h2", text: "Choosing a duration" },
      {
        type: "list",
        items: [
          "Tick durations settle in seconds. They suit automation and give no time to think.",
          "Longer durations give the price more room to move and make each trade a slower decision.",
          "On a random index no duration is more predictable than another. The duration changes the pace, not the odds.",
        ],
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "Rise/Fall is available in dTrader, where the order panel shows the payout Deriv quotes before you buy. In dBot it is one of the trade types a bot can buy, and two of the templates use it: one follows the last tick and one applies Martingale.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is the difference between Rise/Fall and Higher/Lower?",
        a: "Rise/Fall compares the exit spot with the entry spot. Higher/Lower compares it with a target price you choose.",
      },
      {
        q: "Is Rise/Fall a 50/50 trade?",
        a: "The two outcomes are close to equally likely on a random index, but the payout is less than double the stake, so the trade is slightly against you on average.",
      },
      {
        q: "Can I close a Rise/Fall trade early?",
        a: "Where Deriv offers a sell price for the open contract, yes. Very short tick contracts simply run to the end.",
      },
    ],
    related: ["higher-lower-explained", "dtrader-manual-trading"],
  },

  {
    slug: "higher-lower-explained",
    title: "Higher/Lower on Deriv: barriers, payouts and risk",
    description:
      "Higher/Lower asks whether the price ends above or below a target you choose. How the barrier changes the odds and the payout together.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "In Higher/Lower you choose a target price, called the barrier, and predict whether the market will finish above it or below it when the contract ends. Moving the barrier changes the odds: an easy target pays little and a hard one pays a lot. Deriv says that if the exit spot equals the barrier, the contract does not win.",
    body: [
      { type: "h2", text: "How it settles" },
      {
        type: "list",
        items: [
          "Higher wins if the exit spot is strictly above the barrier.",
          "Lower wins if the exit spot is strictly below the barrier.",
          "Only the price at the end counts. Touching the barrier during the contract decides nothing.",
        ],
      },
      { type: "h2", text: "The barrier is the trade" },
      {
        type: "table",
        head: ["Barrier for a Higher contract", "Chance of winning", "Payout"],
        rows: [
          ["Well below the current price", "High", "Small"],
          ["At the current price", "About even", "Close to double the stake"],
          ["Well above the current price", "Low", "Large"],
        ],
      },
      {
        type: "p",
        text: "The payout and the probability move in opposite directions by design. A far barrier that pays five times the stake is priced as an event that happens less than one time in five. There is no barrier that is both likely and well paid.",
      },
      { type: "h2", text: "Break-even on any barrier" },
      {
        type: "p",
        text: "Divide the stake by the total return. A contract that returns 12 on a stake of 10 needs to win more than 83.3% of the time. One that returns 50 on a stake of 10 needs to win more than 20%. Compare that figure with how often you honestly expect the price to finish beyond the barrier.",
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "list",
        items: [
          "Choosing an easy barrier because it wins often, and ignoring that one loss cancels many wins.",
          "Choosing a far barrier for the large payout without counting how rarely it arrives.",
          "Confusing it with Touch: the price can pass the barrier and come back, and a Higher/Lower contract is judged only at the end.",
        ],
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "Higher/Lower is in dTrader, where you set the target and read the quote before buying, and it is one of the trade types a dBot bot can buy.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is a barrier in Higher/Lower?",
        a: "The target price you choose. The contract is judged on whether the exit spot is above or below it.",
      },
      {
        q: "What happens if the price ends exactly on the barrier?",
        a: "Deriv says that if the exit spot is equal to the barrier, you do not win the payout.",
      },
      {
        q: "Which barrier is best?",
        a: "None is better on average. The payout is set to match the chance of winning, less the contract's cost.",
      },
    ],
    related: ["rise-fall-explained", "touch-no-touch-explained"],
  },

  {
    slug: "touch-no-touch-explained",
    title: "Touch/No Touch on Deriv: how barrier trades work",
    description:
      "Touch wins if the price reaches a barrier at any moment before expiry; No Touch wins if it never does. How distance, time and volatility set the odds.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "In Touch/No Touch you set a barrier and predict whether the market will reach it at any time before the contract ends. Touch wins the moment the barrier is reached. No Touch wins only if the price stays away for the whole period. The distance to the barrier, the time allowed and the market's volatility decide the odds.",
    body: [
      { type: "h2", text: "How it differs from Higher/Lower" },
      {
        type: "table",
        head: ["", "Touch/No Touch", "Higher/Lower"],
        rows: [
          ["Judged", "At every moment of the contract", "Only at the end"],
          ["Can settle early", "Yes, when the barrier is reached", "No"],
          ["Price touches then returns", "Touch has won; No Touch has lost", "Makes no difference"],
        ],
      },
      { type: "h2", text: "What moves the odds" },
      {
        type: "table",
        head: ["Change", "Touch", "No Touch"],
        rows: [
          ["Barrier further away", "Less likely, pays more", "More likely, pays less"],
          ["Longer duration", "More likely", "Less likely"],
          ["More volatile market", "More likely", "Less likely"],
        ],
      },
      { type: "h2", text: "Why a touch is more likely than it looks" },
      {
        type: "p",
        text: "A price only has to reach the barrier once, at any moment. For a random walk, the chance of touching a level before a deadline is roughly twice the chance of finishing beyond it. People who judge a Touch barrier by where they expect the price to end underestimate it, and people who buy No Touch on a close barrier are surprised how often it loses.",
      },
      { type: "h2", text: "The shape of the risk" },
      {
        type: "list",
        items: [
          "No Touch with a distant barrier wins often and pays little. A sudden move loses the whole stake and cancels many wins.",
          "Touch with a distant barrier loses often and pays well. Expect long losing runs.",
          "Moving a bot from one volatility index to another changes the odds of every barrier trade, even with identical settings.",
        ],
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "Touch/No Touch is in dTrader and is a trade type a dBot bot can buy. Read the quoted payout for the exact barrier and duration, and work out the win rate it requires by dividing the stake by the total return.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Does a Touch contract end as soon as the barrier is hit?",
        a: "Yes. Deriv's examples show a Touch trade winning and settling when the barrier is reached, and a No Touch trade losing at that moment.",
      },
      {
        q: "Is No Touch safer than Touch?",
        a: "It wins more often when the barrier is far away, and pays less. Neither is safer on average.",
      },
      {
        q: "What is the best market for Touch/No Touch?",
        a: "There is no best one. A more volatile index makes touches more likely and the payouts adjust to match.",
      },
    ],
    related: ["higher-lower-explained", "how-volatility-affects-trading"],
  },

  {
    slug: "matches-differs-explained",
    title: "Matches/Differs on Deriv: last-digit odds explained",
    description:
      "Matches wins on one digit in ten; Differs wins on nine in ten. The payout each needs to break even, and why a 90% win rate can still lose.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Matches/Differs is a bet on the last digit of the final tick's price. Matches wins if that digit is the one you picked, a one-in-ten chance that pays several times the stake. Differs wins if it is any other digit, a nine-in-ten chance that pays a small fraction of the stake. One Differs loss cancels about ten wins.",
    body: [
      { type: "h2", text: "The odds" },
      {
        type: "table",
        head: ["Contract", "Winning digits", "Chance", "Profit needed per 1 staked to break even"],
        rows: [
          ["Matches", "1 of 10", "10%", "9.00"],
          ["Differs", "9 of 10", "90%", "0.111"],
        ],
      },
      {
        type: "p",
        text: "These are the break-even figures for digits that are equally likely. The payout Deriv quotes is below them, and the gap is the cost of the contract. Compare the quote on the order form with this table to see that cost.",
      },
      { type: "h2", text: "Why Differs feels safe and is not" },
      {
        type: "p",
        text: "Winning nine trades in ten feels like skill. Suppose each win pays 0.10 on a stake of 1. A hundred trades at the expected rate give ninety wins of 0.10, which is 9, and ten losses of 1, which is 10: a net loss of 1. The win rate needed to break even at that payout is 90.9%, just above what chance provides. Add a stake that grows after a loss and a single unlucky pair of digits does serious damage.",
      },
      { type: "h2", text: "Why Matches feels hopeless and is the same bet" },
      {
        type: "p",
        text: "Matches loses nine times in ten. Losing runs of twenty or thirty are ordinary: the chance of thirty Matches losses in a row is about 4%. The occasional win is large. On average it is the mirror image of Differs, with the same kind of cost, and a very different experience.",
      },
      { type: "h2", text: "Does choosing the digit help?" },
      {
        type: "p",
        text: "Deriv describes its synthetic indices as generated by a random number generator. If each last digit is equally likely and independent of the ones before, no digit is better than another, and a digit that has appeared often or rarely is not more or less likely next time. Digit statistics describe the past. They are a way to choose, not an edge.",
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "Matches/Differs is in dTrader and dBot. Auto Hub has a ready-made Matches / Differs bot, which trades one-tick contracts on one market with the same stake every time, and a fade bot that buys Differs after a digit clusters. Each requires a stop loss.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is the win rate of Differs?",
        a: "About 90% by chance, because nine of the ten digits win. It needs to be higher than that to profit at the payouts on offer.",
      },
      {
        q: "Which digit is best for Matches or Differs?",
        a: "None. On a random index every last digit is equally likely on each tick.",
      },
      {
        q: "Is Differs with Martingale a good strategy?",
        a: "It produces long runs of small wins and then a loss that takes many of them back at a multiplied stake. It does not change the average result.",
      },
    ],
    related: ["even-odd-explained", "auto-hub-ready-made-bots"],
  },

  {
    slug: "even-odd-explained",
    title: "Even/Odd on Deriv: how it works and the real odds",
    description:
      "Even/Odd is a bet on whether the last digit of the final tick is even or odd. A 50/50 outcome with a payout under double: what that means over time.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Even/Odd is a bet on the last digit of the final tick. Even wins on 0, 2, 4, 6 or 8 and Odd wins on 1, 3, 5, 7 or 9. Five digits win either way, so the chance is 50%. The payout is a little under double the stake, which means the trade loses slightly on average however you choose.",
    body: [
      { type: "h2", text: "How it settles" },
      {
        type: "p",
        text: "The contract lasts a set number of ticks. Only the last digit of the final tick's price counts. Direction, trend and the size of the move are irrelevant.",
      },
      { type: "h2", text: "The numbers" },
      {
        type: "table",
        head: ["Measure", "Value"],
        rows: [
          ["Chance of winning", "50%"],
          ["Break-even total return on a stake of 10", "20.00"],
          ["Win rate needed if the return is 19.50", "51.3%"],
          ["Chance of 5 losses in a row", "About 3%, or 1 in 32"],
          ["Chance of 10 losses in a row", "About 0.1%, or 1 in 1,024"],
        ],
      },
      {
        type: "p",
        text: "One in 1,024 sounds remote. A bot placing a one-tick trade every couple of seconds makes a thousand trades in well under an hour, so a ten-loss streak is something to expect, not something to hope against.",
      },
      { type: "h2", text: "The streak strategies" },
      {
        type: "p",
        text: "The most common Even/Odd method waits for several even digits in a row and then bets odd. On an independent random process the next digit is even or odd with the same 50% chance after any streak. The rule is no worse than betting at random and no better. It becomes dangerous only when paired with a stake that doubles, because the streak that breaks the ladder arrives on schedule.",
      },
      { type: "h2", text: "Why it is a good first contract anyway" },
      {
        type: "list",
        items: [
          "Two outcomes and one rule, so it is easy to check what a bot did.",
          "The odds are known exactly, so the cost of the contract is visible in the payout.",
          "It is a clean way to learn stake sizing, stop losses and how streaks really behave.",
        ],
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "Even/Odd is in dTrader and dBot. The dBot template suggested as a first bot trades Even with the same stake every time and stops at your profit or loss cap. Another template waits for a streak of three and bets the other side.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is Even/Odd really 50/50?",
        a: "The chance of winning is 50% on a random index. The payout is under double the stake, so the expected result is slightly negative.",
      },
      {
        q: "Does waiting for a streak improve the odds?",
        a: "No. Each tick's last digit is independent of the ones before it.",
      },
      {
        q: "Is zero even?",
        a: "Yes. Deriv lists 0 with 2, 4, 6 and 8 as the digits that win an Even contract.",
      },
    ],
    related: ["matches-differs-explained", "over-under-explained"],
  },

  {
    slug: "over-under-explained",
    title: "Over/Under on Deriv: the odds for every digit",
    description:
      "Over/Under is a bet that the last digit is above or below a digit you pick. A table of the win chance and break-even payout for every choice.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "In Over/Under you pick a digit and predict whether the last digit of the final tick will be greater than it or less than it. The digit you choose sets the odds exactly: Over 3 wins on 4 to 9, six digits in ten. Landing on your chosen digit loses. Easier choices pay less and harder ones pay more.",
    body: [
      { type: "h2", text: "The odds for every choice" },
      {
        type: "table",
        head: ["Contract", "Winning digits", "Chance", "Profit per 1 staked to break even"],
        rows: [
          ["Over 0 / Under 9", "9", "90%", "0.11"],
          ["Over 1 / Under 8", "8", "80%", "0.25"],
          ["Over 2 / Under 7", "7", "70%", "0.43"],
          ["Over 3 / Under 6", "6", "60%", "0.67"],
          ["Over 4 / Under 5", "5", "50%", "1.00"],
          ["Over 5 / Under 4", "4", "40%", "1.50"],
          ["Over 6 / Under 3", "3", "30%", "2.33"],
          ["Over 7 / Under 2", "2", "20%", "4.00"],
          ["Over 8 / Under 1", "1", "10%", "9.00"],
        ],
      },
      {
        type: "p",
        text: "The last column is the profit a fair contract would pay. The payout Deriv quotes is lower, and the difference is what the contract costs. The same cost exists on every row, so no row is a better deal than another.",
      },
      { type: "h2", text: "The detail people miss" },
      {
        type: "p",
        text: "The chosen digit itself loses on both sides. Over 5 loses on a 5, and Under 5 loses on a 5. That is why Over 4 and Under 5 are the two even-chance choices, and why Over 5 is a 40% trade, not a 50% one.",
      },
      { type: "h2", text: "Choosing the shape of your results" },
      {
        type: "list",
        items: [
          "High-chance rows, such as Over 1, win often and pay little. One loss cancels four wins or more.",
          "Low-chance rows, such as Over 7, lose most of the time and pay well.",
          "Middle rows behave like Even/Odd.",
        ],
      },
      { type: "h2", text: "Switching sides after a loss" },
      {
        type: "p",
        text: "A popular rule starts on one side and takes the other after a loss. Because each digit is independent, switching neither helps nor hurts the odds of the next trade. What matters is the stake you place on it.",
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "Over/Under is in dTrader and dBot. One dBot template starts on Under 7, a 70% trade, and takes the other side after a loss.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What does Over 3 mean?",
        a: "The contract wins if the last digit is 4, 5, 6, 7, 8 or 9. Deriv's own example says it loses on 0, 1, 2 or 3.",
      },
      {
        q: "What is the safest Over/Under choice?",
        a: "Over 0 and Under 9 win most often, about nine times in ten, and pay the least. Winning often is not the same as being safe.",
      },
      {
        q: "Is Over 4 the same as Under 5?",
        a: "In odds, yes: each wins on five digits. They win on different digits.",
      },
    ],
    related: ["even-odd-explained", "is-a-high-win-rate-enough"],
  },

  {
    slug: "accumulators-explained",
    title: "Accumulators on Deriv: growth rate, range and risk",
    description:
      "An accumulator grows your stake every tick the price stays in a range and loses it if the price leaves. Growth rates, the range, and when to take profit.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "An accumulator option grows your stake by a fixed percentage on every tick that the price stays within a narrow range around the previous tick. If the price moves outside the range, the contract ends and the stake is lost. You choose a growth rate from 1% to 5%, and you can sell at any time to take the profit so far.",
    body: [
      { type: "h2", text: "How it works" },
      {
        type: "steps",
        items: [
          { title: "Choose a growth rate", text: "Deriv offers 1% to 5%. It is fixed when you open the contract." },
          { title: "The range is set around each tick", text: "A higher growth rate comes with a narrower range, so the contract is more likely to be knocked out." },
          { title: "Each tick inside the range grows the payout", text: "The growth compounds: at 5% the value is multiplied by 1.05 every tick." },
          { title: "You sell, or it ends", text: "Sell to take the profit, set a take profit to do it automatically, or lose the stake if the price leaves the range." },
        ],
      },
      { type: "h2", text: "What compounding looks like" },
      {
        type: "table",
        head: ["Ticks survived", "Value of a stake of 10 at 1%", "Value of a stake of 10 at 5%"],
        rows: [
          ["5", "10.51", "12.76"],
          ["10", "11.05", "16.29"],
          ["20", "12.20", "26.53"],
          ["50", "16.45", "114.67"],
        ],
      },
      {
        type: "p",
        text: "The right-hand column is why accumulators are attractive, and why they are dangerous. Reaching fifty ticks at 5% means the price stayed inside a very narrow range fifty times in a row. Deriv also caps the number of ticks and the payout of a contract.",
      },
      { type: "h2", text: "The one inequality that matters" },
      {
        type: "p",
        text: "Call the chance of surviving one tick s and the growth rate g. Holding for one more tick is worth it on average only if s multiplied by 1 plus g is greater than 1. At 5% growth, s must be above 95.2%. At 1%, above 99.0%. The range for each growth rate is set by Deriv, so the survival chance is theirs to decide, and the pricing includes a margin in Deriv's favour. No number of ticks turns that into an advantage.",
      },
      { type: "h2", text: "Practical rules" },
      {
        type: "list",
        items: [
          "Decide the take profit before you open, and let it close the trade.",
          "Treat every stake as an amount you expect to lose sometimes in full.",
          "A higher growth rate is a faster trade in both directions, not a better one.",
          "Greed is the specific risk here: the profit on screen grows every tick until it is zero.",
        ],
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "Accumulators are in dTrader, where you can set a take profit, and dBot has a template that takes a small profit early on each contract.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What growth rates can I choose for an accumulator?",
        a: "Deriv offers growth rates from 1% to 5%, fixed when the contract opens.",
      },
      {
        q: "What is the most I can lose on an accumulator?",
        a: "The stake. Deriv says that if the price moves outside the range, the trade closes and the loss is limited to the initial stake.",
      },
      {
        q: "Which growth rate is best?",
        a: "None on average. Higher rates grow faster and are knocked out more often.",
      },
      {
        q: "Can I close an accumulator early?",
        a: "Yes. Selling credits the stake and the profit so far, and a take profit level does it automatically.",
      },
    ],
    related: ["multipliers-explained", "how-volatility-affects-trading"],
  },

  {
    slug: "multipliers-explained",
    title: "Multipliers on Deriv: how they work, stop out and costs",
    description:
      "A multiplier magnifies a price move on your stake, with the loss capped at the stake. The formula, where stop out falls, and the commission.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "A Deriv multiplier magnifies the percentage move of a market on your stake. Profit or loss equals the percentage price change times the multiplier times the stake, less a commission. Your loss is capped at the stake: the position is closed automatically at the stop-out price. The higher the multiplier, the smaller the move that wipes out the stake.",
    body: [
      { type: "h2", text: "The formula" },
      {
        type: "p",
        text: "Deriv gives it as: profit or loss equals the percentage price difference, multiplied by the multiplier, multiplied by the stake, minus commission. With a stake of 100 and a multiplier of 500, a 2% move in your favour is 0.02 times 500 times 100, or 1,000, before commission. The same move against you would be a loss of 1,000, which is why the position is stopped out long before that.",
      },
      { type: "h2", text: "Where stop out falls" },
      {
        type: "table",
        head: ["Multiplier", "Move against you that loses the whole stake (before commission)"],
        rows: [
          ["x10", "10%"],
          ["x50", "2%"],
          ["x100", "1%"],
          ["x500", "0.2%"],
        ],
      },
      {
        type: "p",
        text: "The move that ends the trade is one divided by the multiplier. On a volatile index, a 0.2% move can happen within seconds. A high multiplier does not increase what you can lose; it shortens the distance to losing it.",
      },
      { type: "h2", text: "The risk controls Deriv describes" },
      {
        type: "table",
        head: ["Control", "What it does"],
        rows: [
          ["Stop out", "Closes the position when the loss reaches the stake. Always on"],
          ["Stop loss", "Closes it at a smaller loss you choose"],
          ["Take profit", "Closes it when the profit reaches an amount you choose"],
          ["Deal cancellation", "For a fee, lets you cancel within a chosen window and get the stake back. Deriv says it cannot be combined with stop loss or take profit, and is offered only on some markets"],
        ],
      },
      { type: "h2", text: "Costs" },
      {
        type: "p",
        text: "Deriv charges a commission when a multiplier trade is opened, which it says varies by asset class and market volatility. The trade therefore begins slightly negative. Deriv also notes that slippage can make the closing price differ from the level that triggered it.",
      },
      { type: "h2", text: "How it differs from an option" },
      {
        type: "list",
        items: [
          "There is no expiry: the trade stays open until you close it or it is stopped out.",
          "The profit is not fixed: it grows with the move.",
          "You can lose part of the stake, not only all or nothing.",
        ],
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "Multipliers are in dTrader, where you can set a take profit and a stop loss on the position, and they are a trade type a dBot bot can buy.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Can I lose more than my stake with multipliers?",
        a: "Deriv says the stop-out feature limits the risk to the initial stake on every trade.",
      },
      {
        q: "What multiplier should a beginner use?",
        a: "The lowest available. It leaves the most room before stop out. Practise on a demo account first.",
      },
      {
        q: "Are multipliers the same as leverage?",
        a: "They magnify price moves in a similar way. The difference is the built-in stop out that caps the loss at the stake.",
      },
      {
        q: "Is there a fee for multipliers?",
        a: "Yes. Deriv says a commission is charged when the trade is opened, and deal cancellation has its own fee.",
      },
    ],
    related: ["accumulators-explained", "stop-loss-and-take-profit"],
  },

  {
    slug: "turbos-explained",
    title: "Turbo options on Deriv: barriers, payout per point and knock-out",
    description:
      "A turbo pays for every point the price finishes beyond a barrier and is knocked out if the price touches it. How the payout is calculated.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "A turbo option pays according to how far the market finishes from a barrier, as long as the price never touches that barrier during the contract. The payout is the payout per point multiplied by the distance between the final price and the barrier. If the barrier is touched, the contract ends and the stake is lost.",
    body: [
      { type: "h2", text: "Up and Down" },
      {
        type: "table",
        head: ["Type", "Barrier is", "Knocked out if", "Pays on"],
        rows: [
          ["Up", "Below the price", "The price falls to the barrier", "How far the final price is above the barrier"],
          ["Down", "Above the price", "The price rises to the barrier", "How far the final price is below the barrier"],
        ],
      },
      { type: "h2", text: "A worked example" },
      {
        type: "p",
        text: "Take an Up turbo with the barrier at 100.00, a payout per point of 20 and a stake of 10. If the price never falls to 100.00 and finishes at 100.50, the distance is 0.50 and the payout is 20 times 0.50, or 10. That returns the stake and no more. A finish at 101.00 pays 20, a profit of 10. A finish at 100.20 pays 4, a loss of 6. If the price touches 100.00 at any time, the 10 is gone.",
      },
      {
        type: "p",
        text: "Deriv puts it this way: you earn a profit only if the payout is higher than your initial stake. Surviving is not enough. The price has to finish far enough from the barrier.",
      },
      { type: "h2", text: "The trade-off in choosing a barrier" },
      {
        type: "list",
        items: [
          "A barrier close to the price gives a higher payout per point and is knocked out easily.",
          "A barrier far from the price is harder to touch and pays less per point.",
          "The stake buys a fixed exposure either way. The barrier decides how fragile it is.",
        ],
      },
      { type: "h2", text: "Selling early" },
      {
        type: "p",
        text: "Deriv says a turbo can be sold before expiry, up to 15 seconds before the end, except on tick-based durations. Selling early locks in whatever the contract is worth at that moment.",
      },
      { type: "h2", text: "Who it suits" },
      {
        type: "p",
        text: "Turbos reward a strong move in one direction and punish any sharp move the other way. They are a poor fit for someone still learning how a contract settles. Learn Rise/Fall first, and try turbos on a demo account until the payout formula is second nature.",
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "Turbos are in dTrader and are a trade type a dBot bot can buy. The order panel shows the quote for the settings you chose before you buy.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is payout per point?",
        a: "Deriv's glossary describes it as your profit or loss for each point the underlying market moves. Multiply it by the distance between the final price and the barrier to get the payout.",
      },
      {
        q: "What happens when a turbo's barrier is touched?",
        a: "The contract is terminated early and, according to Deriv's terms, the stake is lost without any payment.",
      },
      {
        q: "Can a turbo finish in profit and still lose money?",
        a: "It can pay something and still return less than the stake. Profit needs the payout to exceed the stake.",
      },
    ],
    related: ["vanillas-explained", "touch-no-touch-explained"],
  },

  {
    slug: "vanillas-explained",
    title: "Vanilla options on Deriv: calls, puts and strike prices",
    description:
      "A vanilla Call pays if the price finishes above the strike, a Put if it finishes below. How payout per point works and what the strike changes.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "A vanilla option on Deriv is a Call or a Put against a strike price. A Call earns a payout if the final price is above the strike at expiry, and a Put if it is below. The payout is the payout per point multiplied by the distance between the final price and the strike. The most you can lose is the stake.",
    body: [
      { type: "h2", text: "Call and Put" },
      {
        type: "table",
        head: ["Type", "Pays if", "Payout"],
        rows: [
          ["Call", "The final price is above the strike", "Payout per point times the amount above the strike"],
          ["Put", "The final price is below the strike", "Payout per point times the amount below the strike"],
        ],
      },
      { type: "h2", text: "A worked example" },
      {
        type: "p",
        text: "Buy a Call with a strike of 100.00, a payout per point of 20 and a stake of 10. At expiry: a final price of 99.80 pays nothing and the 10 is lost. A final price of 100.30 pays 6, a loss of 4. A final price of 100.50 pays 10 and breaks even. A final price of 101.50 pays 30, a profit of 20. As with turbos, Deriv notes that you profit only if the payout is higher than the stake.",
      },
      { type: "h2", text: "What the strike changes" },
      {
        type: "table",
        head: ["Strike for a Call", "Payout per point", "Behaviour"],
        rows: [
          ["Below the current price", "Lower", "More likely to pay something; needs less of a move"],
          ["At the current price", "Middle", "Balanced"],
          ["Above the current price", "Higher", "Pays nothing unless the price rises past the strike"],
        ],
      },
      {
        type: "p",
        text: "Deriv's glossary says the payout per point depends on the relation of the strike to the spot price. A strike that is harder to reach buys more exposure per unit of stake.",
      },
      { type: "h2", text: "Vanillas and turbos compared" },
      {
        type: "table",
        head: ["", "Vanilla", "Turbo"],
        rows: [
          ["Reference level", "Strike", "Barrier"],
          ["Knocked out early", "No", "Yes, if the barrier is touched"],
          ["Price dips then recovers", "Does not matter; only expiry counts", "May already have ended the contract"],
        ],
      },
      { type: "h2", text: "What works against you" },
      {
        type: "list",
        items: [
          "Time: an option that has not moved far enough by expiry returns less than it cost.",
          "Pricing: Deriv's terms say its calculations include a bias in its favour.",
          "Being right about direction is not enough. The move has to be large enough, soon enough.",
        ],
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "Vanillas are in dTrader and are a trade type a dBot bot can buy. Check the quote for your strike and duration before buying.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is a strike price?",
        a: "The price a vanilla option is measured against. A Call pays for the distance the final price is above it, a Put for the distance below.",
      },
      {
        q: "What is the maximum loss on a vanilla option?",
        a: "The stake you paid for the contract.",
      },
      {
        q: "Are vanilla options good for beginners?",
        a: "They are harder to reason about than Rise/Fall, because being right on direction can still lose money. Practise on demo first.",
      },
    ],
    related: ["turbos-explained", "rise-fall-explained"],
  },
];
