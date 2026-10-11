"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/*
 * Building blocks shared by every 3D stage on the site: the brand colours,
 * a pedestal with glowing rims, a light beam, rising motes and a click burst.
 * Keeping them here makes the hero and the closing scene read as one set.
 */

export const MINT = new THREE.Color("#9fdfc4");
export const MINT_DEEP = new THREE.Color("#4fb08a");
export const FOREST = new THREE.Color("#143f39");
export const LEAF = new THREE.Color("#17694a");

/** Small deterministic PRNG (mulberry32) so particle layouts are pure and stable. */
export function seededRandom(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Radial-gradient texture shared by every glow sprite. */
export function useGlowTexture() {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.35)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

let cachedFamily: string | null = null;
/** The page's body font stack (next/font gives it a generated family name), for canvas text. */
export function canvasFontFamily() {
  if (!cachedFamily) cachedFamily = getComputedStyle(document.body).fontFamily || "system-ui, sans-serif";
  return cachedFamily;
}

/** Resolves once the font used on the phone screens is loaded (or after a short timeout). */
export function useFontReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const done = () => {
      if (!cancelled) setReady(true);
    };
    const fonts = document.fonts;
    if (!fonts) {
      done();
      return;
    }
    Promise.race([
      Promise.all([fonts.load(`800 24px ${canvasFontFamily()}`), fonts.load(`500 24px ${canvasFontFamily()}`)]),
      new Promise((r) => setTimeout(r, 1500)),
    ]).then(done, done);
    return () => {
      cancelled = true;
    };
  }, []);
  return ready;
}

export function GlowRing({
  radius,
  y,
  color,
  width = 0.012,
  glow = 0.07,
  glowOpacity = 0.18,
}: {
  radius: number;
  y: number;
  color: THREE.Color;
  width?: number;
  glow?: number;
  glowOpacity?: number;
}) {
  return (
    <group position={[0, y, 0]} rotation-x={-Math.PI / 2}>
      <mesh>
        <torusGeometry args={[radius, width, 12, 192]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh>
        <torusGeometry args={[radius, glow, 12, 192]} />
        <meshBasicMaterial color={color} transparent opacity={glowOpacity} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Two-tier pedestal with glowing rims. "light" sits on the page, "dark" in the forest-green panel. */
export function Pedestal({ tone, scale = 1 }: { tone: "light" | "dark"; scale?: number }) {
  const tex = useGlowTexture();
  const dark = tone === "dark";
  const rim = dark ? MINT : MINT_DEEP;
  return (
    <group scale={scale}>
      {dark ? (
        <mesh position={[0, -0.2, 0]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[6.4, 6.4]} />
          <meshBasicMaterial map={tex} color={MINT} transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      ) : (
        <mesh position={[0, -0.2, 0]} rotation-x={-Math.PI / 2} scale={[1, 0.62, 1]}>
          <planeGeometry args={[5.6, 5.6]} />
          <meshBasicMaterial map={tex} color="#1d4a3f" transparent opacity={0.22} depthWrite={false} toneMapped={false} />
        </mesh>
      )}
      <mesh position={[0, -0.09, 0]}>
        <cylinderGeometry args={[2.05, 2.15, 0.14, 128]} />
        <meshStandardMaterial color={dark ? "#17433b" : "#e6f0ea"} metalness={dark ? 0.2 : 0} roughness={0.5} envMapIntensity={0.7} />
      </mesh>
      <GlowRing radius={2.06} y={-0.015} color={rim} glowOpacity={dark ? 0.32 : 0.28} />
      <mesh position={[0, 0.055, 0]}>
        <cylinderGeometry args={[1.62, 1.67, 0.13, 128]} />
        <meshStandardMaterial color={dark ? "#1f5249" : "#f7fbf8"} metalness={dark ? 0.25 : 0} roughness={0.45} envMapIntensity={0.8} />
      </mesh>
      <GlowRing radius={1.625} y={0.123} color={rim} width={0.01} glow={0.05} glowOpacity={dark ? 0.34 : 0.3} />
      <mesh position={[0, -0.16, 0]} rotation-x={-Math.PI / 2}>
        <torusGeometry args={[2.38, 0.006, 8, 192]} />
        <meshBasicMaterial color={rim} transparent opacity={dark ? 0.5 : 0.4} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.125, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[3.2, 3.2]} />
        <meshBasicMaterial map={tex} color={MINT} transparent opacity={dark ? 0.3 : 0.5} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Soft shaft of light: brighter at the edges, fading upward. */
export function Beam({
  height,
  topRadius,
  bottomRadius,
  strength = 0.2,
  color = MINT,
  x = 0,
}: {
  height: number;
  topRadius: number;
  bottomRadius: number;
  strength?: number;
  color?: THREE.Color;
  x?: number;
}) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: { uTime: { value: 0 }, uColor: { value: color.clone() }, uStrength: { value: strength } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          varying vec3 vNormalV;
          varying vec3 vViewDir;
          void main() {
            vUv = uv;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vNormalV = normalize(normalMatrix * normal);
            vViewDir = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          uniform float uStrength;
          uniform vec3 uColor;
          varying vec2 vUv;
          varying vec3 vNormalV;
          varying vec3 vViewDir;
          void main() {
            float facing = abs(dot(vNormalV, vViewDir));
            float edge = pow(1.0 - facing, 1.6);
            float body = 0.18 + 0.82 * edge;
            float fadeUp = smoothstep(1.0, 0.25, vUv.y);
            float fadeDown = smoothstep(0.0, 0.06, vUv.y);
            float shimmer = 0.9 + 0.1 * sin(vUv.x * 12.566 + uTime * 0.5);
            gl_FragColor = vec4(uColor, body * fadeUp * fadeDown * shimmer * uStrength);
          }
        `,
      }),
    [strength, color],
  );
  const mesh = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  useFrame((state) => {
    if (mesh.current) mesh.current.material.uniforms.uTime.value = state.clock.elapsedTime;
  });
  return (
    <mesh ref={mesh} position={[x, height / 2, 0]} material={material}>
      <cylinderGeometry args={[topRadius, bottomRadius, height, 96, 1, true]} />
    </mesh>
  );
}

/** Motes of light rising slowly around a point, like a held breath. */
export function Motes({
  count = 70,
  color = MINT_DEEP,
  center = [0, 0, 0],
  spread = 1,
  height = 4.2,
  seed = 11,
  additive = true,
}: {
  count?: number;
  color?: THREE.Color;
  center?: [number, number, number];
  spread?: number;
  height?: number;
  seed?: number;
  additive?: boolean;
}) {
  const { geometry, material } = useMemo(() => {
    const seeds = new Float32Array(count * 3);
    const rand = seededRandom(seed);
    for (let i = 0; i < count; i++) {
      seeds[i * 3] = rand() * Math.PI * 2;
      seeds[i * 3 + 1] = (0.5 + rand() * 1.5) * spread;
      seeds[i * 3 + 2] = rand();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 3));
    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: color.clone() },
        uPixelRatio: { value: 1 },
        uCenter: { value: new THREE.Vector3(...center) },
        uHeight: { value: height },
      },
      vertexShader: /* glsl */ `
        attribute vec3 aSeed;
        uniform float uTime;
        uniform float uPixelRatio;
        uniform vec3 uCenter;
        uniform float uHeight;
        varying float vAlpha;
        void main() {
          float rise = fract(aSeed.z + uTime * 0.05);
          float ang = aSeed.x + uTime * 0.15;
          vec3 p = uCenter + vec3(cos(ang) * aSeed.y, 0.2 + rise * uHeight, sin(ang) * aSeed.y);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (2.0 + aSeed.y * 1.6) * uPixelRatio * (9.0 / -mv.z);
          vAlpha = smoothstep(0.0, 0.2, rise) * smoothstep(1.0, 0.7, rise);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          gl_FragColor = vec4(uColor, smoothstep(0.5, 0.0, d) * vAlpha * 0.9);
        }
      `,
    });
    return { geometry: g, material: m };
  }, [count, color, spread, seed, center, height, additive]);

  const points = useRef<THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  useFrame((state) => {
    const m = points.current?.material;
    if (!m) return;
    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
  });
  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}

/**
 * A one-off ring of motes bursting upward from `center`. Fires every time
 * `trigger` changes to a new positive value (a click on a 3D object).
 */
export function Burst({
  center,
  trigger,
  count = 90,
  color = MINT,
}: {
  center: [number, number, number];
  trigger: number;
  count?: number;
  color?: THREE.Color;
}) {
  const start = useRef<number | null>(null);
  const fired = useRef(0);
  const { geometry, material } = useMemo(() => {
    const seeds = new Float32Array(count * 3);
    const rand = seededRandom(23);
    for (let i = 0; i < count; i++) {
      seeds[i * 3] = rand() * Math.PI * 2;
      seeds[i * 3 + 1] = 0.6 + rand() * 1.4;
      seeds[i * 3 + 2] = 0.5 + rand();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 3));
    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uProgress: { value: 0 },
        uCenter: { value: new THREE.Vector3() },
        uColor: { value: color.clone() },
        uPixelRatio: { value: 1 },
      },
      vertexShader: /* glsl */ `
        attribute vec3 aSeed;
        uniform float uProgress;
        uniform vec3 uCenter;
        uniform float uPixelRatio;
        varying float vAlpha;
        void main() {
          float p = clamp(uProgress * aSeed.z, 0.0, 1.0);
          float ease = 1.0 - pow(1.0 - p, 3.0);
          float r = aSeed.y * ease;
          vec3 pos = uCenter + vec3(cos(aSeed.x) * r, ease * 1.6 * aSeed.z - p * p * 0.8, sin(aSeed.x) * r * 0.6);
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (2.5 + aSeed.y * 1.5) * uPixelRatio * (9.0 / -mv.z);
          vAlpha = (1.0 - p) * step(0.001, uProgress);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          gl_FragColor = vec4(uColor, smoothstep(0.5, 0.0, d) * vAlpha);
        }
      `,
    });
    return { geometry: g, material: m };
  }, [count, color]);

  const points = useRef<THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  useFrame((state) => {
    const m = points.current?.material;
    if (!m) return;
    if (trigger > 0 && trigger !== fired.current) {
      fired.current = trigger;
      start.current = state.clock.elapsedTime;
    }
    const progress = start.current === null ? 0 : (state.clock.elapsedTime - start.current) / 2.2;
    m.uniforms.uProgress.value = progress > 1 ? 0 : progress;
    m.uniforms.uCenter.value.set(center[0], center[1], center[2]);
    m.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
  });
  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}

/** Reports back once the scene has mounted (used to cross-fade from the static fallback). */
export function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    // wait a couple of frames so the first paint has real content
    let n = 0;
    let raf = 0;
    const tick = () => (++n >= 3 ? onReady() : (raf = requestAnimationFrame(tick)));
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onReady]);
  return null;
}
