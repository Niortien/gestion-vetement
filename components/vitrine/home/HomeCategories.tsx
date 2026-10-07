"use client";

import { useMemo } from "react";
import { useVitrineCategories, useVitrineProduits } from "@/features/vitrine/query/vitrine-queries";
import { HoverImageList, type HoverImageListItem } from "@/components/vitrine/common/HoverImageList";

const MAX_ROWS = 8;

/**
 * Index des catégories : une ligne par rayon, avec le nombre de pièces et un aperçu photo au survol.
 * L'aperçu vient d'une vraie pièce du rayon ; sans photo, la ligne reste simplement cliquable.
 */
export function HomeCategories() {
  const { data: catData } = useVitrineCategories();
  const { data: prodData } = useVitrineProduits({ limit: 100 });

  const items = useMemo<HoverImageListItem[]>(() => {
    const categories = catData?.data ?? [];
    const produits = prodData?.pages[0]?.data ?? [];

    return categories
      .map((c) => {
        const inCat = produits.filter((p) => p.categorie?.id === c.id);
        const withImage = inCat.find((p) => p.imageUrl ?? p.images?.[0]?.url);
        return {
          id: c.id,
          title: c.nom,
          meta: inCat.length > 0 ? `${inCat.length} pièce${inCat.length > 1 ? "s" : ""}` : undefined,
          href: `/catalogue?categorieId=${c.id}`,
          image: withImage ? (withImage.imageUrl ?? withImage.images?.[0]?.url) : null,
          alt: withImage ? withImage.nom : c.nom,
          count: inCat.length,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, MAX_ROWS)
      .map(({ id, title, meta, href, image, alt }) => ({ id, title, meta, href, image, alt }));
  }, [catData, prodData]);

  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1280px] px-5 py-16 md:px-8 md:py-20">
      <h2 className="v-t1">
        Les rayons
      </h2>
      <HoverImageList items={items} className="mt-8" />
    </section>
  );
}
