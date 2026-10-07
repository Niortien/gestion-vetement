export interface HeroCategory {
  label: string;
  image: { src: string; alt: string };
  title: string;
}

/** Rayons présentés dans le héros, dans l'ordre d'affichage. */
export const HERO_CATEGORIES: readonly HeroCategory[] = [
  { label: "T-shirts", image: { src: "https://images.unsplash.com/photo-1623596305214-19f21cbf48ee?auto=format&fit=crop&q=80&w=1000", alt: "Homme en t-shirt blanc et pantalon, dans la rue" }, title: "Le basique qui fait la diff" },
  { label: "Kicks", image: { src: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&q=80&w=1000", alt: "Sneaker blanche sur le bitume devant un mur de graffitis" }, title: "Des kicks qui claquent" },
  { label: "Polos", image: { src: "https://images.unsplash.com/photo-1632287081769-c56e7e2b4bb8?auto=format&fit=crop&q=80&w=1000", alt: "Homme en polo devant un mur" }, title: "Propre du lundi au dimanche" },
  { label: "Cargos", image: { src: "https://images.unsplash.com/photo-1588117260148-b47818741c74?auto=format&fit=crop&q=80&w=1000", alt: "Style streetwear en pantalon ample, assis sur un banc en béton" }, title: "Coupe large, style net" },
  { label: "Accessoires", image: { src: "https://images.unsplash.com/photo-1777447458344-fa848d0a457f?auto=format&fit=crop&q=80&w=1000", alt: "Homme portant une casquette et un t-shirt graphique" }, title: "La touche qui finit le look" },
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
