"use client";

import { HomeHero } from "./HomeHero";
import { HomeTicker } from "./HomeTicker";
import { HomeFeaturedDrops } from "./HomeFeaturedDrops";
import { HomeBrandStatement } from "./HomeBrandStatement";
import { HomeCategoryGrid } from "./HomeCategoryGrid";
import { HomeBestSellers } from "./HomeBestSellers";
import { HomeWhatsappCta } from "./HomeWhatsappCta";
import { HomePromoSection } from "./HomePromoSection";

export function VitrineHomeView() {
  return (
    <>
      <HomeHero />
      <HomeTicker />
      <HomeFeaturedDrops />
      <HomePromoSection />
      <HomeBrandStatement />
      <HomeCategoryGrid />
      <HomeBestSellers />
      <HomeWhatsappCta />
    </>
  );
}
