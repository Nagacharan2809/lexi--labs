"use client";

/* PROOF OF WORK — completed executions with their full evidence chain. */

import { useMemo, useState } from "react";
import Link from "next/link";
import { CALLS, LEADS, OUTCOMES, type Call, type Lead } from "@/lib/app/data";
import { clock, inr2, num } from "@/lib/app/format";
import { PageHead, Panel, Chip, Tile, EmptyState } from "@/components/app/ui";
import { DataTable } from "@/components/app/table";
import { Drawer } from "@/components/app/overlay";
import { CallDetail } from "@/components/app/call-detail";
import { PhoneCell } from "@/components/app/phone-cell";
import { StatusCell, InterestCell } from "@/components/app/lead-bits";

const cols = [
  { key: "id", label: "ID", text: (l: Lead) => l.id, cell: (l: Lead) => <span className="font-mono text-[0.74rem] text-grey">{l.id}</span>, width: "80px" },
  { key: "name", label: "Lead", text: (l: Lead) => l.name, cell: (l: Lead) => <span className="font-medium">{l.name}</span> },
  { key: "phone", label: "Phone", cell: (l: Lead) => <PhoneCell phone={l.phone} />, hideBelow: "md" as const },
  { key: "status", label: "Status", text: (l: Lead) => l.status, cell: (l: Lead) => <StatusCell s={l.status} /> },
  { key: "interest", label: "Interest", text: (l: Lead) => l.interest, cell: (l: Lead) => <InterestCell i={l.interest} /> },
  { key: "dur", label: "Call", align: "right" as const, text: (l: Lead) => String(l.duration), cell: (l: Lead) => (l.duration ? clock(l.duration) : "—"), hideBelow: "sm" as const },
  { key: "cost", label: "Cost", align: "right" as const, text: (l: Lead) => String(l.cost), cell: (l: Lead) => inr2(l.cost), hideBelow: "sm" as const },
];

export default function ProofPage() {
  const [open, setOpen] = useState<Call | null>(null);
  const [lightOnly, setLightOnly] = useState(false);

  const calls = useMemo(() => {
    const completed = CALLS.filter((c) => c.lead.duration > 0);
    return lightOnly ? completed.filter((c) => c.tools.length <= 3) : completed;
  }, [lightOnly]);

  if (!calls.length) {
    return (
      <>
        <PageHead kicker="Proof of work" title="Proof." />
        <EmptyState title="No completed executions yet." body="Proof accrues as the workforce completes tasks — every completed action produces a signed record." />
      </>
    );
  }

  return (
    <>
      <PageHead
        kicker="Proof of work · Workspace"
        title="Proof."
        sub="Completed executions with inputs, validations and outputs — the layer your number-reporting rests on. Open one: the trace is the receipt."
        actions={
          <button
            onClick={() => setLightOnly((v) => !v)}
            aria-pressed={lightOnly}
            className={"meta rounded-sm border px-4 py-2.5 transition-colors " + (lightOnly ? "border-ink bg-ink text-paper" : "border-line-2 text-grey hover:border-ink hover:text-ink")}
          >
            {lightOnly ? "Filtered — light executions" : "Executive summary (lighter calls)"}
          </button>
        }
      />

      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="Completed executions" value={num(3102)} sub="Today, workspace-wide" />
        <Tile label="Ledger rows" value={num(LEADS.length + CALLS.length)} sub={`${num(LEADS.length)} leads · ${num(CALLS.length)} calls`} />
        <Tile label="Convinced on call" value={num(OUTCOMES.convinced)} sub="Signed outcome verdicts" />
        <Tile label="Interventions" value="23" sub="Every one producible" tone="amber" />
      </div>

      <Panel className="mb-8" title="The evidence chain" kicker="HOW A NUMBER BECOMES A RECEIPT">
        <div className="meta flex flex-wrap items-center gap-x-3 gap-y-2 text-grey-2">
          <span className="rounded-full bg-ink px-3 py-1.5 text-paper">NUMBER</span>
          <span aria-hidden="true">→</span>
          <span className="rounded-full border border-line-2 px-3 py-1.5 text-grey">RECORDS — the leads and calls behind it</span>
          <span aria-hidden="true">→</span>
          <span className="rounded-full border border-line-2 px-3 py-1.5 text-grey">EXECUTION — the trace of each run</span>
          <span aria-hidden="true">→</span>
          <span className="rounded-full border border-orange/40 bg-orange-tint px-3 py-1.5 text-orange-deep">EVIDENCE — signed, replayable edges</span>
        </div>
        <p className="mt-4 text-[0.88rem] leading-relaxed text-grey">
          Reports aggregate; audit drills. Click any row below to open the execution that produced the outcome — every
          node of the trace (input → validation → tool → result) is rendered from the same deterministic ledger.
        </p>
      </Panel>

      <Panel title="Execution ledger" kicker={`${num(calls.length)} COMPLETED CONVERSATIONS ON RECORD · CLICK FOR FULL EVIDENCE`} pad>
        <DataTable rows={calls.map((c) => c.lead)} cols={cols} rowKey={(l) => l.id}
          onRow={(l) => setOpen(calls.find((c) => c.lead.id === l.id) ?? null)}
          searchPlaceholder="Search completed executions…" pageSize={10} />
      </Panel>

      <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-md border border-line bg-paper p-5 md:flex-row md:items-center">
        <p className="max-w-[70ch] text-[0.88rem] leading-relaxed text-grey">
          Traces are replay-safe: the same input produces the same edge sequence, so verification runs double as
          forensic replays. Chain-of-thought is never exposed — only auditable actions.
        </p>
        <Link href="/app/workforce/voice-sales/leads" className="meta shrink-0 rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">
          Open the flagship ledger →
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Chip tone="blue">SIGNATURE SCHEME: SHA-256 CHAINS</Chip>
        <Chip tone="neutral">REPLAY: DETERMINISTIC</Chip>
        <Chip tone="neutral">CHAIN-OF-THOUGHT: NEVER EXPOSED</Chip>
        <Chip tone="amber">SILENT EDITS: IMPOSSIBLE — WRITE-ONCE LEDGER</Chip>
      </div>

      <Drawer open={Boolean(open)} onClose={() => setOpen(null)} wide
        kicker={open ? `${open.id} · ${open.lead.id} · ${open.start}–${open.end}` : ""}
        title={open ? open.lead.name : ""}>
        {open ? <CallDetail call={open} /> : null}
      </Drawer>
    </>
  );
}
