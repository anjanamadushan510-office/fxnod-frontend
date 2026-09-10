"use client";

import { useState, useEffect, useMemo } from "react";
import { usePanelBuy } from "@/hooks/usePanelBuy";
import { useContractsFor } from "@/hooks/useContractsFor";
import { buildProposalRequest } from "../buildProposalRequest";
import { TradeConfirmed } from "../TradeConfirmed";
import { HowToTradeLink } from "../HowToTradeLink";
import { BuyButton } from "../fields/BuyButton";
import { useBarrierPreview } from "@/stores/useBarrierPreview";
import { DurationField, useDefaultDuration } from "../fields/DurationField";
import { OffsetField } from "../fields/OffsetField";
import { RiseFallToggle, type Side } from "../fields/RiseFallToggle";
import { StakeField } from "../fields/StakeField";
import { SummaryRow } from "../fields/SummaryRow";

interface VanillasPanelProps {
  symbol: string;
}

export function VanillasPanel({ symbol }: VanillasPanelProps) {
  const [side, setSide] = useState<Side>("rise");
  const [duration, setDuration] = useDefaultDuration({ amount: 1, unit: 'min' });
  const [strike, setStrike] = useState<number>(0);
  const [stake, setStake] = useState<number>(10);

  const { params } = useContractsFor(symbol);

  // Deriv's API separates contracts by `expiry_type` ('intraday' vs 'daily').
  // A duration of 'd' means daily. Everything else (h, min, s, ticks) is intraday.
  const expiryType = duration.unit === 'd' ? 'daily' : 'intraday';

  const request =
    stake > 0
      ? buildProposalRequest({
          contractType: "vanillas",
          symbol,
          stake,
          side,
          duration: { amount: duration.amount, unit: duration.unit },
          barrier: strike,
        })
      : null;

  const { buyPhase, lastTrade, canBuy, errorMsg, handleBuy, handleNewTrade, proposal, barrierChoices: dynamicBarriers } = usePanelBuy(request);

  const barrierChoices = useMemo(() => {
    if (dynamicBarriers && dynamicBarriers.length > 0) {
      return dynamicBarriers.map(Number).filter(Number.isFinite);
    }

    const durationStr = `${duration.amount}${duration.unit === 'min' ? 'm' : duration.unit === 'ticks' ? 't' : duration.unit}`;

    // Look for exact match for the selected duration
    let vanillaContract = params.available.find(
      c => c.contract_category === 'vanilla' && c.expiry_type === expiryType && c.min_contract_duration === durationStr
    );

    // If no exact match, fallback to the first vanilla contract matching the expiry type
    if (!vanillaContract) {
      vanillaContract = params.available.find(
        c => c.contract_category === 'vanilla' && c.expiry_type === expiryType
      );
    }
    
    if (vanillaContract?.barrier_choices) {
      // barrier_choices are strings like "+1.50" or "820.00", parse them to numbers.
      return vanillaContract.barrier_choices.map(Number).filter(Number.isFinite);
    }
    return undefined;
  }, [params.available, expiryType, duration, dynamicBarriers]);

  // When dynamic barriers load or duration changes, snap the current strike to a valid option.
  useEffect(() => {
    if (barrierChoices && barrierChoices.length > 0) {
      if (!barrierChoices.includes(strike)) {
        // Find the closest barrier or default to the middle one (usually 0 for relative).
        // Since Deriv often centers relative offsets around 0, let's pick 0 if available, or closest.
        if (barrierChoices.includes(0)) {
          setStrike(0);
        } else {
          const closest = barrierChoices.reduce((prev, curr) => 
            Math.abs(curr - strike) < Math.abs(prev - strike) ? curr : prev
          );
          setStrike(closest);
        }
      }
    }
  }, [barrierChoices, strike]);

  // Sync strike price to chart preview line
  useEffect(() => {
    useBarrierPreview.getState().setBarrier(strike);
    return () => useBarrierPreview.getState().setBarrier(null);
  }, [strike]);



  useEffect(() => {
    if (errorMsg && errorMsg.includes("Barriers available are")) {
      const match = errorMsg.match(/Barriers available are (.*)/);
      if (match) {
        const barriers = match[1].split(',').map(s => Number(s.trim().replace(/\.$/, '')));
        if (barriers.length > 0 && !barriers.includes(strike)) {
          // Default to the first available positive barrier, or just the first one
          const defaultBarrier = barriers.find(b => b > 0) ?? barriers[0];
          setStrike(defaultBarrier);
        }
      }
    }
  }, [errorMsg, strike]);

  if (buyPhase === "confirmed" && lastTrade) {
    return <TradeConfirmed trade={lastTrade} side={side} onNewTrade={handleNewTrade} />;
  }

  // Payout per point for Vanillas is the 'display_number_of_contracts' field from the API.
  const payoutPerPoint = proposal?.display_number_of_contracts ?? proposal?.payout_amount ?? '...';

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <HowToTradeLink contractLabel="Vanillas" />
      <RiseFallToggle
        value={side}
        onChange={setSide}
        labels={{ rise: "Call", fall: "Put" }}
      />
      <DurationField value={duration} onChange={setDuration} allowTicks={false} allowSeconds={false} />
      <OffsetField
        label="Strike price"
        value={strike}
        onChange={setStrike}
        withInfo
        infoLabel="Strike price info"
        options={barrierChoices}
      />
      <StakeField value={stake} onChange={setStake} min={1} max={2000} />
      <div className="py-1">
        <SummaryRow label="Payout per point" value={`${payoutPerPoint} USD`} />
      </div>
      {errorMsg && (
        <p className="px-1 text-[11px] leading-snug text-opt-fall">{errorMsg}</p>
      )}
      <div className="mt-auto">
        <BuyButton
          side={side}
          disabled={!canBuy}
          /* §7: Vanillas Call=green / Put=red, no fixed payout sub-text. */
          payoutLabel={null}
          label={buyPhase !== "idle" ? "Placing…" : "Buy"}
          loading={buyPhase === "buying"}
          onClick={handleBuy}
        />
      </div>
    </div>
  );
}
