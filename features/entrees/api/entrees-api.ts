import { apiGet, apiPatch, apiPost } from "@/lib/api";
import type { Entree } from "@/types";

export interface EntreesListParams {
  page?: number;
  limit?: number;
  dateDebut?: string;
  dateFin?: string;
  fournisseur?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateEntreeBody {
  fournisseur: string;
  notes?: string;
  lignes: Array<{
    varianteId: string;
    quantite: number;
    prixUnitaire: string;
  }>;
}

export const getEntrees = (params?: EntreesListParams) =>
  apiGet<Entree[]>("/entrees", params as Record<string, unknown> | undefined);

// GET /entrees/:id — récupère le détail d'une entrée avec ses lignes
export const getEntreeById = (id: string) =>
  apiGet<Entree>(`/entrees/${id}`);

export const createEntree = (body: CreateEntreeBody) =>
  apiPost<Entree, CreateEntreeBody>("/entrees", body);

export const annulerEntree = (id: string) =>
  apiPatch<Entree, Record<string, never>>(`/entrees/${id}/annuler`, {});
