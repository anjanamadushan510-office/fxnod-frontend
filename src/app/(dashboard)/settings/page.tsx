"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/stores/authStore";
import { UpdateEmailModal } from "@/components/settings/UpdateEmailModal";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUpdateEmailModalOpen, setIsUpdateEmailModalOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } finally {
      setIsLoggingOut(false);
      router.push("/");
    }
  };

  return (
    <section className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-ink leading-tight">
          Settings
        </h1>
        <p className="text-xs text-ink-3">Workspace defaults</p>
      </div>

      {/* Profile Card */}
      <div className="bg-surface border border-line rounded-2xl p-6">
        <h2 className="text-sm font-medium text-ink mb-4">Profile</h2>
        
        <div className="mb-3">
          <p className="text-sm text-ink">Email Address</p>
          <p className="text-xs text-ink-3">Used for sign-in and recovery</p>
        </div>

        <div className="flex items-center gap-3 max-w-sm">
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
          <button className="bg-ink text-surface px-4 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity">
            Save changes
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
