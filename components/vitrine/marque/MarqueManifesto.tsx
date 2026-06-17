"use client";

import { motion } from "framer-motion";

export function MarqueManifesto() {
  return (
    <section
      className="py-24"
      style={{ backgroundColor: "var(--v-s1)" }}
    >
      <div className="mx-auto max-w-4xl px-5 md:px-16">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 text-[10px] font-bold uppercase tracking-[0.5em]"
          style={{ color: "var(--v-lime)" }}
        >
          Notre manifeste
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-12 space-y-5 text-base leading-relaxed md:text-lg"
          style={{ color: "var(--v-muted)" }}
        >
          <p>
            Riviere, c'est né d'un constat simple : à Dakar, la culture streetwear existe depuis
            longtemps, mais les vraies pièces restaient inaccessibles. On commandait à l'étranger,
            on payait des prix excessifs, on attendait des semaines pour recevoir des faux.
          </p>
          <p>
            On a décidé de changer ça. Apporter des pièces authentiques — sneakers, cuts, layers —
            directement à la communauté qui le mérite. Pas de filtre, pas d'intermédiaire inutile.
            Un rapport direct entre ceux qui portent et ceux qui sélectionnent.
          </p>
          <p>
            Le nom Riviere, c'est le flux. L'idée que la mode se déplace, circule, rejoint
            ceux qui la vivent. Dakar est notre source, notre terrain, notre inspiration première.
          </p>
        </motion.div>

        {/* Citation mise en valeur */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative border-l-4 py-6 pl-8"
          style={{ borderColor: "var(--v-lime)" }}
        >
          <p
            className="font-[var(--font-display)] font-black leading-tight tracking-tight"
            style={{ fontSize: "clamp(22px,4vw,40px)", color: "var(--v-text)" }}
          >
            "Le streetwear est une langue.
            <br />
            Riviere t'apprend à la parler couramment."
          </p>
          <footer className="mt-4 text-sm font-semibold" style={{ color: "var(--v-dim)" }}>
            — Équipe Riviere, Dakar
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}
