/** Spring for smoothing scroll progress — editorial, not bouncy. */
export const cinematicScrollSpring = {
  stiffness: 72,
  damping: 38,
  mass: 0.35,
  restDelta: 0.0008,
} as const

/** Snappier follow on narrow viewports — fold 2 horizontal scrub (mobile only). */
export const cinematicScrollSpringMobile = {
  stiffness: 160,
  damping: 27,
  mass: 0.22,
  restDelta: 0.0008,
} as const
