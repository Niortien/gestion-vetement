"use client";

import { motion } from "framer-motion";
import { getWhatsappUrl } from "@/lib/whatsapp";

const WA_SVG = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function HomeWhatsappCta() {
  const waUrl = getWhatsappUrl("Bonjour Dri Valé ! Je veux passer une commande 🛒");

  return (
    <section
      className="relative overflow-hidden py-16"
      style={{ backgroundColor: "var(--v-lime)" }}
    >
      {/* Fond typo décoratif */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden"
        aria-hidden
      >
        <span
          className="font-[var(--font-display)] font-black uppercase leading-none"
          style={{ fontSize: "22vw", color: "rgba(255,255,255,0.06)" }}
        >
          WA
        </span>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "rgba(255,255,255,0.15)" }}
      />

      <div className="relative mx-auto max-w-7xl px-5">
        <motion.div
          className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16 md:items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* GAUCHE — texte */}
          <div className="text-center md:text-left">
            <p
              className="font-[var(--font-display)] text-xs font-black uppercase tracking-[0.35em]"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Commande directe
            </p>
            <h2
              className="mt-4 font-[var(--font-display)] font-black leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(36px, 7vw, 86px)", color: "#fff" }}
            >
              Commander<br />sur WhatsApp
            </h2>
            <p className="mt-5 text-base font-medium leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
              Message direct avec la boutique.
              <br />
              Paiement flexible. Réponse en moins de 30 min.
            </p>
          </div>

          {/* DROITE — CTA */}
          <div className="flex flex-col items-center md:items-end gap-5">
            {/* Icône WA décorative */}
            <div
              className="flex h-20 w-20 items-center justify-center rounded-2xl md:h-24 md:w-24"
              style={{ backgroundColor: "rgba(0,0,0,0.25)", backdropFilter: "blur(4px)" }}
              aria-hidden
            >
              <div style={{ color: "rgba(255,255,255,0.9)", transform: "scale(1.6)" }}>
                {WA_SVG}
              </div>
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-2xl px-8 py-4 font-[var(--font-display)] text-sm font-black uppercase tracking-widest transition-all hover:scale-[1.03] active:scale-[0.98]"
              style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "#fff", backdropFilter: "blur(4px)" }}
            >
              {WA_SVG}
              Ouvrir WhatsApp
            </a>

            <p
              className="font-[var(--font-mono)] text-sm font-bold tracking-wider"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              +225 07 09 29 44 68
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
