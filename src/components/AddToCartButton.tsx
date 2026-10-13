"use client";

import { evaluateExperiment, HERO_EXPERIMENT, VISITOR_COOKIE } from "@/lib/flags";
import { useCart } from "./CartProvider";

function readVisitorId(): string {
  const match = document.cookie.match(new RegExp(`(?:^|; )${VISITOR_COOKIE}=([^;]+)`));
  return match?.[1] ? decodeURIComponent(match[1]) : "anonymous";
}

export function AddToCartButton({
  product,
}: {
  product: { slug: string; name: string; priceCents: number };
}) {
  const { add, open } = useCart();

  return (
    <button
      type="button"
      className="button"
      onClick={() => {
        add(product);
        open();
        const variant = evaluateExperiment(HERO_EXPERIMENT, {
          targetingKey: readVisitorId(),
        }).variant;
        const body = JSON.stringify({
          type: "conversion",
          experiment: HERO_EXPERIMENT,
          variant,
        });
        void fetch("/api/experiments", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body,
          keepalive: true,
        });
      }}
    >
      Add to pack
    </button>
  );
}
