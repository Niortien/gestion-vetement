"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  getVitrineCategories,
  getVitrineProduit,
  getVitrineProduits,
  type VitrineProduitParams,
} from "@/lib/vitrine-api";

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (axios.isAxiosError(error) && error.response?.status === 404) return false;
  return failureCount < 3;
}

export const vitrineKeys = {
  all: ["vitrine"] as const,
  produits: (params: VitrineProduitParams) => ["vitrine", "produits", params] as const,
  produit: (id: string) => ["vitrine", "produit", id] as const,
  categories: () => ["vitrine", "categories"] as const,
};

export function useVitrineProduits(params: VitrineProduitParams = {}) {
  return useInfiniteQuery({
    queryKey: vitrineKeys.produits(params),
    queryFn: ({ pageParam = 1 }) =>
      getVitrineProduits({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const current = lastPage.meta.page ?? 1;
      const totalPages = lastPage.meta.pageCount ?? 1;
      return current < totalPages ? current + 1 : undefined;
    },
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: shouldRetry,
    retryDelay: (attempt) => Math.min(2_000 * 2 ** attempt, 15_000),
  });
}

export function useVitrineProduit(id: string) {
  return useQuery({
    queryKey: vitrineKeys.produit(id),
    queryFn: () => getVitrineProduit(id),
    enabled: !!id,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: shouldRetry,
    retryDelay: (attempt) => Math.min(2_000 * 2 ** attempt, 15_000),
  });
}

export function useVitrineCategories() {
  return useQuery({
    queryKey: vitrineKeys.categories(),
    queryFn: getVitrineCategories,
    staleTime: 300_000,
  });
}
