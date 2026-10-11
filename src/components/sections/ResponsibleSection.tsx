import { Check, TriangleAlert, X } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const DOES = [
  "Ieško tik tavo pasirinktų alergenų.",
  "Nuskaito etiketės tekstą, kurį gali peržiūrėti ir pataisyti.",
  "Lygina tekstą pagal nustatytas taisykles: tas pats tekstas visada duoda tą patį rezultatą.",
  "Parodo žodžius, dėl kurių gautas rezultatas.",
  "Kai nepavyksta perskaityti, sako „neaišku“, o ne spėlioja.",
];

const DOES_NOT = [
  "Negarantuoja, kad produktas saugus ar be alergenų.",
  "Nepakeičia originalios etiketės patikros.",
  "Nevertina kryžminės taršos rizikos gamykloje.",
  "Nėra medicininė rekomendacija ar sertifikuotas medicinos produktas.",
  "Neieško produkto duomenų bazėje: remiasi tik pakuote, kurią nufotografavai.",
];

export function ResponsibleSection() {
  return (
    <section id="atsakingas-naudojimas" aria-labelledby="resp-title" className="section-y bg-sage/70">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            id="resp-title"
            eyebrow="Atsakingas naudojimas ir privatumas"
            title="Tavo pasirinkimai. Tavo kontrolė."
            lead="Skanis sukurtas taip, kad matytum, kas ir kodėl rodoma. Jis nespėlioja ir nežada daugiau, nei gali."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <Reveal className="rounded-[var(--radius-card)] bg-white p-8 shadow-soft sm:p-10">
            <h3 className="text-[1.4rem] text-forest">Ką daro Skanis</h3>
            <ul className="mt-6 space-y-4">
              {DOES.map((t) => (
                <li key={t} className="flex gap-3.5 leading-relaxed text-ink/85">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-sage text-leaf">
                    <Check className="size-3.5" strokeWidth={3.2} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08} className="rounded-[var(--radius-card)] bg-white p-8 shadow-soft sm:p-10">
            <h3 className="text-[1.4rem] text-forest">Ko Skanis nedaro</h3>
            <ul className="mt-6 space-y-4">
              {DOES_NOT.map((t) => (
                <li key={t} className="flex gap-3.5 leading-relaxed text-ink/85">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-danger-soft text-danger">
                    <X className="size-3.5" strokeWidth={3.2} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="mt-5 flex gap-4 rounded-[var(--radius-card)] border border-amber-line bg-amber-soft p-7 sm:gap-6 sm:p-9">
          <TriangleAlert className="mt-1 size-6 shrink-0 text-amber" />
          <div>
            <h3 className="text-[1.2rem] text-forest">Svarbu žinoti apie automatinį atpažinimą</h3>
            <p className="mt-2.5 max-w-4xl leading-[1.75] text-ink/85">
              Automatinis ingredientų atpažinimas gali klysti. Neryški nuotrauka, nutrūkęs ar susiraukšlėjęs sąrašas, labai smulkus šriftas,
              pasikeitusi produkto receptūra ar kryžminės taršos įspėjimai gali paveikti rezultatą. Skanis nepakeičia originalios pakuotės
              etiketės, todėl visada perskaityk ją pats, ypač jei alergija sunki.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-14 grid gap-x-10 gap-y-8 border-t border-forest/15 pt-10 md:grid-cols-3">
          {[
            { t: "Nuotraukos nesaugomos", d: "Etiketės nuotrauka siunčiama tik tekstui perskaityti. Savo serveriuose nuotraukų ir nuskaityto teksto nesaugome." },
            { t: "Istorija lieka telefone", d: "Tavo nuskaitymų istorija saugoma tik tavo telefone ir iš jo nesiunčiama." },
            { t: "Be reklamos ir duomenų pardavimo", d: "Programėlėje nėra reklamos, o tavo duomenų neparduodame." },
          ].map((p) => (
            <div key={p.t}>
              <h3 className="text-[1.05rem] tracking-[-0.01em] text-forest">{p.t}</h3>
              <p className="mt-2 leading-relaxed text-muted">{p.d}</p>
            </div>
          ))}
          <p className="md:col-span-3">
            <Link href="/privatumo-politika" className="font-bold text-leaf underline decoration-mint decoration-2 underline-offset-4">
              Skaityti privatumo politiką
            </Link>
            <span className="mx-3 text-faint" aria-hidden="true">
              ·
            </span>
            <Link href="/naudojimo-salygos" className="font-bold text-leaf underline decoration-mint decoration-2 underline-offset-4">
              Naudojimo sąlygos
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
