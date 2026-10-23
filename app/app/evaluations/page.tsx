"use client";

/* EVALUATIONS (workspace) — every employee's suite runs, in one place. */

import { useState } from "react";
import Link from "next/link";
import { EVAL_RUNS, EVAL_FAILURES, VERIFY_CATEGORIES, VERIFY_SCORE, TESTS, EMPLOYEES } from "@/lib/app/data";
import { PageHead, Panel, Tile, Chip, EmptyState } from "@/components/app/ui";
import { DataTable, type Col } from "@/components/app/table";
import { Progress } from "@/components/app/ui";
import { Donut } from "@/components/app/charts";

type Suite = typeof EVAL_RUNS[number];

export default function WorkspaceEvaluationsPage() {
  const [runs, setRuns] = useState<Suite[]>(EVAL_RUNS);
  const [running, setRunning] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const runAll = () => {
    if (running) return;
    setRunning(true);
    setNote(null);
    window.setTimeout(() => {
      setRuns((r) => [{ ...r[0], id: `EV-00${r.length + 88}`, date: "Just now" }, ...r]);
      setRunning(false);
      setNote("FLOOR-WIDE GATE REPLAYED — ALL SUITES DETERMINISTICALLY RE-RAN; SCORES IDENTICAL TO LEDGER RECORDS");
    }, 2400);
  };

  const perEmp = [
    { e: "Lexi Voice Sales", score: 94, suites: 3, link: "/app/workforce/voice-sales/evaluations" },
    { e: "Lexi Sales", score: 91, suites: 2, link: "/app/workforce/sales/evaluations" },
    { e: "Lexi Support", score: 92, suites: 2, link: "/app/workforce/support/evaluations" },
    { e: "Lexi Lead Generation", score: 95, suites: 2, link: "/app/workforce/lead-generator/evaluations" },
    { e: "Lexi Operations", score: null, suites: 0, link: "/app/workforce/operations" },
  ];

  const cols: Col<Suite>[] = [
    { key: "id", label: "Run", text: (r) => r.id, cell: (r) => <span className="font-mono text-[0.78rem] text-grey">{r.id}</span> },
    { key: "suite", label: "Suite", text: (r) => r.suite, cell: (r) => <span className="font-medium">{r.suite}</span> },
    { key: "date", label: "When", text: (r) => r.date, cell: (r) => r.date, hideBelow: "sm" },
    { key: "cases", label: "Cases", align: "right", text: (r) => String(r.cases), cell: (r) => r.cases },
    { key: "pass", label: "Pass", align: "right", text: (r) => String(r.pass), cell: (r) => <span className="text-emerald-700">{r.pass}</span>, hideBelow: "md" },
    { key: "fail", label: "Fail", align: "right", text: (r) => String(r.fail), cell: (r) => <span className="text-red-700">{r.fail}</span>, hideBelow: "md" },
    { key: "score", label: "Score", align: "right", text: (r) => String(r.score), cell: (r) => <span className="font-mono tabular-nums">{r.score}/100</span> },
  ];

  return (
    <>
      <PageHead
        kicker="Evaluations · Workspace"
        title="Release gates."
        sub="No employee reaches production without a 90+ gate. Suites are deterministic — replaying one produces the same verdict, which is what makes them forensic evidence."
        actions={
          <button onClick={runAll} className={"meta rounded-sm px-4 py-2.5 transition-all " + (running ? "cursor-wait border border-line-2 text-grey-2" : "bg-ink text-paper hover:-translate-y-px hover:shadow-lift")}>
            {running ? "Replaying the floor…" : "Replay all suites"}
          </button>
        }
      />

      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="Floor verification" value={VERIFY_SCORE} sub="Flagship rollout criterion observed" tone="blue" />
        <Tile label="Suites on record" value={runs.length + 2} sub="Across 4 evaluated employees" />
        <Tile label="Open failures" value={EVAL_FAILURES.length} sub="1 blocks next release" tone="amber" />
        <Tile label="Gate policy" value="≥ 90/100" sub="Hard threshold — no exceptions" />
      </div>

      {note ? (
        <div className="mb-8 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="meta text-emerald-800">✓ {note}</p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-6">
          <Panel title="Suite runs" kicker="ALL EMPLOYEES · CLICK A ROW IN THE FLAGSHIP FOR CASE DETAIL">
            <DataTable rows={runs} cols={cols} rowKey={(r) => r.id} search={false} pageSize={7} />
          </Panel>

          <Panel title="Failure board" kicker="EVERY ITEM OWNS A FIX PATH">
            <ul role="list" className="flex flex-col divide-y divide-line">
              {EVAL_FAILURES.map((f) => (
                <li key={f.case} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-[0.88rem] text-ink">{f.name} <span className="font-mono text-[0.72rem] text-grey-2">· {f.case}</span></p>
                    <p className="meta mt-1 text-grey">Fix — {f.fix}</p>
                  </div>
                  <Chip tone={f.severity === "fail" ? "red" : "amber"}>{f.severity.toUpperCase()}</Chip>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Employees at the gate" kicker="WHO IS CLEARED · WHO IS PENDING">
            <ul role="list" className="flex flex-col gap-3.5">
              {perEmp.map((x) => (
                <li key={x.e}>
                  <Link href={x.link} className="group flex items-center justify-between gap-3">
                    <span className="text-[0.9rem] font-medium text-ink transition-colors group-hover:text-orange-deep">{x.e}</span>
                    {x.score === null
                      ? <Chip tone="amber">ONBOARDING</Chip>
                      : <span className="font-mono text-[0.82rem] tabular-nums text-ink">{x.score}/100</span>}
                  </Link>
                  {x.score !== null ? <div className="mt-1.5"><Progress value={x.score} tone={x.score >= 90 ? "green" : "orange"} /></div> : null}
                </li>
              ))}
            </ul>
            <p className="meta mt-4 text-grey-2">CATEGORY ROLLUP — {VERIFY_CATEGORIES.length} WEIGHTED · {TESTS.length} SCENARIO TESTS PER GATE</p>
          </Panel>

          <Panel title="Verification, explained once" kicker="NOT AN ARBITRARY AI SCORE">
            <div className="mb-4 flex items-center gap-5">
              <Donut value={VERIFY_SCORE} size={86} label={`${VERIFY_SCORE}`} sub="/100" />
              <p className="text-[0.86rem] leading-relaxed text-grey">
                Each category is scored on its own measured basis — tool telemetry, sampled calls, adversarial probes.
                The sum is what deploys.
              </p>
            </div>
            <ul role="list" className="flex flex-col gap-2 border-t border-line pt-4">
              {VERIFY_CATEGORIES.map((c) => (
                <li key={c.name} className="meta flex justify-between gap-3 text-grey">
                  <span>{c.name}</span>
                  <span className="font-mono tabular-nums text-ink">{Math.round((c.score / 100) * c.weight)}/{c.weight}</span>
                </li>
              ))}
            </ul>
          </Panel>

          {!runs.length ? (
            <EmptyState title="No suites yet." body="Suites appear when employees run their release gates." />
          ) : null}
        </div>
      </div>

      <p className="meta mt-8 text-grey-2">FLOOR RULE — {EMPLOYEES.filter((e) => e.status !== "draft").length} EMPLOYEES · NONE BYPASSED THE GATE · <Link href="/app/workforce/voice-sales/evaluations" className="link-underline text-ink">INSPECT THE FLAGSHIP GATE →</Link></p>
    </>
  );
}
