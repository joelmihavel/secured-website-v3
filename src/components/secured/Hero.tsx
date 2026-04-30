"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useApiIsLoaded } from "@vis.gl/react-google-maps";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Button } from "./ui/Button";
import { useAsciiGlitch } from "./useAsciiGlitch";
import type { HeroContent } from "@/lib/secured/types";
import { getSecuredSupabase } from "@/lib/secured/supabase";

/* ── iPhone Frame (shared) ── */
const FRAME = "/assets/illustrations/iphone-frame";

function IPhoneFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: "335 / 682" }}>
      <div className="absolute" style={{ inset: "0 0.46% 0 0.68%" }}><img alt="" loading="lazy" className="absolute block h-full w-full" src={`${FRAME}/bezel.svg`} /></div>
      <div className="absolute" style={{ inset: "0 0.46% 0 0.68%" }}><img alt="" loading="lazy" className="absolute block h-full w-full" src={`${FRAME}/bezel-stroke.svg`} /></div>
      <div className="absolute" style={{ inset: "0.67% 1.82% 0.67% 2.05%" }}><img alt="" loading="lazy" className="absolute block h-full w-full" src={`${FRAME}/glass.svg`} /></div>
      <div className="absolute" style={{ inset: "0.67% 1.82% 0.67% 2.05%" }}><img alt="" loading="lazy" className="absolute block h-full w-full" src={`${FRAME}/glass-stroke.svg`} /></div>
      <div className="absolute" style={{ inset: "0.73% 39.64% 98.94% 39.41%" }}><img alt="" loading="lazy" className="absolute block h-full w-full" src={`${FRAME}/speaker.svg`} /></div>
      <div className="absolute" style={{ inset: "0.67% 39.52% 98.88% 39.29%" }}><img alt="" loading="lazy" className="absolute block h-full w-full" src={`${FRAME}/speaker-stroke.svg`} /></div>
      <div className="absolute overflow-hidden" style={{ inset: "2.02% 4.56% 2.02% 4.78%", borderRadius: "10.5% / 5.2%" }}>{children}</div>
      <div className="absolute" style={{ inset: "28.33% 0 60.58% 99.32%" }}><img alt="" loading="lazy" className="absolute block h-full w-full" src={`${FRAME}/buttons-right.svg`} /></div>
      <div className="absolute" style={{ inset: "20.04% 99.09% 55.66% 0" }}><img alt="" loading="lazy" className="absolute block h-full w-full" src={`${FRAME}/buttons-left.svg`} /></div>
      <div className="absolute" style={{ inset: "0.11% 0.68% 0.11% 0.91%" }}><img alt="" loading="lazy" className="absolute block h-full w-full" src={`${FRAME}/antenna.svg`} /></div>
      <div className="absolute" style={{ inset: "3.58% 36.22% 92.16% 35.99%" }}><img alt="" loading="lazy" className="absolute block h-full w-full" src={`${FRAME}/dynamic-island.svg`} /></div>
    </div>
  );
}

/* ── Tenant Hero — Figma v1.2 layout ── */

function TenantHero({ data }: { data: HeroContent }) {
  const phoneRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: phoneRef,
    offset: ["start end", "end start"],
  });
  const rotateX = useTransform(scrollYProgress, [0.1, 0.45], [45, 0]);
  const phoneScale = useTransform(scrollYProgress, [0.1, 0.45], [0.92, 1]);
  const phoneOpacity = useTransform(scrollYProgress, [0.05, 0.25], [0, 1]);

  const fullHeading = `${data.headingPrefix}${data.headingHighlight}`;
  const { display: glitchedHeading, triggerGlitch } = useAsciiGlitch(fullHeading);
  const prefixLen = data.headingPrefix.length;

  return (
    <section data-section="hero" className="relative bg-[#131313]">
      {/* Background textures — same as preloader */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-[70%] opacity-[0.4] lg:w-[579px] lg:opacity-[0.6]">
          <img alt="" aria-hidden="true" src="/assets/backgrounds/hero-texture-left.svg" className="h-full w-full object-cover" />
        </div>
        <div className="absolute right-0 top-0 hidden h-full w-[591px] opacity-[0.2] lg:block">
          <img alt="" aria-hidden="true" src="/assets/backgrounds/hero-texture-right.png" className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full px-6 md:px-12 lg:px-[120px]">
        <div className="flex flex-col items-center px-0 pt-40 md:pt-36 lg:px-[120px] lg:pt-[228px]">
          {/* Centered text content */}
          <div className="flex max-w-[700px] flex-col items-center gap-6 text-center xl:max-w-[800px] 3xl:max-w-[1000px] 4xl:max-w-[1200px] 5xl:max-w-[1600px]">
            <div className="flex flex-col items-center gap-3">
              <motion.h1
                className="cursor-default text-[40px] font-normal leading-none tracking-[-2px] text-white md:text-[52px] lg:text-[64px] 3xl:text-[80px] 4xl:text-[96px] 5xl:text-[128px]"
                style={{ fontFamily: "var(--font-ui)" }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                onMouseEnter={triggerGlitch}
                onTouchStart={triggerGlitch}
              >
                {glitchedHeading.slice(0, prefixLen)}
                <span className="text-[#ff9a6d]">{glitchedHeading.slice(prefixLen)}</span>
              </motion.h1>

              <motion.p
                className="text-[20px] leading-[1.4] tracking-[-1px] text-[#797979] md:text-[24px] lg:text-[28px] 3xl:text-[34px] 4xl:text-[42px] 5xl:text-[56px]"
                style={{ fontFamily: "var(--font-ui)" }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                {data.subheading}
              </motion.p>
            </div>

            <motion.p
              className="text-base leading-[1.8] tracking-[-0.32px] text-[#656565] 3xl:text-lg 4xl:text-xl 5xl:text-2xl"
              style={{ fontFamily: "var(--font-ui)", whiteSpace: "pre-line" }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {data.description}
            </motion.p>

            <motion.div
              className="w-full max-w-[400px] 3xl:max-w-[480px] 4xl:max-w-[560px] 5xl:max-w-[720px]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
            >
              <Button fullWidth href="#download-app">
                {data.ctaButtonText}
              </Button>
            </motion.div>
          </div>

          {/* Phone below — scroll-triggered tilt animation */}
          <div ref={phoneRef} className="mt-12 md:mt-16 lg:mt-20 pb-16 md:pb-24 lg:pb-[120px]" style={{ perspective: 1200 }}>
            <motion.div style={{ rotateX, scale: phoneScale, opacity: phoneOpacity }}>
              <IPhoneFrame className="w-[260px] md:w-[300px] lg:w-[335px] 3xl:w-[400px] 4xl:w-[500px] 5xl:w-[680px]">
                <Image
                  src="/assets/screens/app-home.png"
                  alt="Secured app"
                  fill
                  className="object-fill"
                  sizes="(max-width: 768px) 260px, (max-width: 1024px) 300px, 335px"
                  priority
                />
              </IPhoneFrame>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Landlord Hero — keeps existing centered layout ── */

function LandlordHero({ data }: { data: HeroContent }) {
  const fullHeading = `${data.headingPrefix}${data.headingHighlight}`;
  const { display: glitchedHeading, triggerGlitch } = useAsciiGlitch(fullHeading);
  const prefixLen = data.headingPrefix.length;

  return (
    <section data-section="hero" className="relative bg-[#131313]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-[70%] opacity-[0.4] lg:w-[579px] lg:opacity-[0.6]">
          <img alt="" aria-hidden="true" src="/assets/backgrounds/hero-texture-left.svg" className="h-full w-full object-cover" />
        </div>
        <div className="absolute right-0 top-0 hidden h-full w-[591px] opacity-[0.2] lg:block">
          <img alt="" aria-hidden="true" src="/assets/backgrounds/hero-texture-right.png" className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full px-6 md:px-12 lg:px-[120px]">
        <div className="flex flex-col items-center px-0 pt-40 md:pt-36 lg:px-[120px] lg:pt-[228px]">
          <div className="flex max-w-[700px] flex-col items-center gap-6 text-center xl:max-w-[800px]">
            <div className="flex flex-col items-center gap-3">
              <motion.h1
                className="cursor-default text-[40px] font-normal leading-none tracking-[-2px] text-white md:text-[52px] lg:text-[64px]"
                style={{ fontFamily: "var(--font-ui)" }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                onMouseEnter={triggerGlitch}
                onTouchStart={triggerGlitch}
              >
                {glitchedHeading.slice(0, prefixLen)}
                <span className="text-[#ff9a6d]">{glitchedHeading.slice(prefixLen)}</span>
              </motion.h1>

              <motion.p
                className="text-[20px] leading-[1.4] tracking-[-1px] text-[#797979] md:text-[24px] lg:text-[28px]"
                style={{ fontFamily: "var(--font-ui)" }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                {data.subheading}
              </motion.p>
            </div>

            <motion.p
              className="text-base leading-[1.8] tracking-[-0.32px] text-[#656565]"
              style={{ fontFamily: "var(--font-ui)" }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {data.description}
            </motion.p>

            <motion.div
              className="w-full max-w-[400px]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
            >
              <Button fullWidth>{data.ctaButtonText}</Button>
            </motion.div>
          </div>

          <div className="pb-16 md:pb-24 lg:pb-[120px]" />
        </div>
      </div>
    </section>
  );
}

export function Hero({ data, variant = "tenant" }: { data: HeroContent; variant?: "tenant" | "landlord" }) {
  if (variant === "landlord") return <LandlordHero data={data} />;
  return <TenantHero data={data} />;
}

/* ── RentMapSection — kept for tenant page ── */

import type { SelectedBuilding, BuildingData, BhkType, AreaRentRange } from "./ActivityMap";

const CASHBACK_RATE = 0.01;

function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}


type EligibilityStep = "form" | "eligible" | "not-eligible" | "not-serviceable";

const COVERAGE_RADIUS_KM = 5;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function isNearProperties(lat: number, lng: number, allCoords: [number, number][]): boolean {
  return allCoords.some(([pLng, pLat]) => haversineKm(lat, lng, pLat, pLng) <= COVERAGE_RADIUS_KM);
}

interface PlacePrediction {
  place_id: string;
  structured_formatting: { main_text: string; secondary_text: string };
}

function GoogleAreaPicker({ value, onChange }: { value: string; onChange: (area: string, coords?: { lat: number; lng: number }) => void }) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [locating, setLocating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mapsLoaded = useApiIsLoaded();
  const svcRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesSvcRef = useRef<google.maps.places.PlacesService | null>(null);
  const coordsCacheRef = useRef<Record<string, { lat: number; lng: number }>>({});
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  useEffect(() => { setInputValue(value ?? ""); }, [value]);

  useEffect(() => {
    if (!mapsLoaded) return;
    try {
      if (!svcRef.current) svcRef.current = new google.maps.places.AutocompleteService();
      if (!placesSvcRef.current) placesSvcRef.current = new google.maps.places.PlacesService(document.createElement("div"));
    } catch { /* not ready yet */ }
  }, [mapsLoaded]);

  // Auto-locate on mount
  useEffect(() => { handleLocate(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Autocomplete while typing
  useEffect(() => {
    if (!inputValue.trim() || inputValue === value) { setSuggestions([]); setShowDropdown(false); return; }
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!svcRef.current) return;
      svcRef.current.getPlacePredictions(
        {
          input: inputValue,
          componentRestrictions: { country: "in" },
          bounds: new google.maps.LatLngBounds(
            new google.maps.LatLng(12.75, 77.35),
            new google.maps.LatLng(13.20, 77.85)
          ),
        },
        (predictions, status) => {
          if (!cancelled && status === google.maps.places.PlacesServiceStatus.OK) {
            setSuggestions((predictions ?? []) as PlacePrediction[]);
            setShowDropdown(true);
          } else if (!cancelled) {
            setSuggestions([]);
          }
        }
      );
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [inputValue, value]);

  // Close dropdown on outside click, reset input to last confirmed value
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setInputValue(value);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [value]);

  function handleSelect(pred: PlacePrediction) {
    setShowDropdown(false);
    setSuggestions([]);
    const areaName = pred.structured_formatting.main_text;
    setInputValue(areaName);

    // Use cached coords from nearbySearch if available, skip geocoding
    const cached = coordsCacheRef.current[pred.place_id];
    if (cached) {
      import("./ActivityMap").then((m) => { m.AREA_COORDS[areaName] = [cached.lng, cached.lat]; });
      onChangeRef.current(areaName, cached);
      return;
    }

    // Fall back to geocoding for autocomplete results
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ placeId: pred.place_id }, async (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results?.[0]?.geometry?.location) {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        const m = await import("./ActivityMap");
        m.AREA_COORDS[areaName] = [lng, lat];
        onChangeRef.current(areaName, { lat, lng });
      } else {
        onChangeRef.current(areaName);
      }
    });
  }

  function handleLocate() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (!placesSvcRef.current) {
          try { placesSvcRef.current = new google.maps.places.PlacesService(document.createElement("div")); } catch { setLocating(false); return; }
        }
        const svc = placesSvcRef.current;
        if (!svc) { setLocating(false); return; }
        svc.nearbySearch(
          { location: { lat: latitude, lng: longitude }, radius: 500, type: "establishment" },
          (results, status) => {
            setLocating(false);
            if (status === google.maps.places.PlacesServiceStatus.OK && results?.length) {
              results.forEach((r) => {
                if (r.place_id && r.geometry?.location) {
                  coordsCacheRef.current[r.place_id] = {
                    lat: r.geometry.location.lat(),
                    lng: r.geometry.location.lng(),
                  };
                }
              });
              const preds: PlacePrediction[] = results.slice(0, 8).map((r) => ({
                place_id: r.place_id!,
                structured_formatting: {
                  main_text: r.name!,
                  secondary_text: r.vicinity || "",
                },
              }));
              setSuggestions(preds);
              setShowDropdown(true);
              inputRef.current?.focus();
            }
          }
        );
      },
      () => { setLocating(false); },
      { timeout: 15000, maximumAge: 60000, enableHighAccuracy: false }
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 border-b border-white/10 pb-1.5 transition-colors focus-within:border-white/20">
        <svg className="flex-shrink-0 text-[#666]" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => { if (inputValue === value) setInputValue(""); }}
          onBlur={() => { if (!inputValue.trim()) setInputValue(value ?? ""); }}
          placeholder={locating ? "Locating…" : "Enter your society or address…"}
          className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder-[#555] outline-none"
          style={{ fontFamily: "var(--font-ui)" }}
        />
        <button
          type="button"
          onClick={handleLocate}
          disabled={locating}
          title="Use my location"
          className="flex-shrink-0 text-[#555] transition-colors hover:text-[#ff9a6d] disabled:opacity-40"
        >
          {locating
            ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
            : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /></svg>
          }
        </button>
      </div>
      {showDropdown && suggestions.length > 0 && (
        <div
          className="absolute left-0 right-0 bottom-[calc(100%+6px)] z-[600] max-h-[200px] overflow-y-auto overscroll-contain rounded-xl border border-white/[0.08] bg-[#1a1a1a] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }}
          onTouchMove={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          {suggestions.map((pred) => {
            const isSelected = pred.structured_formatting.main_text === value;
            return (
              <button
                key={pred.place_id}
                type="button"
                onClick={() => handleSelect(pred)}
                className={`flex w-full items-center gap-1.5 px-3 py-[6px] text-left text-[12px] transition-colors ${
                  isSelected ? "bg-[#ff9a6d]/[0.08] text-[#ff9a6d]" : "text-white/70 hover:bg-white/[0.04] hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-ui)" }}
              >
                {isSelected
                  ? <svg className="flex-shrink-0" width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7.5L8 2.5" stroke="#ff9a6d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  : <span className="w-[9px] flex-shrink-0" />
                }
                <span className="flex-1 truncate">{pred.structured_formatting.main_text}</span>
                <span className="flex-shrink-0 text-[10px] opacity-40 truncate max-w-[40%]">{pred.structured_formatting.secondary_text}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BhkPicker({ types, value, onChange }: { types: BhkType[]; value: BhkType; onChange: (v: BhkType) => void }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center gap-2 border-b border-white/10 bg-transparent pb-1.5 text-left transition-colors hover:border-white/20">
        <span className="flex-1 truncate text-[13px] text-white" style={{ fontFamily: "var(--font-ui)" }}>{value}</span>
        <svg className="flex-shrink-0 text-[#555]" width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2.5 3.5L5 6.5L7.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && (
        <div className="absolute left-0 right-0 bottom-[calc(100%+6px)] z-[600] flex max-h-[240px] flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#1a1a1a] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex-1 overflow-y-auto overscroll-contain" style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }} onTouchMove={(e) => e.stopPropagation()} onWheel={(e) => e.stopPropagation()}>
            {types.map((bhk) => (
              <button key={bhk} type="button" onClick={() => { onChange(bhk); setOpen(false); }} className={`flex w-full items-center gap-1.5 px-3 py-[6px] text-left text-[12px] transition-colors ${bhk === value ? "bg-[#ff9a6d]/[0.08] text-[#ff9a6d]" : "text-white/70 hover:bg-white/[0.04] hover:text-white"}`} style={{ fontFamily: "var(--font-ui)" }}>
                {bhk === value ? <svg className="flex-shrink-0" width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7.5L8 2.5" stroke="#ff9a6d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> : <span className="w-[9px]" />}
                {bhk}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function RentMapSection() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<EligibilityStep>("form");
  const [rentInput, setRentInput] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedBhk, setSelectedBhk] = useState<BhkType>("2 BHK");
  const [bhkTypes, setBhkTypes] = useState<BhkType[]>([]);
  const [areaNames, setAreaNames] = useState<string[]>([]);
  const [areaRentRanges, setAreaRentRanges] = useState<AreaRentRange[]>([]);
  const [areaCoords, setAreaCoords] = useState<Record<string, [number, number]>>({});
  const [allBuildingCoords, setAllBuildingCoords] = useState<[number, number][]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<SelectedBuilding | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notifySubmitted, setNotifySubmitted] = useState(false);
  const [isInCoverage, setIsInCoverage] = useState(true);
  const [checking, setChecking] = useState(false);
  const flyToRef = useRef<((area: string) => void) | null>(null);
  const handleBuildingSelect = useCallback((b: SelectedBuilding | null) => setSelectedBuilding(b), []);
  const handleMapReady = useCallback((flyTo: (area: string) => void) => { flyToRef.current = flyTo; }, []);
  const handleFlyTo = useCallback((area: string) => { if (!area) return; flyToRef.current?.(area); }, []);
  const handleAreaChange = useCallback((area: string, coords?: { lat: number; lng: number }) => {
    setSelectedArea(area);
    setSelectedCoords(coords ?? null);
    if (coords && allBuildingCoords.length > 0 && !isNearProperties(coords.lat, coords.lng, allBuildingCoords)) {
      setStep("not-serviceable");
      return;
    }
    handleFlyTo(area);
  }, [handleFlyTo, allBuildingCoords]);

  useEffect(() => {
    setMounted(true);
    import("./ActivityMap").then((m) => {
      setBhkTypes(m.BHK_TYPES);
    });
    fetch("/api/properties")
      .then((r) => r.json())
      .then((data: { area: string; bhk: string; rent: number; lat: number; lng: number }[]) => {
        const names = [...new Set(data.map((b) => b.area))];
        const coords: Record<string, [number, number]> = Object.fromEntries(
          data.map((b) => [b.area, [b.lng, b.lat] as [number, number]])
        );
        setAreaNames(names);
        setAreaCoords(coords);
        setAllBuildingCoords(data.map((b) => [b.lng, b.lat]));
        setAreaRentRanges([]);
        const defaultArea = names.includes("Koramangala") ? "Koramangala" : (names[0] ?? "");
        setSelectedArea(defaultArea);
      });
  }, []);

  const rent = parseInt(rentInput.replace(/,/g, ""), 10) || 0;
  const monthlyCashback = Math.round(rent * CASHBACK_RATE);
  const annualCashback = monthlyCashback * 12;
  const handleCheck = useCallback(async () => {
    if (rent < 5000 || !selectedArea) return;
    setChecking(true);
    try {
      const res = await fetch("/api/secured/check-eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area: selectedArea, bhk: selectedBhk, rent, coords: selectedCoords }),
      });
      const { eligible, inCoverage } = await res.json();
      setIsInCoverage(inCoverage);
      setStep(eligible ? "eligible" : inCoverage ? "not-eligible" : "not-serviceable");

      const closestArea = selectedCoords
        ? Object.entries(areaCoords).reduce((best, [area, [lng, lat]]) => {
            const d = haversineKm(selectedCoords.lat, selectedCoords.lng, lat, lng);
            return d < best.dist ? { area, dist: d } : best;
          }, { area: selectedArea, dist: Infinity }).area
        : selectedArea;

      getSecuredSupabase()?.from("maps_properties").insert({
        society_name: selectedArea,
        area: closestArea,
        configuration: selectedBhk,
        rent,
        lat: selectedCoords?.lat ?? null,
        lng: selectedCoords?.lng ?? null,
      });
    } finally {
      setChecking(false);
    }
  }, [rent, selectedArea, selectedBhk, selectedCoords, areaCoords]);
  const handleReset = useCallback(() => { setStep("form"); setRentInput(""); setNotifySubmitted(false); setPhone(""); setEmail(""); }, []);
  const handleRentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const raw = e.target.value.replace(/[^0-9]/g, ""); if (raw === "") { setRentInput(""); return; } setRentInput(parseInt(raw, 10).toLocaleString("en-IN")); }, []);
  const handleNotifySubmit = useCallback(async () => {
    if (!phone && !email) return;
    await getSecuredSupabase()?.from("website_leads").insert({ email, phone, area: selectedArea, bhk: selectedBhk, rent });
    setNotifySubmitted(true);
  }, [phone, email, selectedArea, selectedBhk, rent]);

  return (
    <section data-section="rent-map" className="relative z-[31] flex w-full flex-col overflow-hidden bg-[#131313]" style={{ height: "100vh", minHeight: 700 }}>
      <div className="absolute inset-0 z-0 overflow-hidden lg:left-[120px] lg:right-[120px]">
        {mounted && <LazyActivityMap onBuildingSelect={handleBuildingSelect} onMapReady={handleMapReady} />}
      </div>

      {selectedBuilding && (
        <div className="absolute inset-0 z-[500] pointer-events-none lg:left-[120px] lg:right-[120px]">
          <div className="pointer-events-auto">
            <BuildingPopup building={selectedBuilding.data} x={selectedBuilding.x} y={selectedBuilding.y} onClose={() => setSelectedBuilding(null)} />
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-[450] flex items-end justify-center pb-8 md:pb-10 lg:left-[120px] lg:right-[120px]">
        <div className="pointer-events-auto w-[calc(100%-32px)] max-w-[620px]">
          {step === "form" ? (
            <div className="rounded-2xl border border-white/[0.1] bg-[#131313]/98 px-4 py-3 shadow-[0_12px_48px_rgba(0,0,0,0.6)] md:px-8 md:py-6">
              <p className="mb-2 text-center text-[10px] uppercase tracking-[0.16em] text-[#777] md:mb-4" style={{ fontFamily: "var(--font-ui)" }}>Check if you&apos;re eligible for Flent Secured</p>
              {/* Mobile: compact 2-row layout | Desktop: single row */}
              <div className="flex flex-col gap-2.5 md:hidden">
                <div className="flex gap-3">
                  <div className="flex-1 min-w-0">
                    <label className="mb-1 block text-[9px] font-medium uppercase tracking-[1px] text-[#555]" style={{ fontFamily: "var(--font-ui)" }}>Area</label>
                    <GoogleAreaPicker value={selectedArea} onChange={handleAreaChange} />
                  </div>
                  <div className="min-w-[110px]">
                    <label className="mb-1 block text-[9px] font-medium uppercase tracking-[1px] text-[#555]" style={{ fontFamily: "var(--font-ui)" }}>Configuration</label>
                    <BhkPicker types={bhkTypes} value={selectedBhk} onChange={setSelectedBhk} />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[9px] font-medium uppercase tracking-[1px] text-[#555]" style={{ fontFamily: "var(--font-ui)" }}>Monthly Rent</label>
                  <div className="flex items-baseline gap-1.5 border-b border-white/10 pb-1 transition-colors focus-within:border-[#ff9a6d]">
                    <span className="text-[14px] text-[#555]" style={{ fontFamily: "var(--font-ui)" }}>₹</span>
                    <input type="text" inputMode="numeric" placeholder="25,000" value={rentInput} onChange={handleRentChange} onKeyDown={(e) => e.key === "Enter" && handleCheck()} className="w-full bg-transparent text-[14px] text-white placeholder-[#444] outline-none" style={{ fontFamily: "var(--font-ui)" }} />
                  </div>
                </div>
                <Button fullWidth onClick={handleCheck} disabled={rent < 5000 || !selectedArea || checking}>{checking ? "Checking…" : "Check eligibility"}</Button>
              </div>
              {/* Desktop: original horizontal layout */}
              <div className="hidden md:flex md:flex-row md:items-end md:gap-0">
                <div className="flex-1">
                  <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[1px] text-[#555]" style={{ fontFamily: "var(--font-ui)" }}>Area</label>
                  <GoogleAreaPicker value={selectedArea} onChange={handleAreaChange} />
                </div>
                <div className="h-10 w-px bg-white/[0.06] mx-5" />
                <div className="flex-1">
                  <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[1px] text-[#555]" style={{ fontFamily: "var(--font-ui)" }}>Configuration</label>
                  <BhkPicker types={bhkTypes} value={selectedBhk} onChange={setSelectedBhk} />
                </div>
                <div className="h-10 w-px bg-white/[0.06] mx-5" />
                <div className="flex-shrink-0">
                  <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[1px] text-[#555]" style={{ fontFamily: "var(--font-ui)" }}>Monthly Rent</label>
                  <div className="flex items-baseline gap-1.5 border-b border-white/10 pb-1.5 transition-colors focus-within:border-[#ff9a6d]">
                    <span className="text-[14px] text-[#555]" style={{ fontFamily: "var(--font-ui)" }}>₹</span>
                    <input type="text" inputMode="numeric" placeholder="25,000" value={rentInput} onChange={handleRentChange} onKeyDown={(e) => e.key === "Enter" && handleCheck()} className="w-24 bg-transparent text-[14px] text-white placeholder-[#444] outline-none" style={{ fontFamily: "var(--font-ui)" }} />
                  </div>
                </div>
              </div>
              <div className="mt-5 hidden md:block"><Button fullWidth onClick={handleCheck} disabled={rent < 5000 || !selectedArea || checking}>{checking ? "Checking…" : "Check eligibility"}</Button></div>
              <div className="mt-2 flex items-center justify-center gap-1.5 md:mt-3">
                <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#4ade80] shadow-[0_0_4px_rgba(74,222,128,0.5)]" />
                <p className="text-[9px] tracking-[0.02em] text-white/30" style={{ fontFamily: "var(--font-ui)" }}>I agree to share my rent details with Secured</p>
              </div>
            </div>
          ) : step === "eligible" ? (
            <div className="rounded-2xl border border-white/[0.1] bg-[#131313]/98 px-6 py-5 shadow-[0_12px_48px_rgba(0,0,0,0.6)] md:px-8 md:py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4ade80]/[0.15]"><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
                  <p className="text-[13px] font-semibold text-[#4ade80]" style={{ fontFamily: "var(--font-ui)" }}>You&apos;re eligible for Secured benefits</p>
                </div>
                <button onClick={handleReset} className="rounded-full border border-white/[0.08] px-3 py-1 text-[10px] text-[#777] transition-colors hover:border-white/20 hover:text-white" style={{ fontFamily: "var(--font-ui)" }}>Edit</button>
              </div>
              <p className="mt-1 text-[10px] text-[#555]" style={{ fontFamily: "var(--font-ui)" }}>{selectedBhk} in {selectedArea} · {formatINR(rent)}/mo</p>
              <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <p className="text-[9px] font-medium uppercase tracking-[1px] text-[#555]" style={{ fontFamily: "var(--font-ui)" }}>1% cashback on every rent payment</p>
                  <div className="mt-1.5 flex items-baseline gap-3">
                    <p className="font-display text-[24px] leading-[1] tracking-[-0.8px] text-[#ff9a6d]">{formatINR(monthlyCashback)}<span className="ml-0.5 text-[12px] text-[#ff9a6d]/50">/mo</span></p>
                    <div className="h-4 w-px bg-white/[0.08]" />
                    <p className="font-display text-[16px] leading-[1] tracking-[-0.3px] text-white/50">{formatINR(annualCashback)}<span className="ml-0.5 text-[11px] text-white/30">/yr</span></p>
                  </div>
                </div>
                <Button href="https://apps.apple.com/in/app/secured-by-flent/id6757275258" target="_blank" rel="noopener noreferrer">Download Secured</Button>
              </div>
              <div className="mt-4 rounded-lg border border-[#ff9a6d]/10 bg-[#ff9a6d]/[0.04] px-3 py-2">
                <p className="text-center text-[10px] font-medium text-[#ff9a6d]/80" style={{ fontFamily: "var(--font-ui)" }}>+ Extra ₹1,000 cashback this month on timely rent payment</p>
              </div>
            </div>
          ) : step === "not-serviceable" ? (
            <div className="rounded-2xl border border-white/[0.1] bg-[#131313]/98 px-6 py-5 shadow-[0_12px_48px_rgba(0,0,0,0.6)] md:px-8 md:py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ef4444]/[0.12]"><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#ef4444" strokeWidth="1.5" /><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" /></svg></div>
                  <p className="text-[13px] font-semibold text-[#ef4444]" style={{ fontFamily: "var(--font-ui)" }}>Area not serviceable</p>
                </div>
                <button onClick={handleReset} className="rounded-full border border-white/[0.08] px-3 py-1 text-[10px] text-[#777] transition-colors hover:border-white/20 hover:text-white" style={{ fontFamily: "var(--font-ui)" }}>Edit</button>
              </div>
              <p className="mt-1 text-[10px] text-[#555]" style={{ fontFamily: "var(--font-ui)" }}>{selectedArea}</p>
              <p className="mt-3 text-[12px] leading-[1.5] text-[#888]" style={{ fontFamily: "var(--font-ui)" }}>Secured isn&apos;t available in this area yet. Try a nearby location or search within Bangalore.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/[0.1] bg-[#131313]/98 px-6 py-5 shadow-[0_12px_48px_rgba(0,0,0,0.6)] md:px-8 md:py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fbbf24]/[0.15]"><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#fbbf24" strokeWidth="1.5" /><path d="M8 5v3.5" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" /><circle cx="8" cy="11" r="0.75" fill="#fbbf24" /></svg></div>
                  <p className="text-[13px] font-semibold text-[#fbbf24]" style={{ fontFamily: "var(--font-ui)" }}>Not eligible yet</p>
                </div>
                <button onClick={handleReset} className="rounded-full border border-white/[0.08] px-3 py-1 text-[10px] text-[#777] transition-colors hover:border-white/20 hover:text-white" style={{ fontFamily: "var(--font-ui)" }}>Edit</button>
              </div>
              <p className="mt-1 text-[10px] text-[#555]" style={{ fontFamily: "var(--font-ui)" }}>{selectedBhk} in {selectedArea} · {formatINR(rent)}/mo</p>
              <p className="mt-3 text-[12px] leading-[1.5] text-[#888]" style={{ fontFamily: "var(--font-ui)" }}>
                {"You're not eligible yet. Leave your details and we'll notify you the moment you qualify."}
              </p>
              {!notifySubmitted ? (
                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex flex-col gap-3 md:flex-row">
                    <div className="flex-1">
                      <label className="mb-1 block text-[9px] font-medium uppercase tracking-[1px] text-[#555]" style={{ fontFamily: "var(--font-ui)" }}>Phone</label>
                      <input type="tel" inputMode="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border-b border-white/10 bg-transparent pb-1.5 text-[13px] text-white placeholder-[#444] outline-none transition-colors focus:border-[#ff9a6d]" style={{ fontFamily: "var(--font-ui)" }} />
                    </div>
                    <div className="flex-1">
                      <label className="mb-1 block text-[9px] font-medium uppercase tracking-[1px] text-[#555]" style={{ fontFamily: "var(--font-ui)" }}>Email</label>
                      <input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleNotifySubmit()} className="w-full border-b border-white/10 bg-transparent pb-1.5 text-[13px] text-white placeholder-[#444] outline-none transition-colors focus:border-[#ff9a6d]" style={{ fontFamily: "var(--font-ui)" }} />
                    </div>
                  </div>
                  <Button fullWidth onClick={handleNotifySubmit} disabled={!phone && !email}>Notify me when eligible</Button>
                </div>
              ) : (
                <div className="mt-4 rounded-lg border border-[#4ade80]/10 bg-[#4ade80]/[0.04] px-3 py-3">
                  <p className="text-center text-[11px] font-medium text-[#4ade80]" style={{ fontFamily: "var(--font-ui)" }}>We will notify you</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function BuildingPopup({ building, x, y, onClose }: { building: BuildingData; x: number; y: number; onClose: () => void }) {
  const monthlySaving = Math.round(building.cashback / 12);

  return (
    <div className="absolute z-[500]" style={{ left: x, top: y - 12, transform: "translate(-50%, -100%)", animation: "popupFadeIn 0.2s ease-out" }} onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
      <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#161616] shadow-[0_12px_40px_rgba(0,0,0,0.5)]" style={{ width: 220 }}>
        <div className="flex items-center justify-between px-4 pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-white/60" style={{ fontFamily: "var(--font-ui)" }}>{building.area} · {building.bhk}</p>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.1] text-white/60 transition-colors hover:text-white" style={{ fontSize: 11, lineHeight: 1 }}>×</button>
        </div>
        <div className="px-4 pt-2 pb-3">
          <p className="text-[9px] font-medium uppercase tracking-[0.5px] text-[#777]" style={{ fontFamily: "var(--font-ui)" }}>Rent</p>
          <p className="mt-0.5 font-display text-[22px] leading-[1.1] tracking-[-0.8px] text-white">{formatINR(building.rent)}<span className="ml-0.5 text-[11px] tracking-normal text-[#777]">/mo</span></p>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1" style={{ background: "rgba(74,222,128,0.08)" }}>
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M5 2L8 7H2L5 2Z" fill="#4ade80" /></svg>
            <span className="whitespace-nowrap text-[10px] font-semibold" style={{ color: "#4ade80", fontFamily: "var(--font-ui)" }}>{formatINR(monthlySaving)}/month cashback</span>
          </div>
        </div>
        <div className="border-t border-white/[0.06] bg-[#ff9a6d]/[0.04] px-4 py-3">
          <p className="text-[9px] font-medium uppercase tracking-[0.5px] text-[#888]" style={{ fontFamily: "var(--font-ui)" }}>Annual cashback with Secured</p>
          <p className="mt-1 font-display font-bold text-[20px] leading-[1] tracking-[-0.6px] text-[#ff9a6d]">{formatINR(building.cashback)}</p>
        </div>
      </div>
      <div className="mx-auto h-0 w-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#161616]/95" />
    </div>
  );
}

function LazyActivityMap({ onBuildingSelect, onMapReady }: { onBuildingSelect?: (b: SelectedBuilding | null) => void; onMapReady?: (flyTo: (area: string) => void) => void }) {
  const [ActivityMap, setActivityMap] = useState<React.ComponentType<{ onBuildingSelect?: (b: SelectedBuilding | null) => void; onMapReady?: (flyTo: (area: string) => void) => void }> | null>(null);
  useEffect(() => { import("./ActivityMap").then((m) => setActivityMap(() => m.ActivityMap)); }, []);
  if (!ActivityMap) return null;
  return <ActivityMap onBuildingSelect={onBuildingSelect} onMapReady={onMapReady} />;
}
