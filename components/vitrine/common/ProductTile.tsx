"use client";

import Link from "next/link";
import type { Produit } from "@/types";
import { useVitrineStore } from "@/stores/vitrineStore";
import { isNouveau } from "@/lib/merchandising";
import { StockUrgency } from "@/components/vitrine/common/StockUrgency";
import { IconPin, IconPlus } from "@/components/vitrine/common/VitrineIcons";

interface ProductTileProps {
  produit: Produit;
  /** Ancienne API : rang et grande carte sont ignorés, la carte est identique partout. */
  rank?: number;
  large?: boolean;
  priority?: boolean;
  /** Version compacte (grilles denses) : coins nets, légende réduite, sans liste de tailles. */
  dense?: boolean;
}

const MAX_TAILLES = 5;

/** Boutiques qui ont réellement la pièce en stock (une seule fois chacune). */
function boutiquesEnStock(variantes: Produit["variantes"]): string[] {
  const noms = new Map<string, string>();
  for (const v of variantes ?? []) {
    if (v.quantiteStock > 0 && v.boutique && !noms.has(v.boutique.id)) noms.set(v.boutique.id, v.boutique.nom);
  }
  return [...noms.values()];
}

/**
 * Carte produit « étiquette » : photo 4:5, puis l'étiquette accrochée au vêtement (nom, prix, tailles).
 * Action rapide « ajouter au panier » toujours visible au tactile, révélée au survol sur ordinateur.
 */
export function ProductTile({ produit, dense = false }: ProductTileProps) {
  const addToCart = useVitrineStore((s) => s.addToCart);
  const setCartOpen = useVitrineStore((s) => s.setCartOpen);

  const imageUrl = produit.imageUrl ?? produit.images?.[0]?.url;
  const prix = parseFloat(produit.prixVente || "0");
  const variantes = produit.variantes ?? [];
  const totalStock = variantes.reduce((s, v) => s + v.quantiteStock, 0);
  const firstDispo = variantes.find((v) => v.quantiteStock > 0);
  const tailles = [...new Set(variantes.filter((v) => v.quantiteStock > 0).map((v) => String(v.taille)))];

  const boutiques = boutiquesEnStock(variantes);
  const isPromo = produit.enPromo && !!produit.prixPromo;
  const prixPromo = isPromo ? parseFloat(produit.prixPromo!) : null;
  const taux = isPromo && prixPromo !== null && prix > 0 ? Math.round(((prix - prixPromo) / prix) * 100) : null;
  const nouveau = isNouveau(produit.createdAt) && !isPromo;
  const rupture = totalStock === 0;

  return (
    <article className="group relative">
      <div className={`relative aspect-[4/5] overflow-hidden ${dense ? "rounded-md" : "rounded-xl"}`} style={{ backgroundColor: "var(--v-s2)" }}>
        <Link href={`/boutique/${produit.id}`} className="absolute inset-0 block" aria-label={`${produit.nom} — voir la fiche`}>
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={produit.nom}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              style={rupture ? { opacity: 0.45 } : undefined}
            />
          ) : (
            <span className="flex h-full items-center justify-center text-sm" style={{ color: "var(--v-dim)" }}>
              Photo à venir
            </span>
          )}
        </Link>

        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {taux !== null && (
            <span className="rounded-md px-2 py-1 text-[11px] font-bold leading-none" style={{ backgroundColor: "var(--v-hot)", color: "#fff" }}>
              −{taux}%
            </span>
          )}
          {nouveau && (
            <span className="rounded-md px-2 py-1 text-[11px] font-bold leading-none" style={{ backgroundColor: "var(--v-gold)", color: "var(--v-on-gold)" }}>
              Nouveau
            </span>
          )}
          {rupture && (
            <span className="rounded-md px-2 py-1 text-[11px] font-bold leading-none" style={{ backgroundColor: "var(--v-text)", color: "var(--v-bg)" }}>
              Rupture
            </span>
          )}
        </div>

        {firstDispo && (
          <button
            type="button"
            aria-label={`Ajouter ${produit.nom} au panier`}
            className="absolute bottom-2.5 right-2.5 flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 active:scale-95 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:translate-y-0 md:focus-visible:opacity-100"
            style={{ backgroundColor: "var(--v-gold)", color: "var(--v-on-gold)", boxShadow: "0 4px 14px rgba(0,0,0,0.35)" }}
            onClick={() => {
              addToCart({ produit, variante: firstDispo, quantite: 1 });
              setCartOpen(true);
            }}
          >
            <IconPlus size={20} />
          </button>
        )}
      </div>

      <div className="mt-3 px-0.5">
        <Link href={`/boutique/${produit.id}`}>
          <h3 className={`tag-title transition-colors group-hover:text-[var(--v-gold-text)] ${dense ? "text-[13px]" : "text-[15px]"}`} style={{ color: "var(--v-text)" }}>
            {produit.nom}
          </h3>
        </Link>

        <div className="mt-1.5 flex items-baseline gap-2">
          {isPromo && prixPromo !== null ? (
            <>
              <span className="font-[var(--font-mono)] text-sm font-bold" style={{ color: "var(--v-hot)" }}>
                {prixPromo.toLocaleString("fr-FR")} FCFA
              </span>
              <span className="font-[var(--font-mono)] text-xs line-through" style={{ color: "var(--v-dim)" }}>
                {prix.toLocaleString("fr-FR")}
              </span>
            </>
          ) : (
            <span className={`font-[var(--font-mono)] font-bold ${dense ? "text-xs" : "text-sm"}`} style={{ color: "var(--v-text)" }}>
              {prix.toLocaleString("fr-FR")} FCFA
            </span>
          )}
        </div>

        {!dense && tailles.length > 0 && (
          <p className="mt-1.5 text-[11px] tracking-wide" style={{ color: "var(--v-muted)" }}>
            {tailles.slice(0, MAX_TAILLES).join(" · ")}
            {tailles.length > MAX_TAILLES ? ` +${tailles.length - MAX_TAILLES}` : ""}
          </p>
        )}
        {boutiques.length > 0 && (
          <p className={`mt-1.5 flex items-center gap-1.5 font-medium ${dense ? "text-[10px]" : "text-[11px]"}`} style={{ color: "var(--v-muted)" }}>
            <IconPin size={12} style={{ color: "var(--v-gold-text)" }} />
            <span className="truncate">{boutiques.join(" · ")}</span>
          </p>
        )}
        <StockUrgency totalStock={totalStock} className="mt-1.5" />
      </div>
    </article>
  );
}
