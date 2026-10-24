"use client";

import { useRef, useState } from "react";
import { m, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { Check } from "lucide-react";
import { AppBar, Phone } from "@/components/ui/Phone";
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
    <section ref={ref} id="kaip-veikia" aria-labelledby="steps-title" className="relative h-[300svh] bg-white">
      <h2 id="steps-title" className="sr-only">
        Kaip veikia Skanis: skenuok, pažink, vartok
      </h2>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="container-x grid w-full items-center gap-4 pt-14 sm:gap-6 lg:grid-cols-2 lg:gap-16 lg:pt-0">
          {/* phone */}
          <div className="order-2 flex justify-center [perspective:1400px] lg:order-1 lg:justify-end">
            <m.div style={{ rotateY: tilt, rotateX: lift }} className="relative">
              <div aria-hidden="true" className="pointer-events-none absolute inset-[-14%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(163_232_208/0.6),transparent)]" />
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
              <path d={ARC} fill="none" stroke="rgb(17 17 17 / 0.07)" strokeWidth="10" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
              <m.path
                d={ARC}
                fill="none"
                stroke="var(--color-mint-deep)"
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
                        ? "border-grape bg-grape text-white"
                        : i < active
                          ? "border-grape/40 bg-white text-grape"
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
                <li key={s.word} className={cn("h-1 flex-1 rounded-full transition-colors duration-500", i <= active ? "bg-grape" : "bg-ink/10")}>
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
                    <span className="mr-3 text-grape">0{i + 1}</span>
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
      className="absolute inset-0 flex flex-col pt-[14%] text-[clamp(9px,1.7svh,13px)]"
    >
      {children}
    </m.div>
  );
}

const LABEL_PARTS = [
  "Sudėtis: pienas, cukrus, braškės (8 %), ",
  "modifikuotas krakmolas, ",
  "E621",
  ", stabilizatorius ",
  "E450",
  ", saldiklis ",
  "aspartamas",
  ", dažiklis ",
  "E129",
  ", jogurto kultūros.",
];
const HITS = new Set(["E621", "E450", "aspartamas", "E129"]);

function ScanScreen() {
  return (
    <>
      <AppBar title="Nufotografuokite sudėtį" />
      <div className="relative mx-[5%] flex-1 overflow-hidden rounded-[1.6em] bg-[#1d1d1f]">
        <span className="absolute -left-[20%] top-[10%] size-[60%] rounded-full bg-[#e0485a]/50 blur-2xl" />
        <span className="absolute -right-[20%] bottom-[5%] size-[60%] rounded-full bg-mint/40 blur-2xl" />
        <div className="absolute inset-x-[10%] top-[24%] rotate-[-2deg] rounded-[0.8em] bg-white p-[7%] text-[0.92em] leading-[1.45] text-ink/80 shadow-lift">
          {LABEL_PARTS.join("")}
        </div>
        {[
          "left-[6%] top-[18%] border-l-[3px] border-t-[3px] rounded-tl-xl",
          "right-[6%] top-[18%] border-r-[3px] border-t-[3px] rounded-tr-xl",
          "left-[6%] bottom-[22%] border-b-[3px] border-l-[3px] rounded-bl-xl",
          "right-[6%] bottom-[22%] border-b-[3px] border-r-[3px] rounded-br-xl",
        ].map((c) => (
          <span key={c} className={cn("absolute size-[14%] border-mint", c)} />
        ))}
        <span className="absolute inset-x-[8%] h-[2px] animate-scan rounded-full bg-mint shadow-[0_0_14px_4px_rgb(163_232_208/0.7)]" />
        <p className="absolute inset-x-0 bottom-[8%] text-center text-[0.9em] font-semibold text-white/80">Skaitomi ingredientai…</p>
      </div>
      <div className="flex justify-center py-[7%]">
        <span className="grid size-[3.6em] place-items-center rounded-full border-[3px] border-ink/15">
          <span className="size-[2.7em] rounded-full bg-ink" />
        </span>
      </div>
    </>
  );
}

function AnalysisScreen() {
  return (
    <>
      <AppBar title="Rezultatas" />
      <div className="mx-[6%] rounded-[1.4em] bg-grape p-[6%] text-white">
        <p className="text-[0.8em] font-bold uppercase tracking-[0.14em] text-white/70">Rezultatas</p>
        <p className="mt-[0.2em] text-[2.3em] font-extrabold leading-none tracking-tight">Dėmesio</p>
        <p className="mt-[0.4em] text-[0.95em] text-white/80">Rasti 4 neatitikimai pagal tavo filtrus</p>
      </div>
      <p className="mx-[6%] mt-[6%] text-[0.85em] font-extrabold uppercase tracking-[0.12em] text-ink/50">Aptikta</p>
      <ul className="mx-[6%] mt-[3%] space-y-[0.5em]">
        {[
          ["E621", "Skonio stipriklis"],
          ["E450", "Fosfatai"],
          ["Aspartamas", "Saldiklis"],
          ["E129", "Dažiklis"],
        ].map(([name, kind]) => (
          <li key={name} className="flex items-center justify-between rounded-[0.9em] border border-line px-[0.9em] py-[0.6em]">
            <span>
              <span className="block text-[1.05em] font-extrabold text-ink">{name}</span>
              <span className="text-[0.85em] text-muted">{kind}</span>
            </span>
            <span className="rounded-full bg-grape-soft px-[0.7em] py-[0.25em] text-[0.8em] font-bold text-grape">Vengti</span>
          </li>
        ))}
      </ul>
      <p className="mx-[6%] mt-[5%] text-[0.88em] leading-[1.5] text-ink/70">
        {LABEL_PARTS.slice(1).map((part, i) =>
          HITS.has(part) ? (
            <mark key={i} className="rounded bg-grape-soft px-[0.2em] font-bold text-grape">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </p>
    </>
  );
}

function VerdictScreen() {
  return (
    <>
      <AppBar title="Rezultatas" />
      <div className="mx-[6%] flex flex-col items-center rounded-[1.4em] bg-mint px-[6%] py-[9%] text-center">
        <span className="grid size-[3.4em] place-items-center rounded-full bg-ink text-mint">
          <Check className="size-[1.8em]" strokeWidth={3} />
        </span>
        <p className="mt-[0.6em] text-[2.6em] font-extrabold leading-none tracking-tight text-ink">Tinka</p>
        <p className="mt-[0.4em] text-[0.95em] font-semibold text-ink/70">pagal tavo filtrus</p>
      </div>
      <p className="mx-[6%] mt-[7%] text-[0.85em] font-extrabold uppercase tracking-[0.12em] text-ink/50">Kodėl tinka?</p>
      <ul className="mx-[6%] mt-[3%] space-y-[0.6em]">
        {["Nerasta tavo pasirinktų E priedų", "Be saldiklių ir dažiklių", "Atitinka: vegetariška mityba"].map((t) => (
          <li key={t} className="flex items-center gap-[0.6em] text-[1em] font-semibold text-ink">
            <span className="grid size-[1.5em] shrink-0 place-items-center rounded-full bg-mint-soft text-ink">
              <Check className="size-[0.9em]" strokeWidth={3} />
            </span>
            {t}
          </li>
        ))}
      </ul>
      <div className="mx-[6%] mb-[9%] mt-auto rounded-full bg-ink py-[0.9em] text-center text-[1em] font-extrabold text-white">
        Skenuoti kitą produktą
      </div>
    </>
  );
}
