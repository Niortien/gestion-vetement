import { api, apiGet } from "@/lib/api";
import type { ModePaiement, Produit } from "@/types";

export interface RapportVentesParams {
  dateDebut: string;
  dateFin: string;
  groupBy?: "jour" | "semaine" | "mois";
}

export interface TopProduitsParams {
  dateDebut: string;
  dateFin: string;
  limit?: number;
  groupBy?: "jour" | "semaine" | "mois";
}

export interface FluxTresorerieParams {
  dateDebut: string;
  dateFin: string;
  groupBy?: "jour" | "semaine" | "mois";
}

export interface ExportParams {
  dateDebut?: string;
  dateFin?: string;
  groupBy?: "jour" | "semaine" | "mois";
}

export const getVentes = (params: RapportVentesParams) =>
  apiGet<Array<{ periode: string; totalVentes: string; nombreTransactions: number; nombreSorties: number }>>(
    "/rapports/ventes",
    params as unknown as Record<string, unknown>
  );

export const getStockValeur = () =>
  apiGet<{ valeurTotaleAchat: string; valeurTotaleVente: string; nombreVariantes: number; nombreProduits: number }>(
    "/rapports/stock-valeur"
  );

export const getTopProduits = (params: TopProduitsParams) =>
  apiGet<Array<{ produitId: string; nom: string; sku: string; quantiteTotale: number; montantTotal: string }>>(
    "/rapports/top-produits",
    params as unknown as Record<string, unknown>
  );

export const getFluxTresorerie = (params: FluxTresorerieParams) =>
  apiGet<Array<{ periode: string; entrees: string; sorties: string; solde: string }>>(
    "/rapports/flux-tresorerie",
    params as unknown as Record<string, unknown>
  );

async function downloadBlob(url: string, filename: string, params?: ExportParams): Promise<void> {
  const response = await api.get<Blob>(url, { responseType: "blob", params });
  const blobUrl = window.URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(blobUrl);
}

export const exportExcel = (params?: ExportParams) =>
  downloadBlob("/rapports/export/excel", "rapport.xlsx", params);

export const exportPdf = (params?: ExportParams) =>
  downloadBlob("/rapports/export/pdf", "rapport.pdf", params);
