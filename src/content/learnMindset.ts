/**
 * The honest-expectations guides: money needed, growing a small account,
 * trading for a living, how long it takes, whether it is gambling, why most
 * lose, the measures and habits that decide survival, and the services sold
 * around trading (prop firms, account managers) plus account security.
 * Same shape and rules as the tool guides in `guides.ts`.
 *
 * These are the pages most at risk of saying what a reader hopes to hear.
 * They do not. No income figure, timetable or success rate is promised, and
 * every formula is worked so it can be checked.
 */
import { RISK_NOTE, type Guide } from "./guides";

const TAG = "Trading reality";
const DATE = "2026-10-09";

export const MINDSET_GUIDES: Guide[] = [
  {
    slug: "how-much-money-to-start-trading",
    title: "How much money do you need to start trading?",
    description:
      "Nothing to learn on a demo account. For real trading, enough that 1% of it is at least the smallest trade your market allows. Worked examples.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "You need no money to start learning: a demo account is free. To trade real money sensibly, you need enough that the smallest trade your market allows is about 1% of the account, and it must be money you can afford to lose entirely. That can be under 100 for small-stake options and several thousand for some markets.",
    body: [
      { type: "h2", text: "Work backwards from the smallest trade" },
      {
        type: "table",
        head: ["Smallest risk your market allows", "Account for that to be 1%", "Account for it to be 2%"],
        rows: [
          ["0.35", "35", "17.50"],
          ["1", "100", "50"],
          ["10", "1,000", "500"],
          ["50", "5,000", "2,500"],
        ],
      },
      {
        type: "p",
        text: "The smallest risk is the minimum stake on an option, or the minimum position size multiplied by a sensible stop distance on a CFD. If your account cannot keep that at 1% to 2%, the account is too small for that market.",
      },
      { type: "h2", text: "By market, roughly" },
      {
        type: "list",
        items: [
          "Fixed-payout options with small minimum stakes: tens to a hundred or two.",
          "Forex with micro lots: a few hundred.",
          "Indices, gold and other volatile CFDs: more, because sensible stops are wide.",
          "Shares bought outright: whatever a share or a fraction of one costs, without leverage.",
        ],
      },
      { type: "h2", text: "The costs people forget" },
      {
        type: "list",
        items: [
          "The money you will lose while learning. Budget for it as tuition.",
          "Deposit, withdrawal and currency conversion fees, which bite hardest on small amounts.",
          "Time: months of practice before results mean anything.",
        ],
      },
      { type: "h2", text: "What a small account can and cannot do" },
      {
        type: "p",
        text: "A small account can teach you to follow rules with real money at low cost. It cannot produce an income. A very good year might be a return of some tens of per cent, which on 200 is the price of a meal. Chasing meaningful money from a small account leads straight to oversized trades.",
      },
      { type: "h2", text: "A sensible start" },
      {
        type: "steps",
        items: [
          { title: "Demo first", text: "Until you have a few hundred trades and know your numbers." },
          { title: "Fund with money you can lose completely", text: "Never rent, debt or savings you need." },
          { title: "Trade the minimum size", text: "For the first hundred live trades." },
          { title: "Add funds only after a period of following your rules", text: "Never to recover a loss." },
        ],
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Can I start trading with 10 dollars?",
        a: "On small-stake options you can place trades, though the account is thin. It is enough to learn the mechanics with real money, not to earn from.",
      },
      {
        q: "How much do I need to trade forex?",
        a: "A few hundred with micro lots lets a 1% risk rule work. Less than that forces oversized trades.",
      },
      {
        q: "Should I borrow money to trade?",
        a: "No. Trade only money whose complete loss would not affect your life.",
      },
    ],
    related: ["how-to-calculate-position-size", "how-to-grow-a-small-trading-account"],
  },

  {
    slug: "how-to-grow-a-small-trading-account",
    title: "How to grow a small trading account (without blowing it)",
    description:
      "A small account grows slowly or not at all. What realistic growth looks like, why fast-growth methods end accounts, and the steady alternative.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "A small trading account cannot be grown quickly without taking risks that usually end it. Realistic growth is slow: a small fixed risk per trade, a tested method, compounding over many months, and deposits from income. Plans to turn 50 into 5,000 in a month require risking most of the account repeatedly, and nearly all of them fail.",
    body: [
      { type: "h2", text: "The arithmetic of fast growth" },
      {
        type: "p",
        text: "Doubling an account requires either a real edge applied many times, or large bets that happen to win. To double seven times in a row, from 50 to 6,400, by staking everything on even-chance trades has a chance of about 1 in 128, before costs. The people who post that result are the survivors of a much larger group who did not.",
      },
      { type: "h2", text: "What compounding really does" },
      {
        type: "table",
        head: ["Monthly return", "100 after 12 months", "100 after 36 months"],
        rows: [
          ["2%", "127", "204"],
          ["5%", "180", "579"],
          ["10%", "314", "3,091"],
        ],
      },
      {
        type: "p",
        text: "Even 5% a month, sustained for years, would be an exceptional record that few professionals achieve. The table shows what compounding can do. It is not a forecast, and most traders' monthly figure is negative.",
      },
      { type: "h2", text: "The fastest honest route" },
      {
        type: "list",
        items: [
          "Add to the account from your income. For a small account, saving outpaces trading.",
          "Protect what is there: 1% risk per trade, a daily loss limit.",
          "Trade one method on one market until the numbers are known.",
          "Increase size only in step with the account, never to catch up.",
        ],
      },
      { type: "h2", text: "What ends small accounts" },
      {
        type: "table",
        head: ["Habit", "Why it ends the account"],
        rows: [
          ["Risking 10% or more per trade", "A normal losing streak removes most of the balance"],
          ["High leverage", "One ordinary move closes the position"],
          ["Martingale", "The ladder needs more than the account holds"],
          ["Bots sold for small accounts", "Usually a low base stake on a doubling system"],
          ["Flipping challenges", "Built on all-or-nothing bets"],
          ["Depositing to recover", "Turns one loss into several"],
        ],
      },
      { type: "h2", text: "A different goal" },
      {
        type: "p",
        text: "Make the goal of a small account a year of following your rules, with the balance intact. That is achievable, it is the skill that scales, and it is the record you need before trading larger sums of your own or anyone else's.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Can I grow a small account fast?",
        a: "Only by taking risks that usually lose it. The published successes are a small share of the attempts.",
      },
      {
        q: "What is a realistic monthly return?",
        a: "For most traders it is negative. A few per cent a month, sustained, would be an outstanding result.",
      },
      {
        q: "Should I use leverage to grow a small account?",
        a: "High leverage is the commonest way small accounts are lost. Use position sizing based on a 1% risk instead.",
      },
    ],
    related: ["how-much-money-to-start-trading", "best-synthetic-index-for-a-small-account"],
  },

  {
    slug: "can-you-make-a-living-trading",
    title: "Can you make a living from trading?",
    description:
      "A small minority do. What it requires in capital, skill and time, the arithmetic of living off returns, and safer ways to approach the goal.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "A small minority of traders make a living from it, and most who try lose money. It requires a method with a real edge, enough capital that modest percentage returns cover your costs, years of practice, and the temperament to live with irregular income. It is a business with a high failure rate, not a wage.",
    body: [
      { type: "h2", text: "The capital arithmetic" },
      {
        type: "table",
        head: ["Annual living costs", "Capital needed at a 10% yearly return", "At 20%"],
        rows: [
          ["6,000", "60,000", "30,000"],
          ["12,000", "120,000", "60,000"],
          ["24,000", "240,000", "120,000"],
          ["48,000", "480,000", "240,000"],
        ],
      },
      {
        type: "p",
        text: "A sustained 20% a year would rank among the best professional records. Living off a small account requires returns nobody sustains, which is why attempts to do so turn into ever larger risks.",
      },
      { type: "h2", text: "What the people who manage it have" },
      {
        type: "list",
        items: [
          "A tested edge on a real market, often in a narrow niche.",
          "Capital, their own or a firm's.",
          "Low costs and good execution.",
          "Several years of recorded results before relying on them.",
          "Savings to cover long flat or losing periods.",
          "Often, other income as well.",
        ],
      },
      { type: "h2", text: "Why income from trading is hard to live on" },
      {
        type: "list",
        items: [
          "It is irregular: good months and losing months, with no pattern you can plan around.",
          "Withdrawing to live stops the account compounding.",
          "Needing the money changes how you trade, usually for the worse.",
          "A drawdown hits your income and your capital at the same time.",
        ],
      },
      { type: "h2", text: "Random markets" },
      {
        type: "p",
        text: "Nobody makes a living trading fixed-payout contracts on a random index by skill. Each contract costs a little on average and no method changes that. People who appear to earn there are usually paid by referrals, course sales or bot sales, not by trading.",
      },
      { type: "h2", text: "A safer way to approach it" },
      {
        type: "steps",
        items: [
          { title: "Keep your income", text: "Trade part-time for at least a year or two." },
          { title: "Record everything", text: "A track record of several hundred trades with fixed rules." },
          { title: "Treat it as a second income first", text: "Something that adds to your savings." },
          { title: "Only consider more when the record and the capital both justify it", text: "With a year of living costs set aside." },
        ],
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What percentage of traders make a living?",
        a: "A small minority. Published broker figures show most retail accounts lose money, and fewer still earn consistently.",
      },
      {
        q: "How much capital do I need to trade full time?",
        a: "Enough that a realistic 10% to 20% a year covers your living costs, plus savings for losing periods.",
      },
      {
        q: "Can I make a living trading with a bot?",
        a: "A bot executes a strategy. It needs an edge and capital like any other approach, and on random indices no edge exists.",
      },
    ],
    related: ["why-most-traders-lose-money", "what-is-a-prop-firm"],
  },

  {
    slug: "how-long-does-it-take-to-learn-trading",
    title: "How long does it take to learn trading?",
    description:
      "The mechanics take days or weeks. Trading without losing your deposit takes months, and consistent results take years if they come. A realistic timeline.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Learning how a platform, orders and contracts work takes days to weeks. Learning to trade without steadily losing your deposit usually takes several months of regular practice. Consistent profitability, if it comes at all, typically takes years, and most people stop before then. Anyone promising competence in a week is selling something.",
    body: [
      { type: "h2", text: "A realistic timeline" },
      {
        type: "table",
        head: ["Stage", "Typical time", "What you can do"],
        rows: [
          ["Mechanics", "Days to weeks", "Place and manage trades; read a quote"],
          ["Basics", "1 to 3 months", "Read trend and levels; size a trade; keep a journal"],
          ["Discipline", "3 to 12 months", "Follow your rules through losing stretches"],
          ["A measurable method", "1 to 2 years", "Know your numbers over hundreds of trades"],
          ["Consistency", "Years, for the few who reach it", "Positive results across different conditions"],
        ],
      },
      {
        type: "p",
        text: "These are typical ranges for people who practise several hours a week. They are not guarantees, and many people never reach the later rows.",
      },
      { type: "h2", text: "What speeds it up" },
      {
        type: "list",
        items: [
          "A journal reviewed weekly. Without one, a year of trading is one month repeated twelve times.",
          "One market and one method, long enough to see it in good and bad conditions.",
          "Small real stakes after demo, so emotion is part of the practice.",
          "Learning risk before strategy.",
        ],
      },
      { type: "h2", text: "What slows it down" },
      {
        type: "list",
        items: [
          "Changing strategy after every loss.",
          "Large stakes, which end the account before the lesson.",
          "Copying signals or bots without understanding them.",
          "Counting an early lucky run as skill.",
        ],
      },
      { type: "h2", text: "Screen time is not the same as learning" },
      {
        type: "p",
        text: "Hours spent trading only count if each trade is recorded and reviewed. Deliberate practice means stating what you expect, comparing it with what happened, and changing one thing. Passive hours in front of a chart teach very little.",
      },
      { type: "h2", text: "How you will know you are progressing" },
      {
        type: "list",
        items: [
          "Your losses become smaller and more uniform.",
          "You break your own rules less often.",
          "You can skip a trade without regret.",
          "Profit comes last, after all of these.",
        ],
      },
      { type: "h2", text: "With a bot" },
      {
        type: "p",
        text: "A bot shortens the time to collect trades and does nothing for the time it takes to understand them. Use it to test ideas quickly on demo, and review each run as carefully as a manual session.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Can I learn trading in a month?",
        a: "You can learn the mechanics and the vocabulary. A month is not long enough to know whether your results mean anything.",
      },
      {
        q: "How many hours a day should I practise?",
        a: "An hour or two of focused, recorded practice beats a full day of watching charts.",
      },
      {
        q: "Does everyone eventually become profitable?",
        a: "No. Most people who try do not. Time helps only when it comes with honest review.",
      },
    ],
    related: ["how-to-start-learning-trading", "how-to-keep-a-trading-journal"],
  },

  {
    slug: "is-trading-gambling",
    title: "Is trading gambling?",
    description:
      "It depends on the edge. Trading with a tested positive expectation and controlled risk is not gambling. Trading without one is, whatever it is called.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "It depends on how it is done. An activity is gambling when the expected result is negative and the outcome rests on chance. Trading a tested method with a positive expectation and controlled risk is closer to running a business. Trading on impulse, or buying fixed-payout contracts on a random index, has a negative expectation and is gambling in every respect that matters.",
    body: [
      { type: "h2", text: "The test" },
      {
        type: "table",
        head: ["Question", "Closer to gambling", "Closer to a business"],
        rows: [
          ["Expected result per trade", "Negative or unknown", "Positive, measured over many trades"],
          ["What decides outcomes", "Chance", "A repeatable advantage, plus chance"],
          ["Size of bets", "Driven by mood or recent results", "Fixed by a rule"],
          ["Records", "None", "Every trade"],
          ["After a loss", "Bigger bets to recover", "The same size, next setup"],
          ["Why you do it", "Excitement", "A plan"],
        ],
      },
      { type: "h2", text: "Products are not all the same" },
      {
        type: "list",
        items: [
          "Owning a diversified set of productive assets for years has a positive expected return, with risk.",
          "Short-term trading of real markets is roughly a zero-sum contest before costs and negative after them. A minority have an edge.",
          "Fixed-payout contracts on a random index have a known, negative expected value on every trade. No skill changes it.",
        ],
      },
      { type: "h2", text: "Being honest about random contracts" },
      {
        type: "p",
        text: "On a synthetic index, an even-chance contract paying less than double the stake loses a small amount on average each time, like a bet with a house margin. A bot can pace that, limit it and make it disciplined. It cannot make it something else. FXNOD's tools trade those contracts, and it is fairer to say so than to pretend otherwise.",
      },
      { type: "h2", text: "Signs your trading has become gambling" },
      {
        type: "list",
        items: [
          "You trade for the feeling, and feel flat when not trading.",
          "You raise stakes to recover losses.",
          "You hide your trading or its results.",
          "You trade money needed for something else.",
          "You cannot stop at your limit.",
        ],
      },
      { type: "h2", text: "If you recognise those signs" },
      {
        type: "p",
        text: "Stop trading and talk to someone you trust, or to a gambling support service in your country. Most brokers let you set limits on your account or exclude yourself. This is a health matter before it is a trading one.",
      },
      { type: "h2", text: "Religion and law" },
      {
        type: "p",
        text: "Whether a product counts as gambling in a religious or legal sense is a separate question with its own authorities. Some countries regulate certain contracts as betting, and many religious scholars regard short-term fixed-payout options as a wager. Ask a qualified person about your own situation.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is day trading gambling?",
        a: "For most people who do it without a tested edge, the results are indistinguishable from gambling. With an edge and fixed risk it is not.",
      },
      {
        q: "Are binary-style options gambling?",
        a: "On a random index they have a negative expected value on every trade, which is the defining feature of a gamble.",
      },
      {
        q: "What makes trading different from gambling?",
        a: "A measured positive expectation, fixed risk and records. Without those, the name is the only difference.",
      },
    ],
    related: ["why-most-traders-lose-money", "is-deriv-halal"],
  },

  {
    slug: "why-most-traders-lose-money",
    title: "Why do most traders lose money?",
    description:
      "Most retail traders lose because of costs, oversized positions, no tested edge and decisions made under emotion. The causes and what the minority do.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Most retail traders lose money for a handful of reasons: every trade has a cost, positions are too large for the account, the method was never tested, and decisions are made under fear and greed. Short-term trading is close to a zero-sum contest before costs, so the average participant loses. The minority who do not lose control risk first.",
    body: [
      { type: "h2", text: "The structural reasons" },
      {
        type: "table",
        head: ["Reason", "How it works"],
        rows: [
          ["Costs", "Spread, commission, swap or payout margin on every trade. A break-even method becomes a losing one"],
          ["Zero-sum before costs", "One short-term trader's gain is another's loss, and professionals are on the other side"],
          ["Leverage", "Turns normal movement into account-ending losses"],
          ["Negative-expectation products", "Some contracts are priced so that the average result is a loss"],
        ],
      },
      { type: "h2", text: "The behavioural reasons" },
      {
        type: "table",
        head: ["Behaviour", "Effect"],
        rows: [
          ["Cutting winners, holding losers", "Small wins and large losses"],
          ["Risking too much per trade", "An ordinary streak ends the account"],
          ["Revenge trading", "One loss becomes five"],
          ["Overtrading", "More costs and worse setups"],
          ["No plan and no records", "The same mistakes repeat unseen"],
          ["Strategy hopping", "No method is ever tested properly"],
        ],
      },
      { type: "h2", text: "The loss asymmetry" },
      {
        type: "p",
        text: "A 50% loss needs a 100% gain to recover. A trader who occasionally takes a large loss must be exceptional the rest of the time merely to get back. Most are not, so the large loss decides the year. Avoiding it matters more than any entry technique.",
      },
      { type: "h2", text: "What the minority do differently" },
      {
        type: "list",
        items: [
          "They decide the risk before the trade, and it is small.",
          "They have a method they have measured over hundreds of trades.",
          "They trade less, and skip most opportunities.",
          "They keep records and review them.",
          "They stop for the day at a fixed loss.",
        ],
      },
      { type: "h2", text: "Does a bot change the odds?" },
      {
        type: "p",
        text: "It removes the behavioural reasons during the run: a bot does not hold losers or chase. It does nothing about the structural ones. A bot on a negative-expectation contract loses at that contract's rate, reliably. And the behaviour returns between runs, in how you restart and resize.",
      },
      { type: "h2", text: "Using this honestly" },
      {
        type: "p",
        text: "Assume you are the average trader until your own records prove otherwise. That assumption leads to small stakes, strict limits and money you can afford to lose, which is the right way to start whoever you turn out to be.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What percentage of traders lose money?",
        a: "Brokers in regulated markets publish the share of retail CFD accounts that lose, and it is a clear majority.",
      },
      {
        q: "What is the main reason traders fail?",
        a: "Risking too much. Poor risk control turns every other mistake into a fatal one.",
      },
      {
        q: "Can I avoid being in the losing majority?",
        a: "You can improve your odds with small risk, a tested method and records. There is no guarantee.",
      },
    ],
    related: ["is-trading-gambling", "the-1-percent-rule-in-trading"],
  },

  {
    slug: "the-1-percent-rule-in-trading",
    title: "The 1% rule in trading: what it is and how to apply it",
    description:
      "The 1% rule limits the loss on any single trade to 1% of your account. How to calculate it, what it protects you from, and its limits.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "The 1% rule says you should not risk more than 1% of your trading account on a single trade. With 1,000, the most you can lose on one trade is 10. It applies to the amount lost if your stop is hit, not to the size of the position. Its purpose is survival: a long losing streak leaves most of the account intact.",
    body: [
      { type: "h2", text: "Applying it" },
      {
        type: "steps",
        items: [
          { title: "Take 1% of the account", text: "That is the money at risk on the next trade." },
          { title: "Find the stop distance from the chart", text: "Where the trade is wrong." },
          { title: "Divide", text: "Money at risk divided by the loss per unit at that stop gives the position size." },
          { title: "For options, the stake is the risk", text: "So the stake is 1% of the account." },
        ],
      },
      { type: "h2", text: "What it protects you from" },
      {
        type: "table",
        head: ["Losses in a row", "Account left at 1% risk", "At 5% risk", "At 10% risk"],
        rows: [
          ["5", "95%", "77%", "59%"],
          ["10", "90%", "60%", "35%"],
          ["20", "82%", "36%", "12%"],
          ["30", "74%", "21%", "4%"],
        ],
      },
      {
        type: "p",
        text: "Twenty losses in a row is rare for a single streak, and twenty net losses over a few hundred trades is not. At 1% it is a bad stretch. At 10% it is the end.",
      },
      { type: "h2", text: "Common misunderstandings" },
      {
        type: "list",
        items: [
          "It is not 1% of the account as position size. A position can be many times the account if the stop is close.",
          "It is not a target. You do not need to risk 1% on every trade.",
          "It does not make a losing method profitable. It makes it lose slowly.",
          "Several trades open at once on related markets are one risk, not several.",
        ],
      },
      { type: "h2", text: "1% or 2%?" },
      {
        type: "p",
        text: "Both are used. Beginners and anyone without a measured edge should stay at 1% or below. With a very small account, the minimum trade size may force a higher figure, which is a reason to trade a product with a smaller minimum, not to accept the risk.",
      },
      { type: "h2", text: "A daily version" },
      {
        type: "p",
        text: "Pair it with a daily limit, such as 3% of the account. Three losses and the day is over. This stops the rule being followed trade by trade while the session as a whole runs out of control.",
      },
      { type: "h2", text: "With a bot" },
      {
        type: "p",
        text: "For a flat-stake bot, set the stake at about 1% of the session's stop loss and the stop loss at a small share of the account. If the stake can grow after losses, the 1% rule must be applied to the largest stake the settings allow, which usually shows that the progression is too aggressive.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is the 1% rule too conservative?",
        a: "It feels slow. It is what lets you survive long enough to find out whether your method works.",
      },
      {
        q: "Does the 1% rule apply to position size?",
        a: "No. It applies to the amount you lose if the stop is hit.",
      },
      {
        q: "What if 1% is smaller than the minimum trade?",
        a: "The account is too small for that market. Choose a product with a smaller minimum or add funds you can afford to lose.",
      },
    ],
    related: ["how-to-calculate-position-size", "risk-of-ruin-explained"],
  },

  {
    slug: "profit-factor-explained",
    title: "Profit factor in trading: formula and what is a good value",
    description:
      "Profit factor is total winnings divided by total losses. How to calculate it, what a good value looks like, and why a very high one is a warning.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Profit factor is the total money won on winning trades divided by the total money lost on losing trades. Above 1 means the method made money over the period, and below 1 means it lost. Between about 1.2 and 2 over several hundred trades is a realistic good result. A very high figure on a small sample usually signals luck or overfitting.",
    body: [
      { type: "h2", text: "The formula" },
      {
        type: "p",
        text: "Profit factor equals gross profit divided by gross loss. If your winning trades total 1,500 and your losing trades total 1,000, the profit factor is 1.5: you made 1.50 for every 1 lost. It can also be written as win rate times average win, divided by loss rate times average loss.",
      },
      { type: "h2", text: "Reading the value" },
      {
        type: "table",
        head: ["Profit factor", "Meaning"],
        rows: [
          ["Below 1.0", "The method lost money"],
          ["1.0", "Break even, before any costs not included"],
          ["1.1 to 1.3", "A thin edge. Costs or a change in conditions can erase it"],
          ["1.3 to 2.0", "A solid result, if the sample is large"],
          ["Above 2.5", "Excellent, or more often a small sample, curve fitting or hidden risk"],
        ],
      },
      { type: "h2", text: "A worked example" },
      {
        type: "table",
        head: ["Method", "Win rate", "Average win", "Average loss", "Profit factor"],
        rows: [
          ["A", "40%", "2.5", "1.0", "1.67"],
          ["B", "60%", "1.0", "1.0", "1.50"],
          ["C", "90%", "0.1", "1.0", "0.90"],
        ],
      },
      {
        type: "p",
        text: "Method C wins nine trades in ten and loses money. Profit factor exposes what the win rate hides.",
      },
      { type: "h2", text: "Its blind spots" },
      {
        type: "list",
        items: [
          "It says nothing about drawdown. Two methods with the same profit factor can have very different worst periods.",
          "It ignores how the result was distributed. One huge win can carry a poor method.",
          "Open losing positions are not counted, which flatters grid and Martingale systems.",
          "On a small sample it is mostly noise.",
        ],
      },
      { type: "h2", text: "Using it properly" },
      {
        type: "steps",
        items: [
          { title: "Calculate it over at least a hundred trades", text: "Several hundred is better." },
          { title: "Include every cost", text: "Spread, commission and slippage." },
          { title: "Read it beside maximum drawdown", text: "Return and pain together." },
          { title: "Recalculate without the largest win", text: "If it falls below 1, the result depended on one trade." },
        ],
      },
      { type: "h2", text: "With bots" },
      {
        type: "p",
        text: "A recovery bot can show a very high profit factor for a long time, because its rare large loss has not occurred yet. Treat any bot's profit factor as unproven until the sample includes its worst case.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is a good profit factor?",
        a: "Between about 1.3 and 2 over a large number of trades. Higher figures on few trades deserve suspicion.",
      },
      {
        q: "Is profit factor better than win rate?",
        a: "Yes, because it includes the size of wins and losses. Read it with drawdown.",
      },
      {
        q: "Can profit factor be negative?",
        a: "No. It is a ratio of two positive totals. Below 1 means a net loss.",
      },
    ],
    related: ["how-to-evaluate-a-trading-strategy", "is-a-high-win-rate-enough"],
  },

  {
    slug: "risk-of-ruin-explained",
    title: "Risk of ruin: the chance of losing your whole account",
    description:
      "Risk of ruin is the probability that a run of losses empties your account. The formula, a table by edge and stake size, and how to lower it.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Risk of ruin is the probability that a trader loses their entire account before it grows. It depends on two things: the edge per trade and the fraction of the account risked each time. With no edge, ruin is certain if you keep trading. With an edge, risking a smaller fraction per trade cuts the risk of ruin dramatically.",
    body: [
      { type: "h2", text: "The simple formula" },
      {
        type: "p",
        text: "For even-money trades with a fixed stake, risk of ruin equals the fraction (1 minus edge) divided by (1 plus edge), raised to the power of the number of stakes in the account. The edge is the win rate minus the loss rate. With a 55% win rate the edge is 0.10, the fraction is 0.9 divided by 1.1, or 0.818, and the rest depends on how many stakes you hold.",
      },
      { type: "h2", text: "What the numbers look like" },
      {
        type: "table",
        head: ["Win rate at even money", "10 stakes in the account", "20 stakes", "50 stakes", "100 stakes"],
        rows: [
          ["50% or less", "100%", "100%", "100%", "100%"],
          ["52%", "45%", "20%", "1.8%", "0.03%"],
          ["55%", "13%", "1.8%", "Under 0.01%", "Negligible"],
          ["60%", "1.7%", "0.03%", "Negligible", "Negligible"],
        ],
      },
      {
        type: "p",
        text: "Read the first row first. With no edge, the account is eventually lost however small the stake. Stake size decides how long that takes, not whether it happens.",
      },
      { type: "h2", text: "The two levers" },
      {
        type: "list",
        items: [
          "Edge: a larger advantage per trade lowers the risk sharply. You control this only by having a real, tested method.",
          "Stake size: holding more stakes in the account, by risking less per trade, lowers it just as sharply. This one is entirely yours.",
        ],
      },
      { type: "h2", text: "Why 1% risk matters" },
      {
        type: "p",
        text: "Risking 10% per trade gives you ten stakes. With a modest 52% edge, the table says ruin is close to a coin flip. Risking 1% gives a hundred stakes and makes it remote. The method is identical. Only the stake changed.",
      },
      { type: "h2", text: "What the formula leaves out" },
      {
        type: "list",
        items: [
          "It assumes you know your true win rate. You have an estimate, usually an optimistic one.",
          "It assumes wins and losses of equal size.",
          "It assumes a fixed stake. Raising the stake after losses makes ruin far more likely than the table shows.",
          "It treats ruin as zero. Most traders stop long before, at a loss they can no longer tolerate.",
        ],
      },
      { type: "h2", text: "On negative-expectation contracts" },
      {
        type: "p",
        text: "A contract with an even chance and a payout under double has a negative edge. The first row applies: with continued play the balance is eventually lost. A stop loss and a small stake control how much you spend in a session. They do not change the direction.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is an acceptable risk of ruin?",
        a: "As close to zero as you can make it. Most serious traders aim for well under 1%.",
      },
      {
        q: "How do I reduce my risk of ruin?",
        a: "Risk a smaller fraction per trade. It is the one lever fully under your control.",
      },
      {
        q: "Does Martingale reduce risk of ruin?",
        a: "No. It raises it, by increasing the stake during losing streaks.",
      },
    ],
    related: ["the-1-percent-rule-in-trading", "kelly-criterion-explained"],
  },

  {
    slug: "what-is-overtrading",
    title: "Overtrading: what it is and how to stop",
    description:
      "Overtrading is taking more trades, or larger ones, than your plan justifies. Its causes, its cost in fees and mistakes, and rules that prevent it.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Overtrading means taking more trades, or bigger trades, than your plan and the market justify. It comes from boredom, chasing losses, overconfidence after wins and the belief that more activity means more profit. Each extra trade adds cost and is usually a worse setup. The cure is a limit decided in advance: trades per day, and a written checklist.",
    body: [
      { type: "h2", text: "Two kinds" },
      {
        type: "table",
        head: ["Kind", "Looks like"],
        rows: [
          ["Too many trades", "Entering without a setup, trading every small move, never sitting out"],
          ["Too much size", "Positions too large for the account, often after a loss or a run of wins"],
        ],
      },
      { type: "h2", text: "Why it happens" },
      {
        type: "list",
        items: [
          "Boredom: nothing is happening, so you make something happen.",
          "Recovery: a loss you want back now.",
          "Overconfidence: three wins and the rules feel optional.",
          "Fear of missing out: the market is moving without you.",
          "A belief that a trader is someone who trades, constantly.",
        ],
      },
      { type: "h2", text: "What it costs" },
      {
        type: "p",
        text: "Suppose your planned setups have a small positive expectation and each trade costs 1 in spread. Five planned trades a day cost 5. Add fifteen unplanned ones with no edge and you pay 15 more in costs for nothing, before counting the losses on poor entries. Many traders are profitable on their planned trades and unprofitable overall.",
      },
      { type: "h2", text: "Signs you are doing it" },
      {
        type: "list",
        items: [
          "You cannot say which setup a trade was.",
          "You enter again within minutes of closing.",
          "Your number of trades rises on losing days.",
          "You trade outside your usual hours.",
          "Your journal has gaps on the days that went badly.",
        ],
      },
      { type: "h2", text: "Rules that stop it" },
      {
        type: "steps",
        items: [
          { title: "A maximum number of trades per day", text: "When it is reached, the day is over, win or lose." },
          { title: "A written checklist", text: "No box unticked, no trade." },
          { title: "A daily loss limit", text: "In money." },
          { title: "A break after every trade", text: "Even five minutes interrupts the impulse." },
          { title: "Fixed trading hours", text: "A start and an end." },
        ],
      },
      { type: "h2", text: "Overtrading with a bot" },
      {
        type: "p",
        text: "A bot is the purest overtrader there is: it will place a trade every few seconds for as long as it is allowed. On a contract with a cost built in, more trades means more cost, with certainty. Give it a maximum number of trades or a profit target as well as a stop loss, and do not restart it because a session has ended.",
      },
      { type: "h2", text: "In business, the same word means something else" },
      {
        type: "p",
        text: "In accounting, overtrading describes a company growing sales faster than its working capital can support. It is unrelated to the trading sense used here.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "How many trades a day is overtrading?",
        a: "There is no fixed number. It is overtrading when trades are taken that your plan does not call for.",
      },
      {
        q: "Why do I overtrade after a loss?",
        a: "Because the mind wants to return to even quickly. A fixed daily loss limit and a break remove the opportunity.",
      },
      {
        q: "Is trading less more profitable?",
        a: "Usually, for discretionary traders. Fewer trades means lower costs and a higher average quality of setup.",
      },
    ],
    related: ["how-to-avoid-revenge-trading", "fomo-in-trading"],
  },

  {
    slug: "fomo-in-trading",
    title: "FOMO in trading: what it is and how to control it",
    description:
      "FOMO is the fear of missing a move, which pushes traders into late, oversized entries. Why it happens, what it costs, and how to manage it.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "FOMO, the fear of missing out, is the urge to enter a trade because the price is moving and others appear to be profiting. It leads to late entries near the end of a move, positions that are too large, and no plan for the exit. It is controlled by rules made beforehand: a defined setup, a fixed risk, and accepting that most moves are not yours to catch.",
    body: [
      { type: "h2", text: "What triggers it" },
      {
        type: "list",
        items: [
          "A fast move on the chart that you are not in.",
          "Screenshots of other people's profits.",
          "A trade you planned and hesitated on, now running without you.",
          "Group chats and countdown offers.",
          "A recent loss you want to replace.",
        ],
      },
      { type: "h2", text: "What it makes you do" },
      {
        type: "table",
        head: ["Action", "Why it loses"],
        rows: [
          ["Buying after a large move", "The stop has to be far away, so the risk is large or the stop is ignored"],
          ["Entering with no level", "There is nowhere logical to be wrong"],
          ["Taking a bigger size", "To make up for the part of the move you missed"],
          ["Skipping the checklist", "There was no time"],
          ["Holding too long", "Because leaving feels like missing out again"],
        ],
      },
      { type: "h2", text: "Why the late entry is the worst one" },
      {
        type: "p",
        text: "By the time a move is obvious enough to cause FOMO, much of it has happened. The traders who entered early are looking to take profit, and you are their buyer. The reward remaining is smaller and the distance to a sensible stop is larger than at any earlier point.",
      },
      { type: "h2", text: "Managing it" },
      {
        type: "steps",
        items: [
          { title: "Define your setup in writing", text: "If the price is not at a level you marked beforehand, it is not your trade." },
          { title: "Wait for the pullback", text: "Strong moves usually offer a second entry at a better price." },
          { title: "Keep the risk fixed", text: "The size never grows because the move looks certain." },
          { title: "Say the sentence", text: "There will be another trade. There always is." },
          { title: "Mute the sources", text: "Leave groups that post profits and countdowns." },
        ],
      },
      { type: "h2", text: "FOMO is used against you" },
      {
        type: "p",
        text: "Much of trading marketing is engineered FOMO: limited seats, a bot that is nearly sold out, screenshots of today's wins, a signal expiring in five minutes. Pressure to act now is a reason to stop and check, and is one of the commonest marks of a scam.",
      },
      { type: "h2", text: "The opposite error" },
      {
        type: "p",
        text: "Fear of losing can be as costly: skipping valid setups after a loss. Both come from letting the last result decide the next trade. A fixed plan and a small fixed risk answer both.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What does FOMO mean in trading?",
        a: "Fear of missing out: entering a trade because of a move you are not in, instead of because of your plan.",
      },
      {
        q: "How do I stop FOMO trading?",
        a: "Trade only setups defined in advance, with a fixed risk, and remove the sources that provoke it.",
      },
      {
        q: "Is it ever right to chase a move?",
        a: "Entering late can work, with a planned stop and a small size. Entering late on impulse rarely does.",
      },
    ],
    related: ["how-to-control-emotions-while-trading", "what-is-overtrading"],
  },

  {
    slug: "how-to-write-a-trading-plan",
    title: "How to write a trading plan (with a template)",
    description:
      "A trading plan is a written set of rules for what you trade, when, how much you risk and when you stop. The sections to include and an example.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "A trading plan is a written document that states what you trade, when you trade, what counts as a valid setup, how much you risk, how you exit, and when you stop for the day. It turns decisions made under pressure into decisions made in advance. One page is enough. A plan you follow is worth more than a detailed one you do not.",
    body: [
      { type: "h2", text: "The sections" },
      {
        type: "table",
        head: ["Section", "Question it answers", "Example"],
        rows: [
          ["Markets", "What do I trade?", "EUR/USD only"],
          ["Times", "When?", "13:00 to 16:00 UTC, Monday to Thursday"],
          ["Setup", "What exactly makes a trade valid?", "Pullback to a marked hourly level in the direction of the daily trend, with a rejection candle"],
          ["Entry", "How do I get in?", "After the candle closes"],
          ["Risk", "How much per trade?", "1% of the account"],
          ["Stop", "Where am I wrong?", "Beyond the level"],
          ["Exit", "Where do I take profit?", "The next level, at least twice the stop distance"],
          ["Daily limits", "When do I stop?", "After 3 trades, or a loss of 3%"],
          ["Review", "When do I check my results?", "Sunday, from the journal"],
        ],
      },
      { type: "h2", text: "Writing it" },
      {
        type: "steps",
        items: [
          { title: "Start with risk and limits", text: "They matter most and are the easiest to define." },
          { title: "Describe one setup", text: "So exactly that another person would take the same trades." },
          { title: "Add what you will not do", text: "No trading around major news; no adding to losers." },
          { title: "Keep it to one page", text: "And put it where you can see it." },
          { title: "Test it on demo", text: "A hundred trades, then revise once." },
        ],
      },
      { type: "h2", text: "Rules for the plan itself" },
      {
        type: "list",
        items: [
          "Never change it during a session.",
          "Change it only at a scheduled review, from evidence in your journal.",
          "Change one thing at a time.",
          "If you break it, write down that you did, and why.",
        ],
      },
      { type: "h2", text: "A plan for a bot" },
      {
        type: "table",
        head: ["Item", "Decide before starting"],
        rows: [
          ["Contract and market", "Which, and why"],
          ["Stake and stake rule", "The amount, and whether it ever changes"],
          ["Largest stake allowed", "A number"],
          ["Session stop loss and profit target", "As money"],
          ["Runs per day", "How many, and what ends the day"],
          ["Retirement rule", "The result at which the bot is stopped and re-tested"],
        ],
      },
      {
        type: "p",
        text: "A bot's settings are a plan the machine keeps. The rows about runs per day and retirement are the part only you can keep.",
      },
      { type: "h2", text: "Why most plans fail" },
      {
        type: "p",
        text: "Not because they are wrong, but because they are abandoned in the first losing stretch. A plan with a small enough risk is far easier to keep, since no single loss feels worth breaking it for.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What should a trading plan include?",
        a: "Markets, times, the setup, entry, risk per trade, stop, exit, daily limits and a review schedule.",
      },
      {
        q: "How long should a trading plan be?",
        a: "One page. If it is longer, you will not consult it when it matters.",
      },
      {
        q: "How often should I change my plan?",
        a: "Only at scheduled reviews, on evidence from at least fifty trades, one change at a time.",
      },
    ],
    related: ["how-to-keep-a-trading-journal", "how-to-review-trading-results"],
  },

  {
    slug: "what-is-a-prop-firm",
    title: "What is a prop firm and how do funded accounts work?",
    description:
      "A retail prop firm sells an evaluation: pass its rules and trade a funded account for a profit share. How challenges work and where the catches are.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "A proprietary trading firm trades its own capital. The retail version sells an evaluation, or challenge: you pay a fee and must reach a profit target without breaking loss limits. If you pass, you trade an account the firm funds and keep a share of the profits. Most participants fail the evaluation, and their fees are a large part of the business.",
    body: [
      { type: "h2", text: "How a challenge works" },
      {
        type: "steps",
        items: [
          { title: "Pay a fee", text: "For an evaluation account of a chosen size." },
          { title: "Reach the profit target", text: "Often in one or two phases." },
          { title: "Stay inside the rules", text: "A maximum daily loss and a maximum total drawdown." },
          { title: "Receive a funded account", text: "Usually simulated, with the firm paying your share of profits." },
          { title: "Request payouts", text: "On the firm's schedule, while still obeying the rules." },
        ],
      },
      { type: "h2", text: "The usual rules" },
      {
        type: "table",
        head: ["Rule", "Typical form", "Catch"],
        rows: [
          ["Profit target", "A percentage of the account", "Encourages oversized trades to pass quickly"],
          ["Daily loss limit", "A percentage per day", "One bad session ends the account"],
          ["Maximum drawdown", "Fixed, or trailing from the highest balance", "A trailing limit follows your profits upward"],
          ["Minimum trading days", "A number of days", "Slows down a lucky pass"],
          ["Restrictions", "News, weekends, certain strategies", "A breach can void a payout"],
        ],
      },
      {
        type: "p",
        text: "Each firm sets its own terms, and they change. Read the actual rules of the firm in front of you.",
      },
      { type: "h2", text: "Why people use them" },
      {
        type: "list",
        items: [
          "The most you can lose is the fee.",
          "Access to a larger account than your own savings allow.",
          "The rules force risk control.",
        ],
      },
      { type: "h2", text: "What to check" },
      {
        type: "list",
        items: [
          "How long the firm has operated and whether payouts are documented by independent users.",
          "The exact drawdown rule, and whether it trails.",
          "Payout conditions, minimums and timing.",
          "What happens to the account after a rule breach.",
          "Whether the firm is regulated at all. Many are not, and some have closed owing traders money.",
          "The total you are likely to spend on repeated attempts.",
        ],
      },
      { type: "h2", text: "The honest arithmetic" },
      {
        type: "p",
        text: "The profit target and the loss limits together describe a bet. A trader without an edge passes sometimes by luck and fails more often, paying a fee each time. For a trader with a proven edge and discipline, a funded account can be an efficient way to trade size. For everyone else it is a way to pay for attempts.",
      },
      { type: "h2", text: "FXNOD is not a prop firm" },
      {
        type: "p",
        text: "FXNOD does not sell challenges or fund accounts. Its tools trade your own Deriv account with your own money, or Deriv's virtual funds on demo.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Are prop firms legit?",
        a: "Some pay reliably and some have collapsed. Many are unregulated. Check the firm's history and payout record before paying.",
      },
      {
        q: "Do prop firms give you real money?",
        a: "Funded accounts are often simulated, with the firm paying your profit share from its own funds. Terms vary.",
      },
      {
        q: "How many traders pass prop firm challenges?",
        a: "A minority. Firms rarely publish audited figures, and those that give numbers show most participants failing.",
      },
    ],
    related: ["can-you-make-a-living-trading", "what-is-drawdown-in-trading"],
  },

  {
    slug: "forex-account-management-services",
    title: "Forex account management services: are they safe?",
    description:
      "Account managers offer to trade your money for a share of profit. How legitimate arrangements differ from the common scam, and what to verify.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "A forex account management service trades your money for you, usually for a share of the profits. Legitimate versions are run by licensed firms under a formal agreement that gives the manager trading access only. Offers that arrive by social media or messaging, ask for your login or a transfer to a personal account, or promise fixed returns are a very common scam.",
    body: [
      { type: "h2", text: "Legitimate and not" },
      {
        type: "table",
        head: ["", "Legitimate arrangement", "Typical scam"],
        rows: [
          ["Who", "A licensed firm you can find on a regulator's register", "An individual with screenshots"],
          ["Your money", "Stays in an account in your name at a regulated broker", "Is sent to them, or to a platform they chose"],
          ["Access", "Trading only, by a formal authority you can revoke", "Your login and password"],
          ["Returns", "Not promised", "Guaranteed, often a percentage per week"],
          ["Agreement", "A written contract and risk disclosure", "A chat message"],
          ["Withdrawal", "By you, at any time", "Blocked, or needs a fee"],
          ["Contact began", "You approached them", "They messaged you"],
        ],
      },
      { type: "h2", text: "How managed accounts are structured" },
      {
        type: "list",
        items: [
          "A limited power of attorney lets a manager trade your account without being able to withdraw.",
          "Pooled structures let a manager trade many accounts at once, each client's share allocated in proportion.",
          "Fees are usually a share of profits above a previous high, sometimes with a management fee.",
          "In most countries, managing other people's money for a fee requires a licence.",
        ],
      },
      { type: "h2", text: "Verify before anything else" },
      {
        type: "steps",
        items: [
          { title: "Find the firm on the regulator's own register", text: "Reached by your own search." },
          { title: "Confirm your money stays in your name", text: "At a broker you chose and can log in to." },
          { title: "Read the agreement", text: "Fees, authority, how to end it." },
          { title: "Ask for an audited record", text: "Including maximum drawdown." },
          { title: "Test a withdrawal", text: "Early, with a small amount." },
        ],
      },
      { type: "h2", text: "Even when it is legitimate" },
      {
        type: "list",
        items: [
          "The manager can lose your money. Past results do not continue by right.",
          "A profit share rewards risk-taking: the manager shares gains and not losses.",
          "Smooth track records often hide recovery strategies.",
          "You remain responsible for tax and for monitoring the account.",
        ],
      },
      { type: "h2", text: "Never share your login" },
      {
        type: "p",
        text: "Giving someone your broker password hands over the account, breaks most brokers' terms, and leaves you without recourse. Deriv's terms say you alone control access to your account and that no third party may be granted access.",
      },
      { type: "h2", text: "FXNOD does not manage accounts" },
      {
        type: "p",
        text: "Nobody at FXNOD will offer to trade your account or ask for your Deriv login. FXNOD's bots run the rules you set or rules published in full, on your own account, and you can stop them at any time.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is forex account management legal?",
        a: "It is where the manager holds the licence your country requires. Unlicensed management of client money is unlawful in many places.",
      },
      {
        q: "Should I give an account manager my password?",
        a: "No. Legitimate arrangements use a limited trading authority, never your login.",
      },
      {
        q: "What is a fair fee for account management?",
        a: "Commonly a share of new profits. A fee tells you nothing about skill, and a guaranteed return is a warning sign.",
      },
    ],
    related: ["how-to-identify-trading-scams", "is-copy-trading-safe"],
  },

  {
    slug: "trading-account-hacked",
    title: "Trading account hacked: what to do right now",
    description:
      "If your trading account was accessed by someone else: secure your email, change passwords, revoke app access, tell the broker and your bank. Step by step.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "If your trading account has been hacked, act in this order: secure the email account linked to it, change the trading account's password, revoke every connected app and API token, contact the broker's official support to freeze withdrawals, and tell your bank or card provider. Then find out how they got in, or it will happen again.",
    body: [
      { type: "h2", text: "The first hour" },
      {
        type: "steps",
        items: [
          { title: "Secure your email first", text: "Change its password and turn on two-factor authentication. Whoever controls the email can reset everything else." },
          { title: "Change the trading account password", text: "From a device you trust, to one used nowhere else." },
          { title: "Sign out all other sessions", text: "Where the broker offers it." },
          { title: "Revoke connected apps and API tokens", text: "Remove everything, then add back only what you use." },
          { title: "Contact the broker through its official site", text: "Ask them to freeze withdrawals and note unauthorised activity." },
          { title: "Tell your bank or card provider", text: "If payment details may be exposed or money has moved." },
        ],
      },
      { type: "h2", text: "What to record" },
      {
        type: "list",
        items: [
          "Each trade, transfer or withdrawal you did not make, with times.",
          "Login history, if the broker shows it.",
          "Any messages, emails or links that preceded the incident.",
          "The reference number of your report to the broker.",
        ],
      },
      { type: "h2", text: "How accounts are usually taken" },
      {
        type: "table",
        head: ["Method", "How it looks"],
        rows: [
          ["Phishing", "A fake login page reached from an advert, email or message"],
          ["Fake support", "Someone posing as the broker asks for your password or a code"],
          ["Shared credentials", "A login given to an account manager or a bot seller"],
          ["A leaked API token", "A token with broad permissions pasted into a tool or a chat"],
          ["Malware", "A fake trading app, cracked software or a browser extension"],
          ["Password reuse", "The same password leaked from another site"],
          ["SIM swap", "Your phone number is moved to another SIM to intercept codes"],
        ],
      },
      { type: "h2", text: "Find the cause" },
      {
        type: "p",
        text: "Scan your devices, remove unfamiliar apps and extensions, and think back over what you clicked or installed and whom you gave access to. Changing a password on an infected device hands the new one to the same person.",
      },
      { type: "h2", text: "Preventing the next one" },
      {
        type: "list",
        items: [
          "A unique password for every account, kept in a password manager.",
          "Two-factor authentication with an app, not text messages, wherever offered.",
          "Type the broker's address yourself. Never sign in from a link.",
          "Give trading tools the minimum permissions, and never your password.",
          "Install apps only from official stores.",
        ],
      },
      { type: "h2", text: "Beware the second scam" },
      {
        type: "p",
        text: "After a loss you may be contacted by people offering to recover your funds for a fee. They are usually the same criminals or others like them. Real recovery goes through the broker, your bank and the police.",
      },
      { type: "h2", text: "If the account is connected to FXNOD" },
      {
        type: "p",
        text: "FXNOD never holds your Deriv password. Disconnect the Deriv login in Connected Accounts, and remove FXNOD from the connected apps in your Deriv settings: either cuts the access and stops bots on that login. Change your FXNOD password too, and reconnect only once the Deriv account is secure.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Can I get my money back after a trading account hack?",
        a: "Sometimes. Report it to the broker and your bank immediately. Speed makes a real difference.",
      },
      {
        q: "How do I know if my trading account was hacked?",
        a: "Trades or withdrawals you did not make, login alerts from unknown places, or a password that no longer works.",
      },
      {
        q: "Does two-factor authentication stop hacks?",
        a: "It blocks most password theft. It does not protect you if you hand over the code or approve a malicious app.",
      },
    ],
    related: ["lost-access-to-deriv-account", "how-to-identify-trading-scams"],
  },
];
