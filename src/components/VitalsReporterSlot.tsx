"use client";

import dynamic from "next/dynamic";

const VitalsReporter = dynamic(
  () => import("@/components/VitalsReporter").then((mod) => mod.VitalsReporter),
  { ssr: false },
);

export function VitalsReporterSlot() {
  return <VitalsReporter />;
}
