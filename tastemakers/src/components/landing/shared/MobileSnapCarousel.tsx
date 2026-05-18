import { useCallback, useEffect, useLayoutEffect, useRef, useState, type Key, type ReactNode } from 'react'
import type { MotionValue } from 'framer-motion'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type MobileSnapCarouselSlide = {
  key: Key
  'aria-label': string
  /** Shown as "Show …" on dot buttons (falls back to slide index). */
  dotLabel?: string
  content: ReactNode
}

type CarouselTone = 'tracks' | 'mist'

const toneStyles: Record<
  CarouselTone,
  { dotActive: string; dotInactive: string; ringOffset: string; focusRing: string }
> = {
  tracks: {
    dotActive: 'bg-[#E8F5F0]',
    dotInactive: 'bg-[#E8F5F0]/38',
    ringOffset: 'focus-visible:ring-offset-[#000d09]',
    focusRing: 'focus-visible:ring-[#E8F5F0]/25',
  },
  mist: {
    dotActive: 'bg-[#dff2ec]',
    dotInactive: 'bg-[#dff2ec]/38',
    ringOffset: 'focus-visible:ring-offset-[#000d09]',
    focusRing: 'focus-visible:ring-[#dff2ec]/25',
  },
}

function scrollSlideCentered(scroller: HTMLElement, slideIndex: number, behavior: ScrollBehavior = 'auto') {
  const slides = [...scroller.querySelectorAll<HTMLElement>('[data-snap-carousel-slide="true"]')]
  const slide = slides[slideIndex]
  if (!slide) return
  const left = slide.offsetLeft - (scroller.clientWidth - slide.offsetWidth) / 2
  const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth)
  scroller.scrollTo({ left: Math.max(0, Math.min(left, maxScroll)), behavior })
}

type MobileSnapCarouselProps = {
  yMotion?: MotionValue<number>
  regionAriaLabel: string
  slides: MobileSnapCarouselSlide[]
  tone?: CarouselTone
  slideWrapperClassName?: string
  breakoutClassName?: string
  /** Narrow viewports: remount/layout center this slide index (default: first). */
  centerSlideOnMount?: number
  /** When user returns to this slide index, scroll it back to geometric center (narrow viewports). */
  recenterSlideIndex?: number
  /** Override inline padding formula (tracks use full Viewport width to avoid edge clipping). */
  scrollInsetCss?: string
  /** Dot / “pill” pagination under the strip (hide for a cleaner look). Default true. */
  showPagination?: boolean
}

export function MobileSnapCarousel({
  yMotion,
  regionAriaLabel,
  slides,
  tone = 'tracks',
  slideWrapperClassName = 'w-[min(296px,78vw)] shrink-0 snap-center snap-always',
  breakoutClassName = '-mx-6 px-6',
  centerSlideOnMount = 0,
  recenterSlideIndex = 0,
  scrollInsetCss,
  showPagination = true,
}: MobileSnapCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const prevActiveRef = useRef(-1)
  const prefersReducedMotion = useReducedMotion()
  const t = toneStyles[tone]

  const paddingFormula =
    scrollInsetCss ?? `max(16px,calc((100vw - min(296px, 78vw)) / 2))`

  const runCenterSlide = useCallback(
    (idx: number, behavior: ScrollBehavior = 'auto') => {
      const el = scrollRef.current
      if (!el) return
      requestAnimationFrame(() => {
        scrollSlideCentered(el, idx, behavior)
      })
    },
    [],
  )

  useLayoutEffect(() => {
    if (slides.length === 0) return
    let innerRaf = 0
    const outerRaf = requestAnimationFrame(() => {
      innerRaf = requestAnimationFrame(() => runCenterSlide(centerSlideOnMount, 'auto'))
    })
    return () => {
      cancelAnimationFrame(outerRaf)
      cancelAnimationFrame(innerRaf)
    }
  }, [slides.length, centerSlideOnMount, runCenterSlide])

  useEffect(() => {
    const el = scrollRef.current
    if (!el || slides.length === 0) return

    const slideEls = [...el.querySelectorAll<HTMLElement>('[data-snap-carousel-slide="true"]')]

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const idx = slideEls.indexOf(e.target as HTMLElement)
          if (idx >= 0) setActiveIdx(idx)
        }
      },
      {
        root: el,
        rootMargin: '-25% 0px -25% 0px',
        threshold: 0,
      },
    )

    for (const s of slideEls) io.observe(s)
    return () => io.disconnect()
  }, [slides.length])

  useEffect(() => {
    if (prevActiveRef.current > 0 && activeIdx === recenterSlideIndex) {
      runCenterSlide(recenterSlideIndex, prefersReducedMotion ? 'auto' : 'smooth')
    }
    prevActiveRef.current = activeIdx
  }, [activeIdx, recenterSlideIndex, prefersReducedMotion, runCenterSlide])

  const scrollToIndex = (i: number) => {
    const el = scrollRef.current
    if (!el) return
    const target = el.querySelectorAll<HTMLElement>('[data-snap-carousel-slide="true"]')[i]
    if (!target) return
    target.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  const inner = (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={regionAriaLabel}
      className={cn(
        'outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        t.focusRing,
        t.ringOffset,
      )}
    >
      <div
        ref={scrollRef}
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
        style={{
          scrollPaddingInline: paddingFormula,
          paddingInline: paddingFormula,
        }}
      >
        {slides.map((slide) => (
          <section
            key={slide.key}
            data-snap-carousel-slide="true"
            aria-label={slide['aria-label']}
            className={slideWrapperClassName}
          >
            {slide.content}
          </section>
        ))}
      </div>
      {showPagination ? (
        <div className="mt-5 flex justify-center gap-1.5">
          {slides.map((slide, dotIdx) => (
            <button
              key={slide.key}
              type="button"
              aria-label={slide.dotLabel ? `Show ${slide.dotLabel}` : `Show slide ${dotIdx + 1}`}
              aria-current={activeIdx === dotIdx ? 'true' : undefined}
              className={cn(
                'h-1.5 w-1.5 shrink-0 rounded-full transition-[opacity,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                activeIdx === dotIdx ? t.dotActive : t.dotInactive,
              )}
              onClick={() => scrollToIndex(dotIdx)}
            />
          ))}
        </div>
      ) : null}
    </div>
  )

  return (
    <div className={breakoutClassName}>
      {yMotion ? <motion.div style={{ y: yMotion }}>{inner}</motion.div> : inner}
    </div>
  )
}
