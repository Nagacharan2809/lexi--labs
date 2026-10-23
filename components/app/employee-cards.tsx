"use client";

/* Employee profile cards — operational personnel files, not integration tiles. */

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EMPLOYEES, STATUS_LABEL, employeeId, type Employee } from "@/lib/app/data";
import { num } from "@/lib/app/format";
import { EmployeeMark, Progress } from "@/components/app/ui";

const STATUS_TONE: Record<Employee["status"], string> = {
  working: "bg-emerald-50 text-emerald-700 border-emerald-200",
  verification: "bg-blue-tint text-blue-deep border-blue/25",
  ready: "bg-blue-tint text-blue-deep border-blue/25",
  training: "bg-amber-50 text-amber-700 border-amber-200",
  paused: "bg-paper-3 text-grey border-line-2",
  improving: "bg-orange-tint text-orange-deep border-orange/30",
  draft: "bg-paper-3 text-grey border-line-2",
  testing: "bg-blue-tint text-blue-deep border-blue/25",
  retired: "bg-paper-3 text-grey-2 border-line-2",
};

export function WorkforceGrid() {
  const [paused, setPaused] = useState<Record<string, boolean>>({});
  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {EMPLOYEES.map((e, i) => (
        <EmployeeCard
          key={e.slug}
          e={e}
          index={i}
          paused={Boolean(paused[e.slug])}
          onPause={() => setPaused((p) => ({ ...p, [e.slug]: !p[e.slug] }))}
        />
      ))}

      {/* hire ghost card */}
      <motion.div
        initial={false}
        className="group relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center gap-3 rounded-md border border-dashed border-line-2 bg-transparent p-8 text-center transition-all duration-300 ease-brand hover:border-ink hover:bg-paper"
      >
        <Link href="/app/templates" aria-label="Hire from templates" className="absolute inset-0" />
        <span aria-hidden="true" className="font-mono text-[1.6rem] text-grey-2 transition-colors group-hover:text-ink">＋</span>
        <p className="display text-[1.05rem] uppercase text-ink">Hire an employee</p>
        <p className="max-w-[26ch] text-[0.84rem] leading-relaxed text-grey">Start from a template — nine roles blueprinted, ready to onboard.</p>
      </motion.div>
    </div>
  );
}

function EmployeeCard({ e, index, paused, onPause }: {
  e: Employee; index: number; paused: boolean; onPause: () => void;
}) {
  const status = paused ? "paused" : e.status;
  const isWorking = status === "working";
  const perf = e.performance;

  /* employee-of-the-day numbers — the flagship carries the spec workload */
  const today =
    e.slug === "voice-sales"
      ? [
          { k: "Leads", v: "1,200" },
          { k: "Connected", v: "986" },
          { k: "Interested", v: "421" },
          { k: "Confirmed", v: "126" },
        ]
      : e.slug === "sales"
        ? [{ k: "Tasks", v: "486" }, { k: "Opened", v: "112" }, { k: "Follow-ups", v: "298" }, { k: "Won", v: "61" }]
        : e.status === "working"
          ? [{ k: "Tasks", v: num(312 + index * 97) }, { k: "Success", v: "97%" }, { k: "Escalated", v: "2" }, { k: "Hours", v: "39h" }]
          : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-md border border-line bg-paper p-5 transition-all duration-300 ease-brand hover:-translate-y-px hover:shadow-lift"
    >
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 grad-rule transition-transform duration-500 ease-brand group-hover:scale-x-100" />

      {/* identity */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <EmployeeMark name={e.name} className="h-11 w-11" />
          <div>
            <h3 className="display text-[1.02rem] uppercase leading-tight text-ink">{e.name}</h3>
            <p className="meta mt-1 text-grey">{e.role}</p>
          </div>
        </div>
        <span className={cn("meta inline-flex items-center gap-2 rounded-full border px-2.5 py-1 whitespace-nowrap", STATUS_TONE[status])}>
          {isWorking ? (
            <span aria-hidden="true" className="relative inline-flex h-2 w-2">
              <span className="absolute inset-0 animate-pulse rounded-full bg-emerald-500 opacity-40" style={{ animationDuration: "2.4s" }} />
              <span className="absolute inset-0 rounded-full bg-emerald-500" />
            </span>
          ) : null}
          {STATUS_LABEL[status].toUpperCase()}
        </span>
      </div>

      {/* personnel file */}
      <div className="meta mt-4 flex flex-wrap gap-x-4 gap-y-1 text-grey-2">
        <span>ID · <span className="font-mono text-grey">{employeeId(e)}</span></span>
        <span>VER · <span className="font-mono text-grey">{e.version}</span></span>
        <span>OWNER · <span className="text-grey">{e.owner}</span></span>
      </div>

      {today ? (
        <div className="mt-4 grid grid-cols-4 gap-2 border-t border-line pt-4">
          {today.map((m) => (
            <div key={m.k}>
              <p className="meta text-grey-2">{m.k.toUpperCase()}</p>
              <p className="mt-1 font-mono text-[0.92rem] tabular-nums text-ink">{m.v}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 border-t border-line pt-4 text-[0.85rem] leading-relaxed text-grey">{e.short}</p>
      )}

      {/* performance */}
      <div className="mt-4 flex flex-1 flex-col justify-end gap-3 border-t border-line pt-4">
        <div className="grid grid-cols-2 gap-5">
          <Progress value={perf.verification} tone="blue" label="VERIFICATION" />
          <Progress value={perf.execution} tone={perf.execution >= 95 ? "green" : "orange"} label="EXECUTION SUCCESS" />
        </div>
        <div className="flex items-center justify-between gap-3 pt-1">
          <Link
            href={`/app/workforce/${e.slug}`}
            className="meta group/open inline-flex items-center gap-2 rounded-sm bg-ink px-3.5 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift"
          >
            Open employee
          </Link>
          <button
            onClick={onPause}
            aria-pressed={paused}
            className={cn(
              "meta rounded-sm border px-3.5 py-2.5 transition-all duration-200",
              paused ? "border-ink bg-ink text-paper" : "border-line-2 text-grey hover:border-ink hover:text-ink",
            )}
          >
            {paused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
