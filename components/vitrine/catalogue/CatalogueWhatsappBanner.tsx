"use client";

import { getWhatsappUrl } from "@/lib/whatsapp";
import { IconWhatsapp } from "@/components/vitrine/common/VitrineIcons";

export function CatalogueWhatsappBanner() {
  const url = getWhatsappUrl("Bonjour, ma taille n'est pas disponible en ligne. Pouvez-vous m'aider ?");

  return (
    <section className="mx-auto max-w-[1280px] px-5 pb-16 pt-6 md:px-8">
      <div className="v-card flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <h2 className="v-t3">Pas ta taille dans la liste ?</h2>
          <p className="mt-2 max-w-md text-[15px]" style={{ color: "var(--v-muted)" }}>
            Écris-nous la pièce et la taille : on vérifie dans les deux boutiques, Oasis et Toit Rouge.
          </p>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="v-btn v-btn-ink v-btn-sm self-start md:self-auto">
          <IconWhatsapp size={18} />
          Demander sur WhatsApp
        </a>
      </div>
    </section>
  );
}
