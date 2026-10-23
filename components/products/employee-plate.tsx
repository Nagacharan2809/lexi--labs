"use client";

import { EmployeeGlyph } from "./employee-glyph";
import { ArrowRight } from "@/components/ui/controls";
import { prefillEmployee, type Employee } from "@/lib/content";

/**
 * EmployeePlate — one workforce spread: index rail, role detail and the
 * slat identity. Editorial panels separated by hairlines, no boxes.
 * Hover activates the capability rows and promotes the CTA. Sized to
 * live inside the pinned gallery viewport on desktop.
 */
export function EmployeePlate({
  employee,
  active,
  grow = true,
}: {
  employee: Employee;
  active?: boolean;
  grow?: boolean;
}) {
  const openBrief = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    prefillEmployee(employee.slug);
    document
      .getElementById("contact")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <article
      className="group relative grid gap-x-10 gap-y-5 sm:grid-cols-[3rem_1fr] xl:grid-cols-[3rem_minmax(0,1.05fr)_minmax(0,0.8fr)]"
      aria-label={`${employee.index} — ${employee.role}`}
    >
      {/* watermark index — a tinted ghost of the role number.
          Hidden at xl+: the glyph identity panel owns that corner. */}
      <span
        aria-hidden="true"
        className="display pointer-events-none absolute -top-10 right-0 select-none text-[7.5rem] leading-none transition-colors duration-700 [animation:lexi-float_9s_ease-in-out_infinite] md:text-[10rem] xl:hidden"
        style={{
          color: active ? `${employee.accent}17` : `${employee.accent}0b`,
        }}
      >
        {employee.index}
      </span>
      {/* index rail */}
      <div className="flex flex-row items-start gap-3 sm:flex-col sm:items-start">
        <span
          className="display text-[clamp(1.3rem,2vw,1.85rem)] leading-none"
          style={{ color: employee.accent }}
          aria-hidden="true"
        >
          {employee.index}
        </span>
      </div>

      {/* role detail */}
      <div className="min-w-0">
        <header className="relative flex items-baseline justify-between gap-4 border-t border-line pt-3">
          {active ? (
            <span
              aria-hidden="true"
              className="grad-rule-live absolute inset-x-0 top-[-1px] h-[2px] rounded-full"
            />
          ) : null}
          <h3 className="display-md text-[clamp(1.4rem,2.4vw,2.1rem)] uppercase text-ink lg:text-[1.9rem] xl:text-[2.1rem]">
            Lexi {employee.role}
          </h3>
        </header>

        <p className="mt-2.5 text-[0.95rem] leading-relaxed text-grey md:text-[1rem] lg:text-[0.94rem] xl:text-[1rem]">
          {employee.purpose}
        </p>

        {/* capabilities */}
        <div
          className="mt-4 text-[0.92rem] text-ink-2"
          role="list"
          aria-label={`${employee.role} capabilities`}
        >
          {employee.capabilities.map((cap) => (
            <div
              key={cap}
              role="listitem"
              className="flex items-baseline border-b border-line/70 py-[7px] transition-opacity duration-300 lg:py-[5px]"
            >
              <span className="transition-transform duration-300 ease-brand group-hover:translate-x-0.5">
                {cap}
              </span>
            </div>
          ))}
        </div>

        {/* channels */}
        <p className="meta mt-3 leading-relaxed text-grey">
          {employee.channels.join("  ·  ")}
        </p>

        {/* typical workflow */}
        <p className="meta mt-2 flex flex-wrap items-center gap-y-1 leading-relaxed text-grey">
          {employee.workflow.map((step, i) => (
            <span key={step} className="whitespace-nowrap">
              {i > 0 && (
                <span className="ml-2 mr-2 text-grey-2" aria-hidden="true">
                  →
                </span>
              )}
              {step}
            </span>
          ))}
        </p>

        {/* CTA */}
        <a
          href="#contact"
          onClick={openBrief}
          className="group/cta meta relative mt-5 inline-flex items-center gap-3 overflow-hidden rounded-xs border border-line-2 py-2.5 pl-4 pr-3 text-ink transition-colors duration-200 ease-brand hover:border-transparent hover:text-paper lg:py-2"
        >
          {/* colour sweep — replaces the fill on hover */}
          <span
            aria-hidden="true"
            className="absolute inset-0 translate-y-[101%] bg-gradient-to-tr from-orange-deep via-orange to-ember transition-transform duration-[420ms] ease-brand group-hover/cta:translate-y-0"
          />
          <span className="relative z-10">Explore {employee.role}</span>
          <span className="relative z-10">
            <ArrowRight />
          </span>
        </a>
      </div>

      {/* identity panel — xl+ only, keeps shorter desktops in budget */}
      <div className="hidden xl:flex xl:flex-col xl:justify-between">
        <EmployeeGlyph
          employee={employee}
          grow={grow}
          className="w-full max-w-[200px] self-end shadow-soft transition-transform duration-500 ease-brand group-hover:-translate-y-1"
        />
      </div>
    </article>
  );
}
