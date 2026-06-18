"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useCategoriesList } from "@/features/produits/query/produits-queries";
import type { NewProduitForEntree } from "@/features/entrees/api/entrees-api";
import { Taille } from "@/types";
import type { EntreeFormLineData } from "./EntreeFormLine";

const schema = z.object({
  nom: z.string().min(1, "Nom requis"),
  categorieId: z.string().min(1, "Catégorie requise"),
  prixVente: z.string().regex(/^\d+(\.\d{1,2})?$/, "Prix invalide"),
  prixAchat: z.string().regex(/^\d+(\.\d{1,2})?$/, "Prix invalide"),
  taille: z.string().min(1, "Taille requise"),
  couleur: z.string().min(1, "Couleur requise"),
  seuilAlerte: z.coerce.number().int().min(0).optional(),
  quantite: z.coerce.number().int().min(1, "Quantité min. 1"),
  prixUnitaire: z.string().regex(/^\d+(\.\d{1,2})?$/, "Prix invalide"),
});

type FormValues = z.infer<typeof schema>;

interface NewProduitModalProps {
  isOpen: boolean;
  defaultValues?: Partial<FormValues>;
  onClose: () => void;
  onAdd: (line: EntreeFormLineData) => void;
}

const TAILLE_OPTIONS = Object.values(Taille);

export function NewProduitModal({ isOpen, defaultValues, onClose, onAdd }: NewProduitModalProps) {
  const { data: categoriesData, isLoading: catLoading } = useCategoriesList();
  const categories = categoriesData?.data ?? [];

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      quantite: 1,
      seuilAlerte: 0,
      ...defaultValues,
    },
  });

  const watchedCategorieId = useWatch({ control, name: "categorieId" });
  const selectedCat = categories.find((c) => c.id === watchedCategorieId);
  const isChaussure = selectedCat?.slug === "chaussures";

  const onSubmit = handleSubmit((values) => {
    const newProduit: NewProduitForEntree = {
      nom: values.nom.trim(),
      categorieId: values.categorieId,
      prixVente: parseFloat(values.prixVente).toFixed(2),
      prixAchat: parseFloat(values.prixAchat).toFixed(2),
      taille: values.taille,
      couleur: values.couleur.trim(),
      seuilAlerte: values.seuilAlerte ?? 0,
    };

    const line: EntreeFormLineData = {
      newProduit,
      isNew: true,
      produitNom: values.nom.trim(),
      taille: values.taille,
      couleur: values.couleur.trim(),
      quantite: values.quantite,
      prixUnitaire: parseFloat(values.prixUnitaire).toFixed(2),
    };

    onAdd(line);
    reset();
    onClose();
  });

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => { if (!open) { reset(); onClose(); } }}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "rounded-[20px] border border-border bg-surface",
        backdrop: "z-[900]",
        wrapper: "z-[1000]",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 border-b border-border/60 pb-3">
          <p className="text-xs uppercase tracking-widest text-in">Nouveau produit</p>
          <p className="text-base font-semibold text-text">Créer et ajouter un article</p>
        </ModalHeader>

        <ModalBody className="py-5">
          <div className="space-y-5">
            {/* Infos produit */}
            <div className="rounded-xl border border-border/60 bg-[color:rgba(34,81,60,0.15)] p-4">
              <p className="mb-3 text-[11px] uppercase tracking-wider text-text-muted">Informations produit</p>
              <div className="space-y-3">
                <Input
                  label="Nom du produit"
                  variant="bordered"
                  isInvalid={!!errors.nom}
                  errorMessage={errors.nom?.message}
                  classNames={{ label: "text-text-muted text-xs", input: "text-text" }}
                  {...register("nom")}
                />

                {catLoading ? (
                  <div className="flex h-10 items-center gap-2">
                    <Spinner size="sm" color="success" />
                    <span className="text-xs text-text-muted">Chargement des catégories…</span>
                  </div>
                ) : (
                  <Select
                    label="Catégorie"
                    variant="bordered"
                    isInvalid={!!errors.categorieId}
                    errorMessage={errors.categorieId?.message}
                    classNames={{ label: "text-text-muted text-xs", value: "text-text" }}
                    onSelectionChange={(keys) => {
                      const val = Array.from(keys)[0];
                      if (val) {
                        setValue("categorieId", String(val), { shouldValidate: true });
                        setValue("taille", "", { shouldValidate: false });
                      }
                    }}
                  >
                    {categories.map((cat) => (
                      <SelectItem key={cat.id}>{cat.nom}</SelectItem>
                    ))}
                  </Select>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Prix de vente (FCFA)"
                    variant="bordered"
                    type="number"
                    min={0}
                    step="0.01"
                    isInvalid={!!errors.prixVente}
                    errorMessage={errors.prixVente?.message}
                    classNames={{ label: "text-text-muted text-xs", input: "text-text" }}
                    {...register("prixVente")}
                  />
                  <Input
                    label="Prix d'achat (FCFA)"
                    variant="bordered"
                    type="number"
                    min={0}
                    step="0.01"
                    isInvalid={!!errors.prixAchat}
                    errorMessage={errors.prixAchat?.message}
                    classNames={{ label: "text-text-muted text-xs", input: "text-text" }}
                    {...register("prixAchat")}
                  />
                </div>
              </div>
            </div>

            {/* Variante */}
            <div className="rounded-xl border border-border/60 bg-[color:rgba(34,81,60,0.15)] p-4">
              <p className="mb-3 text-[11px] uppercase tracking-wider text-text-muted">Variante</p>
              <div className="grid grid-cols-2 gap-3">
                {isChaussure ? (
                  <Input
                    label="Pointure"
                    variant="bordered"
                    type="number"
                    min={28}
                    max={60}
                    step={1}
                    placeholder="Ex : 42"
                    isInvalid={!!errors.taille}
                    errorMessage={errors.taille?.message}
                    classNames={{ label: "text-text-muted text-xs", input: "text-text" }}
                    {...register("taille")}
                  />
                ) : (
                  <Select
                    label="Taille"
                    variant="bordered"
                    isInvalid={!!errors.taille}
                    errorMessage={errors.taille?.message}
                    classNames={{ label: "text-text-muted text-xs", value: "text-text" }}
                    onSelectionChange={(keys) => {
                      const val = Array.from(keys)[0];
                      if (val) setValue("taille", String(val), { shouldValidate: true });
                    }}
                  >
                    {TAILLE_OPTIONS.map((t) => (
                      <SelectItem key={t}>{t}</SelectItem>
                    ))}
                  </Select>
                )}

                <Input
                  label="Couleur"
                  variant="bordered"
                  isInvalid={!!errors.couleur}
                  errorMessage={errors.couleur?.message}
                  classNames={{ label: "text-text-muted text-xs", input: "text-text" }}
                  {...register("couleur")}
                />
              </div>

              <div className="mt-3">
                <Input
                  label="Seuil d'alerte stock (optionnel)"
                  variant="bordered"
                  type="number"
                  min={0}
                  classNames={{ label: "text-text-muted text-xs", input: "text-text" }}
                  {...register("seuilAlerte")}
                />
              </div>
            </div>

            {/* Entrée */}
            <div className="rounded-xl border border-in/20 bg-in/8 p-4">
              <p className="mb-3 text-[11px] uppercase tracking-wider text-text-muted">Pour cette entrée</p>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Quantité reçue"
                  variant="bordered"
                  type="number"
                  min={1}
                  isInvalid={!!errors.quantite}
                  errorMessage={errors.quantite?.message}
                  classNames={{ label: "text-text-muted text-xs", input: "text-text" }}
                  {...register("quantite")}
                />
                <Input
                  label="Prix unitaire d'achat (FCFA)"
                  variant="bordered"
                  type="number"
                  min={0}
                  step="0.01"
                  isInvalid={!!errors.prixUnitaire}
                  errorMessage={errors.prixUnitaire?.message}
                  classNames={{ label: "text-text-muted text-xs", input: "text-text" }}
                  {...register("prixUnitaire")}
                />
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="border-t border-border/60 pt-3">
          <Button variant="light" onPress={() => { reset(); onClose(); }}>
            Annuler
          </Button>
          <Button
            className="bg-in font-semibold text-black"
            onPress={() => void onSubmit()}
          >
            Ajouter au bon d&apos;entrée
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
