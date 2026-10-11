import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { CONTACT_EMAIL } from "@/lib/site";
import { NAV_LINKS } from "./nav";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-x py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link href="/" aria-label="Skanis – į pradžią" className="inline-block rounded-lg text-xl">
              <Logo />
            </Link>
            <p className="mt-5 leading-relaxed text-muted">
              Skanis padeda greičiau perskaityti maisto produktų sudėtį ir pastebėti tau svarbius alergenus. Šiuo metu
              programėlė testuojama.
            </p>
          </div>

          <nav aria-label="Svetainės skyriai">
            <h2 className="text-sm font-extrabold tracking-normal text-forest">Svetainė</h2>
            <ul className="mt-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted transition-colors hover:text-forest">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/#registracija" className="text-muted transition-colors hover:text-forest">
                  Išbandyti pirmiesiems
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Teisinė informacija">
            <h2 className="text-sm font-extrabold tracking-normal text-forest">Teisinė informacija</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/privatumo-politika" className="text-muted transition-colors hover:text-forest">
                  Privatumo politika
                </Link>
              </li>
              <li>
                <Link href="/naudojimo-salygos" className="text-muted transition-colors hover:text-forest">
                  Naudojimo sąlygos
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-extrabold tracking-normal text-forest">Kontaktai</h2>
            {CONTACT_EMAIL ? (
              <p className="mt-4">
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-forest underline decoration-mint decoration-2 underline-offset-4">
                  {CONTACT_EMAIL}
                </a>
              </p>
            ) : (
              <p className="mt-4 leading-relaxed text-muted">
                Turi klausimų? Palik el. paštą{" "}
                <Link href="/#registracija" className="font-semibold text-forest underline decoration-mint decoration-2 underline-offset-4">
                  registracijos formoje
                </Link>{" "}
                ir susisieksime.
              </p>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>© {year} Skanis. Visos teisės saugomos.</p>
          <p className="max-w-xl md:text-right">
            Skanis nėra medicininė rekomendacija. Prieš vartodamas visada patikrink originalią produkto pakuotę.
          </p>
        </div>
      </div>
    </footer>
  );
}
