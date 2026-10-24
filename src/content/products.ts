/**
 * Sample products for the hero demo. The ingredient lists follow how real
 * labels in these categories read (EU naming, Lithuanian wording), but the
 * brands are made up: the demo marks products "Netinka", which we must not do
 * to a real brand without its consent.
 */

export type FilterId = "saldikliai" | "dazikliai" | "stiprikliai" | "palmiu" | "kofeinas" | "glitimas";

export const FILTERS: Array<{ id: FilterId; label: string; hint: string }> = [
  { id: "saldikliai", label: "Saldikliai", hint: "aspartamas, acesulfamas K…" },
  { id: "stiprikliai", label: "Skonio stiprikliai", hint: "E620–E640" },
  { id: "dazikliai", label: "Dažikliai", hint: "E100–E199" },
  { id: "palmiu", label: "Palmių aliejus", hint: "ir palmių riebalai" },
  { id: "kofeinas", label: "Kofeinas", hint: "gėrimuose ir užkandžiuose" },
  { id: "glitimas", label: "Be glitimo", hint: "kviečiai, miežiai, rugiai" },
];

export const DEFAULT_FILTERS: FilterId[] = ["saldikliai", "stiprikliai"];

/** A run of label text; a run with `filter` is a word the matching filter catches. */
export type Part = { text: string; filter?: FilterId; kind?: string };

export type ProductId = "cola" | "traskuciai" | "sausainiai";

export type Product = {
  id: ProductId;
  brand: string;
  name: string;
  size: string;
  parts: Part[];
};

export const PRODUCTS: Product[] = [
  {
    id: "cola",
    brand: "BURBU",
    name: "Cola Zero",
    size: "0,33 l",
    parts: [
      { text: "Vanduo, anglies dioksidas, dažiklis " },
      { text: "E150d", filter: "dazikliai", kind: "Dažiklis (karamelė)" },
      { text: ", rūgštingumo reguliatoriai: fosforo rūgštis, natrio citratai; saldikliai: " },
      { text: "aspartamas", filter: "saldikliai", kind: "Saldiklis (E951)" },
      { text: ", " },
      { text: "acesulfamas K", filter: "saldikliai", kind: "Saldiklis (E950)" },
      { text: "; natūralios kvapiosios medžiagos, " },
      { text: "kofeinas", filter: "kofeinas", kind: "Kofeinas" },
      { text: "." },
    ],
  },
  {
    id: "traskuciai",
    brand: "KRAŠ",
    name: "Traškučiai su grietine ir svogūnais",
    size: "130 g",
    parts: [
      { text: "Bulvės, saulėgrąžų aliejus, prieskonių mišinys (laktozė, druska, svogūnų milteliai, skonio stiprikliai: " },
      { text: "mononatrio glutamatas", filter: "stiprikliai", kind: "Skonio stipriklis (E621)" },
      { text: ", " },
      { text: "dinatrio ribonukleotidai", filter: "stiprikliai", kind: "Skonio stipriklis (E635)" },
      { text: ", grietinės milteliai (pieno), cukrus, rūgštingumo reguliatorius citrinų rūgštis, kvapiosios medžiagos)." },
    ],
  },
  {
    id: "sausainiai",
    brand: "TRAŠKA",
    name: "Sausainiai su šokolado gabaliukais",
    size: "150 g",
    parts: [
      { text: "" },
      { text: "Kvietiniai miltai", filter: "glitimas", kind: "Glitimas (kviečiai)" },
      { text: ", šokolado gabaliukai 25 % (cukrus, kakavos masė, kakavos sviestas, emulsiklis sojų lecitinai), cukrus, " },
      { text: "palmių aliejus", filter: "palmiu", kind: "Palmių aliejus" },
      { text: ", kiaušiniai, kildinimo medžiagos (amonio ir natrio karbonatai), druska, kvapiosios medžiagos." },
    ],
  },
];

/** The words a product's label trips for the given filters. */
export function findHits(product: Product, on: ReadonlySet<FilterId>) {
  return product.parts.filter((p) => p.filter && on.has(p.filter));
}
