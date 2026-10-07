"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { IconArrowUpRight } from "./HeroIcons";
import { HeroGarmentSketch } from "./HeroGarmentSketch";
import type { HeroCategory } from "./heroData";

interface HeroStageProps {
  category: HeroCategory;
  index: number;
  total: number;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Carte d'affiche : mot géant en contour qui défile, croquis du rayon, légende vitrée vers le catalogue. */
export function HeroStage({ category, index, total }: HeroStageProps) {
  const run = `${category.label} · `.repeat(6);

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] border" style={{ backgroundColor: "#1A1A1F", borderColor: "rgba(255,255,255,0.12)" }}>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 whitespace-nowrap">
        <span
          className="vitrine-marquee-track inline-block uppercase leading-none"
          style={{
            fontFamily: "var(--font-hero-poster), sans-serif",
            fontSize: 210,
            color: "transparent",
            WebkitTextStroke: "1px rgba(255,255,255,0.16)",
          }}
        >
          {run}
          {run}
        </span>
      </div>

      <div className="absolute left-6 top-5 z-10 flex items-baseline gap-2">
        <span className="text-3xl" style={{ fontFamily: "var(--font-hero-poster), sans-serif", color: "#F0B429" }}>
          {pad(index + 1)}
        </span>
        <span className="text-xs font-semibold tracking-[0.18em]" style={{ color: "#A8A8AE" }}>
          / {pad(total)}
        </span>
      </div>

      <div className="float-slow absolute inset-x-[9%] bottom-[23%] top-[9%]" style={{ color: "#F0B429" }}>
        <HeroGarmentSketch garment={category.garment} />
      </div>

      <div
        className="absolute inset-x-[18px] bottom-[18px] z-10 flex items-center justify-between gap-3 rounded-2xl border py-3.5 pl-5 pr-3.5 backdrop-blur-md"
        style={{ backgroundColor: "rgba(12,12,14,0.74)", borderColor: "rgba(255,255,255,0.12)" }}
      >
        <div className="min-w-0" aria-live="polite">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#A8A8AE" }}>
            Rayon {pad(index + 1)} · {category.label}
          </p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={category.title}
              className="mt-0.5 truncate text-lg font-semibold"
              style={{ color: "#F5F5F4" }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {category.title}
            </motion.p>
          </AnimatePresence>
        </div>
        <Link
          href="/catalogue"
          aria-label={`Voir le rayon ${category.label}`}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: "#F0B429", color: "#0C0C0E" }}
        >
          <IconArrowUpRight size={20} />
        </Link>
      </div>
    </div>
  );
}
