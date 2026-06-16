import type { Produit } from "@/types";
import { ProduitCard } from "./ProduitCard";

interface ProduitMasonryProps {
  items: Produit[];
  onSelect: (id: string) => void;
}

export function ProduitMasonry({ items, onSelect }: ProduitMasonryProps) {
  return (
    <div className="columns-1 gap-3 md:columns-2 xl:columns-3">
      {items.map((produit) => (
        <ProduitCard key={produit.id} produit={produit} onPress={() => onSelect(produit.id)} />
      ))}
    </div>
  );
}
