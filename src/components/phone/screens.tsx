import { Check, ChevronLeft, Milk, MoreHorizontal, ScanLine, ShieldAlert } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { ScanCorners } from "@/components/ui/ScanCorners";
import { cn } from "@/lib/utils";

/*
 * The three illustrative app screens used across the site. They are drawn in
 * the app's own palette and wording, but they are NOT screenshots: every
 * place that shows them also says so.
 */

function AppBar({ title }: { title: string }) {
  return (
    <div className="flex h-11 items-center justify-between px-4">
      <ChevronLeft className="size-5 text-ink/70" strokeWidth={2.6} />
      <span className="text-[13px] font-extrabold tracking-tight text-ink">{title}</span>
      <MoreHorizontal className="size-5 text-ink/50" />
    </div>
  );
}

/* ------------------------------------------------------------ allergens */

const ALLERGEN_OPTIONS: Array<{ label: string; on: boolean }> = [
  { label: "Pienas", on: true },
  { label: "Kiaušiniai", on: false },
  { label: "Glitimas", on: true },
  { label: "Žemės riešutai", on: true },
  { label: "Riešutai", on: false },
  { label: "Soja", on: false },
  { label: "Žuvis", on: false },
  { label: "Sezamas", on: false },
  { label: "Garstyčios", on: false },
  { label: "Salierai", on: false },
];

export function ScreenAllergens({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full flex-col bg-[#f7f5ef] px-5 pb-8", className)}>
      <div className="mt-3 flex items-center gap-2">
        <LogoMark className="h-4 w-auto text-forest" />
        <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-forest">Skanis</span>
      </div>
      <h3 className="mt-5 text-[25px] font-extrabold leading-[1.05] tracking-[-0.04em] text-ink">Ką nori stebėti?</h3>
      <p className="mt-2 text-[13px] leading-snug text-muted">Pasirink alergenus, į kuriuos nori atkreipti dėmesį. Pakeisti galėsi bet kada.</p>

      <ul className="mt-5 grid grid-cols-2 gap-2">
        {ALLERGEN_OPTIONS.map((o) => (
          <li
            key={o.label}
            className={cn(
              "flex items-center gap-2 rounded-2xl border px-3 py-[11px] text-[12.5px] font-bold",
              o.on ? "border-leaf bg-leaf text-white shadow-[0_8px_16px_-10px_rgb(23_105_74/0.8)]" : "border-line bg-white text-ink",
            )}
          >
            <span className={cn("grid size-[18px] shrink-0 place-items-center rounded-full", o.on ? "bg-white/25" : "border border-line")}>
              {o.on && <Check className="size-3" strokeWidth={3.5} />}
            </span>
            <span className="leading-tight">{o.label}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <div className="rounded-full bg-forest py-3.5 text-center text-[14px] font-extrabold text-white">Tęsti</div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- scan */

export function ScreenScan({ className, animated = true }: { className?: string; animated?: boolean }) {
  return (
    <div className={cn("flex h-full flex-col bg-[#f7f5ef] pb-8", className)}>
      <AppBar title="Nuskenuok etiketę" />
      <div className="relative mx-4 mt-1 flex-1 overflow-hidden rounded-[1.7rem] bg-[#1b2924]">
        {/* blurred shelf behind the label */}
        <span aria-hidden="true" className="absolute -left-10 top-8 size-40 rounded-full bg-[#9a3b2a]/70 blur-2xl" />
        <span aria-hidden="true" className="absolute -right-12 bottom-4 size-44 rounded-full bg-[#3f6b50]/60 blur-2xl" />
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40" />

        {/* the label */}
        <div className="absolute inset-x-5 top-[17%] -rotate-[1.5deg] rounded-xl bg-[#f6efe0] px-3.5 py-3.5 shadow-[0_18px_30px_-12px_rgb(0_0_0/0.6)]">
          <p className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#6b5b3a]">Avižiniai sausainiai</p>
          <p className="mt-2 text-[10px] font-bold uppercase text-[#3b3426]">Sudėtis</p>
          <p className="mt-1 text-[9.5px] leading-[1.45] text-[#4a4232]">
            avižų dribsniai (38 %), cukrus, kviečių miltai, augalinis aliejus, sviestas, pieno milteliai, kepimo milteliai
            (amonio karbonatas), druska, vanilės aromatas.
          </p>
          <p className="mt-2 text-[8px] leading-snug text-[#6b5b3a]">Laikyti sausoje vietoje. Geriausias iki: žr. dugne.</p>

          {animated && (
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-10 animate-scan motion-reduce:hidden"
              style={{ ["--scan-distance" as string]: "128px" }}
            >
              <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-mint shadow-[0_0_18px_6px_rgb(159_223_196/0.65)]" />
              <span className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-mint/25" />
            </span>
          )}
        </div>
        <div className="absolute inset-x-4 top-[11%] bottom-[33%] text-mint">
          <ScanCorners inset="0px" size="1.6rem" thickness={3} />
        </div>

        <p className="absolute inset-x-0 bottom-4 text-center">
          <span className="inline-block rounded-full bg-black/45 px-3.5 py-2 text-[11px] font-bold text-white backdrop-blur-md">
            Nukreipk į ingredientų sąrašą
          </span>
        </p>
      </div>
      <div className="mt-4 flex items-center justify-center">
        <span className="grid size-[58px] place-items-center rounded-full border-[3px] border-forest/25">
          <span className="grid size-11 place-items-center rounded-full bg-forest text-white">
            <ScanLine className="size-5" strokeWidth={2.5} />
          </span>
        </span>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- result */

export function ScreenResult({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full flex-col bg-[#f7f5ef] px-4 pb-8", className)}>
      <AppBar title="Rezultatas" />

      <div className="mt-1 flex items-center gap-3 px-1">
        <span className="grid size-11 place-items-center rounded-2xl bg-white shadow-[0_1px_0_rgb(0_0_0/0.04),0_6px_14px_-8px_rgb(20_63_57/0.4)]">
          <LogoMark className="h-5 w-auto text-forest" />
        </span>
        <div className="leading-tight">
          <p className="text-[15px] font-extrabold tracking-tight text-ink">Avižiniai sausainiai</p>
          <p className="text-[12px] text-muted">200 g</p>
        </div>
      </div>

      <div className="mt-4 rounded-[1.4rem] border border-danger-line bg-danger-soft p-4">
        <div className="flex items-center gap-3">
          <span className="relative grid size-11 shrink-0 place-items-center rounded-full bg-danger text-white">
            <ShieldAlert className="size-5" strokeWidth={2.6} />
            <span aria-hidden="true" className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-danger motion-reduce:hidden" />
          </span>
          <div className="leading-tight">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-danger">Rastas neatitikimas</p>
            <p className="mt-0.5 text-[15.5px] font-extrabold tracking-tight text-ink">Aptiktas pasirinktas alergenas</p>
          </div>
        </div>

        <div className="mt-3.5 flex items-center gap-2 rounded-xl bg-white/80 p-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-danger px-2.5 py-1 text-[11px] font-extrabold tracking-[0.08em] text-white">
            <Milk className="size-3.5" strokeWidth={2.6} />
            PIENAS
          </span>
          <span className="text-[11px] text-muted">pagal tavo pasirinkimus</span>
        </div>
        <p className="mt-2.5 text-[12.5px] leading-snug text-ink/80">Sudėtyje aptiktas pienas arba jo sudedamosios dalys.</p>
      </div>

      <div className="mt-3 rounded-[1.4rem] border border-line bg-white p-4">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">Nuskaityta sudėtis</p>
        <p className="mt-2 text-[12.5px] leading-[1.55] text-ink/85">
          avižų dribsniai (38 %), cukrus, kviečių miltai, augalinis aliejus, sviestas, <span className="mark-hit">pieno milteliai</span>, kepimo
          milteliai (amonio karbonatas), druska, vanilės aromatas.
        </p>
      </div>

      <p className="mt-3 px-1 text-[11px] leading-snug text-muted">Visada patikrink originalią pakuotę.</p>

      <div className="mt-auto flex gap-2">
        <div className="flex-1 rounded-full bg-forest py-3 text-center text-[13px] font-extrabold text-white">Skenuoti dar kartą</div>
      </div>
    </div>
  );
}
