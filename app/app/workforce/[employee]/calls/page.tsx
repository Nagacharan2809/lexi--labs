"use client";

/* CALLS — every completed conversation, with recording, transcripts and traces. */

import { useState } from "react";
import Link from "next/link";
import { CALLS, type Call } from "@/lib/app/data";
import { clock, inr2, num } from "@/lib/app/format";
import { PageHead, Tile, EmptyState } from "@/components/app/ui";
import { DataTable, type Col } from "@/components/app/table";
import { Drawer } from "@/components/app/overlay";
import { CallDetail } from "@/components/app/call-detail";

export default function CallsPage() {
  const [open, setOpen] = useState<Call | null>(null);
  const connectedCalls = CALLS.filter((c) => c.lead.duration > 0).length;

  const cols: Col<Call>[] = [
    { key: "id", label: "Call", width: "84px", text: (c) => c.id, cell: (c) => <span className="font-mono text-[0.78rem] text-grey">{c.id}</span> },
    { key: "lead", label: "Lead", text: (c) => c.lead.name, cell: (c) => (
      <span className="font-medium">{c.lead.name} <span className="font-mono text-[0.72rem] text-grey-2">{c.lead.id}</span></span>
    ) },
    { key: "start", label: "Start", align: "right", text: (c) => c.start, cell: (c) => c.start, hideBelow: "md" },
    { key: "dur", label: "Duration", align: "right", text: (c) => String(c.lead.duration).padStart(5, "0"), cell: (c) => clock(c.lead.duration) },
    { key: "conn", label: "Status", filterable: true, text: (c) => c.connection, cell: (c) => (
      <span className={"meta inline-flex whitespace-nowrap rounded-full border px-2 py-0.5 " +
        (c.connection === "connected" ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : c.connection === "failed" || c.connection === "wrong number" ? "border-red-200 bg-red-50 text-red-700"
          : "border-line-2 bg-paper-3 text-grey")}>{c.connection.toUpperCase()}</span>
    ) },
    { key: "outcome", label: "Outcome", filterable: true, text: (c) => c.outcome, cell: (c) => <span className="meta text-ink">{c.outcome.toUpperCase()}</span>, hideBelow: "sm" },
    { key: "obj", label: "Objection", filterable: true, text: (c) => (c.objections[0] ? "detected" : "none"), cell: (c) => (c.objections[0] ? <span className="meta text-orange-deep">DETECTED</span> : <span className="meta text-grey-2">NONE</span>), hideBelow: "lg" },
    { key: "tools", label: "Tools", align: "right", text: (c) => String(c.tools.length), cell: (c) => <span className="tabular-nums">{c.tools.length}</span>, hideBelow: "xl" },
    { key: "cost", label: "Cost", align: "right", text: (c) => String(c.lead.cost), cell: (c) => inr2(c.lead.cost), hideBelow: "sm" },
  ];

  return (
    <>
      <PageHead
        kicker="Lexi Voice Sales · Today"
        title="Calls."
        sub={`${num(CALLS.length)} sampled conversations on the ledger. Open one — recording marker, customer transcript, objection set, CRM changes and the full execution trace.`}
        actions={
          <Link href="/app/workforce/voice-sales/outcomes" className="meta rounded-sm border border-line-2 px-4 py-2.5 text-grey transition-colors hover:border-ink hover:text-ink">
            Outcomes →
          </Link>
        }
      />

      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Tile label="Calls completed" value={num(1186)} sub="of 1,200 attempted" />
        <Tile label="Conversations" value={num(connectedCalls)} sub="Connected on the sampled set" />
        <Tile label="Avg duration" value="02:41" sub="min 0:45 · max 06:15" />
        <Tile label="Objections handled" value="522" sub="Policy-validated responses" />
        <Tile label="Escalated to human" value={num(37)} sub="Warm transfers with full context" />
      </div>

      {CALLS.length === 0 ? (
        <EmptyState title="No calls on the ledger yet." body="Calls appear here the moment the voice gateway records a conversation." />
      ) : (
        <DataTable
          rows={CALLS}
          cols={cols}
          rowKey={(c) => c.id}
          onRow={(c) => setOpen(c)}
          searchPlaceholder="Search lead name or call ID…"
          pageSize={12}
        />
      )}

      <Drawer open={Boolean(open)} onClose={() => setOpen(null)} wide
        kicker={open ? `${open.id} · ${open.lead.id} · ${open.start}–${open.end}` : ""}
        title={open ? open.lead.name : ""}>
        {open ? <CallDetail call={open} /> : null}
      </Drawer>
    </>
  );
}
