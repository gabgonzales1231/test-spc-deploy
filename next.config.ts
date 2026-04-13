import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    // unoptimized: true  <-- REMOVED: this was disabling all WebP conversion,
    //                        resizing, and compression (851 KiB savings)
  },

  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;