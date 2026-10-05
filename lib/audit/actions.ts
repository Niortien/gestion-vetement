/**
 * Catalogue des actions du journal d'audit. Module autonome (aucun import `@/`) pour pouvoir être testé hors Next.js.
 * Les codes viennent du backend (`AuditLog::record`). Un code inconnu reste affiché, avec un libellé déduit du code.
 */

export type CategorieAudit = "connexion" | "ventes" | "caisse" | "stock" | "catalogue" | "equipe";
export type TonAudit = "accent" | "in" | "out" | "return" | "cash";

export interface ActionMeta {
  label: string;
  categorie: CategorieAudit;
  ton: TonAudit;
  /** Action à risque : suppression, annulation, écart, échec de connexion, changement de prix. */
  sensible: boolean;
}

export const ACTIONS: Record<string, ActionMeta> = {
  LOGIN: { label: "Connexion", categorie: "connexion", ton: "accent", sensible: false },
  LOGIN_ECHEC: { label: "Échec de connexion", categorie: "connexion", ton: "out", sensible: true },

  SORTIE_CREATE: { label: "Vente / sortie enregistrée", categorie: "ventes", ton: "in", sensible: false },
  DEPENSE_CREATE: { label: "Dépense enregistrée", categorie: "ventes", ton: "return", sensible: false },
  SORTIE_ANNULER: { label: "Vente annulée", categorie: "ventes", ton: "out", sensible: true },
  SORTIE_DESTROY: { label: "Vente supprimée", categorie: "ventes", ton: "out", sensible: true },

  CAISSE_OUVERTURE: { label: "Ouverture de caisse", categorie: "caisse", ton: "cash", sensible: false },
  CAISSE_FERMETURE: { label: "Fermeture de caisse", categorie: "caisse", ton: "cash", sensible: false },
  CAISSE_ECART: { label: "Écart de caisse", categorie: "caisse", ton: "out", sensible: true },

  ENTREE_CREATE: { label: "Entrée de stock", categorie: "stock", ton: "in", sensible: false },
  ENTREE_ANNULER: { label: "Entrée annulée", categorie: "stock", ton: "out", sensible: true },
  ENTREE_DESTROY: { label: "Entrée supprimée", categorie: "stock", ton: "out", sensible: true },
  STOCK_AJUSTEMENT: { label: "Ajustement manuel du stock", categorie: "stock", ton: "return", sensible: true },

  PRODUIT_CREATE: { label: "Produit créé", categorie: "catalogue", ton: "in", sensible: false },
  PRODUIT_UPDATE: { label: "Produit modifié", categorie: "catalogue", ton: "accent", sensible: false },
  PRODUIT_PRIX_UPDATE: { label: "Prix modifiés", categorie: "catalogue", ton: "return", sensible: true },
  PRODUIT_BOUTIQUE_REASSIGN: { label: "Produit réaffecté à une boutique", categorie: "catalogue", ton: "return", sensible: true },
  PRODUIT_DESTROY: { label: "Produit supprimé", categorie: "catalogue", ton: "out", sensible: true },
  CATEGORIE_CREATE: { label: "Catégorie créée", categorie: "catalogue", ton: "in", sensible: false },
  CATEGORIE_UPDATE: { label: "Catégorie modifiée", categorie: "catalogue", ton: "accent", sensible: false },
  CATEGORIE_DESTROY: { label: "Catégorie supprimée", categorie: "catalogue", ton: "out", sensible: true },

  USER_CREATE: { label: "Utilisateur créé", categorie: "equipe", ton: "in", sensible: true },
  USER_UPDATE: { label: "Utilisateur modifié", categorie: "equipe", ton: "accent", sensible: true },
  USER_DESTROY: { label: "Utilisateur supprimé", categorie: "equipe", ton: "out", sensible: true },
  BOUTIQUE_CREATE: { label: "Boutique créée", categorie: "equipe", ton: "in", sensible: false },
  BOUTIQUE_UPDATE: { label: "Boutique modifiée", categorie: "equipe", ton: "accent", sensible: false },
  BOUTIQUE_ARCHIVE: { label: "Boutique archivée", categorie: "equipe", ton: "return", sensible: true },
  BOUTIQUE_DESTROY: { label: "Boutique supprimée", categorie: "equipe", ton: "out", sensible: true },
};

export const CATEGORIES: { key: CategorieAudit; label: string }[] = [
  { key: "connexion", label: "Connexions" },
  { key: "ventes", label: "Ventes" },
  { key: "caisse", label: "Caisse" },
  { key: "stock", label: "Stock" },
  { key: "catalogue", label: "Catalogue" },
  { key: "equipe", label: "Équipe et boutiques" },
];

export const ENTITES: Record<string, string> = {
  User: "Utilisateur",
  Sortie: "Vente / sortie",
  Entree: "Entrée de stock",
  CaisseSession: "Session de caisse",
  Produit: "Produit",
  Variante: "Variante",
  Categorie: "Catégorie",
  Boutique: "Boutique",
};

/** « PRODUIT_PRIX_UPDATE » → « Produit prix update » : repli lisible pour un code non catalogué. */
function humaniser(code: string): string {
  const mots = code.toLowerCase().split("_").join(" ");
  return mots.charAt(0).toUpperCase() + mots.slice(1);
}

export function metaAction(code: string): ActionMeta {
  return ACTIONS[code] ?? { label: humaniser(code), categorie: "catalogue", ton: "accent", sensible: false };
}

export function entiteLabel(type: string): string {
  return ENTITES[type] ?? type;
}

/** Codes d'action d'une catégorie, au format attendu par le filtre `action` du backend (séparés par des virgules). */
export function codesDeCategorie(categorie: CategorieAudit): string {
  return Object.entries(ACTIONS)
    .filter(([, m]) => m.categorie === categorie)
    .map(([code]) => code)
    .join(",");
}

/** Codes des actions sensibles, au format du filtre `action` du backend. */
export function codesSensibles(): string {
  return Object.entries(ACTIONS)
    .filter(([, m]) => m.sensible)
    .map(([code]) => code)
    .join(",");
}

export interface EntreeAudit {
  id: string;
  createdAt: string;
}

export interface GroupeJour<T> {
  /** Clé AAAA-MM-JJ (jour local). */
  cle: string;
  label: string;
  items: T[];
}

const pad = (n: number): string => String(n).padStart(2, "0");
const cleJour = (d: Date): string => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Regroupe des entrées (déjà triées du plus récent au plus ancien) par jour : « Aujourd'hui », « Hier », puis la date. */
export function grouperParJour<T extends EntreeAudit>(entrees: T[], maintenant: Date = new Date()): GroupeJour<T>[] {
  const aujourdhui = cleJour(maintenant);
  const hier = cleJour(new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate() - 1));
  const groupes: GroupeJour<T>[] = [];

  for (const e of entrees) {
    const date = new Date(e.createdAt);
    if (Number.isNaN(date.getTime())) continue;
    const cle = cleJour(date);
    let groupe = groupes[groupes.length - 1];
    if (!groupe || groupe.cle !== cle) {
      const label =
        cle === aujourdhui
          ? "Aujourd'hui"
          : cle === hier
            ? "Hier"
            : date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      groupe = { cle, label, items: [] };
      groupes.push(groupe);
    }
    groupe.items.push(e);
  }
  return groupes;
}

export interface LigneCsv {
  createdAt: string;
  utilisateur: string;
  role: string;
  action: string;
  entite: string;
  description: string;
}

const echapper = (v: string): string => `"${v.replace(/"/g, '""')}"`;

/** CSV prêt pour Excel (séparateur « ; », BOM UTF-8 pour les accents). */
export function versCsv(lignes: LigneCsv[]): string {
  const entete = ["Date", "Heure", "Utilisateur", "Rôle", "Action", "Élément", "Détail"];
  const corps = lignes.map((l) => {
    const d = new Date(l.createdAt);
    const date = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    const heure = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    return [date, heure, l.utilisateur, l.role, l.action, l.entite, l.description].map(echapper).join(";");
  });
  return "﻿" + [entete.map(echapper).join(";"), ...corps].join("\r\n");
}
