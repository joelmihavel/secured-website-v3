import { createClient } from "@supabase/supabase-js";

// Build-time pre-render so the first user never pays a function cold start
// or a live Supabase round-trip. Combined with revalidate=21600 (6 hours),
// the response refreshes only a few times per day via ISR while staying
// CDN-edge-cacheable. Property data changes rarely, so 6h staleness is
// effectively invisible to users and keeps Vercel ISR write costs minimal.
export const dynamic = "force-static";
export const revalidate = 21600;

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

  const buildings = data
    .filter((row) => {
      const bedrooms = parseInt(row.configuration) || 1;
      return row.rent / bedrooms >= 18000;
    })
    .map((row) => ({
      id: row.id,
      area: row.area,
      bhk: row.configuration,
      rent: row.rent,
      cashback: Math.round(row.rent * 0.01) * 12,
      lat: row.lat,
      lng: row.lng,
    }));

  return Response.json(buildings, {
    headers: {
      // Browser: reuse for 5 min before revalidating (data turns over rarely).
      // CDN edge: keep for 6 h, serve stale for a day while regenerating.
      "Cache-Control":
        "public, max-age=300, s-maxage=21600, stale-while-revalidate=86400",
      "CDN-Cache-Control": "public, s-maxage=21600",
    },
  });
}
