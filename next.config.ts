import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  //  pour les fichiers > 1Mb
  experimental: {
    serverActions: {
      bodySizeLimit:"5mb",
    }
  }
};

export default nextConfig;
