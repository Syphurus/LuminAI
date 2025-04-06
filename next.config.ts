import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["oaidalleapiprodscus.blob.core.windows.net"],
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
