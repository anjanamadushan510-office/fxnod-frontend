/**
 * The public guides: one per tool, written for someone who has not used it.
 *
 * These live in the repository rather than in the blog database because each
 * one describes what the product does, and has to change in the same commit
 * as the product. A guide that says a tool does something it does not is a
 * false public statement about a trading product, and it is also what search
 * engines and AI assistants will repeat.
 *
 * Shape of a guide: the question as the title, a short direct answer first
 * (`answer`), then the detail. The answer is the part an assistant or a
 * search snippet quotes, so it must stand on its own.
 */

import {
  AUTOHUB_BOT_COUNT,
  FIXED_PLAN_BOTS,
  OWN_AMOUNT_BOTS,
  botGuideSlug,
  contractTicks,
  stakeStyle,
  type BotFamily,
} from "./autohubCatalogue";

export type GuideBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "note"; title: string; text: string }
  /** Links to other pages of the site, each with a line saying what is there. */
  | { type: "links"; items: { href: string; label: string; text: string }[] };

/** The box under a guide that says what to do next in FXNOD. */
export interface GuideCta {
  title: string;
  text: string;
}

export interface Guide {
  slug: string;
  title: string;
  /** Meta description and card excerpt. Keep under about 160 characters. */
  description: string;
  tag: string;
  /** ISO dates. `updated` moves whenever the content does. */
  published: string;
  updated: string;
  image: string;
  answer: string;
  body: GuideBlock[];
  faq: { q: string; a: string }[];
  /** Slugs of the guides to read next. */
  related: string[];
  /** Replaces the section's call to action where a guide needs its own. */
  cta?: GuideCta;
}

/** A guide in another language, with the English guide it corresponds to. */
export interface LocalGuide extends Guide {
  /** Slug of the English guide that says the same thing, if there is one. */
  en?: string;
}

export const RISK_NOTE: GuideBlock = {
  type: "note",
  title: "Risk warning",
  text: "Options and multipliers are high-risk products. You can lose your entire stake on any trade, and a bot can lose it faster than you would by hand. Nothing on this page is financial advice. Try everything on a Deriv demo account first.",
};

/** The plan bots of one contract family, as a table of the overview guide. */
function planBotTable(family: BotFamily): GuideBlock {
  return {
    type: "table",
    head: ["Bot", "Contract", "Enters", "Stake", "Plans (stop loss)"],
    rows: FIXED_PLAN_BOTS.filter((bot) => bot.family === family).map((bot) => [
      bot.name,
      family === "rise_fall" ? `${bot.bet}, ${contractTicks(bot)} ${contractTicks(bot) === 1 ? "tick" : "ticks"}` : bot.bet,
      bot.pace,
      stakeStyle(bot),
      bot.plans.map((p) => p.stopLoss).join(", "),
    ]),
  };
}

export const GUIDES: Guide[] = [
  {
    slug: "connect-deriv-account",
    title: "How to connect your Deriv account to FXNOD (demo or real)",
    description:
      "Connect a Deriv account to FXNOD in about a minute: sign in on Deriv's own page, pick demo or real, and switch between them without logging in again.",
    tag: "Getting started",
    published: "2026-10-06",
    updated: "2026-10-06",
    image: "/assets/login-slide-3.jpg",
    answer:
      "Open Connected Accounts in FXNOD and press Connect Deriv. You sign in on Deriv's own page and approve access, then return to FXNOD with every account under that Deriv login listed. Pick the demo account to practise with virtual funds, or a real account to trade your own money. FXNOD never sees your Deriv password.",
    body: [
      { type: "h2", text: "What you need first" },
      {
        type: "list",
        items: [
          "A Deriv account. FXNOD does not open one for you, so create it on Deriv before you start. A Deriv login includes a demo account with virtual funds.",
          "An FXNOD account. Sign up with your email and confirm it with the code FXNOD sends you.",
        ],
      },
      { type: "h2", text: "Connect in four steps" },
      {
        type: "steps",
        items: [
          {
            title: "Open Connected Accounts",
            text: "Sign in to FXNOD and open Connected Accounts. If nothing is linked yet, the page says no Deriv account is connected.",
          },
          {
            title: "Press Connect Deriv",
            text: "FXNOD sends you to Deriv's login page. Before you type anything, check that the address in your browser ends in deriv.com. Your password goes to Deriv and nowhere else.",
          },
          {
            title: "Approve access",
            text: "Deriv shows what FXNOD is asking for. Approve it and Deriv sends you back to FXNOD.",
          },
          {
            title: "Choose the account to trade",
            text: "Every account under that Deriv login appears, demo and real. Select the one you want FXNOD to trade. You can change it at any time.",
          },
        ],
      },
      { type: "h2", text: "Demo or real: how switching works" },
      {
        type: "p",
        text: "One approval covers every account under the same Deriv login, so switching between demo and real is a choice you make inside FXNOD. There is no second trip to Deriv. The demo account is labelled as virtual funds. When you select a real account, FXNOD asks you to confirm first, because from that moment manual orders spend real money.",
      },
      {
        type: "p",
        text: "Switching does not move a bot that is already running. A bot keeps trading the account it was started on until it stops, whatever you select afterwards. That rule exists so that a bot you started on demo can never end up on real money by accident.",
      },
      { type: "h2", text: "Bots ask for one more approval" },
      {
        type: "p",
        text: "The first time you run a bot, Deriv asks you to allow FXNOD's automated-trading connection. It is a separate permission from the one you gave for manual trading, and you grant it the same way: on Deriv's page, not on FXNOD's.",
      },
      { type: "h2", text: "Disconnecting" },
      {
        type: "p",
        text: "You can disconnect a Deriv login from Connected Accounts at any time. FXNOD stops trading its accounts, withdraws any bot approval given for them, and stops the bots running on that login. Other Deriv logins you have connected are left alone. You can also remove FXNOD from the connected apps list in your Deriv account settings, which cuts the access from Deriv's side.",
      },
      {
        type: "note",
        title: "What FXNOD stores",
        text: "FXNOD never receives your Deriv password. What it holds is the permission Deriv issued when you approved access, and it stores that encrypted. Your trading balance stays in your Deriv account the whole time.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is it safe to connect my Deriv account to FXNOD?",
        a: "You sign in on Deriv's own page, so FXNOD never sees your Deriv password. FXNOD receives a permission from Deriv, stores it encrypted, and you can withdraw it at any time from Connected Accounts or from your Deriv account settings. FXNOD is an independent product and is not part of Deriv. Connecting an account does not reduce the risk of the trades themselves.",
      },
      {
        q: "Can I use FXNOD with only a Deriv demo account?",
        a: "Yes. Select the demo account after connecting and every trade uses Deriv's virtual funds. It is the right way to test a bot before you risk money.",
      },
      {
        q: "Can I connect more than one Deriv login?",
        a: "Yes. Use Add another Deriv account on the Connected Accounts page. Each login is connected and disconnected on its own.",
      },
      {
        q: "Does FXNOD hold my trading money?",
        a: "No. The money you trade with stays in your Deriv account. FXNOD sends your orders to Deriv and shows you the result.",
      },
    ],
    related: ["dtrader-manual-trading", "build-a-deriv-bot-with-dbot"],
  },

  {
    slug: "dtrader-manual-trading",
    title: "How to trade manually on Deriv with FXNOD Trader",
    description:
      "FXNOD Trader is FXNOD's manual trading screen for Deriv: a live chart, a market picker and ten trade types. Here is how to place a trade and what each type means.",
    tag: "FXNOD Trader",
    published: "2026-10-06",
    updated: "2026-10-06",
    image: "/assets/login-slide-1.jpg",
    answer:
      "FXNOD Trader is FXNOD's manual trading screen for Deriv. Pick a market, pick a trade type such as Rise/Fall or Multipliers, set your stake and duration, read the payout Deriv quotes, and press Buy. The trade is placed on your own Deriv account and stays on the chart until it settles.",
    body: [
      { type: "h2", text: "What FXNOD Trader is" },
      {
        type: "p",
        text: "FXNOD Trader is one screen with three parts: a live chart, a market picker and an order panel. You decide every trade yourself. It runs on the Deriv account you connected to FXNOD, demo or real, and you open it from Options in the FXNOD menu.",
      },
      { type: "h2", text: "The ten trade types" },
      {
        type: "table",
        head: ["Trade type", "What you are predicting"],
        rows: [
          ["Rise/Fall", "Whether the price finishes higher or lower than where it started."],
          ["Higher/Lower", "Whether the price finishes above or below a target you pick."],
          ["Touch/No Touch", "Whether the price touches a target at any moment before time runs out."],
          ["Matches/Differs", "Whether the last digit of the final price is the digit you picked, or any other digit."],
          ["Even/Odd", "Whether the last digit of the final price is even or odd."],
          ["Over/Under", "Whether the last digit is higher or lower than a digit you pick."],
          ["Accumulators", "The payout grows every tick the price stays inside a band, and the trade ends if the price reaches the edge."],
          ["Multipliers", "The position follows the price with a multiplier. You cannot lose more than your stake."],
          ["Turbos", "The price has to stay on your side of a barrier. The trade is knocked out if the price crosses it."],
          ["Vanillas", "A Call or a Put against a strike. The payout depends on how far the price finishes past it."],
        ],
      },
      {
        type: "p",
        text: "If a name is new to you, open the trade types guide inside FXNOD Trader. It shows a short animation for each type, which is quicker than any description.",
      },
      { type: "h2", text: "Placing a trade, step by step" },
      {
        type: "steps",
        items: [
          {
            title: "Check which account is selected",
            text: "The account selector shows whether you are on demo or real. Look at it before every session. It is the difference between virtual funds and your own money.",
          },
          {
            title: "Pick a market",
            text: "Open the market picker, browse by category or search by name, and star the markets you use so they are one tap away next time.",
          },
          {
            title: "Pick a trade type",
            text: "Choose one of the ten types above. The order panel changes to show only the fields that type needs.",
          },
          {
            title: "Set the stake and the terms",
            text: "Enter your stake, then the duration, target, digit, multiplier or growth rate, depending on the type. Multipliers and Accumulators also let you set a take profit, and Multipliers a stop loss.",
          },
          {
            title: "Read the quote",
            text: "Before you buy, the panel shows what Deriv will pay for exactly those settings. Change anything and the quote changes with it. Do not buy a contract whose payout you have not read.",
          },
          {
            title: "Press Buy",
            text: "The trade is placed on your Deriv account. The entry is marked on the chart and the position is listed until it settles. Where Deriv offers a sell price for an open contract, you can close it early from the position.",
          },
        ],
      },
      { type: "h2", text: "The chart" },
      {
        type: "p",
        text: "The chart updates with every tick. You can change the chart type, add indicators such as moving averages, RSI and Bollinger Bands, and draw on it with the drawing tools. Indicators describe what the price has already done. They do not know what the next tick will be, and on a synthetic index nobody does.",
      },
      { type: "h2", text: "What it costs" },
      {
        type: "p",
        text: "FXNOD Trader requires an active tool package. Review current pricing and access periods in Discover. The stake, the payout and the result of every trade are the ones on your Deriv account.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is FXNOD Trader the same as Deriv's own trading app?",
        a: "No. FXNOD Trader is a separate interface built by FXNOD. It places trades on your Deriv account through Deriv's API, so the contracts and prices come from Deriv, but FXNOD is an independent product and is not affiliated with Deriv.",
      },
      {
        q: "Do I need to deposit money into FXNOD to trade?",
        a: "No. FXNOD Trader uses the balance in your Deriv account. On a demo account that is Deriv's virtual money.",
      },
      {
        q: "Can I use FXNOD Trader on a phone?",
        a: "Yes. FXNOD Trader runs in a phone browser and there is nothing to install.",
      },
      {
        q: "Can I close a trade before it expires?",
        a: "For contracts where Deriv offers a sell price while the trade is open, yes: sell it from the open position. Some short contracts, such as one-tick digit trades, simply run to the end.",
      },
      {
        q: "Which trade type is best for a beginner?",
        a: "Rise/Fall is the easiest to understand, because there is only one question: will the price finish higher or lower. Easy to understand does not mean safe. A losing Rise/Fall trade costs the whole stake.",
      },
    ],
    related: ["connect-deriv-account", "build-a-deriv-bot-with-dbot"],
  },

  {
    slug: "build-a-deriv-bot-with-dbot",
    title: "How to build a Deriv trading bot without code in FXNOD Bot Builder",
    description:
      "Build a Deriv bot in FXNOD Bot Builder by answering plain questions: what to buy, when to enter, how much to stake and when to stop. No blocks and no code.",
    tag: "FXNOD Bot Builder",
    published: "2026-10-06",
    updated: "2026-10-06",
    image: "/assets/login-slide-2.jpg",
    answer:
      "In FXNOD Bot Builder you build a bot by answering questions in plain language: what it should buy, on which markets, when it should enter, how much it stakes and when it stops. There are no blocks to wire and no code to write. Save the bot, press Run, confirm the Deriv account, and it trades from FXNOD's servers until one of your limits is reached.",
    body: [
      { type: "h2", text: "Start from a template, or from nothing" },
      {
        type: "p",
        text: "If you have never built a bot, start with a template. Each one is already filled in, and you can change anything before you run it.",
      },
      {
        type: "table",
        head: ["Template", "What it does"],
        rows: [
          ["Even / Odd — first bot", "Trades Even on a calm index with the same stake every time. Stops at your profit or loss cap."],
          ["Differs — last digit", "Wins if the last digit is not 5. Wins often and pays a little each time."],
          ["Over / Under — switch", "Starts on Under 7 and takes the other side after a loss."],
          ["Even / Odd — fade a streak", "Waits for three even or three odd ticks in a row, then bets the other side."],
          ["Rise / Fall — follow ticks", "Buys Rise if the last tick went up and Fall if it went down, on 5-tick contracts."],
          ["Rise / Fall — Martingale", "Always buys Rise and doubles the stake after a loss, at most three times."],
          ["Accumulator — grow in a band", "The payout grows each tick while the price stays in its band, and the bot takes a small profit early."],
        ],
      },
      { type: "h2", text: "The builder, step by step" },
      {
        type: "steps",
        items: [
          {
            title: "What should it buy?",
            text: "Choose the trade type: Rise/Fall, Higher/Lower, Matches/Differs, Even/Odd, Over/Under, Accumulators, Multipliers, Touch/No Touch, Vanillas or Turbos.",
          },
          {
            title: "Which markets?",
            text: "Pick one market or several. With several, the bot either works through them one after another with a single open trade at a time, or trades each market on its own at the same time. Your session limits cover all of them together.",
          },
          {
            title: "The contract terms",
            text: "Set how long each contract lasts and, where the trade type needs it, the target, multiplier or growth rate. FXNOD Bot Builder asks Deriv which durations those markets sell and only lets you pick a length that exists on every market you selected.",
          },
          {
            title: "Indicators (optional)",
            text: "Add RSI, a simple or exponential moving average, MACD, Bollinger Bands, Stochastic or ATR. With indicators deciding, each trade takes the side they agree on and the bot waits when they disagree. A bot can also trade with no indicators at all.",
          },
          {
            title: "The entry rule",
            text: "The rule the bot checks before every contract: always the same side, flip after a loss, copy the last tick, fade the last tick, or wait for a streak of three and then fade it.",
          },
          {
            title: "Money",
            text: "Set the starting stake and what happens after each trade: same stake, gentle step, Martingale or reverse Martingale. Then set the limits: never stake more than an amount, stop when the loss reaches an amount, stop when the profit reaches an amount, and a maximum number of trades for the run.",
          },
          {
            title: "Review and save",
            text: "Read the summary and save. The bot is stored on your FXNOD account, so it is there on every device you sign in from.",
          },
        ],
      },
      { type: "h2", text: "Running a bot" },
      {
        type: "p",
        text: "Press Run on a saved bot and confirm which Deriv account it should trade. Use the demo account until you have watched the bot through both a winning and a losing stretch. The first time, Deriv asks you to allow FXNOD's automated-trading connection.",
      },
      {
        type: "p",
        text: "The bot runs on FXNOD's servers, not in your browser. You can close the page and it keeps trading, and your stop loss keeps working, because the limits are checked on the server before every trade. To end a run early, stop it from the run page. There is also an emergency stop, which ends the run and sells what is still open where Deriv allows it.",
      },
      { type: "h2", text: "Your limits and FXNOD's limits" },
      {
        type: "p",
        text: "You set the stake and the stop loss for each bot. On top of that, FXNOD applies its own ceilings: on the stake a bot starts from, on the loss of one session, on the total loss across all your bots on one account, on the multiplier Martingale may use, and on how many bots run at once. If your number is higher than a ceiling, the ceiling wins. A stake that grows after a loss is limited by your own “never stake more than” amount, and is never larger than the session’s stop loss.",
      },
      { type: "h2", text: "Read this before you choose Martingale" },
      {
        type: "p",
        text: "Martingale multiplies the stake after every loss so that one win recovers the losses before it. The arithmetic is unforgiving. Starting at 1 and doubling, seven losses in a row means stakes of 1, 2, 4, 8, 16, 32 and 64, which is 127 lost to win back 1. Losing streaks of that length do happen. FXNOD Bot Builder labels Martingale as high risk. You choose how many steps it may take, and the builder shows the stakes of a losing streak before you start. When the last step loses, or the next stake would be more than one trade is allowed, the session ends with the loss; FXNOD Bot Builder does not place a smaller stake that could not win the streak back. The stop loss is checked before each trade, so the last trade of a streak can take the session past it. Same stake is the recommended setting for a reason.",
      },
      { type: "h2", text: "What it costs" },
      {
        type: "p",
        text: "FXNOD Bot Builder has no subscription and no sign-up fee. You can build a bot, save it and test it on a demo account before you use real money.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is FXNOD Bot Builder the same as Deriv Bot?",
        a: "No. FXNOD Bot Builder is a separate bot builder made by FXNOD. It does not use Blockly blocks: you answer questions in plain language instead. The bot trades on your Deriv account through Deriv's API, but FXNOD is an independent product and is not affiliated with Deriv.",
      },
      {
        q: "Does the bot keep running when I close my browser?",
        a: "Yes. It runs on FXNOD's servers, so it keeps trading after you close the page. It stops when it reaches one of your limits or when you stop it.",
      },
      {
        q: "Can I test a bot without risking money?",
        a: "Yes. Run it on your Deriv demo account. It trades with virtual funds and follows the same rules as on a real account.",
      },
      {
        q: "Do I need to know how to code?",
        a: "No. Every setting is a question with a short explanation, and the templates give you a working bot to change.",
      },
      {
        q: "Can a bot guarantee a profit?",
        a: "No. A bot applies its rules without hesitating, and that is all. A rule that loses will lose automatically. Always set a stop loss.",
      },
    ],
    related: ["auto-hub-ready-made-bots", "connect-deriv-account"],
  },

  {
    slug: "auto-hub-ready-made-bots",
    title: "FXNOD Auto Hub: every ready-made Deriv bot and how it trades",
    description: `Auto Hub has ${AUTOHUB_BOT_COUNT} ready-made Deriv bots. What each one trades, when it enters, whether its stake is flat or Martingale, and how to start one.`,
    tag: "Auto Hub",
    published: "2026-10-06",
    updated: "2026-10-12",
    image: "/assets/login-slide-3.jpg",
    answer: `Auto Hub is a set of bots that FXNOD has already built. You do not design anything: pick a bot, choose its market, choose its amounts, and start it. There are ${AUTOHUB_BOT_COUNT} bots. They trade Deriv's digit contracts (Matches / Differs, Even / Odd and Over / Under) and Rise / Fall, in contracts of one to ten ticks. ${FIXED_PLAN_BOTS.length} are started with a fixed plan that sets the stop loss, the stake and the profit target together, and three take amounts you set yourself.`,
    body: [
      { type: "h2", text: "Auto Hub or FXNOD Bot Builder?" },
      {
        type: "table",
        head: ["", "FXNOD Bot Builder", "Auto Hub"],
        rows: [
          ["Who designs the strategy", "You do", "FXNOD did"],
          ["What you set", "Trade type, markets, entry rule, stake sizing, limits", "The market and a plan, or the market and your amounts, plus the few settings a bot lists"],
          ["Stake sizing", "Same stake, gentle step, Martingale or reverse Martingale", "Fixed by the bot: flat for some, Martingale for others"],
          ["Good for", "Testing an idea of your own", "Starting quickly with a bot whose rules are fixed and written down"],
        ],
      },
      { type: "h2", text: "How an Auto Hub bot is described" },
      {
        type: "p",
        text: "Every bot is defined by four things, and its page in Auto Hub lists them under How it works.",
      },
      {
        type: "list",
        items: [
          "The contract. One contract and one length, such as a one-tick Over 4 or a five-tick Rise / Fall. It decides what wins and how much a win pays.",
          "The entry rule. When the bot buys: on every tick, once every few ticks, or after a pattern in the last digits or in the direction of the last ticks.",
          "The stake plan. Flat, where every trade has the same stake, or Martingale, where the stake is multiplied after a loss and returns to the start after a win.",
          "The limits. A stop loss and a profit target. A bot cannot be started without a stop loss.",
        ],
      },
      {
        type: "p",
        text: "The entry rule sets when a bot trades and how often. It does not make any single trade more likely to win, and no bot here can guarantee a profit.",
      },
      { type: "h2", text: "Bots started with a plan" },
      {
        type: "p",
        text: `${FIXED_PLAN_BOTS.length} bots trade one market and are started by choosing a plan. A plan is named by its stop loss, which is 20, 100 or 500, and sets the starting stake and the profit target with it. The amounts cannot be changed one by one. On these bots no stake is placed that could take the session's loss past the plan's stop loss.`,
      },
      { type: "h2", text: "Matches / Differs bots" },
      planBotTable("matches_differs"),
      { type: "h2", text: "Even / Odd bots" },
      planBotTable("even_odd"),
      { type: "h2", text: "Over / Under bots" },
      planBotTable("over_under"),
      { type: "h2", text: "Rise / Fall bots" },
      {
        type: "p",
        text: "A Rise wins when the price ends above where the contract started, and a Fall when it ends below. A price that ends exactly where it started loses either way. These bots trade the Volatility indices only.",
      },
      planBotTable("rise_fall"),
      { type: "h2", text: "Bots that take your own amounts" },
      {
        type: "p",
        text: "Three bots ask for a stake per trade, a stop loss and an optional take profit. The stake is flat, starts at 1 and cannot go below 0.35, the smallest stake Deriv takes on these contracts.",
      },
      {
        type: "table",
        head: ["Bot", "Contract", "Enters", "Markets"],
        rows: OWN_AMOUNT_BOTS.map((bot) => [bot.name, bot.bet, bot.pace, bot.markets]),
      },
      { type: "h2", text: "A guide for every bot" },
      {
        type: "links",
        items: [
          ...OWN_AMOUNT_BOTS.map((bot) => ({
            href: `/guides/${botGuideSlug(bot.id)}`,
            label: `${bot.name} bot`,
            text: `${bot.bet}. ${bot.pace}.`,
          })),
          ...FIXED_PLAN_BOTS.map((bot) => ({
            href: `/guides/${botGuideSlug(bot.id)}`,
            label: `${bot.name} bot`,
            text: bot.tagline,
          })),
        ],
      },
      { type: "h2", text: "Starting a bot" },
      {
        type: "steps",
        items: [
          { title: "Open Auto Hub and pick a bot", text: "Read its How it works panel first. It lists every rule the bot follows, in order." },
          {
            title: "Choose the market",
            text: "A plan bot trades one market, and the form suggests the Volatility 100, 75 and 50 indices and their one-second versions. Hot Fade and Shadow Fade can watch up to ten markets.",
          },
          {
            title: "Choose a plan, or set your amounts",
            text: "A plan bot shows its plans as cards: pick one. The three other bots ask for a stake, a stop loss and an optional take profit.",
          },
          {
            title: "Start it on demo first",
            text: "Start on your Deriv demo account and watch a full session. On a real account you tick a box to confirm that the bot trades real money, and the button reads Start with real money.",
          },
        ],
      },
      { type: "h2", text: "Reading the run page" },
      {
        type: "p",
        text: "The run page lists every trade with its market, digit and result, and shows the realised profit or loss, how much of the stop loss has been used and the progress towards the take profit. Shadow Fade's shadow entries are marked and carry no money figure. A bot that waits for a pattern can sit for some time with no entries. That is normal: it is waiting for its signal.",
      },
      { type: "h2", text: "What every bot shares" },
      {
        type: "list",
        items: [
          "It runs on FXNOD's servers. Closing the page does not stop it or switch off its limits.",
          "It holds one trade at a time.",
          "It trades the Deriv account it was started on, demo or real, until it stops.",
          "Auto Hub and FXNOD Bot Builder share the same safety ceilings on an account: a loss in one counts towards the total loss limit for both, and bots from either count towards the limit on how many run at once.",
        ],
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "How many bots does Auto Hub have?",
        a: `${AUTOHUB_BOT_COUNT}. ${FIXED_PLAN_BOTS.length} are started with a fixed plan, and three (Hot Fade, Shadow Fade and Matches / Differs) take a stake, a stop loss and a take profit you set yourself.`,
      },
      {
        q: "What do Auto Hub bots trade?",
        a: "Deriv's digit contracts (Matches / Differs, Even / Odd and Over / Under) and Rise / Fall, in contracts of one to ten ticks. Each bot trades one of them.",
      },
      {
        q: "Does Auto Hub use Martingale?",
        a: "Some bots do. A plan bot is either flat, with the same stake on every trade, or Martingale, with the stake multiplied after a loss. Its guide and its How it works panel say which. The three bots that take your own amounts are always flat.",
      },
      {
        q: "What is a plan in Auto Hub?",
        a: "A plan is a stop loss with the starting stake and the profit target that go with it. You choose a plan whole; its amounts cannot be changed one by one.",
      },
      {
        q: "Can I change how an Auto Hub bot trades?",
        a: "Only through the settings a bot lists, such as the digit for Matches / Differs or the Go live below percentage for Shadow Fade. The strategy itself is fixed. To design your own, use FXNOD Bot Builder.",
      },
      {
        q: "How long does a bot run?",
        a: "Until it reaches its stop loss or its profit target, or until you stop it. It runs on FXNOD's servers, so closing the page does not end it.",
      },
    ],
    related: ["build-a-deriv-bot-with-dbot", "connect-deriv-account", "nine-lives-bot", "high-five-bot"],
  },
];

function blockWords(block: GuideBlock): string {
  switch (block.type) {
    case "h2":
    case "p":
      return block.text;
    case "list":
      return block.items.join(" ");
    case "steps":
      return block.items.map((s) => `${s.title} ${s.text}`).join(" ");
    case "table":
      return [...block.head, ...block.rows.flat()].join(" ");
    case "note":
      return `${block.title} ${block.text}`;
    case "links":
      return block.items.map((l) => `${l.label} ${l.text}`).join(" ");
  }
}

/** Counted from the text, so the label cannot drift from the article. */
export function readMinutes(guide: Guide): number {
  const text = [guide.answer, ...guide.body.map(blockWords), ...guide.faq.map((f) => `${f.q} ${f.a}`)].join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 220));
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/** "2026-10-06" -> "6 OCT 2026". Parsed by hand: no time zone is involved. */
export function formatGuideDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}
