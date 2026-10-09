/**
 * Trading-practice guides: sizing, drawdown, review, testing, choosing a
 * platform and staying safe. Same shape and same rules as the tool guides in
 * `guides.ts`. Arithmetic is worked in full so a reader can check it.
 */
import { RISK_NOTE, type Guide } from "./guides";

const TAG = "Trading practice";
const DATE = "2026-10-09";

export const PRACTICE_GUIDES: Guide[] = [
  {
    slug: "best-trading-timeframe-for-beginners",
    title: "Which trading timeframe is best for beginners?",
    description:
      "Beginners learn fastest on the 1-hour to daily charts: fewer signals, less noise and time to think. How timeframes differ and how to pick yours.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "For most beginners the 1-hour, 4-hour and daily charts are the best place to start. They produce fewer signals, contain less random noise, and leave time to think before acting. One-minute and tick charts move too fast to learn on and make costs a larger share of each trade. Choose the timeframe your schedule can support.",
    body: [
      { type: "h2", text: "What a timeframe is" },
      {
        type: "p",
        text: "The timeframe is the period each candle covers. The market is the same on every timeframe. What changes is how much detail you see, how often a setup appears and how long a trade lasts.",
      },
      { type: "h2", text: "The main trading styles" },
      {
        type: "table",
        head: ["Style", "Typical charts", "Trade lasts", "Screen time"],
        rows: [
          ["Scalping", "Tick to 5-minute", "Seconds to minutes", "Constant"],
          ["Day trading", "5-minute to 1-hour", "Minutes to hours", "Several hours a day"],
          ["Swing trading", "4-hour to daily", "Days to weeks", "Minutes a day"],
          ["Position trading", "Daily to weekly", "Weeks to months", "Minutes a week"],
        ],
      },
      { type: "h2", text: "Why shorter is harder" },
      {
        type: "list",
        items: [
          "More noise: the shorter the chart, the larger the share of movement that is random.",
          "Higher relative cost: the spread is a bigger part of a small target.",
          "Less time: decisions are made in seconds, which is when beginners make their worst ones.",
          "More trades: more chances to break your own rules in one session.",
        ],
      },
      { type: "h2", text: "Use two timeframes" },
      {
        type: "p",
        text: "Read the direction and the key levels on a higher timeframe, then time the entry on a lower one. A common pairing is a factor of four to six apart: daily with 4-hour, 4-hour with 1-hour, 1-hour with 15-minute. Trading with the higher timeframe's direction removes a large share of bad trades.",
      },
      { type: "h2", text: "Pick by your life, not by excitement" },
      {
        type: "steps",
        items: [
          { title: "Count the hours you really have", text: "If you work full time, a method that needs you at the screen during the London session will not survive." },
          { title: "Match the style", text: "An hour a day suits swing trading from the 4-hour and daily charts. Several free hours suit day trading." },
          { title: "Stay on it for a month", text: "Changing timeframe after every loss means never learning how one behaves." },
        ],
      },
      { type: "h2", text: "Tick contracts and bots" },
      {
        type: "p",
        text: "Contracts that last a few ticks are the shortest timeframe there is. A person cannot trade them consistently by hand, which is why they are usually automated. Speed makes them a poor place to learn what a market does. Learn on a slower chart first, and treat tick contracts as an exercise in stake and payout arithmetic.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is the 1-minute chart good for beginners?",
        a: "No. It is mostly noise, costs take a large share of each trade, and decisions have to be made too quickly to learn from them.",
      },
      {
        q: "What timeframe do professional traders use?",
        a: "All of them, depending on the strategy. Many read direction on the daily or 4-hour chart and enter on a lower one.",
      },
      {
        q: "Can I trade the daily chart with a small account?",
        a: "Yes, if your broker allows small position sizes. Daily stops are wider in price, so the position must be smaller to keep the money at risk the same.",
      },
    ],
    related: ["how-to-read-candlestick-charts", "how-to-start-learning-trading"],
  },

  {
    slug: "how-to-calculate-position-size",
    title: "How to calculate the correct position size",
    description:
      "Position size = money you will risk divided by the loss per unit if your stop is hit. The formula, worked examples and the rule for fixed-stake contracts.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "To calculate position size, decide how much money you will risk on the trade, usually 1% to 2% of the account, then divide it by what you lose per unit if the stop is hit. Position size equals account risk divided by stop distance times value per unit. The stop decides the size, never the other way round.",
    body: [
      { type: "h2", text: "The formula" },
      {
        type: "p",
        text: "Position size equals the amount at risk divided by the stop distance multiplied by the value of one unit of movement. Three inputs: how much you are prepared to lose, how far away the stop is, and what each point or pip is worth for one unit of the instrument.",
      },
      { type: "h2", text: "Worked example: forex" },
      {
        type: "steps",
        items: [
          { title: "Account and risk", text: "The account is 1,000 and you risk 1%, so the amount at risk is 10." },
          { title: "Stop distance", text: "The chart says the trade is wrong 20 pips away." },
          { title: "Value per pip", text: "On a dollar-quoted pair, one pip on a mini lot of 10,000 units is worth about 1." },
          { title: "Size", text: "10 divided by 20 times 1 equals 0.5 mini lots, which is 5,000 units or 0.05 standard lots." },
        ],
      },
      {
        type: "p",
        text: "If the stop had been 40 pips away, the size would halve to 0.025 lots. The money at risk stays at 10 either way. That is the point of the calculation.",
      },
      { type: "h2", text: "How much to risk per trade" },
      {
        type: "table",
        head: ["Risk per trade", "Account left after 10 losses in a row"],
        rows: [
          ["1%", "About 90%"],
          ["2%", "About 82%"],
          ["5%", "About 60%"],
          ["10%", "About 35%"],
        ],
      },
      {
        type: "p",
        text: "Ten losses in a row is not rare over a year of trading. At 1% or 2% it is a bad month. At 10% it is close to the end of the account.",
      },
      { type: "h2", text: "Fixed-payout contracts: the stake is the risk" },
      {
        type: "p",
        text: "On options such as Rise/Fall or digit contracts there is no stop distance. A losing contract costs its whole stake, so the stake is the position size. The same rule applies: stake 1% to 2% of the money you have set aside, and the arithmetic of the table above holds exactly.",
      },
      { type: "h2", text: "With a bot" },
      {
        type: "p",
        text: "For a flat-stake bot, size the stake against the session's stop loss: a stake of 2% of the stop loss allows fifty net losses before the session ends. If the stake grows after a loss, the position size that matters is the largest stake the settings can reach, not the first one. Work that number out before you start.",
      },
      { type: "h2", text: "Mistakes to avoid" },
      {
        type: "list",
        items: [
          "Choosing the size first and then squeezing the stop to fit. The stop belongs where the trade is wrong.",
          "Using the same lot size on every trade regardless of stop distance.",
          "Raising the size after losses to recover faster.",
          "Forgetting that several open trades on related markets are one large position.",
        ],
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is the 1% rule in trading?",
        a: "Risking no more than 1% of the account on any single trade, so that a long losing streak leaves most of the account intact.",
      },
      {
        q: "How do I calculate lot size?",
        a: "Divide the money you will risk by the stop distance in pips multiplied by the pip value of one lot. The answer is the number of lots.",
      },
      {
        q: "Should position size change after a loss?",
        a: "If you risk a fixed percentage, it shrinks slightly as the account shrinks, which is protective. It should never be raised to win a loss back.",
      },
      {
        q: "Does leverage change position size?",
        a: "Leverage changes how large a position your deposit allows. It does not change how large a position your risk rule allows. Size by risk, not by the maximum available.",
      },
    ],
    related: ["what-is-drawdown-in-trading", "risk-to-reward-ratio"],
  },

  {
    slug: "what-is-drawdown-in-trading",
    title: "What is drawdown in trading?",
    description:
      "Drawdown is the fall from an account's peak to its next low. Why a 50% loss needs a 100% gain to recover, and how to keep drawdowns survivable.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Drawdown is the fall in an account from its highest point to the lowest point that follows, usually given as a percentage. An account that rises to 1,000 and falls to 800 has a 20% drawdown. Recovery takes a larger percentage gain than the loss: a 50% drawdown needs a 100% gain to get back to the peak.",
    body: [
      { type: "h2", text: "How to calculate it" },
      {
        type: "p",
        text: "Drawdown equals the peak minus the trough, divided by the peak. From a peak of 1,000 to a low of 800: 200 divided by 1,000, or 20%. Maximum drawdown is the largest such fall over the whole history of an account or a strategy test.",
      },
      { type: "h2", text: "The recovery problem" },
      {
        type: "table",
        head: ["Drawdown", "Gain needed to return to the peak"],
        rows: [
          ["10%", "11.1%"],
          ["20%", "25%"],
          ["30%", "42.9%"],
          ["50%", "100%"],
          ["75%", "300%"],
          ["90%", "900%"],
        ],
      },
      {
        type: "p",
        text: "The gain is measured on a smaller account than the loss was. Lose half and you must double what is left. This asymmetry is the whole case for keeping losses small: shallow drawdowns are repaired by ordinary trading and deep ones almost never are.",
      },
      { type: "h2", text: "Why every strategy has one" },
      {
        type: "p",
        text: "Losses cluster. A strategy that wins 55% of the time will still produce runs of six, eight or ten losses over a few hundred trades. Drawdown is the price of the strategy's returns, and a test that shows none has simply been too short.",
      },
      { type: "h2", text: "What a drawdown tells you" },
      {
        type: "list",
        items: [
          "Within the range the test showed: normal. Keep following the rules.",
          "Well beyond anything the test showed: the strategy may have stopped working, or the test was too small. Reduce size or stop and re-test.",
          "Caused by trades outside the rules: the problem is discipline, not the strategy.",
        ],
      },
      { type: "h2", text: "Keeping it survivable" },
      {
        type: "steps",
        items: [
          { title: "Risk a small fixed fraction per trade", text: "At 1% per trade, ten losses in a row is a drawdown of about 10%." },
          { title: "Set a daily and a weekly loss limit", text: "They stop a bad run from compounding with bad decisions." },
          { title: "Cut size in a drawdown", text: "Halve the stake after a set fall from the peak, and restore it only when the account recovers." },
          { title: "Avoid recovery sizing", text: "Raising the stake to win losses back turns a normal drawdown into a terminal one." },
        ],
      },
      { type: "h2", text: "Drawdown and bots" },
      {
        type: "p",
        text: "A session stop loss is a drawdown limit for one run. It does nothing about a week of runs that each end on their stop loss. Track the account's peak yourself and decide in advance the fall at which you stop starting new sessions. Martingale strategies deserve special care here: their balance line shows almost no drawdown until the single run that produces a very large one.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is a good maximum drawdown?",
        a: "One you could live through without abandoning the strategy. Many traders aim to keep it under 20%, because recovery beyond that becomes steeply harder.",
      },
      {
        q: "What is the difference between drawdown and loss?",
        a: "A loss is the result of one trade. Drawdown is the total fall from a peak across however many trades it took, and it ends only when a new peak is made.",
      },
      {
        q: "How long does a drawdown last?",
        a: "From the peak until the account makes a new high. A strategy can be profitable overall and still spend most of its time below its last peak.",
      },
    ],
    related: ["how-to-calculate-position-size", "is-a-high-win-rate-enough"],
  },

  {
    slug: "is-a-high-win-rate-enough",
    title: "Is a high win rate enough to make a trading strategy profitable?",
    description:
      "No. A strategy is profitable only if win rate times average win exceeds loss rate times average loss. Worked examples of 90% losing and 35% winning.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "No. A high win rate is not enough. A strategy is profitable only when its win rate multiplied by its average win is greater than its loss rate multiplied by its average loss. A strategy that wins 90% of the time loses money if each loss is more than nine times the size of a win. Win rate and payoff must be read together.",
    body: [
      { type: "h2", text: "The one formula" },
      {
        type: "p",
        text: "Expected value per trade equals win rate times average win, minus loss rate times average loss. If it is positive, the strategy makes money over many trades. If it is negative, no win rate will save it.",
      },
      { type: "h2", text: "Four strategies compared" },
      {
        type: "table",
        head: ["Win rate", "Average win", "Average loss", "Expected value per trade", "Verdict"],
        rows: [
          ["90%", "1", "10", "-0.10", "Loses"],
          ["60%", "1", "2", "-0.20", "Loses"],
          ["50%", "1.5", "1", "+0.25", "Profitable"],
          ["35%", "3", "1", "+0.40", "Profitable"],
        ],
      },
      {
        type: "p",
        text: "The strategy that wins least often is the most profitable in this table, and the one that wins most often loses. Win rate tells you how the strategy feels to trade. Expected value tells you whether it makes money.",
      },
      { type: "h2", text: "Why high win rates are so tempting" },
      {
        type: "list",
        items: [
          "Winning often feels like being right, and people will pay a great deal to feel right.",
          "The balance climbs in a smooth line, which looks like skill.",
          "The large loss is rare, so a short test may never show it.",
          "It is the easiest number to advertise.",
        ],
      },
      { type: "h2", text: "How high win rates are manufactured" },
      {
        type: "list",
        items: [
          "Tiny profit targets with distant stops or none: many small wins, occasional disaster.",
          "Martingale: nearly every sequence ends in a small win until one does not.",
          "Contracts that win on most outcomes and pay a fraction of the stake, such as Differs.",
          "Refusing to close losing trades, which are then not counted as losses.",
        ],
      },
      { type: "h2", text: "The break-even win rate" },
      {
        type: "p",
        text: "For any payoff there is a win rate you must beat. It equals average loss divided by the sum of average win and average loss. With wins of 1 and losses of 10, that is 10 divided by 11, or 90.9%. A 90% win rate is below it. Work out this figure for your own strategy before being pleased with its win rate.",
      },
      { type: "h2", text: "The questions to ask instead" },
      {
        type: "list",
        items: [
          "What is the average win and the average loss?",
          "What was the largest single loss?",
          "How many trades is the win rate measured over?",
          "Does the stake change after a loss?",
        ],
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is a good win rate in trading?",
        a: "Any win rate above the break-even rate for your payoff. With wins twice the size of losses, 34% is profitable. With wins half the size of losses, 66% is not.",
      },
      {
        q: "Can a strategy with a 30% win rate be profitable?",
        a: "Yes, if the average win is more than about 2.3 times the average loss. Many trend-following strategies work this way.",
      },
      {
        q: "Why does my 80% win rate strategy lose money?",
        a: "Because the losses are more than four times the size of the wins. Compare your average win with your average loss and the reason will be visible.",
      },
    ],
    related: ["risk-to-reward-ratio", "how-to-evaluate-a-trading-strategy"],
  },

  {
    slug: "why-trading-platform-keeps-disconnecting",
    title: "Why does a trading platform keep disconnecting?",
    description:
      "A trading platform disconnects because of your network, your device, your session or the broker. How to tell which, and what happens to open trades.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "A trading platform usually disconnects for one of four reasons: an unstable internet connection, a device or browser that put the page to sleep, a login session that expired or was replaced by another, or a problem on the broker's side. Open trades are held by the broker and are not closed by a disconnection. Check the broker's status page first.",
    body: [
      { type: "h2", text: "Find the cause" },
      {
        type: "table",
        head: ["Symptom", "Likely cause", "Try"],
        rows: [
          ["Drops every few minutes on Wi-Fi", "Weak or congested network", "Move closer to the router, or use a cable or mobile data to compare"],
          ["Drops when the screen locks or the tab is in the background", "The device is saving power", "Keep the tab in front; turn off battery saving for the browser"],
          ["Signed out without warning", "Session expired, or you signed in somewhere else", "Sign in again; close other sessions"],
          ["Charts frozen for everyone", "Broker outage or maintenance", "Check the broker's status page and wait"],
          ["Works on mobile data, fails on one network", "A firewall, VPN or provider is blocking the connection", "Turn the VPN off, or try another network"],
          ["Slows down over hours, then drops", "The browser is short of memory", "Close other tabs, restart the browser, remove heavy extensions"],
        ],
      },
      { type: "h2", text: "Why trading apps are sensitive" },
      {
        type: "p",
        text: "A trading screen keeps a live connection open to receive every price. An ordinary web page tolerates a few seconds without a network. A live price stream does not: the moment the connection breaks, the chart stops and the platform shows that it is reconnecting.",
      },
      { type: "h2", text: "What happens to your open trades" },
      {
        type: "p",
        text: "Your positions exist on the broker's servers, not on your device. A disconnection does not close them, and a contract with an expiry settles on time whether you are watching or not. What you lose is the ability to act: you cannot close a position by hand or change a stop until you are back. Orders that live at the broker, such as a stop loss attached to a position, keep working.",
      },
      { type: "h2", text: "What happens to a bot" },
      {
        type: "p",
        text: "It depends on where the bot runs. A bot that runs in your browser stops trading when the page disconnects, and its stop loss stops with it. A bot that runs on a server is unaffected by your connection. Bots started in FXNOD's dBot and Auto Hub run on FXNOD's servers, so they continue, with their limits, while your device is offline.",
      },
      { type: "h2", text: "Before you trade real money" },
      {
        type: "list",
        items: [
          "Have a second way to reach your account: the broker's mobile app on mobile data.",
          "Never rely on being at the screen to limit a loss. Attach the limit to the trade or the bot.",
          "Keep the browser and the app up to date.",
          "Avoid public Wi-Fi for trading.",
        ],
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Will my trade close if I lose connection?",
        a: "No. The trade is held by the broker and continues. It will settle or hit its attached stop as normal. You simply cannot manage it by hand until you reconnect.",
      },
      {
        q: "Why does my platform disconnect on mobile?",
        a: "Phones suspend background apps and switch between Wi-Fi and mobile data. Keep the app in the foreground and exclude it from battery optimisation.",
      },
      {
        q: "Does a VPN cause disconnections?",
        a: "It can. A VPN adds a hop that may be slow or blocked, and some brokers restrict access from VPN addresses. Test without it.",
      },
      {
        q: "Is it my internet or the broker?",
        a: "Open another site. If everything is slow, it is your connection. If only the broker is affected, check its status page.",
      },
    ],
    related: ["why-is-my-trading-bot-not-working", "how-to-choose-a-trading-platform"],
  },

  {
    slug: "how-to-review-trading-results",
    title: "How to review and improve your trading results",
    description:
      "Review trading results weekly: measure five numbers, split trades into groups to find what loses, and change one thing at a time. A step-by-step method.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Review your trading once a week from your trade history and journal. Measure the win rate, average win, average loss, expected value and largest drawdown. Then split the trades by setup, time and whether you followed your plan, to find the group that loses. Change one thing, keep it for at least fifty trades, and measure again.",
    body: [
      { type: "h2", text: "Step 1: get the facts" },
      {
        type: "table",
        head: ["Number", "How to get it"],
        rows: [
          ["Trades taken", "Count them"],
          ["Win rate", "Wins divided by trades"],
          ["Average win and average loss", "Total won over wins; total lost over losses"],
          ["Expected value per trade", "Net result divided by trades"],
          ["Largest drawdown", "The biggest fall from a peak in the balance"],
        ],
      },
      { type: "h2", text: "Step 2: split the trades" },
      {
        type: "p",
        text: "The total hides the answer. Sorting the same trades into groups reveals it. Most traders find one group that carries nearly all of the losses.",
      },
      {
        type: "list",
        items: [
          "By plan: trades that followed your rules against trades that did not.",
          "By setup: each type of entry on its own.",
          "By time: session, day of the week, first hour against the rest.",
          "By sequence: trades taken straight after a loss against all others.",
          "By market: each instrument separately.",
        ],
      },
      { type: "h2", text: "Step 3: separate process from outcome" },
      {
        type: "table",
        head: ["", "Followed the plan", "Broke the plan"],
        rows: [
          ["Won", "Good trade", "Bad trade that happened to pay: the most dangerous kind"],
          ["Lost", "Good trade with a normal loss", "Bad trade"],
        ],
      },
      {
        type: "p",
        text: "Judge yourself on the columns, not the rows. A planned loss is the system working. An unplanned win teaches a habit that will cost more later.",
      },
      { type: "h2", text: "Step 4: change one thing" },
      {
        type: "steps",
        items: [
          { title: "Pick the largest leak", text: "The group that lost the most, not the mistake that annoys you most." },
          { title: "Write one rule against it", text: "For example: no trade within ten minutes of a loss." },
          { title: "Hold it for fifty trades", text: "Fewer than that and you cannot tell the change from chance." },
          { title: "Measure the same numbers again", text: "Keep the rule if the numbers improved, drop it if they did not." },
        ],
      },
      { type: "h2", text: "Reviewing a bot" },
      {
        type: "p",
        text: "For automated trading, review runs. Record each run's settings, how it ended and its result, then compare by setting: does the bot do better on one market, one stake rule, one contract length? Change one setting between tests. Also review your own decisions: every time you stopped a bot early or restarted it with a different stake, write down why.",
      },
      { type: "h2", text: "What not to do" },
      {
        type: "list",
        items: [
          "Do not review after every trade. One result is noise.",
          "Do not change several things at once.",
          "Do not judge a change by its first five trades.",
          "Do not skip the review after a good week. Good weeks hide bad habits.",
        ],
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "How often should I review my trades?",
        a: "Weekly for the numbers and patterns, monthly for the larger trend. Daily review is useful only for checking whether you followed your rules.",
      },
      {
        q: "What is the most important trading metric?",
        a: "Expected value per trade, because it combines win rate and payoff. After that, maximum drawdown, because it decides whether you can keep going.",
      },
      {
        q: "How many trades before I change my strategy?",
        a: "At least fifty with the same rules, and more if the strategy wins very often or very rarely. Changing sooner means reacting to luck.",
      },
    ],
    related: ["how-to-keep-a-trading-journal", "is-a-high-win-rate-enough"],
  },

  {
    slug: "how-to-identify-trading-scams",
    title: "How to identify trading scams and fake trading services",
    description:
      "Trading scams share the same signs: guaranteed profit, pressure to act, payment to a person, and withdrawals that never arrive. A checklist to use.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "A trading scam almost always shows the same signs: guaranteed or unusually high returns, pressure to act quickly, a request to send money to a person or to a platform you were told about by a stranger, and difficulty withdrawing. Real trading carries risk and no honest service promises a profit. Verify the firm with your regulator before depositing.",
    body: [
      { type: "h2", text: "The common scams" },
      {
        type: "table",
        head: ["Scam", "How it works"],
        rows: [
          ["Account management", "Someone offers to trade your account or your money for a share of the profit, then disappears with the deposit"],
          ["Fake broker or platform", "A site shows growing profits that are only numbers on a screen. Withdrawals are refused or need a further fee"],
          ["Signal groups", "A paid group with edited screenshots of wins, often funded by commissions on your losing trades"],
          ["Guaranteed bots", "A bot sold with a promised daily return, usually a Martingale that works until it empties the account"],
          ["Recovery scams", "After a loss, someone offers to recover your money for an upfront fee"],
          ["Impersonation", "A copy of a real broker's site or support account that collects your login"],
          ["Romance and friendship investing", "A new online contact gradually introduces a trading platform and coaches you to deposit"],
        ],
      },
      { type: "h2", text: "Red flags" },
      {
        type: "list",
        items: [
          "Any guaranteed return, or a fixed percentage per day or week.",
          "Urgency: a limited offer, a bonus that expires today, a slot that is about to close.",
          "You are asked to pay an individual, in crypto, or through a gift card.",
          "You are asked for your broker password, a one-time code, or remote access to your device.",
          "Withdrawals need a tax, a fee or a further deposit first.",
          "Contact began with an unsolicited message on social media or a messaging app.",
          "Profits shown only as screenshots.",
          "The company cannot be found on any regulator's register, or its details do not match.",
        ],
      },
      { type: "h2", text: "How to check a service" },
      {
        type: "steps",
        items: [
          { title: "Find the legal entity", text: "A real firm names its company and its licence on its site. Note both." },
          { title: "Check the regulator's own register", text: "Go to the regulator's website yourself, not through a link the firm gave you, and confirm the name, the licence number and the web address." },
          { title: "Check the web address letter by letter", text: "Clones use a domain one character away from the real one." },
          { title: "Search the name with the word scam or warning", text: "Regulators publish warning lists." },
          { title: "Test a withdrawal early", text: "Deposit a small amount and withdraw it before adding more." },
        ],
      },
      { type: "h2", text: "With bots and trading tools" },
      {
        type: "p",
        text: "A legitimate trading tool connects through your broker's own login page, never asks for your broker password, and leaves your money in your own broker account. It lets you read the bot's rules and try it on a demo account without paying. If a tool asks you to deposit with the seller, or will not run on demo, treat that as the answer.",
      },
      { type: "h2", text: "If you have been scammed" },
      {
        type: "list",
        items: [
          "Stop sending money, including fees to release a withdrawal.",
          "Change your passwords and revoke any access you granted to your broker account.",
          "Tell your bank or card provider immediately; some payments can be disputed.",
          "Report it to your country's financial regulator and to the police.",
          "Ignore anyone who contacts you offering to recover the money for a fee.",
        ],
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "How do I know if a trading platform is legit?",
        a: "It names a legal company and a licence that you can find on the regulator's own register, with a matching web address, and it lets you withdraw without extra fees.",
      },
      {
        q: "Are trading signal groups scams?",
        a: "Not all, but many are. Edited screenshots, guaranteed results and pressure to join a particular broker through their link are the usual signs.",
      },
      {
        q: "Is a trading bot with guaranteed profit real?",
        a: "No. No bot can guarantee a profit. The promise itself is the evidence of a scam.",
      },
      {
        q: "Can I get my money back after a trading scam?",
        a: "Sometimes, through your bank or card provider if you act quickly. Be wary of recovery services that ask for a fee in advance: that is usually a second scam.",
      },
    ],
    related: ["checklist-before-connecting-a-trading-bot", "how-to-choose-a-trading-platform"],
  },

  {
    slug: "what-is-backtesting",
    title: "What is backtesting and why is it important?",
    description:
      "Backtesting runs a trading strategy on past prices to see how it would have performed. How to do it, what it proves, and the four ways it misleads.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Backtesting means applying a trading strategy's exact rules to historical prices to see how it would have performed. It matters because it tests an idea over hundreds of trades in minutes, without risking money. A good backtest shows whether a strategy deserves further testing. It cannot prove that the strategy will work in the future.",
    body: [
      { type: "h2", text: "How to backtest" },
      {
        type: "steps",
        items: [
          { title: "Write exact rules", text: "Entry, exit, stake and stop, with no judgment left in them." },
          { title: "Choose the data", text: "A long period that includes trending, sideways and volatile conditions." },
          { title: "Apply the rules candle by candle", text: "By hand, scrolling the chart forward one candle at a time, or with software." },
          { title: "Record every trade", text: "Including the ones you would rather skip." },
          { title: "Subtract costs", text: "Spread, commission and a realistic allowance for slippage on each trade." },
          { title: "Calculate the measures", text: "Win rate, average win and loss, expected value, maximum drawdown, longest losing streak." },
        ],
      },
      { type: "h2", text: "What a backtest can tell you" },
      {
        type: "list",
        items: [
          "Whether the idea had any edge at all over the period.",
          "How deep its drawdowns went and how long they lasted.",
          "How often it trades, and in which conditions it loses.",
          "Whether the result depends on a handful of exceptional trades.",
        ],
      },
      { type: "h2", text: "Four ways a backtest misleads" },
      {
        type: "table",
        head: ["Problem", "What goes wrong", "Defence"],
        rows: [
          ["Overfitting", "Settings are tuned until the past looks perfect", "Few settings, and test on data not used for tuning"],
          ["Look-ahead bias", "The test uses information that was not available at the time", "Decide only on closed candles"],
          ["Ignoring costs", "Spread and slippage are left out", "Subtract them from every trade"],
          ["Too little data", "A few dozen trades in one market condition", "Hundreds of trades across several conditions"],
        ],
      },
      { type: "h2", text: "In-sample and out-of-sample" },
      {
        type: "p",
        text: "Split the history in two. Develop and adjust the strategy on the first part only. Then run it once, unchanged, on the second part. If the result collapses on data the strategy has never seen, it had learned the past and not the market. This single habit prevents most self-deception in backtesting.",
      },
      { type: "h2", text: "Backtest, then forward test" },
      {
        type: "p",
        text: "A backtest is the first filter. The second is a forward test: running the unchanged rules on live prices with virtual money. It is slower, but it cannot be fitted to the past, and it includes real execution. Only a strategy that passes both deserves a small amount of real money.",
      },
      { type: "h2", text: "On synthetic indices" },
      {
        type: "p",
        text: "Backtesting a direction rule on a random series will find settings that worked on that stretch of history, purely by chance, and they will not carry forward. For synthetic indices the useful test is of the payout and the stake sizing over a large number of trades. FXNOD does not have a backtester; a bot is tested there by running it on a Deriv demo account.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "How far back should I backtest?",
        a: "Far enough to include at least a few hundred trades and several kinds of market. For a daily strategy that may be years; for an intraday one, months.",
      },
      {
        q: "Is backtesting accurate?",
        a: "It is accurate about the past if costs are included and no future information leaks in. It is a guide to the future, not a forecast.",
      },
      {
        q: "What is overfitting?",
        a: "Adjusting a strategy so closely to past data that it captures the noise of that period. It looks excellent in the test and fails afterwards.",
      },
      {
        q: "Can I backtest manually?",
        a: "Yes. Scroll a chart back, move forward one candle at a time, and record each trade your rules would have taken. It is slow and teaches you more than software does.",
      },
    ],
    related: ["how-to-test-a-trading-bot", "how-to-evaluate-a-trading-strategy"],
  },

  {
    slug: "how-to-choose-a-trading-platform",
    title: "How to choose a trading platform",
    description:
      "Choose a trading platform by regulation, total cost, the markets you need, a free demo, reliable withdrawals and tools you will use. A checklist.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Choose a trading platform by checking, in this order: that the company is regulated and you can verify it, what a trade really costs, whether it offers the markets and contract types you want, whether it has a free demo account, how deposits and withdrawals work in your country, and whether its tools suit how you trade.",
    body: [
      { type: "h2", text: "The checklist" },
      {
        type: "table",
        head: ["Check", "What to look for"],
        rows: [
          ["Regulation", "A named legal entity and licence you can confirm on the regulator's own register"],
          ["Protection", "Client money held separately; negative balance protection where it applies"],
          ["Costs", "Spread, commission, overnight charges, and fees for deposits, withdrawals and inactivity"],
          ["Markets", "The instruments and contract types you intend to trade"],
          ["Demo account", "Free, unlimited in time, with the same prices as the live account"],
          ["Payments", "Methods available in your country, with stated processing times"],
          ["Minimums", "Minimum deposit and minimum trade size that suit your budget"],
          ["Tools", "Charts, mobile access, and an API if you plan to automate"],
          ["Support", "Reachable in your language, at the hours you trade"],
        ],
      },
      { type: "h2", text: "Regulation comes first" },
      {
        type: "p",
        text: "Everything else is irrelevant if you cannot get your money out. Find which legal entity you would be a client of, because large brokers operate several under different regulators, and the protections differ between them. Confirm the licence on the regulator's website, reached by your own search and not through the broker's link.",
      },
      { type: "h2", text: "Add up the real cost" },
      {
        type: "p",
        text: "A headline spread says little. Work out the cost of one typical trade of yours: spread plus commission, plus any overnight charge if you hold positions, plus withdrawal fees spread over the trades between withdrawals. For fixed-payout contracts, the cost is in the payout: compare what an even-chance contract pays.",
      },
      { type: "h2", text: "Test before you fund" },
      {
        type: "steps",
        items: [
          { title: "Open the demo", text: "Use it for at least a week, during the hours you plan to trade." },
          { title: "Try the whole journey", text: "Place, modify and close trades on the device you will really use." },
          { title: "Contact support with a real question", text: "Their speed and clarity now is the best you will get later." },
          { title: "Make a small deposit and withdraw it", text: "Before you commit a larger amount." },
        ],
      },
      { type: "h2", text: "If you plan to automate" },
      {
        type: "p",
        text: "Check that the broker offers an API and permits automated trading, and that third-party tools connect through the broker's own login. FXNOD, for example, is a separate terminal that works on top of a Deriv account: Deriv is the broker that holds the money and prices the contracts, and FXNOD provides the trading screen and the bots.",
      },
      { type: "h2", text: "Warning signs" },
      {
        type: "list",
        items: [
          "Bonuses with conditions that restrict withdrawals.",
          "Pressure from an account manager to deposit more.",
          "No clear company name or licence.",
          "Promises about profit of any kind.",
        ],
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is the best trading platform for beginners?",
        a: "One that is regulated, has a free demo account, allows very small trades and explains its costs clearly. The best one for you also depends on your country and the markets you want.",
      },
      {
        q: "What is the difference between a broker and a trading platform?",
        a: "The broker is the company that holds your money and executes your trades. The platform is the software you trade through. Sometimes the same company provides both, and sometimes the platform is a separate product connected to the broker.",
      },
      {
        q: "Is a low minimum deposit a good sign?",
        a: "It makes starting easier and says nothing about safety. Check regulation and withdrawals first.",
      },
    ],
    related: ["how-to-identify-trading-scams", "forex-vs-synthetic-indices"],
  },

  {
    slug: "how-to-avoid-revenge-trading",
    title: "How to avoid revenge trading after a loss",
    description:
      "Revenge trading is trading bigger and faster to win back a loss. Why it happens, the signs you are doing it, and six rules that stop it.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Revenge trading is taking impulsive trades, usually larger and faster, to win back a loss. Avoid it with rules set before the session: a fixed daily loss limit, a compulsory break after two losses in a row, a stake that never rises after a loss, and a session that ends when a limit is reached. The break matters most.",
    body: [
      { type: "h2", text: "Why it happens" },
      {
        type: "p",
        text: "A loss hurts roughly twice as much as an equal gain pleases, a finding known as loss aversion. After a loss the mind stops asking whether the next trade is good and starts asking how to get back to even. Getting back to even quickly needs a bigger stake, and so the worst decisions are made at the worst moment.",
      },
      { type: "h2", text: "Signs you are doing it" },
      {
        type: "list",
        items: [
          "You enter again within a minute of a loss.",
          "The stake is larger than the one you planned.",
          "You are trading a setup that is not in your plan.",
          "You moved or removed a stop.",
          "You are calculating how much you need to win to be level.",
          "You feel angry at the market, as if it took something from you.",
        ],
      },
      { type: "h2", text: "What it costs" },
      {
        type: "p",
        text: "Suppose your plan risks 10 a trade with a daily limit of 30. Three planned losses end the day 30 down: a bad day and nothing more. Now double after each loss to recover: 10, 20, 40, 80. Four losses in a row, which happen regularly, cost 150. One afternoon has removed five ordinary days of risk, and usually the confidence to follow the plan next week.",
      },
      { type: "h2", text: "Six rules that stop it" },
      {
        type: "steps",
        items: [
          { title: "A daily loss limit in money", text: "When it is reached the session is over. Decide it before the first trade." },
          { title: "Two losses, then a break", text: "Leave the screen for at least fifteen minutes. The urge fades faster than you expect." },
          { title: "The stake never rises after a loss", text: "It may stay the same or fall. This one rule makes revenge trading arithmetically impossible." },
          { title: "A written checklist before each entry", text: "If the trade is not a setup on the list, it is not taken." },
          { title: "A maximum number of trades per day", text: "A hard count ends the session even when the loss limit has not been reached." },
          { title: "Accept the loss out loud", text: "Say or write that the loss is finished and is a cost of trading. It sounds trivial and it works." },
        ],
      },
      { type: "h2", text: "Revenge trading with a bot" },
      {
        type: "p",
        text: "A bot does not take revenge, but its owner can. The automated versions are restarting a bot the moment it reaches its stop loss, raising the stake for the next run, or switching a flat stake to Martingale to recover. Martingale is revenge trading written as a rule. Apply the same discipline to runs as to trades: when a session ends on its stop loss, no new session that day.",
      },
      { type: "h2", text: "When it keeps happening" },
      {
        type: "p",
        text: "If you repeatedly break your limits, cannot stop after losses, or are trading money you need, step away from trading and talk to someone you trust or to a gambling support service in your country. That is a sign of something more serious than a technique problem.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is revenge trading?",
        a: "Trading to recover a loss quickly, with larger size and less care than your plan allows. It is driven by emotion and usually deepens the loss.",
      },
      {
        q: "How long should I wait after a losing trade?",
        a: "Long enough for the urge to win it back to pass. Fifteen minutes away from the screen after two losses in a row is a practical minimum.",
      },
      {
        q: "Is doubling my stake after a loss a good idea?",
        a: "No. It is the Martingale method. It recovers small losses often and produces a very large loss when a longer streak arrives, which it will.",
      },
      {
        q: "How do I recover from a big trading loss?",
        a: "Stop trading for a few days, review what happened, and return with a smaller stake than before. Recover through many ordinary trades, never through one large one.",
      },
    ],
    related: ["how-to-control-emotions-while-trading", "what-is-drawdown-in-trading"],
  },
];
