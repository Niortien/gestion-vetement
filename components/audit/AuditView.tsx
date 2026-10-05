"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconDownload,
  IconListDetails,
  IconSearch,
  IconShieldLock,
  IconUsers,
} from "@tabler/icons-react";
import { CountUp } from "@/components/common/CountUp";
import { EmptyRiver } from "@/components/common/EmptyRiver";
import { PageHero } from "@/components/common/PageHero";
import { PageWrapper } from "@/components/common/PageWrapper";
import { PeriodFilter } from "@/components/common/PeriodFilter";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { StatTile } from "@/components/common/StatTile";
import { useAuditLogs } from "@/features/audit/query/audit-queries";
import { useUsers } from "@/features/users/query/users-queries";
import { dvToISO, type DateRange } from "@/lib/dateRange";
import {
  CATEGORIES,
  codesDeCategorie,
  codesSensibles,
  entiteLabel,
  metaAction,
  versCsv,
  type CategorieAudit,
} from "@/lib/audit/actions";
import { useAuthStore } from "@/stores/authStore";
import { AuditFeed } from "./AuditFeed";

type Filtre = "tout" | "sensible" | CategorieAudit;

const FILTRES: { key: Filtre; label: string }[] = [
  { key: "tout", label: "Tout" },
  { key: "sensible", label: "Sensibles" },
  ...CATEGORIES,
];

function codesDuFiltre(f: Filtre): string | undefined {
  if (f === "tout") return undefined;
  return f === "sensible" ? codesSensibles() : codesDeCategorie(f);
}

export function AuditView() {
  const role = useAuthStore((s) => s.user?.role);
  const now = useMemo(() => today(getLocalTimeZone()), []);
  const [periode, setPeriode] = useState<DateRange>({ start: now.subtract({ days: 6 }), end: now });
  const [filtre, setFiltre] = useState<Filtre>("tout");
  const [userId, setUserId] = useState<string>("");
  const [saisie, setSaisie] = useState("");
  const [recherche, setRecherche] = useState("");

  // La recherche texte part au serveur après 400 ms sans frappe.
  useEffect(() => {
    const t = setTimeout(() => setRecherche(saisie.trim()), 400);
    return () => clearTimeout(t);
  }, [saisie]);

  const { data: usersRes } = useUsers();
  const utilisateurs = usersRes?.data ?? [];

  const params = useMemo(
    () => ({
      dateDebut: dvToISO(periode.start, false),
      dateFin: dvToISO(periode.end, true),
      action: codesDuFiltre(filtre),
      userId: userId || undefined,
      search: recherche || undefined,
    }),
    [periode, filtre, userId, recherche]
  );

  const { data, isLoading, isError, error, refetch, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } = useAuditLogs(params);

  const entrees = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);
  const total = data?.pages[0]?.meta.total ?? entrees.length;
  const acteurs = useMemo(() => new Set(entrees.filter((e) => e.userId).map((e) => e.userId)).size, [entrees]);
  const sensibles = useMemo(() => entrees.filter((e) => metaAction(e.action).sensible).length, [entrees]);

  const interdit = (error as { statusCode?: number } | null)?.statusCode === 403 || role === "VENDEUR";

  function exporter() {
    const lignes = entrees.map((e) => ({
      createdAt: e.createdAt,
      utilisateur: e.user?.email ?? "utilisateur inconnu",
      role: e.user?.role ?? "",
      action: metaAction(e.action).label,
      entite: entiteLabel(e.entityType),
      description: e.description ?? "",
    }));
    const blob = new Blob([versCsv(lignes)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <PageWrapper>
      <PageHero
        tone="out"
        icon={IconShieldLock}
        eyebrow="Administration"
        title="Journal d'audit"
        description="Qui a fait quoi, et à quelle heure : connexions, ventes, caisse, stock, produits, équipe. Les actions à risque sont signalées."
        actions={
          <Button
            variant="bordered"
            className="min-h-11 bg-surface font-semibold"
            startContent={<IconDownload size={18} aria-hidden />}
            isDisabled={entrees.length === 0}
            onPress={exporter}
          >
            Exporter (CSV)
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatTile tone="accent" icon={IconListDetails} label="Actions sur la période" value={isLoading ? "—" : <CountUp value={total} />} />
          <StatTile
            tone="cash"
            icon={IconUsers}
            label="Utilisateurs actifs"
            value={isLoading ? "—" : <CountUp value={acteurs} />}
            hint={entrees.length < total ? `parmi les ${entrees.length} affichées` : undefined}
            delay={0.05}
          />
          <StatTile
            tone="out"
            icon={IconAlertTriangle}
            label="Actions sensibles"
            value={isLoading ? "—" : <CountUp value={sensibles} />}
            hint={entrees.length < total ? `parmi les ${entrees.length} affichées` : "suppressions, annulations, écarts, prix…"}
            delay={0.1}
          />
        </div>
      </PageHero>

      <div className="flex flex-col gap-3">
        <PeriodFilter ariaLabel="Période du journal" tone="out" value={periode} onChange={setPeriode} />
        <SegmentedControl ariaLabel="Type d'action" tone="accent" value={filtre} onChange={setFiltre} options={FILTRES} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            aria-label="Rechercher dans le détail des actions"
            placeholder="Rechercher (référence, produit, e-mail…)"
            value={saisie}
            onValueChange={setSaisie}
            variant="bordered"
            startContent={<IconSearch size={16} aria-hidden className="text-text-muted" />}
            classNames={{ inputWrapper: "h-11 border-border bg-surface" }}
            isClearable
            onClear={() => setSaisie("")}
          />
          <Select
            aria-label="Filtrer par utilisateur"
            placeholder="Tous les utilisateurs"
            variant="bordered"
            selectedKeys={userId ? [userId] : []}
            onSelectionChange={(keys) => setUserId((Array.from(keys)[0] as string | undefined) ?? "")}
            classNames={{ trigger: "h-11 min-h-11 border-border bg-surface" }}
          >
            {utilisateurs.map((u) => (
              <SelectItem key={u.id}>{u.email}</SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {interdit ? (
        <EmptyRiver message="Réservé aux administrateurs" hint="Le journal d'audit n'est visible que par un compte administrateur." />
      ) : isError ? (
        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-lg border border-out-line bg-out-dim p-4 text-sm text-out-text">
          <IconAlertCircle size={20} aria-hidden className="shrink-0" />
          <span className="flex-1">Impossible de charger le journal. Vérifiez la connexion puis réessayez.</span>
          <Button size="sm" variant="flat" onPress={() => void refetch()} isLoading={isFetching}>
            Réessayer
          </Button>
        </div>
      ) : isLoading ? (
        <div role="status" aria-label="Chargement du journal" className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg border border-border bg-surface" />
          ))}
        </div>
      ) : entrees.length === 0 ? (
        <EmptyRiver
          message="Aucune action sur cette période"
          hint="Élargissez la période ou retirez un filtre. Les actions sont enregistrées à partir de la mise en service du journal complet."
        />
      ) : (
        <>
          <AuditFeed entrees={entrees} />
          {hasNextPage && (
            <div className="flex justify-center">
              <Button variant="bordered" className="min-h-11 font-semibold" isLoading={isFetchingNextPage} onPress={() => void fetchNextPage()}>
                Charger plus ({entrees.length} sur {total})
              </Button>
            </div>
          )}
        </>
      )}
    </PageWrapper>
  );
}
