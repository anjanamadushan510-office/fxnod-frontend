import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { TERMS } from "@/content/legal";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: TERMS.title,
  description: TERMS.description,
  path: TERMS.path,
});

export default function TermsPage() {
  return <LegalPage doc={TERMS} />;
}
