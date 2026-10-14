import { GitBranch, ShieldCheck, Zap } from "lucide-react";
import type { BotDraft } from "./draft";
import { durationLabel, sideLabel } from "./draft";
import { conditionsSummary } from "./conditions";
import { ENTRY_RULES, findMethod } from "./catalog";

export function StrategyOverview({ draft }: { draft: BotDraft }) {
  const rows = [
    { icon: GitBranch, title: "WHEN", value: draft.entryConditions ? conditionsSummary(draft.entryConditions) : "Each new tick, when the selected buy rule allows" },
    { icon: Zap, title: "BUY", value: [findMethod(draft.method)?.name, sideLabel(draft), durationLabel(draft), ENTRY_RULES.find((r) => r.key === draft.entryRule)?.name].filter(Boolean).join(" · ") },
    { icon: ShieldCheck, title: "PROTECT", value: `Stake $${draft.form.stake || "—"} · stop at loss $${draft.form.sessionStopLoss || "—"}${draft.form.sessionTargetProfit ? ` or profit $${draft.form.sessionTargetProfit}` : ""}${draft.form.maxTrades ? ` · ${draft.form.maxTrades} trades maximum` : ""}` },
  ];
  return <section aria-label="Your strategy at a glance" className="mb-6 rounded-2xl border border-line bg-surface p-4 sm:p-5">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <h1 className="font-display text-lg font-semibold text-ink">{draft.name || "Build your trading bot"}</h1>
      <span className="rounded-full border border-line px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-ink-3">Strategy preview</span>
    </div>
    <div className="grid gap-4 xl:grid-cols-3">{rows.map(({ icon: Icon, title, value }) => <div key={title} className="flex items-start gap-3 min-w-0">
      <Icon size={17} className="mt-0.5 shrink-0 text-gold" />
      <div><span className="text-[10px] font-semibold tracking-widest text-ink-3">{title}</span><p className="mt-1 text-xs leading-relaxed text-ink-2 break-words">{value}</p></div>
    </div>)}</div>
  </section>;
}
