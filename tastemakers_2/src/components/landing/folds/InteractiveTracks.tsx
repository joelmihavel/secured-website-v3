import { useEffect, useRef, useState } from 'react'
import type { MotionValue } from 'framer-motion'
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { trackItems } from '@tastemakers/components/landing/data'
import { assetUrl } from '@tastemakers/lib/utils'
import { PRINCIPAL_HEADLINE_CLASSNAME } from '@tastemakers/components/landing/principalHeadlineClassName'
import {
  PRINCIPAL_HEADLINE_MOBILE_TOP_INSET,
  PRINCIPAL_HEADLINE_WEB_TO_BODY_MARGIN,
  PRINCIPAL_SUPPORT_MOBILE_COMBINED,
  PRINCIPAL_SUPPORT_WEB_BODY_FONT_WIDE,
} from '@tastemakers/components/landing/principalSupportingMobileTypography'
import type { TrackItem } from '@tastemakers/components/landing/types'
import { cinematicScrollSpring } from '@tastemakers/components/landing/shared/cinematicScrollSpring'
import { FoldReveal } from '@tastemakers/components/landing/shared/FoldReveal'
import { MobileSnapCarousel } from '@tastemakers/components/landing/shared/MobileSnapCarousel'
import { useCinematicIntensity } from '@tastemakers/components/landing/shared/useCinematicIntensity'
import { cn } from '@tastemakers/lib/utils'

function useTouchFlipEnabled() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(hover: none), (pointer: coarse)')
    const update = () => setEnabled(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return enabled
}

const DEFAULT_TRACK_REWARD_STAT = '5K'

function TrackCardRewardsFooter({
  variant,
  statSizeClass,
  stat = DEFAULT_TRACK_REWARD_STAT,
  footerClassName,
}: {
  variant: 'overlay' | 'light'
  /** Optional override for the outsized ₹ amount (e.g. mobile vw vs desktop card width). */
  statSizeClass?: string
  /** Digits/text after ₹ — from {@link TrackItem.rewardStat}. */
  stat?: string
  /** Mobile track cards: nudge the rewards block (label, rule, amount). */
  footerClassName?: string
}) {
  const overlay = variant === 'overlay'
  return (
    <div className={cn('shrink-0', footerClassName)}>
      <p
        className={cn(
          'mb-2 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.14em]',
          overlay && 'max-md:mb-[calc(0.5rem-6.45px)]',
          overlay ? 'text-[#E8F5F0]/52' : 'text-black/45',
        )}
      >
        Rewards upto
      </p>
      <div
        className={cn('mb-2.5 h-px w-[78%] max-w-[13.5rem]', overlay ? 'bg-[#E8F5F0]/17' : 'bg-black/15')}
        aria-hidden
      />
      <p
        className={cn(
          'flex flex-wrap items-baseline gap-[0.06em] font-sans font-light leading-[0.92] tracking-[-0.045em]',
          statSizeClass ??
            (overlay ? 'text-[clamp(2.35rem,10vw,3.1rem)] text-[#E8F5F0]' : 'text-[clamp(2.125rem,3.45vw,2.85rem)] text-black'),
        )}
      >
        <span
          className={cn(
            'font-light leading-none',
            overlay ? 'text-[#E8F5F0]' : 'text-black',
          )}
        >
          ₹
        </span>
        <span className="tabular-nums">{stat}</span>
      </p>
    </div>
  )
}

function TrackMobileFacingCard({ card }: { card: TrackItem }) {
  if (!card.image) return null
  const body = card.mobileCopy ?? card.copy
  return (
    <div className="relative h-[16rem] w-full overflow-hidden rounded-[1.35rem] border border-white/10 shadow-[0_14px_44px_-22px_rgba(0,0,0,0.55)]">
      <img
        src={assetUrl(card.image.src)}
        alt={card.image.alt}
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-[1.35rem] bg-gradient-to-b from-black/58 via-black/20 to-black/[0.78]"
        aria-hidden
      />
      <div className="absolute inset-0 flex min-h-0 flex-col justify-between p-5 pb-5 pt-5">
        <div className="shrink-0">
          <p className="font-display text-[1.28rem] leading-[1.02] tracking-[-0.02em] text-[#E8F5F0]">
            {card.title}
          </p>
          <p className="mt-2 max-w-[min(100%,34ch)] font-sans text-[0.8125rem] font-normal leading-[1.32] text-[#E8F5F0]/66">
            {body}
          </p>
        </div>
        <TrackCardRewardsFooter
          variant="overlay"
          stat={card.rewardStat ?? DEFAULT_TRACK_REWARD_STAT}
          footerClassName="max-md:translate-y-2"
        />
      </div>
    </div>
  )
}

function TracksMobileCarousel({ tilesY }: { tilesY: MotionValue<number> }) {
  const slideCards = trackItems.filter((t): t is TrackItem & { image: NonNullable<TrackItem['image']> } =>
    Boolean(t.image),
  )

  const slides = slideCards.map((card, slideIdx) => ({
    key: card.title,
    'aria-label': `${slideIdx + 1} of ${slideCards.length}: ${card.title}`,
    dotLabel: card.title,
    content: <TrackMobileFacingCard card={card} />,
  }))

  return (
    <MobileSnapCarousel
      yMotion={tilesY}
      regionAriaLabel="Tastemaker track cards — swipe sideways to explore"
      slides={slides}
      tone="tracks"
      breakoutClassName="relative left-1/2 w-[100vw] max-w-[100vw] -translate-x-1/2 px-0"
      scrollInsetCss="max(14px,calc((100vw - min(296px, 78vw))/2))"
    />
  )
}


function TrackFlipCard({ card }: { card: TrackItem }) {
  const ref = useRef<HTMLDivElement>(null)
  const isTouchFlipEnabled = useTouchFlipEnabled()
  const isInView = useInView(ref, { amount: 0.62, margin: '-12% 0px -12% 0px' })
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  if (!card.image) return null

  const isFlipped = isHovered || (isTouchFlipEnabled && isInView) || isFocused

  return (
    <motion.div
      ref={ref}
      tabIndex={0}
      aria-label={`${card.title} card details`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className="h-[21rem] w-full rounded-[1.75rem] outline-none [perspective:1200px]"
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 58, damping: 20, mass: 0.95 }}
        className="relative h-full w-full rounded-[1.75rem] will-change-transform [transform-style:preserve-3d]"
      >
        <img
          src={assetUrl(card.image.src)}
          alt={card.image.alt}
          className="absolute inset-0 h-full w-full rounded-[1.75rem] object-cover [backface-visibility:hidden] [transform:translateZ(0)]"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 flex min-h-0 flex-col rounded-[1.75rem] bg-white p-7 text-black [backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(0)]">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-between gap-6">
            <div className="min-w-0 shrink-0">
              <p className="font-display text-[1.75rem] leading-[1.05] text-black">{card.title}</p>
              <p className="mt-4 text-[0.9375rem] leading-[1.15] text-black/72">
                {card.mobileCopy ?? card.copy}
              </p>
            </div>
            <TrackCardRewardsFooter
              variant="light"
              stat={card.rewardStat ?? DEFAULT_TRACK_REWARD_STAT}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function InteractiveTracks() {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const factor = useCinematicIntensity()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const smooth = useSpring(scrollYProgress, cinematicScrollSpring)
  const bgY = useTransform(smooth, [0, 1], [factor * 13, factor * -13])
  const vignetteY = useTransform(smooth, [0, 1], [factor * -10, factor * 10])
  const headingY = useTransform(smooth, [0, 1], [factor * 21, factor * -21])
  const tilesY = useTransform(smooth, [0, 1], [factor * 38, factor * -38])

  return (
    <section
      ref={ref}
      className="relative -mt-4 overflow-hidden px-6 pb-[calc(9rem-84px)] pt-[calc(4rem-17px)] max-md:overflow-x-visible max-md:overflow-y-hidden md:overflow-hidden md:px-12 md:pb-28 md:pt-[calc(5rem-17px)]"
    >
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-0 bg-[#000d09]"
        aria-hidden
      />
      <motion.div
        style={{ y: vignetteY }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(232,245,240,0.04)_0%,transparent_55%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl overflow-hidden max-md:overflow-x-visible max-md:overflow-y-hidden">
        <FoldReveal>
          <motion.div style={{ y: headingY }}>
            <h2
              className={cn(
                PRINCIPAL_HEADLINE_MOBILE_TOP_INSET,
                'max-w-4xl text-[#E8F5F0]',
                PRINCIPAL_HEADLINE_CLASSNAME,
              )}
            >
              Not all tastemakers move the same way.
            </h2>
            <p
              className={cn(
                'max-w-4xl text-left font-sans text-[#E8F5F0]/82',
                PRINCIPAL_SUPPORT_MOBILE_COMBINED,
                PRINCIPAL_SUPPORT_WEB_BODY_FONT_WIDE,
                'px-0',
                PRINCIPAL_HEADLINE_WEB_TO_BODY_MARGIN,
              )}
            >
              Winning looks different for all of us.
            </p>
          </motion.div>
        </FoldReveal>
        <FoldReveal delay={0.08} className="mt-12 max-md:overflow-x-visible">
          <div className="md:hidden">
            <TracksMobileCarousel tilesY={tilesY} />
          </div>
          <motion.div
            style={{ y: tilesY }}
            className="hidden grid gap-6 md:grid md:grid-cols-3 md:gap-5"
          >
            {trackItems.map((card) =>
              card.image ? (
                <TrackFlipCard
                  key={card.title}
                  card={card}
                />
              ) : (
                <motion.div
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                  key={card.title}
                  className="group relative h-[16rem] overflow-hidden rounded-[1.35rem] border border-white/10 bg-gradient-to-b from-[#003328] to-[#001c16] p-6 md:h-[21rem] md:rounded-[1.75rem] md:p-6"
                >
                  <motion.p variants={{ rest: { y: 0 }, hover: { y: -18 } }} className="font-display text-3xl leading-[1] text-[#E8F5F0] md:text-[2rem] md:leading-[1.02]">{card.title}</motion.p>
                  <motion.p variants={{ rest: { opacity: 0, y: 20 }, hover: { opacity: 1, y: 0 } }} className="absolute bottom-6 left-6 max-w-[22ch] text-sm text-[#dff2ec]/80 md:bottom-7 md:left-6 md:text-[0.9375rem]">{card.mobileCopy ?? card.copy}</motion.p>
                </motion.div>
              ),
            )}
          </motion.div>
        </FoldReveal>

        <div className="mt-10 flex justify-end md:mt-14">
          <a
            href="#apply"
            aria-label="Jump to tastemaker application form"
            className="flex cursor-pointer items-baseline gap-[0.35em] font-display text-sm font-light tracking-[0.16em] text-[rgba(244,241,234,0.78)] outline-none transition-[color,text-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[rgba(252,249,244,0.95)] focus-visible:ring-1 focus-visible:ring-[#f4f1ea]/25 active:text-[rgba(252,249,244,0.88)]"
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
          </a>
        </div>
      </div>
    </section>
  )
}
