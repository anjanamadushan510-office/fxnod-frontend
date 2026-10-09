interface StatCardProps {
  label: string;
  value: string;
  note?: string;
}

/** One headline figure. The value is whatever the server sent, already formatted. */
export function StatCard({ label, value, note }: StatCardProps) {
  return (
    <article className="min-w-0 rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <p className="mb-3 text-[11px] uppercase tracking-[0.14em] text-ink-3 sm:text-xs">{label}</p>
      <p className="font-display text-2xl font-semibold tabular-nums text-ink sm:text-3xl">{value}</p>
      {note && <p className="mt-1 text-xs text-ink-3">{note}</p>}
    </article>
  );
}
