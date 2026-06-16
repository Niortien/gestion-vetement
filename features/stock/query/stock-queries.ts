"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getStock,
  getStockAlertes,
  getStockMouvements,
  type StockListParams,
  type StockMouvementsParams,
} from "../api/stock-api";

export const stockKeys = {
  all: ["stock"] as const,
  list: (params: StockListParams) => ["stock", "list", params] as const,
  alertes: () => ["stock", "alertes"] as const,
  mouvements: (params: StockMouvementsParams) => ["stock", "mouvements", params] as const,
};

export function useStockList(params: StockListParams = {}) {
  return useInfiniteQuery({
    queryKey: stockKeys.list(params),
    queryFn: ({ pageParam = 1 }) => getStock({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const current = lastPage.meta.page ?? 1;
      const total = lastPage.meta.totalPages ?? 1;
      return current < total ? current + 1 : undefined;
    },
  });
}

export function useStockAlertes() {
  return useQuery({
    queryKey: stockKeys.alertes(),
    queryFn: getStockAlertes,
  });
}

export function useStockMouvements(params: StockMouvementsParams = {}) {
  return useQuery({
    queryKey: stockKeys.mouvements(params),
    queryFn: () => getStockMouvements(params),
  });
}
