"use client";

import type { Categorie } from "@/types";

interface CatalogueFiltersProps {
  categories: Categorie[];
  selectedCategorieId: string | null;
  inStockOnly: boolean;
  onCategorieChange: (id: string | null) => void;
  onInStockChange: (v: boolean) => void;
}

/** Puces de rayons (état lu par les lecteurs d'écran via aria-pressed) et filtre « en stock ». */
export function CatalogueFilters({
  categories,
  selectedCategorieId,
  inStockOnly,
  onCategorieChange,
  onInStockChange,
}: CatalogueFiltersProps) {
  return (
    <div
      className="sticky top-[72px] z-30 py-3"
      style={{ backgroundColor: "var(--v-bg)", boxShadow: "0 12px 18px -16px rgba(12,12,14,0.35)" }}
      role="group"
      aria-label="Filtres du catalogue"
    >
      <div className="mx-auto flex max-w-[1280px] gap-2 overflow-x-auto px-5 md:px-8" style={{ scrollbarWidth: "none" }}>
        <button type="button" aria-pressed={!selectedCategorieId} onClick={() => onCategorieChange(null)} className="v-chip shrink-0">
          Tout
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            aria-pressed={selectedCategorieId === cat.id}
            onClick={() => onCategorieChange(selectedCategorieId === cat.id ? null : cat.id)}
            className="v-chip shrink-0"
          >
            {cat.nom}
          </button>
        ))}

        <span aria-hidden className="mx-1 my-2 w-px shrink-0" style={{ backgroundColor: "var(--v-border)" }} />

        <button type="button" aria-pressed={inStockOnly} onClick={() => onInStockChange(!inStockOnly)} className="v-chip shrink-0">
          <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: inStockOnly ? "#F0B429" : "var(--v-dim)" }} />
          En stock
        </button>
      </div>
    </div>
  );
}
