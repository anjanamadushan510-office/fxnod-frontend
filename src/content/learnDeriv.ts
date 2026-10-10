/**
 * Questions people ask about Deriv itself.
 *
 * FXNOD is not Deriv and cannot speak for it. Every statement about Deriv in
 * this file was read on Deriv's own website (deriv.com, its help centre and
 * its terms) on the date in `CHECKED`, and is written as what Deriv says.
 * Nothing here is from memory. Deriv changes its limits, entities and
 * platforms without telling us, so when a guide is touched, re-read the page
 * it rests on and move `CHECKED`. Where Deriv's site does not state a thing
 * (which countries it serves, for example), the guide says where to find out
 * and does not fill the gap.
 */
import { RISK_NOTE, type Guide, type GuideBlock } from "./guides";

const TAG = "Deriv questions";
const DATE = "2026-10-09";
const CHECKED = "9 October 2026";

export const SOURCE_NOTE: GuideBlock = {
  type: "note",
  title: "Where this comes from",
  text: `FXNOD is an independent product and is not affiliated with Deriv. The statements about Deriv on this page were checked against Deriv's own website on ${CHECKED}. Deriv can change its terms, limits and platforms at any time, and what applies to you depends on your country and the Deriv company your account is with. Confirm anything that matters on deriv.com before you act on it.`,
};

export const DERIV_GUIDES: Guide[] = [
  {
    slug: "how-to-trade-on-deriv-for-beginners",
    title: "How to trade on Deriv easily for beginners",
    description:
      "A beginner's route into Deriv: open a free account, stay on demo, learn one contract on one market, set limits, and only then make a small deposit.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "To start trading on Deriv as a beginner, create a free account, switch to the demo account and its virtual funds, choose one market and one simple contract such as Rise/Fall, and place small trades until you understand how each one settles. Decide a loss limit before any real deposit, and begin with the smallest stake allowed.",
    body: [
      { type: "h2", text: "Step by step" },
      {
        type: "steps",
        items: [
          { title: "Create an account", text: "Deriv says creating an account is free and that funds are needed only when you are ready to trade. You must be 18 or older, and full access requires identity verification." },
          { title: "Stay on the demo account", text: "Demo accounts come loaded with virtual funds. Everything in the next three steps can be done without a deposit." },
          { title: "Pick one market", text: "Many beginners start on a volatility index because it trades at all hours. A lower-numbered index moves less per tick." },
          { title: "Pick one contract", text: "Rise/Fall asks one question: will the price finish higher or lower. Learn it fully before trying anything else." },
          { title: "Read the payout before you buy", text: "The order form shows what the contract pays and what it costs. If you lose, an option costs its whole stake." },
          { title: "Place twenty small trades and write them down", text: "Note the stake, the result and what you expected. You are learning how the contract behaves, not trying to win." },
          { title: "Set limits, then deposit a little", text: "Decide the most you will lose in a day. Only then fund the account, with money you can afford to lose." },
        ],
      },
      { type: "h2", text: "What you can trade" },
      {
        type: "table",
        head: ["Type", "What it is", "Where on Deriv"],
        rows: [
          ["Options", "A fixed stake on an outcome; the stake is the most you can lose", "Deriv Trader and the Deriv app"],
          ["Multipliers", "A position that follows the price with a multiplier", "Deriv Trader and the Deriv app"],
          ["CFDs", "Leveraged positions on price movement", "Deriv MT5 and Deriv cTrader"],
        ],
      },
      {
        type: "p",
        text: "Start with options on the demo account. CFDs involve leverage, and Deriv's own warning is that they carry a high risk of losing money rapidly.",
      },
      { type: "h2", text: "The beginner mistakes" },
      {
        type: "list",
        items: [
          "Depositing on the first day.",
          "Raising the stake after a loss.",
          "Copying a bot or a signal without knowing its rules.",
          "Treating a winning first week as proof of skill.",
        ],
      },
      { type: "h2", text: "Using FXNOD with a Deriv account" },
      {
        type: "p",
        text: "FXNOD is a separate terminal that works on top of your own Deriv account. You connect by signing in on Deriv's page, and can then trade by hand in dTrader or run a bot, on the demo account first. Your balance stays at Deriv.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is Deriv good for beginners?",
        a: "It offers a free demo account and small stakes, which helps. Its products are high risk, and short contracts lose money quickly. Being easy to start is not the same as being easy to profit from.",
      },
      {
        q: "What is the easiest trade type on Deriv?",
        a: "Rise/Fall is the simplest to understand. A losing Rise/Fall contract still costs the whole stake.",
      },
      {
        q: "Do I need to verify my identity on Deriv?",
        a: "Deriv says full access requires identity verification. Expect to be asked for documents before you can use every feature, including withdrawals.",
      },
    ],
    related: ["can-you-use-deriv-without-depositing", "connect-deriv-account"],
  },

  {
    slug: "can-you-use-deriv-without-depositing",
    title: "Can you use Deriv without depositing money?",
    description:
      "Yes. A Deriv account is free to open and its demo account trades virtual funds. What you can and cannot do before you make a deposit.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Yes. Deriv says creating an account is free and that you need funds only when you are ready to trade for real. Every account has a demo mode loaded with virtual funds, where you can place trades, test bots and learn the platforms at no cost. Demo profits are not real and cannot be withdrawn.",
    body: [
      { type: "h2", text: "What you can do with no deposit" },
      {
        type: "list",
        items: [
          "Open an account and explore every platform.",
          "Trade the demo account with virtual funds.",
          "Build and run a bot on the demo account.",
          "Use Deriv Academy's free courses, guides and ebooks.",
          "Connect the demo account to a third-party tool such as FXNOD and use it there.",
        ],
      },
      { type: "h2", text: "What needs real money" },
      {
        type: "list",
        items: [
          "Any trade whose profit you can keep.",
          "Withdrawals. There is nothing to withdraw from a demo account.",
        ],
      },
      { type: "h2", text: "Demo and real compared" },
      {
        type: "table",
        head: ["", "Demo account", "Real account"],
        rows: [
          ["Money", "Virtual funds", "Your own deposit"],
          ["Cost to use", "Free", "Free to open; trading risks your stake"],
          ["Profits", "Not real", "Yours, and withdrawable"],
          ["Good for", "Learning and testing", "Trading once you have tested"],
        ],
      },
      { type: "h2", text: "Get real value from the demo" },
      {
        type: "p",
        text: "Treat the demo balance as the amount you would actually deposit. If you plan to fund an account with 50, stop the session when the demo has lost 50, however many thousands remain on screen. Use the stake you would really use. A demo traded with unrealistic size teaches habits that fail on the first real day.",
      },
      { type: "h2", text: "Be careful with no-deposit offers" },
      {
        type: "p",
        text: "Offers of free trading money or a no-deposit bonus that reach you through social media or messaging apps are a common scam. Check any promotion on Deriv's own website, typed into the address bar yourself.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is the Deriv demo account free?",
        a: "Yes. It uses virtual funds and costs nothing.",
      },
      {
        q: "Can I withdraw money from a Deriv demo account?",
        a: "No. Demo funds are virtual and have no cash value.",
      },
      {
        q: "Can I use FXNOD with only a demo account?",
        a: "Yes. Connect your Deriv login, select the demo account, and every manual trade and bot uses virtual funds.",
      },
    ],
    related: ["what-is-the-minimum-deposit-on-deriv", "how-to-test-a-trading-bot"],
  },

  {
    slug: "what-is-the-minimum-deposit-on-deriv",
    title: "What is the minimum deposit on Deriv?",
    description:
      "Deriv's help centre gives 5 USD as the lowest deposit. The real minimum depends on your payment method. The figures Deriv lists and how to check yours.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      `Deriv's help centre says the lowest deposit amount is 5 USD. The actual minimum depends on the payment method you choose and is shown when you select it. On ${CHECKED}, Deriv's payment page listed cards and Neteller from 10 USD and several mobile money services from 5 USD. Methods on offer vary by country.`,
    body: [
      { type: "h2", text: "What Deriv lists" },
      {
        type: "table",
        head: ["Method", "Deposit range shown", "Deposit time shown"],
        rows: [
          ["Visa and Mastercard", "10 to 10,000 USD", "Instant"],
          ["Neteller", "10 to 10,000 USD", "Instant"],
          ["M-Pesa", "5 to 1,000 USD", "Instant"],
          ["MTN, Airtel, Moov", "5 to 150 USD", "Instant"],
          ["Orange Money", "6 to 150 USD", "Instant"],
          ["Deriv P2P", "Up to 10,000 USD a day", "Up to 1 hour"],
        ],
      },
      {
        type: "p",
        text: `These are the figures on Deriv's payment methods page on ${CHECKED}. That page shows only some of its methods at a time, and the full list for your country appears in the cashier of your own account. Treat the cashier as the authority.`,
      },
      { type: "h2", text: "How to check your own minimum" },
      {
        type: "steps",
        items: [
          { title: "Sign in to Deriv", text: "On Deriv's own site or app." },
          { title: "Open the deposit screen", text: "Choose the currency or Wallet you want to fund." },
          { title: "Select a payment method", text: "The minimum and maximum for that method are shown before you confirm." },
        ],
      },
      { type: "h2", text: "Minimum deposit is not minimum risk" },
      {
        type: "p",
        text: "A small deposit limits what you can lose in total. It also means a small number of trades before it is gone. With 5 USD and a stake of 1, five losses in a row end the account, and five in a row is an ordinary event. If the deposit is small, the stake must be smaller still.",
      },
      { type: "h2", text: "Is there a deposit fee?" },
      {
        type: "p",
        text: "Deriv's help centre says there are no fees for deposits into your Deriv Wallet. Your bank, card or mobile money provider may charge its own fee or apply a currency conversion.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Can I deposit 1 USD on Deriv?",
        a: "Deriv's help centre gives 5 USD as the lowest deposit amount. Check the cashier in your account for the minimum on your payment method.",
      },
      {
        q: "What is the minimum withdrawal on Deriv?",
        a: "It depends on the method. Deriv's payment page showed 5 USD for several mobile money services and 10 USD for cards and Neteller. Your cashier shows the figure for your method.",
      },
      {
        q: "Do I need to deposit to use FXNOD?",
        a: "No. FXNOD does not take deposits for trading. It uses the balance in your Deriv account, and on a demo account that is virtual money.",
      },
    ],
    related: ["deriv-deposits-and-withdrawals-time", "deriv-fees-and-charges"],
  },

  {
    slug: "can-you-trade-on-deriv-with-a-phone",
    title: "Can you trade on Deriv using only a mobile phone?",
    description:
      "Yes. Deriv has an app for iOS and Android with options trading built in and CFDs through MT5 or cTrader. What works on a phone and what to watch for.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Yes. Deriv has a mobile app that it says is free to download on the Apple App Store and Google Play. Options trading is built into the app, CFDs are available through Deriv MT5 or Deriv cTrader, and you can deposit, withdraw and switch between demo and real accounts on the phone. Availability depends on your country.",
    body: [
      { type: "h2", text: "What the Deriv app does" },
      {
        type: "table",
        head: ["Task", "On a phone"],
        rows: [
          ["Open an account", "Yes"],
          ["Demo trading", "Yes. Deriv says you can switch between real and demo from the home screen"],
          ["Options", "Built in: accumulators, multipliers, turbos and vanillas are the types Deriv lists for the app"],
          ["CFDs", "Through Deriv MT5 or Deriv cTrader, in a web terminal inside the app or their own apps"],
          ["Deposits and withdrawals", "Yes"],
        ],
      },
      { type: "h2", text: "Download it safely" },
      {
        type: "list",
        items: [
          "Install only from the Apple App Store or Google Play, or from a link on Deriv's own website.",
          "Check the developer name before installing. Fake trading apps copy names and logos.",
          "Never install an app file sent to you in a message or a group.",
        ],
      },
      { type: "h2", text: "What is harder on a phone" },
      {
        type: "list",
        items: [
          "Chart analysis: a small screen shows less history and fewer indicators.",
          "Precision: mistyped stakes are easier to make and harder to notice.",
          "Stability: phones switch networks and suspend apps to save battery.",
          "Discipline: a phone is always with you, which makes impulsive trades easier.",
        ],
      },
      { type: "h2", text: "Running a bot from a phone" },
      {
        type: "p",
        text: "Deriv's own bot builder runs in the browser, and Deriv notes that it pauses if the browser is closed. A phone that locks its screen or switches apps is a poor host for that. FXNOD works differently: it opens in a phone browser with nothing to install, and its bots run on FXNOD's servers, so the phone only starts and watches the bot and can be locked or switched off.",
      },
      { type: "h2", text: "Protect the phone" },
      {
        type: "list",
        items: [
          "Use a screen lock and keep the system up to date.",
          "Turn on two-factor authentication where your accounts offer it.",
          "Avoid public Wi-Fi when trading or moving money.",
        ],
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Does Deriv have a mobile app?",
        a: "Yes. Deriv says its app is free to download on iOS and Android, and that availability depends on your country of residence.",
      },
      {
        q: "Can I use Deriv on a phone without installing anything?",
        a: "FXNOD runs in a phone browser with nothing to install. For Deriv's own platforms, Deriv's site says which ones open in a browser.",
      },
      {
        q: "Can I run a trading bot on my phone?",
        a: "You can start and monitor one. Whether it keeps running when the phone sleeps depends on the tool: a browser-based bot pauses, a server-based one continues.",
      },
    ],
    related: ["which-deriv-platform-is-easiest", "why-trading-platform-keeps-disconnecting"],
  },

  {
    slug: "who-owns-deriv",
    title: "Who owns Deriv and where is the company based?",
    description:
      "Deriv is a group of companies under a Guernsey holding company. Its founder, CEO, the legal entities it names and the regulator of each, from its site.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Deriv is a group of companies, not a single firm. Its website names Jean-Yves Sireau as founder and Rakshit Choudhary as Chief Executive Officer, and describes Deriv.com Limited, registered in Guernsey, as the holding company. Trading accounts are held with separate entities in several jurisdictions. Deriv says it has served traders for over 25 years.",
    body: [
      { type: "h2", text: "The companies Deriv names" },
      {
        type: "table",
        head: ["Entity", "Where", "Regulator named by Deriv"],
        rows: [
          ["Deriv.com Limited", "Guernsey", "Holding company; no regulator named"],
          ["Deriv (FX) Ltd", "Labuan, Malaysia", "Labuan Financial Services Authority"],
          ["Deriv (BVI) Ltd", "British Virgin Islands", "British Virgin Islands Financial Services Commission"],
          ["Deriv (V) Ltd", "Vanuatu", "Vanuatu Financial Services Commission"],
          ["Deriv (Mauritius) Ltd", "Mauritius", "Financial Services Commission, Mauritius"],
          ["Deriv Investments (Cayman) Limited", "Cayman Islands", "Cayman Islands Monetary Authority"],
          ["Deriv (SVG) LLC", "St Vincent and the Grenadines", "No regulator named"],
          ["Deriv Capital International Ltd", "Samoa", "No regulator named"],
        ],
      },
      {
        type: "p",
        text: `This is the list on Deriv's regulatory page on ${CHECKED}. Deriv also says the group is registered with the Financial Commission, which is a dispute-resolution organisation and not a government regulator.`,
      },
      { type: "h2", text: "Which one is your account with?" },
      {
        type: "p",
        text: "Deriv's terms say your contracting party is the entity your account is registered with, and that the entity decides the governing law and the products available to you. Two clients in different countries can therefore have different protections. Find the entity named in your own account and its terms, then look that entity up on its regulator's register.",
      },
      { type: "h2", text: "Where it has offices" },
      {
        type: "p",
        text: "Deriv's contact page lists European offices in London, Reading, Paris, Berlin, Birkirkara in Malta, Limassol in Cyprus, and Guernsey, and names further regions in Asia, the Middle East, Africa, Latin America, the Caribbean and Oceania.",
      },
      { type: "h2", text: "Why this matters to a trader" },
      {
        type: "list",
        items: [
          "Regulators differ a great deal in how strictly they supervise and what they guarantee.",
          "Complaints and disputes are handled under the law of your entity's jurisdiction.",
          "Product availability, including which contract types you see, depends on the entity.",
        ],
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Who is the founder of Deriv?",
        a: "Deriv's website names Jean-Yves Sireau as founder.",
      },
      {
        q: "Who is the CEO of Deriv?",
        a: `Deriv's website listed Rakshit Choudhary as Chief Executive Officer on ${CHECKED}.`,
      },
      {
        q: "Is FXNOD owned by Deriv?",
        a: "No. FXNOD is an independent product. It connects to Deriv accounts through Deriv's API and is not affiliated with Deriv.",
      },
      {
        q: "Which country is Deriv from?",
        a: "There is no single answer. The holding company is registered in Guernsey and the trading entities are in several jurisdictions, including Labuan, the British Virgin Islands, Vanuatu, Mauritius and the Cayman Islands.",
      },
    ],
    related: ["is-deriv-legit", "is-deriv-available-in-my-country"],
  },

  {
    slug: "is-deriv-legit",
    title: "Is Deriv a legitimate trading platform?",
    description:
      "Deriv is an established broker group with regulated entities in several jurisdictions. What that does and does not protect you from, and how to verify it.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Deriv is a real, long-established broker group: it says it has operated for over 25 years, and it names licensed entities regulated in Labuan, the British Virgin Islands, Vanuatu, Mauritius and the Cayman Islands. Legitimate does not mean low risk. Its products are high risk, protections vary by entity, and most of the danger comes from impersonators.",
    body: [
      { type: "h2", text: "What you can verify yourself" },
      {
        type: "steps",
        items: [
          { title: "Find your entity", text: "Your account and its terms name the Deriv company you are a client of." },
          { title: "Check the regulator's register", text: "Go to that regulator's website through your own search and look the company up by name." },
          { title: "Check the address", text: "Deriv's site is deriv.com. Read the address bar letter by letter before you sign in." },
          { title: "Test a small withdrawal", text: "Deposit a small amount and withdraw it before committing more." },
        ],
      },
      { type: "h2", text: "What regulation here does and does not mean" },
      {
        type: "list",
        items: [
          "It means a named company holds a licence and answers to a regulator.",
          "It does not mean the same protection as a major onshore regulator. Several of Deriv's entities are licensed in offshore jurisdictions, where rules and compensation arrangements are generally lighter.",
          "It does not make any trade safer. A regulated broker's high-risk product is still high risk.",
        ],
      },
      { type: "h2", text: "Complaints" },
      {
        type: "p",
        text: "Deriv's terms say complaints can be sent to its complaints email address with supporting evidence, and that it will send a final response within 15 business days. Deriv also says the group is registered with the Financial Commission, an independent dispute-resolution body.",
      },
      { type: "h2", text: "The real danger: people pretending to be Deriv" },
      {
        type: "list",
        items: [
          "Clone websites and fake apps that collect your login.",
          "Fake support agents on social media and messaging apps who ask for your password or a code.",
          "Account managers who offer to trade for you.",
          "Sellers of bots with guaranteed profits.",
        ],
      },
      {
        type: "p",
        text: "Deriv's terms say you alone control access to your account and must keep your credentials confidential. Nobody genuine needs your password.",
      },
      { type: "h2", text: "About third-party tools" },
      {
        type: "p",
        text: "Independent tools, FXNOD among them, connect to Deriv accounts through Deriv's API. A trustworthy one sends you to Deriv's own login page, never asks for your Deriv password, and leaves your balance at Deriv. Being connected to Deriv is not an endorsement by Deriv.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is Deriv regulated?",
        a: "Deriv names several entities and their regulators, including the Labuan Financial Services Authority, the British Virgin Islands Financial Services Commission, the Vanuatu Financial Services Commission, the Financial Services Commission of Mauritius and the Cayman Islands Monetary Authority. Which applies depends on your account.",
      },
      {
        q: "Is Deriv a scam?",
        a: "Deriv is an established broker group with licensed entities. Many scams use its name, and many people lose money on its products through ordinary trading losses. Neither makes Deriv itself a scam.",
      },
      {
        q: "Is my money safe on Deriv?",
        a: "That depends on the entity you are with and its regulator's rules. No broker protects you from trading losses.",
      },
    ],
    related: ["who-owns-deriv", "how-to-identify-trading-scams"],
  },

  {
    slug: "is-deriv-available-in-my-country",
    title: "Is Deriv available in my country?",
    description:
      "Deriv serves residents of certain countries only and does not publish one fixed list. How to find out for your country, and why a VPN is not the answer.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Deriv's terms say it provides services only to residents of certain countries and that the list can change. It does not publish one fixed list in those terms. The reliable way to find out is to start the sign-up on Deriv's own site and select your country of residence, or to ask Deriv's live chat. You must be 18 or older.",
    body: [
      { type: "h2", text: "How to check" },
      {
        type: "steps",
        items: [
          { title: "Go to Deriv's own website", text: "Type the address yourself." },
          { title: "Start creating an account", text: "The country of residence field shows whether yours can be selected." },
          { title: "Ask live chat if unsure", text: "Deriv describes its live chat as available 24/7." },
          { title: "Check your local law", text: "Deriv's terms say it is your responsibility to know the restrictions that apply where you live." },
        ],
      },
      { type: "h2", text: "Available does not mean everything is available" },
      {
        type: "p",
        text: "Products differ by region. Deriv's terms say the entity your account is with decides which products you can use, and Deriv's own pages say that the availability of its app depends on your country of residence. Its regional terms state, for example, that options trading is not offered to clients residing in the EU. You may be able to open an account and still not see a particular contract type or payment method. Regulators also act on their own account: in June 2023 Brazil's securities regulator, the CVM, ordered Deriv.com to stop offering its services to residents of Brazil. Look for notices from the regulator where you live.",
      },
      { type: "h2", text: "Do not use a VPN to get round it" },
      {
        type: "list",
        items: [
          "Eligibility is based on where you live, not where your connection appears to be.",
          "Identity verification asks for documents that show your real residence.",
          "An account opened against the terms can be closed, and getting money out of it becomes a dispute you start from a weak position.",
          "You may also be breaking your own country's law.",
        ],
      },
      { type: "h2", text: "If you move or travel" },
      {
        type: "p",
        text: "Your account is tied to your country of residence. If you move permanently, tell Deriv and ask what changes. If you are only travelling, ask live chat before trading from a country where Deriv is not offered.",
      },
      { type: "h2", text: "FXNOD and country availability" },
      {
        type: "p",
        text: "FXNOD works with a Deriv account you already hold. It cannot make Deriv available where Deriv does not offer its services, and it can only show the accounts and contracts Deriv gives you.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Which countries does Deriv not accept?",
        a: "Deriv's terms do not name them and say the list can change. Check by starting the sign-up on Deriv's site, or ask its live chat.",
      },
      {
        q: "What is the minimum age to use Deriv?",
        a: "Deriv's terms require you to be 18 or older.",
      },
      {
        q: "Can I use Deriv with a VPN?",
        a: "Using a VPN to appear to be in another country does not change where you are resident, and can lead to the account being closed.",
      },
    ],
    related: ["who-owns-deriv", "how-to-choose-a-trading-platform"],
  },

  {
    slug: "how-much-can-you-lose-on-deriv",
    title: "How much money can you lose when trading on Deriv?",
    description:
      "On options the most one trade can lose is its stake. With leverage, losses come faster. Across many trades you can lose your whole balance. How to cap it.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "On a single options contract, the most you can lose is the stake you paid for it. Across a session you can lose your entire account balance, and automated or fast contracts can do that in minutes. Leveraged products such as CFDs can lose money more quickly still. The only real ceiling is the one you set yourself.",
    body: [
      { type: "h2", text: "By product" },
      {
        type: "table",
        head: ["Product", "Most one trade can lose", "What makes it dangerous"],
        rows: [
          ["Options (Rise/Fall, digits and similar)", "The stake", "A loss takes the whole stake, and contracts settle in seconds"],
          ["Multipliers", "The stake", "The multiplier brings the loss of the stake closer"],
          ["Accumulators, Turbos, Vanillas", "The stake", "A barrier or strike can end the contract suddenly"],
          ["CFDs", "Depends on the size, the leverage and your account's terms", "Leverage multiplies losses; Deriv warns of losing money rapidly"],
        ],
      },
      {
        type: "p",
        text: "For CFDs, what happens if a position loses more than the account holds depends on the terms of the Deriv entity your account is with. Read them before using leverage.",
      },
      { type: "h2", text: "The loss that matters is the session's" },
      {
        type: "p",
        text: "Nobody loses an account on one option. They lose it on a sequence. Twenty trades at a stake of 5 is 100 at risk in a few minutes on one-tick contracts. With a stake that doubles after each loss, seven losses in a row starting from 1 cost 127. The question to answer before you start is how much the whole session is allowed to lose.",
      },
      { type: "h2", text: "How to cap it" },
      {
        type: "steps",
        items: [
          { title: "Deposit only what you can afford to lose", text: "The balance is the outer limit of any loss on options." },
          { title: "Set a session loss limit as money", text: "Stop for the day when it is reached." },
          { title: "Keep the stake to a small share of that limit", text: "One or two per cent leaves room for a normal losing streak." },
          { title: "Do not raise the stake after a loss", text: "Recovery sizing is how small losses become one large one." },
          { title: "Use the limits your tools offer", text: "A stop loss on a Multiplier, or a stop loss on a bot, acts when you do not." },
        ],
      },
      { type: "h2", text: "With a bot on FXNOD" },
      {
        type: "p",
        text: "A bot cannot be started on FXNOD without a stop loss, and limits are checked on FXNOD's servers before every trade. Because the check comes before each order, the last trade can take a session past its stop loss by up to that trade's stake. With a flat stake that is small. With a stake that grows after losses it can be close to the stop loss again.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Can I lose more than I deposit on Deriv?",
        a: "On options and multipliers a trade cannot lose more than its stake, so those cannot take the balance below zero. For leveraged CFDs, check the terms of your Deriv entity.",
      },
      {
        q: "Can I lose all my money on Deriv?",
        a: "Yes. A run of losing trades can empty an account, and fast contracts or a bot can do it quickly.",
      },
      {
        q: "What is the safest way to trade on Deriv?",
        a: "No way is safe. The lowest-risk approach is a demo account. With real money: a small deposit, a small flat stake and a fixed daily loss limit.",
      },
    ],
    related: ["can-trading-bots-lose-money", "trading-bot-risk-management"],
  },

  {
    slug: "deriv-deposits-and-withdrawals-time",
    title: "How long do Deriv deposits and withdrawals take?",
    description:
      "Deriv lists card and e-wallet deposits as instant and withdrawals from instant to one working day, by method. What slows a withdrawal down.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Deriv's help centre says deposits by card and e-wallet are typically instant, and crypto deposits are credited after blockchain confirmation. Withdrawal times depend on the method: Deriv's payment page lists some as instant and cards at one working day, after which your bank or provider adds its own time. Verification checks can add more.",
    body: [
      { type: "h2", text: "What Deriv lists" },
      {
        type: "table",
        head: ["Method", "Deposit", "Withdrawal"],
        rows: [
          ["Visa and Mastercard", "Instant", "1 working day"],
          ["Neteller", "Instant", "Instant"],
          ["M-Pesa, MTN, Airtel, Orange Money, Moov", "Instant", "Instant"],
          ["Vodafone", "Instant", "1 working day"],
          ["Deriv P2P", "Up to 1 hour", "Up to 1 hour"],
          ["Cryptocurrency", "After blockchain confirmation", "See your cashier"],
        ],
      },
      {
        type: "p",
        text: `These are the processing times on Deriv's payment methods page on ${CHECKED}. They are Deriv's part of the journey. For card and bank withdrawals, Deriv's terms say the time for funds to appear depends on your bank's processing times.`,
      },
      { type: "h2", text: "Why a withdrawal takes longer" },
      {
        type: "list",
        items: [
          "Your identity or address has not been verified yet.",
          "The request was made outside business hours. Deriv's terms say such transactions may need more time.",
          "Your bank or card issuer takes several days to post the funds.",
          "The blockchain is congested, for crypto.",
        ],
      },
      { type: "h2", text: "Make the first withdrawal smooth" },
      {
        type: "steps",
        items: [
          { title: "Verify early", text: "Complete identity verification before you need the money." },
          { title: "Use an account in your own name", text: "Payments to or from someone else's account are a common reason for refusal." },
          { title: "Test with a small amount", text: "Deposit a little and withdraw it. You learn the real timing for your method and bank." },
          { title: "Keep the confirmation", text: "Save the reference for each request." },
        ],
      },
      { type: "h2", text: "If it is late" },
      {
        type: "p",
        text: "Check the status in your cashier and your statement first, then contact Deriv's live chat with the reference. Deriv's terms acknowledge that delays can occur because of technical issues and direct clients to live chat. Be wary of anyone outside Deriv's official channels who offers to speed up a withdrawal for a fee.",
      },
      { type: "h2", text: "FXNOD does not move your money" },
      {
        type: "p",
        text: "Deposits and withdrawals for a Deriv account are made at Deriv. FXNOD places trades on the account and shows the results. It does not hold your trading balance or process your Deriv withdrawals.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Are Deriv deposits instant?",
        a: "Deriv says card and e-wallet deposits are typically instant once the payment is confirmed. Crypto deposits appear after blockchain confirmation.",
      },
      {
        q: "Why is my Deriv withdrawal pending?",
        a: "Usually verification, a request made outside business hours, or your bank's own processing time. Check the cashier, then ask live chat.",
      },
      {
        q: "Does Deriv charge withdrawal fees?",
        a: "Deriv's help centre says your selected payment method may charge withdrawal fees, and that crypto withdrawals carry network fees.",
      },
    ],
    related: ["what-is-the-minimum-deposit-on-deriv", "deriv-fees-and-charges"],
  },

  {
    slug: "can-you-have-more-than-one-deriv-account",
    title: "Can you have more than one Deriv account?",
    description:
      "Deriv's terms allow one account per person. Demo and real accounts, Wallets and platform accounts sit inside it. What counts as a duplicate.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "No. Deriv's terms say you may hold only one account with the Deriv group, and that any additional one is a duplicate account that Deriv can close. Inside that one account you can have several things: a demo account, Wallets, sub-accounts and platform accounts such as Deriv MT5 or cTrader, which the terms exclude from the one-account rule.",
    body: [
      { type: "h2", text: "One login, several accounts inside it" },
      {
        type: "table",
        head: ["Allowed inside one Deriv account", "Note"],
        rows: [
          ["Demo account", "Virtual funds, alongside your real account"],
          ["Wallets and sub-accounts", "Excluded from the one-account rule by the terms"],
          ["Platform accounts", "Deriv's help centre says up to five Deriv cTrader accounts can sit under one profile"],
        ],
      },
      { type: "h2", text: "What is not allowed" },
      {
        type: "list",
        items: [
          "A second registration with another email address.",
          "An account opened in a relative's or friend's name that you trade.",
          "Letting someone else use your account. The terms say you alone control access.",
        ],
      },
      { type: "h2", text: "What happens to a duplicate" },
      {
        type: "p",
        text: "Deriv's terms let it close duplicate accounts and move any remaining balance to the account it authorises. Until that is settled, money in the duplicate may be out of reach. If you have opened a second account by mistake, tell Deriv's live chat before depositing into it.",
      },
      { type: "h2", text: "Why people want more than one" },
      {
        type: "list",
        items: [
          "To separate strategies. Use the accounts inside one login, or keep a journal by strategy.",
          "To restart after losses. A fresh account does not fix what caused them.",
          "To claim a promotion twice. That breaches the terms.",
          "To trade from a country where Deriv is not offered. Also a breach.",
        ],
      },
      { type: "h2", text: "Several accounts in FXNOD" },
      {
        type: "p",
        text: "When you connect a Deriv login to FXNOD, every account under it is listed, demo and real, and you choose which one to trade. You can also connect more than one Deriv login to FXNOD and each is connected and disconnected separately. That is a feature of FXNOD and does not change Deriv's rule: whether you may hold those logins is a matter between you and Deriv.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Can I open two Deriv accounts with different emails?",
        a: "Deriv's terms allow one account per person and treat any other as a duplicate that can be closed.",
      },
      {
        q: "Can I have both a demo and a real account on Deriv?",
        a: "Yes. They sit under the same login and you switch between them.",
      },
      {
        q: "How many Deriv cTrader accounts can I have?",
        a: "Deriv's help centre says up to five under a single Deriv profile.",
      },
    ],
    related: ["connect-deriv-account", "lost-access-to-deriv-account"],
  },

  {
    slug: "which-deriv-platform-is-easiest",
    title: "Which Deriv platform is easiest for beginners?",
    description:
      "Deriv Trader is the simplest of Deriv's own platforms for a first trade. How Deriv Trader, Deriv Bot, MT5 and cTrader differ and who each suits.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "For a first trade, Deriv Trader is the simplest of Deriv's own platforms: one screen, a chart, a stake and a contract. Deriv Bot automates trades with visual blocks and no code. Deriv MT5 and Deriv cTrader are full CFD platforms with leverage and are harder to learn. Start on Deriv Trader with a demo account.",
    body: [
      { type: "h2", text: "Deriv's platforms compared" },
      {
        type: "table",
        head: ["Platform", "What it is for", "Difficulty for a beginner"],
        rows: [
          ["Deriv Trader", "Options and multipliers, placed by hand", "Lowest"],
          ["Deriv app", "Deriv's mobile app, with options built in", "Low"],
          ["Deriv Bot", "Automating trades with drag-and-drop blocks; Deriv says no coding is needed", "Medium: the blocks take time to learn"],
          ["SmartTrader", "Another options interface", "Low to medium"],
          ["Deriv MT5", "CFDs on MetaTrader 5", "High"],
          ["Deriv cTrader", "CFDs, with copy trading", "High"],
          ["TradingView", "Charting, connected to Deriv", "Medium"],
        ],
      },
      {
        type: "p",
        text: `This is the line-up on Deriv's site on ${CHECKED}. Deriv adds and retires platforms, and which ones you see depends on your country.`,
      },
      { type: "h2", text: "Why not start with MT5?" },
      {
        type: "p",
        text: "MT5 is a professional CFD platform: lot sizes, margin, leverage, swaps and order types all have to be understood before the first trade. A mistake in position size there is expensive. On an options platform the stake is the most a trade can lose, which makes early mistakes cheaper.",
      },
      { type: "h2", text: "About Deriv Bot" },
      {
        type: "p",
        text: "Deriv Bot ships with preset strategies that its page names as Martingale, D'Alembert and Oscar's Grind, all of which change the stake after a result. Deriv also notes that the bot runs in your browser and pauses if the browser is closed. Learn what a preset does to the stake before running it, and test on demo.",
      },
      { type: "h2", text: "Where FXNOD fits" },
      {
        type: "table",
        head: ["If you want to", "Deriv's own tool", "FXNOD's tool"],
        rows: [
          ["Trade by hand", "Deriv Trader", "dTrader"],
          ["Build a bot", "Deriv Bot, with blocks, in your browser", "dBot, by answering questions, running on FXNOD's servers"],
          ["Start a ready-made bot", "Preset strategies in Deriv Bot", "Auto Hub, with fixed published rules and a flat stake"],
        ],
      },
      {
        type: "p",
        text: "FXNOD's tools are separate products made by FXNOD that trade on your Deriv account. They are alternatives to Deriv's interfaces, not parts of Deriv.",
      },
      { type: "h2", text: "How to choose" },
      {
        type: "list",
        items: [
          "Never traded before: an options screen on a demo account.",
          "Want to automate a simple rule: a bot builder, on demo, with a flat stake.",
          "Want forex or CFDs with full charting: MT5 or cTrader, after learning position sizing.",
        ],
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is Deriv Trader?",
        a: "Deriv's own platform for trading options and multipliers by hand.",
      },
      {
        q: "Is Deriv Bot free?",
        a: "Deriv's page lists no charge for using it and says strategies can be tested on a free demo account. Trading a real account risks your stake.",
      },
      {
        q: "Is Deriv MT5 good for beginners?",
        a: "It is powerful and demanding. Learn position sizing and leverage on its demo account before using real money.",
      },
      {
        q: "Is FXNOD dTrader the same as Deriv Trader?",
        a: "No. FXNOD's dTrader is a separate interface built by FXNOD that places trades on your Deriv account.",
      },
    ],
    related: ["dtrader-manual-trading", "how-to-trade-on-deriv-for-beginners"],
  },

  {
    slug: "why-is-deriv-not-working",
    title: "Why is Deriv not working right now?",
    description:
      "When Deriv will not load or trade, check Deriv's status page, then your connection, browser and account. A five-minute checklist to find the cause.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "If Deriv is not working, first check Deriv's status page, which is linked from its help centre under Support. If it shows a problem, wait: nothing on your side will fix it. If it shows none, the cause is usually your connection, your browser, an expired session, or a restriction on your account or market.",
    body: [
      { type: "h2", text: "A five-minute checklist" },
      {
        type: "steps",
        items: [
          { title: "Check Deriv's status page", text: "It reports outages and maintenance. FXNOD cannot tell you whether Deriv is up; only Deriv can." },
          { title: "Open another website", text: "If that is slow too, the problem is your connection." },
          { title: "Reload, then sign out and in again", text: "An expired session causes blank charts and failed orders." },
          { title: "Try another browser or a private window", text: "This rules out extensions and a damaged cache." },
          { title: "Switch network", text: "Move from Wi-Fi to mobile data. Turn a VPN off." },
          { title: "Try the app or another device", text: "If it works there, the first device is the cause." },
        ],
      },
      { type: "h2", text: "Symptoms and likely causes" },
      {
        type: "table",
        head: ["Symptom", "Likely cause"],
        rows: [
          ["Site will not load at all", "Outage, maintenance, or your network blocking it"],
          ["Charts frozen", "Lost connection to the price stream"],
          ["Cannot sign in", "Wrong password, expired session, or account restriction"],
          ["Buy button fails", "Market closed, stake outside limits, or insufficient balance"],
          ["One market missing", "It is closed, or not offered for your account"],
          ["Deposit or withdrawal stuck", "Verification pending or payment provider delay"],
        ],
      },
      { type: "h2", text: "Market closed is not a fault" },
      {
        type: "p",
        text: "Deriv describes its synthetic indices as available round the clock, including weekends and public holidays. Forex, stocks and commodities follow their own hours and close at weekends. A contract that cannot be bought on Saturday may simply be on a closed market.",
      },
      { type: "h2", text: "If FXNOD cannot reach Deriv" },
      {
        type: "p",
        text: "FXNOD places trades through Deriv, so when Deriv is unavailable, trading through FXNOD is too. If Deriv works on its own site but not in FXNOD, reconnect the Deriv login from Connected Accounts: the permission may have expired or been withdrawn.",
      },
      { type: "h2", text: "What happens to open trades during an outage" },
      {
        type: "p",
        text: "Open contracts are held on Deriv's servers and settle there. You cannot manage them until access returns. If you believe an outage affected a trade unfairly, record the time and the contract reference and raise it with Deriv's support.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is Deriv down right now?",
        a: "Check Deriv's status page, linked from its help centre. This page cannot tell you Deriv's live status.",
      },
      {
        q: "Why can't I log in to Deriv?",
        a: "Check the password, try the Forgot password link, and try another browser. If it still fails, your account may be restricted: ask Deriv's live chat.",
      },
      {
        q: "Why is Deriv slow?",
        a: "Usually a weak connection or a browser short of memory. Close other tabs, switch network and compare with the mobile app.",
      },
    ],
    related: ["why-trading-platform-keeps-disconnecting", "how-to-contact-deriv-support"],
  },

  {
    slug: "how-to-contact-deriv-support",
    title: "How to contact Deriv customer support quickly",
    description:
      "Deriv's fastest support channel is its 24/7 live chat, with WhatsApp, a help centre and a community forum. What to have ready and who not to trust.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "The quickest way to reach Deriv is its live chat, which Deriv describes as available 24/7 and which opens from its Contact us page. Deriv also offers WhatsApp, a help centre and a community forum. Its terms say you can ask its assistant, Amy, for a live agent. Use only links found on Deriv's own website.",
    body: [
      { type: "h2", text: "The channels Deriv lists" },
      {
        type: "table",
        head: ["Channel", "Use it for"],
        rows: [
          ["Live chat", "Anything urgent or account-specific. Described by Deriv as 24/7"],
          ["WhatsApp", "The same, where you prefer messaging. Use the link on Deriv's site"],
          ["Help centre", "Answers you can look up yourself"],
          ["Community forum", "Questions other traders may have asked. Do not post account details"],
          ["Complaints email", "Formal complaints. Deriv's terms promise a final response within 15 business days"],
        ],
      },
      {
        type: "p",
        text: `Deriv's Contact us page listed no telephone number or general support email on ${CHECKED}.`,
      },
      { type: "h2", text: "Have this ready" },
      {
        type: "list",
        items: [
          "Your account ID, never your password.",
          "The reference number of the trade or payment.",
          "The date and time, with your time zone.",
          "A screenshot of the error.",
          "What you have already tried.",
        ],
      },
      { type: "h2", text: "Get a faster answer" },
      {
        type: "steps",
        items: [
          { title: "State the problem in one sentence first", text: "For example: my card withdrawal of 50 USD from Monday has not arrived." },
          { title: "Give the reference straight away", text: "It saves a round of questions." },
          { title: "Ask for a live agent if the assistant cannot help", text: "Deriv's terms say you can request one." },
          { title: "Ask for a ticket or reference number", text: "So you can follow up without starting again." },
        ],
      },
      { type: "h2", text: "Fake support is the main risk" },
      {
        type: "list",
        items: [
          "Reach support only through deriv.com. Do not use a number or account from a search advert, a social media reply or a group.",
          "Real support does not ask for your password, your one-time codes or remote access to your device.",
          "Nobody genuine charges a fee to release a withdrawal.",
          "Be suspicious of anyone who contacts you first.",
        ],
      },
      { type: "h2", text: "Deriv or FXNOD: who to ask" },
      {
        type: "p",
        text: "Ask Deriv about your Deriv account, deposits, withdrawals, verification and the result of a contract. Ask FXNOD about FXNOD's own screens and bots. FXNOD cannot see or change your Deriv payments or your Deriv account settings.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Does Deriv have 24/7 support?",
        a: "Deriv describes its live chat as available 24/7.",
      },
      {
        q: "Does Deriv have a phone number?",
        a: `Deriv's Contact us page did not list one on ${CHECKED}. Treat any phone number claiming to be Deriv support with suspicion.`,
      },
      {
        q: "How do I make a complaint to Deriv?",
        a: "Deriv's terms say to send it to its complaints email with supporting details and evidence, and that it will give a final response within 15 business days.",
      },
    ],
    related: ["why-is-deriv-not-working", "lost-access-to-deriv-account"],
  },

  {
    slug: "deriv-vs-other-trading-platforms",
    title: "Deriv vs other trading platforms: what should you compare?",
    description:
      "Compare Deriv with any other broker on eight points: regulation, products, costs, minimums, payments, platforms, automation and support. A fair method.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Compare Deriv with another platform on eight points: the regulator of the entity you would join, the products offered, the true cost per trade, minimum deposit and stake, payment methods in your country, the trading platforms, support for automation, and customer support. No broker is best for everyone, so compare on what you will actually trade.",
    body: [
      { type: "h2", text: "The comparison table to fill in" },
      {
        type: "table",
        head: ["Point", "Question to ask each broker", "Deriv, in brief"],
        rows: [
          ["Regulation", "Which entity would hold my account, and who regulates it?", "Several entities, regulated in Labuan, BVI, Vanuatu, Mauritius and the Cayman Islands"],
          ["Products", "Does it offer what I want to trade?", "Options, multipliers and CFDs, including its own synthetic indices"],
          ["Cost", "What does one of my typical trades cost?", "Built into the payout on options; spreads and swaps on CFDs"],
          ["Minimums", "What is the smallest deposit and trade?", "Lowest deposit 5 USD; the stake minimum is shown on each contract"],
          ["Payments", "Which methods work in my country?", "Cards, e-wallets, mobile money, crypto and Deriv P2P, varying by country"],
          ["Platforms", "Which software, and on which devices?", "Deriv Trader, Deriv Bot, MT5, cTrader, a mobile app and others"],
          ["Automation", "Is there an API and a bot tool?", "Deriv Bot, and an API that third-party tools use"],
          ["Support", "How do I reach a person, and when?", "24/7 live chat and WhatsApp"],
        ],
      },
      { type: "h2", text: "What is distinctive about Deriv" },
      {
        type: "list",
        items: [
          "Synthetic indices. They are Deriv's own products and are not available at other brokers. Deriv describes them as available round the clock, including weekends.",
          "Fixed-payout options with small stakes and very short durations.",
          "Low entry amounts and payment methods aimed at regions many brokers serve poorly.",
        ],
      },
      { type: "h2", text: "What to weigh against that" },
      {
        type: "list",
        items: [
          "Its named regulators are mostly offshore, where client protection is generally lighter than under major onshore regulators.",
          "Synthetic indices are priced by Deriv itself. You cannot check the price against another venue.",
          "Short fixed-payout contracts make it easy to place many high-risk trades quickly.",
          "Product availability varies by country.",
        ],
      },
      { type: "h2", text: "Compare fairly" },
      {
        type: "steps",
        items: [
          { title: "Decide what you will trade first", text: "A broker that is cheap for forex may be irrelevant if you want synthetic indices." },
          { title: "Use the demo of each", text: "On the same market, at the same time of day." },
          { title: "Cost one real trade", text: "Your size, your holding time, all charges included." },
          { title: "Test a small withdrawal", text: "Before you trust any of them with more." },
        ],
      },
      { type: "h2", text: "A note on comparison sites" },
      {
        type: "p",
        text: "Many broker comparisons are paid for by referral commissions. That includes sites that rank a broker first. Check claims against each broker's own terms. FXNOD's tools work only with Deriv at present, so read this page with that in mind too.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is Deriv better than other brokers?",
        a: "It depends on what you trade. It is the only place to trade its synthetic indices and has low minimums. A trader who wants onshore regulation or tight forex spreads may prefer another broker.",
      },
      {
        q: "Can I trade synthetic indices on another broker?",
        a: "Deriv's synthetic indices are its own products. Other brokers may offer their own simulated markets under different names and rules.",
      },
      {
        q: "Does FXNOD work with other brokers?",
        a: "Deriv is the only venue that is live in FXNOD. Tools for other venues are planned and are not available yet.",
      },
    ],
    related: ["how-to-choose-a-trading-platform", "forex-vs-synthetic-indices"],
  },

  {
    slug: "can-you-trade-on-deriv-24-7",
    title: "Can you trade on Deriv anytime, day or night?",
    description:
      "Deriv's synthetic indices trade round the clock, weekends included. Forex and other real markets keep their own hours. What is open when.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Partly. Deriv describes its synthetic indices as available round the clock, including weekends and public holidays, so there is always something to trade. Real markets on Deriv, such as forex, stocks and commodities, follow their own hours and close at weekends. Each instrument's hours are listed in Deriv's trading specifications.",
    body: [
      { type: "h2", text: "What is open when" },
      {
        type: "table",
        head: ["Market", "Hours"],
        rows: [
          ["Synthetic indices", "Round the clock, including weekends and public holidays, according to Deriv"],
          ["Forex", "Monday to Friday"],
          ["Basket indices", "Weekday hours; Deriv lists one basket as Monday 00:00 to Friday 20:55 GMT"],
          ["Stocks and stock indices", "The hours of their exchange"],
          ["Cryptocurrencies", "Generally every day; check the specification"],
        ],
      },
      {
        type: "p",
        text: "Hours can differ between instruments in the same family, and platforms have maintenance periods. Check the specification for the exact market you trade.",
      },
      { type: "h2", text: "Is any hour better on synthetic indices?" },
      {
        type: "p",
        text: "No. Deriv says its synthetic indices are generated by a random number generator and are not affected by external news. They behave the same way at three in the morning as at three in the afternoon. Claims about a best time to trade a volatility index have no basis in how it is made.",
      },
      { type: "h2", text: "Always open is a risk as well as a convenience" },
      {
        type: "list",
        items: [
          "There is no closing bell to end a bad session for you.",
          "Late-night trading after a loss is when limits are broken.",
          "Fatigue makes stake mistakes more likely.",
        ],
      },
      {
        type: "p",
        text: "Set your own trading hours and a daily loss limit, and treat both as fixed.",
      },
      { type: "h2", text: "Trading while you sleep" },
      {
        type: "p",
        text: "A bot can trade at hours you cannot. Whether it keeps running depends on where it runs: Deriv says its own bot builder runs in your browser and pauses if the browser is closed. Bots started in FXNOD run on FXNOD's servers and continue with their stop loss until a limit is reached or you stop them. Either way, a bot left unattended is still trading your money, so set a stop loss you are content to wake up to.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Can I trade on Deriv at the weekend?",
        a: "Yes, on synthetic indices, which Deriv describes as available on weekends and public holidays. Forex and most real markets are closed.",
      },
      {
        q: "What time does Deriv open and close?",
        a: "The platform itself does not close. Each market has its own hours, listed in Deriv's trading specifications.",
      },
      {
        q: "Is it better to trade volatility indices at night?",
        a: "No. They are generated the same way at all hours.",
      },
    ],
    related: ["best-times-of-day-to-trade", "forex-vs-synthetic-indices"],
  },

  {
    slug: "deriv-fees-and-charges",
    title: "What fees and charges should you check before using Deriv?",
    description:
      "Deriv says deposits are free. The costs to check are the payout on options, spreads and swaps on CFDs, provider and network fees, and dormancy.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Before using Deriv, check five costs: the payout on options, which is where their cost sits; spreads and overnight swaps on CFDs; fees your payment provider may charge on withdrawals, including crypto network fees; currency conversion; and what happens to a dormant account. Deriv's help centre says it charges no fees for deposits into your Wallet.",
    body: [
      { type: "h2", text: "The costs, one by one" },
      {
        type: "table",
        head: ["Cost", "Where it applies", "What to know"],
        rows: [
          ["Payout margin", "Options", "The cost is in the payout quoted for each contract"],
          ["Spread", "CFDs", "The gap between buy and sell price, per instrument"],
          ["Swap", "CFDs held overnight", "Charged or paid per night, per instrument"],
          ["Deposit fee", "Funding your Wallet", "Deriv says there are no fees for deposits"],
          ["Withdrawal fee", "Taking money out", "Deriv says your payment method may charge one"],
          ["Network fee", "Crypto withdrawals", "Deriv's terms make you responsible for applicable network fees"],
          ["Dormancy", "Inactive accounts", "Deriv's terms treat an account with no transactions for over 12 months as dormant, and it can be charged"],
        ],
      },
      { type: "h2", text: "The cost you do not see: the payout" },
      {
        type: "p",
        text: "An option has no commission line. Its cost is the difference between what a fair contract would pay and what it does pay. If an even-chance contract returns a profit of 95 on a stake of 100, you need to win more than 51.3% of the time to break even. That gap is the price, and you pay it on every trade. Read the payout before each purchase.",
      },
      { type: "h2", text: "Dormant accounts" },
      {
        type: "p",
        text: "Deriv's terms treat an account as dormant when it has recorded no transactions for more than twelve months, and allow Deriv to make an adjustment in its favour then and every six months while it stays dormant. They also allow funds of 1 USD or less to be removed after 30 days of inactivity. If you stop trading, withdraw your balance.",
      },
      { type: "h2", text: "Costs from outside Deriv" },
      {
        type: "list",
        items: [
          "Your bank or card issuer may charge for international payments.",
          "Converting between your currency and the account currency costs money each way.",
          "Payment agents and peer-to-peer sellers set their own rates.",
          "Trading profits may be taxable where you live.",
        ],
      },
      { type: "h2", text: "Work out your own cost" },
      {
        type: "steps",
        items: [
          { title: "Take one typical trade", text: "Your market, your stake, your holding time." },
          { title: "Add every charge", text: "Payout margin or spread, swap if held overnight." },
          { title: "Multiply by your trades per month", text: "Small costs repeated often are the large ones." },
          { title: "Add one deposit and one withdrawal", text: "Including what your bank takes." },
        ],
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Does Deriv charge deposit fees?",
        a: "Deriv's help centre says there are no fees for deposits into your Deriv Wallet. Your payment provider may charge its own.",
      },
      {
        q: "Does Deriv charge an inactivity fee?",
        a: "Deriv's terms allow a charge on accounts with no transactions for more than twelve months. The terms do not state a fixed amount.",
      },
      {
        q: "Does Deriv charge commission on options?",
        a: "There is no separate commission line. The cost is built into the payout each contract quotes.",
      },
    ],
    related: ["what-is-spread-in-trading", "what-is-the-minimum-deposit-on-deriv"],
  },

  {
    slug: "lost-access-to-deriv-account",
    title: "What should you do if you lose access to your Deriv account?",
    description:
      "Lost your Deriv password or locked out? Use Deriv's reset link, then live chat. What to do first if someone else may have got into the account.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "If you have lost access to your Deriv account, use the Forgot password link on Deriv's own login page and follow the email it sends. If you cannot receive that email, or the account is locked, contact Deriv's live chat and be ready to prove your identity. If you think someone else got in, tell Deriv immediately.",
    body: [
      { type: "h2", text: "Forgotten password" },
      {
        type: "steps",
        items: [
          { title: "Go to Deriv's login page", text: "Type deriv.com yourself. Do not follow a link from a message." },
          { title: "Choose Forgot password", text: "Enter the email address of your account." },
          { title: "Open the reset email", text: "Check your spam folder, and use the link promptly." },
          { title: "Set a new, unique password", text: "One you use nowhere else." },
        ],
      },
      {
        type: "p",
        text: "If you are still signed in, Deriv's help centre says you can reset the password from your profile, under Settings, using a one-time code sent to your email. Deriv MT5 has its own password, reset separately from the MT5 account details. Deriv cTrader uses your Deriv credentials.",
      },
      { type: "h2", text: "You cannot reach the email address" },
      {
        type: "p",
        text: "Recover the email account first if you can, through your email provider. If that is impossible, contact Deriv's live chat. Expect to be asked for identity documents that match the account. This takes time, which is the reason to keep your email secure and your details up to date before anything goes wrong.",
      },
      { type: "h2", text: "You think someone else has access" },
      {
        type: "steps",
        items: [
          { title: "Tell Deriv at once", text: "Deriv's terms require you to notify it immediately if your credentials are compromised or someone else has used your account." },
          { title: "Change the Deriv password", text: "And the password of the email account behind it." },
          { title: "Remove connected apps you do not recognise", text: "In your Deriv account settings, review the applications with access and revoke any you did not approve." },
          { title: "Check the statement", text: "Note any trade, transfer or withdrawal you did not make, with times." },
          { title: "Scan your device", text: "A password stolen once will be stolen again from an infected device." },
        ],
      },
      { type: "h2", text: "Account locked or disabled" },
      {
        type: "p",
        text: "Accounts can be restricted for incomplete verification, a suspected duplicate account, or a security concern. Only Deriv can tell you why and what it needs. Ask live chat and give your account ID.",
      },
      { type: "h2", text: "Beware of recovery helpers" },
      {
        type: "p",
        text: "People who offer to recover a Deriv account for a fee, often in social media replies, are scammers. Recovery is done by Deriv, through its official channels.",
      },
      { type: "h2", text: "What happens in FXNOD" },
      {
        type: "p",
        text: "FXNOD never has your Deriv password and cannot reset it. If you revoke FXNOD's access at Deriv, or disconnect the login in Connected Accounts, FXNOD stops trading that login's accounts and stops the bots running on it. After you regain your Deriv account, connect it again.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "How do I reset my Deriv password?",
        a: "Use Forgot password on Deriv's login page, or, if signed in, the Password option in your profile settings with the one-time code sent to your email.",
      },
      {
        q: "Can FXNOD recover my Deriv account?",
        a: "No. FXNOD never holds your Deriv password and has no access to Deriv's account recovery. Only Deriv can help.",
      },
      {
        q: "Will my open trades close if I am locked out?",
        a: "No. Open contracts are held by Deriv and settle as normal. You cannot manage them until access is restored.",
      },
    ],
    related: ["how-to-contact-deriv-support", "how-trading-bots-connect-to-platforms"],
  },

  {
    slug: "learn-deriv-for-free",
    title: "Where can you learn how to use Deriv for free?",
    description:
      "Deriv Academy has free courses, guides, ebooks and videos, and the demo account lets you practise. A free learning path and what to avoid paying for.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "You can learn Deriv for free from Deriv Academy, which offers free courses with quizzes, short guides, ebooks and video tutorials, and from the demo account, where you practise with virtual funds. Deriv's help centre and community forum answer specific questions. You do not need to pay for a course, a mentor or a signal group to start.",
    body: [
      { type: "h2", text: "Free sources" },
      {
        type: "table",
        head: ["Source", "What it gives you"],
        rows: [
          ["Deriv Academy", "Free self-paced courses with quizzes, short guides, ebooks, video tutorials and a glossary"],
          ["Demo account", "Practice on live prices with virtual funds"],
          ["Deriv help centre", "How each platform, payment and account feature works"],
          ["Deriv community forum", "Answers to questions other traders have asked"],
          ["FXNOD guides", "Trading basics, risk and how bots work, with the arithmetic worked out"],
        ],
      },
      { type: "h2", text: "A four-week path that costs nothing" },
      {
        type: "steps",
        items: [
          { title: "Week 1: the instrument", text: "Take a beginner course on the market you chose. Place twenty demo trades on one contract and write each one down." },
          { title: "Week 2: risk", text: "Learn stake sizing, risk-to-reward and drawdown. Set a daily demo loss limit and keep to it." },
          { title: "Week 3: charts", text: "Candlesticks, trend, support and resistance. Describe the chart before every trade." },
          { title: "Week 4: review", text: "Add up the month from your journal: win rate, average win and loss, and how often you broke your own rules." },
        ],
      },
      { type: "h2", text: "What you should not pay for" },
      {
        type: "list",
        items: [
          "Signal groups that promise a win rate.",
          "Bots sold with guaranteed profits.",
          "Mentors who ask you to open an account through their link and deposit.",
          "Account managers who offer to trade for you.",
        ],
      },
      {
        type: "p",
        text: "Paid education is not always worthless, but nothing a beginner needs is locked behind a payment, and much of what is sold is marketing for someone's referral commission.",
      },
      { type: "h2", text: "How to judge free content too" },
      {
        type: "list",
        items: [
          "Does it explain how the method loses as well as how it wins?",
          "Does it show the arithmetic, or only screenshots?",
          "Does the author profit when you deposit?",
          "Can you test what it says on a demo account?",
        ],
      },
      {
        type: "p",
        text: "Apply the same questions to this site, and test what it says on a demo account before you rely on it.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is Deriv Academy free?",
        a: "Deriv describes its Academy courses, ebooks and guides as free.",
      },
      {
        q: "How long does it take to learn Deriv?",
        a: "The screens take a few days. Learning to trade without losing your deposit takes months of practice and honest review.",
      },
      {
        q: "Do I need a mentor to trade on Deriv?",
        a: "No. A demo account, a journal and the free material are enough to learn the essentials.",
      },
    ],
    related: ["how-to-start-learning-trading", "can-you-use-deriv-without-depositing"],
  },

  {
    slug: "check-deriv-transaction-and-trading-history",
    title: "How to check your Deriv transaction and trading history",
    description:
      "Deriv keeps your history under Reports: Statement for every transaction, Trade table for contracts, Open positions for live trades. How to use them.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "On Deriv, your history is in the Reports section. Statement lists every transaction on the account, including deposits, withdrawals and trades. Trade table shows the details and result of each closed contract. Open positions shows trades still running. Deriv MT5 keeps its own record in its History tab. Menu names can change between versions.",
    body: [
      { type: "h2", text: "The three reports" },
      {
        type: "table",
        head: ["Report", "What it shows", "Use it to"],
        rows: [
          ["Statement", "Every transaction: deposits, withdrawals, purchases and payouts", "Reconcile your balance and check a payment"],
          ["Trade table", "Each closed contract: reference, type, entry and exit, profit or loss", "Review your trading"],
          ["Open positions", "Contracts that have not settled yet", "See what is still at risk"],
        ],
      },
      {
        type: "p",
        text: "These reports cover trades placed on Deriv Trader, SmartTrader and Deriv Bot, according to Deriv's community guidance. Trades placed on your Deriv account through a third-party tool are trades on the same account and appear in the same records.",
      },
      { type: "h2", text: "How to open them" },
      {
        type: "steps",
        items: [
          { title: "Sign in to Deriv", text: "On its own site or app." },
          { title: "Open Reports", text: "Deriv's guidance describes it as a tab at the top of the page." },
          { title: "Choose the report", text: "Statement, Trade table or Open positions." },
          { title: "Set the date range", text: "Filter by date, and in the Statement by transaction type." },
        ],
      },
      { type: "h2", text: "MT5 and cTrader" },
      {
        type: "p",
        text: "CFD platforms keep their own history. In Deriv MT5, open trades are on the Trade tab and closed trades, with deposits and withdrawals to that MT5 account, are on the History tab, from which a statement can be saved. Use the platform's own report for trades made there.",
      },
      { type: "h2", text: "Your history in FXNOD" },
      {
        type: "p",
        text: "FXNOD shows the trades made through FXNOD. Each bot run has its own page listing its trades, the amount staked, the realised profit or loss and how the run ended, and dTrader lists your open positions. Deriv's Statement remains the complete record of the account, including anything done outside FXNOD.",
      },
      { type: "h2", text: "What to do with the history" },
      {
        type: "list",
        items: [
          "Check it weekly against your own journal.",
          "Work out win rate, average win and average loss from the Trade table.",
          "Look for any transaction you do not recognise and report it to Deriv at once.",
          "Keep copies for your tax records if trading profits are taxable where you live.",
        ],
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Where is the statement on Deriv?",
        a: "In the Reports section, under Statement. It lists all transactions and can be filtered by date and type.",
      },
      {
        q: "Do trades made through FXNOD appear in my Deriv history?",
        a: "Yes. They are placed on your Deriv account, so they are part of that account's records at Deriv.",
      },
      {
        q: "Can I download my Deriv trading history?",
        a: "Deriv MT5 lets you save a statement from its History tab. For the options reports, check the Reports section in your account for the current export options.",
      },
    ],
    related: ["how-to-review-trading-results", "how-to-keep-a-trading-journal"],
  },

  {
    slug: "tools-for-faster-trading-decisions",
    title: "What tools can help you make trading decisions faster?",
    description:
      "The tools that speed up trading decisions: a written plan, a clean chart, alerts, a calendar, a size calculator and automation. Faster is not better.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "The tools that speed up trading decisions are the ones that make the decision before the moment arrives: a written checklist, a clean chart with one or two indicators, price alerts, an economic calendar, a position size calculator, and a bot for rules that need no judgment. Speed helps only when the decision was already good.",
    body: [
      { type: "h2", text: "Tools and what each one saves" },
      {
        type: "table",
        head: ["Tool", "Decision it speeds up", "Risk if misused"],
        rows: [
          ["Written checklist", "Whether this is a valid trade", "None. It is the most valuable tool here"],
          ["Clean chart setup", "What the market is doing", "Too many indicators slow you down"],
          ["Price alerts", "When to look", "Alerts set too close create noise"],
          ["Economic calendar", "Whether to trade now at all", "Ignoring it during major releases"],
          ["Position size calculator", "How much to stake", "Using it after choosing the size"],
          ["Saved templates and favourites", "Getting to the right market and settings", "Reusing settings on a market they were not tested on"],
          ["Trading bot", "Everything, for fully mechanical rules", "Automating a rule that has no edge"],
          ["Trade journal", "What to change next", "Not reviewing it"],
        ],
      },
      { type: "h2", text: "Decide before the moment" },
      {
        type: "p",
        text: "Slow decisions at the screen usually mean the decision was never made in advance. A trader who has written down the setup, the stake, the exit and the daily limit only has to recognise the setup. Everything else is already answered. The checklist is what makes the other tools useful.",
      },
      { type: "h2", text: "Fewer indicators, faster reading" },
      {
        type: "p",
        text: "Each indicator added to a chart is another thing to reconcile. Two that measure different things, such as a moving average for trend and RSI for momentum, are quicker to read than six that mostly repeat each other. If you cannot say what an indicator adds, remove it.",
      },
      { type: "h2", text: "When to automate" },
      {
        type: "list",
        items: [
          "The rule has no judgment in it.",
          "You have tested it on a demo account over a few hundred trades.",
          "The contract is too short to trade consistently by hand.",
          "You have set a stop loss you accept.",
        ],
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "dTrader shows the payout Deriv quotes for your exact settings before you buy, lets you star the markets you use, and has indicators and drawing tools on the chart. dBot turns a rule into a bot by asking questions and shows the stakes of a losing streak before you start. Auto Hub starts a ready-made bot from a few settings. All of them run on a demo account.",
      },
      { type: "h2", text: "Faster is not the goal" },
      {
        type: "p",
        text: "Speed multiplies the quality of the decision behind it. A quick, well-prepared trade is good. A quick impulsive one is how accounts are emptied, and tools that make trading faster make that faster too. If you find yourself trading more because it has become easier, slow down.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is the best tool for a beginner trader?",
        a: "A demo account and a written checklist. Everything else is secondary until those two are in regular use.",
      },
      {
        q: "Do I need paid tools to trade?",
        a: "No. Charts, alerts, calendars and demo accounts are available free. Paid tools save time for experienced traders and do not create an edge.",
      },
      {
        q: "Can AI tools tell me when to trade?",
        a: "AI tools can summarise news and explain concepts. None can reliably predict short-term prices, and on synthetic indices there is nothing to predict.",
      },
      {
        q: "Does trading faster make more money?",
        a: "Only if each trade has a positive expected value. Otherwise it loses money faster.",
      },
    ],
    related: ["how-to-choose-a-trading-bot", "manual-vs-automated-trading"],
  },
];
