import { useEffect, type ReactNode } from 'react'
import { capturePageView, initPostHog } from '@/lib/posthog'

type Props = {
  children: ReactNode
}

export function PostHogProvider({ children }: Props) {
  useEffect(() => {
    initPostHog()
    capturePageView()

    const onHashChange = () => capturePageView()
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return children
}
