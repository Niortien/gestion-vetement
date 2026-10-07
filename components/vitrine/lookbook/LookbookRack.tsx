"use client";

import Image from "next/image";
import Link from "next/link";
import { usePublicLookbookPhotos } from "@/features/lookbook-photos/query/public-lookbook-photos-queries";
import { ProductCell, ProductGrid } from "@/components/vitrine/common/ProductRail";

interface LookItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  /** Photo envoyée par un client (URL externe) : affichée sans optimisation Next. */
  remote?: boolean;
}

const BOUTIQUE_LOOKS: LookItem[] = [
  { id: "l1", src: "/images/dri_style/look-selfie-lacoste.jpg", alt: "Client en tenue Lacoste dans la boutique", caption: "Look du jour" },
  { id: "l2", src: "/images/dri_style/client-sacs-drivale.jpg", alt: "Client avec ses sacs Dri Valé devant la boutique", caption: "Sorti de la boutique" },
  { id: "l3", src: "/images/dri_style/dri_style6.jpeg", alt: "Client en tenue Dri Valé", caption: "Style Dri Valé" },
  { id: "l4", src: "/images/dri_style/boutique-interieur-1.jpg", alt: "L'intérieur de la boutique Dri Valé", caption: "En rayon" },
];

/** Photos de clients accrochées au portant, puis la case « Ta photo ici ». */
export function LookbookRack() {
  const { data: res } = usePublicLookbookPhotos();
  const clientPhotos: LookItem[] = (res?.data ?? []).map((p) => ({
    id: p.id,
    src: p.url,
    alt: p.nom ? `${p.nom}, client Dri Valé` : "Client Dri Valé",
    caption: p.nom ?? "Client Dri Valé",
    remote: true,
  }));
  const items = [...clientPhotos, ...BOUTIQUE_LOOKS];

  return (
    <section className="mx-auto max-w-[1280px] px-5 pt-8 md:px-8 md:pt-10" aria-label="Photos de clients">
      <ProductGrid label="Photos de clients">
        {items.map((it, i) => (
          <ProductCell key={it.id}>
            <figure className="v-hang v-swing" style={{ animationDelay: `${0.2 + Math.min(i, 6) * 0.1}s` }}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl" style={{ backgroundColor: "var(--v-s2)" }}>
                <Image src={it.src} alt={it.alt} fill unoptimized={it.remote} sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </div>
              <figcaption className="mt-2 text-[13px]" style={{ color: "var(--v-muted)" }}>
                {it.caption}
              </figcaption>
            </figure>
          </ProductCell>
        ))}
        <ProductCell>
          <Link href="#envoyer" className="v-hang block">
            <span
              className="flex aspect-[4/5] flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed p-4 text-center"
              style={{ borderColor: "var(--v-dim)", backgroundColor: "var(--v-card)" }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
                <circle cx="12" cy="13" r="3.5" />
              </svg>
              <span className="v-t4">Ta photo ici</span>
              <span className="text-[13px]" style={{ color: "var(--v-muted)" }}>Habillé en Dri Valé ?</span>
            </span>
          </Link>
        </ProductCell>
      </ProductGrid>
    </section>
  );
}
