import { X, Image as ImageIcon, FileText } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadPNG: () => void;
  onDownloadCSV: () => void;
  isDownloadingCSV?: boolean;
}

export function DownloadModal({ isOpen, onClose, onDownloadPNG, onDownloadCSV, isDownloadingCSV }: DownloadModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[100] grid w-full max-w-[400px] translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111928] p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <div className="flex flex-col space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-white">
                Download
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 p-1">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Download your current chart view as a PNG or export the historical data for analysis as a CSV.
            </Dialog.Description>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              onClick={() => {
                onDownloadPNG();
                onClose();
              }}
              className="flex flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1f2937] p-6 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <ImageIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
              <span className="font-semibold text-sm">PNG</span>
            </button>

            <button
              onClick={() => {
                if (!isDownloadingCSV) {
                  onDownloadCSV();
                }
              }}
              disabled={isDownloadingCSV}
              className="flex flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1f2937] p-6 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloadingCSV ? (
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-500 border-t-transparent dark:border-gray-400 dark:border-t-transparent" />
              ) : (
                <FileText className="h-8 w-8 text-gray-500 dark:text-gray-400" />
              )}
              <span className="font-semibold text-sm">CSV (Last 1 Hour)</span>
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
