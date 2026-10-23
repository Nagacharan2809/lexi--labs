"use client";

import { cn } from "@/lib/utils";

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn("h-3.5 w-3.5 transition-transform duration-300 ease-brand", className ?? "group-hover:translate-x-1")}
    >
      <path
        d="M1 8h13M9.5 3.5 14 8l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  );
}

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "light" | "paper";
  arrow?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function Button({
  href,
  children,
  variant = "primary",
  arrow = false,
  className,
  ariaLabel,
}: ButtonProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={cn(
        "group relative inline-flex items-center gap-3 overflow-hidden rounded-sm px-6 py-3.5 text-[0.8125rem] font-medium tracking-[0.08em] uppercase transition-all duration-300 ease-brand",
        variant === "primary" &&
          "bg-ink text-paper hover:-translate-y-px hover:shadow-lift active:translate-y-0",
        variant === "paper" &&
          "bg-paper text-ink hover:-translate-y-px hover:shadow-lift active:translate-y-0",
        variant === "ghost" &&
          "border border-line-2 text-ink hover:border-ink group-hover:text-paper",
        variant === "light" &&
          "border border-white/40 text-white hover:border-white",
        className,
      )}
    >
      {/* colour sweep — fills the button on hover */}
      <span aria-hidden="true" className="absolute inset-0">
        <span
          className={cn(
            "absolute inset-0 translate-y-[101%] transition-transform duration-[420ms] ease-brand group-hover:translate-y-0",
            (variant === "primary" || variant === "paper") &&
              "bg-gradient-to-tr from-orange-deep via-orange to-ember",
            variant === "ghost" &&
              "bg-gradient-to-tr from-orange-deep via-orange to-ember",
            variant === "light" && "bg-paper",
          )}
        />
      </span>
      <span
        className={cn(
          "relative z-10 transition-colors duration-300",
          variant === "ghost" && "group-hover:text-paper",
          variant === "light" && "group-hover:text-ink",
        )}
      >
        {children}
      </span>
      {arrow ? (
        <ArrowRight className="relative z-10 group-hover:translate-x-1" />
      ) : null}
    </a>
  );
}
