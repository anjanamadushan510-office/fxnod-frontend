"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { type Route } from "next";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Activity, Cpu, DollarSign, MoreVertical } from "lucide-react";
import { BotPackageModal } from "@/components/bot/BotPackageModal";
import { EmergencyStopButton } from "@/components/bot/EmergencyStopButton";
import { DerivAppConsentModal } from "@/components/bot/DerivAppConsentModal";
import { RunSavedBotDialog } from "@/components/bot/RunSavedBotDialog";
import { DerivConnectionMenu } from "@/components/deriv/DerivConnectionMenu";
import { defaultFormState } from "@/components/bot/formState";
import {
  ENTRY_RULES,
  MONEY_OPTIONS,
  findMethod,
} from "@/components/bot/builder/catalog";
import {
  buildDraftRunRequest,
  draftFromPreset,
  strategyIdFor,
  toPresetRequest,
  type BotDraft,
} from "@/components/bot/builder/draft";
import {
  BOT_TEMPLATES,
  isTemplateAvailable,
} from "@/components/bot/builder/templates";
import { useMarketStore } from "@/components/options/market/marketStore";
import { cn } from "@/lib/cn";
import { decimalSign, formatMoney, sumDecimals } from "@/lib/decimal";
import { parseApiError } from "@/lib/apiError";
import { useForceStopBotRun } from "@/services/forceStopBotRun";
import {
  getListBotPresetsQueryKey,
  getListBotRunsQueryKey,
  useDeleteBotPreset,
  useListBotPresets,
  useListBotRuns,
  useListBotStrategies,
  useStartBotRun,
  useStopBotRun,
} from "@/services/api/endpoints/bots/bots";
import {
  getDerivListAccountsQueryKey,
  useDerivListAccounts,
  useDerivSelectAccount,
} from "@/services/api/endpoints/trading/trading";
import {
  BotStartConflictCode,
  type BotPreset,
  type BotRun,
  type BotStartConflict,
  type DerivLinkedAccount,
} from "@/services/api/model";

// Two questions, each answered by the engine: what is running on this
// account, and what finished most recently. Fetching the newest fifty runs
// and sorting them here loses a bot that has been running longer than fifty
// others took to finish, on every device that did not start it.
const ACTIVE_RUNS_PARAMS = { state: "active", limit: 100 } as const;
const ENDED_RUNS_PARAMS = { state: "ended", limit: 50 } as const;
type AccountFilter = "all" | "demo" | "real";

function matchesAccount(isVirtual: boolean, filter: AccountFilter): boolean {
  if (filter === "demo") return isVirtual;
  if (filter === "real") return !isVirtual;
  return true;
}

type PackageModalState =
  | { tab: "import" }
  | { tab: "export"; draft: BotDraft; strategyId: string };

/**
 * /dbot — the user's bots.
 *
 * Every number on this page is read from the engine: saved bots are presets
 * on the user's account, "running" is the live run list, and P/L is summed
 * from those runs as exact decimals. Where the engine has not answered yet the
 * page says so instead of showing a figure.
 */
export default function DBotDashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const strategiesQuery = useListBotStrategies();
  const presetsQuery = useListBotPresets();
  const runsQuery = useListBotRuns(ACTIVE_RUNS_PARAMS, { query: { refetchInterval: 1000 } });
  const endedQuery = useListBotRuns(ENDED_RUNS_PARAMS, {
    // A finished run is a record; the list only changes when a live one ends.
    query: { refetchInterval: (runsQuery.data?.runs?.length ?? 0) > 0 ? 5000 : false },
  });
  const stopRun = useStopBotRun();
  const forceStop = useForceStopBotRun();
  const deletePreset = useDeleteBotPreset();
  const startRun = useStartBotRun();
  const selectAccount = useDerivSelectAccount();
  const accountsQuery = useDerivListAccounts();

  const [packageModal, setPackageModal] = useState<PackageModalState | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [runPreset, setRunPreset] = useState<BotPreset | null>(null);
  const [consent, setConsent] = useState<{ appKey: string; returnTo: string } | null>(null);
  const [accountFilter, setAccountFilter] = useState<AccountFilter>("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const strategies = useMemo(() => strategiesQuery.data?.strategies ?? [], [strategiesQuery.data]);
  const presets = useMemo(() => presetsQuery.data?.presets ?? [], [presetsQuery.data]);
  const activeRuns = useMemo(
    () => (runsQuery.data?.runs ?? []).filter((r) => matchesAccount(r.is_virtual, accountFilter)),
    [runsQuery.data, accountFilter],
  );
  const finishedRuns = useMemo(
    () =>
      (endedQuery.data?.runs ?? [])
        .filter((r) => matchesAccount(r.is_virtual, accountFilter))
        .slice(0, 10),
    [endedQuery.data, accountFilter],
  );

  // One currency across runs is the normal case; if it is not, a single total
  // would add dollars to something else, so none is shown.
  const runCurrencies = new Set(activeRuns.map((r) => r.currency));
  const runningPnl =
    runCurrencies.size <= 1 ? sumDecimals(activeRuns.map((r) => r.realized_pnl)) : null;

  const allMarkets = useMarketStore((s) => s.allMarkets);
  const marketName = useMemo(() => {
    const byId = new Map(allMarkets.map((m) => [m.id, m.name]));
    return (id: string) => byId.get(id) ?? id;
  }, [allMarkets]);

  const strategyName = (id: string) =>
    strategies.find((s) => s.strategy_id === id)?.display_name ?? id;

  async function handleStop(run: BotRun) {
    try {
      await stopRun.mutateAsync({ id: run.run_id });
      await queryClient.invalidateQueries({ queryKey: getListBotRunsQueryKey() });
      toast.success("Stopping the bot");
    } catch (err) {
      toast.error(parseApiError(err, "Could not stop the bot.").message);
    }
  }

  async function handleForceStop(run: BotRun) {
    try {
      await forceStop.mutateAsync({ id: run.run_id });
      await queryClient.invalidateQueries({ queryKey: getListBotRunsQueryKey() });
      toast.success("Emergency stop sent");
    } catch (err) {
      toast.error(parseApiError(err, "Could not disconnect the bot.").message);
    }
  }

  async function handleRun(preset: BotPreset, account: DerivLinkedAccount, riskAcknowledged: boolean) {
    const draft = draftFromPreset(preset);
    if (!draft) {
      toast.error("This saved bot cannot be run.");
      return;
    }
    const { request, errors } = buildDraftRunRequest(draft, strategies, riskAcknowledged);
    if (!request) {
      toast.error(errors[0] ?? "This bot is not ready to run.");
      return;
    }
    try {
      if (!account.is_selected) {
        await selectAccount.mutateAsync({ data: { deriv_account_id: account.deriv_account_id } });
        await queryClient.invalidateQueries({ queryKey: getDerivListAccountsQueryKey() });
      }
      const res = await startRun.mutateAsync({ data: request });
      await queryClient.invalidateQueries({ queryKey: getListBotRunsQueryKey() });
      setRunPreset(null);
      router.push((res.run ? `/dbot/runs/${res.run.run_id}` : "/dbot") as Route);
    } catch (err) {
      const appKey = consentRequired(err);
      if (appKey) {
        setRunPreset(null);
        setConsent({ appKey, returnTo: "/dbot" });
        return;
      }
      toast.error(parseApiError(err, "The bot could not be started.").message);
    }
  }

  async function handleRemove(preset: BotPreset) {
    try {
      await deletePreset.mutateAsync({ presetId: preset.id });
      await queryClient.invalidateQueries({ queryKey: getListBotPresetsQueryKey() });
      toast.success(`Removed “${preset.name}”`);
    } catch (err) {
      toast.error(parseApiError(err, "Could not remove the bot.").message);
    } finally {
      setConfirmRemove(null);
    }
  }

  return (
    <section className="p-4 lg:p-8 space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">dBot</h1>
          <p className="text-sm text-ink-2 mt-1">Build a bot in plain language</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          {/* A bot cannot trade without a Deriv account, and this was the one
              screen that never said so — the first anyone heard of it was a
              run refusing to start. */}
          <DerivConnectionMenu />
        </div>
      </div>

      <AccountFilterControl value={accountFilter} onChange={setAccountFilter} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Cpu className="h-5 w-5 text-ink" />}
          title="Bots"
          subtitle="Saved to your account"
          value={presetsQuery.isSuccess ? String(presets.length) : "—"}
        />
        <StatCard
          icon={<Activity className="h-5 w-5 text-ink" />}
          title="Running"
          subtitle={accountFilter === "demo" ? "Demo" : accountFilter === "real" ? "Real" : "Demo or real"}
          value={runsQuery.isSuccess ? String(activeRuns.length) : "—"}
        />
        <StatCard
          icon={<DollarSign className="h-5 w-5 text-ink" />}
          title="Running P/L"
          subtitle={
            accountFilter === "demo"
              ? "Realised, demo bots"
              : accountFilter === "real"
                ? "Realised, real bots"
                : "Realised, across running bots"
          }
          value={runsQuery.isSuccess && runningPnl !== null ? formatMoney(runningPnl) : "—"}
          tone={runsQuery.isSuccess && runningPnl !== null ? decimalSign(runningPnl) : 0}
        />
      </div>

      <article className="bg-surface border border-line rounded-2xl p-6 text-center sm:p-14">
        <img src="/assets/fxnod-mark.png" alt="" className="mx-auto h-10 w-10 object-contain opacity-40 mb-5 dark:invert-0 invert" />
        <h3 className="font-display text-lg font-semibold mb-2 text-ink">No Blockly. No theory.</h3>
        <p className="text-sm text-ink-3 max-w-md mx-auto leading-relaxed mb-6">
          Pick a ready bot, read its one-line summary, then practise on demo. Or build your own in
          plain language, or import a bot someone shared with you.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={"/dbot/build" as Route}
            className="w-full sm:w-auto inline-flex h-10 items-center justify-center px-5 rounded-lg bg-ink text-surface text-sm font-medium hover:opacity-80 transition"
          >
            Create a bot
          </Link>
          <button
            type="button"
            onClick={() => setPackageModal({ tab: "import" })}
            className="h-10 px-5 rounded-lg border border-line text-sm text-ink-3 hover:text-ink transition w-full sm:w-auto"
          >
            Import
          </button>
        </div>
      </article>

      <div className="space-y-4">
        <SectionTitle title="Running now" subtitle="These keep trading when you close the page." />
        {runsQuery.isError ? (
          <EmptyPanel text="Could not load running bots. The trading engine may be unavailable." />
        ) : runsQuery.isPending ? (
          <EmptyPanel text="Loading…" />
        ) : activeRuns.length === 0 ? (
          <EmptyPanel
            text={
              accountFilter === "demo"
                ? "No demo bots running."
                : accountFilter === "real"
                  ? "No real bots running."
                  : "No bots running. Press Run on a saved bot and confirm the Deriv account."
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeRuns.map((run) => (
              <article key={run.run_id} className="bg-surface border border-line rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold truncate text-ink">{strategyName(run.strategy_id)}</h3>
                    <p className="text-xs text-ink-3 truncate">{run.symbols.map(marketName).join(", ")}</p>
                  </div>
                  <AccountBadge isVirtual={run.is_virtual} />
                </div>
                <dl className="grid grid-cols-3 gap-3 text-sm">
                  <Figure label="Status" value={run.status} />
                  <Figure label="Trades" value={`${run.trades_won}W / ${run.trades_lost}L`} />
                  <Figure label="P/L" value={formatMoney(run.realized_pnl)} tone={decimalSign(run.realized_pnl)} />
                </dl>
                <div className="flex gap-2">
                  <Link
                    href={`/dbot/runs/${run.run_id}` as Route}
                    className="flex-1 inline-flex h-10 items-center justify-center rounded-lg bg-ink text-surface text-sm font-medium hover:opacity-80 transition"
                  >
                    Watch
                  </Link>
                  <button
                    type="button"
                    disabled={run.status === "stopping" || stopRun.isPending || forceStop.isPending}
                    onClick={() => handleStop(run)}
                    className="h-10 px-4 rounded-lg border border-red-500/50 text-sm text-red-300 hover:bg-red-500/10 transition disabled:opacity-45"
                  >
                    {run.status === "stopping" ? "Stopping…" : "Stop"}
                  </button>
                </div>
                <div className="flex justify-end -mt-1">
                  <EmergencyStopButton busy={forceStop.isPending} onConfirm={() => handleForceStop(run)} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <SectionTitle title="Saved bots" subtitle="Saved to your account, on every device." />
        {presetsQuery.isError ? (
          <EmptyPanel text="Could not load your saved bots." />
        ) : presetsQuery.isPending ? (
          <EmptyPanel text="Loading…" />
        ) : presets.length === 0 ? (
          <EmptyPanel text="No saved bots yet. Create one, or start from a template below." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {presets.map((preset) => {
              const draft = draftFromPreset(preset);
              const strategyId = draft ? strategyIdFor(draft) : undefined;
              return (
                <article
                  key={preset.id}
                  className={cn(
                    "bg-surface border border-line rounded-2xl p-5 flex flex-col justify-between relative",
                    openMenuId === preset.id && "z-20",
                  )}
                >
                  <div>
                    <div className="flex justify-between items-start gap-3 mb-1">
                      <h3 className="font-display text-lg font-semibold break-words text-ink">{preset.name}</h3>
                      <span className="text-xs text-ink-3 shrink-0">
                        {new Date(preset.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-ink-3 mb-4">
                      {draft
                        ? [findMethod(draft.method)?.name, draft.form.symbols.map(marketName).join(", ")]
                            .filter(Boolean)
                            .join(" · ")
                        : strategyName(preset.strategy_id)}
                    </p>
                    {draft && (
                      <p className="text-sm text-ink-2 mb-6">
                        {[
                          ENTRY_RULES.find((r) => r.key === draft.entryRule)?.name,
                          MONEY_OPTIONS.find((m) => m.key === draft.money)?.name,
                          `stake $${draft.form.stake}`,
                          `stops at −$${draft.form.sessionStopLoss}`,
                        ].join(" · ")}
                      </p>
                    )}
                  </div>

                  {confirmRemove === preset.id ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-ink-2 mr-auto">Remove this bot?</span>
                      <button
                        type="button"
                        disabled={deletePreset.isPending}
                        onClick={() => handleRemove(preset)}
                        className="h-10 px-4 rounded-lg bg-red-500 text-white text-sm font-medium disabled:opacity-50"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmRemove(null)}
                        className="h-10 px-4 rounded-lg bg-surface-2 text-ink text-sm font-medium hover:bg-line transition"
                      >
                        Keep
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={!draft || strategiesQuery.isPending}
                        onClick={() => setRunPreset(preset)}
                        className="flex-1 h-10 rounded-lg bg-ink text-surface text-sm font-medium hover:opacity-80 transition disabled:opacity-45"
                      >
                        Run
                      </button>
                      <SavedBotMenu
                        open={openMenuId === preset.id}
                        canOpen={Boolean(draft)}
                        canExport={Boolean(draft && strategyId)}
                        onOpenChange={(open) => setOpenMenuId(open ? preset.id : null)}
                        onOpen={() => router.push(`/dbot/build?preset=${preset.id}&step=review` as Route)}
                        onEdit={() => router.push(`/dbot/build?preset=${preset.id}` as Route)}
                        onExport={() => {
                          if (draft && strategyId) setPackageModal({ tab: "export", draft, strategyId });
                        }}
                        onRemove={() => setConfirmRemove(preset.id)}
                      />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {(endedQuery.data?.runs ?? []).length > 0 && (
        <div className="space-y-4">
          <SectionTitle title="Recent runs" subtitle="Finished sessions, newest first." />
          {finishedRuns.length === 0 ? (
            <EmptyPanel text={accountFilter === "real" ? "No finished real runs." : "No finished demo runs."} />
          ) : (
          <div className="bg-surface border border-line rounded-2xl divide-y divide-line overflow-hidden">
            {finishedRuns.map((run) => (
              <Link
                key={run.run_id}
                href={`/dbot/runs/${run.run_id}` as Route}
                className="flex flex-col gap-1.5 px-4 py-3 transition-colors hover:bg-surface-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 sm:px-5"
              >
                <span className="text-sm text-ink font-medium min-w-0 truncate">
                  {strategyName(run.strategy_id)}
                </span>
                <AccountBadge isVirtual={run.is_virtual} />
                <span className="text-xs text-ink-3 truncate">{run.symbols.map(marketName).join(", ")}</span>
                <span className="text-xs text-ink-3 sm:ml-auto">
                  {new Date(run.created_at).toLocaleString()}
                </span>
                <span className="text-xs text-ink-3">
                  {run.trades_won}W / {run.trades_lost}L
                </span>
                <span
                  className={cn(
                    "text-sm font-semibold tabular-nums min-w-[5rem] text-right",
                    decimalSign(run.realized_pnl) < 0
                      ? "text-red-400"
                      : decimalSign(run.realized_pnl) > 0
                        ? "text-emerald-400"
                        : "text-ink-2",
                  )}
                >
                  {formatMoney(run.realized_pnl)}
                </span>
              </Link>
            ))}
          </div>
          )}
        </div>
      )}

      <div className="mt-12">
        <h2 className="font-display text-xl font-semibold mb-1 text-ink">Bot templates</h2>
        <p className="text-sm text-ink-3 mb-6">Each one is already filled in. You can change anything before you run.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {BOT_TEMPLATES.map((template) => {
            const available = strategiesQuery.isSuccess && isTemplateAvailable(template, strategies);
            const body = (
              <article
                className={cn(
                  "w-full h-full bg-surface border border-line rounded-2xl p-5 transition flex flex-col",
                  available ? "hover:border-ink cursor-pointer" : "opacity-50",
                )}
              >
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className="font-display text-base font-semibold leading-snug text-ink">{template.title}</h3>
                  <span className="text-[11px] text-ink-3 shrink-0 mt-0.5">
                    {available || strategiesQuery.isPending ? template.badge : "Coming soon"}
                  </span>
                </div>
                <p className="text-sm text-ink-2 leading-relaxed mt-auto">{template.description}</p>
              </article>
            );
            return available ? (
              <Link key={template.id} href={`/dbot/build?template=${template.id}` as Route} className="flex">
                {body}
              </Link>
            ) : (
              <div key={template.id} className="flex" aria-disabled="true">
                {body}
              </div>
            );
          })}
        </div>
      </div>

      {runPreset && (
        <RunSavedBotDialog
          botName={runPreset.name}
          accounts={accountsQuery.data?.accounts ?? []}
          loading={accountsQuery.isPending}
          busy={startRun.isPending || selectAccount.isPending}
          onClose={() => {
            if (!startRun.isPending && !selectAccount.isPending) setRunPreset(null);
          }}
          onConfirm={(account, acknowledged) => void handleRun(runPreset, account, acknowledged)}
        />
      )}

      <div data-app="options" data-opt-theme="dark" className="contents">
        <DerivAppConsentModal
          appKey={consent?.appKey ?? null}
          returnTo={consent?.returnTo ?? "/dbot"}
          onClose={() => setConsent(null)}
        />
      </div>

      {packageModal && (
        // The modal is styled for the options scope; give it that scope here.
        <div data-app="options" data-opt-theme="dark" className="contents">
          <BotPackageModal
            isOpen
            onClose={() => setPackageModal(null)}
            initialTab={packageModal.tab}
            strategyId={packageModal.tab === "export" ? packageModal.strategyId : ""}
            currentState={
              packageModal.tab === "export"
                ? { ...packageModal.draft.form, martingaleEnabled: packageModal.draft.money === "martingale" }
                : defaultFormState()
            }
            extraConfig={
              packageModal.tab === "export"
                ? toPresetRequest(packageModal.draft, packageModal.strategyId).config
                : undefined
            }
            onLoadConfig={() => undefined}
          />
        </div>
      )}
    </section>
  );
}

function StatCard({
  icon,
  title,
  subtitle,
  value,
  tone = 0,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  tone?: -1 | 0 | 1;
}) {
  return (
    <article className="bg-surface border border-line rounded-2xl p-5 flex flex-col">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-lg border border-line bg-surface-2 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-ink">{title}</h3>
          <p className="text-xs text-ink-3">{subtitle}</p>
        </div>
      </div>
      <div className="mt-auto">
        <span
          className={cn(
            "text-2xl font-semibold",
            tone < 0 ? "text-red-400" : tone > 0 ? "text-emerald-400" : "text-ink",
          )}
        >
          {value}
        </span>
      </div>
    </article>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-lg font-medium text-ink">{title}</h2>
      <p className="text-sm text-ink-3">{subtitle}</p>
    </div>
  );
}

function EmptyPanel({ text }: { text: string }) {
  return (
    <div className="bg-surface border border-line rounded-2xl p-8 flex items-center justify-center text-center">
      <p className="text-sm text-ink-2">{text}</p>
    </div>
  );
}

function Figure({ label, value, tone = 0 }: { label: string; value: string; tone?: -1 | 0 | 1 }) {
  return (
    <div>
      <dt className="text-xs text-ink-3">{label}</dt>
      <dd
        className={cn(
          "break-words font-semibold capitalize",
          tone < 0 ? "text-red-400" : tone > 0 ? "text-emerald-400" : "text-ink",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function consentRequired(err: unknown): string | null {
  const data = (err as { response?: { status?: number; data?: BotStartConflict } })?.response;
  if (data?.status !== 409 || data.data?.code !== BotStartConflictCode.deriv_app_consent_required) {
    return null;
  }
  return data.data.app_key ?? null;
}

function SavedBotMenu({
  open,
  canOpen,
  canExport,
  onOpenChange,
  onOpen,
  onEdit,
  onExport,
  onRemove,
}: {
  open: boolean;
  canOpen: boolean;
  canExport: boolean;
  onOpenChange: (open: boolean) => void;
  onOpen: () => void;
  onEdit: () => void;
  onExport: () => void;
  onRemove: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) onOpenChangeRef.current(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onOpenChangeRef.current(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const items: { label: string; disabled: boolean; danger?: boolean; onClick: () => void }[] = [
    { label: "Open", disabled: !canOpen, onClick: onOpen },
    { label: "Edit", disabled: !canOpen, onClick: onEdit },
    { label: "Export", disabled: !canExport, onClick: onExport },
    { label: "Remove", disabled: false, danger: true, onClick: onRemove },
  ];

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-label="Bot actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
        className={cn(
          "h-10 w-10 rounded-lg bg-surface-2 text-ink-2 hover:text-ink hover:bg-line transition flex items-center justify-center",
          open && "bg-line text-ink",
        )}
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1.5 min-w-[9.5rem] overflow-hidden rounded-xl border border-line bg-surface-2 py-1 shadow-lg"
        >
          {items.map((item, index) => (
            <div key={item.label}>
              {item.danger && index > 0 && <div className="my-1 border-t border-line" />}
              <button
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  onOpenChange(false);
                  item.onClick();
                }}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm transition disabled:pointer-events-none disabled:opacity-40",
                  item.danger ? "text-red-300 hover:bg-red-500/10" : "text-ink hover:bg-line/70",
                )}
              >
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AccountFilterControl({
  value,
  onChange,
}: {
  value: AccountFilter;
  onChange: (next: AccountFilter) => void;
}) {
  const options: { id: AccountFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "demo", label: "Demo" },
    { id: "real", label: "Real" },
  ];
  return (
    <div className="inline-flex rounded-lg border border-line p-0.5" role="group" aria-label="Account type">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
          className={cn(
            "h-8 px-3 rounded-md text-xs font-medium transition",
            value === option.id ? "bg-ink text-surface" : "text-ink-2 hover:text-ink",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function AccountBadge({ isVirtual }: { isVirtual: boolean }) {
  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider shrink-0",
        isVirtual ? "bg-surface-2 text-ink" : "bg-amber-400 text-black",
      )}
    >
      {isVirtual ? "Demo" : "Real"}
    </span>
  );
}
