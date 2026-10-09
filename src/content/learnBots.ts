/**
 * Automated-trading guides: the questions people ask before and after they
 * run a bot. Same shape and same rules as the tool guides in `guides.ts`.
 *
 * Where one of these says what FXNOD does, it is a statement about the
 * product and changes in the commit that changes the product. Nothing here
 * states a figure about Deriv (fees, limits, minimums): those are Deriv's to
 * publish and they change without a release of ours.
 */
import { RISK_NOTE, type Guide } from "./guides";

const TAG = "Automated trading";
const DATE = "2026-10-09";

export const BOT_GUIDES: Guide[] = [
  {
    slug: "what-is-automated-trading",
    title: "What is automated trading and how does it work?",
    description:
      "Automated trading means a program places trades from rules you set in advance. How a bot decides, what it needs to run, and what it cannot do for you.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Automated trading is trading done by a program instead of by hand. You write the rules once: what to buy, when to enter, how much to stake and when to stop. The program, usually called a trading bot, watches the market and places every trade that matches those rules. It removes hesitation and fatigue. It does not remove risk.",
    body: [
      { type: "h2", text: "The four decisions every bot makes" },
      {
        type: "p",
        text: "Strip away the branding and every trading bot, simple or sophisticated, answers the same four questions on a loop.",
      },
      {
        type: "table",
        head: ["Decision", "What it means", "Example"],
        rows: [
          ["What to trade", "The market and the contract", "Rise/Fall on a volatility index, five ticks long"],
          ["When to enter", "The signal that triggers a trade", "After three ticks in the same direction"],
          ["How much to stake", "The size of each trade and how it changes", "The same stake every time"],
          ["When to stop", "The limits that end the session", "Stop at a loss of 20 or a profit of 10"],
        ],
      },
      {
        type: "p",
        text: "Beginners spend nearly all their attention on the second row. Experienced traders spend it on the third and fourth, because those two decide how long the account survives.",
      },
      { type: "h2", text: "How the loop runs" },
      {
        type: "steps",
        items: [
          { title: "Read the market", text: "The bot receives each new price, called a tick, or each new candle." },
          { title: "Check the entry rule", text: "If the rule is not met, it waits. Waiting is a normal state for a bot, not a fault." },
          { title: "Check the limits", text: "Before any order, a well-built bot checks the stop loss, the profit target and the stake ceiling." },
          { title: "Place the order", text: "It sends the trade to the broker through the broker's API and records the result when the contract settles." },
          { title: "Repeat", text: "The result feeds the next stake and the running profit or loss, and the loop starts again." },
        ],
      },
      { type: "h2", text: "Where a bot runs matters" },
      {
        type: "p",
        text: "Some bots run inside your browser tab. Close the tab, lose the connection or let the laptop sleep, and the bot stops, sometimes with a trade still open and no stop loss watching it. Other bots run on a server and keep working with your device switched off. FXNOD's bots are the second kind: a bot started in dBot or Auto Hub runs on FXNOD's servers, and its limits are checked there before every trade.",
      },
      { type: "h2", text: "What automation is good at, and what it is not" },
      {
        type: "list",
        items: [
          "Good at: following a rule exactly, every time, at any hour, without fear after a loss or greed after a win.",
          "Good at: speed. Contracts that last a few ticks are hard to trade consistently by hand.",
          "Not good at: knowing that the rule has stopped working. A bot applies a losing rule as faithfully as a winning one.",
          "Not good at: creating an edge. If the strategy has no advantage, automating it only loses faster.",
        ],
      },
      { type: "h2", text: "Who it suits" },
      {
        type: "p",
        text: "Automated trading suits someone who can describe their strategy as rules with no judgment calls in them, and who is prepared to test those rules on a demo account before funding them. If you cannot yet say exactly when you would enter and exit, trade by hand on demo first until you can.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is automated trading legal?",
        a: "Using a bot on your own account is permitted by many brokers, including Deriv, which provides an API for it. The rules depend on your broker and your country, so check both before you trade.",
      },
      {
        q: "Do I need to know how to code?",
        a: "Not any more. Visual and question-based builders let you set the rules without writing code. Coding helps only when you want logic no builder offers.",
      },
      {
        q: "Is automated trading profitable?",
        a: "It is exactly as profitable as the strategy being automated. A bot adds discipline and speed. It adds no edge of its own, and most strategies that look good over twenty trades fail over two thousand.",
      },
      {
        q: "Is a trading bot the same as an AI?",
        a: "Usually not. Most trading bots follow fixed rules a person wrote. They do not learn or predict. Treat any product that claims an AI predicts the market with suspicion.",
      },
    ],
    related: ["how-to-start-automated-trading-on-deriv", "manual-vs-automated-trading"],
  },

  {
    slug: "how-to-start-automated-trading-on-deriv",
    title: "How to start automated trading on Deriv",
    description:
      "Start automated trading on Deriv in six steps: open a demo account, pick a bot tool, build or choose a bot, set limits, test on demo, then go live small.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "To start automated trading on Deriv, open a Deriv account and use its demo balance, choose a bot tool that connects through Deriv's API, build or pick a bot, set a stop loss and a stake, and run it on demo until you have seen it both win and lose. Move to real money only then, with a small stake.",
    body: [
      { type: "h2", text: "What you need" },
      {
        type: "list",
        items: [
          "A Deriv account. Every Deriv login includes a demo account with virtual funds.",
          "A bot tool. Deriv has its own block-based bot builder, and independent tools such as FXNOD connect to your account through Deriv's API.",
          "A rule you can state in one sentence. If you cannot, start from a template and change one thing at a time.",
        ],
      },
      { type: "h2", text: "Six steps, in order" },
      {
        type: "steps",
        items: [
          {
            title: "Open the demo account",
            text: "Sign up on Deriv and switch to the demo account. Do not deposit yet. Nothing in the next four steps needs real money.",
          },
          {
            title: "Connect a bot tool",
            text: "With FXNOD, open Connected Accounts and press Connect Deriv. You sign in on Deriv's own page and approve access, so your Deriv password never reaches FXNOD.",
          },
          {
            title: "Build a bot or pick one",
            text: "In dBot you answer questions: what to buy, which markets, when to enter, how to size the stake. In Auto Hub you pick a bot whose rules are already written and only set the stake and limits.",
          },
          {
            title: "Set the limits before the stake",
            text: "Decide the most you will lose in the session, then choose a stake small enough that a normal losing streak does not reach it. A stop loss of 20 with a stake of 5 ends after four losses in a row, which is an ordinary event.",
          },
          {
            title: "Run it on demo",
            text: "Let it trade at least a hundred contracts. Write down the win rate, the longest losing streak and the deepest point the balance reached.",
          },
          {
            title: "Go live small",
            text: "Switch to a real account only when the demo result is one you would accept in money. Start with the smallest stake the contract allows.",
          },
        ],
      },
      { type: "h2", text: "Choosing a first market and contract" },
      {
        type: "p",
        text: "Most people who automate on Deriv start on synthetic indices, because they trade at every hour and tick steadily. Rise/Fall and Even/Odd are the simplest contracts to reason about: two outcomes, one question. Digit contracts such as Matches/Differs and Over/Under settle in a single tick, which makes a bot fast in both directions. Fast is not an advantage when the rule is losing.",
      },
      { type: "h2", text: "The mistake nearly everyone makes" },
      {
        type: "p",
        text: "The common first session goes like this: a Martingale bot wins twenty small trades in a row, the trader moves to real money that evening, and the first long losing streak takes the whole balance. Twenty wins proves nothing about a strategy that wins often and loses large. Read the losing streak arithmetic before you choose any stake-doubling setting.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Can I run a Deriv bot for free?",
        a: "You can build and test one for free. FXNOD's dBot and Auto Hub have no subscription and no sign-up fee, and a Deriv demo account trades virtual funds. Trading a real account always puts your own stake at risk.",
      },
      {
        q: "Can I start with a small amount?",
        a: "Yes, and you should. Deriv sets a minimum stake for each contract, which the order form shows. Start at that minimum when you first go live.",
      },
      {
        q: "Can I run a Deriv bot from a phone?",
        a: "Yes. FXNOD runs in a phone browser, and because its bots run on FXNOD's servers, the phone only starts and watches the bot. It does not have to stay awake.",
      },
      {
        q: "Does the bot need my Deriv password?",
        a: "No, and you should never give it to one. A legitimate tool sends you to Deriv's own login page and receives a permission you can withdraw.",
      },
    ],
    related: ["connect-deriv-account", "build-a-deriv-bot-with-dbot"],
  },

  {
    slug: "how-to-choose-a-trading-bot",
    title: "How to choose the right trading bot",
    description:
      "Choose a trading bot by five tests: can you read its rules, who controls the stake, where it runs, how it connects, and what happens when it loses.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Choose a trading bot whose rules you can read and explain, whose stake and stop loss you control, that connects through your broker's official login rather than your password, and that you can test on a demo account first. Ignore win-rate claims. A bot is the right one when you understand exactly how it loses.",
    body: [
      { type: "h2", text: "Five tests, in order of importance" },
      {
        type: "table",
        head: ["Test", "Good sign", "Walk away if"],
        rows: [
          ["Can you read the rules?", "Every entry and exit rule is written down", "The logic is secret or described as AI with no detail"],
          ["Who controls the money?", "You set the stake, stop loss and profit target", "The bot sizes its own trades with no ceiling"],
          ["How does it connect?", "Through the broker's own login and approval page", "It asks for your broker password or for a deposit to the seller"],
          ["Where does it run?", "On a server, with limits enforced there", "Only in a browser tab that must stay open"],
          ["Can you test it free?", "It runs on a demo account with no payment", "You must pay or deposit before seeing it trade"],
        ],
      },
      { type: "h2", text: "Match the bot to the kind of risk you can accept" },
      {
        type: "p",
        text: "Bots differ less in how often they win than in the shape of their losses. That shape is what you are really choosing.",
      },
      {
        type: "list",
        items: [
          "Flat stake: the same amount every trade. Losses are small and steady. The account moves slowly in both directions. This is the right starting point.",
          "Martingale and other recovery sizing: the stake grows after a loss. Wins are frequent, the balance climbs in a smooth line, and then one long streak takes a large part of it at once.",
          "High win rate, low payout: contracts such as Differs win about nine times in ten and pay a small fraction of the stake. One loss cancels roughly ten wins.",
          "Low win rate, high payout: contracts such as Matches lose most of the time and pay several times the stake. Long losing runs are the normal experience.",
        ],
      },
      { type: "h2", text: "Why the win rate tells you almost nothing" },
      {
        type: "p",
        text: "A bot that wins 90% of its trades sounds safe. If each win pays 10% of the stake and each loss costs all of it, ten trades at a stake of 10 produce nine wins of 1 and one loss of 10: a net loss of 1. The number that matters is the win rate set against the payout, which is the subject of the risk-to-reward guide.",
      },
      { type: "h2", text: "Build your own, or use a ready-made bot?" },
      {
        type: "p",
        text: "Build your own when you have an idea to test and want to change one setting at a time. Use a ready-made bot when you want fixed, published rules and only the stake and limits to decide. In FXNOD those are dBot and Auto Hub. Both run on a demo account, and neither has a subscription.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is the best trading bot for beginners?",
        a: "One with a flat stake, a required stop loss, rules you can read, and a demo mode. The strategy matters less at the start than being able to see exactly what the bot is doing and why.",
      },
      {
        q: "Are paid bots better than free ones?",
        a: "Price says nothing about results. Many paid bots are a Martingale with a different name. Judge any bot by the five tests above, and never pay for one you cannot test on demo first.",
      },
      {
        q: "Should I trust a bot that shows a profit screenshot?",
        a: "No. A screenshot shows one period chosen by the seller, often on a demo account. Ask for the rules and run it yourself.",
      },
    ],
    related: ["checklist-before-connecting-a-trading-bot", "auto-hub-ready-made-bots"],
  },

  {
    slug: "why-is-my-trading-bot-not-working",
    title: "Why is my trading bot not working? Nine causes and fixes",
    description:
      "A trading bot that will not start, places no trades or stops early usually has one of nine causes. How to tell which one, and what to do about it.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "A trading bot that is not working is usually in one of three states: it never started, it is running but waiting for its entry signal, or it stopped because it reached a limit. Check the run status and the stop reason first. Most cases are a reached limit, an expired broker approval, or a signal that has simply not appeared yet.",
    body: [
      { type: "h2", text: "First, find out which of the three it is" },
      {
        type: "table",
        head: ["What you see", "What it usually means"],
        rows: [
          ["The bot will not start", "A missing approval, a setting the broker does not sell, or a limit on how many bots run at once"],
          ["Running, but no trades", "The entry rule has not been met yet. This is normal."],
          ["It stopped by itself", "A stop loss, profit target, trade limit or stake ceiling was reached"],
          ["It stopped with an error", "The broker refused an order, or the connection to the broker was lost"],
        ],
      },
      { type: "h2", text: "It will not start" },
      {
        type: "list",
        items: [
          "The broker has not approved automated trading for this tool. On FXNOD, Deriv asks you to allow the automated-trading connection the first time you run a bot on a real account, separately from manual trading. Approve it on Deriv's page and start again.",
          "The contract length is not sold on that market. Brokers offer different durations per market. A builder that reads them from the broker, as dBot does, only lets you choose a length that exists.",
          "The stake is not an amount the broker accepts: below the contract's minimum, or with more decimal places than the account currency allows.",
          "You are already running the maximum number of bots. Stop one first.",
        ],
      },
      { type: "h2", text: "It is running but not trading" },
      {
        type: "p",
        text: "A bot with a selective entry rule can sit for minutes with nothing to do. A streak rule needs the streak. An indicator rule needs the indicators to agree. Indicators also need history before they produce a value at all: a 14-period RSI on one-minute candles cannot speak for the first fourteen minutes of data. If the bot is waiting, it is doing its job. Loosening the rule to make it trade more is how a tested strategy becomes an untested one.",
      },
      { type: "h2", text: "It stopped by itself" },
      {
        type: "p",
        text: "Read the stop reason on the run page. In FXNOD the common ones are: the session reached its stop loss, the session reached its profit target, the run reached its trade limit, the Martingale ladder ran out of steps, the next stake would have been above the most one trade may be, or your bots together reached the loss ceiling for the account. Each of these is the bot obeying a limit, and none is a malfunction.",
      },
      { type: "h2", text: "It stopped with an error" },
      {
        type: "list",
        items: [
          "Not enough balance for the next stake. Recovery sizing reaches this quickly.",
          "The broker refused the order. Brokers cap the payout of a single contract, so a stake that has grown through several losses can be refused even though the first stake was accepted.",
          "The broker's approval expired or was withdrawn. Reconnect the account and allow the bot again.",
          "The broker itself is unavailable or under maintenance. Check its status page before changing anything in the bot.",
        ],
      },
      { type: "h2", text: "A bot that loses is not a bot that is broken" },
      {
        type: "p",
        text: "The most common report of a bot not working is a bot working exactly as built and losing. If the trades match the rules you set, the software is fine and the question is the strategy. See why trading bots make losing trades.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Why did my bot stop after only a few trades?",
        a: "Almost always because a limit was reached: the stop loss, the profit target or the stake ceiling. A small stop loss combined with a stake that grows after losses ends a session within a handful of trades.",
      },
      {
        q: "Why does my bot work on demo but not on a real account?",
        a: "A real account usually needs its own approval for automated trading, has a smaller balance than the demo, and may be in a different currency with different stake rules. Check those three in that order.",
      },
      {
        q: "Does closing my browser stop the bot?",
        a: "It depends where the bot runs. A browser-based bot stops. A server-based bot, such as one started in FXNOD, keeps running and keeps its stop loss.",
      },
      {
        q: "Why is my bot not placing trades on a volatility index?",
        a: "Synthetic indices trade at all hours, so a closed market is rarely the reason. Look for an entry rule that has not been met, or an indicator still collecting history.",
      },
    ],
    related: ["why-trading-bots-make-losing-trades", "build-a-deriv-bot-with-dbot"],
  },

  {
    slug: "can-trading-bots-lose-money",
    title: "Can trading bots lose money?",
    description:
      "Yes. A trading bot can lose your whole balance, and faster than you would by hand. The four ways it happens and the settings that limit the damage.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Yes. A trading bot can lose money, including the entire balance of the account it trades. A bot follows its rules without judgment, so a losing rule loses automatically and quickly. No bot can guarantee a profit. What you control is how much a session can lose, through the stake, the stop loss and the way the stake changes after a loss.",
    body: [
      { type: "h2", text: "The four ways a bot loses" },
      {
        type: "list",
        items: [
          "The strategy has no edge. On a contract that pays less than it risks, a rule that wins by chance loses a little on average, on every trade, for ever.",
          "The stake is too large for the balance. An ordinary losing streak ends the session before the strategy has had a fair number of trades.",
          "The stake grows after losses. Martingale turns a string of small losses into one very large one.",
          "Nobody is watching the limits. A bot with no stop loss, or one whose stop loss lives in a browser tab that closed, has no floor.",
        ],
      },
      { type: "h2", text: "Why a bot loses faster than a person" },
      {
        type: "p",
        text: "A person trading by hand places perhaps a few dozen trades in a session, pauses after a loss, and gets tired. A bot on one-tick contracts can place hundreds of trades an hour and never pauses. Speed multiplies whatever the average result per trade is. If that average is slightly negative, speed is the problem.",
      },
      { type: "h2", text: "The arithmetic of a small disadvantage" },
      {
        type: "p",
        text: "Take a contract with two equally likely outcomes that pays a profit of 95 for every 100 staked. Over 1,000 trades at a stake of 1 you would expect about 500 wins of 0.95 and 500 losses of 1: a loss of about 25. Nothing dramatic happened on any single trade. That steady drain is what a strategy without an edge looks like, and no stake pattern changes it. Stake patterns only change when the loss arrives.",
      },
      { type: "h2", text: "What limits the damage" },
      {
        type: "steps",
        items: [
          { title: "Set a session stop loss you can afford", text: "Choose it before you start, as money, and treat reaching it as a normal outcome." },
          { title: "Keep the stake small against the stop loss", text: "A stake of 1% to 2% of the session's stop loss budget leaves room for a losing streak." },
          { title: "Prefer a flat stake", text: "It is the only sizing where the worst case is easy to see: the stake multiplied by the number of losses." },
          { title: "Know your worst trade", text: "If the stake can grow, work out the largest single stake the settings allow. That is the amount one trade can lose." },
        ],
      },
      {
        type: "note",
        title: "How FXNOD applies limits",
        text: "A bot cannot be started without a stop loss. Limits are checked on FXNOD's servers before every trade, so they keep working with the page closed. The check happens before each order, which means the last trade of a session can take the loss past the stop loss by up to that trade's stake.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Can a bot lose more than my stop loss?",
        a: "By a limited amount, yes. A stop loss is checked before each trade, so the final trade can carry the session past it by up to that trade's stake. With a flat stake the overshoot is small. With a growing stake it can be large.",
      },
      {
        q: "Can a bot lose more than my account balance?",
        a: "On Deriv options contracts the most a trade can lose is its stake, so the balance cannot go below zero from those trades. Other products and other brokers work differently. Check the terms of the contract you trade.",
      },
      {
        q: "Is there a bot that never loses?",
        a: "No. Anyone selling one is selling a bot that has not lost yet, usually a Martingale shown over a short period.",
      },
    ],
    related: ["trading-bot-risk-management", "why-trading-bots-make-losing-trades"],
  },

  {
    slug: "how-to-test-a-trading-bot",
    title: "How to test a trading bot before using real money",
    description:
      "Test a trading bot on a demo account with a realistic balance, for at least 100 trades, and record four numbers before you risk real money.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Test a trading bot on a demo account before using real money. Use the same stake and limits you plan to use live, run at least 100 trades across several sessions, and record the win rate, the average win and loss, the longest losing streak and the deepest drop in balance. Go live only if you would accept those numbers in real money.",
    body: [
      { type: "h2", text: "Set the test up so it can fail" },
      {
        type: "p",
        text: "A demo account often arrives with a balance of thousands. Testing a stake of 1 against 10,000 tells you nothing, because no losing streak can hurt. Decide the amount you would really deposit, treat that as your balance, and stop the test when the demo has lost it, however much virtual money remains.",
      },
      { type: "h2", text: "The test plan" },
      {
        type: "steps",
        items: [
          { title: "Write down what you expect", text: "Before the first trade, note the win rate and result you think the bot will produce. The gap between this and reality is the most useful thing you will learn." },
          { title: "Change nothing during a run", text: "One set of settings per test. If you adjust the bot after every loss you are testing your reactions, not the bot." },
          { title: "Run at least 100 trades", text: "For bots that trade rarely, run for longer. For strategies with a very high or very low win rate, run several hundred, because the rare outcome is the one that decides the result." },
          { title: "Spread it over several sessions", text: "Run at different times and on different days. One good hour is an anecdote." },
          { title: "Record the four numbers", text: "Use the table below and fill it from the run history, not from memory." },
        ],
      },
      { type: "h2", text: "The four numbers" },
      {
        type: "table",
        head: ["Number", "How to get it", "What it tells you"],
        rows: [
          ["Win rate", "Wins divided by total trades", "Only meaningful beside the next row"],
          ["Average win and average loss", "Total won divided by wins; total lost divided by losses", "Whether the wins are large enough to pay for the losses"],
          ["Longest losing streak", "Count it in the trade list", "What your stake sizing has to survive"],
          ["Maximum drawdown", "The largest fall from a peak in the balance to the low that followed", "The loss you must be able to sit through"],
        ],
      },
      { type: "h2", text: "Do the sum" },
      {
        type: "p",
        text: "Expected result per trade equals the win rate multiplied by the average win, minus the loss rate multiplied by the average loss. With a 55% win rate, an average win of 0.90 and an average loss of 1.00, that is 0.55 x 0.90 minus 0.45 x 1.00, which is 0.495 minus 0.45, or about 0.045 per trade. If the answer is negative after a few hundred trades, more trades will not rescue it.",
      },
      { type: "h2", text: "What a demo cannot tell you" },
      {
        type: "list",
        items: [
          "How you will behave when the money is yours. Most people interfere with a live bot in ways they never did on demo.",
          "Anything about the future. A test describes the period it covered.",
          "Whether a recovery strategy is safe. A Martingale that survived 500 trades has simply not met its streak yet.",
        ],
      },
      { type: "h2", text: "Moving to real money" },
      {
        type: "p",
        text: "Start with the minimum stake and the same limits, and compare the first hundred live trades with the demo numbers. If they differ sharply, stop and find out why before raising anything.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "How long should I test a trading bot?",
        a: "Count trades, not days. One hundred is a floor, and several hundred is better for strategies that win very often or very rarely. Spread them over several sessions.",
      },
      {
        q: "Is demo trading the same as real trading?",
        a: "The bot follows the same rules on both. What differs is you: real losses change behaviour, and a real balance is usually far smaller than a demo one.",
      },
      {
        q: "What is the difference between backtesting and demo testing?",
        a: "Backtesting replays a strategy on past prices. Demo testing runs it forward on live prices with virtual money. Demo testing is slower but cannot be accidentally fitted to the past.",
      },
    ],
    related: ["how-to-evaluate-a-trading-strategy", "trading-bot-risk-management"],
  },

  {
    slug: "trading-bot-risk-management",
    title: "How to manage risk when using a trading bot",
    description:
      "Manage trading bot risk with five settings: session stop loss, stake size, stake sizing rule, a ceiling on any single stake, and a profit target.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Manage risk with a trading bot by fixing five things before it starts: the most the session may lose, a stake small enough to survive a losing streak, a flat stake rather than one that grows after losses, a ceiling on any single stake, and a point at which you take profit and stop. Risk is set in the settings, never during the run.",
    body: [
      { type: "h2", text: "Start from the loss, not the profit" },
      {
        type: "p",
        text: "Decide the amount you can lose today without it mattering tomorrow. That is the session's stop loss. Every other setting is derived from it. People who start from a profit goal end up choosing the stake that reaches the goal fastest, which is also the stake that empties the account fastest.",
      },
      { type: "h2", text: "Size the stake to survive a streak" },
      {
        type: "p",
        text: "Losing streaks are longer than intuition suggests. On a 50/50 contract, seven losses in a row has a chance of about 1 in 128 from any given trade, and in a run of 1,000 trades you should expect to meet such a streak around four times. A flat stake of 2% of the stop loss budget lets the session absorb fifty net losses. A stake of 20% ends it after five.",
      },
      {
        type: "table",
        head: ["Stake as a share of the stop loss", "Losses in a row that end the session"],
        rows: [
          ["1%", "100"],
          ["2%", "50"],
          ["5%", "20"],
          ["10%", "10"],
          ["25%", "4"],
        ],
      },
      { type: "h2", text: "Understand what Martingale really costs" },
      {
        type: "p",
        text: "Doubling after each loss, starting from 1, the stakes run 1, 2, 4, 8, 16, 32, 64. The seventh trade stakes 64 to recover 63 of earlier losses and win 1. If it loses, the streak has cost 127. The strategy trades many small wins for one rare, very large loss, and the rare loss arrives on schedule. If you use it, set a ceiling on the single stake, limit the steps, and assume the full ladder will be lost at some point.",
      },
      { type: "h2", text: "Cap the single trade" },
      {
        type: "p",
        text: "Any time the stake can change, set the largest amount one trade may risk. In dBot this is the Never stake more than setting, and an escalated stake is also never allowed to be larger than the session's stop loss. A Martingale bot that would need a bigger stake than the ceiling stops with the loss instead of placing a smaller trade that could not win the streak back.",
      },
      { type: "h2", text: "Take profit, and stop for the day" },
      {
        type: "p",
        text: "A profit target ends the session while it is ahead. Without one, a bot keeps trading until variance gives the profit back. The discipline that matters comes afterwards: when a session ends, on either limit, do not start another one immediately with a bigger stake.",
      },
      { type: "h2", text: "Risk across several bots" },
      {
        type: "p",
        text: "Three bots on one account are one account's risk. If all three trade the same kind of contract on similar markets, their losing streaks can arrive together. FXNOD applies a combined loss ceiling to all the bots running on one Deriv account for that reason. Set your own total as well.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is a good stop loss for a trading bot?",
        a: "An amount you can lose without changing your plans, set as money before the session. There is no universal percentage. A common discipline is to risk no more than a small share of the account in any one session.",
      },
      {
        q: "How much should I stake per trade?",
        a: "Small enough that an ordinary losing streak does not reach the stop loss. One to two per cent of the session's loss budget is a conservative starting point for a flat stake.",
      },
      {
        q: "Is Martingale safe with a stop loss?",
        a: "A stop loss limits the size of the disaster. It does not change the fact that the strategy is built around one. The check runs before each trade, so the last doubled stake can take the session well past the stop loss.",
      },
      {
        q: "Should I run a bot without a profit target?",
        a: "You can, but then the stop loss is the only exit the bot has. A target gives the session a second way to end.",
      },
    ],
    related: ["can-trading-bots-lose-money", "risk-to-reward-ratio"],
  },

  {
    slug: "how-trading-bots-connect-to-platforms",
    title: "How do trading bots connect to trading platforms?",
    description:
      "Trading bots connect to a broker through its API, authorised by an API token or an OAuth approval. What each one grants, and how to revoke it.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "A trading bot connects to a trading platform through the platform's API, a channel built for software. You authorise it either by approving the tool on the broker's own login page, known as OAuth, or by creating an API token and pasting it into the tool. Either way the bot receives a limited permission, not your password, and you can withdraw it.",
    body: [
      { type: "h2", text: "The three parts of a connection" },
      {
        type: "table",
        head: ["Part", "What it does"],
        rows: [
          ["Market data feed", "Sends the bot every new price, so it can check its entry rule"],
          ["Authorisation", "Proves to the broker that you allowed this tool to act on your account"],
          ["Order channel", "Carries the bot's buy and sell requests to the broker and the results back"],
        ],
      },
      { type: "h2", text: "OAuth and API tokens compared" },
      {
        type: "table",
        head: ["", "OAuth approval", "API token"],
        rows: [
          ["How you grant it", "Sign in on the broker's page and press approve", "Create a token in the broker's settings and paste it into the tool"],
          ["Does the tool see your password?", "No", "No"],
          ["Who chooses the permissions?", "The tool asks, the broker shows you, you approve", "You tick the scopes when you create the token"],
          ["How you revoke it", "Remove the app in the broker's settings, or disconnect in the tool", "Delete the token in the broker's settings"],
        ],
      },
      {
        type: "p",
        text: "FXNOD connects to Deriv with OAuth. You are sent to Deriv's login page, Deriv shows what is being requested, and you return with the accounts under that login listed. The permission is stored encrypted, and running a bot needs a second approval of its own, separate from the one for manual trading.",
      },
      { type: "h2", text: "What a connected bot can and cannot do" },
      {
        type: "list",
        items: [
          "It can do what the permission covers: read balances and prices, and place and close trades on the accounts you approved.",
          "It should not be able to withdraw your money to someone else. If you create an API token yourself, do not tick payment or withdrawal scopes for a trading bot.",
          "It cannot change your broker password or your email.",
          "It stops being able to do anything the moment you revoke the permission at the broker.",
        ],
      },
      { type: "h2", text: "Why the connection sometimes drops" },
      {
        type: "p",
        text: "Permissions can expire, brokers limit how many requests a tool may send, and networks fail. A well-built bot reconnects on its own and tells you plainly when it cannot. When that happens, reconnect the account and approve again. Never solve it by handing your password to a tool that says it will be more reliable that way.",
      },
      { type: "h2", text: "Three checks before you connect anything" },
      {
        type: "list",
        items: [
          "The address bar shows the broker's real domain when you type your password.",
          "The approval page names the tool and what it is asking for.",
          "You know where in your broker's settings to remove it again.",
        ],
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is it safe to connect a bot to my trading account?",
        a: "It is as safe as the permission you grant and the tool you grant it to. A connection through the broker's own login, with trading permissions only, and a tool whose rules you can read, is the normal safe arrangement. The trades themselves still carry full market risk.",
      },
      {
        q: "What is an API token?",
        a: "A long code your broker generates that lets software act on your account within the permissions you chose. Treat it like a key: anyone holding it can use those permissions.",
      },
      {
        q: "Can a bot withdraw my money?",
        a: "Only if it was given a permission that covers payments. A trading bot does not need one. Check what you are approving before you approve it.",
      },
      {
        q: "How do I disconnect a bot?",
        a: "Disconnect in the tool, and for certainty remove the app or delete the token in your broker's account settings. The second step cuts access from the broker's side.",
      },
    ],
    related: ["connect-deriv-account", "checklist-before-connecting-a-trading-bot"],
  },

  {
    slug: "why-trading-bots-make-losing-trades",
    title: "Why do trading bots make losing trades?",
    description:
      "Bots lose trades because no rule predicts the next price. Losses are normal; the question is whether the wins pay for them. Six causes explained.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Trading bots make losing trades because no rule can know the next price. Every strategy, good or bad, loses some of its trades. A bot is doing its job when each trade matches its rules, win or lose. The useful question is not why a trade lost but whether the wins, over hundreds of trades, are large enough to pay for the losses.",
    body: [
      { type: "h2", text: "Losses are part of every strategy" },
      {
        type: "p",
        text: "A strategy with a real edge might win 55 trades in 100. It still loses 45, and those losses arrive in clumps, not evenly spaced. Judging a bot by its last five trades is like judging a coin by its last five flips.",
      },
      { type: "h2", text: "Six reasons a bot keeps losing" },
      {
        type: "list",
        items: [
          "The market is random at that scale. On a synthetic index, each tick is generated independently of the one before. Patterns in the last few digits or ticks do not make the next one more or less likely.",
          "The payout is against you. If a contract pays less than it risks on an even chance, a rule with no predictive power loses slowly but surely.",
          "The rule was fitted to the past. Settings tuned until a past period looked perfect describe that period and nothing else.",
          "The market changed character. A trend-following rule loses in a sideways market, and a range rule loses in a trend.",
          "The stake sizing magnified an ordinary streak. The entries were no worse than usual, but the stake had grown.",
          "The sample is too small. Ten trades cannot tell a good strategy from a bad one.",
        ],
      },
      { type: "h2", text: "The gambler's fallacy, automated" },
      {
        type: "p",
        text: "Many popular bots wait for a streak and then bet against it: five reds, so black is due. On an independent random process nothing is ever due. After five even digits the chance that the next is even is the same as it always was. Such a rule is not harmful by itself, since it is no worse than any other entry on a random market, but it gives no advantage, and combining it with a growing stake is where the damage comes from.",
      },
      { type: "h2", text: "How to tell bad luck from a bad strategy" },
      {
        type: "steps",
        items: [
          { title: "Check the trades against the rules", text: "If the bot entered where the rules say it should, the software is fine." },
          { title: "Count at least a hundred trades", text: "Fewer than that and you are reading noise." },
          { title: "Work out the break-even win rate", text: "Divide the average loss by the sum of the average win and the average loss. If an average win is 0.90 and an average loss is 1.00, the bot must win more than 52.6% of the time." },
          { title: "Compare", text: "If the measured win rate sits below break-even across several hundred trades, it is the strategy." },
        ],
      },
      { type: "h2", text: "What to do about it" },
      {
        type: "p",
        text: "Do not raise the stake to win it back, and do not adjust settings after each loss. Stop the bot, return to demo, change one setting, and test again. If no version clears break-even over a few hundred trades, the honest conclusion is that the idea has no edge.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is my bot broken if it loses several trades in a row?",
        a: "Usually not. Runs of losses are a normal feature of any strategy. On an even-chance contract, five losses in a row happens about once in every 32 starting points.",
      },
      {
        q: "Can a bot predict the next tick?",
        a: "No. On synthetic indices each tick is generated at random, so nothing predicts it. On real markets, short-term moves are close to random as well.",
      },
      {
        q: "Why did my bot win on demo and lose on real?",
        a: "Most often the demo test was too short to show a losing stretch, or the stake was scaled to a demo balance far larger than the real one.",
      },
    ],
    related: ["how-to-evaluate-a-trading-strategy", "can-trading-bots-lose-money"],
  },

  {
    slug: "manual-vs-automated-trading",
    title: "Manual trading vs automated trading: which is better?",
    description:
      "Manual trading uses your judgment on every trade; automated trading follows fixed rules. A side-by-side comparison and how to decide which fits you.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Neither is better in general. Manual trading suits decisions that need judgment and context. Automated trading suits rules that can be written down exactly and must be followed without emotion, especially on very short contracts. Most traders do best learning by hand first, then automating only the rules they have already proved to themselves.",
    body: [
      { type: "h2", text: "Side by side" },
      {
        type: "table",
        head: ["", "Manual trading", "Automated trading"],
        rows: [
          ["Who decides each trade", "You, at the time", "Rules you set in advance"],
          ["Speed", "Seconds at best", "Every tick"],
          ["Emotion", "Fear and greed affect every decision", "None during the run; plenty before and after"],
          ["Flexibility", "Adapts to news and context", "Does only what the rules say"],
          ["Time needed", "You must be at the screen", "Setup and review, not screen time"],
          ["Typical failure", "Breaking your own rules", "Following a bad rule perfectly"],
          ["Learning value", "High: you see why each trade worked or did not", "Low unless you review the run history"],
        ],
      },
      { type: "h2", text: "When manual trading is the better tool" },
      {
        type: "list",
        items: [
          "You are still learning how a market and its contracts behave.",
          "Your method depends on reading a chart as a whole: structure, levels, context.",
          "You trade rarely and each trade is a considered decision.",
          "News matters to the market you trade.",
        ],
      },
      { type: "h2", text: "When automation is the better tool" },
      {
        type: "list",
        items: [
          "You can state the entry, the stake and the exit with no judgment calls.",
          "The contracts are too short to trade consistently by hand.",
          "You know your weak point is discipline: moving stops, chasing losses, trading when tired.",
          "You want to test an idea over hundreds of trades, which is impractical by hand.",
        ],
      },
      { type: "h2", text: "The thing automation does not fix" },
      {
        type: "p",
        text: "Automation removes emotion from the execution and moves it to the controls. The automated trader's version of revenge trading is restarting a stopped bot with a doubled stake, or switching a flat stake to Martingale after a bad session. The bot will carry out that decision flawlessly.",
      },
      { type: "h2", text: "Using both" },
      {
        type: "p",
        text: "A practical path is to trade by hand on demo until you can describe what you do as rules, automate those rules, and keep watching the same markets by hand so you notice when conditions change. In FXNOD the two sit side by side on one Deriv account: dTrader for manual trades, dBot and Auto Hub for automated ones.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is automated trading more profitable than manual trading?",
        a: "Not by itself. Profit comes from the strategy. Automation applies it more consistently and more often, which helps a good strategy and hurts a bad one in equal measure.",
      },
      {
        q: "Should a beginner start with a bot?",
        a: "Start by hand on a demo account so you understand what a contract is and how it settles. Then run a simple flat-stake bot on demo. Skipping the first step is why many beginners cannot tell what their bot is doing.",
      },
      {
        q: "Can I trade manually while a bot is running?",
        a: "Yes, but both draw on the same balance, so a manual loss leaves less for the bot and the reverse. Keep the totals in mind.",
      },
    ],
    related: ["what-is-automated-trading", "dtrader-manual-trading"],
  },

  {
    slug: "checklist-before-connecting-a-trading-bot",
    title: "What should you check before connecting a trading bot?",
    description:
      "Twelve checks before you connect a trading bot to your account: the login page, the permissions, the rules, the limits, the demo run and the way out.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Before connecting a trading bot, check that you sign in on your broker's own page, that the bot asks only for trading permission, that you can read its rules, that it lets you set a stop loss and a stake, that it runs on a demo account first, and that you know how to stop it and revoke its access. If any one fails, do not connect.",
    body: [
      { type: "h2", text: "The connection" },
      {
        type: "list",
        items: [
          "You type your broker password only on the broker's own domain. Read the address bar.",
          "The approval page names the tool and lists what it is asking for.",
          "It asks for trading access, not for payments or withdrawals.",
          "Nobody asks you to send money to the bot's seller, or to open an account through a link in order to unlock the bot.",
        ],
      },
      { type: "h2", text: "The bot" },
      {
        type: "list",
        items: [
          "The entry and exit rules are written down and you can explain them to someone else.",
          "You set the stake, and you can see how it changes after a win or a loss.",
          "A stop loss exists and is enforced even when your device is off.",
          "There is a ceiling on the largest single stake if the stake can grow.",
        ],
      },
      { type: "h2", text: "The test" },
      {
        type: "list",
        items: [
          "It runs on a demo account with the same settings you plan to use live.",
          "You have watched it through at least one losing stretch.",
        ],
      },
      { type: "h2", text: "The way out" },
      {
        type: "list",
        items: [
          "You know where the stop button is, and what happens to a trade that is open when you press it.",
          "You know where in your broker's settings to remove the tool's access.",
        ],
      },
      { type: "h2", text: "Red flags that end the conversation" },
      {
        type: "table",
        head: ["What you are told", "What it means"],
        rows: [
          ["Guaranteed daily profit", "Nobody can guarantee a trading result. This is the mark of a scam."],
          ["Send us your login and we will run it for you", "You would be handing over the account."],
          ["Deposit with us and we trade it", "The money leaves your control. A legitimate bot trades the balance at your own broker."],
          ["The strategy is secret", "You cannot assess a risk you cannot see."],
          ["Only works on real accounts", "You are being steered away from testing."],
        ],
      },
      {
        type: "note",
        title: "How FXNOD answers this checklist",
        text: "You sign in on Deriv's own page and FXNOD never receives your Deriv password. Your trading balance stays in your Deriv account. Every bot's rules are shown before you start it, a stop loss is required, limits are enforced on FXNOD's servers, every bot runs on a demo account, and you can disconnect from Connected Accounts or from your Deriv settings.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Should I ever give a bot my broker password?",
        a: "No. A legitimate tool never needs it. It uses the broker's login page or an API token with limited permissions.",
      },
      {
        q: "How do I know if a trading bot is a scam?",
        a: "Guaranteed returns, pressure to deposit quickly, payment to an individual, a secret strategy and no demo mode are the usual signs. One is enough to walk away.",
      },
      {
        q: "What permissions does a trading bot need?",
        a: "Reading your balance and prices, and placing and closing trades. It does not need to move money out of the account.",
      },
    ],
    related: ["how-trading-bots-connect-to-platforms", "how-to-choose-a-trading-bot"],
  },

  {
    slug: "trading-bot-faq",
    title: "Trading bots: frequently asked questions",
    description:
      "Straight answers to the questions people ask about trading bots: whether they work, what they cost, how safe they are, and how to start with one.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "A trading bot is software that places trades from rules set in advance. Bots work in the sense that they follow those rules exactly. Whether they make money depends entirely on the rules. They can lose your whole balance, they cannot predict prices, and the safe way to start is on a demo account with a flat stake and a stop loss.",
    body: [
      { type: "h2", text: "The short version" },
      {
        type: "table",
        head: ["Question", "Answer"],
        rows: [
          ["Do trading bots work?", "They execute rules reliably. Profit depends on the rules."],
          ["Can they lose money?", "Yes, including the whole account balance."],
          ["Do I need to code?", "No. Question-based and visual builders need none."],
          ["Do I need a lot of money?", "No. Test on demo, then start at the broker's minimum stake."],
          ["Can they run while I sleep?", "Server-based bots can. Browser-based bots need the tab open."],
          ["Are they legal?", "Generally yes on your own account where your broker allows it. Check your country's rules."],
        ],
      },
      { type: "h2", text: "How people get hurt" },
      {
        type: "p",
        text: "Three patterns account for most bad experiences: paying a stranger for a bot with guaranteed profits, running Martingale on real money after a short winning streak on demo, and running a bot with no stop loss. All three are avoidable on the first day.",
      },
      { type: "h2", text: "How to start well" },
      {
        type: "steps",
        items: [
          { title: "Learn the contract by hand", text: "Place a few manual trades on demo so you know what the bot will be buying." },
          { title: "Run a flat-stake bot on demo", text: "Any simple template will do. The point is to learn to read a run." },
          { title: "Set limits as money", text: "A stop loss and a profit target, decided before you press start." },
          { title: "Keep a record", text: "Win rate, average win and loss, longest losing streak, deepest drawdown." },
          { title: "Go live at the minimum stake", text: "Only if you would accept the demo numbers in real money." },
        ],
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is a trading bot?",
        a: "Software that watches a market and places trades automatically when conditions you defined are met. It decides nothing beyond the rules it was given.",
      },
      {
        q: "Do trading bots really make money?",
        a: "Some strategies do over some periods. Most retail bots, especially those built on stake doubling, win often and then lose a large amount at once. No bot makes money reliably without an edge in its rules.",
      },
      {
        q: "How much does a trading bot cost?",
        a: "It ranges from free to expensive, and price is no guide to quality. FXNOD's dBot and Auto Hub have no subscription and no sign-up fee.",
      },
      {
        q: "Which is the best trading bot for Deriv?",
        a: "The best one for you is the one whose rules you understand and have tested on your own demo account. Start with a flat-stake bot and a stop loss.",
      },
      {
        q: "Is Martingale a good bot strategy?",
        a: "It produces many small wins and, eventually, one loss large enough to cancel them. It is the most common reason bot accounts are emptied. If you use it, limit the steps and cap the single stake.",
      },
      {
        q: "Can I run more than one bot at once?",
        a: "Yes, within the platform's limit. They share one balance, so treat their combined loss as a single risk.",
      },
      {
        q: "Will a bot keep running if my internet drops?",
        a: "A server-based bot will, because it does not depend on your device. A bot running in your browser stops when the page loses its connection.",
      },
      {
        q: "How long can a bot run?",
        a: "Until it reaches one of its limits or you stop it. Set the limits so that you are comfortable with either ending.",
      },
      {
        q: "Do I pay tax on bot profits?",
        a: "Trading profits are taxable in many countries, and the rules differ widely. Ask a qualified adviser where you live.",
      },
      {
        q: "Is a bot safer than trading by hand?",
        a: "It is more disciplined, not safer. It will follow a stop loss without hesitation, and it will follow a losing rule the same way.",
      },
    ],
    related: ["what-is-automated-trading", "how-to-choose-a-trading-bot"],
  },
];
