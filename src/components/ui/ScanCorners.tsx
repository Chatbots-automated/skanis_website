import { cn } from "@/lib/utils";

/**
 * Four rounded corner brackets, the scan-frame motif from the Skanis logo.
 * Place inside a `relative` parent.
 */
export function ScanCorners({
  className,
  inset = "0.75rem",
  size = "1.75rem",
  thickness = 3,
  color = "currentColor",
}: {
  className?: string;
  inset?: string;
  size?: string;
  thickness?: number;
  color?: string;
}) {
  const corner = {
    width: size,
    height: size,
    borderColor: color,
    borderWidth: 0,
    borderStyle: "solid",
  } as const;
  const t = `${thickness}px`;
  return (
    <span aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      <span className="absolute rounded-tl-[0.9rem]" style={{ ...corner, top: inset, left: inset, borderTopWidth: t, borderLeftWidth: t }} />
      <span className="absolute rounded-tr-[0.9rem]" style={{ ...corner, top: inset, right: inset, borderTopWidth: t, borderRightWidth: t }} />
      <span className="absolute rounded-bl-[0.9rem]" style={{ ...corner, bottom: inset, left: inset, borderBottomWidth: t, borderLeftWidth: t }} />
      <span className="absolute rounded-br-[0.9rem]" style={{ ...corner, bottom: inset, right: inset, borderBottomWidth: t, borderRightWidth: t }} />
    </span>
  );
}
