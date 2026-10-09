"use client";

import { useMemo, useState } from "react";
import { StatCard } from "@/components/partner/StatCard";
import { cn } from "@/lib/cn";
import { levelMeaning, levelName, memberName, money, productName, shortDate } from "@/lib/partner";
import { useGetPartnerEarnings, useListPartners } from "@/services/api/endpoints/referrals/referrals";

export default function PartnerNetworkPage() {
  const partnersQuery = useListPartners();
  const earningsQuery = useGetPartnerEarnings();
  const team = partnersQuery.data;
  const currency = earningsQuery.data?.currency ?? "USD";

  const [level, setLevel] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  // The server sends the whole team in one answer (the tree has a fixed
  // depth), so narrowing it here cannot hide a row that is on another page.
  const levels = useMemo(
    () => Array.from(new Set(team?.items.map((member) => member.level) ?? [])).sort((a, b) => a - b),
    [team],
  );
  const shown = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return (team?.items ?? []).filter(
      (member) =>
        (level === null || member.level === level) &&
        (!needle ||
          member.display_name?.toLowerCase().includes(needle) ||
          member.email?.toLowerCase().includes(needle)),
    );
  }, [team, level, search]);

  return (
    <section data-view="partner-network" className="space-y-6 p-4 lg:p-8">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Team" value={team ? String(team.total) : "—"} note="People under your link" />
        <StatCard
          label="Earning"
          value={team ? String(team.earning_count) : "—"}
          note="Members who earned you something"
        />
        {levels.slice(0, 2).map((item) => (
          <StatCard
            key={item}
            label={levelName(item)}
            value={String(team?.items.filter((member) => member.level === item).length ?? 0)}
            note={levelMeaning(item)}
          />
        ))}
      </div>

      <article className="min-w-0 overflow-hidden rounded-2xl border border-line bg-surface">
        <header className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Level">
            <LevelChip label="Everyone" on={level === null} onClick={() => setLevel(null)} />
            {levels.map((item) => (
              <LevelChip key={item} label={levelName(item)} on={level === item} onClick={() => setLevel(item)} />
            ))}
          </div>
          <input
            type="search"
            aria-label="Search your team"
            placeholder="Search by name or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-10 w-full min-w-0 rounded-lg border border-line bg-bg px-3 text-sm text-ink outline-none placeholder:text-ink-3 focus:border-ink-3 sm:w-64"
          />
        </header>

        {partnersQuery.isLoading ? (
          <p className="px-5 py-6 text-center text-sm text-ink-3">Loading…</p>
        ) : partnersQuery.isError ? (
          <p className="px-5 py-6 text-center text-sm text-red-400">Your team could not be loaded.</p>
        ) : !team?.items.length ? (
          <p className="px-5 py-6 text-center text-sm text-ink-3">
            Nobody has joined through your link yet. Share it from Overview.
          </p>
        ) : !shown.length ? (
          <p className="px-5 py-6 text-center text-sm text-ink-3">Nobody on your team matches.</p>
        ) : (
          <ul className="divide-y divide-line">
            {shown.map((member) => (
              <li key={member.user_id} className="flex items-start justify-between gap-3 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink">{memberName(member.display_name, member.email)}</p>
                  {member.display_name && member.email && (
                    <p className="mt-0.5 truncate text-xs text-ink-2">{member.email}</p>
                  )}
                  <p className="mt-0.5 text-xs text-ink-3">
                    {levelName(member.level)} · joined {shortDate(member.joined_at)}
                    {member.source_types.length > 0 && ` · ${member.source_types.map(productName).join(", ")}`}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm tabular-nums text-ink">{money(member.earned.accrued, currency)}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-ink-3">
                    Pending · {money(member.earned.settled, currency)} paid
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-ink-3">
                    {member.last_earned_at ? `Last ${shortDate(member.last_earned_at)}` : "Nothing earned yet"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </article>

      <p className="text-xs text-ink-3">
        You see the full email address of people you invited yourself. Further down your team it is partly
        hidden, and nobody&apos;s balance or trades are shown: only what their activity earned you.
      </p>
    </section>
  );
}

function LevelChip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "h-10 rounded-lg border px-4 text-sm transition-colors",
        on ? "border-ink bg-ink text-surface" : "border-line text-ink-2 hover:text-ink",
      )}
    >
      {label}
    </button>
  );
}
