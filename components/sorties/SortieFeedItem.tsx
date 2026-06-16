import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { FlowTag } from "@/components/common/FlowTag";
import type { Sortie, TypeSortie } from "@/types";

interface SortieFeedItemProps {
  sortie: Sortie;
}

const toneByType: Record<TypeSortie, "cash" | "out" | "default" | "return"> = {
  VENTE: "cash",
  PERTE: "out",
  DON: "default",
  RETOUR_FOURNISSEUR: "return",
};

export function SortieFeedItem({ sortie }: SortieFeedItemProps) {
  return (
    <article className="rounded-lg border border-border/80 bg-[linear-gradient(145deg,rgba(255,77,109,0.1),rgba(34,54,81,0.72))] p-3 transition hover:border-out/50 hover:shadow-md">
      <div className="mb-2 flex items-center justify-between">
        <FlowTag type={sortie.type === "VENTE" ? "vente" : "sortie"} />
        <span className="text-xs text-text-muted">{sortie.reference}</span>
      </div>
      <CurrencyDisplay montant={sortie.totalMontant} tone={toneByType[sortie.type]} size="lg" />
    </article>
  );
}
