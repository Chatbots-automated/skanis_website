"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2, Mail } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { cn } from "@/lib/utils";
import {
  encodeSignup,
  sourceFromSearch,
  validateConsent,
  validateEmail,
} from "@/lib/signup";

const IS_DEV = process.env.NODE_ENV === "development";

type Status = "idle" | "submitting" | "success" | "error";

export function SignupSection() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [botField, setBotField] = useState("");
  const [errors, setErrors] = useState<{ email?: string; consent?: string }>({});
  const [status, setStatus] = useState<Status>("idle");
  const [sentTo, setSentTo] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const submitting = status === "submitting";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const nextErrors = { email: validateEmail(email) ?? undefined, consent: validateConsent(consent) ?? undefined };
    setErrors(nextErrors);
    if (nextErrors.email) return emailRef.current?.focus();
    if (nextErrors.consent) return consentRef.current?.focus();

    setStatus("submitting");
    try {
      // Netlify Forms picks this POST up from the static "beta-signup" form in public/__forms.html.
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeSignup({ email, platform: "", consent, source: sourceFromSearch(window.location.search), botField }),
      });
      // Only a real 2xx counts. The dev server has no form handler, so it can never report success.
      if (!res.ok || IS_DEV) throw new Error(`Form endpoint answered ${res.status}`);
      setSentTo(email.trim());
      setStatus("success");
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="registracija" aria-labelledby="signup-title" className="bg-white px-3 pb-3 sm:px-4 sm:pb-4">
      <div data-on-dark className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-16 text-white sm:px-12 lg:rounded-[2.75rem] lg:px-16 lg:py-24">
        <div aria-hidden="true" className="absolute -right-32 -top-32 size-[28rem] rounded-full bg-grape/60 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-40 -left-24 size-[24rem] rounded-full bg-mint/25 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_26rem] lg:items-center lg:gap-20">
          <Reveal>
            <h2 id="signup-title" className="display text-[clamp(2.6rem,6vw,5.25rem)]">
              Išbandyk
              <br />
              <span className="text-mint">pirmas.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
              Palik el. paštą ir gauk kvietimą į testavimo versiją, kai tik ji bus paruošta. Nemokamai ir be įsipareigojimų.
            </p>
            <StoreButtons tone="light" align="start" className="mt-8" />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[1.75rem] bg-white p-6 text-ink shadow-lift sm:p-8">
                <AnimatePresence mode="wait" initial={false}>
                  {status === "success" ? (
                    <m.div
                      key="success"
                      ref={successRef}
                      tabIndex={-1}
                      role="status"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="py-6 text-center outline-none"
                    >
                      <span className="mx-auto grid size-16 place-items-center rounded-full bg-mint-soft text-ink">
                        <CheckCircle2 className="size-8" strokeWidth={2.2} />
                      </span>
                      <h3 className="mt-6 text-2xl text-ink">Ačiū! Esi sąraše.</h3>
                      <p className="mx-auto mt-3 max-w-xs leading-relaxed text-muted">
                        Užregistravome <strong className="break-all text-ink">{sentTo}</strong>. Parašysime, kai atsiras vietų testavimui.
                      </p>
                    </m.div>
                  ) : (
                    <m.form
                      key="form"
                      name="beta-signup"
                      method="POST"
                      noValidate
                      onSubmit={onSubmit}
                      exit={{ opacity: 0, y: -8 }}
                      aria-describedby={status === "error" ? "signup-error" : undefined}
                    >
                      <input type="hidden" name="form-name" value="beta-signup" />
                      {/* honeypot: hidden from people, tempting to bots */}
                      <p className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                        <label>
                          Šio lauko nepildyk
                          <input name="bot-field" tabIndex={-1} autoComplete="off" value={botField} onChange={(e) => setBotField(e.target.value)} />
                        </label>
                      </p>

                      <div>
                        <label htmlFor="signup-email" className="mb-2 block text-sm font-extrabold text-ink">
                          El. paštas
                        </label>
                        <div className="relative">
                          <Mail aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-faint" />
                          <input
                            ref={emailRef}
                            id="signup-email"
                            name="email"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            maxLength={254}
                            placeholder="vardas@pastas.lt"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (errors.email) setErrors((x) => ({ ...x, email: undefined }));
                            }}
                            onBlur={() => email && setErrors((x) => ({ ...x, email: validateEmail(email) ?? undefined }))}
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? "signup-email-error" : undefined}
                            className={cn(
                              "h-14 w-full rounded-2xl border bg-paper pl-12 pr-4 text-base text-ink outline-none transition-[border-color,box-shadow] placeholder:text-faint focus:border-grape focus:shadow-[0_0_0_4px_rgb(163_232_208/0.6)]",
                              errors.email ? "border-danger" : "border-line",
                            )}
                          />
                        </div>
                        {errors.email && (
                          <p id="signup-email-error" role="alert" className="mt-2 flex items-start gap-1.5 text-sm font-semibold text-danger">
                            <AlertCircle className="mt-0.5 size-4 shrink-0" />
                            {errors.email}
                          </p>
                        )}
                      </div>


                      <div className="mt-6">
                        <label className="flex cursor-pointer items-start gap-3.5">
                          <input
                            ref={consentRef}
                            type="checkbox"
                            name="consent"
                            checked={consent}
                            onChange={(e) => {
                              setConsent(e.target.checked);
                              if (errors.consent) setErrors((x) => ({ ...x, consent: undefined }));
                            }}
                            aria-invalid={!!errors.consent}
                            aria-describedby={errors.consent ? "signup-consent-error" : undefined}
                            className="peer sr-only"
                          />
                          <span
                            aria-hidden="true"
                            className={cn(
                              "mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border-2 bg-white text-transparent transition-all peer-checked:border-grape peer-checked:bg-grape peer-checked:text-white peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-grape",
                              errors.consent ? "border-danger" : "border-ink/30",
                            )}
                          >
                            <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 8.5l3.2 3L13 4.5" />
                            </svg>
                          </span>
                          <span className="text-sm leading-relaxed text-ink/80">
                            Sutinku, kad Skanis naudotų mano el. paštą susisiekti dėl testavimo. Daugiau informacijos{" "}
                            <Link
                              href="/privatumo-politika"
                              target="_blank"
                              rel="noopener"
                              className="font-bold text-grape underline decoration-grape/30 decoration-2 underline-offset-2"
                            >
                              privatumo politikoje
                            </Link>
                            .
                          </span>
                        </label>
                        {errors.consent && (
                          <p id="signup-consent-error" role="alert" className="mt-2 flex items-start gap-1.5 text-sm font-semibold text-danger">
                            <AlertCircle className="mt-0.5 size-4 shrink-0" />
                            {errors.consent}
                          </p>
                        )}
                      </div>

                      {status === "error" && (
                        <p
                          id="signup-error"
                          role="alert"
                          className="mt-6 flex items-start gap-2.5 rounded-2xl border border-danger-line bg-danger-soft p-4 text-sm leading-relaxed text-danger"
                        >
                          <AlertCircle className="mt-0.5 size-4 shrink-0" />
                          <span>
                            <strong>Nepavyko išsiųsti.</strong> Patikrink interneto ryšį ir bandyk dar kartą. Jei klaida kartojasi, pabandyk vėliau.
                            {IS_DEV && " (Vietinėje aplinkoje forma neveikia: ją apdoroja tik Netlify.)"}
                          </span>
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="mt-7 inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-ink px-8 text-base font-bold text-white shadow-[0_10px_24px_-10px_rgb(17_17_17/0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-grape active:scale-[0.99] disabled:translate-y-0 disabled:opacity-80"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                            Siunčiama…
                          </>
                        ) : (
                          "Gauti kvietimą"
                        )}
                      </button>
                      <p className="mt-4 text-center text-xs leading-relaxed text-muted">
                        Registracija nieko nekainuoja ir neįpareigoja. Neprašome nieko, išskyrus el. paštą.
                      </p>
                    </m.form>
                  )}
                </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
