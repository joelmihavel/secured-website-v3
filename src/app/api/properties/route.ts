import { createClient } from "@supabase/supabase-js";

export const revalidate = 300; // 5-minute cache

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SECURED_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SECURED_SUPABASE_PUBLISHABLE_KEY!;
  return createClient(url, key);
}

export async function GET() {
  const { data, error } = await getSupabase()
    .from("maps_properties")
    .select("id, society_name, area, configuration, rent, lat, lng")
    .not("lat", "is", null)
    .not("lng", "is", null);

  if (error || !data) {
    return Response.json({ error: error?.message, url: !!process.env.NEXT_PUBLIC_SECURED_SUPABASE_URL, key: !!process.env.NEXT_PUBLIC_SECURED_SUPABASE_PUBLISHABLE_KEY }, { status: 500 });
  }

  const buildings = data.map((row, i) => ({
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
