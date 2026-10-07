import { JOURS } from "@/lib/analyse";

interface AnalyseHeatmapProps {
  /** matrice[jour][heure] = nombre de ventes. */
  matrice: number[][];
}

const HEURES = Array.from({ length: 24 }, (_, h) => h);

/** Cinq niveaux : papier, gris, gris foncé, encre, puis l'or pour le pic. */
const NIVEAUX = [
  { bg: "#ECECEA", fg: "#0C0C0E" },
  { bg: "#B9B9BE", fg: "#0C0C0E" },
  { bg: "#55555B", fg: "#FFFFFF" },
  { bg: "#0C0C0E", fg: "#FFFFFF" },
  { bg: "#F0B429", fg: "#0C0C0E" },
] as const;

function niveau(n: number, max: number): number {
  if (n <= 0) return 0;
  const r = n / max;
  if (r >= 0.85) return 4;
  if (r >= 0.6) return 3;
  if (r >= 0.3) return 2;
  return 1;
}

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
                const niv = NIVEAUX[niveau(n, max)];
                return (
                  <td
                    key={h}
                    title={`${jour} ${h}h : ${n} vente${n > 1 ? "s" : ""}`}
                    aria-label={`${jour} ${h}h : ${n} vente${n > 1 ? "s" : ""}`}
                    className="h-7 min-w-6 rounded-[5px] text-center font-mono text-[10px] text-text"
                    style={{ backgroundColor: niv.bg, color: niv.fg }}
                  >
                    {n > 0 ? n : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-text-muted">
        <span>Peu</span>
        {NIVEAUX.map((n) => (
          <i key={n.bg} aria-hidden className="block h-3 w-[22px] rounded" style={{ backgroundColor: n.bg }} />
        ))}
        <span>Beaucoup ({max} max sur une case)</span>
      </p>
    </div>
  );
}
