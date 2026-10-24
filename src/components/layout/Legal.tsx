import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LEGAL_UPDATED } from "@/lib/site";

/**
 * A value the business owner still has to provide. Until it is set it reads as
 * a plain note in the text; `label` says what belongs there (shown on hover).
 */
export function Placeholder({ value, label }: { value?: string; label: string }) {
  if (value) return <>{value}</>;
  return <span title={label}>[reikia nuspręsti, ką rašyti]</span>;
}

export type LegalSection = { id: string; title: string; body: ReactNode };

const LEGAL_PAGES = [
  { label: "Privatumo politika", href: "/privatumo-politika" },
  { label: "Naudojimo sąlygos", href: "/naudojimo-salygos" },
  { label: "Duomenų ištrynimas", href: "/duomenu-istrynimas" },
] as const;

export function LegalPage({
  title,
  lead,
  path,
  summary,
  sections,
}: {
  title: string;
  lead: string;
  path: (typeof LEGAL_PAGES)[number]["href"];
  summary?: { title: string; items: string[] };
  sections: LegalSection[];
}) {
  return (
    <article>
      <header className="relative overflow-hidden bg-white pb-14 pt-28 sm:pt-32 lg:pb-20 lg:pt-40">
        <div aria-hidden="true" className="absolute -right-40 -top-40 size-[36rem] rounded-full bg-[radial-gradient(closest-side,rgb(163_232_208/0.7),transparent)]" />
        <div aria-hidden="true" className="absolute -bottom-56 left-[-10%] size-[30rem] rounded-full bg-[radial-gradient(closest-side,rgb(94_38_128/0.1),transparent)]" />
        <div className="container-x relative">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-ink/60 transition-colors hover:text-grape">
            <ArrowLeft className="size-4" />
            Į pradžią
          </Link>

          <nav aria-label="Teisiniai dokumentai" className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {LEGAL_PAGES.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    aria-current={p.href === path ? "page" : undefined}
                    className={
                      p.href === path
                        ? "inline-flex h-9 items-center rounded-full bg-ink px-4 text-sm font-bold text-white"
                        : "inline-flex h-9 items-center rounded-full bg-ink/[0.05] px-4 text-sm font-bold text-ink/70 transition-colors hover:bg-mint hover:text-ink"
                    }
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <h1 className="display mt-8 max-w-4xl text-[clamp(2.6rem,6.5vw,5.5rem)] text-ink">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{lead}</p>
          <p className="mt-4 text-sm font-semibold text-faint">Atnaujinta: {LEGAL_UPDATED}</p>

        </div>
      </header>

      <div className="container-x pb-24 lg:pb-32">
        <div className="grid gap-12 border-t border-line pt-14 lg:grid-cols-[15rem_1fr] lg:gap-20">
          <nav aria-label="Dokumento turinys" className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-faint">Turinys</p>
              <ul className="mt-4 space-y-2.5 border-l border-line">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="-ml-px block border-l-2 border-transparent pl-4 text-sm leading-snug text-muted transition-colors hover:border-grape hover:text-ink">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="max-w-3xl">
            {summary && (
              <section aria-labelledby="legal-summary" className="mb-14 rounded-[var(--radius-card)] bg-mint p-7 sm:p-9">
                <h2 id="legal-summary" className="text-[1.35rem] text-ink">
                  {summary.title}
                </h2>
                <ul className="mt-5 space-y-3">
                  {summary.items.map((t) => (
                    <li key={t} className="flex gap-3 leading-relaxed text-ink/85">
                      <span aria-hidden="true" className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-grape" />
                      {t}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="space-y-14">
              {sections.map((s) => (
                <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-24">
                  <h2 id={`${s.id}-title`} className="text-[1.5rem] text-ink sm:text-[1.7rem]">
                    {s.title}
                  </h2>
                  <div className="mt-5 space-y-4 leading-[1.8] text-ink/80 [&_a]:font-semibold [&_a]:text-grape [&_a]:underline [&_a]:decoration-grape/30 [&_a]:decoration-2 [&_a]:underline-offset-2 [&_h3]:mt-8 [&_h3]:text-[1.1rem] [&_h3]:tracking-[-0.01em] [&_h3]:text-ink [&_li]:pl-1 [&_li::marker]:text-grape [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
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
