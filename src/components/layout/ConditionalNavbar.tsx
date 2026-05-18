"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";

const EXCLUDED_ROUTES = ["/secured", "/home-concierge", "/offers"];

export function ConditionalNavbar() {
  const pathname = usePathname();
  if (EXCLUDED_ROUTES.some((r) => pathname.startsWith(r))) return null;
  return <Navbar />;
}
