import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import { LEGAL, LEGAL_UPDATED } from "@/lib/site";

/** A value that must come from the business owner. Renders highlighted until it is configured. */
export function Placeholder({ value, label }: { value?: string; label: string }) {
  if (value) return <>{value}</>;
  return (
    <span className="placeholder-field" title="Šį lauką reikia užpildyti prieš paleidžiant svetainę (žr. README)">
      [{label} – užpildyti prieš publikuojant]
    </span>
  );
}

export const legalMissing = !LEGAL.name || !LEGAL.code || !LEGAL.address || !LEGAL.privacyEmail;

export type LegalSection = { id: string; title: string; body: ReactNode };

export function LegalPage({
  title,
  lead,
  summary,
  sections,
}: {
  title: string;
  lead: string;
  summary?: { title: string; items: string[] };
  sections: LegalSection[];
}) {
  return (
    <article className="pb-24 pt-28 sm:pt-32 lg:pb-32 lg:pt-40">
      <div className="container-x">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-leaf transition-colors hover:text-forest">
          <ArrowLeft className="size-4" />
          Į pradžią
        </Link>

        <header className="mt-8 max-w-3xl">
          <p className="eyebrow">Teisinė informacija</p>
          <h1 className="mt-4 text-[clamp(2.3rem,5vw,4rem)] text-forest">{title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">{lead}</p>
          <p className="mt-4 text-sm text-faint">Atnaujinta: {LEGAL_UPDATED}</p>
        </header>

        {legalMissing && (
          <div role="note" className="mt-8 flex max-w-3xl gap-3 rounded-2xl border border-amber-line bg-amber-soft p-5 text-sm leading-relaxed text-ink/85">
            <TriangleAlert className="mt-0.5 size-5 shrink-0 text-amber" />
            <p>
              <strong>Šis dokumentas dar nebaigtas.</strong> Geltonai pažymėti laukai (įmonės duomenys, kontaktai) turi būti užpildyti, o tekstą
              turėtų peržiūrėti teisininkas prieš paleidžiant svetainę.
            </p>
          </div>
        )}

        <div className="mt-14 grid gap-12 lg:grid-cols-[15rem_1fr] lg:gap-20">
          <nav aria-label="Dokumento turinys" className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-faint">Turinys</p>
              <ul className="mt-4 space-y-2.5 border-l border-line">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="-ml-px block border-l border-transparent pl-4 text-sm leading-snug text-muted transition-colors hover:border-forest hover:text-forest">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="max-w-3xl">
            {summary && (
              <section aria-labelledby="legal-summary" className="mb-14 rounded-[var(--radius-card)] bg-sage p-7 sm:p-9">
                <h2 id="legal-summary" className="text-[1.35rem] text-forest">
                  {summary.title}
                </h2>
                <ul className="mt-5 space-y-3">
                  {summary.items.map((t) => (
                    <li key={t} className="flex gap-3 leading-relaxed text-ink/85">
                      <span aria-hidden="true" className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-leaf" />
                      {t}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="space-y-14">
              {sections.map((s) => (
                <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`}>
                  <h2 id={`${s.id}-title`} className="text-[1.5rem] text-forest sm:text-[1.7rem]">
                    {s.title}
                  </h2>
                  <div className="legal-prose mt-5 space-y-4 leading-[1.8] text-ink/85 [&_h3]:mt-8 [&_h3]:text-[1.1rem] [&_h3]:tracking-[-0.01em] [&_h3]:text-forest [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_a]:font-semibold [&_a]:text-leaf [&_a]:underline [&_a]:decoration-mint [&_a]:decoration-2 [&_a]:underline-offset-2">
                    {s.body}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
