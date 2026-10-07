"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useHeroRotation } from "@/hooks/useHeroRotation";
import { getWhatsappUrl } from "@/lib/whatsapp";
import { HeroCategoryChips } from "./hero/HeroCategoryChips";
import { HeroRotatingWord } from "./hero/HeroRotatingWord";
import { HeroStage } from "./hero/HeroStage";
import { HeroTicker } from "./hero/HeroTicker";
import { HeroLookbookBadge } from "./hero/HeroLookbookBadge";
import { IconArrowDown, IconArrowRight } from "./hero/HeroIcons";
import {
  HERO_CATEGORIES,
  HERO_CATEGORY_INTERVAL_MS,
  HERO_WORDS,
  HERO_WORD_INTERVAL_MS,
} from "./hero/heroData";

const waUrl = getWhatsappUrl("Bonjour Dri Valé, je veux voir vos nouveautés");
const EASE = [0.2, 0.8, 0.2, 1] as const;

/**
 * Héros d'accueil animé : titre affiche avec mot qui tourne, rayons cliquables et carte photo
 * (photos par rayon), bandeau doré en pied. Fond sombre teinté, indépendant du thème de la vitrine
 * (la barre flottante est déjà sombre). Les animations s'arrêtent avec « réduire les animations ».
 */
export function HomeHero() {
  const reduced = useReducedMotion();
  const { category, word, selectCategory } = useHeroRotation(
    HERO_CATEGORIES.length,
    HERO_WORDS.length,
    HERO_CATEGORY_INTERVAL_MS,
    HERO_WORD_INTERVAL_MS,
    reduced,
  );

  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: EASE },
  });
  const line = (delay: number) => ({
    initial: reduced ? false : { y: "105%" },
    animate: { y: 0 },
    transition: { duration: 0.95, delay, ease: EASE },
  });

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate -mt-20 overflow-hidden"
      style={{ backgroundColor: "#121014", color: "#F5F5F4" }}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 55% at 85% 20%, rgba(240,180,41,0.18), transparent 70%), radial-gradient(50% 50% at 5% 95%, rgba(167,139,250,0.14), transparent 70%), linear-gradient(160deg, #1A1620 0%, #121014 55%, #0F1114 100%)",
        }}
      />

      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-12 px-5 pb-12 pt-28 md:min-h-[calc(100svh-52px)] md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:px-14 md:pb-10">
        <div className="flex flex-col items-start">
          <motion.p
            {...rise(0.05)}
            className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.24em]"
            style={{ color: "#D4D4D8" }}
          >
            <span aria-hidden className="relative inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "#F0B429" }}>
              <span className="live-ping absolute inset-0 rounded-full" style={{ backgroundColor: "#F0B429" }} />
            </span>
            Yop City · En rayon maintenant
          </motion.p>

          <h1
            id="hero-title"
            aria-label="Sois le plus stylé de Yop"
            className="mt-5 uppercase"
            style={{
              fontFamily: "var(--font-hero-poster), sans-serif",
              fontWeight: 400,
              fontSize: "clamp(56px, 8.6vw, 128px)",
              lineHeight: 0.92,
              letterSpacing: "0.005em",
            }}
          >
            <span aria-hidden className="block overflow-hidden pb-[0.05em]">
              <motion.span className="block" {...line(0.05)}>Sois le plus</motion.span>
            </span>
            <span aria-hidden className="block overflow-hidden pb-[0.05em]">
              <motion.span
                className="block normal-case"
                style={{
                  fontFamily: "var(--font-hero-accent), serif",
                  fontStyle: "italic",
                  fontSize: "1.12em",
                  letterSpacing: "-0.01em",
                  color: "#F0B429",
                }}
                {...line(0.17)}
              >
                <HeroRotatingWord words={HERO_WORDS} index={word} />
              </motion.span>
            </span>
            <span aria-hidden className="block overflow-hidden pb-[0.05em]">
              <motion.span className="block" {...line(0.29)}>de Yop.</motion.span>
            </span>
          </h1>

          <motion.p {...rise(0.5)} className="mt-6 max-w-[470px] text-[17px] leading-relaxed" style={{ color: "#D4D4D8" }}>
            Vêtements, sneakers et accessoires importés, en rayon à Yopougon. Tu choisis ton look, tu paies par Wave,
            Orange Money, MTN Money ou cash.
          </motion.p>

          <motion.div {...rise(0.62)} className="mt-7 flex w-full flex-wrap gap-3.5">
            <Button
              as={Link}
              href="/catalogue"
              radius="full"
              className="h-[54px] w-full gap-2.5 px-7 text-[15px] font-bold uppercase tracking-[0.08em] sm:w-auto"
              style={{ backgroundColor: "#F0B429", color: "#0C0C0E" }}
              endContent={<IconArrowRight size={18} />}
            >
              Voir le catalogue
            </Button>
            <Button
              as="a"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              radius="full"
              variant="bordered"
              className="h-[54px] w-full gap-2.5 px-6 text-[15px] font-semibold sm:w-auto"
              style={{ borderColor: "rgba(255,255,255,0.28)", color: "#F5F5F4" }}
            >
              Commander sur WhatsApp
              <span className="text-xs font-medium" style={{ color: "#A8A8AE" }}>· réponse en 30 min</span>
            </Button>
          </motion.div>

          <motion.div {...rise(0.74)} className="mt-10 w-full">
            <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "#A8A8AE" }}>
              Explore par rayon
            </p>
            <div className="mt-3">
              <HeroCategoryChips
                categories={HERO_CATEGORIES}
                active={category}
                intervalMs={HERO_CATEGORY_INTERVAL_MS}
                onSelect={selectCategory}
              />
            </div>
          </motion.div>

          <motion.p
            {...rise(0.9)}
            aria-hidden
            className="mt-7 hidden items-center gap-2.5 text-[13px] md:flex"
            style={{ color: "#A8A8AE" }}
          >
            <span className="inline-block" style={{ color: "#F0B429" }}>
              <IconArrowDown size={18} />
            </span>
            Défile, y a du nouveau en rayon
          </motion.p>
        </div>

        <motion.div {...rise(0.29)} className="relative mx-auto w-full max-w-[420px] md:max-w-[500px] md:justify-self-center">
          <HeroStage categories={HERO_CATEGORIES} index={category} />
          <HeroLookbookBadge />
        </motion.div>
      </div>

      <HeroTicker />
    </section>
  );
}
