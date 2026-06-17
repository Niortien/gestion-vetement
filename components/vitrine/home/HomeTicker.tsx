"use client";

const ITEMS = [
  "NOUVELLE COLLECTION 2025",
  "PAIEMENT WAVE · ORANGE MONEY · CASH",
  "LIVRAISON DAKAR",
  "DROPS LIMITÉS",
  "AUTHENTIQUE DEPUIS DAKAR",
  "QUALITÉ STREETWEAR PREMIUM",
];

export function HomeTicker() {
  const text = ITEMS.join("  •  ") + "  •  " + ITEMS.join("  •  ") + "  •  ";

  return (
    <div
      className="overflow-hidden border-y py-3"
      style={{
        borderColor: "var(--v-border)",
        backgroundColor: "var(--v-s1)",
      }}
    >
      <div className="vitrine-marquee-track flex whitespace-nowrap">
        <span
          className="font-[var(--font-display)] text-xs font-black uppercase tracking-[0.2em]"
          style={{ color: "var(--v-lime)" }}
        >
          {text}
        </span>
        <span
          className="font-[var(--font-display)] text-xs font-black uppercase tracking-[0.2em]"
          style={{ color: "var(--v-lime)" }}
          aria-hidden
        >
          {text}
        </span>
      </div>
    </div>
  );
}
