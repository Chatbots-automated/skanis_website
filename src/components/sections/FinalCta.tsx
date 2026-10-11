import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { LogoStage } from "@/components/three/LogoStage";

export function FinalCta() {
  return (
    <section aria-labelledby="final-title" className="bg-paper pb-16 lg:pb-24">
      <Reveal className="container-x">
        <div
          data-on-dark
          className="relative overflow-hidden rounded-[2.25rem] bg-[radial-gradient(ellipse_90%_80%_at_72%_40%,#1f5249_0%,#143f39_55%,#0c2a26_100%)] shadow-lift sm:rounded-[2.75rem]"
        >
          <div className="grid items-center lg:grid-cols-[1.05fr_1fr]">
            <div className="relative z-10 order-2 px-7 pb-12 pt-2 sm:px-12 lg:order-1 lg:px-16 lg:py-24">
              <p className="eyebrow mb-5 !text-mint">Pirmieji testuotojai</p>
              <h2 id="final-title" className="text-[clamp(2.1rem,4.8vw,3.7rem)] text-white">
                Aiškesnė maisto sudėtis prasideda čia.
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-white/75">
                Prisijunk prie pirmųjų, kurie išbandys Skanis, ir padėk padaryti jį dar aiškesnį.
              </p>
              <Button href="/#registracija" variant="mint" size="lg" className="mt-9 w-full sm:w-auto">
                Išbandyti pirmiesiems
              </Button>
            </div>
            <LogoStage className="order-1 h-[20rem] sm:h-[26rem] lg:order-2 lg:h-[36rem]" />
          </div>
          <span aria-hidden="true" className="pointer-events-none absolute inset-2.5 rounded-[1.75rem] border border-mint/15 sm:inset-3 sm:rounded-[2.25rem]" />
        </div>
      </Reveal>
    </section>
  );
}
