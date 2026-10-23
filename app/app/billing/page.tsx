"use client";

/* BILLING — plan, usage meters, invoices. Straight honesty about what is metered. */

import { useState } from "react";
import Link from "next/link";
import { PLANS, USAGE } from "@/lib/app/data";
import { inr, inrShort } from "@/lib/app/format";
import { PageHead, Panel, Tile, Chip, Progress } from "@/components/app/ui";
import { cn } from "@/lib/utils";

type Invoice = { id: string; period: string; amount: number; status: string; date?: string; note?: string };

export default function BillingPage() {
  const [posPlan, setPosPlan] = useState("growth");
  const [changeOpen, setChangeOpen] = useState(false);
  const [pending, setPending] = useState<(typeof PLANS)[number] | null>(null);
  const [applied, setApplied] = useState<string | null>(null);
  const [policyOpen, setPolicyOpen] = useState<string | null>(null);

  const planNow = PLANS.find((p) => p.id === posPlan) ?? PLANS[1];
  const estTotal = 59999 + 21030 + 121050 + 6742 + 3260;
  const tokenCost = Math.round(USAGE.llmTokensUsed * 14);
  const voiceCost = Math.round(USAGE.voiceMinutesUsed * 0.62);

  const applyPlan = () => {
    if (!pending) return;
    setPosPlan(pending.id);
    setApplied(`✓ PLAN CHANGE SIGNED — ${pending.name.toUpperCase()} FROM NEXT CYCLE · PRORATION AGAINTS UNUSED VOICE CREDIT`);
    setChangeOpen(false);
    setPending(null);
    window.setTimeout(() => setApplied(null), 5000);
  };

  return (
    <>
      <PageHead
        kicker="Billing · Workspace"
        title="The money truth."
        sub="One fixed plan, metered voice and tokens, pass-through APIs. Every rupee here reconciles to the cost lines inside analytics — no mystery charges."
        actions={<Chip tone="blue" pulse>{planNow.name.toUpperCase()} · {USAGE.period.toUpperCase()}</Chip>}
      />

      <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="Plan" value={planNow.name} sub={`${planNow.employees} employees · ${numShort(planNow.voiceMinutes)} voice min/mo`} />
        <Tile label="This cycle — est." value={inrShort(estTotal)} sub="Fixed + metered, Oct 01–23" tone="blue" />
        <Tile label="Voice spend" value={inrShort(voiceCost)} sub={`${numShort(USAGE.voiceMinutesUsed)} min @ ₹0.62`} />
        <Tile label="Token spend" value={inrShort(tokenCost)} sub={`${USAGE.llmTokensUsed}M tokens @ ₹14/1M`} />
      </div>

      {applied ? (
        <div className="mb-8 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="meta text-emerald-800">{applied}</p>
        </div>
      ) : null}

      {/* plans */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => {
          const isNow = p.id === posPlan;
          return (
            <div key={p.id} className={cn(
              "relative flex flex-col overflow-hidden rounded-md border p-5",
              isNow ? "border-ink bg-paper-2" : "border-line bg-paper",
            )}>
              {isNow ? <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] grad-rule" /> : null}
              <div className="flex items-baseline justify-between gap-3">
                <p className="display text-[1.05rem] uppercase text-ink">{p.name}</p>
                {isNow ? <Chip tone="green" pulse>CURRENT</Chip> : null}
              </div>
              <p className="mt-3 font-mono text-[1.3rem] tabular-nums text-ink">{inr(p.price)}<span className="meta text-grey-2"> /mo</span></p>
              <p className="mt-1.5 text-[0.86rem] leading-snug text-grey">{p.blurb}</p>
              <ul role="list" className="meta mt-4 flex flex-col gap-2 border-t border-line pt-3.5 text-grey-2">
                <li>{p.employees} EMPLOYEE {p.employees > 1 ? "SEATS" : "SEAT"}</li>
                <li>{numShort(p.voiceMinutes)} VOICE MINUTES</li>
                <li>ALL TOOLS + INTEGRATIONS INCLUDED</li>
                <li>VERIFICATION GATE INCLUDED</li>
              </ul>
              <div className="mt-4 flex items-center gap-2.5">
                {isNow ? (
                  <button onClick={() => setPolicyOpen(p.id)} className="meta rounded-sm border border-line-2 px-4 py-2.5 text-grey transition-colors hover:border-ink hover:text-ink">
                    Plan policy
                  </button>
                ) : (
                  <>
                    <button onClick={() => { setPending(p); setChangeOpen(true); }} className="meta rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">
                      {PLANS.findIndex((x) => x.id === p.id) > PLANS.findIndex((x) => x.id === posPlan) ? "Upgrade" : "Downgrade"}
                    </button>
                    <button onClick={() => setPolicyOpen(p.id)} className="meta text-grey transition-colors hover:text-ink">Policy</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* usage meters */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel className="mb-0" title="Usage — this cycle" kicker={`${USAGE.period} · METERS LAG ≤ 15 MIN`}>
          <div className="flex flex-col gap-5">
            <Meter label="Voice minutes" used={USAGE.voiceMinutesUsed} quota={planNow.voiceMinutes} note={`${numShort(USAGE.voiceMinutesUsed)} of ${numShort(planNow.voiceMinutes)} · ₹0.62/min beyond`} warn={USAGE.voiceMinutesUsed / planNow.voiceMinutes} />
            <Meter label="LLM tokens (M)" used={Math.round(USAGE.llmTokensUsed * 1000)} quota={500000} note={`${USAGE.llmTokensUsed}M used · ₹14/1M blended`} warn={USAGE.llmTokensUsed / 500} small />
            <Meter label="API calls (keys)" used={USAGE.apiCallsUsed} quota={10000} note={`${USAGE.apiCallsUsed} calls · ₹9 per 1k via keys`} warn={USAGE.apiCallsUsed / 10000} small />
          </div>
          <div className="mt-5 border-t border-line pt-4">
            <p className="meta text-grey-2">OVERAGE POLICY — VOICE NEVER HARD-STOPS MID-CALLS; WINDOWS THROTTLE AT 110% UNTIL CYCLE ROLLS.</p>
          </div>
        </Panel>

        <Panel className="mb-0" title="Invoices" kicker="GST-INCLUSIVE · DOWNLOAD ANY LINE" pad>
          <ul role="list" className="divide-y divide-line">
            {(USAGE.invoices as Invoice[]).map((inv) => (
              <li key={inv.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-[0.88rem] font-medium text-ink">{inv.id} · {inv.period}</p>
                  {inv.note ? <p className="meta mt-0.5 text-grey-2">{inv.note.toUpperCase()}</p> : null}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[0.86rem] tabular-nums text-ink">{inr(inv.amount)}</span>
                  <Chip tone={inv.status === "Paid" ? "green" : "amber"}>{inv.status.toUpperCase()}</Chip>
                  <button
                    onClick={() => downloadInvoice(inv)}
                    className="meta link-underline text-ink"
                  >
                    CSV
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* plan change modal */}
      {changeOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Confirm plan change">
          <button aria-label="Close" className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]" onClick={() => setChangeOpen(false)} />
          <div className="relative w-full max-w-md rounded-md border border-line bg-paper p-6 shadow-elevated">
            <p className="meta text-grey-2">CONFIRM PLAN CHANGE</p>
            <h3 className="display mt-2 text-[1.2rem] uppercase text-ink">{pending?.name} — {inr(pending?.price ?? 0)}/mo</h3>
            <p className="mt-3 text-[0.88rem] leading-relaxed text-grey">
              {pending && pending.employees < planNow.employees
                ? "Downgrades unassign employees at cycle end — the floor keeps its completed work; access trims to the new seat count."
                : "Upgrades apply next cycle with proration for remaining voice credit. Employees grant instantly on payment success."}
            </p>
            <div className="mt-5 flex justify-end gap-2.5">
              <button onClick={() => setChangeOpen(false)} className="meta rounded-sm border border-line-2 px-4 py-2.5 text-grey transition-colors hover:border-ink hover:text-ink">Cancel</button>
              <button onClick={applyPlan} className="meta rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">Sign change</button>
            </div>
          </div>
        </div>
      ) : null}

      {/* policy modal */}
      {policyOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Plan policy">
          <button aria-label="Close" className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]" onClick={() => setPolicyOpen(null)} />
          <div className="relative w-full max-w-md rounded-md border border-line bg-paper p-6 shadow-elevated">
            <p className="meta text-grey-2">PLAN POLICY</p>
            <h3 className="display mt-2 text-[1.2rem] uppercase text-ink">{(PLANS.find((p) => p.id === policyOpen)?.name ?? "").toUpperCase()}</h3>
            <ul role="list" className="meta mt-4 flex flex-col gap-2.5 text-grey">
              <li>· FIXED MONTHLY FEE BILLED PREPAID ON THE 1ST.</li>
              <li>· VOICE + TOKENS METERED; OVERAGE INVOICED ON CYCLE ROLL.</li>
              <li>· ONE-TIME WORKSPACE DEPLOYMENT: ₹1,50,000 (Waived for pilots this quarter).</li>
              <li>· NO PER-EMPLOYEE HIDDEN FEES — THE GATE AND LEDGER ARE INCLUDED.</li>
            </ul>
            <div className="mt-5 flex justify-end">
              <button onClick={() => setPolicyOpen(null)} className="meta rounded-sm border border-line-2 px-4 py-2.5 text-grey transition-colors hover:border-ink hover:text-ink">Close</button>
            </div>
          </div>
        </div>
      ) : null}

      <p className="meta mt-8 text-grey-2">COST LINES FEED <Link href="/app/analytics" className="link-underline text-ink">ANALYTICS →</Link> — SAME LEDGER, TWO LENSES. NOBODY ABSTRACTS YOUR RECEIPTS.</p>
    </>
  );
}

function Meter({ label, used, quota, note, warn, small }: {
  label: string; used: number; quota: number; note: string; warn: number; small?: boolean;
}) {
  const over = warn > 1;
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[0.9rem] font-medium text-ink">{label}</p>
        <p className={cn("font-mono tabular-nums text-[0.8rem]", over ? "text-red-700" : "text-ink")}>
          {used.toLocaleString("en-IN")} / {quota.toLocaleString("en-IN")}
        </p>
      </div>
      <div className="mt-2">
        <Progress value={Math.min(100, (used / quota) * 100)} tone={over ? "red" : warn > 0.7 ? "orange" : "blue"} />
      </div>
      <p className="meta mt-1.5 text-grey-2">{small ? note.toUpperCase() : note}</p>
    </div>
  );
}

function downloadInvoice(inv: Invoice) {
  const rows = [
    ["Invoice", inv.id],
    ["Period", inv.period],
    ["Amount (INR)", String(inv.amount)],
    ["Status", inv.status],
    ["Date", inv.date ?? "—"],
    ["Note", inv.note ?? ""],
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${inv.id}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function numShort(n: number) { return n.toLocaleString("en-IN", { notation: "compact" }); }
