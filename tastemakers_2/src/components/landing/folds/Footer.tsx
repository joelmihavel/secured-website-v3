import { assetUrl } from '@tastemakers/lib/utils'

const navLinks = [
  { label: 'Flent', href: 'https://www.flent.in/', external: true },
  { label: 'Home', href: '/tastemakers#home' },
  { label: 'Apply', href: '/tastemakers#apply' },
]

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/flent.in/' },
  { label: 'X.com', href: 'https://x.com/flenthomes' },
  { label: 'Linkedin', href: 'https://www.linkedin.com/company/flenthomes' },
  { label: 'YouTube', href: 'https://www.youtube.com/@FlentHomes' },
]

const primary = 'text-[rgba(255,255,255,0.92)]'
const muted = 'text-[rgba(255,255,255,0.45)]'
const taglineMuted = 'text-[rgba(255,255,255,0.45)]'

function FaqArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2.5 9.5L9.25 2.75M9.25 9.25V2.75H3"
        stroke="currentColor"
        strokeWidth="1.125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#000] px-6 pb-16 pt-14 font-sans text-[rgba(255,255,255,0.92)] max-md:pb-6 max-md:pt-9 md:px-12 md:pb-12 md:pt-12">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col">
        <div className="flex flex-col items-center self-center text-center">
          <p
            className={`${primary} max-w-xl font-medium tracking-[0.01em] max-md:text-[clamp(1.2rem,3.55vw,1.36rem)] md:text-[clamp(1.125rem,2.85vw,1.3125rem)]`}
          >
            Still have questions?
          </p>
          <a
            href="/tastemakers/faq"
            className={`${primary} mt-3 inline-flex items-center gap-1.5 text-[clamp(0.9375rem,2.6vw,1.0625rem)] font-normal tracking-[0.01em] underline decoration-[rgba(255,255,255,0.42)] underline-offset-[0.35em] transition-colors hover:text-white hover:decoration-[rgba(255,255,255,0.65)] md:mt-2`}
          >
            Read the FAQ&apos;s
            <FaqArrowIcon className="-mt-px shrink-0 opacity-[0.88]" />
          </a>
        </div>

        <div className="mt-10 flex w-full flex-col items-start text-left max-md:mt-14 md:mt-7">
          <img
            src={assetUrl('flent-logo-white.png')}
            alt="Flent"
            width={1120}
            height={220}
            className="w-[min(38vw,12.25rem)] shrink-0 opacity-90 max-md:w-[min(28vw,8.625rem)]"
            loading="lazy"
            decoding="async"
          />

          <p
            className={`max-md:mt-4 md:mt-4 max-w-[24rem] text-left text-[clamp(0.62rem,2.2vw,0.76rem)] font-medium uppercase leading-[1.12] tracking-[0.05em] md:max-w-[22rem] md:text-[clamp(0.68rem,0.9vw,0.875rem)] md:tracking-[0.055em]`}
          >
            <span className={primary}>DISCOVERED</span> <span className={taglineMuted}>THROUGH</span>{' '}
            <span className={primary}>PEOPLE,</span>
            <br />
            <span className={primary}>SHARED</span> <span className={taglineMuted}>THROUGH</span>{' '}
            <span className={primary}>TASTE</span>
          </p>

          <nav
            aria-label="Footer navigation"
            className={`mt-12 flex w-full flex-wrap items-center justify-start gap-x-7 gap-y-3 text-[clamp(0.875rem,2.2vw,0.975rem)] max-md:mt-9 md:mt-9 md:gap-x-10 ${muted}`}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                className="no-underline transition-colors duration-300 hover:text-[rgba(255,255,255,0.72)]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-12 h-px w-full max-w-none self-stretch bg-[rgba(255,255,255,0.16)] max-md:mt-9 md:mt-10" aria-hidden />

          <nav
            aria-label="Social links"
            className={`mt-9 flex w-full flex-wrap items-center justify-start gap-x-8 gap-y-3 text-[clamp(0.6875rem,1.8vw,0.8125rem)] font-medium tracking-[0.02em] max-md:mt-8 md:mt-7 md:gap-x-10 md:text-[0.8125rem] ${muted}`}
          >
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="no-underline transition-colors duration-300 hover:text-[rgba(255,255,255,0.72)]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
