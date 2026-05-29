import type { NextConfig } from "next";
import { FLENT_WHATSAPP_NUMBER } from "./src/constants";

const whatsappNumber = FLENT_WHATSAPP_NUMBER;

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_WHATSAPP_NUMBER: whatsappNumber,
  },
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "@tabler/icons-react",
      "@untitledui/icons",
      "@radix-ui/react-accordion",
      "posthog-js",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "uploads-ssl.webflow.com",
      },
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
    ],
  },
  async rewrites() {
    // Tastemakers affiliate landing is a standalone Vite deploy. The Vite app
    // builds with `base: '/tastemakers/'` and a strip-prefix rewrite in its own
    // `vercel.json`, so `flent.in/tastemakers/*` and `<deploy>/tastemakers/*`
    // both resolve to the same content. Override the destination origin via
    // `TASTEMAKERS_DEPLOY_URL` once the deploy is live.
    const tastemakersDeploy =
      process.env.TASTEMAKERS_DEPLOY_URL?.replace(/\/$/, "") ||
      "https://flent-tastemakers.vercel.app";

    const flentRenewalsDeploy =
      process.env.FLENT_RENEWALS_DEPLOY_URL?.replace(/\/$/, "") ||
      "https://flent-renewals-flent.vercel.app";

    return [
      {
        source: "/flent-renewals",
        destination: `${flentRenewalsDeploy}/flent-renewals`,
      },
      {
        source: "/flent-renewals/:path*",
        destination: `${flentRenewalsDeploy}/flent-renewals/:path*`,
      },
      {
        source: "/renewal-guide",
        destination: "https://tenant-renewals.vercel.app/",
      },
      {
        source: "/renewal-guide/:path*",
        destination: "https://tenant-renewals.vercel.app/:path*",
      },
      {
        source: "/tastemakers",
        destination: `${tastemakersDeploy}/tastemakers`,
      },
      {
        source: "/tastemakers/:path*",
        destination: `${tastemakersDeploy}/tastemakers/:path*`,
      },
      {
        source: "/SherlocksTrail",
        destination: "https://sherlocks-trail.vercel.app/",
      },
      {
        source: "/SherlocksTrail/:path*",
        destination: "https://sherlocks-trail.vercel.app/SherlocksTrail/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/about-us",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/tastemaker",
        destination: "/tastemakers",
        permanent: true,
      },
      {
        source: "/properties/:path*",
        destination: "/homes/:path*",
        permanent: true,
      },
      {
        source: "/collections/ulsoor",
        destination: `https://wa.me/${whatsappNumber}?text=Hey,%20I%20saw%20the%20to-let%20board%20at%20Ulsoor.%20Tell%20me%20more%20about%20the%20house`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
