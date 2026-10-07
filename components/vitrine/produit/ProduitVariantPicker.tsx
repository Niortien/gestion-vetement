"use client";

import type { Variante } from "@/types";
import { Taille } from "@/types";

interface ProduitVariantPickerProps {
  variantes: Variante[];
  selectedTaille: Taille | null;
  selectedCouleur: string | null;
  onTailleChange: (t: Taille) => void;
  onCouleurChange: (c: string) => void;
}

const TAILLE_ORDER = [Taille.XS, Taille.S, Taille.M, Taille.L, Taille.XL, Taille.XXL, Taille.XXXL];

function stockColor(stock: number): string {
  if (stock === 0) return "#C8102E";
  if (stock <= 3) return "#C8102E";
  return "#17703F";
}

export function ProduitVariantPicker({
  variantes,
  selectedTaille,
  selectedCouleur,
  onTailleChange,
  onCouleurChange,
}: ProduitVariantPickerProps) {
  // Tailles disponibles (ordonnées)
  const tailles = TAILLE_ORDER.filter((t) => variantes.some((v) => v.taille === t));

  // Couleurs disponibles pour la taille sélectionnée
  const couleurs = selectedTaille
    ? [...new Set(variantes.filter((v) => v.taille === selectedTaille).map((v) => v.couleur))]
    : [...new Set(variantes.map((v) => v.couleur))];

  const getStockForTaille = (t: Taille) =>
    variantes.filter((v) => v.taille === t).reduce((s, v) => s + v.quantiteStock, 0);

  const getStockForCouleur = (c: string) =>
    variantes
      .filter((v) => v.couleur === c && (!selectedTaille || v.taille === selectedTaille))
      .reduce((s, v) => s + v.quantiteStock, 0);

  return (
    <div className="space-y-6">
      {/* Taille */}
      <div>
        <div className="mb-2.5 flex items-baseline justify-between">
          <h3 className="v-t4">Taille</h3>
          {selectedTaille && <span className="text-[13px]" style={{ color: "var(--v-muted)" }}>{selectedTaille}</span>}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Choisir une taille">
          {tailles.map((t) => {
            const stock = getStockForTaille(t);
            const isActive = selectedTaille === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => stock > 0 && onTailleChange(t)}
                disabled={stock === 0}
                aria-pressed={isActive}
                className={`v-chip min-w-[58px] justify-center uppercase ${stock === 0 ? "is-off cursor-not-allowed" : ""}`}
              >
                {t}
                {stock > 0 && stock <= 3 && (
                  <span aria-label="stock limité" className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: isActive ? "#F0B429" : stockColor(stock) }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Couleur */}
      <div>
        <div className="mb-2.5 flex items-baseline justify-between">
          <h3 className="v-t4">Couleur</h3>
          {selectedCouleur && <span className="text-[13px]" style={{ color: "var(--v-muted)" }}>{selectedCouleur}</span>}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Choisir une couleur">
          {couleurs.map((c) => {
            const stock = getStockForCouleur(c);
            const isActive = selectedCouleur === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => stock > 0 && onCouleurChange(c)}
                disabled={stock === 0}
                aria-pressed={isActive}
                className={`v-chip ${stock === 0 ? "is-off cursor-not-allowed" : ""}`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
