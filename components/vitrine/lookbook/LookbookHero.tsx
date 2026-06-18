"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function LookbookHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-end overflow-hidden"
      style={{ backgroundColor: "var(--v-bg)" }}
    >
      {/* Image de fond parallax */}
      <motion.div
        style={{ y }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/lookbook-hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 20%",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(4,8,15,0.2) 0%, rgba(4,8,15,0.85) 100%)",
          }}
        />
      </motion.div>

      {/* Contenu */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 w-full px-5 pb-20 md:px-16"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 text-[10px] font-bold uppercase tracking-[0.5em]"
          style={{ color: "var(--v-lime)" }}
        >
          Saison 2025 — Collection
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-black uppercase leading-none tracking-tighter"
          style={{ fontSize: "clamp(52px,10vw,120px)", color: "var(--v-text)" }}
        >
          DAKAR
          <br />
          <span style={{ color: "var(--v-lime)" }}>NIGHTS</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-6 max-w-sm text-sm leading-relaxed"
          style={{ color: "var(--v-muted)" }}
        >
          Une collection qui capture l&apos;énergie de la ville, la nuit tombée.
          Pièces sélectionnées pour ceux qui vivent à leur propre rythme.
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2"
      >
        <div className="h-10 w-px" style={{ backgroundColor: "var(--v-lime)" }} />
        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--v-lime)" }}>
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
