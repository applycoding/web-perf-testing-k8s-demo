import {
  parseVital,
  percentile,
  rateVital,
  recordVital,
  resetVitals,
  summarizeVitals,
} from "./vitals";

describe("rateVital", () => {
  it("rates LCP against the Core Web Vitals thresholds", () => {
    expect(rateVital("LCP", 2500)).toBe("good");
    expect(rateVital("LCP", 2501)).toBe("needs-improvement");
    expect(rateVital("LCP", 4001)).toBe("poor");
  });

  it("rates CLS on the unitless scale", () => {
    expect(rateVital("CLS", 0.1)).toBe("good");
    expect(rateVital("CLS", 0.2)).toBe("needs-improvement");
    expect(rateVital("CLS", 0.3)).toBe("poor");
  });
});

describe("percentile", () => {
  it("returns null for an empty list", () => {
    expect(percentile([], 75)).toBeNull();
  });

  it("returns the 75th percentile", () => {
    expect(percentile([100, 200, 300, 400], 75)).toBe(300);
  });
});

describe("vital store", () => {
  beforeEach(() => {
    resetVitals();
  });

  it("rejects malformed samples and recomputes rating", () => {
    expect(parseVital({ name: "LCP", value: -1, id: "a" }, "2026-01-01T00:00:00.000Z")).toBeNull();
    expect(parseVital({ name: "FID", value: 10, id: "a" }, "2026-01-01T00:00:00.000Z")).toBeNull();
    const sample = parseVital(
      { name: "INP", value: 180, id: "inp-1", rating: "poor" },
      "2026-01-01T00:00:00.000Z",
    );
    expect(sample?.rating).toBe("good");
  });

  it("summarizes recorded samples", () => {
    const first = parseVital({ name: "LCP", value: 1000, id: "1" }, "2026-01-01T00:00:00.000Z");
    const second = parseVital({ name: "LCP", value: 3000, id: "2" }, "2026-01-01T00:00:00.000Z");
    if (!first || !second) throw new Error("expected samples");
    recordVital(first);
    recordVital(second);
    const lcp = summarizeVitals().find((row) => row.name === "LCP");
    expect(lcp).toEqual({ name: "LCP", count: 2, p75: 3000 });
  });
});
