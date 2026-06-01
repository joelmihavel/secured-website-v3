"use client";

import React from "react";
import { VariantProvider } from "@/components/secured/VariantContext";
import { SmoothScroll } from "@/components/secured/SmoothScroll";
import { StickyQR } from "@/components/secured/StickyQR";
import { Navbar } from "@/components/secured/Navbar";
import { PageContent } from "@/components/secured/PageContent";
import { SecuredLandingContent } from "@/components/secured/SecuredLandingContent";
import { AudioProvider, useAudio } from "@/components/secured/ScrollAudio";

function SecuredInner() {
  const { unlocked } = useAudio();
  return (
    <>
      {unlocked && <Navbar />}
      {unlocked && <StickyQR />}
      <PageContent>
        <SecuredLandingContent />
      </PageContent>
    </>
  );
}

export default function SecuredPage() {
  return (
    <div className="secured-page">
      <SmoothScroll />
      <VariantProvider>
        <AudioProvider>
          <SecuredInner />
        </AudioProvider>
      </VariantProvider>
    </div>
  );
}
