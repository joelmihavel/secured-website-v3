import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { PRINCIPAL_HEADLINE_CLASSNAME } from '@tastemakers/components/landing/principalHeadlineClassName'
import {
  PRINCIPAL_HEADLINE_MOBILE_TOP_INSET,
  PRINCIPAL_SUPPORT_MOBILE_COMBINED,
  PRINCIPAL_SUPPORT_WEB_BODY_FONT,
} from '@tastemakers/components/landing/principalSupportingMobileTypography'
import { assetUrl } from '@tastemakers/lib/utils'
import {
  cinematicScrollSpring,
  cinematicScrollSpringMobile,
} from '@tastemakers/components/landing/shared/cinematicScrollSpring'
import { FoldReveal } from '@tastemakers/components/landing/shared/FoldReveal'
import { useCinematicIntensity } from '@tastemakers/components/landing/shared/useCinematicIntensity'
import { cn } from '@tastemakers/lib/utils'

type CardItem = {
  src: string
  alt: string
  width: number
  height: number
  href?: string
  cardWidth: number
  x: number
  y: number
  rotation?: number
  hideOnMobile?: boolean
  mobileCardWidth: number
  mobileX: number
  mobileY: number
  mobileRotation?: number
}

const cards: CardItem[] = [
  {
    src: '/social-proof/deepankar-tweet.png',
    alt: 'Social post about a house in Indiranagar',
    width: 1024,
    height: 806,
    cardWidth: 22,
    x: 2,
    y: -32,
    rotation: -3,
    mobileCardWidth: 18,
    mobileX: 1,
    mobileY: -18,
    mobileRotation: -2,
  },
  {
    src: '/social-proof/tweet-kritika-kumari.png',
    alt: 'Kritika on X praises Flent home design',
    width: 1024,
    height: 976,
    cardWidth: 20,
    x: 22,
    y: 26,
    rotation: 2.5,
    mobileCardWidth: 15,
    mobileX: 12,
    mobileY: 16,
    mobileRotation: 2,
  },
  {
    src: '/social-proof/flent-postcard.png',
    alt: 'Flent postcard held in hand',
    width: 1024,
    height: 683,
    cardWidth: 24,
    x: 40,
    y: -30,
    rotation: -1.5,
    href: 'https://www.instagram.com/p/DVizDjukR3s/',
    mobileCardWidth: 19,
    mobileX: 24,
    mobileY: -14,
    mobileRotation: -1,
  },
  {
    src: '/social-proof/striver-reply.png',
    alt: 'Social reply recommending Flent homes',
    width: 1024,
    height: 600,
    cardWidth: 23,
    x: 60,
    y: 28,
    rotation: 1,
    mobileCardWidth: 19,
    mobileX: 37,
    mobileY: 18,
    mobileRotation: 1,
  },
  {
    src: '/social-proof/tweet-garv-malik.png',
    alt: 'Garv Malik post on flats and Flent interiors',
    width: 1024,
    height: 953,
    cardWidth: 20,
    x: 78,
    y: -34,
    rotation: 2.5,
    mobileCardWidth: 15,
    mobileX: 50,
    mobileY: -20,
    mobileRotation: 2,
  },
  {
    src: '/social-proof/fairmont-card.png',
    alt: 'Creator holding a Fairmont listing card',
    width: 1024,
    height: 576,
    cardWidth: 24,
    x: 96,
    y: 30,
    rotation: -2,
    href: 'https://www.instagram.com/reel/DXlc4OGkqdy/?igsh=MXBwYnBnaWllYzVpeA==',
    mobileCardWidth: 19,
    mobileX: 61,
    mobileY: 16,
    mobileRotation: -1.5,
  },
  {
    src: '/social-proof/flent-tote.png',
    alt: 'Flent tote bag held indoors',
    width: 1024,
    height: 576,
    cardWidth: 22,
    x: 114,
    y: -32,
    rotation: 1.5,
    mobileCardWidth: 18,
    mobileX: 74,
    mobileY: -16,
    mobileRotation: 1,
  },
  {
    src: '/social-proof/tweet-anurag-mundhada.png',
    alt: 'Anurag Mundhada on X praises Flent homes and penthouse',
    width: 1024,
    height: 996,
    cardWidth: 20,
    x: 132,
    y: 28,
    rotation: -1,
    mobileCardWidth: 15,
    mobileX: 86,
    mobileY: 18,
    mobileRotation: -1,
  },
  {
    src: '/social-proof/tweet-prakash-mardi.png',
    alt: 'Prakash Mardi recommends Flent on X',
    width: 1024,
    height: 373,
    cardWidth: 24,
    x: 150,
    y: -30,
    rotation: 3,
    hideOnMobile: true,
    mobileCardWidth: 19,
    mobileX: 97,
    mobileY: -14,
    mobileRotation: 2,
  },
  {
    src: '/social-proof/tweet-kaashvi-saxena.png',
    alt: 'Kaashvi Saxena post on brokerage-free Bengaluru rentals',
    width: 1024,
    height: 470,
    cardWidth: 24,
    x: 168,
    y: 26,
    rotation: -2.5,
    hideOnMobile: true,
    mobileCardWidth: 19,
    mobileX: 110,
    mobileY: 16,
    mobileRotation: -2,
  },
  {
    src: '/social-proof/tweet-supratik-das.png',
    alt: 'Supratik Das on X praises Flent for the best homes in Bangalore',
    width: 1024,
    height: 466,
    cardWidth: 24,
    x: 186,
    y: -34,
    rotation: 1,
    hideOnMobile: true,
    mobileCardWidth: 19,
    mobileX: 123,
    mobileY: -18,
    mobileRotation: 1,
  },
]

const STRIP_WIDTH_DESKTOP_REM = 216
const STRIP_WIDTH_MOBILE_REM = 148

const FOLD2_SCROLL_OFFSET_DESKTOP = ['start start', 'end end'] as const
const FOLD2_SCROLL_OFFSET_MOBILE = ['start start', 'end 50%'] as const

function ExplosionCard({
  card,
  hasExploded,
  index,
  skipAnimation,
  isMobile,
}: {
  card: CardItem
  hasExploded: boolean
  index: number
  skipAnimation: boolean
  isMobile: boolean
}) {
  const reduceMotion = useReducedMotion()
  const remPx = typeof window !== 'undefined'
    ? parseFloat(getComputedStyle(document.documentElement).fontSize)
    : 16

  const cw = isMobile ? card.mobileCardWidth : card.cardWidth
  const cx = isMobile ? card.mobileX : card.x
  const cy = isMobile ? card.mobileY : card.y
  const cr = isMobile ? (card.mobileRotation ?? card.rotation ?? 0) : (card.rotation ?? 0)

  const cardCenterXPx = cx * remPx + (cw * remPx) / 2
  const viewportCenterXPx = typeof window !== 'undefined' ? window.innerWidth / 2 : 700
  const deltaX = viewportCenterXPx - cardCenterXPx
  const deltaY = -cy

  const staggerDelay = 0.6 + index * 0.045

  return (
    <motion.div
      style={{
        width: `${cw}rem`,
        left: `${cx}rem`,
        top: `calc(50% + ${cy}vh)`,
      } satisfies CSSProperties}
      initial={(reduceMotion || skipAnimation) ? {
        x: 0,
        y: '-50%',
        scale: 1,
        rotate: cr,
        opacity: 1,
      } : {
        x: deltaX,
        y: `${deltaY}vh`,
        scale: 0,
        rotate: 0,
        opacity: 0,
      }}
      animate={hasExploded ? {
        x: 0,
        y: '-50%',
        scale: 1,
        rotate: cr,
        opacity: 1,
      } : undefined}
      transition={skipAnimation ? { duration: 0 } : {
        type: 'spring',
        stiffness: 45,
        damping: 14,
        mass: 0.9,
        delay: staggerDelay,
      }}
      className={cn(
        'absolute overflow-hidden rounded-[1.05rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.25)] will-change-transform',
        !hasExploded && !reduceMotion && !skipAnimation && 'opacity-0',
      )}
    >
      <img
        src={assetUrl(card.src)}
        alt={card.alt}
        width={card.width}
        height={card.height}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="pointer-events-none block w-full h-auto select-none"
      />
      {card.href ? (
        <a
          href={card.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${card.alt}`}
          className="absolute inset-0 z-[2] cursor-pointer"
        />
      ) : null}
    </motion.div>
  )
}

export function SocialProofWall() {
  const ref = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const factor = useCinematicIntensity()
  const [scrollSpring, setScrollSpring] = useState<
    typeof cinematicScrollSpring | typeof cinematicScrollSpringMobile
  >(cinematicScrollSpring)
  const [scrollOffset, setScrollOffset] = useState<
    typeof FOLD2_SCROLL_OFFSET_DESKTOP | typeof FOLD2_SCROLL_OFFSET_MOBILE
  >(FOLD2_SCROLL_OFFSET_DESKTOP)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => {
      const mobile = mq.matches
      setIsMobile(mobile)
      setScrollSpring(mobile ? cinematicScrollSpringMobile : cinematicScrollSpring)
      setScrollOffset(mobile ? FOLD2_SCROLL_OFFSET_MOBILE : FOLD2_SCROLL_OFFSET_DESKTOP)
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const isInView = useInView(stickyRef, { once: false, amount: 0.3 })
  const [hasExploded, setHasExploded] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(true)
  const prevScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0)
  const entryDirection = useRef<'down' | 'up'>('down')
  const wasInView = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (!wasInView.current) {
        entryDirection.current = y >= prevScrollY.current ? 'down' : 'up'
      }
      prevScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { scrollYProgress} = useScroll({
    target: ref,
    offset: [...scrollOffset],
  })
  const smooth = useSpring(scrollYProgress, scrollSpring)
  const bgY = useTransform(smooth, [0, 1], [factor * 22, factor * -22])
  const grainY = useTransform(smooth, [0, 1], [factor * -12, factor * 12])

  const stripWidthRem = isMobile ? STRIP_WIDTH_MOBILE_REM : STRIP_WIDTH_DESKTOP_REM

  const [maxScroll, setMaxScroll] = useState(0)
  useEffect(() => {
    const update = () => {
      const stripPx = stripWidthRem * parseFloat(getComputedStyle(document.documentElement).fontSize)
      setMaxScroll(Math.max(stripPx - window.innerWidth, 0))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [stripWidthRem])

  const scrollDrivenX = useTransform(smooth, [0, 1], [0, -maxScroll])

  const TICKER_SPEED = 0.35
  const tickerOffset = useMotionValue(0)
  const combinedX = useMotionValue(0)
  const rafRef = useRef(0)
  const lastScrollX = useRef(0)
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const isTicking = useRef(false)

  const startTicker = useCallback(() => {
    if (isTicking.current) return
    isTicking.current = true
    const tick = () => {
      const current = tickerOffset.get()
      const scrollX = lastScrollX.current
      const combined = scrollX + current - TICKER_SPEED
      if (combined < -maxScroll) {
        isTicking.current = false
        return
      }
      tickerOffset.set(current - TICKER_SPEED)
      combinedX.set(combined)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [maxScroll, tickerOffset, combinedX])

  const stopTicker = useCallback(() => {
    isTicking.current = false
    cancelAnimationFrame(rafRef.current)
  }, [])

  useEffect(() => {
    if (isInView) {
      wasInView.current = true
      if (entryDirection.current === 'down') {
        setShouldAnimate(true)
        const timer = setTimeout(() => setHasExploded(true), 400)
        return () => clearTimeout(timer)
      } else {
        setShouldAnimate(false)
        setHasExploded(true)
        startTicker()
      }
    } else {
      if (wasInView.current) {
        wasInView.current = false
        setHasExploded(false)
        tickerOffset.set(0)
        combinedX.set(0)
        lastScrollX.current = 0
        stopTicker()
      }
    }
  }, [isInView, tickerOffset, combinedX, stopTicker, startTicker])

  useEffect(() => {
    const unsubscribe = scrollDrivenX.on('change', (v) => {
      lastScrollX.current = v
      combinedX.set(v + tickerOffset.get())
      stopTicker()
      if (idleTimer.current) clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(startTicker, 800)
    })
    return () => {
      unsubscribe()
      stopTicker()
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [scrollDrivenX, tickerOffset, combinedX, startTicker, stopTicker])

  useEffect(() => {
    if (!hasExploded) return
    const explosionDuration = 600 + cards.length * 45 + 900
    idleTimer.current = setTimeout(startTicker, explosionDuration)
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [hasExploded, startTicker])

  return (
    <section
      ref={ref}
      className="relative z-[2] -mt-10 h-[185vh] max-md:z-[2] md:z-auto md:h-[340vh] md:-mt-12 md:rounded-[4.5rem]"
    >
      <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden md:rounded-[4.5rem]">
        <motion.div
          style={{ y: bgY }}
          className="pointer-events-none absolute -inset-y-8 inset-x-0 bg-[linear-gradient(165deg,#edf8f3_0%,#dff2ec_58%,#d8ebe5_100%)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_30%,rgba(255,255,255,0.38),transparent_36%)]" />
        <motion.div style={{ y: grainY }} className="grain pointer-events-none absolute inset-0 opacity-55" />

        {/* Mobile: title on top, cards below */}
        <div className="relative flex h-full flex-col md:hidden">
          <div className="pointer-events-none relative z-10 shrink-0 px-6 pt-10 text-center">
            <FoldReveal>
              <h2
                className={cn(
                  'text-center text-[#003328]',
                  PRINCIPAL_HEADLINE_MOBILE_TOP_INSET,
                  PRINCIPAL_HEADLINE_CLASSNAME,
                )}
              >
                <span className="block">Our homes rent themselves.</span>
              </h2>
            </FoldReveal>
            <p
              className={cn(
                'mx-auto text-balance px-1 text-center font-sans font-normal text-[#003328]/58',
                PRINCIPAL_SUPPORT_MOBILE_COMBINED,
                PRINCIPAL_SUPPORT_WEB_BODY_FONT,
                '!mt-3',
              )}
            >
              We&apos;re a hot topic waiting for you to pick up.
            </p>
          </div>
          <div className="relative min-h-0 flex-1">
            <motion.div
              ref={stripRef}
              style={{ x: combinedX, width: `${stripWidthRem}rem` }}
              className="absolute inset-y-0 left-0"
            >
              {cards.map((card, i) => (
                <ExplosionCard
                  key={card.src}
                  card={card}
                  hasExploded={hasExploded}
                  index={i}
                  skipAnimation={!shouldAnimate}
                  isMobile={isMobile}
                />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Desktop: centered title over cards */}
        <div className="relative hidden h-full items-center justify-center md:flex">
          <motion.div
            ref={stripRef}
            style={{ x: combinedX, width: `${stripWidthRem}rem` }}
            className="absolute inset-y-0 left-0"
          >
            {cards.map((card, i) => (
              <ExplosionCard
                key={card.src}
                card={card}
                hasExploded={hasExploded}
                index={i}
                skipAnimation={!shouldAnimate}
                isMobile={false}
              />
            ))}
          </motion.div>

          <div className="pointer-events-none relative z-10 flex flex-col items-center px-6 text-center">
            <FoldReveal>
              <h2
                className={cn(
                  'text-center text-[#003328]',
                  PRINCIPAL_HEADLINE_MOBILE_TOP_INSET,
                  PRINCIPAL_HEADLINE_CLASSNAME,
                )}
              >
                <span className="block">Our homes rent themselves.</span>
              </h2>
            </FoldReveal>
            <p
              className={cn(
                'mx-auto text-balance px-1 text-center font-sans font-normal text-[#003328]/58',
                PRINCIPAL_SUPPORT_MOBILE_COMBINED,
                PRINCIPAL_SUPPORT_WEB_BODY_FONT,
                '!mt-3',
              )}
            >
              We&apos;re a hot topic waiting for you to pick up.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
