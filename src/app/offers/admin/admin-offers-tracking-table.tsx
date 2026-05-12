"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/offers/_components/ui/card";
import { Input } from "@/app/offers/_components/ui/input";

type OfferTrackingRow = {
  id: string;
  landlord_name: string;
  landlord_email: string;
  landlord_whatsapp_number?: string | null;
  google_maps_address_link?: string | null;
  created_by: string | null;
  property_name: string;
  property_type: string;
  /** Present after migration `006_add_furnishing_and_parking.sql` is applied. */
  furnishing_state?: string | null;
  /** Present after migration `006_add_furnishing_and_parking.sql` is applied. */
  parking?: string | null;
  rent_amount: number;
  security_deposit: number;
  service_term: string;
  rent_increment: string;
  key_handover_date: string;
  rent_free_period: string;
  rent_start_date: string;
  /** Present after maintenance column migration(s); value is Rs amount text or "As per actuals". */
  maintenance?: string | null;
  /** Null / missing = not applicable; otherwise Rs amount. */
  partnership_association_bonus_amount?: number | string | null;
  notice_period: string;
  created_at: string;
  agreed: boolean;
  agreed_at: string | null;
  first_email_sent_at: string | null;
  first_email_opened_at: string | null;
  first_email_clicked_at: string | null;
  first_email_clicked_url: string | null;
  agree_email_sent_at: string | null;
  agree_email_opened_at: string | null;
  agree_email_clicked_at: string | null;
  agree_email_clicked_url: string | null;
  onboarding_completed: boolean;
  onboarding_completed_at: string | null;
};

type OfferCounts = {
  total: number;
  pending: number;
  accepted: number;
};

/** Pixel widths and cumulative left offsets for the nine sticky Landlord Details columns. */
const LANDLORD_STICKY = [
  { min: "min-w-[140px]", max: "max-w-[140px]", left: "left-0" },
  { min: "min-w-[160px]", max: "max-w-[160px]", left: "left-[140px]" },
  { min: "min-w-[200px]", max: "max-w-[200px]", left: "left-[300px]" },
  { min: "min-w-[220px]", max: "max-w-[220px]", left: "left-[500px]" },
  { min: "min-w-[160px]", max: "max-w-[160px]", left: "left-[720px]" },
  { min: "min-w-[170px]", max: "max-w-[170px]", left: "left-[880px]" },
  { min: "min-w-[130px]", max: "max-w-[130px]", left: "left-[1050px]" },
  { min: "min-w-[110px]", max: "max-w-[110px]", left: "left-[1180px]" },
  { min: "min-w-[130px]", max: "max-w-[130px]", left: "left-[1290px]" },
] as const;

const LANDLORD_SECTION_WIDTH_PX = 1420;

const STATUS_GREEN = "#008E75";
const STATUS_YELLOW = "#FFE98A";
const STATUS_RED = "#C64747";
const OFFER_EXPIRY_WINDOW_MS = 48 * 60 * 60 * 1000;

function statusPillStyle(backgroundColor: string, useDarkText = false) {
  return {
    backgroundColor,
    color: useDarkText ? "#111111" : "#FFFFFF",
    borderRadius: "999px",
    padding: "1px 7px",
    fontSize: "11px",
    lineHeight: "1.2",
    display: "inline-block",
    verticalAlign: "middle",
  } as const;
}

function formatMaybeIso(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateOnly(value: string | null | undefined) {
  if (!value) return "—";
  if (value === "To be decided") return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function getOfferStatus(row: OfferTrackingRow): "Active" | "Expired" | "Agreed" {
  if (row.agreed) return "Agreed";
  const createdAtMs = Date.parse(row.created_at);
  if (!Number.isFinite(createdAtMs)) return "Active";
  return Date.now() >= createdAtMs + OFFER_EXPIRY_WINDOW_MS ? "Expired" : "Active";
}

function getOfferHref(offerId: string) {
  return `/offers/offer/${offerId}`;
}

function fallbackCopyText(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  document.body.removeChild(textarea);
  return copied;
}

function StatusBlock({
  sentAt,
  openedAt,
  clickedAt,
}: {
  sentAt: string | null;
  openedAt: string | null;
  clickedAt: string | null;
}): ReactNode {
  const sentBg = sentAt ? STATUS_GREEN : STATUS_RED;
  const openedBg = openedAt ? STATUS_GREEN : STATUS_YELLOW;
  const clickedBg = clickedAt ? STATUS_GREEN : STATUS_YELLOW;
  const wasSent = Boolean(sentAt);

  return (
    <div className="space-y-1">
      <div className="whitespace-nowrap text-[12px] font-semibold text-flent-brown">
        <span style={statusPillStyle(sentBg)}>Sent</span>
        {": "}
        <span className="font-normal text-flent-black/80">
          {sentAt ? formatMaybeIso(sentAt) : "Not sent"}
        </span>
      </div>
      <div className="whitespace-nowrap text-[12px] font-semibold text-flent-brown">
        {wasSent ? (
          <span style={statusPillStyle(openedBg, !openedAt)}>Opened</span>
        ) : (
          "Opened"
        )}
        {": "}
        <span className="font-normal text-flent-black/80">
          {openedAt ? formatMaybeIso(openedAt) : "Not opened"}
        </span>
      </div>
      <div className="whitespace-nowrap text-[12px] font-semibold text-flent-brown">
        {wasSent ? (
          <span style={statusPillStyle(clickedBg, !clickedAt)}>Clicked</span>
        ) : (
          "Clicked"
        )}
        {": "}
        <span className="font-normal text-flent-black/80">
          {clickedAt ? formatMaybeIso(clickedAt) : "Not clicked"}
        </span>
      </div>
    </div>
  );
}

function rowMatchesQuery(row: OfferTrackingRow, q: string): boolean {
  if (!q.trim()) return true;
  const needle = q.trim().toLowerCase();
  const hay = [row.landlord_name, row.landlord_email, row.created_by ?? ""]
    .join(" ")
    .toLowerCase();
  return hay.includes(needle);
}

function stickyLandlordTheadClass(i: number) {
  const c = LANDLORD_STICKY[i];
  return `${c.min} ${c.max} ${c.left} z-30 border-r border-flent-pastel-brown/50 bg-[#f0efe8] shadow-[2px_0_6px_-2px_rgba(0,0,0,0.06)]`;
}

function stickyLandlordTdClass(i: number) {
  const c = LANDLORD_STICKY[i];
  return `${c.min} ${c.max} ${c.left} z-20 border-r border-flent-pastel-brown/50 bg-white shadow-[2px_0_6px_-2px_rgba(0,0,0,0.06)] group-hover:bg-[#faf9f6]`;
}

const COL_COUNT = 26;

export default function AdminOffersTrackingTable() {
  const [rows, setRows] = useState<OfferTrackingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState<OfferCounts | null>(null);
  const [creatorCounts, setCreatorCounts] = useState<OfferCounts | null>(null);
  const [search, setSearch] = useState("");
  const [creatorFilter, setCreatorFilter] = useState<"all" | string>("all");
  const [offerStatusFilter, setOfferStatusFilter] = useState<
    "all" | "Active" | "Expired" | "Agreed"
  >("all");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/offers/api/admin/offers-tracking", { method: "GET" });
        if (!res.ok) {
          let detail = `Request failed (${res.status})`;
          try {
            const errJson = (await res.json()) as { error?: string };
            if (typeof errJson?.error === "string" && errJson.error.trim()) {
              detail = errJson.error;
            }
          } catch {
            /* ignore */
          }
          throw new Error(detail);
        }
        const json = (await res.json()) as {
          offers: OfferTrackingRow[];
          counts?: OfferCounts;
          creatorCounts?: OfferCounts | null;
        };
        if (!cancelled) setRows(json.offers ?? []);
        if (!cancelled) setCounts(json.counts ?? null);
        if (!cancelled) setCreatorCounts(json.creatorCounts ?? null);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadCreatorCounts() {
      if (creatorFilter === "all") {
        setCreatorCounts(null);
        return;
      }

      try {
        setError(null);
        const res = await fetch(
          `/offers/api/admin/offers-tracking?creator=${encodeURIComponent(creatorFilter)}`,
          { method: "GET" },
        );
        if (!res.ok) {
          let detail = `Request failed (${res.status})`;
          try {
            const errJson = (await res.json()) as { error?: string };
            if (typeof errJson?.error === "string" && errJson.error.trim()) {
              detail = errJson.error;
            }
          } catch {
            /* ignore */
          }
          throw new Error(detail);
        }

        const json = (await res.json()) as { creatorCounts?: OfferCounts | null };
        if (!cancelled) setCreatorCounts(json.creatorCounts ?? null);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error");
      }
    }

    loadCreatorCounts();
    return () => {
      cancelled = true;
    };
  }, [creatorFilter]);

  const creatorOptions = useMemo(() => {
    const s = new Set<string>();
    for (const r of rows) {
      const v = r.created_by?.trim();
      if (v) s.add(v);
    }
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (!rowMatchesQuery(row, search)) return false;
      const offerStatus = getOfferStatus(row);
      if (offerStatusFilter !== "all" && offerStatus !== offerStatusFilter) return false;
      if (creatorFilter === "all") return true;
      return (row.created_by?.trim() ?? "") === creatorFilter;
    });
  }, [rows, search, creatorFilter, offerStatusFilter]);

  const copyOfferUrl = (offerId: string) => {
    const offerUrl = new URL(getOfferHref(offerId), window.location.origin).toString();

    if (fallbackCopyText(offerUrl)) {
      window.alert("Offer URL copied.");
      return;
    }

    if (window.isSecureContext && navigator.clipboard?.writeText) {
      void navigator.clipboard
        .writeText(offerUrl)
        .then(() => {
          window.alert("Offer URL copied.");
        })
        .catch(() => {
          window.prompt("Copy this offer URL:", offerUrl);
        });
      return;
    }

    window.prompt("Copy this offer URL:", offerUrl);
  };

  return (
    <Card className="doorframe-wide border-none bg-white/95 shadow-sm">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="headline-display text-xl font-semibold text-flent-black">
          Offer step tracking
        </CardTitle>
        <p className="text-sm text-flent-brown">
          Email opens, agreement flow, onboarding, and the commercial terms sent to each landlord.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && <div className="text-sm font-medium text-flent-brown">Loading…</div>}
        {error && <div className="text-sm font-medium text-red-700">{error}</div>}
        {!loading && !error && (
          <>
            {counts && (
              <div className="rounded-lg border border-flent-pastel-brown/40 bg-white px-4 py-3">
                <div className="flex flex-row flex-wrap items-start gap-x-10 gap-y-3">
                  <div className="min-w-[170px] flex-shrink-0 space-y-1">
                    <div className="text-[12px] font-semibold text-flent-brown">Total offers</div>
                    <div className="text-xl font-semibold text-flent-black">{counts.total.toLocaleString("en-IN")}</div>
                  </div>
                  <div className="min-w-[170px] flex-shrink-0 space-y-1">
                    <div className="text-[12px] font-semibold text-flent-brown">Pending (agreed=false)</div>
                    <div className="text-xl font-semibold text-flent-black">{counts.pending.toLocaleString("en-IN")}</div>
                  </div>
                  <div className="min-w-[170px] flex-shrink-0 space-y-1">
                    <div className="text-[12px] font-semibold text-flent-brown">Accepted (agreed=true)</div>
                    <div className="text-xl font-semibold text-flent-black">{counts.accepted.toLocaleString("en-IN")}</div>
                  </div>
                </div>

                {creatorFilter !== "all" && (
                  <div className="mt-4 rounded-md border border-flent-pastel-brown/30 bg-[#f0efe8] px-3 py-2">
                    <div className="text-[12px] font-semibold text-flent-brown">
                      Offer Created By: <span className="font-bold text-flent-black">{creatorFilter}</span>
                    </div>
                    <div className="mt-2 flex flex-row flex-wrap items-stretch gap-4">
                      <div className="min-w-[150px] space-y-1">
                        <div className="text-[12px] font-semibold text-flent-brown">Creator total</div>
                        <div className="text-lg font-semibold text-flent-black">
                          {(creatorCounts?.total ?? 0).toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div className="min-w-[150px] space-y-1">
                        <div className="text-[12px] font-semibold text-flent-brown">Pending</div>
                        <div className="text-lg font-semibold text-flent-black">
                          {(creatorCounts?.pending ?? 0).toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div className="min-w-[150px] space-y-1">
                        <div className="text-[12px] font-semibold text-flent-brown">Accepted</div>
                        <div className="text-lg font-semibold text-flent-black">
                          {(creatorCounts?.accepted ?? 0).toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <label className="sr-only" htmlFor="admin-offers-search">
                  Search by landlord, email, or creator
                </label>
                <Input
                  id="admin-offers-search"
                  type="search"
                  placeholder="Search landlord, email, or creator…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-md border-flent-pastel-brown bg-white text-sm"
                />
                <label className="sr-only" htmlFor="admin-offers-creator">
                  Filter by creator
                </label>
                <select
                  id="admin-offers-creator"
                  value={creatorFilter}
                  onChange={(e) => setCreatorFilter(e.target.value as "all" | string)}
                  className="h-9 min-w-[200px] rounded-md border border-flent-pastel-brown bg-white px-3 text-sm text-flent-black shadow-sm focus-visible:outline focus-visible:ring-2 focus-visible:ring-flent-brown/30"
                >
                  <option value="all">All creators</option>
                  {creatorOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <label className="sr-only" htmlFor="admin-offers-status">
                  Filter by offer status
                </label>
                <select
                  id="admin-offers-status"
                  value={offerStatusFilter}
                  onChange={(e) =>
                    setOfferStatusFilter(
                      e.target.value as "all" | "Active" | "Expired" | "Agreed",
                    )
                  }
                  className="h-9 min-w-[180px] rounded-md border border-flent-pastel-brown bg-white px-3 text-sm text-flent-black shadow-sm focus-visible:outline focus-visible:ring-2 focus-visible:ring-flent-brown/30"
                >
                  <option value="all">All statuses</option>
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                  <option value="Agreed">Agreed</option>
                </select>
              </div>
              <div className="text-xs font-medium text-flent-brown/90">
                Showing {filteredRows.length} of {rows.length} offers
              </div>
            </div>
            <div className="overflow-x-auto rounded-lg border border-flent-pastel-brown/40">
              <table className="w-full min-w-[3180px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-flent-pastel-brown/80 bg-[#f0efe8]">
                    <th
                      colSpan={9}
                      className="sticky left-0 z-40 border-r border-flent-pastel-brown/50 px-2 py-2 text-left text-[12px] font-bold uppercase tracking-wider text-flent-brown shadow-[2px_0_6px_-2px_rgba(0,0,0,0.06)]"
                      style={{ minWidth: LANDLORD_SECTION_WIDTH_PX, maxWidth: LANDLORD_SECTION_WIDTH_PX }}
                    >
                      Landlord details
                    </th>
                    <th
                      colSpan={4}
                      className="px-2 py-2 text-left text-[12px] font-bold uppercase tracking-wider text-flent-brown"
                    >
                      Tracking
                    </th>
                    <th
                      colSpan={13}
                      className="px-2 py-2 text-left text-[12px] font-bold uppercase tracking-wider text-flent-brown"
                    >
                      Commercials
                    </th>
                  </tr>
                  <tr className="border-b border-flent-pastel-brown/80 bg-[#f0efe8]">
                    <th className={`${stickyLandlordTheadClass(0)} px-2 py-3 font-semibold text-flent-brown`}>
                      Landlord name
                    </th>
                    <th className={`${stickyLandlordTheadClass(1)} px-2 py-3 font-semibold text-flent-brown`}>
                      Property name
                    </th>
                    <th className={`${stickyLandlordTheadClass(2)} px-2 py-3 font-semibold text-flent-brown`}>
                      Google Maps link
                    </th>
                    <th className={`${stickyLandlordTheadClass(3)} px-2 py-3 font-semibold text-flent-brown`}>
                      Landlord email
                    </th>
                    <th className={`${stickyLandlordTheadClass(4)} px-2 py-3 font-semibold text-flent-brown`}>
                      WhatsApp number
                    </th>
                    <th className={`${stickyLandlordTheadClass(5)} px-2 py-3 font-semibold text-flent-brown`}>
                      Created
                    </th>
                    <th className={`${stickyLandlordTheadClass(6)} px-2 py-3 font-semibold text-flent-brown`}>
                      Offer link
                    </th>
                    <th className={`${stickyLandlordTheadClass(7)} px-2 py-3 font-semibold text-flent-brown`}>
                      Copy link
                    </th>
                    <th className={`${stickyLandlordTheadClass(8)} px-2 py-3 font-semibold text-flent-brown`}>
                      Created by
                    </th>
                    <th className="min-w-[140px] px-2 py-3 font-semibold text-flent-brown">
                      Offer Status
                    </th>
                    <th className="min-w-[220px] px-2 py-3 font-semibold text-flent-brown">1st email</th>
                    <th className="min-w-[220px] px-2 py-3 font-semibold text-flent-brown">2nd email</th>
                    <th className="min-w-[220px] px-2 py-3 font-semibold text-flent-brown">Onboarding Typeform</th>
                    <th className="px-2 py-3 font-semibold text-flent-brown">Property type</th>
                    <th className="px-2 py-3 font-semibold text-flent-brown">Furnishing</th>
                    <th className="min-w-[120px] px-2 py-3 font-semibold text-flent-brown">Parking</th>
                    <th className="whitespace-nowrap px-2 py-3 font-semibold text-flent-brown">Rent</th>
                    <th className="whitespace-nowrap px-2 py-3 font-semibold text-flent-brown">Security deposit</th>
                    <th className="min-w-[100px] px-2 py-3 font-semibold text-flent-brown">Service term</th>
                    <th className="min-w-[100px] px-2 py-3 font-semibold text-flent-brown">Rent increment</th>
                    <th className="whitespace-nowrap px-2 py-3 font-semibold text-flent-brown">Key handover</th>
                    <th className="min-w-[100px] px-2 py-3 font-semibold text-flent-brown">Rent-free period</th>
                    <th className="whitespace-nowrap px-2 py-3 font-semibold text-flent-brown">Rent start</th>
                    <th className="whitespace-nowrap px-2 py-3 font-semibold text-flent-brown">
                      Maintenance
                    </th>
                    <th className="min-w-[120px] whitespace-nowrap px-2 py-3 font-semibold text-flent-brown">
                      Partnership Association Bonus
                    </th>
                    <th className="px-2 py-3 font-semibold text-flent-brown">Notice period</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr
                      key={row.id}
                      className="group border-t border-flent-pastel-brown/50 align-top hover:bg-[#faf9f6]"
                    >
                      <td className={`${stickyLandlordTdClass(0)} px-2 py-4`}>
                        <div className="font-semibold text-flent-black">{row.landlord_name}</div>
                      </td>
                      <td className={`${stickyLandlordTdClass(1)} px-2 py-4`}>
                        <div className="font-medium text-flent-black/90">{row.property_name}</div>
                      </td>
                      <td className={`${stickyLandlordTdClass(2)} px-2 py-4`}>
                        {row.google_maps_address_link?.trim() ? (
                          <Link
                            href={row.google_maps_address_link}
                            className="text-[12px] font-medium text-flent-brown underline underline-offset-2"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open map
                          </Link>
                        ) : (
                          <div className="text-[12px] font-medium text-flent-black/80">—</div>
                        )}
                      </td>
                      <td className={`${stickyLandlordTdClass(3)} px-2 py-4`}>
                        <div className="text-[12px] font-medium text-flent-black/80">{row.landlord_email}</div>
                      </td>
                      <td className={`${stickyLandlordTdClass(4)} px-2 py-4`}>
                        <div className="text-[12px] font-medium text-flent-black/80">
                          {row.landlord_whatsapp_number?.trim() ? row.landlord_whatsapp_number : "—"}
                        </div>
                      </td>
                      <td className={`${stickyLandlordTdClass(5)} px-2 py-4`}>
                        <div className="whitespace-nowrap text-[12px] font-medium text-flent-black/90">
                          {formatMaybeIso(row.created_at)}
                        </div>
                      </td>
                      <td className={`${stickyLandlordTdClass(6)} px-2 py-4 align-middle`}>
                        <Link
                          href={getOfferHref(row.id)}
                          className="cta-button cta-button--sm inline-flex"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View offer
                        </Link>
                      </td>
                      <td className={`${stickyLandlordTdClass(7)} px-2 py-4 align-middle`}>
                        <button
                          type="button"
                          aria-label="Copy offer link"
                          title="Copy offer link"
                          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-flent-pastel-brown text-flent-brown hover:border-flent-brown"
                          onClick={() => {
                            copyOfferUrl(row.id);
                          }}
                        >
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="9"
                              y="3"
                              width="12"
                              height="12"
                              rx="3"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M15 21H7a4 4 0 0 1-4-4V9"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </td>
                      <td className={`${stickyLandlordTdClass(8)} px-2 py-4 text-[12px] font-medium text-flent-black/90`}>
                        {row.created_by?.trim() ? row.created_by : "—"}
                      </td>
                      <td className="min-w-[140px] px-2 py-4">
                        {(() => {
                          const offerStatus = getOfferStatus(row);
                          const statusBg =
                            offerStatus === "Agreed"
                              ? STATUS_GREEN
                              : offerStatus === "Expired"
                                ? STATUS_RED
                                : STATUS_YELLOW;
                          return (
                            <span style={statusPillStyle(statusBg, offerStatus === "Active")}>
                              {offerStatus}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="min-w-[220px] px-2 py-4">
                        <StatusBlock
                          sentAt={row.first_email_sent_at}
                          openedAt={row.first_email_opened_at}
                          clickedAt={row.first_email_clicked_at}
                        />
                      </td>
                      <td className="min-w-[220px] px-2 py-4">
                        <StatusBlock
                          sentAt={row.agree_email_sent_at}
                          openedAt={row.agree_email_opened_at}
                          clickedAt={row.agree_email_clicked_at}
                        />
                      </td>
                      <td className="min-w-[220px] px-2 py-4">
                      {(() => {
                        const completedText = row.onboarding_completed ? "Yes" : "No";
                        const completedBg = row.onboarding_completed
                          ? STATUS_GREEN
                          : STATUS_YELLOW;
                        const completedAtText = formatMaybeIso(row.onboarding_completed_at);
                        const completedAtIsRealDate = completedAtText !== "—";
                        const completedAtBg = completedAtIsRealDate ? STATUS_GREEN : STATUS_YELLOW;

                        return (
                          <div className="space-y-1">
                            <div className="whitespace-nowrap text-[12px] font-semibold text-flent-brown">
                              <span style={statusPillStyle(completedBg, !row.onboarding_completed)}>
                                Completed
                              </span>
                              {": "}
                              <span className="font-normal text-flent-black/80">
                                {completedText}
                              </span>
                            </div>
                            <div className="whitespace-nowrap text-[12px] font-semibold text-flent-brown">
                              <span style={statusPillStyle(completedAtBg, !completedAtIsRealDate)}>
                                Completed at
                              </span>
                              {": "}
                              <span className="font-normal text-flent-black/80">
                                {completedAtText}
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </td>
                      <td className="max-w-[140px] px-2 py-4 text-[12px] text-flent-black/90">
                        {row.property_type || "—"}
                      </td>
                      <td className="max-w-[120px] px-2 py-4 text-[12px] text-flent-black/90">
                        {row.furnishing_state || "—"}
                      </td>
                      <td
                        className="max-w-[160px] px-2 py-4 text-[12px] break-words text-flent-black/90"
                        title={row.parking || undefined}
                      >
                        {row.parking || "—"}
                      </td>
                      <td className="whitespace-nowrap px-2 py-4 text-[12px] font-medium text-flent-black/90">
                        {formatCurrency(Number(row.rent_amount))}
                      </td>
                      <td className="whitespace-nowrap px-2 py-4 text-[12px] font-medium text-flent-black/90">
                        {formatCurrency(Number(row.security_deposit))}
                      </td>
                      <td className="max-w-[120px] px-2 py-4 text-[12px] text-flent-black/90">
                        {row.service_term || "—"}
                      </td>
                      <td className="max-w-[120px] px-2 py-4 text-[12px] text-flent-black/90">
                        {row.rent_increment || "—"}
                      </td>
                      <td className="whitespace-nowrap px-2 py-4 text-[12px] text-flent-black/90">
                        {formatDateOnly(row.key_handover_date)}
                      </td>
                      <td className="max-w-[120px] px-2 py-4 text-[12px] text-flent-black/90">
                        {row.rent_free_period || "—"}
                      </td>
                      <td className="whitespace-nowrap px-2 py-4 text-[12px] text-flent-black/90">
                        {formatDateOnly(row.rent_start_date)}
                      </td>
                      <td className="max-w-[140px] px-2 py-4 text-[12px] font-medium text-flent-black/90">
                        {(() => {
                          const raw = row.maintenance;
                          if (raw == null || String(raw).trim() === "") return "—";
                          const s = String(raw).trim();
                          if (s === "As per actuals") return s;
                          const n = Number(s);
                          return Number.isFinite(n) ? formatCurrency(n) : s;
                        })()}
                      </td>
                      <td className="max-w-[140px] whitespace-nowrap px-2 py-4 text-[12px] font-medium text-flent-black/90">
                        {(() => {
                          const raw = row.partnership_association_bonus_amount;
                          if (raw == null || raw === "") return "—";
                          const n = Number(raw);
                          return Number.isFinite(n) ? formatCurrency(n) : "—";
                        })()}
                      </td>
                      <td className="max-w-[100px] px-2 py-4 text-[12px] text-flent-black/90">
                        {row.notice_period || "—"}
                      </td>
                    </tr>
                  ))}
                  {!rows.length && (
                    <tr>
                      <td colSpan={COL_COUNT} className="px-2 py-6 text-sm font-medium text-flent-brown/80">
                        No offers yet.
                      </td>
                    </tr>
                  )}
                  {!!rows.length && !filteredRows.length && (
                    <tr>
                      <td colSpan={COL_COUNT} className="px-2 py-6 text-sm font-medium text-flent-brown/80">
                        No offers match your search or creator filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
