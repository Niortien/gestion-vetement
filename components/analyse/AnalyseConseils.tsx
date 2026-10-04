import { IconAlertTriangle, IconBulb, IconInfoCircle } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { Conseil, NiveauConseil } from "@/lib/analyse";

const NIVEAU: Record<NiveauConseil, { label: string; icon: typeof IconBulb; tone: string }> = {
  attention: { label: "À traiter", icon: IconAlertTriangle, tone: "tone-out" },
  opportunite: { label: "Opportunité", icon: IconBulb, tone: "tone-in" },
  info: { label: "À savoir", icon: IconInfoCircle, tone: "tone-accent" },
};

/** Conseils chiffrés : constat, puis geste concret. Le niveau est porté par un libellé et une icône, pas par la couleur seule. */
export function AnalyseConseils({ conseils }: { conseils: Conseil[] }) {
  if (conseils.length === 0) {
    return <p className="text-sm text-text-muted">Aucun conseil à donner pour l&apos;instant : les chiffres de la période n&apos;appellent pas d&apos;action particulière.</p>;
  }

  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {conseils.map((c) => {
        const n = NIVEAU[c.niveau];
        const Icon = n.icon;
        return (
          <li key={c.id} className={cn(n.tone, "rounded-lg border border-border bg-surface p-4")}>
            <p className="flex items-center gap-2 text-xs font-semibold text-[var(--tone-text)]">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[color-mix(in_srgb,var(--tone)_16%,transparent)]">
                <Icon size={14} aria-hidden />
              </span>
              {n.label}
            </p>
            <h3 className="mt-2 font-display text-base font-bold text-text">{c.titre}</h3>
            <p className="mt-1 text-sm leading-relaxed text-text-muted">{c.texte}</p>
            <p className="mt-3 border-t border-border pt-3 text-sm font-medium leading-relaxed text-text">
              <span className="text-[var(--tone-text)]">À faire : </span>
              {c.action}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
