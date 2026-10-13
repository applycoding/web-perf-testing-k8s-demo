export const CATEGORIES = ["apparel", "packs", "camp"] as const;
export type Category = (typeof CATEGORIES)[number];

export interface FieldNote {
  id: string;
  author: string;
  date: string;
  body: string;
  rating: number;
}

export interface Product {
  slug: string;
  name: string;
  priceCents: number;
  category: Category;
  summary: string;
  description: string;
  image: string;
  imageAlt: string;
  weightGrams: number;
  notes: FieldNote[];
}

export const products: Product[] = [
  {
    slug: "field-jacket",
    name: "Cedar Field Jacket",
    priceCents: 24800,
    category: "apparel",
    summary: "Waxed cotton shell with a corduroy collar.",
    description:
      "Cut to sit over a fleece, not under a parka. The cotton is waxed, the seams are taped at the shoulders, and the pockets close with metal snaps you can work with gloves on.",
    image: "/images/field-jacket.webp",
    imageAlt: "Screen print of a dark field jacket with a copper placket",
    weightGrams: 780,
    notes: [
      {
        id: "fj-1",
        author: "Mara Ellison",
        date: "2026-03-02",
        body: "Wore it through a wet ridge walk. The wax beaded and the collar stayed put under a pack strap.",
        rating: 5,
      },
      {
        id: "fj-2",
        author: "Jonah Peck",
        date: "2026-01-18",
        body: "Roomy enough for a midlayer. The cuffs are the only thing I would shorten.",
        rating: 4,
      },
    ],
  },
  {
    slug: "daypack",
    name: "18L Daypack",
    priceCents: 16800,
    category: "packs",
    summary: "Roll-top pack for water, a jacket, and lunch.",
    description:
      "One main compartment, a sternum strap that does not twist, and a back panel that stays flat against a shirt. It is a day pack, not a weekend haul.",
    image: "/images/daypack.webp",
    imageAlt: "Screen print of a pine-green roll-top daypack",
    weightGrams: 640,
    notes: [
      {
        id: "dp-1",
        author: "Adele Cho",
        date: "2026-04-11",
        body: "Fits a bladder, a shell, and a camera without looking stuffed. The strap keepers actually keep.",
        rating: 5,
      },
    ],
  },
  {
    slug: "merino-beanie",
    name: "Merino Beanie",
    priceCents: 4200,
    category: "apparel",
    summary: "Double layer at the ears, light enough for a hood.",
    description:
      "18.5 micron merino with a folded cuff. It stays warm when the weather turns wet and packs into a jacket pocket.",
    image: "/images/merino-beanie.webp",
    imageAlt: "Screen print of a copper beanie with a cream cuff",
    weightGrams: 68,
    notes: [
      {
        id: "mb-1",
        author: "Samir Qureshi",
        date: "2026-02-09",
        body: "Does not itch, and it still fits under a helmet. I wish the cuff were a touch taller.",
        rating: 4,
      },
    ],
  },
  {
    slug: "enamel-mug",
    name: "Enamel Camp Mug",
    priceCents: 2800,
    category: "camp",
    summary: "Twelve ounces, rolled rim, steel lip.",
    description:
      "The rim is rolled so it does not chip in a side pocket. It holds a short coffee and stacks with the bowls if you carry them.",
    image: "/images/enamel-mug.webp",
    imageAlt: "Screen print of a cream enamel mug with a copper band",
    weightGrams: 180,
    notes: [
      {
        id: "em-1",
        author: "June Harlow",
        date: "2026-05-20",
        body: "Rides in the pack lid without rattling itself apart. The handle clears a gloved hand.",
        rating: 5,
      },
      {
        id: "em-2",
        author: "Chris Adelman",
        date: "2025-11-02",
        body: "Hot to the touch if you fill it to the band. Use the handle.",
        rating: 4,
      },
    ],
  },
  {
    slug: "trail-lantern",
    name: "Trail Lantern",
    priceCents: 6400,
    category: "camp",
    summary: "Warm 2700K light, dim enough to cook by.",
    description:
      "Rechargeable, with a hook and a flat base. Full output is for camp chores. The low setting keeps the table visible without blowing out your night vision.",
    image: "/images/trail-lantern.webp",
    imageAlt: "Screen print of a lantern with a warm glass chamber",
    weightGrams: 220,
    notes: [
      {
        id: "tl-1",
        author: "Mara Ellison",
        date: "2026-06-01",
        body: "Lasted three dinners on one charge at the low setting. The hook fits a ridgeline.",
        rating: 5,
      },
    ],
  },
  {
    slug: "merino-socks",
    name: "Merino Crew Socks",
    priceCents: 2400,
    category: "apparel",
    summary: "Cushioned heel, flat toe seam.",
    description:
      "A crew height that stays under a boot cuff. The toe seam is flat, and the merino blend dries on a pack line overnight.",
    image: "/images/merino-socks.webp",
    imageAlt: "Screen print of two crew socks, one copper and one pine",
    weightGrams: 72,
    notes: [
      {
        id: "ms-1",
        author: "Jonah Peck",
        date: "2026-03-28",
        body: "No bunching after a full day. They smell better than my older pair, which is the bar.",
        rating: 5,
      },
    ],
  },
];

const categoryLabels: Record<Category, string> = {
  apparel: "Apparel",
  packs: "Packs",
  camp: "Camp",
};

export function categoryLabel(category: Category): string {
  return categoryLabels[category];
}

export function parseCategory(value: string): Category | null {
  switch (value) {
    case "apparel":
    case "packs":
    case "camp":
      return value;
    default:
      return null;
  }
}

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function productsInCategory(category: Category): Product[] {
  return products.filter((product) => product.category === category);
}
