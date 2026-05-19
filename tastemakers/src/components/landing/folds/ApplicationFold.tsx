import { type FormEvent, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { PRINCIPAL_HEADLINE_CLASSNAME, PRINCIPAL_H1_WRAP_LEADING_WEB } from '@/components/landing/principalHeadlineClassName'
import {
  PRINCIPAL_HEADLINE_MOBILE_TOP_INSET,
  PRINCIPAL_HEADLINE_WEB_TO_BODY_MARGIN,
  PRINCIPAL_SUPPORT_MOBILE_COMBINED,
  PRINCIPAL_SUPPORT_WEB_BODY_FONT,
} from '@/components/landing/principalSupportingMobileTypography'
import { FloatingKey } from '@/components/landing/shared/FloatingKey'
import { cinematicScrollSpring } from '@/components/landing/shared/cinematicScrollSpring'
import { FoldReveal } from '@/components/landing/shared/FoldReveal'
import { useCinematicIntensity } from '@/components/landing/shared/useCinematicIntensity'
import { cn } from '@/lib/utils'
import {
  trackTastemakerApplicationSubmitAttempted,
  trackTastemakerApplicationSubmitFailed,
  trackTastemakerApplicationSubmitSucceeded,
} from '@/lib/posthog'

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

const inputClass =
  'h-12 w-full rounded-2xl border border-white/15 bg-[#000d09]/40 px-4 text-[#E8F5F0] placeholder:text-[#dff2ec]/45 disabled:opacity-55'

export function ApplicationFold() {
  const ref = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [socialLinkCount, setSocialLinkCount] = useState(1)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const factor = useCinematicIntensity()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const smooth = useSpring(scrollYProgress, cinematicScrollSpring)
  const bgY = useTransform(smooth, [0, 1], [factor * 22, factor * -22])
  const grainY = useTransform(smooth, [0, 1], [factor * -12, factor * 12])
  const panelY = useTransform(smooth, [0, 1], [factor * 10, factor * -10])
  const keyParallax = useTransform(smooth, [0, 1], [0, factor * -28])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitStatus === 'loading') return

    const fd = new FormData(e.currentTarget)
    const fullName = String(fd.get('fullName') ?? '').trim()
    const email = String(fd.get('email') ?? '').trim()
    const city = String(fd.get('city') ?? '').trim()
    const homeAnswer = String(fd.get('homeAnswer') ?? '').trim()
    const socialRaw = fd.getAll('socialLink').map((v) => String(v).trim()).filter(Boolean)

    if (!fullName || !email || !city || !homeAnswer) {
      setSubmitStatus('error')
      setErrorMessage('Please fill in name, email, city, and your answer.')
      trackTastemakerApplicationSubmitFailed({
        error_message: 'validation_missing_required_fields',
      })
      return
    }
    if (socialRaw.length === 0) {
      setSubmitStatus('error')
      setErrorMessage('Please add at least one profile link.')
      trackTastemakerApplicationSubmitFailed({
        error_message: 'validation_missing_social_links',
      })
      return
    }

    setSubmitStatus('loading')
    setErrorMessage('')
    const submitStartedAt = performance.now()
    trackTastemakerApplicationSubmitAttempted()

    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/submit-application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          city,
          socialLinks: socialRaw,
          homeAnswer,
        }),
      })
      const data = (await res.json()) as { ok?: boolean; message?: string }
      if (!res.ok || !data.ok) {
        setSubmitStatus('error')
        const message = data.message ?? 'Something went wrong. Try again later.'
        setErrorMessage(message)
        trackTastemakerApplicationSubmitFailed({ error_message: message })
        return
      }
      setSubmitStatus('success')
      trackTastemakerApplicationSubmitSucceeded({
        submit_latency_ms: Math.round(performance.now() - submitStartedAt),
      })
      formRef.current?.reset()
      setSocialLinkCount(1)
    } catch {
      setSubmitStatus('error')
      setErrorMessage('Network error. Check your connection and try again.')
      trackTastemakerApplicationSubmitFailed({ error_message: 'network_error' })
    }
  }

  return (
    <section id="apply" ref={ref} className="relative -mt-6 scroll-mt-8 overflow-hidden px-6 pb-12 pt-20 md:px-12 md:pb-24 md:pt-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#dff2ec]/20 to-transparent" />
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-0 bg-[url('/folds/application-backdrop.png')] bg-cover bg-center brightness-[0.5] saturate-[0.95]"
        aria-hidden
      />
      <motion.div style={{ y: grainY }} className="grain pointer-events-none absolute inset-0" />

      <motion.div
        style={{ y: panelY }}
        className="relative mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.025] p-3 shadow-[0_40px_100px_-60px_rgba(0,0,0,0.8)] md:grid-cols-[1fr_0.8fr]"
      >
        <FoldReveal className="rounded-[1.65rem] bg-[#001b15]/62 p-6 shadow-[24px_0_80px_-56px_rgba(0,0,0,0.95)] backdrop-blur-xl md:p-10">
          <h2
            className={cn(
              PRINCIPAL_HEADLINE_MOBILE_TOP_INSET,
              PRINCIPAL_HEADLINE_CLASSNAME,
              'text-[#E8F5F0]',
              'max-md:flex max-md:flex-col max-md:items-start max-md:gap-[6px]',
              'md:block',
            )}
          >
            <span className={cn('max-md:block md:inline', PRINCIPAL_H1_WRAP_LEADING_WEB)}>Apply to be a</span>
            <br className="hidden md:block" />
            <span className={cn('max-md:block md:inline', PRINCIPAL_H1_WRAP_LEADING_WEB)}>Tastemaker</span>
          </h2>
          <p
            className={cn(
              'font-sans text-[#dff2ec]/75',
              PRINCIPAL_SUPPORT_MOBILE_COMBINED,
              PRINCIPAL_SUPPORT_WEB_BODY_FONT,
              PRINCIPAL_HEADLINE_WEB_TO_BODY_MARGIN,
            )}
          >
            Taste &gt; following.
          </p>

          <form ref={formRef} className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <input name="fullName" required placeholder="Your Name" autoComplete="name" className={inputClass} disabled={submitStatus === 'loading'} />
            <input
              name="email"
              required
              type="email"
              placeholder="Email"
              autoComplete="email"
              className={inputClass}
              disabled={submitStatus === 'loading'}
            />
            <div className="flex flex-col gap-2 md:gap-3">
              <div className="max-md:space-y-0.5 md:space-y-1">
                <p className="text-[calc(0.875rem+1px)] text-[#dff2ec]/70">Show us where you exist online.</p>
                <p className="text-xs leading-snug text-[#dff2ec]/45">Share links to your social profiles</p>
              </div>
              <div className="flex flex-col gap-2 md:gap-3">
                {Array.from({ length: socialLinkCount }, (_, index) => (
                  <input
                    key={index}
                    name="socialLink"
                    required={index === 0}
                    type="url"
                    placeholder={index === 0 ? 'Linkedin Profile URL *' : 'Additional profile link'}
                    className={inputClass}
                    disabled={submitStatus === 'loading'}
                  />
                ))}
                {socialLinkCount < 3 ? (
                  <button
                    type="button"
                    onClick={() => setSocialLinkCount((count) => Math.min(count + 1, 3))}
                    disabled={submitStatus === 'loading'}
                    className="text-left text-sm text-[#dff2ec]/58 transition duration-300 hover:text-[#dff2ec]/86 disabled:opacity-45 max-md:-mt-0.5 md:mt-0"
                  >
                    + Add another link
                  </button>
                ) : null}
              </div>
            </div>
            <input name="city" required placeholder="City" autoComplete="address-level2" className={inputClass} disabled={submitStatus === 'loading'} />
            <textarea
              name="homeAnswer"
              required
              placeholder="In one line - what makes a house a home?"
              rows={5}
              className="min-h-[7.25rem] w-full resize-none rounded-2xl border border-white/15 bg-[#000d09]/40 px-4 py-[0.9375rem] text-[0.9375rem] leading-[1.45] text-[#E8F5F0] placeholder:text-[#dff2ec]/45 disabled:opacity-55"
              disabled={submitStatus === 'loading'}
            />
            {submitStatus === 'error' && errorMessage ? (
              <p className="text-sm text-red-300/95" role="alert">
                {errorMessage}
              </p>
            ) : null}
            {submitStatus === 'success' ? (
              <p className="text-sm text-[#dff2ec]/88" role="status">
                Thanks — your application was received. We&apos;ll be in touch soon.
              </p>
            ) : null}
            <Button
              type="submit"
              disabled={submitStatus === 'loading'}
              className={cn(
                'group w-full bg-[#D4A853] text-[#000d09]',
                'transition-[box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                'hover:shadow-[0_10px_30px_rgba(212,168,83,0.45)] max-md:hover:shadow-[0_7px_24px_rgba(212,168,83,0.3)]',
                'max-md:active:shadow-[0_3px_14px_rgba(212,168,83,0.34)]',
                'disabled:hover:shadow-none max-md:disabled:hover:shadow-none',
                'md:duration-500',
              )}
            >
              <span
                className={cn(
                  'block w-full text-center transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                  'group-hover:-translate-y-1 max-md:group-hover:-translate-y-0.5',
                  'max-md:active:translate-y-px max-md:active:scale-[0.985]',
                  'md:duration-500',
                )}
              >
                {submitStatus === 'loading' ? 'Submitting…' : 'Apply now'}
              </span>
            </Button>
          </form>
        </FoldReveal>

        <FoldReveal delay={0.06} className="relative flex min-h-[210px] items-center justify-center rounded-[1.6rem] md:min-h-[400px]">
          <FloatingKey
            scrollParallaxY={keyParallax}
            className="md:h-[19rem] md:w-[13.25rem]"
          />
        </FoldReveal>
      </motion.div>
    </section>
  )
}
