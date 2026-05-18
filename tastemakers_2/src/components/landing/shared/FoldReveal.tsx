import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { cn } from '@tastemakers/lib/utils'

const easeEditorial = [0.22, 1, 0.36, 1] as const

type FoldRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  /** Skip enter animation below `md` (avoids viewport glitches on dense folds). */
  staticOnMobile?: boolean
}

export function FoldReveal({ children, className, delay = 0, y = 28, staticOnMobile }: FoldRevealProps) {
  const reduceMotion = useReducedMotion()
  const [mobileStatic, setMobileStatic] = useState(
    () =>
      !!staticOnMobile &&
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 767px)').matches,
  )

  useEffect(() => {
    if (!staticOnMobile) return
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setMobileStatic(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [staticOnMobile])

  if (staticOnMobile && mobileStatic) {
    return <div className={cn(className)}>{children}</div>
  }

  return (
    <motion.div
      className={cn(className)}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px -8% 0px', amount: 0.12 }}
      transition={{ duration: 0.95, ease: easeEditorial, delay }}
    >
      {children}
    </motion.div>
  )
}
