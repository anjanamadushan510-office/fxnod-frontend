/**
 * Automation, continued: comparisons people search for (algorithmic against
 * automated, signals against bots, Martingale against D'Alembert), the
 * things sold around bots (copy trading, expert advisors, AI and ChatGPT
 * bots), and the mechanics behind them (paper trading, slippage, APIs,
 * overfitting). Same shape and rules as the tool guides in `guides.ts`.
 */
import { RISK_NOTE, type Guide } from "./guides";

const TAG = "Automated trading";
const DATE = "2026-10-09";

export const AUTOMATION_GUIDES: Guide[] = [
  {
    slug: "martingale-vs-dalembert",
    title: "Martingale vs D'Alembert: which progression is less dangerous?",
    description:
      "Martingale doubles the stake after a loss; D'Alembert adds one unit. A side-by-side of the stakes, the totals lost in a streak, and what neither changes.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Martingale multiplies the stake after each loss, usually doubling it. D'Alembert adds one unit after a loss and removes one after a win. D'Alembert is far less destructive in a losing streak: ten losses cost 55 units against Martingale's 1,023. Neither changes the average result of the trades, and both raise the stake while losing.",
    body: [
      { type: "h2", text: "Ten losses in a row" },
      {
        type: "table",
        head: ["Loss", "Martingale stake", "Martingale total lost", "D'Alembert stake", "D'Alembert total lost"],
        rows: [
          ["1", "1", "1", "1", "1"],
          ["2", "2", "3", "2", "3"],
          ["3", "4", "7", "3", "6"],
          ["5", "16", "31", "5", "15"],
          ["7", "64", "127", "7", "28"],
          ["10", "512", "1,023", "10", "55"],
        ],
      },
      { type: "h2", text: "How each recovers" },
      {
        type: "table",
        head: ["", "Martingale", "D'Alembert"],
        rows: [
          ["After a loss", "Multiply the stake", "Add one unit"],
          ["After a win", "Return to the base stake", "Remove one unit"],
          ["Wins needed to recover a streak", "One", "About as many wins as losses"],
          ["Growth of the stake", "Exponential", "Linear"],
          ["Typical session", "Smooth, then a crash", "Choppy, with slower damage"],
        ],
      },
      { type: "h2", text: "What they share" },
      {
        type: "list",
        items: [
          "Both increase exposure exactly when things are going badly.",
          "Both rely on wins and losses balancing out before the balance or a limit runs out.",
          "Neither alters the expected result of each trade. On a contract that pays less than its odds justify, both lose on average.",
          "Both need a maximum stake and a session stop loss.",
        ],
      },
      { type: "h2", text: "Which to choose" },
      {
        type: "p",
        text: "If you are going to use a progression, D'Alembert is the less harmful of the two, because a bad streak costs tens of units and not thousands. A flat stake is less harmful again, and it is the only one of the three that shows you what the strategy is really worth.",
      },
      { type: "h2", text: "In practice" },
      {
        type: "p",
        text: "Deriv's own bot builder names both among its preset strategies. FXNOD's dBot offers Martingale, labelled high risk, and a gentle step setting, which raises the stake modestly after a loss and holds at your ceiling. Whatever tool you use, write out the ladder for ten losses before you start.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is D'Alembert safer than Martingale?",
        a: "It loses far less in a losing streak. It is not safe, and it does not improve the average result.",
      },
      {
        q: "Which makes more money?",
        a: "Neither, on average. Martingale wins small amounts more often and loses much more when it fails.",
      },
      {
        q: "Can I combine them?",
        a: "Any combination is still a rule for raising the stake after losses. The arithmetic of the underlying trade is unchanged.",
      },
    ],
    related: ["martingale-strategy-explained", "dalembert-strategy-explained"],
  },

  {
    slug: "trading-bot-stop-loss",
    title: "Trading bot stop loss: how it works and how to set it",
    description:
      "A bot's stop loss ends the session at a total loss you choose. Where it should be enforced, how to size it against the stake, and why it can overshoot.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "A trading bot's stop loss is a limit on the total loss of a session: when the running loss reaches the amount you set, the bot stops trading. It should be set as money before you start, enforced somewhere that keeps working if your device is off, and paired with a stake small enough that an ordinary losing streak does not reach it.",
    body: [
      { type: "h2", text: "Session stop, not trade stop" },
      {
        type: "table",
        head: ["", "Stop loss on a position", "Stop loss on a bot session"],
        rows: [
          ["Closes", "One trade", "The whole run"],
          ["Triggered by", "A price level or loss on that trade", "The total loss since the run started"],
          ["Needed for", "CFDs and multipliers", "Any bot, including options bots"],
        ],
      },
      { type: "h2", text: "Setting it" },
      {
        type: "steps",
        items: [
          { title: "Choose the amount as money", text: "What you can lose in this session without it mattering." },
          { title: "Set the stake against it", text: "One to two per cent of the stop loss for a flat stake." },
          { title: "If the stake can grow, check the ladder", text: "The stop loss should cover the ladder you intend to allow, or the ladder can never complete." },
          { title: "Add a profit target", text: "So the session has a second way to end." },
        ],
      },
      { type: "h2", text: "Where is it enforced?" },
      {
        type: "p",
        text: "This matters more than the number. A stop loss that lives in a browser tab stops working when the tab closes, the laptop sleeps or the connection drops, and the bot may stop too, or may not. A stop loss enforced on a server is checked whatever happens to your device.",
      },
      { type: "h2", text: "Why the loss can pass the stop" },
      {
        type: "p",
        text: "Most bots check the limit before placing each trade. If the session is 1 short of the stop loss and the next stake is 10, the trade is placed, and a loss ends the session 9 beyond the limit. With a flat stake the overshoot is at most one stake. With a stake that grows after losses it can be nearly as large as the stop loss itself.",
      },
      { type: "h2", text: "Trailing and daily limits" },
      {
        type: "list",
        items: [
          "A trailing stop on a session locks in part of a profit by moving the limit up as the session gains. Few simple bot tools offer it.",
          "A daily loss limit across all your sessions is yours to keep. A bot does not know how many runs you have started today.",
        ],
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "A bot cannot be started in dBot or Auto Hub without a stop loss. It is checked on FXNOD's servers before every trade, so it keeps working with the page closed. The check comes before each order, so the last trade can take the session past the stop by up to that trade's stake, and FXNOD also applies a combined loss ceiling across the bots running on one Deriv account.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Should a trading bot always have a stop loss?",
        a: "Yes. Without one the only limit is the account balance.",
      },
      {
        q: "Why did my bot lose more than its stop loss?",
        a: "The limit is checked before each trade, so the final trade can exceed it by its stake. A growing stake makes the overshoot larger.",
      },
      {
        q: "Does a bot's stop loss work when my computer is off?",
        a: "Only if the bot and its limits run on a server. A browser-based bot's limits stop with the browser.",
      },
    ],
    related: ["stop-loss-and-take-profit", "trading-bot-risk-management"],
  },

  {
    slug: "trading-bot-on-phone",
    title: "Can you run a trading bot on your phone?",
    description:
      "You can start and monitor a bot from a phone. Whether it keeps trading when the phone sleeps depends on where the bot runs. What to look for.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Yes, with a condition. A phone is a fine place to start, watch and stop a trading bot. It is a poor place to run one, because phones lock their screens, suspend apps and change networks. Use a bot that runs on the provider's servers, so the phone is only the remote control and the bot continues when the phone is off.",
    body: [
      { type: "h2", text: "Two kinds of bot on a phone" },
      {
        type: "table",
        head: ["", "Runs on the phone or in its browser", "Runs on a server"],
        rows: [
          ["Screen locks", "The bot may pause", "No effect"],
          ["Network changes", "Connection drops", "No effect"],
          ["Battery saver", "Can suspend it", "No effect"],
          ["Stop loss", "Stops when the bot stops", "Keeps being checked"],
          ["The phone's job", "Everything", "Start, watch, stop"],
        ],
      },
      { type: "h2", text: "What to check in a mobile bot" },
      {
        type: "list",
        items: [
          "Where it runs. Ask directly.",
          "Whether a stop loss is required and where it is enforced.",
          "That it signs you in on your broker's own page.",
          "That the app came from the official store, not a file sent in a group.",
          "That it runs on a demo account.",
        ],
      },
      { type: "h2", text: "The fake app problem" },
      {
        type: "p",
        text: "Searches for trading bot APK files are common, and so are fake apps. An app installed from a file outside the official store can read what you type, including your broker login. No bot is worth that. If a tool works in the browser, you do not need to install anything at all.",
      },
      { type: "h2", text: "Good habits on a phone" },
      {
        type: "list",
        items: [
          "Set limits before you start, on a screen large enough to read them properly.",
          "Double-check the stake field. A slipped decimal is easy on a small keyboard.",
          "Do not start bots on impulse because the phone is in your hand.",
          "Use a screen lock, and do not trade on public Wi-Fi.",
        ],
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "FXNOD runs in a phone browser with nothing to install. You can build a bot in dBot or start one in Auto Hub from the phone, and it then runs on FXNOD's servers with its limits. Home shows every bot running on your account, so a bot started on a laptop is visible on the phone.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Will my bot stop if I lock my phone?",
        a: "A bot running in the phone's browser may. A server-based bot continues.",
      },
      {
        q: "Is there a trading bot app for Android?",
        a: "Several exist. Install only from the official store, and prefer tools that work in the browser with your broker's own login.",
      },
      {
        q: "Can I build a bot on a phone?",
        a: "Yes with tools designed for it. Question-based builders are easier on a small screen than block canvases.",
      },
    ],
    related: ["can-you-trade-on-deriv-with-a-phone", "do-you-need-a-vps-for-a-trading-bot"],
  },

  {
    slug: "algorithmic-trading-vs-automated-trading",
    title: "Algorithmic trading vs automated trading: is there a difference?",
    description:
      "Algorithmic trading is deciding by rules; automated trading is executing without a person. They overlap but are not identical. Terms explained.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "The terms overlap and are often used as one. Strictly, algorithmic trading means decisions come from a defined set of rules, and automated trading means orders are placed by software without a person. An algorithm can produce signals that a person executes by hand, and automation can simply execute a person's order. Most retail bots are both.",
    body: [
      { type: "h2", text: "The terms" },
      {
        type: "table",
        head: ["Term", "Means", "Example"],
        rows: [
          ["Algorithmic trading", "Rules decide what and when to trade", "Buy when the 50 average crosses above the 200"],
          ["Automated trading", "Software places the orders", "A bot buying on that signal with no click"],
          ["Systematic trading", "A whole method run by rules, including risk", "A tested strategy with fixed sizing and exits"],
          ["Discretionary trading", "A person decides each trade", "Reading a chart and choosing to enter"],
          ["Execution algorithm", "Software that splits a large order to get a good price", "An institution buying over several hours"],
          ["High-frequency trading", "Automated trading at very high speed", "Firms competing in microseconds"],
        ],
      },
      { type: "h2", text: "How they combine" },
      {
        type: "table",
        head: ["", "Person executes", "Software executes"],
        rows: [
          ["Person decides", "Discretionary trading", "A person's order placed by an execution tool"],
          ["Rules decide", "Signals traded by hand", "A trading bot"],
        ],
      },
      { type: "h2", text: "Why the distinction is useful" },
      {
        type: "list",
        items: [
          "It separates two different skills: designing rules that have an edge, and running them reliably.",
          "A flawless automation of bad rules is still bad trading.",
          "Good rules executed by hand are spoiled by hesitation and fatigue.",
          "When evaluating a product, ask about each: what are the rules, and how are they executed?",
        ],
      },
      { type: "h2", text: "What retail tools offer" },
      {
        type: "p",
        text: "Retail platforms mostly provide the automation and leave the algorithm to you. A bot builder gives you execution, limits and a way to express rules. Whether the rules are any good is the part no tool supplies. FXNOD's dBot is that kind of tool, and Auto Hub supplies fixed, published rules and tells you what they do and do not promise.",
      },
      { type: "h2", text: "What institutions do differently" },
      {
        type: "p",
        text: "Professional algorithmic trading relies on research, data, low costs and speed that retail traders do not have, on real markets with other participants. It is not comparable to running a stake progression on a random index, even though both are called algorithmic.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is algo trading the same as automated trading?",
        a: "In everyday use, nearly. Strictly, algo trading is about how decisions are made and automation is about how orders are placed.",
      },
      {
        q: "Is algorithmic trading profitable?",
        a: "Only when the rules have an edge after costs. Automation does not create one.",
      },
      {
        q: "Do I need to code for algorithmic trading?",
        a: "Not for simple rules: no-code builders cover those. Custom research and complex logic do need programming.",
      },
    ],
    related: ["what-is-automated-trading", "manual-vs-automated-trading"],
  },

  {
    slug: "is-copy-trading-safe",
    title: "Is copy trading safe?",
    description:
      "Copy trading mirrors another trader's positions in your account. The risks behind the track records, what to check, and how to limit the damage.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Copy trading is not safe in the sense of protecting your money. It automatically mirrors another trader's positions in your account, so you take their risk without their judgment. Track records are often short, selected, or built on recovery strategies that look smooth until they collapse. It can be used carefully with small size, a hard loss limit, and scepticism.",
    body: [
      { type: "h2", text: "How it works" },
      {
        type: "p",
        text: "You choose a trader, allocate an amount, and the platform opens and closes positions in your account in proportion to theirs. The trader usually earns a fee, a share of profits, or commission on the volume you generate.",
      },
      { type: "h2", text: "Why track records mislead" },
      {
        type: "table",
        head: ["What you see", "What may be behind it"],
        rows: [
          ["A smooth rising equity curve", "A Martingale or grid strategy that has not yet met its streak"],
          ["A very high win rate", "Small profits taken quickly, large losses left open"],
          ["Spectacular returns over three months", "High risk and good luck; the failed accounts were closed and forgotten"],
          ["Thousands of followers", "Popularity follows recent returns, which follow risk"],
          ["Low stated drawdown", "Losing positions still open and not yet counted"],
        ],
      },
      { type: "h2", text: "What to check" },
      {
        type: "steps",
        items: [
          { title: "Length of history", text: "At least a year, including a bad period." },
          { title: "Maximum drawdown", text: "On equity, not just on closed trades." },
          { title: "Largest position and use of leverage", text: "One trade should not be able to end the account." },
          { title: "Does size grow after losses?", text: "If so, it is a recovery system." },
          { title: "How the trader is paid", text: "A fee on volume rewards activity, not results." },
          { title: "Whether the trader risks their own money", text: "And how much." },
        ],
      },
      { type: "h2", text: "Limiting the damage" },
      {
        type: "list",
        items: [
          "Allocate only money you can lose completely.",
          "Set the platform's stop on your copy relationship, if it has one.",
          "Copy with less leverage than the trader uses.",
          "Spread across unrelated traders, knowing they may still lose together.",
          "Review monthly and stop without sentiment.",
        ],
      },
      { type: "h2", text: "Copy trading and regulation" },
      {
        type: "p",
        text: "In many countries, managing other people's money or advising them needs a licence. Copy trading on a regulated platform sits inside that framework. A stranger offering to trade your account, or asking for your login, sits outside it and is a common scam.",
      },
      { type: "h2", text: "FXNOD does not offer copy trading" },
      {
        type: "p",
        text: "FXNOD's bots follow rules you set or rules that are published in full. They do not copy another person's trades.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Can you lose money copy trading?",
        a: "Yes, including everything you allocate. You take the copied trader's losses in proportion.",
      },
      {
        q: "Is copy trading good for beginners?",
        a: "It is easy to start and teaches little. A beginner cannot judge the risk behind a track record, which is the main skill needed.",
      },
      {
        q: "How do copy traders make money?",
        a: "Usually from fees, a share of followers' profits, or commission on followers' trading volume.",
      },
    ],
    related: ["trading-signals-vs-bots", "how-to-identify-trading-scams"],
  },

  {
    slug: "trading-signals-vs-bots",
    title: "Trading signals vs bots: what is the difference?",
    description:
      "A signal tells you what to trade and you place it. A bot places trades itself from rules. How they compare on control, speed, cost and risk.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "A trading signal is a suggestion, sent by a person or a program, to make a specific trade: you decide whether to take it and place it yourself. A bot places trades automatically from rules. Signals keep you in control and depend on someone else's judgment. Bots remove hesitation and depend entirely on their rules.",
    body: [
      { type: "h2", text: "Side by side" },
      {
        type: "table",
        head: ["", "Signals", "Bots"],
        rows: [
          ["Who decides", "The signal provider", "The rules"],
          ["Who places the trade", "You", "The software"],
          ["Speed", "Delayed by reading and typing", "Immediate"],
          ["Can you see the reasoning?", "Often not", "Yes, if the rules are published"],
          ["Position size", "Yours to choose, often badly", "Set in advance"],
          ["Typical cost", "A subscription", "Free to a fee"],
          ["Main failure", "Late entries, skipped losers, an unaccountable provider", "A bad rule followed perfectly"],
        ],
      },
      { type: "h2", text: "The problem with most signal groups" },
      {
        type: "list",
        items: [
          "Results are reported by the seller, often as screenshots.",
          "Losing signals are deleted or never mentioned.",
          "By the time you act, the price has moved.",
          "Many groups exist to sign people up through a broker referral link.",
          "You learn nothing about why a trade was taken.",
        ],
      },
      { type: "h2", text: "The problem with most bots" },
      {
        type: "list",
        items: [
          "Hidden rules, usually a stake that grows after losses.",
          "A short winning record presented as proof.",
          "No stop loss, or one that depends on your browser.",
        ],
      },
      { type: "h2", text: "How to judge either" },
      {
        type: "steps",
        items: [
          { title: "Can I see the rules or the reasoning?", text: "If not, I cannot assess the risk." },
          { title: "Can I test it without paying or depositing?", text: "On a demo account, for a few hundred trades." },
          { title: "How is the provider paid?", text: "By my results, my subscription, or my trading volume?" },
          { title: "What is the worst case?", text: "Largest loss, longest losing run, deepest drawdown." },
        ],
      },
      { type: "h2", text: "Signals fed into bots" },
      {
        type: "p",
        text: "Some services connect the two: a signal triggers an automatic order. That removes the delay and keeps the central weakness, which is trusting a source you cannot inspect with a position size you may not have chosen.",
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "FXNOD does not sell signals. dBot runs rules you set, and Auto Hub runs rules that are written out in full before you start, both with a required stop loss and a demo mode.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Are trading signals worth paying for?",
        a: "Rarely. Results are self-reported and delayed, and many groups earn from referrals instead of from being right.",
      },
      {
        q: "Is a bot better than signals?",
        a: "A bot with visible rules can be tested, which most signals cannot. Neither has an edge by default.",
      },
      {
        q: "Are free signal groups safe?",
        a: "Free groups are usually paid by broker referrals, which reward your trading volume and not your results.",
      },
    ],
    related: ["is-copy-trading-safe", "how-to-choose-a-trading-bot"],
  },

  {
    slug: "what-is-an-expert-advisor",
    title: "What is an expert advisor (EA) in trading?",
    description:
      "An expert advisor is a program that trades automatically inside MetaTrader 4 or 5. How it works, what it needs to run, and how to judge one.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "An expert advisor, or EA, is a program that runs inside the MetaTrader 4 or MetaTrader 5 trading platform and places trades automatically according to its code. It is the MetaTrader name for a trading bot. An EA trades only while the terminal it is attached to is running, which is why they are usually hosted on a VPS.",
    body: [
      { type: "h2", text: "How an EA works" },
      {
        type: "steps",
        items: [
          { title: "It is attached to a chart", text: "In the MetaTrader terminal, on a chosen market and timeframe." },
          { title: "It reads each new price", text: "And checks its conditions." },
          { title: "It sends orders", text: "Opening, modifying and closing positions on that account." },
          { title: "It stops when the terminal stops", text: "Unless the terminal runs on an always-on machine." },
        ],
      },
      { type: "h2", text: "EA, indicator and script" },
      {
        type: "table",
        head: ["Type", "What it does", "Places trades?"],
        rows: [
          ["Expert advisor", "Runs continuously and manages trades", "Yes"],
          ["Indicator", "Draws calculations on the chart", "No"],
          ["Script", "Runs once to do a single task", "Only that once"],
        ],
      },
      { type: "h2", text: "The strategy tester" },
      {
        type: "p",
        text: "MetaTrader includes a tester that runs an EA over past prices. It is useful and easy to misuse. Optimising settings until the past looks perfect produces an EA fitted to history, and results depend heavily on the quality of the data and on spread and slippage assumptions. Always test on a period the settings were not tuned on, then on a demo account.",
      },
      { type: "h2", text: "Judging an EA someone is selling" },
      {
        type: "list",
        items: [
          "Is the logic described? Grid and Martingale EAs are the most common and the most dangerous.",
          "Is there a long, verified live record, not a backtest?",
          "What was the largest drawdown on equity?",
          "Does it need a large balance to survive its own ladder?",
          "Can you run it on demo first?",
          "Does the seller ask for account access? Walk away.",
        ],
      },
      { type: "h2", text: "What an EA needs" },
      {
        type: "list",
        items: [
          "A broker offering MetaTrader and allowing automated trading.",
          "The terminal running without interruption, usually on a VPS.",
          "Monitoring. Terminals crash, updates restart machines, and brokers change symbols.",
        ],
      },
      { type: "h2", text: "EAs and FXNOD" },
      {
        type: "p",
        text: "FXNOD is not MetaTrader and does not run expert advisors. Its bots trade options and multipliers on a Deriv account through Deriv's API, run on FXNOD's servers, and are built without code. If you want an EA on Deriv, that is Deriv MT5, which is a separate platform.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is an expert advisor the same as a trading bot?",
        a: "Yes. It is the name for a trading bot that runs inside MetaTrader.",
      },
      {
        q: "Do I need a VPS for an EA?",
        a: "To trade around the clock, yes, or another always-on computer. The EA stops when the terminal closes.",
      },
      {
        q: "Are free EAs any good?",
        a: "Some are honest experiments. Many are grid or Martingale systems. Judge by the logic and a demo test, not the price.",
      },
    ],
    related: ["do-you-need-a-vps-for-a-trading-bot", "what-is-backtesting"],
  },

  {
    slug: "do-ai-trading-bots-work",
    title: "Do AI trading bots work?",
    description:
      "Most products sold as AI trading bots are ordinary rule-based bots with a label. What AI can and cannot do in trading, and how to test a claim.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Most retail products sold as AI trading bots are rule-based bots with AI in the name, and they work no better than their rules. Real machine learning is used in professional trading, with large data, research teams and modest, hard-won edges. No AI can predict a random market, and none can honestly guarantee returns.",
    body: [
      { type: "h2", text: "What AI means in these products" },
      {
        type: "table",
        head: ["Claim", "Usually means"],
        rows: [
          ["AI-powered bot", "Fixed rules, often with a stake progression"],
          ["Machine learning signals", "An indicator combination, sometimes tuned on past data"],
          ["Neural network predicts the market", "A model fitted to history, untested on new data"],
          ["Learns as it trades", "A parameter that changes with recent results"],
          ["99% accuracy", "A high-chance contract or a recovery system"],
        ],
      },
      { type: "h2", text: "What AI can do" },
      {
        type: "list",
        items: [
          "Find weak, real patterns in large amounts of market data, when they exist.",
          "Process news and text faster than a person.",
          "Help a trader write code, summarise research and review a journal.",
          "Manage execution to reduce costs.",
        ],
      },
      { type: "h2", text: "What it cannot do" },
      {
        type: "list",
        items: [
          "Predict a series generated at random. There is nothing to learn from a synthetic index's past ticks.",
          "Beat the cost built into a contract by cleverness alone.",
          "Stay ahead for ever. Real edges are small, competed away, and need constant research.",
          "Make its own results trustworthy. A model can fit the past perfectly and fail tomorrow.",
        ],
      },
      { type: "h2", text: "Testing a claim" },
      {
        type: "steps",
        items: [
          { title: "Ask what the model was trained on, and tested on", text: "No answer means no model worth the name." },
          { title: "Ask for a long live record", text: "Not a backtest, and not a month." },
          { title: "Run it on demo", text: "Several hundred trades at a flat stake." },
          { title: "Compare with chance", text: "If it wins no more often than random entry, the AI adds nothing." },
          { title: "Look at the stake", text: "If it grows after losses, the record is a recovery system's." },
        ],
      },
      { type: "h2", text: "Why the label sells" },
      {
        type: "p",
        text: "AI suggests an advantage nobody can check. A guaranteed return, a secret model and pressure to deposit are the same warning signs they always were, with a newer word attached.",
      },
      { type: "h2", text: "FXNOD's bots" },
      {
        type: "p",
        text: "FXNOD's bots are rule-based, and say so. dBot runs the rules you set. Auto Hub's rules are written out in full, including the statement that a fade rule decides when the bot enters and is not a promise about the next tick.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Can AI predict the market?",
        a: "Not reliably. On real markets it can find small, temporary advantages with great effort. On random markets it can find none.",
      },
      {
        q: "Are AI trading bots legit?",
        a: "The technology is real. Retail products that promise profits with it are mostly marketing, and some are scams.",
      },
      {
        q: "Do AI bots work for beginners?",
        a: "A beginner cannot verify the claims, which makes these products especially risky for them.",
      },
    ],
    related: ["chatgpt-trading-bot", "are-trading-bots-worth-it"],
  },

  {
    slug: "chatgpt-trading-bot",
    title: "ChatGPT trading bots: what an AI assistant can and cannot do",
    description:
      "An AI assistant can help you write and explain bot code and review your results. It cannot see live prices or predict them. What to use it for.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "An AI assistant such as ChatGPT or Claude is not a trading bot. It can help you write or explain code, turn a rule into exact conditions, check arithmetic and review a trading journal. It cannot predict prices, and it does not watch a live market unless you build that around it. Products sold as ChatGPT bots are ordinary bots.",
    body: [
      { type: "h2", text: "Useful things to ask an assistant" },
      {
        type: "table",
        head: ["Task", "Example request"],
        rows: [
          ["Make a rule exact", "Turn this idea into entry, exit and stake rules with no judgment calls"],
          ["Explain code", "What does this strategy file do to the stake after a loss?"],
          ["Write code", "A script that calculates win rate and drawdown from this trade list"],
          ["Check arithmetic", "What win rate does a payout of 19.50 on a stake of 10 need?"],
          ["Review a journal", "Group these trades by setup and show which group loses"],
          ["Explain a concept", "How does a Martingale ladder grow over ten losses?"],
        ],
      },
      { type: "h2", text: "What it cannot do" },
      {
        type: "list",
        items: [
          "Tell you what the next price will be. It has no such knowledge.",
          "Guarantee that code it wrote is correct. It can make confident mistakes.",
          "Know your broker's current rules, limits or fees unless you supply them.",
          "Replace testing. A strategy it suggests is an idea, not a result.",
        ],
      },
      { type: "h2", text: "If you build a bot with its help" },
      {
        type: "steps",
        items: [
          { title: "Read every line", text: "Especially how the stake is set and changed." },
          { title: "Never paste a password or an API token into a chat", text: "Use placeholders and fill them in privately." },
          { title: "Run on demo first", text: "For several hundred trades." },
          { title: "Add limits yourself", text: "A stop loss and a maximum stake, and check they work." },
          { title: "Treat any strategy claim as untested", text: "Until your own numbers say otherwise." },
        ],
      },
      { type: "h2", text: "Products sold as ChatGPT bots" },
      {
        type: "p",
        text: "Downloads, Telegram bots and apps that use the name of a well-known AI are not made by its developer and do not gain predictive power from the name. They carry the usual risks: hidden stake progressions, fake apps that steal logins, and referral schemes.",
      },
      { type: "h2", text: "A good use: checking a bot before you run it" },
      {
        type: "p",
        text: "Paste a strategy's rules into an assistant and ask what the largest stake can become after ten losses, and what the session stop loss would need to be. That is arithmetic it does well, and it is the question most people skip.",
      },
      { type: "h2", text: "FXNOD" },
      {
        type: "p",
        text: "FXNOD's bots are not AI products and do not use a chat assistant to decide trades. FXNOD publishes its guides in a form AI assistants can read, so that when someone asks one how these tools work, the answer can be accurate.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Can ChatGPT trade for me?",
        a: "Not by itself. It produces text. Trading needs software connected to a broker, which you would have to build and test.",
      },
      {
        q: "Can an AI assistant write a profitable strategy?",
        a: "It can write a strategy. Whether it is profitable is only known after testing, and most ideas are not.",
      },
      {
        q: "Is it safe to give an AI assistant my API token?",
        a: "No. Never paste credentials into a chat. Use placeholders.",
      },
    ],
    related: ["do-ai-trading-bots-work", "deriv-api-token-explained"],
  },

  {
    slug: "overfitting-in-trading",
    title: "Overfitting in trading: why perfect backtests fail",
    description:
      "Overfitting is tuning a strategy so closely to past data that it learns the noise. How to recognise it, the tests that expose it, and how to avoid it.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Overfitting is adjusting a strategy so closely to past data that it captures the accidents of that period instead of anything lasting. An overfitted strategy looks excellent in a backtest and fails on new data. The defences are few settings, testing on data not used for tuning, and distrust of any result that looks too good.",
    body: [
      { type: "h2", text: "How it happens" },
      {
        type: "list",
        items: [
          "Trying many settings and keeping the best one.",
          "Adding a rule to remove each losing trade in the test.",
          "Testing many ideas on the same data until one works.",
          "Choosing the market, timeframe and period after seeing the results.",
        ],
      },
      { type: "h2", text: "Signs of an overfitted strategy" },
      {
        type: "table",
        head: ["Sign", "Why it is suspicious"],
        rows: [
          ["Many parameters", "Each one is another way to fit noise"],
          ["Very specific values, such as RSI 13.7", "Nothing real is that precise"],
          ["Results collapse if a setting moves slightly", "A real effect is robust to small changes"],
          ["A profit factor far above 2 on few trades", "Too good for the sample size"],
          ["Works on one market and one period only", "It has learned that period"],
          ["A rule that exists to skip one bad week", "It was added after the fact"],
        ],
      },
      { type: "h2", text: "The tests that expose it" },
      {
        type: "steps",
        items: [
          { title: "Out-of-sample test", text: "Tune on one part of the history. Run once, unchanged, on another." },
          { title: "Neighbour test", text: "Nudge each setting. Results should degrade gently, not fall off a cliff." },
          { title: "Other markets and periods", text: "A sound idea usually works, less well, elsewhere." },
          { title: "Forward test", text: "Live prices with virtual money. It cannot be fitted to the past." },
        ],
      },
      { type: "h2", text: "Why testing many ideas is itself a trap" },
      {
        type: "p",
        text: "Test twenty random strategies and one will look good by chance at ordinary confidence levels. The more you search, the more convincing your best result becomes and the less it means. Count how many variations you tried, and demand more from the winner accordingly.",
      },
      { type: "h2", text: "On random markets" },
      {
        type: "p",
        text: "A random series is all noise, so any rule that looks profitable on its past is overfitted by definition. Optimising a bot's entry settings on a synthetic index will always find a best setting. It will not carry forward.",
      },
      { type: "h2", text: "Habits that prevent it" },
      {
        type: "list",
        items: [
          "Start from an idea with a reason behind it, then test. Not the reverse.",
          "Use as few settings as possible, at round, conventional values.",
          "Decide the test before you run it, and run it once.",
          "Keep a part of the data that you never look at until the end.",
        ],
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is overfitting in simple terms?",
        a: "Making a strategy fit the past so exactly that it has memorised history instead of learning anything that repeats.",
      },
      {
        q: "How do I know if my strategy is overfitted?",
        a: "Run it unchanged on data it has never seen. If the results collapse, it was.",
      },
      {
        q: "Is optimisation always bad?",
        a: "No. Light tuning checked on unseen data is reasonable. Searching for the perfect setting is not.",
      },
    ],
    related: ["what-is-backtesting", "how-to-evaluate-a-trading-strategy"],
  },

  {
    slug: "what-is-paper-trading",
    title: "What is paper trading and how do you do it?",
    description:
      "Paper trading is practising with pretend money at real prices. How it works, how it differs from a demo account, and how to make it worth doing.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Paper trading is practising trades with pretend money at real market prices. The name comes from writing trades on paper. Today it usually means a demo or simulated account on a trading platform. It costs nothing, teaches the mechanics and lets you test a method. It cannot teach how you will behave when the money is real.",
    body: [
      { type: "h2", text: "Paper trading and demo accounts" },
      {
        type: "table",
        head: ["", "Paper trading", "Demo account"],
        rows: [
          ["Originally", "Trades written down by hand", "A broker's simulated account"],
          ["Today", "Often a simulator inside a charting tool", "Virtual funds on the broker's own platform"],
          ["Orders", "Simulated fills", "Simulated fills on the broker's prices"],
          ["In everyday use", "The two terms mean the same thing", "The two terms mean the same thing"],
        ],
      },
      { type: "h2", text: "How to do it" },
      {
        type: "steps",
        items: [
          { title: "Open a demo or paper account", text: "With the broker or tool you plan to use." },
          { title: "Set a realistic balance", text: "The amount you would really deposit." },
          { title: "Write your rules first", text: "Entry, stake, exit, daily limit." },
          { title: "Trade them without changing them", text: "For at least a hundred trades." },
          { title: "Record and review", text: "Win rate, average win and loss, drawdown, and how often you broke a rule." },
        ],
      },
      { type: "h2", text: "What it is good for" },
      {
        type: "list",
        items: [
          "Learning how orders and contracts work, at no cost.",
          "Finding out whether a method has any merit before paying to find out.",
          "Testing a bot's behaviour.",
          "Building the habit of journaling.",
        ],
      },
      { type: "h2", text: "Where it flatters you" },
      {
        type: "list",
        items: [
          "Fills are perfect. Real orders slip, especially in fast markets.",
          "There is no fear, so you hold and exit as the plan says.",
          "A large pretend balance hides the effect of a losing streak.",
          "It is easy to restart after a bad run and forget it happened.",
        ],
      },
      { type: "h2", text: "Make it count" },
      {
        type: "p",
        text: "Paper trade as if the loss were real: realistic size, no resets, every trade written down. Then move to the smallest real stake available. The step from paper to tiny real money teaches more than another month on paper.",
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "Selecting your Deriv demo account in FXNOD is paper trading: manual trades and bots use Deriv's virtual funds. Auto Hub's Shadow Fade also uses shadow trades, entries that are scored without being bought at all, to decide when its real trades begin.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is paper trading the same as a demo account?",
        a: "In everyday use, yes. Both mean trading simulated money at real prices.",
      },
      {
        q: "Is paper trading realistic?",
        a: "The prices are. The fills are better than real ones and your emotions are absent.",
      },
      {
        q: "How long should I paper trade?",
        a: "Until you have at least a hundred trades with fixed rules and know your numbers.",
      },
    ],
    related: ["how-long-should-you-demo-trade", "how-to-test-a-trading-bot"],
  },

  {
    slug: "what-is-slippage-in-trading",
    title: "What is slippage in trading?",
    description:
      "Slippage is the gap between the price you expected and the price you got. Why it happens, when it is worst, how to reduce it, and how it affects bots.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Slippage is the difference between the price you expected for a trade and the price at which it was actually filled. It happens because prices move between the moment you send an order and the moment it executes, or because there is not enough available at your price. It is largest in fast or thin markets and can be positive or negative.",
    body: [
      { type: "h2", text: "An example" },
      {
        type: "p",
        text: "You press buy with the price showing 1.1000. By the time the order reaches the market the best offer is 1.1002, and you are filled there. The slippage is 2 pips against you. On a mini lot that is about 2 in money. The same mechanism moves a stop loss: a stop at 1.0950 in a falling market may fill at 1.0945.",
      },
      { type: "h2", text: "When it is worst" },
      {
        type: "table",
        head: ["Situation", "Why"],
        rows: [
          ["Major news releases", "Prices jump and quotes are withdrawn"],
          ["Market open and weekend gaps", "The price reopens away from the close"],
          ["Thin hours and holidays", "Few orders to trade against"],
          ["Large orders", "They use up the best prices"],
          ["Sudden spikes", "The price skips levels entirely"],
        ],
      },
      { type: "h2", text: "Which orders slip" },
      {
        type: "table",
        head: ["Order", "Slippage"],
        rows: [
          ["Market order", "Yes: you accept the next available price"],
          ["Stop order", "Yes: it becomes a market order when triggered"],
          ["Limit order", "No: it fills at your price or better, or not at all"],
        ],
      },
      { type: "h2", text: "Reducing it" },
      {
        type: "list",
        items: [
          "Trade liquid markets in their busy hours.",
          "Stay out around major news.",
          "Use limit orders for entries where missing the trade is acceptable.",
          "Keep positions small relative to the market.",
          "Allow for it in testing: subtract a realistic amount from every simulated trade.",
        ],
      },
      { type: "h2", text: "Slippage and bots" },
      {
        type: "p",
        text: "A backtest or demo usually fills at the price shown. A live bot does not always, and a strategy with a small edge per trade can be turned into a losing one by a fraction of a point on each fill. This is one of the commonest reasons a tested bot disappoints live on real markets.",
      },
      { type: "h2", text: "Fixed-payout contracts" },
      {
        type: "p",
        text: "Options work differently: you buy a contract at a quoted price, and it settles on defined ticks. The equivalent effect is that the entry spot is the first tick after the broker processes the contract, not the price you saw when you pressed Buy. Deriv also notes that slippage can affect the closing price of a multiplier.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is slippage always bad?",
        a: "No. It can go in your favour. Over many trades in fast markets it tends to cost more than it gives.",
      },
      {
        q: "How do I avoid slippage?",
        a: "Limit orders avoid it at the cost of sometimes not filling. Otherwise trade liquid markets and avoid news.",
      },
      {
        q: "What is slippage tolerance?",
        a: "A setting on some platforms for the most slippage you accept. Beyond it the order is rejected.",
      },
    ],
    related: ["market-orders-vs-limit-orders", "what-is-spread-in-trading"],
  },

  {
    slug: "what-is-a-trading-api",
    title: "What is a trading API?",
    description:
      "A trading API lets software read prices and place orders at a broker. How it works, the kinds you meet, what it costs, and how to use one safely.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "A trading API is an interface a broker provides so that software, instead of a person clicking, can read prices and account data and place orders. Every trading bot uses one. You authorise an application to use the API on your account, with a token or an approval page, and you can withdraw that authorisation.",
    body: [
      { type: "h2", text: "What it carries" },
      {
        type: "table",
        head: ["Kind of request", "Example"],
        rows: [
          ["Market data", "Send me every tick of this market"],
          ["Account data", "What is my balance, and what is open?"],
          ["Pricing", "What would this contract pay?"],
          ["Orders", "Buy this, sell that"],
          ["History", "List my trades for last month"],
        ],
      },
      { type: "h2", text: "Two styles you will meet" },
      {
        type: "table",
        head: ["", "REST", "WebSocket"],
        rows: [
          ["How it works", "Ask, receive one answer", "Open a connection and receive a stream"],
          ["Good for", "Placing an order, fetching history", "Live prices and updates"],
          ["If the link drops", "The next request simply fails", "The stream stops and must be reopened"],
        ],
      },
      { type: "h2", text: "Authorisation" },
      {
        type: "list",
        items: [
          "An API token or key: you create it, choose its permissions and give it to the application.",
          "OAuth: you sign in on the broker's own page and approve the application there.",
          "Either way, grant trading permissions only, and never anything that moves money out.",
        ],
      },
      { type: "h2", text: "Limits and costs" },
      {
        type: "list",
        items: [
          "Brokers usually offer the API free to account holders.",
          "They limit how many requests an application may send. A bot that exceeds the limit is refused for a time.",
          "Some data, such as deep history or premium feeds, may be charged.",
          "The trading itself costs what it always costs.",
        ],
      },
      { type: "h2", text: "Do you need to use one directly?" },
      {
        type: "p",
        text: "Only if you write your own software. Most traders use an application that talks to the API for them. Building directly gives full control and full responsibility: reconnection, error handling, rate limits and the safety of your credentials become your job.",
      },
      { type: "h2", text: "Safety" },
      {
        type: "list",
        items: [
          "Keep keys out of chats, screenshots and shared code.",
          "One key per application, deleted when no longer used.",
          "Test against a demo account before a real one.",
          "Build limits into the software, not only into your intentions.",
        ],
      },
      { type: "h2", text: "FXNOD and Deriv's API" },
      {
        type: "p",
        text: "FXNOD is an application built on Deriv's API. You authorise it by signing in on Deriv's own page, so there is no key for you to create or keep, and FXNOD handles the connection, the reconnection and the limits. You can withdraw the authorisation from Connected Accounts or from your Deriv settings.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is a trading API free?",
        a: "Usually, for the broker's own clients. Premium data can cost extra.",
      },
      {
        q: "What is the difference between a broker API and a trading API?",
        a: "In practice they are the same thing: the broker's interface for software to trade and read data.",
      },
      {
        q: "Is it safe to use a trading API?",
        a: "The API is as safe as the permissions you grant and how you protect the credentials.",
      },
    ],
    related: ["how-trading-bots-connect-to-platforms", "deriv-api-token-explained"],
  },
];
