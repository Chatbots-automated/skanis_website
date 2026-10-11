/**
 * Site-wide configuration. Everything comes from NEXT_PUBLIC_* environment
 * variables (see .env.example) so no production URL or contact detail is
 * hardcoded. Each variable has to be referenced literally for Next to inline it.
 */
const clean = (value: string | undefined) => (value ?? "").trim();

export const SITE_URL = clean(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

export const SITE_NAME = "Skanis";

export const CONTACT_EMAIL = clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL);

export const LEGAL = {
  name: clean(process.env.NEXT_PUBLIC_LEGAL_NAME),
  code: clean(process.env.NEXT_PUBLIC_LEGAL_CODE),
  address: clean(process.env.NEXT_PUBLIC_LEGAL_ADDRESS),
  privacyEmail: clean(process.env.NEXT_PUBLIC_PRIVACY_EMAIL),
};

/** Last time the legal texts were reviewed (shown on the legal pages). */
export const LEGAL_UPDATED = "2026-10-11";
