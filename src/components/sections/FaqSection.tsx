"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQ } from "@/content/faq";
import { cn } from "@/lib/utils";

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <section id="duk" aria-labelledby="faq-title" className="section-y bg-white">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            id="faq-title"
            eyebrow="DUK"
            title="Dažniausiai užduodami klausimai"
            lead="Atsakome atvirai, įskaitant tai, ko Skanis dar nemoka ar negali."
          />
        </Reveal>

        <Reveal>
          <div className="divide-y divide-line border-y border-line">
            {FAQ.map((item, i) => {
              const isOpen = open === i;
              const btnId = `${base}-q-${i}`;
              const panelId = `${base}-a-${i}`;
              return (
                <div key={item.q}>
                  <h3 className="text-base tracking-normal">
                    <button
                      id={btnId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex min-h-[4.5rem] w-full items-center justify-between gap-6 py-5 text-left text-[1.1rem] font-extrabold tracking-[-0.015em] text-forest transition-colors hover:text-leaf sm:text-[1.2rem]"
                    >
                      {item.q}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-300",
                          isOpen ? "rotate-45 border-forest bg-forest text-white" : "border-line bg-paper text-forest group-hover:border-forest/40",
                        )}
                      >
                        <Plus className="size-4" strokeWidth={2.5} />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    inert={!isOpen}
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-500 ease-out-soft motion-reduce:transition-none",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-6 leading-[1.75] text-muted">{item.a}</p>
                      {item.cta && (
                        <p className="-mt-2 pb-6">
                          <Link href={item.cta.href} className="font-bold text-leaf underline decoration-mint decoration-2 underline-offset-4">
                            {item.cta.label}
                          </Link>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
