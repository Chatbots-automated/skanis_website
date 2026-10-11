import Link from "next/link";
import { LegalPage, Placeholder, type LegalSection } from "@/components/layout/Legal";
import { pageMetadata } from "@/lib/seo";
import { LEGAL } from "@/lib/site";

const sections: LegalSection[] = [
  {
    id: "bendros",
    title: "1. Bendrosios nuostatos",
    body: (
      <>
        <p>
          Šios sąlygos taikomos Skanis svetainei ir Skanis programėlės testavimo versijai (toliau – Skanis). Naudodamiesi svetaine ar registruodamiesi
          testavimui, patvirtinate, kad su jomis susipažinote.
        </p>
        <p>
          Skanis valdytojas: <Placeholder label="Įmonės pavadinimas" value={LEGAL.name} />, kodas{" "}
          <Placeholder label="Įmonės kodas" value={LEGAL.code} />, adresas <Placeholder label="Buveinės adresas" value={LEGAL.address} />.
        </p>
      </>
    ),
  },
  {
    id: "paslauga",
    title: "2. Kas yra Skanis ir kokia jo būsena",
    body: (
      <>
        <p>
          Skanis padeda perskaityti maisto produkto ingredientų sąrašą ir palyginti jį su naudotojo pasirinktais alergenais bei mitybos
          parinktimis. Tai informacinė pagalbinė priemonė.
        </p>
        <p>
          Skanis šiuo metu yra testavimo versija. Ji nėra viešai prieinama programėlių parduotuvėse, jos funkcijos gali keistis, o prieiga prie
          testavimo gali būti suteikiama ribotam žmonių skaičiui. Negarantuojame, kad testavimo versija veiks be pertrūkių ar klaidų.
        </p>
      </>
    ),
  },
  {
    id: "ispejimas",
    title: "3. Svarbus įspėjimas dėl alergenų",
    body: (
      <>
        <ul>
          <li>Skanis negarantuoja, kad produktas yra saugus, neturi alergenų ar tinka konkrečiam asmeniui.</li>
          <li>Skanis nėra medicininė rekomendacija, medicinos priemonė ar kito specialisto konsultacija.</li>
          <li>
            Automatinis teksto atpažinimas gali klysti. Neryški nuotrauka, nutrūkęs sąrašas, smulkus šriftas, pasikeitusi produkto receptūra ar
            kryžminės taršos įspėjimai gali paveikti rezultatą.
          </li>
          <li>Skanis ieško tik naudotojo pasirinktų alergenų ir tik nuskaitytame tekste.</li>
          <li>
            Skanis nepakeičia originalios pakuotės etiketės. Prieš vartodami produktą visada perskaitykite originalią etiketę, ypač jei
            alergija sunki.
          </li>
        </ul>
        <p>Dėl sveikatos klausimų kreipkitės į gydytoją ar kitą kvalifikuotą specialistą.</p>
      </>
    ),
  },
  {
    id: "registracija",
    title: "4. Registracija testavimui",
    body: (
      <p>
        Registracija nieko nekainuoja ir neįpareigoja nei jūsų, nei mūsų. Užsiregistravus nėra garantuojama, kad būsite priimtas į testavimą.
        Iš sąrašo galite pasišalinti bet kada parašę mums. Registracijos duomenys tvarkomi pagal{" "}
        <Link href="/privatumo-politika">privatumo politiką</Link>.
      </p>
    ),
  },
  {
    id: "pareigos",
    title: "5. Naudotojo pareigos",
    body: (
      <ul>
        <li>Nurodyti tikrą el. pašto adresą, kuriuo galite naudotis.</li>
        <li>Naudoti Skanis tik teisėtais tikslais, netrikdyti jo veikimo ir nebandyti apeiti apsaugos priemonių.</li>
        <li>Fotografuoti tik produkto etiketę ir vengti fotografuoti asmenis ar kitą asmeninę informaciją.</li>
        <li>Išsaugoti ir naudoti rezultatus atsakingai, laikantis 3 skyriaus nurodymų.</li>
      </ul>
    ),
  },
  {
    id: "nuosavybe",
    title: "6. Intelektinė nuosavybė",
    body: (
      <p>
        Skanis pavadinimas, logotipas, svetainės dizainas, tekstai ir programinė įranga priklauso jų valdytojui arba naudojami turint teisėtą
        pagrindą. Be išankstinio sutikimo jų kopijuoti, platinti ar naudoti komerciniais tikslais negalima.
      </p>
    ),
  },
  {
    id: "atsakomybe",
    title: "7. Atsakomybės ribojimas",
    body: (
      <p>
        Skanis teikiamas „kaip yra“, kaip testavimo versija. Tiek, kiek leidžia įstatymai, valdytojas neatsako už žalą, kilusią dėl nuskaitymo
        klaidų ar sprendimų, priimtų remiantis vien Skanis rezultatu, vietoj originalios pakuotės patikros. Šios sąlygos neriboja ir
        nepanaikina teisių, kurias vartotojams garantuoja imperatyvios įstatymų nuostatos, ir neriboja atsakomybės, kurios pagal įstatymus
        riboti negalima.
      </p>
    ),
  },
  {
    id: "pakeitimai",
    title: "8. Sąlygų pakeitimai ir taikoma teisė",
    body: (
      <>
        <p>
          Sąlygas galime atnaujinti, kai keičiasi Skanis. Naujausia versija visada skelbiama šiame puslapyje, o atnaujinimo data nurodyta viršuje.
        </p>
        <p>Šioms sąlygoms taikoma Lietuvos Respublikos teisė. Ginčus siekiame spręsti tarpusavio susitarimu.</p>
      </>
    ),
  },
  {
    id: "kontaktai",
    title: "9. Kontaktai",
    body: (
      <p>
        Klausimais dėl šių sąlygų rašykite:{" "}
        {LEGAL.privacyEmail ? <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a> : <Placeholder label="Kontaktinis el. paštas" />}.
      </p>
    ),
  },
];

export const metadata = pageMetadata({
  title: "Naudojimo sąlygos – Skanis",
  description:
    "Skanis svetainės ir testavimo versijos naudojimo sąlygos: kam skirtas Skanis, kokie jo apribojimai ir kodėl visada reikia patikrinti originalią pakuotę.",
  path: "/naudojimo-salygos",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Naudojimo sąlygos"
      lead="Kam skirtas Skanis, kokia jo dabartinė būsena ir kodėl originalios pakuotės etiketę visada reikia patikrinti pačiam."
      summary={{
        title: "Trumpai",
        items: [
          "Skanis yra testavimo versija ir pagalbinė priemonė, o ne medicininė rekomendacija.",
          "Skanis negarantuoja, kad produktas saugus ar be alergenų.",
          "Automatinis atpažinimas gali klysti, todėl visada patikrinkite originalią pakuotę.",
          "Registracija testavimui nieko nekainuoja ir neįpareigoja.",
        ],
      }}
      sections={sections}
    />
  );
}
