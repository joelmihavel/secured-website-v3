import { type CSSProperties, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { PRINCIPAL_HEADLINE_CLASSNAME, PRINCIPAL_H1_WRAP_LEADING_WEB } from '@/components/landing/principalHeadlineClassName'
import { PRINCIPAL_HEADLINE_MOBILE_TOP_INSET } from '@/components/landing/principalSupportingMobileTypography'
import { cinematicScrollSpring } from '@/components/landing/shared/cinematicScrollSpring'
import { FoldReveal } from '@/components/landing/shared/FoldReveal'
import { useCinematicIntensity } from '@/components/landing/shared/useCinematicIntensity'
import { assetUrl, cn } from '@/lib/utils'
import { TASTEMAKERS_CTA_IDS } from '@/lib/cta-ids'
import { onTrackedCtaClick } from '@/lib/posthog'

/** Desktop: arcY / rotate via flex row + overlap. */
const orbitPlaceholders = [
  { rotate: -14, arcY: 22 },
  { rotate: -7, arcY: 10 },
  { rotate: -2, arcY: -8 },
  { rotate: 1, arcY: -14 },
  { rotate: 8, arcY: -5 },
  { rotate: 12, arcY: 12 },
  { rotate: 14, arcY: 24 },
] as const

/**
 * Mobile-only: premium editorial stack — matches reference arc & fan (Dyson omitted).
 * Order: Redstory → Comet → SMEG → fig → Blue Tokai (outer wings swapped).
 * Z: Redstory < Comet < SMEG > fig > Tokai. Vertical: wings low, inner pair level, hero apex.
 */
const MOBILE_ORBIT_COMPOSITION = [
  {
    assetIndex: 0,
    left: '17.5%',
    topPct: 51.05,
    width: 'clamp(5.8rem, 28.5vw, 8.72rem)',
    arcY: 5,
    rotate: -12,
    scale: 0.88,
    z: 11,
    opacity: 1,
    blurPx: 0,
  },
  {
    assetIndex: 4,
    left: '33%',
    topPct: 45.55,
    width: 'clamp(5.85rem, 28.5vw, 8.75rem)',
    arcY: 2,
    rotate: -6,
    scale: 0.92,
    z: 23,
    opacity: 1,
    blurPx: 0,
  },
  {
    assetIndex: 3,
    left: '50%',
    topPct: 39.85,
    width: 'clamp(6.38rem, 30vw, 9.32rem)',
    arcY: -6,
    rotate: -1.25,
    scale: 1,
    z: 56,
    opacity: 1,
    blurPx: 0,
  },
  {
    assetIndex: 5,
    left: '66.5%',
    topPct: 45.6,
    width: 'clamp(5.85rem, 28.5vw, 8.75rem)',
    arcY: 2,
    rotate: 6,
    scale: 0.92,
    z: 34,
    opacity: 1,
    blurPx: 0,
  },
  {
    assetIndex: 2,
    left: '82%',
    topPct: 51,
    width: 'clamp(5.8rem, 28.5vw, 8.72rem)',
    arcY: 5,
    rotate: 12,
    scale: 0.88,
    z: 14,
    opacity: 1,
    blurPx: 0,
  },
] as const

/** Brand logos per orbit slot. */
const orbitAssets: Partial<Record<number, { src: string; alt: string }>> = {
  0: { src: '/orbit/redstory.png', alt: 'Redstory' },
  1: { src: '/orbit/dyson.png', alt: 'Dyson' },
  2: { src: '/orbit/blue-tokai.png', alt: 'Blue Tokai Coffee Roasters' },
  3: { src: '/orbit/smeg.png', alt: 'Smeg' },
  4: { src: '/orbit/comet.png', alt: 'Comet' },
  5: { src: '/orbit/fig-living.png', alt: 'fig LIVING' },
  6: { src: '/orbit/partner-d.png', alt: 'Brand partner' },
}

export function RewardsOrbit() {
  const ref = useRef<HTMLElement>(null)
  const [isMobileOrbit, setIsMobileOrbit] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  )
  const reduceMotion = useReducedMotion()
  const ambientMotion = !reduceMotion
  const factor = useCinematicIntensity()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const smooth = useSpring(scrollYProgress, cinematicScrollSpring)
  const glowParallaxY = useTransform(smooth, [0, 1], [factor * 11, factor * -11])
  const grainParallaxY = useTransform(smooth, [0, 1], [factor * -19, factor * 19])
  const introY = useTransform(smooth, [0, 1], [factor * 18, factor * -18])
  const orbitY = useTransform(smooth, [0, 1], [factor * 28, factor * -28])
  const unlockY = useTransform(smooth, [0, 1], [factor * 14, factor * -22])

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobileOrbit(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return (
    <section
      ref={ref}
      className={cn(
        'relative isolate bg-[#000d09] px-[5vw] pb-[4vh]',
        'max-md:min-h-0 max-md:overflow-visible max-md:pb-14 max-md:pt-6',
        'md:min-h-0 md:overflow-visible md:pb-[calc(90px-8px)]',
      )}
    >
      <motion.div
        style={{ y: glowParallaxY }}
        className="pointer-events-none absolute -inset-y-[14%] inset-x-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(0,38,32,0.22)_0%,transparent_58%)]"
        aria-hidden
      />
      <motion.div
        style={{ y: grainParallaxY }}
        className="grain pointer-events-none absolute inset-0 opacity-[0.22]"
        aria-hidden
      />

      <div className="relative z-[1] flex w-full flex-col items-center md:gap-0 md:pb-0">
      <FoldReveal className="relative z-[2] mx-auto w-full max-w-[min(92vw,720px)] px-2 pb-0 pt-4 text-center max-md:mb-8 max-md:pb-2 md:mb-[4.5rem] md:pt-12">
        <motion.div style={{ y: introY }}>
          <h1
            className={cn(
              PRINCIPAL_HEADLINE_MOBILE_TOP_INSET,
              'flex flex-col items-center gap-[6px] text-[#E8F5F0]',
              PRINCIPAL_HEADLINE_CLASSNAME,
            )}
          >
            <span className={cn('block', PRINCIPAL_H1_WRAP_LEADING_WEB)}>Show up and take what you deserve.</span>
          </h1>
        </motion.div>
      </FoldReveal>

      <FoldReveal
        delay={0.06}
        className={cn(
          'z-10 flex w-full justify-center self-stretch',
          'relative left-auto top-auto mx-auto max-w-[min(92vw,720px)] translate-x-0 max-md:mt-5 max-md:pt-0',
          'md:relative md:z-[1] md:inset-auto md:mx-auto md:mb-8 md:max-w-[min(1200px,84vw)] md:translate-x-0 md:px-0 md:pb-2 md:pt-2',
        )}
      >
        <motion.div
          style={{ y: orbitY }}
          className={cn(
            'relative w-full justify-center pt-2 md:flex md:pt-0',
            'max-md:h-[clamp(220px,44vmin,328px)] max-md:overflow-visible max-md:pb-0 max-md:pt-0',
            'overflow-x-auto overflow-y-visible pb-0 [-ms-overflow-style:none] [scrollbar-width:none] md:h-auto md:overflow-visible md:pb-0 md:pt-0 [&::-webkit-scrollbar]:hidden',
          )}
        >
          <div
            className={cn(
              'relative mx-auto w-full gap-0 px-0',
              'max-md:min-h-[clamp(220px,44vmin,328px)] max-md:min-w-0 max-md:max-w-[min(92vw,720px)]',
              'flex min-w-0 items-end justify-center md:flex md:min-w-0',
            )}
          >
            {isMobileOrbit
              ? MOBILE_ORBIT_COMPOSITION.map((slot, compositionIdx) => {
                  const asset = orbitAssets[slot.assetIndex]
                  const baseRotate = slot.rotate
                  const rotateWobble = Math.abs(baseRotate) < 2 ? 0.035 : 0.07
                  const arcY = slot.arcY

                  const wrapperStyle: CSSProperties = {
                    left: slot.left,
                    top: `${slot.topPct}%`,
                    zIndex: slot.z,
                    width: slot.width,
                    transform: 'translate(-50%, -50%)',
                  }

                  return (
                    <div
                      key={`orbit-mobile-${slot.assetIndex}-${compositionIdx}`}
                      className={cn('max-md:absolute', 'md:contents')}
                      style={wrapperStyle}
                    >
                      <motion.div
                        className={cn(
                          'shrink-0 overflow-hidden rounded-[1.25rem] border border-[rgba(232,245,240,0.12)] bg-[rgba(232,245,240,0.03)]',
                          asset ? 'opacity-100' : 'opacity-[0.92]',
                          'max-md:h-full max-md:w-full max-md:shadow-[0_22px_52px_-20px_rgba(0,0,0,0.82)]',
                          'max-md:aspect-square md:relative',
                          'md:aspect-auto md:w-[clamp(9.375rem,11vw,11.875rem)]',
                          'md:h-[clamp(11.875rem,22vh,14.375rem)]',
                          'md:-ml-7 md:shadow-none md:first:ml-0',
                          'md:z-auto',
                        )}
                        style={{
                          opacity: slot.opacity,
                          filter: slot.blurPx > 0 ? `blur(${slot.blurPx}px)` : undefined,
                        }}
                        initial={false}
                        animate={
                          ambientMotion
                            ? {
                                y: [arcY, arcY - 2, arcY + 1.5, arcY],
                                rotate: [
                                  baseRotate - rotateWobble,
                                  baseRotate + rotateWobble,
                                  baseRotate,
                                ],
                                scale: [
                                  slot.scale - 0.008,
                                  slot.scale + 0.008,
                                  slot.scale,
                                ],
                              }
                            : {
                                y: arcY,
                                rotate: baseRotate,
                                scale: slot.scale,
                              }
                        }
                        transition={
                          ambientMotion
                            ? {
                                duration: 12 + compositionIdx * 0.55,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }
                            : { duration: 0 }
                        }
                        whileHover={
                          ambientMotion
                            ? {
                                y: arcY - 4,
                                opacity: 1,
                                filter: 'blur(0px)',
                                scale: slot.scale * 1.02,
                                boxShadow: '0 0 56px rgba(232,245,240,0.08)',
                                transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
                              }
                            : undefined
                        }
                        aria-hidden={!asset}
                      >
                        {asset ? (
                          <img
                            src={assetUrl(asset.src)}
                            alt={asset.alt}
                            width={480}
                            height={480}
                            className="pointer-events-none h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : null}
                      </motion.div>
                    </div>
                  )
                })
              : [...orbitPlaceholders].map((slot, idx) => {
                  const asset = orbitAssets[idx]
                  const arcY = slot.arcY
                  const baseRotate = slot.rotate
                  const rotateWobble = 0.35
                  return (
                    <div key={`orbit-${idx}`} className="md:contents">
                      <motion.div
                        className={cn(
                          'shrink-0 overflow-hidden rounded-[1.25rem] border border-[rgba(232,245,240,0.12)] bg-[rgba(232,245,240,0.03)]',
                          asset ? 'opacity-100' : 'opacity-[0.92]',
                          'relative aspect-auto h-[clamp(11.875rem,22vh,14.375rem)] w-[clamp(9.375rem,11vw,11.875rem)]',
                          '-ml-7 shadow-none first:ml-0',
                        )}
                        initial={false}
                        animate={
                          ambientMotion
                            ? {
                                y: [arcY, arcY - 3, arcY + 2, arcY],
                                rotate: [
                                  baseRotate - rotateWobble,
                                  baseRotate + rotateWobble,
                                  baseRotate,
                                ],
                              }
                            : {
                                y: arcY,
                                rotate: baseRotate,
                              }
                        }
                        transition={
                          ambientMotion
                            ? {
                                duration: 11 + idx * 0.65,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }
                            : { duration: 0 }
                        }
                        whileHover={
                          ambientMotion
                            ? {
                                y: arcY - 6,
                                opacity: 1,
                                boxShadow: '0 0 48px rgba(232,245,240,0.07)',
                                transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
                              }
                            : undefined
                        }
                        aria-hidden={!asset}
                      >
                        {asset ? (
                          <img
                            src={assetUrl(asset.src)}
                            alt={asset.alt}
                            width={480}
                            height={480}
                            className="pointer-events-none h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : null}
                      </motion.div>
                    </div>
                  )
                })}
          </div>
        </motion.div>
      </FoldReveal>

      <FoldReveal
        delay={0.1}
        className={cn(
          'z-[1] w-full max-w-[min(720px,92vw)] px-3 text-center',
          'relative left-auto top-auto mx-auto translate-x-0 max-md:-mt-2 max-md:pb-1 max-md:pt-0',
          'md:relative md:inset-auto md:mx-auto md:mt-0 md:max-w-[min(720px,92vw)] md:px-0 md:pb-0 md:pt-0',
        )}
      >
        <motion.div style={{ y: unlockY }}>
          <h2 className="text-[#E8F5F0]">
            <span className="flex flex-col items-center gap-[calc(0.375rem+6px)] font-sans text-[calc(0.875rem+1.5px)] font-normal leading-[calc(1.38em-4.25px)] tracking-[0.01em] text-[#E8F5F0]">
              <a
                href="#apply"
                aria-label="Jump to tastemaker application form"
                onClick={onTrackedCtaClick({
                  cta_id: TASTEMAKERS_CTA_IDS.REWARDS_APPLY,
                  cta_text: 'Apply Now',
                  cta_type: 'link',
                  cta_destination: '#apply',
                  page_section: 'rewards_orbit',
                })}
                className={cn(
                  'relative z-[2] block cursor-pointer rounded-sm underline decoration-1 underline-offset-[0.32em]',
                  'text-[#E8F5F0] decoration-[rgba(232,245,240,0.28)]',
                  'outline-none transition-[color,text-decoration-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                  'hover:text-[rgba(252,249,244,0.95)] hover:decoration-[rgba(252,249,244,0.55)]',
                  'active:text-[rgba(252,249,244,0.88)] active:decoration-[rgba(232,245,240,0.38)]',
                  'focus-visible:ring-1 focus-visible:ring-[#f4f1ea]/25',
                )}
              >
                Apply Now
              </a>
              <span className="block">Unlock the full catalogue.</span>
            </span>
          </h2>
        </motion.div>
      </FoldReveal>
      </div>
    </section>
  )
}
