"use client";

import { useEffect, useRef } from "react";

/**
 * Spectral Field — the brand gradient, rendered as a plain WebGL shader.
 *
 * One soft-focus aura of brand colour: deep blue pools settle at the top
 * (heaviest top-left), warm orange pools settle at the bottom (heaviest
 * bottom-right), and an airy light zone breathes between them. No lens,
 * no refraction, no channel splitting — the only hues that exist are the
 * brand's own blue and orange families. The field is kept alive with a
 * very slow liquid drift, pools that lean gently toward the pointer and
 * a scroll-driven deepening as the hero leaves the viewport. A fine
 * grain dithers the gradient so it never bands.
 *
 * Raw WebGL keeps this dependency-free and cheap: one fullscreen triangle
 * pair, one fragment shader, no post passes.
 */

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uPointer;
uniform float uPointerAmt;
uniform float uScroll;

const vec3 DEEP_BLUE = vec3(0.114, 0.278, 0.565);  /* brand #1d4790 */
const vec3 BLUE      = vec3(0.169, 0.353, 0.655);  /* brand #2b5aa7 */
const vec3 SKY       = vec3(0.494, 0.651, 0.847);  /* brand #7ea6d8 */
const vec3 SLATE     = vec3(0.310, 0.420, 0.585);  /* cool bridge */
const vec3 CREAM     = vec3(0.965, 0.830, 0.720);  /* airy light */
const vec3 EMBER     = vec3(0.941, 0.627, 0.317);  /* brand #f0a05a */
const vec3 ORANGE    = vec3(0.910, 0.463, 0.227);  /* brand #e8763a */
const vec3 DEEP_OR   = vec3(0.851, 0.373, 0.169);  /* brand #d95f2b */
const vec3 PAPER     = vec3(0.980, 0.980, 0.969);

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

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

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p = rot * p * 2.02;
    a *= 0.5;
  }
  return v;
}

/* soft radial weight: 1 at the centre of the pool, 0 beyond the radius */
float pool(vec2 uv, vec2 c, vec2 r) {
  vec2 d = (uv - c) / r;
  return 1.0 - smoothstep(0.0, 1.0, length(d));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * asp, uv.y);

  /* --- slow liquid drift, clearly alive — still kept tight so the field
         reads crisp, not hazy -------------------------------------------- */
  float d1 = fbm(vec2(p.x * 0.55 + uTime * 0.020, p.y * 0.55 - uTime * 0.034)) - 0.5;
  float d2 = fbm(vec2(p.x * 1.15 - uTime * 0.017, p.y * 1.15 + uTime * 0.024)) - 0.5;

  /* --- base field: blue family above, warm family below --------------- */
  float v = 1.0 - uv.y + (uv.x - 0.5) * 0.14;   /* ~0 top → ~1 bottom     */
  v += d1 * 0.09;                               /* breathing boundary     */
  v += uScroll * 0.12;                          /* deepens on exit        */
  v = clamp(v, 0.0, 1.0);

  vec3 cold = mix(DEEP_BLUE, BLUE, smoothstep(0.0, 0.32, v));
  cold = mix(cold, SLATE, smoothstep(0.44, 0.58, v));
  vec3 warm = mix(CREAM, EMBER, smoothstep(0.64, 0.72, v));
  warm = mix(warm, DEEP_OR, smoothstep(0.86, 0.98, v));
  vec3 col = mix(cold, warm, smoothstep(0.52, 0.62, v));

  /* --- colour pools: compact, defined masses (tight falloffs) --------- */
  vec2 lean = (uPointer - 0.5) * 0.12 * uPointerAmt; /* field leans toward the cursor */
  float breathe = 0.70 + 0.30 * d2;

  /* deep blue pool, heaviest at the top-left */
  col = mix(col, DEEP_BLUE,
    pool(uv + lean, vec2(0.08, 0.95), vec2(0.28, 0.35)) * breathe);

  /* airy sky pocket, top-right */
  col = mix(col, SKY,
    pool(uv + lean, vec2(0.86, 0.80), vec2(0.23, 0.26)) * (0.50 + 0.18 * d2));

  /* calm blue wash settling over the left side */
  col = mix(col, BLUE,
    pool(uv, vec2(0.06, 0.48), vec2(0.21, 0.30)) * (0.42 + 0.16 * d2));

  /* soft ember glow rising at the bottom-left */
  col = mix(col, EMBER,
    pool(uv + lean, vec2(0.10, 0.08), vec2(0.21, 0.15)) * (0.38 + 0.14 * d2));

  /* deep orange pool, heaviest at the bottom-right */
  col = mix(col, DEEP_OR,
    pool(uv + lean, vec2(0.98, 0.02), vec2(0.30, 0.25)) * breathe);

  /* vivid ember ridge hugging the bottom */
  col = mix(col, ORANGE,
    pool(uv, vec2(0.55, 0.10), vec2(0.38, 0.16)) * (0.58 + 0.20 * d2));

  /* --- brightness lift ------------------------------------------------ */
  col *= 1.22;

  /* calm pool for white typography */
  vec2 cpos = (uv - vec2(0.5, 0.53)) * vec2(asp * 0.56, 0.8);
  float centre = 1.0 - smoothstep(0.2, 0.88, length(cpos));
  col = mix(col, vec3(0.129, 0.278, 0.500), centre * 0.30);

  /* dissolve into the page colour toward the very corners */
  float vig = smoothstep(1.35, 0.58, length((uv - vec2(0.5, 0.5)) * vec2(0.92, 1.05)));
  col = mix(PAPER, col, vig);

  /* fine grain — dithers the gradient so it never bands */
  col += (hash(gl_FragCoord.xy) - 0.5) * 0.018;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("SpectralField shader:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function SpectralFieldBackground({
  className,
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const gl =
      canvas.getContext("webgl", {
        antialias: false,
        depth: false,
        stencil: false,
        alpha: false,
        powerPreference: "low-power",
      }) ?? null;

    /* No WebGL — the spectral CSS fallback beneath this canvas stays visible. */
    if (!gl) {
      canvas.style.display = "none";
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    /* No WebGL-capable shader — hide the canvas and let the spectral
       CSS fallback carry the hero. */
    if (!vs || !fs) {
      canvas.style.display = "none";
      return;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("SpectralField link:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const quad = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(program, "uRes"),
      time: gl.getUniformLocation(program, "uTime"),
      pointer: gl.getUniformLocation(program, "uPointer"),
      pointerAmt: gl.getUniformLocation(program, "uPointerAmt"),
      scroll: gl.getUniformLocation(program, "uScroll"),
    };

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);

    let width = 1;
    let height = 1;
    const stillMode = reduced;
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width * dpr));
      height = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(u.res, width, height);
      if (stillMode) {
        gl.uniform1f(u.time, 40.0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    };
    resize();
    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(wrap);

    /* smoothed uniforms */
    let scrollTarget = 0;
    let scrollValue = 0;
    let pointerTargetX = 0.5;
    let pointerTargetY = 0.55;
    let pointerX = pointerTargetX;
    let pointerY = pointerTargetY;
    let pointerAmtTarget = 0;
    let pointerAmt = 0;
    let lastMove = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      pointerTargetX = (e.clientX - rect.left) / Math.max(1, rect.width);
      pointerTargetY =
        1 - (e.clientY - rect.top) / Math.max(1, rect.height);
      lastMove = performance.now();
      pointerAmtTarget = 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    /* reduced motion renders one composed still frame, no loop */
    if (reduced) {
      gl.uniform1f(u.time, 40.0);
      gl.uniform2f(u.pointer, 0.5, 0.55);
      gl.uniform1f(u.pointerAmt, 0.0);
      gl.uniform1f(u.scroll, 0.0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      return () => {
        ro.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
      };
    }

    let visible = true;
    let pageVisible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.02 },
    );
    io.observe(wrap);
    const onVis = () => {
      pageVisible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVis);

    let raf = 0;
    let last = performance.now();
    let t = 40; /* start deep into the noise field for a lived-in first frame */

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible || !pageVisible) return;

      /* smooth-follow uniforms */
      t += dt;
      scrollValue += (scrollTarget - scrollValue) * Math.min(1, dt * 7);
      pointerX += (pointerTargetX - pointerX) * Math.min(1, dt * 6.5);
      pointerY += (pointerTargetY - pointerY) * Math.min(1, dt * 6.5);
      pointerAmtTarget =
        now - lastMove > 3400 ? 0.4 : 1;
      pointerAmt += (pointerAmtTarget - pointerAmt) * Math.min(1, dt * 3.2);

      /* scroll progress of the hero container, read once per frame */
      const rect = wrap.getBoundingClientRect();
      scrollTarget = Math.min(
        1,
        Math.max(0, -rect.top / Math.max(1, rect.height)),
      );

      gl.uniform1f(u.time, t);
      gl.uniform2f(u.pointer, pointerX, pointerY);
      gl.uniform1f(u.pointerAmt, pointerAmt);
      gl.uniform1f(u.scroll, scrollValue);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    raf = requestAnimationFrame(frame);

    const onLost = (e: Event) => e.preventDefault();
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      /* The context is kept alive rather than lost on unmount: React
         StrictMode remounts the same canvas element in dev, and a lost
         context cannot be re-compiled against. The RAF + visibility
         gates already stop all rendering cost when idle. */
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("webglcontextlost", onLost);
    };
  }, []);

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      {/* CSS spectral fallback, also the pre-JS paint */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 80% at 8% 2%, #1d4790 0%, rgba(29,71,144,0) 62%)," +
            "radial-gradient(85% 75% at 88% 6%, #7ea6d8 0%, rgba(126,166,216,0) 60%)," +
            "radial-gradient(80% 70% at 6% 60%, #2b5aa7 0%, rgba(43,90,167,0) 62%)," +
            "radial-gradient(70% 60% at 10% 96%, #c9803f 0%, rgba(201,128,63,0) 58%)," +
            "radial-gradient(120% 90% at 94% 96%, #b54a14 0%, rgba(181,74,20,0) 64%)," +
            "linear-gradient(171deg, #23549f 0%, #56719c 46%, #e9b987 66%, #e8763a 84%, #c94e1d 100%)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
