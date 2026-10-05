"use client";

import { useRef, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { AppsGridIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";
import { AuthModal } from "../auth/AuthModal";
import { ConnectDerivButton } from "../deriv/ConnectDerivButton";

import { AnchoredPopover } from "../order/fields/AnchoredPopover";
import { AccountSelector, type OptionsAccountMode } from "./AccountSelector";
import { ContractTypeTabs } from "./ContractTypeTabs";
import { DepositButton } from "./DepositButton";
import { TradeTypesFlyout } from "./TradeTypesFlyout";
import type { ContractTypeId } from "./contractTypes";

interface TopBarProps {
  contractType: ContractTypeId;
  onContractTypeChange: (id: ContractTypeId) => void;
  accountMode: OptionsAccountMode;
  accountBalance: number;
  onAccountOpen?: () => void;
  onDeposit?: () => void;
}

/**
 * Top bar — a single flex row split into two clusters:
 *
 *   [ trading-method tabs (flex-1, scrolls) ] [ right cluster (shrink-0) ]
 *
 * The tabs live in their own `flex-1 min-w-0 overflow-x-auto` track so a long
 * list scrolls *inside* itself instead of pushing the account / deposit
 * controls off-screen (the overlap bug). The right cluster is `ml-auto
 * shrink-0` so it stays pinned far-right regardless of tab count.
 *
 * Below lg the row wraps into two: the account cluster on top (it is what a
 * trader checks first — which account, how much) and the trade types beneath
 * it at full width, where there is room to scroll them.
 *
 * Right cluster is auth-gated: logged-out users see a single "Log in / Sign
 * up" CTA (opens the Deriv-connect modal); authenticated users get the Deriv
 * link chip, account selector and deposit button.
 */
export function TopBar({
  contractType,
  onContractTypeChange,
  accountMode,
  accountBalance,
  onAccountOpen,
  onDeposit,
}: TopBarProps) {
  const status = useAuthStore((s) => s.status);
  const authed = status === "authenticated";
  const [authOpen, setAuthOpen] = useState(false);
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const gridRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex h-full flex-wrap items-center gap-x-2 gap-y-1 px-3 py-2 land:flex-nowrap land:py-1 lg:flex-nowrap lg:px-4 lg:py-0">
      {/* Trade-types flyout trigger (§2 grid icon → §11 flyout) */}
      <button
        ref={gridRef}
        type="button"
        aria-label="Trade types"
        aria-haspopup="dialog"
        aria-expanded={flyoutOpen}
        onClick={() => setFlyoutOpen((v) => !v)}
        className={cn(
          "grid h-10 w-10 shrink-0 place-items-center rounded-lg transition-colors lg:h-9 lg:w-9",
          flyoutOpen
            ? "bg-opt-bg-sunk text-opt-ink"
            : "text-opt-ink-3 hover:bg-opt-bg-sunk hover:text-opt-ink",
        )}
      >
        <AppsGridIcon className="h-[18px] w-[18px]" />
      </button>
      {flyoutOpen && (
        <AnchoredPopover anchorRef={gridRef} onClose={() => setFlyoutOpen(false)}>
          <TradeTypesFlyout
            activeType={contractType}
            onSelect={(id) => {
              onContractTypeChange(id);
              setFlyoutOpen(false);
            }}
          />
        </AnchoredPopover>
      )}

      {/* Trading methods — scroll independently, never push the right cluster */}
      <div className="no-scrollbar min-w-0 flex-1 overflow-x-auto whitespace-nowrap lg:pb-1 lg:[scrollbar-width:thin]">
        <ContractTypeTabs value={contractType} onChange={onContractTypeChange} />
      </div>

      {/* Right cluster — pinned far right */}
      <div className="order-first flex w-full min-w-0 items-center justify-between gap-2 land:order-none land:w-auto land:shrink-0 lg:order-none lg:ml-auto lg:w-auto lg:shrink-0 lg:justify-start lg:gap-4">
        <span className="font-display text-[15px] font-semibold text-opt-ink land:hidden lg:hidden">
          dTrader
        </span>
        <div className="flex min-w-0 items-center gap-2 lg:contents">
        {authed ? (
          <>
            <ConnectDerivButton />
            <AccountSelector
              mode={accountMode}
              balance={accountBalance}
              onOpen={onAccountOpen}
            />
            <DepositButton onClick={onDeposit} />
          </>
        ) : (
          <LoginButton onClick={() => setAuthOpen(true)} />
        )}
        </div>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

function LoginButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-[40px] shrink-0 items-center rounded-[10px] px-4 py-1.5 lg:min-h-0",
        "text-[13px] font-semibold text-opt-bg transition-[filter] duration-150",
        "bg-opt-ink hover:brightness-110",
      )}
    >
      Log in / Sign up
    </button>
  );
}
