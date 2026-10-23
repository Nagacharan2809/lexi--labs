"use client";

/* OUTCOMES (workspace) — the honesty ledger across the whole floor. */

import { useMemo, useState } from "react";
import Link from "next/link";
import { LEADS, OUTCOMES, VOICE_TODAY, type Lead } from "@/lib/app/data";
import { clock, inr2, num } from "@/lib/app/format";
import { PageHead, Panel, Tile } from "@/components/app/ui";
import { VFunnel } from "@/components/app/charts";
import { DataTable, type Col } from "@/components/app/table";
import { PhoneCell } from "@/components/app/phone-cell";
import { BoolCell, StatusCell, InterestCell } from "@/components/app/lead-bits";

const DRILL: Col<Lead>[] = [
  { key: "id", label: "ID", text: (l) => l.id, cell: (l) => <span className="font-mono text-[0.74rem] text-grey">{l.id}</span> },
  { key: "name", label: "Lead", text: (l) => l.name, cell: (l) => <span className="font-medium">{l.name}</span> },
  { key: "phone", label: "Phone", cell: (l) => <PhoneCell phone={l.phone} />, hideBelow: "md" },
  { key: "status", label: "Status", text: (l) => l.status, cell: (l) => <StatusCell s={l.status} /> },
  { key: "interest", label: "Interest", text: (l) => l.interest, cell: (l) => <InterestCell i={l.interest} /> },
  { key: "conf", label: "Confirmed", text: (l) => (l.confirmed ? "yes" : "no"), cell: (l) => <BoolCell v={l.confirmed} />, hideBelow: "sm" },
  { key: "dur", label: "Call", align: "right", text: (l) => String(l.duration), cell: (l) => (l.duration ? clock(l.duration) : "—"), hideBelow: "sm" },
];

export default function WorkspaceOutcomesPage() {
  const [openLabel, setOpenLabel] = useState<string | null>(null);

  const bands = useMemo(() => [
    { label: "Leads received", n: OUTCOMES.leads, f: () => true },
    { label: "Calls completed", n: OUTCOMES.completed, f: (l: Lead) => l.duration > 0 || l.attempts > 0 },
    { label: "Connected", n: OUTCOMES.connected, f: (l: Lead) => l.duration > 0 },
    { label: "Interested — intent", n: OUTCOMES.interested, f: (l: Lead) => l.interest === "interested" },
    { label: "Convinced — sales", n: OUTCOMES.convinced, f: (l: Lead) => l.convinced },
    { label: "Confirmed — final", n: OUTCOMES.confirmed, f: (l: Lead) => l.confirmed },
  ], []);

  const active = bands.find((b) => b.label === openLabel);

  return (
    <>
      <PageHead
        kicker="Outcomes · Workspace"
        title="Outcomes, floor-wide."
        sub="Intent, sales and final outcomes across every employee — numbers you can open to records, then executions, then evidence."
      />

      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="Leads in ledger" value={num(LEADS.length)} sub="All charts trace to this count" />
        <Tile label="Interested (intent)" value={num(OUTCOMES.interested)} sub="35% of the connected set" />
        <Tile label="Confirmed (final)" value={num(OUTCOMES.confirmed)} sub="Includes 32 follow-up flow bookings" tone="blue" />
        <Tile label="Call cost of the day" value={inr2(LEADS.reduce((a, l) => a + l.cost, 0))} sub="Ledger-audited" />
      </div>

      <Panel className="mb-6" title="The funnel — three bands, no contradictions" kicker="94 CONVINCED vs 126 CONFIRMED IS NOT A TYPO — EXPLAINED INSIDE">
        <div className="grid gap-8 lg:grid-cols-2">
          <VFunnel
            steps={[
              { label: "Leads received", value: num(OUTCOMES.leads), band: "INTAKE — every known lead got an outcome" },
              { label: "Calls completed", value: num(OUTCOMES.completed), band: "Dialing congestion, invalid numbers and DNC are all counted" },
              { label: "Connected", value: num(OUTCOMES.connected), band: "82.2% pick-up on the day" },
              { label: "Interested (intent)", value: num(OUTCOMES.interested), band: "Intent band — 421 interested on the flagship today", tone: "linear-gradient(90deg,#1d4790,#2b5aa7)" },
              { label: "Convinced (sales)", value: num(OUTCOMES.convinced), band: "Sales band — 94 counter-objections converted live on the call", tone: "linear-gradient(90deg,#e8763a,#d95f2b)" },
              { label: "Confirmed (final)", value: num(OUTCOMES.confirmed), band: "Final band — 126 committed; the delta closes through the follow-up flow, never forced into one band", tone: "linear-gradient(90deg,#101114,#2b2b30)" },
            ]}
          />
          <div className="flex flex-col justify-center gap-3">
            <p className="meta text-grey-2">AUDIT ANY BLOCK — RECORDS BELOW</p>
            {bands.map((b) => (
              <button key={b.label} onClick={() => setOpenLabel(openLabel === b.label ? null : b.label)} aria-expanded={openLabel === b.label}
                className="group flex items-baseline justify-between gap-4 rounded-sm border border-line px-4 py-3 text-left transition-all duration-200 hover:border-ink">
                <span className="meta text-grey">{b.label}</span>
                <span className="meta font-mono tabular-nums text-ink transition-transform duration-300 ease-brand group-hover:translate-x-1">{num(b.n)} →</span>
              </button>
            ))}
          </div>
        </div>
        {active ? (
          <div className="mt-4 rounded-sm border border-line-2 bg-paper-2/40 p-4">
            <p className="meta mb-3 text-grey-2">{active.label.toUpperCase()} → {num(active.f(LEADS[0]) ? 1 : 0)} SAMPLE — OPEN THE FULL FLAGSHIP LEDGER FOR ALL {num(VOICE_TODAY.leads)} RECORDS</p>
            <DataTable rows={LEADS.filter(active.f)} cols={DRILL} rowKey={(l) => l.id} search={false} pageSize={6} compact />
          </div>
        ) : null}
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Employee outcome summary" kicker="TODAY — DERIVED FROM THE SAME LEDGER">
          <ul role="list" className="flex flex-col divide-y divide-line">
            {[
              { e: "Lexi Voice Sales", out: "126 confirmed · 61 visits", link: "/app/workforce/voice-sales/outcomes" },
              { e: "Lexi Sales", out: "61 follow-ups closed", link: "/app/workforce/sales" },
              { e: "Lexi Support", out: "288 tickets resolved", link: "/app/workforce/support" },
              { e: "Lexi Lead Generation", out: "2,013 records scored", link: "/app/workforce/lead-generator" },
              { e: "Lexi Operations", out: "Onboarding", link: "/app/workforce/operations" },
            ].map((r) => (
              <li key={r.e} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <span className="text-[0.9rem] font-medium text-ink">{r.e}</span>
                <span className="flex items-center gap-4">
                  <span className="meta text-grey">{r.out}</span>
                  <Link href={r.link} className="meta text-blue-deep hover:text-ink">OPEN →</Link>
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Why two bands" kicker="THE FUNNEL LITERATURE KEEPS LYING — WE DON'T">
          <p className="text-[0.88rem] leading-relaxed text-grey">
            Convinced means the customer said yes inside the call. Confirmed means the join landed: calendar booked or
            callback-scheduled with intent. Thirty-two confirmations came through the follow-up flow after the call —
            so forcing 126 into a single-stage funnel would quietly inflate the sales band. Lexi keeps the bands
            separate and explains the delta.
          </p>
          <p className="meta mt-4 text-grey-2">ALL {num(OUTCOMES.leads)} RECORDS ARE OPEN — <Link href="/app/workforce/voice-sales/leads" className="link-underline text-ink">GO TO THE FLAGSHIP LEDGER →</Link></p>
        </Panel>
      </div>
    </>
  );
}
