"use client";

/* APPROVALS — the human-in-the-loop centre. Approve, reject, delegate — with evidence. */

import { useMemo, useState } from "react";
import Link from "next/link";
import { APPROVALS, type Approval } from "@/lib/app/data";
import { PageHead, Panel, Chip, Tile, EmptyState } from "@/components/app/ui";
import { Drawer } from "@/components/app/overlay";
import { Ticker } from "@/components/app/live";

type Decision = { kind: "approved" | "rejected" | "delegated"; at: string; actor: string; note?: string };

export default function ApprovalsPage() {
  const [queue, setQueue] = useState<Approval[]>(APPROVALS);
  const [open, setOpen] = useState<Approval | null>(null);
  const [decided, setDecided] = useState<Record<string, Decision>>({});
  const [delegating, setDelegating] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const decide = (id: string, kind: Decision["kind"], noteLocal?: string) => {
    const at = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setDecided((d) => ({ ...d, [id]: { kind, at, actor: "Nagacharan", note: noteLocal } }));
    setQueue((q) => q.filter((a) => a.id !== id));
    setOpen(null);
    setDelegating(null);
    setNote("");
  };

  const openApproval = open && !decided[open.id] ? open : null;
  const counts = useMemo(() => ({
    sensitive: queue.filter((a) => a.severity === "sensitive").length,
    routine: queue.filter((a) => a.severity === "routine").length,
  }), [queue]);
  const decidedIds = Object.keys(decided);

  return (
    <>
      <PageHead
        kicker="Approvals · Workspace"
        title="Human decisions."
        sub="Each card carries the input, the policy line and the ask — designed to be decided in seconds. Approvals are the only state where the employee holds an action without producing a result."
        actions={queue.length ? <Chip tone="amber" pulse>{queue.length} PENDING</Chip> : <Chip tone="green" pulse>QUEUE CLEAR</Chip>}
      />

      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="Pending" value={queue.length} sub={`${counts.sensitive} sensitive · ${counts.routine} routine`} tone={queue.length ? "amber" : "blue"} />
        <Tile label="Median response" value="94s" sub="Slack relay on sensitive" />
        <Tile label="Decided today" value={9 + decidedIds.length} sub="Trail below" />
        <Tile label="Blocked on you" value={queue.filter((a) => a.id === "AP-0231").length ? "1" : "0"} sub="Free after queue clears" />
      </div>

      {/* queue */}
      <Panel className="mb-6" title="Queue" kicker="OLDEST LAST FOR CONVENTION — SENSITIVE COMPULSORILY LABELED" pad>
        {queue.length ? (
          <ul role="list" className="grid gap-3 md:grid-cols-2">
            {queue.map((a) => (
              <li key={a.id}>
                <button onClick={() => setOpen(a)}
                  className="group relative flex w-full flex-col gap-2 rounded-md border border-line bg-paper p-4 text-left transition-all duration-300 ease-brand hover:-translate-y-px hover:border-ink hover:shadow-lift">
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 grad-rule transition-transform duration-500 ease-brand group-hover:scale-x-100" />
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[0.92rem] font-medium text-ink">{a.action}</p>
                      <p className="meta mt-1 text-grey">{a.employee} · {a.requested}</p>
                    </div>
                    <Chip tone={a.severity === "sensitive" ? "red" : "amber"}>{a.severity.toUpperCase()}</Chip>
                  </div>
                  <p className="truncate text-[0.85rem] text-grey">{a.reason}</p>
                  <p className="meta font-mono text-grey-2">{a.id} · <span className="text-blue-deep">TICKING <Ticker fromSec={34} /></span></p>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="Queue clear — nothing needs a human right now."
            body="Employees resume full speed. Done decisions stay in the audit trail below."
            action={<Link href="/app/proof" className="meta rounded-sm border border-line-2 px-4 py-2.5 text-grey transition-colors hover:border-ink hover:text-ink">Review proofs instead →</Link>}
          />
        )}
      </Panel>

      {/* decided */}
      {decidedIds.length ? (
        <Panel className="mb-6" title="Decided in this session" kicker="WRITE-AHEAD TRAIL — THIS IS THE LEDGER ENTRY">
          <ul role="list" className="divide-y divide-line">
            {decidedIds.map((id) => {
              const d = decided[id];
              return (
                <li key={id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <span className="flex items-baseline gap-3">
                    <span className="font-mono text-[0.78rem] text-grey-2">{id}</span>
                    <span className="text-[0.88rem] text-ink">{APPROVALS.find((a) => a.id === id)?.action}</span>
                  </span>
                  <span className="meta flex items-center gap-3">
                    <Chip tone={d.kind === "approved" ? "green" : d.kind === "rejected" ? "red" : "blue"}>{d.kind.toUpperCase()}</Chip>
                    <span className="text-grey-2">{d.at} · {d.actor}</span>
                    {d.note ? <span className="text-grey">“{d.note}”</span> : null}
                  </span>
                </li>
              );
            })}
          </ul>
        </Panel>
      ) : null}

      {/* persistent audit */}
      <Panel title="Earlier decisions — October" kicker="UNMODIFIABLE">
        <ol className="relative flex flex-col">
          <span aria-hidden="true" className="absolute bottom-3 left-[7px] top-3 w-px bg-line-2" />
          {[
            { at: "12:41", who: "Aarav Mehta", text: "AP-0228 approved — 10% discount on Green Meadows 2 BHK for Suresh K. Reason: competitor quote matched." },
            { at: "11:58", who: "Priya Nair", text: "AP-0225 rejected — request to publish pricing on LinkedIn. Policy: marketing claims require legal review." },
            { at: "11:20", who: "Nagacharan", text: "AP-0224 delegated — refund gap verification to Dev Raman with 4h SLA." },
            { at: "09:47", who: "Verify bot", text: "Daily approvals digest — 6 pending overnight · 0 missed SLA." },
          ].map((a, i) => (
            <li key={i} className="relative flex flex-col gap-1 py-2.5 pl-8">
              <span aria-hidden="true" className="absolute left-0 top-3.5 h-[15px] w-[15px] rounded-full border-[1.5px] border-line-2 bg-paper" />
              <div className="meta flex items-baseline justify-between gap-3">
                <span className="text-ink">{a.who}</span>
                <span className="font-mono text-grey-2">{a.at}</span>
              </div>
              <p className="text-[0.86rem] text-grey">{a.text}</p>
            </li>
          ))}
        </ol>
      </Panel>

      {/* decision drawer */}
      <Drawer open={Boolean(openApproval)} onClose={() => setOpen(null)}
        kicker={openApproval ? `${openApproval.id} · ${openApproval.employee} · ${openApproval.requested}` : ""}
        title={openApproval?.action ?? ""}>
        {openApproval ? (
          <div className="flex flex-col gap-7">
            <div className="flex flex-wrap gap-2">
              <Chip tone={openApproval.severity === "sensitive" ? "red" : "amber"}>{openApproval.severity.toUpperCase()}</Chip>
              <Chip tone="neutral">OPEN {openApproval.requested.toUpperCase()}</Chip>
            </div>

            <div>
              <p className="meta mb-2.5 text-grey-2">THE ASK</p>
              <p className="text-[0.95rem] leading-relaxed text-ink">{openApproval.reason}</p>
            </div>

            <div>
              <p className="meta mb-2.5 text-grey-2">POLICY CONTEXT</p>
              <ul role="list" className="flex flex-col gap-2">
                {openApproval.context.map((c) => (
                  <li key={c} className="flex items-start gap-2.5 rounded-sm border border-line px-3.5 py-2.5 text-[0.86rem]">
                    <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full grad-rule" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <label className="meta text-grey-2" htmlFor="decision-note">DECISION NOTE (OPTIONAL — GOES TO THE AUDIT)</label>
              <input
                id="decision-note"
                value={note}
                onChange={(e) => { setNote(e.target.value); }}
                placeholder="e.g. approved — matches last week's precedent"
                className="field mt-1.5 w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => decide(openApproval.id, "approved", note)}
                className="meta rounded-sm bg-emerald-600 px-4 py-3 text-white transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift"
              >
                Approve — allow the action
              </button>
              <button
                onClick={() => decide(openApproval.id, "rejected", note)}
                className="meta rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-red-700 transition-colors hover:border-red-300"
              >
                Reject — park & retrain
              </button>
            </div>
            <button
              onClick={() => setDelegating(openApproval.id)}
              className="meta rounded-sm border border-line-2 px-4 py-3 text-grey transition-colors hover:border-ink hover:text-ink"
            >
              Delegate to teammate
            </button>

            {delegating === openApproval.id ? (
              <div className="rounded-sm border border-blue/25 bg-blue-tint p-4">
                <p className="meta mb-2.5 text-blue-deep">DELEGATE TO</p>
                <div className="flex flex-wrap gap-1.5">
                  {["Aarav Mehta (Admin)", "Priya Nair (Builder)", "Dev Raman (Operator)"].map((p) => (
                    <button
                      key={p}
                      onClick={() => decide(openApproval.id, "delegated", p)}
                      className="meta rounded-full border border-blue/30 bg-paper px-3 py-1.5 text-blue-deep transition-colors hover:bg-paper-2"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </Drawer>
    </>
  );
}
