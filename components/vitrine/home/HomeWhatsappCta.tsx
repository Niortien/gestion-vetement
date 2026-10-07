"use client";

import { IconWhatsapp } from "@/components/vitrine/common/VitrineIcons";
import { getWhatsappUrl } from "@/lib/whatsapp";

const waUrl = getWhatsappUrl("Bonjour Dri Valé, je veux passer une commande");

const BOUTIQUES = [
  { nom: "Dri Valé Oasis", lieu: "Oasis Ananeraie, Yopougon", tel: "+2250710444625", affiche: "07 10 44 46 25" },
  { nom: "Dri Valé Toit Rouge", lieu: "Toit Rouge, Yopougon", tel: "+2250767602389", affiche: "07 67 60 23 89" },
];

/** Appel final : un seul bouton or, et les deux boutiques avec leur numéro. */
export function HomeWhatsappCta() {
  return (
    <section className="mx-auto flex max-w-[1280px] flex-col gap-10 px-5 pb-16 pt-16 md:flex-row md:gap-12 md:px-8 md:pb-24 md:pt-24" aria-labelledby="cta-titre">
      <div className="flex flex-1 flex-col items-start gap-4">
        <h2 id="cta-titre" className="v-t0">
          Tu l&rsquo;as vue ? Commande-la.
        </h2>
        <p className="max-w-[460px] text-[17px] leading-relaxed" style={{ color: "var(--v-muted)" }}>
          Envoie-nous la pièce, ta taille et ton quartier directement sur WhatsApp. On te répond pour la remise et le paiement.
        </p>
        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="v-btn v-btn-gold mt-2">
          <IconWhatsapp size={20} />
          Ouvrir WhatsApp
        </a>
      </div>

      <div className="v-card flex-1 px-5 py-2 md:px-7">
        <ul>
          {BOUTIQUES.map((b, i) => (
            <li key={b.nom} className="flex items-center gap-4 py-5" style={{ borderBottom: i === 0 ? "1px solid var(--v-border)" : undefined }}>
              <div className="flex-1">
                <p className="v-t3">{b.nom}</p>
                <p className="text-[13px]" style={{ color: "var(--v-muted)" }}>{b.lieu}</p>
              </div>
              <a href={`tel:${b.tel}`} className="v-btn v-btn-soft v-btn-sm" aria-label={`Appeler ${b.nom}, ${b.affiche}`}>
                {b.affiche}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
