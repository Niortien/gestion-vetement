"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/** Manifeste : la boutique en grand, sans chiffres. La photo est la preuve, le texte est court. */
export function HomeBrandStatement() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:gap-16 md:py-24">
      <motion.div
        className="relative aspect-[4/5] overflow-hidden rounded-2xl md:order-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ backgroundColor: "var(--v-s2)" }}
      >
        <Image
          src="/images/dri_style/boutique-interieur-1.jpg"
          alt="L'intérieur de la boutique Dri Valé à Yopougon"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </motion.div>

      <div>
        <h2 className="poster text-[clamp(48px,9vw,120px)]" style={{ color: "var(--v-text)" }}>
          Classé.
          <br />
          <span style={{ color: "var(--v-gold-text)" }}>Stylé.</span>
          <br />
          De Yop.
        </h2>
        <p className="mt-6 max-w-md text-base leading-relaxed" style={{ color: "var(--v-muted)" }}>
          Dri Valé, c&rsquo;est Yopougon qui s&rsquo;habille bien. Des fringues importées, sélectionnées pour les vrais :
          t-shirts, kicks, polos, cargos. Tout ce qu&rsquo;il faut pour être le plus classé de la commune.
        </p>
      </div>
    </section>
  );
}
