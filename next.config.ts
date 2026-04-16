import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-inline/eval needed for Next.js dev; tighten in prod if possible
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://hvalkmxibjgrwipfuvhw.supabase.co https://www.sanpablocity.gov.ph https://sanpablocity.gov.ph https://webapi.sanpablocitygov.org https://images.unsplash.com https://placehold.co",
      "font-src 'self'",
      "connect-src 'self' https://hvalkmxibjgrwipfuvhw.supabase.co",
      "frame-ancestors 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    // Enable modern formats — browser picks AVIF first, falls back to WebP
    formats: ["image/avif", "image/webp"],
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

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;