"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useInView, useScroll, useSpring, useTransform } from "motion/react";
import { Check, X } from "lucide-react";
import { ProductArt } from "@/components/demo/ProductArt";
import { AppBar, Phone } from "@/components/ui/Phone";
import { DEFAULT_FILTERS, FILTERS, findHits, PRODUCTS, type FilterId, type Part, type Product, type ProductId } from "@/content/products";
import { cn } from "@/lib/utils";

/*
 * A playable taste of the app right under the headline: pick a product, flip
 * your own filters, and the phone re-scans and gives its verdict, the way
 * Skanis does. On scroll the phone rises from a tilt and the brand's scan
 * frame locks onto it.
 */

const SCAN_MS = 1400;
const ease = [0.22, 1, 0.36, 1] as const;

export function HeroDemo() {
  const [productId, setProductId] = useState<ProductId>("cola");
  const [on, setOn] = useState<Set<FilterId>>(() => new Set(DEFAULT_FILTERS));
  const [scanning, setScanning] = useState(true);
  const [run, setRun] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(stage, { once: true, amount: 0.25 });

  // every change (and the first time the phone is seen) runs a short scan
  useEffect(() => {
    if (!inView) return;
    const id = setTimeout(() => setScanning(false), SCAN_MS);
    return () => clearTimeout(id);
  }, [run, inView]);

  const rescan = () => {
    setScanning(true);
    setRun((r) => r + 1);
  };
  const toggle = (id: FilterId) => {
    setOn((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    rescan();
  };
  const pick = (id: ProductId) => {
    if (id === productId) return;
    setProductId(id);
    rescan();
  };

  const product = PRODUCTS.find((p) => p.id === productId)!;
  const hits = findHits(product, on);

  // scroll: the phone rises out of a tilt and the frame locks on
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start end", "start 0.35"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 22, mass: 0.4 });
  const rotateX = useTransform(p, [0, 1], [26, 0]);
  const scale = useTransform(p, [0, 1], [0.9, 1]);
  const frameScale = useTransform(p, [0, 1], [1.2, 1]);
  const frameOpacity = useTransform(p, [0, 0.6, 1], [0, 0.4, 1]);
  const leftX = useTransform(p, [0, 1], [-60, 0]);
  const rightX = useTransform(p, [0, 1], [60, 0]);
  const cardRotate = useTransform(p, [0, 1], [22, 6]);
  const cardRotateNeg = useTransform(cardRotate, (v) => -v);

  return (
    <div ref={stage} className="relative mx-auto mt-12 w-full max-w-6xl text-left sm:mt-16">
      {/* product picker (phones and tablets) */}
      <ProductSegments value={productId} onPick={pick} className="mx-auto mb-10 max-w-sm sm:mb-12 lg:hidden" />

      <div className="relative grid items-center [perspective:1600px] lg:grid-cols-[1fr_auto_1fr] lg:gap-12">
        {/* filters card */}
        <m.div style={{ x: leftX, rotateY: cardRotate }} className="hidden justify-self-end lg:block">
          <Card title="Tavo filtrai" sub="Pabandyk: įjunk ar išjunk.">
            <ul className="-mx-3 mt-3 space-y-0.5">
              {FILTERS.map((f) => (
                <li key={f.id}>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on.has(f.id)}
                    onClick={() => toggle(f.id)}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2 text-left transition-colors hover:bg-ink/[0.03]"
                  >
                    <span>
                      <span className="block font-bold text-ink">{f.label}</span>
                      <span className="block text-xs text-faint">{f.hint}</span>
                    </span>
                    <Switch on={on.has(f.id)} />
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </m.div>

        {/* phone, with the scan frame locking onto it */}
        <m.div style={{ rotateX, scale }} className="relative mx-auto origin-bottom">
          <m.div aria-hidden="true" style={{ scale: frameScale, opacity: frameOpacity }} className="pointer-events-none absolute -inset-6 sm:-inset-10">
            {[
              "left-0 top-0 border-l-4 border-t-4 rounded-tl-[1.4rem]",
              "right-0 top-0 border-r-4 border-t-4 rounded-tr-[1.4rem]",
              "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-[1.4rem]",
              "bottom-0 right-0 border-b-4 border-r-4 rounded-br-[1.4rem]",
            ].map((c) => (
              <span key={c} className={cn("absolute size-11 border-ink sm:size-16", c)} />
            ))}
          </m.div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-[-25%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(163_232_208/0.65),transparent)]" />
          <Phone className="h-[min(60svh,560px)] min-h-[25rem] sm:h-[min(64svh,600px)]">
            {/* the live region tells screen-reader users what the phone concluded */}
            <p className="sr-only" aria-live="polite">
              {scanning ? "Skaitoma sudėtis…" : hits.length ? `Netinka: ${hits.map((h) => h.text).join(", ")}` : "Tinka pagal tavo filtrus"}
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={`${scanning ? "scan" : "result"}-${run}`}
                aria-hidden="true"
                initial={scanning ? { opacity: 0 } : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: scanning ? 0.2 : 0.45, ease }}
                className="absolute inset-0 flex flex-col pt-[14%] text-[clamp(9.5px,1.6svh,12.5px)]"
              >
                {scanning ? <ScanScreen product={product} /> : <ResultScreen product={product} hits={hits} anyFilter={on.size > 0} />}
              </m.div>
            </AnimatePresence>
          </Phone>
        </m.div>

        {/* product + its label */}
        <m.div style={{ x: rightX, rotateY: cardRotateNeg }} className="hidden justify-self-start lg:block">
          <Card title="Produktas" sub="Pasirink, ką skenuoti.">
            <ProductPicker value={productId} onPick={pick} className="mt-4" compact />
            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.14em] text-ink/40">Sudėtis</p>
            <Label parts={product.parts} on={on} className="mt-2 text-[0.9rem] leading-[1.7] text-ink/75" />
          </Card>
        </m.div>
      </div>

      {/* filters as chips (phones and tablets) */}
      <div className="mt-10 sm:mt-12 lg:hidden">
        <p className="text-center text-xs font-bold uppercase tracking-[0.12em] text-ink/40">Ko vengi?</p>
        {/* one swipeable row on phones, wrapped and centred on tablets */}
        <ul className="no-scrollbar -mx-5 mt-3 flex snap-x gap-2 overflow-x-auto px-5 [mask-image:linear-gradient(90deg,transparent,#000_1.25rem,#000_calc(100%-1.25rem),transparent)] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:[mask-image:none]">
          {FILTERS.map((f) => (
            <li key={f.id} className="shrink-0 snap-start">
              <button
                type="button"
                aria-pressed={on.has(f.id)}
                onClick={() => toggle(f.id)}
                className={cn(
                  "inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-sm font-bold transition-colors active:scale-95",
                  on.has(f.id) ? "bg-grape text-white" : "bg-ink/[0.05] text-ink/70",
                )}
              >
                {on.has(f.id) && <Check className="size-3.5" strokeWidth={3} />}
                {f.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p className="mx-auto mt-8 max-w-xs text-center text-[0.7rem] leading-relaxed text-faint sm:max-w-none sm:text-xs lg:mt-16">
        Iliustracija. Produktai ir prekių ženklai išgalvoti, sudėtis – kaip tipinėse šių produktų etiketėse.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------- controls */

function Card({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="w-[19rem] rounded-[1.75rem] bg-white p-6 shadow-lift ring-1 ring-ink/5">
      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/40">{title}</p>
      <p className="mt-1 text-sm text-muted">{sub}</p>
      {children}
    </div>
  );
}

function Switch({ on }: { on: boolean }) {
  return (
    <span aria-hidden="true" className={cn("relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300", on ? "bg-grape" : "bg-ink/15")}>
      <span className={cn("absolute top-1 size-5 rounded-full bg-white shadow transition-[left] duration-300 ease-out-soft", on ? "left-6" : "left-1")} />
    </span>
  );
}

function ProductPicker({
  value,
  onPick,
  className,
  compact = false,
}: {
  value: ProductId;
  onPick: (id: ProductId) => void;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label="Produktas" className={cn("grid grid-cols-3 gap-2", className)}>
      {PRODUCTS.map((p) => (
        <button
          key={p.id}
          type="button"
          role="radio"
          aria-checked={p.id === value}
          aria-label={`${p.brand} ${p.name}`}
          onClick={() => onPick(p.id)}
          className={cn(
            "flex flex-col items-center gap-1.5 rounded-2xl px-1 pb-2 pt-3 transition-[background-color,box-shadow,transform] active:scale-95",
            p.id === value ? "bg-mint-soft shadow-[inset_0_0_0_2px_var(--color-ink)]" : "bg-ink/[0.03] hover:bg-ink/[0.06]",
          )}
        >
          <span className={cn("block w-full", compact ? "h-14" : "h-16")}>
            <ProductArt id={p.id} />
          </span>
          <span className="line-clamp-1 text-center text-xs font-bold text-ink">{SHORT[p.id]}</span>
        </button>
      ))}
    </div>
  );
}

/** Phones: the products as one slim segmented switch. */
function ProductSegments({ value, onPick, className }: { value: ProductId; onPick: (id: ProductId) => void; className?: string }) {
  return (
    <div role="radiogroup" aria-label="Produktas" className={cn("grid grid-cols-3 gap-1 rounded-full bg-ink/[0.05] p-1", className)}>
      {PRODUCTS.map((p) => (
        <button
          key={p.id}
          type="button"
          role="radio"
          aria-checked={p.id === value}
          aria-label={`${p.brand} ${p.name}`}
          onClick={() => onPick(p.id)}
          className={cn(
            "flex h-10 items-center justify-center gap-1.5 rounded-full text-[0.82rem] font-bold transition-[background-color,box-shadow,color]",
            p.id === value ? "bg-white text-ink shadow-[0_1px_3px_rgb(17_17_17/0.12)]" : "text-ink/55",
          )}
        >
          <span className="block h-6 w-5 shrink-0">
            <ProductArt id={p.id} className="drop-shadow-none" />
          </span>
          {SHORT[p.id]}
        </button>
      ))}
    </div>
  );
}

const SHORT: Record<ProductId, string> = { cola: "Gėrimas", traskuciai: "Traškučiai", sausainiai: "Sausainiai" };

function Label({ parts, on, className }: { parts: Part[]; on: ReadonlySet<FilterId>; className?: string }) {
  return (
    <p className={className}>
      {parts.map((part, i) =>
        part.filter && on.has(part.filter) ? (
          <mark key={i} className="rounded-md bg-grape-soft px-1 font-bold text-grape">
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </p>
  );
}

/* --------------------------------------------------------------- screens */

function ScanScreen({ product }: { product: Product }) {
  return (
    <>
      <AppBar title="Nufotografuokite sudėtį" />
      <div className="relative mx-[5%] flex-1 overflow-hidden rounded-[1.6em] bg-[#1d1d1f]">
        {/* the pack, out of focus behind the label */}
        <div className="absolute inset-x-0 top-[6%] flex h-[40%] justify-center opacity-60 blur-[2px]">
          <ProductArt id={product.id} />
        </div>
        <div className="absolute inset-x-[8%] top-[34%] rotate-[-2deg] rounded-[0.8em] bg-white p-[6%] text-[0.85em] leading-[1.5] text-ink/80 shadow-lift">
          <span className="font-bold">Sudėtis: </span>
          {product.parts.map((p) => p.text).join("")}
        </div>
        {[
          "left-[5%] top-[30%] border-l-[3px] border-t-[3px] rounded-tl-xl",
          "right-[5%] top-[30%] border-r-[3px] border-t-[3px] rounded-tr-xl",
          "left-[5%] bottom-[12%] border-b-[3px] border-l-[3px] rounded-bl-xl",
          "right-[5%] bottom-[12%] border-b-[3px] border-r-[3px] rounded-br-xl",
        ].map((c) => (
          <span key={c} className={cn("absolute size-[13%] border-mint", c)} />
        ))}
        <span className="absolute inset-x-[7%] h-[2px] animate-scan rounded-full bg-mint shadow-[0_0_14px_4px_rgb(163_232_208/0.7)]" />
        <p className="absolute inset-x-0 bottom-[3.5%] text-center text-[0.9em] font-semibold text-white/80">Skaitomi ingredientai…</p>
      </div>
      <div className="flex justify-center py-[6%]">
        <span className="grid size-[3.4em] place-items-center rounded-full border-[3px] border-ink/15">
          <span className="size-[2.5em] rounded-full bg-ink" />
        </span>
      </div>
    </>
  );
}

function ResultScreen({ product, hits, anyFilter }: { product: Product; hits: Part[]; anyFilter: boolean }) {
  const fits = hits.length === 0;
  return (
    <>
      <AppBar title="Rezultatas" />
      <div className="mx-[6%] flex items-center gap-[0.8em] rounded-[1.2em] bg-ink/[0.03] p-[3.5%]">
        <span className="grid h-[3.4em] w-[3.4em] shrink-0 place-items-center rounded-[0.8em] bg-white">
          <span className="block h-[2.9em] w-[2.9em]">
            <ProductArt id={product.id} className="drop-shadow-none" />
          </span>
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block text-[0.8em] font-bold text-ink/50">{product.brand}</span>
          <span className="line-clamp-2 block text-[1em] font-extrabold text-ink">{product.name}</span>
        </span>
      </div>
      <div className={cn("mx-[6%] mt-[4%] flex items-center gap-[0.9em] rounded-[1.4em] p-[5.5%]", fits ? "bg-mint text-ink" : "bg-grape text-white")}>
        <span className={cn("grid size-[2.9em] shrink-0 place-items-center rounded-full", fits ? "bg-ink text-mint" : "bg-white/15 text-white")}>
          {fits ? <Check className="size-[1.5em]" strokeWidth={3} /> : <X className="size-[1.5em]" strokeWidth={3} />}
        </span>
        <span>
          <span className="block text-[2em] font-extrabold leading-none tracking-tight">{fits ? "Tinka" : "Netinka"}</span>
          <span className={cn("mt-[0.3em] block text-[0.92em]", fits ? "text-ink/70" : "text-white/75")}>pagal tavo filtrus</span>
        </span>
      </div>

      <p className="mx-[6%] mt-[6%] text-[0.82em] font-extrabold uppercase tracking-[0.12em] text-ink/45">{fits ? "Kodėl tinka?" : "Aptikta"}</p>
      <ul className="mx-[6%] mt-[3%] space-y-[0.45em]">
        {fits ? (
          <li className="flex items-center gap-[0.6em] rounded-[0.9em] bg-mint-soft px-[0.9em] py-[0.8em] text-[1em] font-semibold text-ink">
            <Check className="size-[1.1em] shrink-0" strokeWidth={3} />
            {anyFilter ? "Nerasta nieko, ko pasirinkai vengti" : "Nepasirinkai jokių filtrų"}
          </li>
        ) : (
          hits.map((h) => (
            <li key={h.text} className="flex items-center justify-between gap-2 rounded-[0.9em] border border-line px-[0.9em] py-[0.55em]">
              <span className="min-w-0">
                <span className="block truncate text-[1em] font-extrabold text-ink">{h.text}</span>
                <span className="text-[0.82em] text-muted">{h.kind}</span>
              </span>
              <span className="shrink-0 rounded-full bg-grape-soft px-[0.7em] py-[0.25em] text-[0.8em] font-bold text-grape">Vengti</span>
            </li>
          ))
        )}
      </ul>

      <div className="mx-[6%] mb-[8%] mt-auto rounded-full bg-ink py-[0.85em] text-center text-[1em] font-extrabold text-white">
        Skenuoti kitą produktą
      </div>
    </>
  );
}
