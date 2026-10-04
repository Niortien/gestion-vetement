import { heureLabel, modeDominant } from "./ventes";
import type {
  Conseil,
  FenetreHoraire,
  Indicateurs,
  JourStat,
  ProduitStat,
  StockAlerteLite,
  VenteLite,
} from "./types";

/** En dessous de ce nombre de ventes, les conseils par jour et par heure seraient du bruit statistique. */
export const VENTES_MIN_CONSEILS = 30;

const ORDRE = { attention: 0, opportunite: 1, info: 2 } as const;

const pct = (part: number): string => `${Math.round(part * 100)} %`;
const fcfa = (n: number): string => `${Math.round(n).toLocaleString("fr-FR")} FCFA`;

const MODES: Record<string, string> = {
  CASH: "le cash",
  WAVE: "Wave",
  ORANGE_MONEY: "Orange Money",
  CARTE: "la carte",
  MTN_MONEY: "MTN Money",
};

export interface EntreesConseils {
  ventes: VenteLite[];
  indicateurs: Indicateurs;
  jours: JourStat[];
  produits: ProduitStat[];
  pareto80: number;
  pic: FenetreHoraire | null;
  creux: FenetreHoraire | null;
  alertes: StockAlerteLite[];
  /** Durée de la période analysée, en jours. */
  periodeJours: number;
}

/**
 * Règles de conseil : chacune part d'un chiffre mesuré sur la période, l'affiche dans le texte, puis propose un geste.
 * Aucune règle ne se déclenche sans seuil franchi, et rien n'est conseillé sous VENTES_MIN_CONSEILS ventes.
 */
export function conseiller(e: EntreesConseils): Conseil[] {
  const conseils: Conseil[] = [];
  const assezDeVentes = e.indicateurs.ventes >= VENTES_MIN_CONSEILS;

  if (!assezDeVentes) {
    conseils.push({
      id: "echantillon",
      niveau: "info",
      titre: "Pas encore assez de ventes pour conclure",
      texte: `${e.indicateurs.ventes} vente${e.indicateurs.ventes > 1 ? "s" : ""} sur la période : il en faut au moins ${VENTES_MIN_CONSEILS} pour que les jours et les heures veuillent dire quelque chose.`,
      action: "Choisissez une période plus longue (30 ou 90 jours) ou revenez quand il y aura plus de ventes.",
    });
  }

  // 1. Jour fort / jour faible
  if (assezDeVentes) {
    const avecVentes = e.jours.filter((j) => j.ventes > 0);
    const fort = [...avecVentes].sort((a, b) => b.ca - a.ca)[0];
    if (fort && fort.part >= 1.3 / 7) {
      conseils.push({
        id: "jour-fort",
        niveau: "opportunite",
        titre: `${fort.label} est votre meilleur jour`,
        texte: `Le ${fort.label.toLowerCase()} réalise ${pct(fort.part)} du chiffre d'affaires (${fort.ventes} ventes, panier moyen ${fcfa(fort.panierMoyen)}).`,
        action: `Renforcez la caisse ce jour-là, vérifiez le stock de vos produits phares la veille et annoncez vos nouveautés le jour d'avant.`,
      });
    }
    const faible = [...avecVentes].sort((a, b) => a.ca - b.ca)[0];
    if (faible && faible !== fort && e.periodeJours >= 14 && faible.part <= 0.5 / 7) {
      conseils.push({
        id: "jour-faible",
        niveau: "opportunite",
        titre: `${faible.label} est le jour le plus calme`,
        texte: `Le ${faible.label.toLowerCase()} ne pèse que ${pct(faible.part)} du chiffre d'affaires (${faible.ventes} ventes).`,
        action: "Testez une promotion ou une publication WhatsApp ce jour-là, ou gardez-le pour le réassort et le rangement.",
      });
    }
  }

  // 2. Pic et creux horaires
  if (assezDeVentes && e.pic && e.pic.part >= 0.25) {
    conseils.push({
      id: "pic-horaire",
      niveau: "opportunite",
      titre: `Pic d'affluence de ${heureLabel(e.pic.debut)} à ${heureLabel(e.pic.fin)}`,
      texte: `${pct(e.pic.part)} des ventes se font sur ces ${e.pic.fin - e.pic.debut} heures.`,
      action: "Soyez au moins deux à la caisse sur ce créneau et évitez d'y faire du rangement ou du réassort.",
    });
  }
  if (assezDeVentes && e.creux) {
    conseils.push({
      id: "creux-horaire",
      niveau: "opportunite",
      titre: `Creux de ${heureLabel(e.creux.debut)} à ${heureLabel(e.creux.fin)}`,
      texte:
        e.creux.part === 0
          ? `Aucune vente sur ces ${e.creux.fin - e.creux.debut} heures, alors que vous vendez avant et après.`
          : `Seulement ${pct(e.creux.part)} des ventes sur ces ${e.creux.fin - e.creux.debut} heures, alors que vous vendez avant et après.`,
      action: "Lancez une offre flash ou publiez vos nouveautés juste avant ce créneau pour y ramener des clients.",
    });
  }

  // 3. Produits phares et Pareto
  const classes = e.produits;
  if (classes.length >= 3 && e.indicateurs.ventes >= 10) {
    const top = classes.slice(0, 3);
    const part = top.reduce((s, p) => s + p.part, 0);
    conseils.push({
      id: "produits-phares",
      niveau: "info",
      titre: "Vos produits phares",
      texte: `${top.map((p) => p.nom).join(", ")} font ${pct(part)} du chiffre d'affaires de la période.`,
      action: "Gardez-les en vitrine, en première position sur le site et ne les laissez jamais tomber en rupture.",
    });
    if (e.pareto80 <= Math.ceil(classes.length * 0.3)) {
      conseils.push({
        id: "pareto",
        niveau: "info",
        titre: "Peu de produits portent vos ventes",
        texte: `${e.pareto80} produit${e.pareto80 > 1 ? "s" : ""} sur ${classes.length} réalisent 80 % du chiffre d'affaires.`,
        action: "Concentrez vos réassorts et vos photos sur ces pièces avant d'élargir le choix.",
      });
    }
  }

  // 4. Hausse / baisse
  const hausse = classes.filter((p) => p.tendance === "hausse" && p.variationPct !== null && p.variationPct >= 30).sort((a, b) => (b.variationPct ?? 0) - (a.variationPct ?? 0))[0];
  if (hausse) {
    conseils.push({
      id: `hausse-${hausse.produitId}`,
      niveau: "opportunite",
      titre: `${hausse.nom} est en hausse`,
      texte: `Son chiffre d'affaires progresse de ${Math.round(hausse.variationPct ?? 0)} % entre la première et la seconde moitié de la période (${hausse.quantite} vendus).`,
      action: "Mettez-le en avant (story, WhatsApp, première ligne du catalogue) et vérifiez que le stock suivra.",
    });
  }
  const baisse = classes.filter((p) => p.tendance === "baisse" && p.variationPct !== null && p.variationPct <= -30).sort((a, b) => (a.variationPct ?? 0) - (b.variationPct ?? 0))[0];
  if (baisse) {
    conseils.push({
      id: `baisse-${baisse.produitId}`,
      niveau: "attention",
      titre: `${baisse.nom} ralentit`,
      texte:
        (baisse.variationPct ?? 0) <= -99
          ? `Il ne s'est plus vendu du tout sur la seconde moitié de la période (${baisse.quantite} vendus sur la première).`
          : `Son chiffre d'affaires recule de ${Math.abs(Math.round(baisse.variationPct ?? 0))} % entre la première et la seconde moitié de la période (${baisse.quantite} vendus).`,
      action: "Envisagez une promotion ou de nouvelles photos, et évitez de recommander du stock avant que ça reparte.",
    });
  }

  // 5. Stock vs demande
  const topParQuantite = [...classes].sort((a, b) => b.quantite - a.quantite).slice(0, 10);
  for (const p of topParQuantite) {
    const alerte = e.alertes.find((a) => a.produitId === p.produitId);
    if (alerte) {
      conseils.push({
        id: `stock-${p.produitId}`,
        niveau: "attention",
        titre: `${p.nom} : demande forte, stock bas`,
        texte: `${p.quantite} vendus sur la période, mais il n'en reste que ${alerte.quantite} en alerte de stock.`,
        action: "Faites une entrée de stock en priorité : chaque jour sans ce produit est une vente perdue.",
      });
    }
  }

  // 6. Panier moyen
  if (assezDeVentes && e.indicateurs.ventesUnArticle >= 0.7) {
    conseils.push({
      id: "panier",
      niveau: "opportunite",
      titre: "La plupart des clients n'achètent qu'une pièce",
      texte: `${pct(e.indicateurs.ventesUnArticle)} des ventes ne contiennent qu'un article (panier moyen ${fcfa(e.indicateurs.panierMoyen)}).`,
      action: "Proposez systématiquement une pièce complémentaire à la caisse (casquette, ceinture, chaussettes) ou un petit prix pour deux articles.",
    });
  }

  // 7. Mode de paiement
  const mode = modeDominant(e.ventes);
  if (assezDeVentes && mode && mode.part >= 0.5) {
    conseils.push({
      id: "paiement",
      niveau: "info",
      titre: "Mode de paiement dominant",
      texte: `${pct(mode.part)} des ventes sont réglées avec ${MODES[mode.mode] ?? mode.mode}.`,
      action: "Assurez-vous que ce moyen de paiement est toujours disponible (réseau, solde du compte, monnaie en caisse).",
    });
  }

  return conseils.sort((a, b) => ORDRE[a.niveau] - ORDRE[b.niveau]);
}

