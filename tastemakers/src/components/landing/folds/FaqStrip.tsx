const primary = 'text-[rgba(255,255,255,0.92)]'

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

/** Narrow fold above the main-site-style footer: FAQ CTA only (same layout as before). */
export function FaqStrip() {
  return (
    <section
      aria-label="Questions and FAQ"
      className="relative bg-[#000] px-6 pb-10 pt-14 font-sans max-md:pb-8 max-md:pt-10 md:px-12 md:pb-12 md:pt-12"
    >
      <div className="relative mx-auto flex w-full max-w-7xl flex-col">
        <div className="flex flex-col items-center self-center text-center">
          <p
            className={`${primary} max-w-xl font-medium tracking-[0.01em] max-md:text-[clamp(1.2rem,3.55vw,1.36rem)] md:text-[clamp(1.125rem,2.85vw,1.3125rem)]`}
          >
            Still have questions?
          </p>
          <a
            href={`${import.meta.env.BASE_URL}faq`}
            className={`${primary} mt-3 inline-flex items-center gap-1.5 text-[clamp(0.9375rem,2.6vw,1.0625rem)] font-normal tracking-[0.01em] underline decoration-[rgba(255,255,255,0.42)] underline-offset-[0.35em] transition-colors hover:text-white hover:decoration-[rgba(255,255,255,0.65)] md:mt-2`}
          >
            Read the FAQ&apos;s
            <FaqArrowIcon className="-mt-px shrink-0 opacity-[0.88]" />
          </a>
        </div>
      </div>
    </section>
  )
}
