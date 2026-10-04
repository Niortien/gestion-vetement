"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconArrowLeft, IconBoxSeam, IconCoin, IconShirt } from "@tabler/icons-react";
import { BrandMark } from "@/components/common/BrandMark";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motionDurations, motionEasing } from "@/lib/motionVariants";

const HIGHLIGHTS = [
  { icon: IconBoxSeam, text: "Stock par taille et par couleur, entrées et sorties tracées" },
  { icon: IconCoin, text: "Caisse en direct, reçus et bilan de la journée" },
  { icon: IconShirt, text: "Votre vitrine en ligne alimentée par le stock" },
];

/** Cadre commun des pages d'authentification : photo de la boutique + panneau de marque (desktop), formulaire à droite. */
export function AuthShell({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="relative hidden overflow-hidden bg-sidebar p-10 text-sidebar-text lg:flex lg:flex-col lg:justify-between">
        <Image
          src="/images/dri_style/boutique-facade.jpg"
          alt=""
          fill
          priority
          sizes="42vw"
          className="object-cover opacity-30"
        />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,var(--sidebar-bg)_0%,transparent_45%,var(--sidebar-bg)_100%)]" />

        <div className="relative">
          <BrandMark onDark className="h-16" />
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionDurations.xslow, ease: motionEasing.outExpo }}
          className="relative max-w-md"
        >
          <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight">
            Sortez toujours <span className="text-sidebar-accent">bien habillé.</span>
          </h2>
          <ul className="mt-8 flex flex-col gap-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-sidebar-muted">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sidebar-active text-sidebar-accent">
                  <Icon size={16} aria-hidden />
                </span>
                <span className="pt-1">{text}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <Link
          href="/"
          className="relative inline-flex w-fit cursor-pointer items-center gap-2 text-sm font-medium text-sidebar-muted transition-colors duration-150 hover:text-sidebar-text"
        >
          <IconArrowLeft size={16} aria-hidden /> Voir la vitrine
        </Link>
      </aside>

      <main className="relative flex flex-col items-center justify-center gap-6 px-4 py-10 md:px-8">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <div className="lg:hidden">
          <BrandMark className="h-12" />
        </div>
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
