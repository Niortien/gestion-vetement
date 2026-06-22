"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function HomeHero() {
  return (
    <section
      className="relative flex min-h-[100svh] overflow-hidden"
      style={{ backgroundColor: "var(--v-bg)" }}
    >
      {/* Glow lime bas-gauche */}
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(194,255,0,0.12) 0%, transparent 70%)" }}
      />
      {/* Glow purple haut-droite */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(155,127,234,0.15) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto flex w-full max-w-7xl items-center px-5 py-24">
        {/* Contenu gauche */}
        <div className="z-10 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Eyebrow */}
            <span
              className="inline-block rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ borderColor: "var(--v-lime)", color: "var(--v-lime)" }}
            >
              Nouvelle collection 2025
            </span>

            {/* Titre géant */}
            <h1
              className="mt-6 font-[var(--font-display)] font-black leading-[0.9] tracking-tight"
              style={{ color: "var(--v-text)" }}
            >
              <span className="block text-[clamp(60px,10vw,120px)]">LE</span>
              <span
                className="block text-[clamp(60px,10vw,120px)]"
                style={{ color: "var(--v-lime)", WebkitTextStroke: "0px" }}
              >
                STREET
              </span>
              <span className="block text-[clamp(60px,10vw,120px)]">WEAR</span>
              <span
                className="block text-[clamp(30px,5vw,60px)] font-light tracking-[0.25em]"
                style={{ color: "var(--v-muted)" }}
              >
                d&apos;Abidjan.
              </span>
            </h1>

            {/* Tagline */}
            <p
              className="mt-8 max-w-sm text-base leading-relaxed"
              style={{ color: "var(--v-muted)" }}
            >
              Vêtements, accessoires et produits importés. Authentique depuis Yopougon, Abidjan.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/catalogue"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-[var(--font-display)] text-sm font-black uppercase tracking-widest transition-opacity hover:opacity-85"
                style={{ backgroundColor: "var(--v-lime)", color: "#000" }}
              >
                Explorer le catalogue →
              </Link>
              <Link
                href="/lookbook"
                className="inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 font-[var(--font-display)] text-sm font-black uppercase tracking-widest transition-colors hover:border-[var(--v-text)] hover:text-[var(--v-text)]"
                style={{ borderColor: "var(--v-border)", color: "var(--v-muted)" }}
              >
                Lookbook
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Image hero droite — déborde hors du cadre */}
        <motion.div
          className="absolute right-0 top-0 bottom-0 w-[45%] overflow-visible"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <div
            className="relative h-full w-full"
            style={{
              background:
                "linear-gradient(135deg, var(--v-s3) 0%, var(--v-s2) 100%)",
              clipPath: "polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)",
            }}
          >
            {/* Placeholder image — remplacer par une vraie photo produit */}
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="text-8xl opacity-10">👟</div>
                <p className="mt-4 text-xs uppercase tracking-widest" style={{ color: "var(--v-dim)" }}>
                  Photo produit vedette
                </p>
              </div>
            </div>
            {/* Overlay gradient gauche pour fondu */}
            <div
              className="absolute inset-y-0 left-0 w-24"
              style={{ background: "linear-gradient(to right, var(--v-bg), transparent)" }}
            />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--v-dim)" }}>
          Scroll
        </span>
        <motion.div
          className="h-8 w-px"
          style={{ backgroundColor: "var(--v-dim)" }}
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
