"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { BatteryFull, Signal, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

export const PHONE_W = 320;
export const PHONE_H = 660;

/**
 * A drawn smartphone (CSS + SVG only). Always laid out at its design size
 * (320 × 660 by default); use <ScaledPhone> to fit it into any column.
 */
export function PhoneFrame({
  children,
  className,
  width = PHONE_W,
  height = PHONE_H,
}: {
  children: ReactNode;
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <div
      className={cn("relative rounded-[3.25rem] bg-[#0b1815] p-[10px] shadow-phone", className)}
      style={{ width, height }}
    >
      {/* titanium-style bezel highlight */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[3.25rem] ring-1 ring-inset ring-white/15"
        style={{ background: "linear-gradient(135deg, rgb(255 255 255 / 0.16), transparent 30%, transparent 70%, rgb(159 223 196 / 0.14))" }}
      />
      {/* side keys */}
      <span aria-hidden="true" className="absolute -left-[3px] top-[118px] h-8 w-[4px] rounded-l bg-[#16302a]" />
      <span aria-hidden="true" className="absolute -left-[3px] top-[170px] h-14 w-[4px] rounded-l bg-[#16302a]" />
      <span aria-hidden="true" className="absolute -left-[3px] top-[236px] h-14 w-[4px] rounded-l bg-[#16302a]" />
      <span aria-hidden="true" className="absolute -right-[3px] top-[190px] h-20 w-[4px] rounded-r bg-[#16302a]" />

      <div className="relative size-full overflow-hidden rounded-[2.65rem] bg-[#f7f5ef]">
        <StatusBar />
        <div className="absolute inset-x-0 bottom-0 top-0 pt-[3.1rem]">{children}</div>
        {/* dynamic island */}
        <span aria-hidden="true" className="absolute left-1/2 top-[10px] z-20 h-[26px] w-[86px] -translate-x-1/2 rounded-full bg-[#050c0a]" />
        {/* home indicator */}
        <span aria-hidden="true" className="absolute bottom-[7px] left-1/2 z-20 h-[4px] w-[104px] -translate-x-1/2 rounded-full bg-ink/80" />
        {/* soft glass reflection */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30"
          style={{ background: "linear-gradient(115deg, rgb(255 255 255 / 0.18) 0%, rgb(255 255 255 / 0) 28%)" }}
        />
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div aria-hidden="true" className="absolute inset-x-0 top-0 z-10 flex h-[3.1rem] items-center justify-between px-7 pt-[3px] text-[13px] font-bold text-ink">
      <span>9:41</span>
      <span className="flex items-center gap-1.5">
        <Signal className="size-[14px]" strokeWidth={2.6} />
        <Wifi className="size-[14px]" strokeWidth={2.6} />
        <BatteryFull className="size-[18px]" strokeWidth={2.2} />
      </span>
    </div>
  );
}

/**
 * Fits a fixed-size phone into whatever width its parent gives it, keeping the
 * aspect ratio (so there is no layout shift). Cap the width with `max-w-*`.
 */
export function ScaledPhone({
  children,
  width = PHONE_W,
  height = PHONE_H,
  className,
}: {
  children: ReactNode;
  width?: number;
  height?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  // The server can't know the column width, so the phone stays hidden until it has been measured.
  const [measured, setMeasured] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      setScale(el.clientWidth / width);
      setMeasured(true);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div ref={ref} className={cn("relative w-full", className)} style={{ aspectRatio: `${width} / ${height}` }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width, height, transform: `scale(${scale})`, visibility: measured ? "visible" : "hidden" }}>
        <PhoneFrame width={width} height={height}>
          {children}
        </PhoneFrame>
      </div>
    </div>
  );
}
