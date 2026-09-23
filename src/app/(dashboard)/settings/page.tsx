"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/stores/authStore";
import { UpdateEmailModal } from "@/components/settings/UpdateEmailModal";
import { updateMe } from "@/services/api/endpoints/users/users";
import { useCreateTicket, useListMyTickets } from "@/services/api/endpoints/tickets/tickets";
import { TicketTopic, TicketStatus } from "@/services/api/model";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/cn";

type SettingsPane = "hub" | "personal" | "address" | "password" | "email" | "phone" | "2fa" | "close" | "theme" | "language" | "ticket";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, logout, bootstrap } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const [activePane, setActivePane] = useState<SettingsPane>("hub");

  const [isUpdateEmailModalOpen, setIsUpdateEmailModalOpen] = useState(false);

  // Forms
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSavingPersonal, setIsSavingPersonal] = useState(false);

  // Ticket Form
  const [ticketTopic, setTicketTopic] = useState<TicketTopic>(TicketTopic.GENERAL);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");

  const { data: tickets, refetch: refetchTickets, isLoading: isLoadingTickets } = useListMyTickets();
  const { mutate: createTicket, isPending: isCreatingTicket } = useCreateTicket({
    mutation: {
      onSuccess: () => {
        setTicketSubject("");
        setTicketMessage("");
        setTicketTopic(TicketTopic.GENERAL);
        refetchTickets();
        toast.success("Ticket submitted successfully");
      },
      onError: (err) => {
        console.error(err);
        toast.error("Failed to submit ticket");
      }
    }
  });

  const handleCreateTicket = () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      toast.error("Subject and message are required");
      return;
    }
    createTicket({
      data: {
        topic: ticketTopic,
        subject: ticketSubject,
        message: ticketMessage,
      }
    });
  };

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (user?.full_name) {
      const parts = user.full_name.trim().split(/\s+/);
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
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

  const handleSavePersonal = async () => {
    const newName = [firstName, lastName].filter(Boolean).join(" ").trim();
    if (!newName || newName === user?.full_name) return;

    setIsSavingPersonal(true);
    try {
      await updateMe({ full_name: newName });
      toast.success("Personal details saved");
      await bootstrap();
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.detail) {
        const detail = err.response.data.detail;
        toast.error(typeof detail === "string" ? detail : (detail[0]?.msg || "An unexpected error occurred."));
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSavingPersonal(false);
    }
  };

  const stubFeature = () => toast("Feature coming soon");

  const copyClientId = () => {
    const id = user?.id || "N/A";
    if (id === "N/A") {
      toast.error("Client ID not available");
      return;
    }
    navigator.clipboard.writeText(id).then(() => toast.success("Client ID copied"));
  };

  if (!mounted) return null;

  const displayId = user?.id ? `${user.id.slice(0, 4)}....${user.id.slice(-4)}` : "N/A";

  return (
    <section className="p-4 lg:p-8 space-y-6 max-w-[1440px] mx-auto w-full">
      {activePane === "hub" && (
        <div className="space-y-6">
          <article className="settings-hero relative overflow-hidden rounded-2xl border border-line px-5 py-6 sm:px-6 sm:py-7 flex items-center gap-4">
            <div className="h-14 w-14 rounded-full border border-white/15 bg-ink/40 flex items-center justify-center p-2.5 shrink-0">
              <img src="/assets/fxnod-mark.png" alt="" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-lg sm:text-xl font-semibold tracking-tight truncate text-white">
                {user?.full_name || "Trader Account"}
              </h2>
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-2 h-7 px-2.5 rounded-full border border-white/15 bg-ink/30 text-[11px] text-zinc-400 hover:text-white"
                onClick={copyClientId}
                aria-label="Copy client ID"
              >
                <span className="tabular">{displayId}</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M8 8V6.5A1.5 1.5 0 019.5 5h8A1.5 1.5 0 0119 6.5v8a1.5 1.5 0 01-1.5 1.5H16M5 9.5A1.5 1.5 0 016.5 8h8A1.5 1.5 0 0116 9.5v8a1.5 1.5 0 01-1.5 1.5h-8A1.5 1.5 0 015 17.5v-8z"/></svg>
              </button>
            </div>
          </article>

          <div className="lg:columns-2 lg:gap-4">
            <div className="break-inside-avoid mb-6">
              <p className="px-1 mb-2 text-xs font-medium text-zinc-500">About you</p>
              <div className="bg-panel border border-line rounded-2xl overflow-hidden">
                <button type="button" className="settings-row w-full flex items-center gap-3 px-4 py-3 text-left" onClick={() => setActivePane("personal")}>
                  <svg className="w-5 h-5 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.118a7.5 7.5 0 0115 0"/></svg>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm">Personal details</span>
                    <span className="block text-xs text-zinc-500 mt-0.5 truncate">{user?.full_name || "Name, country, date of birth"}</span>
                  </span>
                  <svg className="w-4 h-4 text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
                <button type="button" className="settings-row w-full flex items-center gap-3 px-4 py-3 text-left border-t border-line" onClick={() => setActivePane("address")}>
                  <svg className="w-5 h-5 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75"/></svg>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm">Home address</span>
                    <span className="block text-xs text-zinc-500 mt-0.5 truncate">Used for wallet and venue checks</span>
                  </span>
                  <svg className="w-4 h-4 text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>

            <div className="break-inside-avoid mb-6">
              <p className="px-1 mb-2 text-xs font-medium text-zinc-500">Security</p>
              <div className="bg-panel border border-line rounded-2xl overflow-hidden">
                <button type="button" className="settings-row w-full flex items-center gap-3 px-4 py-3 text-left" onClick={() => setActivePane("password")}>
                  <svg className="w-5 h-5 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
                  <span className="flex-1 text-sm">Change password</span>
                  <svg className="w-4 h-4 text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
                <button type="button" className="settings-row w-full flex items-center gap-3 px-4 py-3 text-left border-t border-line" onClick={() => { setIsUpdateEmailModalOpen(true); }}>
                  <svg className="w-5 h-5 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm">Change email address</span>
                    <span className="block text-xs text-zinc-500 mt-0.5 truncate">{user?.email || ""}</span>
                  </span>
                  <svg className="w-4 h-4 text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
                <button type="button" className="settings-row w-full flex items-center gap-3 px-4 py-3 text-left border-t border-line" onClick={() => setActivePane("phone")}>
                  <svg className="w-5 h-5 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm">Change phone number</span>
                    <span className="block text-xs text-zinc-500 mt-0.5 truncate">Not set</span>
                  </span>
                  <svg className="w-4 h-4 text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
                <button type="button" className="settings-row w-full flex items-center gap-3 px-4 py-3 text-left border-t border-line" onClick={() => setActivePane("2fa")}>
                  <svg className="w-5 h-5 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm">Two-factor authentication</span>
                    <span className="block text-xs text-zinc-500 mt-0.5">Off</span>
                  </span>
                  <svg className="w-4 h-4 text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
                <button type="button" className="settings-row w-full flex items-center gap-3 px-4 py-3 text-left border-t border-line" onClick={() => setActivePane("close")}>
                  <svg className="w-5 h-5 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/></svg>
                  <span className="flex-1 text-sm">Close account</span>
                  <svg className="w-4 h-4 text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>

            <div className="break-inside-avoid mb-6">
              <p className="px-1 mb-2 text-xs font-medium text-zinc-500">Preferences</p>
              <div className="bg-panel border border-line rounded-2xl overflow-hidden">
                <button type="button" className="settings-row w-full flex items-center gap-3 px-4 py-3 text-left" onClick={() => setActivePane("theme")}>
                  <svg className="w-5 h-5 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm">Theme</span>
                    <span className="block text-xs text-zinc-500 mt-0.5 capitalize">{theme}</span>
                  </span>
                  <svg className="w-4 h-4 text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
                <button type="button" className="settings-row w-full flex items-center gap-3 px-4 py-3 text-left border-t border-line" onClick={() => setActivePane("language")}>
                  <svg className="w-5 h-5 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"/></svg>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm">Language</span>
                    <span className="block text-xs text-zinc-500 mt-0.5">English</span>
                  </span>
                  <svg className="w-4 h-4 text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>

            <div className="break-inside-avoid mb-6">
              <p className="px-1 mb-2 text-xs font-medium text-zinc-500">Support</p>
              <div className="bg-panel border border-line rounded-2xl overflow-hidden">
                <a href="/blog" className="settings-row flex items-center gap-3 px-4 py-3">
                  <svg className="w-5 h-5 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
                  <span className="flex-1 text-sm">Guides</span>
                  <svg className="w-4 h-4 text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10"/></svg>
                </a>
                <button type="button" className="settings-row w-full flex items-center gap-3 px-4 py-3 text-left border-t border-line" onClick={() => setActivePane("ticket")}>
                  <svg className="w-5 h-5 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"/></svg>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm">Submit a ticket</span>
                    <span className="block text-xs text-zinc-500 mt-0.5">Wallet, venues, bots, or account</span>
                  </span>
                  <svg className="w-4 h-4 text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </div>

          <button type="button" className="h-10 px-5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 border border-line" onClick={handleLogout}>Log out</button>
        </div>
      )}

      {activePane === "personal" && (
        <div className="space-y-4">
          <button type="button" className="text-sm text-zinc-400 hover:text-white" onClick={() => setActivePane("hub")}>← Settings</button>
          <article className="bg-panel border border-line rounded-2xl p-5 sm:p-6 space-y-4">
            <p className="text-sm text-zinc-400 leading-relaxed">These details sit on your FXNOD client record — used for wallet payouts and venue transfer.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs text-zinc-500">First name</span>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1.5 w-full h-10 px-3 rounded-lg bg-bg border border-line text-sm outline-none focus:border-zinc-500" />
              </label>
              <label className="block">
                <span className="text-xs text-zinc-500">Last name</span>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1.5 w-full h-10 px-3 rounded-lg bg-bg border border-line text-sm outline-none focus:border-zinc-500" />
              </label>
            </div>
            <label className="block">
              <span className="text-xs text-zinc-500">Date of birth</span>
              <input type="date" disabled className="mt-1.5 w-full h-10 px-3 rounded-lg bg-bg border border-line text-sm outline-none focus:border-zinc-500 disabled:opacity-50" />
            </label>
            <label className="block">
              <span className="text-xs text-zinc-500">Country of residence</span>
              <select disabled className="mt-1.5 w-full h-10 px-3 rounded-lg bg-bg border border-line text-sm outline-none focus:border-zinc-500 disabled:opacity-50">
                <option>Sri Lanka</option><option>United Kingdom</option><option>United Arab Emirates</option><option>Singapore</option><option>Other</option>
              </select>
            </label>
            <button
              type="button"
              className="h-10 px-5 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 disabled:opacity-50"
              onClick={handleSavePersonal}
              disabled={isSavingPersonal}
            >
              {isSavingPersonal ? "Saving..." : "Save"}
            </button>
          </article>
        </div>
      )}

      {activePane === "address" && (
        <div className="space-y-4">
          <button type="button" className="text-sm text-zinc-400 hover:text-white" onClick={() => setActivePane("hub")}>← Settings</button>
          <article className="bg-panel border border-line rounded-2xl p-5 sm:p-6 space-y-4">
            <p className="text-sm text-zinc-400 leading-relaxed">We use this address on wallet payouts and venue transfers.</p>
            <label className="block"><span className="text-xs text-zinc-500">Street address</span><input disabled className="mt-1.5 w-full h-10 px-3 rounded-lg bg-bg border border-line text-sm outline-none focus:border-zinc-500 disabled:opacity-50" /></label>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block"><span className="text-xs text-zinc-500">City</span><input disabled className="mt-1.5 w-full h-10 px-3 rounded-lg bg-bg border border-line text-sm outline-none focus:border-zinc-500 disabled:opacity-50" /></label>
              <label className="block"><span className="text-xs text-zinc-500">Postal code</span><input disabled className="mt-1.5 w-full h-10 px-3 rounded-lg bg-bg border border-line text-sm outline-none focus:border-zinc-500 disabled:opacity-50" /></label>
            </div>
            <button type="button" className="h-10 px-5 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200" onClick={stubFeature}>Save</button>
          </article>
        </div>
      )}

      {activePane === "password" && (
        <div className="space-y-4">
          <button type="button" className="text-sm text-zinc-400 hover:text-white" onClick={() => setActivePane("hub")}>← Settings</button>
          <article className="bg-panel border border-line rounded-2xl p-5 sm:p-6 space-y-4">
            <label className="block"><span className="text-xs text-zinc-500">New password</span><input type="password" minLength={4} className="mt-1.5 w-full h-10 px-3 rounded-lg bg-bg border border-line text-sm outline-none focus:border-zinc-500" /></label>
            <label className="block"><span className="text-xs text-zinc-500">Confirm password</span><input type="password" minLength={4} className="mt-1.5 w-full h-10 px-3 rounded-lg bg-bg border border-line text-sm outline-none focus:border-zinc-500" /></label>
            <button type="button" className="h-10 px-5 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200" onClick={stubFeature}>Update password</button>
          </article>
        </div>
      )}

      {activePane === "phone" && (
        <div className="space-y-4">
          <button type="button" className="text-sm text-zinc-400 hover:text-white" onClick={() => setActivePane("hub")}>← Settings</button>
          <article className="bg-panel border border-line rounded-2xl p-5 sm:p-6 space-y-4">
            <label className="block"><span className="text-xs text-zinc-500">Phone number</span><input type="tel" placeholder="+94 …" className="mt-1.5 w-full h-10 px-3 rounded-lg bg-bg border border-line text-sm outline-none focus:border-zinc-500" /></label>
            <button type="button" className="h-10 px-5 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200" onClick={stubFeature}>Save</button>
          </article>
        </div>
      )}

      {activePane === "2fa" && (
        <div className="space-y-4">
          <button type="button" className="text-sm text-zinc-400 hover:text-white" onClick={() => setActivePane("hub")}>← Settings</button>
          <article className="bg-panel border border-line rounded-2xl p-5 sm:p-6 space-y-4">
            <p className="text-sm text-zinc-400 leading-relaxed">Add an authenticator step when you log in to FXNOD.</p>
            <button type="button" className="h-10 px-5 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200" onClick={stubFeature}>Turn on 2FA</button>
          </article>
        </div>
      )}

      {activePane === "close" && (
        <div className="space-y-4">
          <button type="button" className="text-sm text-zinc-400 hover:text-white" onClick={() => setActivePane("hub")}>← Settings</button>
          <article className="bg-panel border border-line rounded-2xl p-5 sm:p-6 space-y-4">
            <p className="text-sm text-zinc-400 leading-relaxed">Closing wipes this demo session on the device. Wallet, bots, and transfers stored here are removed.</p>
            <label className="block"><span className="text-xs text-zinc-500">Type CLOSE to confirm</span><input className="mt-1.5 w-full h-10 px-3 rounded-lg bg-bg border border-line text-sm outline-none focus:border-zinc-500" /></label>
            <button type="button" className="h-10 px-5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-400" onClick={stubFeature}>Close account</button>
          </article>
        </div>
      )}

      {activePane === "theme" && (
        <div className="space-y-4">
          <button type="button" className="text-sm text-zinc-400 hover:text-white" onClick={() => setActivePane("hub")}>← Settings</button>
          <article className="bg-panel border border-line rounded-2xl p-5 sm:p-6 space-y-4">
            <p className="text-sm text-zinc-400">Switch the terminal between dark and light.</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`h-9 px-3 rounded-lg border text-sm font-medium transition-colors ${theme === 'dark' ? 'border-white bg-white text-black' : 'border-line text-zinc-300 hover:text-white'}`}
                onClick={() => setTheme("dark")}
              >
                Dark
              </button>
              <button
                type="button"
                className={`h-9 px-3 rounded-lg border text-sm font-medium transition-colors ${theme === 'light' ? 'border-white bg-white text-black' : 'border-line text-zinc-300 hover:text-white'}`}
                onClick={() => setTheme("light")}
              >
                Light
              </button>
            </div>
          </article>
        </div>
      )}

      {activePane === "language" && (
        <div className="space-y-4">
          <button type="button" className="text-sm text-zinc-400 hover:text-white" onClick={() => setActivePane("hub")}>← Settings</button>
          <article className="bg-panel border border-line rounded-2xl overflow-hidden">
            <button type="button" className="settings-row w-full flex items-center justify-between px-4 py-3 text-left">
              <span className="text-sm">English</span>
              <span className="text-xs text-zinc-500">Selected</span>
            </button>
            <button type="button" className="settings-row w-full flex items-center justify-between px-4 py-3 text-left border-t border-line" onClick={stubFeature}>
              <span className="text-sm">සිංහල</span>
            </button>
          </article>
          <p className="text-xs text-zinc-500 px-1">Preference is saved on this device. The terminal copy stays English in this demo.</p>
        </div>
      )}

      {activePane === "ticket" && (
        <div className="space-y-4">
          <button type="button" className="text-sm text-zinc-400 hover:text-white" onClick={() => setActivePane("hub")}>← Settings</button>
          <div className="grid lg:grid-cols-2 gap-4 items-start">
            <article className="bg-panel border border-line rounded-2xl p-5 sm:p-6 space-y-4">
              <p className="text-sm text-zinc-400 leading-relaxed">Tell us what is blocked. We reply to the email on this account.</p>
              <label className="block">
                <span className="text-xs text-zinc-500">Topic</span>
                <select 
                  value={ticketTopic}
                  onChange={(e) => setTicketTopic(e.target.value as TicketTopic)}
                  className="mt-1.5 w-full h-10 px-3 rounded-lg bg-bg border border-line text-sm outline-none focus:border-zinc-500"
                >
                  <option value={TicketTopic.GENERAL}>General Inquiry</option>
                  <option value={TicketTopic.BILLING}>Billing & Payments</option>
                  <option value={TicketTopic.TECHNICAL}>Technical Issue</option>
                  <option value={TicketTopic.KYC}>Account Verification (KYC)</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs text-zinc-500">Subject</span>
                <input 
                  maxLength={120} 
                  placeholder="Short summary" 
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="mt-1.5 w-full h-10 px-3 rounded-lg bg-bg border border-line text-sm outline-none focus:border-zinc-500" 
                />
              </label>
              <label className="block">
                <span className="text-xs text-zinc-500">Message</span>
                <textarea 
                  rows={5} 
                  maxLength={1000} 
                  placeholder="What happened, and what should we look at?" 
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="mt-1.5 w-full px-3 py-2.5 rounded-lg bg-bg border border-line text-sm outline-none focus:border-zinc-500 resize-y min-h-[8rem]"
                ></textarea>
              </label>
              <button 
                type="button" 
                className="h-10 px-5 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 disabled:opacity-50" 
                onClick={handleCreateTicket}
                disabled={isCreatingTicket}
              >
                {isCreatingTicket ? "Sending..." : "Send ticket"}
              </button>
            </article>
            <article className="bg-panel border border-line rounded-2xl overflow-hidden min-w-0">
              <div className="px-5 py-4 border-b border-line">
                <h3 className="font-display text-sm font-semibold">Your tickets</h3>
              </div>
              <div className="divide-y divide-line">
                {isLoadingTickets ? (
                  <p className="px-5 py-8 text-sm text-zinc-500">Loading tickets...</p>
                ) : !tickets || tickets.length === 0 ? (
                  <p className="px-5 py-8 text-sm text-zinc-500">No tickets yet.</p>
                ) : (
                  tickets.map(ticket => (
                    <div key={ticket.id} className="p-5 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-sm text-white truncate">{ticket.subject}</span>
                        <span className={cn(
                          "px-2 py-0.5 text-[10px] font-medium rounded-full uppercase tracking-wider shrink-0",
                          ticket.status === TicketStatus.OPEN ? "bg-blue-500/10 text-blue-500" :
                          ticket.status === TicketStatus.IN_PROGRESS ? "bg-yellow-500/10 text-yellow-500" :
                          ticket.status === TicketStatus.RESOLVED ? "bg-green-500/10 text-green-500" :
                          "bg-zinc-500/10 text-zinc-400"
                        )}>
                          {ticket.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span className="uppercase">{ticket.topic}</span>
                        <span>•</span>
                        <span>{format(new Date(ticket.created_at), "MMM d, yyyy")}</span>
                      </div>
                      <p className="text-sm text-zinc-400 mt-2 whitespace-pre-wrap">{ticket.message}</p>
                    </div>
                  ))
                )}
              </div>
            </article>
          </div>
        </div>
      )}

      <UpdateEmailModal
        isOpen={isUpdateEmailModalOpen}
        onClose={() => setIsUpdateEmailModalOpen(false)}
      />
    </section>
  );
}
