/**
 * Core trading concepts and the markets people ask about: styles, leverage,
 * margin, pips, stops, hedging, long and short, CFDs, the two kinds of
 * analysis, rates, the US jobs report, gold, and crypto against forex.
 * Same shape and rules as the tool guides in `guides.ts`.
 *
 * Schedules and hours (release times, market sessions) are given as general
 * patterns, because the bodies that set them change them.
 */
import { RISK_NOTE, type Guide } from "./guides";

const TAG = "Trading concepts";
const DATE = "2026-10-09";

export const CONCEPT_GUIDES: Guide[] = [
  {
    slug: "scalping-vs-day-trading",
    title: "Scalping vs day trading: what is the difference?",
    description:
      "Scalping takes many trades lasting seconds or minutes; day trading takes fewer lasting minutes to hours. Costs, demands and who each suits.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Scalping means taking many trades that last seconds to a few minutes, each aiming for a very small move. Day trading means fewer trades that last minutes to hours, all closed before the day ends. Scalping is more demanding and far more sensitive to costs. Neither is more profitable by nature: both depend on an edge after costs.",
    body: [
      { type: "h2", text: "Side by side" },
      {
        type: "table",
        head: ["", "Scalping", "Day trading", "Swing trading"],
        rows: [
          ["Trade lasts", "Seconds to minutes", "Minutes to hours", "Days to weeks"],
          ["Trades per day", "Tens to hundreds", "A few", "A few per week"],
          ["Target per trade", "Very small", "Moderate", "Large"],
          ["Charts", "Tick to 5-minute", "5-minute to 1-hour", "4-hour to daily"],
          ["Cost as a share of profit", "Very high", "Moderate", "Low"],
          ["Screen time", "Constant", "Hours a day", "Minutes a day"],
        ],
      },
      { type: "h2", text: "Why costs decide scalping" },
      {
        type: "p",
        text: "A 1-pip spread is 20% of a 5-pip scalp and 2% of a 50-pip day trade. A scalper making fifty trades a day pays fifty spreads. A method that looks profitable before costs often is not after them, and the shorter the trade, the truer that is.",
      },
      { type: "h2", text: "What each demands" },
      {
        type: "list",
        items: [
          "Scalping: fast execution, the tightest spreads, intense focus, and a method simple enough to apply in seconds.",
          "Day trading: patience to wait for a setup, and the discipline to stop for the day.",
          "Both: a fixed risk per trade and a daily loss limit.",
        ],
      },
      { type: "h2", text: "Which is more profitable?" },
      {
        type: "p",
        text: "Neither by default. More trades multiply whatever the average result per trade is. If the edge per trade is positive, scalping compounds it faster. If it is slightly negative after costs, scalping loses faster than anything else.",
      },
      { type: "h2", text: "For beginners" },
      {
        type: "p",
        text: "Start slower. Longer trades leave time to think, cost less in proportion and teach more per trade. Scalping is the style most often attempted first and most often abandoned.",
      },
      { type: "h2", text: "Tick contracts and bots" },
      {
        type: "p",
        text: "Contracts lasting a few ticks are the extreme form of scalping, and are usually automated because no person can place them steadily. The same rule applies: each contract carries a cost in its payout, and a bot pays that cost hundreds of times an hour.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is scalping harder than day trading?",
        a: "Yes for most people. It needs faster decisions, tighter costs and more concentration.",
      },
      {
        q: "Can beginners scalp?",
        a: "They can, and usually lose to costs and haste. Learning on a slower timeframe first is easier.",
      },
      {
        q: "Is scalping allowed by brokers?",
        a: "Most allow it. Some restrict very short holding times or certain automated styles. Check your broker's terms.",
      },
    ],
    related: ["best-trading-timeframe-for-beginners", "what-is-spread-in-trading"],
  },

  {
    slug: "what-is-leverage-in-trading",
    title: "What is leverage in trading?",
    description:
      "Leverage lets a small deposit control a large position. How it magnifies gains and losses equally, worked examples, and how to use less than offered.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Leverage lets you control a position much larger than your deposit. With 1:100 leverage, 100 of your money controls 10,000 of a market. Profits and losses are calculated on the full position, so both are magnified equally. Leverage does not change the odds of a trade. It changes how much a small move costs you.",
    body: [
      { type: "h2", text: "A worked example" },
      {
        type: "table",
        head: ["Leverage", "Deposit used", "Position controlled", "Result of a 1% move against you"],
        rows: [
          ["1:1", "1,000", "1,000", "Lose 10 (1% of the deposit)"],
          ["1:10", "1,000", "10,000", "Lose 100 (10%)"],
          ["1:100", "1,000", "100,000", "Lose 1,000 (100%)"],
          ["1:500", "1,000", "500,000", "Lost at a move of 0.2%"],
        ],
      },
      {
        type: "p",
        text: "The move that wipes out the deposit is one divided by the leverage used. At 1:100 it is 1%. Markets move that far routinely.",
      },
      { type: "h2", text: "Available leverage and used leverage" },
      {
        type: "p",
        text: "The leverage a broker offers is a ceiling, not an instruction. What matters is the leverage you actually use: the size of your position divided by your account balance. A trader with 1:1000 available who opens a position twice the size of the account is using 2:1. Decide position size from your risk rule and ignore the maximum.",
      },
      { type: "h2", text: "Why brokers offer so much" },
      {
        type: "list",
        items: [
          "It lets small accounts trade, which brings in clients.",
          "Larger positions mean more spread and commission.",
          "Strongly regulated markets cap retail leverage because of the losses it causes.",
        ],
      },
      { type: "h2", text: "Using it safely" },
      {
        type: "steps",
        items: [
          { title: "Fix the money at risk per trade", text: "For example 1% of the account." },
          { title: "Place the stop where the trade is wrong", text: "From the chart." },
          { title: "Calculate the position from those two", text: "Risk divided by stop distance." },
          { title: "Check the leverage that implies", text: "If it is high, the stop is too close or the risk too large." },
        ],
      },
      { type: "h2", text: "Leverage on options and multipliers" },
      {
        type: "p",
        text: "A fixed-payout option has no leverage in this sense: the stake is the whole risk. A multiplier magnifies moves like leverage and caps the loss at the stake. Deriv says leverage on CFDs can be very high on selected instruments, and warns that CFDs carry a high risk of losing money rapidly because of it.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is high leverage good or bad?",
        a: "Available leverage is neutral. Used leverage is what causes losses, and beginners use far too much.",
      },
      {
        q: "What leverage should a beginner use?",
        a: "As little as possible. Size positions from a 1% risk rule and the leverage will take care of itself.",
      },
      {
        q: "Can I lose more than my deposit with leverage?",
        a: "It depends on the broker and product. Some offer negative balance protection. Check your account's terms.",
      },
    ],
    related: ["what-is-a-margin-call", "how-to-calculate-position-size"],
  },

  {
    slug: "what-is-a-margin-call",
    title: "What is a margin call?",
    description:
      "A margin call is a broker's warning that your account no longer covers your open positions. Margin level, stop out, and how to avoid both.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "A margin call is a warning from your broker that losses on open leveraged positions have reduced your account to the point where it barely covers the margin those positions need. If the losses continue, the broker closes positions automatically at the stop-out level. A margin call is not a request you can ignore: it is the last stage before forced closure.",
    body: [
      { type: "h2", text: "The terms" },
      {
        type: "table",
        head: ["Term", "Meaning"],
        rows: [
          ["Balance", "Your money, not counting open positions"],
          ["Equity", "Balance plus or minus the profit or loss on open positions"],
          ["Used margin", "The deposit set aside to hold open positions"],
          ["Free margin", "Equity minus used margin: what is left for new trades and losses"],
          ["Margin level", "Equity divided by used margin, as a percentage"],
          ["Margin call level", "The margin level at which the broker warns you"],
          ["Stop-out level", "The margin level at which the broker starts closing positions"],
        ],
      },
      { type: "h2", text: "A worked example" },
      {
        type: "p",
        text: "You deposit 1,000 and open a position needing 200 of margin. Equity is 1,000, so the margin level is 500%. The trade goes against you by 800: equity is now 200 and the margin level is 100%. If your broker's margin call level is 100%, you are warned. If the stop-out level is 50%, the position is closed when equity falls to 100. The exact percentages are set by each broker.",
      },
      { type: "h2", text: "What a stop out does" },
      {
        type: "list",
        items: [
          "The broker closes positions, usually the largest loser first, until the margin level recovers.",
          "It happens at market prices, which in a fast market can be worse than the level.",
          "It is automatic. Nobody phones you.",
          "Closing at the worst moment is the usual result.",
        ],
      },
      { type: "h2", text: "How to avoid it" },
      {
        type: "list",
        items: [
          "Use a stop loss on every position, far before the margin level matters.",
          "Risk a small fixed fraction of the account per trade.",
          "Keep the margin level in the thousands of per cent, not the hundreds.",
          "Do not add to losing positions.",
          "Do not deposit more to save a trade. That is a second loss, not a rescue.",
        ],
      },
      { type: "h2", text: "If you get one" },
      {
        type: "p",
        text: "You have two honest choices: close some or all of the position, or accept that it may be closed for you. Adding funds only buys time, and only helps if the trade was right and merely early. Decide which it is before you transfer anything.",
      },
      { type: "h2", text: "Products without margin calls" },
      {
        type: "p",
        text: "A fixed-payout option cannot get a margin call: you paid the stake and that is the whole risk. A multiplier is closed at its stop-out price when the loss equals the stake. FXNOD's tools trade those products, not margined CFDs.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What triggers a margin call?",
        a: "Your margin level falling to the broker's margin call level, because losses on open positions have reduced your equity.",
      },
      {
        q: "What is the difference between a margin call and a stop out?",
        a: "A margin call is the warning. A stop out is the broker closing your positions.",
      },
      {
        q: "Can I avoid a margin call by depositing more?",
        a: "Depositing raises the margin level. It does not fix the trade, and often just increases the eventual loss.",
      },
    ],
    related: ["what-is-leverage-in-trading", "what-are-cfds"],
  },

  {
    slug: "what-is-a-pip-in-trading",
    title: "What is a pip in trading?",
    description:
      "A pip is the standard unit of price movement in forex, usually the fourth decimal place. How to count pips, what a pip is worth, and pips against points.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "A pip is the standard unit for measuring price movement in forex. For most currency pairs it is the fourth decimal place, so a move from 1.1000 to 1.1001 is one pip. For pairs quoted against the Japanese yen it is the second decimal place. What a pip is worth in money depends on the size of your position.",
    body: [
      { type: "h2", text: "Counting pips" },
      {
        type: "table",
        head: ["Pair", "From", "To", "Move"],
        rows: [
          ["EUR/USD", "1.1000", "1.1025", "25 pips"],
          ["GBP/USD", "1.2750", "1.2700", "50 pips down"],
          ["USD/JPY", "150.00", "150.30", "30 pips"],
        ],
      },
      { type: "h2", text: "What a pip is worth" },
      {
        type: "table",
        head: ["Position", "Units", "Value of one pip on a dollar-quoted pair"],
        rows: [
          ["Standard lot", "100,000", "About 10"],
          ["Mini lot", "10,000", "About 1"],
          ["Micro lot", "1,000", "About 0.10"],
        ],
      },
      {
        type: "p",
        text: "Pip value equals the pip size multiplied by the position size, converted into your account currency. A 20-pip stop on one mini lot of EUR/USD risks about 20.",
      },
      { type: "h2", text: "Pips, pipettes, points and ticks" },
      {
        type: "table",
        head: ["Term", "Meaning"],
        rows: [
          ["Pip", "The standard unit: fourth decimal place for most pairs"],
          ["Pipette", "A tenth of a pip: the fifth decimal place"],
          ["Point", "The smallest price increment on a platform, or a unit of movement on an index"],
          ["Tick", "One price update, of any size"],
        ],
      },
      {
        type: "p",
        text: "Platforms that quote five decimals show pipettes, so a spread displayed as 12 may be 1.2 pips. Confusing the two leads to stops and position sizes that are ten times out.",
      },
      { type: "h2", text: "Using pips" },
      {
        type: "list",
        items: [
          "Measure the stop distance in pips.",
          "Multiply by the pip value of your position to get the money at risk.",
          "Or work backwards: divide the money you will risk by the stop distance to get the pip value, and so the position size.",
        ],
      },
      { type: "h2", text: "Outside forex" },
      {
        type: "p",
        text: "Indices, commodities and synthetic indices are usually measured in points, not pips, and each instrument has its own point value. On Deriv's turbos and vanillas the payout is quoted per point. Always check the specification of the instrument before calculating risk.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "How much is 1 pip worth?",
        a: "About 10 per standard lot, 1 per mini lot and 0.10 per micro lot on pairs quoted in dollars.",
      },
      {
        q: "What is the difference between a pip and a point?",
        a: "A pip is the forex convention. A point is the smallest increment on a platform, often a tenth of a pip, or the unit used on indices.",
      },
      {
        q: "How many pips should I target per day?",
        a: "Pip targets are not a useful goal. Think in risk per trade and whether each setup justifies it.",
      },
    ],
    related: ["what-is-spread-in-trading", "how-to-calculate-position-size"],
  },

  {
    slug: "where-to-place-a-stop-loss",
    title: "Where to place a stop loss",
    description:
      "Place a stop loss where the trade idea is proven wrong, beyond a level and outside normal noise, then size the position to fit. Methods and mistakes.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Place a stop loss at the price where your reason for the trade is no longer valid: beyond the support, resistance or swing point the idea rests on, and far enough away that ordinary movement will not reach it. Then choose the position size so that a stop at that distance costs the amount you decided to risk. The chart sets the stop; you set the size.",
    body: [
      { type: "h2", text: "Four ways to place it" },
      {
        type: "table",
        head: ["Method", "Where the stop goes", "Suits"],
        rows: [
          ["Structure", "Beyond the last swing low for a long trade, swing high for a short", "Most discretionary trading"],
          ["Level", "Beyond the support or resistance zone you are trading from", "Bounce and breakout trades"],
          ["Volatility", "A multiple of ATR, often 1.5 to 2, from the entry", "Any method; adapts to conditions"],
          ["Time", "Exit if the trade has not worked after a set period", "Short-term methods"],
        ],
      },
      { type: "h2", text: "The order of decisions" },
      {
        type: "steps",
        items: [
          { title: "Find where the idea is wrong", text: "On the chart, before thinking about money." },
          { title: "Add a buffer", text: "Past the wicks, and outside the spread." },
          { title: "Measure the distance", text: "In pips or points." },
          { title: "Set the size", text: "Money at risk divided by the distance." },
          { title: "Check the target", text: "If the next level is closer than the stop, skip the trade." },
        ],
      },
      { type: "h2", text: "Mistakes" },
      {
        type: "list",
        items: [
          "Choosing the stop from the amount you want to lose, not from the chart.",
          "Placing it exactly on an obvious level or a round number, where everyone else's is.",
          "Setting it tighter than the market's normal movement.",
          "Moving it further away as the price approaches.",
          "Moving it to break even too early, and being stopped by noise before the move.",
        ],
      },
      { type: "h2", text: "Wide or tight?" },
      {
        type: "p",
        text: "A tight stop allows a larger position and is hit more often. A wide stop is hit less often and needs a smaller position. The money at risk is the same either way if you size properly. Prefer the stop that reflects the market's structure, and let the position shrink to fit it.",
      },
      { type: "h2", text: "With a take profit" },
      {
        type: "p",
        text: "Place the target at the next opposing level, and compare. A stop of 30 and a target of 60 is a 1:2 trade, which breaks even at a 33% win rate. If the realistic target is smaller than the stop, the trade needs a win rate you probably do not have.",
      },
      { type: "h2", text: "Stops on options and bots" },
      {
        type: "p",
        text: "A fixed-payout option has no stop: the stake is the loss. There, the equivalent decision is the stake itself and the session's stop loss. A bot in FXNOD cannot start without a session stop loss, and Multipliers in dTrader let you set a stop loss on the position.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "How far should my stop loss be?",
        a: "As far as the chart requires: beyond the level that invalidates the trade. Then size the position to match.",
      },
      {
        q: "Should I move my stop to break even?",
        a: "Once the price has moved clearly in your favour, it can protect the trade. Doing it too early gets you stopped by normal movement.",
      },
      {
        q: "Is trading without a stop loss ever sensible?",
        a: "Only on products where the loss is already capped, such as options. On leveraged positions, no.",
      },
    ],
    related: ["stop-loss-and-take-profit", "atr-indicator-explained"],
  },

  {
    slug: "trailing-stop-explained",
    title: "Trailing stop loss: how it works and when to use it",
    description:
      "A trailing stop follows the price by a set distance when it moves in your favour and stays put when it does not. Types, settings and trade-offs.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "A trailing stop is a stop loss that moves with the price when a trade goes in your favour and stays where it is when the price moves against you. If you trail by 30 pips and the price rises 100, the stop has risen 100 as well. It locks in profit as a trend continues and exits when the price turns by the trailing distance.",
    body: [
      { type: "h2", text: "An example" },
      {
        type: "table",
        head: ["Price", "Trailing stop (30 behind)", "What happened"],
        rows: [
          ["1.1000", "1.0970", "Entry"],
          ["1.1050", "1.1020", "Stop follows the rise"],
          ["1.1030", "1.1020", "Price dips; the stop does not move back"],
          ["1.1100", "1.1070", "Stop follows again"],
          ["1.1070", "1.1070", "Stopped out with 70 locked in"],
        ],
      },
      { type: "h2", text: "Ways to trail" },
      {
        type: "table",
        head: ["Method", "The stop follows", "Character"],
        rows: [
          ["Fixed distance", "A set number of pips or points behind the price", "Simple; ignores volatility"],
          ["Percentage", "A set percentage behind the price", "Common for shares"],
          ["ATR multiple", "A multiple of the average true range", "Adapts to volatility"],
          ["Structure", "Each new higher low in an uptrend", "Follows the trend's own rhythm"],
          ["Moving average", "An average the price is trending above", "Slow; stays in long trends"],
        ],
      },
      { type: "h2", text: "The trade-off" },
      {
        type: "p",
        text: "A tight trail protects more profit and is knocked out by ordinary pullbacks, often just before the trend continues. A loose trail stays in the trend and gives back more at the end. There is no setting that does both. Choose by whether you would rather miss part of a big move or give back part of your gain.",
      },
      { type: "h2", text: "Trailing stop and normal stop" },
      {
        type: "table",
        head: ["", "Stop loss", "Trailing stop"],
        rows: [
          ["Position", "Fixed", "Moves in your favour only"],
          ["Purpose", "Limit the loss", "Limit the loss, then protect profit"],
          ["Needs a target?", "Usually paired with one", "Can replace a fixed target"],
        ],
      },
      { type: "h2", text: "Things to know" },
      {
        type: "list",
        items: [
          "On some platforms a trailing stop runs on your device and stops when the terminal closes. Check where yours runs.",
          "Like any stop, it can fill beyond its level in a gap.",
          "Trailing works in trends and performs poorly in ranges.",
          "A stop-limit version can fail to fill at all in a fast move.",
        ],
      },
      { type: "h2", text: "In bots" },
      {
        type: "p",
        text: "For a bot session, the equivalent is a limit that rises as the session gains, so part of a profit is kept. FXNOD's bots use a fixed session stop loss and an optional profit target, not a trailing one.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is a trailing stop better than a stop loss?",
        a: "It is a stop loss that also protects profit. It suits trending trades and is no help in a range.",
      },
      {
        q: "What is a good trailing stop distance?",
        a: "One wider than the market's normal pullbacks. An ATR multiple is a sensible way to set it.",
      },
      {
        q: "Does a trailing stop guarantee my profit?",
        a: "No. In a gap or fast market it can fill worse than its level.",
      },
    ],
    related: ["where-to-place-a-stop-loss", "atr-indicator-explained"],
  },

  {
    slug: "what-is-hedging-in-trading",
    title: "What is hedging in trading?",
    description:
      "Hedging is opening a position that offsets the risk of another. How it works, what it costs, and why hedging a losing trade rarely helps.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Hedging means opening a position that gains when another position loses, to reduce the risk of the first. An investor holding shares might buy a put option as insurance. In retail trading it often means opening a buy and a sell on the same market, which freezes the loss and costs two spreads. Hedging reduces risk at a price. It does not create profit.",
    body: [
      { type: "h2", text: "The common kinds" },
      {
        type: "table",
        head: ["Type", "How it works", "Used by"],
        rows: [
          ["Direct hedge", "A buy and a sell on the same market", "Retail traders, to pause a losing trade"],
          ["Correlated hedge", "An opposite position on a related market", "Traders managing several positions"],
          ["Options hedge", "Buying an option that pays if the main position falls", "Investors protecting a holding"],
          ["Natural hedge", "Offsetting a real exposure, such as future foreign income", "Businesses"],
        ],
      },
      { type: "h2", text: "What a direct hedge really does" },
      {
        type: "p",
        text: "If you are long and losing 100, and you open an equal short, your loss stays at about 100 whatever the price does next. You have not reduced it. You have paid a second spread, and now face two decisions instead of one: when to close each side. Closing the losing trade would have had the same financial effect at lower cost.",
      },
      { type: "h2", text: "When hedging makes sense" },
      {
        type: "list",
        items: [
          "You hold a long-term position you do not want to sell and want protection through a risky period.",
          "You have a real exposure outside trading, such as income in another currency.",
          "The cost of the hedge is small compared with the loss it insures.",
        ],
      },
      { type: "h2", text: "When it does not" },
      {
        type: "list",
        items: [
          "As a way to avoid admitting a trade was wrong.",
          "When the two sides are the same market: it is a closed position with extra costs.",
          "When the hedge is on a market you assume is related and is not, when it matters.",
          "In hedging bots and grid systems, where both sides are built up until a strong trend breaks them.",
        ],
      },
      { type: "h2", text: "The cost" },
      {
        type: "p",
        text: "Every hedge costs something: a spread, a premium, swap on two positions, or margin tied up. A hedge that is always on removes the risk and the return together. Insurance is worth buying for a specific danger over a specific period.",
      },
      { type: "h2", text: "Rules and platforms" },
      {
        type: "p",
        text: "Some regulators and platforms do not allow opposite positions on the same instrument in one account, and net them instead. Others allow it. Check how your platform treats it before relying on a hedge.",
      },
      { type: "h2", text: "On options contracts" },
      {
        type: "p",
        text: "Buying a Rise and a Fall on the same market at the same time is not a hedge that protects anything. One wins and one loses, and because each payout is less than double the stake, the pair loses the contract cost with certainty.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is hedging profitable?",
        a: "No. Hedging reduces risk and costs money. It is insurance, not a strategy for profit.",
      },
      {
        q: "Is hedging the same as a stop loss?",
        a: "No. A stop loss closes the position. A hedge keeps it open and offsets it, usually at a higher cost.",
      },
      {
        q: "Can I buy Rise and Fall together to never lose?",
        a: "No. One side loses its stake and the other pays less than double, so the pair always loses a little.",
      },
    ],
    related: ["long-vs-short-trading", "options-vs-cfds"],
  },

  {
    slug: "long-vs-short-trading",
    title: "Long vs short trading: what going long and short means",
    description:
      "Going long means buying to profit from a rise. Going short means selling to profit from a fall. How shorting works, its risks, and the terms.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Going long means buying, expecting the price to rise, and profiting if it does. Going short means selling first, expecting the price to fall, and profiting by buying back lower. On a long position the loss is limited to what you paid. On a short position the price can rise without limit, so the possible loss is larger unless a stop is used.",
    body: [
      { type: "h2", text: "Side by side" },
      {
        type: "table",
        head: ["", "Long", "Short"],
        rows: [
          ["You", "Buy first, sell later", "Sell first, buy back later"],
          ["Profit when", "The price rises", "The price falls"],
          ["Also called", "Bullish", "Bearish"],
          ["Worst case without leverage", "The price falls to zero", "The price rises with no ceiling"],
          ["Close by", "Selling", "Buying"],
        ],
      },
      { type: "h2", text: "How shorting works" },
      {
        type: "p",
        text: "With shares, a short seller borrows the shares, sells them, and later buys them back to return. With derivatives such as CFDs you do not borrow anything: you simply open a sell position on the price, and the contract pays the difference. In forex, every trade is long one currency and short the other at the same time.",
      },
      { type: "h2", text: "Risks particular to shorting" },
      {
        type: "list",
        items: [
          "Losses can exceed the initial value, because prices have no upper limit.",
          "Short squeezes: a rising price forces short sellers to buy back, which pushes it higher.",
          "Financing costs and, with shares, borrowing fees.",
          "Markets that rise over the long run work against holding shorts for long.",
        ],
      },
      { type: "h2", text: "Does direction change the method?" },
      {
        type: "p",
        text: "The analysis is the same in mirror image: resistance instead of support, lower highs instead of higher lows. Falls are often faster than rises, so short trades tend to work or fail more quickly. Risk management is identical: a stop where the idea is wrong, and a position sized to it.",
      },
      { type: "h2", text: "On options" },
      {
        type: "p",
        text: "Fixed-payout options make direction a simple choice with the same capped risk either way. Buying a Fall, a Lower or a Put expresses a bearish view without the unlimited loss of a short position: the most you can lose is the stake. The same is true of a Down multiplier, which is stopped out when the loss reaches the stake.",
      },
      { type: "h2", text: "Position and bias" },
      {
        type: "list",
        items: [
          "A long position is a holding. A long bias is an expectation.",
          "Being flat means holding nothing, which is a position too and often the right one.",
          "Net long or net short describes the balance of several positions.",
        ],
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is shorting riskier than going long?",
        a: "The possible loss on a short has no ceiling, so without a stop it is. With a stop and correct size, the risk per trade is the same.",
      },
      {
        q: "Can beginners short?",
        a: "Yes, with a stop loss. Fixed-payout options offer a bearish trade with the loss capped at the stake.",
      },
      {
        q: "What does going long mean in forex?",
        a: "Buying the first currency of a pair and selling the second, expecting the pair's price to rise.",
      },
    ],
    related: ["what-are-cfds", "what-is-hedging-in-trading"],
  },

  {
    slug: "what-are-cfds",
    title: "What are CFDs and how do they work?",
    description:
      "A CFD is a contract that pays the difference in a market's price between opening and closing, with leverage. Costs, risks and who should avoid them.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "A CFD, or contract for difference, is an agreement with a broker to exchange the difference in a market's price between when you open the contract and when you close it. You never own the underlying asset. CFDs are leveraged, so a small deposit controls a large position, and losses as well as gains are magnified.",
    body: [
      { type: "h2", text: "How one works" },
      {
        type: "steps",
        items: [
          { title: "Choose a market and a direction", text: "Buy if you expect a rise, sell if you expect a fall." },
          { title: "Choose a size", text: "In lots or units. This decides how much each point is worth." },
          { title: "Put up margin", text: "A fraction of the position's value." },
          { title: "Close when you choose", text: "The difference in price, times the size, is your profit or loss." },
        ],
      },
      { type: "h2", text: "A worked example" },
      {
        type: "p",
        text: "You buy a CFD on an index at 5,000, with a size that pays 1 per point. The index rises to 5,050 and you close: a profit of 50, less costs. Had it fallen to 4,950 you would have lost 50. The margin you put up may have been only a few units, which is why a move of 1% can be a large share of the deposit.",
      },
      { type: "h2", text: "The costs" },
      {
        type: "table",
        head: ["Cost", "When"],
        rows: [
          ["Spread", "On every trade, at the open"],
          ["Commission", "On some accounts and markets"],
          ["Overnight financing (swap)", "Each night a position is held"],
          ["Slippage", "When fills differ from the quoted price"],
        ],
      },
      { type: "h2", text: "Why regulators warn about them" },
      {
        type: "list",
        items: [
          "Leverage turns ordinary price moves into large gains and losses.",
          "Brokers in regulated markets must publish the share of retail accounts that lose money on CFDs, and it is a clear majority.",
          "The broker is often the other side of the trade.",
          "Retail CFDs are restricted or prohibited in some countries.",
        ],
      },
      { type: "h2", text: "CFDs against other products" },
      {
        type: "table",
        head: ["", "CFD", "Fixed-payout option", "Owning the asset"],
        rows: [
          ["Ownership", "None", "None", "Yes"],
          ["Leverage", "Yes", "No", "No, unless borrowed"],
          ["Loss per trade", "Open-ended without a stop", "The stake", "The amount invested"],
          ["Can go short", "Yes", "Yes", "Only by borrowing"],
        ],
      },
      { type: "h2", text: "Who should avoid them" },
      {
        type: "p",
        text: "Anyone who does not yet understand margin, leverage and position sizing. Learn those on a demo account first. Deriv offers CFDs on Deriv MT5 and Deriv cTrader and warns of losing money rapidly due to leverage. FXNOD's tools do not trade CFDs.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Do you own the asset with a CFD?",
        a: "No. A CFD is a contract on the price. You have no ownership, voting rights or delivery.",
      },
      {
        q: "Are CFDs good for beginners?",
        a: "They are high risk and need an understanding of leverage first. Most retail CFD accounts lose money.",
      },
      {
        q: "What is the difference between CFDs and futures?",
        a: "Futures are standardised contracts traded on an exchange with an expiry. CFDs are agreements with a broker, usually without expiry.",
      },
    ],
    related: ["options-vs-cfds", "what-is-leverage-in-trading"],
  },

  {
    slug: "fundamental-vs-technical-analysis",
    title: "Fundamental vs technical analysis: what is the difference?",
    description:
      "Fundamental analysis asks what an asset is worth; technical analysis reads its price chart. What each uses, their limits, and how traders combine them.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Fundamental analysis studies what drives an asset's value: interest rates, economic data, company earnings. Technical analysis studies the price chart itself: trends, levels and patterns. Fundamentals suggest what to trade and in which direction over time. Technicals suggest when to enter and where to exit. Many traders use both, and neither predicts with certainty.",
    body: [
      { type: "h2", text: "Side by side" },
      {
        type: "table",
        head: ["", "Fundamental", "Technical"],
        rows: [
          ["Asks", "What is this worth, and what is changing?", "What is the price doing?"],
          ["Uses", "Economic data, rates, earnings, news", "Charts, levels, indicators"],
          ["Time horizon", "Weeks to years", "Minutes to months"],
          ["Good at", "Direction over the longer term", "Timing and risk placement"],
          ["Weak at", "Timing", "Explaining why"],
          ["Main risk", "Being right too early", "Seeing patterns in noise"],
        ],
      },
      { type: "h2", text: "What a fundamental trader watches" },
      {
        type: "list",
        items: [
          "Forex: interest rates and expectations for them, inflation, employment, growth.",
          "Shares: earnings, margins, debt, valuation.",
          "Commodities: supply, demand, inventories, the dollar.",
        ],
      },
      { type: "h2", text: "What a technical trader watches" },
      {
        type: "list",
        items: [
          "Trend: higher highs and higher lows, or the reverse.",
          "Levels: where the price has turned before.",
          "Momentum and volatility: how fast and how far it is moving.",
        ],
      },
      { type: "h2", text: "Using them together" },
      {
        type: "steps",
        items: [
          { title: "Fundamentals for the bias", text: "Which currency is strengthening, and why?" },
          { title: "Technicals for the entry", text: "Wait for a pullback to a level in that direction." },
          { title: "Technicals for the stop", text: "Beyond the level that invalidates the idea." },
          { title: "The calendar for timing", text: "Avoid opening just before a major release." },
        ],
      },
      { type: "h2", text: "Which is better?" },
      {
        type: "p",
        text: "The question depends on your holding time. Over minutes, fundamentals barely move and charts are all there is. Over years, charts matter little and value matters most. Day traders lean technical, investors fundamental, and most people in between use both.",
      },
      { type: "h2", text: "Where neither applies" },
      {
        type: "p",
        text: "A synthetic index has no fundamentals: no economy, earnings or central bank stands behind it. Deriv also says historical patterns on these indices are coincidental, which removes the basis for technical analysis too. Trading them is about payout, stake and limits.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Which is better for beginners?",
        a: "Start with the basics of both: what moves your market, and how to read trend and levels on its chart.",
      },
      {
        q: "Can I trade with technical analysis only?",
        a: "Many short-term traders do. Knowing when major news is due is still essential.",
      },
      {
        q: "Does fundamental analysis work in forex?",
        a: "It explains the larger moves, driven mostly by interest rate expectations. It is poor at timing entries.",
      },
    ],
    related: ["how-interest-rates-affect-currencies", "price-action-trading-explained"],
  },

  {
    slug: "how-interest-rates-affect-currencies",
    title: "How do interest rates affect currencies?",
    description:
      "Higher interest rates tend to strengthen a currency by attracting money; expectations matter more than the rate itself. How it works, with exceptions.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Higher interest rates tend to strengthen a currency, because investors earn more by holding assets in it and so buy it. Lower rates tend to weaken it. What moves the market is the change in expectations: a currency often rises before a rate increase and can fall when the increase arrives, if it was already priced in.",
    body: [
      { type: "h2", text: "The mechanism" },
      {
        type: "steps",
        items: [
          { title: "A central bank raises its rate", text: "Deposits and bonds in that currency pay more." },
          { title: "Money flows towards the higher return", text: "Investors must buy the currency to buy those assets." },
          { title: "Demand lifts the currency", text: "Against currencies paying less." },
          { title: "The difference matters, not the level", text: "It is the gap between two countries' rates that moves a pair." },
        ],
      },
      { type: "h2", text: "Expectations come first" },
      {
        type: "table",
        head: ["What happens", "Typical reaction"],
        rows: [
          ["A rise, fully expected", "Little movement; sometimes a fall as traders take profit"],
          ["A rise, larger than expected", "The currency strengthens"],
          ["No change, but a hint of future rises", "The currency strengthens"],
          ["A rise, with a hint that it is the last", "The currency can weaken"],
          ["A cut, already priced in", "Little movement"],
        ],
      },
      {
        type: "p",
        text: "This is why the statement and press conference often move the market more than the decision itself.",
      },
      { type: "h2", text: "Why central banks change rates" },
      {
        type: "list",
        items: [
          "Rising inflation leads them to raise rates to slow spending.",
          "Weak growth or rising unemployment leads them to cut.",
          "So inflation and employment data move currencies by changing what traders expect the bank to do next.",
        ],
      },
      { type: "h2", text: "The exceptions" },
      {
        type: "list",
        items: [
          "A country raising rates because its currency is collapsing or inflation is out of control may not see it strengthen.",
          "In a crisis, money moves to currencies seen as safe regardless of their rates.",
          "Real rates, after inflation, matter more than headline ones.",
          "Government debt, trade balances and politics can outweigh the rate.",
        ],
      },
      { type: "h2", text: "The carry trade" },
      {
        type: "p",
        text: "Borrowing a low-rate currency to hold a high-rate one earns the difference each day. It works quietly for long periods and unwinds violently when markets turn fearful, which is why high-yielding currencies can fall sharply in a panic. The overnight swap on a forex position is this same rate difference, charged or paid.",
      },
      { type: "h2", text: "For a trader" },
      {
        type: "list",
        items: [
          "Know the dates of central bank meetings for the currencies you trade.",
          "Expect sharp, two-way moves around them.",
          "Read the forecast as well as the decision.",
        ],
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Does a rate hike always strengthen a currency?",
        a: "No. If it was expected, the move may already have happened, and the currency can fall afterwards.",
      },
      {
        q: "Which interest rate matters most for forex?",
        a: "The United States' rate, because the dollar is on one side of most currency trading.",
      },
      {
        q: "What is a swap in forex?",
        a: "The overnight charge or credit on a position, reflecting the difference between the two currencies' interest rates.",
      },
    ],
    related: ["how-economic-news-affects-trading", "what-is-nfp-in-trading"],
  },

  {
    slug: "what-is-nfp-in-trading",
    title: "What is NFP in trading?",
    description:
      "NFP is the US Non-Farm Payrolls jobs report, usually released on the first Friday of the month. Why it moves markets and how traders handle it.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "NFP stands for Non-Farm Payrolls, the monthly United States report on how many jobs the economy added outside farming. It is usually published on the first Friday of each month and is one of the most market-moving releases, because it shapes expectations for US interest rates. Prices can jump within seconds, so many traders stay out around it.",
    body: [
      { type: "h2", text: "What the report contains" },
      {
        type: "table",
        head: ["Figure", "What it shows", "Why it matters"],
        rows: [
          ["Non-farm payrolls", "Jobs added or lost in the month", "The headline; a broad measure of the economy"],
          ["Unemployment rate", "Share of the workforce without a job", "Watched by the central bank"],
          ["Average hourly earnings", "Wage growth", "A signal for inflation"],
          ["Revisions", "Changes to previous months' figures", "Can outweigh the headline"],
        ],
      },
      { type: "h2", text: "Why it moves markets" },
      {
        type: "p",
        text: "Strong jobs and wages suggest the economy can bear higher interest rates, which tends to support the dollar. Weak figures suggest cuts. Because the dollar is on one side of most currency trades, and gold and stock indices respond to US rates too, the release reaches almost every market.",
      },
      { type: "h2", text: "What happens around the release" },
      {
        type: "list",
        items: [
          "Before: quiet trading and widening spreads.",
          "At the release: a jump, often with no prices in between, so stops fill beyond their levels.",
          "In the first minutes: a sharp move that frequently reverses as the details are read.",
          "Later: a steadier direction if the report changed expectations.",
        ],
      },
      { type: "h2", text: "How traders handle it" },
      {
        type: "table",
        head: ["Approach", "What it involves"],
        rows: [
          ["Stay out", "Close or avoid short-term trades around the release. The default for beginners"],
          ["Trade the aftermath", "Wait 15 to 30 minutes, then trade the direction that holds"],
          ["Trade the release", "Experienced traders only, small size, accepting slippage"],
        ],
      },
      { type: "h2", text: "Reading the number" },
      {
        type: "p",
        text: "Compare the actual figure with the forecast, not with zero. A gain of 150,000 jobs is a disappointment if 220,000 was expected. Then look at wages and the revisions before deciding what the report really said. The first move is often made on the headline alone.",
      },
      { type: "h2", text: "Other releases of the same weight" },
      {
        type: "list",
        items: [
          "Central bank rate decisions.",
          "Inflation reports.",
          "The same cautions apply to each.",
        ],
      },
      { type: "h2", text: "Synthetic indices" },
      {
        type: "p",
        text: "Deriv says its synthetic indices are not affected by external news, so NFP has no effect on them. A bot on a real market should be stopped around the release unless it was built for it.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "When is NFP released?",
        a: "Usually on the first Friday of each month. Check an economic calendar for the exact date and time in your time zone.",
      },
      {
        q: "Should beginners trade NFP?",
        a: "No. Spreads widen, prices gap and stops slip. Watch a few releases before trading anywhere near one.",
      },
      {
        q: "Does NFP affect gold?",
        a: "Yes. Gold responds to the dollar and to expectations for US interest rates, both of which NFP moves.",
      },
    ],
    related: ["how-economic-news-affects-trading", "how-interest-rates-affect-currencies"],
  },

  {
    slug: "xauusd-gold-trading-explained",
    title: "XAUUSD: how gold trading works",
    description:
      "XAUUSD is the price of an ounce of gold in US dollars. What moves it, when it trades, how its volatility compares, and how to size a gold position.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "XAUUSD is the price of one troy ounce of gold in US dollars. XAU is gold's market code. Retail traders usually trade it as a CFD, without owning metal. Gold tends to rise when US interest rates or the dollar fall and when investors are fearful. It moves further than most currency pairs, so positions need to be smaller.",
    body: [
      { type: "h2", text: "What moves gold" },
      {
        type: "table",
        head: ["Driver", "Usual effect on gold"],
        rows: [
          ["US interest rates rising", "Down: gold pays no interest, so other assets become more attractive"],
          ["US dollar strengthening", "Down: gold is priced in dollars"],
          ["Inflation fears", "Up: gold is held as a store of value"],
          ["Crisis and uncertainty", "Up: demand for safe assets"],
          ["Central bank buying", "Up"],
        ],
      },
      {
        type: "p",
        text: "These are tendencies. Gold and the dollar sometimes rise together in a crisis, and gold can fall in a panic when investors sell everything to raise cash.",
      },
      { type: "h2", text: "When it trades" },
      {
        type: "p",
        text: "Gold trades almost around the clock from Monday to Friday, with a short daily break. It is most active during the London and New York sessions, and moves sharply on US data such as inflation and the jobs report. Exact hours depend on your broker.",
      },
      { type: "h2", text: "Volatility and position size" },
      {
        type: "p",
        text: "Gold routinely moves 1% or more in a day, far more in money terms than a major currency pair at the same lot size. A stop that would be wide on a currency pair is noise on gold. Measure the stop from the chart or from ATR, work out what one point is worth for your size from the contract specification, and size the position so that the stop costs your fixed risk. For most small accounts that means the smallest size available.",
      },
      { type: "h2", text: "Ways to trade gold" },
      {
        type: "table",
        head: ["Way", "What it is"],
        rows: [
          ["CFD", "A leveraged contract on the price; no ownership"],
          ["Futures", "Exchange-traded contracts with an expiry"],
          ["Funds", "Shares in a fund that holds gold"],
          ["Physical", "Coins or bars"],
        ],
      },
      { type: "h2", text: "Mistakes on gold" },
      {
        type: "list",
        items: [
          "Using the same lot size as on a currency pair.",
          "Stops inside the normal daily range.",
          "Trading through US data releases without knowing they are due.",
          "Treating it as a safe asset in a short-term leveraged trade. Safe for a long-term holder is not safe for a day trader.",
        ],
      },
      { type: "h2", text: "On Deriv and in FXNOD" },
      {
        type: "p",
        text: "Deriv lists gold among its markets. Which products are offered on it depends on your account. FXNOD's market picker shows the markets your Deriv account offers for the trade type you choose.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What does XAUUSD mean?",
        a: "The price of one troy ounce of gold in US dollars. XAU is gold's code and USD is the dollar's.",
      },
      {
        q: "Is gold good for beginners?",
        a: "It is very volatile, which makes position sizing unforgiving. Learn sizing on a demo account first.",
      },
      {
        q: "What is the best time to trade gold?",
        a: "The London and New York sessions are the most active. US data releases bring the largest and riskiest moves.",
      },
    ],
    related: ["what-is-nfp-in-trading", "how-to-calculate-position-size"],
  },

  {
    slug: "crypto-vs-forex",
    title: "Crypto vs forex: which should you trade?",
    description:
      "Forex is the largest, most liquid market and trades five days a week. Crypto trades every day and is far more volatile. A side-by-side comparison.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Forex is the market for national currencies: very large, very liquid, open five days a week and moved by interest rates and economies. Crypto is the market for digital assets: open every day, far more volatile, and moved by sentiment, adoption and regulation. Neither is more profitable by nature. Crypto's larger moves bring larger losses as readily as gains.",
    body: [
      { type: "h2", text: "Side by side" },
      {
        type: "table",
        head: ["", "Forex", "Crypto"],
        rows: [
          ["Trades", "National currencies in pairs", "Digital assets"],
          ["Hours", "Monday to Friday, around the clock", "Every day, around the clock"],
          ["Liquidity", "Very high on major pairs", "High on the largest coins, thin on small ones"],
          ["Typical daily move", "Under 1% on major pairs", "Several per cent, sometimes far more"],
          ["Moved by", "Interest rates, data, politics", "Sentiment, adoption, regulation, large holders"],
          ["Regulation", "Long established", "Newer and varying by country"],
          ["Leverage commonly offered", "High", "Lower, with exceptions"],
          ["Can you own it?", "Not in practice when trading", "Yes, on an exchange or in a wallet"],
        ],
      },
      { type: "h2", text: "What that means in practice" },
      {
        type: "list",
        items: [
          "Forex: smaller moves, so traders use leverage, which is where the risk comes from.",
          "Crypto: large moves without leverage, and extreme ones with it.",
          "Forex has weekend gaps. Crypto has no close, so there is no time when your position cannot move.",
          "Spreads on major currency pairs are among the lowest in any market. Costs on small coins can be high.",
        ],
      },
      { type: "h2", text: "Risks particular to each" },
      {
        type: "table",
        head: ["Forex", "Crypto"],
        rows: [
          ["Over-leverage", "Extreme volatility"],
          ["News gaps", "Exchange failures and hacks"],
          ["Overnight swaps", "Loss of keys or sending to the wrong address"],
          ["Unregulated brokers", "Scams and worthless tokens"],
        ],
      },
      { type: "h2", text: "Which is more profitable?" },
      {
        type: "p",
        text: "The market does not make a trader profitable. A method with an edge and controlled risk can work on either, and a method without one fails on both, faster on the more volatile. Choose by what you can study, the hours you can keep and the swings you can tolerate.",
      },
      { type: "h2", text: "For a beginner" },
      {
        type: "list",
        items: [
          "Learn on one market, on a demo account.",
          "Major currency pairs are steadier and cheaper to trade.",
          "If you choose crypto, start with the largest coins and no leverage.",
          "Size every position from a fixed risk, whatever the market.",
        ],
      },
      { type: "h2", text: "And synthetic indices" },
      {
        type: "p",
        text: "Synthetic indices are a third thing: neither currencies nor crypto, with prices generated by an algorithm. They trade every day like crypto and have none of the fundamentals of either.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is crypto riskier than forex?",
        a: "Unleveraged, yes: it moves much further. Leveraged forex can be just as risky. The leverage you use matters most.",
      },
      {
        q: "Which is better for beginners, crypto or forex?",
        a: "Major currency pairs are steadier and cheaper to learn on. Either should start on a demo account.",
      },
      {
        q: "Can I trade crypto at the weekend?",
        a: "Yes. Crypto markets do not close. Forex is closed from Friday evening to Sunday evening.",
      },
    ],
    related: ["forex-vs-synthetic-indices", "how-volatility-affects-trading"],
  },
];
