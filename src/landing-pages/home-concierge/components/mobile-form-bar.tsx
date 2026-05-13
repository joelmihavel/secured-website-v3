"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { QualificationForm } from "./qualification-form"

export function MobileFormBar() {
  const [expanded, setExpanded] = useState(false)
  const [showGlow, setShowGlow] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleExpand = () => {
      setExpanded(true)
      setShowGlow(true)

      setTimeout(() => {
        if (formRef.current) {
          const inputs = formRef.current.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
            "input, select"
          )
          for (const input of inputs) {
            if (!input.value || input.value === "") {
              input.focus()
              break
            }
          }
        }
        setTimeout(() => setShowGlow(false), 800)
      }, 350)
    }

    window.addEventListener("flent:expand-mobile-form", handleExpand)
    return () => window.removeEventListener("flent:expand-mobile-form", handleExpand)
  }, [])

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
      {/* Expanded overlay + form */}
      <AnimatePresence>
        {expanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-flent-dark/50 backdrop-blur-sm"
              onClick={() => setExpanded(false)}
              aria-hidden="true"
            />
            <motion.div
              ref={formRef}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className={`relative mx-auto max-h-[90vh] w-full max-w-lg overflow-y-auto transition-shadow duration-500 ${
                showGlow ? "shadow-[0_0_0_8px_rgba(0,142,117,0.3)]" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-card text-flent-dark shadow-md"
                aria-label="Close form"
              >
                <X className="h-4 w-4" />
              </button>
              <QualificationForm />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Collapsed bar */}
      <AnimatePresence>
        {!expanded && (
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            className="border-t border-border bg-card px-5 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          >
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="btn-retro w-full rounded-lg bg-flent-green px-6 py-3.5 text-sm font-bold text-primary-foreground hover:bg-flent-green/90"
            >
              {"Get started →"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
