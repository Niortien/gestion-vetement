"use client";

import { useEffect, useRef } from "react";
import type { Produit, Taille } from "@/types";
import { useVitrineProduits } from "@/features/vitrine/query/vitrine-queries";
import { ProductTile } from "@/components/vitrine/common/ProductTile";
import { ProductCell, ProductGrid } from "@/components/vitrine/common/ProductRail";

interface CatalogueGridProps {
  categorieId: string | null;
  taille: Taille | null;
  search: string;
  inStockOnly?: boolean;
}

export function CatalogueGrid({ categorieId, taille, search, inStockOnly }: CatalogueGridProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useVitrineProduits({
      limit: 12,
      ...(categorieId  ? { categorieId }  : {}),
      ...(search       ? { search }       : {}),
      ...(inStockOnly  ? { inStockOnly }  : {}),
    });

  const allProduits: Produit[] = (data?.pages ?? []).flatMap((p) => p.data);

  const filtered = taille
    ? allProduits.filter((p) =>
        (p.variantes ?? []).some((v) => v.taille === taille && v.quantiteStock > 0)
      )
    : allProduits;

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage(); },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const skeleton = (
    <div className="mx-auto max-w-[1280px] px-5 py-6 md:px-8">
      <ProductGrid label="Chargement des pièces">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCell key={i}>
            <div className="aspect-[4/5] animate-pulse rounded-[18px]" style={{ backgroundColor: "var(--v-s2)" }} />
          </ProductCell>
        ))}
      </ProductGrid>
    </div>
  );

  if (isLoading) return skeleton;

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="v-t3" style={{ color: "var(--v-muted)" }}>
          Impossible de charger les produits.
        </p>
        <p className="text-xs" style={{ color: "var(--v-dim)" }}>
          Vérifie ta connexion ou réessaie dans quelques secondes.
        </p>
      </div>
    );
  }

  // During background refetch with no cached data yet, show skeleton instead of empty state
  if (filtered.length === 0 && isFetching) return skeleton;

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-[15px]" style={{ color: "var(--v-muted)" }}>
          Aucun produit ne correspond à ces filtres.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-5 pb-6 pt-2 md:px-8">
      <p className="small pt-3 text-[13px]" style={{ color: "var(--v-muted)" }} aria-live="polite">
        {filtered.length} pièce{filtered.length > 1 ? "s" : ""} affichée{filtered.length > 1 ? "s" : ""}
      </p>
      <ProductGrid label="Pièces du catalogue" className="mt-2">
        {filtered.map((produit, i) => (
          <ProductCell key={produit.id}>
            <ProductTile produit={produit} priority={i === 0} swingDelay={Math.min(i * 0.06, 0.5)} />
          </ProductCell>
        ))}
      </ProductGrid>

      {/* Sentinelle du défilement infini */}
      <div ref={loadMoreRef} className="mt-10 flex justify-center pb-4">
        {isFetchingNextPage && (
          <p className="flex items-center gap-2 text-sm" style={{ color: "var(--v-muted)" }}>
            <span aria-hidden className="inline-flex gap-1">
              {[0, 1, 2, 3].map((n) => (
                <i key={n} className="block h-2 w-2 animate-pulse" style={{ backgroundColor: "#F0B429", animationDelay: `${n * 140}ms`, clipPath: "polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%)" }} />
              ))}
            </span>
            Chargement
          </p>
        )}
      </div>
    </div>
  );
}
