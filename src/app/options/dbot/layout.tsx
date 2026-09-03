"use client";

import { BotTopBar } from "@/components/bot/BotTopBar";
import { useDerivStatus } from "@/hooks/useDerivStatus";
import { useAccountBalance } from "@/stores/useAccountBalance";

/**
 * Chrome shared by every page under /options/dbot.
 *
 * The header moved up here from the workspace page so that dBot's identity —
 * the account it trades, the balance it is risking, and the overflow menu — is
 * the same object on every screen in the area rather than something each page
 * re-declares. The menu in particular has to be reachable from the history and
 * subscription pages too, not only from the workspace.
 *
 * Full height and non-scrolling: dBot is an application surface, and its panels
 * own their own scrolling.
 */
export default function DBotLayout({ children }: { children: React.ReactNode }) {
  const deriv = useDerivStatus();
  const balance = useAccountBalance((s) => s.balance);
  const currency = useAccountBalance((s) => s.currency);

  return (
    <div
      data-app="options"
      data-opt-theme="light"
      className="flex h-screen flex-col overflow-hidden bg-opt-bg font-sans text-opt-ink"
    >
      <BotTopBar
        loginId={deriv.accountId ?? (deriv.isLoading ? "…" : "Not connected")}
        balance={balance}
        currency={currency}
        isVirtual={deriv.isVirtual}
      />
      {children}
    </div>
  );
}
