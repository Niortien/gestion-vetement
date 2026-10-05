import {
  IconAlertTriangle,
  IconBox,
  IconBuildingStore,
  IconCashRegister,
  IconLogin2,
  IconReceipt2,
  type Icon,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { TONE_CLASS } from "@/components/common/tone";
import { entiteLabel, grouperParJour, metaAction, type CategorieAudit } from "@/lib/audit/actions";
import type { AuditLog } from "@/features/audit/api/audit-api";

const ICONES: Record<CategorieAudit, Icon> = {
  connexion: IconLogin2,
  ventes: IconReceipt2,
  caisse: IconCashRegister,
  stock: IconBox,
  catalogue: IconBox,
  equipe: IconBuildingStore,
};

const heure = (iso: string) =>
  new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

const ROLES: Record<string, string> = { ADMIN: "Administrateur", VENDEUR: "Vendeur", GERANT: "Gérant" };

/** Journal regroupé par jour : heure exacte, auteur, action, détail. Le caractère sensible est écrit, pas seulement coloré. */
export function AuditFeed({ entrees }: { entrees: AuditLog[] }) {
  const groupes = grouperParJour(entrees);

  return (
    <div className="space-y-6">
      {groupes.map((g) => (
        <section key={g.cle} aria-label={g.label}>
          <h3 className="sticky top-0 z-10 -mx-1 mb-2 bg-base/90 px-1 py-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted backdrop-blur-sm">
            {g.label} <span className="font-mono font-normal normal-case">· {g.items.length}</span>
          </h3>
          <ol className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
            {g.items.map((e) => {
              const meta = metaAction(e.action);
              const Icone = ICONES[meta.categorie];
              return (
                <li key={e.id} className={cn(TONE_CLASS[meta.ton], "flex gap-3 border-b border-border px-3.5 py-3 last:border-0")}>
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[color-mix(in_srgb,var(--tone)_14%,transparent)] text-[var(--tone-text)]">
                    <Icone size={16} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-sm font-semibold text-text">{meta.label}</span>
                      {meta.sensible && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-out-dim px-2 py-0.5 text-[11px] font-semibold text-out-text">
                          <IconAlertTriangle size={11} aria-hidden />
                          Sensible
                        </span>
                      )}
                      <span className="rounded bg-surface-high px-1.5 py-0.5 text-[11px] font-medium text-text-muted">
                        {entiteLabel(e.entityType)}
                      </span>
                    </p>
                    {e.description && <p className="mt-0.5 break-words text-sm text-text-muted">{e.description}</p>}
                    <p className="mt-1 text-xs text-text-muted">
                      par <span className="font-medium text-text">{e.user?.email ?? "utilisateur inconnu"}</span>
                      {e.user?.role && <> · {ROLES[e.user.role] ?? e.user.role}</>}
                    </p>
                  </div>
                  <time dateTime={e.createdAt} className="shrink-0 pt-0.5 font-mono text-xs tabular-nums text-text-muted">
                    {heure(e.createdAt)}
                  </time>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
