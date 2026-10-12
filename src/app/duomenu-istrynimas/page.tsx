import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/layout/Legal";
import { pageMetadata } from "@/lib/seo";

const sections: LegalSection[] = [
  {
    id: "programeleje",
    title: "1. Ištrynimas programėlėje",
    body: (
      <>
        <p>Jei naudojatės „Skanis“ ir norite ištrinti su jūsų įrenginiu susietus duomenis, tai galite padaryti programėlėje:</p>
        <p>
          <strong>Nustatymai → Ištrinti mano duomenis</strong>
        </p>
      </>
    ),
  },
  {
    id: "prasymas",
    title: "2. Ištrynimo prašymas",
    body: (
      <>
        <p>Jei nebeturite prieigos prie programėlės, galite pateikti ištrynimo prašymą susisiekę su mumis.</p>
        <p>
          Prašyme nurodykite, kad norite ištrinti su „Skanis“ naudojimu susijusius duomenis. Galime paprašyti papildomos informacijos, kad
          galėtume nustatyti, kuriuos duomenis reikia ištrinti.
        </p>
      </>
    ),
  },
  {
    id: "kas-istrinama",
    title: "3. Kokie duomenys gali būti ištrinti",
    body: (
      <>
        <ul>
          <li>anoniminiai naudojimo įrašai;</li>
          <li>beta kontaktiniai duomenys, jei juos pateikėte;</li>
          <li>su jūsų naudojimu susieti serverio duomenys.</li>
        </ul>
        <p>
          Programėlėje saugomi vietiniai duomenys gali būti pašalinti naudojant „Ištrinti mano duomenis“ funkciją arba pašalinus programėlę,
          priklausomai nuo duomenų tipo.
        </p>
        <p>
          Daugiau apie tai, kokius duomenis tvarkome ir kiek laiko juos saugome, skaitykite <Link href="/privatumo-politika">privatumo politikoje</Link>.
        </p>
      </>
    ),
  },
];

export const metadata = pageMetadata({
  title: "Duomenų ištrynimas – Skanis",
  description: "Kaip ištrinti su Skanis naudojimu susietus duomenis: programėlės nustatymuose arba pateikus prašymą.",
  path: "/duomenu-istrynimas",
});

export default function DataDeletionPage() {
  return (
    <LegalPage
      title="Skanis duomenų ištrynimas"
      lead="Kaip ištrinti su jūsų Skanis naudojimu susietus duomenis programėlėje arba pateikus prašymą."
      sections={sections}
    />
  );
}
