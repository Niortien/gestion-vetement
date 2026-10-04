import { VENTES_MIN_CONSEILS, conseiller } from "./conseils";
import {
  fenetreCreux,
  fenetrePic,
  indicateurs,
  matrice,
  normaliser,
  pareto80,
  parHeure,
  parJour,
  produits,
} from "./ventes";
import type { AnalyseResultat, SortieInput, StockAlerteLite } from "./types";

export interface OptionsAnalyse {
  debut: Date;
  fin: Date;
  alertes?: StockAlerteLite[];
}

/** Point d'entrée : des sorties de l'API vers les statistiques et les conseils. */
export function analyser(sorties: SortieInput[], { debut, fin, alertes = [] }: OptionsAnalyse): AnalyseResultat {
  const ventes = normaliser(sorties);
  const ind = indicateurs(ventes);
  const jours = parJour(ventes);
  const heures = parHeure(ventes);
  const classement = produits(ventes, debut, fin);
  const pic = fenetrePic(heures);
  const creux = fenetreCreux(heures);
  const p80 = pareto80(classement);
  const periodeJours = Math.max(1, Math.round((fin.getTime() - debut.getTime()) / 86_400_000));

  return {
    indicateurs: ind,
    jours,
    heures,
    matrice: matrice(ventes),
    produits: classement,
    pareto80: p80,
    pic,
    creux,
    conseils: conseiller({ ventes, indicateurs: ind, jours, produits: classement, pareto80: p80, pic, creux, alertes, periodeJours }),
    echantillonFaible: ind.ventes < VENTES_MIN_CONSEILS,
    sansLignes: ventes.length > 0 && classement.length === 0,
  };
}

export { VENTES_MIN_CONSEILS } from "./conseils";
export { JOURS, heureLabel } from "./ventes";
export * from "./types";
