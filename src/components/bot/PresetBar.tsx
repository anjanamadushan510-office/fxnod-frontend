"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Bookmark, Check, ChevronDown, Download, Plus, RotateCcw, Trash2, Upload, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/cn";
import {
  useCreateBotPreset,
  useDeleteBotPreset,
  useListBotPresets,
  useUpdateBotPreset,
  getListBotPresetsQueryKey,
} from "@/services/api/endpoints/bots/bots";
import type { BotPreset } from "@/services/api/model";
import {
  fromPresetConfig,
  toPresetConfig,
  type BotFormState,
} from "./formState";
import { BotPackageModal } from "./BotPackageModal";

interface PresetBarProps {
  strategyId: string;
  currentState: BotFormState;
  onLoad: (state: BotFormState) => void;
  disabled?: boolean;
}

export function PresetBar({
  strategyId,
  currentState,
  onLoad,
  disabled = false,
}: PresetBarProps) {
  const queryClient = useQueryClient();
  const presetsQuery = useListBotPresets({ strategy_id: strategyId });

  const presets: BotPreset[] = useMemo(
    () => presetsQuery.data?.presets ?? [],
    [presetsQuery.data],
  );

  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [presetNameInput, setPresetNameInput] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saveMode, setSaveMode] = useState<"new" | "overwrite">("new");

  // Bot Package & Licensing Modal State
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [packageModalTab, setPackageModalTab] = useState<"export" | "licenses" | "import">("export");

  const activePreset = useMemo(
    () => presets.find((p) => p.id === activePresetId) ?? null,
    [presets, activePresetId],
  );

  // Check if current form differs from loaded preset
  const isModified = useMemo(() => {
    if (!activePreset) return false;
    const currentJson = JSON.stringify(toPresetConfig(currentState));
    const presetJson = JSON.stringify(toPresetConfig(fromPresetConfig(activePreset.config)));
    return currentJson !== presetJson;
  }, [activePreset, currentState]);

  const createMutation = useCreateBotPreset({
    mutation: {
      onSuccess: (newPreset) => {
        toast.success(`Preset "${newPreset.name}" saved!`);
        queryClient.invalidateQueries({
          queryKey: getListBotPresetsQueryKey({ strategy_id: strategyId }),
        });
        setActivePresetId(newPreset.id);
        setShowSaveModal(false);
        setPresetNameInput("");
      },
      onError: (err: any) => {
        const detail = err?.response?.data?.detail || "Failed to save preset";
        toast.error(detail);
      },
    },
  });

  const updateMutation = useUpdateBotPreset({
    mutation: {
      onSuccess: (updated) => {
        toast.success(`Preset "${updated.name}" updated!`);
        queryClient.invalidateQueries({
          queryKey: getListBotPresetsQueryKey({ strategy_id: strategyId }),
        });
        setShowSaveModal(false);
      },
      onError: (err: any) => {
        const detail = err?.response?.data?.detail || "Failed to update preset";
        toast.error(detail);
      },
    },
  });

  const deleteMutation = useDeleteBotPreset({
    mutation: {
      onSuccess: () => {
        toast.success("Preset deleted");
        queryClient.invalidateQueries({
          queryKey: getListBotPresetsQueryKey({ strategy_id: strategyId }),
        });
        setActivePresetId(null);
        setDeleteConfirmId(null);
      },
      onError: (err: any) => {
        const detail = err?.response?.data?.detail || "Failed to delete preset";
        toast.error(detail);
      },
    },
  });

  const handleSelectPreset = (id: string) => {
    if (id === "custom") {
      setActivePresetId(null);
      return;
    }
    const found = presets.find((p) => p.id === id);
    if (!found) return;

    setActivePresetId(found.id);
    const restored = fromPresetConfig(found.config);
    onLoad(restored);
    toast.info(`Loaded preset "${found.name}"`);
  };

  const handleOpenSave = () => {
    if (activePreset) {
      setSaveMode("overwrite");
      setPresetNameInput(activePreset.name);
    } else {
      setSaveMode("new");
      setPresetNameInput("");
    }
    setShowSaveModal(true);
  };

  const handleConfirmSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = presetNameInput.trim();
    if (!name) {
      toast.error("Please enter a preset name");
      return;
    }

    const serializedConfig = toPresetConfig(currentState);

    if (saveMode === "overwrite" && activePreset) {
      updateMutation.mutate({
        presetId: activePreset.id,
        data: {
          name,
          config: serializedConfig,
        },
      });
    } else {
      createMutation.mutate({
        data: {
          name,
          strategy_id: strategyId,
          config: serializedConfig,
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ presetId: id });
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  return (
    <div className="flex flex-col gap-2 rounded-[var(--opt-radius-sm)] border border-opt-line bg-opt-bg-elev/40 p-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-opt-ink">
          <Bookmark className="h-3.5 w-3.5 text-gold" />
          <span>Preset</span>
          {presets.length > 0 && (
            <span className="rounded-full bg-opt-bg-sunk px-1.5 py-0.2 text-[9.5px] font-semibold text-opt-ink-3">
              {presets.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              setPackageModalTab("import");
              setShowPackageModal(true);
            }}
            title="Import / Unlock an encrypted bot package (.txt)"
            className="flex h-6 items-center gap-1 rounded-[var(--opt-radius-sm)] border border-opt-line bg-opt-bg-elev px-2 text-[11px] font-semibold text-opt-ink transition-colors hover:border-opt-rise hover:text-opt-rise disabled:opacity-40"
          >
            <Upload className="h-3 w-3" />
            <span>Import</span>
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              setPackageModalTab("export");
              setShowPackageModal(true);
            }}
            title="Export / Download encrypted bot (.txt) with one-time password"
            className="flex h-6 items-center gap-1 rounded-[var(--opt-radius-sm)] border border-opt-line bg-opt-bg-elev px-2 text-[11px] font-semibold text-gold transition-colors hover:border-gold hover:bg-gold/10 disabled:opacity-40"
          >
            <Download className="h-3 w-3" />
            <span>Download Bot</span>
          </button>

          {activePreset && (
            <button
              type="button"
              disabled={disabled || isDeleting}
              onClick={() => setDeleteConfirmId(activePreset.id)}
              title="Delete this preset"
              aria-label="Delete preset"
              className="grid h-6 w-6 place-items-center rounded-[var(--opt-radius-sm)] text-opt-ink-3 transition-colors hover:bg-opt-fall-soft hover:text-opt-fall disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            type="button"
            disabled={disabled}
            onClick={handleOpenSave}
            className="flex h-6 items-center gap-1 rounded-[var(--opt-radius-sm)] border border-opt-line bg-opt-bg-elev px-2 text-[11px] font-semibold text-opt-ink transition-colors hover:border-gold hover:text-gold disabled:opacity-40"
          >
            <Plus className="h-3 w-3" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Preset selector dropdown */}
      <div className="relative">
        <select
          value={activePresetId ?? "custom"}
          disabled={disabled || presetsQuery.isLoading}
          onChange={(e) => handleSelectPreset(e.target.value)}
          aria-label="Select a bot preset"
          className={cn(
            "h-8 w-full appearance-none rounded-[var(--opt-radius-sm)] border border-opt-line bg-opt-bg-elev px-2.5 pr-7 text-[11.5px] text-opt-ink outline-none transition-colors",
            "focus:border-opt-line-strong disabled:opacity-50",
            activePreset && isModified && "border-gold/60 text-gold",
          )}
        >
          <option value="custom">
            {activePreset ? `● ${activePreset.name} (Modified)` : "Custom / Unsaved"}
          </option>
          {presets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-opt-ink-3" />
      </div>

      {/* State details & quick reset */}
      {activePreset && (
        <div className="flex items-center justify-between text-[10.5px]">
          <span className="flex items-center gap-1 text-opt-ink-3">
            {isModified ? (
              <span className="flex items-center gap-1 text-gold font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                Unsaved changes
              </span>
            ) : (
              <span className="flex items-center gap-1 text-opt-rise font-medium">
                <Check className="h-3 w-3" />
                Matched to preset
              </span>
            )}
          </span>

          {isModified && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleSelectPreset(activePreset.id)}
              className="flex items-center gap-1 text-opt-ink-3 hover:text-opt-ink transition-colors"
            >
              <RotateCcw className="h-2.5 w-2.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-[var(--opt-radius)] border border-opt-line bg-opt-bg-elev p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="m-0 text-[13px] font-bold text-opt-ink">
                {saveMode === "overwrite" ? "Update Preset" : "Save Bot Preset"}
              </h3>
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="grid h-6 w-6 place-items-center rounded text-opt-ink-3 hover:text-opt-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {activePreset && (
              <div className="mb-3 flex rounded-[var(--opt-radius-sm)] border border-opt-line p-0.5 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setSaveMode("overwrite");
                    setPresetNameInput(activePreset.name);
                  }}
                  className={cn(
                    "flex-1 rounded py-1 transition-colors",
                    saveMode === "overwrite"
                      ? "bg-opt-bg-sunk text-opt-ink shadow-xs"
                      : "text-opt-ink-3 hover:text-opt-ink",
                  )}
                >
                  Overwrite &quot;{activePreset.name}&quot;
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSaveMode("new");
                    setPresetNameInput("");
                  }}
                  className={cn(
                    "flex-1 rounded py-1 transition-colors",
                    saveMode === "new"
                      ? "bg-opt-bg-sunk text-opt-ink shadow-xs"
                      : "text-opt-ink-3 hover:text-opt-ink",
                  )}
                >
                  Save as New
                </button>
              </div>
            )}

            <form onSubmit={handleConfirmSave} className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-opt-ink-2">
                  Preset Name
                </label>
                <input
                  type="text"
                  autoFocus
                  maxLength={100}
                  placeholder="e.g. Safe Accu 1%, Aggressive Rise/Fall"
                  value={presetNameInput}
                  onChange={(e) => setPresetNameInput(e.target.value)}
                  className="h-9 w-full rounded-[var(--opt-radius-sm)] border border-opt-line bg-opt-bg px-2.5 text-[12px] text-opt-ink outline-none transition-colors focus:border-gold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  disabled={isSaving}
                  className="h-8 rounded-[var(--opt-radius-sm)] border border-opt-line px-3 text-[11.5px] font-semibold text-opt-ink-2 hover:bg-opt-bg-sunk"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !presetNameInput.trim()}
                  className="flex h-8 items-center gap-1.5 rounded-[var(--opt-radius-sm)] bg-gold px-4 text-[11.5px] font-bold text-navy-950 transition-transform active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Preset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xs rounded-[var(--opt-radius)] border border-opt-line bg-opt-bg-elev p-4 shadow-xl">
            <h3 className="m-0 text-[13px] font-bold text-opt-ink">
              Delete Preset?
            </h3>
            <p className="my-2 text-[11.5px] leading-relaxed text-opt-ink-3">
              Are you sure you want to delete &quot;{activePreset?.name}&quot;? This cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="h-8 rounded-[var(--opt-radius-sm)] border border-opt-line px-3 text-[11.5px] font-semibold text-opt-ink-2 hover:bg-opt-bg-sunk"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isDeleting}
                className="flex h-8 items-center gap-1.5 rounded-[var(--opt-radius-sm)] bg-opt-fall px-3.5 text-[11.5px] font-bold text-white hover:bg-opt-fall/90 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bot Package & One-Time Licensing Hub */}
      <BotPackageModal
        isOpen={showPackageModal}
        onClose={() => setShowPackageModal(false)}
        strategyId={strategyId}
        currentState={currentState}
        onLoadConfig={onLoad}
        onPresetCreated={(newPresetId) => setActivePresetId(newPresetId)}
        initialTab={packageModalTab}
        disabled={disabled}
      />
    </div>
  );
}
