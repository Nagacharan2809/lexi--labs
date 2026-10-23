"use client";

/* LEADS — the traceable drill-down. Every funnel number opens here. */

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LEADS, getEmployee, getTrace, callForLead, type Lead } from "@/lib/app/data";
import { clock, inr2, num } from "@/lib/app/format";
import { PageHead, Panel, Chip, Tile, EmptyState } from "@/components/app/ui";
import { DataTable, type Col } from "@/components/app/table";
import { Drawer, Modal } from "@/components/app/overlay";
import { ExecutionTrace } from "@/components/app/trace";
import { PhoneCell } from "@/components/app/phone-cell";
import { BoolCell, StatusCell, InterestCell, IntentCell, SentimentCell, ScopeList } from "@/components/app/lead-bits";

export default function LeadsPage() {
  const { employee: slug } = useParams<{ employee: string }>();
  const e = getEmployee("voice-sales");
  const [open, setOpen] = useState<Lead | null>(null);
  const [connectOpen, setConnectOpen] = useState(false);

  /* non-voice employees have no lead inventory in this demo dataset */
  if (slug !== "voice-sales") {
    return (
      <>
        <PageHead kicker={e ? `${e.name} · Leads` : "Leads"} title="Leads." />
        <EmptyState
          title="Connect a lead source to start."
          body="This employee hasn't been given a lead — assign it a channel first. Lead ingestion is configured under Integrations."
          action={
            <Link href="/app/integrations" className="meta rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">
              Open integrations
            </Link>
          }
        />
      </>
    );
  }

  const cols: Col<Lead>[] = [
    { key: "id", label: "ID", width: "74px", text: (l) => l.id, cell: (l) => <span className="font-mono text-[0.78rem] text-grey">{l.id}</span> },
    { key: "name", label: "Name", text: (l) => l.name, cell: (l) => <span className="font-medium">{l.name}</span> },
    { key: "phone", label: "Phone", cell: (l) => <PhoneCell phone={l.phone} />, hideBelow: "md" },
    { key: "status", label: "Status", filterable: true, text: (l) => l.status, cell: (l) => <StatusCell s={l.status} /> },
    { key: "outcome", label: "Outcome", filterable: true, text: (l) => l.outcome === "yes" ? "yes" : l.outcome === "no" ? "no" : "partial", cell: (l) => (
      <span className={"meta font-medium " + (l.outcome === "yes" ? "text-emerald-700" : l.outcome === "no" ? "text-grey-2" : "text-grey")}>{l.outcome.toUpperCase()}</span>
    ) },
    { key: "interest", label: "Interest", filterable: true, text: (l) => l.interest, cell: (l) => <InterestCell i={l.interest} />, hideBelow: "sm" },
    { key: "convinced", label: "Conv.", text: (l) => (l.convinced ? "yes" : "no"), cell: (l) => <BoolCell v={l.convinced} />, hideBelow: "lg" },
    { key: "confirmed", label: "Conf.", text: (l) => (l.confirmed ? "yes" : "no"), cell: (l) => <BoolCell v={l.confirmed} />, hideBelow: "lg" },
    { key: "callback", label: "Cb", text: (l) => (l.callback ? "yes" : "no"), cell: (l) => <BoolCell v={l.callback} />, hideBelow: "xl" },
    { key: "appointment", label: "Appt.", text: (l) => (l.appointment ? "yes" : "no"), cell: (l) => <BoolCell v={l.appointment} />, hideBelow: "xl" },
    { key: "intent", label: "Intent", filterable: true, text: (l) => l.intent, cell: (l) => <IntentCell i={l.intent} />, hideBelow: "lg" },
    { key: "sentiment", label: "Sentiment", text: (l) => l.sentiment, cell: (l) => <SentimentCell s={l.sentiment} />, hideBelow: "xl" },
    { key: "duration", label: "Call", align: "right", text: (l) => String(l.duration).padStart(4, "0"), cell: (l) => l.duration ? clock(l.duration) : "—" },
    { key: "attempts", label: "Try", align: "right", text: (l) => String(l.attempts), cell: (l) => <span className="tabular-nums">{l.attempts}</span>, hideBelow: "xl" },
    { key: "next", label: "Next action", text: (l) => l.nextAction, cell: (l) => <span className="text-[0.82rem] text-grey">{l.nextAction}</span>, hideBelow: "lg" },
    { key: "cost", label: "Cost", align: "right", text: (l) => String(l.cost), cell: (l) => inr2(l.cost), hideBelow: "sm" },
    { key: "at", label: "Timestamp", align: "right", text: (l) => l.at, cell: (l) => l.at, hideBelow: "sm" },
  ];

  const call = open ? callForLead(open.id) : null;

  return (
    <>
      <PageHead
        kicker="Lexi Voice Sales · Today"
        title="Leads."
        sub="1,200 records came in, 1,200 got an outcome. Click any row — the call, the trace, the objections, the cost and the next action all live inside the record."
        actions={
          <>
            <button onClick={() => setConnectOpen(true)} className="meta rounded-sm border border-line-2 px-4 py-2.5 text-grey transition-colors hover:border-ink hover:text-ink">
              Connect source
            </button>
            <ExportCsvButton />
          </>
        }
      />

      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Tile label="Records" value={num(LEADS.length)} sub="Fetched from 5 sources" href="/app/integrations" />
        <Tile label="Connected" value="986" sub="82.2% pick-up" />
        <Tile label="Interested" value="421" sub="35% of connected" />
        <Tile label="Confirmed" value="126" sub="94 convinced by phone" />
        <Tile label="Total call cost" value={inr2(LEADS.reduce((a, l) => a + l.cost, 0))} sub="Per-lead ₹1.6–4.0 · ledger-audited" />
      </div>

      <DataTable
        rows={LEADS}
        cols={cols}
        rowKey={(l) => l.id}
        onRow={(l) => setOpen(l)}
        searchPlaceholder="Search name, ID, source…"
        pageSize={14}
        empty={{ title: "No leads match", body: "Clear a filter, or connect a new source under Integrations." }}
      />

      <p className="meta mt-6 text-grey-2">
        FLAGSHIP RECORD: LD-1000 “CHARAN” — CALLED · INTERESTED · CONVINCED · CONFIRMED · 04:18 · ₹2.64 (in row 1 — filtered first by outcome: yes).
      </p>

      {/* record drawer */}
      <Drawer open={Boolean(open)} onClose={() => setOpen(null)} wide
        kicker={open ? `${open.id} · ${open.source} · ${open.at}` : ""}
        title={open ? open.name : ""}>
        {open && call ? <LeadDetail lead={open} call={call} /> : null}
      </Drawer>

      <ConnectSourceModal open={connectOpen} onClose={() => setConnectOpen(false)} />
    </>
  );
}

/* --------------------------------------------------------------- drawer */

function LeadDetail({ lead: l, call }: { lead: Lead; call: ReturnType<typeof callForLead> }) {
  const connected = l.duration > 0;
  return (
    <div className="flex flex-col gap-8">
      {/* verdict strip */}
      <div className="flex flex-wrap gap-2">
        <StatusCell s={l.status} />
        <InterestCell i={l.interest} />
        <IntentCell i={l.intent} />
        <Chip tone={l.outcome === "yes" ? "green" : "neutral"}>OUTCOME · {l.outcome.toUpperCase()}</Chip>
        {l.escalated ? <Chip tone="amber" pulse>ESCALATED</Chip> : null}
      </div>

      {/* the four verdicts the funnel is built on */}
      <div className="grid grid-cols-4 gap-2.5">
        {[
          { k: "CALLED", v: connected || l.attempts > 0 },
          { k: "INTERESTED", v: l.interest === "interested" },
          { k: "CONVINCED", v: l.convinced },
          { k: "CONFIRMED", v: l.confirmed },
        ].map((m) => (
          <div key={m.k} className="rounded-sm border px-3 py-2.5 text-center"
            style={m.v
              ? { borderColor: "rgba(16,17,20,0.9)", background: "#101114", color: "#fafaf7" }
              : { borderColor: "#e5e5de", background: "#f3f3ee", color: "#9a9da2" }}>
            <p className="meta text-[0.62rem]" style={{ opacity: 0.6 }}>{m.k}</p>
            <p className="display mt-1 text-[0.95rem]">{m.v ? "YES" : "NO"}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-x-10 gap-y-2 md:grid-cols-2">
        <div>
          <p className="meta mb-2 text-grey-2">Contact</p>
          <div className="text-[0.88rem] text-ink">
            <p>Phone — <PhoneCell phone={l.phone} /></p>
            <p className="text-grey">{l.email}</p>
          </div>
        </div>
        <div>
          <p className="meta mb-2 text-grey-2">Record</p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.82rem]">
            <dt className="meta text-grey-2">Phone</dt><dd className="text-grey">{l.phone}</dd>
            <dt className="meta text-grey-2">Source</dt><dd className="text-ink">{l.source}</dd>
          </dl>
        </div>
      </div>

      {/* requirement */}
      <div>
        <p className="meta mb-3 text-grey-2">Qualification</p>
        <div className="grid gap-x-10 gap-y-2 md:grid-cols-2">
          <dl className="text-[0.84rem]">
            <div className="flex justify-between border-b border-line py-1.5"><dt className="meta text-grey-2">Budget</dt><dd className="text-ink">{l.budget}</dd></div>
            <div className="flex justify-between border-b border-line py-1.5"><dt className="meta text-grey-2">Requirement</dt><dd className="text-ink">{l.requirement}</dd></div>
            <div className="flex justify-between border-b border-line py-1.5"><dt className="meta text-grey-2">Project / location</dt><dd className="text-ink">{l.location}</dd></div>
            <div className="flex justify-between border-b border-line py-1.5"><dt className="meta text-grey-2">Sentiment</dt><dd className="text-ink"><SentimentCell s={l.sentiment} /></dd></div>
            <div className="flex justify-between py-1.5"><dt className="meta text-grey-2">AI confidence</dt><dd className="font-mono text-ink">{l.intent === "high" ? "0.94" : l.intent === "med" ? "0.71" : "0.56"}</dd></div>
          </dl>
          <dl className="text-[0.84rem]">
            <div className="flex justify-between border-b border-line py-1.5"><dt className="meta text-grey-2">Objection</dt><dd className="text-ink">{l.objection ? l.objection.toUpperCase() : "NONE"}</dd></div>
            <div className="flex justify-between border-b border-line py-1.5"><dt className="meta text-grey-2">Next action</dt><dd className="text-ink">{l.nextAction}</dd></div>
            <div className="flex justify-between border-b border-line py-1.5"><dt className="meta text-grey-2">Cost</dt><dd className="font-mono text-ink">{inr2(l.cost)}</dd></div>
            <div className="flex justify-between border-b border-line py-1.5"><dt className="meta text-grey-2">Attempts</dt><dd className="font-mono text-ink">{l.attempts}</dd></div>
            <div className="flex justify-between py-1.5"><dt className="meta text-grey-2">Timestamp</dt><dd className="font-mono text-ink">{l.at}</dd></div>
          </dl>
        </div>
      </div>

      {/* call */}
      {connected ? (
        <>
          <div>
            <p className="meta mb-3 text-grey-2">Call</p>
            <div className="mb-3 flex flex-wrap gap-x-6 gap-y-1.5 text-[0.82rem] text-grey">
              <span>Call {call.id} · started {call.start} · ended {call.end}</span>
              <span className="font-mono">duration {clock(l.duration)}</span>
              <span>attempt {l.attempts}</span>
              <span className="text-emerald-700">● {call.connection}</span>
            </div>
            <Panel title="AI summary" kicker="MODEL · lexi-sales-v2.4.1">
              <p className="text-[0.9rem] leading-relaxed text-ink">{call.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                {call.tools.map((t) => <Chip key={t} tone="neutral">{t.toUpperCase()}</Chip>)}
              </div>
              <div className="mt-3">
                <p className="meta mb-1.5 text-grey-2">CRM CHANGES</p>
                <ScopeList items={call.crm} />
              </div>
            </Panel>
          </div>

          <div>
            <p className="meta mb-3 text-grey-2">Transcript</p>
            <Panel>
              <div className="flex flex-col gap-3">
                {call.transcript.map((t, i) => (
                  <div key={i} className={t.who === "AI" ? "pr-6" : "pl-6"}>
                    <p className="meta text-grey-2" style={{ textAlign: t.who === "AI" ? "left" : "right" }}>
                      {t.who === "AI" ? "LEXI · VOICE SALES" : l.name.toUpperCase()} · {clock(t.t)}
                    </p>
                    <div className={t.who === "AI" ? "mt-1 max-w-[92%] rounded-sm bg-paper-2 px-3.5 py-2.5 text-[0.87rem] leading-relaxed text-ink" : "ml-auto mt-1 max-w-[88%] rounded-sm bg-ink px-3.5 py-2.5 text-[0.87rem] leading-relaxed text-paper"}
                      style={t.who === "AI" ? {} : { textAlign: "left" }}>
                      {t.text}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div>
            <p className="meta mb-3 text-grey-2">Objections · outcome · tools</p>
            <div className="grid gap-4 md:grid-cols-2">
              <Panel title="Objections detected">
                {call.objections.length
                  ? <ScopeList items={call.objections} />
                  : <p className="text-[0.86rem] text-grey">None — policy direct path.</p>}
              </Panel>
              <Panel title="Outcome">
                <p className="display text-[1.05rem] uppercase text-ink">{call.outcome}</p>
                <p className="meta mt-2 text-grey">Next action — {l.nextAction}</p>
              </Panel>
            </div>
          </div>
        </>
      ) : (
        <Panel title="Connection" kicker="NO CONVERSATION ON RECORD">
          <p className="text-[0.9rem] text-ink">
            The employee dialled {l.attempts} time{l.attempts > 1 ? "s" : ""} — gateway status: {call.connection.toUpperCase()}. No call contents exist for this record.
          </p>
          <p className="meta mt-2 text-grey">Next action — {l.nextAction} · retry guard active</p>
        </Panel>
      )}

      {/* execution trace */}
      <div>
        <p className="meta mb-3 text-grey-2">Execution trace — Fleen runtime</p>
        <Panel title="16-node auditable action trail" kicker="CLICK A NODE FOR INPUT · DECISION · TOOL · VALIDATION">
          <ExecutionTrace nodes={traceFor(l)} />
        </Panel>
      </div>
    </div>
  );
}

function traceFor(l: Lead) {
  return getTrace(l);
}

/* --------------------------------------------------------------- shared */


function ExportCsvButton() {
  const go = () => {
    const head = ["id", "name", "phone", "source", "status", "outcome", "interest", "convinced", "confirmed", "callback", "appointment", "intent", "sentiment", "duration_sec", "attempts", "next_action", "cost_inr", "timestamp"].join(",");
    const rows = LEADS.map((l) =>
      [l.id, l.name, l.phone, l.source, l.status, l.outcome, l.interest, l.convinced, l.confirmed, l.callback, l.appointment, l.intent, l.sentiment, l.duration, l.attempts, l.nextAction, l.cost, l.at].join(","));
    const blob = new Blob([[head, ...rows].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "lexi-voice-sales-leads.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <button onClick={go} className="meta rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">
      Export CSV
    </button>
  );
}

function ConnectSourceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} kicker="Leads · ingestion" title="Connect a lead source"
      footer={
        <>
          <button onClick={onClose} className="meta rounded-sm border border-line-2 px-4 py-2.5 text-grey transition-colors hover:border-ink hover:text-ink">Cancel</button>
          <button onClick={onClose} className="meta rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">Save source</button>
        </>
      }>
      <p className="text-[0.9rem] text-grey">Wire the next intake channel for Lexi Voice Sales. This preview validates inputs and records connectivity intent; live ingestion activates with the production backend.</p>
      <div className="mt-4 flex flex-col gap-3">
        {["Meta Lead Ads", "Website Form", "Salesforce Import", "Walk-in Sync", "Custom API"].map((s, i) => (
          <label key={s} className="flex items-center justify-between gap-4 rounded-sm border border-line px-3.5 py-2.5">
            <span className="text-[0.88rem] font-medium text-ink">{s}</span>
            <input type="radio" name="source" defaultChecked={i === 0} className="h-4 w-4 accent-black" />
          </label>
        ))}
      </div>
    </Modal>
  );
}
