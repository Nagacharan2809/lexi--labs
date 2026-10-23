"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * One shared entrance language site-wide: a short, decelerating rise,
 * respectful of reduced-motion. Used by section content on first entry.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-12% 0px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeader({
  index,
  label,
  headline,
  support,
  className,
  align = "left",
  dark = false,
}: {
  index: string;
  label: string;
  headline: React.ReactNode;
  support?: React.ReactNode;
  className?: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        align === "center" && "flex flex-col items-center text-center",
        className,
      )}
    >
      <Reveal>
        <div
          className={cn(
            "meta flex items-baseline gap-3",
            dark ? "text-white/60" : "text-grey",
            align === "center" && "justify-center",
          )}
        >
          <SectionDot index={index} label={label} dark={dark} />
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={cn(
            "display-md mt-6 text-[clamp(2.5rem,6vw,5.25rem)] uppercase",
            dark ? "text-white" : "text-ink",
          )}
        >
          {headline}
        </h2>
      </Reveal>
      {support ? (
        <Reveal delay={0.16}>
          <p
            className={cn(
              "mt-6 max-w-[52ch] text-[1.0625rem] leading-relaxed",
              dark ? "text-white/65" : "text-grey",
            )}
          >
            {support}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

function SectionDot({
  index,
  label,
  dark,
}: {
  index: string;
  label: string;
  dark: boolean;
}) {
  return (
    <>
      <span
        className={cn(
          "inline-block h-2 w-2 rounded-full",
          dark ? "bg-white/50" : "bg-ink/50",
        )}
      />
      <span>
        {index} — {label}
      </span>
    </>
  );
}
