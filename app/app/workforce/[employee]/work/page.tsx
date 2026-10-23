"use client";

/* WORK — everything the employee is currently doing, in six buckets. */

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { WORK_ITEMS, RUNS_TODAY, getEmployee, getLead, getTrace, type WorkItem } from "@/lib/app/data";
import { clock, num } from "@/lib/app/format";
import { PageHead, Panel, Chip, Tile, EmptyState } from "@/components/app/ui";
import { Drawer } from "@/components/app/overlay";
import { ExecutionTrace } from "@/components/app/trace";
import { Ticker, Pulse } from "@/components/app/live";

const BUCKETS: { key: WorkItem["status"]; title: string; secret: string }[] = [
  { key: "working", title: "Currently working", secret: "Streaming" },
  { key: "queued", title: "Queued", secret: "Scheduled within window" },
  { key: "awaiting" as never, title: "Awaiting approval", secret: "Human-in-the-loop" },
  { key: "completed", title: "Completed", secret: "Ledger committed" },
  { key: "failed", title: "Failed", secret: "Retry policy" },
  { key: "escalated", title: "Escalated", secret: "Warm transfer" },
];

const CHIP: Record<string, { tone: "blue" | "amber" | "green" | "red" | "neutral" | "orange"; label: string }> = {
  working: { tone: "blue", label: "WORKING" },
  queued: { tone: "neutral", label: "QUEUED" },
  completed: { tone: "green", label: "COMPLETED" },
  failed: { tone: "red", label: "FAILED" },
  approval: { tone: "amber", label: "APPROVAL" },
  escalated: { tone: "orange", label: "ESCALATED" },
};

export default function WorkPage() {
  const { employee: slug } = useParams<{ employee: string }>();
  const e = getEmployee(slug === "voice-sales" ? "voice-sales" : slug!);
  const flagship = slug === "voice-sales";
  const [open, setOpen] = useState<WorkItem | null>(null);

  if (!flagship) {
    return (
      <>
        <PageHead kicker={e ? `${e.name} · Work` : "Work"} title="Work." />
        <EmptyState
          title="This employee hasn't performed work yet."
          body="Work items appear the first time the employee executes a task. Deploy it, or assign a workload in its workflow."
          action={
            <Link href="/app/workforce/operations" className="meta rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">
              Continue onboarding
            </Link>
          }
        />
      </>
    );
  }

  const byBucket = (k: WorkItem["status"]) => WORK_ITEMS.filter((w) => w.status === (k === ("awaiting" as never) ? "approval" : k));

  return (
    <>
      <PageHead
        kicker="Lexi Voice Sales · Work"
        title="Work."
        sub="The whole labour of the employee right now — live sessions, the queue, the grid, failures and human moments."
        actions={<Chip tone="blue" pulse>{num(RUNS_TODAY.working)} RUNNING</Chip>}
      />

      <div className="mb-8 grid grid-cols-3 gap-3 md:grid-cols-6">
        <Tile label="Working" value={num(RUNS_TODAY.working)} />
        <Tile label="Queued" value={num(RUNS_TODAY.queued)} sub="window at 09:00–21:00" />
        <Tile label="Completed" value={num(RUNS_TODAY.completed)} sub="avg 03:42" />
        <Tile label="Failed" value={num(RUNS_TODAY.failed)} sub="retry held" />
        <Tile label="Approvals" value={num(RUNS_TODAY.approval)} />
        <Tile label="Escalated" value={num(RUNS_TODAY.escalated)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {BUCKETS.map((b) => {
          const items = byBucket(b.key);
          return (
            <Panel key={b.key as string} title={`${items.length ? `${items.length} · ` : ""}${b.title}`} kicker={b.secret} className={items.length ? "" : "opacity-80"}>
              {items.length ? (
                <ul role="list" className="-mx-1">
                  {items.map((w) => {
                    const c = CHIP[w.status];
                    return (
                      <li key={w.id}>
                        <button
                          onClick={() => setOpen(w)}
                          className="group -mx-1 w-[calc(100%+0.5rem)] rounded-sm px-2.5 py-2.5 text-left transition-colors hover:bg-paper-2"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="flex min-w-0 items-baseline gap-2.5">
                              <span className="font-mono text-[0.74rem] text-grey-2">{w.id}</span>
                              {w.status === "working" ? <Pulse tone="blue" /> : null}
                              <span className="truncate text-[0.88rem] font-medium text-ink">{w.input}</span>
                            </span>
                            {w.status === "working" ? (
                              <span className="font-mono tabular-nums text-[0.74rem] text-blue-deep">{clock(w.duration)} → <Ticker fromSec={w.duration} /></span>
                            ) : null}
                          </div>
                          <div className="mt-1 flex items-center justify-between gap-3">
                            <span className="meta truncate text-grey">{w.step}</span>
                            <span className="meta flex shrink-0 items-center gap-2">
                              <Chip tone={c.tone}>{c.label}</Chip>
                            </span>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="meta py-4 text-grey-2">EMPTY — {b.secret}.</p>
              )}
            </Panel>
          );
        })}
      </div>

      <Drawer open={Boolean(open)} onClose={() => setOpen(null)}
        kicker={open ? `${open.id} · started ${open.started}` : ""}
        title={open ? open.step : ""}>
        {open ? <WorkDetail w={open} /> : null}
      </Drawer>
    </>
  );
}

function WorkDetail({ w }: { w: WorkItem }) {
  const lead = getLead(w.input.match(/LD-\d+/)?.[0] ?? "");
  return (
    <div className="flex flex-col gap-7">
      <dl className="text-[0.86rem]">
        {[
          ["Work ID", w.id],
          ["Input", w.input],
          ["Current step", w.step],
          ["Started", w.started],
          ["Duration", w.duration ? clock(w.duration) : "—"],
          ["Outcome", w.outcome ?? "—"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-6 border-b border-line py-2.5">
            <dt className="meta text-grey-2">{k}</dt>
            <dd className="text-right font-mono text-[0.8rem] text-ink">{v}</dd>
          </div>
        ))}
      </dl>

      {w.status === "approval" ? (
        <div className="flex flex-col gap-3">
          <Link href="/app/approvals" className="meta rounded-sm bg-ink px-4 py-3 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">
            Review in approval centre →
          </Link>
          <button className="meta rounded-sm border border-line-2 px-4 py-3 text-grey transition-colors hover:border-ink hover:text-ink">
            Override guardrail (logged)
          </button>
        </div>
      ) : null}

      {lead ? (
        <div>
          <p className="meta mb-3 text-grey-2">Execution trace · {lead.id}</p>
          <Panel title="Fleen runtime trail" kicker="INPUT · DECISION · TOOL · VALIDATION">
            <ExecutionTrace nodes={getTrace(lead)} />
          </Panel>
        </div>
      ) : null}
    </div>
  );
}
