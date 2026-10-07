"use client";

import { useState } from "react";
import Image from "next/image";
import { IconPhoto } from "@tabler/icons-react";
import { isNouveau } from "@/lib/merchandising";
import { cn } from "@/lib/utils";
import type { Produit } from "@/types";

interface ProduitCardProps {
  produit: Produit;
  onPress: () => void;
}

const fcfa = (v: string | number) => Number(v).toLocaleString("fr-FR");

export function ProduitCard({ produit, onPress }: ProduitCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = produit.imageUrl ?? produit.images?.[0]?.url ?? null;
  const variantes = produit.variantes ?? [];
  const totalStock = variantes.reduce((sum, v) => sum + v.quantiteStock, 0);
  const isPromo = produit.enPromo && !!produit.prixPromo;
  const prixVente = parseFloat(produit.prixVente);
  const taux = isPromo ? Math.round(((prixVente - parseFloat(produit.prixPromo!)) / prixVente) * 100) : null;
  const rupture = totalStock <= 0;

  // Une pastille par taille ; barrée quand plus aucune pièce n'existe dans cette taille.
  const tailles = [...new Set(variantes.map((v) => String(v.taille)))].map((t) => ({
    taille: t,
    dispo: variantes.some((v) => String(v.taille) === t && v.quantiteStock > 0),
  }));
  const rare = totalStock >= 1 && totalStock <= 3;

  return (
    <article className="group flex flex-col overflow-hidden rounded-[20px] bg-surface shadow-[0_0_0_1px_var(--color-border)] transition-transform duration-200 hover:-translate-y-0.5">
      <button
        type="button"
        onClick={onPress}
        aria-label={`Ouvrir la fiche de ${produit.nom}`}
        className="flex w-full cursor-pointer flex-col text-left focus-visible:outline focus-visible:outline-[3px] focus-visible:-outline-offset-2 focus-visible:outline-accent"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-high">
          {imageUrl && !imgError ? (
            <Image
              src={imageUrl}
              alt={produit.nom}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 20vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[13px] font-semibold text-text-muted">
              <IconPhoto size={28} aria-hidden />
              Ajouter une photo
            </div>
          )}
          <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
            {rupture && <span className="inline-flex min-h-[26px] items-center rounded-full bg-[#0C0C0E] px-2.5 text-xs font-bold text-white">Rupture</span>}
            {!rupture && rare && (
              <span className="inline-flex min-h-[26px] items-center gap-1.5 rounded-full bg-white px-2.5 text-xs font-bold text-[#0C0C0E]">
                <span aria-hidden className="h-[7px] w-[7px] rounded-full bg-[#C8102E]" />
                {totalStock === 1 ? "Dernière pièce" : `${totalStock} restants`}
              </span>
            )}
            {isPromo && <span className="inline-flex min-h-[26px] items-center rounded-full bg-[#C8102E] px-2.5 text-xs font-bold text-white">−{taux} %</span>}
            {!isPromo && isNouveau(produit.createdAt) && (
              <span className="inline-flex min-h-[26px] items-center rounded-full bg-[#F0B429] px-2.5 text-xs font-bold text-[#0C0C0E]">Nouveau</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 px-3.5 pb-3.5 pt-3">
          <p className="truncate font-display text-[17px] font-semibold leading-tight text-text">{produit.nom}</p>
          <p className="truncate text-[13px] text-text-muted">
            {produit.sku}
            {produit.categorie ? ` · ${produit.categorie.nom}` : ""}
          </p>
          <p className="font-display font-bold tabular-nums text-text">
            {isPromo ? (
              <>
                <span className="text-[#C8102E]">{fcfa(produit.prixPromo!)}</span>
                <s className="ml-1.5 text-[13px] font-medium text-text-muted">{fcfa(prixVente)}</s>
              </>
            ) : (
              fcfa(prixVente)
            )}{" "}
            <span className="text-[13px] font-medium text-text-muted">achat {fcfa(produit.prixAchat)}</span>
          </p>
          {tailles.length > 0 && (
            <ul className="mt-1.5 flex flex-wrap gap-1" aria-label="Tailles">
              {tailles.map((t) => (
                <li
                  key={t.taille}
                  className={cn(
                    "flex h-6 min-w-7 items-center justify-center rounded-[7px] bg-base px-1.5 text-[11.5px] font-bold",
                    !t.dispo && "text-text-muted/60 line-through"
                  )}
                >
                  {t.taille}
                </li>
              ))}
            </ul>
          )}
        </div>
      </button>
    </article>
  );
}
