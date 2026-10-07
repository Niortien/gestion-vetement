"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { Icon } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motionDurations, motionEasing } from "@/lib/motionVariants";
import { TONE_CLASS, type Tone } from "@/components/common/tone";

interface StatTileProps {
  tone?: Tone;
  /** Conservé pour compatibilité : l'indicateur de l'atelier n'affiche plus de pastille d'icône. */
  icon?: Icon;
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  /** Décalage d'apparition (s) pour une cascade courte entre tuiles. */
  delay?: number;
  /** Carte d'encre : l'indicateur principal de l'écran. */
  ink?: boolean;
  className?: string;
}

/** Indicateur : libellé, grande valeur Bricolage, sous-texte. Une seule carte d'encre par écran. */
export function StatTile({ tone = "accent", label, value, hint, delay = 0, ink = false, className }: StatTileProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionDurations.slow, ease: motionEasing.outExpo, delay }}
      className={cn(
        TONE_CLASS[tone],
        "flex min-w-0 flex-col gap-1.5 rounded-[22px] p-5",
        ink ? "bg-[#0C0C0E] text-white" : "bg-surface text-text shadow-[0_0_0_1px_var(--color-border)]",
        className
      )}
    >
      <p className={cn("truncate text-sm font-semibold", ink ? "text-[#C9C9CE]" : "text-text-muted")}>{label}</p>
      <p className="truncate font-display text-[30px] font-bold leading-[1.05] tracking-[-0.02em] tabular-nums">{value}</p>
      {hint && <p className={cn("truncate text-[13px] font-semibold", ink ? "text-[#F0B429]" : "text-text-muted")}>{hint}</p>}
    </motion.div>
  );
}
