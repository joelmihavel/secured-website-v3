"use client";

import { useEffect, useState } from "react";
import "./renewal-styles.css";
import { inr, type TierQuote, type TierKey } from "@/lib/renewal/pricing";

// Flent palette (kept inline so we don't need theme tokens for these screens).
const C = {
  primary: "#008E75",
  primarySoft: "rgba(0,142,117,0.08)",
  primarySofter: "rgba(0,142,117,0.06)",
  ink: "#15102E",
  inkSoft: "rgba(21,16,46,0.85)",
  muted: "#8C8C8C",
  subtle: "#B3AC9F",
  border: "#EFEAE0",
  borderInner: "#F1ECE2",
  bg: "#FCFBF7",
  bgSoft: "#FBFAF4",
  accentOrange: "#C67040",
  yellow: "#FFE98A",
  yellowText: "#7A6800",
} as const;

const FAQ: Array<{ cat: string; items: Array<{ q: string; a: string }> }> = [
  {
    cat: "Renewal & Lock-in",
    items: [
      {
        q: "What happens if I don't confirm my renewal in time?",
        a: "If we don't receive confirmation before the renewal deadline, the renewal will happen at the standard escalation percentage and you will lose your savings.",
      },
      {
        q: "Can I cancel my renewal after confirming it?",
        a: "Once the renewal terms are locked-in on the system, a cancellation may attract security deposit forfeiture.",
      },
      {
        q: "Can I increase my lock-in period later and still get the same discounts?",
        a: "Lock-in choices made during renewal are fixed for the duration of that term. You may be able to extend the lock-in after the initial lock-in period ends, depending on program availability. Any discounts offered at that time will be subject to Flent's discretion.",
      },
      {
        q: "How is rent calculated if my renewal starts mid-month?",
        a: "If your renewal begins mid-month, the rent for the remaining days will be prorated based on the renewal date and added to the following month's rent invoice.",
      },
    ],
  },
  {
    cat: "Pricing & Escalation",
    items: [
      {
        q: "Why is my rent increasing?",
        a: "Rent is periodically revised to stay aligned with current market rates which is levied by the landlord.",
      },
      {
        q: "What is escalation applied on?",
        a: "Escalation is applied on the total rent, which includes both the base rent and the service fee.",
      },
      {
        q: "Will my rent change again during the new lock-in?",
        a: "No. Once your renewal is confirmed, the revised rent will remain fixed for the duration of the new lock-in period.",
      },
      {
        q: "Are these discounts and benefits lifetime offers?",
        a: "No. The discounts and benefits offered are exclusive to this renewal term. Once the term ends, the rent will revert to the base rent along with the standard escalation applicable at that time.",
      },
    ],
  },
  {
    cat: "General",
    items: [
      {
        q: "Can I switch rooms or properties during renewal?",
        a: "You cannot switch rooms/homes during the lock-in period. Switching homes may attract forfeiture of security deposit.",
      },
    ],
  },
];

export type ConfirmResult = { ok: true } | { ok: false; error: string };

export type RenewalLandingProps = {
  tenant: {
    name: string;
    email: string;
    property: string | null;
    currentRent: number;
    escalationPct: number;
  };
  quotes: TierQuote[];
  initialTier: TierKey | null;
  deadlineIso: string;
  effectiveFromIso: string;
  isPastDue: boolean;
  calLink: string;
  waLink: string;
  // Callbacks let the page wire up its own backend (token API on website, or
  // demand-mweb signed-link API for the live flow). Both return on success/fail.
  onConfirm: (tier: TierKey) => Promise<ConfirmResult>;
  onTrack?: (type: string, meta?: Record<string, unknown>) => void;
};

export default function RenewalLanding(props: RenewalLandingProps) {
  const {
    tenant, quotes, initialTier, deadlineIso, effectiveFromIso,
    calLink, waLink, onConfirm, onTrack,
  } = props;

  const [selected, setSelected] = useState<TierKey | null>(initialTier);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTier) {
      onTrack?.("tier_clicked", { tier: initialTier, source: "email_deeplink" });
      setTimeout(() => {
        document.getElementById("deal-card")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const quote = selected ? quotes.find((q) => q.key === selected) : null;
  const noLock = quotes.find((q) => q.key === "no_lockin")!;
  const escPct = `${Math.round(tenant.escalationPct * 100)}%`;
  const escAmt = noLock.newRent - tenant.currentRent;
  const deadline = new Date(deadlineIso);
  const effectiveFrom = new Date(effectiveFromIso);

  function pickTier(q: TierQuote) {
    setSelected(q.key);
    setError(null);
    onTrack?.("tier_clicked", { tier: q.key, newRent: q.newRent });
  }

  async function handleConfirm() {
    if (!quote) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await onConfirm(quote.key);
      if (res.ok) setConfirmed(true);
      else setError(res.error);
    } finally {
      setSubmitting(false);
    }
  }

  function handleCallback() {
    onTrack?.("cta_callback_clicked");
    window.open(calLink, "_blank", "noopener");
  }

  function handleWhatsapp() {
    onTrack?.("cta_whatsapp_clicked");
    window.open(waLink, "_blank", "noopener");
  }

  // ── Success state ─────────────────────────────────────────────────────
  if (confirmed && quote) {
    return (
      <main className="renewal-root min-h-screen" style={{ background: C.bg }}>
        <BrandHeader />
        <div className="mx-auto max-w-2xl px-4 sm:px-6 pb-20 pt-4 text-center">
          <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-sm" style={{ borderColor: C.border, borderWidth: 1 }}>
            <p className="text-5xl">🎉</p>
            <h1 className="mt-4 text-[26px] sm:text-3xl font-semibold tracking-tight" style={{ color: C.ink }}>You're locked in.</h1>
            <p className="mt-3 leading-relaxed" style={{ color: C.muted }}>
              Another year at <b style={{ color: C.ink }}>{tenant.property ?? "your home"}</b> — secured.
              <br />
              <b style={{ color: C.ink }}>{quote.label}</b> · ₹{inr(quote.newRent)}/mo, effective{" "}
              <b style={{ color: C.ink }}>{prettyDate(effectiveFrom)}</b>.
            </p>
            <p className="mt-3" style={{ color: C.muted }}>
              A confirmation's on its way to <b style={{ color: C.ink }}>{tenant.email}</b> with the recap.
            </p>
            <div className="mt-7 flex justify-center gap-3 flex-wrap">
              <button onClick={handleCallback} className="px-5 py-3 rounded-xl bg-white font-semibold text-sm" style={{ borderColor: C.ink, borderWidth: 1.5, color: C.ink }}>📅 Book a call</button>
              <button onClick={handleWhatsapp} className="px-5 py-3 rounded-xl bg-white font-semibold text-sm" style={{ borderColor: C.ink, borderWidth: 1.5, color: C.ink }}>💬 WhatsApp</button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Main state ────────────────────────────────────────────────────────
  return (
    <main className="renewal-root min-h-screen" style={{ background: C.bg }}>
      <BrandHeader />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 pb-24 pt-2">
        {/* Hero card */}
        <section className="rounded-3xl bg-white p-5 sm:p-10 shadow-sm" style={{ borderColor: C.border, borderWidth: 1 }}>
          <p className="text-[11px] font-bold tracking-[0.08em] uppercase" style={{ color: C.accentOrange }}>
            Renewal · close by {prettyDate(deadline)}
          </p>
          <h1 className="mt-2 text-[28px] sm:text-[40px] leading-[1.08] sm:leading-[1.05] font-semibold tracking-tight" style={{ color: C.ink }}>
            Hi {tenant.name.split(" ")[0] || "there"}.
            <br />
            <span style={{ color: C.primary }}>Another year at {tenant.property ?? "your home"}?</span>
          </h1>
          <p className="mt-4 leading-relaxed text-[14.5px] sm:text-base" style={{ color: C.inkSoft }}>
            Your renewal is due on <b>{formatDayMonth(deadline)}</b>. Pick a tier below and you hold a discount on this year's escalation. Leave it, and your rent rolls over at the standard rate of <b>₹{inr(noLock.newRent)}/mo</b>.
          </p>

          <div className="mt-6 rounded-2xl p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3" style={{ background: C.primarySofter, borderColor: "rgba(0,142,117,0.18)", borderWidth: 1 }}>
            <div>
              <p className="text-[10.5px] font-bold tracking-[0.08em] uppercase" style={{ color: C.accentOrange }}>Rent updates on</p>
              <p className="text-lg font-bold tracking-tight" style={{ color: C.ink }}>{prettyDate(effectiveFrom)}</p>
            </div>
            <div className="sm:text-right">
              <Countdown deadlineIso={deadlineIso} />
            </div>
          </div>

          <div className="mt-6 rounded-3xl p-1.5" style={{ background: C.primarySoft }}>
            <div className="rounded-[20px] bg-white p-4 sm:px-5 sm:py-5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-3 sm:divide-x sm:divide-[rgba(0,142,117,0.12)] divide-y sm:divide-y-0 divide-[rgba(0,142,117,0.10)]">
              <Stat label="Current rent" value={`₹${inr(tenant.currentRent)}`} sub="Base + maintenance" align="left" />
              <Stat label="Escalation"    value={`+${escPct}`}                  sub={`+₹${inr(escAmt)}/mo`} align="center" valueColor={C.primary} />
              <Stat label="No-lock rate"  value={`₹${inr(noLock.newRent)}`}     sub={`from ${prettyDate(effectiveFrom)}`} align="right" />
            </div>
          </div>
        </section>

        {/* Tier selection */}
        <p className="mt-10 text-center text-[11px] font-bold tracking-[0.08em] uppercase" style={{ color: C.accentOrange }}>
          Pick your savings
        </p>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quotes.map((q) => (
            <TierTile key={q.key} q={q} active={selected === q.key} onClick={() => pickTier(q)} />
          ))}
        </div>

        {/* Deal card */}
        {!quote ? (
          <div className="mt-6 rounded-3xl bg-white/40 py-10 text-center text-sm" style={{ color: C.muted, borderStyle: "dashed", borderWidth: 1.5, borderColor: "#D9D3C6" }}>
            Tap a tier above to see your deal.
          </div>
        ) : (
          <div id="deal-card" className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm" style={{ borderColor: C.primary, borderWidth: 1 }}>
            <div className="text-white px-5 sm:px-6 py-3 font-semibold flex items-center gap-2" style={{ background: C.primary }}>
              <span>✨</span> Your deal for the next term
            </div>
            <div className="px-5 sm:px-6 py-5 space-y-4">
              <Row title="Escalated rent" sub={`Current + ${escPct}`} value={`₹${inr(noLock.newRent)}`} />
              <Divider />
              <Row
                title="Discount on escalation"
                sub={`${Math.round(quote.discountPct * 100)}% off ₹${inr(quote.escalationAmount)}`}
                value={quote.discountAmount > 0 ? `−₹${inr(quote.discountAmount)}` : "—"}
                valueStyle={quote.discountAmount > 0 ? { color: C.primary, fontWeight: 700 } : undefined}
              />
              <Divider />
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold" style={{ color: C.ink }}>Lock-in term</p>
                  <p className="text-sm" style={{ color: C.muted }}>Minimum commitment</p>
                </div>
                <span className="inline-flex items-center rounded-full px-3 py-1 font-semibold text-sm whitespace-nowrap" style={{ background: C.yellow, color: C.yellowText }}>
                  {quote.lockMonths > 0 ? `${quote.lockMonths} months` : "Flexible"}
                </span>
              </div>
            </div>
            <div className="px-5 sm:px-6 py-4 flex items-center justify-between gap-3" style={{ background: C.bgSoft, borderTop: `1px solid ${C.border}` }}>
              <div className="min-w-0">
                <p className="font-semibold" style={{ color: C.ink }}>Your new monthly rent</p>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>From {prettyDate(effectiveFrom)}</p>
              </div>
              <p className="text-2xl font-bold tracking-tight whitespace-nowrap" style={{ color: C.ink }}>₹{inr(quote.newRent)}</p>
            </div>
            {quote.lockMonths > 0 && (
              <div className="px-5 sm:px-6 py-3 flex items-center justify-between gap-3" style={{ background: C.primarySoft, color: C.primary }}>
                <p className="font-semibold">You save over the 11-month term</p>
                <p className="font-bold whitespace-nowrap">₹{inr(quote.termSavings)}</p>
              </div>
            )}
            {error && (
              <div className="px-5 sm:px-6 py-3 text-sm" style={{ background: "#FEF2F2", color: "#B91C1C", borderTop: `1px solid #FECACA` }}>
                {error}
              </div>
            )}
            <div className="px-5 sm:px-6 py-5" style={{ borderTop: `1px solid ${C.border}` }}>
              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="w-full rounded-xl text-white py-4 font-semibold disabled:opacity-50"
                style={{ background: C.ink, border: "1px solid white", boxShadow: "-3px 3px 0 0 rgba(0,0,0,1)" }}
              >
                {submitting ? "Confirming..." : "Confirm my choice →"}
              </button>
            </div>
          </div>
        )}

        <p className="mt-5 text-center text-xs max-w-xl mx-auto" style={{ color: C.muted }}>
          Discount applies to this renewal term only. After it ends, your renewal resets to the no-lock-in rate with the discount on offer then.
        </p>

        {/* Help row */}
        <div className="mt-7 flex justify-center gap-3 flex-wrap">
          <button onClick={handleCallback} className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold text-sm" style={{ background: C.yellow, color: C.yellowText }}>📅 Book a call</button>
          <button onClick={handleWhatsapp} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-sm" style={{ borderColor: C.ink, borderWidth: 1.5, color: C.ink }}>💬 WhatsApp</button>
        </div>

        {/* FAQ */}
        <section className="mt-12 rounded-3xl bg-white overflow-hidden" style={{ borderColor: C.border, borderWidth: 1 }}>
          <div className="px-6 py-4 font-semibold flex items-center gap-2" style={{ borderBottom: `1px solid ${C.border}`, color: C.ink }}>
            <span>❓</span> Frequently Asked Questions
          </div>
          {FAQ.map((group, i) => (
            <details key={group.cat} open style={{ borderBottom: i < FAQ.length - 1 ? `1px solid ${C.borderInner}` : "none" }}>
              <summary className="px-6 py-3 cursor-pointer font-semibold text-sm" style={{ color: C.primary }}>
                {group.cat}
              </summary>
              <div className="px-6 pb-4 space-y-2">
                {group.items.map((it) => (
                  <details key={it.q} className="rounded-xl px-4 py-3" style={{ background: C.bg, borderColor: C.border, borderWidth: 1 }}>
                    <summary className="cursor-pointer font-medium text-sm" style={{ color: C.ink }}>{it.q}</summary>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: C.muted }}>{it.a}</p>
                  </details>
                ))}
              </div>
            </details>
          ))}
        </section>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-base font-semibold" style={{ color: C.ink }}>Why rent, when you can Flent.</p>
          <p className="text-sm mt-1" style={{ color: C.muted }}>India's new standard of renting</p>
          <p className="text-xs mt-3" style={{ color: C.subtle }}>© 2026 Flent · The Pavilion, 62/63 Church St, Bengaluru</p>
        </div>
      </div>
    </main>
  );
}

// ── Subcomponents ──────────────────────────────────────────────────────
function BrandHeader() {
  return (
    <header className="pt-8 pb-5 flex justify-center">
      {/* Logo lifted from Chetan's app — black mark on warm-white bg. */}
      <svg width="48" height="48" viewBox="0 0 67 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Flent">
        <path d="M10.8154 0C4.70982 0 0.901793 4.86149 2.29137 9.60615L0 9.61435V12.6661H2.29547V24H7.53612V12.6661H11.6003V9.58565H9.74142C7.16516 9.58565 5.6772 8.15098 5.6772 6.14654C5.6772 4.47208 7.37216 3.17882 9.29257 3.17882C13.5822 3.17882 14.8468 6.87822 14.8468 6.87822V24H20.0874V4.3696C18.8967 2.82015 15.6174 0 10.8154 0Z" fill="#15102E"/>
        <path d="M26.9894 16.2589L36.5566 13.3793C36.5566 13.1928 36.5566 13.0084 36.5259 12.8219C36.2779 10.2518 34.296 7.58942 29.7132 7.58942C25.4707 7.58942 21.9107 10.8707 21.9107 16.0417C21.9107 20.9032 25.565 24 29.8055 24C34.0459 24 36.3086 21.8951 36.6181 18.6118C35.7204 19.4173 34.2037 19.9132 32.4698 19.9132C30.5802 19.9132 27.9486 19.077 26.9894 16.2589ZM29.25 10.0366C30.6437 10.0366 31.7279 11.0265 31.5107 13.7831H26.6184C26.6184 11.5532 27.7334 10.0366 29.25 10.0366Z" fill="#15102E"/>
        <path d="M48.6274 7.8989C45.9036 7.8989 44.3849 9.38481 43.643 10.965V7.92964L38.4413 8.51786V24H43.643V11.6454C44.0754 11.5225 44.4792 11.4282 44.9752 11.4282C47.0801 11.4282 48.072 12.6354 48.072 14.9882V23.998H53.2737V13.3158C53.2737 9.53852 51.1996 7.89685 48.6295 7.89685L48.6274 7.8989Z" fill="#15102E"/>
        <path d="M62.7151 8.20838V3.56415L57.5134 4.18311V8.20838H55.097V10.9957H57.5134V24H62.7151V10.9957H66.8941V8.20838H62.7151Z" fill="#15102E"/>
      </svg>
    </header>
  );
}

function Countdown({ deadlineIso }: { deadlineIso: string }) {
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    function compute() {
      const ms = new Date(deadlineIso).getTime() - Date.now();
      if (ms <= 0) return "Deadline reached";
      const d = Math.floor(ms / 86_400_000);
      const h = Math.floor((ms % 86_400_000) / 3_600_000);
      return d > 0 ? `${d} day${d === 1 ? "" : "s"} ${h}h left` : `${h} hours left`;
    }
    setText(compute());
    const id = setInterval(() => setText(compute()), 60_000);
    return () => clearInterval(id);
  }, [deadlineIso]);
  return (
    <>
      <p className="text-lg font-extrabold tracking-tight tabular-nums" style={{ color: C.ink }}>
        {text ?? "…"}
      </p>
      <p className="text-[11px] mt-0.5" style={{ color: C.muted }}>to lock in a discount</p>
    </>
  );
}

function Stat({
  label, value, sub, align, valueColor,
}: {
  label: string;
  value: string;
  sub: string;
  align: "left" | "center" | "right";
  valueColor?: string;
}) {
  const a =
    align === "left"  ? "text-left pt-3 sm:pt-0 first:pt-0"
    : align === "right" ? "text-left sm:text-right sm:pl-3 pt-3 sm:pt-0"
    :                    "text-left sm:text-center sm:px-3 pt-3 sm:pt-0";
  return (
    <div className={a}>
      <p className="text-[10.5px] font-bold tracking-[0.06em] uppercase" style={{ color: C.muted }}>{label}</p>
      <p className="mt-1 sm:mt-1.5 text-[22px] sm:text-2xl font-bold tracking-tight" style={{ color: valueColor ?? C.ink }}>{value}</p>
      <p className="text-[11px] mt-0.5" style={{ color: C.muted }}>{sub}</p>
    </div>
  );
}

function Divider() {
  return <div style={{ borderTop: `1px solid ${C.borderInner}` }} />;
}

function Row({
  title, sub, value, valueStyle,
}: {
  title: string;
  sub?: string;
  value: string;
  valueStyle?: React.CSSProperties;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-semibold" style={{ color: C.ink }}>{title}</p>
        {sub && <p className="text-sm" style={{ color: C.muted }}>{sub}</p>}
      </div>
      <p className="text-lg font-medium tabular-nums" style={{ color: C.ink, ...valueStyle }}>{value}</p>
    </div>
  );
}

function TierTile({
  q, active, onClick,
}: {
  q: TierQuote;
  active: boolean;
  onClick: () => void;
}) {
  const isNoLock = q.key === "no_lockin";
  return (
    <button
      onClick={onClick}
      className="relative text-center rounded-3xl bg-white p-4 transition"
      style={{
        borderColor: active ? C.primary : C.border,
        borderWidth: 1.5,
        boxShadow: active ? "0 4px 20px rgba(0, 142, 117, 0.12)" : "none",
        transform: active ? "translateY(-2px)" : "none",
      }}
    >
      {active && (
        <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full text-white text-xs flex items-center justify-center" style={{ background: C.primary, boxShadow: "0 4px 12px rgba(0,142,117,0.3)" }}>
          ✓
        </span>
      )}
      <span
        className="inline-block rounded-full px-2.5 py-0.5 text-[10.5px] font-bold tracking-wide"
        style={{
          background: isNoLock ? "#E4E4E7" : C.primary,
          color: isNoLock ? C.muted : "white",
        }}
      >
        {isNoLock ? "FLEXIBLE" : `${Math.round(q.discountPct * 100)}% OFF`}
      </span>
      <p className="mt-3 text-xl font-bold tracking-tight tabular-nums" style={{ color: active ? C.primary : C.ink }}>
        {q.monthlySavings > 0 ? `₹${inr(q.termSavings)}` : "₹0"}
      </p>
      <p className="text-[11px] mt-1" style={{ color: C.muted }}>
        {q.lockMonths > 0 ? `over 11 months` : "no commitment"}
      </p>
    </button>
  );
}

function prettyDate(d: Date | string): string {
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function formatDayMonth(d: Date | string): string {
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
}
