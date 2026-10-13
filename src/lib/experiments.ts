import { HERO_EXPERIMENT, HERO_VARIANTS, isHeroVariant, type HeroVariant } from "./flags";

export type ExperimentEventType = "exposure" | "conversion";

export interface ExperimentEvent {
  type: ExperimentEventType;
  experiment: typeof HERO_EXPERIMENT;
  variant: HeroVariant;
}

export interface VariantMetrics {
  exposures: number;
  conversions: number;
}

export interface ExperimentSnapshot {
  experiment: typeof HERO_EXPERIMENT;
  variants: Record<HeroVariant, VariantMetrics>;
}

const metrics: Record<HeroVariant, VariantMetrics> = {
  control: { exposures: 0, conversions: 0 },
  treatment: { exposures: 0, conversions: 0 },
};

export function parseExperimentEvent(body: unknown): ExperimentEvent | null {
  if (typeof body !== "object" || body === null) return null;
  const record = body as Record<string, unknown>;
  if (record.type !== "exposure" && record.type !== "conversion") return null;
  if (record.experiment !== HERO_EXPERIMENT) return null;
  if (typeof record.variant !== "string" || !isHeroVariant(record.variant)) return null;
  return {
    type: record.type,
    experiment: HERO_EXPERIMENT,
    variant: record.variant,
  };
}

export function recordExperimentEvent(event: ExperimentEvent): void {
  const bucket = metrics[event.variant];
  switch (event.type) {
    case "exposure":
      bucket.exposures += 1;
      return;
    case "conversion":
      bucket.conversions += 1;
      return;
    default: {
      const exhaustive: never = event.type;
      throw new Error(`Unhandled event ${exhaustive}`);
    }
  }
}

export function experimentSnapshot(): ExperimentSnapshot {
  return {
    experiment: HERO_EXPERIMENT,
    variants: {
      control: { ...metrics.control },
      treatment: { ...metrics.treatment },
    },
  };
}

export function resetExperiments(): void {
  for (const variant of HERO_VARIANTS) {
    metrics[variant].exposures = 0;
    metrics[variant].conversions = 0;
  }
}
