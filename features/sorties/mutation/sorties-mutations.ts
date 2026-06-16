"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AppError } from "@/types";
import { annulerSortie, createSortie, type CreateSortieBody } from "../api/sorties-api";
import { sortieKeys } from "../query/sorties-queries";

function isAppError(e: unknown): e is AppError {
  return typeof e === "object" && e !== null && "code" in e && "message" in e;
}

export function useCreateSortie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateSortieBody) => createSortie(body),
    onError: (error) => {
      if (!isAppError(error)) {
        toast.error("Erreur inattendue");
        return;
      }
      if (error.code === 422 && error.details) {
        const disponible = error.details.disponible as number | undefined;
        const demande = error.details.demande as number | undefined;
        toast.error(`Stock insuffisant : ${disponible ?? 0} dispo, ${demande ?? 0} demandé`);
        return;
      }
      if (error.code === 409) {
        toast.error("Ouvre d'abord une session de caisse");
        return;
      }
      toast.error(error.message);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: sortieKeys.all });
      await qc.invalidateQueries({ queryKey: ["stock"] });
      await qc.invalidateQueries({ queryKey: ["caisse"] });
    },
  });
}

export function useAnnulerSortie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => annulerSortie(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: sortieKeys.all });
      await qc.invalidateQueries({ queryKey: ["stock"] });
      await qc.invalidateQueries({ queryKey: ["caisse"] });
    },
    onError: (error) => {
      if (isAppError(error)) toast.error(error.message);
    },
  });
}
