"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SlideUp } from "./ui/TextReveal";
import { Button } from "./ui/Button";

export function InviteTenant() {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (phone.replace(/\D/g, "").length >= 10) {
      setSubmitted(true);
    }
  };

  return (
    <section className="bg-[#131313]">
      <div className="mx-auto w-full px-6 md:px-12 lg:px-[120px]">
        <div className="py-16 md:py-24 lg:px-[120px] lg:py-[120px]">
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
              className="mt-10 w-full max-w-[480px]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {!submitted ? (
                <div className="rounded-2xl border border-white/[0.1] bg-[#131313] px-6 py-6 shadow-[0_12px_48px_rgba(0,0,0,0.4)] md:px-8 md:py-8">
                  <label
                    className="mb-2 block text-left text-[10px] font-medium uppercase tracking-[1px] text-[#555]"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    Tenant&apos;s phone number
                  </label>
                  <div className="flex items-baseline gap-2 border-b border-white/10 pb-2 transition-colors focus-within:border-[#ff9a6d]">
                    <span
                      className="text-[14px] text-[#555]"
                      style={{ fontFamily: "var(--font-ui)" }}
                    >
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="tel"
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      className="w-full bg-transparent text-[16px] text-white placeholder-[#444] outline-none"
                      style={{ fontFamily: "var(--font-ui)" }}
                    />
                  </div>
                  <div className="mt-6">
                    <Button
                      fullWidth
                      onClick={handleSubmit}
                      disabled={phone.replace(/\D/g, "").length < 10}
                    >
                      Send Invite
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/[0.1] bg-[#131313] px-6 py-6 md:px-8 md:py-8">
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
                    We&apos;ll notify your tenant at +91 {phone}
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
