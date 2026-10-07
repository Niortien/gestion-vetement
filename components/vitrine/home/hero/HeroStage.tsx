"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { IconArrowUpRight } from "./HeroIcons";
import type { HeroCategory } from "./heroData";

interface HeroStageProps {
  categories: readonly HeroCategory[];
  index: number;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Carte photo : une image par rayon en fondu enchaîné, compteur, légende vitrée vers le catalogue. */
export function HeroStage({ categories, index }: HeroStageProps) {
  const reduced = useReducedMotion();
  const category = categories[index];

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] border" style={{ backgroundColor: "#1A1A1F", borderColor: "rgba(255,255,255,0.12)" }}>
      {categories.map((c, i) => {
        const on = i === index;
        return (
          <motion.div
            key={c.label}
            aria-hidden={!on}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: on ? 1 : 0, scale: on && !reduced ? 1.06 : 1 }}
            transition={{
              opacity: { duration: reduced ? 0 : 0.8 },
              scale: { duration: reduced ? 0 : on ? 6 : 0.8, ease: "easeOut" },
            }}
          >
            <Image
              src={c.image.src}
              alt={on ? c.image.alt : ""}
              fill
              priority={i === 0}
              sizes="(min-width: 768px) 500px, 90vw"
              className="object-cover"
            />
          </motion.div>
        );
      })}

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(12,12,14,0.85) 0%, rgba(12,12,14,0.15) 42%, rgba(12,12,14,0) 62%), linear-gradient(to bottom, rgba(12,12,14,0.45) 0%, rgba(12,12,14,0) 22%)",
        }}
      />

      <div className="absolute left-6 top-5 z-10 flex items-baseline gap-2">
        <span className="text-3xl" style={{ fontFamily: "var(--font-hero-poster), sans-serif", color: "#F0B429" }}>
          {pad(index + 1)}
        </span>
        <span className="text-xs font-semibold tracking-[0.18em]" style={{ color: "#F5F5F4" }}>
          / {pad(categories.length)}
        </span>
      </div>

      <div
        className="absolute inset-x-[18px] bottom-[18px] z-10 flex items-center justify-between gap-3 rounded-2xl border py-3.5 pl-5 pr-3.5 backdrop-blur-md"
        style={{ backgroundColor: "rgba(12,12,14,0.66)", borderColor: "rgba(255,255,255,0.14)" }}
      >
        <div className="min-w-0" aria-live="polite">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#C4C4CA" }}>
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
