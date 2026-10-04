"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useVitrineCategories, useVitrineProduits } from "@/features/vitrine/query/vitrine-queries";
import { ProductTile } from "@/components/vitrine/common/ProductTile";

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

  const tab = (active: boolean) => ({
    color: active ? "var(--v-text)" : "var(--v-dim)",
    boxShadow: active ? "inset 0 -2px 0 var(--v-gold)" : "none",
  });
  const tabClass =
    "min-h-11 shrink-0 px-1 text-[13px] font-semibold uppercase tracking-wide transition-colors duration-150 hover:text-[var(--v-text)]";

  return (
    <section className="py-12 md:py-20" aria-labelledby="collection-titre">
      <div className="mx-auto flex max-w-[1600px] items-baseline justify-between gap-4 px-5">
        <h2 id="collection-titre" className="tag-title text-[clamp(28px,5vw,48px)]" style={{ color: "var(--v-text)" }}>
          Toute la collection
        </h2>
        <p className="text-sm" style={{ color: "var(--v-muted)" }} aria-live="polite">
          {isLoading ? "Chargement…" : `${total} pièce${total > 1 ? "s" : ""}`}
        </p>
      </div>

      {categories.length > 0 && (
        <div
          className="snap-rail mx-auto mt-5 max-w-[1600px] gap-5 border-b"
          style={{ borderColor: "var(--v-border)" }}
          role="group"
          aria-label="Filtrer par rayon"
        >
          <button type="button" aria-pressed={!categorieId} onClick={() => setCategorieId(undefined)} className={tabClass} style={tab(!categorieId)}>
            Tout
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={categorieId === c.id}
              onClick={() => setCategorieId(categorieId === c.id ? undefined : c.id)}
              className={tabClass}
              style={tab(categorieId === c.id)}
            >
              {c.nom}
            </button>
          ))}
        </div>
      )}

      <div className="mx-auto mt-6 max-w-[1600px] px-5">
        {isError ? (
          <div className="py-16 text-center">
            <p className="text-sm" style={{ color: "var(--v-muted)" }}>
              Impossible de charger les pièces. Vérifie ta connexion puis réessaie.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 min-h-11 rounded-sm px-6 text-xs font-bold uppercase tracking-[0.14em]"
              style={{ backgroundColor: "var(--v-gold)", color: "var(--v-on-gold)" }}
            >
              Réessayer
            </button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-md" style={{ backgroundColor: "var(--v-s2)" }} />
            ))}
          </div>
        ) : produits.length === 0 ? (
          <p className="py-16 text-center text-sm" style={{ color: "var(--v-muted)" }}>
            Aucune pièce dans ce rayon pour le moment.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {produits.map((p) => (
              <li key={p.id}>
                <ProductTile produit={p} dense />
              </li>
            ))}
          </ul>
        )}

        <div ref={sentinel} aria-hidden className="h-px" />

        {hasNextPage && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => void fetchNextPage()}
              disabled={isFetchingNextPage}
              className="min-h-12 rounded-sm border px-8 text-xs font-bold uppercase tracking-[0.14em] transition-colors duration-150 hover:border-[var(--v-gold)] disabled:opacity-60"
              style={{ borderColor: "var(--v-border-gold)", color: "var(--v-text)" }}
            >
              {isFetchingNextPage ? "Chargement…" : `Voir plus (${produits.length} sur ${total})`}
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
