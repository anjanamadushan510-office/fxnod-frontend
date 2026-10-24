"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, Loader2, X } from "lucide-react";

interface DisconnectDerivModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  isDisconnecting?: boolean;
}

export function DisconnectDerivModal({
  isOpen,
  onClose,
  onConfirm,
  isDisconnecting = false,
}: DisconnectDerivModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && !isDisconnecting && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[120] w-[92vw] max-w-[440px] translate-x-[-50%] translate-y-[-50%] rounded-2xl border border-red-500/25 bg-white p-6 shadow-2xl duration-200 dark:border-red-900/40 dark:bg-[#111928] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-red-200 bg-red-100 text-red-600 shadow-sm dark:border-red-800/50 dark:bg-red-950/60 dark:text-red-400">
                <AlertTriangle className="h-6 w-6 stroke-[2.2]" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-white">
                  Disconnect Deriv?
                </Dialog.Title>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Global account disconnection
                </p>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                disabled={isDisconnecting}
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200 disabled:opacity-40"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description className="mt-3.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            Disconnecting will sign you out of your connected Deriv account across the entire FXNOD platform.
          </Dialog.Description>

          {/* Impact list */}
          <div className="mt-4 space-y-2 rounded-xl border border-red-200/80 bg-red-50/70 p-3.5 text-xs dark:border-red-900/40 dark:bg-red-950/20">
            <div className="flex items-start gap-2.5 text-red-900 dark:text-red-200">
              <span className="flex h-4 w-4 flex-none items-center justify-center rounded-full bg-red-200 text-[10px] font-bold text-red-800 dark:bg-red-900/60 dark:text-red-300">
                !
              </span>
              <span>
                <strong>All running bots will stop:</strong> Active automated strategies running in Bot Forge or Auto Hub will be halted immediately.
              </span>
            </div>
            <div className="flex items-start gap-2.5 text-red-900 dark:text-red-200">
              <span className="flex h-4 w-4 flex-none items-center justify-center rounded-full bg-red-200 text-[10px] font-bold text-red-800 dark:bg-red-900/60 dark:text-red-300">
                !
              </span>
              <span>
                <strong>Trading session closed:</strong> Trade Pilot will be disconnected and you must reconnect your account before trading again.
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={isDisconnecting}
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isDisconnecting}
              onClick={onConfirm}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-red-600/25 transition-all hover:bg-red-700 active:scale-[0.98] disabled:opacity-50"
            >
              {isDisconnecting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Disconnecting…
                </>
              ) : (
                "Disconnect Deriv"
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
