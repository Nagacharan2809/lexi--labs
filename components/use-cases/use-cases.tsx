"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useCases } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/section-header";

const STATE_COLOR: Record<string, string> = {
  received: "#101114",
  done: "#2b5aa7",
  checked: "#1f7a6b",
  sent: "#d99136",
  verified: "#e8763a",
  queued: "#66696f",
};

/**
 * Section 05 — proof of work. Four test cases, each replaying a real
 * workflow through Input → Action → Decision → Execution → Result.
 */
export function UseCases() {
  const [caseIdx, setCaseIdx] = useState(0);
  const [runKey, setRunKey] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    io.observe(panel);
    return () => io.disconnect();
  }, []);

  const activeCase = useCases[caseIdx];

  return (
    <section
      id="use-cases"
      aria-label="Use cases"
      className="gutter relative mx-auto max-w-[1440px] scroll-mt-24 py-28 md:py-40"
    >
      {/* ambient spectral wash behind the runtime traces */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-56 top-24 h-[36rem] w-[36rem] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgb(233 238 247 / 0.9), transparent)",
        }}
      />
      <header>
        <Reveal>
          <h2 className="display-md text-[clamp(2.5rem,6vw,5.25rem)] uppercase text-ink">
            Put an AI employee
            <br />
            to work.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-6 max-w-[48ch] text-[1.02rem] leading-relaxed text-grey">
            Not industries — workflows. This is how an AI employee behaves
            against real business situations, decision by decision.
          </p>
        </Reveal>
      </header>

      <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] lg:gap-14">
        {/* case selector */}
        <div
          role="tablist"
          aria-label="Test cases"
          className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0"
        >
          {useCases.map((c, i) => {
            const selected = i === caseIdx;
            return (
              <button
                key={c.index}
                role="tab"
                id={`usecase-tab-${c.index}`}
                aria-selected={selected}
                aria-controls="usecase-panel"
                onClick={() => {
                  setCaseIdx(i);
                  setRunKey((k) => k + 1);
                }}
                className={cn(
                  "group relative flex shrink-0 items-center gap-4 overflow-hidden border border-line bg-paper px-5 py-4 text-left transition-colors duration-300 ease-brand lg:shrink lg:rounded-none lg:border-x-0 lg:border-b lg:border-t-0 lg:px-6 lg:py-5",
                  selected
                    ? "border-ink bg-ink text-paper lg:border-ink"
                    : "hover:border-ink/40",
                )}
              >
                {/* spectral accent — slides between tabs */}
                {selected ? (
                  <motion.span
                    layoutId="usecase-accent"
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="grad-rule absolute inset-x-0 bottom-0 h-[3px] lg:inset-y-0 lg:inset-x-auto lg:left-0 lg:h-auto lg:w-[3px]"
                  />
                ) : null}
                <span className="min-w-0">
                  <span className="block whitespace-nowrap text-[0.98rem] font-medium">
                    {c.name}
                  </span>
                  <span
                    className={cn(
                      "meta mt-1 block",
                      selected ? "text-paper/50" : "text-grey-2",
                    )}
                  >
                    {c.domain}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* simulation panel */}
        <div
          id="usecase-panel"
          role="tabpanel"
          aria-labelledby={`usecase-tab-${activeCase.index}`}
          ref={panelRef}
          className="min-w-0"
        >
          <div
            key={`${activeCase.index}-${runKey}-${reduced ? "r" : "m"}`}
            className="rounded-md border border-line bg-paper-2/50"
          >
            {/* panel header */}
            <div className="flex items-center justify-end gap-4 border-b border-line px-5 py-3.5 md:px-7">
              <button
                onClick={() => setRunKey((k) => k + 1)}
                className="meta rounded-xs px-2 py-1 text-grey transition-colors hover:text-ink"
                aria-label="Replay this workflow"
              >
                REPLAY ↻
              </button>
            </div>

            {/* stages */}
            <motion.ol
              initial="hidden"
              animate={inView || reduced ? "show" : "hidden"}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: reduced ? 0 : 0.55 } },
              }}
              className="m-0 px-5 py-6 md:px-7"
              role="list"
            >
              {activeCase.stages.map((s, i) => (
                <motion.li
                  key={activeCase.index + s.stage}
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                  className="relative grid grid-cols-[2.2rem_1fr] gap-x-4 pb-6"
                >
                  {/* connector rail */}
                  <div className="relative" aria-hidden="true">
                    <span
                      className="absolute left-1/2 top-[7px] z-10 block h-[7px] w-[7px] -translate-x-1/2 rounded-full ring-4 ring-paper-2"
                      style={{ backgroundColor: STATE_COLOR[s.state] }}
                    />
                    {i === activeCase.stages.length - 1 && inView ? (
                      <span
                        className="absolute left-1/2 top-[7px] block h-[7px] w-[7px] -translate-x-1/2 rounded-full"
                        style={{
                          backgroundColor: STATE_COLOR[s.state],
                          opacity: 0.45,
                          animation: "lexi-pulse 2.2s 0.6s var(--ease-brand) infinite",
                        }}
                      />
                    ) : null}
                    {i < activeCase.stages.length - 1 ? (
                      <motion.span
                        variants={{
                          hidden: { scaleY: 0 },
                          show: { scaleY: 1, transition: { duration: 0.5 } },
                        }}
                        className="absolute bottom-[-1.4rem] left-1/2 top-4 w-px origin-top bg-gradient-to-b from-ink/25 to-line"
                      />
                    ) : null}
                  </div>

                  {/* entry */}
                  <div className="min-w-0">
                    <p className="text-[0.98rem] leading-snug text-ink">
                      {s.entry}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>

            {/* footer linking out */}
            <div className="flex items-center justify-end border-t border-line px-5 py-3.5 md:px-7">
              <a
                href="#contact"
                className="meta link-underline text-ink"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
                }}
              >
                RUN THIS IN YOUR BUSINESS →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
