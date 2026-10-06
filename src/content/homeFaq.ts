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
    a: "FXNOD is a web trading terminal for Deriv accounts. It has three tools: dTrader for placing trades by hand, dBot for building your own bot without code, and Auto Hub for starting a ready-made bot. FXNOD is an independent product and is not affiliated with Deriv.",
  },
  {
    q: "How do I get started?",
    a: "Create an FXNOD account with your email, then connect your Deriv account from Connected Accounts. You sign in on Deriv's own page, so FXNOD never sees your Deriv password. Start on your Deriv demo account to try every tool with virtual funds.",
  },
  {
    q: "Is FXNOD free?",
    a: "Yes. There is no subscription for dTrader, dBot or Auto Hub. FXNOD is paid through a markup that is included in the price of the contracts its bots buy on real accounts. Demo trades carry no markup.",
  },
  {
    q: "What is the difference between dBot and Auto Hub?",
    a: "In dBot you design the bot: what it buys, when it enters, how it sizes each stake and when it stops. In Auto Hub the strategy is already built by FXNOD, and you only choose markets, a stake, a stop loss and a take profit.",
  },
  {
    q: "Does FXNOD work with Binance or Bybit?",
    a: "Not yet. Deriv is the only venue that is live. Tools for Bybit and Binance are planned and are marked coming soon.",
  },
  {
    q: "Can I send FXNOD Wallet funds to Deriv?",
    a: "Not yet. Wallet top-ups and transfers to Deriv are coming soon. Today every trade uses the balance in your own Deriv account.",
  },
  {
    q: "Can a trading bot guarantee a profit?",
    a: "No. A bot follows its rules without getting tired or emotional, and that is all it does. It can lose every trade it places. Set a stop loss, test on a demo account first, and only trade money you can afford to lose.",
  },
];
