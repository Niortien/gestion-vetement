"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Chip, Spinner } from "@heroui/react";
import { PageWrapper } from "@/components/common/PageWrapper";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { StockBadge } from "@/components/common/StockBadge";
import { FlowTag } from "@/components/common/FlowTag";
import { EmptyRiver } from "@/components/common/EmptyRiver";
import { useProduit, useProduitMouvements } from "@/features/produits/query/produits-queries";
import { useDeleteProduit, useUpdateProduit, useAdjustStock } from "@/features/produits/mutation/produits-mutations";
import { ProduitDetailPanel } from "./ProduitDetailPanel";
import type { TypeMouvement } from "@/types";

interface ProduitDetailViewProps {
  id: string;
}

const TYPE_FLOW: Record<TypeMouvement, "entree" | "sortie" | "ajustement" | "retour"> = {
  ENTREE: "entree",
  SORTIE: "sortie",
  AJUSTEMENT: "ajustement",
  RETOUR: "retour",
};

function AdjustCell({ varianteId }: { varianteId: string }) {
  const adjust = useAdjustStock(varianteId);
  const run = (delta: number) =>
    adjust.mutate({ variation: delta, motif: "Ajustement manuel" });

  return (
    <div className="flex items-center gap-1">
      <Button
        isIconOnly
        size="sm"
        variant="flat"
        className="h-6 w-6 min-w-0 rounded bg-[var(--color-surface-high)] text-out"
        isDisabled={adjust.isPending}
        onPress={() => run(-1)}
      >
        −
      </Button>
      <Button
        isIconOnly
        size="sm"
        variant="flat"
        className="h-6 w-6 min-w-0 rounded bg-[var(--color-surface-high)] text-in"
        isDisabled={adjust.isPending}
        onPress={() => run(1)}
      >
        +
      </Button>
    </div>
  );
}

export function ProduitDetailView({ id }: ProduitDetailViewProps) {
  const router = useRouter();
  const [showPanel, setShowPanel] = useState(false);
  const [imgError, setImgError] = useState(false);

  const { data, isLoading, error } = useProduit(id);
  const { data: mouvData, isLoading: mouvLoading } = useProduitMouvements(id, { limit: 10 });
  const deleteMutation = useDeleteProduit(id);
  const updateMutation = useUpdateProduit(id);

  const produit = data?.data;
  const mouvements = mouvData?.data ?? [];

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" color="warning" />
        </div>
      </PageWrapper>
    );
  }

  if (!produit || error) {
    return (
      <PageWrapper>
        <EmptyRiver message="Produit introuvable." />
        <Button variant="light" className="text-text-muted" onPress={() => router.back()}>
          ← Retour
        </Button>
      </PageWrapper>
    );
  }

  const totalStock = produit.variantes?.reduce((sum, v) => sum + v.quantiteStock, 0) ?? 0;

  return (
    <>
      <PageWrapper>
        {/* header */}
        <div className="flex items-center gap-3">
          <Button variant="light" isIconOnly className="text-text-muted" onPress={() => router.back()}>
            ←
          </Button>
          <h1 className="flex-1 font-[var(--font-display)] text-3xl md:text-4xl">{produit.nom}</h1>
          {!produit.isActif && (
            <Chip size="sm" variant="flat" className="bg-[var(--color-out-dim)] text-out">Inactif</Chip>
          )}
          <Button
            size="sm"
            variant="bordered"
            className="border-accent/60 text-accent"
            onPress={() => setShowPanel(true)}
          >
            Éditer
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
          {/* image */}
          <div className="overflow-hidden rounded-xl border border-border/80">
            {produit.imageUrl && !imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={produit.imageUrl}
                alt={produit.nom}
                className="h-64 w-full object-cover md:h-80"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="h-64 w-full bg-gradient-to-br from-[var(--color-surface-high)] via-[color:rgba(143,126,245,0.22)] to-border md:h-80" />
            )}
          </div>

          {/* infos */}
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-border/80 bg-surface p-4">
              <p className="mb-3 text-xs uppercase tracking-[0.08em] text-text-muted">Identité</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">SKU</span>
                  <span className="font-[var(--font-mono)] text-accent">{produit.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Catégorie</span>
                  <span className="text-text">{produit.categorie?.nom ?? "—"}</span>
                </div>
                {produit.description && (
                  <p className="mt-2 text-text-muted">{produit.description}</p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border/80 bg-surface p-4">
              <p className="mb-3 text-xs uppercase tracking-[0.08em] text-text-muted">Prix</p>
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-text-muted">Vente</p>
                  <CurrencyDisplay montant={produit.prixVente} size="lg" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Achat</p>
                  <CurrencyDisplay montant={produit.prixAchat} size="lg" />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/80 bg-surface p-4">
              <p className="mb-1 text-xs uppercase tracking-[0.08em] text-text-muted">Stock total</p>
              <StockBadge value={totalStock} />
            </div>
          </div>
        </div>

        {/* variantes + ajustements stock */}
        {produit.variantes && produit.variantes.length > 0 && (
          <div className="rounded-xl border border-border/80 bg-surface p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.08em] text-text-muted">
              Variantes ({produit.variantes.length})
            </p>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-xs text-text-muted">
                    <th className="pb-2 pr-4 font-normal">Taille</th>
                    <th className="pb-2 pr-4 font-normal">Couleur</th>
                    <th className="pb-2 pr-4 font-normal">Stock</th>
                    <th className="pb-2 pr-4 font-normal">Seuil</th>
                    <th className="pb-2 font-normal">Ajuster</th>
                  </tr>
                </thead>
                <tbody>
                  {produit.variantes.map((v) => {
                    const isAlerte = v.quantiteStock <= v.seuilAlerte;
                    return (
                      <tr key={v.id} className="border-b border-border/30 last:border-0">
                        <td className="py-2 pr-4 font-[var(--font-mono)] text-accent">{v.taille}</td>
                        <td className="py-2 pr-4 text-text">{v.couleur}</td>
                        <td className="py-2 pr-4">
                          <StockBadge value={v.quantiteStock} isAlert={isAlerte} />
                        </td>
                        <td className="py-2 pr-4 font-[var(--font-mono)] text-text-muted">{v.seuilAlerte}</td>
                        <td className="py-2">
                          <AdjustCell varianteId={v.id} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* mouvements de stock */}
        <div className="rounded-xl border border-border/80 bg-surface p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.08em] text-text-muted">
            Historique des mouvements
          </p>
          {mouvLoading ? (
            <div className="flex justify-center py-6">
              <Spinner size="sm" color="warning" />
            </div>
          ) : mouvements.length === 0 ? (
            <EmptyRiver message="Aucun mouvement enregistré pour ce produit." />
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-xs text-text-muted">
                    <th className="pb-2 pr-4 font-normal">Type</th>
                    <th className="pb-2 pr-4 font-normal">Qté</th>
                    <th className="pb-2 pr-4 font-normal">Motif</th>
                    <th className="pb-2 font-normal">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mouvements.map((m) => (
                    <tr key={m.id} className="border-b border-border/30 last:border-0">
                      <td className="py-2 pr-4">
                        <FlowTag type={TYPE_FLOW[m.type]} />
                      </td>
                      <td className="py-2 pr-4 font-[var(--font-mono)] text-text">
                        {m.type === "SORTIE" || m.type === "RETOUR" ? "−" : "+"}{m.quantite}
                      </td>
                      <td className="py-2 pr-4 text-text-muted">{m.motif ?? "—"}</td>
                      <td className="py-2 font-[var(--font-mono)] text-xs text-text-muted">
                        {new Date(m.createdAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* actions */}
        <div className="flex gap-3">
          {produit.isActif ? (
            <Button
              variant="bordered"
              className="border-out/60 text-out"
              isLoading={deleteMutation.isPending}
              onPress={() =>
                deleteMutation.mutate(undefined, {
                  onSuccess: () => router.push("/produits"),
                })
              }
            >
              Désactiver
            </Button>
          ) : (
            <Button
              variant="bordered"
              className="border-in/60 text-in"
              isLoading={updateMutation.isPending}
              onPress={() => updateMutation.mutate({ isActif: true })}
            >
              Réactiver
            </Button>
          )}
        </div>
      </PageWrapper>

      {showPanel && (
        <ProduitDetailPanel produit={produit} onClose={() => setShowPanel(false)} />
      )}
    </>
  );
}
