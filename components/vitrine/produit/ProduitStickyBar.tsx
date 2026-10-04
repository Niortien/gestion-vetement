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
      className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 lg:hidden"
      style={{ backgroundColor: "var(--v-nav-bg)", borderColor: "var(--v-nav-border)", backdropFilter: "blur(16px)" }}
    >
      <div className="min-w-0">
        <p className="truncate text-xs" style={{ color: "var(--v-muted)" }}>
          {produit.nom}
        </p>
        <p className="font-[var(--font-mono)] text-base font-bold" style={{ color: isPromo ? "var(--v-hot)" : "var(--v-text)" }}>
          {prix.toLocaleString("fr-FR")} FCFA
        </p>
      </div>
      <button
        type="button"
        onClick={goToOrder}
        disabled={enRupture}
        className="ml-auto inline-flex min-h-12 items-center gap-2 rounded-xl px-5 text-sm font-bold transition-transform duration-150 active:scale-[0.98] disabled:opacity-50"
        style={{ backgroundColor: "var(--v-gold)", color: "var(--v-on-gold)" }}
      >
        <IconWhatsapp size={18} />
        {enRupture ? "Rupture de stock" : variante ? "Commander" : "Choisir ma taille"}
      </button>
    </div>
  );
}
