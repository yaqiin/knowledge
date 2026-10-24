import type { NextConfig } from "next";

// Fully static site: `next build` writes plain HTML to ./out, no server needed.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Pin the project root (a stray lockfile higher up confuses Next's root detection)
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
