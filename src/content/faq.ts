export type FaqItem = { q: string; a: string; cta?: { label: string; href: string } };

export const FAQ: readonly FaqItem[] = [
  {
    q: "Kas yra Skanis?",
    a: "Skanis yra mobilioji programėlė, padedanti greičiau perskaityti maisto produktų ingredientų sąrašą. Pasirenki alergenus, kuriuos nori stebėti, nufotografuoji etiketę, o Skanis parodo, kurie ingredientai atitinka tavo pasirinkimus. Šiuo metu programėlė yra testavimo versija ir dar tobulinama.",
  },
  {
    q: "Kaip veikia ingredientų atpažinimas?",
    a: "Nufotografavus ingredientų sąrašą, tekstas iš nuotraukos paverčiamas skaitmeniniu tekstu. Prieš tęsiant gali jį peržiūrėti ir ištaisyti akivaizdžias klaidas. Tada tekstas lyginamas su tavo pasirinktais alergenais pagal nustatytas taisykles: tas pats tekstas visada duoda tą patį rezultatą, o tu matai žodžius, dėl kurių jis gautas.",
  },
  {
    q: "Ar Skanis gali aptikti visus alergenus?",
    a: "Ne. Skanis ieško tik tavo pasirinktų alergenų ir tik tame tekste, kurį pavyko nuskaityti. Jei žodis neįskaitomas, sąrašas nutrūksta ar ingredientas užrašytas neįprastai, jis gali likti nepastebėtas. Todėl Skanis negali garantuoti, kad aptikti visi alergenai.",
  },
  {
    q: "Ar galima visiškai pasitikėti nuskaitymo rezultatu?",
    a: "Rezultatą verta naudoti kaip pagalbinę priemonę, bet ne kaip vienintelį šaltinį. Teksto atpažinimo klaidos, neryški nuotrauka, pasikeitusi produkto receptūra ar kryžminės taršos įspėjimai gali paveikti rezultatą. Jei alergija sunki, visada patikrink originalią pakuotę, o abejodamas kreipkis į gamintoją ar gydytoją.",
  },
  {
    q: "Ar programėlė jau prieinama?",
    a: "Dar ne. Šiuo metu ruošiama testavimo versija, o Skanis nėra viešai prieinamas programėlių parduotuvėse. Kai atsiras vietų testavimui, parašysime užsiregistravusiems.",
  },
  {
    q: "Kaip prisijungti prie testavimo?",
    a: "Palik savo el. paštą registracijos formoje (jei nori, nurodyk ir telefono tipą: Android ar iPhone). Kai bus galima prisijungti, parašysime ir paaiškinsime, kaip įsidiegti testavimo versiją. Registracija nieko nekainuoja ir neįpareigoja.",
    cta: { label: "Pereiti prie registracijos", href: "/#registracija" },
  },
  {
    q: "Ar Skanis pakeičia originalios etiketės tikrinimą?",
    a: "Ne. Skanis nepakeičia originalios etiketės patikros. Visada, ypač jei alergija sunki, perskaityk pakuotę pats. Skanis tik padeda greičiau pastebėti ingredientus, į kuriuos verta atkreipti dėmesį.",
  },
] satisfies readonly FaqItem[];
