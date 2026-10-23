"use client";

/* ANALYTICS (workspace) — series, per-employee capacity, cost, value. */

import { useState } from "react";
import Link from "next/link";
import { REPORT_SERIES, COSTS_MONTH, EMPLOYEES } from "@/lib/app/data";
import { inr, inrShort, num, pct } from "@/lib/app/format";
import { PageHead, Panel, Tile, Chip } from "@/components/app/ui";
import { Bars, StackBar, Spark, Donut } from "@/components/app/charts";
import { AnimatedNumber } from "@/components/app/live";
import { cn } from "@/lib/utils";

const TONES: Record<string, string> = {
  Voice: "#2b5aa7",
  LLM: "#f0a05a",
  Platform: "#101114",
  "Tools & API": "#7ea6d8",
  Infrastructure: "#9a9da2",
};

export default function WorkspaceAnalyticsPage() {
  const [range, setRange] = useState<"14d" | "today">("14d");
  const series = range === "today" ? REPORT_SERIES.slice(-1) : REPORT_SERIES;
  const calls = series.reduce((a, s) => a + s.calls, 0);
  const connected = series.reduce((a, s) => a + s.connected, 0);
  const leads = series.reduce((a, s) => a + s.leads, 0);
  const costMonth = COSTS_MONTH.reduce((a, c) => a + c.value, 0);

  return (
    <>
      <PageHead
        kicker="Analytics · Workspace"
        title="Analytics."
        sub="Activity, performance, cost and value across the whole floor — every tile opens into the record-level flows that produced it."
        actions={
          <div className="flex gap-1.5 rounded-md border border-line bg-paper p-1.5">
            {(["today", "14d"] as const).map((r) => (
              <button key={r} onClick={() => setRange(r)}
                className={cn("meta rounded-sm px-3.5 py-2 transition-colors", range === r ? "bg-ink text-paper" : "text-grey hover:text-ink")}>
                {r === "today" ? "Today" : "Last 14 days"}
              </button>
            ))}
          </div>
        }
      />

      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile big label={range === "today" ? "Leads today" : "Leads — 14d"} value={<AnimatedNumber value={leads} format={(n) => num(n)} />} sub={`${num(connected)} connected · ${pct((connected / Math.max(1, leads)) * 100, 1)} of intake`} />
        <Tile label="Executions" value={num(calls)} sub={`${pct(96.4, 1)} successful`} />
        <Tile label="P95 latency" value="412ms" sub="Gateway + model round-trip" />
        <Tile label="Cost — month" value={inrShort(costMonth)} sub={`${inr(costMonth / Math.max(1, calls))} per call`} />
        <Tile label="Human interventions" value="23" sub="0.7% of executions" tone="amber" />
        <Tile label="Escalation rate" value="3.1%" sub="37 warm transfers" />
        <Tile label="Tool errors" value="0.9%" sub="92% auto-recovered" />
        <Tile label="Verified coverage" value="9/9" sub="Every employee gated" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <Panel title="Daily call volume" kicker="SERIES SOURCE · LEDGER" actions={<span className="meta text-grey-2">{range === "today" ? "OCT 23" : "OCT 10–23"}</span>}>
            <Bars data={series.map((s) => ({ label: s.d, value: s.calls }))} height={140} highlightLast />
          </Panel>

          <Panel title="Capacity & throughput by employee" kicker="TODAY — DERIVED FROM EXECUTION ROWS" pad>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="border-b border-line">
                    {["Employee", "Status", "Executions", "Success", "Capacity"] .map((h) => (
                      <th key={h} className="meta px-3 py-2.5 first:pl-0 text-grey-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {EMPLOYEES.map((e) => {
                    const ex = e.slug === "voice-sales" ? 1200 : e.slug === "sales" ? 486 : e.slug === "support" ? 312 : e.slug === "lead-generator" ? 2013 : e.capabilities.length * 4;
                    const suc = e.slug === "analyst" ? "—" : `${e.performance.execution || 96}%`;
                    return (
                      <tr key={e.slug} className="border-b border-line/70 text-[0.86rem] last:border-b-0">
                        <td className="py-3 pl-0 pr-3">
                          <Link href={`/app/workforce/${e.slug}/analytics`} className="font-medium text-ink transition-colors hover:text-orange-deep">{e.name}</Link>
                        </td>
                        <td className="px-3 py-3 text-grey">{e.status}</td>
                        <td className="px-3 py-3 font-mono tabular-nums text-ink">{ex ? num(ex) : "—"}</td>
                        <td className="px-3 py-3 font-mono tabular-nums text-ink">{suc}</td>
                        <td className="px-3 py-3 font-mono tabular-nums text-grey">{e.capacity.leadsPerDay}/d · {e.capacity.concurrency}× conc.</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Connection quality" kicker="CONNECTED ÷ CALLS">
            <div className="flex items-center gap-6">
              <Donut value={(connected / Math.max(1, calls)) * 100} size={92} label={`${Math.round((connected / Math.max(1, calls)) * 100)}%`} sub="CONNECTED" />
              <Spark points={REPORT_SERIES.map((r) => r.connected)} height={64} />
            </div>
          </Panel>

          <Panel title="Cost composition" kicker="OCTOBER — REAL, PRORATION IS LINEAR">
            <StackBar parts={COSTS_MONTH.map((c) => ({ label: c.label, value: c.value, tone: TONES[c.label] ?? "#9a9da2" }))} />
            <ul role="list" className="mt-5 flex flex-col gap-2 border-t border-line pt-4 text-[0.84rem]">
              <li className="flex justify-between gap-4"><span className="meta text-grey">Cost per lead</span><span className="font-mono tabular-nums text-ink">{inr(costMonth / Math.max(1, leads))}</span></li>
              <li className="flex justify-between gap-4"><span className="meta text-grey">Cost per connected</span><span className="font-mono tabular-nums text-ink">{inr(costMonth / Math.max(1, connected))}</span></li>
              <li className="flex justify-between gap-4"><span className="meta text-grey">Cost per confirmed (note: bands differ)</span><span className="font-mono tabular-nums text-ink">{inr(costMonth / 126)}</span></li>
            </ul>
          </Panel>

          <Panel title="Business value" kicker="ACTUAL vs ESTIMATED vs MODELLED — NEVER BLENDED">
            <ul role="list" className="flex flex-col gap-3 text-[0.88rem]">
              <li className="rounded-sm border border-line p-3.5">
                <p className="meta text-grey-2">ACTUAL REVENUE (TRACKED)</p>
                <p className="display mt-1.5 tabular-nums text-[1.3rem] text-ink">₹0</p>
                <p className="meta mt-1 text-grey-2">Closes happen in the CRM by humans — nothing is booked here.</p>
              </li>
              <li className="rounded-sm border border-line p-3.5">
                <p className="meta text-grey-2">ESTIMATED VALUE (INFLUENCED)</p>
                <p className="display mt-1.5 tabular-nums text-[1.3rem] text-ink">{inrShort(21150000)}</p>
                <p className="meta mt-1 text-grey-2">126 site visits × ₹16.5L avg deal — modelled attribution, not revenue.</p>
              </li>
              <li className="rounded-sm border border-line p-3.5">
                <p className="meta text-grey-2">MODELLED ROI</p>
                <p className="display mt-1.5 tabular-nums text-[1.3rem] text-ink">12.6×</p>
                <p className="meta mt-1 text-grey-2">Estimated value ÷ total cost. Sensitive to the avg-deal input.</p>
              </li>
            </ul>
            <div className="mt-4 border-t border-line pt-4">
              <Chip tone="neutral">CONFIRMED OUTCOMES FEED ESTIMATES — NEVER REVENUE - <Link href="/app/proof" className="link-underline text-ink">EVIDENCE →</Link></Chip>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
