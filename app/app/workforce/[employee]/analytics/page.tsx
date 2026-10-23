"use client";

/* ANALYTICS — activity, performance, cost, value. Period switch is real UI. */

import { useMemo, useState } from "react";
import { REPORT_SERIES, COSTS_MONTH, OUTCOMES } from "@/lib/app/data";
import { inr, inrShort, num, pct } from "@/lib/app/format";
import { PageHead, Panel, Tile, Chip } from "@/components/app/ui";
import { Bars, StackBar, Spark, Donut } from "@/components/app/charts";
import { AnimatedNumber } from "@/components/app/live";
import { cn } from "@/lib/utils";

const ROLL_TONES: Record<string, string> = {
  Voice: "#2b5aa7",
  LLM: "#f0a05a",
  Platform: "#101114",
  "Tools & API": "#7ea6d8",
  Infrastructure: "#9a9da2",
};

type Period = "daily" | "weekly" | "monthly" | "custom";
const PERIODS: { key: Period; label: string }[] = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "custom", label: "Custom" },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("monthly");
  const [customDays, setCustomDays] = useState(7);

  type View = { label: string; calls: number; connected: number; leads: number };
  const views = useMemo<View[]>(() => {
    if (period === "daily") {
      const s = REPORT_SERIES[REPORT_SERIES.length - 1];
      return [{ label: "TODAY", calls: s.calls, connected: s.connected, leads: s.leads }];
    }
    if (period === "weekly") {
      const out: View[] = [];
      for (let i = 0; i < REPORT_SERIES.length; i += 7) {
        const part = REPORT_SERIES.slice(i, i + 7);
        out.push({
          label: `W${out.length + 1}`,
          calls: sum(part.map((p) => p.calls)),
          connected: sum(part.map((p) => p.connected)),
          leads: sum(part.map((p) => p.leads)),
        });
      }
      return out;
    }
    if (period === "custom") {
      return REPORT_SERIES.slice(-customDays).map((s, i) => ({
        label: `D ${REPORT_SERIES.length - customDays + i + 1}`,
        calls: s.calls,
        connected: s.connected,
        leads: s.leads,
      }));
    }
    return REPORT_SERIES.map((s) => ({ label: s.d, calls: s.calls, connected: s.connected, leads: s.leads }));
  }, [period, customDays]);

  const calls = sum(views.map((s) => s.calls));
  const connected = sum(views.map((s) => s.connected));
  const leads = sum(views.map((s) => s.leads));
  const cost = period === "monthly" ? COSTS_MONTH.reduce((a, c) => a + c.value, 0) : Math.round((COSTS_MONTH.reduce((a, c) => a + c.value, 0) - 59999) * (period === "custom" ? customDays / 23 : views.length / 23) + 59999 * (period === "custom" ? customDays / 30 : views.length / 30));
  const successRate = 96.4;
  const latency = 412;

  return (
    <>
      <PageHead
        kicker="Analytics · Workspace-wide"
        title="Analytics."
        sub="Activity, performance, outcomes, cost and value — for a period you choose. Aggregates stay traceable: each tile links into the record-level flows."
        actions={<Chip tone="neutral" className="uppercase">{period === "custom" ? `Custom · last ${customDays} days` : period}</Chip>}
      />

      {/* period switcher */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5 rounded-md border border-line bg-paper p-1.5">
          {PERIODS.map((p) => (
            <button key={p.key} onClick={() => setPeriod(p.key)}
              className={cn("meta rounded-sm px-3.5 py-2 transition-colors",
                period === p.key ? "bg-ink text-paper" : "text-grey hover:text-ink")}>
              {p.label}
            </button>
          ))}
        </div>
        {period === "custom" ? (
          <label className="meta flex items-center gap-3 rounded-md border border-line bg-paper px-3.5 py-2 text-grey">
            LAST
            <input type="range" min={3} max={12} value={customDays} onChange={(e) => setCustomDays(parseInt(e.target.value, 10))}
              aria-label="Custom period in days" className="w-28 accent-black" />
            <span className="font-mono tabular-nums text-ink">{customDays} D</span>
          </label>
        ) : null}
      </div>

      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile big label={period === "daily" ? "Leads today" : `Leads — ${period}`} value={<AnimatedNumber value={leads} format={(n) => num(n)} />} sub={`${num(connected)} connected`} />
        <Tile label="Runs / calls" value={num(calls)} sub={`${pct(successRate)} execution success`} />
        <Tile label="P95 latency" value={`${latency}ms`} sub="Gateway + model round-trip" />
        <Tile label="Cost — period" value={inrShort(period === "monthly" ? cost : Math.min(cost, 210011))} sub={`${calls ? inr(cost / Math.max(1, calls)) : "—"} per call`} />
        <Tile label="Outcomes — confirmed" value={period === "daily" ? "126" : num(OUTCOMES.confirmed)} sub="Open the sale band" />
        <Tile label="Escalation rate" value="3.1%" sub="37 warm transfers" />
        <Tile label="Tool errors" value="0.9%" sub="Auto-recovered 92%" />
        <Tile label="Hours saved" value={`${Math.round(calls / 63)}h`} sub="Measured vs manual baseline" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <Panel title="Call volume" kicker="SERIES SOURCE · LEDGER" actions={<span className="meta text-grey-2">{period === "daily" ? "1 DAY" : `${views.length} ${period === "custom" ? "DAYS" : "BUCKETS"}`}</span>}>
            <Bars data={views.map((v) => ({ label: v.label, value: v.calls }))} height={140} highlightLast />
          </Panel>

          <Panel title="Connection quality" kicker="CONNECTED ÷ CALLS">
            <div className="flex items-center gap-6">
              <Donut value={calls ? (connected / calls) * 100 : 0} size={92} label={`${Math.round((connected / Math.max(1, calls)) * 100)}%`} sub="CONNECTED" />
              <Spark points={REPORT_SERIES.map((r) => r.connected)} height={64} />
            </div>
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Cost composition" kicker={period === "monthly" ? "OCTOBER — FIXED + VARIABLE" : `PRORATED — ${period.toUpperCase()}`}>
            <StackBar parts={COSTS_MONTH.map((c) => ({
              label: c.label, value: period === "monthly" ? c.value : Math.round((c.value / 23) * views.length),
              tone: ROLL_TONES[c.label] ?? "#9a9da2",
            }))} />
            <ul role="list" className="mt-5 flex flex-col gap-2 border-t border-line pt-4 text-[0.84rem]">
              <li className="flex justify-between gap-4"><span className="meta text-grey">Cost per lead</span><span className="font-mono tabular-nums text-ink">{inr(cost / Math.max(1, leads))}</span></li>
              <li className="flex justify-between gap-4"><span className="meta text-grey">Cost per connected</span><span className="font-mono tabular-nums text-ink">{inr(cost / Math.max(1, connected))}</span></li>
              <li className="flex justify-between gap-4"><span className="meta text-grey">Cost per interested (est.)</span><span className="font-mono tabular-nums text-ink">{inr(cost / Math.max(1, connected / (421 / 986) / 10))}</span></li>
              <li className="flex justify-between gap-4"><span className="meta text-grey">Cost per confirmed</span><span className="font-mono tabular-nums text-ink">{inr(cost / Math.max(1, OUTCOMES.confirmed * (views.length / 23)))}</span></li>
            </ul>
          </Panel>

          <Panel title="Business value" kicker="DISTINCTIONS ENFORCED — NEVER BLENDED">
            <ul role="list" className="flex flex-col gap-3 text-[0.88rem]">
              <li className="rounded-sm border border-line p-3.5">
                <p className="meta text-grey-2">ACTUAL REVENUE (TRACKED)</p>
                <p className="display mt-1.5 tabular-nums text-[1.3rem] text-ink">₹0</p>
                <p className="meta mt-1 text-grey-2">Conversion closes offline in the CRM — nothing is booked here.</p>
              </li>
              <li className="rounded-sm border border-line p-3.5">
                <p className="meta text-grey-2">ESTIMATED VALUE (INFLUENCED)</p>
                <p className="display mt-1.5 tabular-nums text-[1.3rem] text-ink">{inrShort(21150000)}</p>
                <p className="meta mt-1 text-grey-2">126 site visits × ₹16.5L avg deal — a modelled attribution range, not a promise.</p>
              </li>
              <li className="rounded-sm border border-line p-3.5">
                <p className="meta text-grey-2">MODELLED ROI</p>
                <p className="display mt-1.5 tabular-nums text-[1.3rem] text-ink">12.6×</p>
                <p className="meta mt-1 text-grey-2">Estimated value ÷ total cost. Sensitive to the avg-deal assumption.</p>
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}

function sum(xs: number[]) { return xs.reduce((a, b) => a + b, 0); }
