import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "mint" | "ghost-light";
type Size = "md" | "lg" | "sm";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold " +
  "transition-[transform,background-color,box-shadow,color,border-color] duration-300 ease-out-soft " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-forest text-white shadow-[0_10px_24px_-10px_rgb(20_63_57/0.7)] hover:bg-forest-deep hover:shadow-[0_16px_30px_-12px_rgb(20_63_57/0.8)] hover:-translate-y-0.5",
  secondary: "border border-forest/20 bg-white/70 text-forest hover:border-forest/50 hover:bg-white hover:-translate-y-0.5",
  mint: "bg-mint text-forest-deep shadow-[0_10px_30px_-10px_rgb(159_223_196/0.7)] hover:bg-mint-soft hover:-translate-y-0.5",
  "ghost-light": "border border-white/25 text-white hover:border-white/60 hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-sm",
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-base",
};

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };
type AsButton = Common & Omit<ComponentProps<"button">, keyof Common> & { href?: undefined };
type AsLink = Common & Omit<ComponentProps<typeof Link>, keyof Common | "href"> & { href: string };

/** One button for the whole site: renders a Next.js link when `href` is given, otherwise a <button>. */
export function Button(props: AsButton | AsLink) {
  const { variant = "primary", size = "md", className, children, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], className);
  if (rest.href !== undefined) {
    return (
      <Link {...(rest as Omit<AsLink, keyof Common>)} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" {...(rest as Omit<AsButton, keyof Common>)} className={classes}>
      {children}
    </button>
  );
}
