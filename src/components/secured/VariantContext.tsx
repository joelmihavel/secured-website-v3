"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";

type Variant = "tenant" | "landlord";

const VariantContext = createContext<{
  variant: Variant;
  setVariant: (v: Variant) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
}>({
  variant: "tenant",
  setVariant: () => {},
  menuOpen: false,
  setMenuOpen: () => {},
});

export function VariantProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [variant, setVariantState] = useState<Variant>(
    pathname === "/secured/landlord" ? "landlord" : "tenant"
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const setVariant = useCallback((v: Variant) => {
    setVariantState(v);
    const url = v === "landlord" ? "/secured/landlord" : "/secured";
    // Use replaceState directly (not pushState) so the browser back button
    // doesn't treat tenant↔landlord as separate history entries, and skip
    // the Next.js router entirely to prevent an RSC re-fetch.
    window.history.replaceState(window.history.state, "", url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      setVariantState(window.location.pathname === "/secured/landlord" ? "landlord" : "tenant");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <VariantContext.Provider value={{ variant, setVariant, menuOpen, setMenuOpen }}>
      {children}
    </VariantContext.Provider>
  );
}

export function useVariant() {
  return useContext(VariantContext);
}
