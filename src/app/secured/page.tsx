import React from "react";
import { VariantProvider } from "@/components/secured/VariantContext";
import { Preloader } from "@/components/secured/Preloader";
import { SmoothScroll } from "@/components/secured/SmoothScroll";
import { StickyQR } from "@/components/secured/StickyQR";
import { Navbar } from "@/components/secured/Navbar";
import { PageContent } from "@/components/secured/PageContent";
import { SecuredLandingContent } from "@/components/secured/SecuredLandingContent";

export default function SecuredPage() {
  return (
    <div className="secured-page">
      <Preloader />
      <SmoothScroll />
      <VariantProvider>
        <Navbar />
        <StickyQR />
        <PageContent>
          <SecuredLandingContent />
        </PageContent>
      </VariantProvider>
    </div>
  );
}
