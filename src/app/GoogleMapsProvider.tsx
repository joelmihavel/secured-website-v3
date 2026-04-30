"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function GoogleMapsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // /secured routes mount their own APIProvider locally (scoped to the rent-map section)
  // so the Google Maps SDK only loads when the user reaches that section.
  if (pathname?.startsWith("/secured")) {
    return <>{children}</>;
  }

  return (
    <APIProvider apiKey={apiKey} libraries={['places']}>
      {children}
    </APIProvider>
  );
}
