"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { IconMinus, IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { JOURS } from "@/lib/analyse";
import type { ProduitStat } from "@/lib/analyse";

const VISIBLES = 10;

function Tendance({ p }: { p: ProduitStat }) {
  if (p.tendance === "hausse") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-in-dim px-2 py-0.5 text-xs font-semibold text-in-text">
        <IconTrendingUp size={12} aria-hidden />
        {p.variationPct === null ? "Nouveau" : `+${Math.round(p.variationPct)} %`}
      </span>
    );
  }
  if (p.tendance === "baisse") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-out-dim px-2 py-0.5 text-xs font-semibold text-out-text">
        <IconTrendingDown size={12} aria-hidden />
        {Math.round(p.variationPct ?? 0)} %
      </span>
    );
  }
  if (p.tendance === "stable") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-surface-high px-2 py-0.5 text-xs font-semibold text-text-muted">
        <IconMinus size={12} aria-hidden />
        Stable
      </span>
    );
  }
  return <span className="text-xs text-text-muted">Trop peu de ventes</span>;
}

/** Classement des produits par chiffre d'affaires, avec part, meilleur jour et tendance. */
export function AnalyseProduitsPhares({ produits }: { produits: ProduitStat[] }) {
  const [tout, setTout] = useState(false);
  const lignes = tout ? produits : produits.slice(0, VISIBLES);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm">
          <caption className="sr-only">Produits classés par chiffre d&apos;affaires</caption>
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-text-muted">
              <th scope="col" className="py-2 pr-2 font-semibold">#</th>
              <th scope="col" className="py-2 pr-3 font-semibold">Produit</th>
              <th scope="col" className="py-2 pr-3 text-right font-semibold">Vendus</th>
              <th scope="col" className="py-2 pr-3 text-right font-semibold">CA</th>
              <th scope="col" className="hidden py-2 pr-3 text-right font-semibold sm:table-cell">Part</th>
              <th scope="col" className="hidden py-2 pr-3 font-semibold md:table-cell">Meilleur jour</th>
              <th scope="col" className="py-2 font-semibold">Tendance</th>
            </tr>
          </thead>
          <tbody>
            {lignes.map((p, i) => (
              <tr key={p.produitId} className="border-b border-border last:border-0 transition-colors duration-150 hover:bg-surface-high">
                <td className={cn("py-2.5 pr-2 font-mono text-xs", i < 3 ? "font-bold text-text" : "text-text-muted")}>{i + 1}</td>
                <td className="max-w-[180px] truncate py-2.5 pr-3 font-medium text-text">{p.nom}</td>
                <td className="py-2.5 pr-3 text-right font-mono tabular-nums">{p.quantite}</td>
                <td className="py-2.5 pr-3 text-right font-mono tabular-nums">{Math.round(p.ca).toLocaleString("fr-FR")}</td>
                <td className="hidden py-2.5 pr-3 text-right sm:table-cell">
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden className="h-1.5 w-12 overflow-hidden rounded-full bg-surface-high">
                      <span className="block h-full rounded-full bg-accent" style={{ width: `${Math.max(p.part * 100, 3)}%` }} />
                    </span>
                    <span className="w-10 text-right font-mono text-xs tabular-nums">{Math.round(p.part * 100)} %</span>
                  </span>
                </td>
                <td className="hidden py-2.5 pr-3 text-text-muted md:table-cell">{p.meilleurJour === null ? "—" : JOURS[p.meilleurJour]}</td>
                <td className="py-2.5"><Tendance p={p} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {produits.length > VISIBLES && (
        <div className="mt-3 flex justify-center">
          <Button size="sm" variant="light" className="font-semibold" onPress={() => setTout((v) => !v)}>
            {tout ? "Réduire le classement" : `Voir les ${produits.length} produits`}
          </Button>
        </div>
      )}
    </div>
  );
}
