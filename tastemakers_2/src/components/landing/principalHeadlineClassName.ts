/** Primary fold headline scale / line rhythm — matches Fold 1 (Hero) on all breakpoints. */
export const PRINCIPAL_HEADLINE_CLASSNAME =
  'font-display text-[clamp(calc(2.09rem+0.75px),calc(6.58vw+0.75px),calc(3.4rem+0.75px))] leading-[1.04] tracking-[-0.03em] md:text-[calc(3.55rem+0.75px)] md:leading-[0.92] xl:text-[calc(4.72rem+0.75px)]'

/**
 * `md+` line-height for display `h1` when copy wraps to multiple lines — matches fold 1 hero desktop.
 * Use on the `h1` or on inner `span.block` that carries wrapped lines; base `leading-*` still applies below `md`.
 */
export const PRINCIPAL_H1_WRAP_LEADING_WEB = 'md:leading-[1.075] xl:leading-[1.075]'
