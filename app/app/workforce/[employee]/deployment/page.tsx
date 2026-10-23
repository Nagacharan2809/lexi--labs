"use client";

/* DEPLOYMENT — environments, readiness checklist, and the typed-confirm deploy. */

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getEmployee, VERIFY_SCORE, VERSIONS, TESTS } from "@/lib/app/data";
import { PageHead, Panel, Chip, EmptyState } from "@/components/app/ui";

const CHECKS = [
  { label: "Verification score gate", value: `${VERIFY_SCORE}/100`, ok: VERIFY_SCORE >= 90, note: "Release gate — 12/12 tests executed" },
  { label: "Knowledge indexed", value: "12 sources · 91%", ok: true, note: "1 source still processing (draft policy)" },
  { label: "Tools connected", value: "8 of 9", ok: true, note: "Files tool unconfigured — not used by this workflow" },
  { label: "Escalation path", value: "Human queue + Slack", ok: true, note: "Warm transfer hands context in 37s" },
  { label: "Policies signed", value: "No-invention · DNC · Pricing sheet", ok: true, note: "3 guards active" },
  { label: "Cost guardrails", value: "₹4.00/call cap", ok: true, note: "Monthly ceiling ₹1.5L per employee" },
  { label: "Approval limits", value: "15% discount · ₹5,000 refund", ok: true, note: "Above limits route to humans" },
  { label: "Rollback plan", value: "v2.2.0 archived · 1-click", ok: true, note: "Previous production version kept warm" },
];

export default function DeploymentPage() {
  const { employee: slug } = useParams<{ employee: string }>();
  const e = getEmployee(slug ?? "");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"idle" | "queued" | "done">("idle");

  if (!e) {
    return (
      <>
        <PageHead kicker="Deployment" title="Deployment." />
        <EmptyState title="Employee not found." body="Return to the workforce and pick a valid employee." />
      </>
    );
  }

  if (slug !== "voice-sales") {
    return (
      <>
        <PageHead kicker={`${e.name} · Deployment`} title="Deployment." />
        <EmptyState
          title={e.status === "training" ? "Not ready — onboarding is still open." : e.status === "verification" ? "At the gate — verification must clear 90+." : "Deployment centre is empty for this employee."}
          body={e.status === "training"
            ? "Knowledge, integrations and a workflow must land before an employee can be deployed. Continuations are in the onboarding lane."
            : e.status === "verification"
              ? "The release gate is the only path to production. Run the suite, clear 90/100, then this page unlocks."
              : "This employee is managed through its schedule and workflow — nothing is pending deployment right now."}
          action={
            <Link href={`/app/workforce/${slug}/evaluations`} className="meta rounded-sm bg-ink px-4 py-2.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift">
              Open evaluations
            </Link>
          }
        />
      </>
    );
  }

  const deploy = () => {
    setConfirmOpen(false);
    setPhase("queued");
    window.setTimeout(() => setPhase("done"), 1900);
  };

  const ready = CHECKS.every((c) => c.ok);
  const prod = VERSIONS.find((v) => v.production !== undefined);

  return (
    <>
      <PageHead
        kicker="Lexi Voice Sales · Deployment"
        title="Deployment."
        sub="Three environments, one gate. Production only moves when verification, policies and tooling all pass — and a human signs the change."
        actions={
          phase === "done"
            ? <Chip tone="green" pulse>LIVE · v2.4.1</Chip>
            : <Chip tone="blue" pulse>{phase === "queued" ? "DEPLOY QUEUED" : "PRODUCTION · v2.4.1"}</Chip>
        }
      />

      {/* environments */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {[
          { name: "Sandbox", env: "v2.4.1", note: "Per-PR build · used by evaluations", tone: "neutral" as const, state: "HEALTHY" },
          { name: "Test", env: "v2.4.1", note: "Ephemeral · 48h lifetime", tone: "neutral" as const, state: "HEALTHY" },
          {
            name: "Production",
            env: "v2.4.1",
            note: `Live since Oct 21 · production success ${prod?.production ?? "96.4"}%`,
            tone: "blue" as const,
            state: phase === "done" ? "JUST DEPLOYED" : phase === "queued" ? "CHANGING" : "LIVE",
          },
        ].map((env) => (
          <div key={env.name} className={env.name === "Production" ? "rounded-md border border-ink bg-ink p-5 text-paper" : "rounded-md border border-line bg-paper p-5"}>
            <div className="flex items-center justify-between gap-3">
              <p className={env.name === "Production" ? "display text-[1.05rem] uppercase text-white" : "display text-[1.05rem] uppercase text-ink"}>{env.name}</p>
              {env.name === "Production"
                ? <span className="meta rounded-full border border-white/30 px-2 py-0.5 text-white">{env.state}</span>
                : <span className="meta rounded-full border border-line-2 px-2 py-0.5 text-grey">{env.state}</span>}
            </div>
            <p className={env.name === "Production" ? "mt-3 font-mono text-[0.92rem] text-white" : "mt-3 font-mono text-[0.92rem] text-ink"}>{env.env}</p>
            <p className={env.name === "Production" ? "meta mt-2 text-white/60" : "meta mt-2 text-grey"}>{env.note}</p>
          </div>
        ))}
      </div>

      {/* readiness */}
      <Panel className="mb-6" title="Release readiness" kicker={ready ? "ALL CHECKS GREEN — SEEDED BY THE SAME LEDGER AS VERIFICATION" : "BLOCKED"}>
        <ul role="list" className="flex flex-col divide-y divide-line">
          {CHECKS.map((c) => (
            <li key={c.label} className="flex items-start justify-between gap-4 py-3">
              <div className="flex items-start gap-3">
                <span aria-hidden="true" className={"meta mt-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[0.6rem] " + (c.ok ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")}>
                  {c.ok ? "✓" : "✕"}
                </span>
                <div>
                  <p className="text-[0.88rem] font-medium text-ink">{c.label}</p>
                  <p className="meta mt-0.5 text-grey">{c.note}</p>
                </div>
              </div>
              <span className="font-mono text-[0.78rem] tabular-nums text-ink">{c.value}</span>
            </li>
          ))}
        </ul>
      </Panel>

      {/* deploy action */}
      <div className="mb-6 flex flex-col items-start justify-between gap-5 rounded-md border border-line bg-paper p-6 md:flex-row md:items-center">
        <div>
          <p className="meta text-grey-2">PENDING CHANGE — NONE</p>
          <h2 className="display mt-2 text-[1.25rem] uppercase text-ink">v2.4.1 is live in all three environments.</h2>
          <p className="mt-2 max-w-[62ch] text-[0.88rem] leading-relaxed text-grey">
            Re-deploys replay the deterministic gate (12 tests, same seeds) and move traffic only after the
            typed confirmation below. History is audited — nothing about deploy state is inferred.
          </p>
          <Link href={`/app/workforce/voice-sales/versions`} className="meta link-underline mt-3 inline-block text-ink">VERSION HISTORY →</Link>
        </div>
        <button
          onClick={() => { setConfirmOpen(true); setTyped(""); }}
          className="meta shrink-0 rounded-sm bg-ink px-5 py-3.5 text-paper transition-all duration-200 ease-brand hover:-translate-y-px hover:shadow-lift"
        >
          Deploy v2.4.1 → Production
        </button>
      </div>

      {phase !== "idle" ? (
        <div className={"rounded-sm border px-4 py-3 " + (phase === "done" ? "border-emerald-200 bg-emerald-50" : "border-blue/25 bg-blue-tint")}>
          <p className={"meta " + (phase === "done" ? "text-emerald-800" : "text-blue-deep")}>
            {phase === "queued" ? "DEPLOY REQUESTED — REPLAYING GATE · TYPED SIGNATURE CAPTURED" : "✓ DEPLOYED — GATE REPLAYED 12/12 · AUDIT ENTRY WRITTEN · SIGNATURE: SARE"
            }
          </p>
        </div>
      ) : null}

      {/* audit */}
      <Panel title="Deployment audit" kicker="WRITE-ONCE LOG">
        <ol className="relative flex flex-col">
          <span aria-hidden="true" className="absolute bottom-3 left-[7px] top-3 w-px bg-line-2" />
          {[
            { at: "Oct 21 · 09:41", who: "Naga Charan", text: "v2.4.1 deployed to production after gate EV-0087 (94/100). Rollback target archived." },
            { at: "Oct 21 · 09:12", who: "Verify bot", text: "Release gate EV-0087 passed — 112 pass · 2 fail · 6 warning, score inside threshold." },
            { at: "Oct 14 · 16:20", who: "Naga Charan", text: "v2.4.0 promoted to sandbox — objection handbook v3 attached to knowledge." },
            { at: "Sep 27 · 11:03", who: "Verify bot", text: "v2.2.0 verification completed — 12/12 tests executed on sandbox." },
          ].map((a, i) => (
            <li key={i} className="relative flex flex-col gap-1 py-2.5 pl-8">
              <span aria-hidden="true" className={"absolute left-0 top-3.5 h-[15px] w-[15px] rounded-full border-[1.5px] bg-paper " + (i === 0 ? "border-blue-deep" : "border-line-2")} />
              <div className="meta flex items-baseline justify-between gap-3">
                <span className="text-ink">{a.who}</span>
                <span className="font-mono text-grey-2">{a.at}</span>
              </div>
              <p className="text-[0.86rem] text-grey">{a.text}</p>
            </li>
          ))}
        </ol>
      </Panel>

      {/* typed confirm modal */}
      {confirmOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Confirm production deploy">
          <button aria-label="Close" className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]" onClick={() => setConfirmOpen(false)} />
          <div className="relative w-full max-w-md rounded-md border border-line bg-paper p-6 shadow-elevated">
            <p className="meta text-grey-2">CONFIRM PRODUCTION DEPLOY</p>
            <h3 className="display mt-2 text-[1.2rem] uppercase text-ink">Move v2.4.1 into live calling?</h3>
            <p className="mt-3 text-[0.88rem] leading-relaxed text-grey">
              The gate replays deterministically; sandbox and test mirror first. This affects {TESTS.length} guarded behaviours
              and ₹1.5L/month of spend authority that is already signed.
            </p>
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder='Type "DEPLOY" to confirm'
              aria-label="Type DEPLOY to confirm"
              className="field mt-4 w-full"
            />
            <div className="mt-5 flex justify-end gap-2.5">
              <button onClick={() => setConfirmOpen(false)} className="meta rounded-sm border border-line-2 px-4 py-2.5 text-grey transition-colors hover:border-ink hover:text-ink">Cancel</button>
              <button
                onClick={deploy}
                disabled={typed !== "DEPLOY"}
                className={"meta rounded-sm px-4 py-2.5 transition-all " + (typed === "DEPLOY"
                  ? "bg-ink text-paper hover:-translate-y-px hover:shadow-lift"
                  : "cursor-not-allowed bg-paper-3 text-grey-2")}
              >
                Confirm deploy
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
