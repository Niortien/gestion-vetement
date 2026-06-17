import { LookbookView } from "@/components/vitrine/lookbook/LookbookView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lookbook — Dakar Nights | Riviere",
  description: "Collection éditoriale Dakar Nights. Découvrez nos looks et styles de la saison.",
};

export default function LookbookPage() {
  return <LookbookView />;
}
