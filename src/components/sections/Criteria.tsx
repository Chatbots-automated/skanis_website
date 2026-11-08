"use client";

import { useRef, type PointerEvent } from "react";
import { m, useMotionValue, useSpring } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const ROW_A = ["E priedai", "Konservantai", "Saldikliai", "Dažikliai", "Skonio stiprikliai", "Pridėtinis cukrus", "Palmių aliejus", "Transriebalai"];
const ROW_B = ["Veganiška", "Vegetariška", "Be glitimo", "Be laktozės", "Druska", "Kofeinas", "Alkoholis", "Alergenai"];

const GROUPS = [
  { title: "E priedai", text: "Dažikliai, konservantai, saldikliai, stiprikliai. Po vieną arba visa grupė vienu paspaudimu.", tone: "brand" },
  { title: "Mitybos tipas", text: "Veganiška, vegetariška, be glitimo, be laktozės.", tone: "mint" },
  { title: "Gyvenimo būdas", text: "Pridėtinis cukrus, druska, palmių aliejus, kofeinas, alkoholis.", tone: "ink" },
  { title: "Alergenai", text: "14 ES alergenų, jei tau to reikia.", tone: "white" },
] as const;

const TONES = {
  brand: "bg-brand text-white ring-1 ring-inset ring-white/10",
  mint: "bg-mint text-brand-deep",
  ink: "bg-paper text-ink",
  white: "bg-white/[0.06] text-white ring-1 ring-inset ring-white/15",
} as const;

export function Criteria() {
  return (
    <section id="kriterijai" aria-labelledby="criteria-title" data-on-dark className="overflow-hidden bg-brand-deep py-20 text-white lg:py-36">
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 id="criteria-title" className="display text-[clamp(2.4rem,6.4vw,5.5rem)] text-white">
            Tavo kriterijai.
            <br />
            <span className="text-mint">Tavo maistas.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            Pasirink, kas tau svarbu, o Skanis patikrins kiekvieną etiketę būtent pagal tai.
          </p>
        </Reveal>
      </div>

      <div aria-hidden="true" className="mt-14 space-y-3 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <Marquee items={ROW_A} className="animate-marquee" accent />
        <Marquee items={ROW_B} className="animate-marquee-rev" />
      </div>

      <ul className="container-x mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {GROUPS.map((g, i) => (
          <Reveal as="li" key={g.title} delay={i * 0.06}>
            <TiltCard className={TONES[g.tone]}>
              <p className="text-sm font-extrabold tabular-nums opacity-50">0{i + 1}</p>
              <h3 className="mt-5 text-2xl sm:mt-10">{g.title}</h3>
              <p className="mt-2 leading-relaxed opacity-75">{g.text}</p>
            </TiltCard>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

function Marquee({ items, className, accent = false }: { items: readonly string[]; className?: string; accent?: boolean }) {
  return (
    <div className="flex w-max gap-3 motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:justify-center">
      <div className={cn("flex w-max gap-3 pr-3", className)}>
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className={cn(
              "whitespace-nowrap rounded-full px-6 py-3 text-lg font-extrabold sm:text-xl",
              accent && i % 3 === 0 ? "bg-mint text-brand-deep" : i % 2 ? "bg-brand text-white" : "bg-white/[0.07] text-white/90",
            )}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/** A card that leans toward the pointer. */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    rx.set(((e.clientY - r.top) / r.height - 0.5) * -10);
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
  }

  return (
    <div className="h-full [perspective:900px]">
      <m.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
        style={{ rotateX: rx, rotateY: ry }}
        className={cn("h-full rounded-[1.75rem] p-6 transition-shadow sm:p-7 duration-300 hover:shadow-lift", className)}
      >
        {children}
      </m.div>
    </div>
  );
}
