import { cn } from "@/lib/utils";

interface BrandMarkProps {
  /** `full` = pastille + « Dri Valé » ; `icon` = pastille seule. */
  variant?: "full" | "icon";
  /** Force le texte clair (fond toujours sombre : barre latérale forêt). Omis : suit le thème. */
  onDark?: boolean;
  /** Affiche la signature sous le nom. */
  tagline?: boolean;
  className?: string;
}

/** Pastille citron vert : l'étoile reprend celles du logo d'origine (la silhouette qui monte vers les étoiles). */
function Mark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C6F03A] text-[#0E1A14]", className)}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    </span>
  );
}

/** Logo Dri Valé en code (le fichier d'origine est un JPEG noir avec filigrane, inutilisable sur fond coloré). */
export function BrandMark({ variant = "full", onDark, tagline = false, className }: BrandMarkProps) {
  if (variant === "icon") return <Mark className={className} />;

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)} role="img" aria-label="Dri Valé — Sortez toujours bien habillé">
      <Mark />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-xl font-extrabold tracking-tight",
            onDark ? "text-sidebar-text" : "text-text"
          )}
        >
          Dri<span className={onDark ? "text-sidebar-accent" : "text-accent-text"}> Valé</span>
        </span>
        {tagline && (
          <span className={cn("mt-1 text-[10px] font-medium tracking-wide", onDark ? "text-sidebar-muted" : "text-text-muted")}>
            Sortez toujours bien habillé
          </span>
        )}
      </span>
    </span>
  );
}
