"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Chip, Spinner } from "@heroui/react";
import { IconArrowLeft } from "@tabler/icons-react";
import { PageWrapper } from "@/components/common/PageWrapper";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { useRecetteHebdomadaire } from "@/features/rapports/query/rapports-queries";
import { formatSemaineLabel } from "./formatSemaine";

const RecetteHebdomadaireChart = dynamic(
  () => import("./RecetteHebdomadaireChart").then((m) => m.RecetteHebdomadaireChart),
  {
    loading: () => (
      <div className="flex h-60 items-center justify-center">
        <Spinner size="sm" />
      </div>
    ),
    ssr: false,
  }
);

const NB_SEMAINES_OPTIONS = [
  { key: 8, label: "8 semaines" },
  { key: 12, label: "12 semaines" },
  { key: 26, label: "26 semaines" },
  { key: 52, label: "52 semaines" },
];

export function RecetteHebdomadaireView() {
  const [nbSemaines, setNbSemaines] = useState(12);

  const params = useMemo(() => {
    const fin = new Date();
    const debut = new Date();
    debut.setDate(debut.getDate() - nbSemaines * 7);
    return {
      dateDebut: debut.toISOString().slice(0, 10),
      dateFin: fin.toISOString().slice(0, 10),
    };
  }, [nbSemaines]);

  const { data, isLoading } = useRecetteHebdomadaire(params);
  const semaines = Array.isArray(data?.data) ? data.data : [];

  const totaux = useMemo(
    () =>
      semaines.reduce(
        (acc, s) => ({
          ventes: acc.ventes + parseFloat(s.totalVentes || "0"),
          depenses: acc.depenses + parseFloat(s.totalDepenses || "0"),
          net: acc.net + parseFloat(s.recetteNette || "0"),
        }),
        { ventes: 0, depenses: 0, net: 0 }
      ),
    [semaines]
  );

  return (
    <PageWrapper>
      <div className="flex flex-col gap-2">
        <Link
          href="/activite"
          className="flex w-fit items-center gap-1.5 text-xs text-text-muted hover:text-text"
        >
          <IconArrowLeft size={14} />
          Retour à l&apos;activité
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-[var(--font-display)] text-2xl text-[var(--color-cash)] md:text-3xl">
            Recettes par semaine
          </h1>
          <div className="flex flex-wrap gap-1.5">
            {NB_SEMAINES_OPTIONS.map((opt) => (
              <Chip
                key={opt.key}
                variant="flat"
                className={
                  nbSemaines === opt.key
                    ? "cursor-pointer bg-[var(--color-cash)] font-semibold text-black"
                    : "cursor-pointer bg-[var(--color-surface-high)] text-text-muted hover:text-text"
                }
                onClick={() => setNbSemaines(opt.key)}
              >
                {opt.label}
              </Chip>
            ))}
          </div>
        </div>
        <p className="text-xs text-text-muted">
          Recette nette = ventes de la semaine moins les dépenses enregistrées sur la même semaine.
        </p>
      </div>

      {/* Totaux de la période */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border/60 bg-[var(--color-surface)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">Total ventes</p>
          <CurrencyDisplay montant={String(totaux.ventes)} tone="in" size="lg" className="mt-1" />
        </div>
        <div className="rounded-xl border border-border/60 bg-[var(--color-surface)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">Total dépenses</p>
          <CurrencyDisplay montant={String(totaux.depenses)} tone="out" size="lg" className="mt-1" />
        </div>
        <div className="rounded-xl border border-border/60 bg-[var(--color-surface)] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">Recette nette</p>
          <CurrencyDisplay montant={String(totaux.net)} tone="cash" size="lg" className="mt-1" />
        </div>
      </div>

      {/* Graphique */}
      <div className="rounded-xl border border-border/60 bg-[var(--color-surface)] p-4">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-muted">
          Évolution par semaine
        </h2>
        {isLoading ? (
          <div className="flex h-60 items-center justify-center">
            <Spinner size="sm" />
          </div>
        ) : (
          <RecetteHebdomadaireChart data={semaines} />
        )}
      </div>

      {/* Détail par semaine */}
      <div className="rounded-xl border border-border/60 bg-[var(--color-surface)] p-4">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-muted">Détail</h2>
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Spinner size="sm" />
          </div>
        ) : semaines.length === 0 ? (
          <p className="py-4 text-center text-sm text-text-muted">Aucune donnée sur cette période</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-[11px] uppercase tracking-widest text-text-muted">
                  <th className="py-2 pr-4 font-semibold">Semaine</th>
                  <th className="py-2 pr-4 font-semibold">Ventes</th>
                  <th className="py-2 pr-4 font-semibold">Dépenses</th>
                  <th className="py-2 pr-4 font-semibold">Recette nette</th>
                </tr>
              </thead>
              <tbody>
                {[...semaines].reverse().map((s) => {
                  const net = parseFloat(s.recetteNette || "0");
                  return (
                    <tr key={s.semaine} className="border-b border-border/30 last:border-0">
                      <td className="py-2 pr-4 text-text">{formatSemaineLabel(s.semaine)}</td>
                      <td className="py-2 pr-4">
                        <CurrencyDisplay montant={s.totalVentes} size="sm" tone="in" />
                      </td>
                      <td className="py-2 pr-4">
                        <CurrencyDisplay montant={s.totalDepenses} size="sm" tone="out" />
                      </td>
                      <td className="py-2 pr-4">
                        <CurrencyDisplay montant={s.recetteNette} size="sm" tone={net >= 0 ? "cash" : "out"} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
