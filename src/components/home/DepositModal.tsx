"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { AlertTriangle, Check, Copy, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
  useCreateBinancePayOrder,
  useCreateManualDeposit,
  useGetOrCreateDepositAddress,
  useListChainDeposits,
} from "@/services/api/endpoints/wallet/wallet";
import type { ChainDepositResponse } from "@/services/api/model";

interface DepositModalProps {
  onClose: () => void;
}

type Tab = "crypto" | "binance" | "manual";

/** Poll while a deposit is confirming — the user is watching this screen. */
const IN_FLIGHT_POLL_MS = 15_000;

const CHAIN_LABEL = "TRC-20 (Tron)";

/**
 * Deposit statuses that are still moving. Anything else is settled, and the
 * list stops polling.
 */
const IN_FLIGHT = new Set(["pending", "confirmed"]);

export function DepositModal({ onClose }: DepositModalProps) {
  const [tab, setTab] = useState<Tab>("crypto");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <div className="my-auto w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-xl">
        <h2 className="mb-2 text-xl font-bold text-ink">Deposit Funds</h2>
        <p className="mb-6 text-sm text-ink-2">Top up your wallet balance.</p>

        <div className="mb-6 flex rounded-lg bg-body p-1">
          <TabButton active={tab === "crypto"} onClick={() => setTab("crypto")}>
            Crypto
          </TabButton>
          <TabButton active={tab === "binance"} onClick={() => setTab("binance")}>
            Binance Pay
          </TabButton>
          <TabButton active={tab === "manual"} onClick={() => setTab("manual")}>
            Need help?
          </TabButton>
        </div>

        {tab === "crypto" && <CryptoDeposit />}
        {tab === "binance" && <BinancePayDeposit onClose={onClose} />}
        {tab === "manual" && <ManualDepositClaim />}

        <div className="mt-6">
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-md py-2 text-xs font-semibold transition-all ${
        active ? "bg-surface text-gold shadow-sm" : "text-ink-2 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * The primary path: the user's own address, watched by the chain monitor.
 *
 * There is deliberately no amount field. The chain reports what arrived, so
 * asking the user to declare it would only create a number that can disagree
 * with reality — which is exactly the weakness of the manual flow below.
 */
function CryptoDeposit() {
  const addressQuery = useGetOrCreateDepositAddress();
  const { mutate: requestAddress, data: address, isPending, error } = addressQuery;

  useEffect(() => {
    requestAddress({ data: { chain: "trc20", currency: "USDT" } });
  }, [requestAddress]);

  if (isPending || (!address && !error)) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-ink-2">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
        <p className="text-sm">Preparing your deposit address…</p>
      </div>
    );
  }

  if (error || !address) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
        Deposit addresses are temporarily unavailable. Please try again shortly,
        or use “Need help?” if you have already sent funds.
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Sending on the wrong network is the single most common way a user
          loses a deposit, and it is unrecoverable. So this warning comes
          BEFORE the address, not as fine print under it. */}
      <div className="mb-4 flex gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
        <p className="text-xs leading-relaxed text-ink">
          Send <strong>USDT on the {CHAIN_LABEL} network only</strong>. Funds
          sent on any other network, or any other coin, cannot be recovered.
        </p>
      </div>

      <AddressBlock address={address.address} />

      <dl className="mb-4 space-y-1.5 rounded-lg bg-body p-3 text-xs">
        <Row label="Network" value={CHAIN_LABEL} />
        <Row label="Minimum deposit" value={`${address.min_deposit} USDT`} />
        <Row
          label="Credited after"
          value={`${address.required_confirmations} confirmations`}
        />
      </dl>

      <p className="mb-5 text-center text-xs leading-relaxed text-ink-3">
        This address is yours and stays the same — save it and reuse it. Your
        balance updates automatically once the network confirms your transfer.
      </p>

      <DepositActivity />
    </div>
  );
}

function AddressBlock({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  const [qr, setQr] = useState<string | null>(null);

  // Rendered locally rather than through an image service: this address
  // identifies one user, and handing every deposit address to a third-party
  // host — which then also sees the user's IP — is not something a wallet
  // screen should do. It also means the QR still works if that host does not.
  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(address, { width: 320, margin: 1 })
      .then((url) => {
        if (!cancelled) setQr(url);
      })
      .catch(() => {
        // The address text below is the source of truth; a missing QR is a
        // convenience lost, not a blocked deposit.
        if (!cancelled) setQr(null);
      });
    return () => {
      cancelled = true;
    };
  }, [address]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(address).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => setCopied(false),
    );
  }, [address]);

  return (
    <>
      <div className="mb-4 flex justify-center">
        <div className="rounded-lg bg-white p-2">
          {qr ? (
            <Image
              src={qr}
              alt={`QR code for your ${CHAIN_LABEL} deposit address`}
              width={160}
              height={160}
              unoptimized
            />
          ) : (
            <div className="flex h-[160px] w-[160px] items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-[#1a1208]" />
            </div>
          )}
        </div>
      </div>

      <button
        onClick={copy}
        className="group mb-4 flex w-full items-center justify-between gap-3 rounded-lg border border-line bg-body p-3 text-left transition-colors hover:border-gold"
        aria-label="Copy deposit address"
      >
        <span className="break-all font-mono text-sm font-bold text-gold">
          {address}
        </span>
        <span className="flex-shrink-0 rounded-md bg-surface p-2 text-ink-3 transition-colors group-hover:text-gold">
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </span>
      </button>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink-3">{label}</dt>
      <dd className="font-semibold text-ink">{value}</dd>
    </div>
  );
}

/**
 * In-flight and recent deposits.
 *
 * Shown on the deposit screen because "I sent it, where is it" is the question
 * this whole flow has to answer without a support ticket. Polls only while
 * something is actually moving.
 */
function DepositActivity() {
  const { data: deposits } = useListChainDeposits(
    { limit: 5 },
    {
      query: {
        refetchInterval: (query) => {
          const rows = query.state.data as ChainDepositResponse[] | undefined;
          return rows?.some((d) => IN_FLIGHT.has(d.status))
            ? IN_FLIGHT_POLL_MS
            : false;
        },
      },
    },
  );

  if (!deposits?.length) return null;

  return (
    <div className="border-t border-line pt-4">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-3">
        Recent deposits
      </h3>
      <ul className="space-y-2">
        {deposits.map((deposit) => (
          <li
            key={deposit.id}
            className="flex items-center justify-between gap-3 rounded-lg bg-body px-3 py-2"
          >
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink">
                {deposit.amount} {deposit.currency}
              </p>
              <p className="truncate font-mono text-[10px] text-ink-3">
                {deposit.tx_hash}
              </p>
            </div>
            <DepositStatusBadge deposit={deposit} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function DepositStatusBadge({ deposit }: { deposit: ChainDepositResponse }) {
  const { label, tone, hint } = useMemo(() => describe(deposit), [deposit]);

  return (
    <div className="flex-shrink-0 text-right">
      <span className={`text-xs font-semibold ${tone}`}>{label}</span>
      {hint && <p className="mt-0.5 text-[10px] text-ink-3">{hint}</p>}
    </div>
  );
}

/**
 * Every non-credited state gets a reason the user can act on. A deposit that
 * silently shows nothing is the thing that generates support tickets.
 */
function describe(deposit: ChainDepositResponse): {
  label: string;
  tone: string;
  hint: string | null;
} {
  switch (deposit.status) {
    case "credited":
      return { label: "Credited", tone: "text-green-500", hint: null };
    case "pending":
      return {
        label: "Confirming",
        tone: "text-amber-500",
        hint: `${deposit.confirmations} confirmations`,
      };
    case "confirmed":
      return { label: "Crediting", tone: "text-amber-500", hint: null };
    case "below_minimum":
      return {
        label: "Below minimum",
        tone: "text-ink-3",
        hint: "Too small to credit",
      };
    case "orphaned":
      return {
        label: "Not found",
        tone: "text-red-500",
        hint: "Never confirmed on chain",
      };
    case "failed":
      return {
        label: "Failed",
        tone: "text-red-500",
        hint: "Reverted on chain",
      };
    default:
      return { label: "On hold", tone: "text-ink-3", hint: "Contact support" };
  }
}

function BinancePayDeposit({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState("100");
  const [unavailable, setUnavailable] = useState(false);

  const { mutate, isPending, error } = useCreateBinancePayOrder({
    mutation: {
      onSuccess: (order) => {
        // Null until the Binance order API is wired up. Rather than open a
        // blank tab, say so — the order is recorded either way.
        if (order.checkout_url) {
          window.open(order.checkout_url, "_blank");
          onClose();
        } else {
          setUnavailable(true);
        }
      },
      onError: (err) => {
        // 503 is the backend saying the integration is switched off. That is
        // a state to explain, not an error to show as a failure.
        if (statusOf(err) === 503) setUnavailable(true);
      },
    },
  });

  if (unavailable) {
    return (
      <div className="animate-fade-in rounded-lg border border-line bg-body p-4">
        <p className="text-sm leading-relaxed text-ink-2">
          Binance Pay deposits are not switched on yet. Use the{" "}
          <strong className="text-ink">Crypto</strong> tab to deposit USDT
          directly — it credits automatically once the network confirms.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <label className="mb-1 block text-sm font-semibold text-ink-2">
        Amount (USDT)
      </label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="mb-4 w-full rounded-xl border border-line bg-body px-4 py-3 text-lg font-bold text-ink focus:border-gold focus:outline-none"
        min="10"
        step="10"
      />
      {error && <p className="mb-4 text-sm text-red-500">{messageFor(error)}</p>}
      <Button
        variant="gold"
        className="w-full"
        onClick={() => mutate({ data: { amount, currency: "USDT" } })}
        disabled={isPending || !amount || Number(amount) <= 0}
      >
        {isPending ? "Processing…" : "Pay with Binance"}
      </Button>
    </div>
  );
}

/**
 * Fallback for a deposit the monitor did not pick up.
 *
 * Framed as "already sent but not showing up" rather than as a way to deposit,
 * because it is slower and needs a human. Nothing here credits anything — it
 * opens a request.
 */
function ManualDepositClaim() {
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [done, setDone] = useState(false);

  const { mutate, isPending, error } = useCreateManualDeposit({
    mutation: { onSuccess: () => setDone(true) },
  });

  const submit = () =>
    mutate({ data: { amount, tx_hash: txHash.trim() } });

  if (done) {
    return (
      <div className="animate-fade-in rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-500">
        Thanks — we have your transaction and our team will review it. Your
        balance updates once it is verified.
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <p className="mb-4 text-sm leading-relaxed text-ink-2">
        Already sent a deposit that has not appeared? Most transfers are
        detected automatically within minutes. If yours has not shown up, give
        us the transaction hash and we will look into it.
      </p>

      <label className="mb-1 block text-sm font-semibold text-ink-2">
        Amount sent (USDT)
      </label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.00"
        className="mb-4 w-full rounded-xl border border-line bg-body px-4 py-3 text-lg font-bold text-ink focus:border-gold focus:outline-none"
        min="0"
      />

      <label className="mb-1 block text-sm font-semibold text-ink-2">
        Transaction hash
      </label>
      <input
        type="text"
        value={txHash}
        onChange={(e) => setTxHash(e.target.value)}
        placeholder="Paste the TxID from your wallet…"
        className="mb-4 w-full rounded-xl border border-line bg-body px-4 py-3 font-mono text-sm text-ink focus:border-gold focus:outline-none"
      />

      {error && (
        <p className="mb-4 text-sm text-red-500">{messageFor(error)}</p>
      )}

      <Button
        variant="gold"
        className="w-full"
        onClick={submit}
        disabled={
          isPending || txHash.trim().length < 10 || !amount || Number(amount) <= 0
        }
      >
        {isPending ? "Submitting…" : "Submit for review"}
      </Button>
    </div>
  );
}

function statusOf(err: unknown): number | undefined {
  return (err as { response?: { status?: number } })?.response?.status;
}

/** Turn an Axios failure into something worth showing a user. */
function messageFor(err: unknown): string {
  const response = (err as { response?: { status?: number; data?: { detail?: unknown } } })
    ?.response;
  if (response?.status === 401) {
    return "Please log in to your account to deposit funds.";
  }
  // The API's own 409 text explains duplicates and already-detected deposits
  // better than anything this component could guess. A 422 detail is an array
  // of field errors, which is not a sentence — fall through to the generic
  // message rather than rendering "[object Object]".
  const detail = response?.data?.detail;
  if (typeof detail === "string") return detail;
  return "Something went wrong. Please try again.";
}
