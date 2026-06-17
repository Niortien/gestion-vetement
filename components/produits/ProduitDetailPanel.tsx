"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Chip, Input, Skeleton, Slider, Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import type { AppError } from "@/types";
import { Taille } from "@/types";
import { createProduitSchema, type CreateProduitInput } from "@/lib/validators/produit.schema";
import { getMotionVariant, panelSlide } from "@/lib/motionVariants";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useCategoriesList } from "@/features/produits/query/produits-queries";
import { useCreateProduit, useUpdateProduit } from "@/features/produits/mutation/produits-mutations";
import type { Produit } from "@/types";

interface ProduitDetailPanelProps {
  produit?: Produit;
  onClose: () => void;
}

export function ProduitDetailPanel({ produit, onClose }: ProduitDetailPanelProps) {
  const reduced = useReducedMotion();
  const isNew = !produit;

  /* ── mutations ─────────────────────────────────────────── */
  const createMutation = useCreateProduit();
  const updateMutation = useUpdateProduit(produit?.id ?? "");
  const isPending = createMutation.isPending || updateMutation.isPending;

  /* ── categories ─────────────────────────────────────────── */
  const { data: categoriesData, isLoading: catsLoading } = useCategoriesList();
  const categories = categoriesData?.data ?? [];

  /* ── RHF ───────────────────────────────────────────────── */
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateProduitInput>({
    resolver: zodResolver(createProduitSchema),
    defaultValues: {
      nom: produit?.nom ?? "",
      sku: produit?.sku ?? "",
      description: produit?.description ?? "",
      prixVente: produit?.prixVente ?? "",
      prixAchat: produit?.prixAchat ?? "",
      imageUrl: produit?.imageUrl ?? "",
      categorieId: produit?.categorieId ?? "",
    },
  });

  useEffect(() => {
    if (produit) {
      reset({
        nom: produit.nom,
        sku: produit.sku ?? "",
        description: produit.description ?? "",
        prixVente: produit.prixVente,
        prixAchat: produit.prixAchat,
        imageUrl: produit.imageUrl ?? "",
        categorieId: produit.categorieId,
      });
      setPreviewUrl(produit.imageUrl ?? null);
      setSelectedTailles(produit.variantes?.map((v) => v.taille) ?? [Taille.M, Taille.L]);
      setSelectedCouleurs(
        produit.variantes ? [...new Set(produit.variantes.map((v) => v.couleur))] : ["Noir", "Creme"]
      );
      if (produit.variantes?.[0]) setSeuilAlerte(produit.variantes[0].seuilAlerte);
      const qmap: Record<string, number> = {};
      produit.variantes?.forEach((v) => { qmap[`${v.taille}-${v.couleur}`] = v.quantiteStock; });
      setQuantites(qmap);
    }
  }, [produit, reset]);

  const selectedCategorieId = watch("categorieId");

  /* ── image upload ───────────────────────────────────────── */
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(produit?.imageUrl ?? null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewUrl(dataUrl);
      setValue("imageUrl", dataUrl, { shouldValidate: false });
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const clearImage = () => {
    setPreviewUrl(null);
    setValue("imageUrl", "", { shouldValidate: false });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── variantes local state ───────────────────────────────── */
  const tailleOptions = useMemo(() => Object.values(Taille), []);
  const [varianteError, setVarianteError] = useState<string | null>(null);

  const selectedCat = categories.find((c) => c.id === selectedCategorieId);
  const isChaussure = selectedCat?.slug === "chaussures";

  const [selectedTailles, setSelectedTailles] = useState<string[]>(
    produit?.variantes?.map((v) => v.taille) ?? [Taille.M, Taille.L]
  );
  const [newTaille, setNewTaille] = useState("");
  const [selectedCouleurs, setSelectedCouleurs] = useState<string[]>(
    produit?.variantes
      ? [...new Set(produit.variantes.map((v) => v.couleur))]
      : ["Noir", "Creme"]
  );
  const [newColor, setNewColor] = useState("");
  const [seuilAlerte, setSeuilAlerte] = useState<number>(
    produit?.variantes?.[0]?.seuilAlerte ?? 5
  );
  const [quantites, setQuantites] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    produit?.variantes?.forEach((v) => {
      map[`${v.taille}-${v.couleur}`] = v.quantiteStock;
    });
    return map;
  });

  /* ── helpers ─────────────────────────────────────────────── */
  const toggleTaille = (t: string) => {
    setVarianteError(null);
    setSelectedTailles((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  };

  const addTaille = () => {
    const n = newTaille.trim();
    if (!n || selectedTailles.includes(n)) return;
    setVarianteError(null);
    setSelectedTailles((cur) => [...cur, n]);
    setNewTaille("");
  };

  const addColor = () => {
    const n = newColor.trim();
    if (!n || selectedCouleurs.includes(n)) return;
    setVarianteError(null);
    setSelectedCouleurs((cur) => [...cur, n]);
    setNewColor("");
  };

  const setQty = (taille: string, couleur: string, val: number) =>
    setQuantites((cur) => ({ ...cur, [`${taille}-${couleur}`]: Math.max(0, val) }));

  /* ── submit ──────────────────────────────────────────────── */
  const onSubmit = handleSubmit((fields) => {
    if (selectedTailles.length === 0 || selectedCouleurs.length === 0) {
      setVarianteError("Sélectionnez au moins une taille et une couleur");
      return;
    }
    setVarianteError(null);

    const variantes = selectedTailles.flatMap((taille) =>
      selectedCouleurs.map((couleur) => ({
        taille,
        couleur,
        quantiteStock: quantites[`${taille}-${couleur}`] ?? 0,
        seuilAlerte,
      }))
    );

    const prixVente = parseFloat(fields.prixVente).toFixed(2);
    const prixAchat = parseFloat(fields.prixAchat).toFixed(2);

    if (isNew) {
      createMutation.mutate(
        {
          nom: fields.nom.trim(),
          sku: fields.sku?.trim() || undefined,
          description: fields.description?.trim() || undefined,
          categorieId: fields.categorieId,
          prixVente,
          prixAchat,
          imageUrl: fields.imageUrl?.trim() || undefined,
          variantes,
        },
        {
          onSuccess: () => { toast.success("Produit créé !"); onClose(); },
          onError: (err) => toast.error((err as unknown as AppError).message ?? "Erreur lors de la création"),
        }
      );
    } else {
      updateMutation.mutate(
        {
          nom: fields.nom.trim(),
          description: fields.description?.trim() || undefined,
          prixVente,
          prixAchat,
          imageUrl: fields.imageUrl?.trim() || undefined,
        },
        {
          onSuccess: () => { toast.success("Produit mis à jour !"); onClose(); },
          onError: () => toast.error("Erreur lors de la mise à jour"),
        }
      );
    }
  });

  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={getMotionVariant(panelSlide, reduced)}
      className="fixed right-0 top-0 z-[800] flex h-screen w-full max-w-[480px] flex-col border-l border-border bg-[linear-gradient(180deg,rgba(34,54,81,0.98),rgba(23,38,58,0.98))]"
    >
      {/* header fixe */}
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <h3 className="font-[var(--font-display)] text-xl">
          {isNew ? "Nouveau produit" : "Éditer produit"}
        </h3>
        <Button isIconOnly variant="light" onPress={onClose} aria-label="Fermer le panel">
          ✕
        </Button>
      </div>

      {/* corps scrollable */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4 pb-6">

        {/* IMAGE */}
        <section className="rounded-lg border border-border/80 bg-[color:rgba(45,69,103,0.4)] p-4">
          <p className="mb-2 text-xs uppercase tracking-[0.08em] text-text-muted">Photo</p>

          {/* Zone drop / preview */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Déposer ou sélectionner une image produit"
            className={[
              "relative flex h-40 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition",
              isDragging
                ? "border-accent bg-accent/10"
                : "border-border/60 bg-[var(--color-surface-high)] hover:border-accent/60",
            ].join(" ")}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          >
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Aperçu"
                className="h-full w-full object-cover"
                onError={() => setPreviewUrl(null)}
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="text-2xl text-text-muted">📷</span>
                <p className="text-xs text-text-muted">Cliquer ou déposer une image</p>
                <p className="text-[10px] text-text-muted/60">JPG, PNG, WEBP — max 5 MB</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={onFileChange}
          />

          {previewUrl && (
            <button
              type="button"
              className="mt-2 text-xs text-out hover:underline"
              onClick={clearImage}
            >
              Supprimer l&apos;image
            </button>
          )}
        </section>

        {/* IDENTITÉ */}
        <section className="rounded-lg border border-border/80 bg-[color:rgba(45,69,103,0.4)] p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.08em] text-text-muted">Identité</p>
          <div className="space-y-3">
            <Input
              variant="underlined"
              placeholder="Nom du produit"
              isInvalid={!!errors.nom}
              errorMessage={errors.nom?.message}
              classNames={{ input: "text-xl font-[var(--font-display)]" }}
              {...register("nom")}
            />
            <Input
              variant="underlined"
              placeholder="SKU (auto-généré)"
              isInvalid={!!errors.sku}
              classNames={{ input: "font-[var(--font-mono)] text-sm" }}
              {...register("sku")}
            />
            <Input
              variant="underlined"
              placeholder="Description (optionnel)"
              classNames={{ input: "text-sm text-text-muted" }}
              {...register("description")}
            />
          </div>
        </section>

        {/* CATÉGORIE */}
        <section className="rounded-lg border border-border/80 bg-[color:rgba(45,69,103,0.4)] p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.08em] text-text-muted">Catégorie</p>
          {catsLoading ? (
            <div className="flex gap-2">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const active = selectedCategorieId === cat.id;
                return (
                  <Chip
                    key={cat.id}
                    variant="flat"
                    className={
                      active
                        ? "cursor-pointer bg-accent text-black"
                        : "cursor-pointer bg-[var(--color-surface-high)] text-text"
                    }
                    onClick={() => setValue("categorieId", cat.id, { shouldValidate: true })}
                  >
                    {cat.nom}
                  </Chip>
                );
              })}
              {errors.categorieId && (
                <p className="w-full text-xs text-out">{errors.categorieId.message}</p>
              )}
            </div>
          )}
        </section>

        {/* PRIX */}
        <section className="rounded-lg border border-border/80 bg-[color:rgba(45,69,103,0.4)] p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.08em] text-text-muted">Prix</p>
          <div className="grid grid-cols-2 gap-3">
            <Input
              variant="bordered"
              placeholder="Prix vente"
              endContent={<span className="text-xs text-text-muted">FCFA</span>}
              isInvalid={!!errors.prixVente}
              errorMessage={errors.prixVente?.message}
              {...register("prixVente")}
            />
            <Input
              variant="bordered"
              placeholder="Prix achat"
              endContent={<span className="text-xs text-text-muted">FCFA</span>}
              isInvalid={!!errors.prixAchat}
              errorMessage={errors.prixAchat?.message}
              {...register("prixAchat")}
            />
          </div>
        </section>

        {/* VARIANTES */}
        <section className="rounded-lg border border-border/80 bg-[color:rgba(45,69,103,0.4)] p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.08em] text-text-muted">Tailles</p>
          {isChaussure ? (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {selectedTailles.map((t) => (
                  <Chip
                    key={t}
                    variant="flat"
                    className="bg-accent text-black"
                    onClose={() => {
                      setVarianteError(null);
                      setSelectedTailles((cur) => cur.filter((x) => x !== t));
                    }}
                  >
                    {t}
                  </Chip>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  variant="bordered"
                  placeholder="Pointure (ex : 42)"
                  type="number"
                  min={28}
                  max={60}
                  value={newTaille}
                  onValueChange={setNewTaille}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTaille(); } }}
                />
                <Button variant="flat" className="shrink-0 bg-accent text-black" onPress={addTaille}>+</Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tailleOptions.map((t) => (
                <Chip
                  key={t}
                  variant="flat"
                  className={
                    selectedTailles.includes(t)
                      ? "cursor-pointer bg-accent text-black"
                      : "cursor-pointer bg-[var(--color-surface-high)] text-text"
                  }
                  onClick={() => toggleTaille(t)}
                >
                  {t}
                </Chip>
              ))}
            </div>
          )}

          <p className="mb-3 mt-4 text-xs uppercase tracking-[0.08em] text-text-muted">Couleurs</p>
          <div className="mb-3 flex flex-wrap gap-2">
            {selectedCouleurs.map((c) => (
              <Chip
                key={c}
                variant="flat"
                className="bg-[var(--color-surface-high)] text-text"
                onClose={() => {
                  setVarianteError(null);
                  setSelectedCouleurs((cur) => cur.filter((x) => x !== c));
                }}
              >
                {c}
              </Chip>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              variant="bordered"
              placeholder="Ajouter couleur"
              value={newColor}
              onValueChange={setNewColor}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addColor(); } }}
            />
            <Button variant="flat" className="shrink-0 bg-accent text-black" onPress={addColor}>
              +
            </Button>
          </div>

          {varianteError && (
            <p className="mt-2 text-xs text-out">{varianteError}</p>
          )}

          {/* matrice stock */}
          {selectedTailles.length > 0 && selectedCouleurs.length > 0 && (
            <div className="mt-4 overflow-auto">
              <p className="mb-2 text-xs uppercase tracking-[0.08em] text-text-muted">Quantités</p>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="pb-2 pr-3 text-left font-normal text-text-muted">Taille</th>
                    {selectedCouleurs.map((c) => (
                      <th key={c} className="pb-2 pr-2 text-left font-normal text-text-muted">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedTailles.map((t) => (
                    <tr key={t}>
                      <td className="py-1 pr-3 font-[var(--font-mono)] text-accent">{t}</td>
                      {selectedCouleurs.map((c) => (
                        <td key={c} className="py-1 pr-2">
                          <Input
                            type="number"
                            variant="bordered"
                            size="sm"
                            classNames={{ input: "text-center font-[var(--font-mono)]", base: "max-w-[72px]" }}
                            value={String(quantites[`${t}-${c}`] ?? 0)}
                            onChange={(e) => setQty(t, c, Number(e.target.value))}
                            aria-label={`Quantité ${t} ${c}`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* SEUIL ALERTE */}
        <section className="rounded-lg border border-border/80 bg-[color:rgba(45,69,103,0.4)] p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.08em] text-text-muted">Seuil alerte</p>
          <Slider
            size="sm"
            step={1}
            minValue={0}
            maxValue={50}
            color="danger"
            value={seuilAlerte}
            onChange={(v) => setSeuilAlerte(Array.isArray(v) ? v[0] : v)}
            showTooltip
          />
          <p className="mt-2 text-xs text-text-muted">
            Alerte déclenchée à <span className="font-semibold text-out">{seuilAlerte}</span> unités
          </p>
        </section>
      </div>

      {/* footer fixe */}
      <div className="border-t border-border/60 p-4">
        <Button
          className="w-full bg-accent font-semibold text-black"
          size="lg"
          onPress={() => void onSubmit()}
          isDisabled={isPending}
        >
          {isPending ? <Spinner size="sm" color="current" /> : isNew ? "Créer le produit" : "Enregistrer"}
        </Button>
      </div>
    </motion.aside>
  );
}
