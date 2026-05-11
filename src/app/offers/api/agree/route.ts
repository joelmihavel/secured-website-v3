import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerClient } from "@/app/offers/_lib/supabase/server";

const TYPEFORM_URL = "https://flent.typeform.com/to/TfSGfvX0";
const DRAFT_TRIPARTITE_LEAVE_LICENSE_URL =
  "https://docs.google.com/document/d/1F90TjIIJcQLKf39m4PABS2krB78hQSELcFr73rVZ8nU/edit?usp=sharing";
const DRAFT_AGREEMENT_URL =
  "https://docs.google.com/document/d/11vcofm8uWhjQ3iq82mHq2jPEW7fuWt9k/edit";

/** Public HTTPS URL so images load in email clients (localhost / preview URLs do not). */
const FLENT_EMAIL_LOGO_URL = "https://www.flent.in/flent-logo-black.png";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDateInEmail(s: string): string {
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

function formatCurrencyInEmail(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatMaintenanceInEmail(raw: string): string {
  const t = raw.trim();
  if (!t) return "—";
  if (t === "As per actuals") return t;
  const n = Number(t);
  if (Number.isFinite(n)) return formatCurrencyInEmail(n);
  return t;
}

function formatAgreedAtIST(iso: string): string {
  const d = new Date(iso);
  const formatted = d.toLocaleString("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${formatted} IST`;
}

type OfferRow = {
  id: string;
  landlord_name: string;
  landlord_email: string;
  property_name: string;
  property_type: string;
  furnishing_state?: string;
  parking?: string;
  rent_amount: number;
  security_deposit: number;
  service_term: string;
  rent_increment: string;
  key_handover_date: string;
  rent_start_date: string;
  rent_free_period: string;
  maintenance?: string | null;
  partnership_association_bonus_amount?: number | string | null;
  notice_period: string;
  selected_terms: unknown;
  agreed: boolean;
  created_at: string;
};

const OFFER_EXPIRY_WINDOW_MS = 48 * 60 * 60 * 1000;

function buildConfirmationEmailHtml(params: {
  landlordName: string;
  propertyName: string;
  propertyType: string;
  furnishingState: string;
  parking: string;
  rentAmount: number;
  securityDeposit: number;
  serviceTerm: string;
  rentIncrement: string;
  keyHandoverDate: string;
  rentStartDate: string;
  rentFreePeriod: string;
  maintenance: string;
  noticePeriod: string;
  partnershipAssociationBonusAmount: number | null;
  terms: string[];
  agreedAtIso: string;
}): string {
  const {
    landlordName,
    propertyName,
    propertyType,
    furnishingState,
    parking,
    rentAmount,
    securityDeposit,
    maintenance,
    serviceTerm,
    rentIncrement,
    keyHandoverDate,
    rentStartDate,
    rentFreePeriod,
    noticePeriod,
    partnershipAssociationBonusAmount,
    terms,
    agreedAtIso,
  } = params;

  const safeName = escapeHtml(landlordName);
  const safeProperty = escapeHtml(propertyName);
  const when = formatAgreedAtIST(agreedAtIso);
  const logoUrl = FLENT_EMAIL_LOGO_URL;

  const termItems = terms.length
    ? terms.map((t) => `<li style="margin:0 0 8px;">${escapeHtml(t)}</li>`).join("")
    : `<li style="margin:0;">No additional terms selected.</li>`;

  const commercialPrefix: [string, string][] = [
    ["Property name / address", propertyName],
    ["Property type", propertyType],
    ["Furnishing state", furnishingState],
    ["Parking", parking],
    ["Monthly rent (₹)", formatCurrencyInEmail(rentAmount)],
    ["Security deposit (₹)", formatCurrencyInEmail(securityDeposit)],
    ["Maintenance", formatMaintenanceInEmail(maintenance)],
  ];

  const partnershipBonusRows: [string, string][] =
    partnershipAssociationBonusAmount != null &&
    Number.isFinite(partnershipAssociationBonusAmount)
      ? [
          [
            "Partnership Association Bonus",
            formatCurrencyInEmail(partnershipAssociationBonusAmount),
          ],
        ]
      : [];

  const commercialAfterBonus: [string, string][] = [
    ["Service term", serviceTerm],
    ["Rent increment", rentIncrement],
    ["Key handover date", formatDateInEmail(keyHandoverDate)],
    ["Rent start date", formatDateInEmail(rentStartDate)],
    ["Rent-free period", rentFreePeriod],
    ["Notice period", noticePeriod],
  ];

  const commercialStaticRows: [string, string][] = [
    [
      "Metered Utilities",
      "Payable by tenants as per actuals. Flent will assist the tenants in this process.",
    ],
    [
      "Move-in/out formalities",
      "Charges and formalities are the tenants' responsibility (if any). Flent will coordinate with the society, assist the landlord and tenants in this process.",
    ],
    [
      "★ Important note",
      "Should there be any disagreement or inability to proceed with the mutually discussed repairs, we may have to discontinue the arrangement before the rent start date. In such a scenario, we would kindly request a full refund of the token or security deposit.",
    ],
  ];

  const commercialRows: [string, string][] = [
    ...commercialPrefix,
    ...partnershipBonusRows,
    ...commercialAfterBonus,
    ...commercialStaticRows,
  ];

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #000000; line-height: 1.55; max-width: 560px; font-size: 15px;">
      <p style="margin: 0 0 16px; font-size: 15px; color: #000000;">Hello ${safeName},</p>
      <p style="margin: 0 0 16px; font-size: 15px; color: #000000;">
        You've accepted the Flent partnership offer for your property at <strong>${safeProperty}</strong> on <strong>${escapeHtml(when)}</strong>, and we couldn't be more pleased to have you on board.
      </p>
      <p style="margin: 0 0 20px; font-size: 15px; color: #000000;">
        From here, we take the wheel — finding the right tenants, managing your home with care, and making sure your rent lands in your account like clockwork, every single month.
      </p>
      <p style="margin: 0 0 16px; font-size: 15px; color: #000000;">
        Below are the commercial terms you've agreed to, for your records.
      </p>
      <p style="margin: 0 0 10px; font-size: 15px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #000000;">Agreed commercial terms</p>
      <table style="width: 100%; border-collapse: collapse; margin: 0 0 24px; font-size: 15px;">
        <tbody>
          ${commercialRows
            .map(
              ([label, value]) =>
                `<tr>
                  <td style="padding: 8px 12px 8px 0; border-bottom: 1px solid #e5e7eb; color: #000000; vertical-align: top;">${escapeHtml(label)}</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #000000; font-weight: 600;">${escapeHtml(String(value))}</td>
                </tr>`
            )
            .join("")}
        </tbody>
      </table>
      <p style="margin: 0 0 10px; font-size: 15px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #000000;">Terms &amp; conditions mutually agreed upon</p>
      <ul style="margin: 0 0 24px; padding-left: 20px; font-size: 15px; color: #000000;">
        ${termItems}
      </ul>
      <p style="margin: 0 0 10px; font-size: 15px; font-weight: 700; color: #000000;">
        What's next?
      </p>
      <p style="margin: 0 0 6px; font-size: 15px; font-weight: 700; color: #000000;">Step 1</p>
      <p style="margin: 0 0 16px; font-size: 15px; color: #000000;">Complete Your Onboarding Form</p>
      <a href="${TYPEFORM_URL}" style="display: inline-block; background: #111827; color: #ffffff; text-decoration: none; padding: 12px 22px; border-radius: 0 14px 14px 0; border: 2px solid #ffffff; font-weight: 600; font-size: 15px;">
        Complete Onboarding Form →
      </a>
      <p style="margin: 24px 0 6px; font-size: 15px; font-weight: 700; color: #000000;">Step 2</p>
      <p style="margin: 0; font-size: 15px; font-weight: 700; color: #000000;">Token Transfer &amp; Authorization Agreement</p>
      <p style="margin: 10px 0 0; font-size: 15px; color: #000000;">
        Once your onboarding form is submitted, we'll transfer the token amount in your bank within 24 hours and share the authorization agreement with you, updated with your details, for your review. Upon approval, we'll initiate e-stamp and e-signing.
      </p>
      <p style="margin: 10px 0 0; font-size: 15px; color: #000000;">
        <a href="${DRAFT_AGREEMENT_URL}" style="color:rgb(0, 30, 255); text-decoration: underline;">View draft authorization agreement →</a>
      </p>
      <p style="margin: 16px 0 6px; font-size: 15px; font-weight: 700; color: #000000;">Step 3</p>
      <p style="margin: 0; font-size: 15px; font-weight: 700; color: #000000;">Tripartite Leave and License Agreement</p>
      <p style="margin: 16px 0 0; font-size: 15px; color: #000000;">
        Once the Authorization Agreement is signed &amp; the ideal tenant(s) is identified, Flent will share the tripartite leave and license agreement for your review and signature. You will also receive each registered tenant's profile, background verification report (which may take up to two weeks), and other supporting documentation.
      </p>
      <p style="margin: 10px 0 0; font-size: 15px; color: #000000;">
        <a href="${DRAFT_TRIPARTITE_LEAVE_LICENSE_URL}" style="color:rgb(0, 51, 255); text-decoration: underline;">View draft tripartite agreement →</a>
      </p>
      <p style="margin: 16px 0 0; font-size: 15px; color: #000000;">
        Our team ensures that all relevant details and updates are shared transparently with the landlord, society, and other stakeholders for a smooth onboarding experience.
      </p>
      <p style="margin: 10px 0 0; font-size: 15px; color: #000000;">
        This email serves as a record of your accepted terms. Please keep it for your reference.
      </p>
      <p style="margin: 10px 0 0; font-size: 15px; color: #000000;">
        We are here to answer all your questions, so feel free to email us with your questions at raghav@flent.in / ashish@flent.in or give us a call at +91 99801 15003.
      </p>
      <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 15px; color: #000000;">
        <p style="margin: 0 0 4px; color: #000000;">Regards,</p>
        <p style="margin: 0 0 4px; color: #000000;">Supply Growth Team,</p>
        <p style="margin: 0 0 12px; color: #000000;">Flent</p>
        <p style="margin: 0 0 4px; color: #000000; font-style: italic;">Why rent, when you can Flent?</p>
        <p style="margin: 0 0 20px;"><a href="https://www.flent.in" style="color: #000000; text-decoration: underline;">www.flent.in</a></p>
        <img src="${logoUrl}" alt="Flent logo" style="display: block; width: 96px; height: auto;" />
      </div>
    </div>
  `;
}

export async function POST(request: Request) {
  let body: { offerId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  const offerId = body.offerId;
  if (!offerId || typeof offerId !== "string") {
    return NextResponse.json(
      { success: false, error: "Missing offer id" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();
  const { data: row, error: fetchError } = await supabase
    .from("offers")
    .select("*")
    .eq("id", offerId)
    .single();

  if (fetchError || !row) {
    return NextResponse.json(
      { success: false, error: "Offer not found" },
      { status: 404 }
    );
  }

  const offer = row as OfferRow;
  const agreedAt = new Date().toISOString();

  if (offer.agreed) {
    return NextResponse.json({ success: true });
  }

  const createdAtMs = Date.parse(offer.created_at);
  if (!Number.isFinite(createdAtMs)) {
    return NextResponse.json(
      { success: false, error: "Offer expiry could not be validated" },
      { status: 500 }
    );
  }

  const offerExpiresAtMs = createdAtMs + OFFER_EXPIRY_WINDOW_MS;
  if (Date.now() >= offerExpiresAtMs) {
    return NextResponse.json(
      { success: false, expired: true, error: "Offer has expired" },
      { status: 410 }
    );
  }

  const { error: updateError } = await supabase
    .from("offers")
    .update({ agreed: true, agreed_at: agreedAt })
    .eq("id", offerId);

  if (updateError) {
    console.error("agree: Supabase update error:", updateError);
    return NextResponse.json(
      { success: false, error: updateError.message },
      { status: 500 }
    );
  }

  const termsRaw = offer.selected_terms;
  const terms = Array.isArray(termsRaw)
    ? (termsRaw as string[])
    : [];

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey && offer.landlord_email) {
    try {
      const resend = new Resend(resendApiKey);
      const rawBonus = offer.partnership_association_bonus_amount;
      const bonusParsed =
        rawBonus != null && rawBonus !== "" ? Number(rawBonus) : NaN;
      const partnershipAssociationBonusAmount = Number.isFinite(bonusParsed)
        ? bonusParsed
        : null;

      const html = buildConfirmationEmailHtml({
        landlordName: offer.landlord_name,
        propertyName: offer.property_name,
        propertyType: String(offer.property_type),
        furnishingState: String(offer.furnishing_state ?? ""),
        parking: String(offer.parking ?? ""),
        rentAmount: Number(offer.rent_amount),
        securityDeposit: Number(offer.security_deposit),
        maintenance: String(offer.maintenance ?? ""),
        serviceTerm: String(offer.service_term),
        rentIncrement: String(offer.rent_increment),
        keyHandoverDate: String(offer.key_handover_date),
        rentStartDate: String(offer.rent_start_date),
        rentFreePeriod: String(offer.rent_free_period),
        noticePeriod: String(offer.notice_period),
        partnershipAssociationBonusAmount,
        terms,
        agreedAtIso: agreedAt,
      });

      const { data: emailData, error: emailError } = await resend.emails.send({
        from: "Flent <landlords@email.flent.in>",
        to: offer.landlord_email,
        cc: ["homeowners@flent.in", "ashish@flent.in"],
        replyTo: "ashish@flent.in",
        subject: `Congratulations! Welcome to the Flent family, ${offer.landlord_name} 🎉`,
        html,
      });

      if (emailError) {
        console.error("agree: Resend error:", emailError);
      } else {
        // Persist send timestamp for admin visibility.
        // Persist message id (if present) for webhook correlation.
        const sentAtIso = new Date().toISOString();

        const { error: sentAtUpdateError } = await supabase
          .from("offers")
          .update({ agree_email_sent_at: sentAtIso })
          .eq("id", offerId)
          .is("agree_email_sent_at", null);

        if (sentAtUpdateError) {
          console.error(
            `agree: failed to persist agreement email sent_at for offer ${offerId}:`,
            sentAtUpdateError
          );
        }

        if (emailData?.id) {
          const { error: messageIdUpdateError } = await supabase
            .from("offers")
            .update({ agree_email_message_id: emailData.id })
            .eq("id", offerId)
            .is("agree_email_message_id", null);

          if (messageIdUpdateError) {
            console.error(
              `agree: failed to persist agreement email message_id for offer ${offerId}:`,
              messageIdUpdateError
            );
          }
        }
      }
    } catch (e) {
      console.error("agree: Resend send failed:", e);
    }
  } else if (!resendApiKey) {
    console.error("agree: RESEND_API_KEY missing; skipping confirmation email");
  } else if (!offer.landlord_email) {
    console.error("agree: landlord_email empty; skipping confirmation email");
  }

  return NextResponse.json({ success: true });
}
