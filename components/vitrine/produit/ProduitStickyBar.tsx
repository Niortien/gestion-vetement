"use client";

import type { Produit, Variante } from "@/types";
import { IconWhatsapp } from "@/components/vitrine/common/VitrineIcons";

interface ProduitStickyBarProps {
  produit: Produit;
  variante: Variante | null;
  enRupture: boolean;
}

/**
 * Barre de commande collée en bas (mobile) : le prix reste sous les yeux et un seul geste ramène au formulaire de
 * commande. Tant que la taille n'est pas choisie, le bouton le dit au lieu de promettre une commande impossible.
 */
export function ProduitStickyBar({ produit, variante, enRupture }: ProduitStickyBarProps) {
  const isPromo = produit.enPromo && !!produit.prixPromo;
  const prix = Number(isPromo ? produit.prixPromo : produit.prixVente) || 0;

  const goToOrder = () => {
    document.getElementById("commande")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 rounded-t-3xl px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-3.5 lg:hidden"
      style={{ backgroundColor: "#fff", color: "#0C0C0E", boxShadow: "0 -12px 30px -14px rgba(12,12,14,0.35)" }}
    >
      <div className="min-w-0 flex-1">
        <p className="v-price text-[19px]" style={{ color: isPromo ? "#C8102E" : "#0C0C0E" }}>
          {prix.toLocaleString("fr-FR")} FCFA
        </p>
        <p className="truncate text-[13px]" style={{ color: "#55555B" }}>
          {variante ? `Taille ${variante.taille}, ${variante.couleur}` : produit.nom}
        </p>
      </div>
      <button type="button" onClick={goToOrder} disabled={enRupture} className="v-btn v-btn-gold disabled:opacity-50" style={{ padding: "0 18px" }}>
        <IconWhatsapp size={18} />
        {enRupture ? "Rupture" : variante ? "Commander" : "Choisir ma taille"}
      </button>
    </div>
  );
}
