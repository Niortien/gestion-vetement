"use client";

import Link from "next/link";
import { useVitrineProduits } from "@/features/vitrine/query/vitrine-queries";
import { ProductTile } from "@/components/vitrine/common/ProductTile";
import { ProductRail } from "@/components/vitrine/common/ProductRail";

interface ProduitRelatedProps {
  categorieId: string;
  excludeId: string;
}

/** « Avec ça » : d'autres pièces du même rayon, sur un portant. */
export function ProduitRelated({ categorieId, excludeId }: ProduitRelatedProps) {
  const { data } = useVitrineProduits({ categorieId, limit: 8 });
  const produits = (data?.pages[0]?.data ?? []).filter((p) => p.id !== excludeId).slice(0, 6);

  if (produits.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1280px] px-5 pb-16 pt-10 md:px-8" aria-labelledby="related-titre">
      <div className="mb-3 flex items-end justify-between gap-4">
        <h2 id="related-titre" className="v-t2">Avec ça</h2>
        <Link href="/catalogue" className="v-link min-h-11 content-center text-sm">Tout voir</Link>
      </div>
      <ProductRail label="Pièces du même rayon">
        {produits.map((p, i) => (
          <li key={p.id} className="w-[158px] md:w-[220px]">
            <ProductTile produit={p} swingDelay={0.2 + i * 0.1} />
          </li>
        ))}
      </ProductRail>
    </section>
  );
}
