"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useVitrineProduits } from "@/features/vitrine/query/vitrine-queries";
import { ProductTile } from "@/components/vitrine/common/ProductTile";
import { ProductRail } from "@/components/vitrine/common/ProductRail";

const MAX = 10;

/** Les dernières pièces ajoutées, sur un portant qu'on fait glisser. */
export function HomeNouveautes() {
  const { data, isLoading } = useVitrineProduits({ limit: 40 });

  const produits = useMemo(() => {
    const all = data?.pages[0]?.data ?? [];
    return [...all].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, MAX);
  }, [data]);

  if (!isLoading && produits.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1280px] px-5 pt-16 md:px-8 md:pt-20" aria-labelledby="nouveautes-titre">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 id="nouveautes-titre" className="v-t1">
          Nouveautés
        </h2>
        <Link href="/catalogue" className="v-link min-h-11 content-center text-sm md:text-base">
          Tout le catalogue
        </Link>
      </div>

      <ProductRail label="Nouveautés">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="w-[172px] md:w-[232px]">
                <div className="aspect-[4/5] animate-pulse rounded-[18px]" style={{ backgroundColor: "var(--v-s2)" }} />
              </li>
            ))
          : produits.map((p, i) => (
              <li key={p.id} className="w-[172px] md:w-[232px]">
                <ProductTile produit={p} swingDelay={0.3 + i * 0.1} />
              </li>
            ))}
      </ProductRail>
    </section>
  );
}
