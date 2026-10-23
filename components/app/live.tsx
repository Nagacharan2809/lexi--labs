"use client";

/* Live client bits — animated numerals, ticking timers, live rows. */

import { useEffect, useRef, useState } from "react";

/* counts move like the ledger they represent */
export function AnimatedNumber({ value, format, className }: {
  value: number; format?: (n: number) => string; className?: string;
}) {
  const [shown, setShown] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const from = prev.current;
    if (from === value) return;
    prev.current = value;
    const t0 = performance.now();
    const DUR = 650;
    let raf = 0;
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / DUR);
      const eased = 1 - Math.pow(1 - k, 3);
      setShown(Math.round(from + (value - from) * eased));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return (
    <span className={className} aria-label={String(value)}>
      {format ? format(shown) : shown.toLocaleString("en-IN")}
    </span>
  );
}

/* ticking per-run timer, e.g. "2:41" on working calls */
export function Ticker({ fromSec = 0, className }: { fromSec?: number; className?: string }) {
  const [s, setS] = useState(fromSec);
  useEffect(() => {
    const t = setInterval(() => setS((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(s / 60);
  return (
    <span className={className}>
      {String(m).padStart(2, "0")}:{String(s % 60).padStart(2, "0")}
    </span>
  );
}

/* subtle 'working' row pulse — quiet, never neon */
export function Pulse({ tone = "blue" }: { tone?: "blue" | "orange" }) {
  return (
    <span aria-hidden="true" className="relative inline-flex h-2 w-2">
      <span
        className={`absolute inset-0 rounded-full opacity-40 ${tone === "blue" ? "animate-pulse bg-blue" : "animate-pulse bg-orange"}`}
        style={{ animationDuration: "2.4s" }}
      />
      <span className={`absolute inset-0 rounded-full ${tone === "blue" ? "bg-blue" : "bg-orange"}`} />
    </span>
  );
}

export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    /* initial read deferred — SSR and hydration render the placeholder */
    const t0 = window.setTimeout(() => setNow(new Date()), 0);
    const t = window.setInterval(() => setNow(new Date()), 15000);
    return () => {
      window.clearTimeout(t0);
      window.clearInterval(t);
    };
  }, []);
  return (
    <span className="meta tabular-nums text-grey-2">
      {now ? now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "--:--"} IST
    </span>
  );
}
