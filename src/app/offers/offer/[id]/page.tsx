import { createServerClient } from "@/app/offers/_lib/supabase/server";
import { notFound } from "next/navigation";
import { OfferWizard } from "./offer-wizard";
import type { Offer } from "@/app/offers/_types/offer";

async function getOffer(id: string): Promise<Offer | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  const row = data as Record<string, unknown>;
  return {
    id: row.id as string,
    landlord_name: row.landlord_name as string,
    landlord_email: row.landlord_email as string,
    created_by: row.created_by != null ? String(row.created_by) : null,
    property_name: row.property_name as string,
    property_type: row.property_type as string,
    furnishing_state: String(row.furnishing_state ?? ""),
    parking: String(row.parking ?? ""),
    rent_amount: Number(row.rent_amount),
    security_deposit: Number(row.security_deposit),
    service_term: row.service_term as string,
    rent_increment: row.rent_increment as string,
    key_handover_date: row.key_handover_date as string,
    rent_free_period: row.rent_free_period as string,
    rent_start_date: row.rent_start_date as string,
    maintenance: String(row.maintenance ?? ""),
    partnership_association_bonus_amount: (() => {
      const v = row.partnership_association_bonus_amount;
      if (v == null || v === "") return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    })(),
    lock_in: row.lock_in != null ? String(row.lock_in) : "",
    notice_period: row.notice_period as string,
    selected_terms: Array.isArray(row.selected_terms) ? (row.selected_terms as string[]) : [],
    agreed: Boolean(row.agreed),
    agreed_at: row.agreed_at != null ? String(row.agreed_at) : null,
    created_at: row.created_at as string,
  };
}

export default async function OfferPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const offer = await getOffer(id);
  if (!offer) notFound();
  return <OfferWizard offer={offer} />;
}
