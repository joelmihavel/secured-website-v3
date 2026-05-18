import { cn } from '@tastemakers/lib/utils'

/**
 * Supporting copy rhythm under principal fold headlines ({@link PRINCIPAL_HEADLINE_CLASSNAME}).
 * Same scale on narrow and wide viewports — matches Fold 1 mobile supporting line globally.
 */

export const PRINCIPAL_SUPPORT_MOBILE_TOP_GAP = 'mt-[calc(0.3rem+2px)]'

export const PRINCIPAL_SUPPORT_MOBILE_BODY = cn(
  'font-sans font-normal',
  'max-w-[20rem]',
  'px-1',
  'text-[calc(0.71rem+1.5px)]',
  'leading-[1.35]',
  'tracking-[0.01em]',
)

export const PRINCIPAL_SUPPORT_MOBILE_COMBINED = cn(PRINCIPAL_SUPPORT_MOBILE_TOP_GAP, PRINCIPAL_SUPPORT_MOBILE_BODY)

/**
 * Web (`md+`): margin-top from principal headline → supporting `<p>` — matches fold 5 process step (`md:mt-3`).
 * Overrides {@link PRINCIPAL_SUPPORT_MOBILE_COMBINED} top inset. Place **last** in `cn(...)`.
 */
export const PRINCIPAL_HEADLINE_WEB_TO_BODY_MARGIN = 'md:!mt-3'

/**
 * Web (`md+`): ×1.038 font size on {@link PRINCIPAL_SUPPORT_MOBILE_BODY} — principal supporting lines across folds (except fold 6).
 */
export const PRINCIPAL_SUPPORT_WEB_BODY_FONT = 'md:text-[calc((0.71rem+1.5px)*1.038)]'

/**
 * Web (`md+`): fold 5 cinematic headline uses larger md supporting size (`0.9375rem+1.5px`); same ×1.038 scale on that base.
 */
export const PRINCIPAL_SUPPORT_WEB_BODY_FONT_WIDE = 'md:text-[calc((0.9375rem+1.5px)*1.038)]'

/** Top inset for principal-tier headlines below fold chrome — same on mobile and desktop. */
export const PRINCIPAL_HEADLINE_MOBILE_TOP_INSET = 'mt-2'
