import type { ReactNode } from "react";

interface ProductRailProps {
  children: ReactNode;
  /** Libellé lu par les lecteurs d'écran pour la rangée défilante. */
  label: string;
}

/** Le portant : une barre noire sur laquelle les cartes glissent horizontalement. */
export function ProductRail({ children, label }: ProductRailProps) {
  return (
    <div className="v-rail">
      <ul className="v-rail-row" aria-label={label}>
        {children}
      </ul>
    </div>
  );
}

interface ProductGridProps {
  children: ReactNode;
  label: string;
  className?: string;
}

/** Variante en grille : chaque cellule porte son segment de barre, la rangée garde l'allure d'un portant. */
export function ProductGrid({ children, label, className }: ProductGridProps) {
  return (
    <ul className={`v-rail-grid ${className ?? ""}`} aria-label={label}>
      {children}
    </ul>
  );
}

/** Cellule de grille : segment de rail au-dessus de la carte. */
export function ProductCell({ children }: { children: ReactNode }) {
  return (
    <li className="v-cell">
      {children}
    </li>
  );
}
