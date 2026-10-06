export type ToolKind = "free" | "paid";

export interface FxnodTool {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  kind: ToolKind;
  /** Where the tool opens, once it has been activated. */
  href?: string;
  price?: string;
  /**
   * Text-only compatibility labels. Never an exchange logo: the badge is
   * our own wording so the marketplace stays clear of trademark marks.
   */
  badges: string[];
}

/** Every tool FXNOD ships. The Tools page is the catalogue; Subscriptions only lists the active ones. */
export const FXNOD_TOOLS: FxnodTool[] = [
  {
    id: "dtrader",
    name: "dTrader",
    subtitle: "Deriv · Trade",
    description:
      "Trade synthetics and options on Deriv. Rise / Fall tickets from the FXNOD desk. Free — FXNOD earns a markup on the API.",
    icon: "/assets/fxnod-mark.png",
    kind: "free",
    href: "/options/dtrader",
    badges: ["Works with Deriv"],
  },
  {
    id: "dbot",
    name: "dBot",
    subtitle: "Deriv · Bot",
    description:
      "Build a Deriv options bot in plain language. Ready-made starts if you are new — no Blockly. Free — FXNOD earns a markup on the API.",
    icon: "/assets/fxnod-mark.png",
    kind: "free",
    href: "/dbot",
    badges: ["Works with Deriv"],
  },
  {
    id: "autohub",
    name: "Auto Hub",
    subtitle: "Deriv · Ready-made bots",
    description:
      "Bots built by FXNOD. Pick one, set your stake and limits, and start it. Nothing to build. Free — FXNOD earns a markup on the API.",
    icon: "/assets/fxnod-mark.png",
    kind: "free",
    href: "/autohub",
    badges: ["Works with Deriv"],
  },
  {
    id: "bybit-flow",
    name: "Bybit flow",
    subtitle: "Bybit · Trade",
    description: "Perpetual flow tools on Bybit. Monthly from the wallet, on your own API keys.",
    icon: "/assets/fxnod-mark.png",
    kind: "paid",
    price: "$19.00 / mo",
    badges: ["API: Bybit"],
  },
  {
    id: "binance-grid",
    name: "Binance grid",
    subtitle: "Binance · Bot",
    description: "Spot and futures grid on Binance. Monthly from the wallet, on your own API keys.",
    icon: "/assets/fxnod-mark.png",
    kind: "paid",
    price: "$29.00 / mo",
    badges: ["API: Binance"],
  },
];

/** Free tools start active, matching the Tools page. Paid tools start off until Subscribe. */
export const DEFAULT_ACTIVE_TOOL_IDS = FXNOD_TOOLS.filter((tool) => tool.kind === "free").map((tool) => tool.id);

export function toolById(id: string): FxnodTool | undefined {
  return FXNOD_TOOLS.find((tool) => tool.id === id);
}
