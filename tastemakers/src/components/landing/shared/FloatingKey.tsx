import type { MotionValue } from 'framer-motion'
import { motion, useReducedMotion } from 'framer-motion'
import { assetUrl, cn } from '@/lib/utils'

type FloatingKeyProps = {
  className?: string
  /** Scroll-driven Y offset (px); combines with inner levitation. */
  scrollParallaxY?: MotionValue<number>
}

export function FloatingKey({ className, scrollParallaxY }: FloatingKeyProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      aria-hidden
      className={cn('relative h-40 w-28 md:h-60 md:w-44', className)}
      style={scrollParallaxY ? { y: scrollParallaxY } : undefined}
    >
      <motion.div
        className="relative h-full w-full"
        animate={
          reduceMotion
            ? undefined
            : {
                y: [-6, 6, -6],
                rotate: [-2.5, 2.5, -2.5],
              }
        }
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img
          src={assetUrl('key-shadow.png')}
          alt=""
          className="pointer-events-none absolute left-1/2 top-[64%] z-0 w-[82%] -translate-x-1/2 object-contain opacity-65"
        />
        <img
          src={assetUrl('golden-key.png')}
          alt=""
          className="relative z-10 h-full w-full object-contain drop-shadow-[0_22px_30px_rgba(0,0,0,0.45)]"
        />
      </motion.div>
    </motion.div>
  )
}
