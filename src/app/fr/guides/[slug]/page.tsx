import type { Metadata } from "next";
import { LocalGuidePage, localGuideMetadata } from "@/components/guides/LocalGuidePages";

interface Props {
  params: { slug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  return localGuideMetadata("fr", params.slug);
}

/** One guide in French. */
export default function Page({ params }: Props) {
  return <LocalGuidePage locale="fr" slug={params.slug} />;
}
