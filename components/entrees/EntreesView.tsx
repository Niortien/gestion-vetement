"use client";

import { useState } from "react";
import { Button, Chip } from "@heroui/react";
import { FeedDensityToggle } from "@/components/common/FeedDensityToggle";
import { PageWrapper } from "@/components/common/PageWrapper";
import { useEntreesList } from "@/features/entrees/query/entrees-queries";
import { useAnnulerEntree } from "@/features/entrees/mutation/entrees-mutations";
import { useUiStore, type SortiePeriode } from "@/stores/uiStore";
import { getPeriodeRange } from "@/lib/dateUtils";
import { EntreeFeed } from "./EntreeFeed";
import { EntreeCreatePanel } from "./EntreeCreatePanel";

const PERIODES: { key: SortiePeriode; label: string }[] = [
  { key: "7j", label: "7j" },
  { key: "30j", label: "30j" },
  { key: "90j", label: "90j" },
];

export function EntreesView() {
  const [panelOpen, setPanelOpen] = useState(false);
  const density = useUiStore((s) => s.feedDensity);
  const periode = useUiStore((s) => s.entreePeriode);
  const setPeriode = useUiStore((s) => s.setEntreePeriode);
  const cancelMutation = useAnnulerEntree();

  const { dateDebut, dateFin } = getPeriodeRange(periode);
  const { data } = useEntreesList({ limit: 20, dateDebut, dateFin });
  const items = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <>
      <EntreeCreatePanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} />

      <PageWrapper>
        <div className="flex items-end justify-between rounded-xl border border-border/80 bg-[linear-gradient(120deg,rgba(57,211,83,0.18),rgba(34,54,81,0.42))] p-4 md:p-5">
          <div>
            <h1 className="font-[var(--font-display)] text-4xl text-in md:text-5xl">Entrées</h1>
            <p className="mt-1 text-sm text-text-muted">{items.length} entrée{items.length !== 1 ? "s" : ""}</p>
          </div>
          <Button
            className="bg-in font-semibold text-black"
            onPress={() => setPanelOpen(true)}
          >
            + Nouvelle entrée
          </Button>
        </div>

        {/* Période */}
        <div className="flex gap-2">
          {PERIODES.map((p) => (
            <Chip
              key={p.key}
              variant="flat"
              className={
                periode === p.key
                  ? "cursor-pointer bg-in text-black font-semibold"
                  : "cursor-pointer bg-[var(--color-surface-high)] text-text"
              }
              onClick={() => setPeriode(p.key)}
            >
              {p.label}
            </Chip>
          ))}
        </div>

        <FeedDensityToggle />
        <EntreeFeed items={items} density={density} onCancel={(id) => cancelMutation.mutate(id)} />
      </PageWrapper>
    </>
  );
}
