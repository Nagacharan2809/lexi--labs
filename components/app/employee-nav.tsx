"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRef } from "react";

export const EMPLOYEE_SECTIONS = [
  { seg: "", label: "Overview" },
  { seg: "work", label: "Work" },
  { seg: "leads", label: "Leads" },
  { seg: "calls", label: "Calls" },
  { seg: "outcomes", label: "Outcomes" },
  { seg: "analytics", label: "Analytics" },
  { seg: "knowledge", label: "Knowledge" },
  { seg: "tools", label: "Tools" },
  { seg: "integrations", label: "Integrations" },
  { seg: "instructions", label: "Instructions" },
  { seg: "workflow", label: "Workflow" },
  { seg: "permissions", label: "Permissions" },
  { seg: "evaluations", label: "Evaluations" },
  { seg: "activity", label: "Activity" },
  { seg: "versions", label: "Versions" },
  { seg: "deployment", label: "Deployment" },
] as const;

export function EmployeeNav({ slug }: { slug: string }) {
  const pathname = usePathname();
  const base = `/app/workforce/${slug}`;
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <nav
      ref={scrollRef}
      aria-label="Employee sections"
      className="app-scroll -mx-4 flex snap-x gap-1.5 overflow-x-auto px-4 py-3 [scrollbar-width:none] md:-mx-8 md:px-8 [&::-webkit-scrollbar]:hidden"
    >
      {EMPLOYEE_SECTIONS.map((s) => {
        const href = s.seg ? `${base}/${s.seg}` : base;
        const active = s.seg ? pathname === href || pathname.startsWith(`${href}/`) : pathname === base;
        return (
          <Link
            key={s.seg}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative shrink-0 snap-start rounded-full border px-3.5 py-1.5 whitespace-nowrap transition-all duration-200",
              active
                ? "border-ink bg-ink text-paper"
                : "border-line-2 bg-paper text-grey hover:border-ink hover:text-ink",
            )}
          >
            {s.label}
            {active ? (
              <motion.span layoutId="emp-nav" aria-hidden="true" className="absolute -bottom-[1px] left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full grad-rule" />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
