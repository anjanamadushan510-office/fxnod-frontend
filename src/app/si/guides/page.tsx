import { LocalGuideIndex, localIndexMetadata } from "@/components/guides/LocalGuidePages";

export const metadata = localIndexMetadata("si");

/** The guides written in Sinhala. */
export default function Page() {
  return <LocalGuideIndex locale="si" />;
}
