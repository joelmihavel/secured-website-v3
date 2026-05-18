import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { PRINCIPAL_HEADLINE_CLASSNAME } from '@tastemakers/components/landing/principalHeadlineClassName'
import { cinematicScrollSpring } from '@tastemakers/components/landing/shared/cinematicScrollSpring'
import { FoldReveal } from '@tastemakers/components/landing/shared/FoldReveal'
import { useCinematicIntensity } from '@tastemakers/components/landing/shared/useCinematicIntensity'
import { assetUrl, cn } from '@tastemakers/lib/utils'

/** Narrow viewports only — legacy larger “Wall of” / “Tastemakers” display scale. */
const tastemakersWallHeadlineMobileScale =
  'max-md:text-[clamp(calc(4.15rem+0.75px),calc(11.75vw+0.75px),calc(6.3rem+0.75px))]'

/** Desktop: larger display scale for Wall / Tastemakers (mobile uses {@link tastemakersWallHeadlineMobileScale}). */
const tastemakersWallHeadlineMdScale =
  'md:text-[calc(6.45rem+0.75px)] xl:text-[calc(7.95rem+0.75px)]'

const tastemakerArchiveCards = [
  {
    label: 'Bangalore',
    title: 'Amarnath',
    src: '/tastemakers/amarnath-tastemaker.png',
    className: 'z-[1] w-[10.25rem] translate-y-10 rotate-[-2deg] opacity-90 md:w-[13rem] md:translate-y-12',
  },
  {
    label: 'Bangalore',
    title: 'Chhavi',
    src: '/tastemakers/chhavi-nift.png',
    className: 'z-[2] -ml-7 w-[12.25rem] translate-y-2 rotate-[1.5deg] md:-ml-8 md:w-[16rem] md:translate-y-4',
  },
  {
    label: 'Bangalore',
    title: 'Kaashvi',
    src: '/tastemakers/kaashvi-tastemaker.png',
    className: 'z-[3] -ml-8 w-[13.25rem] rotate-[0.6deg] opacity-95 md:-ml-10 md:w-[18.5rem]',
  },
  {
    label: 'Bangalore',
    title: 'Anmol',
    src: '/tastemakers/anmol-maini.png',
    className: 'z-[4] -ml-8 w-[14.25rem] rotate-[-0.75deg] md:-ml-10 md:w-[20rem]',
  },
  {
    label: 'Bangalore',
    title: 'Deep',
    src: '/tastemakers/deep-tastemaker.png',
    className: 'z-[3] -ml-8 w-[11.25rem] translate-y-8 rotate-[2deg] md:-ml-10 md:w-[15rem] md:translate-y-10',
  },
] as const

export function TastemakersWall() {
  const ref = useRef<HTMLElement>(null)
  const [mobileLayout, setMobileLayout] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  )
  const [coarsePointer, setCoarsePointer] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: none), (pointer: coarse)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const pq = window.matchMedia('(hover: none), (pointer: coarse)')
    const sync = () => {
      setMobileLayout(mq.matches)
      setCoarsePointer(pq.matches)
    }
    sync()
    mq.addEventListener('change', sync)
    pq.addEventListener('change', sync)
    return () => {
      mq.removeEventListener('change', sync)
      pq.removeEventListener('change', sync)
    }
  }, [])
  const factor = useCinematicIntensity()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const smooth = useSpring(scrollYProgress, cinematicScrollSpring)
  const grainY = useTransform(smooth, [0, 1], [factor * -11, factor * 11])
  const headlineY = useTransform(smooth, [0, 1], [factor * 13, factor * -13])
  const railY = useTransform(smooth, [0, 1], [factor * 22, factor * -22])

  return (
    <section ref={ref} id="tastemakers-wall" className="relative overflow-hidden bg-[#f3eee8] px-6 pb-0 pt-8 max-md:pb-2 md:min-h-[92vh] md:px-12 md:pb-0 md:pt-10">
      <motion.div style={{ y: grainY }} className="grain pointer-events-none absolute inset-0 opacity-[0.18]" />

      <div className="relative mx-auto flex min-h-0 max-w-[92rem] flex-col md:min-h-[88vh]">
        <FoldReveal>
          <motion.div style={{ y: mobileLayout ? 0 : headlineY }} className="relative min-h-0 md:min-h-[24rem]">
            <h2
              className={cn(
                PRINCIPAL_HEADLINE_CLASSNAME,
                'text-[#cda03b]',
                tastemakersWallHeadlineMobileScale,
                tastemakersWallHeadlineMdScale,
              )}
            >
              Wall of
            </h2>
            <p className="hidden max-w-[14rem] text-left font-sans leading-[1.34] tracking-[0.014em] text-[#1a1a18]/82 md:mt-[calc(1.5rem+1px)] xl:mt-[calc(1.75rem+1px)] md:block md:max-w-none md:text-[calc(1.0625rem+2px)] xl:text-[calc(1.1875rem+2px)]">
              <span className="whitespace-nowrap">Good taste got them here.</span>
              <br />
              Could you be next?
            </p>
            <h2
              className={cn(
                PRINCIPAL_HEADLINE_CLASSNAME,
                'mt-[calc(1.25rem-15px)] text-right text-[#cda03b]',
                tastemakersWallHeadlineMobileScale,
                tastemakersWallHeadlineMdScale,
                'md:absolute md:right-0 md:top-[calc(8.5rem-15px)] md:mt-0 lg:top-[calc(9rem-15px)]',
              )}
            >
              Tastemakers
            </h2>
            <p className="mt-4 w-full max-w-[14rem] text-left font-sans text-[calc(0.71875rem+1.5px)] leading-[1.34] tracking-[0.014em] text-[#1a1a18]/82 md:hidden">
              Good taste got them here.
              <br />
              Could you be next?
            </p>
          </motion.div>
        </FoldReveal>

        <FoldReveal delay={0.1} className="mt-[calc(7rem-1.25rem)] md:mt-auto">
          <motion.div
            style={{ y: mobileLayout ? 0 : railY }}
            className={cn(
              'relative left-1/2 flex w-[calc(100vw+6rem)] -translate-x-1/2 items-end overflow-visible pb-0',
              'max-md:px-[8vw]',
              'md:w-[calc(100vw+10rem)] md:px-0 md:pl-[14vw]',
            )}
          >
            {tastemakerArchiveCards.map((card) => (
              <motion.article
                key={card.title}
                whileHover={coarsePointer ? undefined : { y: -6 }}
                transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                className={card.className}
              >
                <p className="mb-1.5 text-[0.62rem] leading-none tracking-[-0.01em] text-[#1a1a18]/38 md:text-[0.68rem]">
                  ○ {card.label}
                </p>
                <div className="overflow-hidden rounded-[0.7rem] bg-[#e8e0d7] shadow-[0_18px_50px_-42px_rgba(0,0,0,0.75)]">
                  <img
                    src={assetUrl(card.src)}
                    alt={card.title}
                    width={820}
                    height={1100}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[3/4] w-full object-cover"
                  />
                </div>
              </motion.article>
            ))}
          </motion.div>
        </FoldReveal>
      </div>
    </section>
  )
}
