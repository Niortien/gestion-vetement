"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-4 px-5">
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

      <div className="mx-auto mt-8 max-w-7xl md:px-5">
        <div className="snap-rail md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-[62vw] max-w-[260px] md:w-auto md:max-w-none">
                  <div className="aspect-[4/5] animate-pulse rounded-xl" style={{ backgroundColor: "var(--v-s2)" }} />
                </div>
              ))
            : produits.map((p, i) => (
                <motion.div
                  key={p.id}
                  className="w-[62vw] max-w-[260px] md:w-auto md:max-w-none"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                  transition={{ delay: Math.min(i, 4) * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProductTile produit={p} />
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
