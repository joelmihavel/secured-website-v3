import { NextRequest, NextResponse } from "next/server";
import { REAL_BUILDINGS } from "@/components/secured/data/real-buildings";

// Pure-CPU haversine + comparison: ideal for the edge runtime.
// The /secured client now computes eligibility synchronously from the loaded
// building list and bypasses this route, so this only runs for direct API
// callers — but if it does run, edge in Mumbai/Singapore makes it ~80ms
// instead of ~800ms for Indian users vs the default Node lambda in iad1.
export const runtime = "edge";
export const preferredRegion = ["bom1", "sin1"];

const COVERAGE_RADIUS_KM = 3;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function isNearProperties(lat: number, lng: number): boolean {
  return REAL_BUILDINGS.some((b) => haversineKm(lat, lng, b.lat, b.lng) <= COVERAGE_RADIUS_KM);
}

export async function POST(req: NextRequest) {
  const { bhk, rent, coords } = await req.json();

  if (!bhk || typeof rent !== "number") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const bedroomCount = parseInt(bhk) || 1;
  const inCoverage = coords?.lat && coords?.lng ? isNearProperties(coords.lat, coords.lng) : false;
  const eligible = inCoverage && rent / bedroomCount > 18000;

  return NextResponse.json({ eligible, inCoverage });
}
