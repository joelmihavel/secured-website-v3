import { FAQPage } from '@/components/faq/FAQPage'
import { LandingPage } from '@/components/landing/LandingPage'

function App() {
  // The app may be served at the deploy root (`/`) or behind the
  // flent.in `/tastemakers` rewrite — strip the prefix so route checks
  // work in either context.
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const raw = window.location.pathname.replace(/\/$/, '')
  const path = base && raw.startsWith(base) ? raw.slice(base.length) || '/' : raw || '/'

  if (path === '/faq') {
    return <FAQPage />
  }

  return <LandingPage />
}

export default App
