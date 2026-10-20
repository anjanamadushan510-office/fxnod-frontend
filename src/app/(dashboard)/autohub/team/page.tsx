"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Users, Plus, ShieldCheck } from "lucide-react";
import {
  commerce,
  commerceError,
  type TeamPackage,
  type TeamMember,
} from "@/services/commerce";
import { useAuthStore } from "@/stores/authStore";

const input =
  "min-h-11 w-full min-w-0 rounded-xl border border-line bg-bg px-3 text-sm text-ink";
const button =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line px-4 text-sm font-medium disabled:opacity-40";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const expiry = (value: string | null) =>
  value
    ? `Access until ${new Date(value).toLocaleDateString()}`
    : "Lifetime access";

export default function AutoHubTeamPage() {
  const user = useAuthStore((s) => s.user);
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ["autohub-teams", user?.id],
    queryFn: commerce.teams,
    enabled: !!user,
    refetchInterval: 30000,
  });
  async function refresh() {
    await Promise.all([
      client.invalidateQueries({ queryKey: ["autohub-teams"] }),
      client.invalidateQueries({ queryKey: ["commerce"] }),
    ]);
  }
  return (
    <section className="mx-auto max-w-5xl space-y-6 p-4 lg:p-6">
      <Link
        href="/autohub"
        className="inline-flex min-h-11 items-center text-sm text-ink-2"
      >
        ← Auto Hub
      </Link>
      <header>
        <div className="mb-3 flex items-center gap-3">
          <Users className="h-6 w-6 text-gold" />
          <h1 className="text-2xl font-semibold text-ink">My team</h1>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-ink-2">
          Share your Auto Hub package with your team. Members use their own
          FXNOD and Deriv accounts; each person controls their own bots and
          funds.
        </p>
      </header>
      {query.isLoading && (
        <p role="status" className="text-ink-2">
          Loading team access…
        </p>
      )}
      {query.isError && (
        <div
          role="alert"
          className="rounded-xl border border-line bg-surface p-4 text-negative"
        >
          Unable to load teams.{" "}
          <button className="underline" onClick={() => query.refetch()}>
            Retry
          </button>
        </div>
      )}
      {query.data?.memberships.map((membership) => (
        <article
          key={membership.id}
          className="rounded-2xl border border-line bg-surface p-5"
        >
          <h2 className="flex items-center gap-2 font-semibold text-ink">
            <ShieldCheck className="h-5 w-5" />
            {membership.tier_name} · Team member
          </h2>
          <p className="mt-2 text-sm text-ink-2">
            {membership.active
              ? expiry(membership.expires_at)
              : "Team access is inactive. Contact your team owner."}
          </p>
          <p className="mt-3 text-sm text-ink-2">
            {membership.deriv_client_id ? (
              <>
                Team access permits accounts belonging to this Deriv Client ID
                only:
                <span className="mt-2 block break-all font-mono text-xs text-ink">
                  {membership.deriv_client_id}
                </span>
              </>
            ) : (
              "Your team owner has not limited this membership to a specific Deriv Client ID."
            )}
          </p>
        </article>
      ))}
      {query.data?.owned.map((team) => (
        <TeamCard key={team.id} team={team} refresh={refresh} />
      ))}
      {query.data && !query.data.owned.length && (
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-semibold text-ink">Build your Auto Hub team</h2>
          <p className="mt-2 text-sm leading-6 text-ink-2">
            Choose a Team package in Discover to add members by their verified
            FXNOD email. The package includes your access plus the stated number
            of member seats.
          </p>
          <Link
            href="/tools"
            className={`${button} mt-4 bg-action text-action-ink`}
          >
            View packages
          </Link>
        </div>
      )}
    </section>
  );
}

function TeamCard({
  team,
  refresh,
}: {
  team: TeamPackage;
  refresh: () => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [clientId, setClientId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function add(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    if (clientId.trim() && !uuid.test(clientId.trim())) {
      setError("Enter the full Deriv Client ID in UUID format.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await commerce.addMember(team.id, email.trim(), clientId.trim() || null);
      setEmail("");
      setClientId("");
      await refresh();
    } catch (e) {
      setError(commerceError(e));
    } finally {
      setBusy(false);
    }
  }
  const full = team.members.length >= team.team_seats;
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-surface">
      <header className="border-b border-line p-5">
        <div className="flex flex-wrap justify-between gap-2">
          <h2 className="font-semibold text-ink">{team.tier_name}</h2>
          <span className="text-sm text-ink-2">
            {team.members.length} / {team.team_seats} seats used
          </span>
        </div>
        <p className="mt-2 text-xs text-ink-3">
          {team.active
            ? expiry(team.expires_at)
            : "Package expired — renew to add or update members"}{" "}
          · Owner does not use a member seat
        </p>
      </header>
      <div className="space-y-4 p-5">
        {team.members.map((member) => (
          <MemberRow
            key={`${member.id}:${member.deriv_client_id}`}
            member={member}
            team={team}
            refresh={refresh}
          />
        ))}
        {!team.members.length && (
          <p className="text-sm text-ink-3">
            No members yet. Add your first teammate below.
          </p>
        )}
        <form
          onSubmit={add}
          className="space-y-3 rounded-xl border border-line bg-bg p-4"
        >
          <h3 className="text-sm font-semibold text-ink">Add a team member</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-2 text-xs text-ink-2">
              FXNOD email
              <input
                type="email"
                required
                maxLength={255}
                className={input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={busy || !team.active || full}
              />
            </label>
            <label className="space-y-2 text-xs text-ink-2">
              Deriv Client ID · optional
              <input
                className={`${input} font-mono text-xs`}
                placeholder="366af5e7-1adb-4e0d-b7b8-787bba55aa5e"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                disabled={busy || !team.active || full}
              />
            </label>
          </div>
          <p className="text-xs leading-5 text-ink-3">
            Use the Client ID shown in Connected Accounts. This identifies a
            Deriv login, not an app ID or a CR/DOT trading account number. Leave
            blank to allow any of the member’s linked Deriv logins.
          </p>
          {error && (
            <p role="alert" className="text-sm text-negative">
              {error}
            </p>
          )}
          <button
            className={`${button} bg-action text-action-ink`}
            disabled={busy || !team.active || full}
          >
            <Plus className="h-4 w-4" />
            {busy ? "Adding…" : full ? "All seats in use" : "Add member"}
          </button>
        </form>
      </div>
    </article>
  );
}

function MemberRow({
  member,
  team,
  refresh,
}: {
  member: TeamMember;
  team: TeamPackage;
  refresh: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [clientId, setClientId] = useState(member.deriv_client_id || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function change(remove = false) {
    if (busy) return;
    if (!remove && clientId.trim() && !uuid.test(clientId.trim())) {
      setError("Enter a valid UUID Client ID.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (remove) await commerce.removeMember(team.id, member.id);
      else
        await commerce.updateMember(
          team.id,
          member.id,
          clientId.trim() || null,
        );
      await refresh();
      setEditing(false);
      setRemoving(false);
    } catch (e) {
      setError(commerceError(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="rounded-xl border border-line p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-all text-sm font-medium text-ink">
            {member.email}
          </p>
          <p className="mt-1 break-all text-xs text-ink-3">
            {member.deriv_client_id
              ? `Deriv Client ID: ${member.deriv_client_id}`
              : "Any linked Deriv login"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className={button}
            disabled={busy || !team.active}
            onClick={() => {
              setEditing(!editing);
              setRemoving(false);
            }}
          >
            Edit access
          </button>
          <button
            className={`${button} text-negative`}
            disabled={busy}
            onClick={() => {
              setRemoving(true);
              setEditing(false);
            }}
          >
            Remove
          </button>
        </div>
      </div>
      {editing && (
        <div className="mt-3 space-y-3">
          <label className="text-xs text-ink-2">
            Deriv Client ID · blank removes restriction
            <input
              className={input}
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </label>
          <button className={button} disabled={busy} onClick={() => change()}>
            Save access
          </button>
        </div>
      )}
      {removing && (
        <div className="mt-3 text-sm text-ink-2">
          <p>
            Remove this member’s team access? New bot orders will be denied;
            existing contracts continue to settle.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              className={`${button} text-negative`}
              disabled={busy}
              onClick={() => change(true)}
            >
              Confirm removal
            </button>
            <button
              className={button}
              disabled={busy}
              onClick={() => setRemoving(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-negative">
          {error}
        </p>
      )}
    </div>
  );
}
