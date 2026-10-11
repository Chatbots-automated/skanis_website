import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/brand/Logo";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Puslapis nerastas – Skanis",
  description: "Tokio puslapio nėra. Grįžk į Skanis pradžios puslapį.",
  path: "/",
  noindex: true,
});

export default function NotFoundPage() {
  return (
    <section className="container-x grid min-h-[80svh] place-items-center pb-20 pt-32 text-center">
      <div>
        <LogoMark className="mx-auto h-20 w-auto text-forest/80" />
        <h1 className="mt-8 text-[clamp(2.2rem,5vw,3.6rem)] text-forest">Tokio puslapio nėra</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted">Nuoroda gali būti pasenusi arba neteisinga. Grįžk į pradžią ir tęsk iš ten.</p>
        <Button href="/" size="lg" className="mt-9">
          Į pradžią
        </Button>
      </div>
    </section>
  );
}
