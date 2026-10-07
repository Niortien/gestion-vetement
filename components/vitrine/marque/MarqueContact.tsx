import { getWhatsappUrl } from "@/lib/whatsapp";

const BOUTIQUES = [
  { nom: "Dri Valé Oasis", lieu: "Oasis Ananeraie, Yopougon", tel: "+2250710444625", affiche: "07 10 44 46 25" },
  { nom: "Dri Valé Toit Rouge", lieu: "Toit Rouge, Yopougon", tel: "+2250767602389", affiche: "07 67 60 23 89" },
];

const CONTACTS = [
  { nom: "WhatsApp", valeur: "07 09 29 44 68", href: getWhatsappUrl("Bonjour Dri Valé, j'ai une question !") },
  { nom: "Instagram", valeur: "@drivaleboutique", href: "https://instagram.com/drivaleboutique" },
  { nom: "TikTok", valeur: "@kaypeurbienpaye1", href: "https://tiktok.com/@kaypeurbienpaye1" },
];

/** Les deux boutiques avec leur numéro, puis les trois façons d'écrire. */
export function MarqueContact() {
  return (
    <div id="contact" className="mx-auto grid max-w-[1280px] gap-12 px-5 pb-16 pt-14 md:grid-cols-2 md:gap-14 md:px-8 md:pb-24 md:pt-20">
      <section aria-labelledby="boutiques-titre" className="flex flex-col gap-3">
        <h2 id="boutiques-titre" className="v-t2 mb-1">Nos deux boutiques</h2>
        {BOUTIQUES.map((b) => (
          <div key={b.nom} className="v-card flex flex-col gap-3 p-[18px]">
            <div>
              <p className="v-t3">{b.nom}</p>
              <p className="text-[13px]" style={{ color: "var(--v-muted)" }}>{b.lieu}</p>
            </div>
            <div className="flex gap-2">
              <a href={`tel:${b.tel}`} className="v-btn v-btn-soft v-btn-sm">Appeler {b.affiche}</a>
            </div>
          </div>
        ))}
      </section>

      <section aria-labelledby="ecrire-titre">
        <h2 id="ecrire-titre" className="v-t2 mb-1.5">Nous écrire</h2>
        <ul>
          {CONTACTS.map((c) => (
            <li key={c.nom}>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-14 items-center justify-between border-b font-bold"
                style={{ borderColor: "var(--v-border)" }}
              >
                {c.nom}
                <span className="font-semibold tabular-nums" style={{ color: "var(--v-muted)" }}>{c.valeur}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
