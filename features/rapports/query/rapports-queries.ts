"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { useBoutiqueId } from "@/hooks/useBoutiqueId";
import {
  exportExcel,
  exportPdf,
  getFluxTresorerie,
  getResumeDashboard,
  getStockValeur,
  getTopProduits,
  getVentes,
  type ExportParams,
  type FluxTresorerieParams,
  type RapportVentesParams,
  type ResumeDashboardParams,
  type TopProduitsParams,
} from "../api/rapports-api";

export const rapportKeys = {
  all: ["rapports"] as const,
  resumeDashboard: (params: ResumeDashboardParams) => ["rapports", "resume-dashboard", params] as const,
  ventes: (params: RapportVentesParams) => ["rapports", "ventes", params] as const,
  stockValeur: (boutiqueId?: string) => ["rapports", "stock-valeur", boutiqueId] as const,
  topProduits: (params: TopProduitsParams) => ["rapports", "top-produits", params] as const,
  fluxTresorerie: (params: FluxTresorerieParams) => ["rapports", "flux-tresorerie", params] as const,
};

export function useResumeDashboard(params: ResumeDashboardParams = {}) {
  const token = useAuthStore((s) => s.accessToken);
  const boutiqueId = useBoutiqueId();
  const effectiveParams = { ...params, boutiqueId };
  return useQuery({
    queryKey: rapportKeys.resumeDashboard(effectiveParams),
    queryFn: () => getResumeDashboard(effectiveParams),
    enabled: !!token,
  });
}

export function useVentes(params: RapportVentesParams) {
  const token = useAuthStore((s) => s.accessToken);
  const boutiqueId = useBoutiqueId();
  const effectiveParams = { ...params, boutiqueId };
  return useQuery({
    queryKey: rapportKeys.ventes(effectiveParams),
    queryFn: () => getVentes(effectiveParams),
    enabled: !!token,
  });
}

export function useStockValeur() {
  const token = useAuthStore((s) => s.accessToken);
  const boutiqueId = useBoutiqueId();
  return useQuery({
    queryKey: rapportKeys.stockValeur(boutiqueId),
    queryFn: () => getStockValeur(boutiqueId),
    enabled: !!token,
  });
}

export function useTopProduits(params: TopProduitsParams) {
  const token = useAuthStore((s) => s.accessToken);
  const boutiqueId = useBoutiqueId();
  const effectiveParams = { ...params, boutiqueId };
  return useQuery({
    queryKey: rapportKeys.topProduits(effectiveParams),
    queryFn: () => getTopProduits(effectiveParams),
    enabled: !!token,
  });
}

export function useFluxTresorerie(params: FluxTresorerieParams) {
  const token = useAuthStore((s) => s.accessToken);
  const boutiqueId = useBoutiqueId();
  const effectiveParams = { ...params, boutiqueId };
  return useQuery({
    queryKey: rapportKeys.fluxTresorerie(effectiveParams),
    queryFn: () => getFluxTresorerie(effectiveParams),
    enabled: !!token,
  });
}

export function useExportExcel() {
  return (params?: ExportParams) => exportExcel(params);
}

export function useExportPdf() {
  return (params?: ExportParams) => exportPdf(params);
}
