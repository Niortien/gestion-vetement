"use client";

import { Tabs, Tab } from "@heroui/react";
import { FeedDensityToggle } from "@/components/common/FeedDensityToggle";
import { PageWrapper } from "@/components/common/PageWrapper";
import { useEntreesList } from "@/features/entrees/query/entrees-queries";
import { useAnnulerEntree } from "@/features/entrees/mutation/entrees-mutations";
import { useUiStore } from "@/stores/uiStore";
import { EntreeFeed } from "./EntreeFeed";
import { EntreeImportZone } from "./EntreeImportZone";

export function EntreesView() {
  const density = useUiStore((state) => state.feedDensity);
  const { data } = useEntreesList({ limit: 20 });
  const cancelMutation = useAnnulerEntree();
  const items = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <PageWrapper>
      <div className="rounded-xl border border-border/80 bg-[linear-gradient(120deg,rgba(57,211,83,0.18),rgba(34,54,81,0.42))] p-4 md:p-5">
        <h1 className="font-[var(--font-display)] text-4xl md:text-5xl text-in">Entrees</h1>
      </div>
      <Tabs variant="light" aria-label="Periode" classNames={{ tabList: "bg-[var(--color-surface-high)]" }}>
        <Tab key="7j" title="7j" />
        <Tab key="30j" title="30j" />
        <Tab key="90j" title="90j" />
      </Tabs>
      <FeedDensityToggle />
      <EntreeFeed items={items} density={density} onCancel={(id) => cancelMutation.mutate(id)} />
      <EntreeImportZone />
    </PageWrapper>
  );
}
