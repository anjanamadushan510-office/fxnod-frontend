/**
 * Trading-basics guides: what someone needs to understand before a tool is
 * any use to them. Same shape and same rules as the tool guides in
 * `guides.ts`. These teach method and arithmetic; none of them promises a
 * result, and none states a figure about Deriv that is Deriv's to publish.
 */
import { RISK_NOTE, type Guide } from "./guides";

const TAG = "Trading basics";
const DATE = "2026-10-09";

export const BASICS_GUIDES: Guide[] = [
  {
    slug: "how-to-start-learning-trading",
    title: "How to start learning trading as a beginner",
    description:
      "A beginner's order of study for trading: how markets and contracts work, risk before strategy, a demo account, one method, and a journal.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Start learning trading in this order: understand what you are buying and how it pays, learn risk management before any strategy, practise on a demo account, pick one market and one simple method, and keep a journal of every trade. Use real money only after a few hundred demo trades, and only money you can afford to lose.",
    body: [
      { type: "h2", text: "Why the order matters" },
      {
        type: "p",
        text: "Most beginners start with strategy: which indicator, which pattern, which bot. That is the last thing to learn. A person who understands risk can survive a mediocre strategy long enough to improve it. A person with a good strategy and no risk control loses the account during the first bad week.",
      },
      { type: "h2", text: "A study plan" },
      {
        type: "steps",
        items: [
          {
            title: "Learn the instrument",
            text: "Know exactly what you are trading: what makes the contract win, what it pays, the most it can lose and when it settles. If you cannot answer those four, you are not ready to place it.",
          },
          {
            title: "Learn the arithmetic of risk",
            text: "Stake size, stop loss, risk-to-reward, break-even win rate and drawdown. These five ideas matter more than every chart pattern combined.",
          },
          {
            title: "Open a demo account",
            text: "Trade with virtual funds, but with a balance and stakes you would really use. Unrealistic demo sizes teach unrealistic habits.",
          },
          {
            title: "Learn to read a chart",
            text: "Candlesticks, trend, support and resistance. Enough to describe what the price has been doing in one sentence.",
          },
          {
            title: "Choose one market and one method",
            text: "One market, one timeframe, one setup. Depth teaches more than variety.",
          },
          {
            title: "Journal every trade",
            text: "Why you entered, what happened, whether you followed your plan. Review it every week.",
          },
          {
            title: "Go live small",
            text: "After a few hundred demo trades with a stable process, use the smallest stake available and expect your behaviour to change.",
          },
        ],
      },
      { type: "h2", text: "What to expect, honestly" },
      {
        type: "list",
        items: [
          "Most people who trade short-term lose money. Brokers in regulated markets are required to publish this for their own clients, and the figures are sobering.",
          "Early wins are usually luck and are more dangerous than early losses, because they teach confidence without skill.",
          "Progress shows first as smaller, steadier losses and better discipline, long before it shows as profit.",
          "It takes months of consistent practice, not days.",
        ],
      },
      { type: "h2", text: "What to ignore" },
      {
        type: "list",
        items: [
          "Anyone selling signals, a course or a bot with a guaranteed return.",
          "Screenshots of profits. They show one chosen moment.",
          "Strategies described only by their win rate.",
          "The urge to trade more markets, more often, with more indicators.",
        ],
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "How much money do I need to start trading?",
        a: "None to start learning: a demo account is free. When you go live, use an amount whose complete loss would not affect your life, and the smallest stake your broker allows.",
      },
      {
        q: "How long does it take to learn trading?",
        a: "Expect months of regular practice before your results say anything reliable. Anyone promising competence in a week is selling something.",
      },
      {
        q: "Can I teach myself to trade?",
        a: "Yes. A demo account, a journal and honest review are enough to learn the essentials. Paid courses are optional and their quality varies widely.",
      },
      {
        q: "Should a beginner use a trading bot?",
        a: "Only after trading the same contract by hand on demo, so you understand what the bot does. Then start with a flat stake and a stop loss, on demo.",
      },
    ],
    related: ["how-to-read-candlestick-charts", "risk-to-reward-ratio"],
  },

  {
    slug: "how-to-read-candlestick-charts",
    title: "How to read candlestick charts",
    description:
      "Each candlestick shows four prices for one period: open, high, low and close. How to read the body, the wicks and the colour, with common patterns.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "A candlestick shows four prices for one period of time: the open, the high, the low and the close. The thick body spans the open and the close. The thin wicks reach to the high and the low. A candle that closed above its open is bullish, usually green; one that closed below is bearish, usually red.",
    body: [
      { type: "h2", text: "The parts of a candle" },
      {
        type: "table",
        head: ["Part", "What it shows"],
        rows: [
          ["Body", "The range between the opening and closing price of the period"],
          ["Upper wick", "How far above the body the price reached before falling back"],
          ["Lower wick", "How far below the body the price reached before recovering"],
          ["Colour", "Direction: up if the close is above the open, down if it is below"],
        ],
      },
      { type: "h2", text: "The timeframe" },
      {
        type: "p",
        text: "Each candle covers one period of the chart's timeframe. On a one-minute chart a candle is one minute of trading; on a daily chart, one day. The same market looks calm on a daily chart and violent on a one-minute chart. Always check the timeframe before reading anything else.",
      },
      { type: "h2", text: "What the shape tells you" },
      {
        type: "list",
        items: [
          "A long body: one side was in control for the whole period.",
          "A short body: the open and close were close together, so neither side won.",
          "A long upper wick: the price was pushed up and rejected.",
          "A long lower wick: the price was pushed down and rejected.",
          "No wicks: the price opened at one extreme and closed at the other.",
        ],
      },
      { type: "h2", text: "Common patterns" },
      {
        type: "table",
        head: ["Pattern", "What it looks like", "How it is usually read"],
        rows: [
          ["Doji", "Open and close almost equal, wicks on both sides", "Indecision"],
          ["Hammer", "Small body at the top, long lower wick, after a fall", "Selling was rejected; a possible turn up"],
          ["Shooting star", "Small body at the bottom, long upper wick, after a rise", "Buying was rejected; a possible turn down"],
          ["Bullish engulfing", "An up candle whose body covers the previous down candle", "Buyers took over"],
          ["Bearish engulfing", "A down candle whose body covers the previous up candle", "Sellers took over"],
        ],
      },
      { type: "h2", text: "How much weight to give a pattern" },
      {
        type: "p",
        text: "A pattern is a description of what just happened, not a forecast. Its meaning depends on where it appears: a hammer at a level the price has bounced from before says more than a hammer in the middle of nowhere. Single candles on very short timeframes are mostly noise. On synthetic indices, where each tick is generated at random, candle patterns describe the past accurately and carry no information about the next move.",
      },
      { type: "h2", text: "Practise reading, not predicting" },
      {
        type: "p",
        text: "Open a chart and describe the last twenty candles aloud: who was in control, where the price was rejected, whether the bodies are growing or shrinking. In FXNOD's dTrader you can switch chart types and timeframes on a live chart with a demo account while you practise.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What do the green and red candles mean?",
        a: "Green, or sometimes white, means the price closed higher than it opened in that period. Red, or black, means it closed lower. Colours can be changed in most charting tools.",
      },
      {
        q: "What is a wick on a candlestick?",
        a: "The thin line above or below the body. It marks the highest and lowest prices reached in the period, beyond the open and close.",
      },
      {
        q: "Are candlestick patterns reliable?",
        a: "They are useful descriptions and weak predictors. Used alone, most patterns are close to a coin flip. They gain value with context such as trend and support or resistance.",
      },
      {
        q: "Which is better, a candlestick chart or a line chart?",
        a: "A line chart shows only closing prices and is cleaner. A candlestick chart shows the range within each period, which is what most traders need to judge momentum and rejection.",
      },
    ],
    related: ["support-and-resistance-levels", "dtrader-manual-trading"],
  },

  {
    slug: "support-and-resistance-levels",
    title: "How to identify support and resistance levels",
    description:
      "Support is a price area where falls have stopped; resistance is where rises have stopped. Five ways to find them and how to trade around them.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Support is a price area where falling prices have repeatedly stopped and turned up. Resistance is an area where rising prices have repeatedly stopped and turned down. Find them by marking the highs and lows where the price reversed at least twice. Treat each as a zone, not an exact line, and expect it to break eventually.",
    body: [
      { type: "h2", text: "Why levels form" },
      {
        type: "p",
        text: "In a market made of real buyers and sellers, a level forms because people remember prices. Those who bought at a low want to buy there again; those who missed a high want to sell if it returns. Orders gather around those prices and the price reacts when it reaches them.",
      },
      { type: "h2", text: "Five ways to find them" },
      {
        type: "steps",
        items: [
          { title: "Mark the swing highs and lows", text: "Zoom out. Mark each point where the price clearly reversed. Two or more reversals near the same price make a level." },
          { title: "Start on a higher timeframe", text: "Levels from the daily or four-hour chart matter more than those from the one-minute chart. Mark the big ones first, then zoom in." },
          { title: "Look at round numbers", text: "Prices such as 1.1000 or 2,000 attract orders simply because people think in round figures." },
          { title: "Check previous day's high and low", text: "Widely watched, and therefore widely traded around." },
          { title: "Note where roles reversed", text: "A resistance level that breaks often becomes support on the way back, and the other way round." },
        ],
      },
      { type: "h2", text: "Draw zones, not lines" },
      {
        type: "p",
        text: "The price rarely turns at the same exact figure twice. Draw a band that covers the wicks and bodies of the reversals. If you need a magnifying glass to decide whether a level held, you drew it too thin.",
      },
      { type: "h2", text: "How strong is a level?" },
      {
        type: "list",
        items: [
          "More touches make it more visible, and also more likely to break soon: each test uses up some of the orders resting there.",
          "A sharp move away from a level shows strong interest.",
          "A level visible on a higher timeframe outranks one visible only on a lower one.",
          "A level that has been cut through repeatedly is no longer a level.",
        ],
      },
      { type: "h2", text: "Trading around levels" },
      {
        type: "table",
        head: ["Approach", "The idea", "The risk"],
        rows: [
          ["Bounce", "Trade away from the level when the price reaches it and is rejected", "The level breaks"],
          ["Breakout", "Trade in the direction of the break once the price closes beyond it", "A false break that reverses"],
          ["Retest", "Wait for a break, then for the price to return and hold the level from the other side", "The retest never comes and you miss the move"],
        ],
      },
      { type: "h2", text: "A caution about synthetic indices" },
      {
        type: "p",
        text: "Support and resistance come from the memory of market participants. A synthetic index has no order book and no participants setting the price: it is produced by a random generator. Lines drawn on it will appear to work some of the time, as they would on any random series. Do not size a trade on the assumption that a level there will hold.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is the difference between support and resistance?",
        a: "Support is below the current price and has stopped falls. Resistance is above it and has stopped rises. When one breaks, it often takes on the other's role.",
      },
      {
        q: "How many touches make a valid level?",
        a: "Two reversals make a level worth marking. Three or more make it obvious to everyone, which means both more reaction and more attempts to break it.",
      },
      {
        q: "Which timeframe is best for support and resistance?",
        a: "Mark levels on a higher timeframe than the one you trade. If you trade the five-minute chart, take levels from the hourly chart.",
      },
      {
        q: "Do support and resistance always work?",
        a: "No. Every level breaks eventually. They tell you where a reaction is more likely and where to place a stop, not what will happen.",
      },
    ],
    related: ["how-to-read-candlestick-charts", "forex-vs-synthetic-indices"],
  },

  {
    slug: "how-to-keep-a-trading-journal",
    title: "How to keep a trading journal",
    description:
      "A trading journal records every trade, the reason for it and how you followed your plan. What to write, a ready template and how to review it weekly.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Keep a trading journal by recording every trade when you take it: the market, the setup, the stake, the planned exit, the result, and whether you followed your plan. Review it once a week and look for patterns in your own behaviour. A spreadsheet is enough. The journal only works if losing trades and broken rules go in it too.",
    body: [
      { type: "h2", text: "What a journal is for" },
      {
        type: "p",
        text: "Your broker's history already shows what you traded. A journal records what the history cannot: why you entered, what you planned, how you felt and whether you kept your own rules. Those are the things you can change.",
      },
      { type: "h2", text: "What to record" },
      {
        type: "table",
        head: ["Field", "Example"],
        rows: [
          ["Date and time", "9 Oct, 14:20"],
          ["Market and contract", "Volatility 75, Rise/Fall, 5 ticks"],
          ["Setup", "Bounce from the hourly support zone"],
          ["Stake and risk", "Stake 2, session stop loss 20"],
          ["Planned exit", "Contract expiry; stop for the day at +10 or -20"],
          ["Result", "-2"],
          ["Followed the plan?", "Yes"],
          ["State of mind", "Calm; second trade of the session"],
          ["Note", "Entered a little early, before the candle closed"],
        ],
      },
      { type: "h2", text: "The column that matters most" },
      {
        type: "p",
        text: "Followed the plan, yes or no. Sort your trades by that column after a month. Most traders find their planned trades roughly break even or better and their unplanned trades carry nearly all the losses. No indicator will tell you that. Your journal will.",
      },
      { type: "h2", text: "Journaling a bot" },
      {
        type: "p",
        text: "A bot records its own trades, so journal the runs and your decisions about them: the settings, why you chose them, how the run ended and what you did next. The entry that reads restarted with double stake after stop loss is worth more than a hundred rows of trades.",
      },
      { type: "h2", text: "The weekly review" },
      {
        type: "steps",
        items: [
          { title: "Count", text: "Trades, wins, losses, average win, average loss, net result." },
          { title: "Split", text: "By setup, by time of day, by planned and unplanned. Look for the group that loses." },
          { title: "Find the biggest loss", text: "Was it bad luck inside the plan, or a broken rule?" },
          { title: "Choose one change", text: "One rule to add or one habit to drop next week. Not five." },
        ],
      },
      { type: "h2", text: "Keeping it up" },
      {
        type: "list",
        items: [
          "Write the entry before the result is known, while your reason is still honest.",
          "Keep it short. A journal that takes ten minutes per trade is abandoned in a week.",
          "Add a screenshot of the chart at entry if you trade from charts.",
          "Never delete a row.",
        ],
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is the best format for a trading journal?",
        a: "The one you will keep. A spreadsheet with ten columns beats any specialised app you stop opening. Paper works too.",
      },
      {
        q: "Do I need a journal if my broker shows my history?",
        a: "Yes. The history shows the trades. The journal shows your reasons and whether you followed your rules, which is where improvement comes from.",
      },
      {
        q: "How often should I review my journal?",
        a: "Weekly for patterns, and monthly for the bigger picture. Reviewing after every trade invites overreaction to noise.",
      },
    ],
    related: ["how-to-control-emotions-while-trading", "how-to-evaluate-a-trading-strategy"],
  },

  {
    slug: "how-to-control-emotions-while-trading",
    title: "How to control emotions while trading",
    description:
      "You control trading emotions with rules set in advance, not willpower: smaller stakes, fixed limits, a pause after losses and a written plan.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "You control emotions in trading by deciding everything important before the session, when you are calm: the stake, the most you will lose, when you will stop, and what counts as a valid trade. Then keep the stake small enough that no single result hurts. Emotion cannot be switched off, so the aim is to remove the decisions it could spoil.",
    body: [
      { type: "h2", text: "The four emotions and what they make you do" },
      {
        type: "table",
        head: ["Emotion", "Typical trigger", "What it does to your trading"],
        rows: [
          ["Fear", "A recent loss", "You skip valid trades or exit early"],
          ["Greed", "A winning streak", "You raise the stake or ignore the profit target"],
          ["Revenge", "A loss that felt unfair", "You trade bigger and faster to win it back"],
          ["Fear of missing out", "A move you were not in", "You enter late, without a setup"],
        ],
      },
      { type: "h2", text: "Why willpower fails" },
      {
        type: "p",
        text: "A decision made in the middle of a losing streak is made by a stressed person with money at stake and seconds to think. Promising yourself to stay disciplined in that moment is a plan to be someone else. Rules made in advance work because they move the decision to a time when you could think.",
      },
      { type: "h2", text: "Rules that do the work for you" },
      {
        type: "steps",
        items: [
          { title: "Cut the stake until losses are boring", text: "If a single loss changes your mood, the stake is too large. This one change removes most emotional trading." },
          { title: "Fix a daily loss limit", text: "When it is reached, the day is over. No exceptions and no second session." },
          { title: "Fix a daily profit point", text: "Stopping while ahead prevents the common pattern of giving a good morning back in the afternoon." },
          { title: "Pause after two losses in a row", text: "Ten minutes away from the screen. Revenge trades are placed in the first minute after a loss." },
          { title: "Write the plan down", text: "A written rule is harder to argue with than one in your head." },
          { title: "Do not trade tired, angry or in a hurry", text: "Your state before the session predicts your behaviour during it." },
        ],
      },
      { type: "h2", text: "Does a bot solve it?" },
      {
        type: "p",
        text: "A bot removes emotion from each trade: it will not hesitate, chase or flinch. It does not remove emotion from you. The emotional mistakes move to the controls: stopping a bot in the middle of a normal losing stretch, restarting it with a bigger stake, or switching to Martingale to recover. A stop loss enforced on a server helps, because you cannot quietly move it during the run. What happens after the run ends is still your decision.",
      },
      { type: "h2", text: "When it is more than a bad day" },
      {
        type: "p",
        text: "If you are trading money you need, hiding losses, borrowing to trade, or unable to stop after reaching your limit, the problem is no longer technique. Stop trading and speak to someone you trust or to a gambling support service in your country. Short-term trading can be addictive, and treating that as a strategy problem makes it worse.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "How do I stop revenge trading?",
        a: "Make it mechanically impossible: a fixed daily loss limit, and a rule that two losses in a row mean a break away from the screen. Then lower your stake so a loss does not feel like something to avenge.",
      },
      {
        q: "Why do I trade well on demo and badly on real?",
        a: "Because demo losses do not hurt. Real money brings fear and greed into decisions that were calm before. Start live with a stake small enough to feel like demo.",
      },
      {
        q: "Is trading psychology more important than strategy?",
        a: "They fail in different ways. A good strategy executed badly loses, and perfect discipline applied to a bad strategy also loses. Most beginners underestimate the first problem.",
      },
    ],
    related: ["how-to-keep-a-trading-journal", "trading-bot-risk-management"],
  },

  {
    slug: "risk-to-reward-ratio",
    title: "What is risk-to-reward ratio in trading?",
    description:
      "Risk-to-reward ratio compares what a trade can lose with what it can gain. The formula, the break-even win rate for each ratio, and worked examples.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "The risk-to-reward ratio compares what a trade can lose with what it can gain. Risking 10 to make 20 is a ratio of 1:2. It tells you the win rate you need to break even: risk divided by risk plus reward. At 1:2 that is 33.3%. A ratio means nothing without the win rate beside it.",
    body: [
      { type: "h2", text: "The formula" },
      {
        type: "p",
        text: "Risk is the amount you lose if the trade fails. Reward is the amount you gain if it works. The ratio is risk to reward, written 1:2 when the reward is twice the risk. To compare trades, divide the reward by the risk: a result of 2 means you gain two for every one you risk.",
      },
      { type: "h2", text: "The break-even win rate" },
      {
        type: "p",
        text: "Break-even win rate equals risk divided by the sum of risk and reward. It is the share of trades you must win simply to finish at zero.",
      },
      {
        type: "table",
        head: ["Risk : reward", "Reward per 1 risked", "Win rate needed to break even"],
        rows: [
          ["1:3", "3.00", "25.0%"],
          ["1:2", "2.00", "33.3%"],
          ["1:1", "1.00", "50.0%"],
          ["1:0.95", "0.95", "51.3%"],
          ["1:0.5", "0.50", "66.7%"],
          ["1:0.1", "0.10", "90.9%"],
        ],
      },
      { type: "h2", text: "Why a high win rate can still lose" },
      {
        type: "p",
        text: "The last row is where many digit strategies live. A contract that wins nine times in ten by chance and pays about a tenth of the stake needs to win more than 90.9% of the time to make anything. Winning 90% feels excellent and loses money. Always ask what the wins pay before being impressed by how often they come.",
      },
      { type: "h2", text: "Expected value: the number that settles it" },
      {
        type: "p",
        text: "Expected value per trade equals the win rate multiplied by the reward, minus the loss rate multiplied by the risk. With a 40% win rate at 1:2, risking 10: 0.40 x 20 minus 0.60 x 10 equals 8 minus 6, a gain of 2 per trade on average. With a 60% win rate at 1:0.5, risking 10: 0.60 x 5 minus 0.40 x 10 equals 3 minus 4, a loss of 1 per trade. The second trader wins more often and loses money.",
      },
      { type: "h2", text: "On fixed-payout contracts" },
      {
        type: "p",
        text: "With options that pay a fixed amount, the ratio is set by the quote rather than by where you put a stop. If a stake of 10 returns 19.50 on a win, the risk is 10 and the reward is 9.50: a ratio of 1:0.95 and a break-even win rate of 51.3%. Read the payout on the order form before every trade and you know the win rate that contract demands.",
      },
      { type: "h2", text: "Using it without fooling yourself" },
      {
        type: "list",
        items: [
          "A wide reward target improves the ratio and lowers the chance of reaching it. The two move together.",
          "Measure the ratio you actually achieved, from your trade history, not the one you planned.",
          "Costs count. Spreads and commissions reduce the reward and add to the risk.",
          "Judge a strategy on expected value over many trades, never on the ratio alone.",
        ],
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is a good risk-to-reward ratio?",
        a: "One your win rate can support. A 1:2 ratio is profitable above a 33.3% win rate. A 1:0.5 ratio needs more than 66.7%. Neither is good or bad without the win rate.",
      },
      {
        q: "How do I calculate risk-to-reward?",
        a: "Divide the possible gain by the possible loss. Risking 10 to gain 25 gives 2.5, written 1:2.5.",
      },
      {
        q: "Is a high win rate enough to be profitable?",
        a: "No. A 90% win rate loses money if each win pays a tenth of what a loss costs. Win rate and payout must be judged together.",
      },
      {
        q: "What is expected value in trading?",
        a: "The average result per trade over many trades: win rate times average win, minus loss rate times average loss. A strategy needs it to be positive after costs.",
      },
    ],
    related: ["how-to-evaluate-a-trading-strategy", "trading-bot-risk-management"],
  },

  {
    slug: "forex-vs-synthetic-indices",
    title: "Forex vs synthetic indices: what is the difference?",
    description:
      "Forex is the real market for currencies. Synthetic indices are simulated markets generated by an algorithm. Hours, drivers, risks and who each suits.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Forex is the real-world market where currencies are exchanged, moved by economies, interest rates and news, and open five days a week. Synthetic indices are simulated markets whose prices are produced by a random number generator, unaffected by news and open at all hours. Forex can be analysed but never fully predicted. Synthetic indices are random by design.",
    body: [
      { type: "h2", text: "Side by side" },
      {
        type: "table",
        head: ["", "Forex", "Synthetic indices"],
        rows: [
          ["What it is", "The exchange rate between two real currencies", "A simulated price series created by the broker"],
          ["What moves the price", "Interest rates, economic data, politics, trade flows", "A random number generator with set statistical properties"],
          ["Trading hours", "Around the clock from Monday to Friday", "Every day, at all hours"],
          ["News and events", "Can move the price sharply", "No effect"],
          ["Weekend gaps", "Yes: the price can reopen away from Friday's close", "None"],
          ["Volatility", "Changes with the session and the news", "Fixed by design for each index"],
          ["Where you can trade it", "At many brokers worldwide", "Only at the broker that created it"],
          ["Can analysis give an edge?", "Possibly, with skill and good risk control", "Not on direction: each move is independent of the last"],
        ],
      },
      { type: "h2", text: "How synthetic indices work" },
      {
        type: "p",
        text: "Deriv's synthetic indices are its own products. Deriv describes them as generated by a cryptographically secure random number generator that is audited for fairness by an independent third party. On a volatility index, the number in the name is the volatility the index is built to have: Volatility 75 is designed to be more volatile than Volatility 10. Versions marked (1s) produce a new tick every second. Check Deriv's own pages for the current list and specifications, because Deriv adds and changes them.",
      },
      { type: "h2", text: "What that means in practice" },
      {
        type: "list",
        items: [
          "No economic calendar to watch, no weekend gap, and the same behaviour at any hour.",
          "Because each tick is random, a pattern in recent ticks or digits says nothing about the next one. Strategies there manage stake and payout. They do not predict.",
          "You are trading a product priced and operated by one company, so the terms are whatever that company sets.",
        ],
      },
      { type: "h2", text: "What forex demands instead" },
      {
        type: "list",
        items: [
          "Awareness of scheduled news, when prices can jump and spreads can widen.",
          "Understanding of sessions: the market is quieter in Asia and busiest when London and New York overlap.",
          "Attention to leverage, which multiplies losses as readily as gains.",
        ],
      },
      { type: "h2", text: "Which should you choose?" },
      {
        type: "p",
        text: "Choose forex if you want to study real economies and accept that news can overturn a good analysis. Choose synthetic indices if you want a market that is always open and consistent, and you accept that it is random and that your results depend on payout, stake sizing and discipline. Many people use synthetic indices to practise execution and to run bots at any hour. Whichever you choose, learn it on a demo account first.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Are synthetic indices real markets?",
        a: "No. They are simulations created and run by the broker. The prices are generated by an algorithm and do not track any real asset.",
      },
      {
        q: "Are synthetic indices rigged?",
        a: "Deriv states that its synthetic indices come from a random generator audited by an independent third party. Random does not mean favourable: the payout on each contract, not manipulation, is what works against a strategy with no edge.",
      },
      {
        q: "Can you trade synthetic indices at the weekend?",
        a: "Yes. They run every day at all hours, which is one of the main reasons people automate on them.",
      },
      {
        q: "Which is easier for beginners, forex or synthetic indices?",
        a: "Synthetic indices are simpler to start on: no news and no closing hours. Simpler is not safer. The risk on each trade is the same, and fast contracts lose money quickly.",
      },
      {
        q: "Does technical analysis work on synthetic indices?",
        a: "Charts and indicators describe what a synthetic index has done. Because each move is generated independently, they do not make the next move more predictable.",
      },
    ],
    related: ["how-to-start-automated-trading-on-deriv", "support-and-resistance-levels"],
  },

  {
    slug: "how-to-evaluate-a-trading-strategy",
    title: "How to evaluate a trading strategy before using it",
    description:
      "Evaluate a trading strategy with seven measures: sample size, win rate, average win and loss, expected value, drawdown, losing streak and costs.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Evaluate a trading strategy by testing it over at least a hundred trades and measuring its win rate, average win, average loss, expected value per trade, maximum drawdown and longest losing streak. A strategy is worth using only if its expected value is positive after costs and you could sit through its worst drawdown without changing the rules.",
    body: [
      { type: "h2", text: "First: can it be tested at all?" },
      {
        type: "p",
        text: "A strategy you can evaluate has exact rules: when to enter, how much to stake, when to exit. If two people following it would take different trades, it is a style, and a style cannot be measured. Write the rules down until there is no judgment left in them.",
      },
      { type: "h2", text: "The seven measures" },
      {
        type: "table",
        head: ["Measure", "How to calculate it", "What to look for"],
        rows: [
          ["Sample size", "Number of trades in the test", "At least 100; several hundred if wins or losses are rare"],
          ["Win rate", "Wins divided by trades", "Above the break-even rate for its payout"],
          ["Average win and loss", "Total won over wins; total lost over losses", "Read together with the win rate"],
          ["Expected value", "Win rate x average win minus loss rate x average loss", "Positive after costs"],
          ["Profit factor", "Total won divided by total lost", "Above 1; a figure far above 2 on a small sample is suspicious"],
          ["Maximum drawdown", "Largest fall from a peak in the balance to the next low", "Small enough that you would keep going"],
          ["Longest losing streak", "Count from the trade list", "Your stake sizing must survive it, and a longer one"],
        ],
      },
      { type: "h2", text: "A worked example" },
      {
        type: "p",
        text: "A test of 200 trades at a flat stake of 1 gives 112 wins with an average win of 0.92 and 88 losses of 1.00. Win rate: 56%. Total won: 103.04. Total lost: 88. Net: 15.04. Expected value: about 0.075 per trade. Profit factor: 1.17. Break-even win rate for that payout: 1 divided by 1.92, or 52.1%. The strategy cleared break-even by about four points in this sample, which is encouraging and not yet proof. Another 200 trades are worth more than any amount of further thinking.",
      },
      { type: "h2", text: "Four ways a test lies" },
      {
        type: "list",
        items: [
          "Too few trades. Over 20 trades luck dominates everything.",
          "Curve fitting. Settings adjusted until the past looks perfect have learned the past, including its accidents.",
          "A hidden tail. Recovery strategies such as Martingale show a smooth rising line until the streak that ends them. A test that has not met that streak has not tested the strategy.",
          "One market condition. A result from a single trending week says little about a sideways month.",
        ],
      },
      { type: "h2", text: "Questions to ask of someone else's strategy" },
      {
        type: "list",
        items: [
          "How many trades is this result based on?",
          "What was the largest drawdown, and the largest single loss?",
          "Does the stake grow after a loss?",
          "Can I run it myself on a demo account before paying or depositing anything?",
        ],
      },
      { type: "h2", text: "Testing it yourself" },
      {
        type: "p",
        text: "Forward testing on a demo account is the simplest honest test: live prices, virtual money, fixed settings. In FXNOD you can build the rules in dBot, run them on a Deriv demo account and read the results from the run history. Keep the settings unchanged for the whole test, and decide in advance what result would make you abandon the idea.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "How many trades do I need to evaluate a strategy?",
        a: "A hundred is the minimum to say anything. Several hundred are needed when the strategy wins very often or very rarely, because its result then hangs on a few rare trades.",
      },
      {
        q: "What is a good profit factor?",
        a: "Above 1 means the strategy made money in the test. Between about 1.2 and 2 over a large sample is a realistic good result. Much higher on a small sample usually means luck or curve fitting.",
      },
      {
        q: "What is maximum drawdown?",
        a: "The largest fall in the balance from a high point to the low that followed. It is the best single measure of how painful a strategy is to follow.",
      },
      {
        q: "Does a strategy that worked in the past keep working?",
        a: "There is no guarantee. A test describes the period it covered. Keep measuring a live strategy and stop when its results fall well outside what the test showed.",
      },
    ],
    related: ["how-to-test-a-trading-bot", "risk-to-reward-ratio"],
  },
];
