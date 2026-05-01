import { createClient } from "@supabase/supabase-js";

// Build-time pre-render so the first user never pays a function cold start
// or a live Supabase round-trip. Combined with revalidate=300, the response
// refreshes every 5 minutes via ISR while staying CDN-edge-cacheable.
export const dynamic = "force-static";
export const revalidate = 300;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SECURED_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SECURED_SUPABASE_PUBLISHABLE_KEY!;
  return createClient(url, key);
}

export async function GET() {
  const { data, error } = await getSupabase()
    .from("maps_properties")
    .select("id, area, configuration, rent, lat, lng")
    .not("lat", "is", null)
    .not("lng", "is", null);

  if (error || !data) {
    return Response.json([], { status: 500 });
  }

  const buildings = data.map((row) => ({
    id: row.id,
    area: row.area,
    bhk: row.configuration,
    rent: row.rent,
    cashback: Math.round(row.rent * 0.01) * 12,
    lat: row.lat,
    lng: row.lng,
  }));

  return Response.json(buildings);
}
