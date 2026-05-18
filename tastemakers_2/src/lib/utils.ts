import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Resolve a public asset path under the configured Vite base
 * (`/tastemakers/` in production, `/` in default dev). Vite only
 * auto-prefixes asset URLs inside `index.html`; JSX `src` attributes
 * must opt in via this helper.
 */
export function assetUrl(path: string): string {
  return `/${path.replace(/^\//, '')}`
}
