export const VITAL_NAMES = ["CLS", "FCP", "INP", "LCP", "TTFB"] as const;
export type VitalName = (typeof VITAL_NAMES)[number];
export type VitalRating = "good" | "needs-improvement" | "poor";

export interface VitalSample {
  name: VitalName;
  value: number;
  rating: VitalRating;
  id: string;
  receivedAt: string;
}

export interface VitalSummary {
  name: VitalName;
  count: number;
  p75: number | null;
}

const MAX_SAMPLES = 200;
const samples: VitalSample[] = [];

const thresholds: Record<VitalName, [number, number]> = {
  LCP: [2500, 4000],
  INP: [200, 500],
  CLS: [0.1, 0.25],
  FCP: [1800, 3000],
  TTFB: [800, 1800],
};

export function isVitalName(value: string): value is VitalName {
  switch (value) {
    case "CLS":
    case "FCP":
    case "INP":
    case "LCP":
    case "TTFB":
      return true;
    default:
      return false;
  }
}

export function rateVital(name: VitalName, value: number): VitalRating {
  const [good, needsImprovement] = thresholds[name];
  if (value <= good) return "good";
  if (value <= needsImprovement) return "needs-improvement";
  return "poor";
}

export function percentile(values: number[], p: number): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const rank = Math.ceil((p / 100) * sorted.length) - 1;
  const index = Math.min(sorted.length - 1, Math.max(0, rank));
  return sorted[index] ?? null;
}

function maxValue(name: VitalName): number {
  return name === "CLS" ? 10 : 60_000;
}

export function parseVital(body: unknown, receivedAt: string): VitalSample | null {
  if (typeof body !== "object" || body === null) return null;
  const record = body as Record<string, unknown>;
  if (typeof record.name !== "string" || !isVitalName(record.name)) return null;
  if (typeof record.value !== "number" || !Number.isFinite(record.value)) return null;
  if (record.value < 0 || record.value > maxValue(record.name)) return null;
  if (typeof record.id !== "string" || record.id.length === 0 || record.id.length > 120) {
    return null;
  }
  return {
    name: record.name,
    value: record.value,
    rating: rateVital(record.name, record.value),
    id: record.id,
    receivedAt,
  };
}

export function recordVital(sample: VitalSample): void {
  samples.push(sample);
  if (samples.length > MAX_SAMPLES) {
    samples.splice(0, samples.length - MAX_SAMPLES);
  }
}

export function summarizeVitals(): VitalSummary[] {
  return VITAL_NAMES.map((name) => {
    const values = samples.filter((sample) => sample.name === name).map((sample) => sample.value);
    return { name, count: values.length, p75: percentile(values, 75) };
  });
}

export function recentVitals(limit = 20): VitalSample[] {
  return samples.slice(-limit).reverse();
}

export function resetVitals(): void {
  samples.length = 0;
}
