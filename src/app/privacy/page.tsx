import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { PRIVACY } from "@/content/legal";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: PRIVACY.title,
  description: PRIVACY.description,
  path: PRIVACY.path,
});

export default function PrivacyPage() {
  return <LegalPage doc={PRIVACY} />;
}
