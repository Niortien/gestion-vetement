"use client";

import dynamic from "next/dynamic";
import { PageWrapper } from "@/components/common/PageWrapper";
import { useResumeJour } from "@/features/caisse/query/caisse-queries";
import { useVentes, useTopProduits, useStockValeur } from "@/features/rapports/query/rapports-queries";
import { useStockAlertes } from "@/features/stock/query/stock-queries";
import { useEntreesList } from "@/features/entrees/query/entrees-queries";
import { useSortiesList } from "@/features/sorties/query/sorties-queries";
import { getPeriodeRange } from "@/lib/dateUtils";
import { DashboardKpiGrid } from "./DashboardKpiGrid";
import { DashboardTopProduits } from "./DashboardTopProduits";
import { DashboardActivityFeed } from "./DashboardActivityFeed";

const DashboardSparkline = dynamic(
  () => import("./DashboardSparkline").then((m) => m.DashboardSparkline),
  { ssr: false }
);

export function DashboardView() {
  const { dateDebut, dateFin } = getPeriodeRange("7j");
  const params7j = { dateDebut, dateFin };

  const { data: resumeData, isLoading: resumeLoading } = useResumeJour();
  const { data: stockValeurData } = useStockValeur();
  const { data: alertesData } = useStockAlertes();
  const { data: ventesData, isLoading: ventesLoading } = useVentes({
    ...params7j,
    groupBy: "jour",
  });
  const { data: topProduitsData, isLoading: topLoading } = useTopProduits({ ...params7j });
  const { data: entreesData, isLoading: entreesLoading } = useEntreesList({ limit: 5 });
  const { data: sortiesData, isLoading: sortiesLoading } = useSortiesList({ limit: 5 });

  const resume = resumeData?.data;
  const stockValeur = stockValeurData?.data?.valeurTotaleAchat ?? "0";
  const alertesCount = alertesData?.data?.length ?? 0;
  const ventes7j = ventesData?.data ?? [];
  const topProduits = topProduitsData?.data ?? [];
  const entrees = entreesData?.pages.flatMap((p) => p.data) ?? [];
  const sorties = sortiesData?.pages.flatMap((p) => p.data) ?? [];

  const activityLoading = entreesLoading || sortiesLoading;

  return (
    <PageWrapper>
      {/* Header */}
      <div className="rounded-xl border border-border/80 bg-[linear-gradient(120deg,rgba(255,212,71,0.14),rgba(34,40,81,0.55))] p-4 md:p-5">
        <h1 className="font-[var(--font-display)] text-4xl text-accent md:text-5xl">Dashboard</h1>
        <p className="mt-1 text-sm text-text-muted">Vue d&apos;ensemble de l&apos;activité</p>
      </div>

      {/* KPIs */}
      <DashboardKpiGrid
        resume={resume}
        stockValeur={stockValeur}
        alertesCount={alertesCount}
        isLoading={resumeLoading}
      />

      {/* Sparkline + Top produits */}
      <div className="grid gap-4 md:grid-cols-2">
        {!ventesLoading && <DashboardSparkline data={ventes7j} />}
        {ventesLoading && (
          <div className="h-40 animate-pulse rounded-xl border border-border/40 bg-[var(--color-surface-high)]" />
        )}
        <DashboardTopProduits produits={topProduits} isLoading={topLoading} />
      </div>

      {/* Activity feed */}
      <DashboardActivityFeed
        entrees={entrees}
        sorties={sorties}
        isLoading={activityLoading}
      />
    </PageWrapper>
  );
}
