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
            Dri Valé, c&apos;est né d&apos;un constat simple : à Yopougon, trouver des vêtements de
            qualité à prix juste relevait du parcours du combattant. On importait de loin, on payait
            des intermédiaires, on recevait des produits qui ne ressemblaient pas aux photos.
          </p>
          <p>
            On a décidé de changer ça. Apporter directement des pièces authentiques — ensembles,
            abayas, casquettes, maroquinerie, parfumerie — importées des États-Unis et soigneusement
            sélectionnées. Un rapport direct entre la boutique et ceux qui portent.
          </p>
          <p>
            Dri Valé, c&apos;est Yopougon. Notre quartier, notre terrain, notre inspiration première.
            On livre à Abidjan et partout en Côte d&apos;Ivoire — et même à l&apos;étranger.
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
            &quot;La mode est un langage.
            <br />
            Dri Valé te donne les mots.&quot;
          </p>
          <footer className="mt-4 text-sm font-semibold" style={{ color: "var(--v-dim)" }}>
            — Dri Valé Boutique, Yopougon Abidjan
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}
