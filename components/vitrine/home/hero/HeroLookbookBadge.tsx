import Link from "next/link";
import { IconArrowUpRight } from "./HeroIcons";

/** Pastille ronde au texte circulaire qui tourne, renvoie au lookbook. */
export function HeroLookbookBadge() {
  return (
    <Link
      href="/lookbook"
      aria-label="Voir le lookbook Le Style"
      className="absolute -right-1.5 -top-6 z-20 block h-24 w-24 rounded-full border md:-right-10 md:-top-10 md:h-[132px] md:w-[132px]"
      style={{ backgroundColor: "#0C0C0E", borderColor: "#F0B429", color: "#F5F5F4" }}
    >
      <svg viewBox="0 0 120 120" className="hero-spin absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <path id="hero-badge-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <text style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: 2.6, fill: "#F5F5F4" }}>
          <textPath href="#hero-badge-circle">VOIR LE LOOKBOOK · LE STYLE DRI VALÉ · </textPath>
        </text>
      </svg>
      <span
        className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
        style={{ backgroundColor: "#F0B429", color: "#0C0C0E" }}
      >
        <IconArrowUpRight size={18} />
      </span>
    </Link>
  );
}
