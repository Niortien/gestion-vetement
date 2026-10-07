import { useMemo } from "react";
import type { Produit } from "@/types";
import { ProduitCard } from "./ProduitCard";

interface ProduitMasonryProps {
  items: Produit[];
  onSelect: (id: string) => void;
  grouped?: boolean;
}

const GRID = "grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] sm:gap-[18px]";

export function ProduitMasonry({ items, onSelect, grouped = false }: ProduitMasonryProps) {
  const groups = useMemo(() => {
    if (!grouped) return null;
    const map = new Map<string, Produit[]>();
    for (const p of items) {
      const key = p.nom.trim()[0]?.toUpperCase() ?? "#";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [items, grouped]);

  if (grouped && groups) {
    return (
      <div className="space-y-6">
        {groups.map(([letter, produits]) => (
          <section key={letter} aria-label={`Produits en ${letter}`}>
            <div id={`alpha-${letter}`} className="mb-3 flex scroll-mt-4 items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-text font-display text-sm font-bold text-accent">{letter}</span>
              <span className="text-[13px] text-text-muted">
                {produits.length} produit{produits.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className={GRID}>
              {produits.map((produit) => (
                <ProduitCard key={produit.id} produit={produit} onPress={() => onSelect(produit.id)} />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className={GRID}>
      {items.map((produit) => (
        <ProduitCard key={produit.id} produit={produit} onPress={() => onSelect(produit.id)} />
      ))}
    </div>
  );
}
