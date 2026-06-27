"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useVitrineProduits } from "@/features/vitrine/query/vitrine-queries";

export function HomeFeaturedDrops() {
  const { data } = useVitrineProduits({ limit: 3 });
  const produits = data?.pages[0]?.data ?? [];

  return (
    <section className="mx-auto max-w-7xl px-5 py-20">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p
            className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em]"
            style={{ color: "var(--v-lime)" }}
          >
            Derniers arrivages
          </p>
          <h2
            className="font-[var(--font-display)] text-3xl font-black uppercase tracking-tight md:text-5xl"
            style={{ color: "var(--v-text)" }}
          >
            Featured Drops
          </h2>
        </div>
        <Link
          href="/catalogue"
          className="hidden text-sm font-semibold uppercase tracking-wider underline-offset-4 hover:underline md:block"
          style={{ color: "var(--v-muted)" }}
        >
          Voir tout →
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {(produits.length > 0 ? produits : Array(3).fill(null)).map((produit, i) => {
          const prix = produit ? parseFloat(produit.prixVente || "0") : 0;
          return (
            <motion.div
              key={produit?.id ?? i}
              className="group relative flex overflow-hidden rounded-2xl border"
              style={{ borderColor: "var(--v-border)", backgroundColor: "var(--v-s2)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover="hovered"
            >
              {/* Image */}
              <div
                className="h-32 w-32 shrink-0 overflow-hidden md:h-40 md:w-44"
                style={{ backgroundColor: "var(--v-s3)" }}
              >
                {produit?.imageUrl ? (
                  <motion.img
                    src={produit.imageUrl}
                    alt={produit.nom}
                    className="h-full w-full object-cover"
                    variants={{ rest: { scale: 1 }, hovered: { scale: 1.08 } }}
                    transition={{ duration: 0.4 }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl opacity-10">👟</div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.25em]"
                    style={{ color: "var(--v-lime)" }}
                  >
                    DROP #{String(i + 1).padStart(2, "0")}
                  </span>
                  {produit ? (
                    <h3
                      className="mt-1 font-[var(--font-display)] text-xl font-black uppercase md:text-2xl"
                      style={{ color: "var(--v-text)" }}
                    >
                      {produit.nom}
                    </h3>
                  ) : (
                    <div className="mt-1 h-6 w-48 animate-pulse rounded" style={{ backgroundColor: "var(--v-s3)" }} />
                  )}
                  {produit?.categorie && (
                    <p className="mt-0.5 text-sm" style={{ color: "var(--v-muted)" }}>
                      {produit.categorie.nom}
                    </p>
                  )}
                </div>

                <div className="flex items-end justify-between">
                  {produit ? (
                    <span
                      className="font-[var(--font-mono)] text-2xl font-black"
                      style={{ color: "var(--v-text)" }}
                    >
                      {prix.toLocaleString("fr-FR")}
                      <span className="ml-1 text-sm font-normal" style={{ color: "var(--v-muted)" }}>
                        FCFA
                      </span>
                    </span>
                  ) : (
                    <div className="h-7 w-32 animate-pulse rounded" style={{ backgroundColor: "var(--v-s3)" }} />
                  )}

                  {produit && (
                    <Link
                      href={`/boutique/${produit.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-black uppercase tracking-wider transition-all group-hover:bg-[var(--v-lime)] group-hover:text-white"
                      style={{ backgroundColor: "var(--v-s3)", color: "var(--v-text)" }}
                    >
                      Voir →
                    </Link>
                  )}
                </div>
              </div>

              {/* Numéro décoratif */}
              <div
                className="absolute right-4 top-1/2 -translate-y-1/2 font-[var(--font-display)] text-[80px] font-black leading-none opacity-5 select-none"
                style={{ color: "var(--v-text)" }}
              >
                {i + 1}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
