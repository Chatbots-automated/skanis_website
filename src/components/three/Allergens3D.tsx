"use client";

import { useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/*
 * Three little glossy allergen objects (milk drop, peanut, wheat ear) built
 * from primitives, in the same toy-like finish as the rest of the scene.
 * They are the same three allergens the interactive demo lets visitors pick.
 */

/** Gentle float + slow turn. A click gives the object a quick spin. */
export function Floaty({
  position,
  phase = 0,
  bob = 0.12,
  turn = 0.5,
  tilt = [0, 0, 0],
  parallax = 0,
  onPick,
  children,
}: {
  position: [number, number, number];
  phase?: number;
  bob?: number;
  turn?: number;
  tilt?: [number, number, number];
  /** How far the object drifts with the pointer (gives the scene depth). */
  parallax?: number;
  onPick?: () => void;
  children: ReactNode;
}) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const spin = useRef(0);
  const hovered = useRef(false);

  useFrame((state, delta) => {
    const g = outer.current;
    const i = inner.current;
    if (!g || !i) return;
    const t = state.clock.elapsedTime;
    g.position.set(
      position[0] + state.pointer.x * parallax,
      position[1] + Math.sin(t * 0.9 + phase) * bob + state.pointer.y * parallax * 0.4,
      position[2],
    );
    i.rotation.y += delta * (turn + spin.current * 14);
    spin.current = THREE.MathUtils.damp(spin.current, 0, 2.6, delta);
    i.scale.setScalar(THREE.MathUtils.damp(i.scale.x, hovered.current ? 1.1 : 1, 8, delta));
  });

  return (
    <group
      ref={outer}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        spin.current = 1;
        onPick?.();
      }}
      onPointerOver={() => {
        hovered.current = true;
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        hovered.current = false;
        document.body.style.cursor = "";
      }}
    >
      <group rotation={tilt}>
        <group ref={inner}>{children}</group>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ milk */

export function MilkDrop({ source }: { source: { mix: number } }) {
  const geometry = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const N = 56;
    for (let k = 0; k <= N; k++) {
      const t = k / N;
      const u = Math.pow(t, 0.6);
      pts.push(new THREE.Vector2(Math.max(0, 0.42 * Math.sin(Math.PI * u)), -0.45 + t * 1.3));
    }
    return new THREE.LatheGeometry(pts, 64);
  }, []);
  const mat = useRef<THREE.MeshPhysicalMaterial>(null);
  useFrame(() => {
    if (!mat.current) return;
    mat.current.emissiveIntensity = source.mix * 0.55;
  });
  return (
    <mesh geometry={geometry}>
      <meshPhysicalMaterial
        ref={mat}
        color="#ffffff"
        roughness={0.14}
        clearcoat={1}
        clearcoatRoughness={0.08}
        sheen={0.6}
        sheenColor={new THREE.Color("#dff3ff")}
        emissive="#ff5a46"
        emissiveIntensity={0}
        envMapIntensity={1.3}
      />
    </mesh>
  );
}

/* ---------------------------------------------------------------- peanut */

function usePeanutTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#e3bd86";
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = "rgb(150 100 50 / 0.45)";
    ctx.lineWidth = 2;
    const step = 22;
    for (let i = -256; i < 512; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 256, 256);
      ctx.moveTo(i, 256);
      ctx.lineTo(i + 256, 0);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 1);
    return tex;
  }, []);
}

export function Peanut() {
  const map = usePeanutTexture();
  const geometry = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const N = 72;
    for (let k = 0; k <= N; k++) {
      const y = -0.62 + (k / N) * 1.24;
      const lobe = (c: number) => 0.3 * Math.sqrt(Math.max(0, 1 - ((y - c) / 0.37) ** 2));
      pts.push(new THREE.Vector2(Math.max(lobe(0.27), lobe(-0.27)), y));
    }
    return new THREE.LatheGeometry(pts, 64);
  }, []);
  return (
    <mesh geometry={geometry}>
      <meshPhysicalMaterial map={map} bumpMap={map} bumpScale={1.4} roughness={0.5} clearcoat={0.35} clearcoatRoughness={0.4} envMapIntensity={0.8} />
    </mesh>
  );
}

/* ----------------------------------------------------------------- wheat */

export function WheatEar() {
  const grains = useMemo(() => {
    const list: Array<{ p: [number, number, number]; r: [number, number, number] }> = [];
    for (let i = 0; i < 9; i++) {
      const y = 0.2 + i * 0.105;
      const s = 1 - i * 0.045;
      list.push({ p: [-0.075 * s, y, 0.03], r: [0.15, 0, 0.42] });
      list.push({ p: [0.075 * s, y, -0.03], r: [-0.15, 0, -0.42] });
      list.push({ p: [0.01, y + 0.05, 0.075 * s], r: [0.42, 0, 0.05] });
      list.push({ p: [-0.01, y + 0.05, -0.075 * s], r: [-0.42, 0, -0.05] });
    }
    return list;
  }, []);
  return (
    <group position={[0, -0.55, 0]}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.014, 0.022, 0.8, 12]} />
        <meshStandardMaterial color="#c9a449" roughness={0.5} />
      </mesh>
      {grains.map((g, i) => (
        <mesh key={i} position={g.p} rotation={g.r} scale={[0.07, 0.17, 0.065]}>
          <sphereGeometry args={[1, 20, 14]} />
          <meshPhysicalMaterial color="#e8b94c" roughness={0.38} clearcoat={0.45} clearcoatRoughness={0.3} envMapIntensity={0.9} />
        </mesh>
      ))}
      {/* awns */}
      {[-0.05, 0, 0.05].map((x, i) => (
        <mesh key={i} position={[x, 1.28, 0]} rotation={[0, 0, -x * 2]}>
          <cylinderGeometry args={[0.002, 0.008, 0.3, 6]} />
          <meshStandardMaterial color="#d2a940" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}
