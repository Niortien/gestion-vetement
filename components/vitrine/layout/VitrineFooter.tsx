"use client";

import Link from "next/link";
import { getWhatsappUrl } from "@/lib/whatsapp";
import { BrandMark } from "@/components/common/BrandMark";

const LINKS = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/marque", label: "La marque" },
  { href: "/login", label: "Espace équipe" },
];

const BOUTIQUES = [
  { nom: "Oasis Ananeraie, Yopougon", tel: "+2250710444625", affiche: "07 10 44 46 25" },
  { nom: "Toit Rouge, Yopougon", tel: "+2250767602389", affiche: "07 67 60 23 89" },
];

/** Pied de page encre : logo, liens, les deux boutiques, paiements. Le noir appartient à la marque. */
export function VitrineFooter() {
  const waUrl = getWhatsappUrl("Bonjour Dri Valé, j'ai une question !");

  return (
    <footer className="pb-28 md:pb-0" style={{ backgroundColor: "#0C0C0E", color: "#fff" }}>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10 px-5 py-10 md:px-8 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <BrandMark onDark className="h-16 self-start md:h-20" />
          <nav aria-label="Pied de page" className="grid grid-cols-2 gap-x-8 gap-y-3 text-[15px] font-semibold md:flex md:gap-7">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="min-h-11 content-center hover:underline" style={{ textDecorationColor: "#F0B429", textUnderlineOffset: 6 }}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="grid gap-8 border-t pt-8 md:grid-cols-3" style={{ borderColor: "rgba(255,255,255,0.14)" }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#F0B429" }}>Nous trouver</p>
            <ul className="mt-3 space-y-2.5 text-sm" style={{ color: "#C9C9CE" }}>
              {BOUTIQUES.map((b) => (
                <li key={b.nom}>
                  {b.nom}
                  <br />
                  <a href={`tel:${b.tel}`} className="font-bold text-white">{b.affiche}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#F0B429" }}>Écrire</p>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block min-h-11 content-center text-sm font-bold text-white">
              WhatsApp : +225 07 09 29 44 68
            </a>
            <p className="mt-1 text-xs" style={{ color: "#A8A8AE" }}>Réponse sous 30 min, tous les jours.</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#F0B429" }}>On accepte</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {["Wave", "Orange Money", "MTN Money", "Cash"].map((m) => (
                <li key={m} className="rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-[13px]" style={{ color: "#A8A8AE" }}>© 2026 Dri Valé, Yopougon. Sortez toujours bien habillé.</p>
      </div>
    </footer>
  );
}
