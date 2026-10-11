import { Hero } from "@/components/sections/Hero";
import { IntroSection } from "@/components/sections/IntroSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { DemoSection } from "@/components/demo/DemoSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { ResponsibleSection } from "@/components/sections/ResponsibleSection";
import { SignupSection } from "@/components/sections/SignupSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCta } from "@/components/sections/FinalCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <IntroSection />
      <HowItWorks />
      <DemoSection />
      <BenefitsSection />
      <ResponsibleSection />
      <SignupSection />
      <FaqSection />
      <FinalCta />
    </>
  );
}
