"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adjustVarianteStock,
  createProduit,
  deleteProduit,
  updateProduit,
  updateVariante,
  type AdjustStockBody,
  type CreateProduitBody,
  type UpdateProduitBody,
  type UpdateVarianteBody,
} from "../api/produits-api";
import { produitKeys } from "../query/produits-queries";

export function useCreateProduit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateProduitBody) => createProduit(body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: produitKeys.all });
    },
  });
}

export function useUpdateProduit(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateProduitBody) => updateProduit(id, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: produitKeys.all });
    },
  });
}

export function useDeleteProduit(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => deleteProduit(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: produitKeys.all });
    },
  });
}

export function useUpdateVariante(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateVarianteBody) => updateVariante(id, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: produitKeys.all });
    },
  });
}

export function useAdjustStock(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AdjustStockBody) => adjustVarianteStock(id, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["stock"] });
      await qc.invalidateQueries({ queryKey: produitKeys.all });
    },
  });
}
