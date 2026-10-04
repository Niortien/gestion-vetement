interface StockUrgencyProps {
  /** Total des unités réellement en stock (somme des variantes). */
  totalStock: number;
  className?: string;
}

/** Seuil à partir duquel on prévient le client : au-delà, afficher « dernières pièces » serait faux. */
export const LOW_STOCK_THRESHOLD = 3;

/**
 * Urgence honnête (principe de rareté) : n'apparaît que lorsque le stock réel est de 1 à 3 pièces.
 * Jamais de compte à rebours ni de chiffre inventé.
 */
export function StockUrgency({ totalStock, className }: StockUrgencyProps) {
  if (totalStock < 1 || totalStock > LOW_STOCK_THRESHOLD) return null;

  return (
    <p
      className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${className ?? ""}`}
      style={{ color: "var(--v-hot)" }}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--v-hot)" }} />
      {totalStock === 1 ? "Dernière pièce" : `Plus que ${totalStock} en stock`}
    </p>
  );
}
