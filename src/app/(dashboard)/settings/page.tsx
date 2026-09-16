"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/stores/authStore";
import { UpdateEmailModal } from "@/components/settings/UpdateEmailModal";
import { updateMe } from "@/services/api/endpoints/users/users";
import { isAxiosError } from "axios";
import { toast } from "sonner";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, logout, bootstrap } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUpdateEmailModalOpen, setIsUpdateEmailModalOpen] = useState(false);

  const [fullName, setFullName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (user?.full_name) {
      setFullName(user.full_name);
    }
  }, [user?.full_name]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } finally {
      setIsLoggingOut(false);
      router.push("/");
    }
  };

  const handleSave = async () => {
    const newName = fullName.trim();
    if (!newName || newName === user?.full_name) return;

    setIsSaving(true);
    try {
      await updateMe({ full_name: newName });
      toast.success("Profile updated successfully");
      await bootstrap();
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (typeof detail === "string") {
          toast.error(detail);
        } else if (Array.isArray(detail) && detail.length > 0 && detail[0].msg) {
          toast.error(detail[0].msg);
        } else {
          toast.error("An unexpected error occurred.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="p-4 lg:p-8 space-y-6">
      {/* Header */}


      {/* Profile Card */}
      <div className="bg-surface border border-line rounded-2xl p-6">
        <h2 className="text-sm font-medium text-ink mb-4">Profile</h2>

        <div className="mb-3">
          <p className="text-sm text-ink">Email Address</p>
          <p className="text-xs text-ink-3">Used for sign-in and recovery</p>
        </div>

        <div className="flex items-center gap-3 max-w-sm mb-6">
          <input
            type="text"
            disabled
            value={user?.email || ""}
            className="flex-1 bg-bg border border-line rounded-lg px-3 py-2 text-sm text-ink-2 disabled:opacity-70"
          />
          <button
            onClick={() => setIsUpdateEmailModalOpen(true)}
            className="text-sm font-medium text-ink-2 hover:text-ink transition-colors px-2"
          >
            Change
          </button>
        </div>

        <div className="mb-3">
          <p className="text-sm text-ink">Display Name</p>
          <p className="text-xs text-ink-3">Your full name as shown on the platform</p>
        </div>

        <div className="max-w-sm">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-bg border border-line rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-ink transition-colors"
          />
        </div>
      </div>

      {/* Appearance Card */}
      <div className="bg-surface border border-line rounded-2xl p-6">
        <h2 className="text-sm font-medium text-ink mb-4">Appearance</h2>

        <div className="mb-3">
          <p className="text-sm text-ink">Theme</p>
          <p className="text-xs text-ink-3">Switch the terminal between dark and light</p>
        </div>

        <div className="grid grid-cols-2 p-1 bg-bg border border-line rounded-lg w-full max-w-sm mb-6">
          <button
            onClick={() => setTheme("dark")}
            className={`rounded-md py-2 text-sm font-medium transition-colors ${mounted && theme === 'dark' ? 'bg-ink text-surface' : 'text-ink-2 hover:text-ink'}`}
          >
            Dark
          </button>
          <button
            onClick={() => setTheme("light")}
            className={`rounded-md py-2 text-sm font-medium transition-colors ${mounted && theme === 'light' ? 'bg-ink text-surface' : 'text-ink-2 hover:text-ink'}`}
          >
            Light
          </button>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-line">
          <button
            onClick={handleSave}
            disabled={isSaving || !fullName.trim() || fullName === user?.full_name}
            className="bg-ink text-surface px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
          <button className="bg-transparent border border-line text-ink px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-2 transition-colors">
            Reset demo data
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="bg-transparent border border-line text-ink px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? "Logging out..." : "Log out"}
          </button>
        </div>
      </div>

      <UpdateEmailModal
        isOpen={isUpdateEmailModalOpen}
        onClose={() => setIsUpdateEmailModalOpen(false)}
      />
    </section>
  );
}
