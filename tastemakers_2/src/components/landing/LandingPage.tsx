import { useEffect } from 'react'
import { ApplicationFold } from '@tastemakers/components/landing/folds/ApplicationFold'
import { CinematicStatement } from '@tastemakers/components/landing/folds/CinematicStatement'
import { Footer } from '@tastemakers/components/landing/folds/Footer'
import { HeroSection } from '@tastemakers/components/landing/folds/HeroSection'
import { InteractiveTracks } from '@tastemakers/components/landing/folds/InteractiveTracks'
import { RewardsOrbit } from '@tastemakers/components/landing/folds/RewardsOrbit'
import { SocialProofWall } from '@tastemakers/components/landing/folds/SocialProofWall'
import { TastemakersWall } from '@tastemakers/components/landing/folds/TastemakersWall'
import { smoothScrollElementIntoView } from '@tastemakers/lib/smoothScrollTo'

export function LandingPage() {
  useEffect(() => {
    const onDocumentClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return
      if (e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const anchor = (e.target as Element | null)?.closest?.('a[href]')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (href !== '#apply' && href !== '/#apply') return

      const applyEl = document.getElementById('apply')
      if (!applyEl) return

      e.preventDefault()
      history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}#apply`,
      )
      smoothScrollElementIntoView(applyEl, { durationMs: 0 })
    }

    document.addEventListener('click', onDocumentClick, true)
    return () => document.removeEventListener('click', onDocumentClick, true)
  }, [])

  return (
    <main className="bg-[#000d09]">
      <HeroSection />
      <SocialProofWall />
      <RewardsOrbit />
      <InteractiveTracks />
      <CinematicStatement />
      <TastemakersWall />
      <ApplicationFold />
      <Footer />
    </main>
  )
}
