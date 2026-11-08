"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useInView, useScroll, useSpring, useTransform } from "motion/react";
import { Check } from "lucide-react";
import { ProductArt } from "@/components/demo/ProductArt";
import { Phone } from "@/components/ui/Phone";
import { AppHeader, CameraScreen, CheckBullet, Footnote, Marked, OtherFound, ProductRow, ReasonPanel, ResultButtons, SectionTitle, VerdictHeading } from "@/components/demo/AppScreens";
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
              <span key={c} className={cn("absolute size-11 border-brand sm:size-16", c)} />
            ))}
          </m.div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-[-25%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(159_223_196/0.65),transparent)]" />
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
                className="absolute inset-0 flex flex-col pt-[16%] text-[4.75cqw]"
              >
                {scanning ? <ScanScreen product={product} /> : <ResultScreen product={product} hits={hits} on={on} />}
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
                  on.has(f.id) ? "bg-brand text-white" : "bg-ink/[0.05] text-ink/70",
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
    <span aria-hidden="true" className={cn("relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300", on ? "bg-brand" : "bg-ink/15")}>
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
            p.id === value ? "bg-brand-soft shadow-[inset_0_0_0_2px_var(--color-brand)]" : "bg-ink/[0.03] hover:bg-ink/[0.06]",
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
            p.id === value ? "bg-white text-ink shadow-[0_1px_3px_rgb(22_34_27/0.12)]" : "text-ink/55",
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
          <mark key={i} className="rounded-md bg-danger-soft px-1 font-bold text-danger">
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
    <CameraScreen
      label={
        <>
          <span className="font-bold">Sudėtis: </span>
          {product.parts.map((p) => p.text).join("")}
        </>
      }
      backdrop={
        // the pack, out of focus behind the label
        <div className="absolute inset-x-0 top-[8%] flex h-[46%] justify-center opacity-45 blur-[3px]">
          <ProductArt id={product.id} />
        </div>
      }
    />
  );
}

/** "Aptiktas 1 jūsų filtras" / "Aptikti 2 jūsų filtrai" / "Aptikta 10 jūsų filtrų", as the app says it. */
function filtersFound(n: number) {
  if (n % 10 === 1 && n % 100 !== 11) return `Aptiktas ${n} jūsų filtras`;
  if (n % 10 === 0 || (n % 100 >= 11 && n % 100 <= 19)) return `Aptikta ${n} jūsų filtrų`;
  return `Aptikti ${n} jūsų filtrai`;
}

const ADDITIVE_FILTERS: ReadonlySet<FilterId> = new Set(["saldikliai", "dazikliai", "stiprikliai"]);

/** Why it fits, in the app's words for the kinds of filters that are on. */
function fitReasons(on: ReadonlySet<FilterId>) {
  const ids = [...on];
  const lines: string[] = [];
  if (ids.some((id) => ADDITIVE_FILTERS.has(id))) lines.push("Nerasta jūsų pasirinktų E priedų");
  if (ids.some((id) => !ADDITIVE_FILTERS.has(id))) lines.push("Atitinka mitybos tipo, gyvenimo būdo ir kitų filtrų reikalavimus");
  if (lines.length === 0) lines.push("Nepasirinkote jokių filtrų");
  return lines;
}

/** The last couple of words before a hit, so the quote reads like the label: „…saldikliai: aspartamas“. */
function leadIn(parts: Part[], hit: Part) {
  const before = parts[parts.indexOf(hit) - 1]?.text ?? "";
  const words = before.replace(/^[\s,;.]+/, "").split(/\s+/).filter(Boolean);
  const tail = words.slice(-2).join(" ");
  return tail ? `${words.length > 2 ? "…" : ""}${tail} ` : "";
}

function ResultScreen({ product, hits, on }: { product: Product; hits: Part[]; on: ReadonlySet<FilterId> }) {
  const verdict = hits.length === 0 ? "matches" : "doesnt_match";
  const groups = FILTERS.filter((f) => hits.some((h) => h.filter === f.id)).map((f) => ({ filter: f, hits: hits.filter((h) => h.filter === f.id) }));
  const shown = groups.slice(0, 2);
  // label words that other filters would catch: listed apart, as the app does
  const others = new Set(product.parts.filter((p) => p.filter && !on.has(p.filter)).map((p) => p.text)).size;
  return (
    <>
      <AppHeader />
      <div className="flex flex-col gap-[1.25em] px-[6%] pt-[3%]">
        <ProductRow name={`${product.brand} ${product.name}`} meta={product.size} art={<ProductArt id={product.id} className="drop-shadow-none" />} />
        <VerdictHeading verdict={verdict} summary={verdict === "matches" ? "Nerasta nieko, ko pasirinkote vengti" : filtersFound(groups.length)} />
        <div className="space-y-[0.6em]">
          <SectionTitle>{verdict === "matches" ? "Kodėl tinka?" : "Kodėl netinka?"}</SectionTitle>
          {verdict === "matches"
            ? fitReasons(on).map((line) => <CheckBullet key={line}>{line}</CheckBullet>)
            : shown.map(({ filter, hits: found }) => (
                <ReasonPanel key={filter.id} verdict={verdict} title={filter.label}>
                  {found.map((h, i) => (
                    <span key={h.text}>
                      {i > 0 && " "}„{leadIn(product.parts, h)}
                      <Marked verdict={verdict}>{h.text}</Marked>“
                    </span>
                  ))}
                </ReasonPanel>
              ))}
          {groups.length > shown.length && <p className="text-[0.85em] font-semibold text-brand">+{groups.length - shown.length} kiti</p>}
        </div>
        {others > 0 && <OtherFound count={others} />}
        <Footnote />
      </div>
      <ResultButtons />
    </>
  );
}
