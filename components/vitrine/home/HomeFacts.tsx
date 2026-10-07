import { IconPin, IconWhatsapp } from "@/components/vitrine/common/VitrineIcons";

function IconCard() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 10h18M7 15h3" />
    </svg>
  );
}

const FACTS = [
  { icon: <IconPin size={26} />, title: "Deux boutiques à Yopougon.", text: "Oasis et Toit Rouge, chacune avec son stock." },
  { icon: <IconWhatsapp size={26} />, title: "Commande en un message.", text: "Le panier écrit le message WhatsApp pour toi." },
  { icon: <IconCard />, title: "Paiement comme tu veux.", text: "Wave, Orange Money, MTN Money ou cash." },
];

/** Trois promesses vérifiables, juste sous l'ouverture. */
export function HomeFacts() {
  return (
    <section aria-label="Pourquoi Dri Valé" className="mx-auto max-w-[1280px] px-5 pt-12 md:px-8 md:pt-14">
      <ul className="flex flex-col gap-6 md:flex-row md:gap-8">
        {FACTS.map((f) => (
          <li key={f.title} className="flex flex-1 items-start gap-3.5 text-[15px]" style={{ color: "var(--v-text)" }}>
            <span className="mt-0.5 shrink-0" style={{ color: "var(--v-text)" }}>{f.icon}</span>
            <p>
              <strong className="font-bold">{f.title}</strong> <span style={{ color: "var(--v-muted)" }}>{f.text}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
