import { Plus } from "lucide-react";
import { FAQ } from "@/content/faq";

/** Short FAQ on native <details>, so it works without JavaScript and every answer is in the HTML. */
export function Faq() {
  return (
    <section id="duk" aria-labelledby="faq-title" className="bg-paper py-20 lg:py-32">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <h2 id="faq-title" className="display text-[clamp(2.3rem,5vw,4rem)] text-ink">
          Dažni
          <br />
          klausimai<span className="text-brand">.</span>
        </h2>
        <div className="border-t border-line">
          {FAQ.map((item) => (
            <details key={item.q} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-lg font-bold text-ink [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft text-brand transition-[transform,background-color,color] duration-300 group-open:rotate-45 group-open:bg-brand group-open:text-white">
                  <Plus className="size-4" strokeWidth={2.5} />
                </span>
              </summary>
              <p className="max-w-2xl pb-6 pr-12 leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
