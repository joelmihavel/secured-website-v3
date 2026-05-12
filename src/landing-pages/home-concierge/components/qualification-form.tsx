"use client"

import { useState, useEffect, type FormEvent } from "react"
import { Eye } from "lucide-react"
import { useWhatsAppCta } from "@/hooks/useWhatsAppCta"

// Generate a "stable but dynamic" viewer count that changes every few minutes
function getViewerCount(): number {
  const now = Date.now()
  // Changes every 3 minutes, seeded by time
  const seed = Math.floor(now / 180000)
  // Simple hash to get pseudo-random but consistent number
  const hash = (seed * 9301 + 49297) % 233280
  // Map to range 9-22
  return 9 + (hash % 14)
}

const budgetOptions = [
  "₹25,000–₹30,000",
  "₹30,000–₹35,000",
  "₹35,000–₹45,000",
  "₹45,000+",
]

const areaOptions = [
  "HSR Layout",
  "Koramangala",
  "Indiranagar",
  "Bellandur–Sarjapura",
  "Whitefield",
  "Ulsoor–MG Road",
  "Open to suggestions",
]

async function submitToHubSpot(name: string, email: string, phone: string, budget: string, area: string) {
  const portalId = '45469632'
  const formId = '5413c5b2-25f5-4891-979d-b147207abee0'
  const url = `https://api-na2.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`

  const data = {
    fields: [
      { name: 'firstname', value: name },
      { name: 'email', value: email },
      { name: 'phone', value: phone },
      { name: 'budget_range', value: budget },
      { name: 'preferred_area', value: area }
    ],
    context: {
      pageUri: window.location.href,
      pageName: 'Flent Landing Page'
    }
  }

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
}

export function QualificationForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [viewerCount, setViewerCount] = useState(9)
  const whatsAppCta = useWhatsAppCta(
    "Found you via ads, excited to know more about Flent",
    { format: "api.whatsapp.com" }
  )

  // Set viewer count on client side and update periodically
  useEffect(() => {
    setViewerCount(getViewerCount())
    const interval = setInterval(() => {
      setViewerCount(getViewerCount())
    }, 180000) // Update every 3 minutes
    return () => clearInterval(interval)
  }, [])

  // Listen for animation end to clean up attention class
  useEffect(() => {
    const form = document.getElementById("flent-form")
    if (!form) return

    const handleAnimationEnd = () => {
      form.classList.remove("attention")
    }

    form.addEventListener("animationend", handleAnimationEnd)
    return () => form.removeEventListener("animationend", handleAnimationEnd)
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const budget = formData.get("budget") as string
    const area = formData.get("area") as string

    setLoading(true)

    try {
      await submitToHubSpot(name, email, phone, budget, area)
    } catch {
      // Silently fail — still show success
    }

    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div
        id="flent-form"
        className="form-card overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
      >
        {/* Green header */}
        <div className="relative overflow-hidden bg-flent-green px-6 py-8 text-center">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary-foreground/10" />
          <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-primary-foreground/10" />
          <p className="relative font-serif text-3xl font-bold text-primary-foreground">
            {"You're on our radar."}
          </p>
        </div>
        <div className="px-6 py-8 text-center">
          <p className="text-base leading-relaxed text-flent-dark">
            A Flent home concierge will call you shortly. Keep your phone close.
          </p>
          <div className="mt-6 border-t border-border pt-6">
            <p className="mb-3 text-sm text-muted-foreground">Can't wait?</p>
            <a
              {...whatsAppCta}
              className="inline-flex items-center gap-2 rounded-full bg-flent-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flent-green/90"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat with us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      id="flent-form"
      className="form-card overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
    >
      {/* Urgency strip */}
      <div className="flex items-center justify-center gap-2 bg-flent-dark px-4 py-2.5 text-sm text-white">
        <Eye className="h-4 w-4 text-flent-yellow" />
        <span>
          <span className="font-bold text-flent-yellow">{viewerCount} people</span> viewing now
        </span>
      </div>

      {/* Green header */}
      <div className="relative overflow-hidden bg-flent-green px-6 py-8">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary-foreground/10" />
        <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-primary-foreground/10" />
        <div className="relative">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-flent-yellow">
            Your home concierge
          </p>
          <p className="font-serif text-2xl font-bold text-primary-foreground">
            Find your Flent home.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">
            {"Tell us a little. We'll do the rest — and call you within 12 hours."}
          </p>
        </div>
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-6">
        {/* Name */}
        <div>
          <label
            htmlFor="form-name"
            className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.07em] text-[#555]"
          >
            Name
          </label>
          <input
            id="form-name"
            name="name"
            type="text"
            required
            placeholder="Your full name"
            className="flent-input w-full rounded-xl border-[1.5px] border-black/12 bg-[#FAFAFA] px-3.5 py-3 text-sm text-flent-dark placeholder:text-[#999] focus:border-flent-green focus:bg-white focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="form-email"
            className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.07em] text-[#555]"
          >
            Email
          </label>
          <input
            id="form-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="flent-input w-full rounded-xl border-[1.5px] border-black/12 bg-[#FAFAFA] px-3.5 py-3 text-sm text-flent-dark placeholder:text-[#999] focus:border-flent-green focus:bg-white focus:outline-none"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="form-phone"
            className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.07em] text-[#555]"
          >
            Phone
          </label>
          <input
            id="form-phone"
            name="phone"
            type="tel"
            required
            placeholder="+91 98765 43210"
            pattern="[+]?[0-9\s]{10,15}"
            className="flent-input w-full rounded-xl border-[1.5px] border-black/12 bg-[#FAFAFA] px-3.5 py-3 text-sm text-flent-dark placeholder:text-[#999] focus:border-flent-green focus:bg-white focus:outline-none"
          />
        </div>

        {/* Budget */}
        <div>
          <label
            htmlFor="form-budget"
            className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.07em] text-[#555]"
          >
            Budget
          </label>
          <select
            id="form-budget"
            name="budget"
            required
            defaultValue=""
            className="flent-input w-full appearance-none rounded-xl border-[1.5px] border-black/12 bg-[#FAFAFA] px-3.5 py-3 text-sm text-flent-dark focus:border-flent-green focus:bg-white focus:outline-none"
          >
            <option value="" disabled>
              Select your budget
            </option>
            {budgetOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Preferred area */}
        <div>
          <label
            htmlFor="form-area"
            className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.07em] text-[#555]"
          >
            Preferred area
          </label>
          <select
            id="form-area"
            name="area"
            required
            defaultValue=""
            className="flent-input w-full appearance-none rounded-xl border-[1.5px] border-black/12 bg-[#FAFAFA] px-3.5 py-3 text-sm text-flent-dark focus:border-flent-green focus:bg-white focus:outline-none"
          >
            <option value="" disabled>
              Select an area
            </option>
            {areaOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-[14px] bg-flent-dark px-6 py-4 text-sm font-extrabold text-white transition-colors hover:bg-flent-green disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Show me homes →"}
        </button>

        {/* Disclaimer */}
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          A real Flent person calls you within 12 hours.
        </p>
      </form>
    </div>
  )
}
