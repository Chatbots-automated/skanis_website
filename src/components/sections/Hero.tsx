"use client";

import { m } from "motion/react";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { HeroDemo } from "./HeroDemo";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-white pb-16 pt-24 sm:pt-28 lg:pb-24 lg:pt-28">
      {/* a faint label-paper dot grid that fades out toward the edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[75rem] bg-[radial-gradient(rgb(17_17_17/0.07)_1px,transparent_1.5px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_60%_55%_at_50%_45%,#000,transparent)]"
      />

      <div className="container-x relative flex flex-col items-center text-center">
        <m.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="inline-flex items-center gap-2 rounded-full bg-mint/50 py-1 pl-2.5 pr-3.5 text-xs font-semibold text-ink sm:gap-2.5 sm:py-1.5 sm:pl-3 sm:pr-4 sm:text-sm"
        >
          <span aria-hidden="true" className="relative grid size-2 place-items-center">
            <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-grape motion-reduce:hidden" />
            <span className="relative size-2 rounded-full bg-grape" />
          </span>
          Testavimo versija jau netrukus
        </m.p>

        <m.h1
          id="hero-title"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.08, ease }}
          className="display mt-5 text-[clamp(2.75rem,7vw,6rem)] text-ink"
        >
          Skenuok ir pažink
          <br />
          maistą<span className="text-grape">.</span>
        </m.h1>

        <m.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease }}
          className="mt-4 max-w-[21rem] text-[0.98rem] leading-relaxed text-ink/60 sm:mt-5 sm:max-w-xl sm:text-xl"
        >
          Tavo išmanusis maisto sudėties gidas. Nufotografuok etiketę ir per kelias sekundes pamatyk, ar produktas tinka tau.
        </m.p>

        <m.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.28, ease }}>
          <StoreButtons className="mt-7 sm:mt-8" />
        </m.div>

        <m.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease }} className="w-full">
          <HeroDemo />
        </m.div>
      </div>
    </section>
  );
}
