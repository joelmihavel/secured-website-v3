"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { submitLeadPart1 } from "@landing-pages/home-concierge/lib/hubspot"

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("exitIntentShown")
    if (alreadyShown) return

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasTriggered) {
        setIsOpen(true)
        setHasTriggered(true)
        sessionStorage.setItem("exitIntentShown", "true")
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)
    return () => document.removeEventListener("mouseleave", handleMouseLeave)
  }, [hasTriggered])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setLoading(true)
    try {
      await submitLeadPart1(
        formData.get("name") as string,
        formData.get("email") as string,
        formData.get("phone") as string,
      )
    } catch {
      // Silently fail — still show success
    }
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-2xl"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="p-8 text-center"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-flent-pastel-green">
                    <svg className="h-7 w-7 text-flent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mb-2 font-serif text-2xl font-bold text-flent-dark">
                    You&apos;re on our list!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ll reach out within 12 hours with homes that match your preferences.
                  </p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mt-6 cursor-pointer rounded-full bg-flent-green px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flent-green/90"
                  >
                    Continue browsing
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                  <div className="bg-flent-green px-6 py-6 text-center">
                    <p className="font-serif text-2xl font-bold text-white">
                      Wait! Don&apos;t miss out
                    </p>
                    <p className="mt-1 text-sm text-white/80">
                      Get personalized home recommendations
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-6">
                    <div>
                      <label
                        htmlFor="exit-name"
                        className="mb-1 block text-xs font-extrabold uppercase tracking-[0.07em] text-[#555]"
                      >
                        Name
                      </label>
                      <input
                        id="exit-name"
                        name="name"
                        type="text"
                        required
                        placeholder="Your name"
                        className="w-full rounded-xl border-[1.5px] border-black/12 bg-[#FAFAFA] px-3.5 py-2.5 text-sm text-flent-dark placeholder:text-[#999] focus:border-flent-green focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="exit-email"
                        className="mb-1 block text-xs font-extrabold uppercase tracking-[0.07em] text-[#555]"
                      >
                        Email
                      </label>
                      <input
                        id="exit-email"
                        name="email"
                        type="email"
                        required
                        placeholder="Email address"
                        className="w-full rounded-xl border-[1.5px] border-black/12 bg-[#FAFAFA] px-3.5 py-2.5 text-sm text-flent-dark placeholder:text-[#999] focus:border-flent-green focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="exit-phone"
                        className="mb-1 block text-xs font-extrabold uppercase tracking-[0.07em] text-[#555]"
                      >
                        Phone
                      </label>
                      <input
                        id="exit-phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="Phone number"
                        pattern="[+]?[0-9\s]{10,15}"
                        className="w-full rounded-xl border-[1.5px] border-black/12 bg-[#FAFAFA] px-3.5 py-2.5 text-sm text-flent-dark placeholder:text-[#999] focus:border-flent-green focus:bg-white focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-2 w-full cursor-pointer rounded-[14px] bg-flent-dark px-6 py-3 text-sm font-extrabold text-white transition-colors hover:bg-flent-green disabled:opacity-60"
                    >
                      {loading ? "Submitting..." : "Get my personalized picks →"}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
