"use client";

import { PillPicker, TextField } from "@/components/bot/builder/controls";
import { cn } from "@/lib/cn";
import type { AutoHubSetting } from "@/services/api/model";
import { AutoHubSettingType } from "@/services/api/model";

/** A setting's value while it is being edited. Integers stay text until sent. */
export type SettingValue = string | boolean;
export type SettingValues = Record<string, SettingValue>;

/** The form's starting values: each setting's own default from the catalogue. */
export function defaultSettingValues(settings: AutoHubSetting[]): SettingValues {
  const values: SettingValues = {};
  for (const setting of settings) {
    values[setting.key] =
      setting.type === AutoHubSettingType.boolean
        ? setting.default === true
        : String(setting.default ?? "");
  }
  return values;
}

/**
 * Checks the settings against the rules the catalogue sent and shapes them for
 * the start request. The server applies the same rules again; this only saves
 * a round trip and puts the message next to the form.
 */
export function readSettings(
  settings: AutoHubSetting[],
  values: SettingValues,
): { payload: Record<string, unknown>; errors: string[] } {
  const payload: Record<string, unknown> = {};
  const errors: string[] = [];

  for (const setting of settings) {
    const value = values[setting.key];
    if (setting.type === AutoHubSettingType.boolean) {
      payload[setting.key] = value === true;
      continue;
    }
    if (setting.type === AutoHubSettingType.choice) {
      const allowed = (setting.choices ?? []).some((choice) => choice.value === value);
      if (!allowed) errors.push(`Choose a value for ${setting.title}.`);
      else payload[setting.key] = value;
      continue;
    }

    const raw = typeof value === "string" ? value.trim() : "";
    if (!/^\d+$/.test(raw)) {
      errors.push(`${setting.title} must be a whole number.`);
      continue;
    }
    const n = Number.parseInt(raw, 10);
    const tooLow = setting.min !== undefined && n < setting.min;
    const tooHigh = setting.max !== undefined && n > setting.max;
    if (tooLow || tooHigh) {
      errors.push(`${setting.title} must be ${rangeText(setting)}.`);
      continue;
    }
    payload[setting.key] = n;
  }
  return { payload, errors };
}

function rangeText(setting: AutoHubSetting): string {
  if (setting.min !== undefined && setting.max !== undefined) {
    return `between ${setting.min} and ${setting.max}`;
  }
  if (setting.min !== undefined) return `at least ${setting.min}`;
  if (setting.max !== undefined) return `at most ${setting.max}`;
  return "a whole number";
}

/**
 * The bot's own settings, drawn from what the catalogue says each one is.
 *
 * No bot is named here. A new bot's settings appear in this form the moment
 * the engine lists them, which is what keeps adding a bot from needing a new
 * screen.
 */
export function SettingFields({
  settings,
  values,
  onChange,
}: {
  settings: AutoHubSetting[];
  values: SettingValues;
  onChange: (key: string, value: SettingValue) => void;
}) {
  if (settings.length === 0) return null;

  return (
    <div className="space-y-5">
      {settings.map((setting) => {
        const value = values[setting.key];

        if (setting.type === AutoHubSettingType.boolean) {
          const on = value === true;
          return (
            <div key={setting.key} className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="text-sm text-ink block">{setting.title}</span>
                {setting.description && (
                  <span className="text-[11px] text-ink-3 block mt-0.5">{setting.description}</span>
                )}
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                aria-label={setting.title}
                onClick={() => onChange(setting.key, !on)}
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full border transition-colors",
                  on ? "bg-ink border-ink" : "bg-surface-2 border-line",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-[18px] w-[18px] rounded-full transition-all",
                    on ? "left-[22px] bg-surface" : "left-0.5 bg-ink-3",
                  )}
                />
              </button>
            </div>
          );
        }

        if (setting.type === AutoHubSettingType.choice) {
          const choices = setting.choices ?? [];
          const labels = new Map(choices.map((choice) => [choice.value, choice.label]));
          return (
            <div key={setting.key}>
              <PillPicker
                label={setting.title}
                options={choices.map((choice) => choice.value)}
                value={typeof value === "string" ? value : ""}
                onChange={(next) => onChange(setting.key, next)}
                format={(v) => labels.get(v) ?? v}
              />
              {setting.description && (
                <span className="mt-1.5 block text-[11px] text-ink-3">{setting.description}</span>
              )}
            </div>
          );
        }

        return (
          <TextField
            key={setting.key}
            label={setting.title}
            kind="integer"
            value={typeof value === "string" ? value : ""}
            onChange={(next) => onChange(setting.key, next)}
            maxLength={6}
            hint={[setting.description, capitalize(rangeText(setting))].filter(Boolean).join(" ")}
          />
        );
      })}
    </div>
  );
}

function capitalize(text: string): string {
  return text.length > 0 ? `${text[0].toUpperCase()}${text.slice(1)}.` : text;
}
