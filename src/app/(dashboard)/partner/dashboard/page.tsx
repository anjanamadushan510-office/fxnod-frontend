"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Users } from "lucide-react";
import { cn } from "@/lib/cn";
import { isZero, levelMeaning, levelName, money, pendingExplanation, productName } from "@/lib/partner";
import { useGetCommissionHistory } from "@/services/api/endpoints/commissions/commissions";
import {
  useGetOrCreateReferralCode,
  useGetPartnerEarnings,
  useListPartners,
} from "@/services/api/endpoints/referrals/referrals";
import type {
  CommissionLedgerEntry,
  EarningsAmounts,
  PartnerNode,
} from "@/services/api/model";

/**
 * /partner/dashboard — what a partner has earned, and who earned it for them.
 *
 * The organising idea, and the reason this is not a list of numbers: a partner
 * asks two questions that are different axes.
 *
 *   WHO WAS I TO THEM   Affiliate (level 1, people you invited) versus master
 *                       affiliate (level 2, people they invited). This is the
 *                       split Anjana asked for, and it is a position in the
 *                       tree, not a role anyone is granted.
 *   WHAT DID THEY DO    A dBot subscription, trading markup, and whatever
 *                       FXNod sells next.
 *
 * Both get their own section, and the matrix underneath shows them crossed.
 * New products appear on their own: the server returns whatever source types
 * exist and this page names them, so shipping a paid service does not require
 * a frontend release to make its commission visible.
 *
 * What the page will not do is invent a figure. Every total is summed by the
 * server; nothing here adds decimal strings together, because parsing them to
 * add them makes them floats and a partner would find pennies missing.
 */

const HISTORY_PAGE_SIZE = 25;

export default function PartnerDashboardPage() {
  const codeMutation = useGetOrCreateReferralCode();
  const earningsQuery = useGetPartnerEarnings();
  const partnersQuery = useListPartners();

  const [levelFilter, setLevelFilter] = useState<number | undefined>();
  const [sourceFilter, setSourceFilter] = useState<string | undefined>();
  const historyQuery = useGetCommissionHistory({
    limit: HISTORY_PAGE_SIZE,
    level: levelFilter,
    source_type: sourceFilter,
  });

  // Get-or-create, so firing it on mount is safe: nobody should have to press
  // a button to be given their own invite link.
  const { mutate: ensureCode } = codeMutation;
  useEffect(() => {
    ensureCode();
  }, [ensureCode]);

  const earnings = earningsQuery.data;
  const partners = useMemo(
    () => partnersQuery.data?.items ?? [],
    [partnersQuery.data],
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <header className="mb-8">
        <h1 className="m-0 text-3xl font-extrabold tracking-tight text-[#0a0f1c]">
          Partner
        </h1>
        <p className="m-0 mt-2 font-medium text-[#0a0f1c]/60">
          What your team has earned you, and who earned it.
        </p>
      </header>

      <InviteLink code={codeMutation.data?.code ?? null} />

      {earningsQuery.isError ? (
        <Notice>Could not load your earnings. Please try again shortly.</Notice>
      ) : (
        <>
          <Headline
            amounts={earnings?.total}
            currency={earnings?.currency ?? "USD"}
            loading={earningsQuery.isPending}
          />

          <IncomeByLevel
            earnings={earnings}
            loading={earningsQuery.isPending}
          />

          <IncomeByProduct
            earnings={earnings}
            loading={earningsQuery.isPending}
          />

          <Matrix earnings={earnings} />
        </>
      )}

      <Team
        partners={partners}
        total={partnersQuery.data?.total ?? 0}
        earning={partnersQuery.data?.earning_count ?? 0}
        loading={partnersQuery.isPending}
        failed={partnersQuery.isError}
      />

      <History
        rows={historyQuery.data?.items ?? []}
        total={historyQuery.data?.total ?? 0}
        loading={historyQuery.isPending}
        failed={historyQuery.isError}
        levelFilter={levelFilter}
        sourceFilter={sourceFilter}
        levels={(earnings?.by_level ?? []).map((l) => l.level)}
        sources={(earnings?.by_source ?? []).map((s) => s.source_type)}
        onLevel={setLevelFilter}
        onSource={setSourceFilter}
      />
    </main>
  );
}

// ─── Invite link ─────────────────────────────────────────────────────────────

function InviteLink({ code }: { code: string | null }) {
  const [copied, setCopied] = useState(false);
  // Built in the browser from the live origin, so it is right in every
  // environment without a config value to keep in step.
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);

  const link = code ? `${origin}/auth/register?ref=${code}` : "";

  async function copy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Invite link copied");
    } catch {
      // Clipboard is blocked in some browsers without a user gesture chain.
      // The link is on screen and selectable, so this is a small failure.
      toast.error("Could not copy — select the link and copy it manually");
    }
  }

  return (
    <section className="rounded-3xl border border-[#c9a24e]/25 bg-white p-6 shadow-sm">
      <h2 className="m-0 text-xs font-bold uppercase tracking-wider text-[#0a0f1c]/40">
        Your invite link
      </h2>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <code className="min-w-0 flex-1 truncate rounded-xl bg-[#f8f6f0] px-4 py-3 font-mono text-sm text-[#0a0f1c]">
          {link || "Preparing your link…"}
        </code>
        <button
          type="button"
          onClick={copy}
          disabled={!link}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-3",
            "bg-[#0a0f1c] text-sm font-bold text-white transition-opacity",
            "hover:opacity-90 disabled:opacity-40",
          )}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="m-0 mt-3 text-xs text-[#0a0f1c]/50">
        Anyone who creates an FXNod account through this link is yours for the
        life of their account — including everything they buy later.
      </p>
    </section>
  );
}

// ─── Headline ────────────────────────────────────────────────────────────────

function Headline({
  amounts,
  currency,
  loading,
}: {
  amounts?: EarningsAmounts;
  currency: string;
  loading: boolean;
}) {
  if (loading) return <StatSkeleton />;

  return (
    <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Stat
        label="Paid out"
        value={money(amounts?.settled, currency)}
        tone="good"
      />
      <Stat
        label="Pending"
        value={money(amounts?.accrued, currency)}
        hint="Earned, not yet released"
      />
      <Stat
        label="On hold"
        value={money(amounts?.pending_review, currency)}
        // Part of Pending, not on top of it. Saying so stops a partner adding
        // the two columns together and expecting the sum.
        hint="Included in Pending, under review"
      />
      <Stat
        label="Cancelled"
        value={money(amounts?.cancelled, currency)}
        hint="Reversed, not payable"
      />
    </section>
  );
}

// ─── The two axes ────────────────────────────────────────────────────────────

function IncomeByLevel({
  earnings,
  loading,
}: {
  earnings?: { currency: string; by_level: { level: number; amounts: EarningsAmounts }[] };
  loading: boolean;
}) {
  if (loading) return null;
  const levels = earnings?.by_level ?? [];

  return (
    <Panel
      title="Where you sit"
      subtitle="Income you earned as the person who invited them, and as the person above that."
    >
      {levels.length === 0 ? (
        <Empty>
          Nothing yet. You earn here as soon as someone you invited subscribes
          or trades.
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {levels.map(({ level, amounts }) => (
            <div
              key={level}
              className="rounded-2xl border border-[#0a0f1c]/8 bg-[#f8f6f0] p-5"
            >
              <p className="m-0 text-sm font-bold text-[#0a0f1c]">
                {levelName(level)}
              </p>
              <p className="m-0 mt-0.5 text-xs text-[#0a0f1c]/50">
                {levelMeaning(level)}
              </p>
              <p className="m-0 mt-4 text-2xl font-extrabold tabular-nums text-[#0a0f1c]">
                {money(amounts.settled, earnings?.currency)}
              </p>
              <p className="m-0 mt-1 text-xs text-[#0a0f1c]/50">
                paid · {money(amounts.accrued, earnings?.currency)} pending
              </p>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

function IncomeByProduct({
  earnings,
  loading,
}: {
  earnings?: {
    currency: string;
    by_source: { source_type: string; amounts: EarningsAmounts }[];
  };
  loading: boolean;
}) {
  if (loading) return null;
  const sources = earnings?.by_source ?? [];

  return (
    <Panel
      title="What they bought"
      subtitle="Every paid product pays into the same tree. New ones appear here on their own."
    >
      {sources.length === 0 ? (
        <Empty>
          Nothing yet. dBot subscriptions and trading both earn you commission.
        </Empty>
      ) : (
        <ul className="m-0 list-none space-y-3 p-0">
          {sources.map(({ source_type, amounts }) => (
            <li
              key={source_type}
              className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl border border-[#0a0f1c]/8 bg-[#f8f6f0] px-5 py-4"
            >
              <span className="text-sm font-bold text-[#0a0f1c]">
                {productName(source_type)}
              </span>
              {!isZero(amounts.accrued) && (
                <span className="text-xs text-[#0a0f1c]/50">
                  {pendingExplanation(source_type)}
                </span>
              )}
              <span className="ml-auto text-right">
                <span className="block text-lg font-extrabold tabular-nums text-[#0a0f1c]">
                  {money(amounts.settled, earnings?.currency)}
                </span>
                <span className="block text-xs text-[#0a0f1c]/50">
                  {money(amounts.accrued, earnings?.currency)} pending
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

function Matrix({
  earnings,
}: {
  earnings?: {
    currency: string;
    by_level: { level: number }[];
    matrix: { source_type: string; level: number; amounts: EarningsAmounts }[];
  };
}) {
  const cells = earnings?.matrix ?? [];
  if (cells.length === 0) return null;

  const levels = [...new Set(cells.map((c) => c.level))].sort((a, b) => a - b);
  const sources = [...new Set(cells.map((c) => c.source_type))];
  const at = (source: string, level: number) =>
    cells.find((c) => c.source_type === source && c.level === level)?.amounts;

  return (
    <Panel
      title="Both at once"
      subtitle="Product down the side, your position across the top. Paid amounts."
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#0a0f1c]/10 text-left">
              <th scope="col" className="py-2 pr-4 text-xs font-bold uppercase tracking-wide text-[#0a0f1c]/40">
                Product
              </th>
              {levels.map((level) => (
                <th
                  key={level}
                  scope="col"
                  className="py-2 pl-4 text-right text-xs font-bold uppercase tracking-wide text-[#0a0f1c]/40"
                >
                  {levelName(level)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sources.map((source) => (
              <tr key={source} className="border-b border-[#0a0f1c]/5 last:border-b-0">
                <th
                  scope="row"
                  className="py-3 pr-4 text-left text-sm font-semibold text-[#0a0f1c]"
                >
                  {productName(source)}
                </th>
                {levels.map((level) => {
                  const amounts = at(source, level);
                  return (
                    <td
                      key={level}
                      className={cn(
                        "py-3 pl-4 text-right tabular-nums",
                        amounts ? "text-[#0a0f1c]" : "text-[#0a0f1c]/25",
                      )}
                    >
                      {/* An em dash, not $0.00: this level does not pay on this
                          product at all, which is different from earning nothing. */}
                      {amounts ? money(amounts.settled, earnings?.currency) : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

// ─── Team ────────────────────────────────────────────────────────────────────

function Team({
  partners,
  total,
  earning,
  loading,
  failed,
}: {
  partners: PartnerNode[];
  total: number;
  earning: number;
  loading: boolean;
  failed: boolean;
}) {
  return (
    <Panel
      title="Your team"
      subtitle={
        loading || failed
          ? "People who joined through you."
          : `${total} joined through you · ${earning} ${earning === 1 ? "has" : "have"} earned you something`
      }
    >
      {failed ? (
        <Empty>Could not load your team.</Empty>
      ) : loading ? (
        <Empty>Loading…</Empty>
      ) : partners.length === 0 ? (
        <Empty>
          Nobody yet. Share your invite link — anyone who signs up through it
          becomes yours permanently.
        </Empty>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#0a0f1c]/10 text-left">
                <Th>Person</Th>
                <Th>You are their</Th>
                <Th>Joined</Th>
                <Th>Earns you on</Th>
                <Th align="right">Earned you</Th>
              </tr>
            </thead>
            <tbody>
              {partners.map((person) => (
                <tr
                  key={person.user_id}
                  className="border-b border-[#0a0f1c]/5 last:border-b-0"
                >
                  <Td>
                    <span className="block font-semibold text-[#0a0f1c]">
                      {person.display_name ?? "New member"}
                    </span>
                    <span className="block text-xs text-[#0a0f1c]/45">
                      {person.email ?? "—"}
                      {person.email_masked && (
                        <span
                          className="ml-1"
                          title="Hidden because you did not invite this person directly"
                        >
                          (hidden)
                        </span>
                      )}
                    </span>
                  </Td>
                  <Td>
                    <span className="rounded-full bg-[#f8f6f0] px-2.5 py-1 text-xs font-bold text-[#0a0f1c]/70">
                      {levelName(person.level)}
                    </span>
                  </Td>
                  <Td className="whitespace-nowrap text-[#0a0f1c]/60">
                    {formatDate(person.joined_at)}
                  </Td>
                  <Td className="text-xs text-[#0a0f1c]/60">
                    {person.source_types.length === 0
                      ? "—"
                      : person.source_types.map(productName).join(", ")}
                  </Td>
                  <Td align="right">
                    <span className="block font-bold tabular-nums text-[#0a0f1c]">
                      {money(person.earned.settled)}
                    </span>
                    {!isZero(person.earned.accrued) && (
                      <span className="block text-xs text-[#0a0f1c]/45">
                        {money(person.earned.accrued)} pending
                      </span>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

// ─── History ─────────────────────────────────────────────────────────────────

function History({
  rows,
  total,
  loading,
  failed,
  levelFilter,
  sourceFilter,
  levels,
  sources,
  onLevel,
  onSource,
}: {
  rows: CommissionLedgerEntry[];
  total: number;
  loading: boolean;
  failed: boolean;
  levelFilter?: number;
  sourceFilter?: string;
  levels: number[];
  sources: string[];
  onLevel: (level: number | undefined) => void;
  onSource: (source: string | undefined) => void;
}) {
  return (
    <Panel
      title="Every commission"
      subtitle="Each line says who it came from and what they did."
    >
      {(levels.length > 1 || sources.length > 1) && (
        <div className="mb-4 flex flex-wrap gap-2">
          <Chip active={!sourceFilter && !levelFilter} onClick={() => { onSource(undefined); onLevel(undefined); }}>
            All
          </Chip>
          {sources.map((source) => (
            <Chip
              key={source}
              active={sourceFilter === source}
              onClick={() => onSource(sourceFilter === source ? undefined : source)}
            >
              {productName(source)}
            </Chip>
          ))}
          {levels.map((level) => (
            <Chip
              key={level}
              active={levelFilter === level}
              onClick={() => onLevel(levelFilter === level ? undefined : level)}
            >
              {levelName(level)}
            </Chip>
          ))}
        </div>
      )}

      {failed ? (
        <Empty>Could not load your commission history.</Empty>
      ) : loading ? (
        <Empty>Loading…</Empty>
      ) : rows.length === 0 ? (
        <Empty>
          {levelFilter || sourceFilter
            ? "Nothing matches this filter."
            : "No commission yet."}
        </Empty>
      ) : (
        <>
          <ul className="m-0 list-none space-y-2 p-0">
            {rows.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl border border-[#0a0f1c]/8 bg-[#f8f6f0] px-5 py-3"
              >
                <Users className="h-4 w-4 shrink-0 text-[#0a0f1c]/30" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-[#0a0f1c]">
                    {row.source_display_name ?? "A team member"}
                  </span>
                  <span className="block truncate text-xs text-[#0a0f1c]/45">
                    {productName(row.source_type)} · {levelName(row.level)}
                    {row.source_email ? ` · ${row.source_email}` : ""}
                  </span>
                </span>
                <span className="ml-auto text-right">
                  <span className="block font-bold tabular-nums text-[#0a0f1c]">
                    {money(row.commission_amount, row.currency)}
                  </span>
                  <span className="block text-xs text-[#0a0f1c]/45">
                    {statusLabel(row)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          {total > rows.length && (
            <p className="m-0 mt-4 text-xs text-[#0a0f1c]/45">
              Showing the {rows.length} most recent of {total}.
            </p>
          )}
        </>
      )}
    </Panel>
  );
}

/** Why a line is where it is — "pending" alone reads as "lost". */
function statusLabel(row: CommissionLedgerEntry): string {
  if (row.status === "settled") return "Paid";
  if (row.status === "cancelled") return "Cancelled";
  if (row.review_required) return "On hold — being checked";
  return pendingExplanation(row.source_type);
}

// ─── Pieces ──────────────────────────────────────────────────────────────────

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="m-0 text-lg font-extrabold tracking-tight text-[#0a0f1c]">
        {title}
      </h2>
      {subtitle && (
        <p className="m-0 mt-1 text-sm text-[#0a0f1c]/55">{subtitle}</p>
      )}
      <div className="mt-4 rounded-3xl border border-[#c9a24e]/20 bg-white p-6 shadow-sm">
        {children}
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "good";
}) {
  return (
    <div className="rounded-2xl border border-[#c9a24e]/20 bg-white p-5 shadow-sm">
      <p className="m-0 text-xs font-bold uppercase tracking-wider text-[#0a0f1c]/40">
        {label}
      </p>
      <p
        className={cn(
          "m-0 mt-1 text-2xl font-extrabold tabular-nums",
          tone === "good" ? "text-emerald-700" : "text-[#0a0f1c]",
        )}
      >
        {value}
      </p>
      {hint && <p className="m-0 mt-1 text-xs text-[#0a0f1c]/45">{hint}</p>}
    </div>
  );
}

function StatSkeleton() {
  return (
    <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-[104px] animate-pulse rounded-2xl border border-[#c9a24e]/20 bg-white"
        />
      ))}
    </section>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors",
        active
          ? "bg-[#0a0f1c] text-white"
          : "bg-[#f8f6f0] text-[#0a0f1c]/60 hover:text-[#0a0f1c]",
      )}
    >
      {children}
    </button>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 py-6 text-center text-sm text-[#0a0f1c]/45">{children}</p>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
      {children}
    </div>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      scope="col"
      className={cn(
        "py-2 pr-4 text-xs font-bold uppercase tracking-wide text-[#0a0f1c]/40",
        align === "right" && "pr-0 pl-4 text-right",
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "left",
  className,
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <td
      className={cn(
        "py-3 pr-4 align-top",
        align === "right" && "pr-0 pl-4 text-right",
        className,
      )}
    >
      {children}
    </td>
  );
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
