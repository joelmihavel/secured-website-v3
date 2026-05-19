import { FaqStrip } from '@/components/landing/folds/FaqStrip'
import { FlentMarketingFooter } from '@/components/landing/folds/FlentMarketingFooter'

/** FAQ strip (dark) + main-site-style marketing footer (light), no tweet marquee. */
export function Footer() {
  return (
    <>
      <FaqStrip />
      <FlentMarketingFooter />
    </>
  )
}
