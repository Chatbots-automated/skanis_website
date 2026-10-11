import { cn } from "@/lib/utils";

/**
 * The Skanis mark: a scan frame (two open brackets) around a check mark.
 * Drawn on the same 242 × 256 grid as the original logo artwork so the 3D
 * version in components/three/LogoMark3D.tsx can share the geometry.
 */
export const MARK_FRAME_PATH = "M9 75V35a20 20 0 0 1 20-20h184a20 20 0 0 1 20 20v40M9 181v40a20 20 0 0 0 20 20h184a20 20 0 0 0 20-20v-40";
export const MARK_CHECK_PATH = "M70 130l36 38 92-103";

export function LogoMark({ className, strokeWidth = 19 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 242 256" fill="none" aria-hidden="true" className={cn("shrink-0", className)}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d={MARK_FRAME_PATH} strokeWidth={strokeWidth} />
        <path d={MARK_CHECK_PATH} strokeWidth={strokeWidth + 4} />
      </g>
    </svg>
  );
}

/** Mark + "SKANIS" wordmark. */
export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", tone === "light" ? "text-white" : "text-ink", className)}>
      <LogoMark className="h-[1.55em] w-auto" />
      <span className="font-extrabold uppercase tracking-[0.04em] leading-none text-[1.2em]">Skanis</span>
    </span>
  );
}
