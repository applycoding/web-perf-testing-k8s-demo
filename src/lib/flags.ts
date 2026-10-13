/**
 * Lightweight flag evaluation shaped like OpenFeature evaluation details:
 * flag key, value, variant, and reason. Swap this module for an
 * OpenFeature provider without changing call sites.
 */

export const VISITOR_COOKIE = "nl_vid";
export const VISITOR_HEADER = "x-visitor-id";

export const HERO_EXPERIMENT = "hero-headline";
export const FIELD_NOTES_FLAG = "show-field-notes";

export type EvaluationReason = "STATIC" | "SPLIT" | "DEFAULT";

export interface EvaluationDetails<T> {
  flagKey: string;
  value: T;
  variant: string;
  reason: EvaluationReason;
}

export interface EvaluationContext {
  targetingKey: string;
}

export const HERO_VARIANTS = ["control", "treatment"] as const;
export type HeroVariant = (typeof HERO_VARIANTS)[number];

export function hashToBucket(input: string, buckets: number): number {
  if (buckets <= 0) {
    throw new Error("buckets must be positive");
  }
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % buckets;
}

export function isHeroVariant(value: string): value is HeroVariant {
  return value === "control" || value === "treatment";
}

export function evaluateExperiment(
  flagKey: string,
  context: EvaluationContext,
): EvaluationDetails<HeroVariant> {
  if (flagKey !== HERO_EXPERIMENT) {
    return {
      flagKey,
      value: "control",
      variant: "control",
      reason: "DEFAULT",
    };
  }
  const index = hashToBucket(
    `${flagKey}:${context.targetingKey}`,
    HERO_VARIANTS.length,
  );
  const variant = HERO_VARIANTS[index] ?? "control";
  return {
    flagKey,
    value: variant,
    variant,
    reason: "SPLIT",
  };
}

export function fieldNotesEnvKey(): string {
  return "FLAG_SHOW_FIELD_NOTES";
}

export function evaluateBooleanFlag(
  flagKey: string,
  env: Record<string, string | undefined> = process.env,
): EvaluationDetails<boolean> {
  if (flagKey !== FIELD_NOTES_FLAG) {
    return { flagKey, value: false, variant: "off", reason: "DEFAULT" };
  }
  const override = env[fieldNotesEnvKey()];
  if (override === "true" || override === "false") {
    const value = override === "true";
    return {
      flagKey,
      value,
      variant: value ? "on" : "off",
      reason: "STATIC",
    };
  }
  return { flagKey, value: true, variant: "on", reason: "STATIC" };
}
