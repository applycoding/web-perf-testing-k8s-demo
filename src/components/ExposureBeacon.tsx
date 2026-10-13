"use client";

import { useEffect } from "react";
import type { HeroVariant } from "@/lib/flags";
import { HERO_EXPERIMENT } from "@/lib/flags";

export function ExposureBeacon({ variant }: { variant: HeroVariant }) {
  useEffect(() => {
    const body = JSON.stringify({
      type: "exposure",
      experiment: HERO_EXPERIMENT,
      variant,
    });
    void fetch("/api/experiments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    });
  }, [variant]);

  return null;
}
