"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useVitrineProduits } from "@/features/vitrine/query/vitrine-queries";
import { getWhatsappUrl } from "@/lib/whatsapp";
import type { Produit } from "@/types";

function getBoutiqueLabel(produit: Produit): string | null {
  const boutiques = new Map<string, string>();
  for (const v of produit.variantes ?? []) {
    if (v.boutique && !boutiques.has(v.boutique.id)) {
      boutiques.set(v.boutique.id, v.boutique.nom);
    }
  }
  if (boutiques.size === 0) return null;
  return [...boutiques.values()].join(" · ");
}

const WA_SVG = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

function isNew(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < 14 * 86_400_000;
}

/* ── Grande carte verticale (Drop #01 sur desktop) ── */
function FeaturedCard({ produit, index }: { produit: Produit | null; index: number }) {
  const prix = produit ? parseFloat(produit.prixVente || "0") : 0;
  const prixPromo = produit?.prixPromo ? parseFloat(produit.prixPromo) : null;
  const isPromo = produit?.enPromo && prixPromo !== null;
  const isNewDrop = produit ? isNew(produit.createdAt) : false;
  const waUrl = produit ? getWhatsappUrl(`Bonjour ! Je veux commander : ${produit.nom}`) : "#";
  const boutiqueLabel = produit ? getBoutiqueLabel(produit) : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border"
      style={{ borderColor: "var(--v-border)", backgroundColor: "var(--v-s2)" }}
    >
      {/* Image — remplit la majorité de la carte */}
      <div
        className="relative min-h-[240px] flex-1 overflow-hidden"
        style={{ backgroundColor: "var(--v-s3)" }}
      >
        {produit?.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={produit.imageUrl}
            alt={produit.nom}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl opacity-[0.07]">
            &#128248;
          </div>
        )}
        {/* Gradient bas */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(6,6,7,0.85) 0%, transparent 55%)" }}
        />
        {/* Badge */}
        {(isNewDrop || isPromo) && produit && (
          <div
            className="absolute left-3 top-3 rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white"
            style={{ backgroundColor: "var(--v-hot)" }}
          >
            {isPromo ? `−${Math.round(((prix - prixPromo!) / prix) * 100)}%` : "NEW"}
          </div>
        )}
        {/* Drop number */}
        <div
          className="absolute bottom-3 right-3 font-[var(--font-display)] text-[56px] font-black leading-none opacity-[0.07] select-none"
          style={{ color: "var(--v-text)" }}
        >
          {index + 1}
        </div>
      </div>

      {/* Contenu bas */}
      <div className="flex flex-col gap-3 p-5">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.28em]" style={{ color: "var(--v-gold)" }}>
            Drop #{String(index + 1).padStart(2, "0")}
          </span>
          {produit ? (
            <>
              <h3
                className="mt-1 font-[var(--font-display)] text-lg font-black uppercase leading-tight"
                style={{ color: "var(--v-text)" }}
              >
                {produit.nom}
              </h3>
              {produit.categorie && (
                <p className="mt-0.5 text-[11px] uppercase tracking-widest" style={{ color: "var(--v-muted)" }}>
                  {produit.categorie.nom}
                </p>
              )}
              {boutiqueLabel && (
                <span
                  className="mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: "rgba(240,180,41,0.12)", color: "var(--v-gold)", border: "1px solid rgba(240,180,41,0.25)" }}
                >
                  <span style={{ fontSize: 7 }}>◆</span>
                  {boutiqueLabel}
                </span>
              )}
            </>
          ) : (
            <>
              <div className="mt-1 h-5 w-40 animate-pulse rounded" style={{ backgroundColor: "var(--v-s3)" }} />
              <div className="mt-1 h-3 w-20 animate-pulse rounded" style={{ backgroundColor: "var(--v-s3)" }} />
            </>
          )}
        </div>
        <div className="flex items-center justify-between">
          {produit ? (
            <div className="flex items-baseline gap-2">
              <span
                className="font-[var(--font-mono)] text-2xl font-black"
                style={{ color: isPromo ? "var(--v-gold)" : "var(--v-text)" }}
              >
                {(isPromo ? prixPromo! : prix).toLocaleString("fr-FR")}
                <span className="ml-1 text-xs font-normal" style={{ color: "var(--v-muted)" }}>FCFA</span>
              </span>
              {isPromo && (
                <span className="font-[var(--font-mono)] text-sm line-through" style={{ color: "var(--v-dim)" }}>
                  {prix.toLocaleString("fr-FR")}
                </span>
              )}
            </div>
          ) : (
            <div className="h-7 w-28 animate-pulse rounded" style={{ backgroundColor: "var(--v-s3)" }} />
          )}
          {produit && (
            <div className="flex items-center gap-2">
              <Link
                href={`/boutique/${produit.id}`}
                className="rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "var(--v-gold)", color: "#060607" }}
              >
                Voir
              </Link>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors hover:bg-[#25D366] hover:border-[#25D366] hover:text-white"
                style={{ borderColor: "var(--v-border)", color: "#25D366" }}
                title="Commander sur WhatsApp"
              >
                {WA_SVG}
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* ── Carte horizontale compacte (Drop #02-04 sur desktop) ── */
function CompactCard({ produit, index }: { produit: Produit | null; index: number }) {
  const prix = produit ? parseFloat(produit.prixVente || "0") : 0;
  const prixPromo = produit?.prixPromo ? parseFloat(produit.prixPromo) : null;
  const isPromo = produit?.enPromo && prixPromo !== null;
  const isNewDrop = produit ? isNew(produit.createdAt) : false;
  const waUrl = produit ? getWhatsappUrl(`Bonjour ! Je veux commander : ${produit.nom}`) : "#";
  const boutiqueLabel = produit ? getBoutiqueLabel(produit) : null;

  return (
    <motion.article
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex overflow-hidden rounded-2xl border"
      style={{ borderColor: "var(--v-border)", backgroundColor: "var(--v-s2)" }}
    >
      {/* Image */}
      <div
        className="relative h-36 w-32 shrink-0 overflow-hidden"
        style={{ backgroundColor: "var(--v-s3)" }}
      >
        {produit?.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={produit.imageUrl}
            alt={produit.nom}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl opacity-[0.07]">&#128248;</div>
        )}
        {(isNewDrop || isPromo) && produit && (
          <div
            className="absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-white"
            style={{ backgroundColor: "var(--v-hot)" }}
          >
            {isPromo ? `−${Math.round(((prix - prixPromo!) / prix) * 100)}%` : "NEW"}
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <span className="text-[9px] font-black uppercase tracking-[0.24em]" style={{ color: "var(--v-gold)" }}>
            Drop #{String(index + 1).padStart(2, "0")}
          </span>
          {produit ? (
            <>
              <h3
                className="mt-0.5 font-[var(--font-display)] text-base font-black uppercase leading-tight"
                style={{ color: "var(--v-text)" }}
              >
                {produit.nom}
              </h3>
              {boutiqueLabel && (
                <p className="mt-1 flex items-center gap-1 text-[9px] font-semibold" style={{ color: "var(--v-gold)" }}>
                  <span style={{ fontSize: 7 }}>◆</span>
                  {boutiqueLabel}
                </p>
              )}
            </>
          ) : (
            <div className="mt-1 h-4 w-32 animate-pulse rounded" style={{ backgroundColor: "var(--v-s3)" }} />
          )}
        </div>
        <div className="flex items-center justify-between">
          {produit ? (
            <span className="font-[var(--font-mono)] text-base font-black" style={{ color: isPromo ? "var(--v-gold)" : "var(--v-text)" }}>
              {(isPromo ? prixPromo! : prix).toLocaleString("fr-FR")}
              <span className="ml-1 text-[10px] font-normal" style={{ color: "var(--v-muted)" }}>FCFA</span>
            </span>
          ) : (
            <div className="h-5 w-24 animate-pulse rounded" style={{ backgroundColor: "var(--v-s3)" }} />
          )}
          {produit && (
            <div className="flex items-center gap-1.5">
              <Link
                href={`/boutique/${produit.id}`}
                className="rounded-lg px-3 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "var(--v-gold)", color: "#060607" }}
              >
                Voir
              </Link>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors hover:bg-[#25D366] hover:border-[#25D366] hover:text-white"
                style={{ borderColor: "var(--v-border)", color: "#25D366" }}
                title="Commander sur WhatsApp"
              >
                {WA_SVG}
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function HomeFeaturedDrops() {
  const { data } = useVitrineProduits({ limit: 4 });
  const produits = data?.pages[0]?.data ?? [];
  const items: (typeof produits[number] | null)[] = produits.length > 0 ? produits : Array(4).fill(null);

  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      {/* Header */}
      <div className="mb-12 flex items-end justify-between gap-4">
        <div>
          <p
            className="mb-3 text-[10px] font-black uppercase tracking-[0.35em]"
            style={{ color: "var(--v-hot)" }}
          >
            &#x2022; Stock limité &#x2022; Commande rapide
          </p>
          <h2
            className="font-[var(--font-display)] font-black uppercase leading-none tracking-tight"
            style={{ fontSize: "clamp(36px, 6vw, 72px)", color: "var(--v-text)" }}
          >
            Derniers
            <br />
            <span style={{ color: "var(--v-gold)" }}>Arrivages</span>
          </h2>
        </div>
        <Link
          href="/catalogue"
          className="hidden shrink-0 rounded-full border px-5 py-2 text-xs font-black uppercase tracking-widest transition-all hover:border-[var(--v-gold)] hover:text-[var(--v-gold)] md:flex items-center gap-2"
          style={{ borderColor: "var(--v-border)", color: "var(--v-muted)" }}
        >
          Tout voir &rarr;
        </Link>
      </div>

      {/* ── Mobile : cartes empilées ── */}
      <div className="space-y-4 md:hidden">
        {items.map((produit, i) => (
          <CompactCard key={produit?.id ?? i} produit={produit} index={i} />
        ))}
      </div>

      {/* ── Desktop : grande carte gauche + 3 compactes droite ── */}
      <div className="hidden md:flex md:gap-4 md:items-stretch" style={{ minHeight: "480px" }}>
        {/* Grande carte — Drop #01 */}
        <div className="flex-[0_0_46%]">
          <FeaturedCard produit={items[0]} index={0} />
        </div>
        {/* Cartes compactes — Drop #02, #03, #04 */}
        <div className="flex flex-1 flex-col gap-4">
          {items.slice(1, 4).map((produit, i) => (
            <CompactCard key={produit?.id ?? i} produit={produit} index={i + 1} />
          ))}
        </div>
      </div>

      {/* Mobile "Voir tout" */}
      <div className="mt-8 text-center md:hidden">
        <Link
          href="/catalogue"
          className="inline-block rounded-full border px-6 py-3 text-xs font-black uppercase tracking-widest transition-all"
          style={{ borderColor: "var(--v-gold)", color: "var(--v-gold)" }}
        >
          Explorer tout le catalogue &rarr;
        </Link>
      </div>
    </section>
  );
}
