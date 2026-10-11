"use client";

import { ArrowDown } from "lucide-react";
import { m } from "motion/react";
import { Button } from "@/components/ui/Button";
import { HeroStage } from "@/components/three/HeroStage";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-24 sm:pt-28 lg:pt-20">
      {/* soft mint light behind the stage */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-[18%] top-[2%] size-[48rem] rounded-full bg-[radial-gradient(closest-side,rgb(159_223_196/0.55),rgb(159_223_196/0.16)_60%,transparent)] blur-2xl" />
        <div className="absolute -left-[12%] bottom-[-8%] size-[30rem] rounded-full bg-[radial-gradient(closest-side,rgb(232_243_236/0.9),transparent)]" />
      </div>

      <div className="container-x relative grid items-center gap-2 pb-12 lg:min-h-[100svh] lg:grid-cols-[1.02fr_1fr] lg:gap-4 lg:pb-8 lg:pt-16">
        <div className="relative z-10 max-w-[38rem] pt-6 lg:pt-0">
          <m.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="eyebrow inline-flex items-center gap-2.5"
          >
            <span aria-hidden="true" className="h-px w-8 bg-leaf" />
            Maisto alergenų atpažinimas
          </m.p>

          <m.h1
            id="hero-title"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease }}
            className="mt-6 text-[clamp(2.55rem,5.6vw,4.5rem)] font-extrabold leading-[1.04] tracking-[-0.045em] text-forest"
          >
            Maisto sudėtis.{" "}
            <span className="relative inline-block whitespace-nowrap sm:whitespace-normal lg:whitespace-nowrap">
              <span aria-hidden="true" className="absolute inset-x-[-0.08em] bottom-[0.06em] top-[0.52em] -z-10 -skew-x-6 rounded-md bg-mint/70" />
              Aiškiau
            </span>{" "}
            iš pirmo žvilgsnio.
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease }}
            className="mt-7 max-w-[34rem] text-[1.125rem] leading-[1.65] text-muted sm:text-[1.2rem]"
          >
            Skanis padeda greičiau pastebėti tau svarbius alergenus maisto produktų sudėtyje. Nufotografuok etiketę, peržiūrėk
            ingredientus ir lengviau suprask, į ką atkreipti dėmesį.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28, ease }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button href="/#registracija" size="lg">
              Išbandyti pirmiesiems
            </Button>
            <Button href="/#kaip-veikia" variant="secondary" size="lg">
              Kaip veikia?
              <ArrowDown className="size-4 transition-transform duration-300 group-hover/btn:translate-y-0.5" />
            </Button>
          </m.div>

          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-forest/10 bg-white/70 py-2 pl-3 pr-4 text-sm font-semibold text-forest backdrop-blur"
          >
            <span aria-hidden="true" className="relative grid size-2.5 place-items-center">
              <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-leaf motion-reduce:hidden" />
              <span className="relative size-2.5 rounded-full bg-leaf" />
            </span>
            Šiuo metu ruošiama testavimo versija
          </m.p>
        </div>

        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease }}
          className="relative"
        >
          <HeroStage className="h-[27.5rem] w-full sm:h-[34rem] lg:h-[44rem]" />
          <p className="relative z-10 -mt-2 text-center text-[0.8rem] text-muted lg:-mt-4">
            Iliustracinė demonstracija, ne tikra programėlės ekrano kopija.
          </p>
        </m.div>
      </div>
    </section>
  );
}
