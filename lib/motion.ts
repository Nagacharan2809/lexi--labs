"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/** The one signature ease used across the site. */
export const EASE_BRAND = "power3.out";
export const EASE_MOVE = "power2.inOut";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Runs `build` inside a scoped gsap context for animations that must
 * never leak on unmount / hot reload. Returns a revert function.
 */
export function scopedAnimations(
  root: Element,
  build: (ctx: gsap.Context) => void,
): () => void {
  const ctx = gsap.context(build, root);
  return () => ctx.revert();
}

/** Reactive media-query hook, SSR safe. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}
