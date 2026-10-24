"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/utils";

export function Header() {
  const scrolled = useScrolled();

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300",
        scrolled ? "bg-white/80 shadow-[0_1px_0_rgb(17_17_17/0.08)] backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className={cn("container-x flex items-center justify-between transition-[height] duration-300", scrolled ? "h-16" : "h-[4.5rem]")}>
        <Link href="/" aria-label="Skanis – į pradžią" className="rounded-lg text-[0.95rem] sm:text-[1.05rem]">
          <Logo />
        </Link>
        <Button href="/#registracija" size="nav">
          Gauti kvietimą
        </Button>
      </div>
    </header>
  );
}
