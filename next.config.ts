import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  // Allow viewing the dev server from other devices on the LAN (e.g. a phone)
  allowedDevOrigins: ["172.20.10.*", "192.168.*.*", "10.*.*.*"],
  images: { formats: ["image/avif", "image/webp"] },
  env: {
    // On Netlify, fall back to the build's own URL (custom domain if set),
    // so NEXT_PUBLIC_SITE_URL doesn't need to be configured there.
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? process.env.URL ?? "http://localhost:3000",
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    // The old static landing page served its privacy policy at /privatumas
    // (that URL may be registered with Google Play), so keep it working.
    return [
      { source: "/privatumas", destination: "/privatumo-politika", permanent: true },
      { source: "/privatumas/:path*", destination: "/privatumo-politika", permanent: true },
      { source: "/privacy", destination: "/privatumo-politika", permanent: true },
    ];
  },
};

export default nextConfig;
