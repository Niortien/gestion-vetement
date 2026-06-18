"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Chip, Spinner } from "@heroui/react";
import { PageWrapper } from "@/components/common/PageWrapper";
import { useVentes } from "@/features/rapports/query/rapports-queries";
import { useFluxTresorerie } from "@/features/rapports/query/rapports-queries";
import { useTopProduits } from "@/features/rapports/query/rapports-queries";
import { useStockValeur } from "@/features/rapports/query/rapports-queries";
import { useStockAlertes } from "@/features/stock/query/stock-queries";
import { useResumeJour } from "@/features/caisse/query/caisse-queries";
import { useUiStore, type SortiePeriode, type RapportGroupBy } from "@/stores/uiStore";
import { getPeriodeRange } from "@/lib/dateUtils";
import { ActiviteKpiCards } from "./ActiviteKpiCards";
import { ActiviteTopProduits } from "./ActiviteTopProduits";
import { ActivitePaiementBreakdown } from "./ActivitePaiementBreakdown";

const ActiviteFluxChart = dynamic(
  () => import("./ActiviteFluxChart").then((m) => m.ActiviteFluxChart),
  {
    loading: () => (
      <div className="flex h-60 items-center justify-center">
        <Spinner size="sm" />
      </div>
    ),
    ssr: false,
  }
);

const ActiviteVentesChart = dynamic(
  () => import("./ActiviteVentesChart").then((m) => m.ActiviteVentesChart),
  {
    loading: () => (
      <div className="flex h-52 items-center justify-center">
        <Spinner size="sm" />
      </div>
    ),
    ssr: false,
  }
);

const PERIODES: { key: SortiePeriode; label: string }[] = [
  { key: "7j", label: "7 jours" },
  { key: "30j", label: "30 jours" },
  { key: "90j", label: "90 jours" },
];

const GROUP_BYS: { key: RapportGroupBy; label: string }[] = [
  { key: "jour", label: "/ Jour" },
  { key: "semaine", label: "/ Semaine" },
  { key: "mois", label: "/ Mois" },
];

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-[var(--color-surface)] p-4">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-muted">
        {title}
      </h2>
      {children}
    </div>
  );
}

export function ActiviteView() {
  const activitePeriode = useUiStore((s) => s.activitePeriode);
  const setActivitePeriode = useUiStore((s) => s.setActivitePeriode);
  const activiteGroupBy = useUiStore((s) => s.activiteGroupBy);
  const setActiviteGroupBy = useUiStore((s) => s.setActiviteGroupBy);

  const { dateDebut, dateFin } = useMemo(
    () => getPeriodeRange(activitePeriode),
    [activitePeriode]
  );
  const params = useMemo(
    () => ({ dateDebut, dateFin, groupBy: activiteGroupBy }),
    [dateDebut, dateFin, activiteGroupBy]
  );

  const { data: ventesData, isLoading: ventesLoading } = useVentes(params);
  const { data: fluxData, isLoading: fluxLoading } = useFluxTresorerie(params);
  const { data: topData, isLoading: topLoading } = useTopProduits({ ...params, limit: 10 });
  const { data: stockValeur } = useStockValeur();
  const { data: alertes } = useStockAlertes();
  const { data: resume } = useResumeJour();

  const ventes = ventesData?.data ?? [];
  const flux = fluxData?.data ?? [];
  const topProduits = topData?.data ?? [];

  const totalVentes = useMemo(
    () => ventes.reduce((acc, v) => acc + parseFloat(v.totalVentes || "0"), 0),
    [ventes]
  );
  const totalTransactions = useMemo(
    () => ventes.reduce((acc, v) => acc + v.nombreTransactions, 0),
    [ventes]
  );
  const cashIn = useMemo(
    () => flux.reduce((acc, f) => acc + parseFloat(f.entrees || "0"), 0),
    [flux]
  );
  const cashOut = useMemo(
    () => flux.reduce((acc, f) => acc + parseFloat(f.sorties || "0"), 0),
    [flux]
  );
  const valeurStock = parseFloat(stockValeur?.data?.valeurTotaleVente || "0");
  const nbAlertes = alertes?.data?.length ?? 0;

  const isKpiLoading = ventesLoading || fluxLoading;

  return (
    <PageWrapper>
      {/* En-tête */}
      <div className="flex flex-wrap items-end justify-between gap-4 rounded-xl border border-border/80 bg-[linear-gradient(135deg,rgba(143,126,245,0.20),rgba(34,54,81,0.50))] p-4 md:p-5">
        <div>
          <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-cash)] md:text-5xl">
            Activité
          </h1>
          <p className="mt-1 text-sm text-text-muted">Tableau de bord des performances</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Période */}
          <div className="flex gap-1.5">
            {PERIODES.map((p) => (
              <Chip
                key={p.key}
                variant="flat"
                className={
                  activitePeriode === p.key
                    ? "cursor-pointer bg-[var(--color-cash)] font-semibold text-black"
                    : "cursor-pointer bg-[var(--color-surface-high)] text-text-muted"
                }
                onClick={() => setActivitePeriode(p.key)}
              >
                {p.label}
              </Chip>
            ))}
          </div>
          {/* Granularité */}
          <div className="flex gap-1.5">
            {GROUP_BYS.map((g) => (
              <Chip
                key={g.key}
                variant="flat"
                className={
                  activiteGroupBy === g.key
                    ? "cursor-pointer bg-[var(--color-surface-high)] font-semibold text-text"
                    : "cursor-pointer bg-[var(--color-surface)] text-text-dim"
                }
                onClick={() => setActiviteGroupBy(g.key)}
              >
                {g.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <ActiviteKpiCards
        totalVentes={totalVentes}
        totalTransactions={totalTransactions}
        cashIn={cashIn}
        cashOut={cashOut}
        valeurStock={valeurStock}
        nbAlertes={nbAlertes}
        isLoading={isKpiLoading}
      />

      {/* Flux de trésorerie + Top produits */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionCard title={`Flux de trésorerie — ${activitePeriode}`}>
            <ActiviteFluxChart data={flux} groupBy={activiteGroupBy} />
          </SectionCard>
        </div>
        <SectionCard title={`Top produits — ${activitePeriode}`}>
          <ActiviteTopProduits data={topProduits} isLoading={topLoading} />
        </SectionCard>
      </div>

      {/* Ventes par période */}
      <SectionCard title={`Ventes par ${activiteGroupBy} — ${activitePeriode}`}>
        <ActiviteVentesChart data={ventes} groupBy={activiteGroupBy} />
      </SectionCard>

      {/* Session du jour — paiements */}
      <SectionCard title="Répartition paiements — session du jour">
        {resume?.data ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-text-muted">Ventes : </span>
                <span className="[font-family:var(--font-mono)] font-semibold text-[var(--color-cash)]">
                  {parseFloat(resume.data.totalVentes || "0").toLocaleString("fr-FR")} FCFA
                </span>
              </div>
              <div>
                <span className="text-text-muted">Bénéfice : </span>
                <span
                  className={`[font-family:var(--font-mono)] font-semibold ${
                    parseFloat(resume.data.beneficeNet || "0") >= 0
                      ? "text-[var(--color-in)]"
                      : "text-[var(--color-out)]"
                  }`}
                >
                  {parseFloat(resume.data.beneficeNet || "0").toLocaleString("fr-FR")} FCFA
                </span>
              </div>
              <div>
                <span className="text-text-muted">Transactions : </span>
                <span className="[font-family:var(--font-mono)] font-semibold text-text">
                  {resume.data.totalTransactions}
                </span>
              </div>
            </div>
            <ActivitePaiementBreakdown resume={resume.data} />
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-text-muted">Aucune session ouverte aujourd&apos;hui</p>
        )}
      </SectionCard>
    </PageWrapper>
  );
}
