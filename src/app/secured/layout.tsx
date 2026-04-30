import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flent Secured: Make your rent work for you.",
  description: "Earn 1% back on every timely rent payment. Secured by Flent - making rent rewarding for tenants and protecting rental income for landlords.",
  openGraph: {
    title: "Flent Secured: Make your rent work for you.",
    description: "Earn 1% back on every timely rent payment. Secured by Flent - making rent rewarding for tenants and protecting rental income for landlords.",
    images: [
      {
        url: "/images/og-secured.png",
        width: 1200,
        height: 630,
        alt: "Flent Secured - Earn rewards on rent",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flent Secured: Make your rent work for you.",
    description: "Earn 1% back on every timely rent payment. Secured by Flent - making rent rewarding for tenants and protecting rental income for landlords.",
    images: ["/images/og-secured.png"],
  },
};

export default function SecuredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Warm up tile-server connections so the rent-map paints faster on scroll */}
      <link rel="preconnect" href="https://a.basemaps.cartocdn.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://b.basemaps.cartocdn.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://c.basemaps.cartocdn.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://tiles.openfreemap.org" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://demotiles.maplibre.org" crossOrigin="anonymous" />
      {children}
    </>
  );
}

