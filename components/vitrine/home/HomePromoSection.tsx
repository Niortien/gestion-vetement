"use client";

import Link from "next/link";
import { useVitrineProduits } from "@/features/vitrine/query/vitrine-queries";
import { ProductTile } from "@/components/vitrine/common/ProductTile";
import { ProductCell, ProductGrid } from "@/components/vitrine/common/ProductRail";
import { IconArrow } from "@/components/vitrine/common/VitrineIcons";

/** Promotions du moment : le prix barré ancre le prix, le rouge est réservé à ce qui est réellement en promo. */
export function HomePromoSection() {
  const { data, isLoading } = useVitrineProduits({ enPromo: true, limit: 100 });
  const produits = data?.pages.flatMap((p) => p.data) ?? [];

  if (!isLoading && produits.length === 0) return null;

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto flex max-w-[1280px] items-end justify-between gap-4 px-5 md:px-8">
        <div>
          <h2 className="v-t1">
            Prix baissés
          </h2>
          {!isLoading && (
            <p className="mt-2 text-sm" style={{ color: "var(--v-muted)" }}>
              {produits.length} pièce{produits.length > 1 ? "s" : ""} en promotion en ce moment.
            </p>
          )}
        </div>
        <Link
          href="/catalogue"
          className="v-link hidden min-h-11 shrink-0 items-center gap-2 text-sm md:flex"
        >
          Tout voir <IconArrow size={16} />
        </Link>
      </div>

      <div className="mx-auto mt-6 max-w-[1280px] px-5 md:px-8">
        <ProductGrid label="Pièces en promotion">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ProductCell key={i}>
                  <div className="aspect-[4/5] animate-pulse rounded-[18px]" style={{ backgroundColor: "var(--v-s2)" }} />
                </ProductCell>
              ))
            : produits.map((p) => (
                <ProductCell key={p.id}>
                  <ProductTile produit={p} />
                </ProductCell>
              ))}
        </ProductGrid>
      </div>
    </section>
  );
}
