import {
  experimentSnapshot,
  parseExperimentEvent,
  recordExperimentEvent,
  resetExperiments,
} from "./experiments";

describe("experiments", () => {
  beforeEach(() => {
    resetExperiments();
  });

  it("rejects unknown variants and experiments", () => {
    expect(parseExperimentEvent({ type: "exposure", experiment: "hero-headline", variant: "blue" })).toBeNull();
    expect(parseExperimentEvent({ type: "click", experiment: "hero-headline", variant: "control" })).toBeNull();
  });

  it("counts exposures and conversions separately", () => {
    const exposure = parseExperimentEvent({
      type: "exposure",
      experiment: "hero-headline",
      variant: "treatment",
    });
    const conversion = parseExperimentEvent({
      type: "conversion",
      experiment: "hero-headline",
      variant: "treatment",
    });
    if (!exposure || !conversion) throw new Error("expected events");
    recordExperimentEvent(exposure);
    recordExperimentEvent(exposure);
    recordExperimentEvent(conversion);
    expect(experimentSnapshot().variants.treatment).toEqual({
      exposures: 2,
      conversions: 1,
    });
    expect(experimentSnapshot().variants.control).toEqual({
      exposures: 0,
      conversions: 0,
    });
  });
});
