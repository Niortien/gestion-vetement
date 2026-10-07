import Image from "next/image";

/** Ouverture : la façade de la boutique sous la barre flottante, une promesse en deux lignes. */
export function MarqueHero() {
  return (
    <header className="relative isolate -mt-20 flex h-[560px] items-end overflow-hidden md:h-[640px]" style={{ color: "#fff" }}>
      <Image src="/images/dri_style/boutique-facade.jpg" alt="La façade de la boutique Dri Valé à Yopougon" fill priority sizes="100vw" className="-z-20 object-cover" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "linear-gradient(180deg, rgba(12,12,14,0.5) 0%, rgba(12,12,14,0) 30%, rgba(12,12,14,0.2) 55%, rgba(12,12,14,0.9) 100%)" }}
      />
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-3 px-5 pb-9 md:px-8 md:pb-14">
        <h1 className="v-t0 max-w-3xl" style={{ fontSize: "clamp(40px, 7vw, 76px)" }}>
          Sortez toujours bien habillé.
        </h1>
        <p className="text-base md:text-lg" style={{ color: "rgba(255,255,255,0.9)" }}>
          Une boutique de quartier à Yopougon, avec un vrai stock.
        </p>
      </div>
    </header>
  );
}
