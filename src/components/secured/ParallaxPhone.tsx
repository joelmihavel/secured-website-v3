"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { IPhone3D } from "./IPhone3D";

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

const HERO_ROT_X = 5;
const HERO_ROT_Y = 25;
const HERO_ROT_Z = -20;

function usePhoneScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setScale(0.5);
      else if (w < 1024) setScale(0.7);
      else setScale(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}

export function ParallaxPhone({ entered: entryUnlocked = false }: { entered?: boolean }) {
  const [entered, setEntered] = useState(false);
  const [dropDone, setDropDone] = useState(false);
  const [floating, setFloating] = useState(false);
  const [ribbonProgress, setRibbonProgress] = useState(0);
  const [style, setStyle] = useState({
    rotX: HERO_ROT_X,
    rotY: HERO_ROT_Y,
    rotZ: HERO_ROT_Z,
    translateY: 0,
    opacity: 0,
    scale: 1,
  });
  const rafRef = useRef(0);
  const phoneScale = usePhoneScale();

  const screenDarknessRef = useRef(0);
  const showSplashRef = useRef(false);
  const splashProgressRef = useRef(0);
  const storyProgressRef = useRef(0);
  const commitmentProgressRef = useRef(0);
  const creditCardProgressRef = useRef(0);

  useEffect(() => {
    if (!entryUnlocked) return;
    const t = setTimeout(() => setEntered(true), 300);
    const t2 = setTimeout(() => setDropDone(true), 1200);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [entryUnlocked]);

  const update = useCallback(() => {
    const hero = document.querySelector("[data-section='hero']") as HTMLElement | null;
    if (!hero) return;

    const scrollY = window.scrollY;
    const viewH = window.innerHeight;
    const heroBottom = hero.offsetTop + hero.offsetHeight;

    const straightenStart = heroBottom - viewH * 0.8;
    const straightenEnd = heroBottom + viewH * 0.1;

    if (scrollY < straightenStart) {
      setFloating(true);
      screenDarknessRef.current = 0;
      showSplashRef.current = false;
      setRibbonProgress(0);
      setStyle({
        rotX: HERO_ROT_X,
        rotY: HERO_ROT_Y,
        rotZ: HERO_ROT_Z,
        translateY: 0,
        opacity: 1,
        scale: 1,
      });
      return;
    }

    setFloating(false);

    if (scrollY < straightenEnd) {
      const t = smoothstep((scrollY - straightenStart) / (straightenEnd - straightenStart));
      screenDarknessRef.current = 0;
      showSplashRef.current = false;
      setRibbonProgress(0);
      setStyle({
        rotX: HERO_ROT_X * (1 - t),
        rotY: HERO_ROT_Y * (1 - t),
        rotZ: HERO_ROT_Z * (1 - t),
        translateY: 0,
        opacity: 1,
        scale: 1,
      });
      return;
    }

    const ribbon = document.querySelector("[data-section='ribbon-transition']") as HTMLElement | null;
    if (ribbon) {
      const ribbonTop = ribbon.offsetTop;
      const ribbonHeight = ribbon.offsetHeight;
      const ribbonEnd = ribbonTop + ribbonHeight - viewH;

      if (scrollY >= ribbonTop && scrollY <= ribbonEnd) {
        const rp = (scrollY - ribbonTop) / (ribbonEnd - ribbonTop);

        let dark: number;
        if (rp < 0.05) dark = 0;
        else if (rp < 0.15) dark = smoothstep((rp - 0.05) / 0.10);
        else if (rp < 0.20) dark = 1;
        else if (rp < 0.30) dark = 1 - smoothstep((rp - 0.20) / 0.10);
        else dark = 0;

        showSplashRef.current = rp >= 0.15;
        screenDarknessRef.current = dark;
        splashProgressRef.current = rp < 0.25 ? 0 : rp > 0.90 ? 1 : (rp - 0.25) / 0.65;
        setRibbonProgress(rp);

        setStyle({
          rotX: 0, rotY: 0, rotZ: 0,
          translateY: 0,
          opacity: 1,
          scale: 1,
        });
        return;
      }

      if (scrollY > ribbonEnd) {
        screenDarknessRef.current = 0;
        showSplashRef.current = true;
        splashProgressRef.current = 1;
        setRibbonProgress(1);
      }
    } else {
      screenDarknessRef.current = 0;
      showSplashRef.current = false;
      splashProgressRef.current = 0;
      setRibbonProgress(0);
    }

    storyProgressRef.current = 0;
    const story = document.querySelector("[data-section='story']") as HTMLElement | null;
    if (story) {
      const storyTop = story.offsetTop;
      const storyHeight = story.offsetHeight;
      const storyStart = storyTop - viewH * 0.5;
      const storyEnd = storyTop + storyHeight - viewH;

      if (scrollY >= storyStart && scrollY <= storyEnd) {
        const storyProgress = (scrollY - storyStart) / (storyEnd - storyStart);
        storyProgressRef.current = storyProgress;

        let shiftY = 0;
        if (storyProgress < 0.53) {
          shiftY = 0;
        } else if (storyProgress < 0.62) {
          const t = (storyProgress - 0.53) / 0.09;
          shiftY = -viewH * 0.12 * smoothstep(t);
        } else if (storyProgress < 0.90) {
          shiftY = -viewH * 0.12;
        } else {
          const t = (storyProgress - 0.90) / 0.10;
          shiftY = -viewH * 0.12 * (1 - smoothstep(t));
        }

        setStyle({
          rotX: 0, rotY: 0, rotZ: 0,
          translateY: shiftY,
          opacity: 1,
          scale: 1,
        });
        return;
      }
    }

    commitmentProgressRef.current = 0;
    const commitment = document.querySelector("[data-section='commitment']") as HTMLElement | null;
    if (commitment) {
      const cmtTop = commitment.offsetTop;
      const cmtHeight = commitment.offsetHeight;
      const cmtEnd = cmtTop + cmtHeight;
      if (scrollY >= cmtTop - viewH && scrollY <= cmtEnd) {
        const cmtProgress = Math.max(0, (scrollY - (cmtTop - viewH)) / cmtHeight);
        commitmentProgressRef.current = cmtProgress;
        // Rotate during first 2 cards, hold at 180° for the rest
        const rotY = cmtProgress < 0.333
          ? smoothstep(cmtProgress / 0.333) * 180
          : 180;
        setStyle({
          rotX: 0, rotY, rotZ: 0,
          translateY: 0,
          opacity: 1,
          scale: 1,
        });
        return;
      }
    }

    creditCardProgressRef.current = 0;
    const creditCard = document.querySelector("[data-section='credit-card']") as HTMLElement | null;
    const phoneHalfH = 455 * phoneScale;

    if (creditCard && commitment) {
      const cmtEnd2 = commitment.offsetTop + commitment.offsetHeight;
      const ccTop = creditCard.offsetTop;
      const gapSize = ccTop - cmtEnd2;

      // Flip back in the gap between commitment and credit card
      if (scrollY >= cmtEnd2 - viewH * 0.5 && scrollY < ccTop - viewH * 0.5) {
        const flipProgress = Math.max(0, Math.min(1, (scrollY - (cmtEnd2 - viewH * 0.5)) / gapSize));
        const rotY = 180 * (1 - smoothstep(flipProgress));
        setStyle({
          rotX: 0, rotY, rotZ: 0,
          translateY: -viewH * 0.18 * smoothstep(flipProgress),
          opacity: 1,
          scale: 1,
        });
        return;
      }

      const ccHeight = creditCard.offsetHeight;
      const ccEnd = ccTop + ccHeight;
      const phoneBottom = scrollY + viewH / 2 + phoneHalfH;
      const overflow = phoneBottom - (ccTop - 64);

      if (scrollY >= ccTop - viewH && scrollY <= ccEnd) {
        creditCardProgressRef.current = Math.max(0, (scrollY - (ccTop - viewH)) / ccHeight);
        const lockPoint = ccTop - viewH * 0.3;
        const scrollPast = Math.max(0, scrollY - lockPoint);
        setStyle({
          rotX: 0, rotY: 0, rotZ: 0,
          translateY: -viewH * 0.18 - scrollPast,
          opacity: 1,
          scale: 1,
        });
        return;
      }

      // Past credit card section: keep same position, fade out
      if (scrollY > ccEnd) {
        setStyle({
          rotX: 0, rotY: 0, rotZ: 0,
          translateY: -viewH * 0.18,
          opacity: 0,
          scale: 1,
        });
        return;
      }
    }

    // Default fallback — only reached before hero phone enters
    setStyle((prev) => prev);
  }, [phoneScale]);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [update]);

  return (
    <>
    <style>{`
      @keyframes phone-float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-12px); }
      }
    `}</style>
    <div
      className="pointer-events-none fixed z-[15]"
      style={{
        left: "50%",
        top: "50%",
        width: `${455 * phoneScale}px`,
        height: `${910 * phoneScale}px`,
        transform: `translate(-50%, -50%) translateY(${entered ? style.translateY : -800}px) scale(${style.scale})`,
        opacity: entered ? style.opacity : 0,
        transition: dropDone ? undefined : "transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "transform, opacity",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          animation: dropDone && floating ? "phone-float 3s ease-in-out infinite" : "none",
          position: "relative",
        }}
      >
        <IPhone3D
          rotationX={style.rotX}
          rotationY={style.rotY}
          rotationZ={style.rotZ}
          className="h-full w-full"
          screenDarknessRef={screenDarknessRef}
          showSplashRef={showSplashRef}
          splashProgressRef={splashProgressRef}
          storyProgressRef={storyProgressRef}
          commitmentProgressRef={commitmentProgressRef}
          creditCardProgressRef={creditCardProgressRef}
        />
      </div>
    </div>
    </>
  );
}
