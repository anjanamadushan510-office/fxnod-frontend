"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCreateTicket, useListMyTickets } from "@/services/api/endpoints/tickets/tickets";
import { TicketTopic, TicketStatus } from "@/services/api/model";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/cn";

export default function SupportPage() {
  const [mounted, setMounted] = useState(false);
  const [ticketTopic, setTicketTopic] = useState<TicketTopic>(TicketTopic.GENERAL);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");

  const { data: tickets, refetch: refetchTickets, isLoading: isLoadingTickets, isRefetching } = useListMyTickets();

  const { mutate: createTicket, isPending: isCreatingTicket } = useCreateTicket({
    mutation: {
      onSuccess: () => {
        setTicketSubject("");
        setTicketMessage("");
        setTicketTopic(TicketTopic.GENERAL);
        refetchTickets();
        toast.success("Support ticket submitted successfully. We will reply to your account email.");
      },
      onError: (err) => {
        console.error(err);
        toast.error("Failed to submit ticket. Please try again.");
      },
    },
  });

  const handleCreateTicket = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      toast.error("Please provide both a subject and a message.");
      return;
    }
    createTicket({
      data: {
        topic: ticketTopic,
        subject: ticketSubject.trim(),
        message: ticketMessage.trim(),
      },
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="p-4 lg:p-8 space-y-6 max-w-[1440px] mx-auto w-full">
      {/* Hero Banner */}
      <article className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-surface-2 to-surface p-5 sm:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-display text-lg sm:text-xl font-semibold text-ink">
              Help & Support Center
            </h2>
            <p className="text-xs md:text-sm text-ink-2 max-w-2xl">
              Need help with your account, wallet, venues, or automated bots? Submit a request below and our team will reply to your email.
            </p>
          </div>
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-xl border border-line bg-surface-2 text-xs font-medium text-ink hover:bg-surface hover:border-zinc-500 transition-all shrink-0"
          >
            <svg className="w-4 h-4 text-ink-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span>Browse Documentation & Guides</span>
            <svg className="w-3.5 h-3.5 text-ink-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
            </svg>
          </Link>
        </div>
      </article>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Submit Ticket Form */}
        <article className="lg:col-span-5 bg-panel border border-line rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="border-b border-line pb-3">
            <h3 className="font-display text-base font-semibold text-ink">Submit a new ticket</h3>
            <p className="text-xs text-ink-3 mt-1 leading-relaxed">
              Tell us what is blocked and what you would like to resolve.
            </p>
          </div>

          <form onSubmit={handleCreateTicket} className="space-y-4">
            <label className="block">
              <span className="text-xs font-medium text-ink-2">Topic</span>
              <select
                value={ticketTopic}
                onChange={(e) => setTicketTopic(e.target.value as TicketTopic)}
                className="mt-1.5 w-full h-10 px-3 rounded-lg bg-bg border border-line text-sm text-ink outline-none focus:border-zinc-500 transition-colors"
              >
                <option value={TicketTopic.GENERAL}>General Inquiry</option>
                <option value={TicketTopic.BILLING}>Billing & Payments</option>
                <option value={TicketTopic.TECHNICAL}>Technical Issue</option>
                <option value={TicketTopic.KYC}>Account Verification (KYC)</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-medium text-ink-2">Subject</span>
              <input
                type="text"
                maxLength={120}
                placeholder="What does the issue relate to?"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                className="mt-1.5 w-full h-10 px-3 rounded-lg bg-bg border border-line text-sm text-ink outline-none focus:border-zinc-500 transition-colors"
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-ink-2">Message</span>
              <textarea
                rows={6}
                maxLength={1000}
                placeholder="Explain what occurred, and provide any steps or error codes..."
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                className="mt-1.5 w-full px-3 py-2.5 rounded-lg bg-bg border border-line text-sm text-ink outline-none focus:border-zinc-500 transition-colors resize-y min-h-[9rem]"
              />
            </label>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-ink-3">
                {1000 - ticketMessage.length} characters remaining
              </span>
              <button
                type="submit"
                disabled={isCreatingTicket || !ticketSubject.trim() || !ticketMessage.trim()}
                className="h-10 px-5 rounded-lg bg-action text-action-ink font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                {isCreatingTicket ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send ticket</span>
                )}
              </button>
            </div>
          </form>
        </article>

        {/* Ticket History */}
        <article className="lg:col-span-7 bg-panel border border-line rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-line flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h3 className="font-display text-base font-semibold text-ink">Your tickets</h3>
              {tickets && tickets.length > 0 && (
                <span className="px-2 py-0.5 text-[11px] rounded-full bg-surface-2 text-ink-2 font-mono">
                  {tickets.length}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => refetchTickets()}
              disabled={isRefetching}
              className="p-1.5 rounded-lg text-ink-3 hover:text-ink hover:bg-surface-2 transition-colors"
              aria-label="Refresh tickets"
              title="Refresh tickets"
            >
              <svg className={cn("w-4 h-4", isRefetching && "animate-spin")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
          </div>

          <div className="divide-y divide-line">
            {isLoadingTickets ? (
              <div className="px-5 py-12 text-center">
                <div className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-ink-3">Loading your tickets...</p>
              </div>
            ) : !tickets || tickets.length === 0 ? (
              <div className="px-5 py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-surface-2 border border-line flex items-center justify-center mx-auto text-ink-3">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-ink">No requests found</p>
                  <p className="text-xs text-ink-3 max-w-xs mx-auto">
                    When you submit a support request, it will appear here with status updates.
                  </p>
                </div>
              </div>
            ) : (
              tickets.map((ticket) => {
                const status = (ticket.status || TicketStatus.OPEN).toUpperCase();
                const badgeClass =
                  status === TicketStatus.OPEN
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : status === TicketStatus.IN_PROGRESS
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : status === TicketStatus.RESOLVED
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-zinc-500/10 text-ink-3 border border-zinc-500/20";

                return (
                  <div key={ticket.id} className="p-5 space-y-3 hover:bg-surface-2/40 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-sm text-ink truncate">{ticket.subject}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-ink-3">
                          <span className="uppercase font-mono">{ticket.topic}</span>
                          <span>•</span>
                          <span>
                            {ticket.created_at ? format(new Date(ticket.created_at), "MMM d, yyyy") : ""}
                          </span>
                        </div>
                      </div>
                      <span className={cn("px-2.5 py-0.5 text-[10px] font-semibold rounded-full uppercase tracking-wider shrink-0", badgeClass)}>
                        {ticket.status?.replace("_", " ") || "OPEN"}
                      </span>
                    </div>
                    <p className="text-sm text-ink-2 whitespace-pre-wrap bg-bg/40 p-3.5 rounded-xl border border-line/60 leading-relaxed">
                      {ticket.message}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
