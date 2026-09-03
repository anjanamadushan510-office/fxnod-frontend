"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";
import { useGetCommissionHistory } from "@/services/api/endpoints/commissions/commissions";
import {
  useGetOrCreateReferralCode,
  useGetReferralStats,
  useGetReferralTree,
} from "@/services/api/endpoints/referrals/referrals";
import type {
  CommissionLedgerEntry,
  ReferralTreeNode,
} from "@/services/api/model";

/**
 * /referrals — an affiliate's own link, downline and earnings.
 *
 * Two things this page is careful about, because both cost trust:
 *
 *   It never invents a figure. Every total comes from the commission ledger,
 *   and where the API cannot say something — how much of a total is dBot versus
 *   trading beyond the fetched page — the page says so rather than estimating.
 *
 *   It distinguishes pending from paid, and says WHY something is pending.
 *   "Pending" with no reason reads as "lost"; a subscription commission is held
 *   for a few days and a trading one waits for the broker's monthly payout, and
 *   those are different answers to "when do I get this".
 */

const HISTORY_PAGE_SIZE = 50;

export default function ReferralsPage() {
  const codeMutation = useGetOrCreateReferralCode();
  const statsQuery = useGetReferralStats();
  const treeQuery = useGetReferralTree();
  const historyQuery = useGetCommissionHistory({ limit: HISTORY_PAGE_SIZE });

  // The code endpoint is get-or-create, so this is safe to fire once on mount:
  // an affiliate should not have to press a button to be given their own link.
  const { mutate: ensureCode } = codeMutation;
  useEffect(() => {
    ensureCode();
  }, [ensureCode]);

  const code = codeMutation.data?.code ?? null;
  const stats = statsQuery.data;
  const history = useMemo(
    () => historyQuery.data?.items ?? [],
    [historyQuery.data],
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <header className="mb-10">
        <h1 className="m-0 text-3xl font-extrabold tracking-tight text-[#0a0f1c]">
          Referrals
        </h1>
        <p className="mt-2 font-medium text-[#0a0f1c]/60">
          Invite people to FXNod and earn on what they trade and subscribe to.
        </p>
      </header>

      <InviteLink code={code} loading={codeMutation.isPending} />

      <section className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          label="Direct referrals"
          value={stats ? String(stats.direct_referees) : "—"}
        />
        <Stat
          label="Team size"
          value={stats ? String(stats.total_team_size) : "—"}
        />
        <Stat
          label="Pending"
          value={stats ? money(stats.accrued_total) : "—"}
          hint="Earned, not yet paid"
        />
        <Stat
          label="Paid out"
          value={stats ? money(stats.settled_total) : "—"}
          hint="Credited to your wallet"
        />
      </section>

      <Earnings
        items={history}
        loading={historyQuery.isPending}
        failed={historyQuery.isError}
        total={historyQuery.data?.total ?? 0}
      />

      <Downline
        nodes={treeQuery.data?.nodes ?? []}
        loading={treeQuery.isPending}
        failed={treeQuery.isError}
      />
    </main>
  );
}

// ─── Invite link ─────────────────────────────────────────────────────────────

function InviteLink({ code, loading }: { code: string | null; loading: boolean }) {
  const [copied, setCopied] = useState(false);

  // Built in the browser from the current origin, so the link is always for the
  // host the user is actually on rather than a domain baked in at build time.
  const [link, setLink] = useState("");
  useEffect(() => {
    if (!code) return;
    setLink(`${window.location.origin}/auth/register?ref=${code}`);
  }, [code]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused; the link is on screen and selectable.
      toast.error("Could not copy. Select the link and copy it manually.");
    }
  }

  return (
    <section className="rounded-3xl border border-[#c9a24e]/20 bg-white p-6 shadow-md">
      <h2 className="m-0 text-lg font-bold text-[#0a0f1c]">Your invite link</h2>
      <p className="m-0 mt-1 max-w-[70ch] text-sm text-[#0a0f1c]/60">
        Anyone who creates an FXNod account through this link is attributed to
        you permanently — including subscriptions they buy later.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <code className="min-w-0 flex-1 truncate rounded-xl bg-[#f8f6f0] px-4 py-3 font-mono text-sm text-[#0a0f1c]">
          {loading || !code ? "Preparing your link…" : link}
        </code>
        <button
          type="button"
          disabled={!link}
          onClick={copy}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white",
            "bg-gradient-to-r from-[#c9a24e] to-[#d6b56b] shadow-lg shadow-[#c9a24e]/30",
            "transition-all hover:brightness-110 active:scale-95",
            "disabled:cursor-not-allowed disabled:opacity-45",
          )}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {code && (
        <p className="m-0 mt-3 text-xs text-[#0a0f1c]/50">
          Referral code <span className="font-bold tracking-wide">{code}</span>
        </p>
      )}
    </section>
  );
}

// ─── Earnings ────────────────────────────────────────────────────────────────

function Earnings({
  items,
  loading,
  failed,
  total,
}: {
  items: CommissionLedgerEntry[];
  loading: boolean;
  failed: boolean;
  total: number;
}) {
  return (
    <section className="mt-10">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="m-0 text-lg font-bold text-[#0a0f1c]">Earnings</h2>
        {total > items.length && (
          // Said rather than hidden: a total that does not match the rows on
          // screen looks like a bug when it is only a page boundary.
          <span className="text-xs text-[#0a0f1c]/50">
            Showing the most recent {items.length} of {total}
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#c9a24e]/20 bg-white shadow-md">
        {loading && <Empty>Loading your commissions…</Empty>}
        {failed && <Empty>Could not load your commissions.</Empty>}
        {!loading && !failed && items.length === 0 && (
          <Empty>
            Nothing yet. You earn when someone who joined through your link
            trades or buys a dBot subscription.
          </Empty>
        )}

        {items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-black/5 bg-[#f8f6f0] text-left">
                  <Th>Earned on</Th>
                  <Th>Level</Th>
                  <Th align="right">Rate</Th>
                  <Th align="right">Amount</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id} className="border-b border-black/5 last:border-b-0">
                    <Td>{sourceLabel(row.source_type)}</Td>
                    <Td>L{row.level}</Td>
                    <Td align="right" className="tabular-nums">
                      {Number.parseFloat(row.commission_percentage).toFixed(0)}%
                    </Td>
                    <Td align="right" className="font-bold tabular-nums">
                      {money(row.commission_amount)}
                    </Td>
                    <Td>
                      <StatusCell row={row} />
                    </Td>
                    <Td className="whitespace-nowrap text-[#0a0f1c]/60">
                      {new Date(row.accrued_at).toLocaleDateString()}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * "Pending" alone reads as "lost". Each source is waiting for a different thing
 * and the honest answer is different, so say which.
 */
function StatusCell({ row }: { row: CommissionLedgerEntry }) {
  if (row.status === "settled") {
    return <Pill tone="ok">Paid</Pill>;
  }
  if (row.status === "cancelled") {
    return <Pill tone="bad">Reversed</Pill>;
  }

  const releases = row.payable_at ? new Date(row.payable_at) : null;
  return (
    <span className="inline-flex flex-col leading-tight">
      <Pill tone="wait">Pending</Pill>
      <span className="mt-0.5 text-[11px] text-[#0a0f1c]/50">
        {releases
          ? `Released ${releases.toLocaleDateString()}`
          : "With the monthly broker payout"}
      </span>
    </span>
  );
}

// ─── Downline ────────────────────────────────────────────────────────────────

function Downline({
  nodes,
  loading,
  failed,
}: {
  nodes: ReferralTreeNode[];
  loading: boolean;
  failed: boolean;
}) {
  const byLevel = useMemo(() => {
    const groups = new Map<number, ReferralTreeNode[]>();
    for (const node of nodes) {
      const list = groups.get(node.level) ?? [];
      list.push(node);
      groups.set(node.level, list);
    }
    return [...groups.entries()].sort((a, b) => a[0] - b[0]);
  }, [nodes]);

  return (
    <section className="mt-10">
      <h2 className="m-0 mb-3 text-lg font-bold text-[#0a0f1c]">Your team</h2>

      <div className="overflow-hidden rounded-3xl border border-[#c9a24e]/20 bg-white shadow-md">
        {loading && <Empty>Loading your team…</Empty>}
        {failed && <Empty>Could not load your team.</Empty>}
        {!loading && !failed && nodes.length === 0 && (
          <Empty>Nobody has joined through your link yet.</Empty>
        )}

        {byLevel.map(([level, members]) => (
          <div key={level} className="border-b border-black/5 last:border-b-0">
            <div className="flex items-baseline gap-2 bg-[#f8f6f0] px-5 py-2">
              <span className="text-xs font-bold uppercase tracking-wide text-[#0a0f1c]/70">
                Level {level}
              </span>
              <span className="text-xs text-[#0a0f1c]/50">
                {level === 1
                  ? "people you invited"
                  : "invited by your level " + (level - 1)}
                {" · "}
                {members.length}
              </span>
            </div>
            <ul className="m-0 list-none p-0">
              {members.map((member) => (
                <li
                  key={member.referee_id}
                  className="flex items-center justify-between gap-3 border-t border-black/5 px-5 py-2.5 text-sm"
                >
                  {/* Only what the account itself already shows elsewhere. A
                      downline list is not a reason to publish someone's
                      details to another user. */}
                  <span className="min-w-0 truncate text-[#0a0f1c]">
                    {displayName(member)}
                  </span>
                  <span className="shrink-0 text-xs text-[#0a0f1c]/50">
                    joined {new Date(member.joined_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Pieces ──────────────────────────────────────────────────────────────────

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-3xl border border-[#c9a24e]/20 bg-white p-5 shadow-md">
      <p className="m-0 text-xs font-bold uppercase tracking-wide text-[#0a0f1c]/50">
        {label}
      </p>
      <p className="m-0 mt-1 text-2xl font-extrabold tabular-nums text-[#0a0f1c]">
        {value}
      </p>
      {hint && <p className="m-0 mt-0.5 text-xs text-[#0a0f1c]/50">{hint}</p>}
    </div>
  );
}

function Pill({
  tone,
  children,
}: {
  tone: "ok" | "wait" | "bad";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "w-fit rounded-full px-2 py-0.5 text-[11px] font-bold",
        tone === "ok"
          ? "bg-green-50 text-green-700"
          : tone === "bad"
            ? "bg-red-50 text-red-700"
            : "bg-amber-50 text-amber-700",
      )}
    >
      {children}
    </span>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 px-5 py-10 text-center text-sm text-[#0a0f1c]/50">
      {children}
    </p>
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
        "px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-[#0a0f1c]/50",
        align === "right" && "text-right",
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
    <td className={cn("px-5 py-3", align === "right" && "text-right", className)}>
      {children}
    </td>
  );
}

// ─── Formatting ──────────────────────────────────────────────────────────────

/** Decimal strings on the wire; parsed only to render, never to compute. */
function money(value: string): string {
  const amount = Number.parseFloat(value);
  return Number.isFinite(amount) ? `$${amount.toFixed(2)}` : "—";
}

function sourceLabel(sourceType: string): string {
  switch (sourceType) {
    case "dbot_subscription":
      return "dBot subscription";
    case "trade_markup":
      return "Trading";
    default:
      return sourceType;
  }
}

function displayName(node: ReferralTreeNode): string {
  const name = [node.first_name, node.last_name].filter(Boolean).join(" ");
  if (name) return name;
  if (node.email) return maskEmail(node.email);
  return "FXNod user";
}

/**
 * Someone in your downline is another customer. You are told they exist, not
 * handed a mailing list.
 */
function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain) return "FXNod user";
  const head = user.slice(0, 2);
  return `${head}${"•".repeat(Math.max(2, user.length - 2))}@${domain}`;
}
