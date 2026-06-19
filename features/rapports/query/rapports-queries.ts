"use client";

import { useQuery } from "@tanstack/react-query";
import { useBoutiqueId } from "@/hooks/useBoutiqueId";
import {
  exportExcel,
  exportPdf,
  getFluxTresorerie,
  getStockValeur,
  getTopProduits,
  getVentes,
  type ExportParams,
  type FluxTresorerieParams,
  type RapportVentesParams,
  type TopProduitsParams,
} from "../api/rapports-api";

export const rapportKeys = {
  all: ["rapports"] as const,
  ventes: (params: RapportVentesParams) => ["rapports", "ventes", params] as const,
  stockValeur: (boutiqueId?: string) => ["rapports", "stock-valeur", boutiqueId] as const,
  topProduits: (params: TopProduitsParams) => ["rapports", "top-produits", params] as const,
  fluxTresorerie: (params: FluxTresorerieParams) => ["rapports", "flux-tresorerie", params] as const,
};

export function useVentes(params: RapportVentesParams) {
  const boutiqueId = useBoutiqueId();
  const effectiveParams = { ...params, boutiqueId };
  return useQuery({
    queryKey: rapportKeys.ventes(effectiveParams),
    queryFn: () => getVentes(effectiveParams),
  });
}

export function useStockValeur() {
  const boutiqueId = useBoutiqueId();
  return useQuery({
    queryKey: rapportKeys.stockValeur(boutiqueId),
    queryFn: () => getStockValeur(boutiqueId),
  });
}

export function useTopProduits(params: TopProduitsParams) {
  const boutiqueId = useBoutiqueId();
  const effectiveParams = { ...params, boutiqueId };
  return useQuery({
    queryKey: rapportKeys.topProduits(effectiveParams),
    queryFn: () => getTopProduits(effectiveParams),
  });
}

export function useFluxTresorerie(params: FluxTresorerieParams) {
  const boutiqueId = useBoutiqueId();
  const effectiveParams = { ...params, boutiqueId };
  return useQuery({
    queryKey: rapportKeys.fluxTresorerie(effectiveParams),
    queryFn: () => getFluxTresorerie(effectiveParams),
  });
}

export function useExportExcel() {
  return (params?: ExportParams) => exportExcel(params);
}

export function useExportPdf() {
  return (params?: ExportParams) => exportPdf(params);
}
