import Image from "next/image";

/** Le récit de la marque et une photo des rayons tels qu'ils sont aujourd'hui. */
export function MarqueStory() {
  return (
    <section className="mx-auto grid max-w-[1280px] gap-8 px-5 pt-12 md:grid-cols-2 md:items-center md:gap-14 md:px-8 md:pt-20" aria-labelledby="histoire-titre">
      <div className="flex flex-col gap-4">
        <h2 id="histoire-titre" className="v-t1">
          Classé. Stylé. De Yop.
        </h2>
        <p className="max-w-xl text-base leading-relaxed md:text-[17px]">
          Dri Valé, c&rsquo;est Yopougon qui s&rsquo;habille bien. Des fringues importées, sélectionnées pour les vrais : tee-shirts,
          kicks, polos, cargos. Tout ce qu&rsquo;il faut pour être le plus classé de la commune.
        </p>
      </div>
      <figure>
        <div className="relative h-[420px] overflow-hidden rounded-[22px] md:h-[480px]">
          <Image src="/images/dri_style/boutique-interieur-2.jpg" alt="Les rayons de sacs, maillots et chemises de la boutique" fill sizes="(min-width: 768px) 560px, 100vw" className="object-cover" />
        </div>
        <figcaption className="mt-2.5 text-[13px]" style={{ color: "var(--v-muted)" }}>
          Les rayons, tels qu&rsquo;ils sont aujourd&rsquo;hui.
        </figcaption>
      </figure>
    </section>
  );
}
