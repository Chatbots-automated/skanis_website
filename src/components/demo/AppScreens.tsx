import type { ReactNode } from "react";
import { Camera, Check, ChevronDown, ChevronLeft, ChevronRight, Layers, X } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * The Skanis app's own screens, redrawn for the phone mock-ups on the site.
 * Layout, copy and colours follow the app (mobile/src/app/result.tsx,
 * components/ResultKit.tsx, components/CaptureViews.tsx): ivory page, the
 * green SKANIS wordmark, the verdict as a big word beside a round icon,
 * hairline cards with a verdict-coloured edge, green buttons at the bottom.
 * Everything is sized in `em`, so it scales with the phone; 1em ≈ 16pt in the app.
 */

export type Verdict = "matches" | "doesnt_match";

const TONE = {
  matches: { solid: "bg-brand", ink: "text-brand", mark: "bg-brand-soft text-brand", icon: Check, title: "Tinka" },
  doesnt_match: { solid: "bg-danger", ink: "text-danger", mark: "bg-danger-soft text-danger", icon: X, title: "Netinka" },
} as const;

/** The scan frame's four brackets, the app's one decorative motif. */
export function CornerMarks({ className, arm = "30%", thickness = "2px", radius = "0.3em" }: { className?: string; arm?: string; thickness?: string; radius?: string }) {
  const corners = [
    { top: 0, left: 0, borderTopWidth: thickness, borderLeftWidth: thickness, borderTopLeftRadius: radius },
    { top: 0, right: 0, borderTopWidth: thickness, borderRightWidth: thickness, borderTopRightRadius: radius },
    { bottom: 0, left: 0, borderBottomWidth: thickness, borderLeftWidth: thickness, borderBottomLeftRadius: radius },
    { bottom: 0, right: 0, borderBottomWidth: thickness, borderRightWidth: thickness, borderBottomRightRadius: radius },
  ];
  return (
    <span aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      {corners.map((style, i) => (
        <span key={i} className="absolute border-0 border-current" style={{ width: arm, height: arm, ...style }} />
      ))}
    </span>
  );
}

/** Back arrow, the letter-spaced SKANIS wordmark, and an empty slot that keeps it centred. */
export function AppHeader({ title }: { title?: string }) {
  return (
    <div className="flex items-center justify-between px-[4%] pb-[2%]">
      <ChevronLeft className="size-[1.6em] text-ink" strokeWidth={2.2} />
      {title ? (
        <span className="text-[1.1em] font-bold text-ink">{title}</span>
      ) : (
        <span className="text-[1.05em] font-extrabold tracking-[0.18em] text-brand">SKANIS</span>
      )}
      <span className="size-[1.6em]" />
    </div>
  );
}

/** The scanned product: its picture in green corner marks, the name, size and brand. */
export function ProductRow({ name, meta, art }: { name: string; meta: string; art: ReactNode }) {
  return (
    <div className="flex items-center gap-[1em]">
      <span className="relative shrink-0 p-[0.35em] text-brand">
        <span className="grid size-[4.6em] place-items-center overflow-hidden rounded-[0.5em] bg-white">
          <span className="block size-[85%]">{art}</span>
        </span>
        <CornerMarks arm="1em" thickness="2px" radius="0.3em" />
      </span>
      <span className="min-w-0">
        <span className="line-clamp-2 block text-[1.25em] font-extrabold leading-[1.2] tracking-[-0.02em] text-ink">{name}</span>
        <span className="mt-[0.2em] block text-[0.85em] text-muted">{meta}</span>
      </span>
    </div>
  );
}

/** "Rezultatas", then the round status icon beside the big word, then one line saying what was found. */
export function VerdictHeading({ verdict, summary }: { verdict: Verdict; summary: string }) {
  const tone = TONE[verdict];
  const Icon = tone.icon;
  return (
    <div>
      <p className="flex items-center gap-[0.5em] text-[0.8em] font-semibold text-muted">
        <span className="relative size-[0.7em]">
          <CornerMarks arm="45%" thickness="1.5px" radius="1px" />
        </span>
        Rezultatas
      </p>
      <div className="mt-[0.25em] flex items-center gap-[0.6em]">
        <span className={cn("grid size-[2.3em] shrink-0 place-items-center rounded-full text-white", tone.solid)}>
          <Icon className="size-[1.35em]" strokeWidth={3.2} />
        </span>
        <span className={cn("text-[2.15em] font-extrabold uppercase leading-none tracking-[0.01em]", tone.ink)}>{tone.title}</span>
      </div>
      <p className="mt-[0.45em] text-[1.05em] font-medium leading-[1.35] text-ink">{summary}</p>
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <p className="text-[1.1em] font-bold tracking-[-0.02em] text-ink">{children}</p>;
}

/** A green tick and a line of text. */
export function CheckBullet({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-[0.7em] text-[0.95em] leading-[1.4] text-ink">
      <Check className="mt-[0.1em] size-[1.15em] shrink-0 text-brand" strokeWidth={2.6} />
      <span>{children}</span>
    </p>
  );
}

/** The word on the label that made Skanis decide, marked in the verdict colour. */
export function Marked({ verdict, children }: { verdict: Verdict; children: ReactNode }) {
  return <mark className={cn("rounded-[0.2em] px-[0.1em] font-bold", TONE[verdict].mark)}>{children}</mark>;
}

/** Which filter matched and the label's own words: a hairline card with a verdict-coloured edge. */
export function ReasonPanel({ verdict, title, children }: { verdict: Verdict; title: string; children: ReactNode }) {
  return (
    <div className="flex overflow-hidden rounded-[1em] border border-line bg-white">
      <span className={cn("w-[0.25em] shrink-0", TONE[verdict].solid)} />
      <div className="min-w-0 flex-1 px-[0.75em] py-[0.6em]">
        <p className="text-[1em] font-bold tracking-[-0.01em] text-ink">{title}</p>
        <p className="text-[0.8em] text-muted">Aptikta:</p>
        <p className="line-clamp-2 text-[0.88em] leading-[1.45] text-ink">{children}</p>
      </div>
      <ChevronRight className="mr-[0.6em] size-[1.1em] shrink-0 self-center text-faint" />
    </div>
  );
}

/** "Kiti aptikti ingredientai": what else was found, folded and neutral (slate), clearly not part of the verdict. */
export function OtherFound({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-[0.7em] rounded-[1em] border border-slate-soft bg-slate-soft px-[0.8em] py-[0.55em]">
      <span className="grid size-[2em] shrink-0 place-items-center rounded-[0.6em] bg-white">
        <Layers className="size-[1.1em] text-slate" strokeWidth={2.1} />
      </span>
      <span className="flex-1 text-[0.92em] font-semibold text-ink">Kiti aptikti ingredientai ({count})</span>
      <ChevronDown className="size-[1.1em] text-slate" />
    </div>
  );
}

export function Footnote() {
  return <p className="text-center text-[0.75em] text-faint">Visada patikrinkite originalią produkto pakuotę.</p>;
}

/** The two buttons pinned under every result. */
export function ResultButtons() {
  return (
    <div className="mt-auto space-y-[0.5em] px-[6%] pb-[8%] pt-[4%]">
      <div className="flex h-[3em] items-center justify-center gap-[0.5em] rounded-[1em] bg-brand text-[0.95em] font-bold text-white">
        <Camera className="size-[1.2em]" />
        Skenuoti kitą produktą
      </div>
      <div className="flex h-[3em] items-center justify-center rounded-[1em] border-[1.5px] border-brand text-[0.95em] font-bold text-brand">
        Daugiau informacijos
      </div>
    </div>
  );
}

/**
 * The camera while the photo is read: the picture dimmed outside the frame, mint brackets around the label,
 * a light line sweeping down, and the reading steps underneath.
 */
export function CameraScreen({ label, backdrop }: { label: ReactNode; backdrop?: ReactNode }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#0d1712] text-white">
      {backdrop}
      <p className="relative z-10 pt-[16%] text-center text-[1.05em] font-bold">Nufotografuokite sudėtį</p>
      {/* the frame hugs the label, so there's no empty paper inside it */}
      <div className="relative z-10 mx-[9%] mt-[10%] p-[6%] text-mint">
        <div className="max-h-[12.5em] overflow-hidden [mask-image:linear-gradient(#000_70%,transparent)] rotate-[-2deg] rounded-[0.6em] bg-white p-[6%] text-[0.82em] leading-[1.5] text-ink/80 shadow-[0_8px_24px_-8px_rgb(0_0_0/0.5)]">
          {label}
        </div>
        <CornerMarks arm="16%" thickness="3px" radius="0.5em" />
        <span className="absolute inset-x-[4%] h-[2px] animate-scan rounded-full bg-mint shadow-[0_0_14px_4px_rgb(159_223_196/0.6)]" />
      </div>
      <ol className="relative z-10 mx-auto mt-[9%] space-y-[0.55em] text-[0.88em]">
        {[
          ["Ruošiama nuotrauka", "done"],
          ["Skaitoma etiketė", "active"],
          ["Tikriname sudėtį ir filtrus", "todo"],
        ].map(([text, state]) => (
          <li key={text} className={cn("flex items-center gap-[0.6em]", state === "todo" ? "text-white/45" : "text-white")}>
            <span
              className={cn(
                "grid size-[1.2em] place-items-center rounded-full border-[1.5px]",
                state === "done" ? "border-mint bg-mint text-brand-deep" : state === "active" ? "border-mint" : "border-white/30",
              )}
            >
              {state === "done" && <Check className="size-[0.75em]" strokeWidth={3.4} />}
              {state === "active" && <span className="size-[0.45em] animate-pulse rounded-full bg-mint" />}
            </span>
            {text}
          </li>
        ))}
      </ol>
      {/* the shutter, as on the camera screen */}
      <div className="relative z-10 mt-auto flex justify-center pb-[10%]">
        <span className="grid size-[4em] place-items-center rounded-full border-[3px] border-white/85">
          <span className="size-[3.1em] rounded-full bg-white/90" />
        </span>
      </div>
    </div>
  );
}
