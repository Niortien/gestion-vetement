"use client";

import { HomeHero } from "./HomeHero";
import { HomeFacts } from "./HomeFacts";
import { HomeNouveautes } from "./HomeNouveautes";
import { HomeCollection } from "./HomeCollection";
import { HomeCategories } from "./HomeCategories";
import { HomePromoSection } from "./HomePromoSection";
import { HomeLookbookBand } from "./HomeLookbookBand";
import { HomeWhatsappCta } from "./HomeWhatsappCta";

export function VitrineHomeView() {
  return (
    <>
      <HomeHero />
      <HomeFacts />
      <HomeNouveautes />
      <HomePromoSection />
      <HomeCategories />
      <HomeLookbookBand />
      <HomeCollection />
      <HomeWhatsappCta />
    </>
  );
}
