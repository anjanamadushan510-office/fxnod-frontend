"use client";

import { ExternalLink, Link2, UserPlus, ArrowRight } from "lucide-react";
import { useBrokerSignup } from "@/services/brokerAffiliates";
import { useStartDerivOAuth } from "@/hooks/useStartDerivOAuth";

/** Signup attribution comes from the authenticated backend, never URL/local storage. */
export function DerivConnectPrompt({ compact = false }: { compact?: boolean }) {
  const signup = useBrokerSignup("deriv");
  const { start, redirecting } = useStartDerivOAuth();
  const url = signup.data?.url;
  return <section aria-label="Connect your Deriv account" className={`rounded-2xl border border-action-line bg-surface ${compact ? "p-4" : "p-5 sm:p-6"}`}>
    <div className="flex items-start gap-3">
      <span className="rounded-xl border border-line bg-surface-2 p-2.5 text-gold"><Link2 size={20} /></span>
      <div><h2 className="font-display text-base font-semibold text-ink">Connect Deriv before you run a bot</h2>
        <p className="mt-1 text-sm leading-relaxed text-ink-2">FXNOD needs your permission to place trades on Deriv. Connect your account, then choose Demo or Real when you set up your run.</p></div>
    </div>
    <div className={`mt-5 grid gap-4 ${compact ? "" : "md:grid-cols-2"}`}>
      <div className="rounded-xl border border-line bg-bg p-4">
        <h3 className="text-sm font-semibold text-ink">Already have a Deriv account?</h3>
        <p className="mt-1 text-xs leading-relaxed text-ink-3">Sign in securely on Deriv and allow FXNOD to connect. You will return to this page to finish your setup.</p>
        <button type="button" onClick={start} disabled={redirecting} className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-action px-4 text-sm font-medium text-action-ink disabled:opacity-50">
          <Link2 size={16} />{redirecting ? "Opening Deriv…" : "Connect my Deriv account"}<ArrowRight size={16} />
        </button>
      </div>
      <div className="rounded-xl border border-line bg-bg p-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-ink"><UserPlus size={16} className="text-gold" />New to Deriv?</h3>
        <p className="mt-1 text-xs leading-relaxed text-ink-3">Create your account on Deriv first. Then return here and select “Connect my Deriv account”. Creating an account does not start a bot.</p>
        {url ? <a href={url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-action-line px-4 text-sm font-medium text-ink hover:bg-surface-2">Create a Deriv account<ExternalLink size={15} /></a>
          : <button type="button" disabled={signup.isPending || signup.isFetching} onClick={() => void signup.refetch()} className="mt-4 min-h-10 w-full rounded-lg border border-line px-3 text-xs text-ink-2 disabled:opacity-50">{signup.isPending || signup.isFetching ? "Preparing your sign-up link…" : "Sign-up link unavailable · Retry"}</button>}
        {url && <p className="mt-2 text-[10px] leading-relaxed text-ink-3">{signup.data?.source === "partner" ? "Your FXNOD partner’s referral link." : "FXNOD referral link."} A referral commission may be earned.</p>}
      </div>
    </div>
    <p className="mt-4 text-xs text-ink-3">1. Create an account if needed <span aria-hidden>→</span> 2. Connect Deriv <span aria-hidden>→</span> 3. Review and start your bot</p>
  </section>;
}
