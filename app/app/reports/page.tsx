"use client";

/* REPORTS — pick a template + period, preview, then export CSV or print. */

import { useMemo, useState } from "react";
import Link from "next/link";
import { REPORT_SERIES, COSTS_MONTH, OUTCOMES, EVAL_RUNS, LEADS, USAGE } from "@/lib/app/data";
import { inrShort, num } from "@/lib/app/format";
import { PageHead, Panel, Chip } from "@/components/app/ui";
import { Bars } from "@/components/app/charts";
import { cn } from "@/lib/utils";

const TEMPLATES = [
  { id: "daily", name: "Daily ops report", blurb: "Leads, calls, connection, interventions — one page a manager can scan.", tables: ["calls-14d", "interventions"] },
  { id: "funnel", name: "Sales funnel & outcomes", blurb: "The three-band ledger: intent, sales, final — with the convinced/confirmed delta explained.", tables: ["funnel-bands", "records"] },
  { id: "cost", name: "Cost & value statement", blurb: "Actual spend vs estimated value, with the ROI model's sensitive inputs named.", tables: ["cost-breakup", "index"] },
  { id: "eval", name: "Verification digest", blurb: "Suite runs, failures, and the weighted category rollup feeding the gate.", tables: ["suites", "failures"] },
] as const;

type Tpl = (typeof TEMPLATES)[number]["id"];

export default function ReportsPage() {
  const [tpl, setTpl] = useState<Tpl>("daily");

  const active = TEMPLATES.find((t) => t.id === tpl)!;
  const rows = useMemo(() => {
    if (tpl === "funnel") return [
      ["Funnel block", "Records", "Band", "Note"],
      ["Leads received", String(OUTCOMES.leads), "intake", ""],
      ["Calls completed", String(OUTCOMES.completed), "dial", ""],
      ["Connected", String(OUTCOMES.connected), "dial", ""],
      ["Interested (intent)", String(OUTCOMES.interested), "intent", ""],
      ["Convinced (sales)", String(OUTCOMES.convinced), "sales", "on-call yes"],
      ["Confirmed (final)", String(OUTCOMES.confirmed), "final", "delta via follow-up flow"],
    ];
    if (tpl === "cost") return [
      ["Line", "Amount (₹)", "Detail"],
      ...COSTS_MONTH.map((c) => [c.label, String(c.value), c.detail ?? ""]),
      ["Estimated value (modelled)", "2,11,50,000", "126 site visits × ₹16.5L — not revenue"],
    ];
    if (tpl === "eval") return [
      ["Run", "Suite", "Cases", "Pass", "Fail", "Score"],
      ...EVAL_RUNS.map((r) => [r.id, r.suite, String(r.cases), String(r.pass), String(r.fail), `${r.score}/100`]),
    ];
    return [
      ["Day", "Leads", "Calls", "Connected", "Cost (₹)"],
      ...REPORT_SERIES.map((s) => [`Oct ${s.d}`, String(s.leads), String(s.calls), String(s.connected), String(s.cost)]),
    ];
  }, [tpl]);

  const exportCsv = () => {
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `lexi-${tpl}-report.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <PageHead
        kicker="Reports · Workspace"
        title="Ledger reports."
        sub="Four honest documents — every number inside is the same ledger the employees acted on. Export as CSV or print as PDF."
        actions={<Chip tone="neutral">PERIOD · {USAGE.period.toUpperCase()}</Chip>}
      />

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        {/* picker */}
        <div className="flex flex-col gap-4">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTpl(t.id); }}
              aria-pressed={tpl === t.id}
              className={cn(
                "group relative rounded-md border p-4 text-left transition-all duration-300 ease-brand hover:-translate-y-px",
                tpl === t.id ? "border-ink bg-paper-2 shadow-lift" : "border-line bg-paper hover:border-ink",
              )}
            >
              <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-[2px] origin-left grad-rule transition-transform duration-500 ease-brand", tpl === t.id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100")} />
              <p className="display text-[0.98rem] uppercase text-ink">{t.name}</p>
              <p className="mt-1.5 text-[0.84rem] leading-snug text-grey">{t.blurb}</p>
            </button>
          ))}

          <div className="rounded-md border border-line bg-paper p-4">
            <p className="meta mb-2 text-grey-2">DELIVERY</p>
            <div className="flex gap-2">
              <button onClick={exportCsv} className="meta flex-1 rounded-sm bg-ink px-3 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">
                Download CSV
              </button>
              <button onClick={() => window.print()} className="meta flex-1 rounded-sm border border-line-2 px-3 py-2.5 text-grey transition-colors hover:border-ink hover:text-ink">
                Print
              </button>
            </div>
            <p className="meta mt-2.5 text-grey-2">CSV CONTAINS THE SAME ROWS AS THE PREVIEW — NO HIDDEN AGGREGATES.</p>
          </div>
        </div>

        {/* preview */}
        <Panel
          title={active.name}
          kicker={`PREVIEW · ${rows.length - 1} ROWS · ${active.tables.join(" + ").toUpperCase()}`}
          pad
          actions={<span className="meta text-grey-2">NOVA REALTY · LEXI LABS · {USAGE.period.toUpperCase()}</span>}
        >
          {/* chart head for daily/funnel */}
          <div className="mb-6">
            <p className="meta mb-3 text-grey-2">EXECUTION SERIES — {num(REPORT_SERIES.reduce((a, s) => a + s.calls, 0))} CALLS · {inrShort(COSTS_MONTH.reduce((a, c) => a + c.value, 0))} MONTH COST</p>
            <Bars data={REPORT_SERIES.map((s) => ({ label: s.d, value: s.calls }))} height={110} highlightLast />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left">
              <thead>
                <tr className="border-b border-line">
                  {rows[0].map((h) => <th key={h} className="meta px-3 py-2.5 first:pl-0 text-grey-2">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.slice(1).map((r, i) => (
                  <tr key={i} className="border-b border-line/70 text-[0.86rem] last:border-b-0">
                    {r.map((c, j) => (
                      <td key={j} className={cn("py-2.5 px-3 first:pl-0", j === 0 ? "font-medium text-ink" : "font-mono tabular-nums text-grey")}>
                        {isNaN(Number(c)) ? c : num(Number(c))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="meta mt-5 border-t border-line pt-4 text-grey-2">
            GENERATED FROM THE LEDGER — {num(LEADS.length)} LEAD RECORDS · {num(REPORT_SERIES.length)} DAY SERIES · {EVAL_RUNS.length} SUITES · NOTHING MANUAL.
          </p>
        </Panel>
      </div>

      <p className="meta mt-8 text-grey-2">BALANCE — SEGMENTS ARE FULL LEDGER VIEWS. NUMBER FIRST → <Link href="/app/proof" className="link-underline text-ink">PROOF →</Link></p>
    </>
  );
}
