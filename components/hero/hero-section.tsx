"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SpectralFieldBackground from "./spectral-field";
import { Button } from "@/components/ui/controls";
import { gsap, EASE_BRAND } from "@/lib/motion";

const ENTRANCE = [0.22, 1, 0.36, 1] as const;

function MaskedLine({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <span className={`block overflow-hidden pb-[0.08em] ${className ?? ""}`}>
      <motion.span
        className="block will-change-transform"
        initial={reduced ? false : { y: "112%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease: ENTRANCE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Hero — the optical signature. Prismatic Slats fills the viewport,
 * typography sits directly in the still centre of the glass field.
 */
export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /* scroll choreography: the composition recedes into the field */
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.to(contentRef.current, {
          yPercent: -36,
          scale: 0.9,
          opacity: 0,
          ease: EASE_BRAND,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "100% top",
            scrub: 0.4,
          },
        });
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  const scrollToWorkforce = () =>
    document
      .getElementById("employees")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Lexi Labs — AI employees that do the work"
      className="relative flex h-[100svh] min-h-[620px] flex-col overflow-hidden"
    >
      <SpectralFieldBackground className="absolute inset-0" />

      {/* central composition */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 text-center"
      >
        <h1 className="display text-[clamp(2.1rem,8.4vw,7.25rem)] uppercase text-white">
          <MaskedLine delay={0.3}>AI EMPLOYEES</MaskedLine>
          <MaskedLine delay={0.42}>THAT DO THE WORK.</MaskedLine>
        </h1>

        <motion.p
          className="mt-8 max-w-[46ch] text-balance text-[0.98rem] leading-relaxed text-white/85 md:text-[1.0625rem]"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.62, ease: ENTRANCE }}
        >
          Lexi Labs builds AI employees that execute real business workflows
          across sales, marketing, support and operations.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.76, ease: ENTRANCE }}
        >
          <Button href="#contact" arrow variant="paper">
            Build Your AI Workforce
          </Button>
          <Button href="#how-it-works" variant="light">
            See How It Works
          </Button>
        </motion.div>
      </div>

      {/* closing line — hands over to the workforce gallery */}
      <motion.button
        onClick={scrollToWorkforce}
        className="group relative z-10 flex w-full items-center justify-center pb-7"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        aria-label="Meet the workforce — go to AI employees"
      >
        <span className="display edge-readable flex items-center gap-4 text-[clamp(1.05rem,2.2vw,1.8rem)] uppercase text-white">
          Meet the workforce
          <svg
            viewBox="0 0 20 10"
            className="h-2.5 w-5 transition-transform duration-300 ease-brand group-hover:translate-x-1.5"
            aria-hidden="true"
          >
            <path d="M0 5h18M14 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" fill="none" />
          </svg>
        </span>
      </motion.button>
    </section>
  );
}
