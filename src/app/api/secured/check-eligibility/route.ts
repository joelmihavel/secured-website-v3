import { NextRequest, NextResponse } from "next/server";

const ELIGIBLE_AREAS = new Set([
  "Bellandur", "Domlur", "HSR Layout", "Indiranagar", "Kalyan Nagar",
  "Koramangala", "MG Road", "Old Airport Road", "Sadashivanagar",
  "Sarjapur Road", "Ulsoor", "Whitefield", "Marathahalli", "Hebbal",
  "Frazer Town", "Malleswaram",
]);

function fuzzyMatchArea(input: string): boolean {
  const lower = input.toLowerCase().trim();
  for (const area of ELIGIBLE_AREAS) {
    if (lower.includes(area.toLowerCase()) || area.toLowerCase().includes(lower)) {
      return true;
    }
  }
  return false;
}

export async function POST(req: NextRequest) {
  const { area, bhk, rent } = await req.json();

  if (!area || !bhk || typeof rent !== "number") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const bedroomCount = parseInt(bhk) || 1;
  const inCoverage = fuzzyMatchArea(area);
  const eligible = inCoverage && rent / bedroomCount > 18000;

  return NextResponse.json({ eligible, inCoverage });
}
