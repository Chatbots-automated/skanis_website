/** Pure helpers for the beta signup form (kept separate so they can be unit-tested). */

export const FORM_NAME = "beta-signup";

export type Platform = "" | "android" | "iphone";

// Pragmatic check: something@something.tld, no spaces. The server (Netlify) still receives the raw value.
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export function validateEmail(value: string): string | null {
  const email = value.trim();
  if (!email) return "Įrašyk el. pašto adresą.";
  if (email.length > 254 || !EMAIL_RE.test(email)) return "Patikrink el. pašto adresą, atrodo, jis neteisingas.";
  return null;
}

export function validateConsent(checked: boolean): string | null {
  return checked ? null : "Pažymėk sutikimą, kad galėtume tau parašyti.";
}

/** Marketing channel from `?src=` (letters, digits, `_ . -`, up to 64 characters), else empty. */
export function sourceFromSearch(search: string): string {
  const raw = new URLSearchParams(search).get("src") ?? "";
  return /^[a-z0-9_.-]{1,64}$/i.test(raw) ? raw.toLowerCase() : "";
}

/** Body for Netlify Forms (application/x-www-form-urlencoded). */
export function encodeSignup(values: { email: string; platform: Platform; consent: boolean; source: string; botField: string }) {
  return new URLSearchParams({
    "form-name": FORM_NAME,
    "bot-field": values.botField,
    email: values.email.trim(),
    platform: values.platform,
    consent: values.consent ? "taip" : "",
    source: values.source,
  }).toString();
}
