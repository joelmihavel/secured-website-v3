"use client";

/*
 * 3D model: Apple iPhone 15 Pro Max Black
 * Author: polyman (https://sketchfab.com/Polyman_3D)
 * License: CC-BY-4.0
 * Source: https://sketchfab.com/3d-models/apple-iphone-15-pro-max-black-df17520841214c1792fb8a44c6783ee7
 */

import * as THREE from "three";
import { Suspense, useEffect, useMemo, useRef, useCallback } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useGLTF, useTexture, Environment } from "@react-three/drei";

const MODEL_PATH = "/assets/models/iphone.glb";
const SCREEN_TEXTURE = "/assets/screens/app-home-v3.png";
const SPLASH_TEXTURE = "/assets/screens/splash-screen.png";
const PAYMENT_TEXTURE = "/assets/screens/payment-screen.png";


function prepareScreenTex(raw: THREE.Texture) {
  const tex = raw.clone();
  tex.flipY = false;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.center.set(0.5, 0.5);
  tex.rotation = Math.PI;
  tex.repeat.x = -1;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/* ── Canvas splash screen drawing ── */

const CW = 786;
const CH = 1704;
const S = 2;

function ss(t: number) {
  return t * t * (3 - 2 * t);
}

function eo(progress: number, start: number, end: number): number {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return ss((progress - start) / (end - start));
}

function rr(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawCross(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  const arm = size * 0.12;
  const half = size / 2;
  ctx.fillRect(cx - arm / 2, cy - half, arm, size);
  ctx.fillRect(cx - half, cy - arm / 2, size, arm);
}

interface SplashImages {
  bgPattern: HTMLImageElement | null;
  logo: HTMLImageElement | null;
  splashFull: HTMLImageElement | null;
  loaded: boolean;
}

function drawSplash(
  ctx: CanvasRenderingContext2D,
  progress: number,
  images: SplashImages,
) {
  // ── 1. Background ──
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#131313";
  ctx.fillRect(0, 0, CW, CH);

  // ── 2. Background pattern image ──
  const bgOp = eo(progress, 0, 0.12);
  if (bgOp > 0 && images.bgPattern) {
    ctx.globalAlpha = bgOp * 0.38;
    const img = images.bgPattern;
    ctx.drawImage(img, -36, -132, 938, 1328);
    ctx.globalAlpha = 1;
  }

  // ── 3. Dynamic Island ──
  const diOp = eo(progress, 0, 0.06);
  if (diOp > 0) {
    ctx.globalAlpha = diOp;
    ctx.fillStyle = "#000000";
    rr(ctx, 141 * S, 13 * S, 108 * S, 32 * S, 60 * S);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ── 4. Status bar ──
  const stOp = eo(progress, 0, 0.08);
  if (stOp > 0) {
    ctx.globalAlpha = stOp;
    ctx.fillStyle = "#ffffff";
    ctx.font = `590 ${17 * S}px -apple-system, "SF Pro Display", "Plus Jakarta Sans", sans-serif`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText("13:13", 70 * S, 29.5 * S);

    // Cellular bars
    ctx.fillStyle = "#ffffff";
    const cbX = 305 * S, cbY = 29 * S;
    for (let i = 0; i < 4; i++) {
      const bh = (4 + i * 2.2) * S;
      rr(ctx, cbX + i * 5.5 * S, cbY - bh / 2, 3 * S, bh, 0.8 * S);
      ctx.fill();
    }

    // WiFi arcs
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.4 * S;
    const wfX = 345 * S, wfY = 32 * S;
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(wfX, wfY, i * 3.5 * S, -Math.PI * 0.8, -Math.PI * 0.2);
      ctx.stroke();
    }
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(wfX, wfY, 1.2 * S, 0, Math.PI * 2);
    ctx.fill();

    // Battery
    const batX = 363 * S, batY = 23 * S, batW = 25 * S, batH = 13 * S;
    ctx.globalAlpha = stOp * 0.35;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1 * S;
    rr(ctx, batX, batY, batW, batH, 4.3 * S);
    ctx.stroke();
    ctx.globalAlpha = stOp;
    // Cap
    ctx.fillStyle = "#ffffff";
    ctx.globalAlpha = stOp * 0.4;
    rr(ctx, batX + batW + 1 * S, batY + 4 * S, 1.5 * S, 5 * S, 0.75 * S);
    ctx.fill();
    ctx.globalAlpha = stOp;
    // Fill
    ctx.fillStyle = "#ffffff";
    rr(ctx, batX + 2 * S, batY + 2 * S, 21 * S, 9 * S, 2.5 * S);
    ctx.fill();

    ctx.globalAlpha = 1;
  }

  // ── 5. Orange marquee strip (#ff9a6d) ──
  const omOp = eo(progress, 0.06, 0.18);
  if (omOp > 0) {
    ctx.save();
    ctx.globalAlpha = omOp;
    const omCy = 100 * S;
    ctx.translate(CW / 2, omCy);
    ctx.rotate((-0.48 * Math.PI) / 180);
    const omW = 847 * S;
    const omH = 39 * S;
    ctx.fillStyle = "#ff9a6d";
    ctx.fillRect(-omW / 2, -omH / 2, omW, omH);
    // Text
    ctx.fillStyle = "#000000";
    ctx.font = `600 ${12 * S}px "Plus Jakarta Sans", -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "Pay rent before the 5th. Get 0% credit card fees for 6 months.",
      0, 0,
    );
    ctx.restore();
  }

  // ── 6. Dark marquee strip (#1a1a1a) ──
  const dmOp = eo(progress, 0.10, 0.22);
  if (dmOp > 0) {
    ctx.save();
    ctx.globalAlpha = dmOp;
    const dmCy = 147 * S;
    ctx.translate(CW / 2, dmCy);
    ctx.rotate((1.11 * Math.PI) / 180);
    const dmW = 847 * S;
    const dmH = 39 * S;
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(-dmW / 2, -dmH / 2, dmW, dmH);
    ctx.fillStyle = "#ffffff";
    ctx.font = `600 ${12 * S}px "Plus Jakarta Sans", -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "Because responsibility should feel rewarding          Because responsibility should feel rewarding",
      0, 0,
    );
    ctx.restore();
  }

  // ── 7. Logo ──
  const lgOp = eo(progress, 0.15, 0.30);
  if (lgOp > 0 && images.logo) {
    ctx.globalAlpha = lgOp;
    const lW = 33.375 * S;
    const lH = 40 * S;
    ctx.drawImage(images.logo, (CW - lW) / 2, 267 * S, lW, lH);
    ctx.globalAlpha = 1;
  }

  // ── 8. Card ──
  const cardOp = eo(progress, 0.25, 0.40);
  if (cardOp > 0) {
    const cardX = 16 * S;
    const cardSlide = (1 - cardOp) * 30 * S;
    const cardW = (393 - 32) * S;
    const cardY = 436 * S + cardSlide;
    const cardH = 420 * S;
    const cardR = 8 * S;
    const cx = CW / 2;

    ctx.globalAlpha = cardOp;

    // Card background
    ctx.fillStyle = "#202020";
    rr(ctx, cardX, cardY, cardW, cardH, cardR);
    ctx.fill();

    // Card border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.10)";
    ctx.lineWidth = 0.5 * S;
    rr(ctx, cardX, cardY, cardW, cardH, cardR);
    ctx.stroke();

    // bg_line inside card
    const blOp = eo(progress, 0.28, 0.42);
    if (blOp > 0) {
      ctx.globalAlpha = cardOp * blOp * 0.6;
      ctx.strokeStyle = "#4d4d4d";
      ctx.lineWidth = 0.3 * S;
      const blX = cardX + (cardW / 2) - 2 * S - (327 * S) / 2;
      const blY = cardY + 84 * S;
      const blW = 327 * S;
      const blH = 219 * S;
      ctx.beginPath(); ctx.moveTo(blX + 32.6 * S, blY + 70.5 * S); ctx.lineTo(blX + 32.6 * S, blY + blH); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(blX, blY + 160.5 * S); ctx.lineTo(blX + blW, blY + 160.5 * S); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(blX + 300.8 * S, blY); ctx.lineTo(blX + 300.8 * S, blY + blH); ctx.stroke();
      ctx.globalAlpha = cardOp;
    }

    // Star decorator (top right of card)
    const starOp = eo(progress, 0.30, 0.44);
    if (starOp > 0) {
      ctx.globalAlpha = cardOp * starOp;
      const stX = cardX + 308 * S; const stY = cardY; const stSz = 54 * S;
      ctx.fillStyle = "#131313"; rr(ctx, stX, stY, stSz, stSz, 12 * S); ctx.fill();
      ctx.save();
      ctx.beginPath(); rr(ctx, stX, stY, stSz, stSz, 12 * S); ctx.clip();
      ctx.fillStyle = "#1a1a1a";
      ctx.beginPath(); ctx.moveTo(stX + stSz + 12 * S, stY + stSz); ctx.lineTo(stX + 12 * S, stY + stSz); ctx.lineTo(stX, stY + stSz * 0.78); ctx.lineTo(stX + stSz + 12 * S, stY - 10 * S); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#202020"; ctx.lineWidth = 1 * S;
      ctx.beginPath(); ctx.moveTo(stX + stSz + 12 * S, stY + stSz); ctx.lineTo(stX, stY + stSz * 0.78); ctx.stroke();
      ctx.restore();
      ctx.globalAlpha = cardOp;
    }

    // Paperclip decorator (top left of card)
    const ppOp = eo(progress, 0.30, 0.44);
    if (ppOp > 0) {
      ctx.globalAlpha = cardOp * ppOp * 0.7;
      ctx.strokeStyle = "#4d4d4d"; ctx.lineWidth = 1.2 * S;
      const ppX = cardX + 18 * S; const ppY = cardY - 5 * S;
      ctx.beginPath();
      ctx.moveTo(ppX + 6 * S, ppY); ctx.lineTo(ppX + 6 * S, ppY + 35 * S);
      ctx.quadraticCurveTo(ppX + 6 * S, ppY + 40 * S, ppX + 2 * S, ppY + 40 * S);
      ctx.quadraticCurveTo(ppX - 2 * S, ppY + 40 * S, ppX - 2 * S, ppY + 35 * S);
      ctx.lineTo(ppX - 2 * S, ppY + 8 * S);
      ctx.quadraticCurveTo(ppX - 2 * S, ppY + 3 * S, ppX + 2 * S, ppY + 3 * S);
      ctx.quadraticCurveTo(ppX + 6 * S, ppY + 3 * S, ppX + 6 * S, ppY + 8 * S);
      ctx.lineTo(ppX + 6 * S, ppY + 28 * S);
      ctx.stroke();
      ctx.globalAlpha = cardOp;
    }

    // "Make your Rent"
    const titleOp = eo(progress, 0.35, 0.48);
    if (titleOp > 0) {
      ctx.globalAlpha = cardOp * titleOp;
      ctx.fillStyle = "#ffffff";
      ctx.font = `400 ${22 * S}px "Plus Jakarta Sans", -apple-system, sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText("Make your Rent", cx, cardY + 55 * S);
    }

    // "work for you"
    const subOp = eo(progress, 0.40, 0.53);
    if (subOp > 0) {
      ctx.globalAlpha = cardOp * subOp;
      ctx.fillStyle = "#ff9a6d";
      ctx.font = `400 ${28 * S}px "Plus Jakarta Sans", -apple-system, sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      if ("letterSpacing" in ctx) (ctx as any).letterSpacing = `${-1 * S}px`;
      ctx.fillText("work for you", cx, cardY + 96 * S);
      if ("letterSpacing" in ctx) (ctx as any).letterSpacing = "0px";
    }

    // Orange cross decorators
    const crOp = eo(progress, 0.42, 0.55);
    if (crOp > 0) {
      ctx.globalAlpha = cardOp * crOp;
      ctx.fillStyle = "#ff9a6d";
      drawCross(ctx, cardX + 307.5 * S + 8 * S, cardY + 116 * S + 8 * S, 16 * S);
      drawCross(ctx, cardX + 39.5 * S + 8 * S, cardY + 300 * S + 8 * S, 16 * S);
    }

    // Description
    const descOp = eo(progress, 0.50, 0.63);
    if (descOp > 0) {
      ctx.globalAlpha = cardOp * descOp;
      ctx.fillStyle = "#bababa";
      ctx.font = `400 ${12 * S}px "Plus Jakarta Sans", -apple-system, sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText("Secured is India’s first rent payment app", cx, cardY + 157 * S);
      ctx.fillText("built to reward reliable tenants.", cx, cardY + 177 * S);
    }

    // Button
    const btnOp = eo(progress, 0.58, 0.72);
    if (btnOp > 0) {
      ctx.globalAlpha = cardOp * btnOp;
      const btnW = 297 * S; const btnX = (CW - btnW) / 2; const btnY = cardY + 224 * S;
      ctx.fillStyle = "#4d4d4d"; rr(ctx, cx - 12 * S, btnY - 12 * S, 24 * S, 2 * S, 1 * S); ctx.fill();
      const btnH = 56 * S; const btnR = 8 * S;
      const grad = ctx.createLinearGradient(btnX, btnY, btnX, btnY + btnH);
      grad.addColorStop(0, "#202020"); grad.addColorStop(0.9, "#0d0d0d");
      ctx.fillStyle = grad; rr(ctx, btnX, btnY, btnW, btnH, btnR); ctx.fill();
      ctx.strokeStyle = "rgba(255, 154, 109, 0.3)"; ctx.lineWidth = 0.2 * S;
      rr(ctx, btnX, btnY, btnW, btnH, btnR); ctx.stroke();
      ctx.save(); rr(ctx, btnX, btnY, btnW, btnH, btnR); ctx.clip();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)"; ctx.lineWidth = 1.5 * S;
      rr(ctx, btnX + 0.5 * S, btnY + 0.5 * S, btnW - 1 * S, btnH + 3 * S, btnR); ctx.stroke();
      ctx.restore();
      ctx.fillStyle = "#ffffff";
      ctx.font = `500 ${16 * S}px "Plus Jakarta Sans", -apple-system, sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("Sign Up →", cx, btnY + btnH / 2);
    }

    // "Already a user? Log in"
    const loginOp = eo(progress, 0.65, 0.78);
    if (loginOp > 0) {
      ctx.globalAlpha = cardOp * loginOp;
      const linkY = cardY + 314 * S;
      ctx.font = `400 ${14 * S}px "Plus Jakarta Sans", -apple-system, sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      const part1 = "Already a user? "; const part2 = "Log in";
      const w1 = ctx.measureText(part1).width; const w2 = ctx.measureText(part2).width;
      const startX = cx - (w1 + w2) / 2;
      ctx.fillStyle = "#ffffff"; ctx.textAlign = "left";
      ctx.fillText(part1, startX, linkY);
      ctx.fillText(part2, startX + w1, linkY);
      const metrics = ctx.measureText(part2);
      ctx.fillRect(startX + w1, linkY + 18 * S, metrics.width, 1 * S);
    }

    ctx.globalAlpha = 1;
    ctx.textAlign = "left";
  }

  // ── 9. Home indicator ──
  const hiOp = eo(progress, 0.75, 0.88);
  if (hiOp > 0) {
    ctx.globalAlpha = hiOp;
    ctx.fillStyle = "#ffffff";
    const iW = 152 * S;
    const iH = 5 * S;
    rr(ctx, (CW - iW) / 2, (852 - 13) * S, iW, iH, 100 * S);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ── 10. Cross-fade to static splash image ──
  const fadeOp = eo(progress, 0.65, 0.78);
  if (fadeOp > 0 && images.splashFull) {
    ctx.globalAlpha = fadeOp;
    ctx.drawImage(images.splashFull, 0, 0, CW, CH);
    ctx.globalAlpha = 1;
  }

  ctx.globalAlpha = 1;
}

/* ── 3D Phone Model ── */

function IPhoneModel({
  rotationX,
  rotationY,
  rotationZ,
  screenDarknessRef,
  showSplashRef,
  splashProgressRef,
  storyProgressRef,
  commitmentProgressRef,
  creditCardProgressRef,
}: {
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  screenDarknessRef: React.RefObject<number>;
  showSplashRef: React.RefObject<boolean>;
  splashProgressRef: React.RefObject<number>;
  storyProgressRef: React.RefObject<number>;
  commitmentProgressRef: React.RefObject<number>;
  creditCardProgressRef: React.RefObject<number>;
}) {
  const { nodes, materials } = useGLTF(MODEL_PATH) as any;
  const rawHome = useTexture(SCREEN_TEXTURE);
  const homeTex = useMemo(() => prepareScreenTex(rawHome), [rawHome]);

  const staticSplashTexRef = useRef<THREE.Texture | null>(null);
  const paymentTexRef = useRef<THREE.Texture | null>(null);
  const deferredLoaded = useRef(false);

  const screenMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ map: homeTex }),
    [homeTex],
  );

  const activeTexRef = useRef<"home" | "splash" | "splash-static" | "video" | "payment">("home");

  // Back-of-phone logo texture
  const backLogoTex = useMemo(() => {
    const cvs = document.createElement("canvas");
    cvs.width = 512;
    cvs.height = 512;
    const ctx = cvs.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, 512, 512);
      ctx.save();
      ctx.translate(256, 256);
      ctx.scale(1.75, 1.75);
      ctx.translate(-27, -32);
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      const p = new Path2D("M19.9602 64H5.9621V33.93H0V25.6348H5.9621C2.64403 12.7772 12.0107 5.06969 17.1087 2.82312C32.0401 -5.0573 47.5244 5.41532 53.4002 11.6367V64H39.402V18.6357C31.3142 5.36345 21.1699 8.43958 17.1087 11.6367C11.9243 20.554 19.269 24.6843 23.5894 25.6348H30.8476V33.93H19.9602V64Z");
      ctx.fill(p);
      ctx.restore();
    }
    const tex = new THREE.CanvasTexture(cvs);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
  const lastProgressRef = useRef(-1);

  const videoTexRef = useRef<{ video: HTMLVideoElement; tex: THREE.VideoTexture } | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const loadDeferredAssets = useCallback(() => {
    if (deferredLoaded.current) return;
    deferredLoaded.current = true;

    const loader = new THREE.TextureLoader();
    loader.load(SPLASH_TEXTURE, (raw) => { staticSplashTexRef.current = prepareScreenTex(raw); });
    loader.load(PAYMENT_TEXTURE, (raw) => { paymentTexRef.current = prepareScreenTex(raw); });

    const video = document.createElement("video");
    video.src = "/assets/screens/splash-video.mp4";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.load();
    videoRef.current = video;

    video.addEventListener("canplay", () => {
      const tex = new THREE.VideoTexture(video);
      tex.flipY = false;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.center.set(0.5, 0.5);
      tex.rotation = Math.PI;
      tex.repeat.set(-0.833, 0.833);
      tex.colorSpace = THREE.SRGBColorSpace;
      videoTexRef.current = { video, tex };
    }, { once: true });
  }, []);

  const imagesRef = useRef<SplashImages>({
    bgPattern: null, logo: null, splashFull: null, loaded: false,
  });

  const { splashCanvas, splashTex } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = CW;
    canvas.height = CH;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#131313";
      ctx.fillRect(0, 0, CW, CH);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.flipY = false;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.center.set(0.5, 0.5);
    tex.rotation = Math.PI;
    tex.repeat.x = -1;
    tex.colorSpace = THREE.SRGBColorSpace;
    return { splashCanvas: canvas, splashTex: tex };
  }, []);

  useEffect(() => {
    const load = (src: string) =>
      new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img);
        img.src = src;
      });

    Promise.all([
      load("/assets/screens/splash-bg-pattern.png"),
      load("/assets/screens/splash-logo.svg"),
      load("/assets/screens/splash-screen.png"),
    ]).then(([bgPattern, logo, splashFull]) => {
      imagesRef.current = { bgPattern, logo, splashFull, loaded: true };
    });
  }, []);

  useFrame(() => {
    const d = screenDarknessRef.current ?? 0;
    const b = 1 - d;
    screenMaterial.color.setRGB(b, b, b);

    const wantSplash = showSplashRef.current ?? false;
    if (wantSplash) loadDeferredAssets();
    const ANIM_CAP = 0.78;
    const ccProgress = creditCardProgressRef.current ?? 0;

    // CreditCard section or gap before it: show payment screen
    const cmt = commitmentProgressRef.current ?? 0;
    const shouldShowPayment = ccProgress > 0 || cmt > 0.85 || activeTexRef.current === "payment";
    if (shouldShowPayment && paymentTexRef.current && wantSplash) {
      screenMaterial.color.setRGB(b, b, b);
      if (videoTexRef.current) videoTexRef.current.video.pause();
      if (activeTexRef.current !== "payment") {
        screenMaterial.map = paymentTexRef.current;
        screenMaterial.needsUpdate = true;
        activeTexRef.current = "payment";
      }
      return;
    }

    if (wantSplash) {
      const p = splashProgressRef.current ?? 0;

      if (p < ANIM_CAP) {
        // Animate: draw canvas splash up to the cap
        if (imagesRef.current.loaded && Math.abs(p - lastProgressRef.current) > 0.003) {
          const ctx = splashCanvas.getContext("2d");
          if (ctx) {
            drawSplash(ctx, p, imagesRef.current);
            splashTex.needsUpdate = true;
            lastProgressRef.current = p;
          }
        }
        if (activeTexRef.current !== "splash") {
          screenMaterial.map = splashTex;
          screenMaterial.needsUpdate = true;
          activeTexRef.current = "splash";
        }
      } else {
        const sp = storyProgressRef.current ?? 0;

        if (cmt > 0) {
          // During commitment: keep video looping, gradually dim
          const dimAmount = Math.min(cmt / 0.333, 1);
          const brightness = 1 - dimAmount * 0.85;
          screenMaterial.color.setRGB(brightness, brightness, brightness);
          if (videoTexRef.current) {
            if (activeTexRef.current !== "video") {
              screenMaterial.map = videoTexRef.current.tex;
              screenMaterial.needsUpdate = true;
              activeTexRef.current = "video";
              videoTexRef.current.video.play().catch(() => {});
            }
          }
        } else if (sp >= 0.55 && videoTexRef.current) {
          // Story section past card 2: play video
          screenMaterial.color.setRGB(b, b, b);
          if (activeTexRef.current !== "video") {
            screenMaterial.map = videoTexRef.current.tex;
            screenMaterial.needsUpdate = true;
            activeTexRef.current = "video";
            videoTexRef.current.video.play().catch(() => {});
          }
        } else if (activeTexRef.current === "video" && videoTexRef.current) {
          // Video already playing — keep it going (avoids flash between sections)
          screenMaterial.color.setRGB(b, b, b);
        } else {
          // Story cards 1 & 2: static splash
          screenMaterial.color.setRGB(b, b, b);
          if (activeTexRef.current !== "splash-static") {
            if (!staticSplashTexRef.current) return;
            screenMaterial.map = staticSplashTexRef.current;
            screenMaterial.needsUpdate = true;
            activeTexRef.current = "splash-static";
          }
        }
      }
    } else {
      if (activeTexRef.current !== "home") {
        if (videoTexRef.current) videoTexRef.current.video.pause();
        screenMaterial.map = homeTex;
        screenMaterial.needsUpdate = true;
        activeTexRef.current = "home";
        lastProgressRef.current = -1;
      }
    }
  });

  useEffect(() => {
    Object.entries(materials).forEach(([, mat]: [string, any]) => {
      mat.color = new THREE.Color("#131313");
      mat.transparent = false;
      mat.opacity = 1;
      mat.side = THREE.DoubleSide;
      if (mat !== screenMaterial) {
        if (mat.map) mat.map = null;
        if (mat.emissiveMap) mat.emissiveMap = null;
      }
      if (mat.emissive) mat.emissive = new THREE.Color("#000000");
      mat.needsUpdate = true;
    });
  }, [materials, screenMaterial]);

  return (
    <group
      dispose={null}
      scale={0.09}
      rotation={[
        (rotationX * Math.PI) / 180,
        (rotationY * Math.PI) / 180,
        (rotationZ * Math.PI) / 180,
      ]}
    >
      <mesh geometry={nodes.ttmRoLdJipiIOmf.geometry} material={materials.hUlRcbieVuIiOXG} />
      <mesh geometry={nodes.DjsDkGiopeiEJZK.geometry} material={materials.PaletteMaterial001} />
      <mesh geometry={nodes.buRWvyqhBBgcJFo.geometry} material={materials.PaletteMaterial002} />
      <mesh geometry={nodes.MrMmlCAsAxJpYqQ_0.geometry} material={materials.dxCVrUCvYhjVxqy} />
      <mesh geometry={nodes.wqbHSzWaUxBCwxY_0.geometry} material={materials.MHFGNLrDQbTNima} />
      <mesh geometry={nodes.QvGDcbDApaGssma.geometry} material={materials.kUhjpatHUvkBwfM} />
      <mesh geometry={nodes.vFwJFNASGvEHWhs.geometry} material={materials.RJoymvEsaIItifI} />
      <mesh geometry={nodes.evAxFwhaQUwXuua.geometry} material={materials.KSIxMqttXxxmOYl} />
      <mesh geometry={nodes.USxQiqZgxHbRvqB.geometry} material={materials.mcPrzcBUcdqUybC} />
      <mesh geometry={nodes.TvgBVmqNmSrFVfW.geometry} material={materials.pIhYLPqiSQOZTjn} />
      <mesh geometry={nodes.GuYJryuYunhpphO.geometry} material={materials.eShKpuMNVJTRrgg} />
      <mesh geometry={nodes.pvdHknDTGDzVpwc.geometry} material={materials.xdyiJLYTYRfJffH} />
      <mesh geometry={nodes.CfghdUoyzvwzIum.geometry} material={materials.jpGaQNgTtEGkTfo} />
      <mesh geometry={nodes.DjdhycfQYjKMDyn.geometry} material={materials.ujsvqBWRMnqdwPx} />
      <mesh geometry={nodes.usFLmqcyrnltBUr.geometry} material={materials.sxNzrmuTqVeaXdg} />
      <mesh geometry={nodes.xXDHkMplTIDAXLN.geometry} material={screenMaterial} />
      <mesh geometry={nodes.vELORlCJixqPHsZ.geometry} material={materials.zFdeDaGNRwzccye} />
      <mesh geometry={nodes.EbQGKrWAqhBHiMv.geometry} material={materials.TBLSREBUyLMVtJa} />
      <mesh geometry={nodes.EddVrWkqZTlvmci.geometry} material={materials.xNrofRCqOXXHVZt} />
      <mesh geometry={nodes.KSWlaxBcnPDpFCs.geometry} material={materials.yQQySPTfbEJufve} />
      <mesh geometry={nodes.TakBsdEjEytCAMK.geometry} material={materials.PaletteMaterial003} />
      <mesh geometry={nodes.IykfmVvLplTsTEW.geometry} material={materials.PaletteMaterial004} />
      <mesh geometry={nodes.wLfSXtbwRlBrwof.geometry} material={materials.oZRkkORNzkufnGD} />
      <mesh geometry={nodes.WJwwVjsahIXbJpU.geometry} material={materials.yhcAXNGcJWCqtIS} />
      <mesh geometry={nodes.YfrJNXgMvGOAfzz.geometry} material={materials.bCgzXjHOanGdTFV} />
      <mesh geometry={nodes.DCLCbjzqejuvsqH.geometry} material={materials.vhaEJjZoqGtyLdo} />
      <mesh geometry={nodes.CdalkzDVnwgdEhS.geometry} material={materials.jlzuBkUzuJqgiAK} />
      <mesh geometry={nodes.NtjcIgolNGgYlCg.geometry} material={materials.PpwUTnTFZJXxCoE} />
      <mesh geometry={nodes.pXBNoLiaMwsDHRF.geometry} material={materials.yiDkEwDSyEhavuP} />
      <mesh geometry={nodes.IkoiNqATMVoZFKD.geometry} material={materials.hiVunnLeAHkwGEo} />
      <mesh geometry={nodes.rqgRAGHOwnuBypi.geometry} material={materials.HGhEhpqSBZRnjHC} />
      {/* Flent logo on the back of the phone */}
      <mesh position={[0, 0, 0.55]}>
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial map={backLogoTex} transparent depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0, -3);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

useGLTF.preload(MODEL_PATH);
useTexture.preload(SCREEN_TEXTURE);

interface IPhone3DProps {
  rotationX?: number;
  rotationY?: number;
  rotationZ?: number;
  className?: string;
  screenDarknessRef?: React.RefObject<number>;
  showSplashRef?: React.RefObject<boolean>;
  splashProgressRef?: React.RefObject<number>;
  storyProgressRef?: React.RefObject<number>;
  commitmentProgressRef?: React.RefObject<number>;
  creditCardProgressRef?: React.RefObject<number>;
}

export function IPhone3D({
  rotationX = 0,
  rotationY = 0,
  rotationZ = 0,
  className = "",
  screenDarknessRef,
  showSplashRef,
  splashProgressRef,
  storyProgressRef,
  commitmentProgressRef,
  creditCardProgressRef,
}: IPhone3DProps) {
  const fbDarkness = useRef(0);
  const fbBool = useRef(false);
  const fbSplash = useRef(0);
  const fbStory = useRef(0);
  const fbCommit = useRef(0);
  const fbCC = useRef(0);
  const sdRef = screenDarknessRef ?? fbDarkness;
  const spRef = showSplashRef ?? fbBool;
  const spProgressRef = splashProgressRef ?? fbSplash;
  const stProgressRef = storyProgressRef ?? fbStory;
  const cmtProgressRef = commitmentProgressRef ?? fbCommit;
  const ccProgressRef = creditCardProgressRef ?? fbCC;

  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, -3], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        <CameraSetup />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, 2, 4]} intensity={0.3} />
        <Suspense fallback={null}>
          <Environment preset="city" environmentIntensity={0.4} />
          <IPhoneModel
            rotationX={rotationX}
            rotationY={rotationY}
            rotationZ={rotationZ}
            screenDarknessRef={sdRef}
            showSplashRef={spRef}
            splashProgressRef={spProgressRef}
            storyProgressRef={stProgressRef}
            commitmentProgressRef={cmtProgressRef}
            creditCardProgressRef={ccProgressRef}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
