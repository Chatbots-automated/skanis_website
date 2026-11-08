"use client";

import { useRef, useState } from "react";
import { m, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { Phone } from "@/components/ui/Phone";
import { AppHeader, CameraScreen, CheckBullet, Footnote, Marked, ProductRow, ReasonPanel, ResultButtons, SectionTitle, VerdictHeading } from "@/components/demo/AppScreens";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    word: "Skenuok",
    text: "Nufotografuok sudėtį ant pakuotės. Skanis perskaito visą ingredientų sąrašą, net ir smulkiausią šriftą.",
  },
  {
    word: "Pažink",
    text: "Iškart matai, kas viduje: E priedai, konservantai, saldikliai, dažikliai. Ir tiksliai kurie neatitinka tavo kriterijų.",
  },
  {
    word: "Vartok",
    text: "Aiškus atsakymas pagal tavo mitybos tipą ir gyvenimo būdą. Tinkamą produktą išsirenki per kelias sekundes.",
  },
] as const;

// the timeline: a gentle arc, with each step's marker sitting on it (viewBox 0 0 120 600)
const ARC = "M20 0 C 120 160, 120 440, 20 600";
const MARKERS = [0.17, 0.5, 0.83].map((t) => {
  const b = (p0: number, p1: number, p2: number, p3: number) =>
    (1 - t) ** 3 * p0 + 3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t ** 2 * p2 + t ** 3 * p3;
  return { x: b(20, 120, 120, 20) / 120, y: b(0, 160, 440, 600) / 600 };
});

/**
 * Pinned scroll story, after the app itself: the phone stays put on the left
 * while the steps advance along an arc on the right, and the screen follows.
 */
export function Steps() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(2, Math.floor(v * 3))));

  const tilt = useTransform(smooth, [0, 0.5, 1], [-14, 0, 14]);
  const lift = useTransform(smooth, [0, 0.5, 1], [5, 0, 5]);

  return (
    <section ref={ref} id="kaip-veikia" aria-labelledby="steps-title" className="relative h-[300svh] bg-brand-soft">
      <h2 id="steps-title" className="sr-only">
        Kaip veikia Skanis: skenuok, pažink, vartok
      </h2>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="container-x grid w-full items-center gap-4 pt-14 sm:gap-6 lg:grid-cols-2 lg:gap-16 lg:pt-0">
          {/* phone */}
          <div className="order-2 flex justify-center [perspective:1400px] lg:order-1 lg:justify-end">
            <m.div style={{ rotateY: tilt, rotateX: lift }} className="relative">
              <div aria-hidden="true" className="pointer-events-none absolute inset-[-14%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(159_223_196/0.6),transparent)]" />
              <Phone className="h-[min(46svh,620px)] sm:h-[min(58svh,620px)] lg:h-[min(78svh,660px)]">
                <Screen show={active === 0}>
                  <ScanScreen />
                </Screen>
                <Screen show={active === 1}>
                  <AnalysisScreen />
                </Screen>
                <Screen show={active === 2}>
                  <VerdictScreen />
                </Screen>
              </Phone>
            </m.div>
          </div>

          {/* steps on an arc (desktop) */}
          <div className="relative order-1 hidden h-[min(36rem,72svh)] lg:order-2 lg:block">
            <svg aria-hidden="true" viewBox="0 0 120 600" preserveAspectRatio="none" className="absolute inset-y-0 left-0 h-full w-[7.5rem] overflow-visible">
              <path d={ARC} fill="none" stroke="rgb(23 105 74 / 0.12)" strokeWidth="10" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
              <m.path
                d={ARC}
                fill="none"
                stroke="var(--color-brand)"
                strokeWidth="10"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                style={{ pathLength: smooth }}
              />
            </svg>
            <ol>
              {STEPS.map((s, i) => (
                <li
                  key={s.word}
                  className="absolute flex -translate-y-8 items-start gap-6"
                  style={{ left: `calc(${MARKERS[i].x} * 7.5rem - 2rem)`, top: `${MARKERS[i].y * 100}%` }}
                >
                  <span
                    className={cn(
                      "display relative grid size-16 shrink-0 place-items-center rounded-full border text-xl transition-colors duration-500",
                      i === active
                        ? "border-brand bg-brand text-white"
                        : i < active
                          ? "border-brand/40 bg-white text-brand"
                          : "border-ink/10 bg-white text-ink/30",
                    )}
                  >
                    0{i + 1}
                  </span>
                  <span className="w-[22rem] pt-2.5">
                    <span className={cn("display block text-[2.6rem] transition-colors duration-500", i === active ? "text-ink" : "text-ink/25")}>
                      {s.word}
                    </span>
                    <m.span
                      initial={false}
                      animate={{ opacity: i === active ? 1 : 0, height: i === active ? "auto" : 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="block overflow-hidden text-[1.05rem] leading-relaxed text-muted"
                    >
                      <span className="block pt-2">{s.text}</span>
                    </m.span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* steps (phones and tablets) */}
          <div className="order-1 lg:hidden">
            <ol className="flex gap-2">
              {STEPS.map((s, i) => (
                <li key={s.word} className={cn("h-1 flex-1 rounded-full transition-colors duration-500", i <= active ? "bg-brand" : "bg-ink/10")}>
                  <span className="sr-only">{s.word}</span>
                </li>
              ))}
            </ol>
            <div className="relative mt-4 min-h-[8.5rem] sm:min-h-[8rem]">
              {STEPS.map((s, i) => (
                <m.div
                  key={s.word}
                  initial={false}
                  animate={{ opacity: i === active ? 1 : 0, y: i === active ? 0 : 10 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden={i !== active}
                  className="absolute inset-x-0 top-0"
                >
                  <p className="display text-[clamp(1.8rem,8vw,2.1rem)] text-ink">
                    <span className="mr-3 text-brand">0{i + 1}</span>
                    {s.word}
                  </p>
                  <p className="mt-2 text-[0.98rem] leading-relaxed text-muted sm:text-[1.02rem]">{s.text}</p>
                </m.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- phone */

function Screen({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <m.div
      initial={false}
      animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.97, y: show ? 0 : 12 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col pt-[16%] text-[4.75cqw]"
    >
      {children}
    </m.div>
  );
}

const LABEL_PARTS = [
  "Sudėtis: pienas, cukrus, braškės (8 %), ",
  "modifikuotas krakmolas, stiprintuvas ",
  "E621",
  ", stabilizatorius E450, saldiklis ",
  "aspartamas",
  ", dažiklis ",
  "E129",
  ", jogurto kultūros.",
];

const YOGURT_ART = (
  <span className="grid size-full place-items-center rounded-[0.4em] bg-[#f6e9ee] text-[0.55em] font-extrabold leading-tight text-[#b4325d]">
    BRAŠKIŲ
    <br />
    JOGURTAS
  </span>
);

function ScanScreen() {
  return (
    <CameraScreen
      label={LABEL_PARTS.join("")}
      backdrop={
        <>
          <span className="absolute -left-[20%] top-[18%] size-[60%] rounded-full bg-[#e0485a]/35 blur-2xl" />
          <span className="absolute -right-[20%] bottom-[10%] size-[60%] rounded-full bg-mint/25 blur-2xl" />
        </>
      }
    />
  );
}

function AnalysisScreen() {
  return (
    <>
      <AppHeader />
      <div className="flex flex-col gap-[1.2em] px-[6%] pt-[3%]">
        <ProductRow name="Braškių jogurtas" meta="400 g" art={YOGURT_ART} />
        <VerdictHeading verdict="doesnt_match" summary="Aptikti 3 jūsų filtrai" />
        <div className="space-y-[0.55em]">
          <SectionTitle>Kodėl netinka?</SectionTitle>
          <ReasonPanel verdict="doesnt_match" title="Saldikliai">
            „…saldiklis <Marked verdict="doesnt_match">aspartamas</Marked>“
          </ReasonPanel>
          <ReasonPanel verdict="doesnt_match" title="Skonio stiprikliai">
            „…stiprintuvas <Marked verdict="doesnt_match">E621</Marked>“
          </ReasonPanel>
          <p className="text-[0.85em] font-semibold text-brand">+1 kiti</p>
        </div>
      </div>
      <ResultButtons />
    </>
  );
}

function VerdictScreen() {
  return (
    <>
      <AppHeader />
      <div className="flex flex-col gap-[1.2em] px-[6%] pt-[3%]">
        <ProductRow name="Natūralus jogurtas" meta="400 g" art={<span className="grid size-full place-items-center rounded-[0.4em] bg-[#eef3f8] text-[0.55em] font-extrabold leading-tight text-[#2f6690]">NATŪRALUS<br />JOGURTAS</span>} />
        <VerdictHeading verdict="matches" summary="Nerasta nieko, ko pasirinkote vengti" />
        <div className="space-y-[0.6em]">
          <SectionTitle>Kodėl tinka?</SectionTitle>
          <CheckBullet>Nerasta jūsų pasirinktų E priedų</CheckBullet>
          <CheckBullet>Atitinka mitybos tipo, gyvenimo būdo ir kitų filtrų reikalavimus</CheckBullet>
        </div>
        <Footnote />
      </div>
      <ResultButtons />
    </>
  );
}
