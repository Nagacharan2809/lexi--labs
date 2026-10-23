"use client";

import { Reveal } from "@/components/ui/section-header";

const ARCHITECTURE = [
  { label: "BUSINESS", note: "systems & intent" },
  { label: "LEXI AI EMPLOYEE", note: "role, knowledge, permissions" },
  { label: "FLEEN", note: "execution engine", featured: true },
  { label: "TOOLS / SYSTEMS", note: "CRM, email, voice, data" },
  { label: "ACTION", note: "verified work performed" },
  { label: "RESULT", note: "measured, auditable outcome" },
];

/**
 * Section 06 — who is building this, and what Fleen actually is.
 * Kept editorial and brief: a thesis, a founder voice and the stack.
 */
export function AboutSection() {
  return (
    <section
      id="about"
      aria-label="About Lexi Labs"
      className="relative scroll-mt-24 overflow-clip border-y border-line bg-paper"
    >
      {/* ambient spectral washes, mirrored from the manifesto above */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-44 -right-48 h-[40rem] w-[40rem] rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgb(250 234 223 / 0.9), transparent)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-52 bottom-10 h-[36rem] w-[36rem] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgb(233 238 247 / 0.9), transparent)",
        }}
      />
      <div className="relative gutter mx-auto max-w-[1440px] py-28 md:py-40">
        <header>
          <Reveal>
            <h2 className="display-md text-[clamp(2.5rem,6vw,5.25rem)] uppercase text-ink">
              We&apos;re building
              <br />
              the AI workforce.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-[52ch] text-[1.05rem] leading-relaxed text-ink-2">
              A company is only its people. We&apos;re adding the ones that never
              sleep — AI employees that handle the operational work, connected
              to the systems a business already runs on.
            </p>
          </Reveal>
        </header>

        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <div className="space-y-6 text-[1.05rem] leading-relaxed text-ink-2">
              <p>
                Lexi Labs exists to make AI useful beyond conversation. The
                last two years proved models can talk; almost none of that
                intelligence reached the workflows where businesses actually
                lose hours every day.
              </p>
              <p>
                So we build AI employees — named roles with knowledge,
                permissions and accountability, deployed onto the Fleen
                execution engine. An employee qualifies a lead, resolves a
                ticket, follows up a pipeline, recovers a payment: the same
                verbs a competent team member performs, performed
                continuously and auditably.
              </p>
              <p>
                We are engineers and operators who spent years doing the work
                these employees now do — that experience is why the platform
                looks like business operations, not chat software.
              </p>
            </div>
          </Reveal>

          {/* founder voice */}
          <Reveal delay={0.12}>
            <aside className="border-t-2 border-ink pt-6">
              <p className="text-[0.98rem] leading-relaxed text-ink-2">
                Small by design. Product, deployment and success operated by
                the people who build the engine — every customer gets the
                same standard of craft.
              </p>
            </aside>
          </Reveal>
        </div>

        {/* Fleen architecture */}
        <div className="mt-20 md:mt-28">
          <Reveal>
            <div className="border-t border-line pt-6">
              <h3 className="display-md text-[1.4rem] uppercase text-ink md:text-[1.75rem]">
                Fleen — the execution foundation
              </h3>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ol
              role="list"
              aria-label="From business to result: Lexi architecture"
              className="mt-8 flex snap-x flex-col gap-1.5 overflow-x-auto pb-3 font-mono lg:flex-row lg:flex-nowrap lg:items-stretch lg:gap-0 lg:pb-0"
            >
              {ARCHITECTURE.map((node, i) => (
                <li
                  key={node.label}
                  className="snap-start relative min-w-0 shrink-0 transition-transform duration-300 ease-brand hover:-translate-y-0.5 lg:shrink lg:min-w-0 lg:flex-1"
                >
                  {node.featured ? (
                    <span
                      aria-hidden="true"
                      className="grad-rule-live absolute -inset-px rounded-sm"
                    />
                  ) : null}
                  <div
                    className={
                      node.featured
                        ? "relative rounded-sm bg-ink px-5 py-5 text-paper shadow-soft"
                        : "relative px-5 py-5"
                    }
                    style={
                      node.featured
                        ? undefined
                        : { borderTop: "1px solid var(--color-line)" }
                    }
                  >
                    <p className="whitespace-nowrap text-[1.02rem] font-medium tracking-[0.04em]">
                      {node.label}
                    </p>
                    <p
                      className="meta mt-1.5"
                      style={{
                        color: node.featured ? "#c8c7c0" : "var(--color-grey)",
                      }}
                    >
                      {node.note}
                    </p>
                    {i < ARCHITECTURE.length - 1 ? (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 20 12"
                        className="absolute -right-3 top-1/2 hidden h-3 w-5 -translate-y-1/2 text-grey lg:block"
                      >
                        <line
                          x1="0"
                          y1="6"
                          x2="15"
                          y2="6"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeDasharray="4 3"
                        />
                        <path
                          d="M13 2.5 17 6l-4 3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                      </svg>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-8 max-w-[58ch] text-[0.95rem] leading-relaxed text-grey">
              Fleen handles the parts that must never be improvised: memory
              across tasks, reasoning over context, tool execution, action
              verification and human escalation. Every Lexi employee runs on
              it; every customer gets its guarantees.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
