"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useVitrineCategories, useVitrineProduits } from "@/features/vitrine/query/vitrine-queries";
import { ProductTile } from "@/components/vitrine/common/ProductTile";
import { IconArrow } from "@/components/vitrine/common/VitrineIcons";

const PAGE_SIZE = 24;

/**
 * Toute la collection sur l'accueil : chaque pièce de la boutique, sans plafond.
 * Les pages suivantes se chargent d'elles-mêmes en descendant (et par un bouton, pour le clavier et les connexions lentes).
 * Les rayons filtrent la grille sur place, sans quitter l'accueil.
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
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, produits.length]);

  const chip = (active: boolean) => ({
    backgroundColor: active ? "var(--v-gold)" : "transparent",
    color: active ? "var(--v-on-gold)" : "var(--v-muted)",
    borderColor: active ? "var(--v-gold)" : "var(--v-border)",
  });

  return (
    <section className="py-16 md:py-24" aria-labelledby="collection-titre">
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-4 px-5">
        <div>
          <h2 id="collection-titre" className="tag-title text-[clamp(30px,6vw,56px)]" style={{ color: "var(--v-text)" }}>
            Toute la collection
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--v-muted)" }} aria-live="polite">
            {isLoading ? "Chargement des pièces…" : `${total} pièce${total > 1 ? "s" : ""} en rayon`}
          </p>
        </div>
        <Link href="/catalogue" className="hidden min-h-11 shrink-0 items-center gap-2 text-sm font-semibold md:flex" style={{ color: "var(--v-gold-text)" }}>
          Filtres et tailles <IconArrow size={16} />
        </Link>
      </div>

      {categories.length > 0 && (
        <div className="snap-rail mt-6 md:mx-auto md:max-w-7xl md:flex-wrap md:overflow-visible md:px-5" role="group" aria-label="Filtrer par rayon">
          <button
            type="button"
            aria-pressed={!categorieId}
            onClick={() => setCategorieId(undefined)}
            className="min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors duration-150"
            style={chip(!categorieId)}
          >
            Tout
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={categorieId === c.id}
              onClick={() => setCategorieId(categorieId === c.id ? undefined : c.id)}
              className="min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors duration-150"
              style={chip(categorieId === c.id)}
            >
              {c.nom}
            </button>
          ))}
        </div>
      )}

      <div className="mx-auto mt-8 max-w-7xl px-5">
        {isError ? (
          <div className="py-16 text-center">
            <p className="text-sm" style={{ color: "var(--v-muted)" }}>
              Impossible de charger les pièces. Vérifie ta connexion puis réessaie.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 min-h-11 rounded-xl px-6 text-sm font-bold"
              style={{ backgroundColor: "var(--v-gold)", color: "var(--v-on-gold)" }}
            >
              Réessayer
            </button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-xl" style={{ backgroundColor: "var(--v-s2)" }} />
            ))}
          </div>
        ) : produits.length === 0 ? (
          <p className="py-16 text-center text-sm" style={{ color: "var(--v-muted)" }}>
            Aucune pièce dans ce rayon pour le moment.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
            {produits.map((p, i) => (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -30px 0px" }}
                transition={{ delay: (i % 4) * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
               
              >
                <ProductTile produit={p} />
              </motion.li>
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
              className="min-h-12 rounded-xl border px-8 text-sm font-semibold transition-colors duration-150 hover:border-[var(--v-gold)] disabled:opacity-60"
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
