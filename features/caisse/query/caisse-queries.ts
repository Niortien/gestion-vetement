"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getActiveSession,
  getResumeJour,
  listSessionTransactions,
  listSessions,
  type SessionsListParams,
  type SessionTransactionsParams,
} from "../api/caisse-api";

export const caisseKeys = {
  all: ["caisse"] as const,
  sessions: (params: SessionsListParams) => ["caisse", "sessions", params] as const,
  activeSession: () => ["caisse", "active-session"] as const,
  resumeJour: () => ["caisse", "resume-jour"] as const,
  transactions: (sessionId: string, params: SessionTransactionsParams) =>
    ["caisse", "transactions", sessionId, params] as const,
};

export function useActiveSession() {
  return useQuery({
    queryKey: caisseKeys.activeSession(),
    queryFn: getActiveSession,
    refetchInterval: 10_000,
  });
}

export function useResumeJour() {
  return useQuery({
    queryKey: caisseKeys.resumeJour(),
    queryFn: getResumeJour,
    refetchInterval: 5_000,
  });
}

// GET /caisse/sessions — liste paginée de toutes les sessions
export function useSessionsList(params: SessionsListParams = {}) {
  return useInfiniteQuery({
    queryKey: caisseKeys.sessions(params),
    queryFn: ({ pageParam = 1 }) => listSessions({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const current = lastPage.meta.page ?? 1;
      const total = lastPage.meta.totalPages ?? 1;
      return current < total ? current + 1 : undefined;
    },
  });
}

// GET /caisse/sessions/:id/transactions — liste les transactions d'une session
export function useSessionTransactions(
  sessionId: string,
  params: SessionTransactionsParams = {}
) {
  return useQuery({
    queryKey: caisseKeys.transactions(sessionId, params),
    queryFn: () => listSessionTransactions(sessionId, params),
    enabled: !!sessionId,
  });
}
