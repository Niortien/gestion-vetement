"use client";

import { IconWhatsapp } from "@/components/vitrine/common/VitrineIcons";
import { getWhatsappUrl } from "@/lib/whatsapp";

const waUrl = getWhatsappUrl("Bonjour Dri Valé, je veux passer une commande");

/** Appel final : un seul geste. Fond d'accent, texte d'encre (lisible en clair comme en sombre). */
export function HomeWhatsappCta() {
  return (
    <section className="px-5 pb-24 pt-8 md:pb-24">
      <div
        className="mx-auto flex max-w-7xl flex-col items-start gap-8 rounded-3xl p-8 md:flex-row md:items-end md:justify-between md:p-14"
        style={{ backgroundColor: "var(--v-gold)", color: "var(--v-on-gold)" }}
      >
        <div>
          <h2 className="poster text-[clamp(44px,8vw,104px)]">
            Tu l&rsquo;as vue ?
            <br />
            Commande-la.
          </h2>
          <p className="mt-5 max-w-md text-base font-medium leading-relaxed" style={{ opacity: 0.8 }}>
            Envoie-nous la pièce, ta taille et ton quartier directement sur WhatsApp.
          </p>
        </div>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-14 shrink-0 items-center gap-3 rounded-2xl px-8 text-base font-bold transition-transform duration-150 active:scale-[0.98]"
          style={{ backgroundColor: "var(--v-on-gold)", color: "var(--v-gold)" }}
        >
          <IconWhatsapp size={22} />
          Ouvrir WhatsApp
        </a>
      </div>
    </section>
  );
}
