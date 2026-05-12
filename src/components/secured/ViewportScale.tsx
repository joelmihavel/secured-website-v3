"use client";

import { useEffect } from "react";

const BASE_WIDTH = 1440;

export function ViewportScale() {
  useEffect(() => {
    function applyZoom() {
      const vw = window.innerWidth;
      if (vw > BASE_WIDTH) {
        document.documentElement.style.zoom = `${vw / BASE_WIDTH}`;
      } else {
        document.documentElement.style.zoom = "";
      }
    }

    applyZoom();
    window.addEventListener("resize", applyZoom);
    return () => {
      window.removeEventListener("resize", applyZoom);
      document.documentElement.style.zoom = "";
    };
  }, []);

  return null;
}
