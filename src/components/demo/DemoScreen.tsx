"use client";

import { Check, ChevronLeft, Info, MoreHorizontal, ShieldAlert, ShieldCheck, TriangleAlert } from "lucide-react";
import { m } from "motion/react";
import { LogoMark } from "@/components/brand/Logo";
import { ScanCorners } from "@/components/ui/ScanCorners";
import { cn } from "@/lib/utils";
import { ProductArt } from "./ProductArt";
import {
  DEMO_ALLERGENS,
  isHighlighted,
  type AllergenId,
  type DemoProduct,
  type DemoResult,
} from "@/content/demo";

export const DEMO_PHONE_W = 340;
export const DEMO_PHONE_H = 740;

/** The app screen inside the demo phone: scanned label on top, result below. */
export function DemoScreen({
  product,
  selected,
  result,
  scanning,
}: {
  product: DemoProduct;
  selected: ReadonlySet<AllergenId>;
  result: DemoResult;
  scanning: boolean;
}) {
  const selectedLabels = DEMO_ALLERGENS.filter((a) => selected.has(a.id));

  return (
    <div className="flex h-full flex-col bg-[#f7f5ef] px-4 pb-7">
      <div className="flex h-10 items-center justify-between">
        <ChevronLeft className="size-5 text-ink/70" strokeWidth={2.6} />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sage px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-leaf">
          <LogoMark className="h-3 w-auto" />
          Pavyzdiniai duomenys
        </span>
        <MoreHorizontal className="size-5 text-ink/50" />
      </div>

      {/* what the visitor chose to watch */}
      <div className="mt-1 flex min-h-[26px] flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-bold text-muted">Stebi:</span>
        {selectedLabels.length === 0 ? (
          <span className="text-[11px] text-faint">nieko nepasirinkta</span>
        ) : (
          selectedLabels.map((a) => (
            <span key={a.id} className="inline-flex items-center gap-1 rounded-full bg-leaf px-2 py-[3px] text-[10.5px] font-bold text-white">
              <Check className="size-3" strokeWidth={3.5} />
              {a.label}
            </span>
          ))
        )}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span className="grid size-[46px] shrink-0 place-items-center rounded-2xl bg-white shadow-[0_6px_14px_-8px_rgb(20_63_57/0.4)]">
          <ProductArt id={product.id} className="size-9" />
        </span>
        <div className="leading-tight">
          <p className="text-[15px] font-extrabold tracking-tight text-ink">{product.name}</p>
          <p className="text-[12px] text-muted">{product.weight}</p>
        </div>
      </div>

      {/* the (fictional) label */}
      <div className="relative mt-3 overflow-hidden rounded-[1.25rem] border border-[#e9dfc9] bg-[#f6efe0] px-3.5 pb-3.5 pt-3">
        <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-[#6b5b3a]">Sudėtis</p>
        <p className="mt-1.5 text-[12px] leading-[1.6] text-[#3f3829]">
          {product.ingredients.map((seg, i) => (
            <span key={seg.text}>
              {!scanning && isHighlighted(seg, selected) ? <mark className="mark-hit">{seg.text}</mark> : seg.text}
              {i < product.ingredients.length - 1 ? ", " : "."}
            </span>
          ))}
          {product.mayContain && (
            <>
              {" "}
              {!scanning && product.mayContain.allergens.some((id) => selected.has(id)) ? (
                <mark className="mark-hit" data-kind="trace">
                  {product.mayContain.text}
                </mark>
              ) : (
                product.mayContain.text
              )}
            </>
          )}
        </p>
        {scanning && (
          <>
            <m.span
              aria-hidden="true"
              className="absolute inset-x-0 h-12 -translate-y-full"
              initial={{ top: "0%" }}
              animate={{ top: "118%" }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-mint shadow-[0_0_18px_6px_rgb(159_223_196/0.7)]" />
              <span className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-mint/30" />
            </m.span>
            <ScanCorners className="text-leaf" inset="5px" size="1.2rem" thickness={2.5} />
          </>
        )}
      </div>

      <ResultPanel result={result} scanning={scanning} />

      <p className="mt-auto pt-3 text-center text-[10.5px] leading-snug text-muted">
        Pavyzdys su fiktyviais duomenimis. Visada patikrink originalią pakuotę.
      </p>
    </div>
  );
}

const TONES = {
  found: {
    box: "border-danger-line bg-danger-soft",
    icon: "bg-danger text-white",
    label: "text-danger",
    chip: "bg-danger text-white",
    Icon: ShieldAlert,
  },
  trace: {
    box: "border-amber-line bg-amber-soft",
    icon: "bg-amber text-white",
    label: "text-amber",
    chip: "bg-amber text-white",
    Icon: TriangleAlert,
  },
  clear: {
    box: "border-[#cfe5d8] bg-sage",
    icon: "bg-leaf text-white",
    label: "text-leaf",
    chip: "bg-leaf text-white",
    Icon: ShieldCheck,
  },
  idle: {
    box: "border-line bg-white",
    icon: "bg-forest/10 text-forest",
    label: "text-muted",
    chip: "bg-forest text-white",
    Icon: Info,
  },
} as const;

function ResultPanel({ result, scanning }: { result: DemoResult; scanning: boolean }) {
  if (scanning) {
    return (
      <div className="mt-3 flex-1 rounded-[1.25rem] border border-line bg-white p-4" aria-hidden="true">
        <div className="flex items-center gap-3">
          <span className="size-10 animate-pulse rounded-full bg-sage" />
          <span className="flex-1 space-y-2">
            <span className="block h-2.5 w-2/3 animate-pulse rounded-full bg-sage" />
            <span className="block h-3 w-full animate-pulse rounded-full bg-sage" />
          </span>
        </div>
        <p className="mt-4 text-[12px] font-bold text-muted">Skaitoma sudėtis…</p>
      </div>
    );
  }

  const key = result.verdict;
  const tone = key === "found" ? TONES.found : key === "trace" ? TONES.trace : key === "clear" ? TONES.clear : TONES.idle;
  const { Icon } = tone;

  const title =
    key === "found"
      ? result.found.length > 1
        ? "Aptikti pasirinkti alergenai"
        : "Aptiktas pasirinktas alergenas"
      : key === "trace"
        ? "Galimi pėdsakai"
        : key === "clear"
          ? "Neaptikta pasirinktų alergenų"
          : "Pasirink bent vieną alergeną";
  const kicker =
    key === "found" ? "Rastas neatitikimas" : key === "trace" ? "Dėmesio" : key === "clear" ? "Pagal pateiktą sudėtį" : "Nieko nestebima";

  return (
    <m.div
      key={`${key}-${result.found.map((f) => f.allergen.id).join()}-${result.traces.map((t) => t.id).join()}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn("mt-3 rounded-[1.25rem] border p-3.5", tone.box)}
    >
      <div className="flex items-center gap-3">
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-full", tone.icon)}>
          <Icon className="size-[18px]" strokeWidth={2.6} />
        </span>
        <div className="leading-tight">
          <p className={cn("text-[10px] font-extrabold uppercase tracking-[0.12em]", tone.label)}>{kicker}</p>
          <p className="mt-0.5 text-[14.5px] font-extrabold tracking-tight text-ink">{title}</p>
        </div>
      </div>

      <div className="mt-3 space-y-2.5">
        {key === "found" &&
          result.found.map((f) => (
            <div key={f.allergen.id} className="rounded-xl bg-white/80 p-2.5">
              <span className={cn("inline-block rounded-full px-2.5 py-[3px] text-[10.5px] font-extrabold uppercase tracking-[0.08em]", TONES.found.chip)}>
                {f.allergen.label}
              </span>
              <p className="mt-1.5 text-[12px] leading-snug text-ink/85">{f.allergen.foundText}</p>
              <p className="mt-1 text-[11px] leading-snug text-muted">Etiketėje: {f.ingredients.join("; ")}</p>
            </div>
          ))}

        {(key === "found" || key === "trace") && result.traces.length > 0 && (
          <div className="rounded-xl bg-white/80 p-2.5">
            <span className={cn("inline-block rounded-full px-2.5 py-[3px] text-[10.5px] font-extrabold uppercase tracking-[0.08em]", TONES.trace.chip)}>
              Galimi pėdsakai
            </span>
            <p className="mt-1.5 text-[12px] leading-snug text-ink/85">
              Etiketėje nurodyta, kad gali būti: {result.traces.map((t) => t.genitive).join(", ")} pėdsakų.
            </p>
          </div>
        )}

        {key === "clear" && (
          <p className="text-[12.5px] leading-snug text-ink/85">Pasirinktų alergenų pateiktame ingredientų sąraše neaptikta.</p>
        )}
        {key === "none-selected" && (
          <p className="text-[12px] leading-snug text-muted">Skanis ieško tik tavo pasirinktų alergenų. Pažymėk bent vieną.</p>
        )}
      </div>
    </m.div>
  );
}
