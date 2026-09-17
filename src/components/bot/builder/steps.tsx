"use client";

import { useEffect, useMemo, useState } from "react";
import { useMarketStore } from "@/components/options/market/marketStore";
import type { Market } from "@/components/options/market/catalog";
import { useContractsFor } from "@/hooks/useContractsFor";
import { useMarketsForStrategy } from "@/hooks/useMarketsForStrategy";
import type { BotIndicator, BotLimits, BotStrategy } from "@/services/api/model";
import { GROWTH_RATES, MULTIPLIER_STEPS, formShapeFor } from "../botMeta";
import type { BotFormState } from "../formState";
import { getGroupKey, getGroupLabel } from "../marketGroups";
import {
  ENTRY_RULES,
  INDICATOR_OPTIONS,
  METHOD_GROUPS,
  MONEY_OPTIONS,
  findIndicatorOption,
  findMethod,
  isDirectionalIndicator,
  isMethodAvailable,
  supportedEntryRules,
  supportsAutoDirection,
} from "./catalog";
import {
  ChoiceCard,
  GroupLabel,
  InfoPanel,
  PillPicker,
  StepHeader,
  TextField,
} from "./controls";
import {
  NAME_MAX_LENGTH,
  durationLabel,
  sideLabel,
  strategyIdFor,
  withMethod,
  type BotDraft,
} from "./draft";

/** Mirrors the engine's MaxRunSymbols; the engine refuses more either way. */
export const MAX_MARKETS = 10;

interface StepProps {
  draft: BotDraft;
  onChange: (draft: BotDraft) => void;
}

function patchForm(draft: BotDraft, patch: Partial<BotFormState>): BotDraft {
  return { ...draft, form: { ...draft.form, ...patch } };
}

// ─── Method ──────────────────────────────────────────────────────────────

export function MethodStep({
  draft,
  onChange,
  strategies,
  loading,
}: StepProps & { strategies: readonly BotStrategy[]; loading: boolean }) {
  return (
    <div className="w-full">
      <StepHeader
        title="Trading method"
        subtitle={
          loading
            ? "Loading the bots available to you…"
            : "Pick how this bot should trade. Markets come next."
        }
      />
      {METHOD_GROUPS.map((group) => (
        <section key={group.label} className="mb-8 last:mb-0">
          <GroupLabel>{group.label}</GroupLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {group.methods.map((method) => {
              const available = isMethodAvailable(method, strategies);
              return (
                <ChoiceCard
                  key={method.key}
                  title={method.name}
                  description={method.description}
                  badge={available || loading ? undefined : "Coming soon"}
                  active={draft.method === method.key}
                  disabled={!available}
                  onSelect={() => onChange(withMethod(draft, method.key))}
                />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

// ─── Markets ─────────────────────────────────────────────────────────────

export function MarketsStep({ draft, onChange }: StepProps) {
  const strategyId = strategyIdFor(draft) ?? "";
  const { markets: allowedIds, loading, source } = useMarketsForStrategy(strategyId);
  const allMarkets = useMarketStore((s) => s.allMarkets);
  const selected = draft.form.symbols;

  // Drop selections this method cannot trade — a Rise / Fall market carried over
  // after switching to a digit method would be refused at start. Only once the
  // live list has answered: the static fallback is a guess, not a verdict.
  useEffect(() => {
    if (loading || source === "fallback" || source === "initial") return;
    const allowed = new Set(allowedIds);
    const kept = selected.filter((s) => allowed.has(s));
    if (kept.length !== selected.length) onChange(patchForm(draft, { symbols: kept }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, source, allowedIds, strategyId]);

  const groups = useMemo(() => {
    const byId = new Map(allMarkets.map((m) => [m.id, m]));
    const grouped = new Map<string, { label: string; markets: Market[] }>();
    for (const id of allowedIds) {
      const market: Market = byId.get(id) ?? {
        id,
        name: id,
        seedPrice: 0,
        category: "derived",
      };
      if (market.closed) continue;
      const key = getGroupKey(market);
      if (!grouped.has(key)) grouped.set(key, { label: getGroupLabel(key), markets: [] });
      grouped.get(key)!.markets.push(market);
    }
    return [...grouped.values()];
  }, [allMarkets, allowedIds]);

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(patchForm(draft, { symbols: selected.filter((s) => s !== id) }));
    } else if (selected.length < MAX_MARKETS) {
      onChange(patchForm(draft, { symbols: [...selected, id] }));
    }
  }

  const full = selected.length >= MAX_MARKETS;

  return (
    <div className="w-full">
      <StepHeader
        title="Markets"
        subtitle={
          loading
            ? "Loading the markets this method trades on…"
            : `${selected.length} selected · tap to add or remove · up to ${MAX_MARKETS}`
        }
      />

      {selected.length > 1 && (
        <section className="mb-8">
          <GroupLabel>With several markets</GroupLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <ChoiceCard
              size="sm"
              title="All at once"
              description="Each market trades on its own, at the same time. Session caps still cover them all."
              active={draft.form.scanType === "PARALLEL"}
              onSelect={() => onChange(patchForm(draft, { scanType: "PARALLEL" }))}
            />
            <ChoiceCard
              size="sm"
              title="One after another"
              description="One open trade at a time, moving through the markets in turn."
              active={draft.form.scanType === "LINEAR"}
              onSelect={() => onChange(patchForm(draft, { scanType: "LINEAR" }))}
            />
          </div>
        </section>
      )}

      {groups.map((group) => (
        <section key={group.label} className="mb-8 last:mb-0">
          <GroupLabel>{group.label}</GroupLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {group.markets.map((market) => {
              const active = selected.includes(market.id);
              return (
                <ChoiceCard
                  key={market.id}
                  size="sm"
                  title={market.name}
                  description={market.id}
                  active={active}
                  disabled={!active && full}
                  onSelect={() => toggle(market.id)}
                />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

// ─── Duration (non-digit bots) ──────────────────────────────────────────────

const DURATION_PRESETS: Array<{ unit: string; name: string; description: string; values: string[] }> = [
  { unit: "t", name: "Ticks", description: "Each new price print.", values: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] },
  { unit: "s", name: "Seconds", description: "Wall-clock seconds.", values: ["15", "30", "45", "60", "90", "120", "180", "300"] },
  { unit: "m", name: "Minutes", description: "Wall-clock minutes.", values: ["1", "2", "3", "5", "10", "15", "30", "60"] },
  { unit: "h", name: "Hours", description: "Wall-clock hours.", values: ["1", "2", "3", "4", "8", "12", "24"] },
];

export function DurationStep({ draft, onChange }: StepProps) {
  const { form } = draft;
  const method = findMethod(draft.method);
  const current = DURATION_PRESETS.find((p) => p.unit === form.durationUnit) ?? DURATION_PRESETS[0];

  return (
    <div className="w-full">
      <StepHeader title="Duration" subtitle={`How long each ${method?.name ?? ""} contract lasts.`} />

      <GroupLabel>Unit</GroupLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {DURATION_PRESETS.map((preset) => (
          <ChoiceCard
            key={preset.unit}
            size="sm"
            title={preset.name}
            description={preset.description}
            active={current.unit === preset.unit}
            onSelect={() =>
              onChange(patchForm(draft, { durationUnit: preset.unit, duration: preset.values[0] }))
            }
          />
        ))}
      </div>

      <PillPicker
        label={current.name}
        options={current.values}
        value={current.values.includes(form.duration) ? form.duration : ""}
        onChange={(duration) => onChange(patchForm(draft, { duration, durationUnit: current.unit }))}
      />

      <div className="mt-8 max-w-md">
        <InfoPanel title="Each contract">
          <span className="text-white font-medium">{durationLabel(draft) ?? "—"}</span>
          <span className="block mt-1">
            Deriv sets the shortest and longest length per market; a length it does not offer is
            refused when the bot opens its first contract.
          </span>
        </InfoPanel>
      </div>
    </div>
  );
}

// ─── Indicators (non-digit bots) ────────────────────────────────────────────

type IndicatorNumberField = Exclude<keyof BotIndicator, "kind">;

const INDICATOR_FIELDS: Record<string, Array<{ field: IndicatorNumberField; label: string; integer: boolean }>> = {
  rsi: [
    { field: "period", label: "Period", integer: true },
    { field: "oversold", label: "Oversold below", integer: false },
    { field: "overbought", label: "Overbought above", integer: false },
  ],
  sma: [{ field: "period", label: "Period", integer: true }],
  ema: [{ field: "period", label: "Period", integer: true }],
  macd: [
    { field: "fast", label: "Fast", integer: true },
    { field: "slow", label: "Slow", integer: true },
    { field: "signal", label: "Signal", integer: true },
  ],
  bb: [
    { field: "period", label: "Period", integer: true },
    { field: "std_devs", label: "Band width (std devs)", integer: false },
  ],
  stoch: [
    { field: "k_period", label: "%K period", integer: true },
    { field: "oversold", label: "Oversold below", integer: false },
    { field: "overbought", label: "Overbought above", integer: false },
  ],
  atr: [{ field: "period", label: "Period", integer: true }],
};

const WHOLE = /^\d+$/;
const DECIMAL = /^\d+(\.\d+)?$/;

/**
 * A numeric input that keeps what the user typed while it is mid-edit ("1.",
 * "") and only reports a value once it parses. The engine validates ranges.
 */
function NumberField({
  label,
  value,
  integer,
  onChange,
}: {
  label: string;
  value: number | undefined;
  integer: boolean;
  onChange: (value: number) => void;
}) {
  const [text, setText] = useState(value === undefined ? "" : String(value));
  return (
    <TextField
      kind={integer ? "integer" : "decimal"}
      label={label}
      value={text}
      onChange={(next) => {
        setText(next);
        const trimmed = next.trim();
        if (integer ? WHOLE.test(trimmed) : DECIMAL.test(trimmed)) {
          onChange(integer ? Number.parseInt(trimmed, 10) : Number.parseFloat(trimmed));
        }
      }}
    />
  );
}

export function IndicatorsStep({
  draft,
  onChange,
  strategy,
}: StepProps & { strategy: BotStrategy | undefined }) {
  const strategyId = strategyIdFor(draft) ?? "";
  const configured = draft.indicators;
  const autoCapable = supportsAutoDirection(strategy);

  function toggle(kind: string) {
    const option = findIndicatorOption(kind);
    if (!option) return;
    onChange({
      ...draft,
      indicators: configured.some((i) => i.kind === kind)
        ? configured.filter((i) => i.kind !== kind)
        : [...configured, { ...option.defaults }],
    });
  }

  function update(kind: string, field: IndicatorNumberField, value: number) {
    onChange({
      ...draft,
      indicators: configured.map((i) => (i.kind === kind ? { ...i, [field]: value } : i)),
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start w-full">
      <div className="lg:col-span-8 2xl:col-span-9">
        <StepHeader
          title="Indicators"
          subtitle="Optional. Add signals the bot should read, or continue without any."
        />

        {configured.length === 0 ? (
          <div className="bg-panel border border-line rounded-2xl p-8 mb-8 text-center">
            <p className="text-sm text-zinc-500">No indicators yet. The bot can still trade without them.</p>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {configured.map((indicator) => {
              const option = findIndicatorOption(indicator.kind);
              return (
                <div key={indicator.kind} className="bg-panel border border-line rounded-2xl p-5">
                  <div className="flex justify-between items-start mb-4 gap-3">
                    <div>
                      <h3 className="font-display font-semibold text-white">{option?.name ?? indicator.kind}</h3>
                      <p className="text-xs text-zinc-500 mt-1">{option?.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggle(indicator.kind)}
                      className="text-xs text-zinc-500 hover:text-white transition"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(INDICATOR_FIELDS[indicator.kind] ?? []).map(({ field, label, integer }) => (
                      <NumberField
                        key={field}
                        label={label}
                        integer={integer}
                        value={indicator[field]}
                        onChange={(value) => update(indicator.kind, field, value)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <GroupLabel>Add indicator</GroupLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {INDICATOR_OPTIONS.map((option) => (
            <ChoiceCard
              key={option.kind}
              size="sm"
              title={option.name}
              description={option.description}
              active={configured.some((i) => i.kind === option.kind)}
              onSelect={() => toggle(option.kind)}
            />
          ))}
        </div>
      </div>

      <div className="lg:col-span-4 2xl:col-span-3 lg:sticky lg:top-4">
        <InfoPanel title="What they do">
          {strategyId === "accumulator"
            ? "The bot opens a contract only while every indicator reads the market as calm, so price is more likely to stay inside the band."
            : autoCapable
              ? "Indicators pick the side only when Setup is set to “Let indicators decide”. With a fixed side they are sent with the run but do not change what the bot buys."
              : "This bot does not act on indicators."}
        </InfoPanel>
      </div>
    </div>
  );
}

// ─── Setup ──────────────────────────────────────────────────────────────────

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
// Deriv refuses Over 9 and Under 0 — nothing can be strictly beyond them.
const OVER_BARRIERS = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;
const UNDER_BARRIERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const TICK_DURATIONS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] as const;

const SIDE_HINTS: Record<string, [string, string]> = {
  rise_fall: ["Price ends higher than it started", "Price ends lower than it started"],
  higher_lower: ["Price ends above the target", "Price ends below the target"],
  touch_no_touch: ["Price touches the target before the end", "Price never touches the target"],
  even_odd: ["0, 2, 4, 6 or 8", "1, 3, 5, 7 or 9"],
  over_under: ["Last digit is strictly higher", "Last digit is strictly lower"],
  multiplier: ["Profit when price goes up", "Profit when price goes down"],
};

export function SetupStep({
  draft,
  onChange,
  strategy,
}: StepProps & { strategy: BotStrategy | undefined }) {
  const strategyId = strategyIdFor(draft) ?? "";
  const method = findMethod(draft.method);
  const shape = formShapeFor(strategyId);
  const { form } = draft;
  const isDigit = ["even_odd", "over_under", "matches_differs"].includes(strategyId);

  const { params } = useContractsFor(form.symbols[0] ?? "");
  const multipliers = params.multiplierRange.length > 0 ? params.multiplierRange : [...MULTIPLIER_STEPS];
  const growthRates = params.growthRateRange.length > 0 ? params.growthRateRange : [...GROWTH_RATES];

  const set = (patch: Partial<BotFormState>) => onChange(patchForm(draft, patch));

  // An Under barrier of 0 is not a contract; move it rather than let it fail.
  useEffect(() => {
    if (strategyId === "over_under" && form.direction === "down" && form.barrierDigit === 0) {
      set({ barrierDigit: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategyId, form.direction, form.barrierDigit]);

  const hints = SIDE_HINTS[strategyId];
  const canAuto = supportsAutoDirection(strategy) && draft.indicators.some(isDirectionalIndicator);

  // Removing the last directional indicator leaves "auto" with nothing to follow.
  useEffect(() => {
    if (form.direction === "auto" && !canAuto && !isDigit) set({ direction: "up" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAuto]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start w-full">
      <div className="lg:col-span-8 2xl:col-span-9 space-y-8">
        <StepHeader
          title="What should it buy?"
          subtitle={
            isDigit
              ? "Digit contracts settle on a later tick — its last digit decides the trade."
              : "The shape of every contract this bot opens."
          }
        />

        {shape.sideLabels && !method?.fixedDirection && (
          <div className={`grid grid-cols-1 gap-3 sm:gap-4 ${canAuto ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {(["up", "down"] as const).map((side, i) => (
              <ChoiceCard
                key={side}
                title={shape.sideLabels![i]}
                description={hints?.[i]}
                active={form.direction === side}
                onSelect={() => set({ direction: side })}
              />
            ))}
            {canAuto && (
              <ChoiceCard
                title="Let indicators decide"
                description="Each trade takes the side your indicators agree on, and waits when they do not."
                active={form.direction === "auto"}
                onSelect={() => set({ direction: "auto" })}
              />
            )}
          </div>
        )}

        {shape.digit && (
          <PillPicker
            label={method?.fixedDirection === "down" ? "Win unless the last digit is" : "Win if the last digit is"}
            options={DIGITS}
            value={form.digit}
            onChange={(digit) => set({ digit, autoDigit: false })}
          />
        )}

        {shape.barrierDigit && (
          <PillPicker
            label={form.direction === "down" ? "Last digit under" : "Last digit over"}
            options={form.direction === "down" ? UNDER_BARRIERS : OVER_BARRIERS}
            value={form.barrierDigit}
            onChange={(barrierDigit) => set({ barrierDigit })}
          />
        )}

        {shape.barrierOffset && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PillPicker
              label="Target"
              options={["above", "below"] as const}
              value={form.barrierAbove ? "above" : "below"}
              onChange={(v) => set({ barrierAbove: v === "above" })}
              format={(v) => (v === "above" ? "Above spot" : "Below spot")}
            />
            <TextField
              label="Distance from spot"
              value={form.barrierOffset}
              onChange={(barrierOffset) => set({ barrierOffset })}
              hint="In price points, measured from the price when each contract opens."
            />
          </div>
        )}

        {shape.growthRate && (
          <PillPicker
            label="Growth per tick"
            options={growthRates}
            value={form.growthRate}
            onChange={(growthRate) => set({ growthRate })}
            format={(v) => `${v}%`}
          />
        )}

        {shape.multiplier && (
          <PillPicker
            label="Multiplier"
            options={multipliers}
            value={form.multiplier}
            onChange={(multiplier) => set({ multiplier })}
            format={(v) => `×${v}`}
          />
        )}

        {shape.duration && isDigit && (
          <PillPicker
            label="Contract length (ticks)"
            options={TICK_DURATIONS}
            value={(TICK_DURATIONS as readonly string[]).includes(form.duration) ? form.duration : "1"}
            onChange={(duration) => set({ duration, durationUnit: "t" })}
          />
        )}

        {(shape.takeProfit || shape.perTradeStopLoss) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {shape.takeProfit && (
              <TextField
                label="Close each contract at profit ($)"
                value={form.takeProfit}
                onChange={(takeProfit) => set({ takeProfit })}
                placeholder="Optional"
              />
            )}
            {shape.perTradeStopLoss && (
              <TextField
                label="Close each contract at loss ($)"
                value={form.perTradeStopLoss}
                onChange={(perTradeStopLoss) => set({ perTradeStopLoss })}
                placeholder="Optional"
              />
            )}
          </div>
        )}
      </div>

      <div className="lg:col-span-4 2xl:col-span-3 lg:sticky lg:top-4">
        <InfoPanel title="Good to know">
          {isDigit
            ? "Payouts for digit contracts are set by Deriv per contract and shown on every trade. Matches pays more because it wins less often; Differs the reverse."
            : strategyId === "accumulator"
              ? "An accumulator ends the moment price leaves its band, and the stake is lost. A per-contract profit target closes it before that can happen."
              : strategyId === "multiplier"
                ? "A multiplier contract can never lose more than its stake. It stays open until a per-contract limit closes it, so set at least one."
                : "The payout for each contract is quoted by Deriv when it opens and recorded with the trade."}
        </InfoPanel>
      </div>
    </div>
  );
}

// ─── When to buy ─────────────────────────────────────────────────────────

export function EntryRuleStep({
  draft,
  onChange,
  strategy,
}: StepProps & { strategy: BotStrategy | undefined }) {
  const supported = supportedEntryRules(strategy);
  return (
    <div className="w-full">
      <StepHeader
        title="When to buy"
        subtitle="The rule the bot checks before every contract."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {ENTRY_RULES.map((rule) => {
          const available = supported.has(rule.key);
          return (
            <ChoiceCard
              key={rule.key}
              title={rule.name}
              description={rule.description}
              badge={available ? undefined : "Coming soon"}
              active={draft.entryRule === rule.key}
              disabled={!available}
              onSelect={() => onChange({ ...draft, entryRule: rule.key })}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Money ───────────────────────────────────────────────────────────────

export function MoneyStep({
  draft,
  onChange,
  limits,
}: StepProps & { limits: BotLimits | undefined }) {
  const { form } = draft;
  const set = (patch: Partial<BotFormState>) => onChange(patchForm(draft, patch));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start w-full">
      <div className="lg:col-span-8 2xl:col-span-9 space-y-8">
        <StepHeader title="Money" subtitle="How much each trade risks, and when the whole session stops." />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            label="Starting stake ($)"
            value={form.stake}
            onChange={(stake) => set({ stake })}
            hint={limits?.max_stake_per_trade ? `Platform limit: $${limits.max_stake_per_trade} per trade` : undefined}
          />
          <TextField
            label="Stop when loss hits ($)"
            value={form.sessionStopLoss}
            onChange={(sessionStopLoss) => set({ sessionStopLoss })}
            hint={limits?.max_session_loss ? `Required. Platform limit: $${limits.max_session_loss}` : "Required."}
          />
          <TextField
            label="Stop when profit hits ($)"
            value={form.sessionTargetProfit}
            onChange={(sessionTargetProfit) => set({ sessionTargetProfit })}
            placeholder="Optional"
          />
          <TextField
            kind="integer"
            label="Max trades this run"
            value={form.maxTrades}
            onChange={(maxTrades) => set({ maxTrades })}
            placeholder="Optional"
            hint={limits?.max_trades_per_session ? `Platform limit: ${limits.max_trades_per_session}` : undefined}
          />
        </div>

        <section>
          <GroupLabel>After each trade</GroupLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {MONEY_OPTIONS.map((option) => (
              <ChoiceCard
                key={option.key}
                title={option.name}
                badge={option.available ? option.badge : "Coming soon"}
                description={option.description}
                active={draft.money === option.key}
                disabled={!option.available}
                onSelect={() => onChange({ ...draft, money: option.key })}
              />
            ))}
          </div>
        </section>

        {draft.money === "martingale" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Multiply the stake by"
              value={form.martingaleMultiplier}
              onChange={(martingaleMultiplier) => set({ martingaleMultiplier })}
              hint={limits?.max_martingale_multiplier ? `Platform limit: ×${limits.max_martingale_multiplier}` : undefined}
            />
            <TextField
              kind="integer"
              label="Losses in a row before the bot stops"
              value={form.martingaleMaxSteps}
              onChange={(martingaleMaxSteps) => set({ martingaleMaxSteps })}
              hint={limits?.max_martingale_steps ? `Platform limit: ${limits.max_martingale_steps}` : undefined}
            />
          </div>
        )}
      </div>

      <div className="lg:col-span-4 2xl:col-span-3 lg:sticky lg:top-4 space-y-4">
        <InfoPanel title="Why these caps">
          The loss cap is required. It is enforced on the server, so the bot stops
          at it even if this page is closed.
        </InfoPanel>
        {limits?.max_account_session_loss && (
          <InfoPanel title="Across all your bots">
            Running bots together can lose at most ${limits.max_account_session_loss} in
            total, whatever each one&apos;s own cap says.
          </InfoPanel>
        )}
      </div>
    </div>
  );
}

// ─── Review ──────────────────────────────────────────────────────────────

export function ReviewStep({
  draft,
  onChange,
  marketNames,
  problems,
  children,
}: StepProps & {
  marketNames: string[];
  problems: string[];
  /** The save / run panel, rendered beside the summary. */
  children: React.ReactNode;
}) {
  const method = findMethod(draft.method);
  const rule = ENTRY_RULES.find((r) => r.key === draft.entryRule);
  const money = MONEY_OPTIONS.find((m) => m.key === draft.money);
  const side = sideLabel(draft);
  const duration = durationLabel(draft);
  const { form } = draft;

  const rows: Array<[string, string]> = [
    ["Markets", marketNames.length ? marketNames.join(", ") : "None selected"],
    ["Trade type", [method?.name, side && side !== method?.name ? side : undefined].filter(Boolean).join(" · ")],
    ...(duration ? [["Contract length", duration] as [string, string]] : []),
    ["When to buy", rule?.name ?? "—"],
    [
      "Money",
      `${money?.name ?? "—"} · stake $${form.stake || "?"}` +
        (draft.money === "martingale" ? ` · ×${form.martingaleMultiplier}, up to ${form.martingaleMaxSteps} losses` : ""),
    ],
    [
      "Stops at",
      [
        `loss $${form.sessionStopLoss || "?"}`,
        form.sessionTargetProfit.trim() && `profit $${form.sessionTargetProfit}`,
        form.maxTrades.trim() && `${form.maxTrades} trades`,
      ]
        .filter(Boolean)
        .join(" · "),
    ],
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      <div className="lg:col-span-8 2xl:col-span-9 space-y-4">
        <StepHeader title="Review" />
        <TextField
          kind="text"
          label="Bot name"
          value={draft.name}
          maxLength={NAME_MAX_LENGTH}
          onChange={(name) => onChange({ ...draft, name })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rows.map(([label, value]) => (
            <div key={label} className="bg-panel border border-line rounded-xl p-4">
              <span className="text-xs text-zinc-500 block mb-1 uppercase tracking-wider font-medium">{label}</span>
              <span className="text-sm font-medium text-white break-words">{value}</span>
            </div>
          ))}
        </div>

        {problems.length > 0 && (
          <div role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-4">
            <p className="text-sm font-medium text-red-300 mb-2">Before this bot can be saved</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-red-200/90">
              {problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="lg:col-span-4 2xl:col-span-3 lg:sticky lg:top-4">{children}</div>
    </div>
  );
}
