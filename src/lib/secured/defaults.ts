import type {
  HeroContent,
  CommitmentContent,
  CreditCardContent,
  GettingStartedContent,
  DownloadAppContent,
  FaqItem,
  StatsContent,
  FooterContent,
  TrustContent,
  WhyJoinContent,
  CoverageContent,
  CallbackContent,
} from "./types";

export const HERO_DEFAULTS: HeroContent = {
  headingPrefix: "Earn ",
  headingHighlight: "1% back",
  subheading: "On every timely rent payment",
  description: "Because habits like yours should be rewarded,\nnot overlooked.",
  ctaButtonText: "Download the App",
  ctaDisclaimer: "",
};

export const HERO_LANDLORD_DEFAULTS: HeroContent = {
  headingPrefix: "You ",
  headingHighlight: "get paid",
  subheading: "even after your tenants vacate",
  description: "Protect your rental income from empty months and sudden exits — free of cost.",
  ctaButtonText: "Request a Callback",
  ctaDisclaimer: "",
};

export const TRUST_DEFAULTS: TrustContent = {
  heading: "INR 20+ crores worth of rent processed so far",
  description: "Across most sought-after neighbourhoods of Bengaluru",
  points: [
    "Built by the team behind Flent homes",
    "Used by working professionals across the city",
    "Growing every week",
  ],
};

export const TRUST_LANDLORD_DEFAULTS: TrustContent = {
  heading: "Yet, your rental income is just one event away from disruption",
  description: "Secured is a protection stack built around your rental asset. It starts with vacancy cover today and expands into smarter tools that future-proof your rental income for whatever comes next.",
  points: [],
};

export const COMMITMENT_DEFAULTS: CommitmentContent = {
  subtitle: "Rent is your biggest monthly commitment.",
  heading: "You've handled it responsibly,\nbut it's never really led to anything",
  description: "Secured changes that with a simple cashback today, and ultimately opens doors to renting benefits that you truly deserve.",
  benefitCards: [
    { text: "on timely rental payment", icon: "/assets/dither/icon-cashback.png", iconKey: "cashback", accentText: "1% cashback", tag: "live" },
    { text: "security deposits", icon: "/assets/dither/icon-zero-deposit.png", iconKey: "zero-deposit", accentText: "Zero", tag: "coming-soon" },
    { text: "cash when you move out", icon: "/assets/dither/icon-moveout.png", iconKey: "moveout-cash", accentText: "Get ₹15,000", tag: "live" },
    { text: "upcoming flent homes", icon: "/assets/dither/icon-renter-profile.png", iconKey: "renter-profile", accentText: "First dibs on", tag: "coming-soon" },
    { text: "@ zero service fee", icon: "/assets/dither/icon-better-homes.png", iconKey: "better-homes", accentText: "Home design", tag: "coming-soon" },
  ],
  marqueeText1: "Welcome to the right side of renting",
  marqueeText2: "Because responsibility should feel rewarding",
};

export const COMMITMENT_LANDLORD_DEFAULTS: CommitmentContent = {
  subtitle: "",
  heading: "",
  description: "",
  benefitCards: [
    { text: "vacancy\ncover", icon: "/assets/dither/icon-vacancy-cover.png", iconKey: "vacancy-cover", accentText: "Zero cost" },
    { text: "tenant background\nverification", icon: "/assets/dither/icon-verification.png", iconKey: "verification", accentText: "Zero-cost" },
    { text: "Rental\nIncome", icon: "/assets/dither/icon-growth.png", iconKey: "growth", accentText: "Loan Against" },
    { text: "Damage\nCover", icon: "/assets/dither/icon-tenant-exit.png", iconKey: "tenant-exit", accentText: "Property" },
  ],
  marqueeText1: "High value property needs proper protection",
  marqueeText2: "High value property needs proper protection",
};

export const CREDIT_CARD_DEFAULTS: CreditCardContent = {
  heading: "Yes, you can pay rent\nusing your credit card here",
  subheading: "And yes, you still earn 1% back",
  ctaButtonText: "",
  ctaDisclaimer: "",
  featureCards: [
    { text: "lightning fast payments", icon: "/assets/dither/icon-setup-fast.png", iconKey: "setup-fast", accentText: "One-time setup," },
    { text: "on every rent payment", icon: "/assets/dither/icon-card-points.png", iconKey: "card-points", accentText: "Collect points" },
    { text: "of interest free breathing room", icon: "/assets/dither/icon-breathing-room.png", iconKey: "breathing-room", accentText: "Get upto 45 days" },
    { text: "net effective convenience fee", icon: "/assets/dither/icon-low-fees.png", iconKey: "low-fees", accentText: "Industry low" },
  ],
};

export const CREDIT_CARD_LANDLORD_DEFAULTS: CreditCardContent = {
  heading: "",
  subheading: "",
  ctaButtonText: "",
  ctaDisclaimer: "",
  featureCards: [
    { text: "tenant credit report", icon: "/assets/dither/icon-verification.png", iconKey: "credit-report", accentText: "Complimentary" },
    { text: "one-click signup", icon: "/assets/dither/icon-cashback.png", iconKey: "simple-signup", accentText: "Simple," },
    { text: "zero paperwork", icon: "/assets/dither/icon-growth.png", iconKey: "instant-payouts", accentText: "Instant payouts," },
  ],
};

export const COVERAGE_LANDLORD_DEFAULTS: CoverageContent = {
  heading: "Tenant or Not.\nGet paid on time, every month.",
  subheading: "No questions-asked coverage up to ₹1.5 lakh",
  points: [],
  detailCards: [
    { text: "If the tenant leaves, you can collect one month's rent if the home is vacant for 30 days.", highlight: "collect one month's rent", iconKey: "vacancy-calendar" },
    { text: "If a tenant leaves without notice, you can collect up to one month's rent after adjusting the deposit.", highlight: "up to one month's rent", iconKey: "exit-notice" },
    { text: "Complimentary tenant BGV report", highlight: "Complimentary", iconKey: "bgv-report" },
  ],
};

export const GETTING_STARTED_DEFAULTS: GettingStartedContent = {
  sectionLabel: "How does it work?",
  heading: "Getting started is simple & straightforward",
  steps: [
    {
      number: 1,
      title: "Request your invite",
      description: "Request your invite, Share your address, rent amount, & phone number",
      phone: "/assets/illustrations/how-it-works/screen-1.png",
      connector: "/assets/backgrounds/connector-1.svg",
    },
    {
      number: 2,
      title: "Complete your KYC",
      description: "Complete your KYC, & invite your landlord, We handle the rest",
      phone: "/assets/illustrations/how-it-works/screen-2.png",
      connector: "/assets/backgrounds/connector-2.svg",
    },
    {
      number: 3,
      title: "Landlord accepts",
      description: "Landlord accepts and gets insured. A free ₹1.5 lakh rental cover activates instantly.",
      phone: "/assets/illustrations/how-it-works/screen-3.png",
      connector: "/assets/backgrounds/connector-3.svg",
    },
    {
      number: 4,
      title: "Pay rent as usual",
      description: "Pay rent as usual, earn 1% back, Every timely payment unlocks more rewards.",
      phone: "/assets/illustrations/how-it-works/screen-4.png",
      connector: "/assets/backgrounds/connector-4.svg",
    },
  ],
};

export const GETTING_STARTED_LANDLORD_DEFAULTS: GettingStartedContent = {
  sectionLabel: "How does it work?",
  heading: "Setup in under 5 minutes",
  steps: [
    {
      number: 1,
      title: "Sign up & verify",
      description: "Sign up & verify\nyour tenant's details",
      phone: "",
      connector: "",
    },
    {
      number: 2,
      title: "Pay via Secured",
      description: "Ask tenants to pay\nvia Secured for\nthree consecutive months (atleast)",
      phone: "",
      connector: "",
    },
    {
      number: 3,
      title: "Stay active",
      description: "Ensure continued rent\npayment through Secured\napp for active coverage.",
      phone: "",
      connector: "",
    },
    {
      number: 4,
      title: "Claim if needed",
      description: "Claim directly through the\nSecured app in case of\nvacancy or sudden exits",
      phone: "",
      connector: "",
    },
  ],
};

export const WHY_JOIN_DEFAULTS: WhyJoinContent = {
  problems: [
    "You already pay rent every month",
    "You might be overpaying",
    "You're getting nothing back",
  ],
  solutionHeading: "Secured fixes all three",
  solutions: [],
};

export const WHY_JOIN_LANDLORD_DEFAULTS: WhyJoinContent = {
  problems: [
    "Rental income is unpredictable",
    "Vacancies cost money",
    "Tenant exits are risky",
  ],
  solutionHeading: "Secured gives you a safety net",
  solutions: [],
};

export const DOWNLOAD_APP_DEFAULTS: DownloadAppContent = {
  heading: "Get the Flent app to make renting",
  headingHighlight: "simpler, faster, and stress-free.",
  description: "Scan the QR or tap below to download and get started.",
  appStoreButtonText: "Download on App Store",
  playStoreButtonText: "Coming soon",
};

export const CALLBACK_LANDLORD_DEFAULTS: CallbackContent = {
  heading: "Want to understand how this works for your property?",
  description: "We'll walk you through everything\nNo pressure. No commitments",
  ctaButtonText: "Get a callback",
};

export const FAQ_DEFAULTS: FaqItem[] = [
  { question: "Will my landlord even agree to this?", answer: "Most do, because it gives them something too: a free rental insurance cover of up to ₹1.5 lakh. You just send an invite link; we guide them through the rest." },
  { question: "Is paying rent through Secured… safe?", answer: "Yes. Boringly yes. Payments move through RBI-regulated rails. Everything works exactly as it should, just with rewards attached." },
  { question: "Can I really pay rent using my credit card? Isn’t that banned?", answer: "On most platforms, yes. But Secured processes rent the right way, fully compliant, no disguises, no loopholes. So yes, your card works here. And earns 1% back." },
  { question: "Do I get real cashback? Like… actual money?", answer: "You earn 1% back inside Secured. It isn’t withdrawable, but it does reduce your next month’s rent. Your rent finally helps pay rent :)" },
  { question: "What if my landlord doesn’t respond to the invite?", answer: "We nudge them gently. If needed, we nudge again. If really needed, we show you how to nudge them. It’s teamwork." },
  { question: "Is there any catch for tenants?", answer: "No fees, no lock-ins, no strange clauses. Just pay rent on time & earn 1% back. Your landlord gets their insurance; you get your reward." },
  { question: "What happens to my data?", answer: "Nothing scandalous. No selling, no sharing, no trading. Only used to run your account and keep payments secure." },
  { question: "Why do I need to pay rent for 3 months before the insurance activates?", answer: "Insurance needs a minimum activity window to stay valid. Three months of rent flow = active coverage. (You don’t pay for this. It’s still free for your landlord.)" },
  { question: "What if I change houses later?", answer: "Easy. Update your address → invite your next landlord → continue earning. Your good habits move with you." },
];

export const FAQ_LANDLORD_DEFAULTS: FaqItem[] = [
  { question: "Do I have to pay anything for this cover?", answer: "No. The cover is completely free for landlords. There are no charges, renewals, or hidden fees." },
  { question: "How does my cover activate?", answer: "Once your tenant pays three consecutive months of rent through Secured, your cover becomes active automatically." },
  { question: "What exactly does the cover protect me from?", answer: "Two situations:\nIf your tenant moves out after serving notice and your home stays vacant for 30 days, you get up to one month’s rent.\nIf your tenant leaves without notice, you get up to one month’s rent after the security deposit is adjusted." },
  { question: "What is the maximum amount I can receive?", answer: "You’re covered for up to ₹1.5 lakh of rental income." },
  { question: "How fast is the payout?", answer: "Instant. Once eligibility is met, payouts are processed immediately—no paperwork or follow-ups." },
  { question: "What does signing Flent as a property management company mean?", answer: "It’s a simple onboarding agreement that allows us to administer the protection stack. You retain full control of your property—rent, tenants, decisions. Nothing operational changes for you." },
  { question: "Will my tenant know they are being insured?", answer: "Your tenant sees Secured as a rent payment product with benefits for them. They don’t see insurance documents or claims—they simply pay rent through the app." },
  { question: "What if my tenant doesn’t want to switch to Secured?", answer: "Most tenants prefer Secured because they get 1% cashback and access to a better renting profile. But if they initially hesitate, you can invite them again—they lose nothing by switching." },
  { question: "What if my property rarely stays vacant?", answer: "Great—that means you may never need to claim. But when stakes are high, having a protection layer is better than relying on luck, especially with a property worth crores." },
  { question: "Does Secured intervene in my tenant relationships?", answer: "No. You manage your property exactly as you do today. Secured only handles:\nrent collection\nyour protection layer\npayouts when triggered" },
  { question: "What happens to the insurance if I change tenants?", answer: "Your cover continues. Once the new tenant completes 3 consecutive Secured payments, the protection automatically resets and stays active." },
  { question: "Does this cover damages or unpaid rent?", answer: "Not yet. Those protections are part of the broader protection stack we’re building—coming soon as additional layers." },
  { question: "Can I still collect rent in my bank account?", answer: "Yes. Secured simply facilitates the payment and protection. Funds ultimately settle to your account as usual." },
  { question: "Is my property data safe?", answer: "Yes. We only use the information required to activate and process payouts. No data is sold or shared externally." },
  { question: "Do I need to file paperwork to claim?", answer: "No paperwork. Once the conditions are met (vacancy for 30 days or an abrupt exit), your payout is processed automatically." },
];

export const STATS_DEFAULTS: StatsContent = {
  brandHeading: "Built with care",
  brandSubheading: "Curating India's Top 1% Rental Homes",
  stats: [
    { value: "150", suffix: "+", label: "Apartments in Bangalore" },
    { value: "4.8", separator: "/", suffix: "5", label: "Avg. Rating from Residents" },
    { prefix: "INR ", value: "27", suffix: " Cr", label: "Raised since inception" },
  ],
};

export const FOOTER_DEFAULTS: FooterContent = {
  taglineLine1: "Welcome to the",
  taglineLine2: "right side of renting",
  copyright: "© 2026 Flent. All rights reserved.",
  exploreLabel: "Explore",
  contactLabel: "Contact",
};
