"use client";

import { useState } from "react";

/**
 * The ordinary Stop button is the one a user is meant to find. This one is
 * the way out of a bot that is stuck, so it stays a quiet text control and
 * asks again before it ends the run.
 */
export function EmergencyStopButton({
  busy,
  onConfirm,
}: {
  busy: boolean;
  onConfirm: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        disabled={busy}
        onClick={() => setOpen(true)}
        className="text-[11px] text-ink-3 underline-offset-2 hover:text-ink-2 hover:underline disabled:opacity-45"
      >
        Emergency stop
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="emergency-stop-title"
          onClick={() => {
            if (!busy) setOpen(false);
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl"
          >
            <h2 id="emergency-stop-title" className="text-lg font-semibold text-ink">
              Emergency stop
            </h2>
            <p className="mt-2 text-sm text-ink-2 leading-relaxed">
              This ends the bot immediately, so it cannot place another trade. If the open trade
              can be closed, it is closed. A trade Deriv will not sell is left to finish.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setOpen(false);
                  onConfirm();
                }}
                className="h-10 px-5 rounded-lg bg-red-500 text-sm font-medium text-white hover:bg-red-400 transition disabled:opacity-45"
              >
                {busy ? "Stopping…" : "Emergency stop"}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setOpen(false)}
                className="h-10 px-4 rounded-lg text-sm text-ink-2 hover:text-ink disabled:opacity-45"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
