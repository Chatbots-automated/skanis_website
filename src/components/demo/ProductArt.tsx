import type { ProductId } from "@/content/products";
import { cn } from "@/lib/utils";

/** Packshot-style drawings of the demo products (made-up brands). */
export function ProductArt({ id, className }: { id: ProductId; className?: string }) {
  const Art = ART[id];
  return <Art className={cn("h-full w-full drop-shadow-[0_12px_18px_rgb(17_17_17/0.18)]", className)} />;
}

const ART: Record<ProductId, (p: { className?: string }) => React.ReactElement> = {
  cola: ({ className }) => (
    <svg viewBox="0 0 120 210" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="can-body" x1="0" x2="1">
          <stop offset="0" stopColor="#0d0d0d" />
          <stop offset="0.28" stopColor="#3b3b3b" />
          <stop offset="0.42" stopColor="#1a1a1a" />
          <stop offset="1" stopColor="#050505" />
        </linearGradient>
        <linearGradient id="can-metal" x1="0" x2="1">
          <stop offset="0" stopColor="#9a9a9a" />
          <stop offset="0.35" stopColor="#f2f2f2" />
          <stop offset="1" stopColor="#7d7d7d" />
        </linearGradient>
      </defs>
      <path d="M22 18c0-6 6-10 38-10s38 4 38 10l4 14v148l-4 14c0 6-6 10-38 10s-38-4-38-10l-4-14V32z" fill="url(#can-body)" />
      <path d="M22 18c0-6 6-10 38-10s38 4 38 10l3 10H19z" fill="url(#can-metal)" />
      <path d="M19 182h82l-3 12c0 6-6 10-38 10s-38-4-38-10z" fill="url(#can-metal)" />
      <path d="M18 92c22-14 52 10 84-6v22c-32 16-62-8-84 6z" fill="#e3263a" />
      <text x="60" y="78" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="22" fill="#fff" letterSpacing="1">
        BURBU
      </text>
      <text x="60" y="140" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="13" fill="#fff" letterSpacing="2">
        COLA
      </text>
      <text x="60" y="156" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="15" fill="#e3263a" letterSpacing="2">
        ZERO
      </text>
      <rect x="30" y="30" width="7" height="150" rx="3.5" fill="#fff" opacity="0.14" />
    </svg>
  ),
  traskuciai: ({ className }) => (
    <svg viewBox="0 0 160 210" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="bag-body" x1="0" x2="1">
          <stop offset="0" stopColor="#e8a317" />
          <stop offset="0.35" stopColor="#ffd24a" />
          <stop offset="0.7" stopColor="#f5b928" />
          <stop offset="1" stopColor="#d48f0c" />
        </linearGradient>
      </defs>
      <path
        d="M14 16h132l-2 8c8 30 8 132 0 162l2 8H14l2-8c-8-30-8-132 0-162z"
        fill="url(#bag-body)"
      />
      <path d="M14 16h132l-2 8H16zM14 194h132l-2-8H16z" fill="#b97a08" opacity="0.5" />
      <path d="M14 16l6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6 6 6 6-6" fill="none" stroke="#b97a08" strokeWidth="1.5" opacity="0.6" />
      <text x="80" y="62" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="30" fill="#c8102e" letterSpacing="1">
        KRAŠ
      </text>
      <ellipse cx="62" cy="122" rx="30" ry="20" fill="#f7e2a8" transform="rotate(-14 62 122)" />
      <ellipse cx="96" cy="130" rx="28" ry="18" fill="#f3d58a" transform="rotate(10 96 130)" />
      <ellipse cx="78" cy="110" rx="26" ry="16" fill="#fbecc0" transform="rotate(4 78 110)" />
      <circle cx="70" cy="108" r="2" fill="#4a8a3a" />
      <circle cx="86" cy="114" r="2" fill="#4a8a3a" />
      <circle cx="98" cy="128" r="2" fill="#4a8a3a" />
      <rect x="26" y="158" width="108" height="20" rx="10" fill="#2f8f4e" />
      <text x="80" y="172" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="10" fill="#fff">
        grietinė ir svogūnai
      </text>
      <rect x="22" y="28" width="8" height="150" rx="4" fill="#fff" opacity="0.18" />
    </svg>
  ),
  sausainiai: ({ className }) => (
    <svg viewBox="0 0 200 210" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="box-body" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#3a6fd1" />
          <stop offset="1" stopColor="#1f4aa0" />
        </linearGradient>
      </defs>
      <rect x="10" y="40" width="180" height="140" rx="14" fill="url(#box-body)" />
      <text x="100" y="74" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="24" fill="#fff" letterSpacing="1">
        TRAŠKA
      </text>
      <rect x="30" y="88" width="140" height="62" rx="31" fill="#fff" opacity="0.92" />
      {[58, 100, 142].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="119" r="24" fill="#d39a54" />
          <circle cx={cx} cy="119" r="24" fill="none" stroke="#b77c39" strokeWidth="2" />
          <circle cx={cx - 9} cy="112" r="3.5" fill="#4a2a17" />
          <circle cx={cx + 7} cy="110" r="3" fill="#4a2a17" />
          <circle cx={cx + 2} cy="125" r="3.5" fill="#4a2a17" />
          <circle cx={cx - 10} cy="128" r="2.5" fill="#4a2a17" />
        </g>
      ))}
      <text x="100" y="170" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="10" fill="#fff" opacity="0.9">
        su šokolado gabaliukais
      </text>
      <rect x="20" y="48" width="6" height="124" rx="3" fill="#fff" opacity="0.16" />
    </svg>
  ),
};
