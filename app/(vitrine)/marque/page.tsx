import { MarqueView } from "@/components/vitrine/marque/MarqueView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "La Marque — Riviere | Streetwear Dakar",
  description:
    "Découvrez l'histoire de Riviere, notre manifeste et nos valeurs. Le streetwear authentique de Dakar.",
};

export default function MarquePage() {
  return <MarqueView />;
}
