"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { type Route } from "next";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Activity, Cpu, DollarSign } from "lucide-react";
import { BotPackageModal } from "@/components/bot/BotPackageModal";
import { defaultFormState } from "@/components/bot/formState";
import {
  ENTRY_RULES,
  MONEY_OPTIONS,
  findMethod,
} from "@/components/bot/builder/catalog";
import {
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
import {
  getListBotPresetsQueryKey,
  getListBotRunsQueryKey,
  useDeleteBotPreset,
  useListBotPresets,
  useListBotRuns,
  useListBotStrategies,
  useStopBotRun,
} from "@/services/api/endpoints/bots/bots";
import type { BotPreset, BotRun } from "@/services/api/model";

const RUNS_PARAMS = { limit: 50 } as const;
const ACTIVE_STATUSES = new Set(["pending", "running", "paused", "stopping"]);

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
  const runsQuery = useListBotRuns(RUNS_PARAMS, { query: { refetchInterval: 5000 } });
  const stopRun = useStopBotRun();
  const deletePreset = useDeleteBotPreset();

  const [packageModal, setPackageModal] = useState<PackageModalState | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  const strategies = useMemo(() => strategiesQuery.data?.strategies ?? [], [strategiesQuery.data]);
  const presets = useMemo(() => presetsQuery.data?.presets ?? [], [presetsQuery.data]);
  const activeRuns = useMemo(
    () => (runsQuery.data?.runs ?? []).filter((r) => ACTIVE_STATUSES.has(r.status)),
    [runsQuery.data],
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
      <div>
        <h1 className="text-2xl font-semibold text-ink">dBot</h1>
        <p className="text-sm text-ink-2 mt-1">Build a bot in plain language</p>
      </div>

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
          subtitle="Demo or real"
          value={runsQuery.isSuccess ? String(activeRuns.length) : "—"}
        />
        <StatCard
          icon={<DollarSign className="h-5 w-5 text-ink" />}
          title="Running P/L"
          subtitle="Realised, across running bots"
          value={runsQuery.isSuccess && runningPnl !== null ? formatMoney(runningPnl) : "—"}
          tone={runsQuery.isSuccess && runningPnl !== null ? decimalSign(runningPnl) : 0}
        />
      </div>

      <article className="bg-panel border border-line rounded-2xl p-10 sm:p-14 text-center">
        <img src="/assets/fxnod-mark.png" alt="" className="mx-auto h-10 w-10 object-contain opacity-40 mb-5" />
        <h3 className="font-display text-lg font-semibold mb-2">No Blockly. No theory.</h3>
        <p className="text-sm text-zinc-500 max-w-md mx-auto leading-relaxed mb-6">
          Pick a ready bot, read its one-line summary, then practise on demo. Or build your own in
          plain language, or import a bot someone shared with you.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={"/dbot/build" as Route}
            className="w-full sm:w-auto inline-flex h-10 items-center justify-center px-5 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200"
          >
            Create a bot
          </Link>
          <button
            type="button"
            onClick={() => setPackageModal({ tab: "import" })}
            className="h-10 px-5 rounded-lg border border-line text-sm text-zinc-300 hover:text-white w-full sm:w-auto"
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
          <EmptyPanel text="No bots running. Open a saved bot and press Practise or Run." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeRuns.map((run) => (
              <article key={run.run_id} className="bg-panel border border-line rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold truncate">{strategyName(run.strategy_id)}</h3>
                    <p className="text-xs text-zinc-500 truncate">{run.symbols.map(marketName).join(", ")}</p>
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
                    href={"/options/dbot" as Route}
                    className="flex-1 inline-flex h-10 items-center justify-center rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition"
                  >
                    Watch
                  </Link>
                  <button
                    type="button"
                    disabled={run.status === "stopping" || stopRun.isPending}
                    onClick={() => handleStop(run)}
                    className="h-10 px-4 rounded-lg border border-red-500/50 text-sm text-red-300 hover:bg-red-500/10 transition disabled:opacity-45"
                  >
                    {run.status === "stopping" ? "Stopping…" : "Stop"}
                  </button>
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
                <article key={preset.id} className="bg-panel border border-line rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-3 mb-1">
                      <h3 className="font-display text-lg font-semibold break-words">{preset.name}</h3>
                      <span className="text-xs text-zinc-500 shrink-0">
                        {new Date(preset.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mb-4">
                      {draft
                        ? [findMethod(draft.method)?.name, draft.form.symbols.map(marketName).join(", ")]
                            .filter(Boolean)
                            .join(" · ")
                        : strategyName(preset.strategy_id)}
                    </p>
                    {draft && (
                      <p className="text-sm text-zinc-300 mb-6">
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
                      <span className="text-sm text-zinc-300 mr-auto">Remove this bot?</span>
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
                        className="h-10 px-4 rounded-lg border border-line text-sm text-zinc-300"
                      >
                        Keep
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={!draft}
                        onClick={() => router.push(`/dbot/build?preset=${preset.id}&step=review` as Route)}
                        className="flex-1 h-10 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition disabled:opacity-45"
                      >
                        Open
                      </button>
                      <button
                        type="button"
                        disabled={!draft}
                        onClick={() => router.push(`/dbot/build?preset=${preset.id}` as Route)}
                        className="h-10 px-4 rounded-lg border border-line text-sm text-zinc-300 hover:text-white transition disabled:opacity-45"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={!draft || !strategyId}
                        onClick={() => {
                          if (draft && strategyId) setPackageModal({ tab: "export", draft, strategyId });
                        }}
                        className="h-10 px-4 rounded-lg border border-line text-sm text-zinc-300 hover:text-white transition disabled:opacity-45"
                      >
                        Export
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmRemove(preset.id)}
                        className="h-10 px-4 rounded-lg border border-line text-sm text-zinc-300 hover:text-white transition"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-12">
        <h2 className="font-display text-xl font-semibold mb-1">Bot templates</h2>
        <p className="text-sm text-zinc-500 mb-6">Each one is already filled in. You can change anything before you run.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {BOT_TEMPLATES.map((template) => {
            const available = strategiesQuery.isSuccess && isTemplateAvailable(template, strategies);
            const body = (
              <article
                className={cn(
                  "w-full h-full bg-panel border border-line rounded-2xl p-5 transition flex flex-col",
                  available ? "surface-hover cursor-pointer" : "opacity-50",
                )}
              >
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className="font-display text-base font-semibold leading-snug">{template.title}</h3>
                  <span className="text-[11px] text-zinc-500 shrink-0 mt-0.5">
                    {available || strategiesQuery.isPending ? template.badge : "Coming soon"}
                  </span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed mt-auto">{template.description}</p>
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
      <dt className="text-xs text-zinc-500">{label}</dt>
      <dd
        className={cn(
          "font-semibold capitalize",
          tone < 0 ? "text-red-400" : tone > 0 ? "text-emerald-400" : "text-white",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function AccountBadge({ isVirtual }: { isVirtual: boolean }) {
  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider shrink-0",
        isVirtual ? "bg-zinc-700 text-zinc-200" : "bg-amber-400 text-black",
      )}
    >
      {isVirtual ? "Demo" : "Real"}
    </span>
  );
}
