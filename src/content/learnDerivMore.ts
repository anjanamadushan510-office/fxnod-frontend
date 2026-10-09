/**
 * More questions about Deriv itself: verification, crypto and P2P payments,
 * pending withdrawals, platforms, the demo account, religion, tax and the
 * partner programme.
 *
 * The same rule as learnDeriv.ts: every statement about Deriv was read on
 * Deriv's own pages on the date in that file's `CHECKED`, and is written as
 * what Deriv says. Several of these pages disagree with each other or with
 * older Deriv community posts (document age limits, USDT networks, partner
 * commission rates). Where they do, the guide gives no figure and sends the
 * reader to the screen in their own account. The halal and tax guides state
 * no ruling and no rate: neither is ours to give.
 */
import { RISK_NOTE, type Guide } from "./guides";
import { SOURCE_NOTE } from "./learnDeriv";

const TAG = "Deriv questions";
const DATE = "2026-10-09";

export const DERIV_MORE_GUIDES: Guide[] = [
  {
    slug: "deriv-account-verification",
    title: "Deriv account verification: documents, time and common problems",
    description:
      "Deriv verifies identity with an ID and a selfie, and address with a document or location. What it accepts, how long it takes, and why uploads fail.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "To verify a Deriv account you prove your identity and your address. Deriv's help centre says identity needs an identity card, a driving licence or a valid passport, plus a selfie. Address can be verified by allowing location access, or with a document such as a utility bill or bank statement. Deriv's staff give one to three working days for review.",
    body: [
      { type: "h2", text: "What Deriv asks for" },
      {
        type: "table",
        head: ["Check", "What Deriv's help centre lists"],
        rows: [
          ["Proof of identity", "An identity card, a driving licence or a valid passport, and a photo of yourself"],
          ["Proof of address", "Location access for instant verification, or a document: an ID showing the address, a utility bill, a bank statement or a government-issued letter"],
          ["File format", "JPG, PNG, WEBP or PDF, up to 50MB"],
        ],
      },
      {
        type: "p",
        text: "Deriv's pages give different limits for how recent an address document must be, depending on the account. Use the most recent one you have, and follow what the upload screen in your own account says.",
      },
      { type: "h2", text: "Do you have to verify?" },
      {
        type: "p",
        text: "Deriv's community guidance says you do not need to verify unless prompted, and that Deriv will contact you by email when it is required. Its app page says full access requires identity verification. In practice, expect to be asked before a withdrawal. Verifying early avoids a delay when you want your money.",
      },
      { type: "h2", text: "Why uploads are rejected" },
      {
        type: "list",
        items: [
          "The photo is cropped, blurred, or has glare. Deriv asks for all corners and text to be clearly visible.",
          "The document has expired.",
          "The name or date of birth does not match your Deriv profile exactly.",
          "The address on the document differs from the one in your profile.",
          "The address document is too old, or is a type not accepted for your account.",
        ],
      },
      { type: "h2", text: "Get it right first time" },
      {
        type: "steps",
        items: [
          { title: "Check your profile first", text: "Name, date of birth and address must match your documents letter for letter." },
          { title: "Photograph on a plain surface in daylight", text: "The whole document, no flash." },
          { title: "Use a recent address document in your own name", text: "Not a family member's bill." },
          { title: "Wait for the result before uploading again", text: "Repeated uploads can restart the queue." },
        ],
      },
      { type: "h2", text: "If it is stuck" },
      {
        type: "p",
        text: "Contact Deriv's live chat with your account ID. Only Deriv can see why a document was refused. Never send identity documents to anyone who offers to verify your account for you: that is how accounts and identities are stolen.",
      },
      { type: "h2", text: "FXNOD and verification" },
      {
        type: "p",
        text: "FXNOD does not verify your Deriv account and never asks for your identity documents for Deriv. Verification is between you and Deriv, on Deriv's own site.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "How long does Deriv verification take?",
        a: "Deriv staff give one to three working days when the documents meet the requirements. Rejections and resubmissions take longer.",
      },
      {
        q: "Can I trade on Deriv without verification?",
        a: "Deriv says verification is requested when required and that full access needs it. Expect to verify before withdrawing.",
      },
      {
        q: "Why does Deriv keep rejecting my proof of address?",
        a: "Usually a mismatch with your profile, an old document, or an unclear photo. Ask live chat for the specific reason.",
      },
    ],
    related: ["deriv-withdrawal-pending", "lost-access-to-deriv-account"],
  },

  {
    slug: "deriv-usdt-deposit",
    title: "How to deposit USDT on Deriv safely",
    description:
      "Depositing USDT on Deriv means sending it to the address in your cashier on the exact network shown there. The steps and the mistakes that lose funds.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "To deposit USDT on Deriv, open the cashier of your Deriv account, choose the Tether option, and send the USDT to the address shown, on exactly the network shown beside it. Funds are credited after blockchain confirmation. Sending on a different network from the one displayed can lose the money permanently, so check it every time.",
    body: [
      { type: "h2", text: "Step by step" },
      {
        type: "steps",
        items: [
          { title: "Sign in on Deriv's own site", text: "Open the cashier and choose to deposit cryptocurrency." },
          { title: "Select the Tether option you want", text: "Deriv lists more than one, each on a different network." },
          { title: "Copy the address and note the network", text: "Both are shown on the deposit screen." },
          { title: "In your wallet or exchange, choose the same network", text: "This is the step where money is lost." },
          { title: "Send a small test amount first", text: "Wait for it to arrive before sending the rest." },
          { title: "Wait for confirmations", text: "Deriv says funds typically appear after blockchain confirmation." },
        ],
      },
      { type: "h2", text: "Which network?" },
      {
        type: "p",
        text: "Deriv's own pages and its older community posts disagree about which USDT networks it accepts, because the list has changed over time. Do not rely on any article for this, including this one. The network printed on your cashier's deposit screen at the moment you deposit is the only one that counts.",
      },
      { type: "h2", text: "Mistakes that lose funds" },
      {
        type: "table",
        head: ["Mistake", "What happens"],
        rows: [
          ["Wrong network", "The transfer may never be credited and is often unrecoverable"],
          ["Address typed by hand", "One wrong character sends it elsewhere. Always copy and paste, then compare the first and last characters"],
          ["Address from a message or a helper", "It is someone else's wallet"],
          ["Sending a different coin to a USDT address", "It may not be credited"],
          ["A reused old address", "Deposit addresses can change. Take it fresh from the cashier"],
        ],
      },
      { type: "h2", text: "Fees and minimums" },
      {
        type: "list",
        items: [
          "Deriv's help centre says it charges no fees for deposits. The blockchain network and your exchange charge their own.",
          "Deriv's terms make you responsible for network fees on withdrawals.",
          "Minimum amounts are shown in the cashier for the option you select.",
        ],
      },
      { type: "h2", text: "After it arrives" },
      {
        type: "p",
        text: "The deposit lands in the crypto account or Wallet it was sent to. Check where it is before looking for it in a trading account, and keep the transaction ID until you have seen the balance.",
      },
      { type: "h2", text: "FXNOD does not take your deposit" },
      {
        type: "p",
        text: "To trade a Deriv account through FXNOD, you fund the Deriv account at Deriv. Do not send crypto to any address given to you as an FXNOD deposit for Deriv trading by a person or a message.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Which USDT network does Deriv use?",
        a: "The one shown on the deposit screen of your cashier. Deriv has offered different networks over time, so check there each time.",
      },
      {
        q: "How long does a USDT deposit take on Deriv?",
        a: "Deriv says funds typically appear after blockchain confirmation, which depends on the network.",
      },
      {
        q: "I sent USDT on the wrong network. Can I get it back?",
        a: "Contact Deriv's live chat with the transaction ID immediately. Recovery is often not possible.",
      },
    ],
    related: ["what-is-the-minimum-deposit-on-deriv", "deriv-deposits-and-withdrawals-time"],
  },

  {
    slug: "deriv-p2p-explained",
    title: "Deriv P2P: how it works and how to stay safe",
    description:
      "Deriv P2P lets you buy and sell your Deriv balance with other verified users, with funds held in escrow. How an order works and the scams to avoid.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "Deriv P2P is Deriv's peer-to-peer service for moving money in and out of a Deriv account. You exchange with another verified user using a local payment method, and Deriv holds the funds in escrow until both sides confirm. It is useful where cards and bank transfers are awkward. The main risk is being talked into dealing outside the platform.",
    body: [
      { type: "h2", text: "How an order works" },
      {
        type: "steps",
        items: [
          { title: "Choose an ad", text: "Pick an amount within the advertiser's range and a payment method." },
          { title: "The funds go into escrow", text: "Deriv says the agreed amount is placed in escrow when the trade starts." },
          { title: "The buyer pays", text: "By the agreed local method, directly to the seller." },
          { title: "The seller confirms receipt", text: "Only after the money has really arrived in their own account." },
          { title: "Escrow releases", text: "The Deriv balance moves to the buyer." },
        ],
      },
      { type: "h2", text: "Buying and selling" },
      {
        type: "table",
        head: ["You want to", "On Deriv P2P you", "You are exposed until"],
        rows: [
          ["Deposit", "Buy: pay a seller in local currency", "The seller confirms and escrow releases"],
          ["Withdraw", "Sell: receive local currency from a buyer", "You have checked the money is in your bank"],
        ],
      },
      { type: "h2", text: "Limits" },
      {
        type: "p",
        text: "Deriv describes a tier system that sets your daily buy and sell limits according to your activity and verification level. Its payment page showed up to 10,000 USD a day and a maximum processing time of one hour. Your own limits are shown in the P2P section of your account.",
      },
      { type: "h2", text: "The scams" },
      {
        type: "list",
        items: [
          "A fake payment proof: a screenshot or an SMS that looks like a bank alert. Release only after checking your real balance.",
          "Pressure to release quickly, or a claim that the payment is delayed.",
          "A payment from a third party's account, which may be reversed or stolen money.",
          "An offer of a better rate by dealing directly on a messaging app. Deriv advises never to complete or negotiate exchanges outside the platform.",
          "Someone claiming to be Deriv support inside a chat.",
        ],
      },
      { type: "h2", text: "Rules to trade by" },
      {
        type: "list",
        items: [
          "Check the counterparty's completion record before choosing an ad.",
          "Pay only from an account in your own name, and accept only from the named counterparty.",
          "Confirm received money in your banking app, never from a screenshot.",
          "Keep all communication inside the order chat.",
          "If something is wrong, raise a dispute in the platform instead of cancelling.",
        ],
      },
      { type: "h2", text: "Availability" },
      {
        type: "p",
        text: "Deriv P2P is not offered everywhere: Deriv's terms say it is unavailable to clients residing in the EU. Whether you see it depends on your country and account.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is Deriv P2P safe?",
        a: "The escrow protects a trade done correctly inside the platform. Most losses come from releasing before the money has truly arrived, or from dealing outside it.",
      },
      {
        q: "How long does a Deriv P2P order take?",
        a: "Deriv's payment page gave a maximum of one hour.",
      },
      {
        q: "Does FXNOD offer P2P?",
        a: "No. Deposits and withdrawals for a Deriv account are made at Deriv.",
      },
    ],
    related: ["deriv-deposits-and-withdrawals-time", "how-to-identify-trading-scams"],
  },

  {
    slug: "deriv-withdrawal-pending",
    title: "Deriv withdrawal pending: why, and what to do",
    description:
      "A pending Deriv withdrawal usually means verification, review, or your bank's own processing time. How to find which, and when to contact support.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "A Deriv withdrawal usually shows as pending for one of four reasons: your account still needs verification, the request is waiting for review, it was made outside business hours, or Deriv has sent it and your bank or payment provider has not posted it yet. Check the status and your email first, then contact Deriv's live chat with the reference.",
    body: [
      { type: "h2", text: "Find out where it is" },
      {
        type: "table",
        head: ["What you see", "Likely stage", "Do this"],
        rows: [
          ["An email asking you to confirm", "Waiting for you", "Open the link in the email from Deriv"],
          ["A request for documents", "Verification", "Upload what is asked, clearly"],
          ["Pending in the cashier", "Deriv's review or processing", "Wait for the stated time, then ask live chat"],
          ["Marked as sent, nothing in the bank", "Your bank or provider", "Allow the bank's processing time, then ask the bank with the reference"],
          ["Rejected or returned", "Details did not match", "Read the reason and correct the details"],
        ],
      },
      { type: "h2", text: "Typical timings" },
      {
        type: "p",
        text: "Deriv's payment page lists some methods as instant and cards at one working day. Deriv's terms add that the time for funds to appear on a card or in a bank depends on the bank's own processing, and that requests made outside standard business hours may take longer. Crypto withdrawals also wait on the blockchain.",
      },
      { type: "h2", text: "Common causes of delay" },
      {
        type: "list",
        items: [
          "Identity or address not yet verified.",
          "The payment account is not in your own name.",
          "A weekend or public holiday in between.",
          "Trading activity or a bonus condition under review.",
          "A technical issue at Deriv or the payment provider, which Deriv's terms acknowledge can happen.",
        ],
      },
      { type: "h2", text: "What to do, in order" },
      {
        type: "steps",
        items: [
          { title: "Check your email, including spam", text: "For a confirmation link or a document request." },
          { title: "Check the status in the cashier and the statement", text: "Note the reference and the time." },
          { title: "Wait the stated processing time", text: "For your method, in working days." },
          { title: "Contact Deriv's live chat", text: "Give the reference, amount, method and date." },
          { title: "If Deriv shows it as sent, contact your bank", text: "With the same details." },
        ],
      },
      { type: "h2", text: "What not to do" },
      {
        type: "list",
        items: [
          "Do not cancel and resubmit repeatedly. It can restart the process.",
          "Do not pay anyone a fee to release it. Nobody genuine charges one.",
          "Do not share your login with a helper who promises to speed it up.",
        ],
      },
      { type: "h2", text: "FXNOD cannot see or move it" },
      {
        type: "p",
        text: "A withdrawal from a Deriv account is handled entirely by Deriv. FXNOD has no access to your Deriv cashier and cannot check, approve or speed up a Deriv withdrawal.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "How long does a Deriv withdrawal take?",
        a: "Deriv lists times by method, from instant to one working day on its side. Your bank or provider can add more.",
      },
      {
        q: "Can I cancel a pending Deriv withdrawal?",
        a: "Check the cashier for the option, or ask live chat. Cancelling and resubmitting can add delay.",
      },
      {
        q: "Why was my Deriv withdrawal rejected?",
        a: "Usually unverified details, a payment account not in your name, or a method mismatch. Deriv's message or live chat gives the reason.",
      },
    ],
    related: ["deriv-deposits-and-withdrawals-time", "deriv-account-verification"],
  },

  {
    slug: "deriv-mt5-vs-deriv-trader",
    title: "Deriv MT5 vs Deriv Trader: which should you use?",
    description:
      "Deriv Trader is for options with a fixed stake. Deriv MT5 is for leveraged CFDs. How they differ in risk, cost, tools and who each suits.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "Deriv Trader and Deriv MT5 are for different products. Deriv Trader is Deriv's platform for options, where you pay a stake and cannot lose more than it. Deriv MT5 is MetaTrader 5 for CFDs, where positions are leveraged and losses grow with the price move. Beginners usually find Deriv Trader simpler. MT5 suits traders who want full charting and CFD trading.",
    body: [
      { type: "h2", text: "Side by side" },
      {
        type: "table",
        head: ["", "Deriv Trader", "Deriv MT5"],
        rows: [
          ["Product", "Options and multipliers", "CFDs"],
          ["What you risk per trade", "A fixed stake", "Depends on lot size, leverage and stop"],
          ["Leverage", "None in the usual sense", "Yes"],
          ["Costs", "Built into the payout", "Spread, commission on some accounts, swaps"],
          ["Runs in", "A browser and Deriv's app", "The MT5 terminal, web or app"],
          ["Automation", "Deriv Bot, and third-party tools through Deriv's API", "Expert advisors"],
          ["Password", "Your Deriv login", "A separate MT5 password"],
          ["Learning curve", "Low", "High"],
        ],
      },
      { type: "h2", text: "What each is good at" },
      {
        type: "list",
        items: [
          "Deriv Trader: short contracts, digit trades, a known maximum loss on every trade.",
          "Deriv MT5: holding positions for hours or days, advanced charting, custom indicators and expert advisors.",
        ],
      },
      { type: "h2", text: "The risk difference in one example" },
      {
        type: "p",
        text: "On Deriv Trader, a Rise/Fall contract with a stake of 5 can lose 5 and no more. On MT5, a position sized carelessly on a volatile index can lose many times that before you react, because the loss follows the price with leverage. The same account balance lasts very differently on the two.",
      },
      { type: "h2", text: "Accounts and funding" },
      {
        type: "p",
        text: "An MT5 account sits under your Deriv login but has its own balance and password. Money is transferred between your Deriv Wallet or account and the MT5 account. Deriv's terms note that an MT5 demo may be deleted after 30 days of inactivity and that a dormant real MT5 account can be restricted.",
      },
      { type: "h2", text: "Which should you start with?" },
      {
        type: "table",
        head: ["If you", "Start with"],
        rows: [
          ["Have never traded", "Deriv Trader, on demo"],
          ["Want to automate short contracts", "An options bot tool, on demo"],
          ["Want forex or CFDs with charting", "MT5 on demo, after learning position sizing"],
          ["Do not yet understand margin", "Not MT5"],
        ],
      },
      { type: "h2", text: "Where FXNOD fits" },
      {
        type: "p",
        text: "FXNOD's dTrader, dBot and Auto Hub trade options and multipliers on your Deriv account, the same kind of products as Deriv Trader. FXNOD does not connect to Deriv MT5 and does not trade CFDs.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is Deriv MT5 better than Deriv Trader?",
        a: "They do different jobs. MT5 is for leveraged CFDs with full charting; Deriv Trader is for options with a fixed stake.",
      },
      {
        q: "Can I use the same balance on both?",
        a: "The MT5 account has its own balance. You transfer funds between it and your Deriv account.",
      },
      {
        q: "Does FXNOD work with MT5?",
        a: "No. FXNOD trades options and multipliers on a Deriv account and does not connect to MT5.",
      },
    ],
    related: ["which-deriv-platform-is-easiest", "options-vs-cfds"],
  },

  {
    slug: "deriv-demo-account-explained",
    title: "Deriv demo account: how to open, reset and use it well",
    description:
      "Every Deriv login has a free demo account with virtual funds. How to switch to it, reset the balance, and practise in a way that prepares you.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "A Deriv demo account is a free practice account with virtual funds that comes with every Deriv login. You switch between demo and real inside your account, with no separate registration. Deriv's community guidance gives the default demo balance as 10,000 USD and describes a reset option. Demo profits are not real and cannot be withdrawn.",
    body: [
      { type: "h2", text: "Getting one" },
      {
        type: "steps",
        items: [
          { title: "Create a Deriv account", text: "Deriv says this is free and needs no deposit." },
          { title: "Switch to the demo account", text: "Deriv's app page says you can switch between real and demo from the home screen." },
          { title: "For MT5, add a demo MT5 account", text: "It is separate, with its own login details." },
        ],
      },
      { type: "h2", text: "The balance" },
      {
        type: "table",
        head: ["Account", "What Deriv's guidance says"],
        rows: [
          ["Options demo", "Starts at 10,000 USD by default; a Reset balance option is shown with the balance"],
          ["MT5 demo", "Starts at 10,000; a top-up is available when the balance is low"],
        ],
      },
      {
        type: "p",
        text: "Regional pages give the figures in local currency, and the exact reset rule has varied. The button in your own account is the authority.",
      },
      { type: "h2", text: "Using it well" },
      {
        type: "list",
        items: [
          "Trade the stake you would really use, not what a 10,000 balance invites.",
          "Decide your real deposit, and end the test when the demo has lost that amount.",
          "Do not reset the balance to erase a bad run. The bad run is the lesson.",
          "Record every session: win rate, average win and loss, worst drawdown.",
        ],
      },
      { type: "h2", text: "What a demo teaches and what it cannot" },
      {
        type: "table",
        head: ["Teaches", "Cannot teach"],
        rows: [
          ["How each contract settles", "How you behave when the loss is real"],
          ["How a platform and its orders work", "Deposits, withdrawals and verification"],
          ["Whether a bot follows its rules", "Whether a short winning run will last"],
        ],
      },
      { type: "h2", text: "The demo in FXNOD" },
      {
        type: "p",
        text: "When you connect a Deriv login to FXNOD, its demo account is listed with the real ones and labelled as virtual funds. Select it and every manual trade and bot uses Deriv's virtual money. A bot keeps trading the account it was started on, so one started on demo stays on demo.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Is the Deriv demo account free?",
        a: "Yes. It uses virtual funds and needs no deposit.",
      },
      {
        q: "How do I reset my Deriv demo balance?",
        a: "Deriv's community guidance describes a Reset balance option shown with the demo balance. MT5 demo accounts have a top-up instead.",
      },
      {
        q: "Does the Deriv demo account expire?",
        a: "Deriv says its MT5 demo is not time-limited, though its terms allow deletion of an MT5 demo after 30 days of inactivity.",
      },
    ],
    related: ["deriv-demo-vs-real-account", "can-you-use-deriv-without-depositing"],
  },

  {
    slug: "deriv-demo-vs-real-account",
    title: "Deriv demo vs real account: what is actually different",
    description:
      "Demo and real Deriv accounts use the same platforms and contracts. The differences are the money, verification, payments and, most of all, you.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "A Deriv demo account and a real account use the same platforms and the same kinds of contract. The differences are that demo money is virtual, a real account needs deposits and verification, and results on demo cannot be withdrawn. The largest difference is behaviour: people trade a real balance with fear and impatience that a demo never produces.",
    body: [
      { type: "h2", text: "Side by side" },
      {
        type: "table",
        head: ["", "Demo", "Real"],
        rows: [
          ["Money", "Virtual", "Your deposit"],
          ["Balance", "A large default", "Whatever you fund"],
          ["Verification", "Not needed to practise", "Needed for full access"],
          ["Deposits and withdrawals", "None", "Through the cashier"],
          ["Profits", "Not real", "Withdrawable"],
          ["Emotion", "Low", "High"],
        ],
      },
      { type: "h2", text: "Why results differ" },
      {
        type: "list",
        items: [
          "Balance: a 10,000 demo absorbs losses a real 50 cannot. Stake sizing that felt safe is not.",
          "Sample: a short demo run may not have included a losing stretch.",
          "Behaviour: on real money people cut winners early, chase losses and interfere with bots.",
          "Selection: most people go live straight after their best demo session.",
        ],
      },
      { type: "h2", text: "Is the demo easier on purpose?" },
      {
        type: "p",
        text: "This suspicion is common. It can be tested: run the same settings and stake for a few hundred trades on each account and compare win rates. If they are within normal variation of each other, the explanation is one of the four above. Those four account for nearly every case.",
      },
      { type: "h2", text: "Moving from one to the other" },
      {
        type: "steps",
        items: [
          { title: "Make the demo realistic", text: "Real stake, and stop when it has lost your intended deposit." },
          { title: "Collect several hundred trades", text: "Across different sessions." },
          { title: "Verify the real account early", text: "Before you need to withdraw." },
          { title: "Go live at the minimum stake", text: "With the same rules and a daily loss limit." },
          { title: "Compare the first hundred live trades with the demo record", text: "Stop if they differ sharply." },
        ],
      },
      { type: "h2", text: "In FXNOD" },
      {
        type: "p",
        text: "FXNOD lists your demo and real Deriv accounts together and asks you to confirm when you select a real one. A bot follows the same rules on both and stays on the account it was started on. Starting a bot with real money is a separate, clearly labelled action, and the first real run needs Deriv's approval for automated trading.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Are Deriv demo and real prices the same?",
        a: "The platforms and contracts are the same. If you doubt it, compare a few hundred identical trades on each account.",
      },
      {
        q: "Why do I win on demo and lose on real?",
        a: "Usually a smaller real balance, a demo test that was too short, and behaving differently with real money.",
      },
      {
        q: "Can I transfer demo money to a real account?",
        a: "No. Demo funds are virtual and have no cash value.",
      },
    ],
    related: ["deriv-demo-account-explained", "bot-works-on-demo-but-not-real"],
  },

  {
    slug: "is-deriv-halal",
    title: "Is trading on Deriv halal or haram?",
    description:
      "No single ruling exists. The questions scholars ask about interest, uncertainty and gambling, how each Deriv product meets them, and who to consult.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-2.jpg",
    answer:
      "There is no single ruling, and this guide does not give one. Scholars judge a trading product on three questions: whether it involves interest, excessive uncertainty, or gambling. Deriv's products differ on each. Deriv offers swap-free MT5 accounts, which address interest only. Many scholars consider short-term fixed-payout options impermissible. Ask a qualified scholar about your own case.",
    body: [
      { type: "h2", text: "The three questions" },
      {
        type: "table",
        head: ["Concept", "Meaning", "Where it arises in trading"],
        rows: [
          ["Riba", "Interest", "Overnight swap charges on leveraged positions"],
          ["Gharar", "Excessive uncertainty or ambiguity in a contract", "Contracts on outcomes with no underlying exchange"],
          ["Maysir", "Gambling: gain from pure chance at another's loss", "Bets on short-term price outcomes"],
        ],
      },
      { type: "h2", text: "How the products are commonly viewed" },
      {
        type: "table",
        head: ["Product", "The issue usually raised"],
        rows: [
          ["CFDs with swaps", "Interest on positions held overnight; leverage and the absence of real ownership"],
          ["Swap-free CFD accounts", "Remove the swap; questions about fees, leverage and ownership remain"],
          ["Fixed-payout options", "Widely regarded by scholars as resembling a wager on an outcome"],
          ["Contracts on synthetic indices", "No real asset underlies them, which many scholars treat as a further problem"],
        ],
      },
      {
        type: "p",
        text: "This table reports the concerns that are generally raised. It is not a ruling, and opinions differ between scholars and schools.",
      },
      { type: "h2", text: "What Deriv offers" },
      {
        type: "p",
        text: "Deriv describes swap-free MT5 accounts on which positions can be held overnight without swap charges on selected assets, and says an administration fee may apply to positions kept open beyond a five-day grace period. Some scholars object to such fees as interest by another name. Deriv's material does not label an account as Islamic in the pages read for this guide, and a swap-free account is not a certificate of permissibility.",
      },
      { type: "h2", text: "Questions to take to a scholar" },
      {
        type: "list",
        items: [
          "Which exact product do I intend to trade, and how does it settle?",
          "Is anything real being bought or sold, or is it a contract on a price?",
          "Is there leverage, and is any charge linked to time?",
          "Is the outcome determined by analysis and ownership, or by chance?",
          "Does using a bot change the ruling? It automates the same contract, so usually not.",
        ],
      },
      { type: "h2", text: "Who to ask" },
      {
        type: "p",
        text: "A qualified scholar who understands financial contracts, shown the actual product terms. Be cautious of rulings from the broker, from an affiliate who earns from your trading, or from a video channel selling a course.",
      },
      { type: "h2", text: "FXNOD's position" },
      {
        type: "p",
        text: "FXNOD is a software tool and gives no religious ruling. Its tools trade options and multipliers on a Deriv account. Whether those are permissible for you is a matter for you and a scholar you trust.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Does Deriv have an Islamic account?",
        a: "Deriv describes swap-free MT5 accounts, which remove overnight swap charges on selected assets. That addresses interest only.",
      },
      {
        q: "Are binary-style options halal?",
        a: "Many scholars consider short-term fixed-payout options impermissible because they resemble a wager. Consult a qualified scholar.",
      },
      {
        q: "Is using a trading bot halal?",
        a: "A bot automates the placing of a contract. The ruling follows the contract being traded, not the automation.",
      },
    ],
    related: ["is-trading-gambling", "options-vs-cfds"],
  },

  {
    slug: "do-you-pay-tax-on-trading",
    title: "Do you pay tax on trading profits?",
    description:
      "In most countries, yes. How trading profits are usually classified, what records to keep, and why the answer depends on where you live.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-3.jpg",
    answer:
      "In most countries trading profits are taxable, but how depends entirely on where you are resident: as capital gains, as income, as business profit, or in some places as gambling winnings that are not taxed. An offshore broker does not change your obligation at home. Keep complete records and ask a qualified tax adviser in your country.",
    body: [
      { type: "h2", text: "How profits are usually classified" },
      {
        type: "table",
        head: ["Classification", "Typical treatment", "Tends to apply when"],
        rows: [
          ["Capital gains", "Taxed on net gains, often with an allowance", "Occasional trading of assets"],
          ["Income", "Taxed at your income tax rates", "Frequent trading, or derivatives in some countries"],
          ["Business profit", "Taxed as a trade, with expenses deductible", "Trading is your main, organised activity"],
          ["Gambling or betting", "Sometimes not taxed", "Certain products in certain countries only"],
        ],
      },
      {
        type: "p",
        text: "The same activity can fall into different rows in different countries, and sometimes in the same country depending on scale. This is why general answers online are unreliable.",
      },
      { type: "h2", text: "Things that are true almost everywhere" },
      {
        type: "list",
        items: [
          "Tax follows your residence, not the broker's location.",
          "It is usually the net result for the tax year that matters, after losses.",
          "Withdrawing or not withdrawing rarely changes whether a profit is taxable.",
          "Crypto used for deposits can create its own taxable events.",
          "Brokers may report to tax authorities under international information-sharing rules.",
        ],
      },
      { type: "h2", text: "Records to keep" },
      {
        type: "list",
        items: [
          "Every statement from your broker, for each account.",
          "Deposits and withdrawals, with dates and amounts in your home currency.",
          "Fees, and any costs directly related to trading.",
          "A yearly summary of net profit or loss.",
        ],
      },
      { type: "h2", text: "Losses" },
      {
        type: "p",
        text: "In many systems trading losses can be set against gains, and sometimes carried forward. In systems that treat an activity as gambling, losses usually cannot be claimed. Ask before assuming either.",
      },
      { type: "h2", text: "With a bot" },
      {
        type: "p",
        text: "Automation does not change the tax position. A bot can produce thousands of trades, which makes good records more important: download statements regularly instead of reconstructing a year at the end.",
      },
      { type: "h2", text: "Where to find your trades" },
      {
        type: "p",
        text: "Your broker's statement is the complete record. On Deriv that is the Statement in the Reports section. FXNOD shows the trades made through FXNOD, and trades it places are on your Deriv account and so appear in Deriv's records too. FXNOD does not give tax advice or file anything for you.",
      },
      RISK_NOTE,
    ],
    faq: [
      {
        q: "Do I pay tax if I trade with an offshore broker?",
        a: "Your obligation is set by where you are tax resident, not by where the broker is.",
      },
      {
        q: "Do I pay tax if I do not withdraw?",
        a: "In most systems tax is due on the profit made in the year, whether or not it was withdrawn. Check your own rules.",
      },
      {
        q: "Can I deduct trading losses?",
        a: "Often against trading gains, depending on how your country classifies the activity. An adviser can confirm.",
      },
    ],
    related: ["check-deriv-transaction-and-trading-history", "are-trading-bots-legal"],
  },

  {
    slug: "deriv-affiliate-program-explained",
    title: "Deriv affiliate programme: how it works and what to know",
    description:
      "Deriv pays partners for referred clients' trading through revenue share, turnover and other plans. How the plans work and what a partner must disclose.",
    tag: TAG,
    published: DATE,
    updated: DATE,
    image: "/assets/login-slide-1.jpg",
    answer:
      "Deriv's partner programme pays people who refer new clients. Deriv describes several plans, including revenue share on options, commission on turnover, and payouts on CFD volume, paid monthly. The published rates differ between Deriv's own pages, so the figure that applies is the one in your partner dashboard. A partner earns from the trading of the people they refer.",
    body: [
      { type: "h2", text: "The plans Deriv describes" },
      {
        type: "table",
        head: ["Plan", "Paid on", "What Deriv's pages say"],
        rows: [
          ["Revenue share", "Net revenue from referred clients' options trades", "A percentage, quoted differently on different Deriv pages"],
          ["Turnover", "Each contract a referred client buys", "Up to 1.5% per contract"],
          ["CFD commission", "Trading volume on CFDs", "A payout per amount of turnover on selected instruments"],
          ["CPA", "A referred client's first deposits", "A fixed amount, for EU accounts only"],
          ["Partner referrals", "Partners you introduce", "A further percentage"],
        ],
      },
      {
        type: "p",
        text: "Deriv's partner material says revenue share is calculated on net revenue, that commissions are paid monthly, and that tier bonuses apply. Confirm every rate in the partner dashboard before planning around it.",
      },
      { type: "h2", text: "What a partner should understand" },
      {
        type: "list",
        items: [
          "Revenue share is a share of what referred clients lose, net. Your income rises when they lose and falls when they win.",
          "Turnover commission is paid on activity, win or lose, so it rewards volume.",
          "Either way, the partner's interest and the client's are not the same.",
        ],
      },
      { type: "h2", text: "Promoting responsibly" },
      {
        type: "list",
        items: [
          "Say plainly that you earn from referrals.",
          "Never promise profits or show selected screenshots as typical results.",
          "Do not give a bot or signals as a hook without explaining the risk.",
          "Do not manage clients' accounts or take their logins.",
          "Follow the advertising rules of the countries you promote in, and Deriv's partner terms.",
        ],
      },
      { type: "h2", text: "If you are on the other side" },
      {
        type: "p",
        text: "When someone recommends a broker, a bot or a strategy with a sign-up link, they are very likely a partner. That does not make their advice wrong. It does mean their income does not depend on your results, and may improve when you trade more. Judge the advice on whether you can test it on a demo account.",
      },
      { type: "h2", text: "FXNOD's partner programme is separate" },
      {
        type: "p",
        text: "FXNOD has its own partner programme, described on its Partner page. It is run by FXNOD, has its own terms, and is not part of Deriv's partner programme.",
      },
      SOURCE_NOTE,
      RISK_NOTE,
    ],
    faq: [
      {
        q: "How much does the Deriv affiliate programme pay?",
        a: "Deriv's pages quote different rates for different plans and dates. The rate in your own partner dashboard is the one that applies.",
      },
      {
        q: "When are Deriv partner commissions paid?",
        a: "Deriv's partner material says monthly.",
      },
      {
        q: "Is the FXNOD partner programme the same as Deriv's?",
        a: "No. It is a separate programme run by FXNOD with its own terms.",
      },
    ],
    related: ["free-deriv-bots", "how-to-identify-trading-scams"],
  },
];
