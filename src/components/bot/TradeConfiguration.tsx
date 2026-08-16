"use client";

import { cn } from "@/lib/cn";
import { ArrowDownIcon, ArrowUpIcon, CaretDownIcon, InfoIcon } from "@/components/ui/Icons";
import { findMarket } from "@/components/options/market/catalog";
import { BOT_MARKET_IDS, MULTIPLIER_STEPS } from "./catalog";
import { SectionHeading } from "./SelectBot";
import type { BotConfig } from "./types";

interface TradeConfigurationProps {
  config: BotConfig;
  onChange: (patch: Partial<BotConfig>) => void;
  /** Locked while a run is in progress — parameters are snapshotted at start. */
  disabled?: boolean;
}

/**
 * The pre-run configuration panel.
 *
 * Session Stop Loss is presented as a toggle to match the agreed design, but
 * note the backend treats a stop loss as MANDATORY: `risk.Limits` has no
 * "disabled" representation, and a start request without one is rejected. When
 * this is wired to `auto_start`, the toggle must either be removed or default
 * to on with a server-supplied floor — do not ship a path that starts a
 * real-money run with no loss bound.
 */
export function TradeConfiguration({
  config,
  onChange,
  disabled = false,
}: TradeConfigurationProps) {
  return (
    <section className="flex flex-col gap-3.5">
      <h2 className="m-0 text-[13px] font-bold tracking-[-0.01em] text-opt-ink">
        Trade Configuration
      </h2>

      <Field label="Market">
        <div className="relative">
          <select
            value={config.marketId}
            disabled={disabled}
            onChange={(e) => onChange({ marketId: e.target.value })}
            className={cn(inputBase, "appearance-none pr-8")}
          >
            {BOT_MARKET_IDS.map((id) => (
              <option key={id} value={id}>
                {findMarket(id)?.name ?? id}
              </option>
            ))}
          </select>
          <CaretDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-opt-ink-3" />
        </div>
      </Field>

      <Field label="Direction">
        <div className="grid grid-cols-2 gap-2">
          <DirectionButton
            side="up"
            active={config.direction === "up"}
            disabled={disabled}
            onClick={() => onChange({ direction: "up" })}
          />
          <DirectionButton
            side="down"
            active={config.direction === "down"}
            disabled={disabled}
            onClick={() => onChange({ direction: "down" })}
          />
        </div>
      </Field>

      <Field label="Multiplier">
        <div className="grid grid-cols-4 gap-2">
          {MULTIPLIER_STEPS.map((step) => (
            <button
              key={step}
              type="button"
              disabled={disabled}
              aria-pressed={config.multiplier === step}
              onClick={() => onChange({ multiplier: step })}
              className={cn(
                "rounded-[var(--opt-radius-sm)] border py-1.5 text-[12px] font-semibold tabular-nums",
                "transition-[background,border-color] duration-150 disabled:opacity-55",
                config.multiplier === step
                  ? "border-opt-rise bg-opt-rise-soft text-opt-rise"
                  : "border-opt-line bg-opt-bg-elev text-opt-ink-2 hover:border-opt-line-strong",
              )}
            >
              ×{step}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Stake">
        <div className="grid grid-cols-[84px_1fr] gap-2">
          <div className={cn(inputBase, "grid place-items-center text-opt-ink-2")}>
            {config.currency}
          </div>
          <NumberInput
            value={config.stake}
            disabled={disabled}
            onChange={(stake) => onChange({ stake })}
            ariaLabel="Stake amount"
          />
        </div>
      </Field>

      <InlineField label="Take Profit" suffix={config.currency}>
        <NumberInput
          value={config.takeProfit}
          disabled={disabled}
          onChange={(takeProfit) => onChange({ takeProfit })}
          ariaLabel="Take profit"
        />
      </InlineField>

      <ToggleRow
        label="Martingale"
        info
        checked={config.martingaleEnabled}
        disabled={disabled}
        onChange={(martingaleEnabled) => onChange({ martingaleEnabled })}
      />

      <ToggleRow
        label="Session Stop Loss"
        info
        checked={config.sessionStopLossEnabled}
        disabled={disabled}
        onChange={(sessionStopLossEnabled) => onChange({ sessionStopLossEnabled })}
      >
        <NumberInput
          value={config.sessionStopLoss}
          disabled={disabled || !config.sessionStopLossEnabled}
          onChange={(sessionStopLoss) => onChange({ sessionStopLoss })}
          ariaLabel="Session stop loss"
          suffix={config.currency}
        />
      </ToggleRow>

      <ToggleRow
        label="Session Target Profit"
        info
        checked={config.sessionTargetProfitEnabled}
        disabled={disabled}
        onChange={(sessionTargetProfitEnabled) =>
          onChange({ sessionTargetProfitEnabled })
        }
      >
        <NumberInput
          value={config.sessionTargetProfit}
          disabled={disabled || !config.sessionTargetProfitEnabled}
          onChange={(sessionTargetProfit) => onChange({ sessionTargetProfit })}
          ariaLabel="Session target profit"
          suffix={config.currency}
        />
      </ToggleRow>

      <div className="flex flex-col gap-2">
        <SectionHeading label="Indicators" />
        <button
          type="button"
          disabled={disabled}
          className={cn(
            inputBase,
            "flex items-center justify-between text-left text-opt-ink-2",
            "hover:border-opt-line-strong disabled:opacity-55",
          )}
        >
          <span className="truncate text-[12px]">
            Bollinger Bands (20, 2) · RSI (14)
          </span>
          <CaretDownIcon className="h-3.5 w-3.5 shrink-0 -rotate-90 text-opt-ink-3" />
        </button>
      </div>
    </section>
  );
}

const inputBase =
  "h-9 w-full rounded-[var(--opt-radius-sm)] border border-opt-line bg-opt-bg-elev px-2.5 text-[12px] text-opt-ink outline-none transition-colors focus:border-opt-line-strong disabled:opacity-55";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1 text-[11px] font-semibold text-opt-ink-2">
        <Dot />
        {label}
      </span>
      {children}
    </label>
  );
}

function InlineField({
  label,
  suffix,
  children,
}: {
  label: string;
  suffix: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid grid-cols-[1fr_120px] items-center gap-2">
      <span className="text-[11px] font-semibold text-opt-ink-2">{label}</span>
      <div className="flex items-center gap-1.5">
        {children}
        <span className="text-[11px] text-opt-ink-3">{suffix}</span>
      </div>
    </label>
  );
}

function ToggleRow({
  label,
  info,
  checked,
  disabled,
  onChange,
  children,
}: {
  label: string;
  info?: boolean;
  checked: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[1fr_120px] items-center gap-2">
      <span className="flex items-center gap-1 text-[11px] font-semibold text-opt-ink-2">
        {label}
        {info && <InfoIcon className="h-3 w-3 text-opt-ink-4" />}
      </span>
      <div className="flex items-center justify-end gap-2">
        {children}
        <Switch label={label} checked={checked} disabled={disabled} onChange={onChange} />
      </div>
    </div>
  );
}

function Switch({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full transition-colors duration-150 disabled:opacity-55",
        checked ? "bg-opt-rise" : "bg-opt-line-strong",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-[left] duration-150",
          checked ? "left-[18px]" : "left-0.5",
        )}
      />
    </button>
  );
}

function NumberInput({
  value,
  onChange,
  disabled,
  ariaLabel,
  suffix,
}: {
  value: number;
  onChange: (next: number) => void;
  disabled?: boolean;
  ariaLabel: string;
  suffix?: string;
}) {
  return (
    <div className="relative w-full">
      <input
        type="number"
        inputMode="decimal"
        min={0}
        step="0.01"
        value={Number.isFinite(value) ? value : 0}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(e) => {
          const next = Number.parseFloat(e.target.value);
          onChange(Number.isFinite(next) ? next : 0);
        }}
        className={cn(inputBase, "text-right tabular-nums", suffix && "pr-9")}
      />
      {suffix && (
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-opt-ink-3">
          {suffix}
        </span>
      )}
    </div>
  );
}

function DirectionButton({
  side,
  active,
  disabled,
  onClick,
}: {
  side: "up" | "down";
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  const up = side === "up";
  const Icon = up ? ArrowUpIcon : ArrowDownIcon;

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={up ? "Trade up" : "Trade down"}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-9 items-center justify-center gap-1.5 rounded-[var(--opt-radius-sm)] border",
        "text-[12px] font-bold transition-[background,border-color] duration-150 disabled:opacity-55",
        active && up && "border-opt-rise bg-opt-rise text-white",
        active && !up && "border-opt-fall bg-opt-fall text-white",
        !active &&
          "border-opt-line bg-opt-bg-elev hover:border-opt-line-strong " +
            (up ? "text-opt-rise" : "text-opt-fall"),
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {active && (up ? "Up" : "Down")}
    </button>
  );
}

function Dot() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-1.5 w-1.5 rounded-full border border-opt-ink-4"
    />
  );
}
