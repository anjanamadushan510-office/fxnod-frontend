"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ArrowUpRight, ArrowDownRight, FileText, Clock, Target, Timer, Flag, CircleDot } from "lucide-react";
import { useContractDetails } from "@/stores/useContractDetails";
import { useOpenPositions } from "@/stores/useOpenPositions";
import { cn } from "@/lib/cn";
import { ContractDetailChart } from "./ContractDetailChart";
import {
  formatContractTime,
  simPositionToDetail,
  type ContractDetail,
} from "./contractDetail";

/**
 * Contract Details modal (Deriv §10). Two-column: left metadata panel, right
 * isolated-tick chart. Portals into the `[data-app="options"]` subtree so the
 * scoped theme tokens apply. Driven by the useContractDetails store (opened
 * from a position card's ⇗ expand).
 */
export function ContractDetailsModal() {
  const storeDetail = useContractDetails((s) => s.detail);
  const close = useContractDetails((s) => s.close);
  const openPositions = useOpenPositions((s) => s.positions);
  const [target, setTarget] = useState<Element | null>(null);

  const livePosition = storeDetail 
    ? openPositions.find((p) => String(p.id) === String(storeDetail.id))
    : null;
    
  const detail = livePosition ? simPositionToDetail(livePosition) : storeDetail;

  useEffect(() => {
    setTarget(document.body);
  }, []);

  // Shallow-route to /contract/[id] when detail opens; revert on close.
  useEffect(() => {
    if (!detail) return;

    const prevPath = window.location.pathname + window.location.search;
    window.history.pushState({ contractId: detail.id }, '', `/contract/${detail.id}`);

    const onPopState = () => {
      close();
    };
    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
      // Only revert if we are still on /contract/... (user didn't already navigate away)
      if (window.location.pathname.startsWith('/contract')) {
        window.history.replaceState(null, '', prevPath);
      }
    };
  }, [detail?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!detail) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [detail, close]);

  if (!detail || !target) return null;

  const lost = detail.outcome === "lost";

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Contract details"
    >
      <div
        className="absolute inset-0 bg-gray-900/40 dark:bg-black/50 backdrop-blur-sm"
        onClick={close}
      />

      <div className="relative z-10 flex h-[min(700px,calc(100vh-64px))] w-[min(1200px,calc(100vw-64px))] flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111928] shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 py-3">
          <h2 className="text-[15px] font-bold text-gray-900 dark:text-white">Contract details</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="grid h-8 w-8 place-items-center rounded-lg text-gray-500 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Body: [left metadata] [right chart] */}
        <div className="grid min-h-0 flex-1 grid-cols-[280px_1fr]">
          <LeftPanel detail={detail} lost={lost} />
          <div className="min-h-0 min-w-0 bg-gray-50 dark:bg-[#0e0e0e] p-2">
            <ContractDetailChart detail={detail} />
          </div>
        </div>
      </div>
    </div>,
    target,
  );
}

function LeftPanel({
  detail,
  lost,
}: {
  detail: ContractDetail;
  lost: boolean;
}) {
  const pnlClass = lost ? "text-red-500" : "text-emerald-500";
  const dp = Math.abs(detail.entrySpot) < 10 ? 4 : 2;

  let mainName = detail.marketName;
  let subName = "";
  const parenIdx = detail.marketName.indexOf("(");
  if (parenIdx > 0) {
    mainName = detail.marketName.slice(0, parenIdx).trim();
    subName = detail.marketName.slice(parenIdx).trim();
  }

  const tradeTypeColor = detail.side === "fall" ? "text-red-500" : "text-emerald-500";
  const TradeIcon = detail.side === "fall" ? ArrowDownRight : ArrowUpRight;

  const isTurbos = detail.type === "turbos" || detail.type === "TURBOSLONG" || detail.type === "TURBOSSHORT";
  const isMultiplier = detail.type.toLowerCase().includes("mult");

  return (
    <div className="flex min-h-0 flex-col gap-3 overflow-y-auto border-r border-gray-200 dark:border-gray-800 p-4 [scrollbar-width:thin]">
      
      {/* Header Badge */}
      <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-100 to-transparent dark:from-gray-800/50 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded bg-white dark:bg-gray-800 text-[10px] font-bold text-gray-900 dark:text-white shadow-sm border border-gray-100 dark:border-gray-700">
            {mainName.slice(0, 3)}
          </span>
          <div className="flex flex-col justify-center">
            <span className="text-[12.5px] font-bold leading-tight text-gray-900 dark:text-white">
              {mainName}
            </span>
            {subName && (
              <span className="text-[11px] font-medium leading-tight text-gray-500 dark:text-gray-400">
                {subName}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-1 items-start justify-end gap-1">
          <TradeIcon className={`mt-0.5 h-[18px] w-[18px] ${tradeTypeColor}`} strokeWidth={2.5} />
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-[12.5px] font-bold leading-tight text-gray-900 dark:text-white">
              {detail.tradeTypeLabel}
            </span>
            {detail.growthRate !== undefined && detail.growthRate > 0 && (
              <span className="rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-1.5 py-[1px] text-[10px] font-bold text-gray-700 dark:text-gray-300 shadow-sm">
                {Math.round(detail.growthRate * 100)}%
              </span>
            )}
          </div>
        </div>
      </div>

      <span className="w-fit rounded bg-gray-100 dark:bg-gray-800/50 px-2 py-0.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
        USD
      </span>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        {isTurbos ? (
          <>
            <Stat label="Stake" value={detail.stake.toFixed(2)} />
            <Stat label="Contract value" value={detail.contractValue.toFixed(2)} className={lost ? "text-gray-500 dark:text-gray-400" : "text-emerald-500"} />
            <Stat label="Entry spot" value={detail.entrySpot.toFixed(Math.abs(detail.entrySpot) < 10 ? 4 : 2)} />
            <Stat label="Take profit" value="-" />
            <Stat label="Barrier" value={detail.barrier.toFixed(Math.abs(detail.entrySpot) < 10 ? 4 : 2)} />
            {detail.payoutPerPoint !== undefined ? (
              <Stat label="Payout per point" value={`${detail.payoutPerPoint.toFixed(2)} USD`} />
            ) : (
              <div />
            )}
          </>
        ) : isMultiplier ? (
          <>
            <Stat label="Contract cost" value={detail.stake.toFixed(2)} />
            <Stat label="Contract value" value={detail.contractValue.toFixed(2)} className={lost ? "text-gray-500 dark:text-gray-400" : "text-emerald-500"} />
            <Stat label="Deal cancel. fee" value="-" />
            <Stat label="Take profit" value="-" />
            <Stat label="Stake" value={detail.stake.toFixed(2)} />
            <Stat label="Stop loss" value="-" />
          </>
        ) : (
          <>
            <Stat label="Total profit/loss" value={detail.pnl.toFixed(2)} className={pnlClass} />
            <Stat
              label="Contract value"
              value={detail.contractValue.toFixed(2)}
              className={lost ? "text-gray-500 dark:text-gray-400" : "text-emerald-500"}
            />
            <Stat label="Stake" value={detail.stake.toFixed(2)} />
            {(detail.type === "vanillas" || detail.type === "VANILLALONGCALL" || detail.type === "VANILLALONGPUT") && detail.payoutPerPoint !== undefined ? (
              <Stat label="Payout per point" value={`${detail.payoutPerPoint.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} USD`} />
            ) : (
              <Stat label="Potential payout" value={detail.payout.toFixed(2)} />
            )}
          </>
        )}
      </div>

      {/* For Turbos & Multipliers, Total profit/loss is separated */}
      {(isTurbos || isMultiplier) && (
        <div className={cn("mt-2 flex flex-col justify-center p-3", isTurbos ? "items-center rounded bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-800" : "items-start")}>
          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">Total profit/loss:</span>
          <span className={`text-[15px] font-bold ${pnlClass}`}>{detail.pnl.toFixed(2)}</span>
        </div>
      )}

      <div className="h-px bg-gray-200 dark:bg-gray-800" />

      <div className="flex flex-col gap-0 relative pt-1">
        {/* Continuous timeline background line */}
        <div className="absolute left-[7px] top-[140px] bottom-[20px] w-px bg-gray-200 dark:bg-gray-800 z-0" />

        <Row label="Reference ID" icon={<FileText className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />}>
          <div className="flex flex-col gap-0.5">
            {detail.buyTransactionId > 0 ? (
              <a
                href={`https://dtrader.deriv.com/contract/${detail.derivContractId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {detail.buyTransactionId} (Buy)
              </a>
            ) : (
              <span>—</span>
            )}
            {detail.sellTransactionId > 0 && (
              <span>{detail.sellTransactionId} (Sell)</span>
            )}
          </div>
        </Row>
        
        {isMultiplier ? (
          <Row label="% Commission" icon={<FileText className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />}>
            <span>{detail.commission !== undefined ? `${detail.commission.toFixed(2)} USD` : "0.00 USD"}</span>
          </Row>
        ) : (
          <Row label="Duration" icon={<Clock className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />}>
            <span>{detail.duration}</span>
          </Row>
        )}

        {detail.type === "even_odd" || detail.type === "DIGITEVEN" || detail.type === "DIGITODD" ? (
          <Row label="Target" icon={<Target className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />}>
            <span className="font-sans text-[14px] font-semibold text-gray-900 dark:text-white">
              {detail.side === "fall" ? "Odd" : "Even"}
            </span>
          </Row>
        ) : detail.type === "matches_differs" ? (
          <Row label="Target" icon={<Target className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />}>
            <span className="font-sans text-[14px] font-semibold text-gray-900 dark:text-white">
              {detail.tradeTypeLabel === "Matches" ? "Equals " : "Differs from "} {detail.barrier}
            </span>
          </Row>
        ) : detail.type === "over_under" ? (
          <Row label="Target" icon={<Target className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />}>
            <span className="font-sans text-[14px] font-semibold text-gray-900 dark:text-white">
              {detail.tradeTypeLabel === "Over" ? "Over " : "Under "} {detail.barrier}
            </span>
          </Row>
        ) : (detail.type !== "accumulators" && !isMultiplier) && (
          <Row 
            label={(detail.type === "vanillas" || detail.type === "VANILLALONGCALL" || detail.type === "VANILLALONGPUT") ? "Strike" : "Barrier"}
            icon={<Target className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />}
          >
            <span>{detail.barrier}</span>
          </Row>
        )}

        <Row label="Start time" icon={<Timer className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />} isTimeline>
          <span className="text-[12px]">
            {formatContractTime(detail.startTime)}
          </span>
        </Row>
        
        <Row label="Entry spot" icon={<CircleDot className="w-3.5 h-3.5 text-gray-900 dark:text-white" fill="currentColor" />} isTimeline>
          <span>{detail.entrySpot.toFixed(dp)}</span>
          <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
            {formatContractTime(detail.entryTime)}
          </span>
        </Row>
        
        {/* Combine Exit spot & Exit time to match Deriv's layout better, or just list Exit spot and then Exit time */}
        <Row label="Exit spot" icon={<div className="w-[14px] h-[14px] rounded-full bg-white dark:bg-[#111928] border-[3px] border-gray-900 dark:border-white" />} isTimeline>
          <span>{detail.exitSpot.toFixed(dp)}</span>
          <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
            {formatContractTime(detail.exitTime)}
          </span>
        </Row>
        
        <Row label="Exit time" icon={<Flag className="w-3.5 h-3.5 text-gray-900 dark:text-white" fill="currentColor" />} isTimeline isLast>
          <span className="text-[12px]">
            {formatContractTime(detail.exitTime)}
          </span>
        </Row>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-gray-500 dark:text-gray-400">{label}:</span>
      <span className={cn("font-mono text-[14px] font-semibold", className ?? "text-gray-900 dark:text-white")}>
        {value}
      </span>
    </div>
  );
}

function Row({
  label,
  icon,
  isTimeline,
  isLast,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  isTimeline?: boolean;
  isLast?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 relative pb-4">
      {icon && (
        <div className="flex flex-col items-center pt-1 relative z-10 w-4 shrink-0">
          <div className="bg-white dark:bg-[#111928] h-4 w-4 rounded-full flex items-center justify-center relative z-20 shrink-0">
             {icon}
          </div>
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">{label}</span>
        <div className="flex flex-col items-start font-mono text-[12px] text-gray-900 dark:text-white leading-tight font-medium">
          {children}
        </div>
      </div>
    </div>
  );
}
