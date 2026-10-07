"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Chip, Input, Spinner, Switch } from "@heroui/react";
import { IconHanger, IconRosetteDiscount, IconSearch } from "@tabler/icons-react";
import { CountUp } from "@/components/common/CountUp";
import { PageHero } from "@/components/common/PageHero";
import { PageWrapper } from "@/components/common/PageWrapper";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { StatTile } from "@/components/common/StatTile";
import { useProduitsList } from "@/features/produits/query/produits-queries";
import { useUpdateProduit } from "@/features/produits/mutation/produits-mutations";
import type { Produit } from "@/types";
import { PromoInlineForm, type PromoFormData } from "./PromoInlineForm";

type FilterMode = "tous" | "enPromo";

function ProduitPromoRow({ produit }: { produit: Produit }) {
  const [expanded, setExpanded] = useState(produit.enPromo);
  const update = useUpdateProduit(produit.id);

  const imageUrl = produit.imageUrl ?? produit.images?.[0]?.url ?? null;
  const isPromo = produit.enPromo && !!produit.prixPromo;
  const prixVente = parseFloat(produit.prixVente);
  const tauxReduction = isPromo
    ? Math.round(((prixVente - parseFloat(produit.prixPromo!)) / prixVente) * 100)
    : null;

  async function handleToggle(checked: boolean) {
    if (!checked) {
      if (produit.enPromo) await update.mutateAsync({ enPromo: false });
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  }

  async function handleSave(data: PromoFormData) {
    await update.mutateAsync({
      enPromo: true,
      prixPromo: data.prixPromo,
      dateDebutPromo: data.dateDebutPromo,
      dateFinPromo: data.dateFinPromo,
    });
    setExpanded(false);
    toast.success("Produit mis en promotion");
  }

  function handleCancel() {
    if (!produit.enPromo) setExpanded(false);
  }

  return (
    <div className="rounded-[22px] bg-surface p-4 shadow-[0_0_0_1px_var(--color-border)]">
      <div className="flex items-center gap-3">
        {/* Thumbnail */}
        <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-high">
          {imageUrl ? (
            <img src={imageUrl} alt={produit.nom} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-text-dim text-lg">?</div>
          )}
          {isPromo && (
            <div className="absolute left-1 top-1 rounded-full bg-[#C8102E] px-1.5 py-1 text-[10px] font-extrabold leading-none text-white">
              −{tauxReduction} %
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[17px] font-semibold text-text">{produit.nom}</p>
          <div className="mt-0.5 flex items-center gap-2 flex-wrap">
            {isPromo ? (
              <>
                <span className="text-xs text-text-muted line-through">
                  {prixVente.toLocaleString("fr-FR")} FCFA
                </span>
                <span className="font-display text-base font-bold tabular-nums text-[#C8102E]">
                  {Number(produit.prixPromo).toLocaleString("fr-FR")} FCFA
                </span>
              </>
            ) : (
              <span className="font-display text-base font-bold tabular-nums text-text">
                {prixVente.toLocaleString("fr-FR")} FCFA
              </span>
            )}
            {produit.enPromo && !produit.prixPromo && (
              <Chip size="sm" variant="flat" className="bg-return/20 text-return-text text-[9px]">
                Prix à définir
              </Chip>
            )}
          </div>
        </div>

        {/* Toggle */}
        <Switch
          size="sm"
          isSelected={produit.enPromo || expanded}
          onValueChange={handleToggle}
          isDisabled={update.isPending}
          classNames={{ thumb: "bg-white", wrapper: "group-data-[selected=true]:bg-text" }}
          aria-label={`Promotion ${produit.nom}`}
        />
      </div>

      {/* Formulaire inline */}
      {(expanded || produit.enPromo) && (
        <PromoInlineForm
          produit={produit}
          onSave={handleSave}
          onCancel={handleCancel}
          isSaving={update.isPending}
        />
      )}
    </div>
  );
}

export function PromotionsView() {
  const [filterMode, setFilterMode] = useState<FilterMode>("tous");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useProduitsList({ limit: 100, isActif: true });
  const allProduits = data?.data ?? [];

  const filtered = allProduits.filter((p) => {
    const matchMode = filterMode === "tous" || p.enPromo;
    const matchSearch = p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    return matchMode && matchSearch;
  });

  const promoCount = allProduits.filter((p) => p.enPromo).length;

  return (
    <PageWrapper>
      <PageHero
        title="Promotions"
        description="Le prix barré affiché sur la vitrine est toujours le vrai prix de vente. Active une promotion, fixe le prix promo : la vitrine l'affiche aussitôt."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatTile
            tone="return"
            icon={IconRosetteDiscount}
            label="Produits en promotion"
            value={isLoading ? "—" : <CountUp value={promoCount} />}
          />
          <StatTile
            tone="accent"
            icon={IconHanger}
            label="Produits actifs"
            value={isLoading ? "—" : <CountUp value={allProduits.length} />}
            delay={0.05}
          />
        </div>
      </PageHero>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Rechercher un produit…"
          value={search}
          onValueChange={setSearch}
          size="sm"
          variant="bordered"
          startContent={<IconSearch size={16} aria-hidden className="text-text-muted" />}
          classNames={{
            base: "sm:max-w-xs",
            inputWrapper: "h-11 rounded-full border-border bg-surface",
          }}
          aria-label="Rechercher un produit"
        />
        <SegmentedControl
          ariaLabel="Filtrer les produits"
          tone="accent"
          value={filterMode}
          onChange={setFilterMode}
          options={[
            { key: "tous", label: "Tous les produits" },
            { key: "enPromo", label: "En promotion", count: promoCount },
          ]}
        />
      </div>

      {/* Liste */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-muted">
          {filterMode === "enPromo" ? "Aucun produit en promotion." : "Aucun produit trouvé."}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((produit) => (
            <ProduitPromoRow key={produit.id} produit={produit} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
