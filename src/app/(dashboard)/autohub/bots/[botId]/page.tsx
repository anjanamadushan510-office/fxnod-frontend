"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MarketPicker } from "@/components/autohub/MarketPicker";
import {
  SettingFields,
  defaultSettingValues,
  readSettings,
  type SettingValue,
  type SettingValues,
} from "@/components/autohub/SettingFields";
import { compareAmounts, consentRequired, isAmount } from "@/components/autohub/runState";
import { DerivAppConsentModal } from "@/components/bot/DerivAppConsentModal";
import { TextField } from "@/components/bot/builder/controls";
import { AccountSection } from "@/components/bot/builder/RunPanel";
import { useDerivStatus } from "@/hooks/useDerivStatus";
import { cn } from "@/lib/cn";
import { trackAutoHubStart } from "@/lib/analytics";
import { parseApiError } from "@/lib/apiError";
import {
  getListAutoHubRunsQueryKey,
  useListAutoHubBots,
  useStartAutoHubRun,
} from "@/services/api/endpoints/auto-hub/auto-hub";
import { useGetBotLimits } from "@/services/api/endpoints/bots/bots";
import type { AutoHubBot, StartAutoHubRunRequest } from "@/services/api/model";

/** What the user has filled in. Amounts stay the strings they typed. */
interface Draft {
  symbols: string[];
  stake: string;
  stopLoss: string;
  takeProfit: string;
  settings: SettingValues;
}

function draftKey(botId: string) {
  return `fxnod.autohub.draft.${botId}`;
}

function freshDraft(bot: AutoHubBot): Draft {
  return {
    symbols: [],
    stake: bot.default_stake,
    stopLoss: bot.default_stop_loss,
    takeProfit: bot.default_take_profit,
    settings: defaultSettingValues(bot.settings),
  };
}

/**
 * The draft kept on this device, if it still fits the bot.
 *
 * It exists for one journey: Deriv's one-time approval leaves the site and
 * comes back, and the form should not be empty on return. Anything that does
 * not look like a draft for this bot's current settings is ignored.
 */
function storedDraft(bot: AutoHubBot): Draft | null {
  try {
    const raw = window.localStorage.getItem(draftKey(bot.bot_id));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Draft>;
    if (
      !Array.isArray(parsed.symbols) ||
      typeof parsed.stake !== "string" ||
      typeof parsed.stopLoss !== "string" ||
      typeof parsed.takeProfit !== "string" ||
      typeof parsed.settings !== "object" ||
      parsed.settings === null
    ) {
      return null;
    }
    const defaults = defaultSettingValues(bot.settings);
    const settings: SettingValues = {};
    for (const key of Object.keys(defaults)) {
      const value = (parsed.settings as SettingValues)[key];
      settings[key] = typeof value === typeof defaults[key] ? value : defaults[key];
    }
    return {
      symbols: parsed.symbols.filter((s): s is string => typeof s === "string"),
      stake: parsed.stake,
      stopLoss: parsed.stopLoss,
      takeProfit: parsed.takeProfit,
      settings,
    };
  } catch {
    return null;
  }
}

/**
 * /autohub/bots/[botId] — set one bot up and start it.
 *
 * The form is drawn from the catalogue: how many markets, the smallest stake
 * and the bot's own settings all come from the engine, which is also where
 * each of them is enforced. Nothing typed here is trusted by the server, and
 * nothing here decides which account is traded or whether it is real money.
 */
export default function AutoHubBotPage() {
  const { botId } = useParams<{ botId: string }>();
  const botsQuery = useListAutoHubBots();
  const bot = (botsQuery.data?.bots ?? []).find((b) => b.bot_id === botId);

  if (botsQuery.isPending) {
    return (
      <Shell>
        <p className="text-sm text-ink-3">Loading bot…</p>
      </Shell>
    );
  }
  if (!bot) {
    return (
      <Shell>
        <div className="bg-panel border border-line rounded-2xl p-8 max-w-lg">
          <h2 className="font-display text-lg font-semibold mb-2">This bot could not be opened</h2>
          <p className="text-sm text-ink-2">
            {botsQuery.isError
              ? "The trading engine may be unavailable. Please try again shortly."
              : "It is not in the Auto Hub catalogue."}
          </p>
        </div>
      </Shell>
    );
  }
  return (
    <Shell>
      <BotSetup bot={bot} />
    </Shell>
  );
}

function BotSetup({ bot }: { bot: AutoHubBot }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const deriv = useDerivStatus();
  const limitsQuery = useGetBotLimits();
  const startRun = useStartAutoHubRun();

  const [draft, setDraft] = useState<Draft>(() => freshDraft(bot));
  const [restored, setRestored] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [consent, setConsent] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  // Read the stored draft after mount: the server render has no localStorage,
  // and reading it during render would make the two disagree.
  useEffect(() => {
    const stored = storedDraft(bot);
    if (stored) setDraft(stored);
    setRestored(true);
  }, [bot]);

  useEffect(() => {
    if (!restored) return;
    try {
      window.localStorage.setItem(draftKey(bot.bot_id), JSON.stringify(draft));
    } catch {
      // Private mode or a full quota. The form still works for this visit.
    }
  }, [bot.bot_id, draft, restored]);

  // The tick is for one account. Switching accounts must ask again.
  const [lastAccount, setLastAccount] = useState(deriv.accountId);
  if (lastAccount !== deriv.accountId) {
    setLastAccount(deriv.accountId);
    setAcknowledged(false);
  }

  const settings = useMemo(() => readSettings(bot.settings, draft.settings), [bot.settings, draft.settings]);

  const errors = useMemo(() => {
    const found: string[] = [];
    if (draft.symbols.length < bot.min_markets) {
      found.push(
        bot.max_markets === 1
          ? "Choose a market."
          : `Choose at least ${bot.min_markets} market${bot.min_markets === 1 ? "" : "s"}.`,
      );
    }
    if (!isAmount(draft.stake)) {
      found.push("Stake must be an amount, such as 1 or 0.50.");
    } else if (compareAmounts(draft.stake, bot.min_stake) < 0) {
      found.push(`The smallest stake for ${bot.name} is ${bot.min_stake}.`);
    }
    if (!isAmount(draft.stopLoss)) {
      found.push("Stop loss must be an amount above zero. A bot cannot run without one.");
    }
    if (draft.takeProfit.trim() !== "" && !isAmount(draft.takeProfit)) {
      found.push("Take profit must be an amount above zero, or left empty.");
    }
    return [...found, ...settings.errors];
  }, [bot, draft, settings.errors]);

  const real = deriv.linked && !deriv.isVirtual;
  const ready = errors.length === 0;
  const canStart = deriv.linked && !startRun.isPending && (!real || acknowledged);
  const caps = limitsQuery.data;

  function patch(change: Partial<Draft>) {
    setDraft((current) => ({ ...current, ...change }));
  }

  async function handleStart() {
    if (!ready) {
      setShowErrors(true);
      toast.error(errors[0]);
      return;
    }
    const request: StartAutoHubRunRequest = {
      symbols: draft.symbols,
      stake: draft.stake.trim(),
      stop_loss: draft.stopLoss.trim(),
      settings: settings.payload,
      // Sent as it is and never defaulted to true: the engine refuses a
      // real-money run without it, and the tick below is the only thing that
      // sets it.
      risk_acknowledged: real && acknowledged,
    };
    if (draft.takeProfit.trim() !== "") request.take_profit = draft.takeProfit.trim();

    try {
      const res = await startRun.mutateAsync({ botId: bot.bot_id, data: request });
      trackAutoHubStart(res.run.is_virtual, bot.bot_id);
      await queryClient.invalidateQueries({ queryKey: getListAutoHubRunsQueryKey() });
      try {
        window.localStorage.removeItem(draftKey(bot.bot_id));
      } catch {
        // Nothing to clear.
      }
      // A limit over the platform cap is reduced, not refused. Say so: the
      // user would otherwise believe the number they typed is in force.
      for (const adjustment of res.limit_adjustments ?? []) {
        toast.message(
          `${adjustment.field}: ${adjustment.requested} is over the platform cap, so ${adjustment.applied} is used.`,
        );
      }
      router.push(`/autohub/runs/${res.run.run_id}` as Route);
    } catch (err) {
      const appKey = consentRequired(err);
      if (appKey) {
        setConsent(appKey);
        return;
      }
      toast.error(parseApiError(err, "The bot could not be started.").message);
    }
  }

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-ink">{bot.name}</h1>
        <p className="text-sm text-ink-2 mt-1 max-w-2xl leading-relaxed">{bot.description}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem] gap-6 items-start">
        <div className="space-y-6 min-w-0">
          <Card title="How it works">
            <ol className="space-y-3">
              {bot.guide.map((line, index) => (
                <li key={line} className="flex gap-3 text-sm text-ink-2 leading-relaxed">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[10px] font-semibold text-ink-2 tabular-nums">
                    {index + 1}
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ol>
          </Card>

          <Card title={bot.max_markets === 1 ? "Market" : "Markets"}>
            <MarketPicker
              contractType={bot.contract_type}
              selected={draft.symbols}
              onChange={(symbols) => patch({ symbols })}
              min={bot.min_markets}
              max={bot.max_markets}
              excluded={bot.excluded_symbols}
              suggested={bot.suggested_symbols}
            />
          </Card>
        </div>

        <div className="space-y-6 lg:sticky lg:top-6">
          <Card title="Stake and limits">
            <div className="space-y-4">
              <TextField
                label="Stake per trade"
                value={draft.stake}
                onChange={(stake) => patch({ stake })}
                maxLength={12}
                hint={
                  caps?.max_stake_per_trade
                    ? `The same for every trade. From ${bot.min_stake} up to ${caps.max_stake_per_trade}.`
                    : `The same for every trade. From ${bot.min_stake}.`
                }
              />
              <TextField
                label="Stop loss"
                value={draft.stopLoss}
                onChange={(stopLoss) => patch({ stopLoss })}
                maxLength={12}
                hint="The bot stops when its real losses reach this."
              />
              <TextField
                label="Take profit"
                value={draft.takeProfit}
                onChange={(takeProfit) => patch({ takeProfit })}
                maxLength={12}
                placeholder="No target"
                hint="The bot stops when its real profit reaches this. Leave empty for no target."
              />
            </div>
          </Card>

          {bot.settings.length > 0 && (
            <Card title="Settings">
              <SettingFields
                settings={bot.settings}
                values={draft.settings}
                onChange={(key: string, value: SettingValue) =>
                  patch({ settings: { ...draft.settings, [key]: value } })
                }
              />
            </Card>
          )}

          <div className="bg-panel border border-line rounded-2xl p-5 space-y-5">
            <AccountSection />

            {real && (
              <label className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-900 dark:text-amber-100">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-amber-400"
                />
                <span>
                  I understand this bot trades <strong>real money</strong> on its own and can lose
                  up to its stop loss, and that past results do not predict future ones.
                </span>
              </label>
            )}

            {showErrors && errors.length > 0 && (
              <ul className="space-y-1 text-xs text-red-400" role="alert">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}

            <button
              type="button"
              disabled={!canStart}
              onClick={handleStart}
              className={cn(
                "w-full h-11 rounded-lg text-sm font-medium transition disabled:opacity-45 disabled:cursor-not-allowed",
                real ? "bg-amber-400 text-black hover:bg-amber-300" : "bg-ink text-surface hover:opacity-80",
              )}
            >
              {startRun.isPending
                ? "Checking with Deriv…"
                : real
                  ? "Start with real money"
                  : "Start on demo"}
            </button>

            <p className="text-[11px] leading-relaxed text-ink-3">
              {bot.markup_pct
                ? `On real money, Deriv takes a ${bot.markup_pct}% markup from each payout for FXNod. Demo trades carry none.`
                : "Demo trades carry no markup."}{" "}
              The bot runs on the server and keeps its limits with this page closed.
            </p>
          </div>
        </div>
      </div>

      {/* The consent modal is styled for the options scope; give it that scope
          here rather than restyling a shared component. */}
      <div data-app="options" data-opt-theme="dark" className="contents">
        <DerivAppConsentModal
          appKey={consent}
          returnTo={`/autohub/bots/${bot.bot_id}`}
          onClose={() => setConsent(null)}
        />
      </div>
    </>
  );
}

// ─── pieces ─────────────────────────────────────────────────────────────────

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="p-4 lg:p-8">
      <Link href={"/autohub" as Route} className="-mt-2 mb-2 block w-fit py-2 text-xs text-ink-3 hover:text-ink">
        &larr; Auto Hub
      </Link>
      {children}
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-line rounded-2xl p-5">
      <h2 className="text-sm font-semibold text-ink tracking-wide uppercase mb-4">{title}</h2>
      {children}
    </div>
  );
}
