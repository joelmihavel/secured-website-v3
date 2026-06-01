"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

// Hash-based pseudo-random
float hash(vec2 p) {
  float h = dot(p, vec2(127.1, 311.7));
  return fract(sin(h) * 43758.5453123);
}

// 2D value noise
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Fractal Brownian Motion — 5 octaves
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

// Star field
float stars(vec2 uv, float t) {
  float star = 0.0;
  // Two layers of stars at different scales
  for (int layer = 0; layer < 2; layer++) {
    float scale = 80.0 + float(layer) * 120.0;
    vec2 gridUv = uv * scale;
    vec2 gridId = floor(gridUv);
    vec2 gridFract = fract(gridUv) - 0.5;

    float rnd = hash(gridId + float(layer) * 100.0);

    // Only ~20% of cells have a star
    if (rnd > 0.80) {
      // Random offset within cell
      vec2 offset = vec2(hash(gridId * 1.3) - 0.5, hash(gridId * 2.7) - 0.5) * 0.6;
      float d = length(gridFract - offset);

      // Star brightness with twinkle
      float twinkle = sin(t * (1.0 + rnd * 3.0) + rnd * 6.2831) * 0.5 + 0.5;
      twinkle = mix(0.3, 1.0, twinkle);

      // Size varies by layer
      float size = 0.03 + rnd * 0.02;
      if (layer == 1) size *= 0.6;

      float brightness = smoothstep(size, 0.0, d) * twinkle;
      // Dimmer stars overall
      brightness *= (0.4 + rnd * 0.6);

      star += brightness;
    }
  }
  return star;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 uvAspect = vec2(uv.x * aspect, uv.y);

  float t = u_time * 0.04; // Very slow time

  // --- Nebula layers using fBM ---

  // Layer 1: purple/blue nebula drifting right-upward
  vec2 nebula1Uv = uvAspect * 1.8 + vec2(t * 0.3, t * 0.2);
  float n1 = fbm(nebula1Uv);
  n1 = smoothstep(0.35, 0.75, n1);

  // Layer 2: warm orange/amber nebula drifting left-downward
  vec2 nebula2Uv = uvAspect * 2.2 + vec2(-t * 0.25, -t * 0.15) + 50.0;
  float n2 = fbm(nebula2Uv);
  n2 = smoothstep(0.38, 0.78, n2);

  // Layer 3: deep blue accent, slow circular drift
  vec2 nebula3Uv = uvAspect * 1.5 + vec2(sin(t * 0.5) * 0.3, cos(t * 0.4) * 0.3) + 100.0;
  float n3 = fbm(nebula3Uv);
  n3 = smoothstep(0.4, 0.8, n3);

  // --- Colors ---
  vec3 baseColor = vec3(0.04, 0.04, 0.04); // ~#0a0a0a

  vec3 purple = vec3(0.35, 0.12, 0.55);
  vec3 blue = vec3(0.1, 0.15, 0.5);
  vec3 warmOrange = vec3(1.0, 0.6, 0.43); // #ff9a6d tinted
  vec3 deepBlue = vec3(0.08, 0.12, 0.4);

  // Blend nebula colors at low opacity (~10-15%)
  vec3 nebulaColor = vec3(0.0);
  nebulaColor += mix(purple, blue, sin(t * 0.7) * 0.5 + 0.5) * n1 * 0.13;
  nebulaColor += warmOrange * n2 * 0.10;
  nebulaColor += deepBlue * n3 * 0.12;

  // Subtle vignette to darken edges
  float vignette = 1.0 - length((uv - 0.5) * 1.3);
  vignette = smoothstep(0.0, 1.0, vignette);

  // Combine
  vec3 color = baseColor + nebulaColor * vignette;

  // Stars
  float starField = stars(uvAspect, u_time);
  color += vec3(starField * 0.7) * vignette;

  // Clamp output
  color = clamp(color, 0.0, 1.0);

  gl_FragColor = vec4(color, 1.0);
}
`;

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Compile shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      FRAGMENT_SHADER
    );
    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    // Fullscreen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");

    // Resize handler
    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const drawWidth = Math.floor(width * dpr);
      const drawHeight = Math.floor(height * dpr);

      if (canvas.width !== drawWidth || canvas.height !== drawHeight) {
        canvas.width = drawWidth;
        canvas.height = drawHeight;
      }
    }

    resize();
    window.addEventListener("resize", resize);

    // Animation loop
    let animationId: number;
    const startTime = performance.now();

    function render() {
      if (!gl || !canvas) return;

      resize();
      gl.viewport(0, 0, canvas.width, canvas.height);

      gl.useProgram(program);

      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, (performance.now() - startTime) / 1000.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    // Throttle to 30fps instead of 60
    let lastFrame = 0;
    function loop(time: number) {
      if (time - lastFrame > 33) {
        lastFrame = time;
        render();
      }
      animationId = requestAnimationFrame(loop);
    }
    animationId = requestAnimationFrame(loop);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
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
        zIndex: 0,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
    />
  );
}
