"use client";

import type { Categorie } from "@/types";
import { Taille } from "@/types";

const TAILLES = Object.values(Taille);

interface CatalogueFiltersProps {
  categories: Categorie[];
  selectedCategorieId: string | null;
  selectedTaille: Taille | null;
  inStockOnly: boolean;
  onCategorieChange: (id: string | null) => void;
  onTailleChange: (t: Taille | null) => void;
  onInStockChange: (v: boolean) => void;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all"
      style={
        active
          ? { backgroundColor: "var(--v-lime)", borderColor: "var(--v-lime)", color: "#000" }
          : {
              backgroundColor: "transparent",
              borderColor: "var(--v-border)",
              color: "var(--v-muted)",
            }
      }
    >
      {children}
    </button>
  );
}

export function CatalogueFilters({
  categories,
  selectedCategorieId,
  selectedTaille,
  inStockOnly,
  onCategorieChange,
  onTailleChange,
  onInStockChange,
}: CatalogueFiltersProps) {
  return (
    <div
      className="sticky top-16 z-30 border-b"
      style={{ borderColor: "var(--v-border)", backgroundColor: "rgba(4,8,15,0.92)", backdropFilter: "blur(12px)" }}
    >
      <div className="mx-auto max-w-7xl px-5">
        {/* Ligne catégories */}
        <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
          <Chip active={!selectedCategorieId} onClick={() => onCategorieChange(null)}>
            Tous
          </Chip>
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              active={selectedCategorieId === cat.id}
              onClick={() => onCategorieChange(selectedCategorieId === cat.id ? null : cat.id)}
            >
              {cat.nom}
            </Chip>
          ))}
        </div>

        {/* Ligne tailles + stock */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-hide">
          <span
            className="shrink-0 text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--v-dim)" }}
          >
            Taille :
          </span>
          {TAILLES.map((t) => (
            <Chip
              key={t}
              active={selectedTaille === t}
              onClick={() => onTailleChange(selectedTaille === t ? null : t)}
            >
              {t}
            </Chip>
          ))}

          <div className="ml-auto shrink-0">
            <button
              onClick={() => onInStockChange(!inStockOnly)}
              className="flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all"
              style={
                inStockOnly
                  ? { backgroundColor: "var(--v-s3)", borderColor: "var(--v-lime)", color: "var(--v-lime)" }
                  : { backgroundColor: "transparent", borderColor: "var(--v-border)", color: "var(--v-dim)" }
              }
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: inStockOnly ? "var(--v-lime)" : "var(--v-dim)" }}
              />
              En stock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
