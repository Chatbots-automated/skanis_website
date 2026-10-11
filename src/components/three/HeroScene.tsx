"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, Environment, Lightformer, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { Floaty, MilkDrop, Peanut, WheatEar } from "./Allergens3D";
import { Beam, Burst, Motes, MINT, MINT_DEEP, Pedestal, Ready, useFontReady } from "./shared";
import { canvasTexture, drawCalloutTexture, drawResultScreen, drawScanScreen, SCREEN_H, SCREEN_W } from "./phoneTextures";

/*
 * Hero stage: an illustrative Skanis phone floats above a pedestal and scans a
 * label, then shows a result, on a loop. Glossy milk / peanut / wheat objects
 * float around it; when the scan "finds" milk the drop lights up and a PIENAS
 * tag pops out. The pointer steers the camera; clicking things replays the scan.
 */

export type SceneProps = {
  frameloop: "always" | "demand" | "never";
  interactive: boolean;
  onReady: () => void;
};

const CYCLE = 9; // seconds per scan → result loop
const SCAN_FROM = 0.5;
const SCAN_TO = 2.9;
const RESULT_AT = 3.1;
const RESULT_UNTIL = 8.3;

const PHONE_W = 1.42;
const PHONE_H = 2.9;
const PHONE_D = 0.13;
const SCREEN_PW = 1.3;
const SCREEN_PH = SCREEN_PW * (SCREEN_H / SCREEN_W);

/**
 * The scan → result loop. Plain mutable object read inside useFrame, so the
 * animation never causes React re-renders. `mix` is 0 while scanning and 1
 * while the result is showing.
 */
class ScanLoop {
  mix = 0;
  private start = 0;

  /** Advances the loop and returns the seconds into the current cycle. */
  advance(t: number, delta: number) {
    const cyc = (t - this.start) % CYCLE;
    const target = cyc >= RESULT_AT && cyc < RESULT_UNTIL ? 1 : 0;
    this.mix = THREE.MathUtils.damp(this.mix, target, 6, delta);
    return cyc;
  }

  /** Jumps to the other half of the loop: replay the scan, or show the result right away. */
  flip(now: number) {
    this.start = this.mix > 0.5 ? now : now - RESULT_AT - 0.05;
  }
}

export default function HeroScene({ frameloop, interactive, onReady }: SceneProps) {
  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 1.75]}
      camera={{ position: [0, 2.5, 9.4], fov: 28 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Scene interactive={interactive} onReady={onReady} />
    </Canvas>
  );
}

function Scene({ interactive, onReady }: { interactive: boolean; onReady: () => void }) {
  const loop = useMemo(() => new ScanLoop(), []);
  const [burst, setBurst] = useState(0);
  const fontReady = useFontReady();

  const celebrate = () => setBurst((b) => b + 1);

  return (
    <>
      <hemisphereLight intensity={0.6} color="#fbfff9" groundColor="#7fae98" />
      <directionalLight position={[0, -3, 6]} intensity={0.7} color="#e6fff3" />
      <directionalLight position={[-4, 6, 6]} intensity={2.4} color="#ffffff" />
      <directionalLight position={[5, 2, 4]} intensity={0.5} color="#d7f3e6" />
      <spotLight position={[0, 3.5, -4.5]} angle={0.7} penumbra={1} intensity={26} color={MINT} />

      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#f2fff8" position={[0, 2, -6]} scale={[12, 3, 1]} />
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 8, 0]} rotation-x={Math.PI / 2} scale={[6, 6, 1]} />
        <Lightformer form="rect" intensity={2.4} color="#e8fff3" position={[-5, 3, 4]} scale={[6, 5, 1]} />
        <Lightformer form="rect" intensity={1.8} color="#ffffff" position={[0, 1.5, 9]} scale={[10, 5, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#9fdfc4" position={[6, 1.5, 0]} rotation-y={-Math.PI / 2} scale={[10, 0.5, 1]} />
      </Environment>

      <CameraRig interactive={interactive} />
      <Pedestal tone="light" />
      <Beam height={6} topRadius={0.25} bottomRadius={1.5} strength={0.14} />
      <Motes count={64} center={[0, 0, 0]} spread={1.1} height={4.4} color={MINT_DEEP} />

      <Suspense fallback={null}>
        <group position={[0, 0, 0]}>
          {fontReady && <PhoneModel loop={loop} interactive={interactive} onPick={celebrate} />}

          <Floaty position={[1.45, 3.15, 0.55]} phase={0.4} bob={0.14} turn={0.55} tilt={[0, 0, -0.18]} parallax={0.22} onPick={celebrate}>
            <group scale={0.82}>
              <MilkDrop source={loop} />
            </group>
          </Floaty>
          <Floaty position={[-1.62, 1.35, 0.6]} phase={1.7} bob={0.12} turn={0.45} tilt={[0.25, 0, 0.9]} parallax={0.3} onPick={celebrate}>
            <group scale={0.74}>
              <Peanut />
            </group>
          </Floaty>
          <Floaty position={[-1.52, 3.35, 0.15]} phase={3.1} bob={0.1} turn={0.4} tilt={[0, 0, 0.42]} parallax={0.16} onPick={celebrate}>
            <group scale={0.8}>
              <WheatEar />
            </group>
          </Floaty>

          <MilkCallout loop={loop} />
          <DetectionRing loop={loop} />
        </group>
        <Burst center={[0, 2.2, 0.3]} trigger={burst} count={80} color={MINT} />
        <Ready onReady={onReady} />
      </Suspense>
    </>
  );
}

function CameraRig({ interactive }: { interactive: boolean }) {
  const target = useRef(new THREE.Vector3(0, 1.95, 0));
  useFrame((state, delta) => {
    const camera = state.camera;
    const px = interactive ? state.pointer.x : 0;
    const py = interactive ? state.pointer.y : 0;
    // narrow (phone) panels: pull back so the phone and every object fit
    const narrow = THREE.MathUtils.clamp(0.95 / state.viewport.aspect, 1, 1.45);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, px * 0.9, 2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 2.5 + py * 0.35, 2, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 9.4 * narrow, 2, delta);
    camera.lookAt(target.current);
  });
  return null;
}

/* ----------------------------------------------------------------- phone */

function roundedRectGeometry(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  const g = new THREE.ShapeGeometry(s, 10);
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
  return g;
}

function PhoneModel({ loop, interactive, onPick }: { loop: ScanLoop; interactive: boolean; onPick: () => void }) {
  const group = useRef<THREE.Group>(null);
  const resultMat = useRef<THREE.MeshBasicMaterial>(null);
  const laser = useRef<THREE.Mesh>(null);
  const bracketsRef = useRef<THREE.Group>(null);
  const bracketMats = useRef<THREE.MeshBasicMaterial[]>([]);
  const hovered = useRef(false);
  const maxAniso = useThree((s) => s.gl.capabilities.getMaxAnisotropy());
  const clock = useThree((s) => s.clock);

  const { scanTex, resultTex, screenGeo, laserTex } = useMemo(() => {
    const laserCanvas = document.createElement("canvas");
    laserCanvas.width = 4;
    laserCanvas.height = 128;
    const lc = laserCanvas.getContext("2d")!;
    const g = lc.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, "rgba(159,223,196,0)");
    g.addColorStop(0.85, "rgba(159,223,196,0.35)");
    g.addColorStop(0.96, "rgba(220,255,240,0.95)");
    g.addColorStop(1, "rgba(159,223,196,0)");
    lc.fillStyle = g;
    lc.fillRect(0, 0, 4, 128);
    return {
      scanTex: canvasTexture(drawScanScreen(), maxAniso),
      resultTex: canvasTexture(drawResultScreen(), maxAniso),
      screenGeo: roundedRectGeometry(SCREEN_PW, SCREEN_PH, 0.17),
      laserTex: new THREE.CanvasTexture(laserCanvas),
    };
  }, [maxAniso]);

  // The scan frame (four mint corner brackets, echoing the logo).
  const cornerGeo = useMemo(() => {
    const L = 0.34;
    const r = 0.12;
    const path = new THREE.CurvePath<THREE.Vector3>();
    path.add(new THREE.LineCurve3(new THREE.Vector3(0, -L, 0), new THREE.Vector3(0, -r, 0)));
    path.add(new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, -r, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(r, 0, 0)));
    path.add(new THREE.LineCurve3(new THREE.Vector3(r, 0, 0), new THREE.Vector3(L, 0, 0)));
    return new THREE.TubeGeometry(path, 40, 0.02, 10, false);
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const cyc = loop.advance(t, delta);
    if (resultMat.current) resultMat.current.opacity = loop.mix;

    // laser sweep over the label while scanning
    if (laser.current) {
      const p = THREE.MathUtils.clamp((cyc - SCAN_FROM) / (SCAN_TO - SCAN_FROM), 0, 1);
      const eased = p * p * (3 - 2 * p);
      const top = SCREEN_PH * (0.5 - 140 / SCREEN_H);
      const bottom = SCREEN_PH * (0.5 - 352 / SCREEN_H);
      laser.current.position.y = THREE.MathUtils.lerp(top + 0.14, bottom + 0.14, eased);
      laser.current.visible = cyc > SCAN_FROM && cyc < SCAN_TO + 0.05 && loop.mix < 0.1;
    }

    // frame "locks on" at the start of each loop, then settles
    if (bracketsRef.current) {
      const lock = THREE.MathUtils.clamp(cyc / 0.7, 0, 1);
      const settle = 1 + (1 - lock) ** 3 * 0.16 + Math.sin(t * 1.6) * 0.008;
      bracketsRef.current.scale.setScalar(settle);
      const fade = Math.min(1, lock * 1.5) * (1 - loop.mix * 0.55);
      bracketMats.current.forEach((m) => m && (m.opacity = fade));
    }

    // sway toward the pointer, with a small idle bob
    const sway = interactive ? Math.sin(t * 0.42) * 0.1 + state.pointer.x * 0.3 - 0.18 : -0.18;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, sway, 2.5, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, interactive ? -state.pointer.y * 0.1 : 0, 2.5, delta);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, interactive ? Math.sin(t * 0.55) * 0.015 : 0, 2.5, delta);
    g.position.y = 2.2 + (interactive ? Math.sin(t * 0.9) * 0.07 : 0);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, hovered.current ? 1.025 : 1, 6, delta));
  });

  const frameW = PHONE_W + 0.5;
  const frameH = PHONE_H + 0.5;

  return (
    <group
      ref={group}
      position={[0, 2.2, 0]}
      onClick={(e) => {
        e.stopPropagation();
        loop.flip(clock.elapsedTime);
        onPick();
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
      <RoundedBox args={[PHONE_W, PHONE_H, PHONE_D]} radius={0.2} smoothness={6} creaseAngle={0.5}>
        <meshPhysicalMaterial color="#0e2a25" metalness={0.55} roughness={0.22} clearcoat={1} clearcoatRoughness={0.12} envMapIntensity={1.4} />
      </RoundedBox>
      {/* screens: scan below, result fades in on top */}
      <mesh geometry={screenGeo} position={[0, 0, PHONE_D / 2 + 0.002]}>
        <meshBasicMaterial map={scanTex} toneMapped={false} />
      </mesh>
      <mesh geometry={screenGeo} position={[0, 0, PHONE_D / 2 + 0.003]}>
        <meshBasicMaterial ref={resultMat} map={resultTex} transparent opacity={0} toneMapped={false} depthWrite={false} />
      </mesh>
      {/* laser */}
      <mesh ref={laser} position={[0, 0, PHONE_D / 2 + 0.006]} visible={false}>
        <planeGeometry args={[SCREEN_PW * 0.84, 0.28]} />
        <meshBasicMaterial map={laserTex} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      {/* scan frame floating in front of the phone */}
      <group ref={bracketsRef} position={[0, 0, 0.34]}>
        {(
          [
            [-1, 1, 0],
            [1, 1, -Math.PI / 2],
            [1, -1, Math.PI],
            [-1, -1, Math.PI / 2],
          ] as const
        ).map(([sx, sy, rz], i) => (
          <mesh key={i} geometry={cornerGeo} position={[(sx * frameW) / 2, (sy * frameH) / 2, 0]} rotation-z={rz}>
            <meshBasicMaterial
              ref={(m) => {
                if (m) bracketMats.current[i] = m;
              }}
              color={MINT}
              transparent
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ------------------------------------------------------- detection extras */

function MilkCallout({ loop }: { loop: ScanLoop }) {
  const group = useRef<THREE.Group>(null);
  const tex = useMemo(() => canvasTexture(drawCalloutTexture("PIENAS"), 4), []);
  useEffect(() => () => tex.dispose(), [tex]);
  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const k = THREE.MathUtils.smoothstep(loop.mix, 0.45, 0.95);
    const pop = k * (1 + Math.sin(k * Math.PI) * 0.12);
    g.scale.setScalar(Math.max(0.0001, pop));
    g.position.y = 4.0 + Math.sin(state.clock.elapsedTime * 1.2) * 0.04;
  });
  return (
    <Billboard position={[1.0, 4.0, 0.9]}>
      <group ref={group}>
        <mesh>
          <planeGeometry args={[1.28, 0.44]} />
          <meshBasicMaterial map={tex} transparent toneMapped={false} depthWrite={false} />
        </mesh>
      </group>
    </Billboard>
  );
}

function DetectionRing({ loop }: { loop: ScanLoop }) {
  const ring = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>>(null);
  useFrame((state) => {
    const m = ring.current;
    if (!m) return;
    const k = loop.mix;
    const pulse = (state.clock.elapsedTime * 0.9) % 1;
    m.visible = k > 0.4;
    m.scale.setScalar(0.6 + pulse * 0.4);
    m.material.opacity = (1 - pulse) * 0.55 * k;
  });
  return (
    <Billboard position={[1.45, 3.15, 0.55]}>
      <mesh ref={ring}>
        <torusGeometry args={[0.6, 0.012, 8, 64]} />
        <meshBasicMaterial color="#e5675a" transparent opacity={0} toneMapped={false} depthWrite={false} />
      </mesh>
    </Billboard>
  );
}
