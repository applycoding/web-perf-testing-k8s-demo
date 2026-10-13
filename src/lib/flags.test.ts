import {
  evaluateBooleanFlag,
  evaluateExperiment,
  hashToBucket,
  HERO_EXPERIMENT,
} from "./flags";

describe("hashToBucket", () => {
  it("is deterministic", () => {
    expect(hashToBucket("hero-headline:visitor-a", 2)).toBe(
      hashToBucket("hero-headline:visitor-a", 2),
    );
  });

  it("rejects an empty range", () => {
    expect(() => hashToBucket("x", 0)).toThrow(/positive/);
  });
});

describe("evaluateExperiment", () => {
  it("keeps a visitor on one variant", () => {
    const first = evaluateExperiment(HERO_EXPERIMENT, {
      targetingKey: "visitor-42",
    });
    const second = evaluateExperiment(HERO_EXPERIMENT, {
      targetingKey: "visitor-42",
    });
    expect(second).toEqual(first);
    expect(first.reason).toBe("SPLIT");
  });

  it("splits a sample of visitors across both variants", () => {
    const counts = { control: 0, treatment: 0 };
    for (let i = 0; i < 2000; i += 1) {
      const result = evaluateExperiment(HERO_EXPERIMENT, {
        targetingKey: `visitor-${i}`,
      });
      counts[result.value] += 1;
    }
    expect(counts.control).toBeGreaterThan(700);
    expect(counts.treatment).toBeGreaterThan(700);
    expect(counts.control + counts.treatment).toBe(2000);
  });

  it("falls back for an unknown flag", () => {
    expect(
      evaluateExperiment("unknown", { targetingKey: "visitor-1" }).reason,
    ).toBe("DEFAULT");
  });
});

describe("evaluateBooleanFlag", () => {
  it("defaults field notes on", () => {
    expect(evaluateBooleanFlag("show-field-notes", {})).toMatchObject({
      value: true,
      variant: "on",
      reason: "STATIC",
    });
  });

  it("honors an environment override", () => {
    expect(
      evaluateBooleanFlag("show-field-notes", {
        FLAG_SHOW_FIELD_NOTES: "false",
      }),
    ).toMatchObject({ value: false, variant: "off" });
  });

  it("defaults unknown flags off", () => {
    expect(evaluateBooleanFlag("other", {}).reason).toBe("DEFAULT");
  });
});
