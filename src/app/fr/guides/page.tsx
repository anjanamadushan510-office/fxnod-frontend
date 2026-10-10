import { LocalGuideIndex, localIndexMetadata } from "@/components/guides/LocalGuidePages";

export const metadata = localIndexMetadata("fr");

/** The guides written in French. */
export default function Page() {
  return <LocalGuideIndex locale="fr" />;
}
