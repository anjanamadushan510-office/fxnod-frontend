/**
 * Charts and indicators: what each tool measures, its formula, how it is
 * read, and where it fails. Same shape and same rules as the tool guides in
 * `guides.ts`.
 *
 * Two things are said in every one of these on purpose. An indicator is
 * arithmetic on past prices and cannot know more than the chart does. And on
 * a synthetic index, where each move is random, the tools draw correctly and
 * forecast nothing.
 */
import { RISK_NOTE, type Guide } from "./guides";

const TAG = "Charts and indicators";
const DATE = "2026-10-09";

export const CHART_GUIDES: Guide[] = [
  {
    slug: "macd-indicator-explained",
    title: "MACD indicator explained: lines, histogram and signals",
    description:
      "MACD is the gap between a 12 and a 26-period EMA, with a 9-period signal line. How to read the lines and histogram, and where MACD misleads.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "MACD, the Moving Average Convergence Divergence, is the difference between a 12-period and a 26-period exponential moving average. A 9-period average of that difference is the signal line, and the histogram shows the gap between the two. MACD above zero means the faster average is above the slower one: momentum is up. It lags the price.",
    body: [
      { type: "h2", text: "The three parts" },
      {
        type: "table",
        head: ["Part", "Formula", "Shows"],
        rows: [
          ["MACD line", "12-period EMA minus 26-period EMA", "Direction and strength of momentum"],
          ["Signal line", "9-period EMA of the MACD line", "A smoothed MACD to compare against"],
          ["Histogram", "MACD line minus signal line", "Whether momentum is building or fading"],
        ],
      },
      { type: "h2", text: "The signals people use" },
      {
        type: "list",
        items: [
          "Signal-line cross: MACD crossing above the signal line is read as bullish, below as bearish.",
          "Zero-line cross: MACD crossing above zero means the 12 EMA has crossed above the 26 EMA.",
          "Histogram: bars shrinking towards zero show a move losing strength before the lines cross.",
          "Divergence: the price makes a new high and MACD does not.",
        ],
      },
      { type: "h2", text: "Settings" },
      {
        type: "p",
        text: "The standard is 12, 26 and 9. Shorter settings react faster and give more false signals. There are no best settings: tuning them until the past looks perfect is curve fitting.",
      },
      { type: "h2", text: "Where it fails" },
      {
        type: "list",
        items: [
          "Sideways markets: the lines cross back and forth around zero and every cross loses.",
          "Lag: it is built from averages of averages, so it confirms a move after part of it has gone.",
          "Divergence can persist through a long trend before anything turns.",
          "Its values are in price units, so they cannot be compared between markets.",
        ],
      },
      { type: "h2", text: "Using it well" },
      {
        type: "p",
        text: "Treat MACD as a description of momentum, combined with trend and levels. Decide whether the market is trending first: MACD crossovers suit trends and should be ignored in a range. On a synthetic index the lines calculate correctly and say nothing about the next move.",
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "MACD is one of the indicators a dBot bot can use to decide which side to take. An indicator needs enough candles before it has a value, so the bot waits for one.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What does MACD stand for?",
        a: "Moving Average Convergence Divergence: it measures how two moving averages come together and move apart.",
      },
      {
        q: "What are the best MACD settings?",
        a: "The default 12, 26, 9 is the most widely used. Other settings trade speed against false signals; none is best.",
      },
      {
        q: "Is MACD a leading indicator?",
        a: "No. It is calculated from past prices and lags them.",
      },
    ],
    related: ["how-moving-averages-work", "divergence-trading-explained"],
  },

  {
    slug: "bollinger-bands-explained",
    title: "Bollinger Bands explained: what the bands really show",
    description:
      "Bollinger Bands are a 20-period average with bands two standard deviations either side. They measure volatility; touching a band is not a signal.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Bollinger Bands are three lines: a 20-period simple moving average, and an upper and lower band set two standard deviations above and below it. The bands widen when the market is volatile and narrow when it is quiet. They show how unusual the current price is compared with recent prices. A touch of a band is not, by itself, a signal.",
    body: [
      { type: "h2", text: "How they are built" },
      {
        type: "table",
        head: ["Line", "Formula"],
        rows: [
          ["Middle band", "20-period simple moving average"],
          ["Upper band", "Middle band plus 2 standard deviations of the last 20 closes"],
          ["Lower band", "Middle band minus 2 standard deviations of the last 20 closes"],
        ],
      },
      { type: "h2", text: "What they tell you" },
      {
        type: "list",
        items: [
          "Width: wide bands mean high recent volatility, narrow bands low.",
          "The squeeze: very narrow bands often come before a larger move, with no hint of its direction.",
          "Position: a close near the upper band is high relative to the last 20 periods.",
          "Walking the band: in a strong trend the price can run along one band for a long time.",
        ],
      },
      { type: "h2", text: "The common mistake" },
      {
        type: "p",
        text: "Selling every touch of the upper band and buying every touch of the lower one works in a range and fails badly in a trend, where the price hugs the band it is supposed to bounce from. Most closes fall inside the bands by construction. That is a description of the bands, not a reason to expect a reversal.",
      },
      { type: "h2", text: "Two ways they are used" },
      {
        type: "table",
        head: ["Approach", "Idea", "Works when"],
        rows: [
          ["Mean reversion", "Fade moves to the outer bands back towards the middle", "The market is ranging"],
          ["Breakout", "After a squeeze, trade the direction the price leaves", "A trend begins"],
        ],
      },
      { type: "h2", text: "With other tools" },
      {
        type: "p",
        text: "Bollinger Bands are often paired with RSI: a touch of the lower band with RSI turning up from a low reading is taken more seriously than either alone. Pairing two tools reduces the number of signals. It does not turn a lagging description into a forecast.",
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "Bollinger Bands can be drawn on dTrader's chart and used as an indicator in dBot. On a synthetic index they show the volatility the index was built to have, and nothing about the next tick.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What are the best Bollinger Bands settings?",
        a: "The standard is 20 periods and 2 standard deviations. Changing them changes how often the bands are touched, not how well they predict.",
      },
      {
        q: "What is a Bollinger Band squeeze?",
        a: "A period when the bands are unusually narrow, showing low volatility. A larger move often follows, in an unknown direction.",
      },
      {
        q: "Should I sell when the price touches the upper band?",
        a: "Not automatically. In an uptrend the price can stay at the upper band for a long time.",
      },
    ],
    related: ["how-volatility-affects-trading", "what-is-the-rsi-indicator"],
  },

  {
    slug: "stochastic-oscillator-explained",
    title: "Stochastic oscillator explained, and how it differs from RSI",
    description:
      "The stochastic oscillator shows where the close sits within the recent high-low range, from 0 to 100. Formula, the 80 and 20 lines, and stochastic vs RSI.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "The stochastic oscillator shows where the latest close sits within the high-low range of recent periods, on a scale from 0 to 100. A reading of 90 means the close is near the top of that range. Above 80 is called overbought and below 20 oversold. It is fast and noisy, and suits ranging markets better than trends.",
    body: [
      { type: "h2", text: "The formula" },
      {
        type: "table",
        head: ["Line", "Formula"],
        rows: [
          ["%K", "100 times (close minus lowest low of 14 periods) divided by (highest high minus lowest low of 14 periods)"],
          ["%D", "3-period simple moving average of %K"],
        ],
      },
      {
        type: "p",
        text: "A slow version smooths %K once more before plotting it, which removes some of the noise.",
      },
      { type: "h2", text: "How it is read" },
      {
        type: "list",
        items: [
          "Above 80: the close is in the top fifth of the recent range.",
          "Below 20: the close is in the bottom fifth.",
          "%K crossing %D: a short-term change in momentum.",
          "Leaving an extreme: many traders act when the line comes back below 80 or above 20, not when it first arrives.",
        ],
      },
      { type: "h2", text: "Stochastic and RSI compared" },
      {
        type: "table",
        head: ["", "Stochastic", "RSI"],
        rows: [
          ["Measures", "Position of the close within the recent range", "Size of recent gains against recent losses"],
          ["Extreme levels", "80 and 20", "70 and 30"],
          ["Speed", "Faster, reaches extremes often", "Slower, steadier"],
          ["Best suited to", "Ranges", "Ranges, and judging trend strength"],
        ],
      },
      { type: "h2", text: "Where it fails" },
      {
        type: "p",
        text: "In a strong trend the stochastic stays above 80 or below 20 for long stretches. Trading every overbought reading against an uptrend is the classic way to lose with it. Establish whether the market is trending before giving an extreme any weight.",
      },
      { type: "h2", text: "Practical use" },
      {
        type: "list",
        items: [
          "Use it for timing inside a range or inside a pullback, in the direction of the larger trend.",
          "Prefer the slow version on short timeframes.",
          "Do not add it to a chart that already has RSI: they answer nearly the same question.",
        ],
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "Stochastic is one of the indicators available to a dBot bot. Like any indicator, on a synthetic index it describes the recent range and predicts nothing.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Which is better, stochastic or RSI?",
        a: "Neither. Stochastic is faster and noisier, RSI steadier. They overlap heavily, so use one.",
      },
      {
        q: "What are the standard stochastic settings?",
        a: "14 periods for %K and 3 for %D, with a further 3-period smoothing in the slow version.",
      },
      {
        q: "What does overbought mean on the stochastic?",
        a: "That the close is near the top of the recent range. It is a statement about position, not a forecast of a fall.",
      },
    ],
    related: ["what-is-the-rsi-indicator", "trending-vs-sideways-markets"],
  },

  {
    slug: "ema-vs-sma",
    title: "EMA vs SMA: which moving average should you use?",
    description:
      "An SMA weights every period equally; an EMA weights recent prices more. How each is calculated, how they behave, and how to choose between them.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "A simple moving average, SMA, gives every period in its window equal weight. An exponential moving average, EMA, gives more weight to recent prices, so it reacts faster to new moves. The EMA turns sooner and gives more false signals. The SMA is smoother and later. Neither is better: choose by whether lateness or noise costs you more.",
    body: [
      { type: "h2", text: "How each is calculated" },
      {
        type: "table",
        head: ["", "SMA", "EMA"],
        rows: [
          ["Formula", "Sum of the last N closes divided by N", "Previous EMA plus a share of the gap between today's close and it"],
          ["Weight on the newest price", "1 divided by N", "2 divided by (N plus 1)"],
          ["For N of 10", "10%", "About 18%"],
          ["Old prices", "Drop out completely after N periods", "Fade but never fully leave"],
        ],
      },
      { type: "h2", text: "How they behave" },
      {
        type: "list",
        items: [
          "After a sharp move, the EMA follows the price more closely than the SMA of the same length.",
          "The SMA can jump when a large old price leaves the window, even if nothing happened today.",
          "In a choppy market the EMA crosses the price more often.",
          "Over long windows, such as 200 periods, the two are close and the difference rarely matters.",
        ],
      },
      { type: "h2", text: "Common choices" },
      {
        type: "table",
        head: ["Use", "Typical choice"],
        rows: [
          ["Short-term direction", "9 or 21 EMA"],
          ["Medium-term trend", "50 SMA or EMA"],
          ["Long-term trend", "200 SMA"],
          ["Inside MACD", "12 and 26 EMA"],
        ],
      },
      { type: "h2", text: "How to choose" },
      {
        type: "p",
        text: "If your method needs early entries and you can tolerate being wrong more often, use an EMA. If you want fewer, more deliberate signals, use an SMA. Then stop comparing. The gain from switching type is small next to the gain from sizing trades properly and trading only when a trend exists.",
      },
      { type: "h2", text: "What neither can do" },
      {
        type: "p",
        text: "Both are averages of past prices. They show the trend that has been, with a delay. In a sideways market both produce a string of losing crossovers, and on a random synthetic index neither carries information about the next move.",
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "dTrader's chart can draw moving averages, and dBot offers both a simple and an exponential moving average as indicators.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is EMA more accurate than SMA?",
        a: "It is more responsive, not more accurate. It reacts sooner and is wrong more often.",
      },
      {
        q: "Which is better for day trading, EMA or SMA?",
        a: "Many day traders prefer EMAs for their speed. The choice matters less than trading with the larger trend.",
      },
      {
        q: "What is the difference between MA and SMA?",
        a: "MA is the general term. SMA and EMA are two ways of calculating it.",
      },
    ],
    related: ["how-moving-averages-work", "macd-indicator-explained"],
  },

  {
    slug: "fibonacci-retracement-explained",
    title: "Fibonacci retracement: levels, how to draw it, and does it work",
    description:
      "Fibonacci retracement marks 23.6%, 38.2%, 50%, 61.8% and 78.6% of a move as possible pullback levels. How to draw it and how much to trust it.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Fibonacci retracement divides a price move into levels at 23.6%, 38.2%, 50%, 61.8% and 78.6%, where traders watch for a pullback to pause. You draw it from the start of a move to its end. The levels have no force of their own. They work to the extent that many traders watch them and that they line up with other levels.",
    body: [
      { type: "h2", text: "The levels" },
      {
        type: "table",
        head: ["Level", "Where it comes from", "Pullback is"],
        rows: [
          ["23.6%", "A ratio in the Fibonacci sequence", "Shallow"],
          ["38.2%", "A ratio in the Fibonacci sequence", "Moderate"],
          ["50%", "Not a Fibonacci ratio; included by convention", "Half the move"],
          ["61.8%", "The golden ratio", "Deep"],
          ["78.6%", "Square root of 0.618", "Very deep"],
        ],
      },
      { type: "h2", text: "How to draw it" },
      {
        type: "steps",
        items: [
          { title: "Find a clear move", text: "A swing low to a swing high in an uptrend, or high to low in a downtrend." },
          { title: "Anchor the tool", text: "From the start of the move to its end." },
          { title: "Read the levels in between", text: "They mark how much of the move a pullback has given back." },
          { title: "Look for agreement", text: "A level that sits on previous support or resistance matters more than one in empty space." },
        ],
      },
      { type: "h2", text: "A worked example" },
      {
        type: "p",
        text: "A market rises from 100 to 150, a move of 50. The 38.2% retracement is 150 minus 19.1, or 130.9. The 50% level is 125. The 61.8% level is 150 minus 30.9, or 119.1. A trader looking to buy the pullback watches those three prices.",
      },
      { type: "h2", text: "Does it work?" },
      {
        type: "p",
        text: "With five levels spread across a move, the price will turn near one of them most of the time by chance alone. That makes the tool look more accurate in hindsight than it is in advance: nobody tells you beforehand which level will hold. Its honest use is as a map of where a reaction is plausible, to be confirmed by what the price does there.",
      },
      { type: "h2", text: "Retracement and extension" },
      {
        type: "p",
        text: "Retracement levels sit inside the move and are used for entries. Extension levels, such as 127.2% and 161.8%, project beyond it and are used as targets. They are drawn from the same anchors.",
      },
      { type: "h2", text: "On synthetic indices" },
      {
        type: "p",
        text: "Fibonacci levels depend on other traders acting at them. A random index has no participants setting the price, so the levels are lines on a chart with no mechanism behind them.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is the most important Fibonacci level?",
        a: "61.8%, the golden ratio, gets the most attention, along with 50%. Neither is reliable alone.",
      },
      {
        q: "Is 50% a Fibonacci number?",
        a: "No. It is included by convention because markets often retrace about half a move.",
      },
      {
        q: "Do I draw Fibonacci from wicks or bodies?",
        a: "Most traders use the wicks, the true high and low. Be consistent whichever you choose.",
      },
    ],
    related: ["support-and-resistance-levels", "pullback-vs-reversal"],
  },

  {
    slug: "atr-indicator-explained",
    title: "ATR indicator explained: measuring volatility for stops and size",
    description:
      "Average True Range is the average size of a candle over 14 periods. How it is calculated and how to use it to set stops and position size.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "The Average True Range, ATR, measures volatility as the average size of a candle over recent periods, usually 14. It says how far a market typically moves in one period, in price units. ATR gives no direction. Its job is practical: setting a stop far enough away to survive normal movement, and sizing the position to match.",
    body: [
      { type: "h2", text: "How it is calculated" },
      {
        type: "p",
        text: "The true range of a period is the largest of three values: the high minus the low, the high minus the previous close, and the previous close minus the low, each taken as a positive number. Using the previous close captures gaps. ATR is the average of the true range over 14 periods, smoothed.",
      },
      { type: "h2", text: "Reading it" },
      {
        type: "list",
        items: [
          "A rising ATR means candles are getting larger.",
          "A falling ATR means the market is quietening.",
          "A high ATR is not bullish or bearish. Volatility rises in falls as well as in rallies.",
          "ATR is in price units, so compare it with the price, or with its own history, not with another market's.",
        ],
      },
      { type: "h2", text: "Setting a stop with ATR" },
      {
        type: "p",
        text: "A stop closer than one ATR is inside the market's ordinary noise and will be hit by movement that means nothing. A common approach places the stop 1.5 to 2 ATR from the entry, beyond a level. If ATR on your chart is 0.0020 and you use 2 ATR, the stop is 0.0040 away.",
      },
      { type: "h2", text: "Sizing the position" },
      {
        type: "table",
        head: ["ATR", "Stop at 2 ATR", "Position size to risk 10 (value 1 per pip per mini lot)"],
        rows: [
          ["10 pips", "20 pips", "0.5 mini lots"],
          ["20 pips", "40 pips", "0.25 mini lots"],
          ["40 pips", "80 pips", "0.125 mini lots"],
        ],
      },
      {
        type: "p",
        text: "When volatility doubles, the stop doubles and the position halves. The money at risk stays the same. That is the main reason to have ATR on a chart.",
      },
      { type: "h2", text: "Other uses" },
      {
        type: "list",
        items: [
          "Trailing stops that follow the price at a multiple of ATR.",
          "Judging whether a target is realistic for the time available.",
          "Filtering: skipping trades when ATR is unusually low or high for your method.",
        ],
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "ATR is one of the indicators available in dBot. On Deriv's volatility indices the volatility is fixed by design, so ATR there mostly confirms what the index's name already tells you.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is a good ATR value?",
        a: "There is none in general. ATR is in price units and only means something relative to the market's price and its own history.",
      },
      {
        q: "What is the best ATR period?",
        a: "14 is standard. Shorter reacts faster to changes in volatility; longer is steadier.",
      },
      {
        q: "Does ATR show trend direction?",
        a: "No. It measures the size of movement only.",
      },
    ],
    related: ["how-volatility-affects-trading", "stop-loss-and-take-profit"],
  },

  {
    slug: "how-to-draw-trendlines",
    title: "How to draw trendlines correctly",
    description:
      "A trendline joins rising lows in an uptrend or falling highs in a downtrend. How to draw one properly, what makes it valid, and the usual mistakes.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "To draw a trendline, connect at least two rising swing lows in an uptrend, or two falling swing highs in a downtrend, and extend the line forward. A third touch confirms it. Draw it where it fits the most turning points without cutting through the body of the price, and treat it as a zone, not an exact line.",
    body: [
      { type: "h2", text: "Step by step" },
      {
        type: "steps",
        items: [
          { title: "Zoom out", text: "Find the trend on a higher timeframe first." },
          { title: "Mark the swing points", text: "The clear lows of an uptrend or highs of a downtrend." },
          { title: "Join two of them", text: "The first and the next significant one." },
          { title: "Extend the line to the right", text: "It now shows where the trend would be tested next." },
          { title: "Wait for a third touch", text: "Two points always make a line. Three suggest the market respects it." },
        ],
      },
      { type: "h2", text: "What makes a trendline worth having" },
      {
        type: "table",
        head: ["Feature", "Stronger", "Weaker"],
        rows: [
          ["Touches", "Three or more", "Two"],
          ["Timeframe", "Daily or higher", "One minute"],
          ["Angle", "Moderate", "Very steep; it will break soon"],
          ["Spacing of touches", "Spread out", "Bunched together"],
        ],
      },
      { type: "h2", text: "Wicks or bodies?" },
      {
        type: "p",
        text: "Either is defensible. Lines drawn through wicks catch the true extremes; lines through closes ignore brief spikes. Choose one and keep to it, and accept that a real trendline is a band a little wider than the line you drew.",
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "list",
        items: [
          "Forcing a line: moving the anchors until it fits what you want to see.",
          "Redrawing after every break, so the line can never be wrong.",
          "Drawing through the middle of candles.",
          "Treating a break as a reversal. A break often leads to a sideways pause or a shallower trend.",
          "Covering the chart in lines until every price is near one.",
        ],
      },
      { type: "h2", text: "Using a trendline" },
      {
        type: "list",
        items: [
          "As a guide to the trend's direction and speed.",
          "As a place to look for a pullback entry, confirmed by the price turning there.",
          "As a warning when it breaks that the trend may be changing.",
          "A channel adds a parallel line through the opposite extremes.",
        ],
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "dTrader's chart has drawing tools for lines. On a synthetic index a trendline describes a path that chance produced, and has no bearing on where the price goes next.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "How many points do you need for a trendline?",
        a: "Two to draw it and a third to confirm it.",
      },
      {
        q: "What does it mean when a trendline breaks?",
        a: "That the trend's pace has changed. It may reverse, pause, or continue at a different angle.",
      },
      {
        q: "Are trendlines subjective?",
        a: "Yes. Two traders will draw them differently, which is why they work best as a guide combined with other evidence.",
      },
    ],
    related: ["support-and-resistance-levels", "trending-vs-sideways-markets"],
  },

  {
    slug: "chart-patterns-explained",
    title: "Chart patterns: the main ones and how reliable they are",
    description:
      "Chart patterns are shapes such as triangles, flags and head and shoulders. What each implies, how targets are measured, and how far to trust them.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Chart patterns are recurring shapes in price, grouped into continuation patterns, such as flags and triangles, and reversal patterns, such as head and shoulders and double tops. Each implies a likely direction and a measured target once it completes. They are tendencies, not rules: many patterns fail, and one is confirmed only by the breakout.",
    body: [
      { type: "h2", text: "Continuation patterns" },
      {
        type: "table",
        head: ["Pattern", "Looks like", "Implies"],
        rows: [
          ["Flag", "A sharp move, then a small tilted channel against it", "The move resumes"],
          ["Pennant", "A sharp move, then a small symmetrical triangle", "The move resumes"],
          ["Ascending triangle", "Flat top, rising lows", "A break upward"],
          ["Descending triangle", "Flat bottom, falling highs", "A break downward"],
          ["Symmetrical triangle", "Lower highs and higher lows", "A break, usually with the prior trend"],
        ],
      },
      { type: "h2", text: "Reversal patterns" },
      {
        type: "table",
        head: ["Pattern", "Looks like", "Implies"],
        rows: [
          ["Head and shoulders", "Three peaks, the middle one highest, on a neckline", "A turn down when the neckline breaks"],
          ["Inverse head and shoulders", "Three troughs, the middle one lowest", "A turn up"],
          ["Double top", "Two peaks at a similar level", "A turn down below the low between them"],
          ["Double bottom", "Two troughs at a similar level", "A turn up above the high between them"],
          ["Rising or falling wedge", "Converging lines sloping the same way", "A break against the slope"],
        ],
      },
      { type: "h2", text: "Measured targets" },
      {
        type: "p",
        text: "Most patterns project a target from their own size: the height of a triangle or a double top, or the length of the move before a flag, added to the breakout point. Treat it as a reasonable first objective, and as a way to check that the reward justifies the risk.",
      },
      { type: "h2", text: "How reliable are they?" },
      {
        type: "list",
        items: [
          "A pattern is only complete when the price breaks out. Before that it is a guess about a shape.",
          "Breakouts often fail and reverse.",
          "Patterns are easy to see in hindsight and ambiguous while forming.",
          "Results improve with context: a continuation pattern in a clear trend, a reversal pattern at a major level.",
        ],
      },
      { type: "h2", text: "Trading one" },
      {
        type: "steps",
        items: [
          { title: "Wait for the break", text: "A close beyond the pattern's boundary." },
          { title: "Place the stop inside the pattern", text: "Where the idea is wrong." },
          { title: "Check the target against the stop", text: "Skip it if the measured move is smaller than the risk." },
        ],
      },
      { type: "h2", text: "On random charts" },
      {
        type: "p",
        text: "Random price series produce every pattern on this page. That is worth remembering on a synthetic index, where a perfect head and shoulders is an accident with no consequence.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is the most reliable chart pattern?",
        a: "None is reliable alone. Patterns that agree with the larger trend and form at significant levels do better than isolated ones.",
      },
      {
        q: "How many chart patterns should I learn?",
        a: "Three or four that you can recognise without forcing. Depth with a few beats a cheat sheet of fifty.",
      },
      {
        q: "Do chart patterns work on all timeframes?",
        a: "They appear on all of them. They carry more weight on higher timeframes, where there is less noise.",
      },
    ],
    related: ["what-is-a-breakout-in-trading", "candlestick-patterns-explained"],
  },

  {
    slug: "candlestick-patterns-explained",
    title: "Candlestick patterns: the ones worth knowing",
    description:
      "The main one, two and three-candle patterns: what each looks like, what it suggests, and why location matters more than the pattern itself.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Candlestick patterns are shapes made by one to three candles that describe a shift between buyers and sellers. The useful ones are few: doji, hammer, shooting star, engulfing, and the morning and evening star. A pattern means something only in context, at a level after a move. The same shape in the middle of a range means little.",
    body: [
      { type: "h2", text: "Single-candle patterns" },
      {
        type: "table",
        head: ["Pattern", "Shape", "Suggests"],
        rows: [
          ["Doji", "Open and close nearly equal", "Indecision"],
          ["Hammer", "Small body on top, long lower wick, after a fall", "Selling rejected"],
          ["Shooting star", "Small body at the bottom, long upper wick, after a rise", "Buying rejected"],
          ["Marubozu", "Long body, no wicks", "One side in full control"],
        ],
      },
      { type: "h2", text: "Two-candle patterns" },
      {
        type: "table",
        head: ["Pattern", "Shape", "Suggests"],
        rows: [
          ["Bullish engulfing", "An up candle whose body covers the previous down body", "Buyers took over"],
          ["Bearish engulfing", "A down candle whose body covers the previous up body", "Sellers took over"],
          ["Piercing line", "An up candle closing above the middle of the prior down candle", "A possible turn up"],
          ["Dark cloud cover", "A down candle closing below the middle of the prior up candle", "A possible turn down"],
        ],
      },
      { type: "h2", text: "Three-candle patterns" },
      {
        type: "table",
        head: ["Pattern", "Shape", "Suggests"],
        rows: [
          ["Morning star", "Down candle, small candle, strong up candle", "A turn up"],
          ["Evening star", "Up candle, small candle, strong down candle", "A turn down"],
          ["Three white soldiers", "Three strong up candles in a row", "Sustained buying"],
          ["Three black crows", "Three strong down candles in a row", "Sustained selling"],
        ],
      },
      { type: "h2", text: "Location is the pattern" },
      {
        type: "list",
        items: [
          "A hammer at a tested support level after a long fall is worth attention.",
          "The same hammer in the middle of a range is noise.",
          "A reversal pattern needs something to reverse: a preceding move.",
          "Higher timeframes produce fewer and more meaningful patterns.",
        ],
      },
      { type: "h2", text: "How much to rely on them" },
      {
        type: "p",
        text: "Used alone, a candlestick pattern is a weak signal. It is best used as a trigger: you already have a level and a direction, and the pattern tells you the market is reacting there now. Wait for the candle to close before acting on it.",
      },
      { type: "h2", text: "A cheat sheet is not a method" },
      {
        type: "p",
        text: "Memorising forty named patterns is less useful than reading any candle directly: who was in control, and where was the price rejected. Every pattern is a special case of those two questions.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Which candlestick pattern is most reliable?",
        a: "Engulfing patterns and hammers at significant levels are the most watched. None is reliable without context.",
      },
      {
        q: "How many candlestick patterns are there?",
        a: "Dozens have names. A handful cover almost everything a trader needs.",
      },
      {
        q: "Do candlestick patterns work on synthetic indices?",
        a: "They form there by chance and carry no information about the next move.",
      },
    ],
    related: ["how-to-read-candlestick-charts", "chart-patterns-explained"],
  },

  {
    slug: "price-action-trading-explained",
    title: "Price action trading: what it is and how to start",
    description:
      "Price action trading reads the chart itself, without indicators: structure, levels and how candles behave at them. The method and its limits.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Price action trading means making decisions from the price chart itself, with few or no indicators. The trader reads market structure, the levels where the price has turned before, and how candles behave when the price reaches them. It is a discretionary skill that takes practice, and it applies to markets driven by real buyers and sellers.",
    body: [
      { type: "h2", text: "The three things a price action trader reads" },
      {
        type: "table",
        head: ["Element", "Question"],
        rows: [
          ["Structure", "Is the market making higher highs and higher lows, lower ones, or neither?"],
          ["Levels", "Where has the price turned before, and where is it now relative to those places?"],
          ["Reaction", "What are the candles doing as the price arrives at a level?"],
        ],
      },
      { type: "h2", text: "A simple routine" },
      {
        type: "steps",
        items: [
          { title: "Start on a higher timeframe", text: "Mark the trend and the major levels." },
          { title: "Wait for the price to reach a level", text: "No level, no trade." },
          { title: "Watch the reaction", text: "A rejection candle, an engulfing candle, or a failed break." },
          { title: "Enter with the stop beyond the level", text: "Where the idea is clearly wrong." },
          { title: "Target the next level", text: "And skip the trade if it is closer than the stop." },
        ],
      },
      { type: "h2", text: "Why people prefer it" },
      {
        type: "list",
        items: [
          "Indicators are calculated from price, so they are always a step behind it.",
          "A clean chart is easier to read than one covered in tools.",
          "The same reading works on any market and timeframe.",
        ],
      },
      { type: "h2", text: "Its limits" },
      {
        type: "list",
        items: [
          "It is subjective. Two traders see different levels, which makes it hard to test.",
          "It cannot be handed to a bot without being turned into exact rules, and most of it then stops being price action.",
          "It takes hundreds of hours of chart time.",
          "Naked charts make it easy to see whatever you hoped to see.",
        ],
      },
      { type: "h2", text: "Keeping it honest" },
      {
        type: "p",
        text: "Write down, before each trade, the level, the trigger and the exit. Record a screenshot. Review weekly. Discretion without records turns into storytelling about why each trade should have worked.",
      },
      { type: "h2", text: "Where it does not apply" },
      {
        type: "p",
        text: "Price action is the footprint of real participants reacting to each other. A synthetic index has none: Deriv says there is no order book and that historical patterns are coincidental. Reading structure there is reading noise.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is price action better than indicators?",
        a: "It is more direct, and harder to define and test. Many traders use price action with one or two indicators as a filter.",
      },
      {
        q: "Can beginners learn price action?",
        a: "Yes. Start with structure and support and resistance on a daily chart, and add nothing else until those are familiar.",
      },
      {
        q: "Can a bot trade price action?",
        a: "Only the parts that can be written as exact rules. The judgment that defines the method does not automate.",
      },
    ],
    related: ["market-structure-explained", "support-and-resistance-levels"],
  },

  {
    slug: "supply-and-demand-zones",
    title: "Supply and demand zones in trading",
    description:
      "A demand zone is an area the price left sharply upward; a supply zone, downward. How to find them and how they differ from support and resistance.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "A demand zone is a price area that the market left with a sharp move up, suggesting strong buying there. A supply zone is one it left with a sharp move down. Traders expect a reaction if the price returns. They are drawn as areas, and differ from support and resistance mainly in being defined by the strength of the departure.",
    body: [
      { type: "h2", text: "How to find one" },
      {
        type: "steps",
        items: [
          { title: "Find a strong move", text: "Several large candles in one direction, with little overlap." },
          { title: "Look at where it began", text: "Usually a small pause or a few narrow candles, called the base." },
          { title: "Mark the base as a zone", text: "From its high to its low." },
          { title: "Wait for the price to return", text: "The first return is the one traders watch." },
        ],
      },
      { type: "h2", text: "Supply and demand against support and resistance" },
      {
        type: "table",
        head: ["", "Support and resistance", "Supply and demand zones"],
        rows: [
          ["Defined by", "Repeated turns at a price", "A sharp move away from an area"],
          ["More touches", "Make the level more visible", "Are thought to weaken the zone"],
          ["Drawn as", "A level or narrow band", "An area"],
          ["Main idea", "The market remembers a price", "Orders were left unfilled there"],
        ],
      },
      {
        type: "p",
        text: "In practice the two overlap. Many supply zones are resistance levels described in different words.",
      },
      { type: "h2", text: "What makes a zone stronger" },
      {
        type: "list",
        items: [
          "A fast, large move away from it.",
          "Little time spent in the zone before leaving.",
          "It has not been revisited yet.",
          "It lines up with the higher-timeframe trend.",
        ],
      },
      { type: "h2", text: "Trading a zone" },
      {
        type: "list",
        items: [
          "Enter when the price returns and shows a reaction, not blindly at the edge.",
          "Place the stop beyond the far side of the zone.",
          "Target the next opposing zone, and skip the trade if it is too close.",
        ],
      },
      { type: "h2", text: "The weak point" },
      {
        type: "p",
        text: "The story about unfilled institutional orders cannot be observed on a retail chart. What you actually have is an area the price moved away from quickly. That is useful evidence, and it is the same kind of evidence as a support level, with the same failure rate. Zones are also easy to draw generously enough that the price always lands in one.",
      },
      { type: "h2", text: "On synthetic indices" },
      {
        type: "p",
        text: "There are no orders on a synthetic index, filled or unfilled. A zone drawn there has nothing behind it.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Are supply and demand zones the same as support and resistance?",
        a: "They overlap heavily. The difference is emphasis: zones are defined by how sharply the price left, levels by how often it turned.",
      },
      {
        q: "What is an order block?",
        a: "A term from smart money concepts for the last opposing candle before a strong move. It marks much the same area as a supply or demand zone.",
      },
      {
        q: "Which timeframe is best for zones?",
        a: "Find them on a higher timeframe than the one you trade, as with any level.",
      },
    ],
    related: ["support-and-resistance-levels", "smart-money-concepts-explained"],
  },

  {
    slug: "divergence-trading-explained",
    title: "Divergence trading: regular, hidden and how to use it",
    description:
      "Divergence is when price and an oscillator disagree: a new high in price without one in RSI or MACD. The types, what they imply, and the timing problem.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Divergence is a disagreement between the price and a momentum indicator such as RSI or MACD. If the price makes a higher high while the indicator makes a lower high, momentum is weakening: a bearish divergence. It is a warning that a move is tiring. It gives no timing, and can continue for a long time before the price turns.",
    body: [
      { type: "h2", text: "The four types" },
      {
        type: "table",
        head: ["Type", "Price", "Indicator", "Suggests"],
        rows: [
          ["Regular bearish", "Higher high", "Lower high", "The uptrend is losing strength"],
          ["Regular bullish", "Lower low", "Higher low", "The downtrend is losing strength"],
          ["Hidden bullish", "Higher low", "Lower low", "The uptrend is likely to continue"],
          ["Hidden bearish", "Lower high", "Higher high", "The downtrend is likely to continue"],
        ],
      },
      {
        type: "p",
        text: "Regular divergence hints at reversal. Hidden divergence hints at continuation after a pullback.",
      },
      { type: "h2", text: "How to spot it" },
      {
        type: "steps",
        items: [
          { title: "Find two clear swing points in price", text: "Two highs or two lows." },
          { title: "Compare the indicator at the same two moments", text: "Join its peaks or troughs with a line." },
          { title: "Check the slopes", text: "If the lines slope in opposite directions, there is divergence." },
        ],
      },
      { type: "h2", text: "The timing problem" },
      {
        type: "p",
        text: "In a strong trend, divergence appears early and repeats. A market can print three or four bearish divergences while climbing, and each one stops out a trader who sold. Divergence tells you momentum has slowed compared with the last push. A slower climb is still a climb.",
      },
      { type: "h2", text: "Using it without being run over" },
      {
        type: "list",
        items: [
          "Treat it as a reason to stop adding to a position, or to tighten a stop.",
          "For a reversal trade, wait for the price to confirm: a break of structure or of a trendline.",
          "Give more weight to divergence at a major level on a higher timeframe.",
          "Hidden divergence in the direction of the trend is the more forgiving trade.",
        ],
      },
      { type: "h2", text: "Why it appears so often" },
      {
        type: "p",
        text: "Oscillators are bounded or mean-reverting by construction. A second price high that is only slightly higher will usually come with a lower indicator reading, simply because the second push was smaller. Divergence is common for that reason, and common signals are weak signals.",
      },
      { type: "h2", text: "On synthetic indices" },
      {
        type: "p",
        text: "Divergence will appear constantly on a random series. It reflects how the indicator is calculated, and has no meaning for the next move.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Which indicator is best for divergence?",
        a: "RSI and MACD are the most used. The choice matters less than waiting for the price to confirm.",
      },
      {
        q: "Is divergence a reliable signal?",
        a: "As a warning, moderately. As a timing signal, no: it can persist through a long trend.",
      },
      {
        q: "What is hidden divergence?",
        a: "Price makes a higher low while the indicator makes a lower low, or the reverse in a downtrend. It suggests the trend will continue.",
      },
    ],
    related: ["what-is-the-rsi-indicator", "macd-indicator-explained"],
  },

  {
    slug: "how-many-indicators-should-you-use",
    title: "How many indicators should you use?",
    description:
      "Two or three indicators that measure different things are enough. Why more adds confusion, how to avoid duplicates, and a simple test for each one.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Two or three indicators are enough for most traders, provided each measures something different: one for trend, one for momentum, and perhaps one for volatility. More indicators do not add information, because all of them are calculated from the same prices. They add conflicting signals, slower decisions and a false sense of confirmation.",
    body: [
      { type: "h2", text: "Indicators come in families" },
      {
        type: "table",
        head: ["Family", "Measures", "Examples"],
        rows: [
          ["Trend", "Direction over a period", "Moving averages, MACD"],
          ["Momentum", "Speed and exhaustion of moves", "RSI, Stochastic"],
          ["Volatility", "Size of movement", "ATR, Bollinger Bands"],
          ["Volume", "Participation, where real volume exists", "Volume, OBV"],
        ],
      },
      { type: "h2", text: "The duplicate problem" },
      {
        type: "p",
        text: "RSI and Stochastic answer nearly the same question, and so do two moving averages of similar length. When three momentum indicators agree, you have one opinion stated three times. It feels like confirmation and adds nothing. Pick one from each family you need.",
      },
      { type: "h2", text: "A test for every indicator on your chart" },
      {
        type: "steps",
        items: [
          { title: "What does it measure?", text: "If you cannot say in a sentence, remove it." },
          { title: "What decision does it change?", text: "If you would take the same trade without it, remove it." },
          { title: "Is it a duplicate?", text: "If another tool answers the same question, keep one." },
          { title: "Can you see the price?", text: "If the chart is hard to read, you have too many." },
        ],
      },
      { type: "h2", text: "A sensible minimum" },
      {
        type: "list",
        items: [
          "One moving average for the trend.",
          "One oscillator for momentum.",
          "ATR for stops and position size.",
          "Horizontal levels drawn by hand.",
        ],
      },
      { type: "h2", text: "What professionals do" },
      {
        type: "p",
        text: "Experienced discretionary traders tend towards fewer tools over time, and many use a nearly bare chart. Systematic traders may use many inputs, but each is tested for whether it adds anything the others do not. Neither group piles indicators on in the hope that agreement means certainty.",
      },
      { type: "h2", text: "In a bot" },
      {
        type: "p",
        text: "In FXNOD's dBot, when indicators decide the side, each trade takes the side they agree on and the bot waits when they disagree. Every indicator you add therefore makes the bot trade less often. That may be what you want, and it is a matter of pacing, not of accuracy.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is it bad to use too many indicators?",
        a: "Yes. They are built from the same prices, so extra ones mostly repeat each other and slow your decisions.",
      },
      {
        q: "Which indicator is best?",
        a: "None is best. Choose by what you need to measure: trend, momentum or volatility.",
      },
      {
        q: "Can I trade with no indicators?",
        a: "Yes. Many traders use price, structure and levels alone.",
      },
    ],
    related: ["price-action-trading-explained", "ema-vs-sma"],
  },

  {
    slug: "multi-timeframe-analysis",
    title: "Multi-timeframe analysis: a simple three-chart method",
    description:
      "Multi-timeframe analysis reads direction on a higher chart, finds the setup on a middle one and times the entry on a lower one. How to do it simply.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Multi-timeframe analysis means looking at the same market on more than one timeframe before trading. The usual method uses three: a higher timeframe for the trend and major levels, a middle one for the setup, and a lower one to time the entry. Trading in the direction of the higher timeframe filters out many poor trades.",
    body: [
      { type: "h2", text: "The three roles" },
      {
        type: "table",
        head: ["Chart", "Job", "Question it answers"],
        rows: [
          ["Higher", "Context", "What is the trend, and where are the big levels?"],
          ["Middle", "Setup", "Is there a trade here that agrees with the context?"],
          ["Lower", "Entry", "Exactly where do I get in and place the stop?"],
        ],
      },
      { type: "h2", text: "Choosing the three" },
      {
        type: "table",
        head: ["Style", "Higher", "Middle", "Lower"],
        rows: [
          ["Swing trading", "Weekly", "Daily", "4-hour"],
          ["Day trading", "Daily", "1-hour", "15-minute"],
          ["Short-term", "4-hour", "30-minute", "5-minute"],
        ],
      },
      {
        type: "p",
        text: "A ratio of about four to six between neighbouring charts works well. Charts that are too close show the same thing. Charts that are too far apart have little to say to each other.",
      },
      { type: "h2", text: "Working top down" },
      {
        type: "steps",
        items: [
          { title: "Higher chart first", text: "Mark the trend direction and the levels. Decide which side you will trade." },
          { title: "Middle chart", text: "Wait for a pullback or pattern in that direction near a level." },
          { title: "Lower chart", text: "Wait for the turn, then enter with the stop beyond it." },
          { title: "Manage on the middle chart", text: "Do not let the lower chart's noise shake you out." },
        ],
      },
      { type: "h2", text: "When the charts disagree" },
      {
        type: "p",
        text: "An uptrend on the daily and a downtrend on the 15-minute is normal: the lower chart is showing a pullback. The higher timeframe wins for direction. If they conflict and no pullback explanation fits, there is no trade. Standing aside is a valid result of the analysis.",
      },
      { type: "h2", text: "Mistakes" },
      {
        type: "list",
        items: [
          "Looking at so many timeframes that one always supports the trade you want.",
          "Finding the entry on a low chart and then searching upwards for a justification.",
          "Using a lower-chart stop with a higher-chart target and no plan for the journey between.",
          "Switching down to a tiny timeframe after entry and panicking at ordinary movement.",
        ],
      },
      { type: "h2", text: "On synthetic indices" },
      {
        type: "p",
        text: "A random series looks like a trend on one timeframe and a range on another without either meaning anything. Multi-timeframe agreement there is coincidence.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "How many timeframes should I use?",
        a: "Three is enough: context, setup and entry. More creates conflict without adding information.",
      },
      {
        q: "Which timeframe matters most?",
        a: "The higher one, for direction. Trade with it and use the others for timing.",
      },
      {
        q: "What if the timeframes conflict?",
        a: "Treat the lower chart's move as a pullback within the higher trend, or do not trade.",
      },
    ],
    related: ["best-trading-timeframe-for-beginners", "trending-vs-sideways-markets"],
  },

  {
    slug: "pullback-vs-reversal",
    title: "Pullback vs reversal: how to tell them apart",
    description:
      "A pullback is a temporary move against the trend; a reversal ends it. The signs that separate them, and how to trade when you cannot yet tell.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "A pullback is a temporary move against a trend, after which the trend resumes. A reversal is the end of the trend and the start of one the other way. They look the same at the start. The difference shows in structure: a pullback holds above the last higher low in an uptrend, and a reversal breaks it.",
    body: [
      { type: "h2", text: "Side by side" },
      {
        type: "table",
        head: ["", "Pullback", "Reversal"],
        rows: [
          ["Structure", "Higher lows stay intact in an uptrend", "The last higher low is broken"],
          ["Depth", "Usually a fraction of the last move", "Retraces all of it and more"],
          ["Momentum", "Slower than the trend move before it", "As fast as, or faster than, the trend"],
          ["Higher timeframe", "Still shows the trend", "Shows a level being rejected"],
          ["After it", "A new high", "A lower high, then a lower low"],
        ],
      },
      { type: "h2", text: "Signs it is only a pullback" },
      {
        type: "list",
        items: [
          "Small candles with overlapping bodies, drifting against the trend.",
          "It stops near a moving average, a trendline or a prior level.",
          "The move against the trend takes longer and covers less ground than the move with it.",
          "No major level on the higher timeframe is in the way.",
        ],
      },
      { type: "h2", text: "Signs it may be a reversal" },
      {
        type: "list",
        items: [
          "A sharp move against the trend from a major higher-timeframe level.",
          "A break of the most recent swing low in an uptrend.",
          "The next rally fails below the previous high.",
          "Divergence had been building before the turn.",
        ],
      },
      { type: "h2", text: "The honest position" },
      {
        type: "p",
        text: "At the moment it starts, nobody can tell. Every reversal begins as a pullback. What you can do is define the point at which the pullback idea is wrong, usually the last swing low, and put your stop there. If it is a pullback, you are in early. If it is a reversal, you lose a known, small amount.",
      },
      { type: "h2", text: "Trading each" },
      {
        type: "table",
        head: ["Situation", "Approach"],
        rows: [
          ["Pullback in a clear trend", "Enter with the trend when the pullback shows signs of ending"],
          ["Structure has broken", "Stop trading the old trend. Wait for a retest from the other side"],
          ["Unclear", "Stand aside, or trade smaller"],
        ],
      },
      { type: "h2", text: "Retracement" },
      {
        type: "p",
        text: "Retracement is another word for pullback, often used with Fibonacci levels to describe how much of the move was given back.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "How deep can a pullback go before it is a reversal?",
        a: "There is no fixed depth. The clearer test is structure: a break of the last swing point against the trend.",
      },
      {
        q: "Is a retracement the same as a pullback?",
        a: "Yes, in everyday use. Both mean a temporary move against the trend.",
      },
      {
        q: "Should I trade pullbacks or reversals?",
        a: "Pullbacks, for most traders. Trading with an existing trend succeeds more often than calling its end.",
      },
    ],
    related: ["market-structure-explained", "fibonacci-retracement-explained"],
  },

  {
    slug: "false-breakout-explained",
    title: "False breakouts: why they happen and how to handle them",
    description:
      "A false breakout pushes past a level and then reverses back inside. Why they are common, how to reduce them, and how some traders trade the failure.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "A false breakout, or fakeout, is when the price moves beyond a support or resistance level and then quickly returns inside. They are common, because levels attract stop orders and breakout orders that briefly push the price through without real follow-through. You cannot avoid them. You can wait for a close, trade smaller, or trade the failure itself.",
    body: [
      { type: "h2", text: "Why they happen" },
      {
        type: "list",
        items: [
          "Stop orders sit just beyond obvious levels. When they trigger, they push the price a little further, then run out.",
          "Breakout traders enter on the first tick through, and exit as soon as it stalls.",
          "Larger participants use that burst of orders to take the other side.",
          "In a ranging market there is simply no reason for the price to continue.",
        ],
      },
      { type: "h2", text: "Warning signs" },
      {
        type: "table",
        head: ["Sign", "Why it matters"],
        rows: [
          ["Only a wick went through", "The close stayed inside: the level held"],
          ["The break is against the higher-timeframe trend", "Fewer traders will follow it"],
          ["It happened in thin hours or just before news", "Little real participation"],
          ["No expansion in candle size or volume", "The move lacks force"],
          ["The level has been tested many times in a tight range", "The market may be building for a real break, or trapping both sides"],
        ],
      },
      { type: "h2", text: "Ways to reduce them" },
      {
        type: "steps",
        items: [
          { title: "Wait for a candle to close beyond the level", text: "Slower, and it removes many wick-only breaks." },
          { title: "Wait for a retest", text: "The price returns to the level and holds it from the other side." },
          { title: "Trade with the larger trend only", text: "Breakouts against it fail more often." },
          { title: "Use a smaller size", text: "Accept that some will fail and make each one cheap." },
        ],
      },
      { type: "h2", text: "Trading the failure" },
      {
        type: "p",
        text: "Some traders wait for the false break and trade back into the range: the price pushes above resistance, closes back below it, and they sell with a stop above the spike. The logic is that trapped breakout buyers now have to exit. It is a valid setup, with a clear stop, and it fails whenever the breakout turns out to be real on the second attempt.",
      },
      { type: "h2", text: "The cost of every filter" },
      {
        type: "p",
        text: "Each filter trades missed moves for fewer false ones. Waiting for a close gives a worse price. Waiting for a retest misses the breaks that never look back, and those are often the strongest. There is no setting that keeps the good breakouts and removes the bad ones.",
      },
      { type: "h2", text: "On synthetic indices" },
      {
        type: "p",
        text: "There are no stop orders or trapped traders on a random index. A move through a line there continues or reverses by chance.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "How do I avoid false breakouts?",
        a: "You cannot avoid them entirely. Waiting for a close or a retest, and trading with the larger trend, reduces them.",
      },
      {
        q: "What is a bull trap?",
        a: "A false breakout upward that draws in buyers before the price falls. A bear trap is the same thing downward.",
      },
      {
        q: "Are false breakouts more common than real ones?",
        a: "In ranging markets, yes. Markets range more often than they trend, which is why breakout trading has a low win rate.",
      },
    ],
    related: ["what-is-a-breakout-in-trading", "support-and-resistance-levels"],
  },

  {
    slug: "market-structure-explained",
    title: "Market structure in trading: highs, lows and breaks",
    description:
      "Market structure is the sequence of swing highs and lows. How to read an uptrend, a downtrend and a range, and what a break of structure means.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Market structure is the pattern of swing highs and swing lows a price makes. Higher highs and higher lows are an uptrend. Lower highs and lower lows are a downtrend. Neither is a range. A break of structure happens when the price takes out the last swing point against the trend, which is the first objective sign that the trend may be changing.",
    body: [
      { type: "h2", text: "The building blocks" },
      {
        type: "table",
        head: ["Term", "Meaning"],
        rows: [
          ["Swing high", "A peak with lower highs either side"],
          ["Swing low", "A trough with higher lows either side"],
          ["Higher high, higher low", "Each peak and trough above the last: an uptrend"],
          ["Lower high, lower low", "Each peak and trough below the last: a downtrend"],
          ["Break of structure", "The price passes the last swing point in the trend's direction, continuing it"],
          ["Change of character", "The price breaks the last swing point against the trend"],
        ],
      },
      {
        type: "p",
        text: "Different teachers use these last two terms slightly differently. What matters is the event: which swing point was broken, and in which direction.",
      },
      { type: "h2", text: "Reading it" },
      {
        type: "steps",
        items: [
          { title: "Mark the obvious swing points", text: "Only the ones you can see at a glance." },
          { title: "Label them", text: "Higher or lower than the previous one of the same kind." },
          { title: "Name the state", text: "Uptrend, downtrend or range." },
          { title: "Note the key level", text: "In an uptrend, the most recent higher low. While it holds, the trend is intact." },
        ],
      },
      { type: "h2", text: "What a break tells you" },
      {
        type: "p",
        text: "When an uptrend's last higher low is broken, the definition of the uptrend no longer holds. That does not mean a downtrend has begun. The market may range, or resume upward after a deeper pullback. A downtrend is confirmed only by a lower high followed by a lower low.",
      },
      { type: "h2", text: "Structure depends on the timeframe" },
      {
        type: "p",
        text: "A break of structure on the five-minute chart can be an ordinary pullback on the hourly. Decide which timeframe's structure you are trading and judge breaks on that one.",
      },
      { type: "h2", text: "Why it is useful" },
      {
        type: "list",
        items: [
          "It defines the trend without an indicator.",
          "It tells you where a trade idea is wrong, which is where the stop belongs.",
          "It separates a pullback from a possible reversal by an observable event.",
        ],
      },
      { type: "h2", text: "Its limits" },
      {
        type: "list",
        items: [
          "Choosing which swings count is subjective.",
          "Breaks are often false, especially in ranges.",
          "On a random synthetic index, structure forms by chance and carries no information.",
        ],
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is a break of structure?",
        a: "The price moving beyond a previous swing high or low. With the trend it signals continuation; against it, a possible change.",
      },
      {
        q: "What is the difference between BOS and CHoCH?",
        a: "Commonly, a break of structure continues the trend and a change of character is the first break against it. Usage varies between teachers.",
      },
      {
        q: "Which timeframe is best for market structure?",
        a: "Read it on a higher timeframe than your entry chart, so the swings you mark are significant ones.",
      },
    ],
    related: ["trending-vs-sideways-markets", "pullback-vs-reversal"],
  },

  {
    slug: "smart-money-concepts-explained",
    title: "Smart money concepts (SMC): the terms, and an honest assessment",
    description:
      "Smart money concepts describe markets through liquidity, order blocks and fair value gaps. What the terms mean and what can and cannot be verified.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Smart money concepts, or SMC, is a style of price action trading that explains market moves as large institutions seeking liquidity. Its vocabulary includes order blocks, fair value gaps, liquidity sweeps and breaks of structure. Much of it renames established ideas such as support, resistance and false breakouts. The claims about what institutions intend cannot be checked from a chart.",
    body: [
      { type: "h2", text: "The vocabulary" },
      {
        type: "table",
        head: ["SMC term", "What it describes", "Older name for a similar idea"],
        rows: [
          ["Order block", "The last opposing candle before a strong move", "Supply or demand zone"],
          ["Fair value gap", "A gap left between candles in a fast move", "Imbalance, or simply a gap"],
          ["Liquidity", "Clusters of stop orders beyond highs and lows", "Stops above resistance, below support"],
          ["Liquidity sweep", "A push through a high or low that reverses", "False breakout, stop hunt"],
          ["Break of structure", "A new swing high or low in the trend's direction", "Trend continuation"],
          ["Change of character", "The first break against the trend", "Possible reversal"],
          ["Premium and discount", "The upper and lower half of a range", "Expensive and cheap within the range"],
        ],
      },
      { type: "h2", text: "The core story" },
      {
        type: "p",
        text: "Large participants need many orders on the other side to fill their own. Those orders are found where retail stops cluster, beyond obvious highs and lows. So the price is drawn to those areas, takes the stops, and then moves the other way. The trader's job, in this view, is to wait for the sweep and join the move that follows.",
      },
      { type: "h2", text: "What is sound in it" },
      {
        type: "list",
        items: [
          "Stops do cluster beyond obvious levels, and false breakouts are common.",
          "Waiting for a sweep and a reaction is more patient than buying every breakout.",
          "It makes traders think about where others are positioned.",
          "Structure and levels are real, whatever they are called.",
        ],
      },
      { type: "h2", text: "What to be careful about" },
      {
        type: "list",
        items: [
          "Intent cannot be seen on a chart. Any move can be explained afterwards as institutions hunting liquidity.",
          "Order blocks and gaps are so numerous that the price is nearly always near one.",
          "The method is discretionary, so it is hard to test and easy to believe.",
          "Much of it is sold through paid courses, by people whose income is the course.",
          "Retail forex charts show one broker's prices, not the whole market's orders.",
        ],
      },
      { type: "h2", text: "SMC and ICT" },
      {
        type: "p",
        text: "ICT refers to a particular teacher's body of material, from which much of the SMC vocabulary comes. In everyday use the two overlap heavily. Different teachers define the same terms differently, which is another reason to judge any version by tested results and not by its vocabulary.",
      },
      { type: "h2", text: "A fair way to use it" },
      {
        type: "steps",
        items: [
          { title: "Write exact rules", text: "Define what counts as an order block or a sweep before looking at the chart." },
          { title: "Test them", text: "A hundred trades, recorded, with screenshots." },
          { title: "Keep what survives", text: "Usually: trade with the higher-timeframe trend, wait at levels, and do not chase breakouts." },
        ],
      },
      { type: "h2", text: "On synthetic indices" },
      {
        type: "p",
        text: "SMC is a theory about participants and their orders. A synthetic index has neither. Deriv says there is no order book. Applying smart money concepts there has no basis, however convincing the chart looks.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Does smart money concepts trading work?",
        a: "Parts of it restate ideas that have value, such as trading with structure and waiting at levels. Its larger claims about institutional intent cannot be verified.",
      },
      {
        q: "What is an order block?",
        a: "The last candle against the direction of a strong move, treated as an area where the price may react if it returns.",
      },
      {
        q: "What is a fair value gap?",
        a: "A three-candle formation in which the first and third candles do not overlap, leaving a gap that the price is said to revisit.",
      },
      {
        q: "Is SMC better than support and resistance?",
        a: "It is largely a different vocabulary for overlapping ideas. Judge either by recorded results.",
      },
    ],
    related: ["supply-and-demand-zones", "false-breakout-explained"],
  },
];
