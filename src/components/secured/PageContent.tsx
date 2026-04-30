"use client";

import { useEffect, useRef } from "react";
import { useVariant } from "./VariantContext";
import { TickerBanner } from "./TickerBanner";

const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  float cellSize = 24.0;
  vec2 pixel = gl_FragCoord.xy;
  vec2 uv = pixel / u_resolution;
  vec2 cell = floor(pixel / cellSize);
  vec2 local = (pixel - cell * cellSize) / cellSize;

  // Random per cell
  float r = hash(cell);
  float r2 = hash(cell + 100.0);
  float r3 = hash(cell + 200.0);

  // ~45% of cells have a star
  float hasStar = step(0.55, r);

  // Star center
  vec2 center = vec2(0.25 + r2 * 0.5, 0.25 + r3 * 0.5);
  float dist = length(local - center);

  // Varying sizes — tiny pinpoints to larger stars
  float baseRadius = 0.03 + r2 * 0.12;

  // Soft circular dot
  float star = 1.0 - smoothstep(baseRadius * 0.3, baseRadius, dist);

  // Twinkling — each star breathes at its own rate
  float twinkleSpeed = 0.5 + r * 1.5;
  float twinklePhase = r3 * 6.2832;
  float twinkle = sin(u_time * twinkleSpeed + twinklePhase);
  // Stars go from nearly invisible to bright
  float twinkleFactor = twinkle * 0.5 + 0.5; // 0..1

  // Sweeping brightness wave — obvious diagonal movement
  float wave = sin(uv.x * 3.0 + uv.y * 2.0 - u_time * 0.8) * 0.5 + 0.5;
  float wave2 = sin(uv.y * 4.0 - uv.x * 1.5 + u_time * 0.6) * 0.5 + 0.5;

  // Stars fade in/out with the wave — simulates movement
  float waveInfluence = wave * 0.5 + wave2 * 0.5;

  // Combined brightness: twinkle x wave creates visible pulsing regions
  float brightness = (0.04 + twinkleFactor * 0.16 + waveInfluence * 0.14) * hasStar * star;

  // Size variation via wave — larger stars in bright regions
  float sizeWave = 1.0 + waveInfluence * 0.4;
  float starSized = 1.0 - smoothstep(baseRadius * sizeWave * 0.3, baseRadius * sizeWave, dist);
  brightness = (0.04 + twinkleFactor * 0.16 + waveInfluence * 0.14) * hasStar * starSized;

  // All white — no orange
  gl_FragColor = vec4(vec3(brightness), 1.0);
}
`;

function StarfieldCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startTime = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, antialias: false });
    if (!gl) return;

    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VERT);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, FRAG);
    gl.compileShader(fs);

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);
    startTime.current = performance.now();

    const draw = (t: number) => {
      const elapsed = (t - startTime.current) * 0.001;
      const uRes = gl.getUniformLocation(prog, "u_resolution");
      const uTime = gl.getUniformLocation(prog, "u_time");
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0"
      style={{
        zIndex: 0,
        opacity: active ? 1 : 0,
        transition: "opacity 0.7s cubic-bezier(0.77, 0, 0.175, 1)",
        pointerEvents: "none",
      }}
    />
  );
}

export function PageContent({ children }: { children: React.ReactNode }) {
  const { menuOpen, variant } = useVariant();

  return (
    <div className="relative">
      {variant === "tenant" && <TickerBanner />}
      <StarfieldCanvas active={menuOpen} />

      {/* Page content */}
      <div
        style={{
          transform: menuOpen ? "scale(0.97) translateY(8px)" : "scale(1) translateY(0px)",
          transformOrigin: "top center",
          borderRadius: menuOpen ? "16px" : "0px",
          transition:
            "transform 0.7s cubic-bezier(0.77, 0, 0.175, 1), border-radius 0.7s cubic-bezier(0.77, 0, 0.175, 1)",
          willChange: "transform",
          overflow: menuOpen ? "hidden" : undefined,
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}
