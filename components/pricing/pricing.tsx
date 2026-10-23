"use client";

import { Reveal } from "@/components/ui/section-header";
import { ArrowRight } from "@/components/ui/controls";
import { plans } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "framer-motion";

/**
 * Section 07 — pricing. An editorial ledger, not a card row: plans as
 * rows with clear ranges, an honest implementation line and the usage
 * note a finance team would actually read.
 */
export function Pricing() {
  const reduced = useReducedMotion();

  const goContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document
      .getElementById("contact")
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <section
      id="pricing"
      aria-label="Pricing"
      className="gutter relative mx-auto max-w-[1440px] scroll-mt-24 py-28 md:py-40"
    >
      {/* ambient spectral wash behind the ledger */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-56 top-16 h-[34rem] w-[34rem] rounded-full opacity-55 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgb(250 234 223 / 0.9), transparent)",
        }}
      />
        <header className="relative">
          <Reveal>
            <h2 className="display-md text-[clamp(2.5rem,6vw,5.25rem)] uppercase text-ink">
              Build your workforce.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-[48ch] text-[1.02rem] leading-relaxed text-grey">
              Clear packages, honest setup costs, no pretend-infinity plans.
              You pay for deployed employees and the work of launching them.
            </p>
          </Reveal>
        </header>

      {/* ledger */}
      <div className="mt-14 md:mt-20">
        {plans.map((plan, i) => (
          <Reveal key={plan.name} delay={i * 0.06}>
            <article
              className={cn(
                "group relative isolate grid grid-cols-1 gap-x-10 gap-y-4 overflow-hidden border-b border-line py-8 transition-colors duration-300 hover:bg-paper-2/50 md:grid-cols-[minmax(120px,220px)_minmax(0,1fr)_minmax(0,1.6fr)_auto] md:items-center",
                plan.featured && "md:my-2 md:border-y md:border-line-2",
              )}
            >
              {/* spectral fill — sweeps up over the row on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 translate-y-[101%] opacity-0 transition-[transform,opacity] duration-700 ease-brand group-hover:translate-y-0 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(120deg, rgb(226 235 248 / 0.75) 0%, rgb(247 244 238 / 0.25) 42%, rgb(250 232 216 / 0.75) 100%)",
                }}
              />
              {/* gradient hairline ignites on hover */}
              <span
                aria-hidden="true"
                className="grad-rule absolute inset-x-0 bottom-[-1px] h-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              {plan.featured ? (
                <span
                  aria-hidden="true"
                  className="grad-rule-live absolute inset-x-0 top-0 hidden h-[2px] md:block"
                />
              ) : null}
              <div className="flex items-center gap-3 md:block">
                <h3
                  className={cn(
                    "display-md text-[clamp(1.5rem,2.4vw,2rem)] uppercase text-ink",
                  )}
                >
                  {plan.name}
                </h3>
                {plan.featured ? (
                  <span className="meta ms-2 inline-block rounded-full bg-orange px-2.5 py-1 text-[0.6rem] text-paper shadow-[0_0_0_4px_rgb(232_118_58/0.14)] md:ms-0 md:mt-2">
                    MOST DEPLOYED
                  </span>
                ) : null}
              </div>

              {/* price */}
              <div>
                <p className="display-md grad-spectral whitespace-nowrap text-[clamp(1.6rem,3vw,2.4rem)]">
                  {plan.price}
                  <span className="ml-2 align-middle font-sans text-[0.8rem] font-normal tracking-normal text-grey">
                    {plan.cadence}
                  </span>
                </p>
                <p className="mt-1 max-w-[40ch] text-[0.92rem] leading-snug text-grey">
                  {plan.audience}
                </p>
              </div>

              {/* includes */}
              <ul
                className="grid gap-1.5 text-[0.9rem] text-ink-2 sm:grid-cols-2"
                aria-label={`${plan.name} includes`}
              >
                {plan.includes.map((inc) => (
                  <li key={inc} className="flex items-start gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] block h-1 w-1 shrink-0 rounded-full"
                      style={{
                        backgroundColor: plan.featured ? "#e8763a" : "#101114",
                      }}
                    />
                    {inc}
                  </li>
                ))}
              </ul>

              {/* cta */}
              <div className="md:justify-self-end">
                <a
                  href="#contact"
                  onClick={goContact}
                  className="group/cta meta relative inline-flex items-center gap-3 overflow-hidden rounded-xs border border-line-2 py-3 pl-4 pr-3.5 transition-colors duration-200 ease-brand hover:border-transparent hover:text-paper"
                >
                  {/* colour sweep — replaces the fill on hover */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 translate-y-[101%] bg-gradient-to-tr from-orange-deep via-orange to-ember transition-transform duration-[420ms] ease-brand group-hover/cta:translate-y-0"
                  />
                  <span className="relative z-10">{plan.cta}</span>
                  <span className="relative z-10">
                    <ArrowRight />
                  </span>
                </a>
              </div>
            </article>
          </Reveal>
        ))}

        {/* supplementary rows */}
        <div className="grid gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-3">
          <div className="group relative isolate overflow-hidden bg-paper p-6 md:p-7">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 translate-y-[101%] opacity-0 transition-[transform,opacity] duration-700 ease-brand group-hover:translate-y-0 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(120deg, rgb(226 235 248 / 0.8) 0%, rgb(247 244 238 / 0.3) 55%, rgb(250 232 216 / 0.7) 100%)",
              }}
            />
            <p className="display-md text-[1.5rem] text-ink">
              ₹50,000 – ₹3,00,000+
            </p>
            <p className="mt-2 max-w-[34ch] text-[0.88rem] leading-relaxed text-grey">
              One-time. Scales with integrations, knowledge depth and
              deployment complexity — quoted after discovery.
            </p>
          </div>
          <div className="group relative isolate overflow-hidden bg-paper p-6 md:p-7">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 translate-y-[101%] opacity-0 transition-[transform,opacity] duration-700 ease-brand group-hover:translate-y-0 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(120deg, rgb(250 232 216 / 0.8) 0%, rgb(247 244 238 / 0.3) 45%, rgb(226 235 248 / 0.65) 100%)",
              }}
            />
            <p className="display-md text-[1.5rem] text-ink">
              Metered or included
            </p>
            <p className="mt-2 max-w-[34ch] text-[0.88rem] leading-relaxed text-grey">
              Voice, LLM and third-party API usage is billed separately or
              included within defined limits on your plan.
            </p>
          </div>
          <div className="group relative isolate overflow-hidden bg-ink p-6 text-paper md:p-7">
            <span
              aria-hidden="true"
              className="grad-rule-live absolute inset-x-0 top-0 h-[2px]"
            />
            <p className="display-md text-[1.5rem]">
              Custom deployment
            </p>
            <p className="mt-2 max-w-[34ch] text-[0.88rem] leading-relaxed text-white/60">
              Multi-employee workforces, private deployment, SLAs and data
              residency. Pricing scoped to the build.
            </p>
            <a
              href="#contact"
              onClick={goContact}
              className="group/cta meta mt-5 inline-flex items-center gap-3 text-white"
            >
              Talk to sales
              <ArrowRight />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
