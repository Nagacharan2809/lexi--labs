"use client";

/* PERMISSIONS — the forward-looking surface: what the employee may do, and what happens. */

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PERMISSIONS, getEmployee, type PermissionRow } from "@/lib/app/data";
import { PageHead, Panel, Chip, EmptyState, Tile } from "@/components/app/ui";
import { cn } from "@/lib/utils";

const STATES: { key: PermissionRow["state"]; label: string; cls: string; note: string }[] = [
  { key: "allowed", label: "ALLOWED", cls: "border-emerald-300 bg-emerald-50 text-emerald-800", note: "runs inline · signed + traced" },
  { key: "approval", label: "APPROVAL", cls: "border-amber-300 bg-amber-50 text-amber-800", note: "pauses for a human decision" },
  { key: "blocked", label: "BLOCKED", cls: "border-red-200 bg-red-50 text-red-700", note: "impossible by design — the runtime refuses the call" },
];

export default function PermissionsPage() {
  const { employee: slug } = useParams<{ employee: string }>();
  const e = getEmployee(slug ?? "");
  const [rows, setRows] = useState<PermissionRow[]>(PERMISSIONS);
  const [changes, setChanges] = useState<Record<string, PermissionRow["state"]>>({});

  if (!e) {
    return (
      <>
        <PageHead kicker="Permissions" title="Permissions." />
        <EmptyState title="Employee not found." body="Return to the workforce and pick a valid employee." />
      </>
    );
  }

  const count = (s: PermissionRow["state"]) => rows.filter((r) => (changes[r.action] ?? r.state) === s).length;
  const changedCount = Object.keys(changes).length;

  const applyChanges = () => {
    setRows((rs) => rs.map((r) => (changes[r.action] ? { ...r, state: changes[r.action] } : r)));
    setChanges({});
  };

  const reset = () => setChanges({});

  return (
    <>
      <PageHead
        kicker={`${e.name} · Permissions`}
        title="Permissions."
        sub="Not a checkbox grid — every permission carries its consequence, because the point of this surface is to predict the blast radius before it exists."
        actions={
          changedCount ? (
            <button onClick={applyChanges} className="meta rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">
              Apply {changedCount} change{changedCount > 1 ? "s" : ""}
            </button>
          ) : (
            <Chip tone="green" pulse>POLICY IN SYNC</Chip>
          )
        }
      />

      <div className="mb-8 grid grid-cols-3 gap-3 md:grid-cols-3">
        <Tile label="Allowed" value={count("allowed")} sub="runs inline, signed + traced" />
        <Tile label="Needs approval" value={count("approval")} sub="human-in-the-loop before execution" tone="amber" />
        <Tile label="Blocked" value={count("blocked")} sub="runtime refuses the call" />
      </div>

      <Panel className="mb-6" title="Decision matrix" kicker={changedCount ? `${changedCount} DRAFT CHANGES — APPLY TO STRICTEN OR LOOSEN` : "CYCLE ANY ROW: ALLOWED → APPROVAL → BLOCKED"}>
        <ul role="list" className="flex flex-col divide-y divide-line">
          {rows.map((r) => {
            const current = changes[r.action] ?? r.state;
            return (
              <li key={r.action} className="grid gap-3 py-4 md:grid-cols-[150px_1fr_auto] md:items-center">
                <div>
                  <p className="text-[0.92rem] font-medium text-ink">{r.action}</p>
                  <p className="meta mt-0.5 text-grey-2">{r.scope}</p>
                </div>
                <p className="text-[0.85rem] leading-snug text-grey">{r.consequence}</p>
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex gap-1.5">
                    {STATES.map((s) => (
                      <button
                        key={s.key}
                        onClick={() => {
                          setChanges((c) => ({ ...c, [r.action]: s.key }));
                        }}
                        aria-pressed={current === s.key}
                        className={cn(
                          "meta rounded-full border px-2.5 py-1 transition-all duration-200",
                          current === s.key ? s.cls : "border-line-2 text-grey-2 hover:border-grey hover:text-ink",
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <span className="meta text-grey-2">{STATES.find((s) => s.key === current)?.note}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>

      {changedCount ? (
        <div className="mb-6 rounded-sm border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="meta flex flex-wrap items-center justify-between gap-3 text-amber-800">
            UNAPPLIED EDITS: {changedCount} — DEPLOYED KEYS UPDATE BUT THE GATE WILL RE-RUN ON NEXT RELEASE
            <button onClick={reset} className="link-underline text-amber-900 uppercase">Reset</button>
          </p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Approval economics" kicker="WHY APPROVAL ≠ FRUSTRATION">
          <p className="text-[0.88rem] leading-relaxed text-grey">
            Approval isn&apos;t bureaucracy here — it is the only state where the employee holds an action without
            producing a trace. Approvals arrive as cards with the input, the rule and the ask in one glance; a
            two-second read. That keeps consent real: nothing proceeds past a guardrail silently.
          </p>
          <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
            {[
              ["Discounts ≤ 15%", "inline, no approval"],
              ["Discounts 15–30%", "approval · manager"],
              ["Refunds ≤ ₹5,000", "approval · ops"],
              ["Anything outside policy", "blocked"],
            ].map(([k, v]) => (
              <p key={k} className="meta flex justify-between gap-4 text-grey">
                <span className="text-ink">{k}</span><span>{v.toUpperCase()}</span>
              </p>
            ))}
          </div>
        </Panel>

        <Panel title="How this surfaces downstream" kicker="THE SAME MATRIX, READ BY OTHER SURFACES">
          <ul role="list" className="flex flex-col gap-3 text-[0.86rem] leading-relaxed text-grey">
            <li className="flex gap-2.5"><span aria-hidden="true" className="font-mono text-grey-2">01</span><span><Link href="/app/workforce/voice-sales/work" className="link-underline text-ink">Work queues</Link> mark approval-paused executions and route them to the approvals centre.</span></li>
            <li className="flex gap-2.5"><span aria-hidden="true" className="font-mono text-grey-2">02</span><span><Link href="/app/workforce/voice-sales/workflow" className="link-underline text-ink">Workflow canvas</Link> validates every tool node against the matrix before saving — blocked tools can&apos;t join a rail.</span></li>
            <li className="flex gap-2.5"><span aria-hidden="true" className="font-mono text-grey-2">03</span><span>Execution traces record which policy note authorized each tool call — evidence, not vibes.</span></li>
            <li className="flex gap-2.5"><span aria-hidden="true" className="font-mono text-grey-2">04</span><span><Link href="/app/activity" className="link-underline text-ink">Workspace audit</Link> diffs permission history by actor, timestamp and version.</span></li>
          </ul>
        </Panel>
      </div>
    </>
  );
}
