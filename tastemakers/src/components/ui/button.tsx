import * as React from 'react'
import { cn } from '@/lib/utils'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full px-7 py-3 text-sm md:text-base font-medium tracking-wide transition duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853]/50 disabled:pointer-events-none disabled:opacity-60',
        className,
      )}
      {...props}
    />
  )
}
