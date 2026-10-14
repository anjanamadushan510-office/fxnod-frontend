"use client";

import { Plus, Trash2, SlidersHorizontal } from "lucide-react";
import type { BotStrategy } from "@/services/api/model";
import { CONDITION_KINDS, CONDITION_OPERATORS, conditionLabel, conditionProblems, newCondition, supportsConditions, type ConditionKind, type EntryCondition, type EntryConditions } from "./conditions";
import { TextField } from "./controls";

const selectStyle = "h-11 w-full rounded-lg border border-line bg-surface-2 px-3 text-sm text-ink outline-none focus:border-ink-3";

export function ConditionBuilder({ value, onChange, strategy }: {
  value: EntryConditions | undefined;
  onChange: (value: EntryConditions | undefined) => void;
  strategy: BotStrategy | undefined;
}) {
  const supported = supportsConditions(strategy);
  const problems = conditionProblems(value);
  function update(index: number, patch: Partial<EntryCondition>) {
    if (value) onChange({ ...value, rules: value.rules.map((r, i) => i === index ? { ...r, ...patch } : r) });
  }
  return <section className="mt-8 rounded-2xl border border-line bg-surface p-4 sm:p-6 space-y-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="flex items-center gap-2 font-display font-semibold text-ink"><SlidersHorizontal size={18} className="text-gold" /> Your entry conditions</h3>
        <p className="mt-1 text-sm text-ink-3">Decide when the bot may trade. The buy rule above decides which side it takes.</p>
      </div>
      <button type="button" role="switch" aria-label="Use custom entry conditions" aria-checked={Boolean(value)} disabled={!supported && !value}
        onClick={() => onChange(value ? undefined : { match: "all", rules: [newCondition()], cooldown_seconds: 0 })}
        className="shrink-0 rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-ink disabled:opacity-50">{value ? "Enabled" : "Add conditions"}</button>
    </div>
    {!supported && <p role="status" className="text-sm text-ink-3">Custom conditions will be available when the trading engine has been updated.</p>}
    {value && <>
      <fieldset className="flex flex-wrap items-center gap-2">
        <legend className="mb-2 text-xs text-ink-3">Open a trade when</legend>
        {(["all", "any"] as const).map((match) => <button key={match} type="button" aria-pressed={value.match === match} onClick={() => onChange({ ...value, match })}
          className={`rounded-lg border px-4 py-2 text-sm ${value.match === match ? "bg-action border-action-line text-action-ink" : "border-line text-ink-2"}`}>{match === "all" ? "All conditions match" : "Any condition matches"}</button>)}
      </fieldset>
      <div className="space-y-3">
        {value.rules.map((r, i) => <div key={i} className="rounded-xl border border-line bg-bg p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-3">{i === 0 ? "IF" : value.match === "all" ? "AND" : "OR"} · Condition {i + 1}</span>
            <button type="button" aria-label={`Remove condition ${i + 1}`} disabled={value.rules.length === 1} onClick={() => onChange({ ...value, rules: value.rules.filter((_, n) => n !== i) })}
              className="rounded p-2 text-ink-3 hover:text-negative disabled:opacity-30"><Trash2 size={16} /></button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block"><span className="mb-1.5 block text-xs text-ink-3">Observe</span>
              <select aria-label={`Condition ${i + 1} type`} value={r.kind} onChange={(e) => update(i, newCondition(e.target.value as ConditionKind))} className={selectStyle}>
                {CONDITION_KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
              </select>
            </label>
            <label className="block"><span className="mb-1.5 block text-xs text-ink-3">Comparison</span>
              <select aria-label={`Condition ${i + 1} comparison`} value={r.operator} onChange={(e) => update(i, { operator: e.target.value })} className={selectStyle}>
                {CONDITION_OPERATORS[r.kind].map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
            {["last_digit", "digit_streak", "digit_frequency"].includes(r.kind) && !["even", "odd"].includes(r.operator) && <TextField label={`Condition ${i + 1} digit (0–9)`} kind="integer" value={Number.isNaN(r.value) ? "" : String(r.value)} onChange={(s) => update(i, { value: s.trim() === "" ? NaN : Number(s) })} />}
            {["digit_streak", "price_streak", "result_streak"].includes(r.kind) && <TextField label={`Condition ${i + 1} streak length (1–50)`} kind="integer" value={Number.isNaN(r.count) ? "" : String(r.count)} onChange={(s) => update(i, { count: s.trim() === "" ? NaN : Number(s) })} />}
            {r.kind === "digit_frequency" && <>
              <TextField label={`Condition ${i + 1} sample (20–200 ticks)`} kind="integer" value={Number.isNaN(r.window) ? "" : String(r.window)} onChange={(s) => update(i, { window: s.trim() === "" ? NaN : Number(s) })} />
              <TextField label={`Condition ${i + 1} percentage (0–100)`} value={Number.isNaN(r.percent) ? "" : String(r.percent)} onChange={(s) => update(i, { percent: s.trim() === "" ? NaN : Number(s) })} />
            </>}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-3">{conditionLabel(r)}</p>
        </div>)}
      </div>
      <button type="button" disabled={value.rules.length >= 8} onClick={() => onChange({ ...value, rules: [...value.rules, newCondition("last_digit")] })}
        className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm text-ink hover:bg-surface-2 disabled:opacity-40"><Plus size={16} />Add condition <span className="text-ink-3">{value.rules.length}/8</span></button>
      <div className="max-w-sm"><TextField label="Wait after a trade (seconds)" kind="integer" value={Number.isNaN(value.cooldown_seconds) ? "" : String(value.cooldown_seconds)} onChange={(s) => onChange({ ...value, cooldown_seconds: s.trim() === "" ? NaN : Number(s) })} hint="Per market, after its last trade settles. 0 means no extra wait." /></div>
      {problems.length > 0 && <ul role="alert" className="space-y-1 text-sm text-negative-soft">{problems.map((p) => <li key={p}>{p}</li>)}</ul>}
      <p className="text-xs leading-relaxed text-ink-3">Conditions are checked on each new tick, separately for each market. Frequency rules wait for the full sample. Result rules need earlier trades in this run; avoid using them alone to trigger the first trade. Past patterns do not guarantee the next result.</p>
    </>}
  </section>;
}
