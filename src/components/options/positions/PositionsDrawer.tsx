"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CaretDownIcon } from "@/components/ui/Icons";
import { useContractDetails } from "@/stores/useContractDetails";
import { usePositionsUI } from "@/stores/usePositionsUI";
import { useOpenPositions } from "@/stores/useOpenPositions";
import { cn } from "@/lib/cn";
import { ClosedPositionCard } from "./ClosedPositionCard";
import {
  formatContractDate,
  simPositionToDetail,
  historyToDetail,
  type ContractDetail,
} from "./contractDetail";
import { useTradeHistory } from "@/hooks/useTradeHistory";
import { EmptyPositionsState } from "./EmptyPositionsState";
import { PositionCard } from "./PositionCard";
import { useSellPosition } from "@/services/api/endpoints/trading/trading";
import { toast } from "sonner";

interface PositionsDrawerProps {
  open: boolean;
  onClose: () => void;
  socketStatus?: string;
}

/**
 * Positions drawer (Deriv §8–10). Open tab = live broker positions; Closed tab =
 * date-grouped closed contracts with an "All time" date filter. Stays mounted
 * for the slide animation — the OptionsShell column width clips it when closed.
 */
export function PositionsDrawer({ open, onClose, socketStatus }: PositionsDrawerProps) {
  const tab = usePositionsUI((state) => state.tab);
  const setTab = usePositionsUI((state) => state.setTab);

  const positions = useOpenPositions((s) => s.positions);
  const activePositions = positions.filter((p) => !p.outcome);
  const [filter, setFilter] = useState<FilterKey>("all");
  const historyQuery = useTradeHistory();
  const closedContracts = useMemo(() => {
    const rows = new Map<string, ContractDetail>();
    for (const position of positions) {
      if (position.outcome && position.contractId) rows.set(position.contractId, simPositionToDetail(position));
    }
    for (const row of historyQuery.data ?? []) {
      if (row.outcome === "won" || row.outcome === "lost") {
        rows.set(row.deriv_contract_id, historyToDetail(row));
      }
    }
    return [...rows.values()].sort((a, b) => b.exitTime - a.exitTime);
  }, [positions, historyQuery.data]);
  const filteredContracts = useMemo(() => filterContracts(closedContracts, filter), [closedContracts, filter]);
  const latestResult = positions.filter((p) => p.outcome).sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))[0];
  const openDetail = useContractDetails((s) => s.open);

  const sellingIds = useRef(new Set<string>());
  const sellMutation = useSellPosition({
    mutation: {
      retry: false,
      onSettled: (_data, _error, variables) => { sellingIds.current.delete(variables.data.contract_id); },
      onSuccess: () => {
        toast.success("Sell order accepted");
      },
      onError: (e: any) => {
        toast.error("Sell failed", {
          description: e?.response?.data?.detail || "Could not sell position",
        });
      },
    },
  });

  const handleSell = (contractId: string) => {
    if (sellingIds.current.has(contractId)) return;
    sellingIds.current.add(contractId);
    sellMutation.mutate({ data: { contract_id: contractId } });
  };

  const openTotal = useMemo(
    () => positions.filter((p) => !p.outcome).reduce((acc, p) => acc + p.pnl, 0),
    [positions],
  );
  // Escape closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const footerCount = tab === "open" ? activePositions.length : filteredContracts.length;
  const footerPnl = tab === "open" ? openTotal : filteredContracts.reduce((sum, contract) => sum + contract.pnl, 0);
  const footerPositive = footerPnl >= 0;

  return (
    <div className="flex h-full w-full flex-col border-opt-line bg-opt-bg-elev lg:w-[360px] lg:border-r">
      <header className="flex items-center justify-between border-b border-opt-line px-3 py-3">
        <h2 className="m-0 font-sans text-[14px] font-semibold text-opt-ink">
          Positions
        </h2>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-md border-0 bg-transparent text-opt-ink-3 hover:bg-opt-bg-sunk hover:text-opt-ink lg:h-7 lg:w-7"
        >
          ✕
        </button>
      </header>

      {/* Open / Closed tabs (§9: dark active underline) */}
      <div className="flex gap-4 border-b border-opt-line px-3">
        <DrawerTab on={tab === "open"} onClick={() => setTab("open")}>
          Open
        </DrawerTab>
        <DrawerTab on={tab === "closed"} onClick={() => setTab("closed")}>
          Closed
        </DrawerTab>
      </div>

      {activePositions.length > 0 && socketStatus && socketStatus !== "open" && <p role="status" className="px-3 py-2 text-xs text-opt-ink-3">Reconnecting live updates… Latest values remain visible.</p>}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {tab === "open" ? (
          <div className="flex flex-col gap-3">
            {latestResult && <div aria-live="polite"><p className="mb-2 text-xs text-opt-ink-3">Latest result</p><ClosedPositionCard contract={simPositionToDetail(latestResult)} onOpenDetails={openDetail} /></div>}
          {activePositions.length === 0 ? (
            <EmptyPositionsState label="You have no open positions." />
          ) : (
            <div className="flex flex-col gap-2">
              {activePositions.map((p) => (
                <PositionCard
                  key={p.id}
                  position={p}
                  selling={sellMutation.isPending && sellMutation.variables?.data.contract_id === p.contractId}
                  onSell={handleSell}
                  onOpenDetails={() => openDetail(simPositionToDetail(p))}
                />
              ))}
            </div>
          )}
          </div>
        ) : (
          <ClosedTab contracts={filteredContracts} filter={filter} onFilterChange={setFilter} isLoading={historyQuery.isLoading} isError={historyQuery.isError} onOpenDetails={openDetail} />
        )}
      </div>

      <footer className="flex items-center justify-between border-t border-opt-line px-3 py-2.5 text-[12px]">
        <span className="text-opt-ink-3">
          {footerCount} {tab} position{footerCount === 1 ? "" : "s"}
        </span>
        <span
          className={cn(
            "font-mono text-[12.5px] font-bold tabular-nums",
            footerPositive ? "text-opt-rise" : "text-opt-fall",
          )}
        >
          Total P/L: {footerPositive ? "+" : ""}
          {footerPnl.toFixed(2)} USD
        </span>
      </footer>
    </div>
  );
}

// ─── Closed tab ──────────────────────────────────────────────────────────────

type FilterKey = "all" | "today" | "yesterday" | "7d" | "30d" | "60d" | "90d";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All time" },
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "60d", label: "Last 60 days" },
  { key: "90d", label: "Last 90 days" },
];

function filterContracts(contracts: ContractDetail[], filter: FilterKey): ContractDetail[] {
  if (filter === "all") return contracts;
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 1000;
  return contracts.filter((contract) => {
    if (filter === "today") return contract.exitTime >= today;
    if (filter === "yesterday") return contract.exitTime >= today - 86400 && contract.exitTime < today;
    return now.getTime() / 1000 - contract.exitTime <= Number(filter.slice(0, -1)) * 86400;
  });
}

function ClosedTab({ contracts, filter, onFilterChange, isLoading, isError, onOpenDetails }: {
  contracts: ContractDetail[];
  filter: FilterKey;
  onFilterChange: (filter: FilterKey) => void;
  isLoading: boolean;
  isError: boolean;
  onOpenDetails: (c: ContractDetail) => void;
}) {
  const groups = useMemo(() => {
    const m = new Map<string, ContractDetail[]>();
    for (const c of contracts) {
      const k = formatContractDate(c.exitTime);
      const arr = m.get(k);
      if (arr) arr.push(c);
      else m.set(k, [c]);
    }
    return [...m.entries()];
  }, [contracts]);

  return (
    <div className="flex flex-col gap-3">
      <FilterDropdown value={filter} onChange={onFilterChange} />
      {contracts.length === 0 ? (
        <EmptyPositionsState label={isLoading ? "Loading closed positions…" : isError ? "Could not load trade history. Please retry." : "No closed positions in this range."} />
      ) : (
        groups.map(([date, items]) => (
          <div key={date} className="flex flex-col gap-2">
            <p className="px-1 text-[12px] font-semibold text-opt-ink-3">
              {date}
            </p>
            {items.map((c) => (
              <ClosedPositionCard
                key={c.id}
                contract={c}
                onOpenDetails={onOpenDetails}
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
}

function FilterDropdown({
  value,
  onChange,
}: {
  value: FilterKey;
  onChange: (k: FilterKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const label = FILTERS.find((f) => f.key === value)?.label ?? "All time";

  return (
    <div ref={ref} className="relative w-fit">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-md bg-opt-bg-sunk px-2.5 py-1 text-[12px] font-medium text-opt-ink-2 transition-colors hover:text-opt-ink"
      >
        {label}
        <CaretDownIcon className="h-3 w-3" />
      </button>
      {open && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-10 w-[150px] overflow-hidden rounded-lg border border-opt-line bg-opt-bg-elev py-1 shadow-[0_12px_28px_rgba(0,0,0,0.14)]">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => {
                onChange(f.key);
                setOpen(false);
              }}
              className={cn(
                "block w-full px-3 py-1.5 text-left text-[12px] transition-colors",
                f.key === value
                  ? "font-semibold text-opt-ink"
                  : "text-opt-ink-2 hover:bg-opt-bg-sunk hover:text-opt-ink",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DrawerTab({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative -mb-px py-2.5 text-[13px] font-medium transition-colors",
        on ? "text-opt-ink" : "text-opt-ink-3 hover:text-opt-ink",
      )}
    >
      {children}
      {on && (
        <span className="absolute inset-x-0 bottom-0 h-[2px] bg-opt-ink" />
      )}
    </button>
  );
}
