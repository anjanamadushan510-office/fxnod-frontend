"use client";
import Link from "next/link";
import type { Route } from "next";
import { Star, ArrowRight } from "lucide-react";
import { useBotFavourites } from "@/hooks/useBotFavourites";
import { useListAutoHubBots } from "@/services/api/endpoints/auto-hub/auto-hub";
import { contractLabel } from "@/components/autohub/catalogue";
export function DashboardFavourites() {
  const favourites = useBotFavourites();
  const catalogue = useListAutoHubBots();
  const bots = (catalogue.data?.bots ?? []).filter((bot) =>
    favourites.ids.has(bot.bot_id),
  );
  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex flex-wrap justify-between gap-2 items-center">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
          <Star size={18} className="text-amber-500" />
          Your favourite bots
        </h2>
        <Link href="/autohub" className="text-xs text-ink-2 hover:underline">
          Auto Hub library →
        </Link>
      </div>
      {favourites.isError || catalogue.isError ? (
        <p role="alert" className="mt-4 text-sm text-ink-3">
          Could not load your favourites.{" "}
          <button
            type="button"
            onClick={() => {
              favourites.retry();
              catalogue.refetch();
            }}
            className="underline"
          >
            Retry
          </button>
        </p>
      ) : !favourites.ready || catalogue.isPending ? (
        <p className="mt-4 text-sm text-ink-3">Loading saved bots…</p>
      ) : bots.length === 0 ? (
        <p className="mt-4 text-sm text-ink-3">
          Star a bot in Auto Hub to keep it here. Your favourites follow your
          account across devices.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-4">
          {bots.slice(0, 4).map((bot) => (
            <Link
              key={bot.bot_id}
              href={`/autohub/bots/${bot.bot_id}` as Route}
              className="rounded-xl bg-surface-2 border border-line p-4 hover:border-ink-3 transition-colors"
            >
              <span className="flex justify-between gap-3 text-sm font-medium text-ink">
                {bot.name}
                <ArrowRight size={16} />
              </span>
              <span className="block mt-2 text-xs text-ink-3">
                {contractLabel(bot.contract_type)} · Review & set up
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
