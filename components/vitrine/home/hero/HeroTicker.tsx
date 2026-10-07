import { HERO_TICKER_ITEMS } from "./heroData";

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-7 pr-7">
      {HERO_TICKER_ITEMS.map((t) => (
        <li key={t} className="flex shrink-0 items-center gap-7 whitespace-nowrap">
          <span>{t}</span>
          <span aria-hidden className="h-2 w-2 rotate-45" style={{ backgroundColor: "#0C0C0E" }} />
        </li>
      ))}
    </ul>
  );
}

/** Bandeau doré défilant en pied de héros. */
export function HeroTicker() {
  return (
    <div className="relative z-10 overflow-hidden py-3.5" style={{ backgroundColor: "#F0B429", color: "#0C0C0E" }}>
      <div
        className="vitrine-marquee-track flex w-max text-lg uppercase tracking-[0.08em]"
        style={{ fontFamily: "var(--font-hero-poster), sans-serif" }}
      >
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
