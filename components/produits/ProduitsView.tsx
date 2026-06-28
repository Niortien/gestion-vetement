"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { PageWrapper } from "@/components/common/PageWrapper";
import { useProduitsList } from "@/features/produits/query/produits-queries";
import type { AppError } from "@/types";
import { useUiStore } from "@/stores/uiStore";
import { ProduitDetailPanel } from "./ProduitDetailPanel";
import { ProduitMasonry } from "./ProduitMasonry";

export function ProduitsView() {
  const router = useRouter();
  const panelId = useUiStore((state) => state.produitPanelId);
  const setPanelId = useUiStore((state) => state.setProduitPanelId);
  const { data, isLoading, error } = useProduitsList({ limit: 20, sortOrder: "desc" });

  const produits = Array.isArray(data?.data) ? data.data : [];
  const appError = error as AppError | null;
  const errorLabel = appError
    ? `[${appError.code}] ${appError.message}`
    : "Impossible de charger la liste des produits.";

  return (
    <PageWrapper>
      <div className="rounded-xl border border-border/80 bg-[linear-gradient(120deg,rgba(240,180,41,0.14),rgba(143,126,245,0.14))] p-4 md:p-5">
        <h1 className="font-[var(--font-display)] text-2xl md:text-4xl">Produits</h1>
      </div>
      {isLoading ? <p className="text-sm text-text-muted">Chargement des produits…</p> : null}
      {!isLoading && error ? (
        <div className="rounded-lg border border-dashed border-out/40 bg-surface p-4 text-sm text-out">
          {errorLabel}
        </div>
      ) : null}
      {!isLoading && !error && produits.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/80 bg-surface p-4 text-sm text-text-muted">
          Aucun produit disponible pour le moment.
        </div>
      ) : null}
      <ProduitMasonry
        items={produits}
        onSelect={(id) => router.push(`/produits/${id}`)}
      />
      <Button
        isIconOnly
        className="fixed bottom-6 right-6 z-[1000] h-12 w-12 rounded-full border border-accent/70 bg-[linear-gradient(135deg,#F0B429,#D09520)] text-[#0A0A0B] shadow-glow-orange"
        onPress={() => setPanelId("new")}
      >
        +
      </Button>
      {panelId === "new" ? (
        <ProduitDetailPanel produit={undefined} onClose={() => setPanelId(null)} />
      ) : null}
    </PageWrapper>
  );
}
