import * as React from 'react'
import { cn } from '@tastemakers/lib/utils'

type CardProps = React.HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.75)] backdrop-blur-md',
        className,
      )}
      {...props}
    />
  )
}
