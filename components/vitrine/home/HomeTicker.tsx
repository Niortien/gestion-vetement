"use client";

import { IconStar } from "@/components/vitrine/common/VitrineIcons";

/** Bandeau de faits : seulement ce que la boutique affirme sans réserve (slogan, lieu, commande, paiements). */
const ITEMS = [
  "Sortez toujours bien habillé",
  "Boutique à Yopougon, Abidjan",
  "Commande sur WhatsApp",
  "Paiement Wave · Orange Money · Cash",
];

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {ITEMS.map((t) => (
        <li key={t} className="flex shrink-0 items-center">
          <span className="tag-title px-6 text-sm" style={{ color: "var(--v-text)" }}>
            {t}
          </span>
          <IconStar size={10} style={{ color: "var(--v-gold-text)" }} />
        </li>
      ))}
    </ul>
  );
}

export function HomeTicker() {
  return (
    <div className="overflow-hidden border-y py-3.5" style={{ borderColor: "var(--v-border)", backgroundColor: "var(--v-s1)" }}>
      <div className="vitrine-marquee-track flex w-max">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
