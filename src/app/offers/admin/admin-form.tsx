"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/app/offers/_components/ui/button";
import { Input } from "@/app/offers/_components/ui/input";
import { Label } from "@/app/offers/_components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/offers/_components/ui/card";
import { Checkbox } from "@/app/offers/_components/ui/checkbox";
import { DEFAULT_TERMS } from "@/app/offers/_lib/constants";
import { createOffer } from "./actions";
import type { OfferInsert } from "@/app/offers/_types/offer";
import { CheckCircle2, Copy, ExternalLink, MailCheck, Plus, TriangleAlert } from "lucide-react";
import Link from "next/link";

const SUPPLY_TEAM_CREATORS = [
  "Raghav Malhotra",
  "Ashish Oberoi",
  "Shubh Goel",
  "Amit Nicodemus",
  "Tanmay Rakshe",
] as const;

/** Matches `Input` styling for native selects. */
const INPUT_LIKE_SELECT =
  "flex h-10 w-full cursor-pointer rounded-[8px] border border-flent-pastel-brown bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:border-flent-forest focus-visible:ring-2 focus-visible:ring-flent-forest/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const FURNISHING_OPTIONS = [
  "Unfurnished",
  "Partially Furnished",
  "Fully Furnished",
] as const;

const PROPERTY_TYPE_OPTIONS = [
  "1 BHK",
  "2 BHK",
  "2.5 BHK",
  "3 BHK",
  "3.5 BHK",
  "4 BHK",
  "5 BHK",
  "6 BHK",
] as const;

const PARKING_TYPE_OPTIONS = [
  "Covered car parking",
  "Open car parking",
  "Covered bike parking",
  "Open bike parking",
  "None",
] as const;

const UNIT_COUNT_OPTIONS = Array.from({ length: 20 }, (_, i) => String(i + 1));
const WHATSAPP_COUNTRY_OPTIONS = [
  { code: "+91", label: "India", localDigits: 10 },
  { code: "+971", label: "UAE", localDigits: 9 },
  { code: "+1", label: "US/Canada", localDigits: 10 },
  { code: "+44", label: "UK", localDigits: 10 },
] as const;

const RENT_FREE_NONE = "__none__";
const RENT_FREE_TBD = "__tbd__";
/** Must match `rentFreeDayOptions` length below. */
const RENT_FREE_MAX_SELECTABLE_DAYS = 100;

function parseDateOnlyToUtcMs(iso: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(d)) return null;
  return Date.UTC(y, mo - 1, d);
}

const STORED_TBD = "To be decided";

const DATE_MODE_DATE = "date";
const DATE_MODE_TBD = "tbd";

const RENT_INCREMENT_MODE_CUSTOM = "custom";
const RENT_INCREMENT_MODE_TBD = "tbd";

const MAINTENANCE_MODE_AMOUNT = "amount";
const MAINTENANCE_MODE_ACTUALS = "actuals";
const MAINTENANCE_MODE_INCLUDED = "included";
const MAINTENANCE_AS_PER_ACTUALS = "As per actuals";
const MAINTENANCE_INCLUDED_IN_RENT = "Included in Rent";

const PARTNERSHIP_BONUS_MODE_APPLICABLE = "applicable";
const PARTNERSHIP_BONUS_MODE_NOT_APPLICABLE = "not_applicable";

const initialForm: Record<string, string> = {
  landlord_name: "",
  landlord_email: "",
  landlord_whatsapp_number: "",
  google_maps_address_link: "",
  property_name: "",
  rent_amount: "",
  security_deposit: "",
  key_handover_date: "",
  rent_start_date: "",
};

export default function AdminForm() {
  const [form, setForm] = useState(initialForm);
  const [whatsappCountryCode, setWhatsappCountryCode] = useState("+91");
  const [furnishingState, setFurnishingState] = useState("");
  const [serviceTermChoice, setServiceTermChoice] = useState<
    "11" | "22" | "33" | "custom"
  >("11");
  const [serviceTermCustomMonths, setServiceTermCustomMonths] = useState("");
  const [rentFreeDays, setRentFreeDays] = useState(RENT_FREE_NONE);
  const [rentIncrementMode, setRentIncrementMode] = useState<
    typeof RENT_INCREMENT_MODE_CUSTOM | typeof RENT_INCREMENT_MODE_TBD
  >(RENT_INCREMENT_MODE_CUSTOM);
  const [rentIncrementPct, setRentIncrementPct] = useState("");
  const [keyHandoverDateMode, setKeyHandoverDateMode] = useState<
    typeof DATE_MODE_DATE | typeof DATE_MODE_TBD
  >(DATE_MODE_DATE);
  const [rentStartDateMode, setRentStartDateMode] = useState<
    typeof DATE_MODE_DATE | typeof DATE_MODE_TBD
  >(DATE_MODE_DATE);
  const [maintenanceMode, setMaintenanceMode] = useState<
    | typeof MAINTENANCE_MODE_AMOUNT
    | typeof MAINTENANCE_MODE_ACTUALS
    | typeof MAINTENANCE_MODE_INCLUDED
  >(MAINTENANCE_MODE_AMOUNT);
  const [maintenanceAmount, setMaintenanceAmount] = useState("");
  const [propertyTypeLayout, setPropertyTypeLayout] = useState("");
  const [propertyUnitCount, setPropertyUnitCount] = useState("1");
  const [parkingType, setParkingType] = useState("");
  const [parkingUnitCount, setParkingUnitCount] = useState("1");
  const [noticePeriodChoice, setNoticePeriodChoice] = useState("1 month");
  const [partnershipBonusMode, setPartnershipBonusMode] = useState<
    typeof PARTNERSHIP_BONUS_MODE_APPLICABLE | typeof PARTNERSHIP_BONUS_MODE_NOT_APPLICABLE
  >(PARTNERSHIP_BONUS_MODE_NOT_APPLICABLE);
  const [partnershipBonusAmount, setPartnershipBonusAmount] = useState("");

  const [creatorName, setCreatorName] = useState("");
  const [selectedTerms, setSelectedTerms] = useState<string[]>(() =>
    Array.from(DEFAULT_TERMS)
  );
  const [customTerm, setCustomTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [emailSentOnSuccess, setEmailSentOnSuccess] = useState<boolean | null>(null);
  const [lastOfferUrl, setLastOfferUrl] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const successCardRef = useRef<HTMLDivElement | null>(null);
  const isPresetCreator = SUPPLY_TEAM_CREATORS.some((name) => name === creatorName);

  const toggleTerm = (term: string, checked: boolean) => {
    setSelectedTerms((prev) =>
      checked ? [...prev, term] : prev.filter((t) => t !== term)
    );
  };

  const addCustomTerm = () => {
    const t = customTerm.trim();
    if (t && !selectedTerms.includes(t)) {
      setSelectedTerms((prev) => [...prev, t]);
      setCustomTerm("");
    }
  };

  const onRentIncrementInput = (raw: string) => {
    const cleaned = raw.replace(/[^0-9.]/g, "");
    const firstDotIndex = cleaned.indexOf(".");
    if (firstDotIndex === -1) {
      setRentIncrementPct(cleaned);
      return;
    }
    const normalized =
      cleaned.slice(0, firstDotIndex + 1) +
      cleaned.slice(firstDotIndex + 1).replace(/\./g, "");
    setRentIncrementPct(normalized);
  };

  const buildServiceTerm = (): string | null => {
    if (serviceTermChoice === "custom") {
      const n = Number(serviceTermCustomMonths.replace(/\D/g, ""));
      if (!Number.isFinite(n) || n <= 0) return null;
      const rounded = Math.round(n);
      return `${rounded} months`;
    }
    return `${serviceTermChoice} months`;
  };

  const buildRentFreePeriod = (): string => {
    if (rentFreeDays === RENT_FREE_NONE) return "None";
    if (rentFreeDays === RENT_FREE_TBD) return STORED_TBD;
    return `${rentFreeDays} days`;
  };

  const buildPropertyTypeForPayload = (layout: string, countStr: string): string => {
    const n = Math.min(20, Math.max(1, Math.round(Number(countStr)) || 1));
    if (n <= 1) return layout;
    return `${n} × ${layout}`;
  };

  const buildParkingForPayload = (kind: string, countStr: string): string => {
    if (kind === "None") return "None";
    const n = Math.min(20, Math.max(1, Math.round(Number(countStr)) || 1));
    if (n <= 1) return kind;
    return `${n} × ${kind}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatusMessage(null);
    setEmailSentOnSuccess(null);
    setLastOfferUrl(null);
    setCopyFeedback(false);
    setSubmitting(true);

    const normalizedCreatorName = creatorName.trim();
    if (!normalizedCreatorName) {
      setError("Please select or enter the offer creator's name.");
      setSubmitting(false);
      return;
    }

    if (!furnishingState) {
      setError("Please select a furnishing state.");
      setSubmitting(false);
      return;
    }

    if (!propertyTypeLayout) {
      setError("Please select a property type.");
      setSubmitting(false);
      return;
    }

    if (!parkingType) {
      setError("Please select a parking option.");
      setSubmitting(false);
      return;
    }

    const whatsappCountry = WHATSAPP_COUNTRY_OPTIONS.find(
      (option) => option.code === whatsappCountryCode
    );
    const normalizedWhatsappDigits = form.landlord_whatsapp_number.replace(/\D/g, "");
    if (!whatsappCountry || normalizedWhatsappDigits.length !== whatsappCountry.localDigits) {
      const requiredDigits = whatsappCountry?.localDigits ?? 10;
      setError(
        `Please enter a valid WhatsApp number for ${whatsappCountryCode} (${requiredDigits} digits).`
      );
      setSubmitting(false);
      return;
    }

    if (!form.google_maps_address_link.trim()) {
      setError("Please enter the Google Maps address link.");
      setSubmitting(false);
      return;
    }

    const serviceTerm = buildServiceTerm();
    if (!serviceTerm) {
      setError("Please enter a valid number of months for the custom service term.");
      setSubmitting(false);
      return;
    }

    if (rentIncrementMode === RENT_INCREMENT_MODE_CUSTOM && rentIncrementPct === "") {
      setError("Please enter the rent increment percentage.");
      setSubmitting(false);
      return;
    }

    if (keyHandoverDateMode === DATE_MODE_DATE && !form.key_handover_date) {
      setError('Please select a key handover date, or choose "To be decided".');
      setSubmitting(false);
      return;
    }

    if (rentStartDateMode === DATE_MODE_DATE && !form.rent_start_date) {
      setError('Please select a rent start date, or choose "To be decided".');
      setSubmitting(false);
      return;
    }

    let maintenanceValue: string;
    if (maintenanceMode === MAINTENANCE_MODE_ACTUALS) {
      maintenanceValue = MAINTENANCE_AS_PER_ACTUALS;
    } else if (maintenanceMode === MAINTENANCE_MODE_INCLUDED) {
      maintenanceValue = MAINTENANCE_INCLUDED_IN_RENT;
    } else {
      const maintenanceNum = Number(maintenanceAmount);
      if (
        maintenanceAmount === "" ||
        !Number.isFinite(maintenanceNum) ||
        maintenanceNum < 0
      ) {
        setError(
          "Please enter a valid maintenance amount (Rs), or choose As per actuals or Included in Rent."
        );
        setSubmitting(false);
        return;
      }
      maintenanceValue = String(maintenanceNum);
    }

    let partnershipAssociationBonusAmount: number | null = null;
    if (partnershipBonusMode === PARTNERSHIP_BONUS_MODE_APPLICABLE) {
      const bonusNum = Number(partnershipBonusAmount);
      if (
        partnershipBonusAmount === "" ||
        !Number.isFinite(bonusNum) ||
        bonusNum < 0
      ) {
        setError(
          "Please enter a valid Partnership Association Bonus amount (Rs), or select Not applicable."
        );
        setSubmitting(false);
        return;
      }
      partnershipAssociationBonusAmount = bonusNum;
    }

    const payload: OfferInsert = {
      landlord_name: form.landlord_name,
      landlord_email: form.landlord_email,
      landlord_whatsapp_number: `${whatsappCountryCode}${normalizedWhatsappDigits}`,
      google_maps_address_link: form.google_maps_address_link.trim(),
      created_by: normalizedCreatorName,
      property_name: form.property_name,
      property_type: buildPropertyTypeForPayload(propertyTypeLayout, propertyUnitCount),
      furnishing_state: furnishingState,
      parking: buildParkingForPayload(parkingType, parkingUnitCount),
      rent_amount: Number(form.rent_amount),
      security_deposit: Number(form.security_deposit),
      service_term: serviceTerm,
      rent_increment:
        rentIncrementMode === RENT_INCREMENT_MODE_TBD
          ? STORED_TBD
          : `${rentIncrementPct}%`,
      key_handover_date:
        keyHandoverDateMode === DATE_MODE_TBD ? STORED_TBD : form.key_handover_date,
      rent_free_period: buildRentFreePeriod(),
      rent_start_date:
        rentStartDateMode === DATE_MODE_TBD ? STORED_TBD : form.rent_start_date,
      maintenance: maintenanceValue,
      partnership_association_bonus_amount: partnershipAssociationBonusAmount,
      notice_period: noticePeriodChoice,
      selected_terms: selectedTerms,
    };

    const result = await createOffer(payload);
    setSubmitting(false);

    if (result.success) {
      setLastOfferUrl(result.offerUrl);
      if (result.emailSent) {
        setEmailSentOnSuccess(true);
        setStatusMessage(`✓ Offer created successfully. Email sent to ${form.landlord_email}`);
      } else {
        setEmailSentOnSuccess(false);
        const reason = result.emailError ? ` (${result.emailError})` : "";
        setStatusMessage(
          `✓ Offer created. Email failed to send${reason} — please share the link manually.`
        );
      }
      return;
    }
    setError(result.error);
  };

  const rentFreeDayOptions = Array.from(
    { length: RENT_FREE_MAX_SELECTABLE_DAYS },
    (_, i) => String(i + 1)
  );

  useEffect(() => {
    if (
      keyHandoverDateMode !== DATE_MODE_DATE ||
      rentStartDateMode !== DATE_MODE_DATE ||
      !form.key_handover_date ||
      !form.rent_start_date
    ) {
      return;
    }
    const handoverMs = parseDateOnlyToUtcMs(form.key_handover_date);
    const rentStartMs = parseDateOnlyToUtcMs(form.rent_start_date);
    if (handoverMs === null || rentStartMs === null) return;

    const diffDays = Math.floor((rentStartMs - handoverMs) / 86400000);
    if (diffDays <= 0) {
      setRentFreeDays(RENT_FREE_NONE);
      return;
    }
    const capped = Math.min(diffDays, RENT_FREE_MAX_SELECTABLE_DAYS);
    setRentFreeDays(String(capped));
  }, [
    keyHandoverDateMode,
    rentStartDateMode,
    form.key_handover_date,
    form.rent_start_date,
  ]);

  useEffect(() => {
    if (!statusMessage) return;
    successCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    successCardRef.current?.focus();
  }, [statusMessage]);

  return (
    <div className="min-h-screen bg-flent-off-white">
      <header className="border-b border-flent-pastel-brown/80 bg-flent-off-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link
            href="/offers"
            className="flex items-center gap-3 font-semibold text-flent-black"
          >
            <img
              src="/flent-logo-black.png"
              alt="Flent"
              className="h-9 w-auto"
            />
            <span className="eyebrow-pill border border-flent-pastel-brown bg-white text-flent-black">
              ADMIN
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-8 space-y-2">
          <h1 className="headline-display text-3xl font-bold text-flent-black">
            Create a new{" "}
            <span className="headline-italic">landlord offer.</span>
          </h1>
          <p className="max-w-xl text-sm font-medium text-flent-brown">
            Fill in the commercial details and selected terms below. Once saved, a
            shareable offer page is generated and an offer email is sent to the
            landlord.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="doorframe-wide border-none bg-white/95 shadow-sm">
            <CardHeader>
              <CardTitle className="headline-display text-xl font-semibold text-flent-black">
                Offer creator
              </CardTitle>
              <p className="text-sm font-medium text-flent-brown/80">
                Select your name, or enter a custom name if not listed.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-x-5 gap-y-3">
                {SUPPLY_TEAM_CREATORS.map((name) => (
                  <label
                    key={name}
                    className="flex cursor-pointer items-center gap-2 text-sm text-flent-black/90"
                  >
                    <Checkbox
                      checked={creatorName === name}
                      onCheckedChange={(checked) => setCreatorName(checked ? name : "")}
                    />
                    <span>{name}</span>
                  </label>
                ))}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="custom_creator_name" className="text-xs font-semibold text-flent-brown">
                  Custom creator name
                </Label>
                <Input
                  id="custom_creator_name"
                  value={isPresetCreator ? "" : creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="Type name if not listed above"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="doorframe-wide border-none bg-white/95 shadow-sm">
            <CardHeader>
              <CardTitle className="headline-display text-xl font-semibold text-flent-black">
                Commercial details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="landlord_name" className="text-xs font-semibold text-flent-brown">
                  Landlord name
                </Label>
                <Input
                  id="landlord_name"
                  value={form.landlord_name}
                  onChange={(e) => setForm((f) => ({ ...f, landlord_name: e.target.value }))}
                  placeholder="e.g. Rajesh Kumar"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="landlord_email" className="text-xs font-semibold text-flent-brown">
                  Landlord email address
                </Label>
                <Input
                  id="landlord_email"
                  type="email"
                  value={form.landlord_email}
                  onChange={(e) => setForm((f) => ({ ...f, landlord_email: e.target.value }))}
                  placeholder="e.g. name@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="landlord_whatsapp_number"
                  className="text-xs font-semibold text-flent-brown"
                >
                  Landlord WhatsApp number
                </Label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[190px_minmax(0,1fr)]">
                  <select
                    id="landlord_whatsapp_country_code"
                    className={INPUT_LIKE_SELECT}
                    value={whatsappCountryCode}
                    onChange={(e) => {
                      const nextCode = e.target.value;
                      const nextCountry = WHATSAPP_COUNTRY_OPTIONS.find(
                        (option) => option.code === nextCode
                      );
                      setWhatsappCountryCode(nextCode);
                      if (!nextCountry) return;
                      setForm((f) => ({
                        ...f,
                        landlord_whatsapp_number: f.landlord_whatsapp_number
                          .replace(/\D/g, "")
                          .slice(0, nextCountry.localDigits),
                      }));
                    }}
                    required
                  >
                    {WHATSAPP_COUNTRY_OPTIONS.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.label} ({option.code})
                      </option>
                    ))}
                  </select>
                  <Input
                    id="landlord_whatsapp_number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={form.landlord_whatsapp_number}
                    onChange={(e) => {
                      const selectedCountry = WHATSAPP_COUNTRY_OPTIONS.find(
                        (option) => option.code === whatsappCountryCode
                      );
                      const maxDigits = selectedCountry?.localDigits ?? 10;
                      const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, maxDigits);
                      setForm((f) => ({ ...f, landlord_whatsapp_number: digitsOnly }));
                    }}
                    placeholder="Enter WhatsApp number"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="google_maps_address_link"
                  className="text-xs font-semibold text-flent-brown"
                >
                  Google Maps address link
                </Label>
                <Input
                  id="google_maps_address_link"
                  type="url"
                  value={form.google_maps_address_link}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, google_maps_address_link: e.target.value }))
                  }
                  placeholder="https://maps.google.com/..."
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="property_name" className="text-xs font-semibold text-flent-brown">
                  Property name / address
                </Label>
                <Input
                  id="property_name"
                  value={form.property_name}
                  onChange={(e) => setForm((f) => ({ ...f, property_name: e.target.value }))}
                  placeholder="e.g. 202, Green Valley Apartments"
                  required
                />
              </div>
              <div className="grid gap-2">
                <span className="text-xs font-semibold text-flent-brown">Property type</span>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="property_type_layout" className="text-[11px] font-medium text-flent-brown/90">
                      Layout
                    </Label>
                    <select
                      id="property_type_layout"
                      className={INPUT_LIKE_SELECT}
                      value={propertyTypeLayout}
                      onChange={(e) => setPropertyTypeLayout(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select layout
                      </option>
                      {PROPERTY_TYPE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="property_unit_count" className="text-[11px] font-medium text-flent-brown/90">
                      Number of properties (Enterprise)
                    </Label>
                    <select
                      id="property_unit_count"
                      className={INPUT_LIKE_SELECT}
                      value={propertyUnitCount}
                      onChange={(e) => setPropertyUnitCount(e.target.value)}
                    >
                      {UNIT_COUNT_OPTIONS.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="furnishing_state" className="text-xs font-semibold text-flent-brown">
                  Furnishing state
                </Label>
                <select
                  id="furnishing_state"
                  className={INPUT_LIKE_SELECT}
                  value={furnishingState}
                  onChange={(e) => setFurnishingState(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select furnishing state
                  </option>
                  {FURNISHING_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <span className="text-xs font-semibold text-flent-brown">Parking</span>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="parking_type" className="text-[11px] font-medium text-flent-brown/90">
                      Type
                    </Label>
                    <select
                      id="parking_type"
                      className={INPUT_LIKE_SELECT}
                      value={parkingType}
                      onChange={(e) => setParkingType(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select parking
                      </option>
                      {PARKING_TYPE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="parking_unit_count"
                      className={`text-[11px] font-medium text-flent-brown/90 ${parkingType === "None" ? "opacity-50" : ""}`}
                    >
                      Number of parking slots
                    </Label>
                    <select
                      id="parking_unit_count"
                      className={`${INPUT_LIKE_SELECT} ${parkingType === "None" ? "cursor-not-allowed opacity-50" : ""}`}
                      value={parkingUnitCount}
                      onChange={(e) => setParkingUnitCount(e.target.value)}
                      disabled={parkingType === "None"}
                    >
                      {UNIT_COUNT_OPTIONS.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="rent_amount" className="text-xs font-semibold text-flent-brown">
                    Monthly rent (Rs)
                  </Label>
                  <Input
                    id="rent_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.rent_amount}
                    onChange={(e) => setForm((f) => ({ ...f, rent_amount: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="security_deposit" className="text-xs font-semibold text-flent-brown">
                    Security deposit (Rs)
                  </Label>
                  <Input
                    id="security_deposit"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.security_deposit}
                    onChange={(e) => setForm((f) => ({ ...f, security_deposit: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maintenance_mode" className="text-xs font-semibold text-flent-brown">
                  Maintenance
                </Label>
                <select
                  id="maintenance_mode"
                  className={INPUT_LIKE_SELECT}
                  value={maintenanceMode}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (
                      v === MAINTENANCE_MODE_AMOUNT ||
                      v === MAINTENANCE_MODE_ACTUALS ||
                      v === MAINTENANCE_MODE_INCLUDED
                    ) {
                      setMaintenanceMode(v);
                    }
                  }}
                >
                  <option value={MAINTENANCE_MODE_AMOUNT}>Specify amount (Rs)</option>
                  <option value={MAINTENANCE_MODE_ACTUALS}>{MAINTENANCE_AS_PER_ACTUALS}</option>
                  <option value={MAINTENANCE_MODE_INCLUDED}>{MAINTENANCE_INCLUDED_IN_RENT}</option>
                </select>
                {maintenanceMode === MAINTENANCE_MODE_AMOUNT && (
                  <Input
                    id="maintenance_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={maintenanceAmount}
                    onChange={(e) => setMaintenanceAmount(e.target.value)}
                    placeholder="e.g. 5000"
                  />
                )}
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="partnership_bonus_mode"
                  className="text-xs font-semibold text-flent-brown"
                >
                  Partnership Association Bonus
                </Label>
                <select
                  id="partnership_bonus_mode"
                  className={INPUT_LIKE_SELECT}
                  value={partnershipBonusMode}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (
                      v === PARTNERSHIP_BONUS_MODE_APPLICABLE ||
                      v === PARTNERSHIP_BONUS_MODE_NOT_APPLICABLE
                    ) {
                      setPartnershipBonusMode(v);
                    }
                  }}
                  required
                >
                  <option value={PARTNERSHIP_BONUS_MODE_APPLICABLE}>Applicable</option>
                  <option value={PARTNERSHIP_BONUS_MODE_NOT_APPLICABLE}>Not applicable</option>
                </select>
                {partnershipBonusMode === PARTNERSHIP_BONUS_MODE_APPLICABLE && (
                  <Input
                    id="partnership_bonus_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={partnershipBonusAmount}
                    onChange={(e) => setPartnershipBonusAmount(e.target.value)}
                    placeholder="Amount (Rs)"
                    required
                  />
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="service_term" className="text-xs font-semibold text-flent-brown">
                  Service term
                </Label>
                <select
                  id="service_term"
                  className={INPUT_LIKE_SELECT}
                  value={serviceTermChoice}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "11" || v === "22" || v === "33" || v === "custom") {
                      setServiceTermChoice(v);
                    }
                  }}
                >
                  <option value="11">11 months</option>
                  <option value="22">22 months</option>
                  <option value="33">33 months</option>
                  <option value="custom">Custom number of months</option>
                </select>
                {serviceTermChoice === "custom" && (
                  <div className="mt-1 flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={serviceTermCustomMonths}
                      onChange={(e) => setServiceTermCustomMonths(e.target.value)}
                      placeholder="Months"
                      className="max-w-[140px]"
                    />
                    <span className="text-sm font-medium text-flent-brown">months</span>
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rent_increment_mode" className="text-xs font-semibold text-flent-brown">
                  Rent increment
                </Label>
                <select
                  id="rent_increment_mode"
                  className={INPUT_LIKE_SELECT}
                  value={rentIncrementMode}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === RENT_INCREMENT_MODE_TBD || v === RENT_INCREMENT_MODE_CUSTOM) {
                      setRentIncrementMode(v);
                    }
                  }}
                >
                  <option value={RENT_INCREMENT_MODE_CUSTOM}>Specify percentage</option>
                  <option value={RENT_INCREMENT_MODE_TBD}>{STORED_TBD}</option>
                </select>
                {rentIncrementMode === RENT_INCREMENT_MODE_CUSTOM && (
                  <div className="flex h-10 w-full overflow-hidden rounded-[8px] border border-flent-pastel-brown bg-white shadow-sm transition-colors focus-within:border-flent-forest focus-within:ring-2 focus-within:ring-flent-forest/40 focus-within:ring-offset-2">
                    <span className="flex shrink-0 items-center border-r border-flent-pastel-brown bg-flent-off-white px-3 text-sm font-semibold text-flent-brown">
                      %
                    </span>
                    <input
                      id="rent_increment"
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      value={rentIncrementPct}
                      onChange={(e) => onRentIncrementInput(e.target.value)}
                      placeholder="e.g. 5"
                      className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-flent-brown/60"
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="key_handover_date_mode" className="text-xs font-semibold text-flent-brown">
                    Key handover date
                  </Label>
                  <select
                    id="key_handover_date_mode"
                    className={INPUT_LIKE_SELECT}
                    value={keyHandoverDateMode}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === DATE_MODE_DATE || v === DATE_MODE_TBD) {
                        setKeyHandoverDateMode(v);
                      }
                    }}
                  >
                    <option value={DATE_MODE_DATE}>Specific date</option>
                    <option value={DATE_MODE_TBD}>{STORED_TBD}</option>
                  </select>
                  {keyHandoverDateMode === DATE_MODE_DATE && (
                    <Input
                      id="key_handover_date"
                      type="date"
                      value={form.key_handover_date}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, key_handover_date: e.target.value }))
                      }
                    />
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rent_start_date_mode" className="text-xs font-semibold text-flent-brown">
                    Rent start date
                  </Label>
                  <select
                    id="rent_start_date_mode"
                    className={INPUT_LIKE_SELECT}
                    value={rentStartDateMode}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === DATE_MODE_DATE || v === DATE_MODE_TBD) {
                        setRentStartDateMode(v);
                      }
                    }}
                  >
                    <option value={DATE_MODE_DATE}>Specific date</option>
                    <option value={DATE_MODE_TBD}>{STORED_TBD}</option>
                  </select>
                  {rentStartDateMode === DATE_MODE_DATE && (
                    <Input
                      id="rent_start_date"
                      type="date"
                      value={form.rent_start_date}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, rent_start_date: e.target.value }))
                      }
                    />
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rent_free_period" className="text-xs font-semibold text-flent-brown">
                  Rent free days
                </Label>
                <p className="text-[11px] font-medium text-flent-brown/75">
                  Auto-fills from handover → rent start when both dates are set (same day → None).
                  Override anytime.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <select
                    id="rent_free_period"
                    className={`${INPUT_LIKE_SELECT} sm:max-w-xs`}
                    value={rentFreeDays}
                    onChange={(e) => setRentFreeDays(e.target.value)}
                  >
                    <option value={RENT_FREE_NONE}>None</option>
                    <option value={RENT_FREE_TBD}>{STORED_TBD}</option>
                    {rentFreeDayOptions.map((d) => (
                      <option key={d} value={d}>
                        {d === "1" ? "1 day" : `${d} days`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notice_period" className="text-xs font-semibold text-flent-brown">
                  Notice period
                </Label>
                <select
                  id="notice_period"
                  className={INPUT_LIKE_SELECT}
                  value={noticePeriodChoice}
                  onChange={(e) => setNoticePeriodChoice(e.target.value)}
                >
                  <option value="1 month">1 month</option>
                  <option value="2 months">2 months</option>
                  <option value="3 months">3 months</option>
                  <option value="None">None</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="doorframe-wide border-none bg-white/95 shadow-sm">
            <CardHeader>
              <CardTitle className="headline-display text-xl font-semibold text-flent-black">
                Other terms &amp; conditions
              </CardTitle>
              <p className="text-sm font-medium text-flent-brown/80">
                Check the terms that apply to this offer. You can add custom terms below.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {DEFAULT_TERMS.map((term, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedTerms.includes(term)}
                      onCheckedChange={(checked) => toggleTerm(term, !!checked)}
                      className="mt-0.5"
                    />
                    <span className="text-sm text-flent-black/80">{term}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 pt-2">
                <Input
                  placeholder="Add custom term..."
                  value={customTerm}
                  onChange={(e) => setCustomTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTerm())}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCustomTerm}
                  className="border-flent-pastel-brown text-sm font-semibold text-flent-brown hover:border-flent-brown hover:bg-flent-pastel-brown/40"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              {selectedTerms.some((t) => !(DEFAULT_TERMS as readonly string[]).includes(t)) && (
                <div className="rounded-xl border border-flent-pastel-brown bg-flent-off-white p-3">
                  <p className="mb-2 text-xs font-semibold text-flent-brown">
                    Custom terms added
                  </p>
                  <ul className="list-inside list-disc space-y-1 text-sm text-flent-black/80">
                    {selectedTerms
                      .filter((t) => !(DEFAULT_TERMS as readonly string[]).includes(t))
                      .map((t, i) => (
                        <li key={i} className="flex items-center justify-between gap-2">
                          <span>{t}</span>
                          <button
                            type="button"
                            onClick={() => toggleTerm(t, false)}
                            className="text-flent-brown/70 hover:text-flent-brown"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}
          {statusMessage && (
            <div
              ref={successCardRef}
              tabIndex={-1}
              className="space-y-3 rounded-xl border border-green-300 bg-green-50/90 px-4 py-4 shadow-sm outline-none"
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
                <div className="space-y-1">
                  <p className="text-base font-semibold text-green-900">Offer created successfully</p>
                  <p className="text-sm font-medium text-green-900/90">{statusMessage}</p>
                </div>
              </div>
              <div
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${
                  emailSentOnSuccess
                    ? "border-green-300 bg-white text-green-900"
                    : "border-amber-300 bg-amber-50 text-amber-900"
                }`}
              >
                {emailSentOnSuccess ? (
                  <MailCheck className="h-4 w-4 shrink-0" />
                ) : (
                  <TriangleAlert className="h-4 w-4 shrink-0" />
                )}
                <span>
                  {emailSentOnSuccess
                    ? "Email delivery confirmed."
                    : "Offer was created, but email failed. Share the link manually."}
                </span>
              </div>
              {lastOfferUrl && (
                <div className="space-y-2 rounded-lg border border-green-200 bg-white px-3 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-green-800">
                    Offer link
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Input
                      readOnly
                      value={lastOfferUrl}
                      className="font-mono text-xs text-flent-black sm:min-w-0 sm:flex-1"
                    />
                    <div className="flex gap-2">
                      <a
                        href={lastOfferUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1 rounded-md border border-green-300 bg-white px-3 py-2 text-sm font-semibold text-green-900 hover:border-green-500 hover:bg-green-100"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open offer
                      </a>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(lastOfferUrl);
                            setCopyFeedback(true);
                            window.setTimeout(() => setCopyFeedback(false), 2000);
                          } catch {
                            setCopyFeedback(false);
                          }
                        }}
                        className="shrink-0 border-green-300 bg-white text-sm font-semibold text-green-900 hover:border-green-500 hover:bg-green-100"
                      >
                        <Copy className="mr-1.5 h-4 w-4" />
                        {copyFeedback ? "Copied" : "Copy link"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="cta-button cta-button--sm w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Creating offer..."
              : statusMessage
                ? "Create another offer"
                : "Create offer & send email"}
          </button>
        </form>
      </main>
    </div>
  );
}
