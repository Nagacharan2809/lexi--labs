"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/content";

/**
 * Global navigation: minimal and transparent at the top of the page,
 * floating with a blur backdrop once scrolled. Tracks the active
 * section and smooth-scrolls to anchors on click.
 */
export function SiteNavigation() {
  const [floating, setFloating] = useState(false);
  const [overHero, setOverHero] = useState(true);
  const [active, setActive] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.35,
  });

  useEffect(() => {
    const onScroll = () => {
      /* the hero occupies one viewport; the paper pill only engages once
         the field has been left — over the hero the nav reads white */
      setFloating(window.scrollY > window.innerHeight * 0.92);
      setOverHero(window.scrollY <= window.innerHeight * 0.92);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* active-section tracking */
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const pick = () => {
      const probe = window.innerHeight * 0.38;
      let current = "";
      for (const el of targets) {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) current = `#${el.id}`;
      }
      setActive(current);
    };
    pick();
    const onScroll = () => pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* lock page scroll while the mobile menu is open */
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  const jump = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (!el) return;
    el.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <>
      {/* reading progress — the spectral field crossing the page */}
      <motion.div
        aria-hidden="true"
        className="grad-rule fixed inset-x-0 top-0 z-[80] h-[3px] origin-left"
        style={{ scaleX: progress }}
      />

      <header className={cn("fixed inset-x-0 top-0 z-50", floating && "pt-3")}>
        <nav
          aria-label="Primary"
          className={cn(
            "gutter mx-auto flex max-w-[1440px] items-stretch justify-between transition-all duration-500 ease-brand",
            floating
              ? "rounded-md border border-line bg-paper/80 shadow-soft backdrop-blur-md"
              : "border-b border-transparent",
          )}
        >
          {/* brand */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
            className={cn(
              "meta flex items-center gap-2 py-4 font-mono tracking-[0.18em] transition-colors duration-300",
              overHero ? "edge-readable text-white" : "text-ink",
            )}
            aria-label="Lexi Labs — back to top"
          >
            <span
              className="inline-block h-2.5 w-4 rounded-[1px]"
              style={{
                background:
                  "linear-gradient(100deg, #2b5aa7 0%, #e8763a 100%)",
              }}
              aria-hidden="true"
            />
            LEXI LABS
          </button>

          {/* center links */}
          <ul className="hidden items-center gap-1 lg:flex" role="list">
            {navLinks.map((link) => {
              const isActive = active === link.href;
              return (
                <li key={link.href}>
                  <button
                    onClick={() => jump(link.href)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "meta group relative rounded-xs px-3 py-2 transition-colors duration-200",
                      overHero
                        ? isActive
                          ? "edge-readable text-white"
                          : "edge-readable text-white/70 hover:text-white"
                        : isActive
                          ? "text-ink"
                          : "text-grey hover:text-ink",
                    )}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-3 bottom-0.5 h-[2px] origin-left rounded-full transition-transform duration-300 ease-brand",
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                      style={{
                        background: isActive
                          ? "linear-gradient(90deg, #2b5aa7, #e8763a)"
                          : "currentColor",
                      }}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          {/* right actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <a
              href="/signin"
              className={cn(
                "meta rounded-xs px-3 py-2 transition-colors",
                overHero ? "text-white/70 hover:text-white" : "text-grey hover:text-ink",
              )}
            >
              Sign In
            </a>
            <button
              onClick={() => jump("#contact")}
              className="meta rounded-xs bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:bg-orange-deep hover:shadow-lift"
            >
              Book a Demo
            </button>
          </div>

          {/* mobile trigger */}
          <button
            className={cn(
              "meta edge-readable my-3 flex items-center gap-2 transition-colors duration-300 lg:hidden",
              overHero ? "text-white" : "text-ink",
            )}
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-label="Open menu"
          >
            MENU
            <span aria-hidden="true" className="flex flex-col gap-[3px]">
              <span
                className={cn(
                  "block h-px w-5 transition-colors",
                  overHero ? "bg-white" : "bg-ink",
                )}
              />
              <span
                className={cn(
                  "block h-px w-5 transition-colors",
                  overHero ? "bg-white" : "bg-ink",
                )}
              />
            </span>
          </button>
        </nav>
      </header>

      {/* mobile overlay */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col bg-paper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div className="gutter flex items-center justify-between border-b border-line py-4">
              <span className="meta">LEXI LABS</span>
              <button
                className="meta px-2 py-2"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                CLOSE ×
              </button>
            </div>
            <nav
              aria-label="Mobile"
              className="gutter flex flex-1 flex-col justify-center gap-2 overflow-y-auto py-8"
            >
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => jump(link.href)}
                  className="display-md border-b border-line py-4 text-left text-[2rem] uppercase"
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 flex flex-col gap-3"
              >
                <button
                  onClick={() => jump("#contact")}
                  className="meta w-full rounded-sm bg-ink py-4 text-paper"
                >
                  BOOK A DEMO
                </button>
                <a href="/signin" className="meta py-3 text-center text-grey">
                  SIGN IN
                </a>
              </motion.div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
