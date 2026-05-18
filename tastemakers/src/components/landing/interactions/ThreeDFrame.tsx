import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

type ThreeDFrameProps = {
  title: string
  meta: string
}

export function ThreeDFrame({ title, meta }: ThreeDFrameProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg)')

  return (
    <motion.div
      ref={ref}
      onMouseMove={(event) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        const x = (event.clientX - rect.left) / rect.width
        const y = (event.clientY - rect.top) / rect.height
        const rotateY = (x - 0.5) * 12
        const rotateX = (0.5 - y) * 10
        setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`)
      }}
      onMouseLeave={() => setTransform('rotateX(0deg) rotateY(0deg)')}
      style={{ transformStyle: 'preserve-3d', transform }}
      className="group relative h-72 w-full rounded-[1.8rem] border border-[#003328]/15 bg-[#eef8f4]/80 p-4 shadow-[0_30px_60px_-35px_rgba(0,51,40,0.4)] backdrop-blur-sm transition-transform duration-500"
    >
      <div className="absolute inset-3 rounded-[1.3rem] bg-gradient-to-br from-white/80 via-[#e6f4ef] to-[#d8ece5]" style={{ transform: 'translateZ(25px)' }} />
      <div className="relative flex h-full flex-col justify-between rounded-[1.3rem] border border-[#003328]/10 p-5" style={{ transform: 'translateZ(40px)' }}>
        <p className="text-xs uppercase tracking-[0.22em] text-[#003328]/65">{meta}</p>
        <p className="max-w-[18ch] font-display text-2xl leading-[1.1] text-[#003328]">{title}</p>
      </div>
    </motion.div>
  )
}
