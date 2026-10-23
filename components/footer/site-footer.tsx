"use client";

import { prefillEmployee, EMPLOYEES_NAV } from "@/lib/content";
import { useReducedMotion } from "framer-motion";
import { Marquee } from "@/components/ui/marquee";

const COLUMNS = [
  {
    title: "COMPANY",
    links: [
      { label: "About", href: "#about" },
      { label: "Why Lexi", href: "#why-lexi" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "RESOURCES",
    links: [
      { label: "Documentation", href: "#how-it-works" },
      { label: "Blog", href: "#about" },
      { label: "Use Cases", href: "#use-cases" },
    ],
  },
  {
    title: "LEGAL",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Security", href: "/security" },
    ],
  },
  {
    title: "SOCIAL",
    links: [
      { label: "Instagram", href: "https://instagram.com/lexilabs.ai" },
      { label: "LinkedIn", href: "https://linkedin.com/company/lexilabs" },
      { label: "GitHub", href: "https://github.com/lexilabs" },
    ],
  },
];

/**
 * Section 09 — minimal brand closure. Large statement, tight columns,
 * one quiet bottom line.
 */
export function SiteFooter() {
  const reduced = useReducedMotion();

  const jump = (href: string, e: React.MouseEvent) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      document
        .getElementById(href.slice(1))
        ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    }
  };

  return (
    <footer aria-label="Footer" className="bg-paper pt-24 md:pt-32">
      <div className="gutter mx-auto max-w-[1440px] pb-10">
        {/* statement */}
        <div className="flex flex-wrap items-end justify-between gap-8 border-b border-line pb-14">
          <div>
            <p className="display text-[clamp(2rem,5.2vw,4.6rem)] uppercase text-ink">
              AI employees<br />
              <span className="grad-spectral">that do the work.</span>
            </p>
          </div>
          <a
            href="#top"
            onClick={(e) => jump("#top", e)}
            className="group meta flex items-center gap-3 pb-2 text-grey transition-colors hover:text-ink"
          >
            BACK TO TOP
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 ease-brand group-hover:-translate-y-1"
            >
              ↑
            </span>
          </a>
        </div>

        {/* columns */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
          {/* products first — the workforce */}
          <nav aria-label="Products">
            <p className="meta text-grey-2">PRODUCTS</p>
            <ul role="list" className="m-0 mt-5 space-y-2.5">
              <li>
                <a
                  href="#employees"
                  onClick={(e) => jump("#employees", e)}
                  className="link-underline text-[0.92rem] text-ink"
                >
                  AI Employees
                </a>
              </li>
              {EMPLOYEES_NAV.slice(0, 6).map((emp) => (
                <li key={emp.slug}>
                  <a
                    href="#employees"
                    onClick={(e) => {
                      e.preventDefault();
                      prefillEmployee(emp.slug);
                      document
                        .getElementById("employees")
                        ?.scrollIntoView({
                          behavior: reduced ? "auto" : "smooth",
                        });
                    }}
                    className="foot-link text-[0.92rem] text-grey hover:text-ink"
                  >
                    {emp.short}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="meta text-grey-2">{col.title}</p>
              <ul role="list" className="m-0 mt-5 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => jump(link.href, e)}
                      className="foot-link text-[0.92rem] text-grey hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* bottom line */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-7">
          <p className="meta text-grey">© 2026 Lexi Labs</p>
          <p className="meta flex items-center gap-2 text-grey">
            POWERED BY
            <span
              aria-hidden="true"
              className="inline-block h-2 w-4 rounded-[1px]"
              style={{
                background: "linear-gradient(100deg, #2b5aa7, #e8763a)",
              }}
            />
            FLEEN
          </p>
        </div>
      </div>

      {/* closing band — the brand, rolling through the dark */}
      <div className="border-t border-line bg-ink py-5">
        <Marquee
          className="text-white/10"
          speed={46}
          itemClassName="display text-[clamp(2.2rem,5.2vw,4.6rem)] uppercase leading-none whitespace-nowrap"
          items={[
            <span key="a">Lexi Labs</span>,
            <span
              key="b"
              className="grad-spectral"
            >
              AI employees
            </span>,
            <span key="c">That do the work</span>,
            <span key="d" className="text-orange/25">
              Powered by Fleen
            </span>,
          ]}
        />
      </div>
    </footer>
  );
}
