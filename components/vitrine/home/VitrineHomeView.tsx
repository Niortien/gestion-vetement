"use client";

import { HomeHero } from "./HomeHero";
import { HomeCollection } from "./HomeCollection";
import { HomeCategories } from "./HomeCategories";
import { HomePromoSection } from "./HomePromoSection";
import { HomeBrandStatement } from "./HomeBrandStatement";
import { HomeWhatsappCta } from "./HomeWhatsappCta";

export function VitrineHomeView() {
  return (
    <>
      <HomeHero />
      <HomePromoSection />
      <HomeCategories />
      <HomeBrandStatement />
      <HomeWhatsappCta />
      <HomeCollection />
    </>
  );
}
