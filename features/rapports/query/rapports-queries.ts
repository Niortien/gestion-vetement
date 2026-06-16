"use client";

import { useQuery } from "@tanstack/react-query";
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
  stockValeur: () => ["rapports", "stock-valeur"] as const,
  topProduits: (params: TopProduitsParams) => ["rapports", "top-produits", params] as const,
  fluxTresorerie: (params: FluxTresorerieParams) => ["rapports", "flux-tresorerie", params] as const,
};

export function useVentes(params: RapportVentesParams) {
  return useQuery({
    queryKey: rapportKeys.ventes(params),
    queryFn: () => getVentes(params),
  });
}

export function useStockValeur() {
  return useQuery({
    queryKey: rapportKeys.stockValeur(),
    queryFn: getStockValeur,
  });
}

export function useTopProduits(params: TopProduitsParams) {
  return useQuery({
    queryKey: rapportKeys.topProduits(params),
    queryFn: () => getTopProduits(params),
  });
}

export function useFluxTresorerie(params: FluxTresorerieParams) {
  return useQuery({
    queryKey: rapportKeys.fluxTresorerie(params),
    queryFn: () => getFluxTresorerie(params),
  });
}

export function useExportExcel() {
  return (params?: ExportParams) => exportExcel(params);
}

export function useExportPdf() {
  return (params?: ExportParams) => exportPdf(params);
}
