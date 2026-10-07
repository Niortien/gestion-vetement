"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface HeroRotatingWordProps {
  words: readonly string[];
  index: number;
}

/** Mot en italique serif qui glisse verticalement ; le plus long mot réserve la largeur. */
export function HeroRotatingWord({ words, index }: HeroRotatingWordProps) {
  const reduced = useReducedMotion();
  const word = words[index] ?? words[0];

  return (
    <span className="relative inline-block overflow-hidden align-bottom" style={{ height: "1.1em" }}>
      <span aria-hidden className="invisible block whitespace-nowrap">
        {words.reduce((a, b) => (b.length > a.length ? b : a), "")}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={word}
          className="absolute inset-x-0 top-0 block whitespace-nowrap"
          initial={reduced ? false : { y: "70%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: "-70%", opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
