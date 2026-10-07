"use client";

import { CountUp } from "@/components/common/CountUp";
import { FeedDensityToggle } from "@/components/common/FeedDensityToggle";
import { PageHero } from "@/components/common/PageHero";
import { PageWrapper } from "@/components/common/PageWrapper";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { StatTile } from "@/components/common/StatTile";
import { useStockAlertes, useStockList } from "@/features/stock/query/stock-queries";
import { useUiStore } from "@/stores/uiStore";
import { StockAlertPanel } from "./StockAlertPanel";
import { StockTimeline } from "./StockTimeline";

export function StockView() {
  const filters = useUiStore((state) => state.stockFiltre);
  const setStockFiltre = useUiStore((state) => state.setStockFiltre);
  const density = useUiStore((state) => state.feedDensity);
  const { data } = useStockList({
    alerte: filters.alerte,
    taille: filters.taille,
    categorieId: filters.categorieId,
  });
  const { data: alertes } = useStockAlertes();

  const items = data?.pages.flatMap((page) => page.data) ?? [];
  const total = items.length;
  const alertesCount = alertes?.data?.length ?? 0;
  const unites = items.reduce((sum, item) => sum + item.quantiteStock, 0);

  return (
    <PageWrapper>
      <PageHero
        title="Stock"
        description="Ce qui est en rayon, variante par variante. Le repère noir de chaque barre marque le seuil d'alerte."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatTile
            tone="accent"
            label="Variantes affichées"
            value={<CountUp value={total} />}
            hint={`${unites.toLocaleString("fr-FR")} unités au total`}
          />
          <StatTile
            tone="out"
            label="À réapprovisionner"
            value={<CountUp value={alertesCount} />}
            hint={alertesCount > 0 ? "Sous le seuil d'alerte" : "Rien d'urgent"}
            delay={0.05}
          />
          <StatTile
            tone="in"
            label="Niveau confortable"
            value={<CountUp value={Math.max(total - alertesCount, 0)} />}
            hint="Au-dessus du seuil"
            delay={0.1}
          />
        </div>
      </PageHero>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl
          ariaLabel="Filtrer le stock"
          tone={filters.alerte ? "out" : "accent"}
          value={filters.alerte ? "alerte" : "tous"}
          onChange={(key) => setStockFiltre({ ...filters, alerte: key === "alerte" ? true : undefined })}
          options={[
            { key: "tous", label: "Tous" },
            { key: "alerte", label: "En alerte", count: alertesCount },
          ]}
        />
        <FeedDensityToggle />
      </div>

      <StockAlertPanel alertes={alertes?.data ?? []} />
      <StockTimeline items={items} density={density} />
    </PageWrapper>
  );
}
