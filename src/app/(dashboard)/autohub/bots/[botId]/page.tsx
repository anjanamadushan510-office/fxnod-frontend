"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
import {
  compareAmounts,
  consentRequired,
  isAmount,
} from "@/components/autohub/runState";
import { DerivAppConsentModal } from "@/components/bot/DerivAppConsentModal";
import { TextField } from "@/components/bot/builder/controls";
import { AccountSection } from "@/components/bot/builder/RunPanel";
import { useDerivStatus } from "@/hooks/useDerivStatus";
import { useToolTradingAccess } from "@/hooks/useToolTradingAccess";
import { useDerivAccounts } from "@/hooks/useDerivAccounts";
import {
  accountBalanceText,
} from "@/components/deriv/balancePresentation";
import { BotJourney } from "@/components/autohub/BotJourney";
import { StartReview } from "@/components/autohub/StartReview";
import { repeatValues } from "@/components/autohub/journey";
import { useAuthStore } from "@/stores/authStore";
import { useBotFavourites } from "@/hooks/useBotFavourites";
import { FavouriteButton } from "@/components/autohub/FavouriteButton";
import { cn } from "@/lib/cn";
import { trackAutoHubStart } from "@/lib/analytics";
import { parseApiError } from "@/lib/apiError";
import {
  getListAutoHubRunsQueryKey,
  useListAutoHubBots,
  useListAutoHubRuns,
  useGetAutoHubRun,
  getGetAutoHubRunQueryKey,
  useStartAutoHubRun,
} from "@/services/api/endpoints/auto-hub/auto-hub";
import { useGetBotLimits } from "@/services/api/endpoints/bots/bots";
import type {
  AutoHubBot,
  AutoHubPreset,
  StartAutoHubRunRequest,
} from "@/services/api/model";

/**
 * What the user has filled in. Amounts stay the strings they typed.
 *
 * A bot is set up one of two ways and the catalogue says which: a bot that
 * lists presets is started by choosing one, and its three amounts are the
 * plan's; a bot that lists none takes the three amounts typed here.
 */
interface Draft {
  symbols: string[];
  /** The id of the chosen plan, or empty while none is chosen. */
  preset: string;
  stake: string;
  stopLoss: string;
  takeProfit: string;
  settings: SettingValues;
}

function draftKey(botId: string, userId: string, sourceId?: string | null) {
  return `fxnod.autohub.draft.${userId}.${botId}${sourceId ? `.run.${sourceId}` : ""}`;
}

function freshDraft(bot: AutoHubBot): Draft {
  return {
    symbols: [],
    // No plan is chosen for the user: which stop loss to accept is theirs.
    preset: "",
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
function storedDraft(
  bot: AutoHubBot,
  userId: string,
  sourceId?: string | null,
): Draft | null {
  try {
    const raw = window.localStorage.getItem(
      draftKey(bot.bot_id, userId ?? "", sourceId),
    );
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
      settings[key] =
        typeof value === typeof defaults[key] ? value : defaults[key];
    }
    return {
      symbols: parsed.symbols.filter((s): s is string => typeof s === "string"),
      // A plan the bot no longer has is dropped, so the choice is made again.
      preset: bot.presets.some((p) => p.id === parsed.preset)
        ? (parsed.preset as string)
        : "",
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
          <h2 className="font-display text-lg font-semibold mb-2">
            This bot could not be opened
          </h2>
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
      <Suspense
        fallback={<p className="text-sm text-ink-3">Preparing setup…</p>}
      >
        <BotSetup key={bot.bot_id} bot={bot} />
      </Suspense>
    </Shell>
  );
}

function BotSetup({ bot }: { bot: AutoHubBot }) {
  const favourites = useBotFavourites();
  const userId = useAuthStore((state) => state.user?.id);
  const searchParams = useSearchParams();
  const sourceId = searchParams.get("from_run");
  const resumeSetup = searchParams.get("resume_setup") === "1";
  const validSourceId =
    !!sourceId &&
    /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(
      sourceId,
    );
  const sourceQuery = useGetAutoHubRun(sourceId ?? "", {
    query: {
      queryKey: [...getGetAutoHubRunQueryKey(sourceId ?? ""), userId],
      enabled: validSourceId && !!userId,
      retry: false,
      refetchOnWindowFocus: false,
    },
  });
  const [reviewing, setReviewing] = useState(false);
  const [refreshingReview, setRefreshingReview] = useState(false);
  const [createdRunId, setCreatedRunId] = useState<string | null>(null);
  const submitting = useRef(false);
  const restoredKey = useRef("");
  const router = useRouter();
  const queryClient = useQueryClient();
  const deriv = useDerivStatus();
  const accounts = useDerivAccounts();
  const selectedAccount = accounts.data?.accounts.find(
    (account) => account.deriv_account_id === deriv.accountId,
  );
  const access = useToolTradingAccess("autohub", deriv.isVirtual);
  const activeParams = { state: "active", limit: 100 } as const;
  const runningQuery = useListAutoHubRuns(activeParams, {
    query: {
      queryKey: [
        ...getListAutoHubRunsQueryKey(activeParams),
        userId,
        deriv.accountId,
      ],
      enabled: !!userId && deriv.linked,
      refetchInterval: 10_000,
    },
  });
  const existingRuns = (runningQuery.data?.runs ?? []).filter(
    (run) =>
      run.bot_id === bot.bot_id && run.deriv_account_id === deriv.accountId,
  );
  const limitsQuery = useGetBotLimits();
  const startRun = useStartAutoHubRun();

  const [draft, setDraft] = useState<Draft>(() => freshDraft(bot));
  const [restored, setRestored] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [consent, setConsent] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  // Reload from the authenticated run API, not from a browser-owned run snapshot.
  useEffect(() => {
    if (!userId || deriv.isLoading || (validSourceId && sourceQuery.isPending))
      return;
    const key = `${userId}:${bot.bot_id}:${sourceId ?? "fresh"}:${sourceId ? (deriv.currency ?? "unlinked") : ""}`;
    if (restoredKey.current === key) return;
    const previous = sourceQuery.data
      ? repeatValues(bot, sourceQuery.data, deriv.currency)
      : null;
    setDraft(
      sourceId && !resumeSetup
        ? (previous ?? freshDraft(bot))
        : (storedDraft(bot, userId, sourceId) ?? freshDraft(bot)),
    );
    setAcknowledged(false);
    setReviewing(false);
    setShowErrors(false);
    setRestored(true);
    restoredKey.current = key;
  }, [
    userId,
    bot,
    sourceId,
    resumeSetup,
    validSourceId,
    sourceQuery.isPending,
    sourceQuery.data,
    deriv.isLoading,
    deriv.currency,
  ]);

  useEffect(() => {
    if (!restored || !userId) return;
    try {
      window.localStorage.setItem(
        draftKey(bot.bot_id, userId ?? "", sourceId),
        JSON.stringify(draft),
      );
    } catch {
      // Private mode or a full quota. The form still works for this visit.
    }
  }, [bot.bot_id, draft, restored, userId, sourceId]);

  // The tick is for one account. Switching accounts must ask again.
  const [lastAccount, setLastAccount] = useState(deriv.accountId);
  if (lastAccount !== deriv.accountId) {
    setLastAccount(deriv.accountId);
    setAcknowledged(false);
    setReviewing(false);
  }

  const settings = useMemo(
    () => readSettings(bot.settings, draft.settings),
    [bot.settings, draft.settings],
  );

  const errors = useMemo(() => {
    const found: string[] = [];
    if (draft.symbols.length < bot.min_markets) {
      found.push(
        bot.max_markets === 1
          ? "Choose a market."
          : `Choose at least ${bot.min_markets} market${bot.min_markets === 1 ? "" : "s"}.`,
      );
    }
    if (bot.presets.length > 0) {
      if (!bot.presets.some((p) => p.id === draft.preset))
        found.push("Choose a plan.");
      return [...found, ...settings.errors];
    }
    if (!isAmount(draft.stake)) {
      found.push("Stake must be an amount, such as 1 or 0.50.");
    } else if (compareAmounts(draft.stake, bot.min_stake) < 0) {
      found.push(`The smallest stake for ${bot.name} is ${bot.min_stake}.`);
    }
    if (!isAmount(draft.stopLoss)) {
      found.push(
        "Stop loss must be an amount above zero. A bot cannot run without one.",
      );
    }
    if (draft.takeProfit.trim() !== "" && !isAmount(draft.takeProfit)) {
      found.push("Take profit must be an amount above zero, or left empty.");
    }
    return [...found, ...settings.errors];
  }, [bot, draft, settings.errors]);

  const hasPlans = bot.presets.length > 0;
  const selectedPlan = bot.presets.find((plan) => plan.id === draft.preset);
  const real = deriv.linked && !deriv.isVirtual;
  const ready = errors.length === 0;
  const canStart =
    restored &&
    !createdRunId &&
    !refreshingReview &&
    deriv.linked &&
    !deriv.isLoading &&
    !deriv.needsReconnect &&
    access.allowed &&
    !startRun.isPending &&
    (!real || acknowledged);
  const caps = limitsQuery.data;

  function patch(change: Partial<Draft>) {
    setDraft((current) => ({ ...current, ...change }));
  }

  async function handleReview() {
    if (!canStart) return;
    if (!ready) {
      setShowErrors(true);
      toast.error(errors[0]);
      document
        .getElementById("setup-errors")
        ?.scrollIntoView({ block: "center" });
      return;
    }
    setRefreshingReview(true);
    try {
      const latest = await accounts.refetch();
      if (latest.isError || !latest.data?.accounts?.some(
        (account) => account.is_selected && account.balance !== undefined,
      )) {
        toast.error("Could not load the current Deriv balance. Please try again.");
        return;
      }
      setReviewing(true);
    } finally {
      setRefreshingReview(false);
    }
  }

  async function handleStart() {
    if (!canStart || submitting.current) return;
    if (!ready) {
      setShowErrors(true);
      toast.error(errors[0]);
      return;
    }
    const request: StartAutoHubRunRequest = {
      symbols: draft.symbols,
      settings: settings.payload,
      // Sent as it is and never defaulted to true: the engine refuses a
      // real-money run without it, and the tick below is the only thing that
      // sets it.
      risk_acknowledged: real && acknowledged,
    };
    // One or the other, never both: the engine refuses an amount sent with a
    // plan, because a plan's amounts are not editable one by one.
    if (hasPlans) {
      request.preset = draft.preset;
    } else {
      request.stake = draft.stake.trim();
      request.stop_loss = draft.stopLoss.trim();
      if (draft.takeProfit.trim() !== "")
        request.take_profit = draft.takeProfit.trim();
    }

    submitting.current = true;
    try {
      const res = await startRun.mutateAsync({
        botId: bot.bot_id,
        data: request,
      });
      setCreatedRunId(res.run.run_id);
      setReviewing(false);
      trackAutoHubStart(res.run.is_virtual, bot.bot_id);
      await queryClient.invalidateQueries({
        queryKey: getListAutoHubRunsQueryKey(),
      });
      try {
        window.localStorage.removeItem(
          draftKey(bot.bot_id, userId ?? "", sourceId),
        );
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
        setReviewing(false);
        setConsent(appKey);
        return;
      }
      setReviewing(false);
      toast.error(parseApiError(err, "The bot could not be started.").message);
    } finally {
      submitting.current = false;
    }
  }

  if (!restored) {
    return (
      <>
        <BotJourney stage="setup" />
        <div role="status" className="py-8 text-sm text-ink-3">
          {sourceId
            ? "Loading your previous run’s setup…"
            : "Preparing your account and bot settings…"}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2].map((key) => (
            <div
              key={key}
              className="h-48 rounded-2xl bg-surface-2 animate-pulse"
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <BotJourney stage="setup" />
      {createdRunId && (
        <div
          role="status"
          className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-ink-2"
        >
          Your run has started. Opening the live session…{" "}
          <Link
            href={`/autohub/runs/${createdRunId}` as Route}
            className="underline underline-offset-2"
          >
            Open live run
          </Link>
        </div>
      )}
      {sourceId && (
        <div
          role="status"
          className="mb-6 rounded-xl border border-line bg-surface-2 p-4 text-sm text-ink-2"
        >
          {!restored ? (
            "Loading the previous run’s setup…"
          ) : sourceQuery.data &&
            repeatValues(bot, sourceQuery.data, deriv.currency) ? (
            <>
              Previous markets and settings loaded.{" "}
              {hasPlans
                ? "Choose a current plan, then review your new run."
                : "Review the limits before starting a fresh run."}
              {sourceQuery.data.deriv_account_id !== deriv.accountId && (
                <p className="mt-2 text-amber-500">
                  The previous run used {sourceQuery.data.deriv_account_id} (
                  {sourceQuery.data.is_virtual ? "Demo" : "Real"}). Your
                  currently selected account will be used.
                </p>
              )}
              {sourceQuery.data.currency !== deriv.currency && (
                <p className="mt-2 text-amber-500">
                  The previous run used a different currency. Review all amounts
                  in your currently selected account’s currency.
                </p>
              )}
            </>
          ) : (
            <>
              The previous setup could not be reused. Current bot defaults are
              shown; choose your markets and limits again.
            </>
          )}
        </div>
      )}
      {existingRuns.length > 0 && !createdRunId && (
        <div className="mb-6 rounded-xl border border-line bg-surface p-4 text-sm text-ink-2">
          <p className="font-medium text-ink">
            This bot already has{" "}
            {existingRuns.length === 1 ? "a session" : "sessions"} on your
            selected account.
          </p>
          <p className="mt-1 text-xs text-ink-3">
            Open an existing session to follow or stop it. Starting below
            creates an additional run.
          </p>
          <div className="flex flex-wrap gap-3 mt-3">
            {existingRuns.map((run) => (
              <Link
                key={run.run_id}
                href={`/autohub/runs/${run.run_id}` as Route}
                className="underline underline-offset-4 text-xs"
              >
                View {run.status} run →
              </Link>
            ))}
          </div>
        </div>
      )}
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold text-ink">{bot.name}</h1>
          <FavouriteButton
            name={bot.name}
            selected={favourites.ids.has(bot.bot_id)}
            disabled={!favourites.ready || favourites.saving}
            onClick={() => favourites.toggle(bot.bot_id)}
          />
        </div>
        {favourites.isError && (
          <button
            type="button"
            onClick={favourites.retry}
            className="mt-2 text-xs text-ink-3 underline"
          >
            Could not load favourites. Retry
          </button>
        )}
        <p className="text-sm text-ink-2 mt-1 max-w-2xl leading-relaxed">
          {bot.description}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem] gap-6 items-start">
        <div className="space-y-6 min-w-0">
          <details className="rounded-2xl border border-line bg-surface p-5">
            <summary className="cursor-pointer text-sm font-medium text-ink">
              How this bot works
            </summary>
            <ol className="space-y-3 mt-4">
              {bot.guide.map((line, index) => (
                <li
                  key={line}
                  className="flex gap-3 text-sm text-ink-2 leading-relaxed"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[10px] font-semibold text-ink-2 tabular-nums">
                    {index + 1}
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ol>
          </details>

          <Card title={bot.max_markets === 1 ? "Market" : "Markets"}>
            <MarketPicker
              contractType={bot.contract_type}
              selected={draft.symbols}
              onChange={(symbols) => patch({ symbols })}
              min={bot.min_markets}
              max={bot.max_markets}
              excluded={bot.excluded_symbols}
              only={bot.allowed_symbols}
              suggested={bot.suggested_symbols}
            />
          </Card>
        </div>

        <div className="space-y-6 lg:sticky lg:top-6">
          {hasPlans && (
            <Card title="Plan">
              <PlanPicker
                plans={bot.presets}
                selected={draft.preset}
                onChange={(preset) => patch({ preset })}
              />
            </Card>
          )}

          {!hasPlans && (
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
          )}

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
            {access.message && (
              <p className="text-xs text-ink-2" role="status">
                {access.message} <Link href="/tools">View packages</Link>
              </p>
            )}

            {real && (
              <label className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-900 dark:text-amber-100">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-amber-400"
                />
                <span>
                  I understand this bot trades <strong>real money</strong> on
                  its own and can lose up to its stop loss, and that past
                  results do not predict future ones.
                </span>
              </label>
            )}

            {showErrors && errors.length > 0 && (
              <ul
                id="setup-errors"
                className="space-y-1 text-xs text-negative"
                role="alert"
              >
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}

            <button
              type="button"
              disabled={!canStart}
              onClick={handleReview}
              className={cn(
                "w-full h-11 rounded-lg text-sm font-medium transition disabled:opacity-45 disabled:cursor-not-allowed",
                real
                  ? "bg-amber-400 text-black hover:bg-amber-300"
                  : "bg-ink text-surface hover:opacity-80",
              )}
            >
              {refreshingReview
                ? "Refreshing account balance…"
                : createdRunId
                  ? "Opening live run…"
                  : startRun.isPending
                    ? "Starting your run…"
                    : "Review & start run"}
            </button>

            <p className="text-[11px] leading-relaxed text-ink-3">
              {bot.markup_pct
                ? `On real money, Deriv takes a ${bot.markup_pct}% markup from each payout for FXNod. Demo trades carry none.`
                : "Demo trades carry no markup."}{" "}
              The bot runs on the server and keeps its limits with this page
              closed.
            </p>
          </div>
        </div>
      </div>

      <StartReview
        open={reviewing}
        onClose={() => setReviewing(false)}
        onStart={handleStart}
        busy={startRun.isPending}
        allowed={canStart && ready}
        name={bot.name}
        accountId={deriv.accountId}
        balance={
          selectedAccount
            ? accountBalanceText(selectedAccount)
            : "Balance unavailable"
        }
        isVirtual={deriv.isVirtual}
        currency={deriv.currency}
        markets={draft.symbols}
        preset={draft.preset}
        planNote={
          selectedPlan
            ? `${compareAmounts(selectedPlan.multiplier, "0") > 0 ? `Stake increases ×${selectedPlan.multiplier} after a loss.` : "This plan uses a fixed stake."}${compareAmounts(selectedPlan.contract_take_profit, "0") > 0 ? ` Each position closes at ${selectedPlan.contract_take_profit} ${deriv.currency ?? ""} profit.` : ""}`
            : undefined
        }
        stake={
          bot.presets.find((plan) => plan.id === draft.preset)?.stake ??
          draft.stake
        }
        stopLoss={
          bot.presets.find((plan) => plan.id === draft.preset)?.stop_loss ??
          draft.stopLoss
        }
        takeProfit={
          bot.presets.find((plan) => plan.id === draft.preset)?.take_profit ??
          draft.takeProfit
        }
        settings={bot.settings.map((setting) => ({
          title: setting.title,
          value: String(draft.settings[setting.key] ?? ""),
        }))}
      />

      {/* The consent modal is styled for the options scope; give it that scope
          here rather than restyling a shared component. */}
      <div data-app="options" data-opt-theme="dark" className="contents">
        <DerivAppConsentModal
          appKey={consent}
          returnTo={`/autohub/bots/${bot.bot_id}?resume_setup=1${sourceId ? `&from_run=${encodeURIComponent(sourceId)}` : ""}`}
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
      <Link
        href={"/autohub" as Route}
        className="-mt-2 mb-2 block w-fit py-2 text-xs text-ink-3 hover:text-ink"
      >
        &larr; Bot library
      </Link>
      {children}
    </section>
  );
}

/**
 * The bot's money plans, one to choose. Each is a whole: a stop loss with the
 * starting stake and profit target that go with it, as the engine holds them.
 * Nothing here is editable, and the engine applies the plan by its id.
 */
function PlanPicker({
  plans,
  selected,
  onChange,
}: {
  plans: AutoHubPreset[];
  selected: string;
  onChange: (id: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Plan" className="space-y-3">
      {plans.map((plan) => {
        const active = plan.id === selected;
        // Zero means the stake never changes; anything else multiplies it.
        const multiplies = compareAmounts(plan.multiplier, "0") > 0;
        // A position that stays open until an order closes it carries its own
        // take profit; a contract that ends by itself has none.
        const closesAt = compareAmounts(plan.contract_take_profit, "0") > 0;
        return (
          <button
            key={plan.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(plan.id)}
            className={cn(
              "w-full rounded-xl border p-4 text-left transition",
              active
                ? "border-ink bg-surface-2"
                : "border-line hover:border-ink-3",
            )}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-ink">
                Stop loss {plan.stop_loss}
              </span>
              <span className="text-xs text-ink-3">
                Take profit {plan.take_profit}
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-ink-2">
              Starts at {plan.stake} a trade.{" "}
              {multiplies
                ? `After a loss the stake is multiplied by ${plan.multiplier}, and no stake is placed that could take the loss past ${plan.stop_loss}.`
                : "The stake stays the same on every trade."}
              {closesAt &&
                ` Each position is closed at a profit of ${plan.contract_take_profit}.`}
            </p>
          </button>
        );
      })}
      <p className="text-[11px] leading-relaxed text-ink-3">
        A plan sets all three amounts together. They cannot be changed one by
        one.
      </p>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface border border-line rounded-2xl p-5">
      <h2 className="text-sm font-semibold text-ink tracking-wide uppercase mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}
