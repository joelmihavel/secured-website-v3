import { useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

function breakpointFactorFromWidth() {
  if (typeof window === 'undefined') return 1
  const w = window.innerWidth
  if (w < 768) return 0.38
  if (w < 1024) return 0.65
  return 1
}

/**
 * Parallax strength: 0 when reduced motion. Lower on mobile/tablet.
 */
export function useCinematicIntensity() {
  const prefersReduced = useReducedMotion() ?? false
  const [breakpointFactor, setBreakpointFactor] = useState(breakpointFactorFromWidth)

  useEffect(() => {
    const onResize = () => setBreakpointFactor(breakpointFactorFromWidth())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (prefersReduced) return 0
  return breakpointFactor
}
