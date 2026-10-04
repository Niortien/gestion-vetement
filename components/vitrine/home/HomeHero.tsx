"use client";

import Link from "next/link";
import Image from "next/image";
import { IconArrow, IconWhatsapp } from "@/components/vitrine/common/VitrineIcons";
import { getWhatsappUrl } from "@/lib/whatsapp";

const waUrl = getWhatsappUrl("Bonjour Dri Valé, je veux voir vos nouveautés");

const LINES = [
  { text: "Sois le", gold: false },
  { text: "plus stylé", gold: true },
  { text: "de Yop.", gold: false },
];

/**
 * Affiche d'accueil : la photo de la boutique plein écran, le titre en bandes condensées posé dessus.
 * Une seule animation signée : chaque bande se découvre vers le bas (clip-path), en cascade.
 */
export function HomeHero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] flex-col justify-end overflow-hidden" style={{ backgroundColor: "var(--v-bg)" }}>
      <Image
        src="/images/dri_style/dir_hero.jpeg"
        alt="Dri Valé, vitrine de la boutique à Yopougon"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-top"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "linear-gradient(to top, var(--v-bg) 8%, color-mix(in srgb, var(--v-bg) 55%, transparent) 45%, transparent 80%)" }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-24 pt-24 md:pb-12">
        <h1 className="poster text-[clamp(64px,17vw,208px)]" aria-label="Sois le plus stylé de Yop.">
          {LINES.map((l, i) => (
            <span key={l.text} aria-hidden className="block overflow-hidden pb-[0.04em]">
              <span
                className="poster-line block"
                style={{ color: l.gold ? "var(--v-gold-text)" : "var(--v-text)", animationDelay: `${i * 90}ms` }}
              >
                {l.text}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-[15px] leading-relaxed" style={{ color: "var(--v-muted)" }}>
            Vêtements, sneakers et accessoires importés, en rayon à Yopougon. Choisis ta pièce, commande sur WhatsApp.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/catalogue"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-7 text-sm font-bold transition-transform duration-150 active:scale-[0.98]"
              style={{ backgroundColor: "var(--v-gold)", color: "var(--v-on-gold)" }}
            >
              Voir le catalogue
              <IconArrow size={18} />
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-6 text-sm font-semibold transition-colors duration-150 hover:border-[var(--v-gold)]"
              style={{ borderColor: "var(--v-border-gold)", color: "var(--v-text)" }}
            >
              <IconWhatsapp size={18} />
              Écrire sur WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
