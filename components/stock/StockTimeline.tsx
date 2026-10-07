"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { EmptyRiver } from "@/components/common/EmptyRiver";
import { cn } from "@/lib/utils";
import type { StockItem } from "@/types";

interface StockTimelineProps {
  items: StockItem[];
  density?: "compact" | "cozy";
}

/** Niveau de chaque variante : barre pleine à 3× le seuil, repère noir au seuil d'alerte. */
function Niveau({ item }: { item: StockItem }) {
  const max = Math.max(item.seuilAlerte * 3, 1);
  const ratio = Math.min(1, item.quantiteStock / max);
  const alerte = item.quantiteStock <= item.seuilAlerte;

  return (
    <div className="flex min-w-[150px] items-center gap-2.5">
      <div
        role="meter"
        aria-label={`Niveau de stock de ${item.produit?.nom ?? "la variante"}`}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={item.quantiteStock}
        className="relative h-2.5 flex-1 rounded-full bg-surface-high"
      >
        <i
          className={cn("block h-full rounded-full", alerte ? "bg-out" : "bg-text")}
          style={{ width: `${Math.max(ratio * 100, item.quantiteStock > 0 ? 4 : 0)}%` }}
        />
        <b aria-hidden className="absolute -top-1 h-[18px] w-0.5 rounded-sm bg-text" style={{ left: `${(item.seuilAlerte / max) * 100}%` }} />
      </div>
      <span className="font-bold tabular-nums">{item.quantiteStock}</span>
    </div>
  );
}

function Etat({ item }: { item: StockItem }) {
  if (item.quantiteStock <= 0) return <span className="inline-flex min-h-[26px] items-center rounded-full bg-[#0C0C0E] px-2.5 text-[12.5px] font-bold text-white">Rupture</span>;
  if (item.quantiteStock === 1)
    return <span className="inline-flex min-h-[26px] items-center rounded-full bg-[#FDF1D3] px-2.5 text-[12.5px] font-bold text-[#7A5600]">Dernière pièce</span>;
  if (item.quantiteStock <= item.seuilAlerte)
    return <span className="inline-flex min-h-[26px] items-center rounded-full bg-out-dim px-2.5 text-[12.5px] font-bold text-out-text">Sous le seuil</span>;
  return <span className="inline-flex min-h-[26px] items-center rounded-full bg-in-dim px-2.5 text-[12.5px] font-bold text-in-text">En rayon</span>;
}

export function StockTimeline({ items, density = "cozy" }: StockTimelineProps) {
  if (!items.length) {
    return (
      <EmptyRiver
        message="Aucun article en stock"
        hint="Le stock se remplit avec vos entrées."
        action={
          <Button as={Link} href="/entrees" size="sm" className="bg-accent font-semibold text-on-accent">
            Enregistrer une entrée
          </Button>
        }
      />
    );
  }

  const cell = density === "compact" ? "py-2" : "py-3.5";

  return (
    <div className="overflow-x-auto rounded-[22px] bg-surface p-2 shadow-[0_0_0_1px_var(--color-border)]">
      <table className="w-full border-collapse text-sm" aria-label="Variantes en stock">
        <thead>
          <tr>
            {["Produit", "Variante", "Boutique", "En stock / seuil", "État", ""].map((h, i) => (
              <th key={i} scope="col" className="whitespace-nowrap border-b border-border px-3 py-2.5 text-left text-[12.5px] font-bold text-text-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-border/60 last:border-0">
              <td className={cn("px-3", cell)}>
                <p className="font-bold text-text">{item.produit?.nom ?? "—"}</p>
                <p className="text-[13px] text-text-muted">{item.produit?.sku}</p>
              </td>
              <td className={cn("whitespace-nowrap px-3", cell)}>
                {item.couleur}, {item.taille}
              </td>
              <td className={cn("whitespace-nowrap px-3", cell)}>{item.boutique?.nom ?? "—"}</td>
              <td className={cn("px-3", cell)}>
                <Niveau item={item} />
              </td>
              <td className={cn("px-3", cell)}>
                <Etat item={item} />
              </td>
              <td className={cn("px-3", cell)}>
                <Link href="/entrees" className="font-bold underline decoration-accent decoration-2 underline-offset-4">
                  Entrée
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
