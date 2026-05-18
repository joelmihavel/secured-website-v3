import type { Metadata } from 'next'
import '@tastemakers/index.css'

export const metadata: Metadata = {
  title: 'Flent Tastemakers',
  description: 'A quiet referral and rewards program for people whose recommendations already move through trusted circles.',
  openGraph: {
    title: 'Flent Tastemakers',
    description: 'A quiet referral and rewards program for people whose recommendations already move through trusted circles.',
    images: '/og-fold1-hero.png',
  },
}

export default function TastemakersLayout({ children }: { children: React.ReactNode }) {
  return <div className="tastemakers-root">{children}</div>
}
