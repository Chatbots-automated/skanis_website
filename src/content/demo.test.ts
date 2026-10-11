import { describe, expect, it } from "vitest";
import { analyzeDemo, DEMO_PRODUCTS, isHighlighted, type AllergenId } from "./demo";

const product = (id: string) => DEMO_PRODUCTS.find((p) => p.id === id)!;
const sel = (...ids: AllergenId[]) => new Set<AllergenId>(ids);

describe("analyzeDemo", () => {
  it("asks for a selection when no allergen is chosen", () => {
    expect(analyzeDemo(product("oat-cookies"), sel()).verdict).toBe("none-selected");
  });

  it("finds milk in the oat cookies and reports the matching ingredients", () => {
    const r = analyzeDemo(product("oat-cookies"), sel("milk"));
    expect(r.verdict).toBe("found");
    expect(r.found).toHaveLength(1);
    expect(r.found[0].ingredients).toEqual(["sviestas (6 %)", "sūrių išrūgų milteliai"]);
  });

  it("reports peanuts in the oat cookies only as a possible trace", () => {
    const r = analyzeDemo(product("oat-cookies"), sel("peanut"));
    expect(r.verdict).toBe("trace");
    expect(r.found).toHaveLength(0);
    expect(r.traces.map((a) => a.id)).toEqual(["peanut"]);
  });

  it("combines a finding and a trace", () => {
    const r = analyzeDemo(product("oat-cookies"), sel("milk", "peanut"));
    expect(r.verdict).toBe("found");
    expect(r.traces.map((a) => a.id)).toEqual(["peanut"]);
  });

  it("finds gluten-containing cereals in the oat cookies", () => {
    const r = analyzeDemo(product("oat-cookies"), sel("gluten"));
    expect(r.found[0].ingredients).toEqual(["avižų dribsniai (38 %)", "kviečių miltai"]);
  });

  it("finds peanuts and milk in the chocolate bar, gluten only as trace", () => {
    expect(analyzeDemo(product("choc-bar"), sel("milk", "peanut")).found).toHaveLength(2);
    expect(analyzeDemo(product("choc-bar"), sel("gluten")).verdict).toBe("trace");
  });

  it("detects nothing in the rice cakes for any selection, and never says 'safe'", () => {
    const r = analyzeDemo(product("rice-cakes"), sel("milk", "peanut", "gluten"));
    expect(r.verdict).toBe("clear");
    expect(JSON.stringify(r)).not.toMatch(/saug/i);
  });

  it("does not report allergens that were not selected", () => {
    const r = analyzeDemo(product("choc-bar"), sel("gluten"));
    expect(r.found).toHaveLength(0);
  });

  it("highlights only ingredients matching the selection", () => {
    const seg = product("oat-cookies").ingredients.find((s) => s.text.startsWith("sviestas"))!;
    expect(isHighlighted(seg, sel("milk"))).toBe(true);
    expect(isHighlighted(seg, sel("peanut"))).toBe(false);
  });
});
