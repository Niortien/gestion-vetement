"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { getAuditLogs, type AuditLogsParams } from "../api/audit-api";

export const auditKeys = {
  all: ["audit"] as const,
  list: (params: AuditLogsParams) => ["audit", "list", params] as const,
};

/** Journal d'audit paginé (100 entrées par page). Le backend renvoie `pageCount`, normalisé par `apiGet`. */
export function useAuditLogs(params: Omit<AuditLogsParams, "page"> = {}) {
  const token = useAuthStore((s) => s.accessToken);
  return useInfiniteQuery({
    queryKey: auditKeys.list(params),
    queryFn: ({ pageParam = 1 }) => getAuditLogs({ ...params, limit: 100, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (last) => {
      const page = last.meta.page ?? 1;
      const total = last.meta.pageCount ?? last.meta.totalPages ?? 1;
      return page < total ? page + 1 : undefined;
    },
    enabled: !!token,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
