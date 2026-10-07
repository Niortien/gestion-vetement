"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import type { Produit } from "@/types";
import { useVitrineStore } from "@/stores/vitrineStore";
import { isNouveau } from "@/lib/merchandising";
import { LOW_STOCK_THRESHOLD } from "@/components/vitrine/common/StockUrgency";
import { IconPlus } from "@/components/vitrine/common/VitrineIcons";

interface ProductTileProps {
  produit: Produit;
  /** Ancienne API : rang, grande carte et densité sont ignorés, la carte est identique partout. */
  rank?: number;
  large?: boolean;
  dense?: boolean;
  priority?: boolean;
  /** Classes de largeur quand la carte est posée dans un rail. */
  className?: string;
  /** Décalage du balancement d'arrivée (secondes), pour que les cartes ne bougent pas toutes ensemble. */
  swingDelay?: number;
}

/** Boutiques qui ont réellement la pièce en stock (une seule fois chacune). */
function boutiquesEnStock(variantes: Produit["variantes"]): string[] {
  const noms = new Map<string, string>();
  for (const v of variantes ?? []) {
    if (v.quantiteStock > 0 && v.boutique && !noms.has(v.boutique.id)) noms.set(v.boutique.id, v.boutique.nom);
  }
  return [...noms.values()];
}

/**
 * Carte « portant » : la photo 4:5 est accrochée par un crochet, l'étiquette blanche (nom, prix, boutique) est posée
 * sur son bas. Les pastilles disent ce que le stock confirme : promo, nouveauté, « plus que N », rupture.
 */
export function ProductTile({ produit, className, swingDelay }: ProductTileProps) {
  const addToCart = useVitrineStore((s) => s.addToCart);
  const setCartOpen = useVitrineStore((s) => s.setCartOpen);

  const imageUrl = produit.imageUrl ?? produit.images?.[0]?.url;
  const prix = parseFloat(produit.prixVente || "0");
  const variantes = produit.variantes ?? [];
  const totalStock = variantes.reduce((s, v) => s + v.quantiteStock, 0);
  const firstDispo = variantes.find((v) => v.quantiteStock > 0);
  const boutiques = boutiquesEnStock(variantes);

  const isPromo = produit.enPromo && !!produit.prixPromo;
  const prixPromo = isPromo ? parseFloat(produit.prixPromo!) : null;
  const taux = isPromo && prixPromo !== null && prix > 0 ? Math.round(((prix - prixPromo) / prix) * 100) : null;
  const nouveau = isNouveau(produit.createdAt) && !isPromo;
  const rupture = totalStock === 0;
  const rare = totalStock >= 1 && totalStock <= LOW_STOCK_THRESHOLD;

  const style: CSSProperties | undefined = swingDelay === undefined ? undefined : { animationDelay: `${swingDelay}s` };

  return (
    <article className={`v-hang v-swing group ${className ?? ""}`} style={style}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[18px]" style={{ backgroundColor: "var(--v-s2)" }}>
        <Link href={`/boutique/${produit.id}`} className="absolute inset-0 block" aria-label={`${produit.nom}, voir la fiche`}>
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={produit.nom}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              style={rupture ? { opacity: 0.5 } : undefined}
            />
          ) : (
            <span className="flex h-full items-center justify-center text-sm" style={{ color: "var(--v-dim)" }}>
              Photo à venir
            </span>
          )}
        </Link>

        <div className="pointer-events-none absolute left-2.5 top-2.5 z-[1] flex flex-col items-start gap-1.5">
          {taux !== null && (
            <span className="v-badge" style={{ backgroundColor: "#C8102E", color: "#fff" }}>
              −{taux} %
            </span>
          )}
          {nouveau && (
            <span className="v-badge" style={{ backgroundColor: "#F0B429", color: "#0C0C0E" }}>
              Nouveau
            </span>
          )}
          {rare && (
            <span className="v-badge" style={{ backgroundColor: "#fff", color: "#0C0C0E" }}>
              <span aria-hidden className="h-[7px] w-[7px] rounded-full" style={{ backgroundColor: "#C8102E" }} />
              {totalStock === 1 ? "Dernière pièce" : `Plus que ${totalStock}`}
            </span>
          )}
          {rupture && (
            <span className="v-badge" style={{ backgroundColor: "#0C0C0E", color: "#fff" }}>
              Rupture
            </span>
          )}
        </div>

        {firstDispo && (
          <button
            type="button"
            aria-label={`Ajouter ${produit.nom} au panier`}
            className="absolute right-2.5 top-2.5 z-[2] flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-95"
            style={{ backgroundColor: "#fff", color: "#0C0C0E", boxShadow: "0 4px 12px -4px rgba(12,12,14,0.35)" }}
            onClick={() => {
              addToCart({ produit, variante: firstDispo, quantite: 1 });
              setCartOpen(true);
            }}
          >
            <IconPlus size={18} />
          </button>
        )}
      </div>

      {/* Étiquette : couleurs posées en dur (encre sur blanc) pour rester lisibles quel que soit le thème de la vitrine. */}
      <div className="v-tag" style={{ backgroundColor: "#FFFFFF", boxShadow: "0 10px 24px -12px rgba(12,12,14,0.55), 0 0 0 1px rgba(12,12,14,0.12)" }}>
        <Link href={`/boutique/${produit.id}`} className="block">
          <h3 className="v-t4 text-[17px] font-bold leading-tight" style={{ color: "#0C0C0E" }}>
            {produit.nom}
          </h3>
        </Link>
        <p className="v-price mt-1 text-[17px] font-extrabold" style={{ color: "#0C0C0E" }}>
          {isPromo && prixPromo !== null ? (
            <>
              <span style={{ color: "#B00D27" }}>{prixPromo.toLocaleString("fr-FR")} FCFA</span>
              <s className="ml-1.5 text-sm font-semibold" style={{ color: "#4A4A50" }}>
                {prix.toLocaleString("fr-FR")}
              </s>
            </>
          ) : (
            <>{prix.toLocaleString("fr-FR")} FCFA</>
          )}
        </p>
        {boutiques.length > 0 && (
          <p className="mt-1 truncate text-[13px] font-medium" style={{ color: "#3A3A40" }}>
            {boutiques.join(" · ")}
          </p>
        )}
      </div>
    </article>
  );
}
