"use client";

import { useQuery } from "@tanstack/react-query";
import { getSorties } from "@/features/sorties/api/sorties-api";
import { useBoutiqueId } from "@/hooks/useBoutiqueId";
import { useAuthStore } from "@/stores/authStore";
import { TypeSortie } from "@/types";
import type { Sortie } from "@/types";

export type PeriodeAnalyse = 7 | 30 | 90;

const PAGE_SIZE = 100;
/** Plafond de sécurité : 30 pages de 100 ventes, les plus récentes d'abord. */
const MAX_PAGES = 30;
const LOT = 5;

export interface VentesAnalyse {
  sorties: Sortie[];
  /** Nombre total de ventes sur la période d'après l'API. */
  total: number;
  /** Vrai si le plafond a été atteint : l'analyse porte alors sur les ventes les plus récentes seulement. */
  tronque: boolean;
  debut: Date;
  fin: Date;
}

/**
 * Charge toutes les ventes des `jours` derniers jours (page 1, puis les suivantes par lots parallèles).
 * Les ventes annulées sont filtrées plus loin par la logique d'analyse.
 */
export function useVentesAnalyse(jours: PeriodeAnalyse) {
  const token = useAuthStore((s) => s.accessToken);
  const boutiqueId = useBoutiqueId();
  const aujourdhui = new Date().toDateString();

  return useQuery<VentesAnalyse>({
    queryKey: ["analyse", "ventes", jours, boutiqueId ?? "toutes", aujourdhui],
    enabled: !!token,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const fin = new Date();
      fin.setHours(23, 59, 59, 0);
      const debut = new Date();
      debut.setDate(debut.getDate() - (jours - 1));
      debut.setHours(0, 0, 0, 0);

      const params = {
        type: TypeSortie.VENTE,
        dateDebut: debut.toISOString(),
        dateFin: fin.toISOString(),
        limit: PAGE_SIZE,
        sortOrder: "desc" as const,
        boutiqueId,
      };

      const premiere = await getSorties({ ...params, page: 1 });
      const totalPages = premiere.meta.totalPages ?? 1;
      const total = premiere.meta.total ?? premiere.data.length;
      const sorties = [...premiere.data];

      const dernierePage = Math.min(totalPages, MAX_PAGES);
      for (let debutLot = 2; debutLot <= dernierePage; debutLot += LOT) {
        const pages = Array.from({ length: Math.min(LOT, dernierePage - debutLot + 1) }, (_, i) => debutLot + i);
        const resultats = await Promise.all(pages.map((page) => getSorties({ ...params, page })));
        for (const r of resultats) sorties.push(...r.data);
      }

      return { sorties, total, tronque: totalPages > MAX_PAGES, debut, fin };
    },
  });
}
