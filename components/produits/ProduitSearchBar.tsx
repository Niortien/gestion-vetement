"use client";

import { useRef } from "react";
import { IconSearch, IconX, IconLoader2, IconTag } from "@tabler/icons-react";
import { useCategoriesList } from "@/features/produits/query/produits-queries";
import type { Categorie } from "@/types";

interface ProduitSearchBarProps {
  search: string;
  onSearch: (v: string) => void;
  categorieId: string | undefined;
  onCategorie: (id: string | undefined) => void;
  enPromo: boolean;
  onPromo: (v: boolean) => void;
  count: number;
  isLoading: boolean;
}

export function ProduitSearchBar({
  search,
  onSearch,
  categorieId,
  onCategorie,
  enPromo,
  onPromo,
  count,
  isLoading,
}: ProduitSearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: catData } = useCategoriesList();
  const categories: Categorie[] = catData?.data ?? [];

  return (
    <div className="space-y-2">
      {/* Barre de recherche */}
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-3 text-text-muted">
          {isLoading ? (
            <IconLoader2 size={16} className="animate-spin text-accent" />
          ) : (
            <IconSearch size={16} />
          )}
        </span>

        <input
          ref={inputRef}
          type="search"
          inputMode="search"
          autoComplete="off"
          spellCheck={false}
          placeholder="Rechercher un produit…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className={[
            "min-h-[46px] w-full rounded-full border bg-surface py-3 pl-10 pr-20 text-base text-text placeholder:text-text-muted md:text-sm",
            "outline-none transition-all duration-150",
            "focus:border-text focus:ring-2 focus:ring-accent/40",
            search ? "border-text" : "border-border",
          ].join(" ")}
        />

        {/* Count + clear */}
        <div className="absolute right-3 flex items-center gap-2">
          {search && (
            <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[11px] text-accent-text">
              {count}
            </span>
          )}
          {search && (
            <button
              onClick={() => { onSearch(""); inputRef.current?.focus(); }}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-surface-high text-text-muted hover:text-text"
              aria-label="Effacer la recherche"
            >
              <IconX size={12} aria-hidden />
            </button>
          )}
        </div>
      </div>

      {/* Pills — catégories + promo */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none]">
        {/* Tous */}
        <button
          type="button"
          aria-pressed={!categorieId && !enPromo}
          onClick={() => onCategorie(undefined)}
          className={[
            "min-h-11 shrink-0 cursor-pointer rounded-full border px-4 text-sm font-semibold transition-colors duration-150",
            !categorieId && !enPromo
              ? "border-text bg-text text-white"
              : "border-border bg-surface text-text hover:border-text",
          ].join(" ")}
        >
          Tous
        </button>

        {/* Catégories */}
        {categories.map((cat) => (
          <button
            type="button"
            aria-pressed={categorieId === cat.id}
            key={cat.id}
            onClick={() => onCategorie(cat.id === categorieId ? undefined : cat.id)}
            className={[
              "min-h-11 shrink-0 cursor-pointer rounded-full border px-4 text-sm font-semibold transition-colors duration-150",
              categorieId === cat.id
                ? "border-text bg-text text-white"
                : "border-border bg-surface text-text hover:border-text",
            ].join(" ")}
          >
            {cat.nom}
          </button>
        ))}

        {/* Promo */}
        <button
          type="button"
          aria-pressed={enPromo}
          onClick={() => onPromo(!enPromo)}
          className={[
            "flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors duration-150",
            enPromo
              ? "border-text bg-text text-white"
              : "border-border bg-surface text-text hover:border-text",
          ].join(" ")}
        >
          <IconTag size={13} aria-hidden />
          Promo
        </button>
      </div>
    </div>
  );
}
