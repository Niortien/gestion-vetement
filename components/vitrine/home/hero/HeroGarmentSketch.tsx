"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HERO_SKETCHES } from "./heroSketches";
import type { HeroGarment } from "./heroData";

interface HeroGarmentSketchProps {
  garment: HeroGarment;
}

/** Croquis au trait du vêtement : le contour se dessine à chaque changement de rayon. */
export function HeroGarmentSketch({ garment }: HeroGarmentSketchProps) {
  const reduced = useReducedMotion();
  const sketch = HERO_SKETCHES[garment];

  return (
    <motion.svg
      key={garment}
      viewBox="0 0 400 400"
      aria-hidden
      className="h-full w-full overflow-visible"
      initial={reduced ? false : { opacity: 0, scale: 0.88, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <g transform={`translate(0 ${sketch.offsetY ?? 0})`}>
        <motion.path
          d={sketch.fill}
          fill="currentColor"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1, delay: 1.2 }}
        />
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          {sketch.lines.map((line) => (
            <motion.path
              key={line.d}
              d={line.d}
              strokeWidth={line.thin ? 1.5 : 2.6}
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, delay: line.thin ? 0.5 : 0, ease: [0.6, 0.1, 0.2, 1] }}
            />
          ))}
          {sketch.circles?.map((c) => (
            <motion.circle
              key={`${c.cx}-${c.cy}`}
              cx={c.cx}
              cy={c.cy}
              r={c.r}
              strokeWidth={1.5}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            />
          ))}
        </g>
      </g>
    </motion.svg>
  );
}
