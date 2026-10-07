"use client";

import { IconSearch } from "@/components/vitrine/common/VitrineIcons";

interface CatalogueHeroProps {
  total: number;
  search: string;
  onSearch: (v: string) => void;
}

/** Titre, compteur honnête et recherche en pilule. */
export function CatalogueHero({ total, search, onSearch }: CatalogueHeroProps) {
  return (
    <section className="mx-auto max-w-[1280px] px-5 pb-4 pt-6 md:px-8 md:pt-10" aria-labelledby="catalogue-titre">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <h1 id="catalogue-titre" className="v-t0">
            Catalogue
          </h1>
          <p className="text-sm" style={{ color: "var(--v-muted)" }} aria-live="polite">
            {total} pièce{total !== 1 ? "s" : ""} en rayon
          </p>
        </div>

        <label
          className="flex min-h-[50px] w-full items-center gap-2.5 rounded-full px-4 md:max-w-sm"
          style={{ backgroundColor: "var(--v-card)", boxShadow: "inset 0 0 0 1px var(--v-border)", color: "var(--v-dim)" }}
        >
          <IconSearch size={20} />
          <span className="sr-only">Chercher une pièce</span>
          <input
            type="search"
            placeholder="Une pièce, une marque, une taille"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-[var(--v-dim)]"
            style={{ color: "var(--v-text)" }}
          />
        </label>
      </div>
    </section>
  );
}
