import { useEffect, useLayoutEffect, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion'
import { cinematicScrollSpring } from '@tastemakers/components/landing/shared/cinematicScrollSpring'

const NEXT_SECTION_ID = 'tastemakers-wall'

const REST_COLOR = 'rgba(244,241,234,0.7)'
const PEAK_COLOR = 'rgba(252,249,244,0.96)'
const REST_SHADOW = '0 0 22px rgba(244,241,234,0.06)'
const PEAK_SHADOW = '0 0 40px rgba(255,255,255,0.11)'

function scrollProgressToFade(v: number) {
  if (v < 0.22) return 0
  if (v > 0.3) return 1
  return (v - 0.22) / 0.08
}

type Props = {
  cinematicSectionRef: RefObject<HTMLElement | null>
}

export function StartApplicationFloatingCta({ cinematicSectionRef }: Props) {
  const [mounted, setMounted] = useState(false)
  const reduceMotion = useReducedMotion()
  const [nextInView, setNextInView] = useState(false)
  const [cinematicInView, setCinematicInView] = useState(false)
  const [scrollFade, setScrollFade] = useState(0)

  const { scrollYProgress } = useScroll({
    target: cinematicSectionRef,
    offset: ['start end', 'end start'],
  })
  const smooth = useSpring(scrollYProgress, cinematicScrollSpring)

  useLayoutEffect(() => {
    setScrollFade(scrollProgressToFade(smooth.get()))
  }, [smooth])

  useMotionValueEvent(smooth, 'change', (v) => {
    setScrollFade(scrollProgressToFade(v))
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const cinematicEl = cinematicSectionRef.current
    if (!cinematicEl) return

    const ioCinematic = new IntersectionObserver(([e]) => setCinematicInView(e.isIntersecting), {
      threshold: 0,
      rootMargin: '0px',
    })
    ioCinematic.observe(cinematicEl)

    const nextEl = document.getElementById(NEXT_SECTION_ID)
    let ioNext: IntersectionObserver | undefined
    if (nextEl) {
      ioNext = new IntersectionObserver(([e]) => setNextInView(e.isIntersecting), {
        threshold: 0,
        rootMargin: '0px',
      })
      ioNext.observe(nextEl)
    }

    return () => {
      ioCinematic.disconnect()
      ioNext?.disconnect()
    }
  }, [cinematicSectionRef, mounted])

  const targetOpacity = cinematicInView && !nextInView ? scrollFade : 0
  const pulseActive = targetOpacity > 0.04 && !reduceMotion

  if (!mounted) return null

  return createPortal(
    <motion.div
      initial={false}
      animate={{ opacity: targetOpacity }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-8 right-6 z-[100] hidden md:block md:bottom-12 md:right-12"
      style={{
        pointerEvents: targetOpacity > 0.04 ? 'auto' : 'none',
      }}
    >
      <motion.a
        href="#apply"
        initial={false}
        animate={
          pulseActive
            ? {
                color: [REST_COLOR, PEAK_COLOR, REST_COLOR],
                textShadow: [REST_SHADOW, PEAK_SHADOW, REST_SHADOW],
              }
            : {
                color: REST_COLOR,
                textShadow: REST_SHADOW,
              }
        }
        transition={
          pulseActive
            ? {
                duration: 5.25,
                repeat: Infinity,
                ease: [0.42, 0, 0.58, 1],
              }
            : { duration: 0.35 }
        }
        whileHover={{
          color: 'rgba(252,249,244,0.98)',
          textShadow: '0 0 34px rgba(255,255,255,0.13)',
          transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
        }}
        tabIndex={targetOpacity > 0.04 ? 0 : -1}
        className="flex cursor-pointer items-baseline gap-[0.35em] font-display text-sm font-light tracking-[0.16em] outline-none focus-visible:ring-1 focus-visible:ring-[#f4f1ea]/25 md:text-[0.9375rem]"
        aria-label="Jump to tastemaker application form"
      >
        <span>Apply now</span>
        {reduceMotion ? (
          <span aria-hidden className="inline-block font-light leading-none">
            ↓
          </span>
        ) : (
          <motion.span
            aria-hidden
            className="inline-block font-light leading-none"
            animate={{ y: [0, 2.5, 0] }}
            transition={{
              duration: 2.35,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            ↓
          </motion.span>
        )}
      </motion.a>
    </motion.div>,
    document.body,
  )
}
