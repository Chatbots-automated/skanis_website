import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { CONTACT_EMAIL } from "@/lib/site";

const LEGAL_LINKS = [
  { label: "Privatumo politika", href: "/privatumo-politika" },
  { label: "Naudojimo sąlygos", href: "/naudojimo-salygos" },
  { label: "Duomenų ištrynimas", href: "/duomenu-istrynimas" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-white" data-on-dark>
      <div className="container-x py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <Link href="/" aria-label="Skanis – į pradžią" className="inline-block rounded-lg text-lg">
            <Logo tone="light" />
          </Link>
          <p className="text-sm font-extrabold tracking-[0.28em] text-mint">SKENUOK | PAŽINK | VARTOK</p>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Teisinė informacija">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
              {CONTACT_EMAIL && (
                <li>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-white">
                    {CONTACT_EMAIL}
                  </a>
                </li>
              )}
            </ul>
          </nav>
          <p>© {year} Skanis</p>
        </div>
        <p className="mt-4 max-w-2xl text-xs leading-relaxed text-white/40">
          Skanis nėra medicininė rekomendacija. Prieš vartodamas visada patikrink originalią produkto pakuotę.
        </p>
      </div>
    </footer>
  );
}
