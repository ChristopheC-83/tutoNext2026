import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  //  pour les fichiers > 1Mb
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pull-zone-testnext-2026.b-cdn.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
