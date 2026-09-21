"use client";

import { cn } from "@/lib/cn";

interface DepositButtonProps {
  onClick?: () => void;
  className?: string;
}

/**
 * Coral/red rounded pill at the top right (Vela's deposit colour, not the
 * home page's gold). Uses --opt-fall by default so it tracks the dark/light
 * theme without extra rules.
 */
export function DepositButton({ onClick, className }: DepositButtonProps) {
  return (
    <a
      href="https://home.deriv.com/dashboard/transfer?from=dtrader&source=options&acc=options&curr=USD"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex-shrink-0 inline-flex items-center justify-center rounded-full border-0 px-[18px] py-2 text-[13px] font-semibold text-white",
        "bg-opt-fall hover:brightness-95 transition-[filter] duration-150",
        className,
      )}
    >
      Deposit
    </a>
  );
}
