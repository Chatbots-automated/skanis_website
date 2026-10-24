import Link from "next/link";
import { LegalPage, Placeholder, type LegalSection } from "@/components/layout/Legal";
import { pageMetadata } from "@/lib/seo";
import { LEGAL } from "@/lib/site";

const sections: LegalSection[] = [
  {
    id: "valdytojas",
    title: "1. Kas atsakingas už duomenis",
    body: (
      <>
        <p>Skanis yra maisto etikečių skaitymo programėlė, šiuo metu bandoma uždarai (testavimo versija). Duomenų valdytojas:</p>
        <ul>
          <li>
            Pavadinimas: <Placeholder label="Įmonės pavadinimas" value={LEGAL.name} />
          </li>
          <li>
            Kodas: <Placeholder label="Įmonės kodas" value={LEGAL.code} />
          </li>
          <li>
            Adresas: <Placeholder label="Buveinės adresas" value={LEGAL.address} />
          </li>
          <li>
            Privatumo klausimais:{" "}
            {LEGAL.privacyEmail ? <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a> : <Placeholder label="Privatumo el. paštas" />}
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "svetaine",
    title: "2. Šioje svetainėje renkami duomenys",
    body: (
      <>
        <h3>Registracija testavimui</h3>
        <p>
          Jei užsiregistruojate testavimui, saugome jūsų el. pašto adresą, nuorodą arba
          kanalą, iš kurio atėjote (jei jis nurodytas nuorodoje), ir tai, kad sutikote, jog su jumis susisieksime. Šiuos duomenis naudojame tik tam, kad
          susisiektume dėl Skanis testavimo. Teisinis pagrindas – jūsų sutikimas (BDAR 6 str. 1 d. a p.), kurį galite bet kada atšaukti.
        </p>
        <p>
          Registracijos formą apdoroja svetainės talpinimo paslaugos teikėjas „Netlify“ (jo funkcija „Netlify Forms“). Šie duomenys nėra
          viešai matomi.
        </p>
        <h3>Techniniai duomenys ir slapukai</h3>
        <p>
          Svetainė nenaudoja reklamos ar sekimo slapukų ir nerodo reklamos. Kaip ir kiekvienas talpinimo paslaugos teikėjas, „Netlify“ gali
          tvarkyti technines užklausų žymas (pavyzdžiui, IP adresą ir naršyklės informaciją), kad svetainė veiktų ir būtų saugi.
        </p>
      </>
    ),
  },
  {
    id: "programele",
    title: "3. Programėlė (testavimo versija)",
    body: (
      <>
        <p>Šis skyrius aprašo, kaip tvarkomi duomenys, kai testavimo versijoje naudojama programėlė.</p>
        <h3>Kamera ir etikečių nuotraukos</h3>
        <p>
          Programėlė prašo kameros leidimo, kad galėtumėte nufotografuoti ingredientų sąrašą. Kamera nenaudojama niekam kitam, programėlė
          neįrašo nei vaizdo, nei garso. Nuotrauka šifruotu ryšiu siunčiama į mūsų skaitymo paslaugą, o iš jos – trečiosios šalies dirbtinio
          intelekto paslaugos teikėjui, kuris spausdintą tekstą paverčia skaitmeniniu tekstu. Grąžinamas tik nuskaitytas tekstas; palyginimas su jūsų
          pasirinktais filtrais vyksta jūsų telefone. Nuotraukų ir nuskaityto teksto savo serveriuose nesaugome.{" "}
          <Placeholder label="Patikrinti teikėjo duomenų saugojimo sąlygas ir čia tiksliai jas nurodyti" />
        </p>
        <p>
          Kiekvienas nuskaitymas palieka mažą miniatiūrą nuskaitymų istorijoje jūsų telefone. Istorija saugoma tik jūsų telefone ir iš jo
          nesiunčiama. Ją pašalina istorijos įrašo ištrynimas, duomenų ištrynimas nustatymuose arba programėlės pašalinimas.
        </p>
        <h3>Jūsų filtrai ir mitybos pasirinkimai</h3>
        <p>
          Jūsų pasirinkti filtrai (pavyzdžiui, E priedai, mitybos tipas, gyvenimo būdo pasirinkimai ar alergenai) saugomi jūsų telefone, kad programėlė galėtų su jais lyginti etiketes. Kai kurie iš jų (pavyzdžiui,
          alergenai ar mitybos apribojimai) gali atskleisti informaciją apie jūsų sveikatą, todėl laikome juos jautriais. Testavimo metu pasirinktų parinkčių sąrašas (be vardo) taip pat
          saugomas serveryje kartu su atsitiktiniu įrenginio identifikatoriumi, kad suprastume, kaip naudojamas testavimas. Pagrindas – jūsų aiškus
          sutikimas (BDAR 6 str. 1 d. a p. ir 9 str. 2 d. a p.).
        </p>
        <h3>Anoniminė naudojimo statistika</h3>
        <p>
          Problemoms rasti ir taisyti fiksuojame įvykius (pavyzdžiui, nuskaitymas pradėtas, pavyko ar ne, rezultato kategorija) kartu su
          atsitiktiniu įrenginio identifikatoriumi, programėlės ir telefono sistemos versija bei nuskaitymo trukme. Nefiksuojame nuotraukų ar
          etiketės teksto, nenaudojame reklamos identifikatorių ir duomenų neparduodame. Statistiką galima išjungti programėlės nustatymuose.
        </p>
        <h3>Neprivalomi vardas, el. paštas ir atsiliepimai</h3>
        <p>
          Programėlėje galite neprivalomai nurodyti vardą ir el. paštą bei pažymėti, ar rezultatas buvo teisingas. Juos naudojame tik testavimui
          tobulinti ir susisiekti dėl jo. Palikus laukus tuščius, nieko nesaugoma.
        </p>
        <h3>Strigčių ataskaitos</h3>
        <p>
          Jei programėlė užstringa, techninė ataskaita (klaidos pranešimas, telefono modelis, sistemos ir programėlės versija) siunčiama strigčių
          ataskaitų paslaugos teikėjui. Programėlė nustatyta taip, kad nesiųstų nuotraukų ar etiketės teksto.
        </p>
      </>
    ),
  },
  {
    id: "teikejai",
    title: "4. Kas dar tvarko duomenis",
    body: (
      <>
        <p>Naudojamės šiais paslaugų teikėjais, kurie duomenis tvarko mūsų vardu:</p>
        <ul>
          <li>„Netlify“ – talpina šią svetainę ir apdoroja registracijos formą.</li>
          <li>„Supabase“ – duomenų bazė ir skaitymo paslauga (statistika, atsiliepimai, neprivalomi kontaktai).</li>
          <li>Dirbtinio intelekto vaizdų skaitymo paslaugos teikėjas – paverčia etiketės nuotrauką tekstu.</li>
          <li>Strigčių ataskaitų paslaugos teikėjas.</li>
          <li>Programėlių platinimo ir atnaujinimų paslaugos.</li>
        </ul>
        <p>
          Kai kurie teikėjai gali tvarkyti duomenis už Europos ekonominės erdvės ribų. Tokiu atveju duomenys perduodami taikant tinkamas
          apsaugos priemones (pavyzdžiui, Europos Komisijos standartines sutarčių sąlygas). Duomenų neparduodame ir kitiems neteikiame, nebent to
          reikalauja įstatymai. <Placeholder label="Nurodyti konkrečius teikėjus, jų duomenų centrų regionus ir perdavimo pagrindus" />
        </p>
      </>
    ),
  },
  {
    id: "saugojimas",
    title: "5. Kiek laiko saugome",
    body: (
      <ul>
        <li>Etikečių nuotraukos ir nuskaitytas tekstas: mūsų serveriuose nesaugomi.</li>
        <li>Registracijos testavimui duomenys: iki testavimo pabaigos arba kol paprašysite juos ištrinti – kas įvyks anksčiau.</li>
        <li>Statistika, pasirinkimų sąrašas, atsiliepimai, neprivalomi vardas ir el. paštas: iki testavimo pabaigos arba kol ištrinsite savo duomenis programėlėje ar paprašysite mūsų juos ištrinti.</li>
        <li>Istorija ir pasirinkimai jūsų telefone: kol juos ištrinsite arba pašalinsite programėlę.</li>
        <li>Strigčių ataskaitos: laikotarpį nustato strigčių ataskaitų paslaugos teikėjo paskyros nustatymai.</li>
      </ul>
    ),
  },
  {
    id: "teises",
    title: "6. Jūsų teisės ir duomenų ištrynimas",
    body: (
      <>
        <p>
          Pagal Bendrąjį duomenų apsaugos reglamentą (BDAR) turite teisę susipažinti su savo duomenimis, reikalauti juos ištaisyti, ištrinti ar
          apriboti jų tvarkymą, gauti juos perkeliamu formatu, nesutikti su tvarkymu, grindžiamu teisėtu interesu, ir bet kada atšaukti
          sutikimą (atšaukimas nedaro neteisėtu ankstesnio tvarkymo).
        </p>
        <p>
          Registracijos testavimui duomenis ištrinsime parašius{" "}
          {LEGAL.privacyEmail ? <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a> : <Placeholder label="Privatumo el. paštas" />}.
          Programėlės duomenis galite ištrinti pačioje programėlėje nustatymuose pasirinkę „Ištrinti mano duomenis“.
        </p>
        <p>
          Jei manote, kad jūsų duomenys tvarkomi neteisėtai, turite teisę pateikti skundą Valstybinei duomenų apsaugos inspekcijai (vdai.lrv.lt).
        </p>
      </>
    ),
  },
  {
    id: "pakeitimai",
    title: "7. Pakeitimai",
    body: (
      <p>
        Šią politiką galime atnaujinti, kai keičiasi programėlė ar svetainė. Naujausia versija visada skelbiama šiame puslapyje, o atnaujinimo
        data nurodyta viršuje. Daugiau apie naudojimo taisykles skaitykite <Link href="/naudojimo-salygos">naudojimo sąlygose</Link>.
      </p>
    ),
  },
];

export const metadata = pageMetadata({
  title: "Privatumo politika – Skanis",
  description:
    "Kaip Skanis tvarko duomenis: kamera ir nuotraukos, pasirinkti filtrai, anoniminė statistika, registracija testavimui ir jūsų teisės.",
  path: "/privatumo-politika",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privatumo politika"
      path="/privatumo-politika"
      lead="Paprastai apie tai, kokius duomenis tvarko Skanis svetainė ir testavimo versijos programėlė, kodėl ir kaip jais galite valdyti."
      summary={{
        title: "Trumpai",
        items: [
          "Skanis naudoja kamerą tik maisto etiketės ingredientų sąrašui nufotografuoti.",
          "Etiketei perskaityti nuotrauka šifruotu ryšiu siunčiama į skaitymo paslaugą. Nuotraukų ir nuskaityto teksto savo serveriuose nesaugome.",
          "Nuskaitymų istorija lieka tik jūsų telefone.",
          "Svetainėje renkame tik tai, ką pats įrašote registracijos formoje: tik el. paštą.",
          "Jokios reklamos, jokių reklamos slapukų, jokio duomenų pardavimo.",
        ],
      }}
      sections={sections}
    />
  );
}
