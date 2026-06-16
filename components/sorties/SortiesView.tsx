"use client";

import { FeedDensityToggle } from "@/components/common/FeedDensityToggle";
import { PageWrapper } from "@/components/common/PageWrapper";
import { useSortiesList } from "@/features/sorties/query/sorties-queries";
import { useUiStore } from "@/stores/uiStore";
import { SortieFeed } from "./SortieFeed";
import { SortieStatChips } from "./SortieStatChips";

export function SortiesView() {
  const periode = useUiStore((state) => state.sortiePeriode);
  const density = useUiStore((state) => state.feedDensity);
  const setPeriode = useUiStore((state) => state.setSortiePeriode);
  const { data } = useSortiesList({ limit: 20 });
  const items = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <PageWrapper>
      <div className="rounded-xl border border-border/80 bg-[linear-gradient(120deg,rgba(255,77,109,0.18),rgba(34,54,81,0.42))] p-4 md:p-5">
        <h1 className="font-[var(--font-display)] text-4xl md:text-5xl">Sorties</h1>
      </div>
      <SortieStatChips selected={periode} onSelect={setPeriode} />
      <FeedDensityToggle />
      <SortieFeed items={items} density={density} />
    </PageWrapper>
  );
}
