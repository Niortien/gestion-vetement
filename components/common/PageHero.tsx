"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { Icon } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motionDurations, motionEasing } from "@/lib/motionVariants";
import type { Tone } from "@/components/common/tone";

interface PageHeroProps {
  /** Conservés pour compatibilité : l'en-tête de l'atelier ne se teinte plus par page. */
  tone?: Tone;
  icon?: Icon;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Actions principales (un seul bouton or par écran). */
  actions?: ReactNode;
  /** Rangée d'indicateurs ou contenu libre sous le titre. */
  children?: ReactNode;
  className?: string;
}

/** En-tête de page de l'atelier : titre, phrase d'aide, actions à droite. Sur papier, sans carte ni halo. */
export function PageHero({ eyebrow, title, description, actions, children, className }: PageHeroProps) {
  const reduced = useReducedMotion();

  return (
    <motion.header
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionDurations.slow, ease: motionEasing.outExpo }}
      className={cn("flex flex-col gap-5", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && <p className="mb-1 text-[13px] font-bold text-text-muted">{eyebrow}</p>}
          <h1 className="font-display text-[34px] font-bold leading-[1.05] tracking-[-0.022em] text-text md:text-[40px]">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-muted">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div>}
      </div>

      {children}
    </motion.header>
  );
}
