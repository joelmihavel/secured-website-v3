import { TickerBar } from "@landing-pages/home-concierge/components/ticker-bar"
import { Nav } from "@landing-pages/home-concierge/components/nav"
import { Hero } from "@landing-pages/home-concierge/components/hero"
import { StatsBar } from "@landing-pages/home-concierge/components/stats-bar"
import { PropertyCards } from "@landing-pages/home-concierge/components/property-cards"
import { RepellerBanner } from "@landing-pages/home-concierge/components/repeller-banner"
import { Features } from "@landing-pages/home-concierge/components/features"
import { Testimonials } from "@landing-pages/home-concierge/components/testimonials"
import { TrustBadges } from "@landing-pages/home-concierge/components/trust-badges"
import { QualificationForm } from "@landing-pages/home-concierge/components/qualification-form"
import { MobileFormBar } from "@landing-pages/home-concierge/components/mobile-form-bar"
import { ExitIntentPopup } from "@landing-pages/home-concierge/components/exit-intent-popup"
import { Footer } from "@landing-pages/home-concierge/components/footer"

export default function Page() {
  return (
    <div className="home-concierge-page min-h-screen bg-background">
      {/* Ticker */}
      <TickerBar />

      {/* Nav */}
      <Nav />

      {/* Main layout: two-column on desktop */}
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="relative flex flex-col gap-6 py-6 lg:flex-row lg:gap-12 lg:py-14">
          {/* Left column — all content */}
          <main className="flex min-w-0 flex-1 flex-col gap-8 lg:gap-14">
            <Hero />
            <StatsBar />
            <PropertyCards />
            <RepellerBanner />
            <Features />
            <Testimonials />
          </main>

          {/* Right column — sticky form (desktop only) */}
          <aside className="hidden w-[360px] shrink-0 lg:block">
            <div className="sticky top-[73px] space-y-4">
              <QualificationForm />
              <TrustBadges />
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Mobile sticky form bar */}
      <MobileFormBar />

      {/* Bottom padding on mobile to account for sticky bar */}
      <div className="h-20 lg:hidden" />

      {/* Exit intent popup */}
      <ExitIntentPopup />
    </div>
  )
}
