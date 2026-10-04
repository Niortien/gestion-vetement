import { cn } from "@/lib/utils";

interface BrandMarkProps {
  /** Force le blanc (fond toujours sombre : barre latérale, panneau de connexion). */
  onDark?: boolean;
  /** Utilise la couleur de texte de la vitrine publique (`--v-text`, indépendante du thème du back-office). */
  vitrine?: boolean;
  /** Hauteur Tailwind du logo (le ratio est conservé). */
  className?: string;
}

/*
 * Logo officiel : `public/images/logo/logo.jpeg` (étoiles, silhouette, « Dri Valé », signature), utilisé tel quel.
 * Le fichier est blanc sur noir : on s'en sert comme masque de luminance (`mask-mode: luminance`) devant un aplat de la
 * couleur de texte courante. Le noir du JPEG devient transparent, le blanc prend la couleur du thème — sans recolorer
 * ni redessiner le logo, et sans dépendre d'un fond particulier.
 * Cadrage : zone utile 568×283 px dans le fichier 640×469 (marges noires retirées).
 */
const SRC = "/images/logo/logo.jpeg";
const FILE = { w: 640, h: 469 };
const CROP = { x: 33, y: 82, w: 568, h: 283 };

export function BrandMark({ onDark = false, vitrine = false, className }: BrandMarkProps) {
  const color = onDark ? "#FFFFFF" : vitrine ? "var(--v-text)" : "var(--color-text)";
  const mask = {
    maskImage: `url(${SRC})`,
    WebkitMaskImage: `url(${SRC})`,
    maskMode: "luminance",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskSize: `${(FILE.w / CROP.w) * 100}% ${(FILE.h / CROP.h) * 100}%`,
    WebkitMaskSize: `${(FILE.w / CROP.w) * 100}% ${(FILE.h / CROP.h) * 100}%`,
    maskPosition: `${(CROP.x / (FILE.w - CROP.w)) * 100}% ${(CROP.y / (FILE.h - CROP.h)) * 100}%`,
    WebkitMaskPosition: `${(CROP.x / (FILE.w - CROP.w)) * 100}% ${(CROP.y / (FILE.h - CROP.h)) * 100}%`,
  } as const;

  return (
    <span
      role="img"
      aria-label="Dri Valé — Sortez toujours bien habillé"
      className={cn("block shrink-0", className ?? "h-14")}
      style={{ aspectRatio: `${CROP.w} / ${CROP.h}`, backgroundColor: color, ...mask }}
    />
  );
}
