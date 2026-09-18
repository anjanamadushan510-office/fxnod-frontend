"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { type Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SubscriptionGateModal } from "@/components/bot/SubscriptionGateModal";
import { useMarketStore } from "@/components/options/market/marketStore";
import { findMethod } from "@/components/bot/builder/catalog";
import {
  buildDraftRunRequest,
  draftFromPreset,
  draftProblems,
  newDraft,
  stepsFor,
  strategyIdFor,
  toPresetRequest,
  type BotDraft,
  type StepKey,
} from "@/components/bot/builder/draft";
import { RunPanel } from "@/components/bot/builder/RunPanel";
import {
  DurationStep,
  EntryRuleStep,
  IndicatorsStep,
  MarketsStep,
  MethodStep,
  MoneyStep,
  ReviewStep,
  SetupStep,
} from "@/components/bot/builder/steps";
import { findTemplate } from "@/components/bot/builder/templates";
import { useMarketsForStrategy } from "@/hooks/useMarketsForStrategy";
import { parseApiError } from "@/lib/apiError";
import {
  getListBotPresetsQueryKey,
  getListBotRunsQueryKey,
  useCreateBotPreset,
  useDeleteBotPreset,
  useGetBotLimits,
  useGetBotPreset,
  useListBotStrategies,
  useStartBotRun,
  useUpdateBotPreset,
} from "@/services/api/endpoints/bots/bots";

/**
 * /dbot/build — create or edit a bot, step by step.
 *
 *   ?preset=<id>     edit a saved bot (opens on Review with &step=review)
 *   ?template=<id>   start from a ready-made bot
 *   (neither)        start blank
 *
 * A bot is saved to the user's account as a preset, the same record the dBot
 * workspace reads, and runs through the same start endpoint — so nothing here
 * can start a run the workspace could not.
 */
export default function BotBuilderPage() {
  // useSearchParams needs a Suspense boundary, or the route cannot prerender.
  return (
    <Suspense fallback={null}>
      <BotBuilder />
    </Suspense>
  );
}

function BotBuilder() {
  const router = useRouter();
  const params = useSearchParams();
  const queryClient = useQueryClient();

  const presetId = params.get("preset");
  const templateId = params.get("template");

  const strategiesQuery = useListBotStrategies();
  const limitsQuery = useGetBotLimits();
  const presetQuery = useGetBotPreset(presetId ?? "", {
    query: { enabled: Boolean(presetId), retry: false },
  });
  const strategies = useMemo(
    () => strategiesQuery.data?.strategies ?? [],
    [strategiesQuery.data],
  );

  const [draft, setDraft] = useState<BotDraft | null>(() => {
    if (presetId) return null; // filled once the preset loads
    return findTemplate(templateId ?? "")?.build() ?? newDraft();
  });
  // The preset this draft is saved as, and the strategy it was saved under —
  // a preset's strategy cannot be changed in place.
  const [saved, setSaved] = useState<{ id: string; strategyId: string } | null>(null);
  const [step, setStep] = useState<StepKey>(
    presetId && params.get("step") === "review" ? "review" : "method",
  );
  const [gateReason, setGateReason] = useState<string | null>(null);

  useEffect(() => {
    if (!presetQuery.data || draft) return;
    const restored = draftFromPreset(presetQuery.data);
    if (restored) {
      setDraft(restored);
      setSaved({ id: presetQuery.data.id, strategyId: presetQuery.data.strategy_id });
    }
  }, [presetQuery.data, draft]);

  const createPreset = useCreateBotPreset();
  const updatePreset = useUpdateBotPreset();
  const deletePreset = useDeleteBotPreset();
  const startRun = useStartBotRun();
  const saving = createPreset.isPending || updatePreset.isPending;

  // Loaded here rather than only on the Markets step: a saved bot opens straight
  // on Review, and the start request checks every symbol against this store.
  const markets = useMarketsForStrategy((draft && strategyIdFor(draft)) ?? "");
  const allMarkets = useMarketStore((s) => s.allMarkets);
  const marketNames = useMemo(() => {
    const byId = new Map(allMarkets.map((m) => [m.id, m.name]));
    return (draft?.form.symbols ?? []).map((id) => byId.get(id) ?? id);
  }, [allMarkets, draft?.form.symbols]);

  // ── Loading and failure states ──────────────────────────────────────────
  if (presetId && presetQuery.isError) {
    return (
      <Shell>
        <Notice
          title="This bot could not be opened"
          body="It may have been removed, or it belongs to another account."
        />
      </Shell>
    );
  }
  if (presetId && presetQuery.data && !draftFromPreset(presetQuery.data)) {
    return (
      <Shell>
        <Notice
          title="This bot uses a method the builder does not support"
          body="It was saved by an older version. Create a new bot, or remove this one."
        />
      </Shell>
    );
  }
  if (!draft) {
    return (
      <Shell>
        <p className="text-sm text-zinc-500">Loading bot…</p>
      </Shell>
    );
  }

  const strategy = strategies.find((s) => s.strategy_id === strategyIdFor(draft));
  const problems = strategiesQuery.isSuccess ? draftProblems(draft, strategies) : [];
  const ready = strategiesQuery.isSuccess && !markets.loading && problems.length === 0;

  // ── Actions ─────────────────────────────────────────────────────────────

  /** Saves the draft and returns the preset id, or null if it failed. */
  async function save(current: BotDraft): Promise<string | null> {
    const strategyId = strategyIdFor(current);
    if (!strategyId) return null;
    const body = toPresetRequest(current, strategyId);
    try {
      let id: string;
      if (saved && saved.strategyId === strategyId) {
        await updatePreset.mutateAsync({
          presetId: saved.id,
          data: { name: body.name, config: body.config },
        });
        id = saved.id;
      } else {
        const created = await createPreset.mutateAsync({ data: body });
        id = created.id;
        // Changing method moved the bot to another strategy. The new preset is
        // saved first, so a failed delete leaves a duplicate, never a loss.
        if (saved) await deletePreset.mutateAsync({ presetId: saved.id }).catch(() => undefined);
      }
      setSaved({ id, strategyId });
      await queryClient.invalidateQueries({ queryKey: getListBotPresetsQueryKey() });
      return id;
    } catch (err) {
      toast.error(parseApiError(err, "Could not save the bot.").message);
      return null;
    }
  }

  async function handleSave() {
    if (await save(draft!)) {
      toast.success("Bot saved");
      router.push("/dbot" as Route);
    }
  }

  async function handleRun(riskAcknowledged: boolean) {
    const current = draft!;
    const { request, errors } = buildDraftRunRequest(current, strategies, riskAcknowledged);
    if (!request) {
      toast.error(errors[0] ?? "This bot is not ready to run.");
      return;
    }
    if (!(await save(current))) return;

    try {
      const res = await startRun.mutateAsync({ data: request });
      const adjustments = res.limit_adjustments ?? [];
      if (adjustments.length > 0) {
        // The user would otherwise believe their own numbers were honoured.
        toast.warning(
          "The platform capped: " +
            adjustments.map((a) => `${a.field} ${a.requested} → ${a.applied}`).join(", "),
          { duration: 10_000 },
        );
      }
      await queryClient.invalidateQueries({ queryKey: getListBotRunsQueryKey() });
      router.push((res.run ? `/dbot/runs/${res.run.run_id}` : "/dbot") as Route);
    } catch (err) {
      const reason = subscriptionRefusal(err);
      if (reason) {
        setGateReason(reason);
        return;
      }
      toast.error(parseApiError(err, "The bot could not be started.").message);
    }
  }

  const methodChosen = Boolean(findMethod(draft.method)?.strategyId);
  // Steps depend on the method: digit bots have no Duration or Indicators step.
  const steps = stepsFor(draft);
  const index = Math.max(0, steps.findIndex((s) => s.key === step));
  const current = steps[index].key;

  return (
    <Shell>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6" role="tablist">
        {steps.map((s, i) => {
          const active = current === s.key;
          return (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setStep(s.key)}
              className={`h-8 px-4 rounded-full border text-sm flex items-center gap-2 whitespace-nowrap transition bg-transparent ${
                active ? "border-ink text-ink" : "border-line text-ink-3 hover:text-ink hover:border-ink-3"
              }`}
            >
              <span
                className={
                  active
                    ? "bg-ink text-surface h-5 w-5 rounded-full flex items-center justify-center text-xs font-semibold"
                    : "border border-line text-ink-3 h-5 w-5 rounded-full flex items-center justify-center text-xs"
                }
              >
                {i + 1}
              </span>
              {s.label}
            </button>
          );
        })}
      </div>

      {strategiesQuery.isError && (
        <div role="alert" className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
          Could not load the available bots. The trading engine may be unavailable — try again shortly.
        </div>
      )}

      <div className="flex-1 pb-24">
        {current === "method" && (
          <MethodStep draft={draft} onChange={setDraft} strategies={strategies} loading={strategiesQuery.isPending} />
        )}
        {current === "markets" && <MarketsStep draft={draft} onChange={setDraft} />}
        {current === "duration" && <DurationStep draft={draft} onChange={setDraft} />}
        {current === "indicators" && <IndicatorsStep draft={draft} onChange={setDraft} strategy={strategy} />}
        {current === "setup" && <SetupStep draft={draft} onChange={setDraft} strategy={strategy} />}
        {current === "entry" && <EntryRuleStep draft={draft} onChange={setDraft} strategy={strategy} />}
        {current === "money" && <MoneyStep draft={draft} onChange={setDraft} limits={limitsQuery.data} />}
        {current === "review" && (
          <ReviewStep draft={draft} onChange={setDraft} marketNames={marketNames} problems={problems}>
            <RunPanel
              ready={ready}
              saving={saving}
              starting={startRun.isPending}
              saved={Boolean(saved)}
              onSave={handleSave}
              onRun={handleRun}
            />
          </ReviewStep>
        )}
      </div>

      <div className="sticky bottom-0 z-30 -mx-4 lg:-mx-8 px-4 lg:px-8 py-3.5 bg-bg/95 backdrop-blur-md border-t border-line flex items-center justify-start gap-3 mt-auto">
        <button
          type="button"
          onClick={() => setStep(steps[Math.max(0, index - 1)].key)}
          disabled={index === 0}
          className="h-10 px-6 rounded-lg bg-surface-2 border border-line text-sm font-medium text-ink-3 hover:text-ink disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Back
        </button>
        {index < steps.length - 1 && (
          <button
            type="button"
            onClick={() => setStep(steps[index + 1].key)}
            disabled={current === "method" && !methodChosen}
            className="h-10 px-6 rounded-lg bg-ink text-surface text-sm font-medium hover:opacity-80 disabled:opacity-50 transition"
          >
            Continue
          </button>
        )}
      </div>

      {/* The modal is styled for the options scope; give it that scope here. */}
      <div data-app="options" data-opt-theme="dark" className="contents">
        <SubscriptionGateModal
          open={gateReason !== null}
          reason={gateReason ?? undefined}
          onClose={() => setGateReason(null)}
        />
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex-1 flex flex-col bg-bg text-ink p-4 lg:p-8 h-full">
      <Link href={"/dbot" as Route} className="text-xs text-ink-3 hover:text-ink mb-4 block w-fit">
        &larr; Bots
      </Link>
      {children}
    </div>
  );
}

function Notice({
  title,
  body,
  href = "/dbot",
  cta = "Back to bots",
}: {
  title: string;
  body: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="bg-surface border border-line rounded-2xl p-8 text-center max-w-lg">
      <h2 className="font-display text-lg font-semibold mb-2 text-ink">{title}</h2>
      <p className="text-sm text-ink-3 mb-5">{body}</p>
      <Link
        href={href as Route}
        className="inline-flex h-10 items-center px-5 rounded-lg bg-ink text-surface text-sm font-medium hover:opacity-80"
      >
        {cta}
      </Link>
    </div>
  );
}

/**
 * A refusal the pricing page answers, as opposed to a real error. The engine
 * returns its reason codes verbatim; a 403 also covers an unlinked account and
 * a missing risk acknowledgement, which no subscription fixes.
 */
function subscriptionRefusal(err: unknown): string | null {
  const detail = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
  if (typeof detail !== "string") return null;
  return (
    ["no_subscription", "subscription_expired", "subscription_cancelled"].find((r) =>
      detail.includes(r),
    ) ?? null
  );
}
