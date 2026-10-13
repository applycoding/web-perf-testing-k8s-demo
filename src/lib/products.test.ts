import { getProduct, parseCategory, products, productsInCategory } from "./products";

describe("products", () => {
  it("finds a known slug", () => {
    expect(getProduct("enamel-mug")?.name).toBe("Enamel Camp Mug");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProduct("missing")).toBeUndefined();
  });

  it("parses catalog categories", () => {
    expect(parseCategory("packs")).toBe("packs");
    expect(parseCategory("boots")).toBeNull();
  });

  it("filters by category", () => {
    const packs = productsInCategory("packs");
    expect(packs).toHaveLength(1);
    expect(packs[0]?.slug).toBe("daypack");
    expect(products.length).toBe(6);
  });
});
