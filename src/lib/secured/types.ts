// Strapi CMS content types for the landing page

export interface HeroContent {
  headingPrefix: string;
  headingHighlight: string;
  subheading: string;
  description: string;
  ctaButtonText: string;
  ctaDisclaimer: string;
}

export interface CommitmentContent {
  subtitle: string;
  heading: string;
  description: string;
  benefitCards: { text: string; icon: string; iconKey: string; accentText?: string; tag?: "live" | "coming-soon" }[];
  marqueeText1: string;
  marqueeText2: string;
}

export interface CreditCardContent {
  heading: string;
  subheading: string;
  ctaButtonText: string;
  ctaDisclaimer: string;
  featureCards: { text: string; icon: string; iconKey: string; accentText?: string }[];
}

export interface StepItem {
  number: number;
  title: string;
  description: string;
  phone: string;
  connector: string;
}

export interface GettingStartedContent {
  sectionLabel: string;
  heading: string;
  steps: StepItem[];
}

export interface DownloadAppContent {
  heading: string;
  headingHighlight?: string;
  description: string;
  appStoreButtonText: string;
  playStoreButtonText: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface StatEntry {
  value: string;
  prefix?: string;
  suffix?: string;
  separator?: string;
  label: string;
}

export interface StatsContent {
  brandHeading: string;
  brandSubheading: string;
  stats: StatEntry[];
}

export interface FooterContent {
  taglineLine1: string;
  taglineLine2: string;
  copyright: string;
  exploreLabel: string;
  contactLabel: string;
}

export interface TrustContent {
  heading: string;
  description: string;
  points: string[];
}

export interface WhyJoinContent {
  problems: string[];
  solutionHeading: string;
  solutions: string[];
}

export interface CoverageContent {
  heading: string;
  subheading?: string;
  points: string[];
  detailCards?: { text: string; highlight?: string; iconKey?: string }[];
}

export interface CallbackContent {
  heading: string;
  description: string;
  ctaButtonText: string;
}
