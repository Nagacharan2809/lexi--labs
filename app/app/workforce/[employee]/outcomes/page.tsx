"use client";

/* OUTCOMES — NUMBER → RECORDS → EXECUTION → EVIDENCE.
   Every aggregate is a button into the actual lead records. */

import { useState } from "react";
import Link from "next/link";
import { LEADS, OUTCOMES, type Lead } from "@/lib/app/data";
import { clock, inr2, num } from "@/lib/app/format";
import { PageHead, Panel, Chip, Tile } from "@/components/app/ui";
import { VFunnel, HBars } from "@/components/app/charts";
import { DataTable, type Col } from "@/components/app/table";
import { Drawer } from "@/components/app/overlay";
import { PhoneCell } from "@/components/app/phone-cell";
import { StatusCell, InterestCell, ScopeList } from "@/components/app/lead-bits";
import { AnimatedNumber } from "@/components/app/live";

export default function OutcomesPage() {
  void LEADS; // dataset constant; filtering happens per metric
  return (
    <>
      <PageHead
        kicker="Outcomes · Lexi Voice Sales · Today"
        title="Outcomes."
        sub="Three honest bands — intent outcomes, sales outcomes and final outcomes. Click any number: the ledger opens, the records are the same ones the employee acted on."
      />
      <IntentBand />
      <SalesBand />
      <FinalBand />
      <CallbackCenter />
      <ObjectionCenter />
    </>
  );
}

/* -- the metric→records primitive --------------------------------------- */

function MetricTable({ metric, rows, cols, title }: {
  metric: string; rows: Lead[]; cols: Col<Lead>[]; title: string;
}) {
  return (
    <div className="mt-4 rounded-sm border border-line-2 bg-paper-2/40 p-4">
      <p className="meta mb-3 flex flex-wrap items-baseline justify-between gap-2 text-grey-2">
        <span>{metric.toUpperCase()} → {num(rows.length)} RECORDS — THE UNDERLYING LEADS</span>
        <Link href="/app/workforce/voice-sales/leads" className="link-underline text-ink">FULL LEDGER →</Link>
      </p>
      <DataTable rows={rows} cols={cols} rowKey={(l) => l.id} search={false} pageSize={6} compact />
      <p className="meta mt-3 text-grey-2">{title} — ledger-committed at 21:00 daily job.</p>
    </div>
  );
}

const DRILL_COLS: Col<Lead>[] = [
  { key: "id", label: "ID", text: (l) => l.id, cell: (l) => <span className="font-mono text-[0.74rem] text-grey">{l.id}</span> },
  { key: "name", label: "Name", text: (l) => l.name, cell: (l) => <span className="font-medium">{l.name}</span> },
  { key: "phone", label: "Phone", cell: (l) => <PhoneCell phone={l.phone} />, hideBelow: "md" },
  { key: "status", label: "Status", text: (l) => l.status, cell: (l) => <StatusCell s={l.status} /> },
  { key: "interest", label: "Interest", text: (l) => l.interest, cell: (l) => <InterestCell i={l.interest} /> },
  { key: "dur", label: "Call", align: "right", text: (l) => String(l.duration), cell: (l) => (l.duration ? clock(l.duration) : "—"), hideBelow: "sm" },
  { key: "cost", label: "Cost", align: "right", text: (l) => String(l.cost), cell: (l) => inr2(l.cost), hideBelow: "sm" },
];

/* -- bands --------------------------------------------------------------- */

function MetricButton({ label, value, sub, dau }: {
  label: string; value: React.ReactNode; sub?: string; dau?: boolean;
}) {
  void dau;
  return (
    <button className="group relative w-full rounded-md border border-line bg-paper p-4 text-left transition-all duration-300 ease-brand hover:-translate-y-px hover:shadow-lift">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 grad-rule transition-transform duration-500 ease-brand group-hover:scale-x-100" />
      <p className="meta text-grey-2">{label}</p>
      <p className="display mt-2 flex items-center justify-between gap-2 tabular-nums text-[1.65rem] text-ink">
        {value}
        <span aria-hidden="true" className="meta text-grey-2 opacity-0 transition-opacity group-hover:opacity-100">VIEW →</span>
      </p>
      {sub ? <p className="meta mt-1.5 text-grey">{sub}</p> : null}
    </button>
  );
}

function IntentBand() {
  const fs = (p: (l: Lead) => boolean) => LEADS.filter(p);
  const groups = [
    { label: "Interested", n: OUTCOMES.interested, f: (l: Lead) => l.interest === "interested" },
    { label: "Not interested", n: OUTCOMES.notInterested, f: (l: Lead) => l.interest === "not-interested" },
    { label: "Callback requested", n: OUTCOMES.callbackLeads, f: (l: Lead) => l.interest === "callback" },
    { label: "Needs information", n: OUTCOMES.maybe, f: (l: Lead) => l.interest === "maybe" },
    { label: "No answer", n: OUTCOMES.noAnswer, f: (l: Lead) => l.status === "no-answer" },
    { label: "Busy", n: OUTCOMES.busy, f: (l: Lead) => l.status === "busy" },
    { label: "Failed", n: OUTCOMES.failed, f: (l: Lead) => l.status === "failed" },
    { label: "Wrong number", n: OUTCOMES.wrong, f: (l: Lead) => l.status === "wrong-number" },
  ];
  const [open, setOpen] = useState<string | null>(null);
  const active = groups.find((g) => g.label === open);
  return (
    <Panel className="mb-6" title="Intent outcomes" kicker="BAND 1 OF 3 · WHAT THE CALLER DECIDED ABOUT YOU"
      actions={<Link href="/app/workforce/voice-sales/calls" className="meta link-underline text-ink">CONVERSATIONS →</Link>}>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {groups.map((g) => (
          <button key={g.label} onClick={() => setOpen(open === g.label ? null : g.label)}
            className="group text-left" aria-expanded={open === g.label}>
            <MetricButton label={g.label} value={num(g.n)} sub="Click for records" />
          </button>
        ))}
      </div>
      {active ? (
        <MetricTable metric={active.label} rows={fs(active.f)} cols={DRILL_COLS}
          title={`${active.n} records carry this intent in the outcome ledger`} />
      ) : null}
    </Panel>
  );
}

function SalesBand() {
  const [open, setOpen] = useState<string | null>(null);
  const groups = [
    { label: "Convinced on call", n: OUTCOMES.convinced, f: (l: Lead) => l.convinced },
    { label: "Confirmed", n: OUTCOMES.confirmed, f: (l: Lead) => l.confirmed },
    { label: "Appointment booked", n: 94, f: (l: Lead) => l.appointment && !l.escalated },
    { label: "Human escalated", n: OUTCOMES.escalated, f: (l: Lead) => l.escalated },
  ];
  const active = groups.find((g) => g.label === open);
  return (
    <Panel className="mb-6" title="Sales outcomes" kicker="BAND 2 OF 3 · WHAT THE EMPLOYEE MOVED FORWARD">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {groups.map((g) => (
          <button key={g.label} onClick={() => setOpen(open === g.label ? null : g.label)} className="group text-left text-left" aria-expanded={open === g.label}>
            <MetricButton label={g.label} value={num(g.n)} sub="Click for records" />
          </button>
        ))}
      </div>
      {active ? (
        <MetricTable metric={active.label} rows={LEADS.filter(active.f)} cols={DRILL_COLS}
          title="Sales outcomes reference signed call verdicts — see the execution trace inside each record" />
      ) : null}
    </Panel>
  );
}

function FinalBand() {
  const funnel = [
    { label: "Leads received", value: num(OUTCOMES.leads), band: "FINAL OUTCOMES — BAND 3 · everything ends resolved", tone: "linear-gradient(90deg,#1d4790,#2b5aa7)" },
    { label: "Calls completed", value: num(OUTCOMES.completed), band: "Calls that produced a conversation or a verdict" },
    { label: "Connected", value: num(OUTCOMES.connected), band: "82.2% of the dialled set" },
    { label: "Interested — intent outcome", value: num(OUTCOMES.interested), band: "Intent band (phase 1 decision)" },
    { label: "Convinced — sales outcome", value: num(OUTCOMES.convinced), band: "Sales band (phase 2 — counter-objection reached commitment)", tone: "linear-gradient(90deg,#e8763a,#d95f2b)" },
    { label: "Confirmed — final outcome", value: num(OUTCOMES.confirmed), band: "Final band (committed + calendared). 32 bookings closed on follow-up flow — deliberately not forced through a single funnel path." },
  ];
  const [open, setOpen] = useState<string | null>(null);
  const map: Record<string, (l: Lead) => boolean> = {
    "Leads received": () => true,
    "Calls completed": (l) => l.duration > 0 || l.status !== "called",
    Connected: (l) => l.duration > 0,
    "Interested — intent outcome": (l) => l.interest === "interested",
    "Convinced — sales outcome": (l) => l.convinced,
    "Confirmed — final outcome": (l) => l.confirmed,
  };
  const active = open ? { label: open, rows: LEADS.filter(map[open]) } : null;
  return (
    <Panel className="mb-6" title="The funnel — three bands, no contradictions" kicker="BANDS EXPLAINED">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <VFunnel steps={funnel} note="Mathematically contradictory pairs (94 convinced vs 126 confirmed) are kept in different bands — confirmed includes 32 bookings closed on the follow-up flow. No metric is blended to look tidy." />
        <div className="flex flex-col justify-center gap-3">
          <p className="meta text-grey-2">AUDIT ANY BLOCK</p>
          {funnel.map((f) => (
            <button key={f.label} onClick={() => setOpen(open === f.label ? null : f.label)}
              aria-expanded={open === f.label}
              className="group flex items-baseline justify-between gap-4 rounded-sm border border-line px-4 py-3 text-left transition-all duration-200 hover:border-ink">
              <span className="meta text-grey">{f.label}</span>
              <span className="meta font-mono tabular-nums text-ink transition-transform duration-300 ease-brand group-hover:translate-x-1">OPEN RECORDS →</span>
            </button>
          ))}
        </div>
      </div>
      {active ? (
        <MetricTable metric={active.label} rows={active.rows} cols={DRILL_COLS} title="Same records the funnel reports" />
      ) : null}
    </Panel>
  );
}

/* -- callbacks ------------------------------------------------------------ */

export function CallbackCenter() {
  const callbacks = LEADS.filter((l) => l.interest === "callback");
  const [open, setOpen] = useState<Lead | null>(null);
  const [scheduled, setScheduled] = useState<string[]>([]);
  const cols: Col<Lead>[] = [
    { key: "id", label: "ID", text: (l) => l.id, cell: (l) => <span className="font-mono text-[0.74rem] text-grey">{l.id}</span> },
    { key: "name", label: "Lead", text: (l) => l.name, cell: (l) => <span className="font-medium">{l.name}</span> },
    { key: "next", label: "Requested time", text: (l) => l.nextAction, cell: (l) => l.nextAction, hideBelow: "sm" },
    { key: "priority", label: "Priority", text: (l) => (l.intent === "high" ? "high" : "med"), cell: (l) => (
      <Chip tone={l.intent === "high" ? "orange" : "neutral"}>{l.intent.toUpperCase()}</Chip>
    ), hideBelow: "md" },
    { key: "act", label: "Action", cell: (l) => (
      <span className="meta flex gap-2">
        {scheduled.includes(l.id) ? (
          <Chip tone="green" pulse>SCHEDULED</Chip>
        ) : (
          <button
            onClick={(ev) => { ev.stopPropagation(); setScheduled((s) => [...s, l.id]); }}
            className="meta text-blue-deep link-underline">CALL</button>
        )}
      </span>
    ) },
  ];
  return (
    <Panel className="mb-6" title="Callback center" kicker="REQUESTED 183 — SCHEDULED, COMPLETED, OVERDUE">
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Tile label="Requested" value={<AnimatedNumber value={OUTCOMES.callbackLeads} />} />
        <Tile label="Scheduled" value={num(142 + scheduled.length)} sub="Next window 18:30" />
        <Tile label="Completed" value="61" />
        <Tile label="Overdue" value="9" tone="amber" />
        <Tile label="Pending" value={num(OUTCOMES.callbackLeads - 142 - 61 - 9 - scheduled.length > 0 ? OUTCOMES.callbackLeads - 142 - 61 - 9 - scheduled.length : 0)} />
      </div>
      <DataTable rows={callbacks} cols={cols} rowKey={(l) => l.id} onRow={setOpen} search={false} pageSize={6} compact
        toolbar={<span className="meta text-grey-2">ACTIONS PER CALLBACK — CALL · RESCHEDULE · ESCALATE · CLOSE</span>} />
      <Drawer open={Boolean(open)} onClose={() => setOpen(null)} kicker={open ? open.id : ""} title={open ? open.name : ""}>
        {open ? (
          <div className="flex flex-col gap-5">
            <ScopeList items={[`Reason: ${open.nextAction}`, `Budget: ${open.budget}`, `Priority: ${open.intent}`, "Assigned employee: Lexi Voice Sales"]} />
            <Link href="/app/workforce/voice-sales/leads" className="meta rounded-sm bg-ink px-4 py-3 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">
              Open full record →
            </Link>
          </div>
        ) : null}
      </Drawer>
    </Panel>
  );
}

/* -- objections ------------------------------------------------------------ */

function ObjectionCenter() {
  const objectionLead = (k: string) => LEADS.filter((l) => l.objection === k);
  const kinds = ["price", "timing", "location", "trust", "competitor", "product-fit"];
  const rows = kinds.map((k) => {
    const list = objectionLead(k);
    const convAfter = list.filter((l) => l.convinced).length;
    const handled = list.filter((l) => l.outcome === "yes").length;
    return { label: k, list, convAfter, handled };
  }).sort((a, b) => b.list.length - a.list.length);
  const max = Math.max(...rows.map((r) => r.list.length), 1);
  const [open, setOpen] = useState<string | null>(null);
  const active = rows.find((r) => r.label === open);

  return (
    <Panel title="Objection analytics" kicker="EVERY DETECTED OBJECTION — HANDLING RATED AGAINST OUTCOMES">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <HBars rows={rows.map((r) => ({
          label: r.label.toUpperCase(),
          value: r.list.length,
          sub: `${num(r.convAfter)} convinced after objection · handling rate ${Math.round((r.handled / Math.max(1, r.list.length)) * 100)}%`,
        }))} max={max} />
        <div className="flex flex-col justify-center gap-3">
          <p className="meta text-grey-2">DRILL INTO AN OBJECTION CLASS</p>
          {rows.map((r) => (
            <button key={r.label} onClick={() => setOpen(open === r.label ? null : r.label)}
              aria-expanded={open === r.label}
              className="meta flex items-baseline justify-between gap-4 rounded-sm border border-line px-4 py-3 text-left transition-all duration-200 hover:border-ink">
              <span className="text-grey">{r.label.toUpperCase()}</span>
              <span className="font-mono tabular-nums text-ink">{r.list.length} →</span>
            </button>
          ))}
        </div>
      </div>
      {active ? (
        <MetricTable metric={`${active.label} objection`} rows={active.list} cols={DRILL_COLS} title="Same records feeding the bar above" />
      ) : null}
    </Panel>
  );
}
