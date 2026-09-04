import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { TopNav } from "@/components/layout/TopNav";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Partner programme — FXNod",
  description:
    "Earn on what the people you invite subscribe to and trade, and on what their invitees do.",
};

/**
 * /partner — the public explainer the footer links to.
 *
 * Deliberately reachable signed out, because a signed-out visitor is who an
 * affiliate programme is trying to reach. A server component: it is static
 * copy, and it should render without waiting on a session.
 *
 * The rates here are the ones in the referral-service tier table. They are
 * stated because a partner has to be able to check what they were promised —
 * but note they are COPY, not data: if the tiers are ever retuned, this page
 * has to be edited with them. That is a deliberate trade for a page that must
 * render for someone with no account and therefore no earnings to read from.
 */

const TIERS = [
  {
    level: "Affiliate",
    who: "Someone you invited yourself",
    dbot: "30%",
    trading: "30%",
  },
  {
    level: "Master affiliate",
    who: "Someone your affiliate invited",
    dbot: "10%",
    trading: "10%",
  },
  {
    level: "Tier 3",
    who: "One step further down",
    dbot: "—",
    trading: "5%",
  },
];

export default function PartnerProgrammePage() {
  return (
    <div className="min-h-screen bg-[#f8f6f0]">
      <TopNav />

      <main className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <h1 className="m-0 text-4xl font-extrabold tracking-tight text-[#0a0f1c]">
          Earn with FXNod
        </h1>
        <p className="m-0 mt-4 max-w-[60ch] text-lg leading-relaxed text-[#0a0f1c]/65">
          Invite people to FXNod and earn a share of what they pay for — dBot
          subscriptions today, and every paid product we add. You also earn on
          the people they invite.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={"/partner/dashboard" as Route}
            className="rounded-xl bg-[#0a0f1c] px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Open your partner dashboard
          </Link>
          <Link
            href={"/auth/register" as Route}
            className="rounded-xl border border-[#0a0f1c]/15 bg-white px-6 py-3 text-sm font-bold text-[#0a0f1c] transition-colors hover:border-[#c9a24e]"
          >
            Create an account
          </Link>
        </div>

        <section className="mt-14">
          <h2 className="m-0 text-xl font-extrabold tracking-tight text-[#0a0f1c]">
            What you earn
          </h2>
          <div className="mt-4 overflow-x-auto rounded-3xl border border-[#c9a24e]/20 bg-white shadow-sm">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#0a0f1c]/10 text-left">
                  <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#0a0f1c]/40">
                    Your position
                  </th>
                  <th scope="col" className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-[#0a0f1c]/40">
                    Who that is
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-[#0a0f1c]/40">
                    dBot
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-[#0a0f1c]/40">
                    Trading
                  </th>
                </tr>
              </thead>
              <tbody>
                {TIERS.map((tier) => (
                  <tr
                    key={tier.level}
                    className="border-b border-[#0a0f1c]/5 last:border-b-0"
                  >
                    <th scope="row" className="px-6 py-4 text-left font-bold text-[#0a0f1c]">
                      {tier.level}
                    </th>
                    <td className="px-6 py-4 text-[#0a0f1c]/60">{tier.who}</td>
                    <td className="px-6 py-4 text-right font-bold tabular-nums text-[#0a0f1c]">
                      {tier.dbot}
                    </td>
                    <td className="px-6 py-4 text-right font-bold tabular-nums text-[#0a0f1c]">
                      {tier.trading}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-14 grid gap-6 sm:grid-cols-3">
          <Step
            n="1"
            title="Share your link"
            body="Every account has one. It is on your partner dashboard."
          />
          <Step
            n="2"
            title="They sign up through it"
            body="They are yours from that moment, for the life of their account."
          />
          <Step
            n="3"
            title="You earn on what they buy"
            body="Including renewals, and including products we have not launched yet."
          />
        </section>

        <section className="mt-14">
          <h2 className="m-0 text-xl font-extrabold tracking-tight text-[#0a0f1c]">
            The details worth knowing
          </h2>
          <ul className="m-0 mt-4 list-none space-y-3 p-0 text-sm leading-relaxed text-[#0a0f1c]/65">
            <li>
              <strong className="text-[#0a0f1c]">Attribution is permanent.</strong>{" "}
              Whoever introduced an account keeps it. It is recorded once at
              signup and never moved.
            </li>
            <li>
              <strong className="text-[#0a0f1c]">Subscription commission is held briefly.</strong>{" "}
              A few days after the purchase, then it is released. Trading
              commission is paid once the broker settles the month.
            </li>
            <li>
              <strong className="text-[#0a0f1c]">You cannot earn from yourself.</strong>{" "}
              Buying through a second account you control is not commission, and
              we check for it.
            </li>
            <li>
              <strong className="text-[#0a0f1c]">Earnings go to your FXNod wallet</strong>{" "}
              and withdraw like any other balance.
            </li>
          </ul>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-[#c9a24e]/20 bg-white p-6 shadow-sm">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0a0f1c] text-sm font-bold text-[#c9a24e]">
        {n}
      </span>
      <h3 className="m-0 mt-4 text-base font-bold text-[#0a0f1c]">{title}</h3>
      <p className="m-0 mt-1.5 text-sm leading-relaxed text-[#0a0f1c]/60">
        {body}
      </p>
    </div>
  );
}
