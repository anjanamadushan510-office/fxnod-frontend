import { LocalGuideIndex, localIndexMetadata } from "@/components/guides/LocalGuidePages";

export const metadata = localIndexMetadata("es");

/** The guides written in Spanish. */
export default function Page() {
  return <LocalGuideIndex locale="es" />;
}
