const PROMESSES = [
  { titre: "Ce qui est affiché est en rayon", texte: "Le site lit le stock de la boutique. Si une pièce est en rupture, elle est marquée comme telle." },
  { titre: "Des pièces importées, choisies une par une", texte: "Vêtements, sneakers et accessoires sélectionnés pour Yopougon." },
  { titre: "Une commande, un message", texte: "Tu choisis, tu écris sur WhatsApp, on te répond. Paiement Wave, Orange Money, MTN Money ou cash." },
];

/** Trois engagements vérifiables, séparés par des filets. */
export function MarqueValues() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 pt-14 md:px-8 md:pt-20" aria-labelledby="promesses-titre">
      <h2 id="promesses-titre" className="v-t2 mb-3.5">Ce qu&rsquo;on te promet</h2>
      <ul className="grid md:grid-cols-3 md:gap-8">
        {PROMESSES.map((p, i) => (
          <li key={p.titre} className="flex flex-col gap-1.5 border-t py-5 md:pb-0" style={{ borderColor: "var(--v-border)", borderBottom: i === PROMESSES.length - 1 ? "1px solid var(--v-border)" : undefined }}>
            <h3 className="v-t3">{p.titre}</h3>
            <p className="text-[15px]" style={{ color: "var(--v-muted)" }}>{p.texte}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
