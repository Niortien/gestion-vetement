import { z } from "zod";
import { TypeSortie } from "@/types";

export const sortieSchema = z.object({
  type: z.nativeEnum(TypeSortie),
  notes: z.string().optional(),
  lignes: z
    .array(
      z.object({
        varianteId: z.string().uuid(),
        quantite: z.number().int().positive(),
        prixUnitaire: z.string().regex(/^\d+(\.\d{1,2})?$/),
      })
    )
    .min(1),
});

export type SortieInput = z.infer<typeof sortieSchema>;
