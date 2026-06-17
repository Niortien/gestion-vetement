"use client";

import { useMemo, useState } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader, Spinner } from "@heroui/react";
import { StockBadge } from "@/components/common/StockBadge";
import { useProduitsList } from "@/features/produits/query/produits-queries";
import type { Taille } from "@/types";

export interface VarianteSelection {
  varianteId: string;
  produitNom: string;
  taille: Taille;
  couleur: string;
  prixVente: string;
  prixAchat: string;
  quantiteStock: number;
}

interface VariantePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selection: VarianteSelection) => void;
  excludedVarianteIds?: string[];
}

export function VariantePicker({ isOpen, onClose, onSelect, excludedVarianteIds = [] }: VariantePickerProps) {
  const [search, setSearch] = useState("");
  const [expandedProduitId, setExpandedProduitId] = useState<string | null>(null);

  const { data, isLoading } = useProduitsList({ limit: 50, isActif: true });
  const produits = data?.data ?? [];

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return produits;
    return produits.filter((p) => p.nom.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  }, [produits, search]);

  const handleSelect = (sel: VarianteSelection) => {
    onSelect(sel);
    setSearch("");
    setExpandedProduitId(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      scrollBehavior="inside"
      classNames={{
        wrapper: "z-[1000]",
        backdrop: "z-[950]",
        base: "bg-[var(--color-surface)] border border-border",
        header: "border-b border-border/60",
      }}
    >
      <ModalContent>
        <ModalHeader className="text-base font-semibold">Sélectionner une variante</ModalHeader>
        <ModalBody className="pb-6">
          <Input
            autoFocus
            placeholder="Rechercher un produit (nom ou SKU)…"
            value={search}
            onValueChange={setSearch}
            variant="bordered"
            classNames={{ input: "text-sm" }}
          />

          {isLoading && (
            <div className="flex justify-center py-8">
              <Spinner size="md" color="warning" />
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-text-muted">Aucun produit trouvé.</p>
          )}

          <div className="space-y-2">
            {filtered.map((produit) => {
              const isExpanded = expandedProduitId === produit.id;
              const variantes = produit.variantes ?? [];

              return (
                <div key={produit.id} className="rounded-lg border border-border/60 bg-[var(--color-surface-high)]">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-3 py-2 text-left"
                    onClick={() => setExpandedProduitId(isExpanded ? null : produit.id)}
                  >
                    <div>
                      <span className="text-sm font-medium text-text">{produit.nom}</span>
                      <span className="ml-2 font-[var(--font-mono)] text-xs text-text-muted">{produit.sku}</span>
                    </div>
                    <span className="text-xs text-text-muted">
                      {variantes.length} variante{variantes.length !== 1 ? "s" : ""} {isExpanded ? "▲" : "▼"}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border/40 px-3 pb-3 pt-2">
                      {variantes.length === 0 ? (
                        <p className="text-xs text-text-muted">Aucune variante disponible.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {variantes.map((v) => {
                            const excluded = excludedVarianteIds.includes(v.id);
                            return (
                              <Button
                                key={v.id}
                                size="sm"
                                variant="flat"
                                isDisabled={excluded}
                                className={[
                                  "flex h-auto flex-col items-start gap-0.5 px-3 py-2",
                                  excluded
                                    ? "opacity-40 cursor-not-allowed"
                                    : "bg-[color:rgba(45,69,103,0.6)] hover:bg-accent/20",
                                ].join(" ")}
                                onPress={() =>
                                  handleSelect({
                                    varianteId: v.id,
                                    produitNom: produit.nom,
                                    taille: v.taille,
                                    couleur: v.couleur,
                                    prixVente: produit.prixVente,
                                    prixAchat: produit.prixAchat,
                                    quantiteStock: v.quantiteStock,
                                  })
                                }
                              >
                                <span className="font-[var(--font-mono)] text-xs text-accent">{v.taille}</span>
                                <span className="text-xs text-text">{v.couleur}</span>
                                <StockBadge value={v.quantiteStock} isAlert={v.quantiteStock <= v.seuilAlerte} />
                              </Button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
