"use client";

import { useEffect } from "react";
import { onCLS, onFCP, onINP, onLCP, onTTFB, type MetricType } from "web-vitals";

function send(metric: MetricType) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
  });
  const blob = new Blob([body], { type: "application/json" });
  if (navigator.sendBeacon("/api/vitals", blob)) return;
  void fetch("/api/vitals", {
    method: "POST",
    body,
    headers: { "content-type": "application/json" },
    keepalive: true,
  });
}

export function VitalsReporter() {
  useEffect(() => {
    onCLS(send);
    onFCP(send);
    onINP(send);
    onLCP(send);
    onTTFB(send);
  }, []);

  return null;
}
