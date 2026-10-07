import Image from "next/image";
import Link from "next/link";

const PHOTOS = [
  { src: "/images/dri_style/client-sacs-drivale.jpg", alt: "Client avec ses sacs Dri Valé devant la boutique", offset: false },
  { src: "/images/dri_style/look-selfie-lacoste.jpg", alt: "Client en tenue Lacoste dans la boutique", offset: true },
  { src: "/images/dri_style/dri_style6.jpeg", alt: "Client en tenue Dri Valé", offset: false },
];

/** Bloc encre : les clients photographiés en boutique, accrochés à un rail blanc. */
export function HomeLookbookBand() {
  return (
    <section className="mx-auto max-w-[1280px] px-3 pt-16 md:px-8 md:pt-24" aria-labelledby="lookbook-band-titre">
      <div className="rounded-[28px] py-8 md:rounded-[34px] md:py-11" style={{ backgroundColor: "#0C0C0E", color: "#fff" }}>
        <div className="flex flex-col gap-5 px-5 md:flex-row md:items-end md:justify-between md:px-11">
          <div>
            <h2 id="lookbook-band-titre" className="v-t1">
              Ils sortent bien habillés
            </h2>
            <p className="mt-2.5 text-[15px] md:text-base" style={{ color: "#C9C9CE" }}>
              Les clients de Dri Valé, photographiés en boutique.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link href="/lookbook" className="v-btn v-btn-sm" style={{ color: "#fff", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.75)" }}>
              Voir le lookbook
            </Link>
            <Link href="/lookbook#envoyer" className="v-btn v-btn-sm" style={{ color: "#fff", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.75)" }}>
              Envoyer ma photo
            </Link>
          </div>
        </div>

        <div className="relative mt-8 pt-[26px] md:mt-9">
          <span aria-hidden className="absolute left-0 right-0 top-[9px] h-[3px] rounded-[3px] bg-white" />
          <ul className="v-rail-row px-5 md:gap-[22px] md:px-11" aria-label="Photos de clients">
            {PHOTOS.map((p, i) => (
              <li key={p.src} className={p.offset ? "mt-[18px] md:mt-[30px]" : undefined}>
                <figure
                  className="v-hang v-swing w-[150px] md:w-[260px]"
                  style={{ animationDelay: `${0.2 + i * 0.12}s`, ["--hook" as string]: "#fff" }}
                >
                  <span aria-hidden className="absolute left-1/2 top-[-20px] ml-[-9px] h-[15px] w-[18px] rounded-t-[12px] border-[2.5px] border-b-0 border-white" />
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[14px] md:rounded-[18px]">
                    <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 260px, 150px" className="object-cover" />
                  </div>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
