import { redirect } from "next/navigation";

/**
 * The referrals page became the partner dashboard.
 *
 * Kept as a redirect rather than deleted: this path is in the top nav, in
 * bookmarks, and quite possibly in a message an affiliate sent someone. A 404
 * for a page about money someone is owed is a support ticket.
 */
export default function ReferralsPage() {
  redirect("/partner/dashboard");
}
