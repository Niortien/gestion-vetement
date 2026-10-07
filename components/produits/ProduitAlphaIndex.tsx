"use client";

import { useMemo } from "react";
import type { Produit } from "@/types";

interface ProduitAlphaIndexProps {
  produits: Produit[];
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/** Index A à Z : les lettres sans produit sont grisées et inertes. */
export function ProduitAlphaIndex({ produits }: ProduitAlphaIndexProps) {
  const activeLetters = useMemo(() => {
    const set = new Set<string>();
    for (const p of produits) {
      const first = p.nom.trim()[0]?.toUpperCase();
      if (first && /[A-Z]/.test(first)) set.add(first);
    }
    return set;
  }, [produits]);

  if (produits.length === 0) return null;

  function jumpTo(letter: string) {
    document.getElementById(`alpha-${letter}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav aria-label="Index alphabétique" className="flex flex-wrap gap-0.5">
      {ALPHABET.map((letter) => {
        const active = activeLetters.has(letter);
        return (
          <button
            key={letter}
            type="button"
            onClick={() => active && jumpTo(letter)}
            disabled={!active}
            aria-label={`Aller à ${letter}`}
            className={`flex h-8 w-[30px] items-center justify-center rounded-lg text-[13px] font-bold ${active ? "cursor-pointer text-text hover:bg-text hover:text-accent" : "cursor-default text-text/25"}`}
          >
            {letter}
          </button>
        );
      })}
    </nav>
  );
}
