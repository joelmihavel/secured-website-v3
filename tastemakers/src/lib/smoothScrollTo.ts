/** Flatter through the mid-range than cubic — long anchor trips feel less rushed between folds. */
function easeInOutQuint(t: number): number {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2
}

function parseScrollMarginTop(el: Element): number {
  const parsed = parseFloat(getComputedStyle(el).scrollMarginTop)
  return Number.isFinite(parsed) ? parsed : 0
}

/** Document scroll Y so `element` aligns with the top of the viewport, honoring scroll-margin-top. */
export function getDocumentScrollYForElement(element: Element): number {
  const rect = element.getBoundingClientRect()
  const margin = parseScrollMarginTop(element)
  return rect.top + window.scrollY - margin
}

/** Distance-scaled duration (~520px/s average) so motion stays perceptibly smooth across many folds. */
function computeScrollDuration(distancePx: number): number {
  const MIN_MS = 520
  const MAX_MS = 4200
  const PX_PER_MS = 620 / 1000
  return Math.round(Math.min(MAX_MS, Math.max(MIN_MS, distancePx / PX_PER_MS)))
}

export function smoothScrollToY(targetY: number, durationMs?: number): Promise<void> {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const startY = window.scrollY
  const change = targetY - startY

  if (prefersReduced || Math.abs(change) < 2) {
    window.scrollTo(0, Math.max(0, targetY))
    return Promise.resolve()
  }

  /** Jump without animating through intermediate folds (e.g. Apply CTA). */
  if (durationMs === 0) {
    window.scrollTo(0, Math.max(0, targetY))
    return Promise.resolve()
  }

  const resolvedDuration = durationMs ?? computeScrollDuration(Math.abs(change))

  return new Promise((resolve) => {
    let startTime: number | null = null

    function step(now: number) {
      if (startTime === null) startTime = now
      const elapsed = now - startTime
      const t = Math.min(1, elapsed / resolvedDuration)
      window.scrollTo(0, startY + change * easeInOutQuint(t))
      if (t < 1) requestAnimationFrame(step)
      else resolve()
    }
    requestAnimationFrame(step)
  })
}

export function smoothScrollElementIntoView(
  element: HTMLElement | null,
  options?: { durationMs?: number },
): void {
  if (!element) return
  const initialY = Math.max(0, getDocumentScrollYForElement(element))
  void smoothScrollToY(initialY, options?.durationMs).then(() => {
    const finalY = Math.max(0, getDocumentScrollYForElement(element))
    if (Math.abs(window.scrollY - finalY) > 3) window.scrollTo(0, finalY)
  })
}
