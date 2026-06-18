"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input, Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { getMotionVariant, panelSlide } from "@/lib/motionVariants";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useCreateSortie } from "@/features/sorties/mutation/sorties-mutations";
import { useAddTransaction } from "@/features/caisse/mutation/caisse-mutations";
import { useActiveSession } from "@/features/caisse/query/caisse-queries";
import { VariantePicker, type VarianteSelection } from "@/components/common/VariantePicker";
import { ModePaiement, TypeSortie } from "@/types";
import { RecuPrint, type RecuLigne } from "./RecuPrint";
import { SortieTypeStep } from "./SortieTypeStep";
import { SortieFormLine, type SortieFormLineData } from "./SortieFormLine";
import { SortiePaiementStep } from "./SortiePaiementStep";

interface RecuData {
  reference: string;
  date: string;
  lignes: RecuLigne[];
  totalMontant: string;
  modePaiement: ModePaiement;
  transactionReference?: string;
}

interface SortieCreatePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SortieCreatePanel({ isOpen, onClose }: SortieCreatePanelProps) {
  const reduced = useReducedMotion();
  const createSortieMutation = useCreateSortie();
  const addTransactionMutation = useAddTransaction();
  const { data: activeSessionData } = useActiveSession();
  const hasActiveSession = !!(activeSessionData?.data);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedType, setSelectedType] = useState<TypeSortie | null>(null);
  const [sortieNotes, setSortieNotes] = useState("");
  const [lines, setLines] = useState<SortieFormLineData[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const [recuOpen, setRecuOpen] = useState(false);
  const [recuData, setRecuData] = useState<RecuData | null>(null);

  const isPending = createSortieMutation.isPending || addTransactionMutation.isPending;

  const totalMontant = lines
    .reduce((sum, l) => sum + l.quantite * parseFloat(l.prixUnitaire || "0"), 0)
    .toFixed(0);

  const handleReset = () => {
    setStep(1);
    setSelectedType(null);
    setSortieNotes("");
    setLines([]);
    setPickerOpen(false);
    setReplacingIndex(null);
    setRecuData(null);
  };

  const addLine = (sel: VarianteSelection) => {
    const prixUnitaire =
      selectedType === TypeSortie.VENTE ? sel.prixVente : sel.prixAchat;
    const newLine: SortieFormLineData = {
      varianteId: sel.varianteId,
      produitNom: sel.produitNom,
      taille: sel.taille,
      couleur: sel.couleur,
      quantiteStock: sel.quantiteStock,
      quantite: 1,
      prixUnitaire,
    };
    if (replacingIndex !== null) {
      setLines((cur) => cur.map((l, i) => (i === replacingIndex ? newLine : l)));
      setReplacingIndex(null);
    } else {
      setLines((cur) => [...cur, newLine]);
    }
  };

  const handleLineChange = (
    index: number,
    field: "quantite" | "prixUnitaire",
    value: string | number
  ) => {
    setLines((cur) =>
      cur.map((l, i) => (i === index ? { ...l, [field]: value } : l))
    );
  };

  const handleLineRemove = (index: number) => {
    setLines((cur) => cur.filter((_, i) => i !== index));
  };

  const openPickerToReplace = (index: number) => {
    setReplacingIndex(index);
    setPickerOpen(true);
  };

  // Step 1 → 2
  const handleTypeConfirm = () => {
    if (!selectedType) return;
    if (selectedType === TypeSortie.VENTE && !hasActiveSession) {
      toast.error("Ouvre une session caisse avant de créer une vente.");
      return;
    }
    setStep(2);
  };

  // Step 2 → 3 (VENTE) or submit (non-VENTE)
  const handleLignesConfirm = () => {
    if (lines.length === 0) {
      toast.error("Ajoute au moins une variante.");
      return;
    }
    if (selectedType === TypeSortie.VENTE) {
      setStep(3);
    } else {
      createSortieMutation.mutate(
        {
          type: selectedType!,
          notes: sortieNotes.trim() || undefined,
          lignes: lines.map((l) => ({
            varianteId: l.varianteId,
            quantite: l.quantite,
            prixUnitaire: parseFloat(l.prixUnitaire || "0").toFixed(2),
          })),
        },
        {
          onSuccess: () => {
            toast.success("Sortie enregistrée !");
            handleReset();
            onClose();
          },
        }
      );
    }
  };

  // Step 3 — VENTE payment + receipt
  const handleVenteSubmit = async (
    modePaiement: ModePaiement,
    txReference?: string,
    txNotes?: string
  ) => {
    try {
      const { data: sortie } = await createSortieMutation.mutateAsync({
        type: TypeSortie.VENTE,
        notes: sortieNotes.trim() || undefined,
        lignes: lines.map((l) => ({
          varianteId: l.varianteId,
          quantite: l.quantite,
          prixUnitaire: parseFloat(l.prixUnitaire || "0").toFixed(2),
        })),
      });

      let transactionRef: string | undefined;
      try {
        const { data: tx } = await addTransactionMutation.mutateAsync({
          montant: sortie.totalMontant,
          modePaiement,
          sortieId: sortie.id,
          reference: txReference,
          notes: txNotes,
        });
        transactionRef = tx.reference ?? undefined;
      } catch {
        toast("Paiement non enregistré — vente créée", { icon: "⚠️" });
      }

      const recuLignes: RecuLigne[] = lines.map((l) => ({
        produitNom: l.produitNom,
        taille: l.taille,
        couleur: l.couleur,
        quantite: l.quantite,
        prixUnitaire: l.prixUnitaire,
        sousTotal: (l.quantite * parseFloat(l.prixUnitaire || "0")).toFixed(0),
      }));

      setRecuData({
        reference: sortie.reference,
        date: sortie.createdAt,
        lignes: recuLignes,
        totalMontant: sortie.totalMontant,
        modePaiement,
        transactionReference: transactionRef,
      });
      setRecuOpen(true);
      toast.success("Vente enregistrée !");
    } catch {
      // Error toast already shown by useCreateSortie onError
    }
  };

  const handleRecuClose = () => {
    setRecuOpen(false);
    handleReset();
    onClose();
  };

  const STEP_LABELS: Record<number, string> = {
    1: "Type",
    2: "Articles",
    3: "Paiement",
  };

  if (!isOpen) return null;

  return (
    <>
      <VariantePicker
        isOpen={pickerOpen}
        onClose={() => {
          setPickerOpen(false);
          setReplacingIndex(null);
        }}
        onSelect={addLine}
        excludedVarianteIds={
          replacingIndex !== null ? [] : lines.map((l) => l.varianteId)
        }
      />

      {recuData && (
        <RecuPrint
          isOpen={recuOpen}
          onClose={handleRecuClose}
          reference={recuData.reference}
          date={recuData.date}
          lignes={recuData.lignes}
          totalMontant={recuData.totalMontant}
          modePaiement={recuData.modePaiement}
          transactionReference={recuData.transactionReference}
        />
      )}

      {/* Overlay */}
      <div
        className="fixed inset-0 z-[700] bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.aside
        initial="hidden"
        animate="visible"
        variants={getMotionVariant(panelSlide, reduced)}
        className="fixed inset-y-0 right-0 z-[800] flex w-full max-w-[520px] flex-col border-l border-border bg-[linear-gradient(180deg,rgba(81,34,68,0.95),rgba(23,28,58,0.98))]"
        role="dialog"
        aria-modal="true"
        aria-label="Nouvelle sortie"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <div className="flex items-center gap-3">
            <h3 className="font-[var(--font-display)] text-xl text-[var(--color-out)]">
              Nouvelle sortie
            </h3>
            <span className="rounded-full bg-[var(--color-surface-high)] px-2 py-0.5 text-[10px] uppercase text-text-muted">
              {STEP_LABELS[step]} {step}/3
            </span>
          </div>
          <Button
            isIconOnly
            variant="light"
            onPress={onClose}
            aria-label="Fermer"
          >
            ✕
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4 pb-6">
          {/* Step 1 — Type */}
          {step === 1 && (
            <>
              <SortieTypeStep
                selected={selectedType}
                onSelect={setSelectedType}
              />
              {selectedType === TypeSortie.VENTE && !hasActiveSession && (
                <div className="flex items-start gap-3 rounded-lg border border-[var(--color-out)]/50 bg-[color:rgba(255,77,109,0.12)] p-3">
                  <span className="mt-0.5 text-base">⚠</span>
                  <div className="text-sm">
                    <p className="font-semibold text-[var(--color-out)]">Aucune session caisse ouverte</p>
                    <p className="mt-0.5 text-text-muted">
                      Une vente nécessite une session active.{" "}
                      <Link href="/caisse" className="underline text-accent" onClick={onClose}>
                        Ouvrir la caisse →
                      </Link>
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Step 2 — Lignes */}
          {step === 2 && (
            <>
              {selectedType && (
                <p className="text-xs uppercase tracking-wide text-text-muted">
                  Type :{" "}
                  <span className="font-semibold text-[var(--color-out)]">
                    {selectedType}
                  </span>
                </p>
              )}

              {/* Notes */}
              <Input
                variant="underlined"
                placeholder="Notes (optionnel)"
                value={sortieNotes}
                onValueChange={setSortieNotes}
                size="sm"
                classNames={{ input: "text-sm text-text-muted" }}
              />

              {/* Lignes */}
              <section className="rounded-lg border border-border/80 bg-[color:rgba(81,34,68,0.25)] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wide text-text-muted">
                    Produits
                  </p>
                  {lines.length > 0 && (
                    <span className="font-[var(--font-mono)] text-xs text-[var(--color-out)]">
                      Total : {Number(totalMontant).toLocaleString("fr-FR")} FCFA
                    </span>
                  )}
                </div>

                {lines.length > 0 && (
                  <div className="mb-1 grid grid-cols-[1fr_80px_100px_80px_32px] gap-2 px-3">
                    <span className="text-[10px] text-text-muted">Produit</span>
                    <span className="text-[10px] text-text-muted">Qté</span>
                    <span className="text-[10px] text-text-muted">Prix unit.</span>
                    <span className="text-right text-[10px] text-text-muted">S/Total</span>
                  </div>
                )}

                <div className="space-y-2">
                  {lines.map((line, i) => (
                    <SortieFormLine
                      key={`${line.varianteId}-${i}`}
                      line={line}
                      index={i}
                      onPickVariante={() => openPickerToReplace(i)}
                      onChange={handleLineChange}
                      onRemove={handleLineRemove}
                    />
                  ))}
                </div>

                <Button
                  variant="flat"
                  className="mt-3 w-full border border-dashed border-[var(--color-out)]/40 bg-[color:rgba(255,77,109,0.08)] text-[var(--color-out)]"
                  onPress={() => {
                    setReplacingIndex(null);
                    setPickerOpen(true);
                  }}
                >
                  + Ajouter une variante
                </Button>
              </section>
            </>
          )}

          {/* Step 3 — Paiement (VENTE only) */}
          {step === 3 && (
            <SortiePaiementStep
              totalMontant={totalMontant}
              isPending={isPending}
              onSubmit={handleVenteSubmit}
              onBack={() => setStep(2)}
            />
          )}
        </div>

        {/* Footer — only shown on steps 1 and 2 */}
        {step < 3 && (
          <div className="border-t border-border/60 p-4 pb-6">
            {step === 1 ? (
              <Button
                className="w-full bg-[var(--color-out)] font-semibold text-white"
                size="lg"
                isDisabled={
                  !selectedType ||
                  (selectedType === TypeSortie.VENTE && !hasActiveSession)
                }
                onPress={handleTypeConfirm}
              >
                Continuer →
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button
                  variant="flat"
                  className="flex-1 text-text-muted"
                  onPress={() => setStep(1)}
                  isDisabled={isPending}
                >
                  ← Retour
                </Button>
                <Button
                  className="flex-1 bg-[var(--color-out)] font-semibold text-white"
                  size="lg"
                  isDisabled={lines.length === 0 || isPending}
                  isLoading={isPending && selectedType !== TypeSortie.VENTE}
                  onPress={handleLignesConfirm}
                >
                  {isPending ? (
                    <Spinner size="sm" color="current" />
                  ) : selectedType === TypeSortie.VENTE ? (
                    "Continuer → Paiement"
                  ) : (
                    "Enregistrer"
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </motion.aside>
    </>
  );
}
