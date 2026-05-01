"use client";

import { useEffect, useRef, useCallback } from "react";
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
  cashback: number;
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
  // No symbol layers reference glyphs — keep the field absent to avoid an
  // unused TLS handshake to demotiles.maplibre.org on every page load.
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

export function ActivityMap({
  buildings,
  onBuildingSelect,
  onMapReady,
}: {
  buildings: BuildingData[];
  onBuildingSelect?: (b: SelectedBuilding | null) => void;
  onMapReady?: (flyTo: (area: string) => void) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  // Cache markers per building id so panning doesn't rebuild DOM nodes
  const markersRef = useRef<Map<number, maplibregl.Marker>>(new Map());
  const selectedBuildingRef = useRef<BuildingData | null>(null);
  const buildingsRef = useRef<BuildingData[]>(buildings);
  const onBuildingSelectRef = useRef(onBuildingSelect);
  const onMapReadyRef = useRef(onMapReady);
  const flewToDefaultRef = useRef(false);

  useEffect(() => { onBuildingSelectRef.current = onBuildingSelect; }, [onBuildingSelect]);
  useEffect(() => { onMapReadyRef.current = onMapReady; }, [onMapReady]);

  const buildMarker = useCallback((b: BuildingData): maplibregl.Marker => {
    const glowColor = "rgba(255, 154, 109, 0.4)";
    const dotColor = "#ff9a6d";

    const el = document.createElement("div");
    el.className = "secured-3d-marker";
    el.innerHTML = `
      <div class="secured-3d-pulse" style="background: ${glowColor}"></div>
      <div class="secured-3d-dot" style="background: ${dotColor}; box-shadow: 0 0 10px ${glowColor}, 0 0 20px ${glowColor}"></div>
      <div class="secured-3d-label">${formatINR(b.rent)} · ${b.bhk}</div>
    `;

    el.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedBuildingRef.current = b;
      const map = mapRef.current;
      if (!map) return;
      const point = map.project([b.lng, b.lat]);
      onBuildingSelectRef.current?.({ data: b, x: point.x, y: point.y });
    });

    el.addEventListener("mouseenter", () => el.classList.add("secured-3d-marker-hover"));
    el.addEventListener("mouseleave", () => el.classList.remove("secured-3d-marker-hover"));

    return new maplibregl.Marker({ element: el, anchor: "center" }).setLngLat([b.lng, b.lat]);
  }, []);

  // Track the in-flight chunked-add pass so we can cancel it if the user pans
  // again before it finishes (otherwise we'd keep adding stale markers).
  const pendingAddRef = useRef<{ cancelled: boolean } | null>(null);

  // Mount only the markers within the current viewport (plus 30% padding),
  // and add them in small chunks scheduled via requestIdleCallback so the
  // main thread stays responsive — the listings appear progressively over a
  // few hundred ms instead of blocking the page during a large sync batch.
  const syncVisibleMarkers = useCallback((map: maplibregl.Map, list: BuildingData[]) => {
    const bounds = map.getBounds();
    const padX = (bounds.getEast() - bounds.getWest()) * 0.3;
    const padY = (bounds.getNorth() - bounds.getSouth()) * 0.3;
    const minLng = bounds.getWest() - padX;
    const maxLng = bounds.getEast() + padX;
    const minLat = bounds.getSouth() - padY;
    const maxLat = bounds.getNorth() + padY;

    const knownIds = new Set(list.map((b) => b.id));
    const visibleIds = new Set<number>();
    for (const b of list) {
      if (
        b.lng >= minLng && b.lng <= maxLng &&
        b.lat >= minLat && b.lat <= maxLat
      ) {
        visibleIds.add(b.id);
      }
    }

    for (const [id, marker] of markersRef.current) {
      if (!visibleIds.has(id) || !knownIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    }

    // Cancel any previous chunked-add still in flight
    if (pendingAddRef.current) {
      pendingAddRef.current.cancelled = true;
    }

    const toAdd: BuildingData[] = [];
    for (const b of list) {
      if (visibleIds.has(b.id) && !markersRef.current.has(b.id)) {
        toAdd.push(b);
      }
    }

    if (toAdd.length > 0) {
      const token = { cancelled: false };
      pendingAddRef.current = token;
      const CHUNK_SIZE = 8;
      const scheduleNext = (cb: () => void) => {
        const w = window as Window & {
          requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        };
        if (typeof w.requestIdleCallback === "function") {
          w.requestIdleCallback(cb, { timeout: 250 });
        } else {
          // Fallback for Safari (no rIC) — yield to next frame
          requestAnimationFrame(cb);
        }
      };
      const addChunk = (start: number) => {
        if (token.cancelled || !mapRef.current) return;
        const end = Math.min(start + CHUNK_SIZE, toAdd.length);
        for (let i = start; i < end; i++) {
          const b = toAdd[i];
          if (markersRef.current.has(b.id)) continue;
          const marker = buildMarker(b);
          marker.addTo(map);
          markersRef.current.set(b.id, marker);
        }
        if (end < toAdd.length) {
          scheduleNext(() => addChunk(end));
        } else if (pendingAddRef.current === token) {
          pendingAddRef.current = null;
        }
      };
      // First chunk runs immediately so a few markers appear without delay,
      // remaining chunks yield to the browser between each batch.
      addChunk(0);
    }

    const sel = selectedBuildingRef.current;
    if (sel && !markersRef.current.has(sel.id)) {
      selectedBuildingRef.current = null;
      onBuildingSelectRef.current?.(null);
    }
  }, [buildMarker]);

  // Seed module-level area lookup tables and resync markers when prop changes
  useEffect(() => {
    buildingsRef.current = buildings;
    if (buildings.length > 0) {
      AREA_NAMES = [...new Set(buildings.map((b) => b.area))];
      AREA_COORDS = Object.fromEntries(
        buildings.map((b) => [b.area, [b.lng, b.lat] as [number, number]])
      );
    }
    if (mapRef.current) {
      syncVisibleMarkers(mapRef.current, buildings);
      if (!flewToDefaultRef.current && buildings.length > 0) {
        flewToDefaultRef.current = true;
        const avgLng = buildings.reduce((s, b) => s + b.lng, 0) / buildings.length;
        const avgLat = buildings.reduce((s, b) => s + b.lat, 0) / buildings.length;
        mapRef.current.jumpTo({ center: [avgLng, avgLat] });
      }
    }
  }, [buildings, syncVisibleMarkers]);

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
      dragRotate: false,
      pitchWithRotate: false,
      refreshExpiredTiles: false,
      // Skip the per-frame cross-fade between tile zooms — we don't user-zoom
      // (scrollZoom: false) so the fade is barely perceptible and removing it
      // saves continuous GL state churn during initial tile load.
      fadeDuration: 0,
    });

    // Drain the visible @2x raster tile fan in one parallel pass instead of
    // queueing through the default 16 (browser caps to ~6 per origin but
    // carto rotates a/b/c subdomains, giving effective parallelism ~18).
    // Global on the maplibregl namespace, not a per-map MapOptions field.
    maplibregl.setMaxParallelImageRequests?.(24);

    if (map.touchZoomRotate) {
      map.touchZoomRotate.disableRotation();
    }

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    let moveSyncRaf: number | null = null;
    const scheduleSync = () => {
      if (moveSyncRaf !== null) return;
      moveSyncRaf = requestAnimationFrame(() => {
        moveSyncRaf = null;
        if (mapRef.current) {
          syncVisibleMarkers(mapRef.current, buildingsRef.current);
        }
      });
    };

    map.on("load", () => {
      mapRef.current = map;
      if (buildingsRef.current.length > 0) {
        syncVisibleMarkers(map, buildingsRef.current);
        if (!flewToDefaultRef.current) {
          flewToDefaultRef.current = true;
          const bs = buildingsRef.current;
          const avgLng = bs.reduce((s, b) => s + b.lng, 0) / bs.length;
          const avgLat = bs.reduce((s, b) => s + b.lat, 0) / bs.length;
          map.jumpTo({ center: [avgLng, avgLat] });
        }
      }
      onMapReadyRef.current?.((area: string) => {
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

    map.on("moveend", scheduleSync);

    map.on("move", () => {
      const b = selectedBuildingRef.current;
      if (b) {
        const point = map.project([b.lng, b.lat]);
        onBuildingSelectRef.current?.({ data: b, x: point.x, y: point.y });
      }
    });

    map.on("click", () => {
      selectedBuildingRef.current = null;
      onBuildingSelectRef.current?.(null);
    });

    return () => {
      if (moveSyncRaf !== null) cancelAnimationFrame(moveSyncRaf);
      for (const marker of markersRef.current.values()) marker.remove();
      markersRef.current.clear();
      map.remove();
      mapRef.current = null;
    };
  }, [syncVisibleMarkers]);

  /* ── Pause marker pulse animation when offscreen + honor prefers-reduced-motion ── */
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const io = new IntersectionObserver(([entry]) => {
      node.classList.toggle("secured-pulse-paused", !entry.isIntersecting);
    });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />

      {/* Edge fades — subtle blending into section bg */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[10] h-12 bg-gradient-to-b from-[#131313] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[10] h-12 bg-gradient-to-t from-[#131313] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[10] w-12 bg-gradient-to-r from-[#131313] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[10] w-12 bg-gradient-to-l from-[#131313] to-transparent" />
    </div>
  );
}
