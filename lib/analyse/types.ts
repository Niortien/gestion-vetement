/**
 * Types de l'analyse des ventes. Ce dossier est volontairement autonome (aucun import `@/`) : la logique est pure et
 * peut être exécutée hors Next.js pour être testée.
 */

/** Forme minimale d'une vente telle que renvoyée par `GET /sorties` (type VENTE). */
export interface SortieInput {
  id: string;
  createdAt: string;
  totalMontant: string;
  notes: string | null;
  transaction?: { modePaiement: string } | null;
  lignes?: Array<{
    quantite: number;
    prixUnitaire: string;
    variante?: { produitId?: string; produit?: { id: string; nom: string } };
  }>;
}

export interface LigneVente {
  produitId: string;
  nom: string;
  quantite: number;
  montant: number;
}

export interface VenteLite {
  id: string;
  date: Date;
  /** 0 = lundi … 6 = dimanche. */
  jour: number;
  /** 0 – 23, heure locale du navigateur (Abidjan = UTC+0). */
  heure: number;
  montant: number;
  articles: number;
  mode: string | null;
  lignes: LigneVente[];
}

export interface JourStat {
  jour: number;
  label: string;
  ventes: number;
  ca: number;
  panierMoyen: number;
  /** Part du chiffre d'affaires de la période, 0 – 1. */
  part: number;
}

export interface HeureStat {
  heure: number;
  ventes: number;
  ca: number;
  /** Part du nombre de ventes de la période, 0 – 1. */
  part: number;
}

export type Tendance = "hausse" | "baisse" | "stable" | "inconnue";

export interface ProduitStat {
  produitId: string;
  nom: string;
  quantite: number;
  ca: number;
  part: number;
  joursVendus: number;
  meilleurJour: number | null;
  tendance: Tendance;
  /** Variation du CA, 2ᵉ moitié de la période contre la 1ʳᵉ, en %. `null` si non calculable. */
  variationPct: number | null;
}

export interface Indicateurs {
  ventes: number;
  ca: number;
  panierMoyen: number;
  articlesParVente: number;
  /** Part des ventes ne contenant qu'un seul article, 0 – 1. */
  ventesUnArticle: number;
}

export interface FenetreHoraire {
  debut: number;
  fin: number;
  /** Part du nombre de ventes sur la fenêtre, 0 – 1. */
  part: number;
}

export type NiveauConseil = "attention" | "opportunite" | "info";

export interface Conseil {
  id: string;
  niveau: NiveauConseil;
  titre: string;
  /** Constat chiffré : toujours appuyé sur un nombre de la période analysée. */
  texte: string;
  /** Geste concret à faire. */
  action: string;
}

/** Variante en alerte de stock, agrégée par produit. */
export interface StockAlerteLite {
  produitId: string;
  nom: string;
  quantite: number;
}

export interface AnalyseResultat {
  indicateurs: Indicateurs;
  jours: JourStat[];
  heures: HeureStat[];
  /** matrice[jour][heure] = nombre de ventes. */
  matrice: number[][];
  produits: ProduitStat[];
  /** Nombre de produits qui réalisent 80 % du chiffre d'affaires. */
  pareto80: number;
  pic: FenetreHoraire | null;
  creux: FenetreHoraire | null;
  conseils: Conseil[];
  /** Moins de 30 ventes : les règles jour / heure sont désactivées. */
  echantillonFaible: boolean;
  /** Aucune ligne de vente dans les données : l'analyse par produit est impossible. */
  sansLignes: boolean;
}
