"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";

const EXCLUDED_ROUTES = ["/secured", "/home-concierge", "/offers"];

export function ConditionalFooter() {
  const pathname = usePathname();
  if (EXCLUDED_ROUTES.some((r) => pathname.startsWith(r))) return null;
  return <Footer />;
}
