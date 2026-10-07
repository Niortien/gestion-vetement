"use client";

import Link from "next/link";
import type { Produit } from "@/types";

interface ProduitInfoProps {
  produit: Produit;
  totalStock: number;
}

/** Étiquette de la pièce : rayon, nom, prix, état du stock en toutes lettres. */
export function ProduitInfo({ produit, totalStock }: ProduitInfoProps) {
  const prix = parseFloat(produit.prixVente || "0");
  const isPromo = produit.enPromo && !!produit.prixPromo;
  const prixPromo = isPromo ? parseFloat(produit.prixPromo!) : null;
  const taux = isPromo && prixPromo !== null && prix > 0 ? Math.round(((prix - prixPromo) / prix) * 100) : null;

  return (
    <section
      className="relative rounded-[22px] py-5 pl-10 pr-5 shadow-[0_18px_40px_-22px_rgba(12,12,14,0.45)]"
      style={{ backgroundColor: "#fff", color: "#0C0C0E" }}
      aria-labelledby="produit-nom"
    >
      <span aria-hidden className="absolute left-[15px] top-[30px] h-3 w-3 rounded-full" style={{ backgroundColor: "#F6F6F5", boxShadow: "inset 0 0 0 2px #E1E1DF" }} />

      {produit.categorie && (
        <Link href={`/catalogue?categorieId=${produit.categorie.id}`} className="text-[13px] font-bold" style={{ color: "#55555B" }}>
          {produit.categorie.nom}
        </Link>
      )}

      <h1 id="produit-nom" className="v-t1 mt-1">
        {produit.nom}
      </h1>

      <p className="v-price mt-1.5" style={{ fontSize: 28 }}>
        {isPromo && prixPromo !== null ? (
          <>
            <span style={{ color: "#C8102E" }}>{prixPromo.toLocaleString("fr-FR")} FCFA</span>
            <s className="ml-2 text-base font-medium" style={{ color: "#6B6B72" }}>{prix.toLocaleString("fr-FR")}</s>
            {taux !== null && <span className="v-badge ml-2 align-middle" style={{ backgroundColor: "#C8102E", color: "#fff" }}>−{taux} %</span>}
          </>
        ) : (
          <>{prix.toLocaleString("fr-FR")} FCFA</>
        )}
      </p>
      <p className="mt-1.5 text-[13px]" style={{ color: "#55555B" }}>
        Prix en boutique, le même sur WhatsApp · Réf. {produit.sku}
      </p>

      <p className="mt-3 flex items-center gap-2 text-sm font-bold" style={{ color: totalStock === 0 ? "#C8102E" : totalStock <= 3 ? "#C8102E" : "#17703F" }}>
        <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: "currentColor" }} />
        {totalStock === 0 ? "Rupture de stock" : totalStock === 1 ? "Dernière pièce" : totalStock <= 3 ? `Plus que ${totalStock} en stock` : "En rayon"}
      </p>

      {produit.description && (
        <p className="mt-4 text-[15px] leading-relaxed" style={{ color: "#3A3A40" }}>
          {produit.description}
        </p>
      )}
    </section>
  );
}
