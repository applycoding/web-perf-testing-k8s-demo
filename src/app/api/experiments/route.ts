import {
  experimentSnapshot,
  parseExperimentEvent,
  recordExperimentEvent,
} from "@/lib/experiments";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const event = parseExperimentEvent(body);
  if (!event) {
    return Response.json({ error: "Invalid event" }, { status: 400 });
  }
  recordExperimentEvent(event);
  return Response.json(experimentSnapshot());
}

export function GET() {
  return Response.json(experimentSnapshot());
}
