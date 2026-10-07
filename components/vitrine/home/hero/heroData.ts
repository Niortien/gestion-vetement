export type HeroGarment = "tee" | "kicks" | "polo" | "cargo" | "accessory";

export interface HeroCategory {
  label: string;
  garment: HeroGarment;
  title: string;
}

/** Rayons présentés dans le héros, dans l'ordre d'affichage. */
export const HERO_CATEGORIES: readonly HeroCategory[] = [
  { label: "T-shirts", garment: "tee", title: "Le basique qui fait la diff" },
  { label: "Kicks", garment: "kicks", title: "Des kicks qui claquent" },
  { label: "Polos", garment: "polo", title: "Propre du lundi au dimanche" },
  { label: "Cargos", garment: "cargo", title: "Coupe large, style net" },
  { label: "Accessoires", garment: "accessory", title: "La touche qui finit le look" },
];

/** Mots qui alternent dans « Sois le plus ___ de Yop. » */
export const HERO_WORDS: readonly string[] = ["stylé", "classé", "frais", "propre"];

export const HERO_TICKER_ITEMS: readonly string[] = [
  "Sortez toujours bien habillé",
  "Wave · Orange Money · MTN Money · Cash",
  "Commande WhatsApp · réponse en 30 min",
  "Vêtements importés",
  "Yop City. On est là",
];

export const HERO_CATEGORY_INTERVAL_MS = 4000;
export const HERO_WORD_INTERVAL_MS = 2400;
