"use client";

import dynamic from "next/dynamic";
import { ScaledPhone } from "@/components/phone/PhoneFrame";
import { ScreenResult } from "@/components/phone/screens";
import { cn } from "@/lib/utils";
import { useLazy3D } from "./use-lazy-3d";

// three.js is only downloaded in the browser, and only once the stage is going to be shown
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

/**
 * The hero visual. The drawn (CSS/SVG) phone is the real content: it paints
 * immediately, is what screen readers and no-WebGL / reduced-motion visitors
 * get, and is replaced by the live 3D scene once that has loaded.
 */
export function HeroStage({ className }: { className?: string }) {
  const { ref, mount, ready, onReady, frameloop, interactive } = useLazy3D();

  return (
    <div ref={ref} className={cn("relative", className)}>
      {/* static fallback */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-[1200ms]",
          ready && "pointer-events-none opacity-0",
        )}
      >
        <PedestalFallback />
        <div className="relative z-10 w-[12rem] -translate-y-[3%] -rotate-[4deg] sm:w-[15rem]">
          <ScaledPhone>
            <ScreenResult />
          </ScaledPhone>
        </div>
      </div>

      {mount && (
        <div className={cn("absolute inset-0 transition-opacity duration-[1200ms]", ready ? "opacity-100" : "opacity-0")} aria-hidden="true">
          <HeroScene frameloop={frameloop} interactive={interactive} onReady={onReady} />
        </div>
      )}
    </div>
  );
}

/** A CSS pedestal so the stage never looks empty before (or instead of) the 3D scene. */
export function PedestalFallback({ dark = false }: { dark?: boolean }) {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div
        className="absolute left-1/2 top-[8%] h-[78%] w-[46%] -translate-x-1/2 [clip-path:polygon(42%_0,58%_0,100%_100%,0_100%)]"
        style={{ background: `linear-gradient(to bottom, rgb(159 223 196 / 0), rgb(159 223 196 / ${dark ? 0.2 : 0.28}))` }}
      />
      <div
        className="absolute bottom-[8%] left-1/2 h-[9%] w-[66%] -translate-x-1/2 rounded-[50%] blur-md"
        style={{ background: `radial-gradient(closest-side, ${dark ? "rgb(159 223 196 / 0.4)" : "rgb(29 74 63 / 0.28)"}, transparent)` }}
      />
      <div
        className={cn(
          "absolute bottom-[10.5%] left-1/2 h-[7%] w-[52%] -translate-x-1/2 rounded-[50%] border",
          dark ? "border-mint/70 bg-[linear-gradient(to_bottom,#1f5249,#17433b)]" : "border-[#4fb08a]/70 bg-[linear-gradient(to_bottom,#f7fbf8,#e0ece5)]",
        )}
      />
      <div
        className={cn(
          "absolute bottom-[14%] left-1/2 h-[5%] w-[42%] -translate-x-1/2 rounded-[50%] border",
          dark ? "border-mint/70 bg-[linear-gradient(to_bottom,#256156,#1f5249)]" : "border-[#4fb08a]/70 bg-[linear-gradient(to_bottom,#ffffff,#eaf3ee)]",
        )}
      />
    </div>
  );
}
