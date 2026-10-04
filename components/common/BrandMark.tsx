import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  /** Force l'affichage pour fond sombre (barre latérale noire du back-office). */
  onDark?: boolean;
  /** Couleurs de la vitrine publique (thème `data-theme`, indépendant du thème du back-office). */
  vitrine?: boolean;
  /** Hauteur Tailwind du logo (le ratio est conservé). */
  className?: string;
  priority?: boolean;
}

/*
 * Logo officiel : `public/images/logo/logo.jpeg` (étoiles, silhouette, « Dri Valé », signature), utilisé tel quel.
 * Le fichier est blanc sur noir. Sur fond sombre il est fondu par `mix-blend-mode: screen` (le noir disparaît) ;
 * sur fond clair on l'inverse puis `multiply` (texte noir sur le fond de la page).
 * Le cadrage retire les marges noires du JPEG : zone utile 568×283 px dans le fichier 640×469.
 */
const SRC = "/images/logo/logo.jpeg";
const FILE = { w: 640, h: 469 };
const CROP = { x: 33, y: 82, w: 568, h: 283 };

const DARK_BLEND = "mix-blend-screen";
const LIGHT_BLEND = "invert mix-blend-multiply";

function Logo({ blend, visibility, priority }: { blend: string; visibility?: string; priority?: boolean }) {
  return (
    <Image
      src={SRC}
      alt=""
      width={FILE.w}
      height={FILE.h}
      priority={priority}
      draggable={false}
      className={cn("absolute max-w-none select-none", blend, visibility)}
      style={{
        width: `${(FILE.w / CROP.w) * 100}%`,
        height: `${(FILE.h / CROP.h) * 100}%`,
        left: `${(-CROP.x / CROP.w) * 100}%`,
        top: `${(-CROP.y / CROP.h) * 100}%`,
      }}
    />
  );
}

export function BrandMark({ onDark = false, vitrine = false, className, priority = false }: BrandMarkProps) {
  return (
    <span
      role="img"
      aria-label="Dri Valé — Sortez toujours bien habillé"
      className={cn("relative block shrink-0 overflow-hidden", className ?? "h-14")}
      style={{ aspectRatio: `${CROP.w} / ${CROP.h}` }}
    >
      {onDark ? (
        <Logo blend={DARK_BLEND} priority={priority} />
      ) : vitrine ? (
        <>
          <Logo blend={DARK_BLEND} visibility="brand-logo-v-dark" priority={priority} />
          <Logo blend={LIGHT_BLEND} visibility="brand-logo-v-light" />
        </>
      ) : (
        <>
          <Logo blend={LIGHT_BLEND} visibility="brand-logo-on-light" priority={priority} />
          <Logo blend={DARK_BLEND} visibility="brand-logo-on-dark" />
        </>
      )}
    </span>
  );
}
