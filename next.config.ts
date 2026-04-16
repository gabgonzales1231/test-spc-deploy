import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable CSS optimization to inline critical CSS and defer the rest
  experimental: {
    optimizeCss: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.sanpablocity.gov.ph",
      },
      {
        protocol: "https",
        hostname: "sanpablocity.gov.ph",
      },
      {
        protocol: "https",
        hostname: "hvalkmxibjgrwipfuvhw.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "hvalkmxibjgrwipfuvhw.supabase.co",
        pathname: "/storage/v1/object/sign/**",
      },
      {
        protocol: "https",
        hostname: "webapi.sanpablocitygov.org",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },

  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;