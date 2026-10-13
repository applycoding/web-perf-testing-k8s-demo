import {
  evaluateBooleanFlag,
  evaluateExperiment,
  FIELD_NOTES_FLAG,
  HERO_EXPERIMENT,
} from "@/lib/flags";

export function GET(request: Request) {
  const visitor = new URL(request.url).searchParams.get("visitor") ?? "anonymous";
  return Response.json({
    visitor,
    flags: {
      [HERO_EXPERIMENT]: evaluateExperiment(HERO_EXPERIMENT, { targetingKey: visitor }),
      [FIELD_NOTES_FLAG]: evaluateBooleanFlag(FIELD_NOTES_FLAG),
    },
  });
}
