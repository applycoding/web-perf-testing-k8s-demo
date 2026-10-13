import { formatPrice } from "./money";

describe("formatPrice", () => {
  it("formats cents as US dollars", () => {
    expect(formatPrice(24800)).toBe("$248.00");
    expect(formatPrice(0)).toBe("$0.00");
    expect(formatPrice(4250)).toBe("$42.50");
  });
});
