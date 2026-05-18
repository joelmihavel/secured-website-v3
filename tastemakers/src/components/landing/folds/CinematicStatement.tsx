import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { PRINCIPAL_HEADLINE_CLASSNAME } from '@/components/landing/principalHeadlineClassName'
import {
  PRINCIPAL_HEADLINE_MOBILE_TOP_INSET,
  PRINCIPAL_HEADLINE_WEB_TO_BODY_MARGIN,
  PRINCIPAL_SUPPORT_MOBILE_COMBINED,
  PRINCIPAL_SUPPORT_WEB_BODY_FONT_WIDE,
} from '@/components/landing/principalSupportingMobileTypography'
import { cinematicScrollSpring } from '@/components/landing/shared/cinematicScrollSpring'
import { FoldReveal } from '@/components/landing/shared/FoldReveal'
import { MobileSnapCarousel } from '@/components/landing/shared/MobileSnapCarousel'
import { StartApplicationFloatingCta } from '@/components/landing/shared/StartApplicationFloatingCta'
import { useCinematicIntensity } from '@/components/landing/shared/useCinematicIntensity'
import { assetUrl } from '@/lib/utils'
import { cn } from '@/lib/utils'

type ProcessStep = {
  number: string
  title: string
  body: string
  mobileTitle?: string
  mobileBody?: string
}

const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Apply as a Tastemaker',
    body: 'Fill out the application and tell us how you move culture, people, or recommendations around you.',
    mobileBody: 'Two minutes. A few questions. We just want to know who you are.',
  },
  {
    number: '02',
    title: 'Get approved',
    body: 'Our team reviews every application to keep the network intentional, trusted, and aligned.',
  },
  {
    number: '03',
    title: 'Start sharing',
    body: 'Log into your dashboard to access your links, rewards, brand drops, and start earning immediately.',
    mobileTitle: 'Do what you do',
    mobileBody:
      'Your dashboard, links, rewards, and earnings are waiting. Just show up the way you always do.',
  },
]

const featureCards = [
  {
    title: 'Personal dashboard',
    body: 'Track referrals, rewards, approvals, payouts, and activity from one place.',
    visual: 'dashboard',
  },
  {
    title: 'Ready-to-share assets',
    body: 'Campaigns, brand drops, invite links, and creator assets are already prepared for you.',
    visual: 'assets',
  },
  {
    title: 'Guides and Resources',
    body: 'Access content buckets, creative direction, and posting guides to help you unlock more.',
    visual: 'resources',
  },
  {
    title: 'Reliable payouts',
    body: 'Earnings and rewards are tracked clearly and paid out directly with zero friction.',
    visual: 'payouts',
  },
] as const

function FeatureVisual({ type }: { type: (typeof featureCards)[number]['visual'] }) {
  if (type === 'dashboard') {
    return (
      <div className="relative w-full overflow-hidden rounded-[1.25rem] bg-[#f4f1ea] aspect-[1622/970] md:rounded-[1.5rem]">
        <img
          src={assetUrl('folds/personal-dashboard.png')}
          alt="Personal dashboard showing referrals, approvals, payouts, and rewards"
          className="h-full w-full object-contain object-center"
          loading="lazy"
          decoding="async"
        />
      </div>
    )
  }

  if (type === 'assets') {
    return (
      <div className="relative w-full overflow-hidden rounded-[1.25rem] bg-[#f4f1ea] aspect-[1024/615] md:rounded-[1.5rem]">
        <img
          src={assetUrl('folds/ready-to-share.png')}
          alt="Ready-to-share campaigns, invite links, and assets across social channels"
          className="h-full w-full object-contain object-center"
          loading="lazy"
          decoding="async"
        />
      </div>
    )
  }

  if (type === 'resources') {
    return (
      <div className="relative w-full overflow-hidden rounded-[1.25rem] bg-[#f4f1ea] aspect-[1024/614] md:rounded-[1.5rem]">
        <img
          src={assetUrl('folds/guides-resources.png')}
          alt="Guides and resources: content buckets, playbooks, creative direction, and posting guides"
          className="h-full w-full object-contain object-center"
          loading="lazy"
          decoding="async"
        />
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden rounded-[1.25rem] bg-[#f4f1ea] aspect-[1024/576] md:rounded-[1.5rem]">
      <img
        src={assetUrl('folds/reliable-payouts.png')}
        alt="Reliable payouts: earnings tracked, verified, and paid out directly"
        className="h-full w-full object-contain object-center"
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}

function FeatureCard({
  title,
  body,
  visual,
}: {
  title: string
  body: string
  visual: (typeof featureCards)[number]['visual']
}) {
  return (
    <article
      className={cn(
        'group overflow-hidden rounded-[1.2rem] bg-[#dff2ec]/[0.045] p-1.5 shadow-[0_28px_80px_-48px_rgba(223,242,236,0.28)] backdrop-blur md:rounded-[2rem] md:p-5',
        visual === 'dashboard' ||
        visual === 'assets' ||
        visual === 'resources' ||
        visual === 'payouts'
          ? 'border-0'
          : 'border border-[#dff2ec]/10',
      )}
    >
      <FeatureVisual type={visual} />
      <div className="px-0.5 pb-0.5 pt-5 md:px-2 md:pb-2 md:pt-8">
        <h3 className="font-display text-[1.22rem] leading-none tracking-[-0.02em] text-[#dff2ec] md:text-[2.35rem]">
          {title}
        </h3>
        <p className="mt-2 max-w-[30rem] text-[0.7rem] leading-[1.45] text-[#dff2ec]/64 md:mt-3 md:text-[0.95rem]">
          {body}
        </p>
      </div>
    </article>
  )
}

function ProcessSeparator(): ReactNode {
  return (
    <div className="hidden flex-1 items-center justify-center px-5 md:flex" aria-hidden>
      <span className="text-[#dff2ec]/25">→</span>
    </div>
  )
}

export function CinematicStatement() {
  const ref = useRef<HTMLElement>(null)
  const [mobileFeaturesStatic, setMobileFeaturesStatic] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  )
  const factor = useCinematicIntensity()

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setMobileFeaturesStatic(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const smooth = useSpring(scrollYProgress, cinematicScrollSpring)
  const bgY = useTransform(smooth, [0, 1], [factor * 18, factor * -18])
  const grainY = useTransform(smooth, [0, 1], [factor * -17, factor * 17])
  const vignetteScrollY = useTransform(smooth, [0, 1], [factor * -12, factor * 12])
  const heroY = useTransform(smooth, [0, 1], [factor * 15, factor * -15])
  const stepsY = useTransform(smooth, [0, 1], [factor * 23, factor * -23])
  const featuresY = useTransform(smooth, [0, 1], [factor * 30, factor * -30])

  return (
    <>
      <section ref={ref} className="relative -mt-2 overflow-hidden px-6 py-10 md:px-12 md:py-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#000d09]/35 to-transparent" />
        <motion.div
          style={{ y: bgY }}
          className="pointer-events-none absolute -inset-y-10 inset-x-0 bg-[url('/folds/start-earning-backdrop.png')] bg-cover bg-center brightness-[0.5] saturate-[0.95]"
          aria-hidden
        />
        <motion.div
          style={{ y: vignetteScrollY }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_54%,rgba(0,0,0,0.48)_100%)]"
          aria-hidden
        />
        <motion.div style={{ y: grainY }} className="grain pointer-events-none absolute inset-0" />

        <div className="relative mx-auto max-w-7xl">
          <motion.div style={{ y: heroY }}>
            <FoldReveal className="max-w-[58rem] md:max-w-[55%]">
              <h2
                className={cn(
                  PRINCIPAL_HEADLINE_MOBILE_TOP_INSET,
                  'text-[#dff2ec]',
                  PRINCIPAL_HEADLINE_CLASSNAME,
                  'flex flex-col items-start max-md:gap-0 md:gap-[6px]',
                )}
              >
                <span className="block">You bring the influence.</span>
                <span className="block">We handle the rest.</span>
              </h2>
            </FoldReveal>
            <FoldReveal delay={0.08} className="max-w-[28rem]">
              <p
                className={cn(
                  'font-sans text-[#dff2ec]/68',
                  'leading-[1.35]',
                  PRINCIPAL_SUPPORT_MOBILE_COMBINED,
                  PRINCIPAL_SUPPORT_WEB_BODY_FONT_WIDE,
                  'md:leading-[1.4] md:tracking-[0.012em]',
                  PRINCIPAL_HEADLINE_WEB_TO_BODY_MARGIN,
                )}
              >
                Start earning from day one.
              </p>
            </FoldReveal>
          </motion.div>

          <FoldReveal delay={0.12} className="mt-[calc(1.5625rem+4.5px)] md:mt-20">
            <motion.div
              style={{ y: stepsY }}
              className="flex flex-col gap-3 max-md:gap-[calc(0.6rem+10px)] md:flex-row md:items-start md:gap-0"
            >
              {processSteps.map((step, index) => (
                <div key={step.number} className="contents">
                  <div className="max-w-[23rem] md:w-[30%]">
                    <div className="flex flex-col gap-[calc(0.5rem-1.5px)] md:gap-[calc(0.75rem-1.5px)]">
                      <p className="text-xs leading-none tracking-[0.2em] text-[#dff2ec]/38 md:tracking-[0.28em]">
                        {step.number}
                      </p>
                      <h3 className="mt-0 font-display text-[2rem] leading-none tracking-[-0.02em] text-[#dff2ec] max-md:text-[1.48rem]">
                        {step.mobileTitle ?? step.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm font-normal leading-[1.45] text-[#dff2ec]/58 max-md:text-[0.8125rem] max-md:font-medium max-md:leading-[1.26] md:mt-3 md:font-medium">
                      {step.mobileBody ?? step.body}
                    </p>
                  </div>
                  {index < processSteps.length - 1 ? <ProcessSeparator /> : null}
                </div>
              ))}
            </motion.div>
          </FoldReveal>

          <div className="mt-14 max-md:overflow-x-visible md:mt-28">
            <FoldReveal delay={0.16} staticOnMobile>
              <h2 className={cn(PRINCIPAL_HEADLINE_CLASSNAME, 'mb-6 text-left text-[#dff2ec] md:mb-8')}>
                We make it easy for
                <br />
                you to win.
              </h2>
            </FoldReveal>
            <div className="md:hidden">
              <MobileSnapCarousel
                tone="mist"
                regionAriaLabel="Program features — swipe sideways to explore"
                breakoutClassName="relative left-1/2 w-[100vw] max-w-[100vw] -translate-x-1/2 px-0"
                scrollInsetCss="max(14px,calc((100vw - min(296px, 78vw))/2))"
                slides={featureCards
                  .filter((c) => !mobileFeaturesStatic || c.visual !== 'resources')
                  .map((card, slideIdx, arr) => ({
                    key: card.title,
                    'aria-label': `${slideIdx + 1} of ${arr.length}: ${card.title}`,
                    dotLabel: card.title,
                    content: (
                      <FeatureCard title={card.title} body={card.body} visual={card.visual} />
                    ),
                  }))}
              />
            </div>
            <motion.div
              style={{ y: mobileFeaturesStatic ? 0 : featuresY }}
              className="hidden gap-2.5 md:grid md:grid-cols-2 md:gap-6"
            >
              {featureCards.map((card) => (
                <FeatureCard
                  key={card.title}
                  title={card.title}
                  body={card.body}
                  visual={card.visual}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      <StartApplicationFloatingCta cinematicSectionRef={ref} />
    </>
  )
}
