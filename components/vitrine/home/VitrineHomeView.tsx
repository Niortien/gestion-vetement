"use client";

import { HomeHero } from "./HomeHero";
import { HomeTicker } from "./HomeTicker";
import { HomeNewArrivals } from "./HomeNewArrivals";
import { HomeCategories } from "./HomeCategories";
import { HomePromoSection } from "./HomePromoSection";
import { HomeBrandStatement } from "./HomeBrandStatement";
import { HomeWhatsappCta } from "./HomeWhatsappCta";

export function VitrineHomeView() {
  return (
    <>
      <HomeHero />
      <HomeTicker />
      <HomeNewArrivals />
      <HomeCategories />
      <HomePromoSection />
      <HomeBrandStatement />
      <HomeWhatsappCta />
    </>
  );
}
