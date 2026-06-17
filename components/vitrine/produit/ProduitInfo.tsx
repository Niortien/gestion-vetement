"use client";

import type { Produit } from "@/types";

interface ProduitInfoProps {
  produit: Produit;
  totalStock: number;
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
        style={{ backgroundColor: "rgba(255,36,73,0.15)", color: "var(--v-red)" }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--v-red)]" />
        Rupture de stock
      </span>
    );
  if (stock <= 5)
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
        style={{ backgroundColor: "rgba(255,154,60,0.15)", color: "#ff9a3c" }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#ff9a3c]" />
        Limité — {stock} restant{stock > 1 ? "s" : ""}
      </span>
    );
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
      style={{ backgroundColor: "rgba(194,255,0,0.12)", color: "var(--v-lime)" }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--v-lime)]" />
      Disponible
    </span>
  );
}

export function ProduitInfo({ produit, totalStock }: ProduitInfoProps) {
  const prix = parseFloat(produit.prixVente || "0");

  return (
    <div>
      {/* Catégorie */}
      {produit.categorie && (
        <p
          className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em]"
          style={{ color: "var(--v-lime)" }}
        >
          {produit.categorie.nom}
        </p>
      )}

      {/* Nom */}
      <h1
        className="font-[var(--font-display)] font-black leading-tight tracking-tight"
        style={{ fontSize: "clamp(28px, 5vw, 48px)", color: "var(--v-text)" }}
      >
        {produit.nom}
      </h1>

      {/* SKU + Stock */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span
          className="font-[var(--font-mono)] text-xs"
          style={{ color: "var(--v-dim)" }}
        >
          REF: {produit.sku}
        </span>
        <StockBadge stock={totalStock} />
      </div>

      {/* Prix */}
      <div className="mt-5">
        <span
          className="font-[var(--font-mono)] font-black"
          style={{ fontSize: "clamp(28px, 4vw, 40px)", color: "var(--v-lime)" }}
        >
          {prix.toLocaleString("fr-FR")}
          <span
            className="ml-1.5 font-[var(--font-body)] text-lg font-normal"
            style={{ color: "var(--v-muted)" }}
          >
            FCFA
          </span>
        </span>
      </div>

      {/* Description */}
      {produit.description && (
        <p
          className="mt-5 text-sm leading-relaxed"
          style={{ color: "var(--v-muted)" }}
        >
          {produit.description}
        </p>
      )}
    </div>
  );
}
