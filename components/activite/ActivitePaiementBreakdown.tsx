"use client";

import { ModePaiement } from "@/types";
import type { ResumeJour } from "@/types";

const MODE_LABELS: Record<ModePaiement, string> = {
  CASH: "Cash",
  WAVE: "Wave",
  ORANGE_MONEY: "Orange Money",
  CARTE: "Carte",
  MTN_MONEY: "MTN Money",
};

const MODE_COLORS: Record<ModePaiement, string> = {
  CASH: "#0C0C0E",
  WAVE: "#4B37C4",
  ORANGE_MONEY: "#F0B429",
  CARTE: "#55555B",
  MTN_MONEY: "#8A6100",
};

interface ActivitePaiementBreakdownProps {
  resume: ResumeJour | null;
}

/** Une ligne par mode de paiement : libellé, barre relative au premier, montant, part. */
export function ActivitePaiementBreakdown({ resume }: ActivitePaiementBreakdownProps) {
  if (!resume) {
    return <p className="py-4 text-center text-sm text-text-muted">Session non disponible</p>;
  }

  const entries = (Object.entries(resume.parModePaiement) as [ModePaiement, string][]).sort(
    ([, a], [, b]) => parseFloat(b || "0") - parseFloat(a || "0")
  );
  const total = entries.reduce((sum, [, v]) => sum + parseFloat(v || "0"), 0);
  const max = Math.max(...entries.map(([, v]) => parseFloat(v || "0")), 1);

  if (entries.length === 0) {
    return <p className="py-4 text-center text-sm text-text-muted">Aucun paiement enregistré aujourd&apos;hui</p>;
  }

  return (
    <ul aria-label="Répartition des paiements par mode">
      {entries.map(([mode, montant]) => {
        const valeur = parseFloat(montant || "0");
        const pct = total > 0 ? Math.round((valeur / total) * 100) : 0;
        return (
          <li key={mode} className="grid grid-cols-[110px_minmax(0,1fr)_auto_44px] items-center gap-3 py-2 text-sm">
            <span>{MODE_LABELS[mode]}</span>
            <span aria-hidden className="h-2.5 overflow-hidden rounded-full bg-surface-high">
              <i className="block h-full rounded-full" style={{ width: `${(valeur / max) * 100}%`, backgroundColor: MODE_COLORS[mode] }} />
            </span>
            <span className="text-right font-bold tabular-nums">{Math.round(valeur).toLocaleString("fr-FR")}</span>
            <span className="text-right text-[13px] tabular-nums text-text-muted">{pct} %</span>
          </li>
        );
      })}
    </ul>
  );
}
