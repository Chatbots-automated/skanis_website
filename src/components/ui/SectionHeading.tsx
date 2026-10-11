import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Eyebrow + h2 + optional lead, used by every section so the rhythm stays identical. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "light",
  id,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-2xl", className)}>
      {eyebrow && <p className={cn("eyebrow mb-4", tone === "dark" && "text-mint")}>{eyebrow}</p>}
      <h2 id={id} className={cn("text-[clamp(2rem,4.4vw,3.4rem)]", tone === "dark" ? "text-white" : "text-forest")}>
        {title}
      </h2>
      {lead && (
        <p className={cn("mt-5 text-lg leading-relaxed", tone === "dark" ? "text-white/75" : "text-muted")}>{lead}</p>
      )}
    </div>
  );
}
