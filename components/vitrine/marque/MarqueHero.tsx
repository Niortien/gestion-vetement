"use client";

import { motion } from "framer-motion";

const WORDS = [
  { text: "RIVIERE", size: "clamp(64px,12vw,140px)", accent: false },
  { text: "EST LE", size: "clamp(28px,5vw,56px)", accent: false },
  { text: "STREET-", size: "clamp(52px,10vw,120px)", accent: true },
  { text: "WEAR", size: "clamp(52px,10vw,120px)", accent: false },
  { text: "DE DEMAIN", size: "clamp(24px,4vw,48px)", accent: false },
];

export function MarqueHero() {
  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden px-5 py-24 md:px-16"
      style={{ backgroundColor: "var(--v-bg)" }}
    >
      {/* Fond décoratif */}
      <div
        className="absolute right-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/3 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: "var(--v-lime)" }}
      />

      {/* Lignes typographiques alternées */}
      <div>
        {WORDS.map((word, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1
              className="block font-black leading-none tracking-tighter"
              style={{
                fontSize: word.size,
                color: word.accent ? "var(--v-lime)" : "var(--v-text)",
                marginLeft: i % 2 === 1 ? "clamp(20px,6vw,120px)" : 0,
              }}
            >
              {word.text}
            </h1>
          </motion.div>
        ))}
      </div>

      {/* Numéro décoratif */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-10 right-10 font-[var(--font-mono)] font-black text-[200px] leading-none select-none"
        style={{ color: "var(--v-s2)", userSelect: "none" }}
        aria-hidden
      >
        R
      </motion.p>
    </section>
  );
}
