"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useVitrineCategories, useVitrineProduits } from "@/features/vitrine/query/vitrine-queries";
import { ProductTile } from "@/components/vitrine/common/ProductTile";
import { ProductCell, ProductGrid } from "@/components/vitrine/common/ProductRail";

const PAGE_SIZE = 24;

/**
 * Toute la collection (esprit Palace) : onglets de rayons en texte, puis grille serrée de 2 à 6 colonnes pour voir
 * un maximum de pièces d'un coup. Aucune pièce n'est masquée : les pages suivantes se chargent en descendant, et par
 * un bouton pour le clavier et les connexions lentes. La section ferme la page, juste avant le pied de page.
 */
export function HomeCollection() {
  const [categorieId, setCategorieId] = useState<string | undefined>(undefined);
  const { data: catData } = useVitrineCategories();
  const { data, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } = useVitrineProduits({
    categorieId,
    limit: PAGE_SIZE,
  });

  const produits = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);
  const total = data?.pages[0]?.meta.total ?? produits.length;
  const categories = catData?.data ?? [];

  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasNextPage) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !isFetchingNextPage) void fetchNextPage();
      },
      { rootMargin: "800px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, produits.length]);

  return (
    <section className="py-12 md:py-20" aria-labelledby="collection-titre">
      <div className="mx-auto flex max-w-[1280px] items-baseline justify-between gap-4 px-5 md:px-8">
        <h2 id="collection-titre" className="v-t1">
          Toute la collection
        </h2>
        <p className="text-sm" style={{ color: "var(--v-muted)" }} aria-live="polite">
          {isLoading ? "Chargement…" : `${total} pièce${total > 1 ? "s" : ""}`}
        </p>
      </div>

      {categories.length > 0 && (
        <div className="mx-auto mt-5 max-w-[1280px] px-5 md:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }} role="group" aria-label="Filtrer par rayon">
            <button type="button" aria-pressed={!categorieId} onClick={() => setCategorieId(undefined)} className="v-chip">
              Tout
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={categorieId === c.id}
                onClick={() => setCategorieId(categorieId === c.id ? undefined : c.id)}
                className="v-chip"
              >
                {c.nom}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto mt-4 max-w-[1280px] px-5 md:px-8">
        {isError ? (
          <div className="py-16 text-center">
            <p className="text-sm" style={{ color: "var(--v-muted)" }}>
              Impossible de charger les pièces. Vérifie ta connexion puis réessaie.
            </p>
            <button type="button" onClick={() => void refetch()} className="v-btn v-btn-gold mt-4">
              Réessayer
            </button>
          </div>
        ) : isLoading ? (
          <ProductGrid label="Chargement des pièces">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductCell key={i}>
                <div className="aspect-[4/5] animate-pulse rounded-[18px]" style={{ backgroundColor: "var(--v-s2)" }} />
              </ProductCell>
            ))}
          </ProductGrid>
        ) : produits.length === 0 ? (
          <p className="py-16 text-center text-sm" style={{ color: "var(--v-muted)" }}>
            Aucune pièce dans ce rayon pour le moment.
          </p>
        ) : (
          <ProductGrid label="Toute la collection">
            {produits.map((p) => (
              <ProductCell key={p.id}>
                <ProductTile produit={p} />
              </ProductCell>
            ))}
          </ProductGrid>
        )}

        <div ref={sentinel} aria-hidden className="h-px" />

        {hasNextPage && (
          <div className="mt-10 flex justify-center">
            <button type="button" onClick={() => void fetchNextPage()} disabled={isFetchingNextPage} className="v-btn v-btn-line disabled:opacity-60">
              {isFetchingNextPage ? "Chargement…" : `Afficher plus (${produits.length} sur ${total})`}
            </button>
          </div>
        )}
        {!hasNextPage && produits.length > 0 && (
          <p className="mt-10 text-center text-sm" style={{ color: "var(--v-dim)" }}>
            Tu as tout vu : {produits.length} pièce{produits.length > 1 ? "s" : ""}.
          </p>
        )}
      </div>
    </section>
  );
}
