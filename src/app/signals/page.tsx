import type { Metadata } from "next";
import { evaluateExperiment, HERO_EXPERIMENT } from "@/lib/flags";
import { experimentSnapshot } from "@/lib/experiments";
import { HERO_COPY } from "@/lib/hero";
import { getVisitorId } from "@/lib/visitor";
import { summarizeVitals } from "@/lib/vitals";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Signals",
  description: "Experiment assignment and Core Web Vitals reported by this server process.",
};

export default async function SignalsPage() {
  const visitorId = await getVisitorId();
  const hero = evaluateExperiment(HERO_EXPERIMENT, { targetingKey: visitorId });
  const experiments = experimentSnapshot();
  const vitals = summarizeVitals();
  const copy = HERO_COPY[hero.value];

  return (
    <main id="main" className="shell">
      <h1>Signals</h1>
      <p className="lede">
        Variant assignment is deterministic from the visitor cookie. Counts and vitals live in this
        server process.
      </p>
      <section className="visitor-callout" aria-labelledby="visitor-heading">
        <h2 id="visitor-heading">Your assignment</h2>
        <p>
          Visitor <code>{visitorId}</code> is in <strong>{hero.value}</strong> for{" "}
          <code>{HERO_EXPERIMENT}</code>.
        </p>
        <p>Headline: {copy.title}</p>
      </section>
      <table className="signals-table">
        <caption>Hero headline experiment</caption>
        <thead>
          <tr>
            <th scope="col">Variant</th>
            <th scope="col">Exposures</th>
            <th scope="col">Add to pack</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Control</th>
            <td>{experiments.variants.control.exposures}</td>
            <td>{experiments.variants.control.conversions}</td>
          </tr>
          <tr>
            <th scope="row">Treatment</th>
            <td>{experiments.variants.treatment.exposures}</td>
            <td>{experiments.variants.treatment.conversions}</td>
          </tr>
        </tbody>
      </table>
      <table className="signals-table">
        <caption>Core Web Vitals, p75</caption>
        <thead>
          <tr>
            <th scope="col">Metric</th>
            <th scope="col">Samples</th>
            <th scope="col">p75</th>
          </tr>
        </thead>
        <tbody>
          {vitals.map((row) => (
            <tr key={row.name}>
              <th scope="row">{row.name}</th>
              <td>{row.count}</td>
              <td>{row.p75 === null ? "—" : row.p75}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
