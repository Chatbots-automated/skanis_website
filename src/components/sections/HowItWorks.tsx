"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { ScanCorners } from "@/components/ui/ScanCorners";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScaledPhone } from "@/components/phone/PhoneFrame";
import { ScreenAllergens, ScreenResult, ScreenScan } from "@/components/phone/screens";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Pasirink alergenus",
    text: "Pažymėk alergenus, į kuriuos nori atkreipti dėmesį.",
    note: "Pasirinkimus gali pakeisti bet kada.",
    Screen: ScreenAllergens,
  },
  {
    title: "Nuskenuok etiketę",
    text: "Nufotografuok maisto produkto ingredientų sąrašą.",
    note: "Ilga etiketė? Galėsi padaryti keletą nuotraukų.",
    Screen: ScreenScan,
  },
  {
    title: "Peržiūrėk rezultatą",
    text: "Skanis išskirs aptiktus ingredientus, kurie gali būti svarbūs tau.",
    note: "Jei etiketės nepavyko perskaityti, Skanis tai pasakys, o ne spės.",
    Screen: ScreenResult,
  },
] as const;

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLLIElement | null>>([]);

  // The sticky phone follows whichever step is in the middle of the screen.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-42% 0px -42% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const ActiveScreen = STEPS[active].Screen;

  return (
    <section id="kaip-veikia" aria-labelledby="how-title" className="section-y relative bg-sage/70">
      <div className="container-x">
        <Reveal>
          <SectionHeading id="how-title" eyebrow="Kaip veikia" title="Trys paprasti žingsniai" lead="Nuo alergenų pasirinkimo iki aiškaus rezultato: viskas telpa į kelias sekundes prie lentynos." />
        </Reveal>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[1fr_22rem] lg:gap-24">
          <ol className="relative">
            {/* progress rail (desktop) */}
            <span aria-hidden="true" className="absolute bottom-10 left-[1.65rem] top-10 hidden w-px bg-forest/15 lg:block" />
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                data-index={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="relative pb-16 last:pb-0 lg:min-h-[28rem] lg:pb-0"
              >
                <div className="lg:flex lg:min-h-[28rem] lg:items-center">
                  <div className="grid grid-cols-[auto_1fr] gap-x-5 lg:gap-x-8">
                    <span
                      className={cn(
                        "relative z-10 grid size-[3.4rem] place-items-center rounded-full border text-lg font-extrabold transition-all duration-500",
                        active === i ? "border-forest bg-forest text-white lg:scale-110" : "border-forest/20 bg-white text-forest",
                      )}
                    >
                      {i + 1}
                    </span>
                    <div className="pt-1">
                      <h3 className="text-[clamp(1.6rem,3vw,2.3rem)] text-forest">{step.title}</h3>
                      <p className="mt-3 max-w-md text-lg leading-relaxed text-ink/80">{step.text}</p>
                      <p className="mt-2 max-w-md leading-relaxed text-muted">{step.note}</p>

                      {i === 1 && (
                        <figure className="relative mt-6 w-full max-w-[19rem] overflow-hidden rounded-[1.5rem] bg-[#9fdfc4] shadow-soft">
                          <Image
                            src="/images/skanis-scan-hand.jpg"
                            width={430}
                            height={312}
                            sizes="19rem"
                            alt="Ranka laiko telefoną, kuriuo fotografuojama stiklainio etiketė"
                            className="block h-auto w-full"
                          />
                          <ScanCorners className="text-forest/70" inset="0.6rem" size="1.2rem" thickness={2.5} />
                        </figure>
                      )}

                      {/* mobile: the matching screen, peeking out of the bottom */}
                      <div className="relative mt-8 h-[19rem] overflow-hidden lg:hidden [mask-image:linear-gradient(to_bottom,black_72%,transparent)]">
                        <div className="mx-auto w-[15.5rem]">
                          <ScaledPhone>
                            <step.Screen />
                          </ScaledPhone>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          {/* desktop: one sticky phone that changes with the step */}
          <div className="relative hidden lg:block">
            <div className="sticky top-28">
              <div className="relative mx-auto w-[20rem]">
                <div aria-hidden="true" className="absolute -inset-10 -z-10 rounded-full bg-mint/40 blur-3xl" />
                <ScaledPhone>
                  <AnimatePresence mode="wait" initial={false}>
                    <m.div
                      key={active}
                      className="h-full"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <ActiveScreen />
                    </m.div>
                  </AnimatePresence>
                </ScaledPhone>
              </div>
              <p className="mt-6 text-center text-sm text-muted">Iliustracinė demonstracija, ne tikra programėlės ekrano kopija.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
