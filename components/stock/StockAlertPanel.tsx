import type { StockAlerte } from "@/types";

interface StockAlertPanelProps {
  alertes: StockAlerte[];
}

export function StockAlertPanel({ alertes }: StockAlertPanelProps) {
  if (!alertes.length) return null;

  return (
    <aside className="sticky bottom-4 rounded-md border border-out bg-[var(--color-out-dim)] p-3">
      <p className="mb-2 text-xs uppercase tracking-wide text-out">Alertes stock</p>
      <ul className="space-y-1 text-sm text-text">
        {alertes.slice(0, 4).map((item) => (
          <li key={item.id}>
            {item.produit.nom} {item.taille} {item.couleur}: {item.quantiteStock}
          </li>
        ))}
      </ul>
    </aside>
  );
}
