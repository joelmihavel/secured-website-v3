"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

// Hash functions for noise
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float hash2(vec2 p) {
  return fract(sin(dot(p, vec2(269.5, 183.3))) * 93751.6453);
}

// Value noise
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// FBM (fractal brownian motion) for layered noise
float fbm(vec2 p) {
  float val = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 5; i++) {
    val += amp * noise(p * freq);
    freq *= 2.0;
    amp *= 0.5;
  }
  return val;
}

// Spectral color from CPPN-like function
vec3 spectralColor(vec2 uv, float t) {
  // Warp UVs with sinusoidal distortion
  float warp = 0.15;
  vec2 warped = uv + warp * vec2(
    sin(uv.y * 3.0 + t * 0.4),
    cos(uv.x * 3.0 + t * 0.3)
  );

  // Layered noise field
  float n1 = fbm(warped * 2.0 + t * 0.1);
  float n2 = fbm(warped * 4.0 - t * 0.15 + 100.0);
  float n3 = fbm(warped * 1.5 + vec2(t * 0.08, -t * 0.05));

  // Orange/warm spectral palette centered on #ff9a6d
  vec3 col = vec3(0.0);
  col += 0.5 + 0.5 * cos(6.2831 * (n1 * 0.8 + vec3(0.05, 0.15, 0.25)));

  // Shift toward warm orange
  col.r = col.r * 0.7 + n1 * 0.3;
  col.g = col.g * 0.4 + n2 * 0.15;
  col.b = col.b * 0.2 + n3 * 0.08;

  // Mix with pure orange accent
  vec3 accent = vec3(1.0, 0.604, 0.427); // #ff9a6d
  col = mix(col, accent, 0.3);

  return col;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float t = u_time;

  // Spectral noise color
  vec3 color = spectralColor(uv, t);

  // Film grain
  float grain = hash2(uv * u_resolution + t * 100.0);
  grain = (grain - 0.5) * 0.15;
  color += grain;

  // Scanlines (very subtle)
  float scanline = sin(gl_FragCoord.y * 1.5) * 0.5 + 0.5;
  scanline = pow(scanline, 8.0) * 0.08;
  color -= scanline;

  // Vignette
  float vig = distance(uv, vec2(0.5));
  vig = 1.0 - vig * 0.6;
  color *= vig;

  // Very low overall opacity for subtle overlay
  float alpha = 0.04;

  gl_FragColor = vec4(color * alpha, alpha);
}
`;

export function SpectraNoise() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    // Compile shaders
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VERT);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, FRAG);
    gl.compileShader(fs);

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.warn("SpectraNoise shader error:", gl.getShaderInfoLog(fs));
      return;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let raf = 0;
    const scale = 0.5; // Render at half res for performance

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * scale;
      canvas.height = h * scale;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();

    const render = () => {
      const t = (performance.now() - start) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
    };
  }, []);

  const updateVisibility = useCallback(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const footerTop = footer.getBoundingClientRect().top;
    setVisible(footerTop > 0);
  }, []);

  useEffect(() => {
    const onScroll = () => requestAnimationFrame(updateVisibility);
    updateVisibility();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [updateVisibility]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        zIndex: 1,
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
        mixBlendMode: "screen",
      }}
    />
  );
}
