"use client";

import { useState } from "react";
import { useVitrineCategories } from "@/features/vitrine/query/vitrine-queries";
import { useVitrineProduits } from "@/features/vitrine/query/vitrine-queries";
import type { Taille } from "@/types";
import { CatalogueHero } from "./CatalogueHero";
import { CatalogueFilters } from "./CatalogueFilters";
import { CatalogueGrid } from "./CatalogueGrid";
import { CatalogueSizeGuide } from "./CatalogueSizeGuide";
import { CatalogueWhatsappBanner } from "./CatalogueWhatsappBanner";

export function CatalogueView() {
  const [search, setSearch] = useState("");
  const [categorieId, setCategorieId] = useState<string | null>(null);
  const [taille, setTaille] = useState<Taille | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);

  const { data: categoriesData } = useVitrineCategories();
  const categories = categoriesData?.data ?? [];

  const { data: produitData } = useVitrineProduits({
    limit: 12,
    ...(categorieId ? { categorieId } : {}),
    ...(search ? { search } : {}),
  });
  const total = produitData?.pages[0]?.meta.total ?? 0;

  return (
    <>
      <CatalogueHero total={total} search={search} onSearch={setSearch} />
      <CatalogueFilters
        categories={categories}
        selectedCategorieId={categorieId}
        selectedTaille={taille}
        inStockOnly={inStockOnly}
        onCategorieChange={setCategorieId}
        onTailleChange={setTaille}
        onInStockChange={setInStockOnly}
      />
      <CatalogueGrid categorieId={categorieId} taille={taille} search={search} />
      <CatalogueSizeGuide />
      <CatalogueWhatsappBanner />
    </>
  );
}
