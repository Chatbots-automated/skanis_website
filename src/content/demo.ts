/**
 * Deterministic example data for the interactive demonstration.
 * Everything here is fictional: there is no OCR, no backend and no real
 * product. The products, ingredient lists and rules below are hardcoded.
 */

export type AllergenId = "milk" | "peanut" | "gluten";

export type DemoAllergen = {
  id: AllergenId;
  /** Name as shown on the toggle. */
  label: string;
  /** Short form used inside sentences ("... aptikta {genitive}"). */
  genitive: string;
  /** Explanation shown when the allergen is found in the ingredient list. */
  foundText: string;
};

export const DEMO_ALLERGENS: readonly DemoAllergen[] = [
  {
    id: "milk",
    label: "Pienas",
    genitive: "pieno",
    foundText: "Sudėtyje aptiktas pienas arba jo sudedamosios dalys.",
  },
  {
    id: "peanut",
    label: "Žemės riešutai",
    genitive: "žemės riešutų",
    foundText: "Sudėtyje aptikti žemės riešutai arba jų sudedamosios dalys.",
  },
  {
    id: "gluten",
    label: "Glitimo turintys javai",
    genitive: "glitimo turinčių javų",
    foundText: "Sudėtyje aptikta glitimo turinčių javų (pvz., kviečių ar avižų).",
  },
] as const;

export type Segment = {
  /** Exact text as it appears on the example label. */
  text: string;
  /** Allergens this ingredient is hardcoded to match. */
  allergens?: AllergenId[];
};

export type DemoProduct = {
  id: string;
  name: string;
  weight: string;
  ingredients: Segment[];
  /** A "may contain" statement printed on the label, if any. */
  mayContain?: { text: string; allergens: AllergenId[] };
};

export const DEMO_PRODUCTS: readonly DemoProduct[] = [
  {
    id: "oat-cookies",
    name: "Avižiniai sausainiai",
    weight: "200 g",
    ingredients: [
      { text: "avižų dribsniai (38 %)", allergens: ["gluten"] },
      { text: "cukrus" },
      { text: "kviečių miltai", allergens: ["gluten"] },
      { text: "augalinis aliejus (palmių)" },
      { text: "sviestas (6 %)", allergens: ["milk"] },
      { text: "sūrių išrūgų milteliai", allergens: ["milk"] },
      { text: "kepimo milteliai (amonio karbonatas)" },
      { text: "druska" },
      { text: "vanilės aromatas" },
    ],
    mayContain: { text: "Gali būti žemės riešutų pėdsakų.", allergens: ["peanut"] },
  },
  {
    id: "choc-bar",
    name: "Šokoladinis batonėlis",
    weight: "45 g",
    ingredients: [
      { text: "cukrus" },
      { text: "žemės riešutai (18 %)", allergens: ["peanut"] },
      { text: "kakavos sviestas" },
      { text: "nugriebto pieno milteliai", allergens: ["milk"] },
      { text: "gliukozės sirupas" },
      { text: "kakavos masė" },
      { text: "emulsiklis (sojų lecitinas)" },
      { text: "vanilinas" },
    ],
    mayContain: { text: "Gali būti glitimo turinčių javų pėdsakų.", allergens: ["gluten"] },
  },
  {
    id: "rice-cakes",
    name: "Ryžių trapučiai",
    weight: "100 g",
    ingredients: [{ text: "ryžiai (97 %)" }, { text: "jūros druska" }],
  },
] as const;

export type DemoVerdict = "none-selected" | "found" | "trace" | "clear";

export type DemoFinding = {
  allergen: DemoAllergen;
  /** Ingredient texts from the label that matched. */
  ingredients: string[];
};

export type DemoResult = {
  verdict: DemoVerdict;
  found: DemoFinding[];
  /** Selected allergens that only appear in the "may contain" statement. */
  traces: DemoAllergen[];
};

const allergenById = (id: AllergenId) => DEMO_ALLERGENS.find((a) => a.id === id)!;

/**
 * Compares the example label with the chosen allergens. Pure and
 * deterministic: the same inputs always produce the same result.
 */
export function analyzeDemo(product: DemoProduct, selected: ReadonlySet<AllergenId>): DemoResult {
  if (selected.size === 0) return { verdict: "none-selected", found: [], traces: [] };

  const found: DemoFinding[] = [];
  for (const allergen of DEMO_ALLERGENS) {
    if (!selected.has(allergen.id)) continue;
    const ingredients = product.ingredients.filter((s) => s.allergens?.includes(allergen.id)).map((s) => s.text);
    if (ingredients.length > 0) found.push({ allergen, ingredients });
  }

  const foundIds = new Set(found.map((f) => f.allergen.id));
  const traces = (product.mayContain?.allergens ?? [])
    .filter((id) => selected.has(id) && !foundIds.has(id))
    .map(allergenById);

  const verdict: DemoVerdict = found.length > 0 ? "found" : traces.length > 0 ? "trace" : "clear";
  return { verdict, found, traces };
}

/** Whether an ingredient segment should be highlighted for the current selection. */
export function isHighlighted(segment: Segment, selected: ReadonlySet<AllergenId>) {
  return !!segment.allergens?.some((id) => selected.has(id));
}
