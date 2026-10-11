"use client";

import dynamic from "next/dynamic";
import { LogoMark } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import { PedestalFallback } from "./HeroStage";
import { useLazy3D } from "./use-lazy-3d";

const LogoScene = dynamic(() => import("./LogoScene"), { ssr: false });

/** The closing 3D stage (the logo mark on a pedestal), with a drawn fallback underneath. */
export function LogoStage({ className }: { className?: string }) {
  const { ref, mount, ready, onReady, frameloop, interactive } = useLazy3D({ when: "visible" });
  return (
    <div ref={ref} aria-hidden="true" className={cn("relative", className)}>
      <div className={cn("absolute inset-0 transition-opacity duration-[1200ms]", ready && "opacity-0")}>
        <PedestalFallback dark />
        <div className="absolute left-1/2 top-[22%] h-[40%] -translate-x-1/2 text-mint drop-shadow-[0_0_28px_rgb(159_223_196/0.55)]">
          <LogoMark className="h-full w-auto" strokeWidth={21} />
        </div>
      </div>
      {mount && (
        <div className={cn("absolute inset-0 transition-opacity duration-[1200ms]", ready ? "opacity-100" : "opacity-0")}>
          <LogoScene frameloop={frameloop} interactive={interactive} onReady={onReady} />
        </div>
      )}
    </div>
  );
}
