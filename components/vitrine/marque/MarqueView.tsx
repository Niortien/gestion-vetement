import { MarqueHero } from "./MarqueHero";
import { MarqueStory } from "./MarqueStory";
import { MarqueValues } from "./MarqueValues";
import { MarqueContact } from "./MarqueContact";

export function MarqueView() {
  return (
    <>
      <MarqueHero />
      <MarqueStory />
      <MarqueValues />
      <MarqueContact />
    </>
  );
}
