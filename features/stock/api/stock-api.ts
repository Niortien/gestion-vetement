import { apiGet } from "@/lib/api";
import type { MouvementStock, StockAlerte, StockItem, Taille, TypeMouvement } from "@/types";

export interface StockListParams {
  page?: number;
  limit?: number;
  alerte?: boolean;
  taille?: Taille;
  couleur?: string;
  categorieId?: string;
  sortOrder?: "asc" | "desc";
}

export interface StockMouvementsParams {
  page?: number;
  limit?: number;
  type?: TypeMouvement;
  dateDebut?: string;
  dateFin?: string;
  produitId?: string;
  sortOrder?: "asc" | "desc";
}

export const getStock = (params?: StockListParams) =>
  apiGet<StockItem[]>("/stock", params as Record<string, unknown> | undefined);

export const getStockAlertes = () =>
  apiGet<StockAlerte[]>("/stock/alertes");

export const getStockMouvements = (params?: StockMouvementsParams) =>
  apiGet<MouvementStock[]>("/stock/mouvements", params as Record<string, unknown> | undefined);
