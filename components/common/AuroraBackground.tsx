"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/*
 * Fond « aurore » — adapté du composant « Aurora Hero bg » (21st.dev, @dhileepkumargm).
 * Adaptations : fumée noir et blanc du logo Dri Valé, vignette sur le token `--color-base` au lieu du
 * noir, couche `difference` retirée (illisible en thème clair), animation figée sous `prefers-reduced-motion`.
 */
const AURORA =
  "repeating-linear-gradient(100deg, #FFFFFF 10%, #7C7C83 15%, #2A2A2F 20%, #FFFFFF 25%, #7C7C83 30%)";

interface AuroraBackgroundProps {
  className?: string;
  /** Opacité des bandes (0–1). Plus bas en thème clair pour garder le texte lisible. */
  intensity?: number;
  /** Couleur de fond vers laquelle les bords se fondent (défaut : fond du back-office ; vitrine : `var(--v-bg)`). */
  fadeTo?: string;
}

export function AuroraBackground({ className, intensity = 0.28, fadeTo = "var(--color-base)" }: AuroraBackgroundProps) {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      <motion.div
        className="absolute inset-[-100%]"
        style={{ background: AURORA, backgroundSize: "300% 100%", filter: "blur(80px)", opacity: intensity }}
        animate={reduced ? undefined : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-[-100%]"
        style={{
          background: AURORA,
          backgroundSize: "200% 100%",
          filter: "blur(60px)",
          opacity: intensity * 0.6,
          mixBlendMode: "soft-light",
        }}
        animate={reduced ? undefined : { backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      {/* Fondu vers le fond de page pour que le texte reste lisible au centre. */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, transparent 20%, ${fadeTo} 85%)` }} />
    </div>
  );
}
