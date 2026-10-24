import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A drawn phone (CSS only) sized by its height; the screen content scales with
 * it because everything inside is laid out in `em` and percentages.
 */
export function Phone({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative aspect-[300/620] rounded-[2.6rem] bg-ink p-[9px] shadow-phone", className)}>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[2.6rem] ring-1 ring-inset ring-white/20" />
      <div className="relative size-full overflow-hidden rounded-[2.1rem] bg-white">
        <span aria-hidden="true" className="absolute left-1/2 top-2 z-20 h-[4.5%] w-[30%] -translate-x-1/2 rounded-full bg-ink" />
        {children}
      </div>
    </div>
  );
}

export function AppBar({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 px-[6%] pb-[4%]">
      <ChevronLeft className="size-[1.4em] text-ink/60" strokeWidth={2.6} />
      <span className="text-[1.1em] font-extrabold text-ink">{title}</span>
    </div>
  );
}
