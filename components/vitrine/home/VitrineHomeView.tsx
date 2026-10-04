"use client";

import { HomeHero } from "./HomeHero";
import { HomeTicker } from "./HomeTicker";
import { HomeCollection } from "./HomeCollection";
import { HomeCategories } from "./HomeCategories";
import { HomePromoSection } from "./HomePromoSection";
import { HomeBrandStatement } from "./HomeBrandStatement";
import { HomeWhatsappCta } from "./HomeWhatsappCta";

export function VitrineHomeView() {
  return (
    <>
      <HomeHero />
      <HomeTicker />
      <HomePromoSection />
      <HomeCategories />
      <HomeBrandStatement />
      <HomeWhatsappCta />
      <HomeCollection />
    </>
  );
}
