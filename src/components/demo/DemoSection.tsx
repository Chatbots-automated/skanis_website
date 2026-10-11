"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ScaledPhone } from "@/components/phone/PhoneFrame";
import { cn } from "@/lib/utils";
import { analyzeDemo, DEMO_ALLERGENS, DEMO_PRODUCTS, type AllergenId } from "@/content/demo";
import { DEMO_PHONE_H, DEMO_PHONE_W, DemoScreen } from "./DemoScreen";
import { ProductArt } from "./ProductArt";

const SCAN_MS = 1100;

export function DemoSection() {
  const reduceMotion = useReducedMotion();
  const [productId, setProductId] = useState(DEMO_PRODUCTS[0].id);
  const [selected, setSelected] = useState<ReadonlySet<AllergenId>>(() => new Set<AllergenId>(["milk", "peanut"]));
  // bumping `scanRun` replays the scan animation (new product or "scan again")
  const [scanRun, setScanRun] = useState(0);
  const [finishedRun, setFinishedRun] = useState(0);
  const scanning = scanRun > 0 && finishedRun !== scanRun && !reduceMotion;

  const product = DEMO_PRODUCTS.find((p) => p.id === productId) ?? DEMO_PRODUCTS[0];
  const result = useMemo(() => analyzeDemo(product, selected), [product, selected]);

  useEffect(() => {
    if (scanRun === 0) return;
    const t = window.setTimeout(() => setFinishedRun(scanRun), SCAN_MS);
    return () => window.clearTimeout(t);
  }, [scanRun]);

  const toggle = (id: AllergenId) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const pickProduct = (id: string) => {
    if (id === productId) return;
    setProductId(id);
    setScanRun((n) => n + 1);
  };

  const summary =
    result.verdict === "found"
      ? `Aptikta: ${result.found.map((f) => f.allergen.label).join(", ")}.`
      : result.verdict === "trace"
        ? `Galimi pėdsakai: ${result.traces.map((t) => t.label).join(", ")}.`
        : result.verdict === "clear"
          ? "Pasirinktų alergenų pateiktame ingredientų sąraše neaptikta."
          : "Nepasirinktas nė vienas alergenas.";

  return (
    <section id="demonstracija" aria-labelledby="demo-title" className="section-y relative overflow-hidden bg-paper">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-1/3 size-[34rem] rounded-full bg-mint/25 blur-3xl" />
      <div className="container-x relative">
        <Reveal>
          <SectionHeading
            id="demo-title"
            eyebrow="Interaktyvi demonstracija"
            title="Pamatyk, kaip veikia Skanis"
            lead="Išbandyk su fiktyviais produktais: pasirink alergenus ir stebėk, kaip pasikeičia rezultatas. Nieko nereikia atsisiųsti."
          />
        </Reveal>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-24">
          <Reveal className="order-2 lg:order-1">
            <div className="max-w-xl space-y-9">
              <fieldset>
                <legend className="flex items-center gap-3 text-sm font-extrabold text-forest">
                  <span className="grid size-7 place-items-center rounded-full bg-forest text-xs text-white">1</span>
                  Pasirink produktą
                </legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {DEMO_PRODUCTS.map((p) => (
                    <label key={p.id} className="relative block cursor-pointer">
                      <input
                        type="radio"
                        name="demo-product"
                        value={p.id}
                        checked={p.id === productId}
                        onChange={() => pickProduct(p.id)}
                        className="peer sr-only"
                      />
                      <span className="flex h-full items-center gap-3 rounded-[1.125rem] border border-line bg-white p-3.5 transition-all duration-300 hover:border-forest/30 hover:shadow-soft peer-checked:border-forest peer-checked:shadow-[0_0_0_1px_var(--color-forest),var(--shadow-soft)] peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-leaf sm:flex-col sm:items-start sm:gap-2">
                        <ProductArt id={p.id} className="size-11 shrink-0" />
                        <span className="leading-tight">
                          <span className="block text-[0.95rem] font-extrabold text-ink">{p.name}</span>
                          <span className="block text-sm text-muted">{p.weight}</span>
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="flex items-center gap-3 text-sm font-extrabold text-forest">
                  <span className="grid size-7 place-items-center rounded-full bg-forest text-xs text-white">2</span>
                  Pasirink alergenus, kuriuos nori stebėti
                </legend>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {DEMO_ALLERGENS.map((a) => {
                    const on = selected.has(a.id);
                    return (
                      <label key={a.id} className="relative cursor-pointer">
                        <input type="checkbox" checked={on} onChange={() => toggle(a.id)} className="peer sr-only" />
                        <span
                          className={cn(
                            "inline-flex min-h-12 items-center gap-2.5 rounded-full border px-5 py-2.5 text-[0.95rem] font-bold transition-all duration-300 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-leaf",
                            on
                              ? "border-leaf bg-leaf text-white shadow-[0_10px_20px_-12px_rgb(23_105_74/0.9)]"
                              : "border-line bg-white text-ink hover:border-forest/30",
                          )}
                        >
                          <span className={cn("grid size-5 place-items-center rounded-full transition-colors", on ? "bg-white/25" : "border border-line")}>
                            {on && <Check className="size-3.5" strokeWidth={3.5} />}
                          </span>
                          {a.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <button
                type="button"
                onClick={() => setScanRun((n) => n + 1)}
                className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-white px-5 py-3 text-sm font-bold text-forest transition-all hover:-translate-y-0.5 hover:border-forest/50"
              >
                <RotateCcw className="size-4" />
                Skenuoti dar kartą
              </button>

              <div className="rounded-[1.125rem] border border-amber-line bg-amber-soft p-5 text-[0.95rem] leading-relaxed text-ink/85">
                <p className="font-extrabold text-amber">Pavyzdiniai duomenys</p>
                <p className="mt-1.5">
                  Čia rodomi fiktyvūs produktai ir iš anksto paruošti rezultatai, ne tikras nuskaitymas. Skanis negali savarankiškai
                  garantuoti, kad produktas tau tinka, ir negali atmesti kryžminės taršos. Visada patikrink originalią pakuotę.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="order-1 mx-auto w-full max-w-[22rem] lg:order-2 lg:w-[22.5rem]">
            <ScaledPhone width={DEMO_PHONE_W} height={DEMO_PHONE_H}>
              <DemoScreen product={product} selected={selected} result={result} scanning={scanning} />
            </ScaledPhone>
            <p className="mt-5 text-center text-sm text-muted">Iliustracinė demonstracija, ne tikra programėlės ekrano kopija.</p>
          </Reveal>
        </div>

        {/* Screen readers get the outcome as plain text whenever it changes. */}
        <p className="sr-only" role="status" aria-live="polite">
          {scanning ? "Skaitoma sudėtis" : `${product.name}. ${summary}`}
        </p>
      </div>
    </section>
  );
}
