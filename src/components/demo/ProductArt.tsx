import { cn } from "@/lib/utils";

/** Tiny flat illustrations for the three fictional demo products. */
export function ProductArt({ id, className }: { id: string; className?: string }) {
  return (
    <svg viewBox="0 0 56 56" aria-hidden="true" className={cn("size-12", className)}>
      {id === "oat-cookies" && (
        <g>
          <circle cx="28" cy="28" r="21" fill="#e2b979" />
          <circle cx="28" cy="28" r="21" fill="none" stroke="#c9974f" strokeWidth="2" />
          <g fill="#8a5a2b">
            <circle cx="20" cy="21" r="2.6" />
            <circle cx="33" cy="19" r="2.2" />
            <circle cx="37" cy="31" r="2.6" />
            <circle cx="24" cy="34" r="2.4" />
            <circle cx="30" cy="27" r="1.8" />
          </g>
        </g>
      )}
      {id === "choc-bar" && (
        <g transform="rotate(-18 28 28)">
          <rect x="6" y="17" width="44" height="22" rx="5" fill="#6e3f2b" />
          <rect x="6" y="17" width="44" height="22" rx="5" fill="none" stroke="#4d2a1b" strokeWidth="1.5" />
          <rect x="6" y="24" width="44" height="8" fill="#9fdfc4" />
          <path d="M18 17v22M30 17v22M42 17v22" stroke="#4d2a1b" strokeWidth="1" opacity=".5" />
        </g>
      )}
      {id === "rice-cakes" && (
        <g>
          <circle cx="28" cy="28" r="21" fill="#f1e6cc" />
          <circle cx="28" cy="28" r="21" fill="none" stroke="#d9c79c" strokeWidth="2" />
          <g stroke="#d9c79c" strokeWidth="1.6" strokeLinecap="round">
            <path d="M17 24l4 2M26 17l1 4M35 20l-3 3M39 29l-4-1M32 37l-2-4M22 36l3-3M18 31l4-1M29 28l3 1" />
          </g>
        </g>
      )}
    </svg>
  );
}
