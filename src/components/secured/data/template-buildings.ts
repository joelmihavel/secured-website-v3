import type { BhkType, RentRange, AreaRentRange, BuildingData } from "../ActivityMap";

export const BHK_TYPES: BhkType[] = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK"];

function buildBhkRanges(base: Omit<AreaRentRange, "byBhk">): AreaRentRange {
  const scale = (r: Omit<AreaRentRange, "byBhk">, factor: number): RentRange => ({
    min: Math.round((r.min * factor) / 1000) * 1000,
    max: Math.round((r.max * factor) / 1000) * 1000,
    median: Math.round((r.median * factor) / 1000) * 1000,
    p25: Math.round((r.p25 * factor) / 1000) * 1000,
    p75: Math.round((r.p75 * factor) / 1000) * 1000,
  });
  return {
    ...base,
    byBhk: {
      "1 BHK": scale(base, 0.55),
      "2 BHK": scale(base, 1),
      "3 BHK": scale(base, 1.5),
      "4 BHK": scale(base, 2.0),
      "5 BHK": scale(base, 2.5),
    },
  };
}

export const AREA_RENT_RANGES: AreaRentRange[] = [
  { area: "Banashankari", min: 8000, max: 35000, median: 18000, p25: 12000, p75: 25000 },
  { area: "Banaswadi", min: 9000, max: 38000, median: 20000, p25: 14000, p75: 28000 },
  { area: "Bannerghatta Road", min: 10000, max: 40000, median: 20000, p25: 14000, p75: 28000 },
  { area: "Basavanagudi", min: 10000, max: 42000, median: 22000, p25: 15000, p75: 30000 },
  { area: "Bellandur", min: 14000, max: 52000, median: 28000, p25: 19000, p75: 38000 },
  { area: "BTM Layout", min: 10000, max: 42000, median: 22000, p25: 15000, p75: 30000 },
  { area: "CV Raman Nagar", min: 10000, max: 40000, median: 22000, p25: 15000, p75: 30000 },
  { area: "Domlur", min: 16000, max: 58000, median: 32000, p25: 22000, p75: 42000 },
  { area: "Electronic City", min: 8000, max: 35000, median: 18000, p25: 12000, p75: 25000 },
  { area: "Frazer Town", min: 12000, max: 45000, median: 24000, p25: 16000, p75: 32000 },
  { area: "Hebbal", min: 10000, max: 45000, median: 24000, p25: 16000, p75: 33000 },
  { area: "HSR Layout", min: 14000, max: 50000, median: 26000, p25: 19000, p75: 35000 },
  { area: "Indiranagar", min: 18000, max: 65000, median: 35000, p25: 24000, p75: 48000 },
  { area: "Jalahalli", min: 7000, max: 28000, median: 15000, p25: 10000, p75: 20000 },
  { area: "Jayanagar", min: 10000, max: 40000, median: 22000, p25: 15000, p75: 30000 },
  { area: "JP Nagar", min: 10000, max: 40000, median: 21000, p25: 14000, p75: 28000 },
  { area: "Kalyan Nagar", min: 12000, max: 48000, median: 26000, p25: 18000, p75: 35000 },
  { area: "Kanakapura Road", min: 8000, max: 32000, median: 16000, p25: 11000, p75: 22000 },
  { area: "Koramangala", min: 15000, max: 60000, median: 32000, p25: 22000, p75: 45000 },
  { area: "KR Puram", min: 8000, max: 32000, median: 16000, p25: 11000, p75: 22000 },
  { area: "Malleswaram", min: 12000, max: 45000, median: 24000, p25: 16000, p75: 32000 },
  { area: "Marathahalli", min: 10000, max: 45000, median: 24000, p25: 16000, p75: 32000 },
  { area: "MG Road", min: 18000, max: 65000, median: 36000, p25: 25000, p75: 48000 },
  { area: "Nagarbhavi", min: 7000, max: 30000, median: 15000, p25: 10000, p75: 21000 },
  { area: "Old Airport Road", min: 14000, max: 50000, median: 28000, p25: 19000, p75: 38000 },
  { area: "Rajajinagar", min: 10000, max: 38000, median: 20000, p25: 14000, p75: 28000 },
  { area: "RT Nagar", min: 8000, max: 32000, median: 16000, p25: 11000, p75: 22000 },
  { area: "Sadashivanagar", min: 18000, max: 70000, median: 38000, p25: 26000, p75: 52000 },
  { area: "Sarjapur Road", min: 12000, max: 48000, median: 25000, p25: 17000, p75: 34000 },
  { area: "Thanisandra", min: 9000, max: 35000, median: 18000, p25: 12000, p75: 25000 },
  { area: "Ulsoor", min: 14000, max: 55000, median: 30000, p25: 20000, p75: 40000 },
  { area: "Vijayanagar", min: 8000, max: 32000, median: 16000, p25: 11000, p75: 22000 },
  { area: "Whitefield", min: 12000, max: 55000, median: 28000, p25: 18000, p75: 38000 },
  { area: "Yelahanka", min: 8000, max: 32000, median: 16000, p25: 11000, p75: 22000 },
  { area: "Yeshwanthpur", min: 9000, max: 36000, median: 19000, p25: 13000, p75: 26000 },
].map(buildBhkRanges);

export const AREA_COORDS: Record<string, [number, number]> = {
  "Banashankari": [77.5737, 12.9255],
  "Banaswadi": [77.6400, 13.0100],
  "Bannerghatta Road": [77.5969, 12.8876],
  "Basavanagudi": [77.5750, 12.9400],
  "Bellandur": [77.6762, 12.9256],
  "BTM Layout": [77.6101, 12.9166],
  "CV Raman Nagar": [77.6600, 12.9850],
  "Domlur": [77.6380, 12.9600],
  "Electronic City": [77.6770, 12.8399],
  "Frazer Town": [77.6150, 12.9950],
  "Hebbal": [77.5970, 13.0358],
  "HSR Layout": [77.6474, 12.9116],
  "Indiranagar": [77.6412, 12.9719],
  "Jalahalli": [77.5450, 13.0350],
  "Jayanagar": [77.5938, 12.9250],
  "JP Nagar": [77.5857, 12.9063],
  "Kalyan Nagar": [77.6350, 13.0250],
  "Kanakapura Road": [77.5700, 12.8800],
  "Koramangala": [77.6245, 12.9352],
  "KR Puram": [77.7050, 13.0050],
  "Malleswaram": [77.5700, 12.9950],
  "Marathahalli": [77.7009, 12.9591],
  "MG Road": [77.6070, 12.9750],
  "Nagarbhavi": [77.5100, 12.9600],
  "Old Airport Road": [77.6500, 12.9600],
  "Rajajinagar": [77.5528, 12.9867],
  "RT Nagar": [77.5950, 13.0200],
  "Sadashivanagar": [77.5800, 13.0050],
  "Sarjapur Road": [77.6872, 12.9107],
  "Thanisandra": [77.6350, 13.0600],
  "Ulsoor": [77.6200, 12.9800],
  "Vijayanagar": [77.5350, 12.9700],
  "Whitefield": [77.7499, 12.9698],
  "Yelahanka": [77.5963, 13.1007],
  "Yeshwanthpur": [77.5550, 13.0200],
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function generateTemplateBuildings(): BuildingData[] {
  const buildings: BuildingData[] = [];
  const rng = seededRandom(42);
  let id = 1;
  for (const [area, coords] of Object.entries(AREA_COORDS)) {
    const range = AREA_RENT_RANGES.find((r) => r.area === area)!;
    const count = 3 + Math.floor(rng() * 3);
    for (let i = 0; i < count; i++) {
      const lngOffset = (rng() - 0.5) * 0.02;
      const latOffset = (rng() - 0.5) * 0.02;
      const bhk = BHK_TYPES[Math.floor(rng() * BHK_TYPES.length)];
      const bhkRange = range.byBhk[bhk];
      const rent = Math.round((bhkRange.min + rng() * (bhkRange.max - bhkRange.min)) / 1000) * 1000;
      const marketAvg = bhkRange.median;
      const users = 2 + Math.floor(rng() * 18);
      buildings.push({
        id: id++,
        lng: coords[0] + lngOffset,
        lat: coords[1] + latOffset,
        area,
        bhk,
        rent,
        cashback: Math.round(rent * 0.01 * 12),
      });
    }
  }
  return buildings;
}
