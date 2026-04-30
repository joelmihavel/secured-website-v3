"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

/* ── Types ── */

export type BhkType = "1 BHK" | "2 BHK" | "3 BHK" | "4 BHK" | "5 BHK";

export const BHK_TYPES: BhkType[] = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK"];

export interface RentRange {
  min: number;
  max: number;
  median: number;
  p25: number;
  p75: number;
}

export interface AreaRentRange {
  area: string;
  min: number;
  max: number;
  median: number;
  p25: number;
  p75: number;
  byBhk: Record<BhkType, RentRange>;
}

interface BuildingData {
  id: number;
  lat: number;
  lng: number;
  area: string;
  bhk: BhkType;
  rent: number;
  market_avg: number;
  cashback: number;
  users: number;
}

/* ── Data ── */

export const AREA_RENT_RANGES: AreaRentRange[] = [];
export let AREA_NAMES: string[] = [];
export let AREA_COORDS: Record<string, [number, number]> = {};

function formatINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

/* ── Map style with vector tiles for 3D buildings ── */

const MAP_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  name: "Secured Dark 3D",
  sources: {
    "carto-dark": {
      type: "raster",
      tiles: ["https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png"],
      tileSize: 256,
      attribution: "",
    },
    openmaptiles: {
      type: "vector",
      url: "https://tiles.openfreemap.org/planet",
    },
  },
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  layers: [
    {
      id: "carto-dark-layer",
      type: "raster",
      source: "carto-dark",
      minzoom: 0,
      maxzoom: 20,
    },
    {
      id: "3d-buildings",
      source: "openmaptiles",
      "source-layer": "building",
      type: "fill-extrusion",
      minzoom: 13,
      paint: {
        "fill-extrusion-color": [
          "interpolate", ["linear"], ["get", "render_height"],
          0, "#1a1a2e",
          15, "#252547",
          30, "#2d2d5e",
        ],
        "fill-extrusion-height": [
          "interpolate", ["linear"], ["zoom"],
          13, 0,
          14, ["*", ["coalesce", ["get", "render_height"], 10], 1.5],
        ],
        "fill-extrusion-base": [
          "coalesce", ["get", "render_min_height"], 0,
        ],
        "fill-extrusion-opacity": 0.7,
      },
    },
  ],
};

/* ── Component ── */

export interface SelectedBuilding {
  data: BuildingData;
  x: number;
  y: number;
}

export { type BuildingData };

export function ActivityMap({ onBuildingSelect, onMapReady }: { onBuildingSelect?: (b: SelectedBuilding | null) => void; onMapReady?: (flyTo: (area: string) => void) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const selectedBuildingRef = useRef<BuildingData | null>(null);
  const [buildings, setBuildings] = useState<BuildingData[]>([]);
  const buildingsRef = useRef<BuildingData[]>([]);

  useEffect(() => {
    fetch("/api/properties")
      .then((r) => r.json())
      .then((data: BuildingData[]) => {
        AREA_NAMES = [...new Set(data.map((b) => b.area))];
        AREA_COORDS = Object.fromEntries(data.map((b) => [b.area, [b.lng, b.lat] as [number, number]]));
        buildingsRef.current = data;
        setBuildings(data);
      });
  }, []);

  const renderMarkers = useCallback((map: maplibregl.Map, buildings: BuildingData[]) => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    selectedBuildingRef.current = null;
    onBuildingSelect?.(null);

    for (const b of buildings) {
      const isOverpaying = b.rent > b.market_avg;
      const isHighUsers = b.users >= 10;

      const glowColor = isOverpaying
        ? "rgba(239, 68, 68, 0.6)"
        : isHighUsers
        ? "rgba(139, 92, 246, 0.6)"
        : "rgba(255, 154, 109, 0.4)";

      const dotColor = isOverpaying ? "#ef4444" : isHighUsers ? "#8b5cf6" : "#ff9a6d";

      const el = document.createElement("div");
      el.className = "secured-3d-marker";
      el.innerHTML = `
        <div class="secured-3d-pulse" style="background: ${glowColor}"></div>
        <div class="secured-3d-dot" style="background: ${dotColor}; box-shadow: 0 0 10px ${glowColor}, 0 0 20px ${glowColor}"></div>
        <div class="secured-3d-label">${formatINR(b.rent)} · ${b.bhk}</div>
      `;

      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([b.lng, b.lat])
        .addTo(map);

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        selectedBuildingRef.current = b;
        const point = map.project([b.lng, b.lat]);
        onBuildingSelect?.({ data: b, x: point.x, y: point.y });
      });

      el.addEventListener("mouseenter", () => el.classList.add("secured-3d-marker-hover"));
      el.addEventListener("mouseleave", () => el.classList.remove("secured-3d-marker-hover"));

      markersRef.current.push(marker);
    }
  }, []);

  /* ── Render markers when buildings load or map is ready ── */
  useEffect(() => {
    if (mapRef.current && buildings.length > 0) {
      renderMarkers(mapRef.current, buildings);
    }
  }, [buildings, renderMarkers]);

  /* ── Init map ── */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [77.6245, 12.9352],
      zoom: 13,
      pitch: 50,
      bearing: -15,
      minZoom: 11,
      maxZoom: 17,
      maxBounds: [[77.35, 12.75], [77.85, 13.20]],
      attributionControl: false,
      scrollZoom: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    map.on("load", () => {
      mapRef.current = map;
      if (buildingsRef.current.length > 0) renderMarkers(map, buildingsRef.current);
      onMapReady?.((area: string) => {
        const coords = AREA_COORDS[area];
        if (!coords || !mapRef.current) return;
        mapRef.current.flyTo({
          center: coords,
          zoom: 14.5,
          pitch: 55,
          bearing: -20 + Math.random() * 40,
          duration: 2000,
          essential: true,
        });
      });
    });

    map.on("move", () => {
      const b = selectedBuildingRef.current;
      if (b) {
        const point = map.project([b.lng, b.lat]);
        onBuildingSelect?.({ data: b, x: point.x, y: point.y });
      }
    });

    map.on("click", () => {
      selectedBuildingRef.current = null;
      onBuildingSelect?.(null);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
    };
  }, [renderMarkers]);


  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />

      {/* Edge fades — subtle blending into section bg */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[10] h-12 bg-gradient-to-b from-[#131313] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[10] h-12 bg-gradient-to-t from-[#131313] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[10] w-12 bg-gradient-to-r from-[#131313] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[10] w-12 bg-gradient-to-l from-[#131313] to-transparent" />

      {/* Area fly-to — removed, now rendered in parent (Hero.tsx) */}
    </div>
  );
}
