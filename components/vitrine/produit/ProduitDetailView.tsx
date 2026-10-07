"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import axios from "axios";
import { useVitrineProduit } from "@/features/vitrine/query/vitrine-queries";
import { Taille } from "@/types";
import { ProduitGallery } from "./ProduitGallery";
import { ProduitInfo } from "./ProduitInfo";
import { ProduitVariantesSection } from "./ProduitVariantesSection";
import { ProduitOrderPanel } from "./ProduitOrderPanel";
import { ProduitCare } from "./ProduitCare";
import { ProduitRelated } from "./ProduitRelated";
import { ProduitStickyBar } from "./ProduitStickyBar";

interface ProduitDetailViewProps {
  id: string;
}

export function ProduitDetailView({ id }: ProduitDetailViewProps) {
  const { data, isLoading, isError, error, refetch, isFetching } = useVitrineProduit(id);
  const [selectedTaille, setSelectedTaille] = useState<Taille | null>(null);
  const [selectedCouleur, setSelectedCouleur] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Chargement de la pièce">
        <span aria-hidden className="flex items-end gap-1">
          {[10, 13, 17, 22].map((h, n) => (
            <i
              key={h}
              className="block animate-pulse"
              style={{ width: h, height: h, backgroundColor: "#F0B429", animationDelay: `${n * 140}ms`, clipPath: "polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%)" }}
            />
          ))}
        </span>
      </div>
    );
  }

  if (isError || !data?.data) {
    const isNotFound = axios.isAxiosError(error) && error.response?.status === 404;
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-5">
        <p className="v-t1">Oups</p>
        <p className="text-sm" style={{ color: "var(--v-muted)" }}>
          {isNotFound ? "Produit introuvable" : "Connexion au serveur impossible"}
        </p>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="v-btn v-btn-gold mt-2 disabled:opacity-40"
        >
          {isFetching ? "Chargement…" : "Réessayer"}
        </button>
      </div>
    );
  }

  const produit = data.data;
  const variantes = produit.variantes ?? [];

  const totalStock = variantes.reduce((s, v) => s + v.quantiteStock, 0);

  const selectedVariante =
    selectedTaille && selectedCouleur
      ? variantes.find((v) => v.taille === selectedTaille && v.couleur === selectedCouleur) ?? null
      : null;

  const handleTailleChange = (t: Taille) => {
    setSelectedTaille(t);
    // Auto-select couleur if only one option for this taille
    const couleursForTaille = [...new Set(variantes.filter((v) => v.taille === t).map((v) => v.couleur))];
    if (couleursForTaille.length === 1) {
      setSelectedCouleur(couleursForTaille[0]);
    } else {
      setSelectedCouleur(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="pb-24 lg:pb-0"
    >
      <div className="mx-auto max-w-[1280px] px-5 pt-5 md:px-8 md:pt-8">
        <nav aria-label="Fil d'Ariane" className="text-[13px]" style={{ color: "var(--v-muted)" }}>
          <Link href="/" className="hover:underline">Accueil</Link>
          {" / "}
          <Link href="/catalogue" className="hover:underline">Catalogue</Link>
          {" / "}
          <span aria-current="page" style={{ color: "var(--v-text)" }}>{produit.nom}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-[1280px] px-5 py-6 md:px-8 md:py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProduitGallery produit={produit} />
            <div className="-mt-11 px-3.5 lg:mt-5 lg:px-0">
              <ProduitInfo produit={produit} totalStock={totalStock} />
            </div>
          </div>

          <div className="space-y-8">
            <ProduitVariantesSection
              variantes={variantes}
              selectedTaille={selectedTaille}
              selectedCouleur={selectedCouleur}
              onTailleChange={handleTailleChange}
              onCouleurChange={setSelectedCouleur}
            />

            <div id="commande" className="scroll-mt-24">
              <ProduitOrderPanel produit={produit} variante={selectedVariante} />
            </div>

            <section aria-labelledby="etapes-titre">
              <h2 id="etapes-titre" className="v-t3 mb-1">Commander, en trois temps</h2>
              <ol>
                {[
                  ["Choisis ta taille.", "On t'indique la boutique qui l'a en rayon."],
                  ["Envoie le message pré-rempli", "sur WhatsApp, avec ton quartier."],
                  ["On te répond", "pour la remise et le paiement : Wave, Orange Money ou cash."],
                ].map(([titre, texte], i) => (
                  <li key={titre} className="grid grid-cols-[34px_1fr] items-start gap-3 py-3">
                    <b className="v-t4 flex h-[34px] w-[34px] items-center justify-center rounded-full" style={{ backgroundColor: "#0C0C0E", color: "#F0B429" }}>
                      {i + 1}
                    </b>
                    <p className="text-[15px]">
                      <strong>{titre}</strong> <span style={{ color: "var(--v-muted)" }}>{texte}</span>
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            <ProduitCare />
          </div>
        </div>
      </div>

      <ProduitStickyBar produit={produit} variante={selectedVariante} enRupture={totalStock === 0} />

      {produit.categorieId && <ProduitRelated categorieId={produit.categorieId} excludeId={produit.id} />}
    </motion.div>
  );
}
