"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SlideUp } from "./ui/TextReveal";

const COUNTRY_CODES = [
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+1", flag: "🇺🇸", name: "US" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+65", flag: "🇸🇬", name: "Singapore" },
];

export function InviteTenant() {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [countryIdx, setCountryIdx] = useState(0);
  const [showCodes, setShowCodes] = useState(false);

  const country = COUNTRY_CODES[countryIdx];

  const handleSubmit = () => {
    if (phone.replace(/\D/g, "").length >= 10) {
      setSubmitted(true);
    }
  };

  return (
    <section className="overflow-hidden bg-[#131313]">
      <div className="mx-auto w-full px-6 md:px-12 lg:px-[120px]">
        <div className="py-16 md:py-24 lg:px-[120px] lg:py-[72px]">
          <div className="flex flex-col items-center text-center">
            <SlideUp>
              <p
                className="text-sm leading-[1.6] uppercase tracking-[0.3em] text-[#797979] md:text-base"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                Get started
              </p>
            </SlideUp>

            <h2
              className="mt-4 text-[28px] leading-[1.3] tracking-[-0.5px] text-white md:text-[36px] lg:text-[40px] lg:leading-[1.4] lg:tracking-[-0.88px]"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              <span className="text-white">Invite your </span>
              <span className="text-[#ff9a6d]">tenant</span>
            </h2>

            <SlideUp delay={0.2} className="mt-3">
              <p
                className="max-w-[500px] text-base leading-[1.6] text-[#797979] md:text-lg lg:text-[20px] lg:leading-[32px]"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                Send them an invite to join Secured and activate your free rental cover.
              </p>
            </SlideUp>

            <motion.div
              className="relative mt-[40px] w-full max-w-[480px]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Cityscape background — behind the form card */}
              <div className="pointer-events-none absolute inset-x-[-400px] bottom-[-80px] top-[-60px] flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/backgrounds/cityscape-dithered.webp"
                  alt=""
                  aria-hidden="true"
                  className="w-full max-w-[1400px] object-contain opacity-25"
                />
              </div>

              {!submitted ? (
                <div
                  className="relative z-10 rounded-2xl border border-white/[0.08] px-6 py-6 shadow-[0_12px_48px_rgba(0,0,0,0.5)] backdrop-blur-sm md:px-8 md:py-8"
                  style={{ background: "linear-gradient(180deg, rgba(26,26,26,0.95) 0%, rgba(19,19,19,0.98) 100%)" }}
                >
                  {/* Phone input */}
                  <label
                    className="mb-3 block text-left text-[11px] font-medium uppercase tracking-[0.1em] text-[#666]"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    Tenant&apos;s phone number
                  </label>
                  <div className="flex items-center gap-0 rounded-xl border border-white/[0.08] bg-[#0d0d0d]/60 transition-colors focus-within:border-[#ff9a6d]/40">
                    {/* Country selector */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCodes(!showCodes)}
                        className="flex items-center gap-1.5 rounded-l-xl px-3.5 py-3.5 text-[14px] text-[#999] transition-colors hover:text-white"
                        style={{ fontFamily: "var(--font-ui)" }}
                      >
                        <span className="text-[16px]">{country.flag}</span>
                        <span>{country.code}</span>
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="ml-0.5 opacity-40">
                          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>

                      {showCodes && (
                        <div className="absolute top-full left-0 z-20 mt-1 w-[160px] rounded-xl border border-white/[0.08] bg-[#1a1a1a] py-1 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                          {COUNTRY_CODES.map((c, idx) => (
                            <button
                              key={c.code}
                              onClick={() => { setCountryIdx(idx); setShowCodes(false); }}
                              className={`flex w-full items-center gap-2 px-3.5 py-2 text-left text-[13px] transition-colors hover:bg-white/[0.05] ${
                                idx === countryIdx ? "text-[#ff9a6d]" : "text-[#999]"
                              }`}
                              style={{ fontFamily: "var(--font-ui)" }}
                            >
                              <span className="text-[15px]">{c.flag}</span>
                              <span>{c.code}</span>
                              <span className="ml-auto text-[11px] text-[#555]">{c.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="h-[20px] w-[1px] bg-white/[0.08]" />

                    {/* Phone input */}
                    <input
                      type="tel"
                      inputMode="tel"
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      className="w-full bg-transparent px-3.5 py-3.5 text-[15px] text-white placeholder-[#444] outline-none"
                      style={{ fontFamily: "var(--font-ui)" }}
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    onClick={handleSubmit}
                    disabled={phone.replace(/\D/g, "").length < 10}
                    className="mt-5 w-full rounded-xl bg-[#ff9a6d] py-3.5 text-[14px] font-semibold text-[#0d0d0d] transition-all hover:bg-[#ffb088] disabled:opacity-30 disabled:hover:bg-[#ff9a6d]"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    Send Invite
                  </button>
                </div>
              ) : (
                <div
                  className="relative z-10 rounded-2xl border border-white/[0.08] px-6 py-6 shadow-[0_12px_48px_rgba(0,0,0,0.5)] backdrop-blur-sm md:px-8 md:py-8"
                  style={{ background: "linear-gradient(180deg, rgba(26,26,26,0.95) 0%, rgba(19,19,19,0.98) 100%)" }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4ade80]/[0.15]">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8.5L6.5 12L13 4" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p
                      className="text-[14px] font-semibold text-[#4ade80]"
                      style={{ fontFamily: "var(--font-ui)" }}
                    >
                      Invite sent successfully
                    </p>
                  </div>
                  <p
                    className="mt-2 text-[12px] text-[#555]"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    We&apos;ll notify your tenant at {country.code} {phone}
                  </p>
                  <button
                    onClick={() => { setPhone(""); setSubmitted(false); }}
                    className="mt-4 text-[12px] text-[#ff9a6d] transition-colors hover:text-[#ffb899]"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    Invite another tenant
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
