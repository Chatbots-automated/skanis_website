"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { Beam, Burst, MINT, Motes, Pedestal, Ready, useGlowTexture } from "./shared";
import type { SceneProps } from "./HeroScene";

/*
 * Closing stage: the Skanis mark (scan frame + check) built as glossy 3D
 * tubing floats above a dark pedestal. The check pops on click and scatters
 * a burst of mint light. Geometry is derived from the same 242 × 256 grid as
 * the SVG logo so both stay in step.
 */

const S = 2.5 / 256; // world units per logo unit
const toWorld = (x: number, y: number) => new THREE.Vector3((x - 121) * S, (128 - y) * S, 0);

const FRAME_R = 9.5 * S;
const CHECK_R = 11.5 * S;

function frameBracket(top: boolean) {
  const sign = top ? 1 : -1;
  const yEdge = top ? 15 : 241;
  const yEnd = top ? 75 : 181;
  const path = new THREE.CurvePath<THREE.Vector3>();
  const p = (x: number, y: number) => toWorld(x, y);
  const inner = yEdge + sign * 20; // y where the corner arc meets the straight side
  path.add(new THREE.LineCurve3(p(9, yEnd), p(9, inner)));
  path.add(new THREE.QuadraticBezierCurve3(p(9, inner), p(9, yEdge), p(29, yEdge)));
  path.add(new THREE.LineCurve3(p(29, yEdge), p(213, yEdge)));
  path.add(new THREE.QuadraticBezierCurve3(p(213, yEdge), p(233, yEdge), p(233, inner)));
  path.add(new THREE.LineCurve3(p(233, inner), p(233, yEnd)));
  return { path, ends: [p(9, yEnd), p(233, yEnd)] };
}

function checkPath() {
  const a = new THREE.Vector2(70, 130);
  const v = new THREE.Vector2(106, 168);
  const b = new THREE.Vector2(198, 65);
  const d = 9;
  const toA = a.clone().sub(v).normalize().multiplyScalar(d);
  const toB = b.clone().sub(v).normalize().multiplyScalar(d);
  const path = new THREE.CurvePath<THREE.Vector3>();
  const w = (q: THREE.Vector2) => toWorld(q.x, q.y);
  path.add(new THREE.LineCurve3(w(a), w(v.clone().add(toA))));
  path.add(new THREE.QuadraticBezierCurve3(w(v.clone().add(toA)), w(v), w(v.clone().add(toB))));
  path.add(new THREE.LineCurve3(w(v.clone().add(toB)), w(b)));
  return { path, ends: [w(a), w(b)] };
}

export default function LogoScene({ frameloop, interactive, onReady }: SceneProps) {
  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 1.75]}
      camera={{ position: [0, 2.2, 10.5], fov: 28 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <hemisphereLight intensity={0.5} color="#e8fff3" groundColor="#1d4a3f" />
      <directionalLight position={[0, -3, 6]} intensity={0.7} color="#bff0d8" />
      <directionalLight position={[-4, 6, 6]} intensity={2.6} color="#f4fff9" />
      <directionalLight position={[5, 2, 4]} intensity={0.6} color="#c8f1de" />
      <spotLight position={[0, 3.5, -4.5]} angle={0.7} penumbra={1} intensity={34} color={MINT} />

      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.4} color="#e8fff3" position={[0, 2, -6]} scale={[12, 3, 1]} />
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 8, 0]} rotation-x={Math.PI / 2} scale={[6, 6, 1]} />
        <Lightformer form="rect" intensity={2.4} color="#d8f7e8" position={[-5, 3, 4]} scale={[6, 5, 1]} />
        <Lightformer form="rect" intensity={1.8} color="#ffffff" position={[0, 1.5, 9]} scale={[10, 5, 1]} />
        <Lightformer form="rect" intensity={1.8} color="#9fdfc4" position={[6, 1.5, 0]} rotation-y={-Math.PI / 2} scale={[10, 0.5, 1]} />
      </Environment>

      <CameraRig interactive={interactive} />
      <Pedestal tone="dark" />
      <Beam height={6.5} topRadius={0.25} bottomRadius={1.5} strength={0.16} />
      <Motes count={80} color={MINT} spread={1.2} height={4.6} seed={7} />
      <Suspense fallback={null}>
        <MarkStage interactive={interactive} />
        <ContactShadows position={[0, 0.126, 0]} scale={3.2} resolution={512} blur={2.4} far={2.5} opacity={0.5} color="#04100d" frames={1} />
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}

function CameraRig({ interactive }: { interactive: boolean }) {
  const target = useRef(new THREE.Vector3(0, 1.75, 0));
  useFrame((state, delta) => {
    const camera = state.camera;
    const px = interactive ? state.pointer.x : 0;
    const py = interactive ? state.pointer.y : 0;
    const narrow = THREE.MathUtils.clamp(1.0 / state.viewport.aspect, 1, 1.5);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, px * 0.8, 2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 2.2 + py * 0.3, 2, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 10.5 * narrow, 2, delta);
    camera.lookAt(target.current);
  });
  return null;
}

function MarkStage({ interactive }: { interactive: boolean }) {
  const [pops, setPops] = useState(0);
  return (
    <>
      <FloatingMark interactive={interactive} pops={pops} onPop={() => setPops((n) => n + 1)} />
      <Burst center={[0, 2.2, 0.2]} trigger={pops} count={90} color={MINT} />
    </>
  );
}

function FloatingMark({ interactive, pops, onPop }: { interactive: boolean; pops: number; onPop: () => void }) {
  const frame = useMemo(() => [frameBracket(true), frameBracket(false)], []);
  const check = useMemo(() => checkPath(), []);
  const frameGeos = useMemo(() => frame.map((f) => new THREE.TubeGeometry(f.path, 96, FRAME_R, 20, false)), [frame]);
  const checkGeo = useMemo(() => new THREE.TubeGeometry(check.path, 64, CHECK_R, 20, false), [check]);

  const group = useRef<THREE.Group>(null);
  const checkGroup = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Group>(null);
  const glow = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>>(null);
  const hovered = useRef(false);
  const pop = useRef({ n: 0, t: -10 });
  const tex = useGlowTexture();

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const bob = interactive ? Math.sin(t * 0.9) : 0;
    g.position.y = 2.2 + bob * 0.08;
    const sway = interactive ? Math.sin(t * 0.45) * 0.4 + state.pointer.x * 0.28 : -0.2;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, sway, 2.5, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, interactive ? -state.pointer.y * 0.12 : 0, 2.5, delta);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, hovered.current ? 1.04 : 1, 6, delta));

    if (pops !== pop.current.n) pop.current = { n: pops, t };
    const since = t - pop.current.t;
    // the check hops forward and settles on each click
    const hop = since < 0.8 ? Math.sin((since / 0.8) * Math.PI) * 0.5 * (1 - since / 0.8) : 0;
    const idle = interactive ? Math.max(0, Math.sin(t * 2.2)) ** 14 * 0.04 : 0;
    if (checkGroup.current) {
      checkGroup.current.position.z = 0.1 + hop;
      checkGroup.current.scale.setScalar(1 + idle + hop * 0.35);
    }
    if (halo.current) {
      halo.current.rotation.z = t * 0.45;
      halo.current.rotation.x = 1.15 + Math.sin(t * 0.3) * 0.12;
    }
    if (glow.current) glow.current.material.opacity = 0.2 + (1 - bob) * 0.06;
  });

  return (
    <>
      <mesh ref={glow} position={[0, 0.13, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[2.6, 2.6]} />
        <meshBasicMaterial map={tex} color={MINT} transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <group
        ref={group}
        position={[0, 2.2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onPop();
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
        {/* an invisible plate makes the whole mark easy to hit */}
        <mesh visible={false}>
          <planeGeometry args={[2.6, 2.8]} />
        </mesh>
        {frameGeos.map((geo, i) => (
          <group key={i}>
            <mesh geometry={geo}>
              <meshPhysicalMaterial color="#f4faf6" roughness={0.2} clearcoat={1} clearcoatRoughness={0.1} envMapIntensity={1.2} />
            </mesh>
            {frame[i].ends.map((e, j) => (
              <mesh key={j} position={e}>
                <sphereGeometry args={[FRAME_R, 24, 16]} />
                <meshPhysicalMaterial color="#f4faf6" roughness={0.2} clearcoat={1} clearcoatRoughness={0.1} envMapIntensity={1.2} />
              </mesh>
            ))}
          </group>
        ))}
        <group ref={checkGroup} position={[0, 0, 0.1]}>
          <mesh geometry={checkGeo}>
            <meshPhysicalMaterial color="#9fdfc4" emissive="#4fb08a" emissiveIntensity={0.35} roughness={0.18} clearcoat={1} clearcoatRoughness={0.08} envMapIntensity={1.4} />
          </mesh>
          {check.ends.map((e, j) => (
            <mesh key={j} position={e}>
              <sphereGeometry args={[CHECK_R, 24, 16]} />
              <meshPhysicalMaterial color="#9fdfc4" emissive="#4fb08a" emissiveIntensity={0.35} roughness={0.18} clearcoat={1} clearcoatRoughness={0.08} envMapIntensity={1.4} />
            </mesh>
          ))}
        </group>
      </group>
      {/* a fine halo orbiting the mark, with one bright bead riding it */}
      <group ref={halo} position={[0, 2.2, 0]}>
        <mesh>
          <torusGeometry args={[1.75, 0.006, 8, 200]} />
          <meshBasicMaterial color={MINT} transparent opacity={0.6} toneMapped={false} />
        </mesh>
        <mesh position={[1.75, 0, 0]}>
          <sphereGeometry args={[0.05, 16, 12]} />
          <meshBasicMaterial color="#e6fff3" toneMapped={false} />
        </mesh>
      </group>
    </>
  );
}
