import type { NextConfig } from "next";

const whatsappNumber = (process.env.WHATSAPP_NUMBER || "").replace(/\D/g, "");

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
    ],
  },
  async rewrites() {
    return [
      {
        source: "/renewal-guide",
        destination: "https://tenant-renewals.vercel.app/",
      },
      {
        source: "/renewal-guide/:path*",
        destination: "https://tenant-renewals.vercel.app/:path*",
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
