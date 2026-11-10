/**
 * FXNOD's Terms of Use and Privacy Policy.
 *
 * Every statement here describes what the product does today, read from the
 * code on the date in `LEGAL_UPDATED`: what is stored (auth, trading, wallet
 * and referral services), the cookies the web app sets, and the outside
 * services that handle data. When the product changes in a way a section
 * describes, the section changes in the same commit and the date moves.
 *
 * Deliberately absent: percentages of the Deriv markup (they are set per
 * Deriv app and change; Anjana, 2026-11-11), and any statement that trading
 * through FXNOD is lawful in a given country.
 */
import { COMPANY_LEGAL_NAME, CONTACT_EMAIL } from "@/lib/site";

export const LEGAL_UPDATED = "11 November 2026";

export type LegalBlock = string | { list: string[] };

export interface LegalSection {
  id: string;
  title: string;
  blocks: LegalBlock[];
}

export interface LegalDoc {
  title: string;
  path: string;
  description: string;
  intro: string;
  sections: LegalSection[];
}

const CONTACT = `${COMPANY_LEGAL_NAME}, Sri Lanka. Email: ${CONTACT_EMAIL}.`;

export const TERMS: LegalDoc = {
  title: "Terms of Use",
  path: "/terms",
  description: `The terms for using FXNOD, operated by ${COMPANY_LEGAL_NAME}: accounts, Deriv connections, packages, the FXNOD Wallet, bots, the partner programme and liability.`,
  intro: `These terms are an agreement between you and ${COMPANY_LEGAL_NAME}, the company in Sri Lanka that operates FXNOD ("FXNOD", "we", "us"). They apply when you visit fxnod.com, create an account, or use Trade Pilot, Bot Forge, Auto Hub, the FXNOD Wallet or the partner programme. By creating an account you accept them. If you do not agree, do not use FXNOD.`,
  sections: [
    {
      id: "what-fxnod-is",
      title: "1. What FXNOD is, and what it is not",
      blocks: [
        "FXNOD is software. It lets you place trades by hand, build trading bots and run ready-made bots on your own Deriv account, through Deriv's API and with the permission you give on Deriv's own sign-in page.",
        {
          list: [
            "FXNOD is not a broker. Every contract is offered, bought, priced and settled by Deriv, under Deriv's own terms.",
            "FXNOD is independent. It is not owned by, operated by or affiliated with Deriv, Bybit or Binance.",
            "FXNOD does not hold your trading money. Your trading balance stays in your Deriv account.",
            "FXNOD does not give financial, investment, legal or tax advice. Guides, templates and ready-made bots are descriptions of rules, not recommendations to trade.",
          ],
        },
      ],
    },
    {
      id: "eligibility",
      title: "2. Who may use FXNOD",
      blocks: [
        {
          list: [
            "You must be at least 18 years old and able to enter a binding agreement.",
            "To trade, you need a Deriv account of your own that Deriv allows you to hold and use.",
            "You are responsible for making sure that trading, and using FXNOD, is lawful where you live. These products are restricted or prohibited in some countries. We may refuse or end access from any country.",
            "You may not use FXNOD if you are subject to sanctions, or on behalf of someone who is.",
          ],
        },
      ],
    },
    {
      id: "account",
      title: "3. Your FXNOD account",
      blocks: [
        {
          list: [
            "Give accurate details, and keep them up to date.",
            "One account per person. Do not share your sign-in details or let others use your account, except members you add to a team package.",
            "Keep your password secret. You are responsible for what happens in your account until you tell us it has been compromised. We recommend turning on the emailed sign-in code.",
            "Do not create extra accounts to obtain more free trials, offers or partner commission.",
          ],
        },
      ],
    },
    {
      id: "deriv",
      title: "4. Connecting your Deriv account",
      blocks: [
        "When you connect Deriv, you sign in on Deriv's page and authorise FXNOD to read your Deriv accounts and to place trades on them. FXNOD never sees your Deriv password.",
        {
          list: [
            "FXNOD places a trade only when you place it, or when a bot you started decides to place it under the settings you chose.",
            "Your use of Deriv is governed by your agreement with Deriv. Deriv may refuse, change or cancel a trade, limit your account, or change its products and prices, and FXNOD cannot override it.",
            "You can disconnect Deriv in FXNOD at any time, and you can also revoke FXNOD's access in your Deriv account settings. A bot cannot trade after access is removed.",
            "Demo accounts trade Deriv's virtual funds. Real accounts trade your money.",
          ],
        },
      ],
    },
    {
      id: "how-fxnod-is-paid",
      title: "5. How FXNOD is paid",
      blocks: [
        "FXNOD earns money in two ways:",
        {
          list: [
            "Packages. You pay for access to a tool, as described in section 6.",
            `A markup on some trades. FXNOD is registered with Deriv as an application. When a trade is placed through FXNOD on a real Deriv account, Deriv may add a markup to the price of the contract, and Deriv pays that markup to ${COMPANY_LEGAL_NAME}. The markup is part of the price Deriv quotes for the contract, so the price or payout you see before you buy already includes it. It differs between tools, may change, and is never charged on demo accounts.`,
          ],
        },
        "Partner commission (section 9) is paid out of what FXNOD earns, never added to your costs.",
      ],
    },
    {
      id: "packages",
      title: "6. Packages, prices and the FXNOD Wallet",
      blocks: [
        {
          list: [
            "Each tool needs an active package. Packages, their features, periods and prices are shown in Discover. The price you pay is the one on the confirmation screen.",
            "A package is one payment for its period (for example one month, six months or lifetime). It does not renew automatically. Lifetime means for as long as FXNOD offers that tool.",
            "New accounts may receive free trial access. A trial ends on the date shown in Active Tools and does not turn into a paid package.",
            "Buying the same package again adds its period to the time you have left. Moving to a higher package starts at once at its full price, and unused time on the lower one is not credited.",
            "We may change prices and packages. A change does not affect a package you have already bought.",
            "Payments are final. We do not refund packages, except where the law requires it, or where we could not provide a package you paid for because of a fault on our side.",
          ],
        },
        "The FXNOD Wallet holds US dollar value that you add by sending USDT. It is used to pay for FXNOD packages.",
        {
          list: [
            "Send only USDT, only on a network FXNOD offers for top-ups (currently TRC-20 on Tron and BEP-20 on BNB Smart Chain), and only to the deposit address FXNOD shows for your account. A transfer of another coin, on another network, or to another address cannot be credited and may be lost for good.",
            "A deposit is credited after the network has confirmed it. If one has not appeared, send us its transaction ID through the deposit screen.",
            "The FXNOD Wallet is not a bank account or a trading account, and it pays no interest. Its balance cannot at present be withdrawn or moved to Deriv.",
            "An account cannot be closed while its wallet holds a balance. Contact us if you want to close an account that does.",
            "We may reverse a credit made in error, and refuse or hold a deposit we reasonably suspect of fraud or of breaking the law.",
          ],
        },
      ],
    },
    {
      id: "bots-and-risk",
      title: "7. Trading, bots and risk",
      blocks: [
        "Trading options, multipliers and accumulators is high risk. You can lose all the money you stake, and a bot can lose it faster than you would by hand. Read the risk warning on fxnod.com before trading real money.",
        {
          list: [
            "You choose every setting of a bot, including its market, stake, stake plan, stop loss and profit target, and you are responsible for the result.",
            "A stop loss ends a run once the loss reaches it, but a trade already open at that moment still settles, so the final loss can be larger than the stop loss.",
            "A bot can stop, miss a trade or be delayed because of FXNOD, Deriv, your Deriv account, the market or the connection between them. Do not rely on a strategy that only works if it is never interrupted.",
            "Results on a demo account, in a guide, in a replay or in a bot's earlier sessions do not predict future results.",
          ],
        },
      ],
    },
    {
      id: "acceptable-use",
      title: "8. What you must not do",
      blocks: [
        {
          list: [
            "Break the law, or use FXNOD for fraud, money laundering or to trade for someone else without their authority.",
            "Try to get around a limit, a package, a trial rule or a security control, or access another person's account or data.",
            "Probe, overload, scrape or disrupt FXNOD, or copy, resell or reverse engineer it, except where the law allows this.",
            "Use FXNOD in a way that breaks Deriv's terms.",
          ],
        },
      ],
    },
    {
      id: "partners",
      title: "9. Partner programme",
      blocks: [
        "If you invite others, you may earn commission under the partner programme's rules and rates shown in your account. Commission is earned only on the activity the rules describe, and is paid to your FXNOD Wallet once FXNOD has been paid for the period it relates to. We may hold, cancel or reclaim commission linked to self-referral, duplicate accounts, fraud or a breach of these terms, and we may change the programme's rules and rates for the future.",
      ],
    },
    {
      id: "availability",
      title: "10. Availability and changes to FXNOD",
      blocks: [
        "We work to keep FXNOD running, but we do not promise that it will always be available, error-free or uninterrupted. We may carry out maintenance, and we may add, change or withdraw features. Features marked \"coming soon\" are not available until they are released.",
      ],
    },
    {
      id: "ip",
      title: "11. Intellectual property",
      blocks: [
        "FXNOD, its software, bots, guides and design belong to us or our licensors. We give you a personal, non-transferable right to use FXNOD under these terms. The strategies you build in Bot Forge are yours.",
      ],
    },
    {
      id: "liability",
      title: "12. Disclaimers and limits of liability",
      blocks: [
        "FXNOD is provided as it is and as available. As far as the law allows:",
        {
          list: [
            "We are not responsible for trading losses, for the outcome of any trade or bot, or for missed profits.",
            "We are not responsible for what Deriv, a blockchain network or another third party does or fails to do.",
            "We are not liable for indirect or consequential loss.",
            "Our total liability to you for any claim is limited to the amount you paid FXNOD for packages in the 12 months before the claim arose.",
          ],
        },
        "Nothing in these terms limits a liability that cannot be limited by law, or takes away a right you have as a consumer under the law that applies to you.",
      ],
    },
    {
      id: "suspension",
      title: "13. Suspension and closing an account",
      blocks: [
        "You can close your account from Settings, subject to section 6. We may suspend or close an account, stop a running bot, or refuse a deposit or a purchase if we reasonably believe the account breaks these terms or the law, puts other users or FXNOD at risk, or if we are required to. Where we can, we will tell you why. Sections 5, 6, 7, 11, 12 and 15 continue to apply after an account is closed.",
      ],
    },
    {
      id: "changes",
      title: "14. Changes to these terms",
      blocks: [
        "We may update these terms. The date at the top shows the latest version. If a change materially affects you, we will tell you by email or in the app before it applies. If you keep using FXNOD after a change applies, you accept the new terms.",
      ],
    },
    {
      id: "law",
      title: "15. Governing law and disputes",
      blocks: [
        "These terms are governed by the laws of Sri Lanka. The courts of Colombo, Sri Lanka, have jurisdiction over any dispute about them, without taking away any right you have to bring a claim in the courts of the country where you live. Please contact us first: most problems can be solved quickly.",
      ],
    },
    {
      id: "contact",
      title: "16. Contact",
      blocks: [CONTACT, "These terms are written in English. If they are translated, the English version applies."],
    },
  ],
};

export const PRIVACY: LegalDoc = {
  title: "Privacy Policy",
  path: "/privacy",
  description: `What personal data FXNOD collects, why, who handles it, how long it is kept and your rights. FXNOD is operated by ${COMPANY_LEGAL_NAME}, Sri Lanka.`,
  intro: `${COMPANY_LEGAL_NAME} ("FXNOD", "we", "us") operates fxnod.com and FXNOD's services and is the controller of the personal data described here. This policy explains what we collect, why, who handles it for us, how long we keep it and the choices you have. Deriv is a separate company: what Deriv does with your data is covered by Deriv's own privacy policy.`,
  sections: [
    {
      id: "what-we-collect",
      title: "1. What we collect",
      blocks: [
        "Data you give us:",
        {
          list: [
            "Account: your name, email address and password (stored only as a one-way hash).",
            "Profile, if you fill it in: phone number, first and last name, date of birth, country, street address, city and postal code.",
            "Identity documents, only if we ask you to verify your identity and you send them.",
            "Support requests: the topic, subject and message you send us, and our replies.",
            "Team packages: the email addresses of the members you add.",
          ],
        },
        "Data created when you use FXNOD:",
        {
          list: [
            "Deriv connection: the access Deriv gives FXNOD when you approve it, your Deriv account identifiers, account type (demo or real), currency and the balance Deriv reports. The access token, and the account holder name and client ID Deriv sends, are stored encrypted.",
            "Trading: the trades you or your bots place through FXNOD (market, contract type, stake, price, payout, result, times and the ticks that settled them), your bots, their settings and their runs.",
            "Wallet: your deposit addresses, the blockchain transactions sent to them (amounts, transaction IDs and the sending addresses, which are public on the blockchain), your balance, purchases and packages.",
            "Partner programme: who invited you, who you invited, and the commission earned and paid.",
            "Security and sessions: the IP address and browser of each sign-in session, sign-in codes, and records of security actions such as password changes.",
            "Server logs: requests to our servers, with IP address, time and the address requested, used to run and protect the service.",
            "Your preferences, such as which tools are active.",
          ],
        },
        "Analytics on fxnod.com: we use Google Analytics to count page views and actions such as signing up, viewing the dashboard, placing a trade or starting a bot. We send the kind of action and the market or bot involved, never your name, email, account number, stake or balance, and page addresses are sent without their query string. Advertising features of Google Analytics are turned off.",
      ],
    },
    {
      id: "why",
      title: "2. Why we use it, and on what basis",
      blocks: [
        {
          list: [
            "To provide FXNOD: create your account, connect Deriv, place trades and run bots on your instructions, process top-ups and packages, and pay partner commission. Basis: performing our contract with you.",
            "To keep FXNOD and its users secure: sign-in checks, emailed codes, preventing fraud and abuse, and keeping audit records. Basis: our legitimate interests, and legal obligations.",
            "To communicate with you: verification codes, security notices, replies to support requests and important service changes. Basis: our contract with you and our legitimate interests.",
            "To understand and improve FXNOD through analytics. Basis: our legitimate interests or, where the law requires it, your consent.",
            "To keep financial and account records and meet legal requests. Basis: legal obligations and our legitimate interests.",
          ],
        },
        "We do not sell your personal data, and we do not use it for advertising.",
      ],
    },
    {
      id: "sharing",
      title: "3. Who handles it",
      blocks: [
        "We share personal data only with the services that run FXNOD for us, under their data protection terms, and only what each needs:",
        {
          list: [
            "Deriv: receives the trades FXNOD places on your instruction, and the requests FXNOD makes to read your Deriv accounts.",
            "Contabo: servers that run FXNOD's services and databases.",
            "Vercel: hosts the fxnod.com website.",
            "Cloudflare: domain name service, sending our emails, and storing encrypted database backups.",
            "Google: Google Analytics, as described above.",
            "Zoho: our business mailbox, which receives the emails you send us.",
            "Blockchain data providers for Tron and BNB Smart Chain: FXNOD asks them about transfers to your deposit addresses. Blockchain data is public by nature.",
          ],
        },
        "We may also disclose data when the law requires it, to protect the rights and safety of users or FXNOD, or to a buyer of the business, who would be bound by this policy.",
      ],
    },
    {
      id: "transfers",
      title: "4. International transfers",
      blocks: [
        "FXNOD is operated from Sri Lanka, and the services above may store or process data in other countries, including the European Union and the United States. Where we transfer data, we rely on the safeguards those providers offer, such as standard contractual clauses.",
      ],
    },
    {
      id: "retention",
      title: "5. How long we keep it",
      blocks: [
        {
          list: [
            "While your account is open, we keep its data for as long as it is needed to provide FXNOD.",
            "Sign-in sessions end when they expire or are revoked. Sign-in codes are short-lived.",
            "Database backups are kept for 14 days.",
            "Financial records (trades, ledger entries, deposits, purchases and commission) are kept as permanent records, because they must not be altered and may be needed for audits and disputes.",
            "When you close your account, your personal details are removed from the live service and kept in a locked archive for 10 years, for legal, fraud-prevention and dispute purposes, after which they can be deleted.",
          ],
        },
      ],
    },
    {
      id: "security",
      title: "6. How we protect it",
      blocks: [
        "Passwords are stored as hashes, Deriv access tokens and identifiers are encrypted, connections use HTTPS, our services are not reachable from the internet except through one protected gateway, and staff access is limited and logged. No system is perfectly secure; if a breach affects your data, we will tell you and the authorities as the law requires.",
      ],
    },
    {
      id: "cookies",
      title: "7. Cookies and similar storage",
      blocks: [
        {
          list: [
            "A secure, HTTP-only sign-in cookie on FXNOD's API, which keeps you signed in. Essential.",
            "A small cookie on fxnod.com that only marks that a session exists, so signed-in pages open directly. Essential.",
            "Google Analytics cookies on fxnod.com, for the analytics described above.",
            "Storage in your browser for preferences such as panel sizes, favourite markets, chart settings and unsent bot drafts. It stays on your device.",
          ],
        },
        "You can block or delete cookies in your browser. Blocking the essential ones will sign you out.",
      ],
    },
    {
      id: "rights",
      title: "8. Your rights",
      blocks: [
        "Depending on where you live, including under Sri Lanka's Personal Data Protection Act and the EU and UK GDPR, you can ask us to:",
        {
          list: [
            "give you a copy of your personal data;",
            "correct data that is wrong or incomplete;",
            "delete your data, subject to the records we must keep (section 5);",
            "restrict or object to how we use it, including analytics;",
            "give you data you provided in a portable form;",
            "withdraw consent you have given, without affecting what was done before.",
          ],
        },
        `You can update most details in Settings and close your account there. For anything else, email ${CONTACT_EMAIL}. We may need to confirm your identity first, and we reply within the time the law sets. You can also complain to your data protection authority, which in Sri Lanka is the Data Protection Authority.`,
      ],
    },
    {
      id: "children",
      title: "9. Children",
      blocks: ["FXNOD is for people aged 18 or over. We do not knowingly collect data from children; if we learn we have, we delete it."],
    },
    {
      id: "changes",
      title: "10. Changes to this policy",
      blocks: [
        "We may update this policy. The date at the top shows the latest version, and we will tell you by email or in the app about a change that materially affects you.",
      ],
    },
    {
      id: "contact",
      title: "11. Contact",
      blocks: [CONTACT],
    },
  ],
};
