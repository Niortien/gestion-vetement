import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type { Sortie, TypeSortie } from "@/types";

export interface SortiesListParams {
  page?: number;
  limit?: number;
  type?: TypeSortie;
  dateDebut?: string;
  dateFin?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateSortieBody {
  type: TypeSortie;
  notes?: string;
  lignes: Array<{
    varianteId: string;
    quantite: number;
    prixUnitaire: string;
  }>;
}

export const getSorties = (params?: SortiesListParams) =>
  apiGet<Sortie[]>("/sorties", params as Record<string, unknown> | undefined);

// GET /sorties/:id — récupère le détail d'une sortie avec ses lignes
export const getSortieById = (id: string) =>
  apiGet<Sortie>(`/sorties/${id}`);

export const createSortie = (body: CreateSortieBody) =>
  apiPost<Sortie, CreateSortieBody>("/sorties", body);

export interface UpdateSortieBody {
  notes?: string;
}

export const annulerSortie = (id: string) =>
  apiPatch<Sortie, Record<string, never>>(`/sorties/${id}/annuler`, {});

export const updateSortie = (id: string, body: UpdateSortieBody) =>
  apiPatch<Sortie, UpdateSortieBody>(`/sorties/${id}`, body);

export const deleteSortie = (id: string) =>
  apiDelete<void>(`/sorties/${id}`);
