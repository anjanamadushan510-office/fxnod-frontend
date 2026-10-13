import type {
  AutoHubBot,
  AutoHubRun,
  AutoHubEntry,
} from "@/services/api/model";
import { isActiveRun } from "./runState";

export function runNeedsUpdates(
  run?: Pick<AutoHubRun, "status" | "trades_open">,
) {
  return !!run && (isActiveRun(run.status) || run.trades_open > 0);
}
export function canRepeatRun(run: Pick<AutoHubRun, "status" | "trades_open">) {
  return (
    (run.status === "completed" || run.status === "failed") &&
    run.trades_open === 0
  );
}
export function repeatRunHref(run: Pick<AutoHubRun, "bot_id" | "run_id">) {
  return `/autohub/bots/${encodeURIComponent(run.bot_id)}?from_run=${encodeURIComponent(run.run_id)}`;
}
export function repeatValues(
  bot: AutoHubBot,
  run: AutoHubRun,
  currency?: string,
) {
  if (bot.bot_id !== run.bot_id || !canRepeatRun(run)) return null;
  const sameCurrency = !currency || currency === run.currency;
  const values: Record<string, string | boolean> = {};
  for (const setting of bot.settings) {
    const old = run.settings[setting.key];
    if (setting.type === "boolean")
      values[setting.key] =
        typeof old === "boolean" ? old : setting.default === true;
    else if (setting.type === "choice")
      values[setting.key] = (setting.choices ?? []).some(
        (choice) => choice.value === old,
      )
        ? String(old)
        : String(setting.default ?? "");
    else
      values[setting.key] =
        typeof old === "number" || typeof old === "string"
          ? String(old)
          : String(setting.default ?? "");
  }
  return {
    symbols: run.symbols
      .filter(
        (symbol) =>
          !bot.excluded_symbols.includes(symbol) &&
          (!bot.allowed_symbols?.length ||
            bot.allowed_symbols.includes(symbol)),
      )
      .slice(0, bot.max_markets),
    // The run API does not retain the preset id. Never guess a money plan by its amounts.
    preset: "",
    stake: sameCurrency ? run.stake : bot.default_stake,
    stopLoss: sameCurrency ? run.stop_loss : bot.default_stop_loss,
    takeProfit: sameCurrency
      ? (run.take_profit ?? "")
      : bot.default_take_profit,
    settings: values,
  };
}

export function entriesNeedUpdates(entries?: Pick<AutoHubEntry, "outcome">[]) {
  return (entries ?? []).some((entry) => !entry.outcome);
}
