"use client";

import { useCallback, useEffect, useState } from "react";

interface HeroRotation {
  category: number;
  word: number;
  selectCategory: (index: number) => void;
}

/**
 * Pilote le héros de la vitrine : le rayon et le mot du titre avancent seuls.
 * Rien ne bouge si `paused` est vrai (préférence « réduire les animations »).
 * Un choix manuel de rayon relance le décompte du rayon.
 */
export function useHeroRotation(
  categoryCount: number,
  wordCount: number,
  categoryMs: number,
  wordMs: number,
  paused: boolean,
): HeroRotation {
  const [category, setCategory] = useState(0);
  const [word, setWord] = useState(0);

  // `category` dans les dépendances : un clic remet le minuteur à zéro.
  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => setCategory((c) => (c + 1) % categoryCount), categoryMs);
    return () => window.clearTimeout(id);
  }, [category, paused, categoryCount, categoryMs]);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setWord((w) => (w + 1) % wordCount), wordMs);
    return () => window.clearInterval(id);
  }, [paused, wordCount, wordMs]);

  const selectCategory = useCallback((index: number) => setCategory(index), []);

  return { category, word, selectCategory };
}
