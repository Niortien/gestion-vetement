"use client";

import { motion } from "framer-motion";

const WORDS = [
  { text: "Classé.", gold: false },
  { text: "Stylé.", gold: true },
  { text: "De Yop.", gold: false },
];

const STATS = [
  { value: "200+", label: "Clients à Yop" },
  { value: "100+", label: "Références" },
  { value: "4.9★", label: "Note client" },
];

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
          className="font-[var(--font-display)] font-black uppercase leading-none"
          style={{ fontSize: "25vw", color: "rgba(240,180,41,0.04)" }}
        >
          YOP
        </span>
      </div>

      {/* Gold glow */}
      <div
        className="pointer-events-none absolute -top-32 left-1/4 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(240,180,41,0.06)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5">

        <motion.p
          className="mb-10 text-[10px] font-black uppercase tracking-[0.35em]"
          style={{ color: "var(--v-gold)" }}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          Qui on est
        </motion.p>

        {/* ── Split : mots (gauche) / contenu (droite) ── */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16 md:items-center">

          {/* GAUCHE — mots typographiques */}
          <div className="flex flex-col">
            {WORDS.map((word, i) => (
              <motion.h2
                key={word.text}
                className="font-[var(--font-display)] font-black leading-[0.88] tracking-tight"
                style={{
                  fontSize: "clamp(52px, 10vw, 116px)",
                  color: word.gold ? "var(--v-gold)" : "var(--v-text)",
                }}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.14, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                {word.text}
              </motion.h2>
            ))}
          </div>

          {/* DROITE — description, slogan, citation */}
          <div>
            <motion.p
              className="text-lg leading-relaxed"
              style={{ color: "var(--v-muted)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Dri Valé, c&rsquo;est Yopougon qui s&rsquo;habille bien. Des fringues importées, sélectionnées pour les vrais.
              T-shirts, kicks, polos, cargos &mdash; tout ce qu&rsquo;il faut pour être le plus classé de la commune.
              On ne fait pas dans le générique.
            </motion.p>

            <motion.div
              className="mt-8 flex items-center gap-3"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <span style={{ color: "var(--v-gold)", fontSize: 22 }}>★</span>
              <p
                className="font-[var(--font-display)] text-lg font-black uppercase tracking-[0.15em]"
                style={{ color: "var(--v-gold)" }}
              >
                Sortez toujours bien habillé
              </p>
              <span style={{ color: "var(--v-gold)", fontSize: 22 }}>★</span>
            </motion.div>

            <motion.blockquote
              className="mt-6 inline-block rounded-xl border-l-4 pl-5 font-[var(--font-display)] text-base italic"
              style={{ borderColor: "var(--v-gold)", color: "var(--v-muted)" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              &ldquo;On est là, frère. Yop City represent.&rdquo;
            </motion.blockquote>
          </div>
        </div>

        {/* Stats — bande pleine largeur en bas */}
        <motion.div
          className="mt-16 grid grid-cols-3 gap-4 border-t pt-12"
          style={{ borderColor: "var(--v-border)" }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 + i * 0.08 }}
            >
              <p
                className="font-[var(--font-display)] font-black leading-none"
                style={{ fontSize: "clamp(28px,4vw,52px)", color: "var(--v-gold)" }}
              >
                {stat.value}
              </p>
              <p className="mt-2 text-xs uppercase tracking-widest" style={{ color: "var(--v-dim)" }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
