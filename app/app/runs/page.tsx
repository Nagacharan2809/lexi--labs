"use client";

/* RUNS — the live operations board across the whole workspace. */

import { useMemo, useState } from "react";
import { WORK_ITEMS, RUNS_TODAY, LIVE_FEED, ACTIVITY, getLead, getTrace, type WorkItem } from "@/lib/app/data";
import { clock, num } from "@/lib/app/format";
import { PageHead, Panel, Chip, Tile } from "@/components/app/ui";
import { Drawer } from "@/components/app/overlay";
import { ExecutionTrace } from "@/components/app/trace";
import { Ticker, Pulse, LiveClock } from "@/components/app/live";
import { cn } from "@/lib/utils";

type Bucket = WorkItem["status"];
const BUCKETS: { key: Bucket; title: string; hint: string }[] = [
  { key: "working", title: "Currently working", hint: "streaming from runtime" },
  { key: "queued", title: "Queued", hint: "scheduled inside windows" },
  { key: "approval", title: "Awaiting approval", hint: "human-in-the-loop" },
  { key: "completed", title: "Completed", hint: "ledger-committed" },
  { key: "failed", title: "Failed", hint: "retry policy engaged" },
  { key: "escalated", title: "Escalated", hint: "warm transfer" },
];

const BUCKET_TONE: Record<Bucket, string> = {
  working: "text-blue-deep",
  queued: "text-grey",
  approval: "text-amber-700",
  completed: "text-emerald-700",
  failed: "text-red-700",
  escalated: "text-orange-deep",
};

export default function RunsPage() {
  const [bucket, setBucket] = useState<Bucket | "all">("all");
  const [open, setOpen] = useState<WorkItem | null>(null);
  const stream = useMemo(() => [...LIVE_FEED, ...ACTIVITY.slice(0, 4).map((a) => ({ t: a.at, text: a.text, lead: undefined as string | undefined }))], []);

  const shown = bucket === "all" ? WORK_ITEMS : WORK_ITEMS.filter((w) => w.status === bucket);
  const count = (b: Bucket) => WORK_ITEMS.filter((w) => w.status === b).length;

  return (
    <>
      <PageHead
        kicker="Runs · Workspace"
        title="Live work."
        sub="Every execution happening right now across nine employees — the queue, the fails, the human pause moments. Same ledger, one board."
        actions={
          <>
          <span className="hidden md:block"><LiveClock /></span>
            <Chip tone="blue" pulse>{num(RUNS_TODAY.working)} RUNNING</Chip>
          </>
        }
      />

      <div className="mb-8 grid grid-cols-3 gap-3 md:grid-cols-6">
        <Tile label="Working" value={num(RUNS_TODAY.working)} sub="concurrent execs" />
        <Tile label="Queued" value={num(RUNS_TODAY.queued)} sub="windows respected" />
        <Tile label="Completed" value={num(RUNS_TODAY.completed)} sub="avg 03:42" />
        <Tile label="Failed" value={num(RUNS_TODAY.failed)} sub="retry held" tone="amber" />
        <Tile label="Approvals" value={num(RUNS_TODAY.approval)} sub="human queue" />
        <Tile label="Escalated" value={num(RUNS_TODAY.escalated)} sub="warm transfers" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel
          title="Board"
          kicker={bucket === "all" ? "ALL STATES" : `FILTER · ${bucket.toUpperCase()}`}
          actions={
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setBucket("all")}
                className={cn("meta rounded-full border px-3 py-1.5 transition-colors",
                  bucket === "all" ? "border-ink bg-ink text-paper" : "border-line-2 text-grey hover:border-ink hover:text-ink")}
              >
                ALL
              </button>
              {BUCKETS.map((b) => (
                <button
                  key={b.key}
                  onClick={() => setBucket(b.key)}
                  className={cn("meta rounded-full border px-3 py-1.5 transition-colors",
                    bucket === b.key ? "border-ink bg-ink text-paper" : "border-line-2 text-grey hover:border-ink hover:text-ink")}
                >
                  {count(b.key)} · {b.title.toUpperCase()}
                </button>
              ))}
            </div>
          }
          pad
        >
          <ul role="list" className="divide-y divide-line">
            {shown.map((w) => (
              <li key={w.id}>
                <button onClick={() => setOpen(w)} className="group flex w-full items-start justify-between gap-4 py-3 text-left transition-colors hover:bg-paper-2">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-baseline gap-2.5">
                      <span className="font-mono text-[0.74rem] text-grey-2">{w.id}</span>
                      {w.status === "working" ? <Pulse tone="blue" /> : null}
                      <span className="truncate text-[0.9rem] font-medium text-ink">{w.input}</span>
                    </p>
                    <p className="meta mt-1 text-grey">{w.step}</p>
                  </div>
                  <div className="flex shrink-0 items-baseline gap-3">
                    {w.status === "working" ? (
                      <span className="font-mono tabular-nums text-[0.74rem] text-blue-deep">{clock(w.duration)} → <Ticker fromSec={w.duration} /></span>
                    ) : (
                      <span className="meta text-grey-2">{w.started}</span>
                    )}
                    <span className={cn("meta font-medium", BUCKET_TONE[w.status])}>{w.status.toUpperCase()}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          {!shown.length ? (
            <p className="meta py-8 text-center text-grey-2">EMPTY — NOTHING IN {String(bucket).toUpperCase()} RIGHT NOW.</p>
          ) : null}
        </Panel>

        <Panel title="Stream" kicker="NEWEST FIRST · SAME EVENT LOG AS ACTIVITY" actions={<Chip tone="green" pulse>LIVE</Chip>}>
          <ol className="relative flex flex-col">
            <span aria-hidden="true" className="absolute bottom-3 left-[62px] top-3 w-px bg-line-2" />
            {stream.slice(0, 12).map((f, i) => (
              <li key={i} className="relative flex items-start gap-5 py-2">
                <span className="pt-0.5 font-mono text-[0.7rem] tabular-nums text-grey-2">{f.t}</span>
                <span aria-hidden="true" className={cn("absolute left-[55px] top-[13px] h-[15px] w-[15px] rounded-full border-[1.5px] bg-paper", i === 0 ? "border-blue-deep" : "border-line-2")} />
                <p className="flex-1 text-[0.84rem] text-ink">{f.text}</p>
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      <Drawer open={Boolean(open)} onClose={() => setOpen(null)}
        kicker={open ? `${open.id} · started ${open.started}` : ""}
        title={open ? open.step : ""}>
        {open ? <RunDetail w={open} /> : null}
      </Drawer>
    </>
  );
}

function RunDetail({ w }: { w: WorkItem }) {
  const lead = getLead(w.input.match(/LD-\d+/)?.[0] ?? "");
  return (
    <div className="flex flex-col gap-7">
      <dl className="text-[0.86rem]">
        {([
          ["Work ID", w.id],
          ["Input", w.input],
          ["Current step", w.step],
          ["Started", w.started],
          ["Duration", w.duration ? clock(w.duration) : "—"],
          ["Outcome", w.outcome ?? "—"],
        ] as [string, string][]).map(([k, v]) => (
          <div key={k} className="flex justify-between gap-6 border-b border-line py-2.5">
            <dt className="meta text-grey-2">{k}</dt>
            <dd className="text-right font-mono text-[0.8rem] text-ink">{v}</dd>
          </div>
        ))}
      </dl>
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
