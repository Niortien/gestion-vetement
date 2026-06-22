"use client";

import { motion } from "framer-motion";

const WORDS = ["Authentique.", "Exclusif.", "Ivoirien."];

export function HomeBrandStatement() {
  return (
    <section
      className="relative overflow-hidden py-24"
      style={{ backgroundColor: "var(--v-s1)" }}
    >
      {/* Fond texte décoratif */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
        aria-hidden
      >
        <span
          className="font-[var(--font-display)] text-[20vw] font-black uppercase leading-none opacity-[0.03]"
          style={{ color: "var(--v-text)" }}
        >
          DRI VALÉ
        </span>
      </div>

      <div className="relative mx-auto max-w-7xl px-5">
        {/* Tag */}
        <motion.p
          className="mb-8 text-[10px] font-bold uppercase tracking-[0.3em]"
          style={{ color: "var(--v-lime)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Notre philosophie
        </motion.p>

        {/* Mots animés */}
        <div className="flex flex-col">
          {WORDS.map((word, i) => (
            <motion.h2
              key={word}
              className="font-[var(--font-display)] font-black leading-[0.9] tracking-tight"
              style={{
                fontSize: "clamp(48px, 9vw, 110px)",
                color: i === 1 ? "var(--v-lime)" : "var(--v-text)",
                paddingLeft: i === 1 ? "5vw" : i === 2 ? "10vw" : "0",
              }}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.h2>
          ))}
        </div>

        {/* Description */}
        <motion.p
          className="mt-12 max-w-lg text-lg leading-relaxed md:ml-[10vw]"
          style={{ color: "var(--v-muted)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Dri Valé, c&apos;est le reflet d&apos;une génération qui refuse le compromis.
          Des vêtements sélectionnés avec soin, des pièces importées directement des États-Unis,
          une boutique qui fait sens. Mode d&apos;Abidjan, pour toute la Côte d&apos;Ivoire.
        </motion.p>

        {/* Stats */}
        <motion.div
          className="mt-16 grid grid-cols-3 gap-4 border-t pt-12 md:gap-12"
          style={{ borderColor: "var(--v-border)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          {[
            { value: "500+", label: "Clients satisfaits" },
            { value: "100+", label: "Références en stock" },
            { value: "4★+", label: "Note moyenne" },
          ].map((stat) => (
            <div key={stat.label}>
              <p
                className="font-[var(--font-display)] text-3xl font-black md:text-5xl"
                style={{ color: "var(--v-lime)" }}
              >
                {stat.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest" style={{ color: "var(--v-dim)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
