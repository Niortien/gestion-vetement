"use client";

interface TopProduit {
  produitId: string;
  nom: string;
  quantiteTotale: number;
  montantTotal: string;
}

interface DashboardTopProduitsProps {
  produits: TopProduit[];
  isLoading: boolean;
  isError?: boolean;
}

export function DashboardTopProduits({ produits, isLoading, isError }: DashboardTopProduitsProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-[var(--color-surface-high)] p-4">
      <p className="mb-3 text-xs uppercase tracking-wide text-text-muted">Top 5 produits — 7j</p>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 animate-pulse rounded-md bg-[var(--color-surface)]" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-out/30 bg-out/5 px-3 py-3">
          <p className="text-xs font-semibold text-out">Impossible de charger le classement</p>
          <p className="mt-0.5 text-[11px] text-text-muted">Vérifie la connexion au serveur</p>
        </div>
      ) : produits.length === 0 ? (
        <div>
          <p className="text-sm text-text-muted">Aucune vente sur les 7 derniers jours</p>
          <p className="mt-0.5 text-[11px] text-text-muted/60">Enregistre une sortie de type VENTE pour voir apparaître les produits</p>
        </div>
      ) : (
        <ol className="space-y-2">
          {produits.slice(0, 5).map((p, i) => (
            <li
              key={p.produitId}
              className="flex items-center justify-between rounded-md border border-border/60 bg-[var(--color-surface)] px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 text-center font-[var(--font-mono)] text-xs text-text-muted">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-text">{p.nom}</span>
              </div>
              <div className="text-right">
                <p className="font-[var(--font-mono)] text-xs text-accent">
                  {Number(p.montantTotal).toLocaleString("fr-FR")} FCFA
                </p>
                <p className="text-[10px] text-text-muted">{p.quantiteTotale} vendus</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
