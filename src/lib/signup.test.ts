import { describe, expect, it } from "vitest";
import { encodeSignup, sourceFromSearch, validateConsent, validateEmail } from "./signup";

describe("validateEmail", () => {
  it("accepts ordinary addresses", () => {
    expect(validateEmail("vardas@pastas.lt")).toBeNull();
    expect(validateEmail("  a.b+c@mail.example.com ")).toBeNull();
  });
  it("rejects empty and malformed values", () => {
    expect(validateEmail("")).not.toBeNull();
    expect(validateEmail("vardas")).not.toBeNull();
    expect(validateEmail("vardas@")).not.toBeNull();
    expect(validateEmail("vardas@pastas")).not.toBeNull();
    expect(validateEmail("var das@pastas.lt")).not.toBeNull();
    expect(validateEmail("a@b..lt")).not.toBeNull();
  });
});

describe("validateConsent", () => {
  it("requires the box to be ticked", () => {
    expect(validateConsent(false)).not.toBeNull();
    expect(validateConsent(true)).toBeNull();
  });
});

describe("sourceFromSearch", () => {
  it("keeps a safe channel name", () => {
    expect(sourceFromSearch("?src=FB-ad_1")).toBe("fb-ad_1");
  });
  it("drops anything else", () => {
    expect(sourceFromSearch("?src=<script>")).toBe("");
    expect(sourceFromSearch("")).toBe("");
  });
});

describe("encodeSignup", () => {
  it("includes the Netlify form name and trims the email", () => {
    const body = new URLSearchParams(encodeSignup({ email: " a@b.lt ", platform: "iphone", consent: true, source: "x", botField: "" }));
    expect(body.get("form-name")).toBe("beta-signup");
    expect(body.get("email")).toBe("a@b.lt");
    expect(body.get("platform")).toBe("iphone");
    expect(body.get("consent")).toBe("taip");
    expect(body.get("bot-field")).toBe("");
  });
});
