"use client";

/* EVALUATIONS — the release gate. 12 scenario tests + suites + failures. */

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  TESTS, VERIFY_CATEGORIES, VERIFY_SCORE, VERIFY_TOTAL, EVAL_RUNS, EVAL_FAILURES, getEmployee,
  type EvalRun, type VerifyTest,
} from "@/lib/app/data";
import { PageHead, Panel, Chip, Tile, EmptyState } from "@/components/app/ui";
import { DataTable, type Col } from "@/components/app/table";
import { Drawer } from "@/components/app/overlay";
import { Progress } from "@/components/app/ui";
import { AnimatedNumber } from "@/components/app/live";
import { cn } from "@/lib/utils";

const TEST_STATE: Record<VerifyTest["state"], { tone: "green" | "red" | "amber" | "neutral"; label: string }> = {
  pass: { tone: "green", label: "PASS" },
  fail: { tone: "red", label: "FAIL" },
  warning: { tone: "amber", label: "WARNING" },
  "not-run": { tone: "neutral", label: "NOT RUN" },
};

export default function EmployeeEvaluationsPage() {
  const { employee: slug } = useParams<{ employee: string }>();
  const e = getEmployee(slug ?? "");
  const flagship = slug === "voice-sales";
  const [runs, setRuns] = useState<EvalRun[]>(EVAL_RUNS);
  const [running, setRunning] = useState(false);
  const [ranNote, setRanNote] = useState<string | null>(null);
  const [open, setOpen] = useState<EvalRun | null>(null);
  const [drafts, setDrafts] = useState<{ name: string; group: string; expected: string }[]>([]);
  const [draft, setDraft] = useState({ name: "", group: "Outcome correctness", expected: "" });

  if (!flagship) {
    return (
      <>
        <PageHead kicker={e ? `${e.name} · Evaluations` : "Evaluations"} title="Evaluations." />
        <EmptyState
          title="No evaluation suites for this employee yet."
          body="Employees are benchmarked after their knowledge and workflows land. Draft the first case below or keep onboarding."
          action={
            <Link href={`/app/workforce/${slug}/knowledge`} className="meta rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">
              Check knowledge first
            </Link>
          }
        />
        <DraftCaseForm draft={draft} setDraft={setDraft} drafts={drafts} setDrafts={setDrafts} />
      </>
    );
  }

  const runGate = () => {
    if (running) return;
    setRunning(true);
    setRanNote(null);
    window.setTimeout(() => {
      const next: EvalRun = {
        id: `EV-00${runs.length + 88}`,
        suite: "Release gate — v2.4.1",
        date: "Just now",
        cases: 120, pass: 112, fail: 2, warning: 6, score: 94, version: "2.4.1",
      };
      setRuns((r) => [next, ...r]);
      setRunning(false);
      setRanNote("GATE REPLAYED — 112 PASS · 2 FAIL · 6 WARNING · SCORE 94/100 · RESULT IDENTICAL TO EV-0087 (DETERMINISTIC)");
    }, 2100);
  };

  const groups = [...new Set(TESTS.map((t) => t.group))];

  const runCols: Col<EvalRun>[] = [
    { key: "id", label: "Run", text: (r) => r.id, cell: (r) => <span className="font-mono text-[0.78rem] text-grey">{r.id}</span> },
    { key: "suite", label: "Suite", text: (r) => r.suite, cell: (r) => <span className="font-medium">{r.suite}</span> },
    { key: "date", label: "When", text: (r) => r.date, cell: (r) => r.date, hideBelow: "sm" },
    { key: "cases", label: "Cases", align: "right", text: (r) => String(r.cases), cell: (r) => r.cases },
    { key: "pass", label: "Pass", align: "right", text: (r) => String(r.pass), cell: (r) => <span className="text-emerald-700">{r.pass}</span>, hideBelow: "md" },
    { key: "fail", label: "Fail", align: "right", text: (r) => String(r.fail), cell: (r) => <span className="text-red-700">{r.fail}</span>, hideBelow: "md" },
    { key: "warn", label: "Warn", align: "right", text: (r) => String(r.warning), cell: (r) => <span className="text-amber-700">{r.warning}</span>, hideBelow: "xl" },
    { key: "score", label: "Score", align: "right", text: (r) => String(r.score), cell: (r) => <span className="font-mono tabular-nums">{r.score}/100</span> },
  ];

  return (
    <>
      <PageHead
        kicker="Lexi Voice Sales · Evaluations"
        title="Evaluations."
        sub="The release gate: 12 scenario tests across six categories, scored with their own measured basis — not an arbitrary AI score."
        actions={
          <button
            onClick={runGate}
            disabled={running}
            className={cn("meta rounded-sm px-4 py-2.5 transition-all",
              running
                ? "cursor-wait border border-line-2 text-grey-2"
                : "bg-ink text-paper hover:-translate-y-px hover:shadow-lift")}
          >
            {running ? "Running gate…" : "Run release gate"}
          </button>
        }
      />

      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="Verification score" value={<AnimatedNumber value={VERIFY_SCORE} />} sub={`weighted rollup of ${VERIFY_TOTAL} points`} tone="blue" />
        <Tile label="Scenario tests" value={TESTS.length} sub="12 required · all executed" />
        <Tile label="Latest suite" value="EV-0087" sub="Release gate — v2.4.1 · Oct 21" />
        <Tile label="Open failures" value="2" sub="1 blocking · 1 warning" tone="amber" />
      </div>

      {ranNote ? (
        <div className="mb-8 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="meta text-emerald-800">✓ {ranNote}</p>
        </div>
      ) : null}

      {/* verification categories */}
      <Panel className="mb-6" title="Verification score — category rollup" kicker="EACH CATEGORY SCORED ON ITS OWN MEASURED BASIS">
        <div className="flex flex-col gap-4">
          {VERIFY_CATEGORIES.map((c) => (
            <div key={c.name} className="grid items-center gap-3 md:grid-cols-[220px_1fr_auto]">
              <div>
                <p className="text-[0.88rem] font-medium text-ink">{c.name}</p>
                <p className="meta mt-0.5 text-grey-2">WEIGHT · {c.weight} PTS</p>
              </div>
              <div>
                <Progress value={c.score} tone={c.score === 100 ? "green" : c.score >= 90 ? "blue" : "orange"} label={`${Math.round((c.score / 100) * c.weight)}/${c.weight}`} />
                <p className="meta mt-1.5 text-grey">{c.basis}</p>
              </div>
              <span className="font-mono tabular-nums text-[0.8rem] text-ink">{c.score}%</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* release gate 12 tests */}
      <Panel className="mb-6" title="Release gate — 12 scenario tests" kicker="EVERY TEST PRODUCES A RECORD · RERUN REPLAYS THE SAME LEDGER">
        <div className="grid gap-8 md:grid-cols-2">
          {groups.map((g) => (
            <div key={g}>
              <p className="meta mb-2.5 text-grey-2">{g.toUpperCase()}</p>
              <ul role="list" className="flex flex-col divide-y divide-line">
                {TESTS.filter((t) => t.group === g).map((t) => {
                  const st = TEST_STATE[t.state];
                  return (
                    <li key={t.name} className="flex items-start justify-between gap-3 py-2.5">
                      <div>
                        <p className="text-[0.87rem] text-ink">{t.name}</p>
                        <p className="meta mt-0.5 text-grey-2">{t.note}</p>
                      </div>
                      <Chip tone={st.tone}>{st.label}</Chip>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Panel>

      {/* suites history */}
      <Panel className="mb-6" title="Suite history" kicker="CLICK A RUN FOR ITS CASE-LEVEL RECORD">
        <DataTable rows={runs} cols={runCols} rowKey={(r) => r.id} onRow={setOpen} search={false} pageSize={6} />
      </Panel>

      {/* failures + new case */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Case-level failures" kicker="LATEST RUN · EV-0087">
          <ul role="list" className="flex flex-col divide-y divide-line">
            {EVAL_FAILURES.map((f) => (
              <li key={f.case} className="flex items-start justify-between gap-4 py-3">
                <div>
                  <p className="text-[0.87rem] text-ink">{f.name} <span className="font-mono text-[0.72rem] text-grey-2">· {f.case}</span></p>
                  <p className="meta mt-1 text-grey">Fix — {f.fix}</p>
                </div>
                <Chip tone={f.severity === "fail" ? "red" : "amber"}>{f.severity.toUpperCase()}</Chip>
              </li>
            ))}
          </ul>
        </Panel>
        <DraftCaseForm draft={draft} setDraft={setDraft} drafts={drafts} setDrafts={setDrafts} />
      </div>

      <Drawer open={Boolean(open)} onClose={() => setOpen(null)}
        kicker={open ? `${open.id} · ${open.suite} · ${open.date}` : ""} title={open ? `Score ${open.score}/100` : ""}>
        {open ? (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-4 gap-2.5">
              {[
                { k: "CASES", v: open.cases },
                { k: "PASS", v: open.pass },
                { k: "FAIL", v: open.fail },
                { k: "WARN", v: open.warning },
              ].map((m) => (
                <div key={m.k} className="rounded-sm border border-line bg-paper-2 px-3 py-2.5 text-center">
                  <p className="meta text-grey-2">{m.k}</p>
                  <p className="display mt-1 text-[1rem] tabular-nums text-ink">{m.v}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="meta mb-2.5 text-grey-2">CONFIGURATION</p>
              <dl className="text-[0.86rem]">
                {[
                  ["Suite", open.suite],
                  ["Benchmark version", `lexi-sales-v${open.version}`],
                  ["Knowledge snapshot", "v4 · 12 sources"],
                  ["Case seed", "Deterministic (replay-safe)"],
                  ["Gate threshold", "90/100 to deploy"],
                  ["Result", open.score >= 90 ? "GATE PASSED" : "GATE BLOCKED"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6 border-b border-line py-2.5">
                    <dt className="meta text-grey-2">{k}</dt>
                    <dd className={"text-right font-mono text-[0.8rem] " + (String(v).includes("PASSED") ? "text-emerald-700" : String(v).includes("BLOCKED") ? "text-red-700" : "text-ink")}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <p className="meta mb-2.5 text-grey-2">CASE FAILURES BELONGING TO THIS RUN</p>
              <ul role="list" className="flex flex-col gap-2">
                {EVAL_FAILURES.map((f) => (
                  <li key={f.case} className="rounded-sm border border-line px-3.5 py-2.5 text-[0.85rem]">
                    <span className="font-mono text-grey-2">{f.case}</span> — <span className="text-ink">{f.name}</span>
                    <span className={"meta ml-2 " + (f.severity === "fail" ? "text-red-700" : "text-amber-700")}>{f.severity.toUpperCase()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </Drawer>
    </>
  );
}

function DraftCaseForm({ draft, setDraft, drafts, setDrafts }: {
  draft: { name: string; group: string; expected: string };
  setDraft: (d: { name: string; group: string; expected: string }) => void;
  drafts: { name: string; group: string; expected: string }[];
  setDrafts: (f: (d: { name: string; group: string; expected: string }[]) => { name: string; group: string; expected: string }[]) => void;
}) {
  const [err, setErr] = useState<string | null>(null);
  const submit = () => {
    if (draft.name.trim().length < 4) { setErr("Name the scenario — at least 4 characters."); return; }
    setErr(null);
    setDrafts((d) => [...d, { ...draft, name: draft.name.trim() }]);
    setDraft({ name: "", group: draft.group, expected: "" });
  };
  return (
    <Panel title="Draft a new test case" kicker="ADDED CASES ENTER THE NEXT GATE RUN" pad>
      <div className="flex flex-col gap-3">
        <label className="block">
          <span className="meta text-grey-2">SCENARIO NAME *</span>
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="e.g. Cheap customer — discounts within 15% cap"
            className="field mt-1.5 w-full"
          />
        </label>
        <label className="block">
          <span className="meta text-grey-2">CATEGORY</span>
          <select
            value={draft.group}
            onChange={(e) => setDraft({ ...draft, group: e.target.value })}
            className="field mt-1.5 w-full"
          >
            {["Outcome correctness", "Policy compliance", "Escalation", "Tool correctness", "Knowledge accuracy", "Execution reliability"].map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="meta text-grey-2">EXPECTED BEHAVIOUR</span>
          <textarea
            value={draft.expected}
            onChange={(e) => setDraft({ ...draft, expected: e.target.value })}
            rows={2}
            placeholder="What the employee must do — never invent, stay inside policy…"
            className="field mt-1.5 w-full resize-none"
          />
        </label>
        {err ? <p className="meta text-red-700">✕ {err}</p> : null}
        <button
          onClick={submit}
          className="meta self-start rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift"
        >
          Add case to gate
        </button>
        {drafts.length ? (
          <div className="border-t border-line pt-3">
            <p className="meta mb-2 text-grey-2">DRAFTED ({drafts.length}) — HELD FOR NEXT RUN</p>
            <ul role="list" className="flex flex-col gap-2">
              {drafts.map((d, i) => (
                <li key={i} className="flex items-start justify-between gap-3 rounded-sm border border-line px-3 py-2 text-[0.84rem]">
                  <span><span className="text-ink">{d.name}</span> <span className="meta text-grey-2">· {d.group}</span></span>
                  <Chip tone="neutral">DRAFT</Chip>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </Panel>
  );
}
