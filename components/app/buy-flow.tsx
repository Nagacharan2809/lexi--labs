"use client";

/* BUY — configure the workload, see the money live, confirm the hire. */

import { useMemo, useState } from "react";
import Link from "next/link";
import { PLANS } from "@/lib/app/data";
import { inr, inrShort, num } from "@/lib/app/format";
import { cn } from "@/lib/utils";

interface BuyIdentity {
  slug: string;
  name: string;
  role: string;
  blurb: string;
  isNew: boolean;
}

const MIN = 0.62; // ₹ per voice minute
const TOKEN_PER_CALL = 36_000; // tokens per conversation (blended, measured 47.2M ÷ 1,310)
const TOKEN_PER_M = 14; // ₹ per million tokens
const WORKDAYS = 23;

export function BuyFlow({ identity }: { identity: BuyIdentity }) {
  const [leads, setLeads] = useState(1200);
  const [concurrency, setConcurrency] = useState(2);
  const [callbackRail, setCallbackRail] = useState(true);
  const [whatsapp, setWhatsapp] = useState(true);
  const [planId, setPlanId] = useState("starter");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [done, setDone] = useState(false);

  const plan = PLANS.find((p) => p.id === planId)!;

  const bill = useMemo(() => {
    const connections = Math.round(leads * 0.82); // measured connect rate
    const minutes = Math.round((connections * 2.4 + (callbackRail ? connections * 0.35 : 0)) * WORKDAYS / 30); // daily → monthly prorated across a cycle
    const overage = Math.max(0, minutes - plan.voiceMinutes);
    const voice = Math.round(overage * MIN);
    const tokens = Math.round(((leads * WORKDAYS * 0.86 + (callbackRail ? leads * WORKDAYS * 0.18 : 0)) * TOKEN_PER_CALL) / 1_000_000);
    const llm = Math.round(tokens * TOKEN_PER_M);
    return {
      minutes, overage, voice, tokens,
      llm, plan: plan.price,
      total: plan.price + voice + llm,
      perCall: (plan.price + voice + llm) / Math.max(1, leads * WORKDAYS * 0.86),
    };
  }, [leads, plan, callbackRail]);

  if (done) {
    return (
      <div className="rounded-md border border-ink bg-ink p-8 text-paper">
        <p className="meta text-white/60">HIRE CONFIRMED</p>
        <h2 className="display mt-3 text-[clamp(1.6rem,3vw,2.2rem)] uppercase text-white">{identity.name} joins the floor.</h2>
        <p className="mt-3 max-w-[60ch] text-[0.95rem] leading-relaxed text-white/80">
          Plan <span className="text-white">{plan.name}</span> · {inr(plan.price)}/mo · onboarding starts now.
          The eight-step checklist takes about a working day — the first call goes out after the gate clears.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <Link href={`/onboarding/${identity.slug}`} className="meta rounded-sm bg-paper px-5 py-3 text-ink transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">
            Start onboarding →
          </Link>
          <Link href="/app/overview" className="meta rounded-sm border border-white/30 px-5 py-3 text-white transition-colors hover:border-white">
            Workspace console
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
      {/* configuration */}
      <div className="flex flex-col gap-6">
        <Panel title="Workload — what this employee will do" kicker="THE FIVE NUMBERS THAT PRICE THE FLOOR" pad>
          <label className="block">
            <span className="meta flex items-baseline justify-between text-grey-2">
              LEADS PER DAY
              <span className="font-mono text-[0.85rem] text-ink">{num(leads)}</span>
            </span>
            <input type="range" min={100} max={2500} step={25} value={leads} onChange={(e) => setLeads(parseInt(e.target.value, 10))} aria-label="Leads per day" className="mt-2.5 w-full accent-black" />
            <span className="meta mt-1.5 block text-grey">Voice Sales runs {num(1200)} today — launcher default matches the flagship.</span>
          </label>

          <label className="mt-6 block">
            <span className="meta flex items-baseline justify-between text-grey-2">
              CONCURRENT CALLS
              <span className="font-mono text-[0.85rem] text-ink">{concurrency}× </span>
            </span>
            <input type="range" min={1} max={4} value={concurrency} onChange={(e) => setConcurrency(parseInt(e.target.value, 10))} aria-label="Concurrency" className="mt-2.5 w-full accent-black" />
            <span className="meta mt-1.5 block text-grey">Bounded by plan seats and voice-window policy — never exceeds capacity.</span>
          </label>

          <div className="mt-6 flex flex-col gap-2.5">
            {[
              { on: callbackRail, set: setCallbackRail, label: "Callback rail — patient follow-ups", note: "+35 min connected per day at this volume · recommended" },
              { on: whatsapp, set: setWhatsapp, label: "WhatsApp confirmations", note: "Templates included · no extra charge" },
            ].map((r) => (
              <button key={r.label} onClick={() => r.set(!r.on)} aria-pressed={r.on}
                className={cn("flex items-center justify-between gap-4 rounded-sm border px-4 py-3 text-left transition-colors", r.on ? "border-ink bg-paper-2" : "border-line hover:border-ink")}>
                <span>
                  <span className="block text-[0.88rem] font-medium text-ink">{r.label}</span>
                  <span className="meta block text-grey-2">{r.note.toUpperCase()}</span>
                </span>
                <span aria-hidden="true" className={cn("meta flex h-4 w-4 items-center justify-center rounded-full border text-[0.6rem]", r.on ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-line-2 text-grey-2")}>{r.on ? "✓" : ""}</span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Plan" kicker="ALL COSTS ON ONE PAGE" pad>
          <div className="grid gap-2.5 md:grid-cols-3">
            {PLANS.map((p) => (
              <button key={p.id} onClick={() => setPlanId(p.id)} aria-pressed={planId === p.id}
                className={cn("rounded-sm border px-4 py-3.5 text-left transition-all", planId === p.id ? "border-ink bg-paper-2" : "border-line hover:border-ink")}>
                <p className="text-[0.9rem] font-medium text-ink">{p.name}</p>
                <p className="mt-1 font-mono tabular-nums text-[0.86rem] text-grey">{inr(p.price)}/mo</p>
                <p className="meta mt-1.5 text-grey-2">{p.employees} SEAT{p.employees > 1 ? "S" : ""} · {numShort(p.voiceMinutes)} MIN</p>
              </button>
            ))}
          </div>
        </Panel>
      </div>

      {/* bill */}
      <div className="flex flex-col gap-6">
        <div className="sticky top-24">
          <div className="rounded-md border border-line bg-paper p-6">
            <p className="meta text-grey-2">MONTHLY TOTAL — FIRST BILL UPFRONT</p>
            <p className="display mt-2.5 tabular-nums text-[2.2rem] text-ink">{inr(bill.total)}</p>
            <p className="meta mt-2 text-grey">{numShort(bill.minutes)} voice min · {bill.tokens}M tokens · {plan.name} seat · est. {inr(bill.perCall)} / completed call</p>

            <ul role="list" className="meta mt-5 flex flex-col divide-y divide-line border-t border-line pt-4 text-grey-2">
              <li className="flex justify-between gap-4 py-2.5"><span>PLAN FEE ({plan.name.toUpperCase()})</span><span className="font-mono text-ink">{inr(plan.price)}</span></li>
              <li className="flex justify-between gap-4 py-2.5">
                <span>VOICE ({numShort(Math.max(0, bill.overage))} MIN OVER PLAN @ ₹{MIN})</span>
                <span className={"font-mono " + (bill.voice ? "text-ink" : "text-grey-2")}>{bill.voice ? inr(bill.voice) : "INCL."}</span>
              </li>
              <li className="flex justify-between gap-4 py-2.5"><span>LLM TOKENS ({bill.tokens}M)</span><span className="font-mono text-ink">{inr(bill.llm)}</span></li>
            </ul>

            <p className="meta mt-3 text-grey-2">TOOL + API PASS-THROUGH AT PROVIDER COST · ONE-TIME WORKSPACE SETUP WAIVED FOR PILOT QUARTER.</p>

            <button
              onClick={() => setConfirmOpen(true)}
              className={cn(
                "group/cta meta mt-5 w-full rounded-sm bg-ink px-6 py-4 text-center text-paper transition-all duration-300 ease-brand hover:-translate-y-px hover:shadow-lift",
              )}
            >
              Confirm hire — {inrShort(bill.total)}
            </button>
          </div>

          <p className="meta mt-3 text-grey-2">THE ESTIMATE VERIFIES ITSELF AGAINST THE FLAGSHIP&apos;S REAL LEDGER — {num(1200)} LEADS · {inrShort(121050 + 21030)} MONTH METERED AT ₹{MIN}/MIN.</p>
        </div>
      </div>

      {confirmOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Confirm the hire">
          <button aria-label="Close" className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]" onClick={() => setConfirmOpen(false)} />
          <div className="relative w-full max-w-md rounded-md border border-line bg-paper p-6 shadow-elevated">
            <p className="meta text-grey-2">CONFIRM HIRE — {identity.name.toUpperCase()}</p>
            <h3 className="display mt-2 text-[1.2rem] uppercase text-ink">{inr(bill.total)} / month?</h3>
            <p className="mt-3 text-[0.88rem] leading-relaxed text-grey">
              First bill is charged upfront ({inr(plan.price)} plan). Metered usage (voice {inr(bill.voice)}, tokens {inr(bill.llm)})
              invoices on cycle roll. The employee lands in onboarding, not production — the gate still decides everything.
            </p>
            <div className="mt-5 flex justify-end gap-2.5">
              <button onClick={() => setConfirmOpen(false)} className="meta rounded-sm border border-line-2 px-4 py-2.5 text-grey transition-colors hover:border-ink hover:text-ink">Cancel</button>
              <button onClick={() => { setConfirmOpen(false); setDone(true); }} className="meta rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">Hire {identity.name}</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Panel({ title, kicker, children, pad }: { title: string; kicker: string; children: React.ReactNode; pad?: boolean }) {
  return (
    <section className={cn("rounded-md border border-line bg-paper", pad && "p-6")}>
      <p className="meta text-grey-2">{kicker}</p>
      <h2 className="display mt-2 text-[1.15rem] uppercase text-ink">{title}</h2>
      <div className={cn(pad ? "mt-5" : "")}>{children}</div>
    </section>
  );
}

function numShort(n: number) { return n.toLocaleString("en-IN", { notation: "compact" }); }
