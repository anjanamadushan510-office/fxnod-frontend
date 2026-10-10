/**
 * Deriv by country: the questions people in Deriv's largest markets type,
 * taken from Google autocomplete for each country (see the research file
 * dated 2026-10-10). Kenya, Nigeria and South Africa first, because that is
 * where third-party traffic estimates put most of Deriv's visitors.
 *
 * These are the easiest pages on the site to get wrong. What is offered in a
 * country (payment methods, limits, P2P, agents) is set by Deriv per account
 * and changes without notice, and whether a broker is licensed locally is a
 * legal fact. So: a figure appears only where Deriv's own page gave it, with
 * the date; every guide sends the reader to the cashier in their own account
 * and to the local regulator's own register; and no guide says Deriv is or is
 * not licensed in a country. It says which regulators Deriv itself names.
 *
 * Each guide ends with its own call to action. It says what FXNOD does once
 * an account is funded. It does not say a bot makes winning easier, because
 * that is not true and the other guides say why.
 */
import { RISK_NOTE, type Guide } from "./guides";
import { SOURCE_NOTE } from "./learnDeriv";

const TAG = "Deriv by country";
const DATE = "2026-10-10";
const CHECKED = "10 October 2026";

const BOT_AFTER_FUNDING = {
  title: "Funded your account? Keep your limits when the phone is off",
  text: "FXNOD runs a bot on your own Deriv account from its servers, with a stop loss it will not start without. A dropped connection, a locked screen or a dead battery does not switch your limits off. Sign in on Deriv's own page, and try it on the demo account first.",
};

export const COUNTRY_GUIDES: Guide[] = [
  {
    slug: "deriv-payment-agents-explained",
    title: "Deriv payment agents: how they work and how to stay safe",
    description:
      "A Deriv payment agent takes your local payment and credits your Deriv account, or the reverse. How deposits and withdrawals work, and the risks.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "A Deriv payment agent is an independent person or business that moves money between you and your Deriv account using local methods. You pay the agent and the agent credits your account, or the reverse for a withdrawal. Deriv states that it is not affiliated with any payment agent and that you deal with one at your own risk.",
    body: [
      { type: "h2", text: "How a deposit works" },
      {
        type: "steps",
        items: [
          { title: "Open the cashier in your Deriv account", text: "Choose the payment agents option. The agents shown are the ones listed for your country and currency." },
          { title: "Pick an agent and contact them", text: "Using the contact details shown in the cashier, not details from a message or a group." },
          { title: "Agree the amount, the rate and the fee", text: "Before you send anything." },
          { title: "Pay the agent", text: "By the local method they give you, and keep the proof." },
          { title: "Check your statement", text: "The agent credits your Deriv account. Confirm it in Reports before you consider the deal finished." },
        ],
      },
      { type: "h2", text: "How a withdrawal works" },
      {
        type: "steps",
        items: [
          { title: "Contact the agent first", text: "So they expect the transfer and confirm the rate." },
          { title: "Request the withdrawal in the cashier", text: "Deriv sends a verification email that you must confirm." },
          { title: "Choose the agent and the amount", text: "The funds leave your Deriv account for the agent's." },
          { title: "The agent pays you locally", text: "Check your bank or mobile wallet yourself. Do not rely on a screenshot." },
        ],
      },
      { type: "h2", text: "Rules Deriv describes" },
      {
        type: "list",
        items: [
          "Your account must be fully verified to withdraw through a payment agent.",
          "Deriv encourages using the same method for withdrawals as for deposits. If you deposited by card or e-wallet, expect to withdraw that amount back to it before the agent option opens.",
          "If you deposited only through an agent, agent withdrawal is enabled for the account.",
        ],
      },
      { type: "h2", text: "What an agent costs" },
      {
        type: "p",
        text: "Agents set their own exchange rate and commission. Two agents in the same city can differ noticeably. The cost is the gap between the rate you get and the real exchange rate, plus any stated fee. Ask for the final amount you will receive, in your currency, before agreeing.",
      },
      { type: "h2", text: "The risks" },
      {
        type: "table",
        head: ["Risk", "How to reduce it"],
        rows: [
          ["A fake agent", "Use only agents listed in your own cashier, and their listed contact details"],
          ["An agent who does not pay out", "Start with a small amount. Prefer agents with a long record"],
          ["A poor rate", "Compare two or three agents, and compare with other methods"],
          ["A reversed payment", "Pay from, and receive into, an account in your own name"],
          ["Someone asking for your login", "No agent needs it. An agent credits an account by its ID"],
        ],
      },
      { type: "h2", text: "Agents in your country" },
      {
        type: "p",
        text: "People search for Deriv agents in Kenya, Zimbabwe, Botswana, Zambia, Tanzania, South Africa and elsewhere. There is no public list worth trusting outside Deriv: the agents for your country are the ones your cashier shows. If the option is missing, it is not offered for your account.",
      },
      { type: "h2", text: "Agent, P2P or direct?" },
      {
        type: "table",
        head: ["Method", "Who holds the money in between", "Typical trade-off"],
        rows: [
          ["Direct (card, mobile money, e-wallet)", "The payment provider", "Simplest, where it is offered"],
          ["Deriv P2P", "Deriv's escrow", "Local currency, with the escrow as protection"],
          ["Payment agent", "The agent", "Widest reach, and the most trust required"],
        ],
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Are Deriv payment agents safe?",
        a: "Deriv says it is not affiliated with any payment agent and that customers deal with them at their own risk. Use agents from your cashier only, and test with a small amount.",
      },
      {
        q: "How do I find a Deriv agent near me?",
        a: "In the payment agents section of your Deriv cashier, which lists the agents for your country and currency.",
      },
      {
        q: "How much do Deriv agents charge?",
        a: "Each agent sets its own rate and commission. Ask for the exact amount you will receive before you transfer.",
      },
      {
        q: "Does FXNOD act as a payment agent?",
        a: "No. FXNOD does not take deposits for Deriv trading or pay out withdrawals. Funding is done at Deriv.",
      },
    ],
    related: ["deriv-p2p-explained", "deriv-account-currency-explained"],
    cta: BOT_AFTER_FUNDING,
  },

  {
    slug: "deriv-account-currency-explained",
    title: "Deriv account currency: is there a naira, rand or shilling account?",
    description:
      "Deriv accounts are held in a few major currencies and crypto, not in naira, rand or shillings. What that means for deposits, rates and your balance.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Deriv's staff state that fiat accounts are offered in US dollars, euros, pounds and Australian dollars, alongside cryptocurrency accounts. There is no naira, rand or Kenyan shilling account. You can still pay in local currency through methods such as mobile money, Deriv P2P or a payment agent: the money is converted, and your balance is held in the account's currency.",
    body: [
      { type: "h2", text: "What that means in practice" },
      {
        type: "table",
        head: ["You", "What happens"],
        rows: [
          ["Deposit in local currency", "It is converted to your account currency at the rate of the method you used"],
          ["Trade", "Stakes, payouts and your balance are in the account currency"],
          ["Withdraw to a local method", "It is converted back, again at that method's rate"],
        ],
      },
      { type: "h2", text: "There is no single Deriv exchange rate" },
      {
        type: "p",
        text: "Searches for the Deriv dollar to naira rate, or the rand rate, assume one official figure. The rate you get depends on the route: a mobile money provider, a P2P advertiser and a payment agent each apply their own. On Deriv P2P the advertiser sets the rate in the ad. With an agent you agree it beforehand. Compare the final amount you will receive, not the headline rate.",
      },
      { type: "h2", text: "Conversion is a cost on both ends" },
      {
        type: "p",
        text: "Money converted on the way in and again on the way out loses a little each time. On small amounts this can matter more than any trading cost. If the rate on deposit and the rate on withdrawal are a few per cent apart, a round trip with no trading at all returns less than you put in.",
      },
      { type: "h2", text: "Choosing the account currency" },
      {
        type: "list",
        items: [
          "Most local payment methods on Deriv's payment page are listed in US dollars, so a dollar account avoids a second conversion.",
          "Deriv's guidance says the fiat currency can be changed before your first deposit or before creating an MT5 account. After that, only through customer support.",
          "Deriv's terms allow one fiat account. Crypto accounts can be added beside it.",
        ],
      },
      { type: "h2", text: "Minimum deposit in your currency" },
      {
        type: "p",
        text: `Deriv's help centre gives 5 US dollars as the lowest deposit, and on ${CHECKED} its payment page listed several mobile money methods from 5 dollars and cards from 10. The local amount is that figure at your method's rate on the day. Your cashier shows the exact minimum when you select a method.`,
      },
      { type: "h2", text: "Stakes and currency" },
      {
        type: "p",
        text: "Minimum stakes and the number of decimal places allowed depend on the account currency. A bot or a trade set up on one account may need adjusting on another. In FXNOD, the stake you enter is in the currency of the Deriv account you selected, and the amounts sent to Deriv are checked against the places that currency allows.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Does Deriv have a naira account?",
        a: "Deriv's staff list US dollars, euros, pounds, Australian dollars and cryptocurrency as account currencies. Naira is used only to pay in and out, through a method that converts it.",
      },
      {
        q: "Does Deriv have a rand (ZAR) account?",
        a: "Not according to Deriv's own list of account currencies. Rand is converted by the payment method you use.",
      },
      {
        q: "What is the Deriv dollar rate today?",
        a: "There is no single rate. It is set by the payment method, P2P advertiser or agent you use. Compare the final amount you would receive.",
      },
      {
        q: "Can I change my Deriv account currency?",
        a: "Deriv's guidance says yes before your first deposit or before creating an MT5 account, and afterwards only through customer support.",
      },
    ],
    related: ["deriv-payment-agents-explained", "what-is-the-minimum-deposit-on-deriv"],
    cta: BOT_AFTER_FUNDING,
  },

  {
    slug: "deriv-in-kenya",
    title: "Deriv in Kenya: is it legal, how to start, what to check",
    description:
      "What a trader in Kenya should know about Deriv: which regulators Deriv names, how to check the CMA register, M-Pesa, agents, and how to start on demo.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      `Deriv is widely used in Kenya, which third-party traffic estimates rank among its largest markets. On ${CHECKED}, Deriv's own regulatory page named regulators in Labuan, the British Virgin Islands, Vanuatu, Mauritius and the Cayman Islands, and no Kenyan one. To see who is licensed locally, check the Capital Markets Authority's own register. Start on the demo account.`,
    body: [
      { type: "h2", text: "Is Deriv licensed in Kenya?" },
      {
        type: "p",
        text: "In Kenya, the Capital Markets Authority licenses online foreign exchange brokers and publishes its list of licensees. Deriv's regulatory page does not name the CMA among its regulators. This guide does not state whether trading with an offshore broker is permitted for you: that is a legal question. Look at the CMA's own list, reached through your own search, and decide with that in front of you.",
      },
      { type: "h2", text: "What a locally licensed broker changes" },
      {
        type: "table",
        head: ["", "Locally licensed broker", "Offshore broker"],
        rows: [
          ["Supervised by", "The Kenyan regulator", "A regulator in another jurisdiction"],
          ["Complaints", "Can be taken to the local regulator", "Handled under the other jurisdiction's rules"],
          ["Products", "Those the local regulator permits", "Whatever that entity offers, such as synthetic indices"],
        ],
      },
      { type: "h2", text: "Getting started" },
      {
        type: "steps",
        items: [
          { title: "Open the account on Deriv's own site", text: "Type deriv.com yourself. Fake sites and apps target Kenyan traders heavily." },
          { title: "Stay on the demo account", text: "It uses virtual funds and needs no deposit." },
          { title: "Verify early", text: "Identity and address, before you need a withdrawal." },
          { title: "Look at the cashier", text: "It shows the methods offered to your account, including M-Pesa where available." },
          { title: "Deposit a small amount and withdraw it", text: "Before committing more." },
        ],
      },
      { type: "h2", text: "Paying in and out" },
      {
        type: "p",
        text: `Deriv's payment page listed M-Pesa on ${CHECKED}, along with cards, Deriv P2P and payment agents for accounts where they are offered. Accounts are not held in shillings: your deposit is converted to the account currency. See the M-Pesa guide for the details and the safety points.`,
      },
      { type: "h2", text: "Customer care and contact numbers" },
      {
        type: "p",
        text: "Searches for a Deriv Kenya customer care number are common. Deriv's contact page listed no telephone number on the day it was read: support is live chat and WhatsApp from links on Deriv's own site. A phone number claiming to be Deriv Kenya support, found in an advert or a group, should be treated as a scam.",
      },
      { type: "h2", text: "Scams aimed at Kenyan traders" },
      {
        type: "list",
        items: [
          "Fake M-Pesa apps and files described as a Deriv M-Pesa app.",
          "Paybill or till numbers sent by message. Payment details come only from your own cashier.",
          "Account managers promising to grow a deposit.",
          "Bots sold in Telegram and WhatsApp groups with guaranteed profits.",
        ],
      },
      { type: "h2", text: "Tax" },
      {
        type: "p",
        text: "Trading profits may be taxable in Kenya. Keep your Deriv statements and ask a qualified adviser. Using an offshore broker does not remove a tax obligation at home.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is Deriv legal in Kenya?",
        a: "This guide does not give a legal ruling. Deriv's regulatory page names no Kenyan regulator. Check the Capital Markets Authority's list of licensed brokers and your own circumstances.",
      },
      {
        q: "Does Deriv have an office or phone number in Kenya?",
        a: "Deriv's contact page listed no telephone number and no Kenyan office when it was read. Use live chat or WhatsApp from Deriv's own site.",
      },
      {
        q: "Can I use M-Pesa with Deriv?",
        a: `Deriv's payment page listed M-Pesa on ${CHECKED}. Your cashier shows whether it is offered to your account.`,
      },
      {
        q: "Can I use FXNOD in Kenya?",
        a: "FXNOD works with a Deriv account you already hold, in a phone browser. It cannot make Deriv available where Deriv does not offer its services.",
      },
    ],
    related: ["deriv-mpesa-deposit-and-withdrawal", "is-deriv-legit"],
    cta: {
      title: "Trading from a phone on mobile data?",
      text: "FXNOD opens in the phone browser with nothing to install, and a bot you start keeps running on FXNOD's servers with its stop loss if the network drops. It works on your own Deriv account, and on the demo account first.",
    },
  },

  {
    slug: "deriv-mpesa-deposit-and-withdrawal",
    title: "Deriv and M-Pesa: how to deposit and withdraw safely",
    description:
      "How M-Pesa deposits and withdrawals work on Deriv: the limits Deriv lists, the steps, what delays a withdrawal, and the M-Pesa scams to avoid.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      `To use M-Pesa with Deriv, start the deposit or withdrawal in the cashier of your own Deriv account and follow the M-Pesa prompts from there. On ${CHECKED}, Deriv's payment page listed M-Pesa at 5 to 1,000 US dollars for both deposits and withdrawals, with instant processing. Never pay a paybill or till number that reached you by message.`,
    body: [
      { type: "h2", text: "Depositing" },
      {
        type: "steps",
        items: [
          { title: "Sign in on Deriv's own site or app", text: "Open the cashier and choose deposit." },
          { title: "Select M-Pesa", text: "If it is not listed, it is not offered to your account." },
          { title: "Enter the amount", text: "The screen shows the minimum and maximum for the method." },
          { title: "Approve on your phone", text: "Approve the payment as the cashier instructs. Deriv never asks you to send your PIN to anyone." },
          { title: "Check the balance and the statement", text: "Deriv says mobile deposits are typically instant once the payment is confirmed." },
        ],
      },
      { type: "h2", text: "Withdrawing" },
      {
        type: "steps",
        items: [
          { title: "Make sure the account is verified", text: "Unverified accounts are the commonest cause of a stuck withdrawal." },
          { title: "Request the withdrawal in the cashier", text: "Choose M-Pesa and the amount, and confirm the email Deriv sends." },
          { title: "Use the number you deposited from", text: "Deriv's terms ask for withdrawals by the same method used to deposit." },
          { title: "Check M-Pesa itself", text: "Confirm the money in your M-Pesa balance, not from a message that looks like a confirmation." },
        ],
      },
      { type: "h2", text: "Limits and the rate" },
      {
        type: "table",
        head: ["Item", "What Deriv's page showed"],
        rows: [
          ["Deposit", "5 to 1,000 US dollars"],
          ["Withdrawal", "5 to 1,000 US dollars"],
          ["Processing", "Instant"],
          ["Account currency", "Not shillings: the amount is converted"],
        ],
      },
      {
        type: "p",
        text: "Limits and the conversion rate can change, and your cashier is the authority. Check the shilling amount you are asked to approve: that is the rate you are getting.",
      },
      { type: "h2", text: "When a withdrawal does not arrive" },
      {
        type: "list",
        items: [
          "Check the status in the cashier and note the reference.",
          "Check your M-Pesa statement, not only the SMS.",
          "Confirm the number is registered in the same name as your Deriv account.",
          "Contact Deriv's live chat with the reference. Deriv's community has reports of M-Pesa withdrawals marked completed and not received, which only Deriv and the provider can trace.",
        ],
      },
      { type: "h2", text: "M-Pesa scams around Deriv" },
      {
        type: "table",
        head: ["What you see", "What it is"],
        rows: [
          ["A Deriv M-Pesa app or APK file", "Not from Deriv's cashier. It can steal your login or PIN"],
          ["A paybill or till number in a message", "Someone else's account"],
          ["An agent offering a better rate off-platform", "No escrow and no record"],
          ["A fake payment confirmation SMS", "Sent to make you release funds on P2P"],
          ["Support asking for your M-Pesa PIN", "Not Deriv"],
        ],
      },
      { type: "h2", text: "M-Pesa, P2P or an agent?" },
      {
        type: "p",
        text: "Direct M-Pesa from the cashier is the simplest where it is offered. Deriv P2P uses an escrow and lets the other person set the rate. A payment agent reaches where the others do not and needs the most trust. Compare the final shilling amount on each.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "What is the minimum M-Pesa deposit on Deriv?",
        a: `Deriv's payment page listed 5 US dollars on ${CHECKED}. Your cashier shows the current figure.`,
      },
      {
        q: "What is the Deriv M-Pesa paybill number?",
        a: "Do not use a number from a search result or a message. The payment is started from your own Deriv cashier, which supplies the details.",
      },
      {
        q: "How long does a Deriv M-Pesa withdrawal take?",
        a: "Deriv's payment page listed it as instant. Verification, and delays at Deriv or the provider, can make it longer.",
      },
      {
        q: "Is there a Deriv M-Pesa app?",
        a: "Deposits and withdrawals are made in Deriv's own cashier. Treat any separate app or APK file with that name as unsafe.",
      },
    ],
    related: ["deriv-in-kenya", "deriv-withdrawal-pending"],
    cta: BOT_AFTER_FUNDING,
  },

  {
    slug: "deriv-in-nigeria",
    title: "Deriv in Nigeria: is it legal, how to fund, what to check",
    description:
      "What a trader in Nigeria should know about Deriv: which regulators Deriv names, funding without a naira account, P2P and agents, and common scams.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      `Nigeria is one of Deriv's largest markets by third-party traffic estimates. On ${CHECKED}, Deriv's regulatory page named regulators in Labuan, the British Virgin Islands, Vanuatu, Mauritius and the Cayman Islands, and no Nigerian one. Deriv has no naira account, so funding goes through a method that converts naira. Check the options in your own cashier.`,
    body: [
      { type: "h2", text: "Is Deriv regulated in Nigeria?" },
      {
        type: "p",
        text: "Nigeria's capital markets regulator is the Securities and Exchange Commission, which publishes the operators it has registered. Deriv's regulatory page does not name it. This guide does not rule on whether using an offshore broker is permitted for you. Check the Commission's own list and your own circumstances.",
      },
      { type: "h2", text: "What people ask about Deriv in Nigeria" },
      {
        type: "table",
        head: ["Question", "Short answer"],
        rows: [
          ["Is there a naira account?", "No. Deriv's staff list dollars, euros, pounds, Australian dollars and crypto"],
          ["Is Deriv regulated by the FCA?", "Deriv's regulatory page does not name the UK's Financial Conduct Authority"],
          ["Does Deriv have an office in Nigeria?", "Deriv's contact page listed European offices and named Africa as a region, with no Nigerian address"],
          ["What is the dollar to naira rate?", "There is no single rate. Each method, advertiser or agent sets its own"],
        ],
      },
      { type: "h2", text: "Funding from Nigeria" },
      {
        type: "list",
        items: [
          "Cards: Deriv lists Visa and Mastercard. Whether a Nigerian card is accepted for international payments depends on your bank.",
          "Deriv P2P: local currency with an escrow, where it is offered to your account.",
          "Payment agents: listed in the cashier for your country where offered.",
          "Crypto: sent to the address in your cashier, on exactly the network shown there.",
        ],
      },
      {
        type: "p",
        text: "Which of these you see depends on your account. Deriv says available payment methods may change at any time. The cashier is the only reliable list.",
      },
      { type: "h2", text: "Protecting the naira value" },
      {
        type: "p",
        text: "With a fast-moving exchange rate, the conversion on the way in and out can outweigh every trading cost. Agree the final naira amount before any agent or P2P deal, and remember the balance is in dollars: its naira value changes even when you do not trade.",
      },
      { type: "h2", text: "Getting started safely" },
      {
        type: "steps",
        items: [
          { title: "Register on Deriv's own site", text: "Type the address yourself." },
          { title: "Use the demo account first", text: "No deposit needed." },
          { title: "Verify your identity and address", text: "Before the first withdrawal." },
          { title: "Fund with a small amount", text: "And test a withdrawal back." },
        ],
      },
      { type: "h2", text: "Scams aimed at Nigerian traders" },
      {
        type: "list",
        items: [
          "Account managers and investment groups promising a weekly return.",
          "Fake agents offering a rate far better than everyone else's.",
          "Off-platform P2P deals with forged bank alerts.",
          "Free bot files that hide a stake which doubles after every loss.",
          "Support impersonators on social media asking for a login or a code.",
        ],
      },
      { type: "h2", text: "Tax" },
      {
        type: "p",
        text: "Trading profits may be taxable in Nigeria. Keep your statements and ask a qualified adviser.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is Deriv legal in Nigeria?",
        a: "This guide gives no legal ruling. Deriv's regulatory page names no Nigerian regulator. Check the Securities and Exchange Commission's own list.",
      },
      {
        q: "Can I deposit naira on Deriv?",
        a: "Not into a naira account. You pay through a method that converts naira, such as P2P or an agent where offered.",
      },
      {
        q: "Is Deriv P2P available in Nigeria?",
        a: "Check the P2P section of your own account. Availability is set per country and can change.",
      },
      {
        q: "Can I use FXNOD in Nigeria?",
        a: "FXNOD works with a Deriv account you already hold. It cannot make Deriv available where Deriv does not offer its services.",
      },
    ],
    related: ["deriv-account-currency-explained", "deriv-p2p-explained"],
    cta: {
      title: "Power cut or network down? Your limits should still hold",
      text: "A bot started in FXNOD runs on FXNOD's servers with a required stop loss, so it does not depend on your phone staying on. It trades your own Deriv account, and your balance stays at Deriv. Try it on the demo account first.",
    },
  },

  {
    slug: "deriv-in-south-africa",
    title: "Deriv in South Africa: is it legal, rand funding, what to check",
    description:
      "What a trader in South Africa should know about Deriv: which regulators Deriv names, how to check the FSCA, funding in rand, and bank withdrawals.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      `South Africa is among Deriv's largest markets by third-party traffic estimates. On ${CHECKED}, Deriv's regulatory page named regulators in Labuan, the British Virgin Islands, Vanuatu, Mauritius and the Cayman Islands, and not South Africa's Financial Sector Conduct Authority. Deriv has no rand account, so rand is converted by the payment method you use.`,
    body: [
      { type: "h2", text: "Is Deriv regulated in South Africa?" },
      {
        type: "p",
        text: "The Financial Sector Conduct Authority authorises financial services providers in South Africa and lets anyone search its register. Deriv's regulatory page does not name the FSCA. This guide does not rule on whether an offshore broker is right or permitted for you. Search the FSCA's own register and weigh the difference in protection.",
      },
      { type: "h2", text: "The questions South African traders ask" },
      {
        type: "table",
        head: ["Question", "Short answer"],
        rows: [
          ["Is Deriv a good broker in South Africa?", "It is long established and offshore-regulated. Good depends on what you trade and the protection you want"],
          ["Is Deriv an ECN or A-book broker?", "On synthetic indices there is no external market: Deriv is the other side of the trade"],
          ["Is there a rand account?", "No. Deriv's staff list dollars, euros, pounds, Australian dollars and crypto"],
          ["What is the minimum deposit in rand?", "Deriv gives 5 US dollars as the lowest deposit. The rand amount depends on the method's rate"],
        ],
      },
      { type: "h2", text: "Funding in rand" },
      {
        type: "list",
        items: [
          "Cards: Visa and Mastercard are listed by Deriv, at 10 to 10,000 US dollars.",
          "Bank and instant-transfer methods: shown in your cashier where offered to South African accounts.",
          "Deriv P2P and payment agents: where offered.",
          "Crypto: to the address and network shown in the cashier.",
        ],
      },
      { type: "h2", text: "Withdrawing to a South African bank" },
      {
        type: "p",
        text: "Searches for withdrawing from Deriv to Capitec and other banks are common. Deriv publishes no bank-specific guidance. Its terms say that for card and bank withdrawals, the time for funds to appear depends on the bank's own processing, and its community staff have given two to five working days for bank transfers, sometimes longer. Withdraw by the method you deposited with, to an account in your own name.",
      },
      { type: "h2", text: "Before you rely on a method" },
      {
        type: "steps",
        items: [
          { title: "Verify the account", text: "Identity and address." },
          { title: "Deposit a small amount", text: "By the method you plan to use." },
          { title: "Withdraw it", text: "And time how long it really takes to reach your bank." },
          { title: "Note the rand you got back", text: "The difference from what you sent is the round-trip cost." },
        ],
      },
      { type: "h2", text: "Exchange control and tax" },
      {
        type: "p",
        text: "Moving money abroad from South Africa is subject to exchange control rules and allowances, and trading profits may be taxable. Both depend on your circumstances. Ask your bank and a qualified tax adviser, and keep your Deriv statements.",
      },
      { type: "h2", text: "Scams" },
      {
        type: "list",
        items: [
          "Account managers offering to trade your Deriv account.",
          "Signal and bot groups charging in rand for guaranteed results.",
          "Agents found outside the cashier.",
          "Fake support accounts.",
        ],
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is Deriv legal in South Africa?",
        a: "This guide gives no legal ruling. Deriv's regulatory page does not name the FSCA. Search the FSCA's register and consider the protection you want.",
      },
      {
        q: "Does Deriv have a rand account?",
        a: "No, according to Deriv's own list of account currencies. Rand is converted by your payment method.",
      },
      {
        q: "How long does a Deriv withdrawal to Capitec take?",
        a: "Deriv gives no bank-specific time. It says bank and card withdrawals depend on the bank's processing, and its staff have quoted two to five working days for bank transfers.",
      },
      {
        q: "Can I use FXNOD in South Africa?",
        a: "FXNOD works with a Deriv account you already hold. It cannot change what Deriv offers in your country.",
      },
    ],
    related: ["deriv-account-currency-explained", "deriv-deposits-and-withdrawals-time"],
    cta: {
      title: "Load-shedding should not switch your stop loss off",
      text: "A bot started in FXNOD runs on FXNOD's servers with a required stop loss, so a power cut at your end does not leave a trade unwatched. It works on your own Deriv account. Try it on the demo account first.",
    },
  },
];
