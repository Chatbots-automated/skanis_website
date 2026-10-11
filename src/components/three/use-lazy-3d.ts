"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia(reducedMotionQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * When to bring a live WebGL scene in:
 *  - "interaction": on the visitor's first touch / scroll / pointer / key, or once
 *    the browser is idle on capable desktops (used by the hero, so the page
 *    paints and becomes usable before any 3D code is downloaded);
 *  - "visible": when the stage is about to scroll into view (used further down).
 * Reduced-motion visitors and browsers without WebGL never mount it and keep
 * the static fallback. Rendering pauses while the stage is off-screen.
 */
export function useLazy3D({ when = "interaction" }: { when?: "interaction" | "visible" } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false,
  );

  useEffect(() => {
    if (reducedMotion || when !== "interaction" || !supportsWebGL()) return;
    const events = ["pointerdown", "pointermove", "touchstart", "scroll", "wheel", "keydown"] as const;
    let idleId: number | undefined;
    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, start));
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
    };
    function start() {
      cleanup();
      setMount(true);
    }
    events.forEach((e) => window.addEventListener(e, start, { passive: true }));
    const capable = window.matchMedia("(pointer: fine)").matches && (navigator.hardwareConcurrency ?? 4) >= 4;
    if (capable && "requestIdleCallback" in window) idleId = window.requestIdleCallback(start, { timeout: 2500 });
    return cleanup;
  }, [reducedMotion, when]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting && when === "visible" && !reducedMotion && supportsWebGL()) setMount(true);
      },
      { rootMargin: when === "visible" ? "400px" : "100px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [when, reducedMotion]);

  const onReady = useCallback(() => setReady(true), []);
  const frameloop: "always" | "demand" | "never" = reducedMotion ? "demand" : visible ? "always" : "never";

  return { ref, mount, ready, onReady, frameloop, interactive: !reducedMotion };
}
