"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import type { CartItem } from "@/stores/vitrineStore";
import { useVitrineStore } from "@/stores/vitrineStore";
import { buildWhatsappMessage } from "@/lib/whatsapp";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { IconWhatsapp } from "@/components/vitrine/common/VitrineIcons";

interface BoutiqueGroup {
  nom: string;
  whatsapp?: string;
  items: CartItem[];
}

const STEPS = ["Panier", "Message", "Réponse", "Remise"];

/** Les quatre étoiles du logo comme indicateur d'étape. */
function Steps({ current }: { current: number }) {
  return (
    <ol className="v-card flex px-1.5 py-3.5" style={{ borderRadius: 18 }} aria-label="Étapes de la commande">
      {STEPS.map((label, i) => {
        const on = i <= current;
        return (
          <li key={label} aria-current={i === current ? "step" : undefined} className="flex flex-1 flex-col items-center gap-1.5 text-xs font-bold" style={{ color: on ? "var(--v-text)" : "var(--v-dim)" }}>
            <i
              aria-hidden
              className="block"
              style={{
                width: on ? 16 : 12,
                height: on ? 16 : 12,
                backgroundColor: on ? "#F0B429" : "var(--v-border)",
                clipPath: "polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%)",
              }}
            />
            {label}
          </li>
        );
      })}
    </ol>
  );
}

/** Panier : feuille qui monte du bas sur mobile, panneau à droite sur ordinateur. Un bouton or par boutique. */
export function CartDrawer() {
  const cart = useVitrineStore((s) => s.cart);
  const cartOpen = useVitrineStore((s) => s.cartOpen);
  const setCartOpen = useVitrineStore((s) => s.setCartOpen);
  const removeFromCart = useVitrineStore((s) => s.removeFromCart);
  const updateQuantite = useVitrineStore((s) => s.updateQuantite);
  const reduced = useReducedMotion();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  const [quartier, setQuartier] = useState("");
  const [prenom, setPrenom] = useState("");

  const nbPieces = cart.reduce((s, i) => s + i.quantite, 0);
  const total = cart.reduce((sum, item) => sum + item.quantite * parseFloat(item.produit.prixVente || "0"), 0);

  // Une commande par boutique : chaque groupe part vers le WhatsApp de sa boutique.
  const groups = useMemo(() => {
    const acc: Record<string, BoutiqueGroup> = {};
    for (const item of cart) {
      const key = item.variante.boutique?.id ?? "__default__";
      acc[key] ??= {
        nom: item.variante.boutique?.nom ?? "Boutique",
        whatsapp: item.variante.boutique?.whatsapp ?? undefined,
        items: [],
      };
      acc[key].items.push(item);
    }
    return Object.entries(acc);
  }, [cart]);

  const messageFor = (group: BoutiqueGroup) =>
    buildWhatsappMessage({
      lignes: group.items.map((item) => ({
        produitNom: item.produit.nom,
        sku: item.produit.sku,
        couleur: item.variante.couleur,
        taille: String(item.variante.taille),
        quantite: item.quantite,
        prix: parseFloat(item.produit.prixVente || "0"),
        boutiqueNom: group.nom,
      })),
      clientNom: prenom.trim() || "À préciser",
      clientTel: "À préciser",
      livraison: "boutique",
      notes: quartier.trim() ? `Quartier : ${quartier.trim()}` : undefined,
    });

  const handleCommander = (group: BoutiqueGroup) => {
    const number = group.whatsapp ? group.whatsapp.replace(/\D/g, "") : (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2250709294468");
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(messageFor(group))}`, "_blank");
  };

  // Échap ferme, le focus va sur « Fermer » à l'ouverture.
  useEffect(() => {
    if (!cartOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cartOpen, setCartOpen]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90]"
            style={{ backgroundColor: "rgba(12,12,14,0.55)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            aria-hidden
          />

          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="fixed inset-x-0 bottom-0 top-16 z-[95] flex flex-col rounded-t-[28px] md:inset-y-0 md:left-auto md:right-0 md:w-[440px] md:rounded-none md:rounded-l-[28px]"
            style={{ backgroundColor: "var(--v-bg)", color: "var(--v-text)" }}
            initial={reduced ? { opacity: 0 } : { y: "100%" }}
            animate={reduced ? { opacity: 1 } : { y: 0 }}
            exit={reduced ? { opacity: 0 } : { y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <span aria-hidden className="mx-auto mt-2.5 h-[5px] w-11 rounded-[3px] md:hidden" style={{ backgroundColor: "var(--v-s3)" }} />

            <div className="flex items-center justify-between px-5 pb-3 pt-3 md:pt-5">
              <div>
                <h2 id={titleId} className="v-t2">Ton panier</h2>
                <p className="text-[13px]" style={{ color: "var(--v-muted)" }}>
                  {nbPieces} pièce{nbPieces > 1 ? "s" : ""}
                  {groups.length > 1 ? `, ${groups.length} boutiques` : ""}
                </p>
              </div>
              <button ref={closeRef} type="button" onClick={() => setCartOpen(false)} aria-label="Fermer le panier" className="flex h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: "var(--v-card)", boxShadow: "inset 0 0 0 1px var(--v-border)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 pb-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                  <p className="v-t3">Ton panier est vide</p>
                  <Link href="/catalogue" onClick={() => setCartOpen(false)} className="v-btn v-btn-ink v-btn-sm">
                    Voir le catalogue
                  </Link>
                </div>
              ) : (
                <>
                  <Steps current={0} />

                  <ul>
                    {cart.map((item) => {
                      const prix = parseFloat(item.produit.prixVente || "0");
                      const image = item.produit.imageUrl ?? item.produit.images?.[0]?.url;
                      return (
                        <li key={item.variante.id} className="grid grid-cols-[84px_1fr] gap-3.5 border-b py-4" style={{ borderColor: "var(--v-border)" }}>
                          <div className="h-[105px] w-[84px] overflow-hidden rounded-[14px]" style={{ backgroundColor: "var(--v-s2)" }}>
                            {image && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={image} alt={item.produit.nom} className="h-full w-full object-cover" />
                            )}
                          </div>
                          <div className="flex min-w-0 flex-col gap-1">
                            <div className="flex justify-between gap-2">
                              <p className="v-t4 truncate">{item.produit.nom}</p>
                              <p className="v-price">{(prix * item.quantite).toLocaleString("fr-FR")}</p>
                            </div>
                            <p className="text-[13px]" style={{ color: "var(--v-muted)" }}>
                              Taille {item.variante.taille}, {item.variante.couleur}
                            </p>
                            {item.variante.boutique?.nom && (
                              <p className="text-[13px]" style={{ color: "var(--v-muted)" }}>{item.variante.boutique.nom}</p>
                            )}
                            <div className="mt-1.5 flex items-center justify-between">
                              <div className="inline-flex items-center rounded-full" style={{ backgroundColor: "var(--v-card)", boxShadow: "inset 0 0 0 1px var(--v-border)" }}>
                                <button type="button" onClick={() => updateQuantite(item.variante.id, item.quantite - 1)} aria-label={`Retirer une pièce ${item.produit.nom}`} className="h-10 w-11 text-xl font-semibold">
                                  −
                                </button>
                                <span className="min-w-5 text-center font-bold tabular-nums" aria-live="polite">{item.quantite}</span>
                                <button type="button" onClick={() => updateQuantite(item.variante.id, item.quantite + 1)} aria-label={`Ajouter une pièce ${item.produit.nom}`} className="h-10 w-11 text-xl font-semibold">
                                  +
                                </button>
                              </div>
                              <button type="button" onClick={() => removeFromCart(item.variante.id)} className="v-link min-h-11 text-[13px]">
                                Retirer
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <div>
                    <div className="flex items-baseline justify-between">
                      <p className="v-t4">Total</p>
                      <p className="v-price text-2xl">{total.toLocaleString("fr-FR")} FCFA</p>
                    </div>
                    {groups.length > 1 && (
                      <p className="mt-1.5 text-[13px]" style={{ color: "var(--v-muted)" }}>
                        Tes pièces sont dans {groups.length} boutiques : une commande part vers chacune, et on te dira où et quand les récupérer.
                      </p>
                    )}
                  </div>

                  <div className="space-y-3.5">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="cart-quartier" className="text-[13px] font-bold">Ton quartier</label>
                      <input id="cart-quartier" className="input-field" value={quartier} onChange={(e) => setQuartier(e.target.value)} placeholder="Par exemple Niangon, Selmer, Sicogi" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="cart-prenom" className="text-[13px] font-bold">Ton prénom (facultatif)</label>
                      <input id="cart-prenom" className="input-field" value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Pour qu'on sache à qui répondre" />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="v-t4">Le message envoyé</h3>
                    {groups.map(([key, group]) => (
                      <div key={key} className="rounded-[22px] p-3.5" style={{ backgroundColor: "#ECE5DA", color: "#0C0C0E" }}>
                        {groups.length > 1 && <p className="mb-1.5 text-xs font-bold">{group.nom}</p>}
                        <p className="max-h-48 overflow-y-auto whitespace-pre-line rounded-[20px_20px_6px_20px] px-4 py-3.5 text-[13.5px] leading-relaxed" style={{ backgroundColor: "#F0B429" }}>
                          {messageFor(group)}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="space-y-2.5 border-t px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-4" style={{ borderColor: "var(--v-border)", backgroundColor: "var(--v-bg)" }}>
                {groups.map(([key, group]) => (
                  <button key={key} type="button" onClick={() => handleCommander(group)} className="v-btn v-btn-gold w-full">
                    <IconWhatsapp size={20} />
                    {groups.length > 1 ? `Envoyer à ${group.nom}` : "Envoyer sur WhatsApp"}
                  </button>
                ))}
                <p className="text-center text-[13px]" style={{ color: "var(--v-muted)" }}>
                  Paiement : Wave, Orange Money, MTN Money ou cash. Rien n&rsquo;est payé sur le site.
                </p>
              </div>
            )}
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}
