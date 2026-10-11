"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "./nav";

export function Header() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  // Escape closes the menu; the page behind it doesn't scroll while it's open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Leaving the mobile breakpoint with the menu open would strand the scroll lock.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300",
        solid ? "bg-paper/85 shadow-[0_1px_0_rgb(20_63_57/0.08)] backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className={cn("container-x flex items-center justify-between transition-[height] duration-300", solid ? "h-16" : "h-[4.5rem]")}>
        <Link href="/" aria-label="Skanis – į pradžią" className="rounded-lg text-[1.05rem]">
          <Logo />
        </Link>

        <nav aria-label="Pagrindinė navigacija" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-[0.95rem] font-semibold text-forest/80 transition-colors hover:bg-forest/[0.06] hover:text-forest"
            >
              {link.label}
            </Link>
          ))}
          <Button href="/#registracija" size="sm" className="ml-3">
            Išbandyti pirmiesiems
          </Button>
        </nav>

        <button
          type="button"
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-forest transition-colors hover:bg-forest/[0.06] md:hidden"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Uždaryti meniu" : "Atidaryti meniu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id={panelId}
        hidden={!open}
        className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto bg-paper px-5 pb-10 pt-4 md:hidden"
      >
        <nav aria-label="Mobili navigacija" className="flex flex-col">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex min-h-14 items-center justify-between border-b border-line text-2xl font-extrabold tracking-tight text-forest"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button href="/#registracija" size="lg" className="mt-8 w-full" onClick={() => setOpen(false)}>
          Išbandyti pirmiesiems
        </Button>
        <p className="mt-6 text-center text-sm text-muted">Šiuo metu ruošiama testavimo versija</p>
      </div>
    </header>
  );
}
