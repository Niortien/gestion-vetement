"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useVitrineProduits } from "@/features/vitrine/query/vitrine-queries";
import { ProductTile } from "@/components/vitrine/common/ProductTile";
import { IconArrow } from "@/components/vitrine/common/VitrineIcons";

/** Dernières pièces arrivées : rail à aimantation sur mobile, grille sur grand écran. */
export function HomeNewArrivals() {
  const { data, isLoading } = useVitrineProduits({ limit: 8 });
  const produits = data?.pages[0]?.data ?? [];

  if (!isLoading && produits.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-4 px-5">
        <h2 className="tag-title text-[clamp(30px,6vw,56px)]" style={{ color: "var(--v-text)" }}>
          Dernières pièces arrivées
        </h2>
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
            : produits.slice(0, 8).map((p, i) => (
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
