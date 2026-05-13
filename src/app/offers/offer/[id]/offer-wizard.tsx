"use client";

import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/app/offers/_components/ui/button";
import {
  OnboardingTimelineTape,
  useTimelineScrollProgress,
} from "@/app/offers/_components/onboarding-timeline-tape";
import type { Offer } from "@/app/offers/_types/offer";
import {
  ArrowRight,
  Banknote,
  Building2,
  Check,
  ClipboardList,
  FileBadge2,
  FileText,
  Home,
  Key,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type TimelineStep = {
  title: string;
  copy: string;
  draftLink?: {
    label: string;
    href: string;
  };
  icon: LucideIcon;
  bgColor: string;
  /** Calendar days from "today" for the dynamic date label (step 1 uses 0 → "Today"). */
  dayOffsetFromToday: number;
};

const timelineSteps: TimelineStep[] = [
  {
    title: "Fill in your onboarding form.",
    copy: "Share your contact, Aadhaar, PAN, property, and bank details through the onboarding form for us to record.",
    icon: ClipboardList,
    bgColor: "#c8ece8",
    dayOffsetFromToday: 0,
  },
  {
    title: "Token in your bank. Within 24 hours.",
    copy: "Once we receive your form, we transfer 50% of the security deposit to your bank account within 24 hours as a token/confirmation of the partnership.",
    icon: Banknote,
    bgColor: "#ffe2d8",
    dayOffsetFromToday: 1,
  },
  {
    title: "Review and sign your agreement.",
    copy: "Post onboarding, we'll prepare the Authorization Agreement with your details and share it for review. Upon approval, we'll initiate e-stamp and e-signing. The remaining 50% of the deposit is transferred once the agreement is signed.",
    draftLink: {
      label: "View Authorization Agreement Draft",
      href: "https://docs.google.com/document/d/11vcofm8uWhjQ3iq82mHq2jPEW7fuWt9k/edit?usp=sharing&ouid=116516460509675432141&rtpof=true&sd=true",
    },
    icon: FileText,
    bgColor: "#ddd0c7",
    dayOffsetFromToday: 2,
  },
  {
    title: "Hand us the keys. We do the rest.",
    copy: "On the scheduled date, you hand over the apartment keys so our team can conduct a detailed inspection of the apartment and share a checklist of any essential repairs or improvements required before tenant placement.",
    icon: Key,
    bgColor: "#c8ece8",
    dayOffsetFromToday: 5,
  },
  {
    title: "We make your home Flent-ready.",
    copy: "Post inspection and necessary fixes, our design team will stage the home to be tenant-ready before the rent start date.",
    icon: Home,
    bgColor: "#fff3c5",
    dayOffsetFromToday: 7,
  },
  {
    title: "Your verified tenant moves in. Your rent starts.",
    copy: "Once we place verified tenants, Flent will share the tripartite leave and license agreement for your review and signature to complete the rental agreement process. From the agreed rent start date, your monthly rent is paid in advance regardless of tenant placement.",
    draftLink: {
      label: "View Tripartite Agreement Draft",
      href: "https://docs.google.com/document/d/1F90TjIIJcQLKf39m4PABS2krB78hQSELcFr73rVZ8nU/edit?usp=sharing",
    },
    icon: Users,
    bgColor: "#ffe2d8",
    dayOffsetFromToday: 30,
  },
];

const PROPERTY_HEALTH_NOTES = [
  "Maintaining your property in good condition is central to our promise to every Flent partner. From the moment we take over, we ensure it is kept at 100% health, going beyond regular wear and tear.",
  "To uphold this standard and attract good tenants, we conduct a thorough inspection and share a repair checklist, recommending only what's absolutely necessary. These first-time fixes are essential to bring the home up to Flent-ready standards.",
];

type TermInfoId =
  | "property_type"
  | "furnishing_state"
  | "parking"
  | "monthly_rent"
  | "security_deposit"
  | "service_term"
  | "rent_increment"
  | "key_handover_date"
  | "staging_period"
  | "rent_start_date"
  | "maintenance"
  | "notice_period";

const TERM_INFO: Record<TermInfoId, string> = {
  property_type:
    "Your home's details that Flent will manage under this partnership.",
  furnishing_state:
    "How the home is equipped when Flent takes over: unfurnished, partially furnished, or fully furnished.",
  parking:
    "Parking included with your property (covered, open, etc).",
  monthly_rent:
    "Your guaranteed monthly rent payout in your account, every month, no follow-ups needed.",
  security_deposit:
    "The deposit Flent pays upfront to begin. Half is transferred post onboarding, the rest on agreement signing.",
  service_term:
    "The duration of Flent's managed-services commitment for your property.",
  rent_increment:
    "The guaranteed rent increment % applied annually over the service term.",
  key_handover_date:
    "The date Flent takes possession of the keys so inspections and preparation can start.",
  staging_period:
    "The window between key handover and rent start date, when we furnish, stage, and get your home tenant-ready.",
  rent_start_date:
    "The date your monthly rent begins. From here, it hits your account like clockwork.",
  maintenance:
    "Monthly/Quarterly maintenance for the property - a fixed amount or as per actuals, as agreed.",
  notice_period:
    "The time required to end the partnership, so arrangements can be planned.",
};

const TYPEFORM_EMBED_SRC = "https://flent.typeform.com/to/TfSGfvX0";

const CONGRATS_TRUST_SIGNALS = [
  {
    icon: Building2,
    title: "Onboarding Form",
    detail:
      "A short form — your contact, Aadhaar, PAN, and bank details. Simple, secure, and done in minutes.",
    cardBg: "#008E75",
    chipBg: "rgba(200, 236, 232, 0.24)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "rgba(17, 30, 25, 0.2)",
  },
  {
    icon: Users,
    title: "Token Deposit",
    detail:
      "50% transferred to your bank within 24 hours of onboarding. The rest follows once the agreement is signed.",
    cardBg: "#C64747",
    chipBg: "rgba(255, 230, 230, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.17)",
    shadowColor: "rgba(47, 24, 24, 0.2)",
  },
  {
    icon: ShieldCheck,
    title: "Key Handover",
    detail:
      "Give us the keys and we take it from there — inspection, staging, and getting your home Flent-ready.",
    cardBg: "#7F5639",
    chipBg: "rgba(248, 238, 228, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.18)",
    shadowColor: "rgba(40, 29, 20, 0.2)",
  },
] as const;

type TermCategory = "Payments" | "Property Care" | "Exit & Notice" | "Compliance";

type StyledTerm = {
  raw: string;
  title: string;
  description: string;
  category: TermCategory;
  appliesWhen: string;
};

const CATEGORY_CONFIG: Record<
  TermCategory,
  { icon: LucideIcon; accentClass: string; badgeClass: string }
> = {
  Payments: {
    icon: Banknote,
    accentClass: "terms-clause-card--payments",
    badgeClass: "terms-meta-chip--payments",
  },
  "Property Care": {
    icon: Home,
    accentClass: "terms-clause-card--property",
    badgeClass: "terms-meta-chip--property",
  },
  "Exit & Notice": {
    icon: Key,
    accentClass: "terms-clause-card--exit",
    badgeClass: "terms-meta-chip--exit",
  },
  Compliance: {
    icon: FileBadge2,
    accentClass: "terms-clause-card--compliance",
    badgeClass: "terms-meta-chip--compliance",
  },
};

type DefaultClausePreset = Pick<StyledTerm, "title" | "category" | "appliesWhen">;

function normalizeForMatch(input: string): string {
  return input.toLowerCase().replace(/\s+/g, " ").trim();
}

const DEFAULT_CLAUSE_PRESETS: Array<{ signature: string; preset: DefaultClausePreset }> = [
  {
    signature:
      "in the event the landlord gets the necessary recommended repairs, cleaning and/or paintwork done by his own team",
    preset: {
      title: "Setup Completion",
      category: "Property Care",
      appliesWhen: "When landlord-led prep work is completed before handover",
    },
  },
  {
    signature: "flent does not make any structural or civil changes to the apartment",
    preset: {
      title: "Approved Changes Only",
      category: "Compliance",
      appliesWhen: "If structural or civil work is ever required",
    },
  },
  {
    signature: "at the end of the agreement's term, flent will remove its furnishings",
    preset: {
      title: "Handback Promise",
      category: "Exit & Notice",
      appliesWhen: "At agreement completion and apartment handback",
    },
  },
  {
    signature:
      "as scheduled, you'll receive the rental amount monthly in advance, within the first week of the month",
    preset: {
      title: "Assured Rent Payout",
      category: "Payments",
      appliesWhen: "For monthly rental payout timelines",
    },
  },
  {
    signature:
      "after our team inspects your property, a checklist of necessary repairs (if any), along with an estimate, will be shared",
    preset: {
      title: "Home Readiness",
      category: "Property Care",
      appliesWhen: "After inspection and pre-listing preparation",
    },
  },
  {
    signature:
      "flent retains the right to place tenants with no discrimination based on gender, financial background, education, employment history, and religion",
    preset: {
      title: "Tenant Placement",
      category: "Compliance",
      appliesWhen: "During tenant screening and placement decisions",
    },
  },
];

function normalizeTerm(raw: string): StyledTerm {
  const cleaned = raw.replace(/\s+/g, " ").trim();
  const lower = cleaned.toLowerCase();
  const normalized = normalizeForMatch(cleaned);

  const matchedPreset = DEFAULT_CLAUSE_PRESETS.find(({ signature }) =>
    normalized.includes(signature)
  );

  if (matchedPreset) {
    return {
      raw: cleaned,
      title: matchedPreset.preset.title,
      description: cleaned,
      category: matchedPreset.preset.category,
      appliesWhen: matchedPreset.preset.appliesWhen,
    };
  }

  if (/(deposit|rent|payment|refund|charge|penalt|fee)/.test(lower)) {
    return {
      raw: cleaned,
      title: "Payment Safeguard",
      description: cleaned,
      category: "Payments",
      appliesWhen: "When transfers or settlement timelines apply",
    };
  }

  if (/(repair|maintenance|damage|inspection|condition|staging|furnish)/.test(lower)) {
    return {
      raw: cleaned,
      title: "Property Standards",
      description: cleaned,
      category: "Property Care",
      appliesWhen: "During home preparation and managed tenancy",
    };
  }

  if (/(notice|terminate|termination|exit|vacat|lock[\s-]?in|renewal)/.test(lower)) {
    return {
      raw: cleaned,
      title: "Exit Protocol",
      description: cleaned,
      category: "Exit & Notice",
      appliesWhen: "If either side plans to end or change terms",
    };
  }

  return {
    raw: cleaned,
    title: "Compliance Clause",
    description: cleaned,
    category: "Compliance",
    appliesWhen: "Across the duration of your agreement",
  };
}

const slideVariants = {
  enter: (_direction: number) => ({
    x: 30,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (_direction: number) => ({
    x: -30,
    opacity: 0,
  }),
};

const OFFER_EXPIRY_WINDOW_MS = 48 * 60 * 60 * 1000;

function formatMaintenance(s: string): string {
  const t = s.trim();
  if (!t) return "—";
  if (t === "As per actuals") return t;
  const n = Number(t);
  if (Number.isFinite(n)) return formatCurrency(n);
  return t;
}

function formatDate(s: string): string {
  if (!s) return s;
  if (s === "To be decided") return s;
  try {
    return new Date(s).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return s;
  }
}

function addCalendarDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatShortMonthDay(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatOnboardingStepDateLabel(dayOffsetFromToday: number, today: Date): string {
  const targetDate =
    dayOffsetFromToday === 0 ? today : addCalendarDays(today, dayOffsetFromToday);
  const short = formatShortMonthDay(targetDate);
  if (dayOffsetFromToday === 0) {
    return `Today (${short})`;
  }
  return `Day ${dayOffsetFromToday} (${short})`;
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function getOfferExpiryTime(createdAt: string): number | null {
  const createdAtMs = Date.parse(createdAt);
  if (!Number.isFinite(createdAtMs)) return null;
  return createdAtMs + OFFER_EXPIRY_WINDOW_MS;
}

function formatExpiryCountdown(msRemaining: number): string {
  const safeMs = Math.max(0, msRemaining);
  const totalSeconds = Math.floor(safeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

export function OfferWizard({ offer }: { offer: Offer }) {
  const [hasAgreed, setHasAgreed] = useState(offer.agreed);
  const [step, setStep] = useState(() => (offer.agreed ? 4 : 1));
  const [direction, setDirection] = useState(0);
  const [agreeLoading, setAgreeLoading] = useState(false);
  const [agreeError, setAgreeError] = useState<string | null>(null);
  const [activeInfoId, setActiveInfoId] = useState<TermInfoId | null>(null);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const [expandedTimelineIndex, setExpandedTimelineIndex] = useState<number | null>(
    null,
  );
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [onboardingToday, setOnboardingToday] = useState(() => new Date());
  const reduceMotion = useReducedMotion();
  const timelineScrollScopeRef = useRef<HTMLDivElement>(null);
  const timelineScrollProgress = useTimelineScrollProgress(
    timelineScrollScopeRef,
    step === 3,
    reduceMotion,
  );

  useEffect(() => {
    const sync = () => setOnboardingToday(new Date());
    const id = setInterval(sync, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (hasAgreed) return;
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, [hasAgreed]);

  const flowSteps = [
    { id: 1, label: "Introduction" },
    { id: 2, label: "Commercials" },
    { id: 3, label: "Terms & Conditions" },
  ] as const;

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  };

  const goToStep = (target: number) => {
    if (target === 4 && !hasAgreed) return;
    if (target < 1 || target > 4) return;
    if (target === step) return;
    setDirection(target > step ? 1 : -1);
    setStep(target);
  };

  const offerExpiresAtMs = getOfferExpiryTime(offer.created_at);
  const remainingMs = offerExpiresAtMs == null ? null : offerExpiresAtMs - nowMs;
  const isExpired = !hasAgreed && remainingMs != null && remainingMs <= 0;
  const expiryCountdown =
    remainingMs != null ? formatExpiryCountdown(remainingMs) : null;

  const handleAgree = async () => {
    if (isExpired) {
      setAgreeError("This offer has expired and can no longer be accepted.");
      return;
    }

    setAgreeError(null);
    setAgreeLoading(true);
    try {
      const res = await fetch("/offers/api/agree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId: offer.id }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        expired?: boolean;
        error?: string;
      };
      if (!res.ok || !data.success) {
        if (data.expired) {
          setNowMs(Date.now());
          setAgreeError("This offer has expired and can no longer be accepted.");
          return;
        }
        setAgreeError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setHasAgreed(true);
      setDirection(1);
      setStep(4);
    } catch {
      setAgreeError("Something went wrong. Please try again.");
    } finally {
      setAgreeLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    // Used to switch behavior: hover on desktop, tap-toggle on touch devices.
    const mq = window.matchMedia?.("(pointer: coarse)");
    if (!mq) return;

    const update = () => setIsCoarsePointer(!!mq.matches);
    update();

    // Safari uses addListener/removeListener; others support addEventListener.
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }

    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  useEffect(() => {
    // Prevent tooltip state leaking across steps.
    if (step !== 2) setActiveInfoId(null);
  }, [step]);

  const showStepper = step < 4 && !isExpired;
  const normalizedTerms = (offer.selected_terms ?? []).map(normalizeTerm);

  if (isExpired) {
    return (
      <div className="min-h-screen bg-flent-off-white">
        <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4 py-12 md:px-8">
          <motion.section
            key="offer-expired"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full rounded-[2rem] border border-flent-pastel-brown/60 bg-white px-6 py-10 text-center shadow-[0_16px_44px_rgba(47,34,21,0.12)] md:px-10 md:py-12"
          >
            <img src="/flent-logo-black.png" alt="Flent" className="mx-auto h-10 w-auto" />
            <p className="mt-7 text-[0.82rem] font-bold uppercase tracking-[0.14em] text-flent-brown">
              OFFER EXPIRED
            </p>
            <h1 className="headline-display mt-3 text-[2rem] font-medium text-flent-black md:text-[2.5rem]">
              This offer is no longer active.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[1rem] font-medium text-flent-black/75">
              This offer was valid for 48 hours from creation and can no longer be
              accepted. Please connect with the Flent team to get a refreshed offer.
            </p>
          </motion.section>
        </main>
      </div>
    );
  }

  return (
    <div
      className={
        step === 4 ? "min-h-screen bg-flent-welcome-bg" : "min-h-screen bg-flent-off-white"
      }
    >
      <main
        className={`mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-24 md:px-8 ${
          step === 4 ? "pt-16 md:pt-24" : "pt-10"
        }`}
      >
        {/* Top stepper — hidden on Step 4 */}
        {showStepper && (
          <div className="sticky top-0 z-30 -mx-4 mb-8 overflow-x-hidden border-b border-flent-pastel-brown/80 bg-flent-off-white/95 backdrop-blur-sm md:-mx-8 md:overflow-x-visible">
            <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3 md:gap-3 md:px-8">
              {flowSteps.map((item, index) => {
                const stepNumber = item.id;
                const isCompleted = stepNumber < step;
                const isActive = stepNumber === step;
                const isUpcoming = stepNumber > step;

                const circleStateClass = isActive
                    ? "offer-step-circle--active"
                    : isCompleted
                      ? "offer-step-circle--completed"
                      : "offer-step-circle--upcoming";

                const circleClasses = [
                  "offer-step-circle",
                  "flex h-7 w-7 items-center justify-center rounded-full border text-[0.7rem] font-bold tracking-tight transition-colors md:h-8 md:w-8",
                  circleStateClass,
                ].join(" ");

                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      goToStep(stepNumber);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        goToStep(stepNumber);
                      }
                    }}
                    className={[
                      "group flex min-w-0 flex-1 items-center gap-2 last:flex-[0.9] md:gap-3 md:min-w-auto",
                      "cursor-pointer",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div
                        className={circleClasses}
                        aria-current={isActive ? "step" : undefined}
                      >
                        {isCompleted ? (
                          <Check className="h-3 w-3 text-[#008E75] md:h-3.5 md:w-3.5" />
                        ) : (
                          <span>{stepNumber}</span>
                        )}
                      </div>
                      <div className="flex min-w-0 flex-col md:min-w-auto">
                        <span
                          className={[
                            "block w-full truncate text-[0.66rem] font-semibold uppercase tracking-[0.13em] md:inline md:w-auto md:overflow-visible md:whitespace-normal md:break-words md:text-[0.75rem]",
                            isActive || isCompleted
                              ? "text-flent-black"
                              : "text-flent-brown/60",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {item.label}
                        </span>
                      </div>
                    </div>
                    {index < flowSteps.length - 1 && (
                      <div
                        className={[
                          "hidden h-1 flex-1 rounded-full md:block",
                          isCompleted && "bg-[#008E75]",
                          !isCompleted &&
                            isActive &&
                            "bg-gradient-to-r from-[#008E75] via-[#008E75] to-flent-pastel-brown",
                          isUpcoming && !isActive && "bg-flent-pastel-brown/70",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        aria-hidden
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.section
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
              className="relative flex min-h-[80vh] flex-col"
            >
              <motion.header
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src="/flent-logo-black.png"
                    alt="Flent"
                    className="h-9 w-auto"
                  />
                  <span className="eyebrow-pill bg-flent-forest text-flent-yellow">
                    <span className="text-[1rem] md:text-[1.2rem]"></span>
                  </span>
                </div>
              </motion.header>

              <div className="relative mt-12 grid flex-1 items-center gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <motion.div
                  className="space-y-6"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: { staggerChildren: 0.12 },
                    },
                  }}
                >
                  <motion.h1
                    className="headline-display text-4xl font-medium text-flent-black md:text-6xl lg:text-[3.8rem] lg:leading-[1.05]"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    Your Property,{" "}
                    <span
                      className="headline-italic font-medium"
                      style={{ color: "#7F5639" }}
                    >
                      Professionally Managed.
                    </span>
                  </motion.h1>

                  <motion.p
                    className="max-w-xl text-[1.15rem] font-medium text-flent-black/80"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    Hello{" "}
                    <span
                      className="font-extrabold text-[1.25rem]"
                      style={{ color: "#7F5639" }}
                    >
                      {offer.landlord_name}
                    </span>
                    !
                  </motion.p>

                  <motion.p
                    className="max-w-xl text-[1.05rem] font-medium text-flent-black/80"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    Thank you for considering a partnership with Flent for your
                    property at{" "}
                    <span
                      className="font-extrabold text-[1.12rem]"
                      style={{ color: "#7F5639" }}
                    >
                      {offer.property_name}
                    </span>
                    .
                  </motion.p>

                  <motion.p
                    className="max-w-xl text-[1.05rem] font-medium text-flent-black/80"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    The following page outlines the key commercial terms, timelines, and
                    next steps to transform your apartment into a fully managed Flent
                    home.
                  </motion.p>

                  <motion.div
                    className="pt-4"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      type="button"
                      onClick={goNext}
                      className="cta-button cta-button--lg"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <div className="doorframe w-[320px] overflow-hidden md:w-[420px]">
                    <Image
                      src="/offer-intro-hero-original.png"
                      alt="Flent furnished living room"
                      width={757}
                      height={1024}
                      sizes="(min-width: 768px) 420px, 320px"
                      quality={100}
                      className="h-auto w-full"
                      priority
                    />
                  </div>
                </motion.div>
              </div>
            </motion.section>
          )}

          {step === 2 && (
            <motion.section
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
              className="mt-4"
            >
              <div className="doorframe-wide bg-white/95 px-6 py-9 shadow-sm md:px-10 md:py-12">
                <div className="mb-7 flex justify-center">
                  <img
                    src="/flent-logo-black.png"
                    alt="Flent"
                    className="h-10 w-auto"
                  />
                </div>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <span className="eyebrow-pill bg-flent-forest text-flent-black">
                    <span className="text-[1rem] md:text-[1.2rem]">
                      YOUR PERSONALIZED OFFER
                    </span>
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <h2 className="headline-display text-[2.1rem] font-medium text-flent-black md:text-[2.7rem]">
                    Here's what,
                    <span className="headline-italic" style={{ color: "#7F5639" }}>
                      we have put together for you
                    </span>.
                  </h2>
                  <p className="max-w-2xl text-[0.98rem] font-medium text-flent-black/80">
                    A great partnership starts with clarity. These are the terms we&apos;ve
                    put together for your property. 100% transparency. Always.
                  </p>
                </div>

                <motion.div
                  className="mt-8 grid gap-4 md:grid-cols-2"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.06 } },
                  }}
                >
                  <FieldCard
                    label="Property type"
                    value={offer.property_type}
                    infoId="property_type"
                    activeInfoId={activeInfoId}
                    setActiveInfoId={setActiveInfoId}
                    isCoarsePointer={isCoarsePointer}
                    valueBold={false}
                  />
                  <FieldCard
                    label="Furnishing state"
                    value={offer.furnishing_state}
                    infoId="furnishing_state"
                    activeInfoId={activeInfoId}
                    setActiveInfoId={setActiveInfoId}
                    isCoarsePointer={isCoarsePointer}
                    valueBold={false}
                  />
                  <FieldCard
                    label="Parking"
                    value={offer.parking}
                    infoId="parking"
                    activeInfoId={activeInfoId}
                    setActiveInfoId={setActiveInfoId}
                    isCoarsePointer={isCoarsePointer}
                    valueBold={false}
                  />
                  <FieldCard
                    label="Monthly rent"
                    value={formatCurrency(offer.rent_amount)}
                    highlight
                    infoId="monthly_rent"
                    activeInfoId={activeInfoId}
                    setActiveInfoId={setActiveInfoId}
                    isCoarsePointer={isCoarsePointer}
                    valueBold={false}
                  />
                  <FieldCard
                    label="Security deposit"
                    value={formatCurrency(offer.security_deposit)}
                    infoId="security_deposit"
                    activeInfoId={activeInfoId}
                    setActiveInfoId={setActiveInfoId}
                    isCoarsePointer={isCoarsePointer}
                    valueBold={false}
                  />
                  <FieldCard
                    label="Maintenance"
                    value={formatMaintenance(offer.maintenance)}
                    infoId="maintenance"
                    activeInfoId={activeInfoId}
                    setActiveInfoId={setActiveInfoId}
                    isCoarsePointer={isCoarsePointer}
                    valueBold={false}
                  />
                  {offer.partnership_association_bonus_amount != null &&
                    Number.isFinite(offer.partnership_association_bonus_amount) && (
                      <FieldCard
                        label="Partnership Association Bonus"
                        value={formatCurrency(offer.partnership_association_bonus_amount)}
                        activeInfoId={activeInfoId}
                        setActiveInfoId={setActiveInfoId}
                        isCoarsePointer={isCoarsePointer}
                        valueBold={false}
                      />
                    )}
                  <FieldCard
                    label="Service term"
                    value={offer.service_term}
                    infoId="service_term"
                    activeInfoId={activeInfoId}
                    setActiveInfoId={setActiveInfoId}
                    isCoarsePointer={isCoarsePointer}
                    valueBold={false}
                  />
                  <FieldCard
                    label="Guaranteed Rent Increment"
                    value={offer.rent_increment}
                    infoId="rent_increment"
                    activeInfoId={activeInfoId}
                    setActiveInfoId={setActiveInfoId}
                    isCoarsePointer={isCoarsePointer}
                    valueBold={false}
                  />
                  <FieldCard
                    label="Key handover date"
                    value={formatDate(offer.key_handover_date)}
                    infoId="key_handover_date"
                    activeInfoId={activeInfoId}
                    setActiveInfoId={setActiveInfoId}
                    isCoarsePointer={isCoarsePointer}
                    valueBold={false}
                  />
                  <FieldCard
                    label="Staging Period"
                    value={offer.rent_free_period}
                    infoId="staging_period"
                    activeInfoId={activeInfoId}
                    setActiveInfoId={setActiveInfoId}
                    isCoarsePointer={isCoarsePointer}
                    valueBold={false}
                  />
                  <FieldCard
                    label="Rent start date"
                    value={formatDate(offer.rent_start_date)}
                    infoId="rent_start_date"
                    activeInfoId={activeInfoId}
                    setActiveInfoId={setActiveInfoId}
                    isCoarsePointer={isCoarsePointer}
                    valueBold={false}
                  />
                  <FieldCard
                    label="Notice period"
                    value={offer.notice_period}
                    infoId="notice_period"
                    activeInfoId={activeInfoId}
                    setActiveInfoId={setActiveInfoId}
                    isCoarsePointer={isCoarsePointer}
                    valueBold={false}
                  />
                </motion.div>

                <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="sm:order-1 sm:self-start"
                  >
                    <Button
                      type="button"
                      size="lg"
                      onClick={() => goToStep(1)}
                      variant="outline"
                      className="w-full border-flent-pastel-brown bg-flent-off-white px-6 py-3 text-sm font-semibold text-flent-brown hover:border-flent-brown hover:bg-flent-pastel-brown/40 sm:w-auto"
                    >
                      Back
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.2 }}
                    className="sm:order-2 sm:ml-auto"
                  >
                    <button
                      type="button"
                      onClick={goNext}
                      className="cta-button w-full sm:w-auto"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.section>
          )}

          {step === 3 && (
            <motion.section
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
              className="mt-6 space-y-16"
            >
              <div className="flex justify-center">
                <img
                  src="/flent-logo-black.png"
                  alt="Flent"
                  className="mb-4 h-10 w-auto"
                />
              </div>
              {/* Timeline */}
              <section>
                <div>
                  <span className="mb-16 block text-[1rem] font-bold uppercase tracking-[0.1em] text-flent-black md:text-[1.2rem]">
                    YOUR ONBOARDING JOURNEY
                  </span>
                  <h2 className="headline-display text-[2.1rem] font-medium text-flent-black md:text-[2.7rem]">
                    From{" "}
                    <span className="headline-italic" style={{ color: "#7F5639" }}>
                      handshake
                    </span>{" "}
                    <span className="headline-italic" style={{ color: "#7F5639" }}>
                      to home.
                    </span>
                  </h2>
                </div>
                <div className="mt-8">
                  <div ref={timelineScrollScopeRef} className="relative pl-12 md:pl-14">
                    <div
                      className="pointer-events-none absolute left-4 top-0 bottom-0 w-3 md:left-6"
                      aria-hidden
                    >
                      <OnboardingTimelineTape progress={timelineScrollProgress} />
                    </div>
                    <ul className="space-y-10">
                      {timelineSteps.map((item, index) => {
                        const Icon = item.icon;
                        const isExpanded = expandedTimelineIndex === index;
                        const panelId = `onboarding-step-${index}-panel`;
                        return (
                          <motion.li
                            key={item.title}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{
                              duration: 0.4,
                              delay: index * 0.08,
                              ease: [0.25, 0.1, 0.25, 1] as const,
                            }}
                            whileHover={{ y: -4 }}
                            className="relative"
                          >
                            <p
                              className="headline-display mb-3 text-[1.6rem] font-medium text-flent-black md:text-[1.9rem]"
                              aria-live="polite"
                            >
                              {formatOnboardingStepDateLabel(
                                item.dayOffsetFromToday,
                                onboardingToday,
                              )}
                            </p>
                            <div
                              className="rounded-2xl border-2 border-flent-black p-5 shadow-[4px_4px_0_0_#111] transition-[box-shadow,transform] hover:shadow-[6px_6px_0_0_#111] md:p-6"
                              style={{ backgroundColor: item.bgColor }}
                            >
                              <button
                                type="button"
                                id={`onboarding-step-${index}-trigger`}
                                aria-expanded={isExpanded}
                                aria-controls={panelId}
                                onClick={() =>
                                  setExpandedTimelineIndex((prev) =>
                                    prev === index ? null : index,
                                  )
                                }
                                className="flex w-full cursor-pointer gap-4 text-left md:gap-5"
                              >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-flent-brown/20 bg-white md:h-12 md:w-12">
                                  <Icon
                                    className="h-5 w-5 text-flent-forest md:h-6 md:w-6"
                                    strokeWidth={2}
                                    aria-hidden
                                  />
                                </div>
                                <div className="min-w-0 flex-1 space-y-2">
                                  <p className="text-[0.85rem] md:text-[0.95rem] font-bold tracking-[0.16em] text-flent-forest">
                                    STEP {index + 1}
                                  </p>
                                  <h3 className="headline-display text-[1.45rem] font-normal text-flent-black md:text-[1.7rem]">
                                    {item.title}
                                  </h3>
                                </div>
                                <ChevronDown
                                  className={`mt-1 h-5 w-5 shrink-0 text-flent-forest transition-transform duration-200 md:h-6 md:w-6 ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
                                  strokeWidth={2}
                                  aria-hidden
                                />
                              </button>
                              <AnimatePresence initial={false}>
                                {isExpanded && (
                                  <motion.div
                                    id={panelId}
                                    role="region"
                                    aria-labelledby={`onboarding-step-${index}-trigger`}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{
                                      duration: 0.25,
                                      ease: [0.25, 0.1, 0.25, 1] as const,
                                    }}
                                    className="overflow-hidden"
                                  >
                                    <p className="mt-4 max-w-3xl border-t border-flent-black/10 pt-4 text-[1rem] font-medium text-flent-black/80 ml-[3.75rem]">
                                      {item.copy}
                                    </p>
                                    {item.draftLink ? (
                                      <a
                                        href={item.draftLink.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-[3.75rem] mt-3 inline-flex w-fit items-center rounded-full border border-flent-black/10 bg-white px-4 py-2 text-sm font-semibold text-flent-forest shadow-sm transition-colors hover:bg-white/90"
                                      >
                                        {item.draftLink.label} →
                                      </a>
                                    ) : null}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Terms & conditions */}
              <section className="terms-digest-panel mx-[-1.5rem] rounded-3xl px-6 py-10 text-flent-black md:mx-0 md:px-10">
                <div className="space-y-4">
                  <span className="text-[0.85rem] font-bold uppercase tracking-[0.1em] text-flent-black">
                    OTHER TERMS & CONDITIONS
                  </span>
                  <h2 className="headline-display text-[2.2rem] font-medium md:text-[2.5rem] text-flent-black">
                    Important terms,{" "}
                    <span className="headline-italic" style={{ color: "#7F5639" }}>
                      clearly explained.
                    </span>
                  </h2>
                  <p className="max-w-3xl text-[0.98rem] font-medium text-flent-brown">
                    These additional clauses protect both your property and your rental
                    income, and are reflected in the final authorization agreement.
                  </p>
                </div>

                <div className="terms-summary-band mt-6">
                  <div className="flex items-center gap-2 text-flent-forest">
                    <ShieldCheck className="h-4 w-4" />
                    <p className="text-sm font-semibold">
                      You&apos;re protected by clearly documented clauses.
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="terms-meta-chip">
                      {normalizedTerms.length} Additional Clauses
                    </span>
                    <span className="terms-meta-chip">Reviewed by Partner Ops</span>
                    <span className="terms-meta-chip">Included before e-sign</span>
                  </div>
                </div>

                <div className="mt-6">
                  <ul className="space-y-4">
                    {normalizedTerms.length ? (
                      normalizedTerms.map((term, index) => {
                        const clauseNumber = index + 1;
                        const config = CATEGORY_CONFIG[term.category];
                        const Icon = config.icon;
                        return (
                        <motion.li
                          key={`${term.raw}-${index}`}
                          className={`terms-clause-card ${config.accentClass}`}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.2 }}
                          transition={{
                            duration: 0.35,
                            delay: index * 0.05,
                            ease: [0.25, 0.1, 0.25, 1] as const,
                          }}
                          whileHover={{ y: -2 }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <div className="terms-clause-icon-shell">
                                <Icon className="h-4 w-4 text-flent-forest" />
                              </div>
                              <p className="text-[0.76rem] font-bold uppercase tracking-[0.16em] text-flent-brown">
                                Clause {String(clauseNumber).padStart(2, "0")}
                              </p>
                            </div>
                            <span className={`terms-meta-chip ${config.badgeClass}`}>
                              {term.category}
                            </span>
                          </div>
                          <h3
                            className="mt-4 headline-display text-[1.45rem] font-medium md:text-[1.7rem]"
                            style={{ color: "#008E75" }}
                          >
                            {term.title}
                          </h3>
                          <p className="mt-2 text-[0.98rem] font-medium leading-relaxed text-flent-black/80">
                            {term.description}
                          </p>
                          <p className="mt-4 text-[0.82rem] font-semibold text-flent-black/70">
                            Applies when:{" "}
                            <span className="font-medium italic text-flent-brown">
                              {term.appliesWhen}
                            </span>
                          </p>
                        </motion.li>
                      );
                    })
                    ) : (
                      <li className="terms-empty-state text-sm text-flent-brown">
                        No additional clauses are currently attached to this offer.
                      </li>
                    )}
                  </ul>
                </div>

                <div className="terms-trust-footer mt-6">
                  <p className="text-[0.9rem] font-medium text-flent-brown">
                    These clauses are visible in your agreement before e-signing and are
                    included to ensure clear expectations for both parties.
                  </p>
                </div>
              </section>

              {/* Property health note & Agree */}
              <section className="space-y-10">
                <div className="relative overflow-hidden rounded-3xl bg-flent-forest px-6 py-10 md:px-10">
                  <div className="pointer-events-none absolute inset-y-4 right-[-60px] hidden w-[260px] border border-white/20 opacity-40 md:block doorframe" />
                  <div className="relative space-y-4">
                    <span className="text-[0.85rem] font-bold uppercase tracking-[0.1em] text-flent-black">
                      A QUICK NOTE
                    </span>
                    <h2 className="headline-display text-[2.2rem] font-medium md:text-[2.5rem] text-flent-black">
                      Maintaining your property{" "}
                      <span className="headline-italic" style={{ color: "#7F5639" }}>
                        at its best.
                      </span>
                    </h2>
                    <div className="max-w-3xl space-y-4 text-[0.98rem] font-medium text-flent-black">
                      {PROPERTY_HEALTH_NOTES.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="sm:order-1 sm:self-start"
                  >
                    <Button
                      type="button"
                      size="lg"
                      onClick={() => goToStep(2)}
                      variant="outline"
                      className="w-full border-flent-pastel-brown bg-flent-off-white px-8 py-3.5 text-base font-semibold text-flent-brown hover:border-flent-brown hover:bg-flent-pastel-brown/40 sm:w-auto"
                    >
                      Back to Commercials
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: agreeLoading ? 1 : 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="flex w-full flex-col items-stretch gap-2 sm:order-2 sm:ml-auto sm:w-auto sm:items-end"
                  >
                    {expiryCountdown ? (
                      <p className="inline-flex w-full min-w-[260px] items-center justify-center gap-2 rounded-full border border-[#4a3527] bg-[#1b1613] px-5 py-2.5 text-[1.05rem] font-semibold text-[#f6dfcf] sm:w-auto">
                        <span className="h-2 w-2 rounded-full bg-[#f2654a]" aria-hidden />
                        Expires in {expiryCountdown}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      onClick={handleAgree}
                      disabled={agreeLoading}
                      className="cta-button cta-button--lg w-full min-w-[260px] sm:w-auto"
                    >
                      {agreeLoading ? "Agreeing…" : "Agree"}
                      {!agreeLoading && <ArrowRight className="h-5 w-5" />}
                    </button>
                    {agreeError ? (
                      <p className="text-center text-sm font-medium text-red-700 sm:text-right">
                        {agreeError}
                      </p>
                    ) : null}
                  </motion.div>
                </div>
              </section>
            </motion.section>
          )}

          {step === 4 && (
            <motion.section
              key="step4"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
              className="flex min-h-[70vh] flex-col items-center justify-center pb-8 pt-4 text-center md:min-h-[65vh]"
            >
              <motion.div
                className="relative flex w-full max-w-4xl flex-col items-center gap-7 rounded-[2rem] border border-flent-pastel-brown/30 bg-white/80 px-6 py-8 shadow-[0_16px_48px_rgba(47,34,21,0.12)] backdrop-blur-[1px] md:gap-8 md:px-10 md:py-10"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <motion.div
                  className="pointer-events-none absolute left-3 top-6 hidden md:block"
                  animate={
                    reduceMotion
                      ? {}
                      : {
                          y: [0, -6, 0],
                          rotate: [0, -8, 0],
                          opacity: [0.7, 1, 0.7],
                        }
                  }
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
                  }
                >
                  <Sparkles className="h-7 w-7 text-flent-forest/70" />
                </motion.div>
                <motion.div
                  className="pointer-events-none absolute right-3 top-6 hidden md:block"
                  animate={
                    reduceMotion
                      ? {}
                      : {
                          y: [0, -6, 0],
                          rotate: [0, 8, 0],
                          opacity: [0.7, 1, 0.7],
                        }
                  }
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : {
                          duration: 2.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.4,
                        }
                  }
                >
                  <Sparkles className="h-7 w-7 text-flent-brown/70" />
                </motion.div>

                <motion.img
                  src="/flent-logo-black.png"
                  alt="Flent"
                  className="h-10 w-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.08 }}
                />

                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.12 }}
                >
                  <h1
                    className="headline-display text-4xl font-medium leading-tight tracking-tight md:text-5xl"
                    style={{ color: "#008E75" }}
                  >
                    Congratulations! 🎉
                  </h1>
                  <p className="headline-display text-[1.6rem] font-medium leading-tight text-flent-black md:text-[2rem]">
                    Welcome to the world of <span className="italic">Flenting</span>,{" "}
                    <span style={{ color: "#7F5639" }}>{offer.landlord_name}</span>!
                  </p>
                </motion.div>

                <motion.p
                  className="max-w-3xl text-[1.03rem] font-medium leading-relaxed text-flent-black/85 md:text-[1.08rem]"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.2 }}
                >
                  <span className="block">
                    <span className="font-bold" style={{ color: "#7F5639" }}>
                      {offer.property_name}
                    </span>{" "}
                    is now part of something bigger.
                  </span>
                  <span className="mt-1 block">
                    You&apos;re joining{" "}
                    <span className="font-bold italic" style={{ color: "#7F5639" }}>
                      182+ homeowners across Bengaluru
                    </span>{" "}
                    who trust Flent to manage their properties and collect rent without a
                    single follow-up call.
                  </span>
                </motion.p>

                <motion.div
                  className="flex w-full flex-col gap-4"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.28 }}
                >
                  <h2 className="headline-display whitespace-nowrap text-center text-[10px] font-medium text-flent-forest" style={{ transform: "scale(0.6)", transformOrigin: "center" }}>
                    What Happens Next?
                  </h2>
                  <div className="grid w-full gap-3 md:grid-cols-3">
                  {CONGRATS_TRUST_SIGNALS.map((signal, index) => {
                    const Icon = signal.icon;
                    return (
                      <motion.article
                        key={signal.title}
                        className="min-h-[236px] rounded-[19px] border p-[1.125rem] text-left md:min-h-[256px] md:p-5"
                        style={{
                          backgroundColor: signal.cardBg,
                          borderColor: signal.borderColor,
                          boxShadow: `0 10px 24px ${signal.shadowColor}`,
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.34 + index * 0.08 }}
                        whileHover={
                          reduceMotion
                            ? undefined
                            : {
                                y: -7,
                                scale: 1.015,
                                transition: { duration: 0.36, ease: "easeOut" },
                              }
                        }
                        whileTap={reduceMotion ? undefined : { scale: 0.995 }}
                      >
                        <div
                          className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-[10px]"
                          style={{ backgroundColor: signal.chipBg }}
                        >
                          <Icon className="h-3.5 w-3.5 text-white" />
                        </div>
                        <p className="max-w-[18ch] text-[1.05rem] font-semibold leading-[1.1] tracking-[-0.01em] text-white md:text-[1.42rem]">
                          {signal.title}
                        </p>
                        <p className="mt-3 max-w-[28ch] text-[0.85rem] font-medium leading-[1.42] text-[#F5F4F0]">
                          {signal.detail}
                        </p>
                      </motion.article>
                    );
                  })}
                  </div>
                </motion.div>

                <motion.p
                  className="max-w-xl text-center text-sm font-medium italic text-flent-black/85 md:text-[0.95rem]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.45 }}
                >
                  You made a great call. Now let&apos;s get started.
                </motion.p>

                <motion.div
                  className="flex w-full max-w-md flex-col items-center"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.5 }}
                >
                  <button
                    type="button"
                    className="cta-button cta-button--lg inline-flex w-full justify-center sm:w-auto"
                    onClick={() => {
                      document
                        .getElementById("onboarding-typeform-embed")
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    Complete Onboarding Form
                    <ChevronDown className="h-5 w-5" />
                  </button>
                  <p className="mt-4 text-center text-sm font-medium italic text-flent-black/75">
                    Most landlords finish this in under 4 minutes.
                  </p>
                </motion.div>

                <div
                  id="onboarding-typeform-embed"
                  className="mt-8 w-full max-w-3xl scroll-mt-6"
                >
                  <iframe
                    title="Onboarding form"
                    src={TYPEFORM_EMBED_SRC}
                    className="block h-[min(92vh,1200px)] w-full rounded-2xl border border-flent-pastel-brown/25 bg-white"
                    allow="fullscreen; microphone; camera; payment"
                  />
                </div>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

type FieldCardProps = {
  label: string;
  value: string;
  highlight?: boolean;
  valueBold?: boolean;
  infoId?: TermInfoId;
  activeInfoId: TermInfoId | null;
  setActiveInfoId: Dispatch<SetStateAction<TermInfoId | null>>;
  isCoarsePointer: boolean;
};

function FieldCard({
  label,
  value,
  highlight,
  valueBold,
  infoId,
  activeInfoId,
  setActiveInfoId,
  isCoarsePointer,
}: FieldCardProps) {
  const isOpen = !!infoId && activeInfoId === infoId;

  return (
    <motion.div
      className={`rounded-2xl p-6 transition-colors ${
        highlight
          ? "bg-flent-forest text-flent-black"
          : "bg-flent-off-white text-flent-black"
      }`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className="text-[0.85rem] font-bold tracking-[0.16em] md:text-[0.95rem]"
          style={{ color: "#7F5639" }}
        >
          {label.toUpperCase()}
        </p>
        {infoId ? (
          <div
            className="relative"
            onMouseEnter={() => {
              if (isCoarsePointer) return;
              setActiveInfoId(infoId);
            }}
            onMouseLeave={() => {
              if (isCoarsePointer) return;
              setActiveInfoId((prev) => (prev === infoId ? null : prev));
            }}
          >
            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center rounded-full border border-flent-pastel-brown bg-flent-off-white/60 text-[0.9rem] font-bold text-flent-brown/70 transition-colors hover:bg-flent-off-white"
              onClick={() => {
                if (!isCoarsePointer) return;
                setActiveInfoId((prev) => (prev === infoId ? null : infoId));
              }}
              aria-label={`Info about ${label}`}
              aria-expanded={isOpen}
              aria-controls={`term-info-${infoId}`}
            >
              i
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  id={`term-info-${infoId}`}
                  role="tooltip"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-10 mt-2 w-72 rounded-xl border border-flent-pastel-brown bg-white p-3 text-[0.82rem] font-medium leading-relaxed text-flent-black/80 shadow-sm"
                >
                  {TERM_INFO[infoId]}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : null}
      </div>
      <p
        className={`mt-3 text-[1.4rem] ${
          valueBold === false ? "font-medium" : "font-bold"
        }`}
      >
        {value}
      </p>
    </motion.div>
  );
}
