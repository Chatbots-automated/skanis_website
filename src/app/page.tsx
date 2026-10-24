import { StructuredData } from "@/components/StructuredData";
import { Hero } from "@/components/sections/Hero";
import { Steps } from "@/components/sections/Steps";
import { Criteria } from "@/components/sections/Criteria";
import { Faq } from "@/components/sections/Faq";
import { SignupSection } from "@/components/sections/SignupSection";

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <Hero />
      <Steps />
      <Criteria />
      <Faq />
      <SignupSection />
    </>
  );
}
