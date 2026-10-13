import type { HeroVariant } from "./flags";

export interface HeroCopy {
  kicker: string;
  title: string;
  lede: string;
  cta: string;
}

export const HERO_COPY: Record<HeroVariant, HeroCopy> = {
  control: {
    kicker: "Field goods",
    title: "Gear that keeps up with the trail.",
    lede: "Jackets, packs, and camp kit chosen for weight, repairability, and weather.",
    cta: "Shop the catalog",
  },
  treatment: {
    kicker: "This week's kit",
    title: "Pack lighter. Stay out longer.",
    lede: "A shorter list of pieces that earn their place in a three-day pack.",
    cta: "See this week's kit",
  },
};
