import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

/** ~3.5px taller than prior 36px row; paired with `HeroSection` mobile logo row `h-10`. */
const RIBBON_H = 40
const CLOSED_W = RIBBON_H
const OPEN_W = 153

const ICON_REVEAL_DELAY_MS = 300
const ICON_HIDE_COLLAPSE_MS = 220

/** Tabler Icons `share` (MIT) — outline; same treatment as `WhatsAppOutlineIcon` */
function ShareGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('text-[#ffffff]/88', className)}
      aria-hidden
    >
      <path
        d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.7 10.7l6.6 -3.4"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.7 13.3l6.6 3.4"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Tabler Icons `brand-whatsapp` (MIT) — outline, scaled via parent `className` */
function WhatsAppOutlineIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('text-[#ffffff]/88', className)}
      aria-hidden
    >
      <path
        d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Minimal × — close affordance only (not the X.com brand mark). */
function CloseMenuIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('text-[#ffffff]/88', className)}
      aria-hidden
    >
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
    </svg>
  )
}

/** Tabler Icons `brand-x` (MIT) — X / Twitter mark; same treatment as `WhatsAppOutlineIcon` */
function TwitterXOutlineIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('text-[#ffffff]/88', className)}
      aria-hidden
    >
      <path
        d="M4 4l11.733 16h4.267l-11.733 -16z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Tabler Icons `copy` (MIT) — overlapping rounded rects; same treatment as `WhatsAppOutlineIcon` */
function CopyOutlineIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('text-[#ffffff]/88', className)}
      aria-hidden
    >
      <path
        d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckThinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M5.5 12.5 10 17 18.5 6.5"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const ribbonSurface =
  'relative overflow-hidden rounded-full border border-[#ebe6dc]/[0.07] bg-[rgba(0,11,9,0.16)] shadow-[0_2px_16px_rgba(0,0,0,0.045)] backdrop-blur-[9px] backdrop-saturate-[1.08] ring-1 ring-[#f4f1ea]/[0.035]'

const iconHit =
  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#ebe6dc]/34 outline-none transition-[color,opacity,background-color] duration-200 ease-out hover:bg-[rgba(223,242,236,0.04)] hover:text-[#d8cfc0]/78 hover:opacity-100 focus-visible:ring-1 focus-visible:ring-[#ebe6dc]/14 active:scale-[0.98]'

export function HeroMobileShare({ className }: { className?: string }) {
  const [expanded, setExpanded] = useState(false)
  const [iconsVisible, setIconsVisible] = useState(false)
  const [copyPhase, setCopyPhase] = useState<'idle' | 'copied'>('idle')
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const clearTimers = useCallback(() => {
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current)
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current)
    revealTimerRef.current = null
    collapseTimerRef.current = null
  }, [])

  const collapseRibbon = useCallback(() => {
    clearTimers()
    setIconsVisible(false)
    const ms = reduceMotion ? 0 : ICON_HIDE_COLLAPSE_MS
    collapseTimerRef.current = setTimeout(() => {
      setExpanded(false)
      setCopyPhase('idle')
      collapseTimerRef.current = null
    }, ms)
  }, [clearTimers, reduceMotion])

  const expandRibbon = useCallback(() => {
    clearTimers()
    setExpanded(true)
    const ms = reduceMotion ? 0 : ICON_REVEAL_DELAY_MS
    revealTimerRef.current = setTimeout(() => {
      setIconsVisible(true)
      revealTimerRef.current = null
    }, ms)
  }, [clearTimers, reduceMotion])

  useEffect(() => () => clearTimers(), [clearTimers])

  useEffect(() => {
    if (!expanded) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) collapseRibbon()
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [expanded, collapseRibbon])

  useEffect(() => {
    if (!expanded) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') collapseRibbon()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expanded, collapseRibbon])

  const toggleAnchor = () => {
    if (expanded) collapseRibbon()
    else expandRibbon()
  }

  const wa = () => {
    const text = encodeURIComponent(shareUrl)
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer')
    collapseRibbon()
  }

  const xShare = () => {
    const u = encodeURIComponent(shareUrl)
    window.open(`https://twitter.com/intent/tweet?url=${u}`, '_blank', 'noopener,noreferrer')
    collapseRibbon()
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopyPhase('copied')
      window.setTimeout(() => setCopyPhase('idle'), 2000)
    } catch {
      collapseRibbon()
    }
  }

  const widthTransition = reduceMotion
    ? { duration: 0.15 }
    : { duration: expanded ? 0.56 : 0.48, ease: EASE }

  const iconFade = iconsVisible ? 'opacity-100' : 'opacity-0'

  return (
    <div className={cn('pointer-events-auto relative z-[45] flex items-center', className)}>
      <motion.div
        ref={rootRef}
        role={expanded ? 'dialog' : undefined}
        aria-label={expanded ? 'Share via' : undefined}
        initial={false}
        animate={{
          width: expanded ? OPEN_W : CLOSED_W,
          height: RIBBON_H,
        }}
        transition={widthTransition}
        className={cn(ribbonSurface, 'flex items-center')}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(165deg,rgba(223,242,236,0.05)_0%,transparent_46%,rgba(0,0,0,0.06)_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-[1px] rounded-full shadow-[inset_0_1px_1px_rgba(244,241,234,0.04)]"
          aria-hidden
        />

        <button
          type="button"
          aria-expanded={expanded}
          aria-haspopup="dialog"
          aria-label={expanded ? 'Close share menu' : 'Share this page'}
          onClick={toggleAnchor}
          className={cn(
            'relative z-[1] flex h-full min-h-0 items-center justify-center rounded-full text-[#ebe6dc]/48 outline-none transition-colors duration-200 ease-out hover:text-[#ebe6dc]/72 focus-visible:ring-1 focus-visible:ring-[#ebe6dc]/18',
            expanded ? 'w-10 shrink-0' : 'min-w-0 flex-1',
          )}
        >
          <span className="flex size-[17px] items-center justify-center [&_svg]:block" aria-hidden>
            {expanded ? (
              <CloseMenuIcon className="h-[16.5px] w-[16.5px]" />
            ) : (
              <ShareGlyph className="h-[16.5px] w-[16.5px]" />
            )}
          </span>
        </button>

        <div
          className={cn(
            'relative z-[1] flex min-w-0 items-center',
            expanded
              ? 'min-w-0 flex-1 opacity-100'
              : 'pointer-events-none w-0 flex-none overflow-hidden opacity-0',
          )}
          aria-hidden={!expanded}
        >
          <div
            className="mx-1 h-4 w-px shrink-0 bg-[linear-gradient(180deg,transparent,rgba(235,230,220,0.14),transparent)]"
            aria-hidden
          />

          <div className="flex flex-1 items-center justify-end gap-0.5 pr-1.5">
            <button
              type="button"
              aria-label="Share on WhatsApp"
              onClick={wa}
              className={cn(iconHit, iconFade)}
            >
              <WhatsAppOutlineIcon className="pointer-events-none h-[15.5px] w-[15.5px]" />
            </button>

            <button
              type="button"
              aria-label="Share on X"
              onClick={xShare}
              className={cn(iconHit, iconFade)}
            >
              <TwitterXOutlineIcon className="pointer-events-none h-[15.5px] w-[15.5px]" />
            </button>

            <button
              type="button"
              aria-label={copyPhase === 'copied' ? 'Link copied' : 'Copy link'}
              onClick={copy}
              className={cn(
                iconHit,
                iconFade,
                copyPhase === 'copied' && 'text-[#d4c4a8]/55 hover:text-[#d8cca8]/72',
              )}
            >
              <span className="sr-only" aria-live="polite">
                {copyPhase === 'copied' ? 'Copied' : ''}
              </span>
              <span className="pointer-events-none flex items-center justify-center">
                {copyPhase === 'idle' ? (
                  <CopyOutlineIcon className="pointer-events-none h-[15.5px] w-[15.5px]" />
                ) : (
                  <CheckThinIcon className="h-[15.5px] w-[15.5px] text-[#ebe6dc]/88" />
                )}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
