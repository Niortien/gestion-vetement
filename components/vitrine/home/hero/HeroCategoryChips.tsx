"use client";

import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { HeroCategory } from "./heroData";

interface HeroCategoryChipsProps {
  categories: readonly HeroCategory[];
  active: number;
  intervalMs: number;
  onSelect: (index: number) => void;
}

/** Pastilles de rayons ; la pastille active se remplit pendant le temps avant le rayon suivant. */
export function HeroCategoryChips({ categories, active, intervalMs, onSelect }: HeroCategoryChipsProps) {
  const reduced = useReducedMotion();

  return (
    <div role="group" aria-label="Rayons de la boutique" className="flex flex-wrap gap-2.5">
      {categories.map((c, i) => {
        const on = i === active;
        return (
          <Button
            key={c.label}
            type="button"
            radius="full"
            variant="bordered"
            aria-pressed={on}
            onPress={() => onSelect(i)}
            className="relative h-11 min-w-0 overflow-hidden px-5 text-sm font-semibold"
            style={{
              backgroundColor: on ? "#F5F5F4" : "transparent",
              color: on ? "#0C0C0E" : "#F5F5F4",
              borderColor: on ? "#F5F5F4" : "rgba(255,255,255,0.22)",
            }}
          >
            {on && !reduced && (
              <motion.span
                key={`${active}-prog`}
                aria-hidden
                className="absolute inset-0 origin-left"
                style={{ backgroundColor: "#F0B429", opacity: 0.45 }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: intervalMs / 1000, ease: "linear" }}
              />
            )}
            <span className="relative">{c.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
