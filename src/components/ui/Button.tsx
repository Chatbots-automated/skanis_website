import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "mint" | "light";
type Size = "md" | "lg" | "sm";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold " +
  "transition-[transform,background-color,box-shadow,color,border-color] duration-300 ease-out-soft " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:-translate-y-0.5 hover:bg-grape hover:shadow-[0_16px_30px_-12px_rgb(94_38_128/0.6)]",
  secondary: "border border-ink/15 bg-white/60 text-ink hover:-translate-y-0.5 hover:border-ink/40 hover:bg-white",
  mint: "bg-mint text-ink hover:-translate-y-0.5 hover:bg-white",
  light: "bg-white text-ink hover:-translate-y-0.5 hover:bg-mint",
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
