import { cn } from "@/lib/utils";

/**
 * The Skanis mark: a scan frame (two open brackets) around a check mark.
 * Drawn on the same 242 × 256 grid as the original logo artwork.
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

/** The mark on the logo's mint tile, as on the app icon and in the app's header. */
export function LogoTile({ className }: { className?: string }) {
  return (
    <span className={cn("grid size-[2em] shrink-0 place-items-center rounded-[28%] bg-mint text-brand-deep", className)}>
      <LogoMark className="h-[62%] w-auto" strokeWidth={21} />
    </span>
  );
}

/** Mint tile + "SKANIS" wordmark in the app's brand green (mint on dark backgrounds). */
export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoTile />
      <span
        className={cn(
          "font-extrabold uppercase tracking-[0.12em] leading-none text-[1.2em]",
          tone === "light" ? "text-mint" : "text-brand",
        )}
      >
        Skanis
      </span>
    </span>
  );
}
