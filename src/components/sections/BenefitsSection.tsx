"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, ScanLine } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { ScanCorners } from "@/components/ui/ScanCorners";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

/*
 * An editorial bento: each benefit is told with its own small piece of app
 * interface instead of repeating the same icon-and-text card.
 */

const CHIPS = ["Pienas", "Kiaušiniai", "Glitimas", "Žemės riešutai", "Riešutai", "Soja", "Žuvis", "Sezamas"];

function Tile({ className, children, tone = "white" }: { className?: string; children: React.ReactNode; tone?: "white" | "sage" | "forest" }) {
  return (
    <Reveal
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[var(--radius-card)] p-7 sm:p-9",
        tone === "white" && "border border-line bg-white shadow-soft",
        tone === "sage" && "bg-sage",
        tone === "forest" && "bg-forest text-white",
        className,
      )}
    >
      {children}
    </Reveal>
  );
}

function Copy({ title, text, dark = false }: { title: string; text: string; dark?: boolean }) {
  return (
    <div>
      <h3 className={cn("text-[1.45rem] sm:text-[1.65rem]", dark ? "text-white" : "text-forest")}>{title}</h3>
      <p className={cn("mt-2.5 max-w-sm leading-relaxed", dark ? "text-white/75" : "text-muted")}>{text}</p>
    </div>
  );
}

export function BenefitsSection() {
  const [on, setOn] = useState<ReadonlySet<string>>(new Set(["Pienas", "Žemės riešutai"]));
  const toggle = (c: string) =>
    setOn((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });

  return (
    <section id="privalumai" aria-labelledby="benefits-title" className="section-y bg-paper">
      <div className="container-x">
        <Reveal>
          <SectionHeading id="benefits-title" eyebrow="Privalumai" title="Mažiau spėliojimo. Daugiau aiškumo." />
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          {/* 1 — personalised */}
          <Tile className="lg:col-span-7">
            <Copy title="Personalizuota tau" text="Pasirink, kuriuos alergenus nori stebėti." />
            <div className="mt-auto flex flex-wrap gap-2.5 pt-8" role="group" aria-label="Alergenų pavyzdys. Paspaudus pažymimi arba atžymimi.">
              {CHIPS.map((c) => {
                const active = on.has(c);
                return (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggle(c)}
                    className={cn(
                      "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-[0.92rem] font-bold transition-all duration-300 active:scale-95",
                      active ? "border-leaf bg-leaf text-white shadow-[0_8px_18px_-10px_rgb(23_105_74/0.9)]" : "border-line bg-paper text-ink hover:border-forest/30",
                    )}
                  >
                    <span className={cn("grid size-[1.15rem] place-items-center rounded-full", active ? "bg-white/25" : "border border-line bg-white")}>
                      {active && <Check className="size-3" strokeWidth={3.5} />}
                    </span>
                    {c}
                  </button>
                );
              })}
            </div>
            <p className="mt-5 text-sm text-muted" aria-live="polite">
              {on.size === 0 ? "Nieko nestebi." : `Stebi: ${on.size} ${on.size === 1 ? "alergeną" : on.size < 10 ? "alergenus" : "alergenų"}.`}
            </p>
          </Tile>

          {/* 2 — faster reading */}
          <Tile className="lg:col-span-5" tone="forest">
            <Copy dark title="Greitesnis ingredientų skaitymas" text="Nuskenuok sudėtį ir peržiūrėk aiškiai pateiktą informaciją." />
            <div className="mt-auto flex items-center gap-4 pt-8" aria-hidden="true">
              <div className="relative h-24 w-20 shrink-0 rotate-[-3deg] overflow-hidden rounded-xl bg-[#f6efe0] p-2.5 shadow-lg">
                {[100, 82, 94, 70, 88, 60].map((w, i) => (
                  <span key={i} className="mb-1.5 block h-1.5 rounded-full bg-[#4a4232]/30" style={{ width: `${w}%` }} />
                ))}
                <span className="absolute inset-x-0 top-0 h-8 animate-scan motion-reduce:hidden" style={{ ["--scan-distance" as string]: "64px" }}>
                  <span className="absolute inset-x-0 bottom-0 h-[2px] bg-mint shadow-[0_0_12px_4px_rgb(159_223_196/0.7)]" />
                </span>
              </div>
              <ScanLine className="size-6 shrink-0 text-mint" />
              <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm leading-snug backdrop-blur">
                <p className="font-extrabold text-mint">Rezultatas paruoštas</p>
                <p className="text-white/70">Su paryškintais žodžiais</p>
              </div>
            </div>
          </Tile>

          {/* 3 — highlighted ingredients */}
          <Tile className="lg:col-span-5" tone="sage">
            <Copy title="Svarbūs ingredientai išskirti" text="Lengviau pastebėk sudedamąsias dalis, į kurias reikėtų atkreipti dėmesį." />
            <p className="mt-auto rounded-2xl bg-white/80 p-5 text-[0.95rem] leading-[1.75] text-ink/80">
              cukrus, kviečių miltai, augalinis aliejus, sviestas, <mark className="mark-hit">pieno milteliai</mark>, kepimo milteliai, druska, vanilės
              aromatas…
            </p>
          </Tile>

          {/* 4 — shopping */}
          <Tile className="lg:col-span-7">
            <Copy title="Patogiau apsiperkant" text="Mažiau laiko skirk sudėtingų ingredientų sąrašų skaitymui." />
            <ul className="mt-auto divide-y divide-line rounded-2xl border border-line bg-paper" aria-label="Pavyzdinė nuskaitymų istorija">
              {[
                { name: "Avižiniai sausainiai", status: "Aptiktas pienas", tone: "danger" },
                { name: "Obuolių gėrimas", status: "Pasirinktų alergenų neaptikta", tone: "ok" },
                { name: "Bulvių traškučiai", status: "Galimi pėdsakai: riešutai", tone: "amber" },
              ].map((row) => (
                <li key={row.name} className="flex items-center justify-between gap-3 px-4 py-3.5">
                  <span className="font-bold text-ink">{row.name}</span>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-bold",
                      row.tone === "danger" && "bg-danger-soft text-danger",
                      row.tone === "ok" && "bg-sage text-leaf",
                      row.tone === "amber" && "bg-amber-soft text-amber",
                    )}
                  >
                    {row.status}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">Pavyzdiniai duomenys.</p>
          </Tile>
        </div>

        {/* campaign picture */}
        <Reveal className="mt-14">
          <figure className="relative overflow-hidden rounded-[2rem] bg-forest shadow-lift">
            <Image
              src="/images/skanis-ad.jpg"
              width={1200}
              height={655}
              sizes="(min-width: 1216px) 1152px, 100vw"
              alt="Vyras su didinamuoju stiklu parduotuvėje tikrina jogurto puodelio sudėtį, o virš puodelio šviečia E priedų žymės"
              className="block h-auto w-full"
            />
            <ScanCorners className="text-white/80" inset="1rem" size="2rem" thickness={3} />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
