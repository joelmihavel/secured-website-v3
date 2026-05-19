import { motion, useReducedMotion } from 'framer-motion'
import { PRINCIPAL_HEADLINE_CLASSNAME, PRINCIPAL_H1_WRAP_LEADING_WEB } from '@/components/landing/principalHeadlineClassName'
import {
  PRINCIPAL_HEADLINE_WEB_TO_BODY_MARGIN,
  PRINCIPAL_SUPPORT_MOBILE_COMBINED,
  PRINCIPAL_SUPPORT_WEB_BODY_FONT_WIDE,
} from '@/components/landing/principalSupportingMobileTypography'
import { FloatingKey } from '@/components/landing/shared/FloatingKey'
import { HeroMobileShare } from '@/components/landing/shared/HeroMobileShare'
import { assetUrl, cn } from '@/lib/utils'
import { TASTEMAKERS_CTA_IDS } from '@/lib/cta-ids'
import { onTrackedCtaClick } from '@/lib/posthog'

/** Same easing/duration as `FloatingKey` inner motion; ~40% y / ~40° rotate amplitude for subtler captions. */
const MOBILE_HERO_CAPTION_FLOAT = {
  transition: { duration: 10, repeat: Infinity, ease: 'easeInOut' as const },
  animate: { y: [-2.5, 2.5, -2.5], rotate: [-1, 1, -1] },
}

const captionGold = 'text-[#d4b878]/96'

/** Desktop hero only — floated captions beside the key; +5px vs mobile `text-[0.62rem]` */
const DESKTOP_FLOAT_CAPTION_LAYOUT =
  'text-[calc(0.62rem+5px)] max-w-[8.85rem] font-normal leading-[1.34] tracking-[0.035em]'
const DESKTOP_FLOAT_CAPTION_BOTTOM_LAYOUT =
  'text-[calc(0.62rem+5px)] max-w-[7.25rem] font-normal leading-[1.34] tracking-[0.035em]'

/** Hero supporting line — rupee + amount share gold accent; slightly heavier for legibility across fonts. */
const heroGoldAmountClass = cn(captionGold, 'font-semibold')

/** Mobile hero only — compact pill / small label (desktop uses its own CTA classes). */
const mobileApplyClasses =
  'inline-flex items-center justify-center rounded-full bg-[#d4a754] px-[calc(2rem+2px)] py-[calc(9px+1px)] font-sans text-[calc(14px+1px)] font-semibold tracking-[0.02em] text-white shadow-[0_8px_24px_rgba(212,167,84,0.35),inset_0_1px_0_rgba(255,255,255,0.32)] brightness-105 contrast-[1.03] transition-[transform,box-shadow,filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_11px_30px_rgba(212,167,84,0.42),inset_0_1px_0_rgba(255,255,255,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a754]/40'

export function HeroSection() {
  const reduceMotion = useReducedMotion()
  const captionAnimate = reduceMotion ? undefined : MOBILE_HERO_CAPTION_FLOAT.animate
  const captionTransition = reduceMotion ? undefined : MOBILE_HERO_CAPTION_FLOAT.transition

  return (
    <section
      id="home"
      className="relative z-[3] h-[calc(56rem-80px)] scroll-mt-0 overflow-x-hidden px-6 pb-5 pt-5 max-md:z-[3] max-md:overflow-visible md:z-auto md:h-[calc(clamp(42rem,54vw,66rem)+1.25rem)] md:overflow-hidden md:px-12 md:pb-0 md:pt-16"
    >
      <div
        className="pointer-events-none absolute inset-x-0 -bottom-24 top-0 flex items-center justify-center max-md:z-0 max-md:[-webkit-mask-image:linear-gradient(to_bottom,#000_0%,#000_71%,transparent_100%)] max-md:[mask-image:linear-gradient(to_bottom,#000_0%,#000_71%,transparent_100%)] md:[-webkit-mask-image:none] md:[mask-image:none]"
      >
        <img
          src={assetUrl('hero-background.png')}
          alt=""
          className="h-full w-full origin-center object-cover -scale-x-100"
        />
      </div>

      <div className="relative z-[4] mx-auto flex w-full max-w-lg flex-col items-center text-center md:hidden">
        <div className="mb-[calc(1.25rem+18px)] flex h-10 w-full max-w-xl items-center justify-between gap-3 self-stretch">
          <a
            href="https://www.flent.in"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Flent — visit flent.in"
            className="flex h-full w-24 shrink-0 items-center justify-start"
          >
            <img
              src={assetUrl('flent-logo-white.png')}
              alt="Flent"
              className="max-h-full w-full object-contain object-left"
            />
          </a>
          <HeroMobileShare className="h-full shrink-0" />
        </div>

        <h1
          className={cn(
            'mt-2 flex flex-col items-center gap-[6px] text-white',
            PRINCIPAL_HEADLINE_CLASSNAME,
          )}
        >
          <span className="block">Your influence is real.</span>
          <span className="block">Now it’s rewarding too.</span>
        </h1>

        <p className={cn('font-sans text-white/92', PRINCIPAL_SUPPORT_MOBILE_COMBINED)}>
          Get access to up to <span className={heroGoldAmountClass}>₹ 1 lakh</span> of Bangalore&apos;s best.
        </p>

        <div className="mt-[calc(2rem-7.5px)]">
          <a
            href="#apply"
            aria-label="Jump to tastemaker application form"
            className={mobileApplyClasses}
            onClick={onTrackedCtaClick({
              cta_id: TASTEMAKERS_CTA_IDS.HERO_APPLY,
              cta_text: 'Apply Now',
              cta_type: 'link',
              cta_destination: '#apply',
              page_section: 'hero',
            })}
          >
            Apply Now
          </a>
        </div>

        <div className="relative mx-auto mt-12 h-[min(58svh,24.5rem)] w-full max-w-[min(92vw,21.5rem)]">
          <motion.p
            className={`pointer-events-none absolute left-[12%] top-[33%] z-[2] max-w-[7.8rem] origin-center text-left font-sans text-[0.62rem] font-normal leading-[1.3] tracking-[0.035em] ${captionGold}`}
            animate={captionAnimate}
            transition={captionTransition}
          >
            Flent&apos;s search for
            <br />
            <span className="font-sans italic">Tastemakers</span>
          </motion.p>

          <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center pt-[4%] select-none">
            <FloatingKey className="relative h-[min(105vw,68rem)] w-[min(75vw,40rem)] -rotate-[4deg]" />
          </div>

          <motion.p
            className={`pointer-events-none absolute left-[68%] top-[60%] z-[2] max-w-[6.4rem] origin-center text-left font-sans text-[0.62rem] font-normal leading-[1.3] tracking-[0.035em] ${captionGold}`}
            animate={captionAnimate}
            transition={captionTransition}
          >
            Limited spots
            <br />
            available
          </motion.p>
        </div>
      </div>

      <div className="relative mx-auto hidden w-full max-w-7xl md:grid md:gap-10 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-0">
        {/* Web: explicit stack — headline→supporting matches fold 2 (`PRINCIPAL_HEADLINE_WEB_TO_BODY_MARGIN`). */}
        <div className="flex min-w-0 flex-col items-start">
          <a
            href="https://www.flent.in"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Flent — visit flent.in"
            className="mb-11 inline-block shrink-0"
          >
            <img src={assetUrl('flent-logo-white.png')} alt="Flent" className="h-auto w-[7.25rem]" />
          </a>
          <h1 className={cn('text-[#E8F5F0]', PRINCIPAL_HEADLINE_CLASSNAME)}>
            <span className={PRINCIPAL_H1_WRAP_LEADING_WEB}>Your influence is real.</span>{' '}
            <span className={PRINCIPAL_H1_WRAP_LEADING_WEB}>Now it’s rewarding too.</span>
          </h1>
          <p
            className={cn(
              'font-sans text-[#dff2ec]/80',
              PRINCIPAL_SUPPORT_MOBILE_COMBINED,
              'md:max-w-none',
              PRINCIPAL_SUPPORT_WEB_BODY_FONT_WIDE,
              PRINCIPAL_HEADLINE_WEB_TO_BODY_MARGIN,
            )}
          >
            Get access to up to <span className={heroGoldAmountClass}>₹ 1 lakh</span> of Bangalore&apos;s best.
          </p>
          <div className="mt-7 pt-[53px]">
            <a
              href="#apply"
              aria-label="Jump to tastemaker application form"
              className="inline-flex items-center justify-center rounded-full bg-[#D4A853] px-[2.6875rem] py-[calc(0.59375rem+1px)] font-medium tracking-wide text-white transition duration-500 text-[calc(1.125rem+1px)] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(212,168,83,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853]/50"
              onClick={onTrackedCtaClick({
                cta_id: TASTEMAKERS_CTA_IDS.HERO_APPLY,
                cta_text: 'Apply now',
                cta_type: 'link',
                cta_destination: '#apply',
                page_section: 'hero',
              })}
            >
              Apply now
            </a>
          </div>
        </div>

        <div className="relative mt-10 flex w-full min-w-0 justify-center lg:mt-0 lg:items-center">
          <div className="relative mx-auto h-[min(58svh,24.5rem)] w-full max-w-[min(92vw,21.5rem)] lg:mx-0 lg:max-w-none">
            <motion.p
              className={cn(
                'pointer-events-none absolute left-[12%] top-[33%] z-[2] origin-center text-left font-sans',
                DESKTOP_FLOAT_CAPTION_LAYOUT,
                captionGold,
              )}
              animate={captionAnimate}
              transition={captionTransition}
            >
              Flent&apos;s search for
              <br />
              <span className="font-sans italic">Tastemakers</span>
            </motion.p>

            <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center pt-[4%] select-none">
              <FloatingKey className="relative z-10 h-[31rem] w-[22rem] xl:h-[35rem] xl:w-[25rem]" />
            </div>

            <motion.p
              className={cn(
                'pointer-events-none absolute left-[68%] top-[60%] z-[2] origin-center text-left font-sans',
                DESKTOP_FLOAT_CAPTION_BOTTOM_LAYOUT,
                captionGold,
              )}
              animate={captionAnimate}
              transition={captionTransition}
            >
              Limited spots
              <br />
              available
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}
