"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useVitrineProduits } from "@/features/vitrine/query/vitrine-queries";
import { ProduitCard } from "@/components/vitrine/common/ProduitCard";

export function HomePromoSection() {
  const { data, isLoading } = useVitrineProduits({ enPromo: true, limit: 6 });
  const produits = data?.pages[0]?.data ?? [];

  if (!isLoading && produits.length === 0) return null;

  const count = produits.length;

  return (
    <section
      className="py-20"
      style={{ background: "linear-gradient(160deg, rgba(249,115,22,0.10) 0%, var(--v-s1) 60%)" }}
    >
      <div className="mx-auto max-w-7xl px-5">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p
              className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em]"
              style={{ color: "#f97316" }}
            >
              Ventes Flash
            </p>
            <h2
              className="font-[var(--font-display)] text-3xl font-black uppercase tracking-tight md:text-5xl"
              style={{ color: "var(--v-text)" }}
            >
              Promotions
            </h2>
            {!isLoading && (
              <p className="mt-1 text-sm" style={{ color: "var(--v-muted)" }}>
                {count} article{count > 1 ? "s" : ""} en promotion
              </p>
            )}
          </div>
          <Link
            href="/catalogue"
            className="shrink-0 text-sm font-semibold underline-offset-4 hover:underline"
            style={{ color: "#f97316" }}
          >
            Voir tout →
          </Link>
        </div>

        {/* Skeleton */}
        {isLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
            {Array(3).fill(null).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] w-[200px] shrink-0 animate-pulse rounded-2xl md:w-auto"
                style={{ backgroundColor: "var(--v-s2)" }}
              />
            ))}
          </div>
        ) : (
          /* Carousel mobile / grille desktop */
          <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
            {produits.map((produit, i) => (
              <motion.div
                key={produit.id}
                className="w-[200px] shrink-0 snap-start md:w-auto md:shrink"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
              >
                <ProduitCard produit={produit} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
