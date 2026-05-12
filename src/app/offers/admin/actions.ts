"use server";

import { redirect } from "next/navigation";
import { createServerClient } from "@/app/offers/_lib/supabase/server";
import type { OfferInsert } from "@/app/offers/_types/offer";
import { Resend } from "resend";
import {
  clearAdminAuthCookie,
  isAdminAuthenticated,
  setAdminAuthCookie,
  verifyAdminPassword,
} from "./auth";

export async function loginAdmin(formData: FormData): Promise<void> {
  const password = formData.get("password");
  if (typeof password !== "string") {
    redirect("/offers/admin?error=invalid_password");
  }

  const isValid = await verifyAdminPassword(password.trim());
  if (!isValid) {
    redirect("/offers/admin?error=invalid_password");
  }

  await setAdminAuthCookie();
  redirect("/offers/admin");
}

export async function logoutAdmin(): Promise<void> {
  await clearAdminAuthCookie();
  redirect("/offers/admin");
}

/** Public HTTPS URL so images load in email clients (localhost / preview URLs do not). */
const FLENT_EMAIL_LOGO_URL = "https://www.flent.in/flent-logo-black.png";

function normalizeBaseUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed.replace(/\/+$/, "");
  }
  return `https://${trimmed.replace(/\/+$/, "")}`;
}

function getOfferBaseUrl(): string {
  const configured =
    normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL) ||
    normalizeBaseUrl(process.env.APP_URL) ||
    normalizeBaseUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    normalizeBaseUrl(process.env.VERCEL_URL);

  if (configured) return configured;
  if (process.env.NODE_ENV !== "production") return "http://localhost:3000";
  throw new Error(
    "Missing app base URL. Set NEXT_PUBLIC_APP_URL or APP_URL in environment."
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatOfferEmailHtml(params: {
  landlord_name: string;
  property_name: string;
  offerUrl: string;
}): string {
  const { landlord_name, property_name, offerUrl } = params;
  const safeName = escapeHtml(landlord_name);
  const safeProperty = escapeHtml(property_name);
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; color: #000000; line-height: 1.55; max-width: 560px; font-size: 15px;">
      <p style="margin: 0 0 16px; font-size: 15px; color: #000000;">Hello ${safeName},</p>
      <p style="margin: 0 0 16px; font-size: 15px; color: #000000;">
        We've put together your personalised Flent offer for your property at <strong>${safeProperty}</strong> — and we think you'll like what you see.
      </p>
      <p style="margin: 0 0 16px; font-size: 15px; color: #000000;">
        At Flent, our job is simple: make sure your home is always looked after, your rent arrives on time every month, and you never have to chase anyone for anything.
      </p>
      <p style="margin: 0 0 20px; font-size: 15px; color: #000000;">
        Your offer is ready to view. Go through it at your own pace, and if anything needs clarifying, we're just a message away. Although please note that this is a time-bound offer &amp; it will <strong>expire in 48 hours</strong> if it remains unaccepted.
      </p>
      <a href="${offerUrl}" style="display: inline-block; background: #111827; color: #ffffff; text-decoration: none; padding: 12px 22px; border-radius: 0 14px 14px 0; border: 2px solid #ffffff; font-weight: 600; font-size: 15px;">
        View Your Offer →
      </a>
      <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 15px; color: #000000;">
        <p style="margin: 0 0 4px; color: #000000;">Regards,</p>
        <p style="margin: 0 0 4px; color: #000000;">Supply Growth Team,</p>
        <p style="margin: 0 0 12px; color: #000000;">Flent</p>
        <p style="margin: 0 0 4px; color: #000000; font-style: italic;">Why rent, when you can Flent?</p>
        <p style="margin: 0 0 20px;"><a href="https://www.flent.in" style="color: #000000; text-decoration: underline;">www.flent.in</a></p>
        <img src="${FLENT_EMAIL_LOGO_URL}" alt="Flent logo" style="display: block; width: 96px; height: auto;" />
      </div>
    </div>
  `;
}

export async function sendOfferEmail(params: {
  landlord_name: string;
  landlord_email: string;
  property_name: string;
  offerId: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY missing");
  }

  const resend = new Resend(resendApiKey);
  const offerUrl = `${getOfferBaseUrl()}/offers/offer/${params.offerId}`;
  const html = formatOfferEmailHtml({
    landlord_name: params.landlord_name,
    property_name: params.property_name,
    offerUrl,
  });
  const subject = `Your Flent Offer for ${params.property_name} is ready! | Flent`;
  console.info(
    `createOffer: attempting email send to ${params.landlord_email} for offer ${params.offerId}`
  );
  const { data, error } = await resend.emails.send({
    from: "Flent <landlords@email.flent.in>",
    to: params.landlord_email,
    cc: ["homeowners@flent.in", "ashish@flent.in"],
    replyTo: "ashish@flent.in",
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
  console.info(
    `createOffer: email sent to ${params.landlord_email} for offer ${params.offerId} (id: ${data?.id ?? "n/a"})`
  );

  const messageId = data?.id ?? null;
  return { ok: true as const, messageId };
}

export type CreateOfferResult =
  | {
      success: true;
      id: string;
      offerUrl: string;
      emailSent: boolean;
      emailError?: string;
    }
  | { success: false; error: string };

export async function createOffer(formData: OfferInsert): Promise<CreateOfferResult> {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return { success: false, error: "Unauthorized. Please log in again." };
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("offers")
      .insert({
        landlord_name: formData.landlord_name,
        landlord_email: formData.landlord_email,
        landlord_whatsapp_number: formData.landlord_whatsapp_number,
        google_maps_address_link: formData.google_maps_address_link,
        created_by: formData.created_by,
        property_name: formData.property_name,
        property_type: formData.property_type,
        furnishing_state: formData.furnishing_state,
        parking: formData.parking,
        rent_amount: formData.rent_amount,
        security_deposit: formData.security_deposit,
        service_term: formData.service_term,
        rent_increment: formData.rent_increment,
        key_handover_date: formData.key_handover_date,
        rent_free_period: formData.rent_free_period,
        rent_start_date: formData.rent_start_date,
        maintenance: formData.maintenance,
        partnership_association_bonus_amount: formData.partnership_association_bonus_amount,
        notice_period: formData.notice_period,
        selected_terms: formData.selected_terms,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, error: error.message };
    }

    if (!data?.id) {
      return { success: false, error: "No id returned from insert" };
    }

    const offerUrl = `${getOfferBaseUrl()}/offers/offer/${data.id}`;
    let emailSent = false;
    let emailErrorMessage: string | undefined;
    let firstEmailMessageId: string | null = null;
    try {
      const emailResult = await sendOfferEmail({
        landlord_name: formData.landlord_name,
        landlord_email: formData.landlord_email,
        property_name: formData.property_name,
        offerId: data.id,
      });
      firstEmailMessageId = emailResult.messageId;
      emailSent = true;
    } catch (emailError) {
      console.error("Resend email error:", emailError);
      emailErrorMessage =
        emailError instanceof Error ? emailError.message : "Unknown email error";
    }

    // Store send timestamp for admin visibility.
    // Also persist message id (if present) for webhook correlation.
    if (emailSent) {
      const sentAtIso = new Date().toISOString();

      const { error: sentAtUpdateError } = await supabase
        .from("offers")
        .update({ first_email_sent_at: sentAtIso })
        .eq("id", data.id)
        .is("first_email_sent_at", null);

      if (sentAtUpdateError) {
        console.error(
          `createOffer: failed to persist first email sent_at for offer ${data.id}:`,
          sentAtUpdateError
        );
      }

      if (firstEmailMessageId) {
        const { error: messageIdUpdateError } = await supabase
          .from("offers")
          .update({ first_email_message_id: firstEmailMessageId })
          .eq("id", data.id)
          .is("first_email_message_id", null);

        if (messageIdUpdateError) {
          console.error(
            `createOffer: failed to persist first email message_id for offer ${data.id}:`,
            messageIdUpdateError
          );
        }
      }
    }

    return {
      success: true,
      id: data.id,
      offerUrl,
      emailSent,
      emailError: emailErrorMessage,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: message };
  }
}
