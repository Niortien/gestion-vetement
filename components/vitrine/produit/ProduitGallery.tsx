"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Produit } from "@/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ProduitGalleryProps {
  produit: Produit;
}

/** Photo 4:5 plein cadre avec pastilles de navigation ; les flèches restent des boutons natifs. */
export function ProduitGallery({ produit }: ProduitGalleryProps) {
  const reduced = useReducedMotion();
  const allImages = [
    ...(produit.imageUrl ? [{ url: produit.imageUrl, id: "main" }] : []),
    ...(produit.images ?? []).map((img) => ({ url: img.url, id: img.id })),
  ];

  const images = allImages.length > 0 ? allImages : [{ url: "", id: "placeholder" }];
  const [activeIdx, setActiveIdx] = useState(0);
  const current = images[activeIdx];

  const arrow = "absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-xl";
  const arrowStyle = { backgroundColor: "rgba(12,12,14,0.45)", color: "#fff", backdropFilter: "blur(8px)" };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] md:rounded-[28px]" style={{ backgroundColor: "var(--v-s2)" }}>
        <AnimatePresence mode="wait" initial={false}>
          {current.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <motion.img
              key={current.id}
              src={current.url}
              alt={`${produit.nom}, photo ${activeIdx + 1} sur ${images.length}`}
              className="h-full w-full object-cover"
              initial={reduced ? false : { opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          ) : (
            <div key="placeholder" className="flex h-full items-center justify-center text-sm" style={{ color: "var(--v-dim)" }}>
              Photo à venir
            </div>
          )}
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button type="button" onClick={() => setActiveIdx((i) => (i - 1 + images.length) % images.length)} className={`${arrow} left-3`} style={arrowStyle} aria-label="Photo précédente">
              ‹
            </button>
            <button type="button" onClick={() => setActiveIdx((i) => (i + 1) % images.length)} className={`${arrow} right-3`} style={arrowStyle} aria-label="Photo suivante">
              ›
            </button>
            <div className="absolute inset-x-0 bottom-14 flex justify-center gap-1.5">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className="h-[7px] rounded-full transition-all"
                  style={{ width: i === activeIdx ? 22 : 7, backgroundColor: i === activeIdx ? "#fff" : "rgba(255,255,255,0.55)" }}
                  aria-label={`Photo ${i + 1}`}
                  aria-current={i === activeIdx}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="hidden gap-2 overflow-x-auto pb-1 md:flex">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIdx(i)}
              aria-label={`Voir la photo ${i + 1}`}
              className="h-16 w-16 shrink-0 overflow-hidden rounded-xl transition-all"
              style={{ boxShadow: i === activeIdx ? "0 0 0 2px var(--v-text)" : "0 0 0 1px var(--v-border)", backgroundColor: "var(--v-s2)" }}
            >
              {img.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img.url} alt="" className="h-full w-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
