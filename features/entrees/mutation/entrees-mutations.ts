"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  annulerEntree,
  createEntree,
  deleteEntree,
  updateEntree,
  type CreateEntreeBody,
  type UpdateEntreeBody,
} from "../api/entrees-api";
import { entreeKeys } from "../query/entrees-queries";

export function useCreateEntree() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateEntreeBody) => createEntree(body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: entreeKeys.all });
      await qc.invalidateQueries({ queryKey: ["stock"] });
    },
  });
}

export function useAnnulerEntree() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => annulerEntree(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: entreeKeys.all });
      await qc.invalidateQueries({ queryKey: ["stock"] });
    },
  });
}

export function useUpdateEntree() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateEntreeBody }) =>
      updateEntree(id, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: entreeKeys.all });
    },
  });
}

export function useDeleteEntree() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEntree(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: entreeKeys.all });
      await qc.invalidateQueries({ queryKey: ["stock"] });
    },
  });
}
