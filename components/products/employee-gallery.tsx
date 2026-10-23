"use client";

import { useEffect, useRef, useState } from "react";
import { EmployeePlate } from "./employee-plate";
import { employees } from "@/lib/content";
import { gsap, ScrollTrigger, useMediaQuery } from "@/lib/motion";
import { Reveal } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

/**
 * Section 02 — the workforce gallery.
 *
 * Desktop (motion allowed): a pinned horizontal browse — the track slides
 * while the plate nearest the viewport centre is "active" and its
 * neighbours recede. Active detection is geometric (nearest plate centre
 * to the viewport) so the highlighted role always matches what is on
 * screen, whatever the scroll speed.
 *
 * Mobile, or motion-reduced desktop: the same plates stack vertically
 * with per-plate reveals; no pin, no rail, no tint wash.
 */
export function EmployeeGallery() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const motionOk = useMediaQuery("(prefers-reduced-motion: no-preference)");

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const track = trackRef.current;
      const pinEl = pinRef.current;
      if (!track || !pinEl) return;

      const range = () => Math.max(0, track.scrollWidth - window.innerWidth);

      /* which plate is closest to the viewport centre right now */
      const nearest = (x: number) => {
        const mid = window.innerWidth / 2;
        let best = 0;
        let bestD = Infinity;
        for (let i = 0; i < track.children.length; i++) {
          const el = track.children[i] as HTMLElement;
          const c = el.offsetLeft + el.offsetWidth / 2 + x;
          const d = Math.abs(c - mid);
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        }
        return best;
      };

      const tween = gsap.to(track, {
        x: () => -range(),
        ease: "none",
        scrollTrigger: {
          trigger: pinEl,
          start: "top top",
          end: () => `+=${range()}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 2,
          invalidateOnRefresh: true,
          onUpdate: () => {
            const x = (gsap.getProperty(track, "x") as number) || 0;
            const idx = nearest(x);
            if (idx !== activeRef.current) {
              activeRef.current = idx;
              setActive(idx);
            }
          },
        },
      });
      stRef.current = tween.scrollTrigger ?? null;

      return () => {
        stRef.current = null;
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(track, { clearProps: "x" });
      };
    });
    return () => mm.revert();
  }, []);

  /* keep ScrollTrigger measurements accurate after fonts settle */
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => clearTimeout(t);
  }, []);

  const recessable = isDesktop && motionOk;
  const current = employees[active];

  /* graded recession: the centred plate is full, direct neighbours are
     readable, distant plates fall back */
  const recedeStyle = (i: number) => {
    if (!recessable) return undefined;
    const d = Math.abs(i - active);
    if (d === 1)
      return { opacity: 0.45, transform: "scale(0.96)", transformOrigin: "left center" };
    if (d > 1)
      return { opacity: 0.18, transform: "scale(0.9)", transformOrigin: "left center" };
    return undefined;
  };

  /* progress of the slide that centres plate i */
  const progressFor = (i: number) => {
    const track = trackRef.current;
    const st = stRef.current;
    if (!track || !st) return null;
    const el = track.children[i] as HTMLElement | undefined;
    if (!el) return null;
    const target = el.offsetLeft + el.offsetWidth / 2 - window.innerWidth / 2;
    const span = Math.max(1, track.scrollWidth - window.innerWidth);
    return gsap.utils.clamp(0, 1, target / span);
  };

  return (
    <section id="employees" aria-label="Meet the workforce" className="relative scroll-mt-20">
      <div
        ref={pinRef}
        className="relative flex flex-col motion-safe:lg:h-[100svh] motion-safe:lg:min-h-[640px] motion-safe:lg:overflow-hidden"
      >
        {/* active-role wash — horizontal browse only */}
        <div
          className="absolute inset-0 hidden opacity-60 transition-colors duration-1000 ease-brand motion-safe:lg:block"
          style={{ backgroundColor: current.tint }}
          aria-hidden="true"
        />

        {/* header */}
        <div className="gutter relative z-10 flex flex-wrap items-end justify-between gap-6 pb-6 pt-24 md:pt-28 lg:pb-5 lg:pt-20 xl:pt-24">
          <h2 className="display-md text-[clamp(2.2rem,5.2vw,4.4rem)] uppercase text-ink lg:text-[clamp(2rem,4.8vw,4.2rem)]">
            Meet the workforce.
          </h2>
        </div>

        {/* track — pinned horizontal on desktop, stacked vertically otherwise */}
        <div className="relative z-10 flex-1 lg:min-h-0">
          <div
            ref={trackRef}
            className="flex h-full flex-col gap-16 motion-safe:will-change-transform motion-safe:lg:flex-row motion-safe:lg:items-center motion-safe:lg:gap-0 motion-safe:lg:pb-10 motion-safe:lg:pl-[8vw]"
          >
            {employees.map((employee, i) => (
              <div
                key={employee.slug}
                className={cn(
                  "min-w-0 px-5 md:px-10",
                  "motion-safe:lg:shrink-0 motion-safe:lg:w-[52vw] motion-safe:lg:px-0 motion-safe:lg:border-l motion-safe:lg:border-line/80 motion-safe:lg:pl-[3.2vw] motion-safe:lg:pr-[3.6vw]",
                )}
              >
                <div
                  className="transition-[opacity,transform] duration-700 ease-brand"
                  style={recedeStyle(i)}
                >
                  <Reveal once y={isDesktop ? 0 : 32}>
                    <EmployeePlate
                      employee={employee}
                      active={i === active}
                      grow={i === active}
                    />
                  </Reveal>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* progress rail — horizontal browse only */}
        <div className="gutter relative z-10 hidden items-center gap-5 pb-4 motion-safe:lg:flex">
          <div className="flex flex-1 items-center gap-1.5" role="presentation">
            {employees.map((employee, i) => (
              <button
                key={employee.slug}
                onClick={() => {
                  const p = progressFor(i);
                  const st = stRef.current;
                  if (p !== null && st) {
                    window.scrollTo({
                      top: st.start + p * (st.end - st.start),
                      behavior: "smooth",
                    });
                  }
                }}
                aria-label={`Go to ${employee.role}`}
                className="group h-6 flex-1"
              >
                <span
                  className={cn(
                    "block h-[3px] w-full rounded-full transition-colors duration-500",
                    i === active ? "" : "bg-ink/15 group-hover:bg-ink/35",
                  )}
                  style={
                    i === active
                      ? { backgroundColor: employee.accent }
                      : undefined
                  }
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
