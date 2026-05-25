"use client"

import { useState, useEffect, type FormEvent } from "react"
import { Eye } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  submitLeadPart1,
  submitLeadPart2,
  areaOptions,
  budgetRoomOptions,
  budgetFullHomeOptions,
  timelineOptions,
} from "@landing-pages/home-concierge/lib/hubspot"
import { sendCallback } from "@landing-pages/home-concierge/lib/demand-wizard"

function getViewerCount(): number {
  const now = Date.now()
  const seed = Math.floor(now / 180000)
  const hash = (seed * 9301 + 49297) % 233280
  return 9 + (hash % 14)
}

type HomeType = "room" | "fullhome"
type BHK = "2 BHK" | "3 BHK" | "4 BHK"

export function QualificationForm() {
  const [step, setStep] = useState<1 | 2>(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [viewerCount, setViewerCount] = useState(9)

  // Part 1 state
  const [part1Name, setPart1Name] = useState("")
  const [part1Phone, setPart1Phone] = useState("")
  const [part1Email, setPart1Email] = useState("")

  // Part 2 state
  const [homeType, setHomeType] = useState<HomeType | null>(null)
  const [bhk, setBhk] = useState<BHK | null>(null)
  const [area, setArea] = useState("")
  const [budget, setBudget] = useState("")
  const [timeline, setTimeline] = useState("")

  useEffect(() => {
    setViewerCount(getViewerCount())
    const interval = setInterval(() => setViewerCount(getViewerCount()), 180000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const form = document.getElementById("flent-form")
    if (!form) return
    const handleAnimationEnd = () => form.classList.remove("attention")
    form.addEventListener("animationend", handleAnimationEnd)
    return () => form.removeEventListener("animationend", handleAnimationEnd)
  }, [])

  // Reset BHK when switching home type
  useEffect(() => {
    setBhk(null)
    setBudget("")
  }, [homeType])

  async function handlePart1Submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string

    setLoading(true)
    try {
      await submitLeadPart1(name, email, phone)
    } catch {
      // Silently fail — PII captured, proceed to part 2
    }
    setPart1Name(name)
    setPart1Phone(phone)
    setPart1Email(email)
    setLoading(false)
    setStep(2)

    // Fire the demand-wizard callback as soon as PII is captured so leads who
    // bail before Part 2 still land in the rep queue. Part 2 will fire again;
    // demand-wizard dedupes by phone within a 2-hour pending window.
    sendCallback({ name, phone, email }).catch(() => {})
  }

  async function handlePart2Submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!homeType || !area || !budget || !timeline) return
    if (homeType === "fullhome" && !bhk) return

    setLoading(true)
    try {
      await submitLeadPart2(part1Email, homeType, bhk, area, budget, timeline)
    } catch {
      // Silently fail
    }
    setLoading(false)
    setSubmitted(true)
    sendCallback({
      name: part1Name,
      phone: part1Phone,
      email: part1Email,
      homeType,
      bhk,
      area,
      budget,
      timeline,
    }).catch(() => {})
  }

  const budgetOptions = homeType === "fullhome" ? budgetFullHomeOptions : budgetRoomOptions

  const part2Valid =
    homeType !== null &&
    (homeType === "room" || bhk !== null) &&
    area !== "" &&
    budget !== "" &&
    timeline !== ""

  return (
    <div
      id="flent-form"
      className="form-card overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
    >
      {/* Urgency strip — always visible */}
      <div className="flex items-center justify-center gap-2 bg-flent-dark px-4 py-2.5 text-sm text-white">
        <Eye className="h-4 w-4 text-flent-yellow" />
        <span>
          <span className="font-bold text-flent-yellow">{viewerCount} people</span> viewing now
        </span>
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          /* ── Success ── */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
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
                <p className="mb-3 text-sm text-muted-foreground">Can&apos;t wait?</p>
                <a
                  href="https://api.whatsapp.com/send/?phone=918904695925&text=Found+you+via+ads,+excited+to+know+more+about+Flent&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-flent-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flent-green/90"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Chat with us on WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        ) : step === 1 ? (
          /* ── Part 1: PII ── */
          <motion.div
            key="part1"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
          >
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
            <form onSubmit={handlePart1Submit} className="flex flex-col gap-4 px-6 py-6">
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

              <button
                type="submit"
                disabled={loading}
                className="btn-retro mt-2 w-full rounded-[14px] bg-flent-dark px-6 py-4 text-sm font-extrabold text-white hover:bg-flent-green disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Check availability →"}
              </button>

              <p className="text-center text-xs leading-relaxed text-muted-foreground">
                A real Flent person calls you within 12 hours.
              </p>
            </form>
          </motion.div>
        ) : (
          /* ── Part 2: Qualifying ── */
          <motion.div
            key="part2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
          >
            {/* Dark header */}
            <div className="relative overflow-hidden bg-flent-dark px-6 py-7">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/5" />
              <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/5" />
              <div className="relative">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-flent-yellow">
                  Help us match you
                </p>
                <p className="font-serif text-2xl font-bold text-white">
                  What are you looking for?
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  Takes 20 seconds. Gets you the right home.
                </p>
              </div>
            </div>

            {/* Form body */}
            <form onSubmit={handlePart2Submit} className="flex flex-col gap-4 px-6 py-6">

              {/* Home type toggle */}
              <div>
                <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.07em] text-[#555]">
                  I&apos;m looking for
                </p>
                <div className="flex gap-2">
                  {(["room", "fullhome"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setHomeType(type)}
                      className={`flex-1 rounded-xl border-2 py-3 text-sm font-bold transition-all ${
                        homeType === type
                          ? "border-flent-green bg-flent-green/10 text-flent-green"
                          : "border-border bg-[#FAFAFA] text-flent-dark hover:border-flent-green/40"
                      }`}
                    >
                      {type === "room" ? "Private Room" : "Full Home"}
                    </button>
                  ))}
                </div>
              </div>

              {/* BHK selector — only for full home */}
              <AnimatePresence>
                {homeType === "fullhome" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <div>
                      <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.07em] text-[#555]">
                        Configuration
                      </p>
                      <div className="flex gap-2">
                        {(["2 BHK", "3 BHK", "4 BHK"] as const).map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setBhk(b)}
                            className={`flex-1 rounded-xl border-2 py-2.5 text-sm font-semibold transition-all ${
                              bhk === b
                                ? "border-flent-dark bg-flent-dark text-white"
                                : "border-border bg-[#FAFAFA] text-flent-dark hover:border-flent-dark/40"
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Area */}
              <div>
                <label
                  htmlFor="form-area"
                  className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.07em] text-[#555]"
                >
                  Preferred area
                </label>
                <select
                  id="form-area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  required
                  className="flent-input w-full appearance-none rounded-xl border-[1.5px] border-black/12 bg-[#FAFAFA] px-3.5 py-3 text-sm text-flent-dark focus:border-flent-green focus:bg-white focus:outline-none"
                >
                  <option value="" disabled>Select an area</option>
                  {areaOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Budget — changes based on home type */}
              <div>
                <label
                  htmlFor="form-budget"
                  className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.07em] text-[#555]"
                >
                  Budget
                </label>
                <select
                  id="form-budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                  disabled={homeType === null}
                  className="flent-input w-full appearance-none rounded-xl border-[1.5px] border-black/12 bg-[#FAFAFA] px-3.5 py-3 text-sm text-flent-dark focus:border-flent-green focus:bg-white focus:outline-none disabled:opacity-50"
                >
                  <option value="" disabled>
                    {homeType === null ? "Select home type first" : "Select your budget"}
                  </option>
                  {budgetOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Move-in timeline */}
              <div>
                <label
                  htmlFor="form-timeline"
                  className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.07em] text-[#555]"
                >
                  When do you want to move?
                </label>
                <select
                  id="form-timeline"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  required
                  className="flent-input w-full appearance-none rounded-xl border-[1.5px] border-black/12 bg-[#FAFAFA] px-3.5 py-3 text-sm text-flent-dark focus:border-flent-green focus:bg-white focus:outline-none"
                >
                  <option value="" disabled>Select a timeline</option>
                  {timelineOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || !part2Valid}
                className="btn-retro mt-2 w-full rounded-[14px] bg-flent-dark px-6 py-4 text-sm font-extrabold text-white hover:bg-flent-green disabled:opacity-60"
              >
                {loading ? "Finding homes..." : "Find my home →"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
