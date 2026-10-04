import type {
  FenetreHoraire,
  HeureStat,
  Indicateurs,
  JourStat,
  LigneVente,
  ProduitStat,
  SortieInput,
  Tendance,
  VenteLite,
} from "./types";

export const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"] as const;

const num = (v: string | number | null | undefined): number => {
  const n = typeof v === "number" ? v : Number.parseFloat(v ?? "0");
  return Number.isFinite(n) ? n : 0;
};

/** Heure `h` → « 17h ». */
export const heureLabel = (h: number): string => `${h}h`;

/** Les ventes annulées sont reconnaissables à `[ANNULEE]` dans leurs notes. */
export const estAnnulee = (s: Pick<SortieInput, "notes">): boolean => s.notes?.includes("[ANNULEE]") ?? false;

/** Convertit les sorties de l'API en ventes exploitables, sans les ventes annulées ni les dates invalides. */
export function normaliser(sorties: SortieInput[]): VenteLite[] {
  const ventes: VenteLite[] = [];
  for (const s of sorties) {
    if (estAnnulee(s)) continue;
    const date = new Date(s.createdAt);
    if (Number.isNaN(date.getTime())) continue;

    const lignes: LigneVente[] = (s.lignes ?? []).map((l) => {
      const produit = l.variante?.produit;
      const produitId = produit?.id ?? l.variante?.produitId ?? "inconnu";
      return {
        produitId,
        nom: produit?.nom ?? "Produit inconnu",
        quantite: l.quantite,
        montant: l.quantite * num(l.prixUnitaire),
      };
    });

    ventes.push({
      id: s.id,
      date,
      jour: (date.getDay() + 6) % 7,
      heure: date.getHours(),
      montant: num(s.totalMontant),
      articles: lignes.reduce((sum, l) => sum + l.quantite, 0),
      mode: s.transaction?.modePaiement ?? null,
      lignes,
    });
  }
  return ventes;
}

export function indicateurs(ventes: VenteLite[]): Indicateurs {
  const n = ventes.length;
  const ca = ventes.reduce((s, v) => s + v.montant, 0);
  const articles = ventes.reduce((s, v) => s + v.articles, 0);
  const unArticle = ventes.filter((v) => v.articles === 1).length;
  return {
    ventes: n,
    ca,
    panierMoyen: n > 0 ? ca / n : 0,
    articlesParVente: n > 0 ? articles / n : 0,
    ventesUnArticle: n > 0 ? unArticle / n : 0,
  };
}

export function parJour(ventes: VenteLite[]): JourStat[] {
  const total = ventes.reduce((s, v) => s + v.montant, 0);
  return JOURS.map((label, jour) => {
    const du = ventes.filter((v) => v.jour === jour);
    const ca = du.reduce((s, v) => s + v.montant, 0);
    return {
      jour,
      label,
      ventes: du.length,
      ca,
      panierMoyen: du.length > 0 ? ca / du.length : 0,
      part: total > 0 ? ca / total : 0,
    };
  });
}

export function parHeure(ventes: VenteLite[]): HeureStat[] {
  const n = ventes.length;
  return Array.from({ length: 24 }, (_, heure) => {
    const de = ventes.filter((v) => v.heure === heure);
    return {
      heure,
      ventes: de.length,
      ca: de.reduce((s, v) => s + v.montant, 0),
      part: n > 0 ? de.length / n : 0,
    };
  });
}

/** matrice[jour][heure] = nombre de ventes, pour la carte de chaleur. */
export function matrice(ventes: VenteLite[]): number[][] {
  const m = Array.from({ length: 7 }, () => new Array<number>(24).fill(0));
  for (const v of ventes) m[v.jour][v.heure] += 1;
  return m;
}

/** Fenêtre glissante de `taille` heures consécutives qui concentre le plus de ventes. */
export function fenetrePic(heures: HeureStat[], taille = 2): FenetreHoraire | null {
  const total = heures.reduce((s, h) => s + h.ventes, 0);
  if (total === 0) return null;
  let best = { debut: 0, somme: -1 };
  for (let d = 0; d + taille <= 24; d++) {
    const somme = heures.slice(d, d + taille).reduce((s, h) => s + h.ventes, 0);
    if (somme > best.somme) best = { debut: d, somme };
  }
  return { debut: best.debut, fin: best.debut + taille, part: best.somme / total };
}

/**
 * Plus longue plage d'au moins 2 heures consécutives, à l'intérieur des heures d'activité, où l'on vend moins de
 * 40 % de la moyenne horaire. Renvoie `null` si l'activité est trop courte pour parler de « creux ».
 */
export function fenetreCreux(heures: HeureStat[]): FenetreHoraire | null {
  const total = heures.reduce((s, h) => s + h.ventes, 0);
  const actives = heures.filter((h) => h.ventes > 0).map((h) => h.heure);
  if (total === 0 || actives.length === 0) return null;
  const premiere = Math.min(...actives);
  const derniere = Math.max(...actives);
  const span = derniere - premiere + 1;
  if (span < 5) return null;

  const seuil = (total / span) * 0.4;
  let best: { debut: number; fin: number } | null = null;
  let courant: { debut: number; fin: number } | null = null;
  for (let h = premiere; h <= derniere; h++) {
    if (heures[h].ventes < seuil) {
      courant = courant ? { debut: courant.debut, fin: h + 1 } : { debut: h, fin: h + 1 };
      if (!best || courant.fin - courant.debut > best.fin - best.debut) best = { ...courant };
    } else {
      courant = null;
    }
  }
  if (!best || best.fin - best.debut < 2) return null;
  const somme = heures.slice(best.debut, best.fin).reduce((s, h) => s + h.ventes, 0);
  return { debut: best.debut, fin: best.fin, part: somme / total };
}

const SEUIL_TENDANCE_PCT = 15;
const VOLUME_MIN_TENDANCE = 5;

function tendanceDe(avant: number, apres: number, quantite: number): { tendance: Tendance; variationPct: number | null } {
  if (quantite < VOLUME_MIN_TENDANCE) return { tendance: "inconnue", variationPct: null };
  if (avant === 0 && apres > 0) return { tendance: "hausse", variationPct: null };
  if (avant === 0) return { tendance: "inconnue", variationPct: null };
  const variationPct = ((apres - avant) / avant) * 100;
  if (variationPct >= SEUIL_TENDANCE_PCT) return { tendance: "hausse", variationPct };
  if (variationPct <= -SEUIL_TENDANCE_PCT) return { tendance: "baisse", variationPct };
  return { tendance: "stable", variationPct };
}

/**
 * Classement des produits par chiffre d'affaires. La tendance compare le CA de la 2ᵉ moitié de la période à celui de
 * la 1ʳᵉ ; en dessous de 5 unités vendues elle reste « inconnue » plutôt que de conclure sur trop peu de ventes.
 */
export function produits(ventes: VenteLite[], debut: Date, fin: Date): ProduitStat[] {
  const milieu = new Date((debut.getTime() + fin.getTime()) / 2);
  const parProduit = new Map<
    string,
    { nom: string; quantite: number; ca: number; avant: number; apres: number; jours: Set<string>; parJour: number[] }
  >();

  for (const v of ventes) {
    const cle = v.date.toDateString();
    for (const l of v.lignes) {
      const p =
        parProduit.get(l.produitId) ??
        { nom: l.nom, quantite: 0, ca: 0, avant: 0, apres: 0, jours: new Set<string>(), parJour: new Array<number>(7).fill(0) };
      p.quantite += l.quantite;
      p.ca += l.montant;
      if (v.date < milieu) p.avant += l.montant;
      else p.apres += l.montant;
      p.jours.add(cle);
      p.parJour[v.jour] += l.quantite;
      parProduit.set(l.produitId, p);
    }
  }

  const caTotal = [...parProduit.values()].reduce((s, p) => s + p.ca, 0);
  return [...parProduit.entries()]
    .map(([produitId, p]) => {
      const max = Math.max(...p.parJour);
      const { tendance, variationPct } = tendanceDe(p.avant, p.apres, p.quantite);
      return {
        produitId,
        nom: p.nom,
        quantite: p.quantite,
        ca: p.ca,
        part: caTotal > 0 ? p.ca / caTotal : 0,
        joursVendus: p.jours.size,
        meilleurJour: max > 0 ? p.parJour.indexOf(max) : null,
        tendance,
        variationPct,
      };
    })
    .sort((a, b) => b.ca - a.ca);
}

/** Nombre de produits (du plus rentable au moins rentable) nécessaires pour atteindre 80 % du CA. */
export function pareto80(classement: ProduitStat[]): number {
  let cumul = 0;
  for (let i = 0; i < classement.length; i++) {
    cumul += classement[i].part;
    if (cumul >= 0.8) return i + 1;
  }
  return classement.length;
}

/** Mode de paiement le plus utilisé (en nombre de ventes) et sa part, ou `null` si aucun n'est renseigné. */
export function modeDominant(ventes: VenteLite[]): { mode: string; part: number } | null {
  const avecMode = ventes.filter((v) => v.mode);
  if (avecMode.length === 0) return null;
  const compte = new Map<string, number>();
  for (const v of avecMode) compte.set(v.mode as string, (compte.get(v.mode as string) ?? 0) + 1);
  const [mode, n] = [...compte.entries()].sort((a, b) => b[1] - a[1])[0];
  return { mode, part: n / avecMode.length };
}
