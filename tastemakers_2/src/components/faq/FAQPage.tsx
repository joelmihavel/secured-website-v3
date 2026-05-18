import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PRINCIPAL_H1_WRAP_LEADING_WEB } from '@tastemakers/components/landing/principalHeadlineClassName'
import { assetUrl, cn } from '@tastemakers/lib/utils'

const faqItems = [
  {
    question: 'What is the Flent Tastemakers Program?',
    answer:
      'It is a quiet referral and rewards program for people whose recommendations already move through trusted circles. Tastemakers share Flent with people who may be looking for their next home, and earn when that interest turns into real movement.',
  },
  {
    question: 'Who can become a Tastemaker?',
    answer:
      'Creators, connectors, community builders, founders, students, hosts, and people with strong taste can apply. We look for thoughtful influence, not just audience size.',
  },
  {
    question: 'How do rewards work?',
    answer:
      'Once approved, you receive access to your links, assets, and reward details. When someone comes to Flent through you and qualifies, the reward is tracked and shared clearly.',
  },
  {
    question: 'What counts as a referral?',
    answer:
      'A referral can be a direct introduction, a shared link, a conversation, a post, or a recommendation that helps someone discover Flent and take the next step with us.',
  },
  {
    question: 'Do I need a large following?',
    answer:
      'No. A large following can help, but it is not the point. We care more about trust, taste, relevance, and whether people genuinely listen when you recommend something.',
  },
  {
    question: 'What kind of content can I create?',
    answer:
      'You can create in the format that feels natural to you. Stories, reels, posts, threads, private shares, city guides, home edits, and casual recommendations can all work when they feel considered.',
  },
  {
    question: 'How do payouts and brand rewards work?',
    answer:
      'Earnings and rewards are tracked through your Tastemaker access. Payouts and brand rewards are communicated directly, with the details kept clear before you begin sharing.',
  },
  {
    question: 'How long does approval take?',
    answer:
      'Applications are reviewed individually. Most applicants can expect to hear back after the team has had time to understand their profile, audience, and fit with the program.',
  },
  {
    question: 'Can I refer someone directly?',
    answer:
      'Yes. Direct referrals are welcome. If someone in your circle is actively looking for a home or wants to understand Flent better, you can introduce them through your approved channel.',
  },
  {
    question: 'Who do I contact if I need help?',
    answer:
      'Approved Tastemakers will receive the right contact path for program questions, referrals, assets, and reward support. Until then, the application is the best place to begin.',
  },
] as const

function FaqToggleIcon({ minus }: { minus: boolean }) {
  const stroke = 'currentColor'
  if (minus) {
    return (
      <svg width={14} height={14} viewBox="0 0 14 14" aria-hidden className="block shrink-0">
        <path d="M2 7h10" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" aria-hidden className="block shrink-0">
      <path d="M7 2v10M2 7h10" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  )
}

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#000d09] text-[#E8F5F0]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_12%,rgba(38,181,124,0.24),transparent_32%),radial-gradient(circle_at_12%_40%,rgba(78,199,145,0.12),transparent_30%),linear-gradient(180deg,rgba(0,13,9,0)_0%,rgba(0,0,0,0.52)_100%)]" />
      <div className="grain pointer-events-none absolute inset-0 opacity-35" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_180px_rgba(0,0,0,0.72)]" />

      <div className="relative mx-[6vw] max-w-[1320px] py-9 md:py-12">
        <header className="flex items-center justify-between gap-6">
          <a href={'/tastemakers#home'} aria-label="Back to Flent Tastemakers home">
            <img src={assetUrl('flent-logo-white.png')} alt="Flent" className="h-auto w-24 opacity-90 md:w-32" />
          </a>
          <a
            href={'/tastemakers#home'}
            className="text-sm tracking-[0.04em] text-[#dff2ec]/62 transition duration-300 hover:text-[#dff2ec]/90 md:text-base"
          >
            Back to Tastemakers
          </a>
        </header>

        <section className="pb-16 pt-20 md:pb-24 md:pt-28">
          <p className="mb-5 text-xs uppercase tracking-[0.32em] text-[#dff2ec]/42 md:text-sm">Flent Tastemakers</p>
          <h1
            className={cn(
              'max-w-[58rem] font-display text-[clamp(calc(4rem+0.75px),calc(9vw+0.75px),calc(7.5rem+0.75px))] leading-[0.9] tracking-[-0.045em] text-[#E8F5F0]',
              PRINCIPAL_H1_WRAP_LEADING_WEB,
            )}
          >
            Frequently asked questions
          </h1>
        </section>

        <section aria-label="Frequently asked questions" className="pb-24 md:pb-32">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index

            return (
              <div key={item.question} className="border-b border-[rgba(232,245,240,0.18)]">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="group flex w-full items-center justify-between gap-8 py-7 text-left md:py-9"
                >
                  <span className="max-w-[58rem] font-display text-[clamp(1.38rem,3vw,2.25rem)] font-normal leading-[1.08] tracking-[-0.035em] text-[#E8F5F0]/88 transition duration-300 group-hover:text-[#E8F5F0]">
                    {item.question}
                  </span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E8F5F0]/35 text-[#E8F5F0]/88 transition duration-300 group-hover:scale-105 group-hover:border-[#E8F5F0]/70 group-hover:text-[#E8F5F0] md:h-12 md:w-12">
                    <FaqToggleIcon minus={isOpen} />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[46rem] pb-8 font-sans text-[clamp(0.98rem,1.65vw,1.35rem)] leading-[1.45] text-[#dff2ec]/76 md:pb-10">
                        {item.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            )
          })}
        </section>
      </div>
    </main>
  )
}
