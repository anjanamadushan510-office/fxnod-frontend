/**
 * How-markets-work guides: price, news, volatility, the common indicators and
 * order types. Same shape and same rules as the tool guides in `guides.ts`.
 *
 * Session hours and release schedules are given as approximate and in UTC:
 * they shift with daylight saving and are published by others, not by us.
 */
import { RISK_NOTE, type Guide } from "./guides";

const TAG = "How markets work";
const DATE = "2026-10-09";

export const MARKET_GUIDES: Guide[] = [
  {
    slug: "why-market-prices-go-up-and-down",
    title: "Why do market prices go up and down?",
    description:
      "Prices move when buyers and sellers disagree about value. How supply and demand, news, expectations and liquidity move a market, tick by tick.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Market prices go up when buyers are willing to pay more than the current price to get in, and down when sellers are willing to accept less to get out. Every move is an imbalance between the two. News, interest rates, earnings, fear and greed matter only because they change how many people want to buy or sell, and how urgently.",
    body: [
      { type: "h2", text: "What a price actually is" },
      {
        type: "p",
        text: "The price on your screen is the last price at which a buyer and a seller agreed. Behind it sit two queues: buyers bidding at lower prices and sellers offering at higher ones. When an impatient buyer takes everything offered at the best price, the next trade happens higher. That is a price rise, and nothing more mysterious.",
      },
      { type: "h2", text: "What changes the balance" },
      {
        type: "table",
        head: ["Driver", "How it moves prices", "Example"],
        rows: [
          ["Interest rates", "Money flows towards currencies and assets that pay more", "A central bank raises rates and its currency strengthens"],
          ["Economic data", "Changes expectations about growth, inflation and rates", "Inflation comes in above forecast"],
          ["Company results", "Change what a share is thought to be worth", "Profits beat expectations"],
          ["Politics and shocks", "Raise or lower the appetite for risk", "An election result or a conflict"],
          ["Positioning", "Crowded trades unwind fast when they go wrong", "A sharp reversal after a long, steady trend"],
          ["Liquidity", "Thin markets move further on the same order", "A jump in quiet holiday trading"],
        ],
      },
      { type: "h2", text: "Why good news can push a price down" },
      {
        type: "p",
        text: "Markets trade expectations, not facts. If traders expected excellent news and received merely good news, those who bought in advance sell. The saying is buy the rumour, sell the fact. What moves a price is the gap between what happened and what was already priced in.",
      },
      { type: "h2", text: "Why prices wiggle when nothing is happening" },
      {
        type: "p",
        text: "Most short-term movement has no story behind it. It is the ordinary flow of orders: a fund rebalancing, a company hedging, traders taking profit. On timeframes of seconds and minutes this noise dominates, which is why very short-term direction is so hard to predict.",
      },
      { type: "h2", text: "Synthetic indices are different" },
      {
        type: "p",
        text: "A synthetic index, such as Deriv's volatility indices, has no buyers and sellers setting its price. The price is produced by a random number generator with a chosen level of volatility. It goes up and down because it is built to, and no news, order flow or pattern explains or predicts the next move.",
      },
      { type: "h2", text: "What this means for a trader" },
      {
        type: "list",
        items: [
          "You do not need to explain every move. Most have no useful explanation.",
          "Know which drivers matter for your market, and when they are scheduled.",
          "Size trades for the moves that do happen, not for the ones you expect.",
        ],
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Who decides the price of a market?",
        a: "Nobody decides it. It is the most recent price at which a buyer and a seller traded, and it changes as their orders change.",
      },
      {
        q: "Why do prices move so fast after news?",
        a: "Because many traders react at once while those providing prices step back. Fewer offers and more urgent orders mean each trade moves the price further.",
      },
      {
        q: "Can anyone predict where the price goes next?",
        a: "Not reliably over short periods. Skilled traders look for situations where the odds or the payoff are in their favour, and they still lose a large share of their trades.",
      },
    ],
    related: ["how-economic-news-affects-trading", "how-volatility-affects-trading"],
  },

  {
    slug: "how-economic-news-affects-trading",
    title: "How does economic news affect trading markets?",
    description:
      "Economic news moves markets when it differs from the forecast. The releases that matter most, what happens around them, and how to handle them.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Economic news moves markets when the number released differs from what traders expected. Interest rate decisions, inflation and employment reports matter most. Around a major release, prices can jump within seconds, spreads widen and orders fill at worse prices than requested. Beginners are usually better off staying out for a few minutes either side.",
    body: [
      { type: "h2", text: "The releases that move markets most" },
      {
        type: "table",
        head: ["Release", "What it measures", "Why traders care"],
        rows: [
          ["Central bank rate decision", "The cost of borrowing set by the central bank", "The strongest single driver of a currency"],
          ["Inflation (CPI)", "How fast consumer prices are rising", "Shapes what the central bank does next"],
          ["Employment report", "Jobs created and the unemployment rate", "A broad reading of economic health"],
          ["GDP", "Total economic output", "Confirms growth or contraction"],
          ["Purchasing managers' surveys", "Business activity, month by month", "An early signal before the official data"],
          ["Central bank speeches", "Hints about future policy", "Can change expectations without any data"],
        ],
      },
      { type: "h2", text: "Actual, forecast and previous" },
      {
        type: "p",
        text: "An economic calendar lists three numbers for each release: the previous figure, the forecast, and then the actual figure when it arrives. The market has already traded on the forecast. The reaction comes from the surprise: actual minus forecast. A strong number that matches the forecast can produce no move at all.",
      },
      { type: "h2", text: "What happens in the minutes around a release" },
      {
        type: "list",
        items: [
          "Before: trading goes quiet and spreads start to widen as firms that quote prices reduce their risk.",
          "At the release: the price can jump with no trades in between, so a stop order fills beyond its level. This is slippage.",
          "After: a sharp first move, often followed by a partial or full reversal as the details are read.",
          "Later: if the news truly changed expectations, a steadier trend can follow for hours or days.",
        ],
      },
      { type: "h2", text: "Three ways to handle news" },
      {
        type: "steps",
        items: [
          { title: "Stay out", text: "Close or avoid short-term trades a few minutes before and after a major release. This is the right default while you are learning." },
          { title: "Trade the aftermath", text: "Wait for the first reaction to settle, then trade the direction that holds. You give up the first move in exchange for a clearer picture." },
          { title: "Trade the release", text: "Only with experience, small size, and acceptance that the fill may be far from the price you saw." },
        ],
      },
      { type: "h2", text: "Check the calendar before every session" },
      {
        type: "p",
        text: "Look at an economic calendar at the start of the day and note the high-impact releases for the currencies or markets you trade. A strategy tested in quiet conditions can fail in the two minutes around a release, and a bot does not know the release is coming unless you stop it.",
      },
      { type: "h2", text: "Markets that news does not touch" },
      {
        type: "p",
        text: "Synthetic indices are generated by an algorithm and do not react to any economic release. That is one reason people run bots on them at any hour. It removes news risk, and leaves the randomness of the index itself.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Which news moves the forex market the most?",
        a: "Central bank rate decisions, inflation reports and major employment reports, especially from the United States, because the dollar is on one side of most currency trading.",
      },
      {
        q: "Should beginners trade during news?",
        a: "No. Prices jump, spreads widen and stops slip. Learn how your market behaves around releases by watching, not by trading.",
      },
      {
        q: "Why did the price fall after good news?",
        a: "Because the good news was already expected and priced in, or because the details were weaker than the headline. The move reflects the surprise, not the news itself.",
      },
      {
        q: "What is slippage?",
        a: "The difference between the price you asked for and the price you got. It is largest when the market is moving fast or is thinly traded.",
      },
    ],
    related: ["why-market-prices-go-up-and-down", "best-times-of-day-to-trade"],
  },

  {
    slug: "what-is-a-breakout-in-trading",
    title: "What is a breakout in trading?",
    description:
      "A breakout is a price move beyond a level that held it before. How to spot one, tell a real breakout from a false one, and manage the trade.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "A breakout is when the price moves beyond a level that had contained it, such as a resistance level, a support level or the edge of a range. Traders treat it as a sign that a new move may be starting. Many breakouts fail and reverse, so most methods wait for a candle to close beyond the level before acting.",
    body: [
      { type: "h2", text: "What breaks, and why it matters" },
      {
        type: "p",
        text: "A level holds because orders are resting there. When the price pushes through, those orders have been absorbed, traders who bet on the level holding are forced to exit, and their exits add fuel in the direction of the break. That is why a genuine breakout can run quickly.",
      },
      { type: "h2", text: "Common breakout setups" },
      {
        type: "table",
        head: ["Setup", "What it looks like"],
        rows: [
          ["Range breakout", "The price leaves a sideways band it has moved inside for some time"],
          ["Resistance or support break", "The price passes a level it has reversed from at least twice"],
          ["Triangle or flag", "The swings narrow into a point, then the price leaves on one side"],
          ["Session high or low", "The price passes the previous day's or session's extreme"],
        ],
      },
      { type: "h2", text: "Real or false?" },
      {
        type: "list",
        items: [
          "A close beyond the level counts for more than a wick through it.",
          "A long quiet period before the break is a better sign than a break in the middle of a choppy market.",
          "A break in the direction of the larger trend succeeds more often than one against it.",
          "Rising volume or widening candles on the break show participation, where volume data exists.",
          "A break during thin hours, or seconds before major news, is the least trustworthy.",
        ],
      },
      { type: "h2", text: "Three ways to enter" },
      {
        type: "table",
        head: ["Entry", "How", "Trade-off"],
        rows: [
          ["On the break", "Enter as the price passes the level", "Best price if it works, most false signals"],
          ["On the close", "Wait for a candle to close beyond the level", "Fewer false signals, a worse entry price"],
          ["On the retest", "Wait for the price to return to the level and hold", "Best risk-to-reward, but the retest may never come"],
        ],
      },
      { type: "h2", text: "Managing the trade" },
      {
        type: "p",
        text: "A breakout trade is wrong when the price returns inside the range. Put the exit there, just back inside the level, and size the trade so that being wrong costs a small, fixed amount. Expect to be wrong often: breakout trading typically wins less than half the time and relies on the winners being several times the size of the losers.",
      },
      { type: "h2", text: "A caution about random markets" },
      {
        type: "p",
        text: "On a synthetic index there are no resting orders and no trapped traders, so the mechanism that powers a breakout does not exist. A move through a line on such a chart is as likely to continue as to reverse.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is a false breakout?",
        a: "A move beyond a level that quickly reverses back inside. It is also called a fakeout. False breakouts are common, which is why many traders wait for a close or a retest.",
      },
      {
        q: "How do you confirm a breakout?",
        a: "By a candle closing beyond the level, ideally with wider range or higher volume than recent candles, and in the direction of the larger trend. No confirmation is certain.",
      },
      {
        q: "What is the best timeframe for breakout trading?",
        a: "Higher timeframes give fewer and more reliable breakouts. Mark the level on a higher timeframe and use a lower one only to time the entry.",
      },
    ],
    related: ["support-and-resistance-levels", "trending-vs-sideways-markets"],
  },

  {
    slug: "how-moving-averages-work",
    title: "How do moving averages work in trading?",
    description:
      "A moving average is the average price over the last N periods, redrawn each period. SMA and EMA compared, common settings, and what they cannot do.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "A moving average is the average closing price over a set number of recent periods, recalculated as each new period closes. It smooths the price into a line that shows the trend. A rising line with the price above it suggests an uptrend. Moving averages lag: they describe what has happened and do not predict what comes next.",
    body: [
      { type: "h2", text: "How it is calculated" },
      {
        type: "p",
        text: "A 10-period simple moving average adds the last ten closing prices and divides by ten. When a new candle closes, the oldest price drops out and the newest comes in. The line moves because the window moves.",
      },
      { type: "h2", text: "Simple and exponential" },
      {
        type: "table",
        head: ["", "Simple (SMA)", "Exponential (EMA)"],
        rows: [
          ["Weighting", "Every period counts equally", "Recent periods count more"],
          ["Reaction to new prices", "Slower", "Faster"],
          ["Smoothness", "Smoother, fewer false turns", "More responsive, more false turns"],
          ["Often used for", "Long-term trend, such as 200 periods", "Short-term trend, such as 9 or 21 periods"],
        ],
      },
      { type: "h2", text: "Common settings" },
      {
        type: "list",
        items: [
          "9 to 21 periods: short-term direction.",
          "50 periods: the medium-term trend.",
          "200 periods: the long-term trend. On a daily chart, many investors treat it as the line between a bull and a bear market.",
        ],
      },
      {
        type: "p",
        text: "No setting is correct. The popular ones are useful mainly because many people watch them.",
      },
      { type: "h2", text: "Four ways traders use them" },
      {
        type: "steps",
        items: [
          { title: "Trend filter", text: "Take only buy trades while the price is above a long average, and only sell trades below it." },
          { title: "Crossover", text: "A fast average crossing above a slow one is read as a buy signal, and below as a sell signal. The 50 crossing the 200 is known as the golden cross and the death cross." },
          { title: "Dynamic support and resistance", text: "In a steady trend the price often pulls back to an average and continues." },
          { title: "Slope", text: "A flat average says there is no trend, whatever the price is doing around it." },
        ],
      },
      { type: "h2", text: "Where they fail" },
      {
        type: "p",
        text: "In a sideways market the price crosses the average again and again, and a crossover system loses on each one. This is called a whipsaw. Moving averages also turn late, so a crossover system gives back part of every trend at the start and at the end. They are trend tools and should be switched off, or ignored, when there is no trend.",
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "dTrader's chart can draw moving averages, and dBot can use a simple or exponential moving average as an indicator that decides which side a bot takes. An indicator needs enough history to produce a value, so a bot waits until it has one.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Which is better, SMA or EMA?",
        a: "Neither. The EMA reacts faster and gives more false signals. The SMA is smoother and later. Choose by whether you fear being late or being wrong more.",
      },
      {
        q: "What is the best moving average period?",
        a: "There is no best one. Shorter periods follow the price closely; longer ones show the bigger trend. 20, 50 and 200 are the most watched.",
      },
      {
        q: "Do moving average crossovers work?",
        a: "They catch large trends and lose repeatedly in sideways markets. The result depends on how much the market trends, and they work better as a filter than as a complete system.",
      },
      {
        q: "Do moving averages work on synthetic indices?",
        a: "They draw correctly, but because each move on a synthetic index is random, the line carries no information about the next move.",
      },
    ],
    related: ["what-is-the-rsi-indicator", "trending-vs-sideways-markets"],
  },

  {
    slug: "what-is-the-rsi-indicator",
    title: "What is the RSI indicator and how is it used?",
    description:
      "RSI measures the speed of recent price moves on a scale of 0 to 100. What 70 and 30 mean, how it is calculated, and the mistakes people make with it.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "The Relative Strength Index, or RSI, is a momentum indicator that compares recent gains with recent losses on a scale from 0 to 100, usually over 14 periods. Readings above 70 are called overbought and below 30 oversold. Those labels describe how strong the recent move has been. They are not instructions to sell or buy.",
    body: [
      { type: "h2", text: "How it is calculated" },
      {
        type: "p",
        text: "RSI takes the average gain and the average loss over the last 14 periods and divides one by the other to get the relative strength, RS. Then RSI equals 100 minus 100 divided by 1 plus RS. If gains and losses have been equal, RS is 1 and RSI is 50. If every period was a gain, RSI approaches 100.",
      },
      { type: "h2", text: "Reading the scale" },
      {
        type: "table",
        head: ["Reading", "Name", "What it tells you"],
        rows: [
          ["Above 70", "Overbought", "Recent gains have been much larger than losses"],
          ["Around 50", "Neutral", "Gains and losses are balanced"],
          ["Below 30", "Oversold", "Recent losses have been much larger than gains"],
        ],
      },
      { type: "h2", text: "The mistake nearly everyone makes" },
      {
        type: "p",
        text: "Overbought does not mean about to fall. In a strong uptrend RSI can sit above 70 for a long time while the price keeps climbing, and selling every reading above 70 means selling into the strongest moves on the chart. The 70 and 30 lines work as reversal hints in a sideways market and as signs of strength in a trending one. Decide which market you are in first.",
      },
      { type: "h2", text: "Three ways it is used" },
      {
        type: "steps",
        items: [
          { title: "Range trading", text: "In a sideways market, look for turns after RSI goes below 30 or above 70 and comes back." },
          { title: "Trend confirmation", text: "In an uptrend RSI tends to stay between about 40 and 80. A pullback that holds above 40 suggests the trend is intact." },
          { title: "Divergence", text: "The price makes a new high and RSI does not. Momentum is fading, which is a warning, not a timing signal." },
        ],
      },
      { type: "h2", text: "Settings" },
      {
        type: "p",
        text: "Fourteen periods is the standard. A shorter period, such as 7, swings to the extremes more often and gives more signals, most of them noise. A longer one, such as 21, is smoother and rarely reaches 70 or 30. Some traders move the lines to 80 and 20 in strong trends.",
      },
      { type: "h2", text: "Limits" },
      {
        type: "list",
        items: [
          "RSI is built from past prices only. It cannot know anything the chart does not.",
          "It works on its own least well. Combine it with trend and levels.",
          "On a synthetic index it calculates correctly and predicts nothing, because the next move is random.",
        ],
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "RSI is available on the dTrader chart and as an indicator in dBot. A bot that uses it waits until enough candles have formed to calculate a value.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is a good RSI setting?",
        a: "The 14-period default suits most uses. Change it only with a reason, and test the change over many trades.",
      },
      {
        q: "Should I buy when RSI is below 30?",
        a: "Not automatically. In a downtrend RSI can stay below 30 while the price keeps falling. An oversold reading is more useful in a sideways market, and with some sign that the fall has stopped.",
      },
      {
        q: "What is RSI divergence?",
        a: "When the price makes a higher high but RSI makes a lower high, or the reverse at lows. It shows momentum weakening and can persist for a long time before the price turns.",
      },
      {
        q: "Is RSI a leading or a lagging indicator?",
        a: "It is calculated from past prices, so it cannot lead them. It is called leading only because it sometimes turns before the price does.",
      },
    ],
    related: ["how-moving-averages-work", "trending-vs-sideways-markets"],
  },

  {
    slug: "what-is-spread-in-trading",
    title: "What is spread in trading?",
    description:
      "The spread is the gap between the buy and sell price, and the cost you pay on every trade. How to calculate it, why it widens, and how to keep it low.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "The spread is the difference between the price you can buy at, the ask, and the price you can sell at, the bid. It is a cost paid on every trade: a position opens at a small loss equal to the spread. Spreads are narrowest on heavily traded markets in busy hours and widen around news and in quiet periods.",
    body: [
      { type: "h2", text: "Bid, ask and spread" },
      {
        type: "p",
        text: "Every market quotes two prices. You buy at the higher one, the ask, and sell at the lower one, the bid. If a currency pair is quoted at 1.1000 bid and 1.1002 ask, the spread is 0.0002, or 2 pips. Buy and sell again immediately and you lose those 2 pips.",
      },
      { type: "h2", text: "What the spread costs in money" },
      {
        type: "table",
        head: ["Position size", "Units", "Cost of a 2-pip spread on a dollar-quoted pair"],
        rows: [
          ["Micro lot", "1,000", "About 0.20"],
          ["Mini lot", "10,000", "About 2"],
          ["Standard lot", "100,000", "About 20"],
        ],
      },
      {
        type: "p",
        text: "The cost is paid on every trade, win or lose. A trader making ten trades a day with a 2-pip spread starts each day 20 pips behind.",
      },
      { type: "h2", text: "Why spreads change" },
      {
        type: "list",
        items: [
          "Liquidity: popular markets with many participants have narrow spreads.",
          "Time of day: spreads narrow when major sessions are open and widen in the quiet hours between them.",
          "News: spreads can widen many times over in the seconds around a major release.",
          "Volatility: when prices move fast, those quoting them protect themselves with a wider gap.",
        ],
      },
      { type: "h2", text: "Fixed and variable spreads" },
      {
        type: "p",
        text: "A variable spread moves with the market and is usually lower in calm conditions. A fixed spread stays the same in normal conditions and is usually a little higher. Some accounts quote a very narrow spread and charge a separate commission per trade. Compare the total cost, spread plus commission, for the size you trade.",
      },
      { type: "h2", text: "Why it matters most for short-term trading" },
      {
        type: "p",
        text: "A 2-pip spread is 2% of a 100-pip target and 20% of a 10-pip target. The shorter the trade, the larger the share of its profit the spread takes. Many scalping strategies that look profitable on a chart are not once the spread is subtracted from every trade.",
      },
      { type: "h2", text: "Contracts without a visible spread" },
      {
        type: "p",
        text: "Fixed-payout options do not show a bid and ask. The cost is built into the payout instead: a contract on an even chance that pays less than double the stake carries its cost in that difference. Read the payout quoted for a contract the way you would read a spread.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is a lower spread always better?",
        a: "Lower total cost is better. A narrow spread with a high commission can cost more than a wider spread with none. Add them up for your trade size.",
      },
      {
        q: "Why did my trade open at a loss?",
        a: "Because you bought at the ask and the position is valued at the bid. The opening loss is the spread.",
      },
      {
        q: "Why did the spread suddenly widen?",
        a: "Usually news, a quiet session, or a market reopening. Spreads return to normal when liquidity does.",
      },
      {
        q: "What is a pip?",
        a: "The standard unit of movement for a currency pair, usually the fourth decimal place, or the second for pairs quoted against the yen.",
      },
    ],
    related: ["market-orders-vs-limit-orders", "best-times-of-day-to-trade"],
  },

  {
    slug: "how-volatility-affects-trading",
    title: "How does volatility affect trading?",
    description:
      "Volatility is how far and how fast a price moves. It sets how wide stops must be, how large a position can be, and how quickly a bot wins or loses.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Volatility is how much a price moves over a period. High volatility means larger and faster moves, which brings bigger potential gains and losses, wider stops and smaller position sizes. Low volatility means smaller moves and tighter ranges. Volatility does not tell you the direction, only the size, and risk should be adjusted to it.",
    body: [
      { type: "h2", text: "Measuring it" },
      {
        type: "table",
        head: ["Measure", "What it is", "How it is used"],
        rows: [
          ["Average True Range (ATR)", "The average size of a candle over recent periods", "Setting stop distance and position size"],
          ["Bollinger Bands", "Bands drawn a set number of standard deviations around a moving average", "Wide bands show high volatility, narrow bands low"],
          ["Historical volatility", "The standard deviation of returns, usually given per year", "Comparing one market with another"],
        ],
      },
      { type: "h2", text: "What changes when volatility rises" },
      {
        type: "list",
        items: [
          "Stops need to be further away, or ordinary movement will hit them.",
          "Position size must come down to keep the money at risk the same.",
          "Targets are reached sooner, and so are stop losses.",
          "Spreads widen and fills slip more.",
          "Emotions run higher, and so do mistakes.",
        ],
      },
      { type: "h2", text: "Keep the risk constant, not the position" },
      {
        type: "p",
        text: "If a market's average candle doubles in size, a stop that was sensible yesterday is now inside the noise. Doubling the stop distance and halving the position keeps the same amount of money at risk. Traders who keep the position fixed are taking twice the risk without having decided to.",
      },
      { type: "h2", text: "Volatility clusters" },
      {
        type: "p",
        text: "In real markets, quiet periods tend to follow quiet periods and wild ones follow wild ones. A long, narrow range often ends with a sharp expansion. This is one of the more dependable features of market behaviour, and the reason a strategy tuned in a calm month can fail in a stormy one.",
      },
      { type: "h2", text: "Volatility indices on Deriv" },
      {
        type: "p",
        text: "Deriv's volatility indices are synthetic markets built to have a constant level of volatility, which is the number in the name. A higher number means larger moves per tick. Because the level is fixed by design, it does not cluster or react to news the way a real market does.",
      },
      { type: "h2", text: "What it means for a bot" },
      {
        type: "p",
        text: "On fixed-payout contracts the stake is the risk whatever the volatility, but volatility still changes the outcome of barrier trades: on a more volatile index a price is more likely to touch a barrier or leave an accumulator's band. When you move a bot from one index to another, treat it as a new strategy and test it again.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is high volatility good or bad for trading?",
        a: "It is neither. It increases both the opportunity and the risk. It is good for a trader who reduces size to match and bad for one who does not.",
      },
      {
        q: "What is the best indicator for volatility?",
        a: "ATR is the most practical because it gives a figure in price units that you can use directly for stops and sizing.",
      },
      {
        q: "Which Deriv volatility index is best for beginners?",
        a: "A lower-numbered index moves less per tick, which makes it calmer to learn on. No index is easier to predict than another: all of them are random.",
      },
    ],
    related: ["forex-vs-synthetic-indices", "how-to-calculate-position-size"],
  },

  {
    slug: "trending-vs-sideways-markets",
    title: "How to identify trending and sideways markets",
    description:
      "A trend makes higher highs and higher lows, or lower ones. A sideways market stays between two levels. Four checks to tell which one you are in.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "A trending market makes a series of higher highs and higher lows, or lower highs and lower lows. A sideways market moves between a ceiling and a floor without progress. To tell them apart, look at the swing points, the slope of a moving average and where the price sits relative to it. The answer depends on the timeframe.",
    body: [
      { type: "h2", text: "The three states" },
      {
        type: "table",
        head: ["State", "Swing highs", "Swing lows", "Moving average"],
        rows: [
          ["Uptrend", "Rising", "Rising", "Sloping up, price mostly above"],
          ["Downtrend", "Falling", "Falling", "Sloping down, price mostly below"],
          ["Sideways", "Roughly level", "Roughly level", "Flat, price crossing back and forth"],
        ],
      },
      { type: "h2", text: "Four checks" },
      {
        type: "steps",
        items: [
          { title: "Mark the last four swing points", text: "Two highs and two lows. If both pairs step in the same direction, it is a trend. If they overlap, it is a range." },
          { title: "Look at a 50-period moving average", text: "A clear slope with the price on one side is a trend. A flat line the price keeps crossing is a range." },
          { title: "Zoom out one timeframe", text: "A trend on the five-minute chart may be a pullback inside a range on the hourly chart." },
          { title: "Check the candle overlap", text: "In a trend, candles make progress. In a range, each one overlaps the last." },
        ],
      },
      { type: "h2", text: "Why it matters" },
      {
        type: "p",
        text: "Strategies are built for one state and lose in the other. Trend-following methods such as moving average crossovers and breakouts make money in trends and are whipsawed in ranges. Range methods such as buying support and selling resistance work until the range breaks. The most common reason a tested strategy stops working is that the market changed state.",
      },
      {
        type: "table",
        head: ["Tool", "In a trend", "In a range"],
        rows: [
          ["Moving average crossover", "Works", "Loses repeatedly"],
          ["RSI above 70 or below 30", "A sign of strength, not a reversal", "A useful reversal hint"],
          ["Breakout entries", "Follow through", "Mostly fail"],
          ["Buying support, selling resistance", "Dangerous against the trend", "The core method"],
        ],
      },
      { type: "h2", text: "The transition is where money is lost" },
      {
        type: "p",
        text: "Markets spend more time ranging than trending, and the change from one to the other is only obvious afterwards. Accept that you will be late. Reduce size when the picture is unclear, and step aside when your method's conditions are not present.",
      },
      { type: "h2", text: "On synthetic indices" },
      {
        type: "p",
        text: "A random series produces stretches that look exactly like trends and ranges. On a volatility index they are produced by chance and say nothing about what follows. Indices such as Deriv's Boom and Crash or Step families have built-in behaviours of their own; read Deriv's description of an index before you interpret its chart.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "How do I know if a market is trending?",
        a: "The swing highs and swing lows both step in the same direction, and a medium-length moving average slopes that way with the price mostly on one side of it.",
      },
      {
        q: "What indicator shows a sideways market?",
        a: "A flat moving average and narrow Bollinger Bands. The ADX indicator is designed for this: low readings indicate no trend.",
      },
      {
        q: "Is it better to trade trends or ranges?",
        a: "Trends offer larger moves and are simpler to trade with. Ranges are more common. Most traders do better choosing one and standing aside in the other.",
      },
    ],
    related: ["how-moving-averages-work", "what-is-a-breakout-in-trading"],
  },

  {
    slug: "best-times-of-day-to-trade",
    title: "What are the best times of day to trade?",
    description:
      "The best time to trade is when your market is most active: for forex, the London and New York overlap. Session hours in UTC and what changes in each.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "The best times to trade are when your market is most active, because spreads are narrowest and moves are cleanest. For forex that is the overlap of the London and New York sessions, roughly 12:00 to 16:00 UTC. Stock indices are busiest in the first and last hour of their own exchange. Synthetic indices behave the same at every hour.",
    body: [
      { type: "h2", text: "The forex day" },
      {
        type: "table",
        head: ["Session", "Approximate hours (UTC)", "Character"],
        rows: [
          ["Sydney", "21:00 to 06:00", "Quiet; wider spreads"],
          ["Tokyo", "00:00 to 09:00", "Active in yen and Australian dollar pairs"],
          ["London", "07:00 to 16:00", "The largest share of daily volume"],
          ["New York", "12:00 to 21:00", "Active, with most major US data"],
          ["London and New York overlap", "12:00 to 16:00", "The busiest four hours of the day"],
        ],
      },
      {
        type: "p",
        text: "These hours shift by an hour when the United Kingdom, the United States and Australia change their clocks, and they do so on different dates. Convert them to your own time zone and check again in March and in October or November.",
      },
      { type: "h2", text: "Why busy hours are better" },
      {
        type: "list",
        items: [
          "Spreads are at their narrowest, so each trade costs less.",
          "Orders fill closer to the price you asked for.",
          "Moves are more likely to follow through than to fade.",
        ],
      },
      { type: "h2", text: "Times to be careful" },
      {
        type: "list",
        items: [
          "The minutes around major economic releases.",
          "The gap between the New York close and the Tokyo open, when spreads are widest.",
          "Friday evening, when positions are closed before the weekend, and the Sunday open, which can gap.",
          "Public holidays in the major financial centres.",
        ],
      },
      { type: "h2", text: "Other markets" },
      {
        type: "p",
        text: "Stock indices and shares are most active in the first hour after their exchange opens and the last hour before it closes. Gold and oil are busiest during the London and New York sessions. Cryptocurrencies trade every day, with activity following the same business hours more loosely.",
      },
      { type: "h2", text: "Synthetic indices: the clock does not matter" },
      {
        type: "p",
        text: "Synthetic indices run at all hours with the same statistical behaviour, so there is no best time of day for the market. There is still a best time for you. A bot can run at any hour because it does not get tired, but the settings should be chosen when you are alert, not at three in the morning after a losing session.",
      },
      { type: "h2", text: "The best time is the one you can keep" },
      {
        type: "p",
        text: "A consistent two hours a day in the same session teaches you how that session behaves. Trading at random hours, whenever you happen to be free, means meeting a different market each time. Choose a window that suits your life and your market, and stay with it.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is the best time to trade forex?",
        a: "The London and New York overlap, roughly 12:00 to 16:00 UTC, when the two largest sessions are open together.",
      },
      {
        q: "What is the worst time to trade?",
        a: "The quiet hours after New York closes, the minutes around major news, and holiday sessions. Spreads are wide and moves are erratic.",
      },
      {
        q: "Is there a best time to trade synthetic indices?",
        a: "No. They are generated the same way at every hour of every day, so no time is more favourable than another.",
      },
      {
        q: "Can I trade at the weekend?",
        a: "Forex and most traditional markets are closed. Cryptocurrencies and synthetic indices trade through the weekend.",
      },
    ],
    related: ["how-economic-news-affects-trading", "what-is-spread-in-trading"],
  },

  {
    slug: "market-orders-vs-limit-orders",
    title: "Market orders vs limit orders: what is the difference?",
    description:
      "A market order fills now at the best available price. A limit order fills only at your price or better. When to use each, plus stop orders explained.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "A market order buys or sells immediately at the best price available, so it is certain to fill but not at a certain price. A limit order names the price you will accept and fills only at that price or better, so the price is certain but the fill is not. Use market orders for urgency and limit orders for control.",
    body: [
      { type: "h2", text: "Side by side" },
      {
        type: "table",
        head: ["", "Market order", "Limit order"],
        rows: [
          ["When it fills", "Immediately", "Only if the price reaches your level"],
          ["Price you get", "The best available, which may differ from the quote", "Your price or better"],
          ["Certain to fill?", "Yes, in a normal market", "No"],
          ["Main risk", "Slippage", "Missing the trade"],
          ["Best for", "Getting in or out now", "Entering at a planned level"],
        ],
      },
      { type: "h2", text: "Stop orders" },
      {
        type: "p",
        text: "A stop order waits until the price reaches a level and then becomes a market order. A stop loss is a stop order that closes a losing position. A buy stop above the price or a sell stop below it is used to enter on a breakout. Because it turns into a market order, a stop can fill beyond its level in a fast market.",
      },
      {
        type: "table",
        head: ["Order", "Placed", "Typical use"],
        rows: [
          ["Buy limit", "Below the current price", "Buying a pullback"],
          ["Sell limit", "Above the current price", "Selling a rally, or taking profit on a long position"],
          ["Buy stop", "Above the current price", "Entering a breakout upwards"],
          ["Sell stop", "Below the current price", "A stop loss on a long position, or a breakout downwards"],
        ],
      },
      { type: "h2", text: "Slippage" },
      {
        type: "p",
        text: "Slippage is the gap between the price you expected and the price you got. Market and stop orders are exposed to it; limit orders are not. It is small in liquid markets during busy hours and can be large around news, at the weekend open, and in thin markets.",
      },
      { type: "h2", text: "Which to use when" },
      {
        type: "list",
        items: [
          "Entering at a level you planned in advance: limit order.",
          "Entering on a breakout: stop order, accepting some slippage.",
          "Exiting a losing trade: a stop loss placed when you enter, every time.",
          "Exiting in an emergency: market order. Getting out matters more than the price.",
          "Taking profit at a target: limit order.",
        ],
      },
      { type: "h2", text: "Options contracts work differently" },
      {
        type: "p",
        text: "When you buy a fixed-payout option, there is no order book to rest an order in. The broker quotes a price for the contract and you accept it or not. In FXNOD's dTrader the order panel shows the payout Deriv quotes for your exact settings before you press Buy. On Multipliers you can attach a stop loss and a take profit, which close the position when the loss or profit reaches the amount you set.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is a market order or a limit order better?",
        a: "Neither. A market order guarantees the fill and a limit order guarantees the price. Use the one that protects what matters more for that trade.",
      },
      {
        q: "Can a limit order fail to fill?",
        a: "Yes. If the price never reaches your level, or touches it without enough volume, the order stays unfilled and you miss the move.",
      },
      {
        q: "Is a stop loss guaranteed?",
        a: "A normal stop loss is not. It becomes a market order at your level and can fill at a worse price in a gap. Some brokers offer guaranteed stops for a fee.",
      },
      {
        q: "What is a stop-limit order?",
        a: "An order that becomes a limit order, not a market order, when the stop level is reached. It controls the price but may not fill at all in a fast move.",
      },
    ],
    related: ["what-is-spread-in-trading", "what-is-a-breakout-in-trading"],
  },
];
