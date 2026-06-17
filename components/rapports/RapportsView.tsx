"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Chip, Spinner } from "@heroui/react";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { PageWrapper } from "@/components/common/PageWrapper";
import { useFluxTresorerie, useStockValeur, useTopProduits, useVentes } from "@/features/rapports/query/rapports-queries";
import { useUiStore } from "@/stores/uiStore";
import { getPeriodeRange, type PeriodeShorthand } from "@/lib/dateUtils";

const TrendChart = dynamic(() => import("./RapportTrendChart").then((m) => m.RapportTrendChart), {
  ssr: false,
});

const CategoryChart = dynamic(
  () => import("./RapportCategoryChart").then((m) => m.RapportCategoryChart),
  { ssr: false }
);

const ExportBar = dynamic(() => import("./RapportExportBar").then((m) => m.RapportExportBar), {
  ssr: false,
});

const PERIODES: { key: PeriodeShorthand; label: string }[] = [
  { key: "7j", label: "7 jours" },
  { key: "30j", label: "30 jours" },
  { key: "90j", label: "90 jours" },
];

export function RapportsView() {
  const [shorthand, setShorthand] = useState<PeriodeShorthand>("30j");
  const setRapportPeriode = useUiStore((s) => s.setRapportPeriode);

  const handlePeriodeChange = (p: PeriodeShorthand) => {
    setShorthand(p);
    const { dateDebut, dateFin } = getPeriodeRange(p);
    setRapportPeriode({ debut: dateDebut, fin: dateFin, groupBy: "jour" });
  };

  const { dateDebut, dateFin } = getPeriodeRange(shorthand);
  const range = { dateDebut, dateFin, groupBy: "jour" as const };

  const { data: ventesData, isLoading: ventesLoading } = useVentes(range);
  const { data: stockData, isLoading: stockLoading } = useStockValeur();
  const { data: topProduitsData, isLoading: topProduitsLoading } = useTopProduits({
    dateDebut: range.dateDebut,
    dateFin: range.dateFin,
  });
  const { data: fluxData, isLoading: fluxLoading } = useFluxTresorerie({
    dateDebut: range.dateDebut,
    dateFin: range.dateFin,
  });

  const ventes = ventesData?.data ?? [];
  const stockValeur = stockData?.data?.valeurTotaleAchat ?? "0";
  const topProduits = topProduitsData?.data ?? [];
  const fluxArray = fluxData?.data ?? [];

  const totalEntrees = fluxArray
    .reduce((sum, item) => sum + parseFloat(item.entrees || "0"), 0)
    .toFixed(2);
  const totalSorties = fluxArray
    .reduce((sum, item) => sum + parseFloat(item.sorties || "0"), 0)
    .toFixed(2);

  const isLoading = ventesLoading || stockLoading || topProduitsLoading || fluxLoading;

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-border/80 bg-surface p-6">
          <Spinner color="warning" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="rounded-xl border border-border/80 bg-[linear-gradient(120deg,rgba(255,212,71,0.12),rgba(45,69,103,0.38))] p-4 md:p-5">
        <h1 className="font-[var(--font-display)] text-4xl md:text-5xl">Rapports</h1>
        <p className="mt-2 text-sm text-text-muted">
          Synthèse des {shorthand === "7j" ? "7" : shorthand === "30j" ? "30" : "90"} derniers jours
        </p>
      </div>

      {/* Filtres période */}
      <div className="flex gap-2">
        {PERIODES.map((p) => (
          <Chip
            key={p.key}
            variant="flat"
            className={
              shorthand === p.key
                ? "cursor-pointer bg-accent font-semibold text-black"
                : "cursor-pointer bg-[var(--color-surface-high)] text-text"
            }
            onClick={() => handlePeriodeChange(p.key)}
          >
            {p.label}
          </Chip>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-border/80 bg-surface p-4">
          <p className="text-sm text-text-muted">Valeur du stock (achat)</p>
          <CurrencyDisplay montant={stockValeur} size="lg" tone="accent" className="mt-2" />
        </div>
        <div className="rounded-lg border border-border/80 bg-surface p-4">
          <p className="text-sm text-text-muted">Coût total entrées</p>
          <CurrencyDisplay montant={totalEntrees} size="lg" tone="in" className="mt-2" />
        </div>
        <div className="rounded-lg border border-border/80 bg-surface p-4">
          <p className="text-sm text-text-muted">Total sorties</p>
          <CurrencyDisplay montant={totalSorties} size="lg" tone="out" className="mt-2" />
        </div>
      </div>

      <TrendChart
        data={ventes.map((item) => ({ periode: item.periode, total: Number(item.totalVentes) }))}
      />
      <CategoryChart
        data={ventes.map((item) => ({ name: item.periode, value: item.nombreTransactions }))}
      />

      <div className="rounded-lg border border-border/80 bg-surface p-4">
        <h2 className="mb-3 text-lg font-semibold">Top produits</h2>
        <div className="space-y-2">
          {topProduits.length > 0 ? (
            topProduits.slice(0, 5).map((item) => (
              <div
                key={item.produitId}
                className="flex items-center justify-between rounded-md border border-border/70 px-3 py-2"
              >
                <span>{item.nom}</span>
                <span className="text-sm text-text-muted">
                  {item.quantiteTotale} vendus · {item.montantTotal} FCFA
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-text-muted">Aucune donnée disponible pour cette période.</p>
          )}
        </div>
      </div>

      <ExportBar />
    </PageWrapper>
  );
}
