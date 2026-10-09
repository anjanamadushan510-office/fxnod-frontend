/**
 * More on trading bots: the questions people search once they have decided
 * to try one. Deriv Bot, XML files, free bots, the bot that never loses,
 * money needed, demo against real, hosting, API tokens, stopping, legality.
 *
 * Statements about Deriv Bot and Deriv's API are Deriv's own, read on its
 * pages on the date in learnDeriv.ts (`CHECKED`). Statements about FXNOD
 * describe the product and change in the commit that changes it.
 */
import { RISK_NOTE, type Guide } from "./guides";
import { SOURCE_NOTE } from "./learnDeriv";

const TAG = "Automated trading";
const DATE = "2026-10-09";

export const BOT_MORE_GUIDES: Guide[] = [
  {
    slug: "what-is-deriv-bot",
    title: "What is Deriv Bot and how does it work?",
    description:
      "Deriv Bot is Deriv's own no-code bot builder: you assemble a strategy from blocks and it trades options in your browser. What it does and its limits.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Deriv Bot is Deriv's own automated trading tool. You build a strategy by placing visual blocks on a canvas, with no coding, or load a preset or an imported file, and the bot then places options trades on your Deriv account. Deriv notes that it runs in your browser and pauses if the browser is closed.",
    body: [
      { type: "h2", text: "What Deriv says it does" },
      {
        type: "table",
        head: ["Feature", "Detail"],
        rows: [
          ["Building", "Drag-and-drop blocks; Deriv says no coding is needed"],
          ["Starting points", "Build from scratch, import a bot, or use a quick strategy"],
          ["Presets named by Deriv", "Martingale, D'Alembert and Oscar's Grind"],
          ["Risk tools", "Stop loss, take profit and deal cancellation"],
          ["Files", "Strategies are saved and loaded as XML, from your computer or Google Drive"],
          ["Testing", "A free demo account"],
          ["Where it runs", "In your browser; it pauses if the browser is closed"],
        ],
      },
      { type: "h2", text: "How a block strategy is organised" },
      {
        type: "steps",
        items: [
          { title: "Trade parameters", text: "The market, the trade type, the duration and the stake." },
          { title: "Purchase conditions", text: "When to buy, and which side." },
          { title: "Sell conditions", text: "Whether to sell a contract before it ends." },
          { title: "Restart conditions", text: "What to do after each result: trade again, change the stake, or stop." },
        ],
      },
      { type: "h2", text: "Strengths" },
      {
        type: "list",
        items: [
          "It is flexible: almost any rule can be expressed in blocks.",
          "It is Deriv's own tool, on Deriv's own site.",
          "A large community shares strategies for it.",
        ],
      },
      { type: "h2", text: "Limits to know about" },
      {
        type: "list",
        items: [
          "It depends on your browser. A closed tab, a sleeping laptop or a dropped connection pauses the bot.",
          "Blocks take time to learn, and a misplaced block can change the stake logic without any error.",
          "The presets it names all change the stake after a result. Understand the ladder before running one.",
          "Shared strategy files are easy to run without reading.",
        ],
      },
      { type: "h2", text: "Deriv Bot and FXNOD dBot" },
      {
        type: "table",
        head: ["", "Deriv Bot", "FXNOD dBot"],
        rows: [
          ["Made by", "Deriv", "FXNOD, an independent product"],
          ["How you build", "Visual blocks", "Answering questions in plain language"],
          ["Where it runs", "Your browser", "FXNOD's servers"],
          ["If you close the page", "The bot pauses", "The bot and its limits keep running"],
          ["Strategy files", "XML import and export", "Saved to your FXNOD account; no XML files"],
          ["Stop loss", "Available as a tool", "Required to start"],
        ],
      },
      {
        type: "p",
        text: "Both place trades on your own Deriv account through Deriv. The names are similar and the products are separate.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is Deriv Bot free?",
        a: "Deriv's page lists no charge for using it and says you can test on a free demo account. Real trades risk your stake.",
      },
      {
        q: "Does Deriv Bot work when my computer is off?",
        a: "No. Deriv says it runs in your browser and pauses if the browser is closed.",
      },
      {
        q: "Do I need to code to use Deriv Bot?",
        a: "No. Deriv describes it as building with visual blocks, with no coding needed.",
      },
      {
        q: "Is FXNOD dBot the same as Deriv Bot?",
        a: "No. FXNOD's dBot is a separate bot builder made by FXNOD that trades on your Deriv account.",
      },
    ],
    related: ["build-a-deriv-bot-with-dbot", "deriv-bot-xml-files"],
  },

  {
    slug: "deriv-bot-xml-files",
    title: "Deriv Bot XML files: what they are and are they safe?",
    description:
      "A Deriv Bot XML file is a saved block strategy. How to load one, how to read what it does before running it, and the risks of downloaded bots.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "A Deriv Bot XML file is a saved strategy: the blocks of a bot written to a file that Deriv Bot can load from your computer or Google Drive. The file itself is a description of rules. The risk is in those rules. Most shared XML bots hide a stake that grows after losses, so read one before you run it.",
    body: [
      { type: "h2", text: "Loading and saving" },
      {
        type: "list",
        items: [
          "Deriv's guidance says you can import from your computer or Google Drive, or drag the file onto the workspace.",
          "Saving writes the strategy as XML to your computer or to Google Drive.",
          "Deriv Bot keeps a few recent strategies in the browser's temporary storage. Clearing the browser removes them, so save anything you want to keep.",
          "Deriv notes that an update to its block library changed how some XML files are read, and older files can fail with an unsupported elements error.",
        ],
      },
      { type: "h2", text: "Read it before you run it" },
      {
        type: "steps",
        items: [
          { title: "Load it on the demo account", text: "Never on a real account first." },
          { title: "Find the stake", text: "Look at where the stake is set and every block that changes it." },
          { title: "Find what happens after a loss", text: "A multiplication of the stake after a loss is Martingale, whatever the bot is called." },
          { title: "Find the limits", text: "Is there a stop loss and a maximum stake? What are they set to?" },
          { title: "Run a few hundred demo trades", text: "Watch the largest stake it reaches, not the profit." },
        ],
      },
      { type: "h2", text: "What downloaded bots usually are" },
      {
        type: "table",
        head: ["How it is advertised", "What is usually inside"],
        rows: [
          ["99% win rate", "A high-chance contract such as Differs, with a stake multiplier after a loss"],
          ["Never loses", "A Martingale that has not met its streak in the video"],
          ["For small accounts", "A low base stake on the same ladder"],
          ["Entry point bot", "A digit or streak condition, which does not change the odds of a random tick"],
          ["2026 updated", "The same file with a new name"],
        ],
      },
      { type: "h2", text: "Is the file itself dangerous?" },
      {
        type: "list",
        items: [
          "An XML strategy loaded into Deriv's own bot builder runs as a strategy. It trades with whatever stake logic it contains.",
          "The danger around it is greater: fake Deriv sites that ask you to sign in, Android app files, and sellers who ask for your password or an API token.",
          "Load files only in Deriv Bot on Deriv's own site, and never give anyone your login to set a bot up for you.",
        ],
      },
      { type: "h2", text: "Where they come from" },
      {
        type: "p",
        text: "Telegram groups, video descriptions and file-sharing sites. Many are given away to attract people into paid groups, or to sign them up through a referral link that pays the sharer on every trade, win or lose. The sharer's income does not depend on the bot working.",
      },
      { type: "h2", text: "FXNOD does not use XML files" },
      {
        type: "p",
        text: "FXNOD's dBot is not a block builder and cannot load a Deriv Bot XML file. A bot there is built by answering questions, its stake rule is one named setting, and it shows the stakes of a losing streak before you start. Auto Hub's bots have their rules written out in full.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "How do I load an XML bot into Deriv Bot?",
        a: "Deriv's guidance is to use the import option and choose your computer or Google Drive, or drag the file onto the workspace.",
      },
      {
        q: "Are free Deriv bot XML files safe?",
        a: "The file is a set of rules, and the rules are the risk. Most contain a stake that grows after losses. Read and test on demo first.",
      },
      {
        q: "Why does my XML file say unsupported elements?",
        a: "Deriv says an update to its block library changed how files are read, which can affect older files. Deriv's community has the details.",
      },
      {
        q: "Can I use Deriv Bot XML files in FXNOD?",
        a: "No. FXNOD's dBot does not use blocks or XML files.",
      },
    ],
    related: ["what-is-deriv-bot", "free-deriv-bots"],
  },

  {
    slug: "free-deriv-bots",
    title: "Free Deriv bots: what you get and what to check",
    description:
      "Free Deriv bots are everywhere. Where they come from, why they are free, the six checks to run, and free options that show you their rules.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Free Deriv bots are easy to find, and free is not the problem. The problem is that most are a Martingale under another name, shared by someone who is paid whether you win or lose. A free bot is worth using when you can read its rules, set its stake and stop loss, and test it on a demo account.",
    body: [
      { type: "h2", text: "Why people give bots away" },
      {
        type: "table",
        head: ["Source", "What they gain"],
        rows: [
          ["Referral marketers", "Commission on the trades of people who sign up through their link"],
          ["Signal and bot groups", "Members for a paid tier"],
          ["Video channels", "Views"],
          ["Platforms", "Users for their tools"],
          ["Hobbyists", "Nothing; they are sharing an experiment"],
        ],
      },
      {
        type: "p",
        text: "None of these depends on the bot being profitable. Apply the same question to FXNOD: its bots are free to use and it wants you to use its tools, so judge them by the checks below too.",
      },
      { type: "h2", text: "Six checks" },
      {
        type: "steps",
        items: [
          { title: "Can you read every rule?", text: "If the logic is hidden, stop here." },
          { title: "What happens to the stake after a loss?", text: "If it grows, work out the largest stake it can reach." },
          { title: "Is there a stop loss you set?", text: "And is it enforced when your device is off?" },
          { title: "Does it run on demo?", text: "A bot that only works on real accounts is steering you." },
          { title: "How does it connect?", text: "Through the broker's login page, never your password." },
          { title: "What is asked of you?", text: "Signing up through a link, a deposit, or a payment later are costs." },
        ],
      },
      { type: "h2", text: "Free options that show their rules" },
      {
        type: "list",
        items: [
          "Deriv Bot's own quick strategies, which Deriv names and documents.",
          "A bot you build yourself in a no-code builder, from a simple template.",
          "FXNOD's Auto Hub, where each bot's rules are written out and the stake is the same on every trade.",
          "FXNOD's dBot templates, which you can change and run on demo.",
        ],
      },
      { type: "h2", text: "Is a paid bot better?" },
      {
        type: "p",
        text: "Price is no evidence. Many bots sold for a fee are the same free files. Before paying for anything, ask for the rules and a demo run. A seller who refuses both has answered the question.",
      },
      { type: "h2", text: "What free cannot fix" },
      {
        type: "p",
        text: "No bot, free or paid, changes the odds of the contract it buys. On a random index a bot decides when and how much, and the payout decides the average result. A free bot with a flat stake and a stop loss is a way to trade with discipline, not a way to beat the market.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is the best free Deriv bot?",
        a: "One whose rules you can read, with a flat stake and a stop loss you set, tested on your own demo account. The name matters less than those three things.",
      },
      {
        q: "Are FXNOD's bots free?",
        a: "dBot and Auto Hub have no subscription and no sign-up fee. Real trades risk your stake.",
      },
      {
        q: "Why would anyone share a profitable bot for free?",
        a: "Usually they are paid another way, such as referral commission or group memberships. That income does not depend on the bot being profitable.",
      },
    ],
    related: ["deriv-bot-xml-files", "how-to-choose-a-trading-bot"],
  },

  {
    slug: "is-there-a-deriv-bot-that-never-loses",
    title: "Is there a Deriv bot that never loses?",
    description:
      "No. A bot that appears never to lose is a recovery system that has not met its losing streak yet. How the illusion is made and how to see through it.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "No. There is no Deriv bot, and no trading bot anywhere, that never loses. Bots advertised that way are recovery systems, usually Martingale, that win small amounts many times in a row and then lose a large amount at once. The video or screenshot shows the first part. The second part always arrives.",
    body: [
      { type: "h2", text: "How a never-loses record is made" },
      {
        type: "list",
        items: [
          "A recovery stake: every loss is followed by a bigger trade, so each sequence ends in a small win.",
          "A high-chance contract, such as Differs, so individual losses are rare.",
          "A short recording, chosen from the sessions where the streak did not come.",
          "A demo account with a balance large enough to fund a very long ladder.",
        ],
      },
      { type: "h2", text: "The arithmetic it cannot escape" },
      {
        type: "p",
        text: "Take a bot that doubles after each loss on an even-chance trade and can afford ten steps. It loses a whole sequence only about once in 1,024. So it wins 1 unit over a thousand times and then loses 1,023 units. That is a perfect record for hours, followed by the loss of everything it made. On a contract paying less than even money, the single loss is larger than all the wins together.",
      },
      {
        type: "table",
        head: ["Steps the balance can fund", "Sequences won before the loss, on average", "Size of that loss in units"],
        rows: [
          ["5", "31", "31"],
          ["7", "127", "127"],
          ["10", "1,023", "1,023"],
          ["12", "4,095", "4,095"],
        ],
      },
      { type: "h2", text: "How quickly a bot gets there" },
      {
        type: "p",
        text: "A bot placing a one-tick trade every few seconds completes hundreds of sequences an hour. A one-in-1,024 event is then a matter of a few hours on average, not years. The never-loses bot is not unlucky when it fails. It is on schedule.",
      },
      { type: "h2", text: "Why the claim is a warning sign" },
      {
        type: "list",
        items: [
          "Nobody who had such a machine would sell it for a small fee or give it away.",
          "A guarantee of profit is the standard mark of a trading scam.",
          "The seller is usually paid by your sign-up or your trading volume, not by your results.",
        ],
      },
      { type: "h2", text: "What a realistic bot looks like" },
      {
        type: "list",
        items: [
          "It loses often and says so.",
          "Its largest possible stake is known before it starts.",
          "It has a stop loss that works with your device off.",
          "Its results over several hundred trades look like the contract's odds, less its cost.",
        ],
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "No FXNOD bot is described as unable to lose, because none is. A stop loss is required to start any bot, Auto Hub bots use the same stake on every trade, and dBot labels Martingale as high risk and shows the stakes of a losing streak before you run it.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is there a 100% winning Deriv bot?",
        a: "No. A 100% record over a short period is what a recovery system looks like before its losing streak.",
      },
      {
        q: "Why did the bot work in the video and not for me?",
        a: "The video showed a period without the long streak, often on a demo account with a very large balance.",
      },
      {
        q: "Can a bot at least never lose a whole session?",
        a: "Only by never stopping, which means it eventually loses the balance instead. A stop loss makes losing sessions certain and survivable.",
      },
    ],
    related: ["martingale-strategy-explained", "how-to-identify-trading-scams"],
  },

  {
    slug: "how-much-money-to-start-a-trading-bot",
    title: "How much money do you need to start a trading bot?",
    description:
      "Nothing to learn on a demo account. For real money, work backwards from the stake: enough for at least 50 to 100 stakes. Costs and worked examples.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "You need no money to start: a demo account runs a bot with virtual funds. For real money, work backwards from the stake. A flat-stake bot needs a balance of at least 50 to 100 times its stake to survive ordinary losing streaks. A bot that raises the stake after losses needs far more, set by the largest stake it can reach.",
    body: [
      { type: "h2", text: "The three costs" },
      {
        type: "table",
        head: ["Cost", "Typical range", "Notes"],
        rows: [
          ["The tool", "Free to a monthly fee", "Many builders are free. FXNOD's dBot and Auto Hub have no subscription and no sign-up fee"],
          ["Hosting", "Nothing to a monthly fee", "Needed only for bots that run on your own machine or a VPS"],
          ["Trading capital", "Your choice", "The only cost that is at risk on every trade"],
        ],
      },
      { type: "h2", text: "Sizing capital for a flat-stake bot" },
      {
        type: "table",
        head: ["Stake", "Balance for 50 stakes", "Balance for 100 stakes"],
        rows: [
          ["0.35", "17.50", "35"],
          ["1", "50", "100"],
          ["5", "250", "500"],
          ["10", "500", "1,000"],
        ],
      },
      {
        type: "p",
        text: "Fifty stakes lets a session absorb a bad run and still tell you something about the strategy. With ten stakes, chance decides the outcome before the strategy can.",
      },
      { type: "h2", text: "Sizing capital for a recovery bot" },
      {
        type: "p",
        text: "For Martingale, the balance must cover the whole ladder. Doubling from a base of 1 for seven steps needs 127, for ten steps 1,023. And covering the ladder only means you can afford to lose it once. That is why recovery systems are unsuitable for small accounts, whatever their advertising says.",
      },
      { type: "h2", text: "A sensible way to begin" },
      {
        type: "steps",
        items: [
          { title: "Spend nothing for the first weeks", text: "Run the bot on demo until you have a few hundred trades recorded." },
          { title: "Choose an amount you can lose completely", text: "Treat it as the price of the lesson." },
          { title: "Divide it by 100", text: "That is your stake. If it is below the contract's minimum, the amount is too small for that contract." },
          { title: "Set the session stop loss", text: "A fraction of the balance, so one session cannot end the account." },
        ],
      },
      { type: "h2", text: "How much do bots make?" },
      {
        type: "p",
        text: "There is no typical figure, and advertised ones are not evidence. A bot's result is the edge of its strategy multiplied by the number of trades, and on a random index the edge is slightly negative. More capital does not change that. It only changes the size of the numbers.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Can I start a trading bot with 10 dollars?",
        a: "With options at a minimum stake of around 0.35, a balance of 10 gives fewer than 30 stakes, which is thin. It is enough to learn the mechanics after demo, and not much more.",
      },
      {
        q: "How much does a trading bot cost?",
        a: "From nothing to hundreds a month. Price does not indicate quality. FXNOD's bot tools have no subscription and no sign-up fee.",
      },
      {
        q: "Do I need a big balance to make a bot profitable?",
        a: "No balance makes a bot without an edge profitable. A larger balance only lets it run longer.",
      },
    ],
    related: ["how-to-calculate-position-size", "best-synthetic-index-for-a-small-account"],
  },

  {
    slug: "bot-works-on-demo-but-not-real",
    title: "Why does my bot work on demo but not on a real account?",
    description:
      "A bot that wins on demo and fails on real usually faces a smaller balance, a missing approval, a short test, or you. The causes and how to check each.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "A bot that works on demo and not on a real account is usually facing one of four differences: the real balance is far smaller than the demo's, the real account needs its own approval or has different limits, the demo test was too short to include a bad stretch, or you behave differently when the money is yours.",
    body: [
      { type: "h2", text: "If it will not start on the real account" },
      {
        type: "list",
        items: [
          "A separate permission. On FXNOD, Deriv asks you to allow the automated-trading connection the first time a bot runs on a real account.",
          "Currency. A real account in another currency may have different minimum stakes and decimal places.",
          "Verification or account restrictions at the broker.",
          "Not enough balance for the first stake.",
        ],
      },
      { type: "h2", text: "If it starts and loses" },
      {
        type: "table",
        head: ["Difference", "What it does"],
        rows: [
          ["Balance", "A demo with 10,000 funds a ladder that a real 50 cannot. The same bot hits a wall after a few losses"],
          ["Sample size", "Fifty winning demo trades did not include the streak that the next fifty did"],
          ["Stake scaling", "A stake that was 0.1% of the demo balance is 20% of the real one"],
          ["Your behaviour", "You stop it early, restart it, and change settings in ways you never did on demo"],
          ["Selection", "You moved to real money after the best demo run, not an average one"],
        ],
      },
      { type: "h2", text: "Is the real account priced differently?" },
      {
        type: "p",
        text: "Traders often suspect this. The simpler explanations above account for nearly every case, and they can be checked. Compare a few hundred trades on each account with identical settings and stake: if the win rates are within normal variation of each other, the account is not the cause.",
      },
      { type: "h2", text: "How to make demo results mean something" },
      {
        type: "steps",
        items: [
          { title: "Treat the demo as your real balance", text: "Decide the real amount and stop the test when the demo has lost it." },
          { title: "Use the real stake", text: "The exact figure you will trade." },
          { title: "Run several hundred trades", text: "Across several sessions." },
          { title: "Record the worst stretch", text: "The longest losing run and the deepest drawdown are what you are buying." },
          { title: "Go live at the minimum stake", text: "And compare the first hundred trades with the demo numbers." },
        ],
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "A bot follows the same rules on a demo and a real account, and it keeps trading the account it was started on whatever you select afterwards. Starting with real money is a separate, clearly labelled action. The run page shows each trade, so the two can be compared directly.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is demo trading rigged to make you win?",
        a: "A short winning demo run is explained by chance and a large balance. Test several hundred trades at your real stake before drawing a conclusion.",
      },
      {
        q: "Why does my bot not start on a real account?",
        a: "Check the approval for automated trading, the minimum stake for the account's currency, and the balance, in that order.",
      },
      {
        q: "How do I move a bot from demo to real safely?",
        a: "Same settings, minimum stake, a stop loss, and a comparison of the first hundred live trades against the demo record.",
      },
    ],
    related: ["how-to-test-a-trading-bot", "why-is-my-trading-bot-not-working"],
  },

  {
    slug: "how-long-should-you-demo-trade",
    title: "How long should you demo trade before going live?",
    description:
      "Demo trade until you have a few hundred trades with fixed rules and have followed them through a losing stretch. Count trades and behaviour, not weeks.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Demo trade until three things are true: you have at least a few hundred trades with unchanged rules, you have been through a losing stretch and followed your plan anyway, and you can state your win rate, average win, average loss and worst drawdown. For most people that takes one to three months. Count trades and behaviour, not days.",
    body: [
      { type: "h2", text: "Why time is the wrong measure" },
      {
        type: "p",
        text: "A month of demo trading can mean twenty trades or twenty thousand. A swing trader needs months to collect a hundred trades. A tick bot collects them in an hour and needs many sessions instead, to see more than one stretch of luck.",
      },
      { type: "h2", text: "The graduation checklist" },
      {
        type: "table",
        head: ["Check", "Ready when"],
        rows: [
          ["Sample size", "At least 100 trades by hand, or several hundred by bot, across separate sessions"],
          ["Fixed rules", "The last 100 trades used the same rules and stake"],
          ["A losing stretch", "You have had one and did not change the plan in the middle of it"],
          ["Your numbers", "You can state win rate, average win and loss, and maximum drawdown"],
          ["Limits", "You have reached your daily loss limit and stopped"],
          ["Realistic size", "The demo was traded at the balance and stake you will really use"],
        ],
      },
      { type: "h2", text: "Signs you are staying too long" },
      {
        type: "list",
        items: [
          "You keep changing strategy, so the sample never builds.",
          "You are waiting for a result with no losing weeks.",
          "You are careless because nothing is at stake.",
        ],
      },
      {
        type: "p",
        text: "Demo trading stops teaching once the mechanics are learned, because it cannot produce the fear of loss. That lesson needs real money, in a very small amount.",
      },
      { type: "h2", text: "Signs you are leaving too soon" },
      {
        type: "list",
        items: [
          "You have only seen winning sessions.",
          "You do not know your numbers.",
          "You want to go live to win back a real loss.",
          "Someone else is urging you to deposit.",
        ],
      },
      { type: "h2", text: "The step in between" },
      {
        type: "p",
        text: "Going live is not one jump. Move to the smallest real stake available, with the same rules, and treat the first hundred trades as a third phase of testing. Raise the stake only when the live numbers match the demo ones and your behaviour held.",
      },
      { type: "h2", text: "If the demo result is negative" },
      {
        type: "p",
        text: "Then it has done its job at no cost. A strategy that loses on demo will lose on a real account, plus the mistakes real money adds. Change one thing and test again, or drop the idea.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is one week of demo trading enough?",
        a: "Rarely. A week seldom includes both a good and a bad stretch, or enough trades to measure anything.",
      },
      {
        q: "Can I demo trade for too long?",
        a: "Yes. Once you know the mechanics and your numbers, more demo trading adds little, because it cannot teach how you behave with real money.",
      },
      {
        q: "Should my demo balance match my real deposit?",
        a: "Yes. Treat the amount you plan to deposit as the balance, and stop when the demo has lost it.",
      },
    ],
    related: ["how-to-test-a-trading-bot", "can-you-use-deriv-without-depositing"],
  },

  {
    slug: "do-you-need-a-vps-for-a-trading-bot",
    title: "Do you need a VPS for a trading bot?",
    description:
      "A VPS keeps a bot running when your computer is off. You need one for bots that run on your own machine, and not for bots hosted by the platform.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "You need a VPS only if your bot runs on your own computer, as an MT5 expert advisor or a script does, and you want it to trade when that computer is off. A VPS is a rented computer in a data centre that stays on. Bots that the platform hosts on its own servers do not need one.",
    body: [
      { type: "h2", text: "Where does your bot run?" },
      {
        type: "table",
        head: ["Kind of bot", "Runs on", "VPS needed for round-the-clock trading?"],
        rows: [
          ["Expert advisor on MT4 or MT5", "Your terminal", "Yes"],
          ["A script you wrote against an API", "Wherever you start it", "Yes, or another always-on host"],
          ["A browser-based builder", "Your browser tab", "Yes, or keep the computer awake with the tab open"],
          ["A platform-hosted bot", "The provider's servers", "No"],
        ],
      },
      { type: "h2", text: "What a VPS gives you" },
      {
        type: "list",
        items: [
          "It stays on when your laptop sleeps or your power fails.",
          "A stable connection, often close to the broker's servers.",
          "Your home internet no longer matters to the bot.",
        ],
      },
      { type: "h2", text: "What it does not give you" },
      {
        type: "list",
        items: [
          "A better strategy. A losing bot loses around the clock.",
          "Safety by default. A VPS is a computer on the internet that you must secure.",
          "Freedom from monitoring. Software still crashes, and updates still restart machines.",
        ],
      },
      { type: "h2", text: "Choosing one" },
      {
        type: "steps",
        items: [
          { title: "Pick a location near your broker's servers", text: "For most bots a few milliseconds do not matter. Reliability does." },
          { title: "Check the specification your platform needs", text: "A single trading terminal needs little." },
          { title: "Secure it", text: "A strong unique password, updates on, and no other software." },
          { title: "Be careful with free offers", text: "Free VPS deals from brokers have conditions, and from strangers they are a risk." },
        ],
      },
      { type: "h2", text: "Security matters more than speed" },
      {
        type: "p",
        text: "A VPS running your bot holds access to your trading account. Never use a VPS that someone else set up and controls, or one where a bot seller has a login. Whoever controls the machine controls the trades.",
      },
      { type: "h2", text: "With FXNOD" },
      {
        type: "p",
        text: "You do not need a VPS. Bots started in dBot and Auto Hub run on FXNOD's servers, and their limits are checked there before every trade. Your phone or computer only starts and watches them.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is a VPS in trading?",
        a: "A virtual private server: a rented, always-on computer in a data centre used to run trading software without interruption.",
      },
      {
        q: "Can I run a trading bot without a VPS?",
        a: "Yes, if the platform hosts the bot, or if you keep your own computer on and connected.",
      },
      {
        q: "Is a free VPS safe for trading?",
        a: "Only from a provider you trust and control access to. A machine controlled by someone else can control your account.",
      },
    ],
    related: ["how-trading-bots-connect-to-platforms", "what-is-deriv-bot"],
  },

  {
    slug: "deriv-api-token-explained",
    title: "Deriv API token: what it is, scopes and safety",
    description:
      "A Deriv API token lets software act on your account within the scopes you choose. What each scope allows, which to avoid, and how to revoke one.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "A Deriv API token is a code you create in your Deriv account that lets software act on that account without your password. Each token has scopes that limit what it can do. Give a trading tool only the scopes it needs, never one that covers payments, and delete any token you no longer use. Treat it like a key.",
    body: [
      { type: "h2", text: "The scopes" },
      {
        type: "table",
        head: ["Scope", "What Deriv's guidance says it allows", "For a trading bot"],
        rows: [
          ["Read", "Viewing account activity: settings, limits, balances and purchase history", "Usually needed"],
          ["Trade", "Buying and selling contracts, and topping up demo accounts", "Needed"],
          ["Trading information", "Viewing trading history", "Sometimes needed"],
          ["Payments", "Withdrawals to payment agents and transfers between accounts", "Do not grant"],
          ["Admin", "Opening accounts, managing settings and managing tokens", "Do not grant"],
        ],
      },
      {
        type: "p",
        text: "These are the scopes of Deriv's API token page as its community guidance describes them. Deriv also has a newer developer system with different scope names. Read what the screen in front of you says before ticking anything.",
      },
      { type: "h2", text: "Creating one" },
      {
        type: "steps",
        items: [
          { title: "Sign in on Deriv's own site", text: "Open the API token section of your account settings." },
          { title: "Tick only the scopes you need", text: "Deriv's own guidance is to enable only the access you are comfortable sharing." },
          { title: "Name it after the tool", text: "So you know later what each token is for." },
          { title: "Create and copy it", text: "Store it somewhere private. Do not post it in a chat." },
        ],
      },
      { type: "h2", text: "Why Payments and Admin are dangerous" },
      {
        type: "p",
        text: "A token with the Payments scope can move money out of the account. A token with Admin can change settings and create more tokens. A stranger's bot that needs either is not a trading bot. Scams that ask for an API token are asking for exactly these.",
      },
      { type: "h2", text: "Token or OAuth?" },
      {
        type: "table",
        head: ["", "API token", "OAuth approval"],
        rows: [
          ["You do", "Create a token and paste it into the tool", "Sign in on Deriv's page and approve the app"],
          ["Scopes chosen by", "You", "The app asks; Deriv shows you"],
          ["Risk of copying it to the wrong place", "Yes", "No token to copy"],
          ["Revoke", "Delete the token", "Remove the app in Deriv's settings"],
        ],
      },
      { type: "h2", text: "Keeping tokens safe" },
      {
        type: "list",
        items: [
          "One token per tool, so you can remove one without breaking the others.",
          "Delete tokens you no longer use. Deriv's token manager shows when each was last used.",
          "Never send a token to someone setting a bot up for you.",
          "If a token may have leaked, delete it immediately and check your statement.",
        ],
      },
      { type: "h2", text: "FXNOD does not ask for a token" },
      {
        type: "p",
        text: "FXNOD connects with OAuth: you sign in on Deriv's own page and approve access there. You never create or paste an API token, and FXNOD never receives your Deriv password. To end the access, disconnect in Connected Accounts or remove FXNOD from the connected apps in your Deriv settings.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is it safe to give a bot my Deriv API token?",
        a: "Only a token limited to the scopes the bot needs, to a tool you trust. Never a token with Payments or Admin.",
      },
      {
        q: "How do I delete a Deriv API token?",
        a: "In the API token section of your Deriv account settings, where your tokens are listed.",
      },
      {
        q: "Does FXNOD need my API token?",
        a: "No. FXNOD uses Deriv's own login and approval page. There is no token to create or share.",
      },
      {
        q: "Can someone withdraw my money with an API token?",
        a: "A token with the Payments scope allows transfers and withdrawals to payment agents. A trading tool does not need that scope.",
      },
    ],
    related: ["how-trading-bots-connect-to-platforms", "checklist-before-connecting-a-trading-bot"],
  },

  {
    slug: "when-to-stop-a-trading-bot",
    title: "When should you stop a trading bot?",
    description:
      "Stop a bot when it reaches a limit you set, when its results leave the range your test showed, or when you want to interfere. Decide the rules first.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Stop a trading bot when it reaches a limit you set in advance, when its results fall well outside what your testing showed, when conditions change in a way the strategy was not built for, or when you feel the urge to change its settings mid-run. Decide these rules before starting. Stopping on a feeling usually means stopping at the worst time.",
    body: [
      { type: "h2", text: "Planned stops" },
      {
        type: "table",
        head: ["Limit", "What it protects"],
        rows: [
          ["Session stop loss", "The most one run can lose"],
          ["Profit target", "A winning session from being given back"],
          ["Maximum number of trades", "Against a bot grinding on for hours"],
          ["Maximum stake", "Against one trade being too large"],
          ["Daily and weekly loss limit", "Against restarting until the account is gone"],
        ],
      },
      {
        type: "p",
        text: "The first four belong in the bot. The last one belongs to you, because a bot does not know how many sessions you have already run today.",
      },
      { type: "h2", text: "Unplanned stops that are justified" },
      {
        type: "list",
        items: [
          "The drawdown is far beyond anything your test produced.",
          "The win rate over a few hundred trades is well below the tested one.",
          "The bot is doing something the rules do not describe.",
          "The broker or platform reports a problem.",
          "A major news event is due, on a real market.",
          "You have noticed a mistake in the settings.",
        ],
      },
      { type: "h2", text: "Stops that are usually a mistake" },
      {
        type: "list",
        items: [
          "After three losses, when the test showed runs of eight.",
          "Just before the stop loss, to avoid seeing it reached.",
          "To restart at a bigger stake.",
          "Because it is winning and you want it to win faster.",
        ],
      },
      { type: "h2", text: "Normal loss or broken strategy?" },
      {
        type: "steps",
        items: [
          { title: "Know the tested range", text: "Longest losing run, deepest drawdown and win rate from your demo record." },
          { title: "Compare", text: "Is today inside that range? Then it is noise." },
          { title: "Set a retirement rule in advance", text: "For example: if the drawdown exceeds twice the tested maximum, the bot is stopped and re-tested." },
        ],
      },
      { type: "h2", text: "How to stop" },
      {
        type: "p",
        text: "Know what your stop button does before you need it. In FXNOD, stopping a run from its page ends it. There is also an emergency stop, which ends the run and sells what is still open where Deriv allows it. A contract that cannot be sold runs to its own end.",
      },
      { type: "h2", text: "After it stops" },
      {
        type: "list",
        items: [
          "Do not start another run immediately.",
          "Write down how it ended and what you did.",
          "Change nothing until you have looked at the numbers calmly.",
        ],
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Should I stop my bot after a few losses?",
        a: "Not if your test showed losing runs of that length. Stopping inside the normal range turns a tested strategy into an untested one.",
      },
      {
        q: "Should I leave a bot running overnight?",
        a: "Only with a stop loss you are content to wake up to, on a bot that keeps its limits when your device is off.",
      },
      {
        q: "When should I retire a bot for good?",
        a: "When its results over a few hundred trades are clearly outside what testing showed, by a rule you set beforehand.",
      },
    ],
    related: ["trading-bot-risk-management", "stop-loss-and-take-profit"],
  },

  {
    slug: "are-trading-bots-legal",
    title: "Are trading bots legal?",
    description:
      "Using a bot on your own account is generally lawful where trading is and your broker permits it. What is not allowed, and what depends on your country.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "In most countries, using a trading bot on your own account is legal where trading that product is legal and your broker permits automation. What can be unlawful is market manipulation, managing other people's money without a licence, and trading a product your country restricts. This is general information, not legal advice: check your own country's rules.",
    body: [
      { type: "h2", text: "Three separate questions" },
      {
        type: "table",
        head: ["Question", "Who decides"],
        rows: [
          ["Is this product legal for me to trade?", "Your country's law and regulator"],
          ["Does my broker allow bots?", "The broker's terms"],
          ["Is what the bot does lawful?", "Market abuse and financial services law"],
        ],
      },
      { type: "h2", text: "What brokers allow" },
      {
        type: "p",
        text: "Many brokers support automation and publish an API for it. Deriv provides its own bot builder and an API that third-party tools use. Brokers still set limits: request rates, one account per person, and no abuse of pricing errors. Breaking the terms is not a crime, but it can close your account.",
      },
      { type: "h2", text: "What is not allowed" },
      {
        type: "list",
        items: [
          "Manipulating a real market, for example by placing orders you do not intend to fill.",
          "Trading other people's money, or selling signals as advice, without the licence your country requires.",
          "Using someone else's account, or letting someone use yours.",
          "Getting round a country restriction with a VPN or false details.",
          "Promising returns to attract deposits.",
        ],
      },
      { type: "h2", text: "By country" },
      {
        type: "p",
        text: "Rules differ on the product more than on the bot. Some countries restrict or ban binary-style options or leveraged CFDs for retail clients, and some require brokers to be locally licensed. A bot does not make a restricted product permitted. Look up your regulator's position on the product and on the broker.",
      },
      { type: "h2", text: "Are AI trading bots legal?" },
      {
        type: "p",
        text: "The same rules apply whatever technology makes the decision. The legal risk with products sold as AI bots is usually the selling: guaranteed returns and unlicensed management of client money are unlawful in many places.",
      },
      { type: "h2", text: "Tax" },
      {
        type: "p",
        text: "Automated or not, trading profits may be taxable where you live. Keep your statements, and ask a qualified adviser.",
      },
      { type: "h2", text: "FXNOD" },
      {
        type: "p",
        text: "FXNOD provides tools that place trades on your own Deriv account, through Deriv's own login and API. It does not hold your trading balance, trade on your behalf at its own discretion, or give investment advice. Whether you may trade Deriv's products where you live is for you to check.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is automated trading legal?",
        a: "Generally yes on your own account, where the product is legal for you and the broker allows it. Check your own country's rules.",
      },
      {
        q: "Does Deriv allow trading bots?",
        a: "Deriv offers its own bot builder and an API used by third-party tools.",
      },
      {
        q: "Is it legal to sell a trading bot?",
        a: "Selling software is usually lawful. Promising returns, or managing clients' money, can require a licence and can be unlawful without one.",
      },
      {
        q: "Can I run a bot on someone else's account?",
        a: "Brokers' terms generally forbid it, and managing another person's money can require a licence.",
      },
    ],
    related: ["are-trading-bots-worth-it", "is-deriv-available-in-my-country"],
  },

  {
    slug: "are-trading-bots-worth-it",
    title: "Are trading bots worth it?",
    description:
      "A trading bot is worth it for discipline, speed and testing ideas. It is not worth it as a source of profit by itself. An honest cost-benefit view.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "A trading bot is worth it if you want consistent execution, limits that are enforced without emotion, and a way to test an idea over hundreds of trades. It is not worth it if you expect the bot itself to produce profit. A bot applies a strategy. It has no edge of its own.",
    body: [
      { type: "h2", text: "What a bot really gives you" },
      {
        type: "table",
        head: ["Benefit", "Why it matters"],
        rows: [
          ["Consistency", "The rule is applied the same way every time"],
          ["Enforced limits", "A stop loss that does not negotiate"],
          ["Speed", "Short contracts no person can trade steadily"],
          ["Testing", "Hundreds of trades in the time a person makes ten"],
          ["Time", "Setup and review replace hours at the screen"],
        ],
      },
      { type: "h2", text: "What it does not give you" },
      {
        type: "list",
        items: [
          "An edge. On a contract priced against you, a bot loses at the contract's rate.",
          "Passive income. Unattended bots are how accounts are emptied overnight.",
          "Protection from yourself between runs.",
          "Certainty. A tested bot can still stop working.",
        ],
      },
      { type: "h2", text: "The honest arithmetic" },
      {
        type: "p",
        text: "Result equals expected value per trade multiplied by the number of trades. A bot raises the second number enormously. If the first is slightly negative, as it is on a random index after the contract's cost, the bot makes the loss arrive sooner and more predictably. If you have a strategy with a real positive expectation, the same multiplication works for you.",
      },
      { type: "h2", text: "Who benefits" },
      {
        type: "table",
        head: ["You are", "A bot is"],
        rows: [
          ["A disciplined trader with tested rules", "Worth it: it executes what already works"],
          ["Someone whose problem is breaking rules", "Worth it: it enforces them, if you leave it alone"],
          ["Someone testing an idea", "Worth it: on demo, it answers quickly"],
          ["Looking for income without learning to trade", "Not worth it"],
          ["Planning to buy a guaranteed bot", "Not worth it, and likely a scam"],
        ],
      },
      { type: "h2", text: "The costs to count" },
      {
        type: "list",
        items: [
          "The tool, if it charges.",
          "Hosting, if it runs on your machine.",
          "The cost built into every trade, multiplied by the number of trades.",
          "Your time, for testing and review.",
        ],
      },
      { type: "h2", text: "A fair way to find out" },
      {
        type: "p",
        text: "Run a flat-stake bot on a demo account for a few hundred trades and look at the numbers. It costs nothing and answers the question for your strategy. FXNOD's dBot and Auto Hub can be used that way with no subscription and no sign-up fee.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Do trading bots actually make money?",
        a: "A bot makes money only if its strategy has a positive expectation. Most retail bots do not, and recovery-stake bots lose large amounts at once.",
      },
      {
        q: "Are trading bots good for beginners?",
        a: "They are good for learning discipline and for testing on demo. They are not a substitute for understanding what is being traded.",
      },
      {
        q: "What is the success rate of trading bots?",
        a: "There is no meaningful general figure. Win rate without the payout says nothing, and advertised figures are selected.",
      },
      {
        q: "Are trading bots legit?",
        a: "The technology is legitimate and widely used. Many products sold around it, with guaranteed returns, are not.",
      },
    ],
    related: ["can-trading-bots-lose-money", "are-trading-bots-legal"],
  },
];
