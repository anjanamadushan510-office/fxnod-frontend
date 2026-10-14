import type { BotStrategy } from "@/services/api/model";

export type ConditionKind = "last_digit" | "digit_streak" | "digit_frequency" | "price_streak" | "result_streak";
export interface EntryCondition {
  kind: ConditionKind;
  operator: string;
  value: number;
  count: number;
  window: number;
  percent: number;
}
export interface EntryConditions {
  match: "all" | "any";
  rules: EntryCondition[];
  cooldown_seconds: number;
}
export const CONDITION_KINDS: { value: ConditionKind; label: string }[] = [
  { value: "last_digit", label: "Latest digit" },
  { value: "digit_streak", label: "Digit streak" },
  { value: "digit_frequency", label: "Digit frequency" },
  { value: "price_streak", label: "Price movement streak" },
  { value: "result_streak", label: "Trade result streak" },
];
export const CONDITION_OPERATORS: Record<ConditionKind, { value: string; label: string }[]> = {
  last_digit: [
    { value: "eq", label: "Equals" }, { value: "ne", label: "Does not equal" },
    { value: "gt", label: "Greater than" }, { value: "lt", label: "Less than" },
    { value: "even", label: "Is even" }, { value: "odd", label: "Is odd" },
  ],
  digit_streak: [
    { value: "eq", label: "Equals" }, { value: "ne", label: "Does not equal" },
    { value: "gt", label: "Greater than" }, { value: "lt", label: "Less than" },
    { value: "even", label: "Is even" }, { value: "odd", label: "Is odd" },
  ],
  digit_frequency: [{ value: "gt", label: "Above (%)" }, { value: "lt", label: "Below (%)" }],
  price_streak: [{ value: "up", label: "Moves up" }, { value: "down", label: "Moves down" }],
  result_streak: [{ value: "win", label: "Wins" }, { value: "loss", label: "Losses" }],
};
export function newCondition(kind: ConditionKind = "digit_streak"): EntryCondition {
  return { kind, operator: CONDITION_OPERATORS[kind][0].value, value: 5, count: kind === "result_streak" ? 1 : 3, window: 100, percent: 15 };
}
export function supportsConditions(strategy: BotStrategy | undefined): boolean {
  const properties = (strategy?.parameters as { properties?: Record<string, unknown> } | undefined)?.properties;
  return Boolean(properties?.entry_conditions);
}
export function conditionProblems(input: unknown): string[] {
  if (input === undefined) return [];
  if (!input || typeof input !== "object") return ["Entry conditions are invalid. Rebuild this strategy."];
  const c = input as EntryConditions;
  if (!["all", "any"].includes(c.match) || !Array.isArray(c.rules) || c.rules.length < 1 || c.rules.length > 8) {
    return ["Choose All or Any and add between 1 and 8 entry conditions."];
  }
  const problems: string[] = [];
  const resultRules = c.rules.filter((r) => r?.kind === "result_streak").length;
  if ((c.match === "all" && resultRules > 0) || resultRules === c.rules.length) problems.push("Trade result rules need Any plus a market condition so the bot can place its first trade.");
  if (!Number.isInteger(c.cooldown_seconds) || c.cooldown_seconds < 0 || c.cooldown_seconds > 3600) problems.push("Wait after a trade must be 0–3600 seconds.");
  c.rules.forEach((r, i) => {
    const label = `Condition ${i + 1}`;
    if (!r || !CONDITION_OPERATORS[r.kind]?.some((o) => o.value === r.operator)) { problems.push(`${label}: choose a valid condition and comparison.`); return; }
    if (!Number.isInteger(r.value) || r.value < 0 || r.value > 9) problems.push(`${label}: digit must be 0–9.`);
    if (!Number.isInteger(r.count) || r.count < 1 || r.count > 50) problems.push(`${label}: streak must be 1–50.`);
    if (!Number.isInteger(r.window) || r.window < 20 || r.window > 200) problems.push(`${label}: sample must be 20–200 ticks.`);
    if (!Number.isFinite(r.percent) || r.percent < 0 || r.percent > 100) problems.push(`${label}: percentage must be 0–100.`);
  });
  return problems;
}
export function conditionLabel(r: EntryCondition): string {
  const comparison = CONDITION_OPERATORS[r.kind].find((o) => o.value === r.operator)?.label.toLowerCase() ?? r.operator;
  switch (r.kind) {
    case "last_digit": return `Latest digit ${comparison}${["even", "odd"].includes(r.operator) ? "" : ` ${r.value}`}`;
    case "digit_streak": return `${r.count} consecutive digits ${comparison}${["even", "odd"].includes(r.operator) ? "" : ` ${r.value}`}`;
    case "digit_frequency": return `Digit ${r.value} ${r.operator === "gt" ? "above" : "below"} ${r.percent}% of the last ${r.window} ticks`;
    case "price_streak": return `${r.count} consecutive ${r.operator === "up" ? "rising" : "falling"} price moves`;
    case "result_streak": return `${r.count} consecutive ${r.operator === "win" ? "wins" : "losses"} on this market`;
  }
}
export function conditionsSummary(c: EntryConditions | undefined): string {
  if (!c) return "No extra entry conditions";
  return c.rules.map(conditionLabel).join(c.match === "all" ? " AND " : " OR ") +
    (c.cooldown_seconds ? ` · wait ${c.cooldown_seconds}s after settlement` : "");
}
