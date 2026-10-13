import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.NEXT_OUTPUT === "standalone" ? { output: "standalone" as const } : {}),
  poweredByHeader: false,
  images: {
    // Catalog art is already small WebP. Serving it directly keeps the LCP
    // image off a runtime transcoder.
    unoptimized: true,
  },
};

export default nextConfig;
