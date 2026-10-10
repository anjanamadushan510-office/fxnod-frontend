import type { Metadata } from "next";
import { LocalGuidePage, localGuideMetadata } from "@/components/guides/LocalGuidePages";

interface Props {
  params: { slug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  return localGuideMetadata("si", params.slug);
}

/** One guide in Sinhala. */
export default function Page({ params }: Props) {
  return <LocalGuidePage locale="si" slug={params.slug} />;
}
