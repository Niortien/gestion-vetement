"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useVitrineStore } from "@/stores/vitrineStore";

export function HomeHero() {
  const theme = useVitrineStore((s) => s.theme);
  const isDark = theme === "dark";

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

        {/* Panel droit — couverture éditorial */}
        <motion.div
          className="absolute right-0 top-0 bottom-0 w-[45%] overflow-hidden"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <div
            className="relative h-full w-full overflow-hidden"
            style={{ clipPath: "polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
          >
            {/* Fond dégradé atmosphérique */}
            <div
              className="absolute inset-0"
              style={{
                background: isDark
                  ? `radial-gradient(ellipse at 22% 80%, rgba(255,148,32,0.5) 0%, transparent 52%),
                     radial-gradient(ellipse at 78% 18%, rgba(194,255,0,0.18) 0%, transparent 46%),
                     radial-gradient(ellipse at 55% 50%, rgba(155,127,234,0.2) 0%, transparent 42%),
                     linear-gradient(155deg, #1E1508 0%, #2A1C0C 38%, #130F08 100%)`
                  : `radial-gradient(ellipse at 22% 80%, rgba(210,120,20,0.3) 0%, transparent 52%),
                     radial-gradient(ellipse at 78% 18%, rgba(107,145,0,0.18) 0%, transparent 46%),
                     radial-gradient(ellipse at 55% 50%, rgba(94,63,179,0.1) 0%, transparent 42%),
                     linear-gradient(155deg, #F2E4CC 0%, #EDD9B8 38%, #E4CCA0 100%)`,
              }}
            />

            {/* Trame textile diagonale */}
            <div
              className="absolute inset-0"
              style={{
                opacity: isDark ? 0.07 : 0.1,
                backgroundImage: `repeating-linear-gradient(
                  -45deg,
                  ${isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)"},
                  ${isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)"} 1px,
                  transparent 1px,
                  transparent 26px
                )`,
              }}
            />

            {/* Watermark marque vertical */}
            <div
              className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none"
              aria-hidden
            >
              <span
                className="font-[var(--font-display)] font-black leading-none"
                style={{
                  fontSize: "clamp(56px,9vw,140px)",
                  color: isDark ? "rgba(255,255,255,0.028)" : "rgba(0,0,0,0.05)",
                  writingMode: "vertical-rl",
                  letterSpacing: "0.14em",
                  transform: "rotate(180deg)",
                }}
              >
                DRI VALÉ
              </span>
            </div>

            {/* Composition centrale */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-7 px-8">
              {/* SVG cintre mode */}
              <svg viewBox="0 0 120 100" className="w-28 h-24" fill="none" aria-hidden>
                <path
                  d="M60 18 C60 18 60 30 72 38 L108 62 A6 6 0 0 1 108 74 H12 A6 6 0 0 1 12 62 L48 38 C60 30 60 18 60 18 Z"
                  stroke="var(--v-lime)"
                  strokeWidth="2"
                  fill="var(--v-lime-dim)"
                />
                <circle cx="60" cy="14" r="5" stroke="var(--v-lime)" strokeWidth="2" />
                <line x1="60" y1="9" x2="60" y2="1" stroke="var(--v-lime)" strokeWidth="2" />
                <path d="M60 1 Q65 -4 70 1" stroke="var(--v-lime)" strokeWidth="2" fill="none" />
              </svg>

              {/* Badge + localisation */}
              <div className="flex flex-col items-center gap-3">
                <div
                  className="rounded-full border px-5 py-1.5"
                  style={{
                    borderColor: "var(--v-lime)",
                    backgroundColor: "var(--v-lime-dim)",
                  }}
                >
                  <span
                    className="font-[var(--font-display)] text-[10px] font-bold uppercase tracking-[0.35em]"
                    style={{ color: "var(--v-lime)" }}
                  >
                    Nouvelle Arrivée
                  </span>
                </div>
                <p
                  className="text-[9px] font-semibold uppercase tracking-[0.3em]"
                  style={{ color: "var(--v-dim)" }}
                >
                  Yopougon · Abidjan
                </p>
              </div>

              {/* Trois points produit */}
              <div className="flex flex-col gap-2 self-start pl-4">
                {["Vêtements importés USA", "Maroquinerie & Parfumerie", "Livraison partout en CI"].map((label) => (
                  <div key={label} className="flex items-center gap-2">
                    <div
                      className="h-1 w-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "var(--v-lime)" }}
                    />
                    <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--v-muted)" }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Barre accent bas */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px]"
              style={{
                background: "linear-gradient(to right, transparent, var(--v-lime), transparent)",
                opacity: 0.6,
              }}
            />

            {/* Fondu gauche vers le fond */}
            <div
              className="absolute inset-y-0 left-0 w-28"
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
