"use client";

import { useEffect, useRef } from "react";
import { Reveal } from "@/components/ui/section-header";
import { gsap } from "@/lib/motion";

const TRADITIONAL = [
  "Answers",
  "Waits",
  "Requires prompting",
  "Limited context",
  "Manual execution",
];

const LEXI_LIST = [
  "Understands",
  "Plans",
  "Uses tools",
  "Maintains context",
  "Executes",
  "Verifies",
  "Escalates",
];

const PRINCIPLES = [
  {
    index: "01",
    title: "Execution",
    line: "AI that takes action.",
    detail: "Sending the message, updating the CRM, placing the call — not drafting a reply for a human to send.",
    span: "lg:col-span-4",
    featured: true,
  },
  {
    index: "02",
    title: "Context",
    line: "AI that understands the business.",
    detail: "Policies, history, preferences and playbook — held across every task.",
    span: "lg:col-span-2",
    featured: false,
  },
  {
    index: "03",
    title: "Control",
    line: "Permissions and approvals.",
    detail: "Humans define the boundaries. Sensitive actions require a person.",
    span: "lg:col-span-2",
    featured: false,
  },
  {
    index: "04",
    title: "Reliability",
    line: "Verification and auditability.",
    detail: "Actions are checked against defined rules and every decision leaves a record.",
    span: "lg:col-span-2",
    featured: false,
  },
  {
    index: "05",
    title: "Integration",
    line: "Works with existing tools.",
    detail: "The CRM and the inbox you already own — no parallel universe to maintain.",
    span: "lg:col-span-2",
    featured: false,
  },
  {
    index: "06",
    title: "Measurement",
    line: "Every action can be evaluated.",
    detail: "Success is defined per task: booked calls, resolved tickets, recovered revenue. Measured continuously.",
    span: "lg:col-span-6",
    featured: false,
  },
];

/**
 * Section 04 — the trust argument. A scrubbed editorial confrontation:
 * the traditional column recedes while the Lexi column activates line
 * by line, followed by the operating principles in an unequal bento.
 */
export function WhyLexi() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        /* centre rule grows */
        gsap.fromTo(
          "[data-divider]",
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
              trigger: "[data-comparison]",
              start: "top 70%",
              end: "bottom 70%",
              scrub: 0.4,
            },
          },
        );

        /* traditional column recedes */
        gsap.fromTo(
          "[data-traditional]",
          { opacity: 1, filter: "grayscale(0)" },
          {
            opacity: 0.14,
            filter: "grayscale(1)",
            ease: "none",
            scrollTrigger: {
              trigger: "[data-comparison]",
              start: "top 60%",
              end: "center 40%",
              scrub: 0.4,
            },
          },
        );

        /* Lexi lines activate in sequence */
        const lines = gsap.utils.toArray<HTMLElement>("[data-lexi-line]");
        const markers = gsap.utils.toArray<HTMLElement>("[data-lexi-marker]");
        gsap.fromTo(
          lines,
          { opacity: 0.04, x: 42 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: "[data-comparison]",
              start: "top 62%",
              end: "center 52%",
              scrub: 0.5,
            },
          },
        );
        gsap.fromTo(
          markers,
          { scale: 0.08, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.32,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "[data-comparison]",
              start: "top 62%",
              end: "center 52%",
              scrub: 0.5,
            },
          },
        );
      }, rootRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      id="why-lexi"
      aria-label="Why Lexi"
      className="relative scroll-mt-24 overflow-clip border-y border-line bg-paper py-28 md:py-40"
    >
      {/* ambient spectral wash across the header — blue drifting into ember */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] opacity-90 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        style={{
          background:
            "linear-gradient(112deg, rgb(213 226 245 / 0.9) 0%, rgb(233 238 247 / 0.35) 30%, rgb(250 240 229 / 0) 52%, rgb(249 214 188 / 0.65) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-[12%] h-[30rem] w-[30rem] rounded-full opacity-80 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgb(219 232 248 / 0.85), transparent)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-[8%] h-[26rem] w-[26rem] rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgb(250 226 205 / 0.8), transparent)",
        }}
      />
      <div ref={rootRef} className="relative gutter mx-auto max-w-[1440px]">
        <header>
          <Reveal>
            <h2 className="display-md text-[clamp(2.5rem,6vw,5.25rem)] uppercase text-ink">
              Not another <span className="grad-spectral">chatbot.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 text-[1.02rem] leading-relaxed text-grey">
              Lexi is built for execution. A chatbot reports on the world; an
              AI employee operates inside it.
            </p>
          </Reveal>
        </header>

        {/* editorial comparison */}
        <div
          data-comparison
          className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-[minmax(0,1fr)_2px_minmax(0,1.2fr)] lg:gap-0"
        >
          {/* traditional */}
          <div data-traditional className="lg:pr-10">
            <ul className="m-0 border-t border-line" role="list">
              {TRADITIONAL.map((item) => (
                <li
                  key={item}
                  className="flex items-baseline justify-between gap-4 border-b border-line py-4 text-[1.02rem] text-grey"
                >
                  <span>{item}</span>
                </li>
              ))}
              <li className="border-b border-line py-4 text-[1.02rem] text-grey-2/60">
                —
              </li>
              <li className="border-b border-line py-4 text-[1.02rem] text-grey-2/60">
                —
              </li>
            </ul>
          </div>

          {/* growing rule — drawn as the visitor reads */}
          <div className="relative hidden lg:block" aria-hidden="true">
            <div className="absolute inset-y-0 left-0 w-px bg-line" />
            <div
              data-divider
              className="grad-rule absolute inset-y-0 left-0 w-[2px]"
            />
          </div>

          {/* Lexi */}
          <div className="lg:pl-10">
            <ul className="m-0 border-t border-ink/25" role="list">
              {LEXI_LIST.map((item, i) => (
                <li
                  key={item}
                  data-lexi-line
                  className="flex items-center justify-between gap-4 border-b border-line/80 py-4 transition-[padding] duration-300 ease-brand hover:pl-2"
                >
                  <span className="text-[1.06rem] font-medium text-ink">
                    {item}
                  </span>
                  <span
                    data-lexi-marker
                    aria-hidden="true"
                    className="relative flex h-4 w-4 items-center justify-center rounded-full"
                  >
                    <span
                      className="absolute inset-0 rounded-full bg-orange/45"
                      style={{
                        animation: `lexi-pulse 2.4s ${i * 0.28}s var(--ease-brand) infinite`,
                      }}
                    />
                    <span className="block h-2 w-2 rounded-full bg-orange" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* principles */}
        <div className="mt-24 md:mt-32">
          <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-6">
            {PRINCIPLES.map((p) => (
              <article
                key={p.index}
                className={`group relative overflow-hidden p-7 transition-colors duration-300 md:p-9 ${p.span} ${
                  p.featured
                    ? "bg-ink text-paper hover:bg-ink-2"
                    : "bg-paper hover:bg-paper-2"
                }`}
              >
                {/* spectral fill — sweeps up over the card on hover */}
                {!p.featured ? (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 translate-y-[101%] opacity-0 transition-[transform,opacity] duration-700 ease-brand group-hover:translate-y-0 group-hover:opacity-100"
                    style={{
                      background:
                        "linear-gradient(135deg, #e9eef7 0%, #f7f4ee 45%, #f8e2d0 100%)",
                    }}
                  />
                ) : null}
                {p.featured ? (
                  <span
                    aria-hidden="true"
                    className="grad-rule-live absolute inset-x-0 top-0 h-[3px]"
                  />
                ) : null}
                <div className="relative z-10 flex justify-end">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-6 rounded-full transition-all duration-300 ease-brand group-hover:w-10"
                    style={{
                      backgroundColor: p.featured ? "#e8763a" : "#101114",
                    }}
                  />
                </div>
                <h3
                  className={`display-md relative z-10 mt-10 uppercase ${
                    p.featured
                      ? "text-[clamp(1.6rem,2.6vw,2.4rem)] text-paper"
                      : "text-[1.2rem] text-ink"
                  }`}
                >
                  {p.title}
                </h3>
                <p
                  className={`relative z-10 mt-2 text-[0.98rem] font-medium ${
                    p.featured ? "text-white/85" : "text-ink-2"
                  }`}
                >
                  {p.line}
                </p>
                <p
                  className={`relative z-10 mt-2 max-w-[40ch] text-[0.88rem] leading-relaxed ${
                    p.featured ? "text-white/55" : "text-grey"
                  }`}
                >
                  {p.detail}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
