import type { IncomingMessage } from 'node:http'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { handleSubmitApplicationRequest } from './api/submit-application'

function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

/**
 * Mounted under `/tastemakers/` so the app can be served both standalone
 * (`<deploy>.vercel.app/tastemakers`) and behind the flent.in Next.js
 * rewrite (`flent.in/tastemakers`). See `vercel.json` for the strip-prefix
 * rewrite that lets static assets resolve in either context.
 */
const APP_BASE = '/tastemakers/'

/** Dev-only: mirrors Vercel `POST /api/submit-application` so the token stays server-side. */
function hubspotSubmitDevPlugin(): Plugin {
  // SPA fetches `${BASE_URL}api/submit-application`; in production the
  // /tastemakers prefix is stripped by `vercel.json` before hitting the function.
  const devPath = `${APP_BASE}api/submit-application`
  return {
    name: 'hubspot-submit-application-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url?.split('?')[0] ?? ''
        if ((pathname !== devPath && pathname !== '/api/submit-application') || req.method !== 'POST') {
          next()
          return
        }
        try {
          const env = loadEnv(server.config.mode, process.cwd(), '')
          const merged = { ...process.env, ...env }
          const raw = await readRequestBody(req as IncomingMessage)
          const { status, body } = await handleSubmitApplicationRequest(raw, merged)
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        } catch {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, message: 'Internal server error' }))
        }
      })
    },
  }
}

/**
 * Share preview image (`public/images/Meta Image 2.png`), as served on production.
 * Override for staging/tests: set `VITE_OG_IMAGE_URL` to a full https URL at build time.
 */
const CANONICAL_OG_IMAGE_URL =
  'https://www.flent.in/tastemakers/images/Meta%20Image%202.png'

function ogImageAbsoluteUrlPlugin(env: Record<string, string | undefined>): Plugin {
  return {
    name: 'og-image-absolute-url',
    transformIndexHtml(html) {
      const imageUrl = env.VITE_OG_IMAGE_URL?.trim() || CANONICAL_OG_IMAGE_URL
      return html.split('__OG_IMAGE_URL__').join(imageUrl)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const envFromFiles = loadEnv(mode, process.cwd(), '')
  /** Vercel / CI inject vars into `process.env`; `loadEnv` only reads `.env*` files. */
  const env: Record<string, string | undefined> = { ...envFromFiles, ...process.env }

  return {
    base: APP_BASE,
    plugins: [react(), tailwindcss(), ogImageAbsoluteUrlPlugin(env), hubspotSubmitDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
