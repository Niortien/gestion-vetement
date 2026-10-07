import Link from "next/link";

/** Titre du lookbook : une phrase, un bouton vers le formulaire d'envoi. */
export function LookbookHeader() {
  return (
    <section className="mx-auto flex max-w-[1280px] flex-col items-start gap-3 px-5 pb-2 pt-6 md:px-8 md:pt-12" aria-labelledby="lookbook-titre">
      <h1 id="lookbook-titre" className="v-t0">
        Lookbook
      </h1>
      <p className="max-w-xl text-[17px] leading-relaxed" style={{ color: "var(--v-muted)" }}>
        Les clients de Dri Valé, photographiés en boutique. Envoie la tienne : on la publie après l&rsquo;avoir regardée.
      </p>
      <Link href="#envoyer" className="v-btn v-btn-ink v-btn-sm mt-1">
        Envoyer ma photo
      </Link>
    </section>
  );
}
