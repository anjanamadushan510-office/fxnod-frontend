"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Check,
  Copy,
  Download,
  FileText,
  KeyRound,
  Lock,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  Unlock,
  Upload,
  X,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/cn";
import {
  useClaimBotPackage,
  useCreateBotPackage,
  useListMyBotPackages,
  useRevokeBotPackage,
  getListMyBotPackagesQueryKey,
} from "@/services/api/endpoints/bots/packages";
import {
  useCreateBotPreset,
  getListBotPresetsQueryKey,
} from "@/services/api/endpoints/bots/presets";
import type { BotPackage } from "@/services/api/model";
import {
  fromPresetConfig,
  toPresetConfig,
  type BotFormState,
} from "./formState";

interface BotPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategyId: string;
  currentState: BotFormState;
  onLoadConfig: (state: BotFormState) => void;
  onPresetCreated?: (presetId: string) => void;
  initialTab?: "export" | "licenses" | "import";
  disabled?: boolean;
}

export function BotPackageModal({
  isOpen,
  onClose,
  strategyId,
  currentState,
  onLoadConfig,
  onPresetCreated,
  initialTab = "export",
  disabled = false,
}: BotPackageModalProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"export" | "licenses" | "import">(initialTab);

  // Export Tab State
  const [packageName, setPackageName] = useState("");
  const [password, setPassword] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Import Tab State
  const [importFileContent, setImportFileContent] = useState<string>("");
  const [importFileName, setImportFileName] = useState<string>("");
  const [importPassword, setImportPassword] = useState("");

  const packagesQuery = useListMyBotPackages();
  const myPackages: BotPackage[] = useMemo(
    () => packagesQuery.data?.packages ?? [],
    [packagesQuery.data],
  );

  const createPresetMutation = useCreateBotPreset({
    mutation: {
      onSuccess: (newPreset) => {
        queryClient.invalidateQueries({ queryKey: getListBotPresetsQueryKey(strategyId) });
        queryClient.invalidateQueries({ queryKey: getListBotPresetsQueryKey() });
        if (onPresetCreated) {
          onPresetCreated(newPreset.id);
        }
      },
    },
  });

  const createMutation = useCreateBotPackage({
    mutation: {
      onSuccess: (res) => {
        toast.success(`Bot package "${res.package.name}" generated & downloaded!`);
        // Trigger browser file download
        downloadBlob(res.file_content, res.file_name);
        queryClient.invalidateQueries({ queryKey: getListMyBotPackagesQueryKey() });
        setPackageName("");
        setPassword("");
        setActiveTab("licenses");
      },
      onError: (err: any) => {
        const detail = err?.response?.data?.detail || "Failed to create bot package";
        toast.error(detail);
      },
    },
  });

  const claimMutation = useClaimBotPackage({
    mutation: {
      onSuccess: (res) => {
        const restored = fromPresetConfig(res.config);
        onLoadConfig(restored);

        // Auto-save the imported bot to the user's saved presets!
        const presetName = res.name || `${strategyId} (Imported)`;
        createPresetMutation.mutate({
          data: {
            name: presetName,
            strategy_id: res.strategy_id || strategyId,
            config: toPresetConfig(restored),
          },
        });

        toast.success(`Bot "${res.name}" imported and automatically saved to your presets!`);
        queryClient.invalidateQueries({ queryKey: getListMyBotPackagesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListBotPresetsQueryKey(strategyId) });
        queryClient.invalidateQueries({ queryKey: getListBotPresetsQueryKey() });
        setImportFileContent("");
        setImportFileName("");
        setImportPassword("");
        onClose();
      },
      onError: (err: any) => {
        const detail = err?.response?.data?.detail || "Failed to import bot";
        toast.error(detail);
      },
    },
  });

  const revokeMutation = useRevokeBotPackage({
    mutation: {
      onSuccess: () => {
        toast.success("Bot package revoked");
        queryClient.invalidateQueries({ queryKey: getListMyBotPackagesQueryKey() });
      },
      onError: (err: any) => {
        const detail = err?.response?.data?.detail || "Failed to revoke package";
        toast.error(detail);
      },
    },
  });

  const handleGeneratePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*";
    let gen = "";
    for (let i = 0; i < 10; i++) {
      gen += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(gen);
  };

  const handleExport = (e: React.FormEvent) => {
    e.preventDefault();
    const name = packageName.trim() || `${strategyId.toUpperCase()} Custom Strategy`;
    if (!password.trim()) {
      toast.error("Please enter a password for this package");
      return;
    }

    createMutation.mutate({
      data: {
        name,
        strategy_id: strategyId,
        password: password.trim(),
        config: toPresetConfig(currentState),
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      setImportFileContent(content);
    };
    reader.readAsText(file);
  };

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFileContent.trim()) {
      toast.error("Please select or drop a .txt bot package file");
      return;
    }
    if (!importPassword.trim()) {
      toast.error("Please enter the one-time password");
      return;
    }

    claimMutation.mutate({
      data: {
        file_content: importFileContent.trim(),
        password: importPassword.trim(),
      },
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.info("Password copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="flex h-[560px] w-full max-w-2xl flex-col rounded-[var(--opt-radius)] border border-opt-line bg-opt-bg-elev shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-opt-line px-5 py-3.5 bg-opt-bg-sunk/50">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-gold/15 text-gold">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="m-0 text-[14px] font-bold text-opt-ink">
                Bot Licensing &amp; Encrypted Package Hub
              </h2>
              <p className="m-0 text-[11px] text-opt-ink-3">
                Securely export, sell with one-time passwords, or import bot packages.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="grid h-7 w-7 place-items-center rounded text-opt-ink-3 hover:bg-opt-bg-elev hover:text-opt-ink transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-opt-line bg-opt-bg-sunk/30 px-5 pt-1.5 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("export")}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-3.5 py-2 text-[12px] font-semibold transition-colors",
              activeTab === "export"
                ? "border-gold text-gold"
                : "border-transparent text-opt-ink-3 hover:text-opt-ink",
            )}
          >
            <Download className="h-3.5 w-3.5" />
            Export &amp; Lock Bot
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("licenses")}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-3.5 py-2 text-[12px] font-semibold transition-colors",
              activeTab === "licenses"
                ? "border-gold text-gold"
                : "border-transparent text-opt-ink-3 hover:text-opt-ink",
            )}
          >
            <KeyRound className="h-3.5 w-3.5" />
            My Exported Licenses
            {myPackages.length > 0 && (
              <span className="rounded-full bg-gold/15 px-1.5 py-0.2 text-[10px] font-bold text-gold">
                {myPackages.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("import")}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-3.5 py-2 text-[12px] font-semibold transition-colors",
              activeTab === "import"
                ? "border-gold text-gold"
                : "border-transparent text-opt-ink-3 hover:text-opt-ink",
            )}
          >
            <Upload className="h-3.5 w-3.5" />
            Import / Unlock Bot
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* TAB 1: EXPORT & LOCK */}
          {activeTab === "export" && (
            <form onSubmit={handleExport} className="mx-auto flex max-w-lg flex-col gap-4">
              <div className="rounded-[var(--opt-radius-sm)] border border-opt-line bg-opt-bg-sunk/40 p-3 text-[11.5px] leading-relaxed text-opt-ink-2">
                <span className="font-semibold text-gold">🛡️ One-Time License Security:</span>{" "}
                This creates an AES-256 encrypted <code className="text-opt-ink font-mono">.txt</code> package of your current bot configuration. You can share this file along with the password to a buyer. Once claimed by a user, that password and file are permanently locked and cannot be reused by anyone else.
              </div>

              <div>
                <label className="mb-1 block text-[11.5px] font-semibold text-opt-ink-2">
                  Bot Package Label
                </label>
                <input
                  type="text"
                  maxLength={100}
                  placeholder={`e.g. VIP ${strategyId} Safe Profit`}
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  className="h-9 w-full rounded-[var(--opt-radius-sm)] border border-opt-line bg-opt-bg px-3 text-[12px] text-opt-ink outline-none transition-colors focus:border-gold"
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-[11.5px] font-semibold text-opt-ink-2">
                    One-Time Password / License Key <span className="text-opt-fall">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="flex items-center gap-1 text-[11px] font-semibold text-gold hover:underline"
                  >
                    <Sparkles className="h-3 w-3" />
                    Auto Generate Key
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    minLength={4}
                    maxLength={128}
                    placeholder="Enter or generate a custom access key"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-9 w-full rounded-[var(--opt-radius-sm)] border border-opt-line bg-opt-bg px-3 font-mono text-[12.5px] text-gold outline-none transition-colors focus:border-gold"
                  />
                </div>
                <p className="mt-1 text-[10.5px] text-opt-ink-3">
                  Give this password to the buyer alongside the downloaded file.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={createMutation.isPending || !password.trim()}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-[var(--opt-radius-sm)] bg-gold px-4 text-[12.5px] font-bold text-navy-950 shadow-md transition-transform active:scale-98 disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  {createMutation.isPending ? "Encrypting & Generating..." : "Generate Encrypted Bot & Download (.txt)"}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: MY EXPORTED LICENSES */}
          {activeTab === "licenses" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="m-0 text-[11.5px] text-opt-ink-3">
                  All bot packages you have exported. Track which ones are still unused vs claimed.
                </p>
                <button
                  type="button"
                  onClick={() => queryClient.invalidateQueries({ queryKey: getListMyBotPackagesQueryKey() })}
                  className="flex items-center gap-1 text-[11px] font-semibold text-opt-ink-3 hover:text-opt-ink transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                  Refresh
                </button>
              </div>

              {packagesQuery.isLoading && (
                <div className="py-8 text-center text-[12px] text-opt-ink-3">Loading licenses...</div>
              )}

              {!packagesQuery.isLoading && myPackages.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-[var(--opt-radius)] border border-dashed border-opt-line py-12 text-center">
                  <FileText className="h-8 w-8 text-opt-ink-4 mb-2" />
                  <p className="m-0 text-[12.5px] font-semibold text-opt-ink-2">No exported bot packages yet</p>
                  <p className="m-0 mt-1 text-[11px] text-opt-ink-3">
                    Export a bot from the first tab to generate your first license.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("export")}
                    className="mt-3 flex items-center gap-1 rounded bg-gold/15 px-3 py-1.5 text-[11.5px] font-semibold text-gold hover:bg-gold/25"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Export Current Bot
                  </button>
                </div>
              )}

              {!packagesQuery.isLoading && myPackages.length > 0 && (
                <div className="overflow-x-auto rounded-[var(--opt-radius-sm)] border border-opt-line">
                  <table className="w-full text-left text-[11.5px]">
                    <thead className="border-b border-opt-line bg-opt-bg-sunk text-opt-ink-2 font-semibold">
                      <tr>
                        <th className="p-2.5">Bot / Name</th>
                        <th className="p-2.5">Password Key</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-opt-line bg-opt-bg-elev">
                      {myPackages.map((pkg) => (
                        <tr key={pkg.id} className="hover:bg-opt-bg-sunk/30 transition-colors">
                          <td className="p-2.5">
                            <div className="font-semibold text-opt-ink">{pkg.name}</div>
                            <div className="text-[10px] text-opt-ink-3 capitalize">
                              {pkg.strategy_id} · {new Date(pkg.created_at).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-2.5">
                            <div className="flex items-center gap-1.5">
                              <code className="rounded bg-opt-bg px-1.5 py-0.5 font-mono text-[11px] font-bold text-gold">
                                {pkg.display_password}
                              </code>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(pkg.display_password, pkg.id)}
                                title="Copy Password"
                                className="text-opt-ink-3 hover:text-opt-ink"
                              >
                                {copiedId === pkg.id ? (
                                  <Check className="h-3.5 w-3.5 text-opt-rise" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="p-2.5">
                            {pkg.status === "available" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-opt-rise/15 px-2 py-0.5 text-[10px] font-bold text-opt-rise">
                                <span className="h-1.5 w-1.5 rounded-full bg-opt-rise animate-pulse" />
                                Available (Unused)
                              </span>
                            )}
                            {pkg.status === "claimed" && (
                              <span className="inline-flex flex-col text-[10px]">
                                <span className="font-bold text-opt-fall">🔴 Claimed / Used</span>
                                {pkg.claimed_at && (
                                  <span className="text-opt-ink-3">
                                    {new Date(pkg.claimed_at).toLocaleDateString()} {new Date(pkg.claimed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                )}
                              </span>
                            )}
                            {pkg.status === "revoked" && (
                              <span className="inline-flex items-center rounded-full bg-opt-ink-4/15 px-2 py-0.5 text-[10px] font-bold text-opt-ink-3">
                                Revoked
                              </span>
                            )}
                          </td>
                          <td className="p-2.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setPackageName(`${pkg.name} (Copy)`);
                                  handleGeneratePassword();
                                  setActiveTab("export");
                                }}
                                title="Generate another license copy to sell"
                                className="rounded px-2 py-1 text-[10.5px] font-semibold text-gold bg-gold/10 hover:bg-gold/20 transition-colors"
                              >
                                + Another Copy
                              </button>

                              {pkg.status === "available" && (
                                <button
                                  type="button"
                                  disabled={revokeMutation.isPending}
                                  onClick={() => revokeMutation.mutate({ packageId: pkg.id })}
                                  title="Revoke License"
                                  className="grid h-6 w-6 place-items-center rounded text-opt-ink-3 hover:bg-opt-fall-soft hover:text-opt-fall transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: IMPORT / UNLOCK */}
          {activeTab === "import" && (
            <form onSubmit={handleClaim} className="mx-auto flex max-w-lg flex-col gap-4">
              <div className="rounded-[var(--opt-radius-sm)] border border-opt-line bg-opt-bg-sunk/40 p-3 text-[11.5px] leading-relaxed text-opt-ink-2">
                <span className="font-semibold text-opt-rise">📥 Import Bot Package:</span>{" "}
                Upload the <code className="text-opt-ink font-mono">.txt</code> bot file received from the seller and enter the one-time password to unlock and load the bot strategy directly into your workspace.
              </div>

              {/* File Drop / Select Area */}
              <div>
                <label className="mb-1 block text-[11.5px] font-semibold text-opt-ink-2">
                  Encrypted Bot Package File (.txt) <span className="text-opt-fall">*</span>
                </label>
                <div className="relative flex flex-col items-center justify-center rounded-[var(--opt-radius-sm)] border border-dashed border-opt-line bg-opt-bg-sunk/20 p-5 text-center transition-colors hover:border-gold">
                  <Upload className="h-6 w-6 text-opt-ink-3 mb-1.5" />
                  {importFileName ? (
                    <div className="text-[12px] font-semibold text-gold flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {importFileName}
                    </div>
                  ) : (
                    <>
                      <span className="text-[12px] font-medium text-opt-ink">
                        Click to browse or drop .txt file
                      </span>
                      <span className="text-[10px] text-opt-ink-3 mt-0.5">
                        Only valid FXNod encrypted bot files
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept=".txt"
                    required
                    onChange={handleFileUpload}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-1 block text-[11.5px] font-semibold text-opt-ink-2">
                  One-Time Password / License Key <span className="text-opt-fall">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter the password provided by the creator"
                  value={importPassword}
                  onChange={(e) => setImportPassword(e.target.value)}
                  className="h-9 w-full rounded-[var(--opt-radius-sm)] border border-opt-line bg-opt-bg px-3 font-mono text-[12.5px] text-gold outline-none transition-colors focus:border-gold"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={claimMutation.isPending || !importFileContent || !importPassword.trim()}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-[var(--opt-radius-sm)] bg-opt-rise px-4 text-[12.5px] font-bold text-white shadow-md transition-transform active:scale-98 disabled:opacity-50"
                >
                  <Unlock className="h-4 w-4" />
                  {claimMutation.isPending ? "Verifying & Unlocking..." : "Unlock & Load into dBot"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function downloadBlob(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
