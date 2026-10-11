import { Highlighter, MessageCircleQuestion, ScanText, SlidersHorizontal } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const BENEFITS = [
  {
    icon: ScanText,
    title: "Sudėties analizė pagal realią pakuotę",
    text: "Skanis skaito būtent tą etiketę, kurią laikai rankose, o ne bendrą produkto duomenų bazę. Tas pats produktas skirtingose šalyse ar partijose gali turėti skirtingą sudėtį.",
  },
  {
    icon: SlidersHorizontal,
    title: "Personalizuoti alergenų pasirinkimai",
    text: "Pats pasirenki, kuriuos alergenus nori stebėti, ir Skanis sudėtyje ieško būtent jų. Pasirinkimus gali keisti bet kada.",
  },
  {
    icon: Highlighter,
    title: "Aiškiai išryškinti svarbūs ingredientai",
    text: "Ingredientai, atitinkantys tavo pasirinkimus, paryškinami tekste, todėl iškart matai, dėl ko gautas rezultatas.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Suprantami paaiškinimai, kai informacija neaiški",
    text: "Jei nuotrauka neryški ar sąrašas nutrūksta, Skanis nespėlioja, o pasako, kad reikia dar vienos nuotraukos.",
  },
];

export function IntroSection() {
  return (
    <section aria-labelledby="intro-title" className="section-y bg-white">
      <div className="container-x grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            id="intro-title"
            eyebrow="Kodėl Skanis"
            title="Daugiau aiškumo renkantis maistą."
            lead="Skanis padeda suprasti maisto produktų sudėtį ir atkreipti dėmesį į ingredientus, kurie svarbūs būtent tau."
          />
        </Reveal>

        <ol className="divide-y divide-line border-y border-line">
          {BENEFITS.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 0.06} className="group grid grid-cols-[auto_1fr] gap-x-5 gap-y-1 py-8 sm:gap-x-7">
              <span className="grid size-14 place-items-center rounded-2xl bg-sage text-leaf transition-all duration-500 group-hover:-rotate-6 group-hover:bg-mint group-hover:text-forest-deep">
                <Icon className="size-6" strokeWidth={2.1} />
              </span>
              <div>
                <p aria-hidden="true" className="mb-1 text-xs font-extrabold tracking-[0.18em] text-faint">
                  0{i + 1}
                </p>
                <h3 className="text-[1.3rem] leading-snug tracking-[-0.02em] text-forest">{title}</h3>
                <p className="mt-2.5 max-w-xl leading-relaxed text-muted">{text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
