import { JOURS } from "@/lib/analyse";

interface AnalyseHeatmapProps {
  /** matrice[jour][heure] = nombre de ventes. */
  matrice: number[][];
}

const HEURES = Array.from({ length: 24 }, (_, h) => h);

/**
 * Carte de chaleur jour × heure : plus la case est foncée, plus on vend. Chaque case porte son chiffre dans un libellé
 * (lecteurs d'écran, infobulle) : l'information ne dépend pas de la couleur seule.
 */
export function AnalyseHeatmap({ matrice }: AnalyseHeatmapProps) {
  const max = Math.max(...matrice.flat(), 1);
  // Les heures sans aucune vente sur toute la semaine ne sont pas affichées : le tableau reste lisible.
  const heures = HEURES.filter((h) => matrice.some((ligne) => ligne[h] > 0));

  if (heures.length === 0) {
    return <p className="text-sm text-text-muted">Aucune vente sur la période.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-separate border-spacing-1 text-xs">
        <caption className="sr-only">Nombre de ventes par jour de la semaine et par heure</caption>
        <thead>
          <tr>
            <th scope="col" className="w-12" />
            {heures.map((h) => (
              <th key={h} scope="col" className="pb-1 text-center font-mono font-medium text-text-muted">
                {h}h
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {JOURS.map((jour, j) => (
            <tr key={jour}>
              <th scope="row" className="pr-2 text-left font-medium text-text-muted">
                {jour.slice(0, 3)}
              </th>
              {heures.map((h) => {
                const n = matrice[j][h];
                const intensite = n / max;
                return (
                  <td
                    key={h}
                    title={`${jour} ${h}h : ${n} vente${n > 1 ? "s" : ""}`}
                    aria-label={`${jour} ${h}h : ${n} vente${n > 1 ? "s" : ""}`}
                    className="h-7 min-w-6 rounded-[5px] text-center font-mono text-[10px] text-text"
                    style={{
                      backgroundColor:
                        n === 0
                          ? "var(--color-surface-high)"
                          : `color-mix(in srgb, var(--color-accent) ${Math.round(18 + intensite * 82)}%, transparent)`,
                      color: n > 0 && intensite > 0.55 ? "var(--color-on-accent)" : undefined,
                    }}
                  >
                    {n > 0 ? n : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 flex items-center gap-2 text-xs text-text-muted">
        <span>Peu de ventes</span>
        <span
          aria-hidden
          className="h-2 w-28 rounded-full"
          style={{ background: "linear-gradient(to right, color-mix(in srgb, var(--color-accent) 18%, transparent), var(--color-accent))" }}
        />
        <span>Beaucoup ({max} max sur une case)</span>
      </p>
    </div>
  );
}
