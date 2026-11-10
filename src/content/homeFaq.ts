/**
 * The landing page's questions. One list feeds both the visible FAQ and the
 * FAQPage structured data, so the two cannot say different things.
 *
 * Every answer here is a public statement about what the product does today.
 * Change it in the same commit that changes the product.
 */
export const HOME_FAQ: { q: string; a: string }[] = [
  {
    q: "What is FXNOD?",
    a: "FXNOD is a web trading terminal for Deriv accounts. It has three tools: Trade Pilot for placing trades by hand, Bot Forge for building your own bot without code, and Auto Hub for starting a ready-made bot. FXNOD is an independent product and is not affiliated with Deriv.",
  },
  {
    q: "How do I get started?",
    a: "Create an FXNOD account with your email and confirm it with the code FXNOD emails you; your 7-day Pro trial of all three tools starts at once. Then connect your Deriv account from Connected Accounts. You sign in on Deriv's own page, so FXNOD never sees your Deriv password. Start on your Deriv demo account to try every tool with virtual funds.",
  },
  {
    q: "Is FXNOD free?",
    a: "Every new account gets 7 days of Pro access to all three tools at no cost. After that, each tool needs a package, bought in Discover and paid from your FXNOD Wallet. Discover shows current prices, features and access periods.",
  },
  {
    q: "How do I pay for FXNOD?",
    a: "Top up your FXNOD Wallet with USDT on TRC-20 (Tron) or BEP-20 (BNB Smart Chain): open Wallet, press Top up and send USDT on that network to the address shown. It is credited automatically once the network confirms it. Then buy a package in Discover. A package is one payment and never renews by itself.",
  },
  {
    q: "What is the difference between Bot Forge and Auto Hub?",
    a: "In Bot Forge you design the bot: what it buys, when it enters, how it sizes each stake and when it stops. In Auto Hub the strategy is already built by FXNOD, and you choose a market and one of its fixed plans.",
  },
  {
    q: "Does FXNOD work with Binance or Bybit?",
    a: "Not yet. Deriv is the only venue that is live. Tools for Bybit and Binance are planned and are marked coming soon.",
  },
  {
    q: "Can I send FXNOD Wallet funds to Deriv?",
    a: "Not yet; transfers to Deriv are coming soon. The FXNOD Wallet is topped up with USDT and pays for tool packages. Every trade uses the balance in your own Deriv account.",
  },
  {
    q: "Can a trading bot guarantee a profit?",
    a: "No. A bot follows its rules without getting tired or emotional, and that is all it does. It can lose every trade it places. Set a stop loss, test on a demo account first, and only trade money you can afford to lose.",
  },
];
