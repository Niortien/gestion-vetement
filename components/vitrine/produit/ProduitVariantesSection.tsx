"use client";

import { useMemo } from "react";
import type { Variante } from "@/types";
import { Taille } from "@/types";
import { ProduitVariantPicker } from "./ProduitVariantPicker";
import { getWhatsappUrl } from "@/lib/whatsapp";
import { IconWhatsapp } from "@/components/vitrine/common/VitrineIcons";

interface ProduitVariantesSectionProps {
  variantes: Variante[];
  selectedTaille: Taille | null;
  selectedCouleur: string | null;
  onTailleChange: (t: Taille) => void;
  onCouleurChange: (c: string) => void;
}

const TAILLE_ORDER = [Taille.XS, Taille.S, Taille.M, Taille.L, Taille.XL, Taille.XXL, Taille.XXXL];

const stockLine = (n: number, taille: string | null): string => {
  const t = taille ? ` en ${taille}` : "";
  if (n === 0) return `Pas${t} pour le moment`;
  if (n === 1) return `Dernière pièce${t}`;
  return `${n} pièces${t}`;
};

/** Choix taille et couleur, stock par boutique pour la sélection, et grille de stock complète repliable. */
export function ProduitVariantesSection({
  variantes,
  selectedTaille,
  selectedCouleur,
  onTailleChange,
  onCouleurChange,
}: ProduitVariantesSectionProps) {
  const tailles = TAILLE_ORDER.filter((t) => variantes.some((v) => v.taille === t));
  const couleurs = [...new Set(variantes.map((v) => v.couleur))];

  // Stock de la sélection, boutique par boutique (taille seule tant que la couleur n'est pas choisie).
  const boutiques = useMemo(() => {
    const map = new Map<string, { nom: string; stock: number }>();
    for (const v of variantes) {
      if (!v.boutique) continue;
      const entry = map.get(v.boutique.id) ?? { nom: v.boutique.nom, stock: 0 };
      const matches =
        (!selectedTaille || v.taille === selectedTaille) && (!selectedCouleur || v.couleur === selectedCouleur);
      if (matches) entry.stock += v.quantiteStock;
      map.set(v.boutique.id, entry);
    }
    return [...map.values()];
  }, [variantes, selectedTaille, selectedCouleur]);

  if (variantes.length === 0) {
    const url = getWhatsappUrl("Bonjour Dri Valé, je voudrais avoir des infos sur les tailles disponibles pour un produit.");
    return (
      <div className="v-card p-6 text-center">
        <p className="v-t4">Tailles non renseignées</p>
        <p className="mb-4 mt-1 text-sm" style={{ color: "var(--v-muted)" }}>
          Contacte-nous pour connaître les disponibilités.
        </p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="v-btn v-btn-gold v-btn-sm">
          <IconWhatsapp size={18} />
          Demander les tailles
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProduitVariantPicker
        variantes={variantes}
        selectedTaille={selectedTaille}
        selectedCouleur={selectedCouleur}
        onTailleChange={onTailleChange}
        onCouleurChange={onCouleurChange}
      />

      {boutiques.length > 0 && (
        <div className="v-card px-[18px] py-1.5" aria-live="polite">
          {boutiques.map((b, i) => (
            <div key={b.nom} className="flex items-center gap-3 py-3" style={{ borderBottom: i < boutiques.length - 1 ? "1px solid var(--v-border)" : undefined }}>
              <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: b.stock > 0 ? "#17703F" : "#C9C9CE" }} />
              <div className="flex-1">
                <p className="font-bold">{b.nom}</p>
                <p className="text-[13px]" style={{ color: "var(--v-muted)" }}>{stockLine(b.stock, selectedTaille ? String(selectedTaille) : null)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {couleurs.length > 0 && tailles.length > 0 && (
        <details className="v-card overflow-hidden">
          <summary className="flex min-h-12 cursor-pointer items-center justify-between px-[18px] text-sm font-bold">
            Grille de stock complète
            <span className="text-[13px] font-medium" style={{ color: "var(--v-muted)" }}>
              {variantes.filter((v) => v.quantiteStock > 0).length} / {variantes.length} disponibles
            </span>
          </summary>
          <div className="overflow-x-auto border-t" style={{ borderColor: "var(--v-border)" }}>
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th scope="col" className="px-4 py-2.5 text-left font-bold" style={{ color: "var(--v-muted)" }}>Taille</th>
                  {couleurs.map((c) => (
                    <th key={c} scope="col" className="px-3 py-2.5 text-center font-bold" style={{ color: "var(--v-muted)" }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tailles.map((t) => (
                  <tr key={t} style={{ borderTop: "1px solid var(--v-border)" }}>
                    <th scope="row" className="px-4 py-2.5 text-left font-extrabold uppercase">{t}</th>
                    {couleurs.map((c) => {
                      const stock = variantes.filter((x) => x.taille === t && x.couleur === c).reduce((s, x) => s + x.quantiteStock, 0);
                      const exists = variantes.some((x) => x.taille === t && x.couleur === c);
                      const isSelected = selectedTaille === t && selectedCouleur === c;
                      return (
                        <td key={c} className="px-3 py-2 text-center">
                          {!exists ? (
                            <span style={{ color: "var(--v-dim)" }}>—</span>
                          ) : (
                            <button
                              type="button"
                              disabled={stock === 0}
                              onClick={() => {
                                onTailleChange(t);
                                onCouleurChange(c);
                              }}
                              aria-label={`${t}, ${c} : ${stock} en stock`}
                              className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-full font-bold tabular-nums disabled:cursor-not-allowed"
                              style={{
                                backgroundColor: isSelected ? "#0C0C0E" : "transparent",
                                color: isSelected ? "#fff" : stock === 0 ? "var(--v-dim)" : "var(--v-text)",
                                textDecoration: stock === 0 ? "line-through" : undefined,
                              }}
                            >
                              {stock}
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
}
