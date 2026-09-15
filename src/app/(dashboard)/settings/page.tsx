"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function SettingsPage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
        <h1 className="text-lg font-semibold text-white leading-tight">
          Settings
        </h1>
        <p className="text-xs text-zinc-500">Workspace defaults</p>
      </div>

      {/* Appearance Card */}
      <div className="bg-panel border border-line rounded-2xl p-6">
        <h2 className="text-sm font-medium text-white mb-4">Appearance</h2>
        
        <div className="mb-3">
          <p className="text-sm text-white">Theme</p>
          <p className="text-xs text-zinc-500">Switch the terminal between dark and light</p>
        </div>

        <div className="grid grid-cols-2 p-1 bg-ink border border-line rounded-lg w-full max-w-sm mb-6">
          <button className="bg-white text-black rounded-md py-2 text-sm font-medium">
            Dark
          </button>
          <button className="text-zinc-400 hover:text-white py-2 text-sm font-medium transition-colors">
            Light
          </button>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-line">
          <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors">
            Save changes
          </button>
          <button className="bg-transparent border border-line text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
            Reset demo data
          </button>
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="bg-transparent border border-line text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? "Logging out..." : "Log out"}
          </button>
        </div>
      </div>
    </section>
  );
}
