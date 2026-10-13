import { parseVital, recentVitals, recordVital, summarizeVitals } from "@/lib/vitals";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const sample = parseVital(body, new Date().toISOString());
  if (!sample) {
    return Response.json({ error: "Invalid vital" }, { status: 400 });
  }
  recordVital(sample);
  return Response.json({ ok: true, summary: summarizeVitals() });
}

export function GET() {
  return Response.json({
    summary: summarizeVitals(),
    recent: recentVitals(),
  });
}
