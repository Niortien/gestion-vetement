import {
  IconActivity,
  IconBoxSeam,
  IconChartDots3,
  IconBuildingStore,
  IconCategory2,
  IconCoin,
  IconHanger,
  IconLayoutDashboard,
  IconPackageExport,
  IconPackageImport,
  IconPhoto,
  IconReportMoney,
  IconShieldLock,
  IconRosetteDiscount,
  IconUsers,
} from "@tabler/icons-react";
import type { ComponentType } from "react";
import type { IconProps } from "@tabler/icons-react";

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<IconProps>;
}

export interface NavSection {
  label?: string;
  items: NavItem[];
}

/** Navigation du back-office d'une boutique (ADMIN + CAISSIER). */
export const BOUTIQUE_NAV: NavSection[] = [
  {
    label: "Pilotage",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
      { href: "/activite", label: "Activité", icon: IconActivity },
      { href: "/analyse", label: "Analyse", icon: IconChartDots3 },
      { href: "/activite/hebdomadaire", label: "Recette hebdo", icon: IconReportMoney },
    ],
  },
  {
    label: "Opérations",
    items: [
      { href: "/caisse", label: "Caisse", icon: IconCoin },
      { href: "/stock", label: "Stock", icon: IconBoxSeam },
      { href: "/entrees", label: "Entrées", icon: IconPackageImport },
      { href: "/sorties", label: "Sorties", icon: IconPackageExport },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { href: "/produits", label: "Produits", icon: IconHanger },
      { href: "/admin/categories", label: "Catégories", icon: IconCategory2 },
      { href: "/promotions", label: "Promotions", icon: IconRosetteDiscount },
    ],
  },
];

/** Section réservée au rôle ADMIN de la boutique. */
export const BOUTIQUE_ADMIN_NAV: NavSection = {
  label: "Administration",
  items: [
    { href: "/admin/boutiques", label: "Boutiques", icon: IconBuildingStore },
    { href: "/admin/utilisateurs", label: "Caissiers", icon: IconUsers },
    { href: "/admin/photos-clients", label: "Photos clients", icon: IconPhoto },
    { href: "/admin/audit", label: "Journal d'audit", icon: IconShieldLock },
  ],
};

/**
 * Renvoie l'item le plus spécifique correspondant à `pathname` (préfixe le plus long),
 * pour que `/activite/hebdomadaire` n'allume pas aussi `/activite` et que `/produits/[id]` allume « Produits ».
 */
export function findActiveHref(sections: NavSection[], pathname: string | null): string | null {
  if (!pathname) return null;
  let best: string | null = null;
  for (const section of sections) {
    for (const { href } of section.items) {
      const matches = pathname === href || pathname.startsWith(`${href}/`);
      if (matches && (best === null || href.length > best.length)) best = href;
    }
  }
  return best;
}
