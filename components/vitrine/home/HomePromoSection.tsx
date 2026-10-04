"use client";

import Link from "next/link";
import { useVitrineProduits } from "@/features/vitrine/query/vitrine-queries";
import { ProductTile } from "@/components/vitrine/common/ProductTile";
import { IconArrow } from "@/components/vitrine/common/VitrineIcons";

/** Promotions du moment : le prix barré ancre le prix, le rouge est réservé à ce qui est réellement en promo. */
export function HomePromoSection() {
  const { data, isLoading } = useVitrineProduits({ enPromo: true, limit: 100 });
  const produits = data?.pages.flatMap((p) => p.data) ?? [];

  if (!isLoading && produits.length === 0) return null;

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: "var(--v-s1)" }}>
      <div className="mx-auto flex max-w-[1600px] items-end justify-between gap-4 px-5">
        <div>
          <h2 className="tag-title text-[clamp(30px,6vw,56px)]" style={{ color: "var(--v-text)" }}>
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
          className="hidden min-h-11 shrink-0 items-center gap-2 text-sm font-semibold md:flex"
          style={{ color: "var(--v-gold-text)" }}
        >
          Tout voir <IconArrow size={16} />
        </Link>
      </div>

      <div className="mx-auto mt-8 max-w-[1600px] px-5">
        <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <li key={i}>
                  <div className="aspect-[4/5] animate-pulse rounded-md" style={{ backgroundColor: "var(--v-s2)" }} />
                </li>
              ))
            : produits.map((p) => (
                <li key={p.id}>
                  <ProductTile produit={p} dense />
                </li>
              ))}
        </ul>
      </div>
    </section>
  );
}
