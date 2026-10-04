"use client";

import Link from "next/link";
import Image from "next/image";
import { IconWhatsapp } from "@/components/vitrine/common/VitrineIcons";
import { getWhatsappUrl } from "@/lib/whatsapp";

const waUrl = getWhatsappUrl("Bonjour Dri Valé, je veux voir vos nouveautés");

/**
 * Ouverture éditoriale (esprit Kith / Aimé Leon Dore) : la photo de la boutique prend tout l'écran sous la barre flottante,
 * le texte se pose en bas à gauche, deux boutons rectangulaires en bas à droite. Les textes sont fixes (blanc sur photo)
 * quel que soit le thème de la vitrine.
 */
export function HomeHero() {
  return (
    <section className="relative isolate -mt-20 flex h-[100svh] min-h-[560px] items-end overflow-hidden">
      <Image
        src="/images/dri_style/dir_hero.jpeg"
        alt="Dri Valé, la boutique de Yopougon"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-top"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to top, rgba(12,12,14,0.88) 0%, rgba(12,12,14,0.35) 38%, rgba(12,12,14,0) 62%), linear-gradient(to bottom, rgba(12,12,14,0.35) 0%, rgba(12,12,14,0) 18%)",
        }}
      />

      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8 px-5 pb-28 md:flex-row md:items-end md:justify-between md:pb-12">
        <div className="max-w-xl" style={{ color: "#F5F5F4" }}>
          <h1 className="tag-title text-[clamp(40px,7vw,96px)]">Sois le plus stylé de Yop.</h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: "rgba(245,245,244,0.82)" }}>
            Vêtements, sneakers et accessoires importés, en rayon à Yopougon. Choisis ta pièce, commande sur WhatsApp.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/catalogue"
            className="inline-flex min-h-12 items-center justify-center rounded-sm px-8 text-xs font-bold uppercase tracking-[0.14em] transition-transform duration-150 active:scale-[0.98]"
            style={{ backgroundColor: "#F0B429", color: "#0C0C0E" }}
          >
            Voir le catalogue
          </Link>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border px-7 text-xs font-bold uppercase tracking-[0.14em] transition-colors duration-150 hover:bg-white/10"
            style={{ borderColor: "rgba(255,255,255,0.75)", color: "#F5F5F4" }}
          >
            <IconWhatsapp size={16} />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
