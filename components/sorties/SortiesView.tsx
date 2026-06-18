"use client";

import { useMemo, useState } from "react";
import { Button, Chip } from "@heroui/react";
import { PageWrapper } from "@/components/common/PageWrapper";
import { useSortiesList } from "@/features/sorties/query/sorties-queries";
import { useUiStore, type SortiePeriode } from "@/stores/uiStore";
import { TypeSortie } from "@/types";
import { getPeriodeRange } from "@/lib/dateUtils";
import { SortiesTable } from "./SortiesTable";
import { SortieCreatePanel } from "./SortieCreatePanel";

const PERIODES: { key: SortiePeriode; label: string }[] = [
  { key: "7j", label: "7j" },
  { key: "30j", label: "30j" },
  { key: "90j", label: "90j" },
];

const TYPE_FILTERS: { key: TypeSortie | null; label: string }[] = [
  { key: null, label: "Tous" },
  { key: TypeSortie.VENTE, label: "Ventes" },
  { key: TypeSortie.PERTE, label: "Pertes" },
  { key: TypeSortie.DON, label: "Dons" },
  { key: TypeSortie.RETOUR_FOURNISSEUR, label: "Retours" },
];

export function SortiesView() {
  const [panelOpen, setPanelOpen] = useState(false);
  const periode = useUiStore((s) => s.sortiePeriode);
  const setPeriode = useUiStore((s) => s.setSortiePeriode);
  const typeFilter = useUiStore((s) => s.sortieTypeFilter);
  const setTypeFilter = useUiStore((s) => s.setSortieTypeFilter);
  const { dateDebut } = useMemo(() => getPeriodeRange(periode), [periode]);
  const { data } = useSortiesList({
    limit: 50,
    dateDebut,
    ...(typeFilter ? { type: typeFilter } : {}),
  });
  const items = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <>
      <SortieCreatePanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} />

      <PageWrapper>
        <div className="flex items-end justify-between rounded-xl border border-border/80 bg-[linear-gradient(120deg,rgba(255,77,109,0.18),rgba(34,54,81,0.42))] p-4 md:p-5">
          <div>
            <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-out)] md:text-5xl">
              Sorties
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              {items.length} sortie{items.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button
            className="bg-[var(--color-out)] font-semibold text-white"
            onPress={() => setPanelOpen(true)}
          >
            + Nouvelle sortie
          </Button>
        </div>

        {/* Filtres période */}
        <div className="flex flex-wrap gap-2">
          {PERIODES.map((p) => (
            <Chip
              key={p.key}
              variant="flat"
              className={
                periode === p.key
                  ? "cursor-pointer bg-[var(--color-out)] font-semibold text-white"
                  : "cursor-pointer bg-[var(--color-surface-high)] text-text"
              }
              onClick={() => setPeriode(p.key)}
            >
              {p.label}
            </Chip>
          ))}
        </div>

        {/* Filtres type */}
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((f) => (
            <Chip
              key={String(f.key)}
              variant="flat"
              className={
                typeFilter === f.key
                  ? "cursor-pointer bg-accent font-semibold text-black"
                  : "cursor-pointer bg-[var(--color-surface-high)] text-text-muted"
              }
              onClick={() => setTypeFilter(f.key)}
            >
              {f.label}
            </Chip>
          ))}
        </div>

        <SortiesTable data={items} />
      </PageWrapper>
    </>
  );
}
