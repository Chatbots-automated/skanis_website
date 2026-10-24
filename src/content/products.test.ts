import { describe, expect, it } from "vitest";
import { DEFAULT_FILTERS, FILTERS, findHits, PRODUCTS, type FilterId } from "./products";

const byId = (id: string) => PRODUCTS.find((p) => p.id === id)!;

describe("hero demo products", () => {
  it("every flagged word points at a filter that exists", () => {
    const ids = new Set(FILTERS.map((f) => f.id));
    for (const p of PRODUCTS) for (const part of p.parts) if (part.filter) expect(ids.has(part.filter)).toBe(true);
  });

  it("with the default filters the cola and chips don't fit and the cookies do", () => {
    const on = new Set<FilterId>(DEFAULT_FILTERS);
    expect(findHits(byId("cola"), on).map((h) => h.text)).toEqual(["aspartamas", "acesulfamas K"]);
    expect(findHits(byId("traskuciai"), on)).toHaveLength(2);
    expect(findHits(byId("sausainiai"), on)).toHaveLength(0);
  });

  it("no filters means nothing is flagged", () => {
    for (const p of PRODUCTS) expect(findHits(p, new Set())).toHaveLength(0);
  });
});
